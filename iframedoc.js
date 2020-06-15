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

import Signal from "./signal.js";
import { DOC_CHANGED } from "./const.js";

const LANG = "lang";

export default class IframeDoc extends HTMLIFrameElement {
  #signal = new Signal(this);

  constructor() {
    super();
  }

  connectedCallback() {
    if (!this.id) {
      throw `id must be set`;
    }

    let lang, doc;

    const url = () => {
      lang = ds.dit.get(LANG).current;
      doc = ds.doc.get(this.id);

      return doc[lang].url;
    };

    this.width = "100%";
    this.height = "100%";

    this.src = url();

    this.signal.on(DOC_CHANGED, (data) => {
      lang = ds.dit.get(LANG).current;
      this.src = doc[lang].url;
    });
  }

  disconnectedCallback() {
    this.signal.clean();
  }

  get signal() {
    return this.#signal;
  }
}
