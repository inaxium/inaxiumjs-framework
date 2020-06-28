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
import Signal, { signalEvaluation } from "./signal.js";
import Utils from "./utils.js";
import { prepareReplicator } from "./core.js";
import addClickFeature from "./mouse.js";
import {
  DATA_FIELD_CHANGED,
  TRUNCATED,
  SELECTION_CHANGED,
  CLICK,
  X_DIT,
  X_HIDDEN,
} from "./const.js";
import Lang from "./lang.js";
import DateTime from "./luxon.js";

const NODES = "nodes",
  LANG = "language";

export default class XAttributes {
  #signal;
  #has;
  #is;
  #replicator;
  #receiver;
  #replica;
  #ds;
  #field;
  #data;
  #id;
  #name;
  #oid;
  #rid;
  #loader;
  #click;
  #node;
  #selected = false;
  #url;
  #handleSignal = true;
  #frozenId;
  #ou = new Set();
  #langClass = new Lang();
  #fmt;

  #isReplicator = () => {
    if (Attribute.Has.replicator(this.node)) {
      if (!this.node.getAttribute("x-replicator")) {
        throw `Replicator represent a Storage. => x-replicator="ds"`;
      }

      this.replicator = this.node;

      this.rid = Utils.uid;
      this.ds = ds[Attribute.Get.replicator(this.node)];

      prepareReplicator(this.node);
    }
  };

  #isReceiver = () => {
    if (Attribute.Has.receiver(this.node)) {
      if (!Attribute.Get.receiver(this.node)) {
        throw `Receiver represent a Storage. => x-receiver="ds"`;
      }

      this.receiver = this.node;
      this.ds = ds[Attribute.Get.receiver(this.node)];

      this.id = this.ds.selected;

      this.signal.on(SELECTION_CHANGED, this.ds.name, (data) => {
        this.id = data.id;
      });
    }
  };

  #isReplica = () => {
    if (this.is.replica) {
      if (this.id === this.ds.selected) {
        this.selected = true;
      }

      this.node.addEventListener(CLICK, () => {
        const dit = ds.dit.get(this.ds.name);
        this.ds.selected = this.id;

        if (dit) {
          dit.list.scroll.y = window.pageYOffset;
        }
      });

      this.signal.on(SELECTION_CHANGED, this.ds.name, (data) => {
        if (this.id !== data.id) {
          if (this.selected) {
            this.selected = undefined;
          }
        } else {
          this.selected = true;
        }
      });

      this.signal.on(TRUNCATED, this.ds.name, (data) => {
        if (this.ds.name === data.name) {
          this.node.remove();
        }
      });
    }
  };

  #isField = () => {
    if (this.node.hasAttribute("field")) {
      let field = this.node.getAttribute("field")
        ? this.node.getAttribute("field")
        : this.node.getAttribute("id");
      if (field) {
        this.field = field;

        if (this.has.receiver) {
          /*
           *  Write Content (Now)
           */

          if (this.ds.selected) {
            const data = this.ds.get(this.ds.selected)[this.field];
            this.data = data === undefined ? "" : data;
          }
        }

        if (this.has.replica) {
          const id = this.replica.adi.id;
          this.signal.one(DATA_FIELD_CHANGED, this.ds.name, (data) => {
            if (id === data.id && this.field === data.field) {
              this.data = data.value;
            }
          });
        } else if (this.has.receiver) {
          this.frozenId = this.receiver.adi.id;
          if (!this.is.immutable) {
            this.signal.on(SELECTION_CHANGED, this.ds.name, () => {
              this.data = this.ds.get(this.ds.selected)[this.field];
            });
          }

          this.signal.on(DATA_FIELD_CHANGED, this.ds.name, (data) => {
            if (this.handleSignal) {
              if (this.is.immutable) {
                if (this.frozenId === data.id && this.field === data.field) {
                  this.data = data.value;
                }
              } else {
                if (
                  this.receiver.adi.id === data.id &&
                  this.field === data.field
                ) {
                  this.data = data.value;
                }
              }
            }
          });
        }
      } else {
        throw `Field attribute set but not set content => field || id`;
      }
    }
  };

  #hasReplicator = () => {
    let start = this.node;
    while (true) {
      if (Attribute.Has.replicator(start)) {
        this.has.replicator = true;
        this.replicator = start;
        break;
      } else {
        start = start.parentElement;
      }

      if (!start) {
        break;
      }
    }
  };

  #hasReceiver = () => {
    let start = this.node;
    while (true) {
      if (Attribute.Has.receiver(start)) {
        this.has.receiver = true;
        this.receiver = start;
        this.ds = start.adi.ds;
        this.id = this.receiver.adi.id;

        break;
      } else {
        start = start.parentElement;
      }

      if (!start) {
        break;
      }
    }
  };

  #hasClick = () => {
    if (this.node.hasAttribute("click")) {
      this.click = new Click(this.node.getAttribute("click"), this);

      if (Attribute.Has.dit(this.node)) {
        this.has.dit = true;
      }

      if (!this.click.value)
        throw `click implemented without value => click="key.constraint" or click="key"`;

      addClickFeature(this.node);
    }
  };

  #hasDit = () => {
    /*
        Idea was that only no field Elements could have an OU. But perhaps this Idea was wrong.
     */
    if (!this.node.hasAttribute("field")) {
      let path;

      if (this.node.id && !this.node.hasAttribute("ou")) {
        let start = this.node;
        while (start !== document) {
          if (start.hasAttribute("ou")) {
            path = `${start.getAttribute("ou")}.${this.node.id}`;
            break;
          } else {
            start = start.parentNode;
          }
          if (!start) break;
        }
      } else if (this.node.id && this.node.hasAttribute("ou")) {
        path = `${this.node.getAttribute("ou")}.${this.node.id}`;
      } else if (this.node.hasAttribute("ou") && !this.node.id) {
        path = this.node.getAttribute("ou");
      } else {
        return;
      }

      if (path) {
        const ouEntry = InaxiumJS.dit.ptr(path);
        if (ouEntry) {
          ouEntry.ptr = this.node;

          this.ou.add({
            path: path,
            ptr: ouEntry,
          });

          signalEvaluation(this.node);
        }
      }
    }
  };

  #hasLang = () => {
    this.#langClass.addLangFeature(this.node);
  };

  constructor(node) {
    this.#node = node;
    this.#signal = new Signal(this.#node);
    this.#has = new Has();
    this.#is = new Is(this.#node);
    this.oid = Utils.uid;
  }

  addAttributes() {
    /*
     *  Replica means setting attributes has already taken place. Replicator did this.
     */

    if (!this.is.replica && !this.has.replica) {
      this.#isReplicator();
      this.#isReceiver();
      this.#hasReplicator();
      this.#hasReceiver();
    }

    this.#isReplica();
    this.#isField();
    this.#hasClick();
    this.#hasDit();
    this.#hasLang();
  }

  /*
     Only Getter
   */
  get signal() {
    return this.#signal;
  }

  get has() {
    return this.#has;
  }

  get is() {
    return this.#is;
  }

  get loader() {
    return this.#loader;
  }

  get node() {
    return this.#node;
  }

  /*
      Getter and Setter
   */

  get field() {
    return this.#field;
  }

  set field(value) {
    this.#field = value;
    this.is.field = true;
    this.has.field = true;
  }

  get data() {
    return this.#data;
  }

  set data(value) {
    if (!value) {
      if (value !== "") {
        return;
      }
    }

    if (typeof value === "object" && value.isDate) {
      const fmt = this.node.hasAttribute("fmt")
        ? this.node.getAttribute("fmt")
        : this.node instanceof HTMLInputElement
        ? ds.dit.get(LANG)[ds.dit.get(LANG).current].date.input
        : ds.dit.get(LANG)[ds.dit.get(LANG).current].date.other;

      this.#data = DateTime.fromISO(value.dateTime).toFormat(fmt);
    } else if (!isNaN(value) && this.node.hasAttribute("fmt")) {
      let locals, currency, style;
      if (this.node.getAttribute("fmt")) {
        [locals, currency, style] = this.node.getAttribute("fmt").split("|");
      } else {
        const money = ds.dit.get(LANG)[ds.dit.get(LANG).current].money;
        locals = money.locals;
        currency = money.currency;
        style = money.style;
      }

      this.#data = new Intl.NumberFormat(locals, {
        style: style,
        currency: currency,
      }).format(value);
    } else {
      this.#data = value;
    }

    if (
      this.node instanceof HTMLInputElement ||
      this.node instanceof HTMLTextAreaElement ||
      this.node instanceof HTMLButtonElement
    ) {
      this.node.value = this.#data;
    } else {
      this.node.innerHTML = this.#data;
    }
  }

  get name() {
    return this.#name;
  }

  set name(value) {
    this.#name = value;
    this.has.name = true;
  }

  get ds() {
    return this.#ds;
  }

  set ds(value) {
    this.#ds = value;
  }

  get oid() {
    return this.#oid;
  }

  set oid(value) {
    Attribute.Set.oid(this.node, (this.#oid = value));
  }

  get rid() {
    return this.#rid;
  }

  set rid(value) {
    Attribute.Set.rid(this.node, (this.#rid = value));
  }

  get id() {
    return this.#id;
  }

  set id(value) {
    Attribute.Set.id(this.node, (this.#id = value));
  }

  get frozenId() {
    return this.#frozenId;
  }

  set frozenId(value) {
    return this.#frozenId;
  }

  get replica() {
    return this.#replica;
  }

  set replica(value) {
    this.#replica = value;
  }

  get replicator() {
    return this.#replicator;
  }

  set replicator(value) {
    this.#replicator = value;
    this.is.replicator = true;
  }

  get receiver() {
    return this.#receiver;
  }

  set receiver(value) {
    this.#receiver = value;
    this.is.receiver = true;
  }

  get selected() {
    return this.#selected;
  }

  set url(value) {
    this.#url = value;
  }

  get url() {
    return this.#selected;
  }

  set click(value) {
    this.#click = value;
    this.has.click = true;
  }
  get click() {
    return this.#click;
  }

  set handleSignal(value) {
    this.#handleSignal = value;
  }

  get handleSignal() {
    return this.#handleSignal;
  }

  set ou(value) {
    if (value) {
      this.#ou = value;
      this.has.ou = true;
    }
  }

  get ou() {
    return this.#ou;
  }

  set selected(value) {
    this.#selected = value;
    if (value) {
      this.#selected = true;
      Attribute.Set.selected(this.node, true);
    } else {
      Attribute.Remove.selected(this.node);
    }
  }

  set fmt(value) {
    this.#fmt = value;
  }

  get fmt() {
    return this.#fmt;
  }

  pa(deep = 1) {
    let start = this.node;

    for (let counter = 0; counter < deep; counter++) {
      if (start) {
        start = start.parentElement;
      }
    }

    return start;
  }

  /*
      Functions
   */

  clean() {
    this.signal.clean();
  }
}

class Has {
  #name = false;
  #field = false;
  #click = false;
  #replicator = false;
  #receiver = false;
  #ou = false;
  #hidden = true;

  /*
      Getter and Setter
   */

  get name() {
    return this.#name;
  }

  set name(value) {
    this.#name = value;
  }

  get field() {
    return this.#field;
  }
  set field(value) {
    this.#field = value;
  }

  get click() {
    return this.#click;
  }
  set click(value) {
    this.#click = value;
  }

  get replicator() {
    return this.#replicator;
  }
  set replicator(value) {
    this.#replicator = value;
  }

  get receiver() {
    return this.#receiver;
  }
  set receiver(value) {
    this.#receiver = value;
  }

  get ou() {
    return this.#ou;
  }
  set ou(value) {
    this.#ou = value;
  }
  get hidden() {
    return this.#hidden;
  }
  set hidden(value) {
    this.#hidden = value;
  }
}

class Is {
  #parent;
  #replicator = false;
  #replica = false;
  #receiver = false;
  #field = false;
  #loader = false;
  #nav = false;
  #hidden = true;
  #immutable = false;
  #date = false;

  constructor(parent) {
    this.#parent = parent;
  }
  /*
      Getter and Setter
   */

  get replicator() {
    return this.#replicator;
  }
  set replicator(value) {
    this.#replicator = value;
  }

  get replica() {
    return this.#replica;
  }
  set replica(value) {
    this.#replica = value;
  }

  get receiver() {
    return this.#receiver;
  }
  set receiver(value) {
    this.#receiver = value;
  }

  get field() {
    return this.#field;
  }
  set field(value) {
    this.#field = value;
  }

  get loader() {
    return this.#loader;
  }
  set loader(value) {
    this.#loader = value;
  }

  get nav() {
    return this.#nav;
  }
  set nav(value) {
    this.#nav = value;
  }

  get hidden() {
    return this.#hidden;
  }

  get immutable() {
    return this.#immutable;
  }
  set immutable(value) {
    this.#immutable = value;
  }

  set hidden(value) {
    this.#hidden = value;
    if (value) {
      this.#parent.classList.add(X_HIDDEN);
    } else {
      this.#parent.classList.remove(X_HIDDEN);
    }
  }

  get date() {
    return this.#date;
  }

  set date(value) {
    this.#date = value;
  }
}

class Loader {
  #url;
  #target;

  constructor(url, target) {
    this.#url = url;
    this.#target = target;
  }

  /*
    Getter and Setter
  */

  get url() {
    return this.#url;
  }
  set url(value) {
    this.#url = value;
  }

  get target() {
    return this.#target;
  }
  set target(value) {
    this.#target = value;
  }
}

class Click {
  #value;
  #parent;

  constructor(value, parent) {
    this.#value = value;
    this.#parent = parent;
  }
  /*
      Getter and Setter
   */

  get value() {
    return this.#value;
  }

  set value(value) {
    this.#value = value;
  }

  get metaValue() {
    const map = new Map();

    if (this.parent.has.dit) {
      try {
        const dit = ds.dit.get(NODES)[this.parent.node.getAttribute(X_DIT)]
          .metaPath;

        if (dit) {
          for (const [key, value] of Object.entries(dit)) {
            let ditArray = value.split("."),
              start = ds.dit.get(ditArray[0]);
            ditArray.shift();
            map.set(
              key,
              ditArray
                .join(".")
                .split(".")
                .reduce((o, i) => o[i], start)
            );
          }
        }
      } catch (e) {
        throw e;
      }
    }

    return map;
  }

  get dbValue() {
    const map = new Map();

    if (this.parent.has.dit) {
      try {
        const dit = ds.dit.get(NODES)[this.parent.node.getAttribute(X_DIT)].db;

        if (dit) {
          for (const [key, value] of Object.entries(dit)) {
            const storageValue = ds[value.value].get(value.key);
            if (storageValue) {
              map.set(key, storageValue);
            }
          }
        }
      } catch (e) {
        throw e;
      }
    }

    return map;
  }

  get parent() {
    return this.#parent;
  }
}
