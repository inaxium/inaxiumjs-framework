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

import * as C from "./const.js";
import Qs from "./qs.js";

class Check extends Error {
  static check(what, ...parameters) {
    switch (what) {
      case "first case":
        if (parameters.length < 3) {
          throw "wrong number of parameters";
        }

        if (!(parameters[0] instanceof HTMLElement)) {
          throw "first parameter is not an HTMLElement";
        }

        break;
      case "second case":
        if (parameters.length < 2) {
          throw "wrong number of parameters";
        }

        if (!(parameters[0] instanceof HTMLElement)) {
          throw "first parameter is not an HTMLElement";
        }

        break;
      case "third case":
        if (parameters.length < 1) {
          throw "wrong number of parameters";
        }
        if (!(parameters[0] instanceof HTMLElement)) {
          throw "first parameter is not an HTMLElement";
        }
    }
  }
}

export default class Attribute {}

Attribute.Set = class extends Check {
  static value(el, attribute, value) {
    super.check("first case", el, attribute, value);
    el.setAttribute(attribute, value);
  }

  static id(el, value) {
    Attribute.Set.value(el, C.X_ID, value);
  }

  static lang(el, value) {
    Attribute.Set.value(el, C.X_LANG, value);
  }

  static disabled(el) {
    Attribute.Set.value(el, C.DISABLED, C.DISABLED);
  }

  static name(el, value) {
    Attribute.Set.value(el, C.X_NAME, value);
  }

  static field(el, value) {
    Attribute.Set.value(el, C.X_FIELD, value);
  }

  static oid(el, value) {
    Attribute.Set.value(el, C.X_OID, value);
  }

  static rid(el, value) {
    Attribute.Set.value(el, C.X_OID, value);
  }

  static placeholder(el, value) {
    Attribute.Set.value(el, C.PLACEHOLDER, value);
  }

  static xTag(el) {
    return Attribute.Set.value(el, C.X_TAG);
  }

  static xHead(el) {
    return Attribute.Set.value(el, C.X_HEAD);
  }

  static xCell(el) {
    return Attribute.Set.value(el, C.X_CELL);
  }

  static xRow(el) {
    return Attribute.Set.value(el, C.X_ROW);
  }
  static xEditor(el) {
    return Attribute.Set.value(el, C.X_EDITOR);
  }
  static no(el) {
    return Attribute.Set.value(el, "x-no");
  }

  static selected(el, value) {
    if (el) {
      if (!value) {
        value = true;
      }
      Attribute.Set.value(el, C.X_SEL, value);
    }
  }
};

