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
import { DATA_FIELD_CHANGED, LANGUAGE_CHANGED } from "./const.js";
import Signal from "./signal.js";
import Loader from "./loader.js";

const INAXIUM_JS = "inaxiumJS",
  APP = "app",
  LOAD_HTML = "load_html",
  ITER = "rendering_iter",
  CONFIG_FILE = "config_file",
  DOC_TO_DS = "doc_to_ds",
  LANG = "lang";

export default class Dit {
  static entry(ou) {
    let signal = new Signal();

    if (!ou) {
      throw `DIT Entry point could not be found.`;
    }

    for (const [, value] of Object.entries(ou)) {
      signal.emit(LOAD_HTML, {
        target: value.target,
        url: value.url,
      });
    }
  }

  ptr(value) {
    if (!value) {
      throw "No value given";
    }
    let ditArray = value.split("."),
      start = ds.dit.get(ditArray[0]);

    ditArray.shift();

    try {
      return ditArray
        .join(".")
        .split(".")
        .reduce((o, i) => o[i], start);
    } catch (e) {
      console.log(
        `Path: ${value} could not be find in dit.
             Example: public.dashboard.show =>   "public": {
                                                   "dashboard": {
                                                     "show": {
                                                       "click": {
                                                         "emit1": {},
                                                         "emit2": {}
                                                       }
                                                     }
                                                   }`
      );
      return undefined;
    }
  }
}

export class ConfigLoader {
  constructor() {
    this.init && this.init.call(this);
  }
  async bootstrap() {
    return new Promise(function (resolve, reject) {
      Loader.json(INAXIUM_JS)
        .then((data) => {
          if (data.status === 200) {
            Loader.json(data.body[CONFIG_FILE])
              .then((data) => {
                try {
                  let dit = data.body;

                  const parse = () => {
                    return JSON.parse(
                      Handlebars.compile(JSON.stringify(dit))(dit)
                    );
                  };

                  parse();
                  for (let i = 0; i < dit[APP][ITER]; i++) {
                    dit = parse();
                  }

                  for (const [key, value] of Object.entries(dit)) {
                    if (key === "lang") {
                      ds.dit.set(
                        key,
                        new Proxy(
                          {},
                          {
                            set(target, key, value) {
                              if (key === "current") {
                                const signal = new Signal(this);

                                if (ds.dit.get(LANG).current) {
                                  InaxiumJS.recentlyLang = ds.dit.get(
                                    LANG
                                  ).current;
                                }

                                target[key] = value;

                                signal.emit(LANGUAGE_CHANGED, key, {
                                  field: key,
                                  value: value,
                                });
                              } else {
                                target[key] = value;
                              }

                              return true;
                            },
                          }
                        )
                      );

                      for (const [k, v] of Object.entries(value)) {
                        ds.dit.get(LANG)[k] = value[k];
                      }
                    } else {
                      ds.dit.set(key, value);
                    }
                  }
                } catch (e) {
                  throw e;
                }
              })
              .catch((err) => {
                reject(err);
              })
              .finally(() => {
                resolve(true);
              });
          }
        })
        .catch((err) => {
          throw err;
        })
        .finally(() => {});
    });
  }

  async doc() {
    return new Promise(function (resolve, reject) {
      Loader.json(INAXIUM_JS)
        .then((data) => {
          if (data.status === 200) {
            if (data.body[DOC_TO_DS]) {
              Loader.json(data.body[DOC_TO_DS])
                .then((data) => {
                  try {
                    let doc = data.body;

                    for (const [key, value] of Object.entries(doc)) {
                      ds.doc.set(key, value);
                    }
                  } catch (e) {
                    throw e;
                  }
                })
                .catch((err) => {
                  reject(err);
                })
                .finally(() => {
                  resolve(true);
                });
            }
          }
        })
        .catch((err) => {
          throw err;
        });
    });
  }
}
