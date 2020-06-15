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

import Qs from "./qs.js";
import { HTML_LOADED, LOAD_HTML } from "./const.js";

export default class Loader {
  constructor() {}

  static async html(...parameters) {
    let url = undefined,
      target = undefined;

    for (let parameter of parameters) {
      if (!url) {
        url = parameter;
      } else {
        target = parameter;
      }
    }

    let headers = new Headers();
    headers.append("Content-Type", "text/html; charset=utf-8");

    let request = new Request(`${url}.html`, {
      headers: headers,
      mode: "cors",
      cache: "default",
      credentials: "include",
    });

    const response = await fetch(request);
    await response.text().then((data) => {
      try {
        Qs.name(target).innerHTML = data;
      } catch (e) {
        throw e;
      }
    });
  }

  static async json(url) {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");

    let request = new Request(`${url}.json`, {
      headers: headers,
      mode: "cors",
      cache: "default",
      credentials: "include",
    });

    return await fetch(request).then((response) => {
      return response
        .json()
        .then((data) => ({ status: response.status, body: data }));
    });
  }
}

export function attachLoader(signal) {
  signal.on(LOAD_HTML, (data) => {
    if (data.url && data.target) {
      Loader.html(data.url, data.target).then(() => {
        signal.emit(HTML_LOADED, data.url, {
          target: data.target,
          url: data.url,
        });
      });
    }
  });
}
