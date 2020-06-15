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
  NONE,
  SELECTION_CHANGED,
  EMIT,
  REFRESH,
  TRUNCATE,
  TRUNCATED,
  INSERTED,
  REMOVED,
  DATA_FIELD_CHANGED,
  DS_MODE_CHANGED,
  EDIT,
} from "./const.js";
import Signal from "./signal.js";

export default class DataStorage {
  addStore(name) {
    Object.defineProperty(ds, name, {
      value: new DataStorageManager(name),
      writable: false,
      enumerable: false,
      configurable: false,
    });

    return this;
  }

  finish() {
    try {
      for (const [key, value] of ds.dit) {
        if (value.ds && value.ds.ptr) {
          ds.dit.get(key).ds.ptr = ds[value.ds.name];
        }

        ds.dit.set(key, value);
      }
      return this;
    } catch (e) {
      throw e;
    }
  }
}

class DataStorageManager extends Map {
  #signal = new Signal(this);
  #selected;
  #name;
  #mode = NONE;
  #modeChange = () => {
    this.signal.on(DATA_FIELD_CHANGED, this.name, () => {
      if (this.mode !== EDIT) {
        this.mode = EDIT;
      }
    });
  };

  constructor(name) {
    super();
    this.#name = name;
    this.#modeChange();
  }

  set selected(value) {
    if (value === 0) {
      this.#selected = undefined;
      return;
    }
    if (this.has(value)) {
      this.#selected = value;
      this.#signal.emit(SELECTION_CHANGED, this.#name, { id: this.selected });
    } else {
      throw `Given ID => ${value} doesn't exist`;
    }
  }

  truncate(props) {
    this.clear();

    if (!props || (props.has(EMIT) && props.get(EMIT))) {
      this.#signal.emit(TRUNCATED, this.name, { name: this.name });
    }
  }

  insert(props) {
    if (!props || !(props instanceof Map)) {
      throw `props must be ${!props ? "given" : "an map"}`;
    }

    if (props.has(DATA) && props.get(DATA).length > 0) {
      if (
        !props.has(TRUNCATE) ||
        (props.has(TRUNCATE) && props.get(TRUNCATE))
      ) {
        this.clear();
      }

      for (const row of props.get(DATA)) {
        const proxy = new Proxy(row, {
          set(target, key, value) {
            if (key === "meta") {
              this.meta = value;
            } else {
              target[key] = value;

              const meta = this.meta;
              this.meta.signal.emit(DATA_FIELD_CHANGED, meta.storageName, {
                id: meta.id,
                ds: ds[meta.storageName],
                field: key,
                value: value,
              });
            }
            return true;
          },
        });

        proxy.meta = {
          id: row.id,
          storageName: this.name,
          signal: this.signal,
        };

        this.set(row.id, proxy);
      }

      const [key, firstRow] = this.entries().next().value;

      if (props.has(TRUNCATE) && props.get(TRUNCATE)) {
        this.selected = key;
      } else {
        if (props.get(DATA).length > 1) {
          this.selected = key;
        } else {
          this.selected = props.get(DATA)[0].id;
        }
      }

      if (!props.has(EMIT) || props.get(EMIT)) {
        this.signal.emit(INSERTED, this.name, firstRow);
      }
    }
  }

  update(props) {}

  remove(props) {
    if (!props || !(props instanceof Map)) {
      throw EvalError(`props must be ${!props ? "given" : "an map"}`);
    }

    if (!props.has(EMIT) || props.get(EMIT)) {
      this.signal.emit(REMOVED, this.name, props.get(DATA));
    }

    let prev;
    for (const item of this.values()) {
      if (props.get(DATA).id === item.id) {
        break;
      }
      prev = item.id;
    }

    this.delete(props.get(DATA).id);

    if (prev || this.values().next().value) {
      this.selected = prev ? prev : this.values().next().value.id;
    } else {
      this.selected = 0;
    }
  }

  refresh() {
    this.#signal.emit(REFRESH, this.name, {});
  }

  disconnect() {
    this.clean(this);
  }

  get selected() {
    return this.#selected;
  }

  get signal() {
    return this.#signal;
  }

  get name() {
    return this.#name;
  }

  get mode() {
    return this.#mode;
  }

  set mode(value) {
    this.#mode = value;
    this.signal.emit(DS_MODE_CHANGED, this.name, { mode: this.#mode });
  }
}
