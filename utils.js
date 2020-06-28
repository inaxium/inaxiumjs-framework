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

import Attribute from "./attribute.js";
import {
  DATA,
  VALUE,
  EMPTY,
  CURRENCY_VALUES,
  DATEFMT,
  FIELD,
} from "./const.js";
import Qs from "./qs.js";
import Type from "./type.js";
import DateTime from "./luxon.js";

export const GET = Symbol("get"),
  SET = Symbol("set");

export default class Utils {
  constructor() {}

  static set focus(data) {
    Qs.field(data).focus();
  }

  static get uid() {
    return Math.random().toString(36).substr(2, 9);
  }

  static getDateFormat(el) {
    let format = Attribute.Get.date(el);

    if (!format) {
      if (!InaxiumJS.config.dateFormat) {
        throw "x-date given without format string";
      } else {
        format = InaxiumJS.config.dateFormat;
      }
    }

    return format;
  }

  static getCurrencyFormat(el) {
    ///!!!!???
    let format = Attribute.Get.currency(el);

    if (format) {
      if (!InaxiumJS.config.dateFormat) {
        throw "x-date given without format string";
      } else {
        format = InaxiumJS.config.dateFormat;
      }
    }

    return format;
  }

  static typeCheck(obj) {
    let pot = {};

    for (let [k, v] of Object.entries(obj)) {
      if (isNaN(Number(v))) {
        pot[k] = v;
      } else {
        pot[k] = parseFloat(v);
      }
    }

    return pot;
  }

  static isEmpty(obj) {
    let refund = false;

    if (obj instanceof Object) if (Object.keys(obj).length !== 0) refund = true;

    return refund;
  }

  static camelize(value) {
    return value
      .replace(/\.?([A-Z]+)/g, function (x, y) {
        return "_" + y.toLowerCase();
      })
      .replace(/^_/, "");
  }

  static dotize(value) {
    return value
      .replace(/\.?([A-Z]+)/g, function (x, y) {
        return "." + y.toLowerCase();
      })
      .replace(/^_/, "");
  }

  static capitalize(str) {
    str = str.split(" ");

    for (var i = 0, x = str.length; i < x; i++) {
      str[i] = str[i][0].toUpperCase() + str[i].substr(1);
    }

    return str.join(" ");
  }

  static currency(props) {
    if (!props) {
      log.error(
        "props maps must be given => new Map([[DATA, HTMLElement|Object|Number|String]]) or currency(1000|'1000')"
      );
    }

    const currencyValues =
        props instanceof Map
          ? props.has(CURRENCY_VALUES)
            ? props.get(CURRENCY_VALUES)
            : InaxiumJS.config.currencyValues
          : InaxiumJS.config.currencyValues,
      formatter = (origin) => {
        return new Intl.NumberFormat(currencyValues.locals, {
          style: currencyValues.style,
          currency: currencyValues.currency,
        }).format(origin);
      };

    const obj = props instanceof Map ? props.get(DATA) : props;
    if (Type.Html.Is.value(obj)) {
      const val = obj.value,
        formatted = formatter(val);
      obj.value = formatted;
      return formatted;
    } else if (Type.Is.obj(obj)) {
      const val =
          obj[
            props.has(FIELD)
              ? props.get(FIELD)
              : Object.getOwnPropertyNames(obj)[0]
          ],
        formatted = formatter(val);
      obj[
        props.has(FIELD) ? props.get(FIELD) : Object.getOwnPropertyNames(obj)[0]
      ] = formatted;
      return formatted;
    } else if (Type.Is.num(obj)) {
      return formatter(obj);
    } else if (Type.Is.str(obj)) {
      return formatter(Number.parseFloat(obj));
    }
  }

  static tpl(tplStr, tplVar) {
    return tplStr.replace(/\${(.*?)}/g, (_, g) => tplVar[g]);
  }
}

export class ID {
  constructor(value) {
    this.value = value;
  }
}

