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
  UI_SELECTION_CHANGED,
  REMOVE_YOURSELF_BY_ID,
  INNER,
  VALUE,
  CHECKBOX,
  REFRESH,
  INSERTED,
  REMOVED,
  APP,
  REMOVE_YOURSELF_BY_RID,
} from "./const.js";
import Attribute, { Module } from "./attribute.js";
import Utils from "./utils.js";

export default class Core {}

export function prepareReplicator(el) {
  /*
   *  Find all Child Element and give them Some Information
   */

  for (const c of [INSERTED, REFRESH]) {
    el.adi.signal.on(c, el.adi.ds.name, (data) => {
      processing({ type: c, data: data });
    });
  }

  el.adi.signal.on(REMOVED, el.adi.ds.name, (data) => {
    el.adi.signal.emit(REMOVE_YOURSELF_BY_ID, data.id, {});
  });

  let processing = (data) => {
    try {
      ds.dit.get(APP).ds.last = el.adi.ds;
    } catch (e) {
      console.log(e);
    }

    if (el.adi.ds.size > 0) {
      let last = el;

      el.adi.signal.emit(REMOVE_YOURSELF_BY_RID, el.adi.rid, {});

      for (let [id, row] of el.adi.ds.entries()) {
        if (data && data.type === REMOVED && data.data.id === id) return;

        let replica = el.cloneNode(true); // constructor call

        replica.removeAttribute("x-replicator");
        replica.removeAttribute("x-rid");

        replica.adi.id = id;
        replica.adi.rid = el.adi.rid;
        replica.adi.ds = el.adi.ds;
        replica.adi.is.replica = true;
        replica.adi.has.replicator = true;
        replica.adi.replicator = el;

        replica.setAttribute("x-replica", replica.adi.rid);
        replica.setAttribute("x-id", replica.adi.id);

        // Traverse children and give data Attributes

        for (const child of replica.children) {
          //child.adi.id = replica.adi.id;
          child.adi.field = child.getAttribute("field");
          child.adi.data = row[child.adi.field];
          child.adi.ds = replica.adi.ds;
          child.adi.has.replica = true;
          child.adi.replica = replica;
          setNodeContent(child, child.adi.data);
        }

        last.after(replica);
        last = replica;

        replica.adi.signal.on(REMOVE_YOURSELF_BY_RID, replica.adi.rid, () => {
          replica.remove();
        });

        replica.adi.signal.on(REMOVE_YOURSELF_BY_ID, replica.adi.id, () => {
          replica.remove();
        });
      }

      const [id, row] = el.adi.ds.entries().next().value;
      el.adi.signal.emit(UI_SELECTION_CHANGED, el.adi.ds.name, { id: id });
    }
  };

  el.adi.ds.size > 0 && processing();
}

function setNodeContent(el, value, trigger) {
  let field = el.getAttribute("field");

  if (field.includes("@")) {
    let [s, f] = field.split("@");

    let module = new Module(s, f);

    if (!f) throw "No Function given.";

    if (!s) module = Attribute.Get.script(el, module);

    if (!module.script)
      throw "The x-dynamic-script tag could not be found in the document.";

    import(module.script)
      .then((m) => {
        if (!m[module.func]) {
          throw `The specified function => (${module.func}) could not be found in the script.`;
        } else {
          try {
            module.data = m[module.func].call(this, el, value);
            setNodeContentWithValue(module.data, el);
          } catch (err) {
            console.log(err);
          }
        }
      })
      .catch((error) => {
        throw error;
      });
  } else {
    setNodeContentWithValue(value, el);
  }
}

function setNodeContentWithValue(value, el) {
  let check_flag = true,
    cfg = InaxiumJS.config;

  if (el instanceof HTMLImageElement) {
    check_flag = false;
    el.src = value;
  }

  if (check_flag) {
    for (let comp of INNER) {
      if (el instanceof comp) {
        // Normal treatment
        if (Attribute.Has.date(el)) {
          let format = Attribute.Get.date(el);

          if (!format) {
            if (!cfg.dateFormat) {
              throw "x-date given without format string";
            } else {
              format = cfg.dateFormat;
            }
          }

          el.innerHTML = Utils.Date.fromIso(value);
          check_flag = false;
        } else if (Attribute.Has.currency(el)) {
          Utils.currency(new Map([[DATA, el]]));
        } else {
          el.innerHTML = value;
          check_flag = false;
        }

        break;
      }
    }
  }

  if (check_flag) {
    for (let comp of VALUE) {
      if (el instanceof comp) {
        if (Attribute.Has.type(el) && Attribute.Get.type(el) === CHECKBOX) {
          el.checked = value;
          check_flag = false;
          break;
        } else {
          if (Attribute.Has.date(el)) {
            el.value = Utils.Date.fromIso(value);
          } else if (Attribute.Has.currency(el)) {
            Utils.currency(new Map([[DATA, el]]));
          } else {
            el.value = value;
          }

          check_flag = false;
          break;
        }
      }
    }
  }
}
