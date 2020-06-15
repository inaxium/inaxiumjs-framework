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

import { INPUT } from "./const.js";

export default class Listener {
  constructor() {
    this.key();
  }

  key() {
    document.addEventListener(INPUT, (e) => {
      const target = e.target,
        adi = target.adi;

      if (adi.has.field && adi.ds) {
        adi.handleSignal = false;

        adi.ds.get(adi.ds.selected)[adi.field] = target.value;

        adi.handleSignal = true;
      }
    });
  }
}
