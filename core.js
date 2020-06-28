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
  UI_SELECTION_CHANGED,
  REMOVE_YOURSELF_BY_ID,
  REFRESH,
  INSERTED,
  REMOVED,
  APP,
  REMOVE_YOURSELF_BY_RID,
} from "./const.js";

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
          child.adi.id = replica.adi.id;
          child.adi.field = child.getAttribute("field");
          child.adi.data = row[child.adi.field];
          child.adi.ds = replica.adi.ds;
          child.adi.has.replica = true;
          child.adi.replica = replica;
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
