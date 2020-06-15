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

import { VALUE, INNER } from "./const.js";

export default class Type {}

Type.Html = class {};
Type.Html.Is = class {
  static value(value) {
    for (let el of VALUE) {
      if (value instanceof el) {
        return true;
      }
    }

    return false;
  }

  static inner(value) {
    for (let el of INNER) {
      if (value instanceof el) {
        return true;
      }
    }

    return false;
  }
};
Type.Is = class {
  static obj(value) {
    return value instanceof Object;
  }

  static str(value) {
    return typeof value === "string";
  }

  static num(value) {
    return typeof value === "number";
  }

  static map(value) {
    return value instanceof Map;
  }
};
