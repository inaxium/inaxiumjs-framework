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

import Scripts from "./scripts.js";
import Signal from "./signal.js";
import { attachLoader } from "./loader.js";
import DataStorage from "./ds.js";
import Listener from "./listener.js";
import Dit from "./dit.js";

const DIT = "dit",
  SCRIPTS = "scripts",
  SIGNALS = "signals",
  CLP = "clp",
  LANG = "lang",
  DOC = "doc";

export default class Bootstrap {
  #signal = new Signal(this);

  constructor() {
    this.initInfrastructure();
    this.initDataStorage();
    this.initObjects();
    this.initMisc();
    attachLoader(this.#signal);
  }

  initInfrastructure() {
    Object.defineProperty(globalThis, "InaxiumJS", {
      value: {},
      writable: false,
      enumerable: false,
      configurable: false,
    });

    Object.defineProperty(InaxiumJS, "listener", {
      value: new Listener(),
      writable: false,
      enumerable: false,
      configurable: false,
    });

    Object.defineProperty(InaxiumJS, "dit", {
      value: new Dit(),
      writable: false,
      enumerable: false,
      configurable: false,
    });

    Object.defineProperty(globalThis, "ds", {
      value: new DataStorage(),
      writable: false,
      enumerable: false,
      configurable: false,
    });

    Object.defineProperty(ds, SIGNALS, {
      value: new Set(),
      writable: false,
      enumerable: false,
      configurable: false,
    });

    Object.defineProperty(InaxiumJS, SCRIPTS, {
      value: new Scripts(),
      writable: false,
      enumerable: false,
      configurable: false,
    });
  }

  initDataStorage() {
    /*
     *    Signals could be a Set because no Key needed.
     */

    new DataStorage().addStore(DIT).addStore(CLP).addStore(LANG).addStore(DOC);
  }

  initObjects() {
    Object.defineProperty(InaxiumJS, "rest", {
      value: {},
      enumerable: false,
      configurable: false,
    });

    Object.defineProperty(InaxiumJS["rest"], "url", {
      set: (value) => {
        this._x_url = value;
      },
      get: () => {
        return this._x_url ? this._x_url : "";
      },
      enumerable: false,
      configurable: false,
    });
  }

  initMisc() {
    Object.defineProperty(InaxiumJS, "uid", {
      get: () => {
        return Math.random().toString(36).substr(2, 9);
      },
      enumerable: false,
      configurable: false,
    });

    Object.defineProperty(InaxiumJS, "recentlyLang", {
      value: navigator.language.substring(0, 2),
      enumerable: false,
      configurable: false,
      writable: true,
    });
  }

  static run() {
    if (!window.InaxiumJS) {
      new Bootstrap();
    }
  }
}
