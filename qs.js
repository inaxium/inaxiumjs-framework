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

export default class Qs {
  static one(value) {
    return document.querySelector(value);
  }

  static field(value, el) {
    let response;
    if (el) {
      response = el.querySelector(`[field="${value}"]`);
    } else {
      response = document.querySelector(`[field="${value}"]`);
    }

    if (response) {
      return response;
    }

    throw new EvalError(`field="${value}", could not be found`);
  }

  static date(value, el) {
    if (el) return el.querySelector(`[x-date="${value}"]`);
    else return document.querySelector(`[x-date="${value}"]`);
  }

  static name(value) {
    return document.querySelector(`[x-name="${value}"]`);
  }

  static source(value) {
    return document.querySelector(`[x-source="${value}"]`);
  }

  static allSources(value) {
    return document.querySelectorAll(`[x-source]`);
  }

  static all(value) {
    return document.querySelectorAll(value);
  }

  static target(value) {
    return document.querySelector(`[x-target="${value}"]`);
  }

  static move(value) {
    return document.querySelector(`[x-move="${value}"]`);
  }

  static copy(value) {
    return document.querySelector(`[x-copy="${value}"]`);
  }
}