export class Source {
  constructor(value) {
    this.value = value;
  }
}

export class Url {
  constructor(value) {
    this.value = value;
  }
}

export class Filter {
  constructor(value) {
    this.value = value;
  }
}

export class FormSwitch {
  constructor(value) {
    this.value = value;
  }
}

// Mo = Method of Operation
export class RestMo {
  constructor(value) {
    this.value = value;
  }
}

export class Payload {
  constructor(value) {
    this.value = value;
  }
}

export class AuthToken {
  constructor(value) {
    this.value = value;
  }
}

export class Collection {
  constructor(value) {
    this.value = value;
  }
}

export class Scope {
  constructor(value) {
    this.value = value;
  }
}

export class Credentials {
  user;
  company;
  token;
  constructor(value) {
    this.user = value && value.user ? value.user : undefined;
    this.company = value && value.company ? this.company : undefined;
    this.guest = value && value.guest ? this.guest : undefined;
    this.token = value && value.token ? this.token : undefined;
  }
}

Utils.Date = class {
  static fromIso(props) {
    if (!props) {
      log.error(
        `props maps must be given => new Map([[DATA, HTMLElement|Object|String], [DATEFMT,"your format"]) or fromIso("2012-04-23T18:25:43.511Z")`
      );
    }

    const obj = props instanceof Map ? props.get(DATA) : props,
      fmt =
        props instanceof Map && props.has(DATEFMT)
          ? props.get(DATEFMT)
          : InaxiumJS.config.dateFormat;
    let response;

    if (Type.Html.Is.value(obj)) {
      response = DateTime.fromISO(obj.value).toFormat(fmt);
      obj.value = response;
    } else if (Type.Html.Is.inner(obj)) {
      response = DateTime.fromISO(obj.innerHTML).toFormat(fmt);
      obj.innerHTML = response;
    } else if (Type.Is.obj(obj)) {
      response = DateTime.fromISO(
        obj[
          props.has(FIELD)
            ? props.get(FIELD)
            : Object.getOwnPropertyNames(obj)[0]
        ]
      ).toFormat(fmt);
      obj[
        props.has(FIELD) ? props.get(FIELD) : Object.getOwnPropertyNames(obj)[0]
      ] = response;
    } else {
      response = DateTime.fromISO(obj).toFormat(fmt);
    }

    return response;
  }

  static toIso(props) {
    if (!props) {
      log.error(
        `props maps must be given => new Map([[DATA, HTMLElement|Object|String], [DATEFMT,"your format"]) or toIso("13/05/1965")`
      );
    }

    const obj = props instanceof Map ? props.get(DATA) : props,
      fmt =
        props instanceof Map && props.has(DATEFMT)
          ? props.get(DATEFMT)
          : InaxiumJS.config.dateFormat;
    let response;
    if (Type.Html.Is.value(obj)) {
      response = DateTime.fromFormat(obj.value, fmt);
      obj.value = response;
    } else if (Type.Html.Is.inner(obj)) {
      response = DateTime.fromFormat(obj.innerHTML, fmt);
      obj.innerHTML = response;
    } else if (Type.Is.obj(obj)) {
      response = DateTime.fromFormat(
        obj[
          props.has(FIELD)
            ? props.get(FIELD)
            : Object.getOwnPropertyNames(obj)[0]
        ],
        fmt
      );
      obj[
        props.has(FIELD) ? props.get(FIELD) : Object.getOwnPropertyNames(obj)[0]
      ] = response;
    } else {
      response = DateTime.fromFormat(obj, fmt);
    }

    return response.toISO();
  }
};

Utils.Node = class {
  static content(adi, value) {
    const ha = adi.node.hasAttribute,
      ga = adi.node.getAttribute;
    if ((ha("type") && ga("type") === "date") || ha("date")) {
      adi.data = node.hasAttribute("fmt")
        ? DateTime.fromISO(value.iso).toFormat(node.getAttribute("fmt"))
        : value.fmt;
    }
  }
};
