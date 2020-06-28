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

import { OU, FILTER, ID, URL, DATA, SIGNAL } from "./const.js";
import { SignalEvaluation } from "./signal.js";
import { restDelete, restGet, restPost } from "./rest.js";
import Dit from "./dit.js";

const LIST = "list";

export default class List extends SignalEvaluation {
  #props;
  #pointer;

  constructor(props, ou) {
    super();

    this.#props = props;
    this.#pointer = ds.dit.get(props.get(OU));

    this.ou.add({ path: props.get(OU), ptr: ds.dit.get(props.get(OU)) });
    this.ou.add({ path: LIST, ptr: ds.dit.get(LIST) });

    this.prepare();

    this.init && this.init.call(this, this.props);
  }

  prepare() {
    const url = this.pointer.rest.url,
      scroll = this.pointer.list.scroll;

    InaxiumJS.scripts.set(this.props.get(ID), this);

    this.props.set(SIGNAL, this.signal);
    this.props.set(URL, url.equal ? url.any : url.get);

    window.scrollTo(scroll.x, scroll.y);

    this.start();
  }

  fetchData(data) {
    let input = data.nodes.filterValue;
    if (input) {
      this.props.set(FILTER, input.value);
      restGet(this.props);
    } else {
      throw `No nodes.filterValue.node could be found DIT`;
    }
  }

  editRow(data) {
    Dit.entry(this.ou.values().next().value.ptr.site.entry);
  }

  deleteRow() {
    const id = this.ou.values().next().value.ptr.ds.ptr.selected;
    if (id) {
      restDelete(this.props.set(DATA, { id: id }));
    }
  }

  newRow() {
    restPost(this.props);
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
