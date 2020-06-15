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

import { DATA, EMIT, LANGUAGE_CHANGED, URL, EN, DE, US, GB } from "./const.js";
import Signal from "./signal.js";
import Attribute from "./attribute.js";
import Rest from "./rest.js";
import { XLang } from "./dom.js";

const LANG = "lang";

export default class Lang {
  #signal = new Signal(this);
  notNative(el) {
    const list = [
      HTMLLabelElement,
      HTMLButtonElement,
      HTMLAnchorElement,
      //HTMLInputElement,
      XLang,
    ];
    for (const item of list) {
      if (el instanceof item) return false;
    }

    return true;
  }

  addLangFeature(el) {
    if (!el) throw "no HTMLElement was given";

    const proc = (el, data) => {
      if (Attribute.Has.Not.lang(el) && this.notNative(el)) return;
      if (Attribute.Has.Not.lang(el) && el.innerText === "") return;

      if (!data) data = {};

      const currentLang = !ds.dit.get(LANG).current
        ? navigator.language.substring(0, 2)
        : ds.dit.get(LANG).current;
      if (!data.old) data.old = InaxiumJS.recentlyLang;
      if (!data.new) data.new = currentLang;

      const hasLang = () => {
        const id =
          el instanceof XLang
            ? el.id
              ? Number.parseInt(el.id)
              : undefined
            : Attribute.Get.lang(el);
        if (id) {
          if (id === 0) return;

          let row = ds[LANG].get(id);
          if (row) {
            if (el instanceof HTMLButtonElement) {
              el.value = el.innerHTML = row[data.new];
            } else if (
              el instanceof HTMLInputElement &&
              Attribute.Has.placeholder(el)
            ) {
              Attribute.Set.placeholder(el, row[data.new]);
            } else {
              el.innerHTML = row[data.new];
            }
          } else {
            console.log(`No Translation found for id => ${id}`);
          }
        }
      };

      const noLang = () => {
        let match;
        for (const [key, row] of ds[LANG]) {
          if (row[data.old] === el.innerText) {
            match = row;
            break;
          }
        }

        if (match) {
          if (Attribute.Has.placeholder(el)) {
            Attribute.Set.placeholder(el, match[data.new]);
          } else {
            if (el instanceof HTMLButtonElement) {
              el.value = el.innerHTML = match[data.new];
            } else if (
              el instanceof HTMLInputElement &&
              Attribute.Has.placeholder(el)
            ) {
              Attribute.Set.placeholder(el, match[data.new]);
            } else {
              el.innerHTML = match[data.new];
            }
          }
        } else {
          console.log(
            `No Translation found for ${
              Attribute.Has.placeholder(el)
                ? Attribute.Get.placeholder(el)
                : el.innerText
            }`
          );
        }
      };

      if (Attribute.Has.lang(el) || el instanceof XLang) {
        const id =
          el instanceof XLang
            ? el.id
              ? Number.parseInt(el.id)
              : undefined
            : Attribute.Get.lang(el);

        id ? hasLang() : noLang();
      } else {
        noLang();
      }
    };

    proc(el);

    this.#signal.on(LANGUAGE_CHANGED, (data) => {
      proc(el, data);
    });
  }

  static read(init) {
    Rest.get(new Map([[URL, "/lang"]]))
      .then((resp) => {
        ds[LANG].insert(
          new Map([
            [DATA, resp.body],
            [EMIT, false],
          ])
        );
      })
      .finally(() => {});
  }

  static line(id) {
    if (!ds.dit.get(LANG).current)
      throw "No language found in => ds.dit.get(LANG).current";

    return ds[LANG].get(id)[ds.dit.get(LANG).current];
  }

  clean() {
    this.#signal.clean();
  }
}
