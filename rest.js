/**
 *    Copyright (C) 2017-2020  Frank von Schrenk
 *
 *    This program is free software: you can redistribute it and/or modify
 *    it under the terms of the GNU General Public License as published by
 *    the Free Software Foundation, either version 3 of the License, or
 *    (at your option) any later version.
 *
 *    This program is distributed in the hope that it will be useful,
 *    but WITHOUT ANY WARRANTY; without even the implied warranty of
 *    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *    GNU General Public License for more details.
 *
 *    You should have received a copy of the GNU General Public License
 *    along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import {
  DATA,
  DELETE,
  FILTER,
  GET,
  ID,
  INSERT,
  METHOD,
  OU,
  PAYLOAD,
  POST,
  REST,
  SELECT,
  SIGNAL,
  TRUNCATE,
  UPDATE,
  URL,
  APP,
} from "./const.js";

/*

  Rest will be inherited by DataStorageManager
  when rest Services are called over DataStorageManager
  Rest can reach this.url => InaxiumJS.rest.url + this.name.

  Also Payload can and should be used. But nevertheless
  you can call the rest Service by them self and give
  Token({value:authToken})
  Url({value:FQN})
  Payload({value:{ANY_OBJECT}})

 */
export default class Rest {
  constructor() {}

  static request(props) {
    let header = new Headers(),
      token = ds.dit.get(APP).security.token.jwt,
      url;
    header.append("Content-Type", "application/json");
    header.append("Authorization", `Bearer ${token}`);

    let requestContent = {
      method: props.get(METHOD),
      headers: header,
      mode: "cors",
      cache: "default",
      credentials: "include",
    };

    if (props.has(PAYLOAD) && props.get(METHOD) === POST) {
      requestContent.body = JSON.stringify(props.get(PAYLOAD));
    }

    switch (props.get(METHOD)) {
      case DELETE:
        url = `${props.get(URL)}/${props.get(DATA).id}`;
        break;
      case POST:
        url = `${props.get(URL)}`;
        break;
      case GET:
        url = `${`${props.get(URL)}${
          props.get(FILTER) ? "?" + props.get(FILTER) : ""
        }`}`;
        break;
    }

    return new Request(url, requestContent);
  }

  static async call(props) {
    return await fetch(Rest.request(props)).then((response) => {
      return props.get(METHOD) !== DELETE
        ? response
            .json()
            .then((data) => ({ status: response.status, body: data }))
        : response.text().then((data) => ({ status: response.status }));
    });
  }

  static async get(props) {
    props.set(METHOD, GET);
    return this.call(props);
  }

  static async post(props) {
    props.set(METHOD, POST);
    return this.call(props);
  }

  static async delete(props) {
    props.set(METHOD, DELETE);
    return this.call(props);
  }
}

export function restGet(props) {
  let response,
    signal = props.get(SIGNAL),
    dsPtr = ds.dit.get(props.get(OU)).ds.ptr;

  Rest.get(props)
    .then((resp) => {
      response = resp;

      if (resp.status >= 200 && resp.status < 300) {
        dsPtr.insert(props.set(DATA, resp.body));
      }
    })
    .catch((err) => {
      throw err;
    })
    .finally(() => {
      signal.emit(REST, GET, {
        method: GET,
        type: SELECT,
        status: response.status,
        body: response.body,
      });
    });
}

export function restPost(props) {
  const signal = props.get(SIGNAL),
    dsPtr = ds.dit.get(props.get(OU)).ds.ptr;
  let response;

  Rest.post(props)
    .then((resp) => {
      response = resp;

      if (resp.status >= 200 && resp.status < 300) {
        if (props.get(PAYLOAD).id) {
          dsPtr.update(
            new Map([
              [ID, resp.body.id],
              [DATA, new Array(resp.body)],
            ])
          );
        } else {
          dsPtr.insert(
            new Map([
              [TRUNCATE, false],
              [DATA, new Array(resp.body)],
            ])
          );
        }
      }
    })
    .catch((err) => {
      throw err;
    })
    .finally((resp) => {
      signal.emit(REST, POST, {
        method: POST,
        type: props.get(PAYLOAD).id ? UPDATE : INSERT,
        status: response.status,
        body: response.body,
      });
    });
}

export function restDelete(props) {
  const signal = props.get(SIGNAL),
    dsPtr = ds.dit.get(props.get(OU)).ds.ptr;
  let response;

  Rest.delete(props)
    .then((resp) => {
      response = resp;

      if (resp.status >= 200 && resp.status < 300) {
        dsPtr.remove(new Map([[DATA, { id: props.get(DATA).id }]]));
      }
    })
    .catch((err) => {
      throw err;
    })
    .finally((resp) => {
      signal.emit(REST, DELETE, {
        method: DELETE,
        type: DELETE,
        status: response.status,
        body: undefined,
      });
    });
}
