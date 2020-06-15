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

import { CLICK } from "./const.js";

const OU = "signal",
  FUNCTION = "fn",
  DIT = "dit";

export default class Signal {
  #caller;

  #validateOn = (args) => {
    let fn, constraint;
    if (!args) throw "No Arguments not allowed";
    if (args.length > 2)
      throw "Too much Arguments. on(key, constraint, function)";

    for (const arg of args) {
      if (typeof arg === "function") fn = arg;
      else constraint = arg;
    }

    return { constraint: constraint, fn: fn };
  };

  #validateEmit = (args) => {
    let data, constraint;
    if (!args) throw "No Arguments not allowed";
    if (args.length > 2) throw "Too much Arguments. on(key, constraint, data)";

    if (args.length === 1) {
      return { constraint: undefined, data: args[0] };
    } else if (args.length === 2) {
      return { constraint: args[0], data: args[1] };
    }
  };

  constructor(caller) {
    this.#caller = caller;
    return this;
  }

  on(key, ...args) {
    const resp = this.#validateOn(args);

    ds.signals.add({
      caller: this.#caller,
      key: key,
      constraint: resp.constraint,
      fn: resp.fn,
      one: false,
    });
  }

  one(key, ...args) {
    const resp = this.#validateOn(args);

    ds.signals.add({
      caller: this.#caller,
      key: key,
      constraint: resp.constraint,
      fn: resp.fn,
      one: true,
    });
  }

  off(key, constraint) {
    for (const signal of ds.signals) {
      if (signal.key === key && signal.constraint === constraint) {
        ds.signals.delete(signal);
      }
    }
  }

  emit(key, ...args) {
    const resp = this.#validateEmit(args);
    let result = new Set();

    for (const signal of ds.signals) {
      if (signal.key === key) {
        if (!signal.constraint) {
          result.add(signal);
        } else {
          if (signal.constraint === resp.constraint) {
            result.add(signal);
          }
        }
      }
    }

    for (const item of result) {
      if (item.fn) {
        item.fn.call(item.caller, resp.data);
      } else {
        throw `No function given. Caller: ${item.caller.constructor.name}, Key: ${item.key}, Constraint: ${item.constraint}. Solution: Check DIT`;
      }
    }
  }

  clean() {
    for (const signal of ds.signals) {
      if (signal.caller === this.#caller) {
        ds.signals.delete(signal);
      }
    }
  }
}

export class SignalStorage extends Set {
  #debug = new Debug();

  constructor() {
    super();
  }

  print(filter) {
    for (const signal of this) {
      if (filter && filter.key && signal.key === filter.key) {
        console.log(
          `Caller: ${
            signal.caller.constructor.name
          }, Key: ${signal.key.toString()}, Constraint: ${
            signal.constraint ? signal.constraint.toString() : "Empty"
          }`
        );
      } else {
        console.log(
          `Caller: ${
            signal.caller.constructor.name
          }, Key: ${signal.key.toString()}, Constraint: ${
            signal.constraint ? signal.constraint.toString() : "Empty"
          }`
        );
      }
    }
  }

  get debug() {
    return this.#debug;
  }

  set debug(value) {
    this.#debug = value;
  }
}

export class SignalEvaluation {
  #signal = new Signal(this);
  #ou = new Set();

  start() {
    signalEvaluation(this);
  }

  get signal() {
    return this.#signal;
  }

  get ou() {
    return this.#ou;
  }
}

export function signalEvaluation(caller) {
  if (!caller.ou && !caller.adi.ou) return;

  for (const item of caller.ou ? caller.ou : caller.adi.ou) {
    const start = item.ptr ? item.ptr : InaxiumJS.dit.ptr(item.path);

    if (start.on) {
      for (const [key, value] of Object.entries(start.on)) {
        caller.signal.on(value.key, value.constraint, caller[value.fn]);
      }
    }

    if (start.click) {
      caller.addEventListener(CLICK, (e) => {
        const ou = e.currentTarget.adi.ou.values().next().value.ptr.click,
          data = { nodes: {}, ds: {} };

        if (ou) {
          for (const [key, value] of Object.entries(ou)) {
            if (value.data) {
              if (value.data.nodes) {
                for (const [key, path] of Object.entries(value.data.nodes)) {
                  data.nodes[key] = InaxiumJS.dit.ptr(path);
                }
              }

              if (value.data.ds) {
                for (const [outerKey, outerValue] of Object.entries(
                  value.data.ds
                )) {
                  for (const [innerKey, innerValue] of Object.entries(
                    outerValue
                  )) {
                    data.ds[outerKey] = ds[innerKey].get(innerValue);
                  }
                }
              }
            }

            e.currentTarget.adi.signal.emit(value.key, value.constraint, data);
          }
        }
      });
    }
  }
}