Attribute.Get = class extends Check {
  static value(el, attribute) {
    super.check("second case", el, attribute);
    return el.getAttribute(attribute);
  }

  static sleeveId(el) {
    let located = false,
      refund = undefined;

    do {
      if (el.hasAttribute("x-id")) {
        located = true;
        break;
      } else {
        el = el.parentElement;
      }
    } while (el.parentElement);

    if (located) {
      refund = el.getAttribute("x-id");
    }

    return refund;
  }

  static script(el, module) {
    let located = false;

    do {
      if (el.hasAttribute("x-dynamic-script")) {
        located = true;
        break;
      } else {
        el = el.parentElement;
      }
    } while (el.parentElement);

    if (located) {
      module.script = el.getAttribute("x-dynamic-script");
    }

    return module;
  }

  static sleeveSource(el) {
    let located = false,
      refund = undefined;

    do {
      if (el.hasAttribute("x-source")) {
        located = true;
        break;
      } else {
        el = el.parentElement;
      }
    } while (el.parentElement);

    if (located) {
      refund = el.getAttribute("x-source");
    }

    return refund;
  }

  static autofocus(el) {
    return Attribute.Get.value(el, C.AUTOFOCUS);
  }

  /*static source(el){
        return Attribute.Get.value(el, C.KEY);
    }*/

  static filter(el) {
    return Attribute.Get.value(el, C.X_FILTER);
  }

  static constraint(el) {
    return Attribute.Get.value(el, C.X_CONSTRAINT);
  }

  static key(el) {
    return Attribute.Get.value(el, C.KEY);
  }

  static ext(el) {
    return Attribute.Get.value(el, C.EXT);
  }

  static data(el) {
    return Attribute.Get.value(el, C.DATA);
  }

  static xTag(el) {
    return Attribute.Get.value(el, C.X_TAG);
  }

  static xHead(el) {
    return Attribute.Get.value(el, C.X_HEAD);
  }

  static xCell(el) {
    return Attribute.Get.value(el, C.X_CELL);
  }

  static xRow(el) {
    return Attribute.Get.value(el, C.X_ROW);
  }

  static xEditor(el) {
    return Attribute.Get.value(el, C.X_EDITOR);
  }

  static xdata(el) {
    return Attribute.Get.value(el, C.X_DATA);
  }

  static id(el) {
    return Attribute.Get.value(el, C.X_ID);
  }

  static lang(el) {
    return Number.parseInt(Attribute.Get.value(el, C.X_LANG));
  }

  static name(el) {
    return Attribute.Get.value(el, C.X_NAME);
  }

  static dit(el) {
    return Attribute.Get.value(el, C.X_DIT);
  }

  static click(el) {
    return Attribute.Get.value(el, C.X_CLICK);
  }

  static nav(el) {
    return Attribute.Get.value(el, C.X_NAV);
  }

  static field(el) {
    return Attribute.Get.value(el, C.X_FIELD);
  }

  static tag(el) {
    return Attribute.Get.value(el, C.X_TAG);
  }

  static qField(el) {
    return Attribute.Get.value(el, C.X_QUERY_FIELD);
  }
  static target(el) {
    return Attribute.Get.value(el, C.X_TARGET);
  }

  static placeholder(el) {
    return Attribute.Get.value(el, C.PLACEHOLDER);
  }

  static url(el) {
    return Attribute.Get.value(el, C.X_URL);
  }

  static currency(el) {
    return Attribute.Get.value(el, C.X_CURRENCY);
  }

  static date(el) {
    return Attribute.Get.value(el, C.X_DATE);
  }

  static xref(el) {
    return Attribute.Get.value(el, C.X_HREF);
  }

  static xeditor(el) {
    return Attribute.Get.value(el, C.X_EDITOR);
  }

  static xcopy(el) {
    return Attribute.Get.value(el, C.X_COPY);
  }

  static xmove(el) {
    return Attribute.Get.value(el, C.X_MOVE);
  }

  static href(el) {
    return Attribute.Get.value(el, C.HREF);
  }

  static type(el) {
    return Attribute.Get.value(el, C.TYPE);
  }

  static event(el) {
    return Attribute.Get.value(el, C.X_EVENT);
  }

  static oid(el) {
    return Attribute.Get.value(el, C.X_OID);
  }

  static rid(el) {
    return Attribute.Get.value(el, C.X_RID);
  }

  static replica(el) {
    return Attribute.Get.value(el, C.X_REPLICA);
  }

  static writeToOid(el) {
    return Attribute.Get.value(el, C.X_WRITE_TO_OID);
  }

  static source(el) {
    super.check("third case", el);

    let sources = Qs.allSources(),
      refund = undefined;

    if (sources && sources.length > 0) {
      refund = sources.item(sources.length - 1).getAttribute("x-source");
    } else {
      throw "could not find any sources";
    }

    return refund;
  }

  static receiver(el) {
    return Attribute.Get.value(el, C.X_RECEIVER);
  }

  static replicator(el) {
    return Attribute.Get.value(el, C.X_REPLICATOR);
  }
};

