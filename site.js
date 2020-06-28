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

import { ID, NEW, OU, PAYLOAD, SIGNAL, URL } from "./const.js";
import Signal, { SignalEvaluation } from "./signal.js";
import { restPost } from "./rest.js";
import Dit from "./dit.js";

const SITE = "site",
  NODES = "nodes";

export default class Site extends SignalEvaluation {
  #props;
  #pointer;

  constructor(props) {
    super();

    this.#props = props;
    this.#pointer = ds.dit.get(props.get(OU));

    this.ou.add({ path: props.get(OU), ptr: ds.dit.get(props.get(OU)) });
    this.ou.add({ path: SITE, ptr: ds.dit.get(SITE) });

    this.prepare();

    this.init && this.init.call(this, this.props);
  }

  prepare() {
    const url = this.pointer.rest.url;

    InaxiumJS.scripts.set(this.props.get(ID), this);

    this.props.set(SIGNAL, this.signal);
    this.props.set(URL, url.equal ? url.any : url.get);

    this.start();
  }

  saveRow() {
    const dsPtr = ds.dit.get(this.props.get(OU)).ds.ptr;

    if (dsPtr.mode === NEW && this.newRow) {
      this.newRow.call(this, this.props);
    } else {
      // Check is Date and Transform to String
      const row = {};
      for (let [key, value] of Object.entries(dsPtr.get(dsPtr.selected))) {
        if (typeof value === "object" && value.isDate) {
          row[key] = value.dateTime;
        } else {
          row[key] = value;
        }
      }
      this.props.set(PAYLOAD, row);
    }

    restPost(this.props);
  }

  showList() {
    Dit.entry(this.ou.values().next().value.ptr.list.entry);
  }

  disconnect() {
    this.signal.clean();
  }

  get props() {
    return this.#props;
  }

  get pointer() {
    return this.#pointer;
  }
}
