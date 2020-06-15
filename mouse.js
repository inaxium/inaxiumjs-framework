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

import { CLICK, CLICKED } from "./const.js";

export default function addClickFeature(node) {
  node.addEventListener(CLICK, (e) => {
    let ct = e.currentTarget,
      adi = ct.adi;

    let arr = adi.click.value.split(".");

    if (arr.length === 0) {
      adi.signal.emit(CLICK, {
        adi: adi,
      });
    } else if (arr.length === 1) {
      adi.signal.emit(CLICK, arr[0], {
        adi: adi,
      });
    } else if (arr.length === 2) {
      adi.signal.emit(arr[0], arr[1], {
        adi: adi,
      });
    }

    adi.signal.emit(arr[0], `${arr[1]}.${CLICKED}`, { adi: adi });
  });
}