Attribute.Has = class extends Check {
  static value(el, attribute) {
    super.check("second case", el, attribute);
    return el.hasAttribute(attribute);
  }

  static init(el) {
    return Attribute.Has.value(el, C.INIT);
  }

  static filter(el) {
    return Attribute.Has.value(el, C.FILTER);
  }
  static constraint(el) {
    return Attribute.Has.value(el, C.CONSTRAINT);
  }

  static autofocus(el) {
    return Attribute.Has.value(el, C.AUTOFOCUS);
  }

  static key(el) {
    return Attribute.Has.value(el, C.KEY);
  }

  static ext(el) {
    return Attribute.Has.value(el, C.EXT);
  }

  static data(el) {
    return Attribute.Has.value(el, C.DATA);
  }

  static id(el) {
    return Attribute.Has.value(el, C.X_ID);
  }

  static lang(el) {
    return Attribute.Has.value(el, C.X_LANG);
  }

  static dit(el) {
    return Attribute.Has.value(el, C.X_DIT);
  }

  static selected(el) {
    return Attribute.Has.value(el, C.X_SEL);
  }

  static click(el) {
    return Attribute.Has.value(el, C.X_CLICK);
  }

  static nav(el) {
    return Attribute.Has.value(el, C.X_NAV);
  }

  static name(el) {
    return Attribute.Has.value(el, C.X_NAME);
  }

  static field(el) {
    return Attribute.Has.value(el, C.X_FIELD);
  }

  static writeToOid(el) {
    return Attribute.Has.value(el, C.X_WRITE_TO_OID);
  }

  static hasReceiver(el) {
    return Attribute.Has.value(el, C.X_HAS_RECEIVER);
  }

  static url(el) {
    return Attribute.Has.value(el, C.X_URL);
  }

  static target(el) {
    return Attribute.Has.value(el, C.X_TARGET);
  }

  static event(el) {
    return Attribute.Has.value(el, C.X_EVENT);
  }

  static xref(el) {
    return Attribute.Has.value(el, C.X_HREF);
  }

  static xTag(el) {
    return Attribute.Has.value(el, C.X_TAG);
  }

  static xHead(el) {
    return Attribute.Has.value(el, C.X_HEAD);
  }

  static xCell(el) {
    return Attribute.Has.value(el, C.X_CELL);
  }
  static xRow(el) {
    return Attribute.Has.value(el, C.X_ROW);
  }

  static xEditor(el) {
    return Attribute.Has.value(el, C.X_EDITOR);
  }

  static xcopy(el) {
    return Attribute.Has.value(el, C.X_COPY);
  }

  static xeditor(el) {
    return Attribute.Has.value(el, C.X_EDITOR);
  }

  static xmove(el) {
    return Attribute.Has.value(el, C.X_MOVE);
  }

  static placeholder(el) {
    return Attribute.Has.value(el, C.PLACEHOLDER);
  }

  static href(el) {
    return Attribute.Has.value(el, C.HREF);
  }

  static type(el) {
    return Attribute.Has.value(el, C.TYPE);
  }

  static date(el) {
    return Attribute.Has.value(el, C.X_DATE);
  }

  static currency(el) {
    return Attribute.Has.value(el, C.X_CURRENCY);
  }
  static replicator(el) {
    return Attribute.Has.value(el, C.X_REPLICATOR);
  }

  static refresh(el) {
    return Attribute.Has.value(el, C.X_REFRESH);
  }

  static replica(el) {
    return Attribute.Has.value(el, C.X_REPLICA);
  }

  static receiver(el) {
    return Attribute.Has.value(el, C.X_RECEIVER);
  }

  static oid(el) {
    return Attribute.Has.value(el, C.X_OID);
  }

  static rid(el) {
    return Attribute.Has.value(el, C.X_RID);
  }
  static step(el) {
    return Attribute.Has.value(el, C.STEP);
  }

  static source(el) {
    super.check("third case", el);
    return Qs.allSources().length > 0;
  }
};

Attribute.Has.Not = class extends Check {
  static value(el, attribute) {
    super.check("second case", el, attribute);
    return !el.hasAttribute(attribute);
  }

  static selected(el) {
    return !Attribute.Has.Not.value(el, C.X_SEL);
  }

  static source(el) {
    return !Attribute.Has.source(el);
  }

  static target(el) {
    return !Attribute.Has.value(el, C.X_TARGET);
  }

  static step(el) {
    return !Attribute.Has.value(el, C.STEP);
  }

  static replica(el) {
    return !Attribute.Has.value(el, C.X_REPLICA);
  }

  static type(el) {
    return !Attribute.Has.value(el, C.TYPE);
  }

  static field(el) {
    return !Attribute.Has.value(el, C.X_FIELD);
  }

  static lang(el) {
    return !Attribute.Has.value(el, C.X_LANG);
  }

  static name(el) {
    return !Attribute.Has.value(el, C.X_NAME);
  }

  static xTag(el) {
    return !Attribute.Has.value(el, C.X_TAG);
  }

  static xHead(el) {
    return !Attribute.Set.value(el, C.X_HEAD);
  }

  static xCell(el) {
    return !Attribute.Set.value(el, C.X_CELL);
  }
  static xRow(el) {
    return !Attribute.Set.value(el, C.X_ROW);
  }

  static xEditor(el) {
    return !Attribute.Has.value(el, C.X_EDITOR);
  }
  static xcopy(el) {
    return !Attribute.Has.value(el, C.X_COPY);
  }

  static xmove(el) {
    return !Attribute.Has.value(el, C.X_MOVE);
  }
};

Attribute.Remove = class extends Check {
  static value(el, attribute) {
    super.check("second case", el, attribute);
    el.removeAttribute(attribute);
  }

  static selected(el) {
    Attribute.Remove.value(el, C.X_SEL);
  }

  static disabled(el) {
    Attribute.Remove.value(el, C.DISABLED);
  }

  static displayNone(el) {
    Attribute.Remove.value(el, C.X_DISPLAY_NONE);
  }
};

export class Module {
  constructor(...parameters) {
    this.script = parameters[0];
    this.func = parameters[1];
    this.data = undefined;
  }
}
