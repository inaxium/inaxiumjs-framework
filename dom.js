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

import XAttributes from "./attach.js";
import Bootstrap from "./bootstrap.js";
import Error from "./utils.js";
import Utils from "./utils.js";
import IframeDoc from "./iframedoc.js";

class XBootstrap extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    Bootstrap.run();
  }
}

class XBody extends HTMLBodyElement {
  constructor() {
    super();
  }

  connectedCallback() {}
}

class XDiv extends HTMLDivElement {
  constructor() {
    super();
    this.adi = new XAttributes(this);
  }

  connectedCallback() {
    this.adi.addAttributes();
  }

  disconnectedCallback() {
    this.adi.clean();
  }
}

class XButton extends HTMLButtonElement {
  constructor() {
    super();
    this.adi = new XAttributes(this);
  }

  connectedCallback() {
    this.adi.addAttributes();
  }
  disconnectedCallback() {
    this.adi.clean();
  }
}

class XInput extends HTMLInputElement {
  constructor() {
    super();
    this.adi = new XAttributes(this);
  }

  connectedCallback() {
    this.adi.addAttributes();
  }

  disconnectedCallback() {
    this.adi.clean();
  }
}

class XTextArea extends HTMLTextAreaElement {
  constructor() {
    super();
    this.adi = new XAttributes(this);
  }

  connectedCallback() {
    this.adi.addAttributes();
  }

  disconnectedCallback() {
    this.adi.clean();
  }
}

class XForm extends HTMLFormElement {
  constructor() {
    super();
    this.adi = new XAttributes(this);
  }

  connectedCallback() {
    this.adi.addAttributes();
  }

  disconnectedCallback() {
    this.adi.clean();
  }
}

class XLabel extends HTMLLabelElement {
  constructor() {
    super();
    this.adi = new XAttributes(this);
  }

  connectedCallback() {
    this.adi.addAttributes();
  }

  disconnectedCallback() {
    this.adi.clean();
  }
}

class XSelect extends HTMLSelectElement {
  constructor() {
    super();
  }

  connectedCallback() {}
}

class XAnchor extends HTMLAnchorElement {
  constructor() {
    super();
    this.adi = new XAttributes(this);
  }

  connectedCallback() {
    this.adi.addAttributes();
  }
  disconnectedCallback() {
    this.adi.clean();
  }
}

export class XLang extends HTMLElement {
  constructor() {
    super(); // always call super() first in the constructor.
  }
  connectedCallback() {
    this.adi = new XAttributes(this);
    this.adi.addAttributes();
  }
  disconnectedCallback() {
    this.adi.signal.clean();
  }
}

export class XLoad extends HTMLElement {
  #html = async (url) => {
    let headers = new Headers();
    headers.append("Content-Type", "text/html; charset=utf-8");

    let request = new Request(`${url}.html`, {
      headers: headers,
      mode: "cors",
      cache: "default",
      credentials: "include",
    });

    const response = await fetch(request);
    await response.text().then((data) => {
      this.innerHTML = data;
    });
  };

  constructor() {
    super();
  }

  connectedCallback() {
    const url = this.getAttribute("url");
    this.#html(url).then(() => {});
  }

  disconnectedCallback() {}
}

class XOrderedList extends HTMLOListElement {
  constructor() {
    super();
  }

  connectedCallback() {}

  disconnectedCallback() {}
}

class XUnorderedList extends HTMLUListElement {
  constructor() {
    super();
    this.adi = new XAttributes(this);
  }

  connectedCallback() {
    this.adi.addAttributes();
  }

  disconnectedCallback() {
    this.adi.clean();
  }
}

class XList extends HTMLLIElement {
  constructor() {
    super();
    this.adi = new XAttributes(this);
  }

  connectedCallback() {
    this.adi.addAttributes();
  }

  disconnectedCallback() {
    this.adi.clean();
  }
}

class XSpan extends HTMLSpanElement {
  constructor() {
    super();
    this.adi = new XAttributes(this);
  }

  connectedCallback() {
    this.adi.addAttributes();
  }

  disconnectedCallback() {
    this.adi.clean();
  }
}

class XS extends HTMLLIElement {
  constructor() {
    super();
    this.adi = new XAttributes(this);
  }

  connectedCallback() {
    this.adi.addAttributes();
  }

  disconnectedCallback() {
    this.adi.clean();
  }
}

class XH1 extends HTMLHeadingElement {
  constructor() {
    super();
    this.adi = new XAttributes(this);
  }

  connectedCallback() {
    this.adi.addAttributes();
  }

  disconnectedCallback() {
    this.adi.clean();
  }
}
class XH2 extends HTMLHeadingElement {
  constructor() {
    super();
    this.adi = new XAttributes(this);
  }

  connectedCallback() {
    this.adi.addAttributes();
  }

  disconnectedCallback() {
    this.adi.clean();
  }
}
class XH3 extends HTMLHeadingElement {
  constructor() {
    super();
    this.adi = new XAttributes(this);
  }

  connectedCallback() {
    this.adi.addAttributes();
  }

  disconnectedCallback() {
    this.adi.clean();
  }
}
class XH4 extends HTMLHeadingElement {
  constructor() {
    super();
    this.adi = new XAttributes(this);
  }

  connectedCallback() {
    this.adi.addAttributes();
  }

  disconnectedCallback() {
    this.adi.clean();
  }
}
class XH5 extends HTMLHeadingElement {
  constructor() {
    super();
    this.adi = new XAttributes(this);
  }

  connectedCallback() {
    this.adi.addAttributes();
  }

  disconnectedCallback() {
    this.adi.clean();
  }
}
class XH6 extends HTMLHeadingElement {
  constructor() {
    super();
    this.adi = new XAttributes(this);
  }

  connectedCallback() {
    this.adi.addAttributes();
  }

  disconnectedCallback() {
    this.adi.clean();
  }
}

class XScript extends HTMLScriptElement {
  constructor() {
    super();
  }

  connectedCallback() {
    if (!this.src && !this.textContent) {
      throw new Error(
        "XScript",
        "connectedCallback",
        "src or content",
        "source or content must be defined"
      );
    }

    let script = document.createElement("script");
    script.type = "module";

    if (!this.textContent) {
      script.src = this.getAttribute("src");
    } else {
      this.name = Utils.uid;
      InaxiumJS.scripts.set(this.name, true);
      script.textContent = this.textContent.replace("()", `('${this.name}')`);
    }
    this.appendChild(script);
  }

  disconnectedCallback() {
    let o = InaxiumJS.scripts.get(this.name);

    if (typeof o === "object") {
      if (typeof o["disconnect"] === "function") {
        o["disconnect"]();
      }
    }

    InaxiumJS.scripts.delete(this.name);
  }
}

class XParagraph extends HTMLParagraphElement {
  constructor() {
    super();
    this.adi = new XAttributes(this);
  }

  connectedCallback() {
    this.adi.addAttributes();
  }

  disconnectedCallback() {
    this.adi.clean();
  }
}

class XImg extends HTMLImageElement {
  constructor() {
    super();
    this.adi = new XAttributes(this);
  }

  connectedCallback() {
    this.adi.addAttributes();
  }

  disconnectedCallback() {
    this.adi.clean();
  }
}

class XFooter extends HTMLElement {
  constructor() {
    super();
    this.adi = new XAttributes(this);
  }

  connectedCallback() {
    this.adi.addAttributes();
  }

  disconnectedCallback() {
    this.adi.clean();
  }
}

class XHeader extends HTMLLIElement {
  constructor() {
    super();
    this.adi = new XAttributes(this);
  }

  connectedCallback() {
    this.adi.addAttributes();
  }

  disconnectedCallback() {
    this.adi.clean();
  }
}

class XMain extends HTMLElement {
  constructor() {
    super();
    this.adi = new XAttributes(this);
  }

  connectedCallback() {
    this.adi.addAttributes();
  }

  disconnectedCallback() {
    this.adi.clean();
  }
}

class XAddress extends HTMLLIElement {
  constructor() {
    super();
    this.adi = new XAttributes(this);
  }

  connectedCallback() {
    this.adi.addAttributes();
  }

  disconnectedCallback() {
    this.adi.clean();
  }
}

class XSection extends HTMLElement {
  constructor() {
    super();
    this.adi = new XAttributes(this);
  }

  connectedCallback() {
    this.adi.addAttributes();
  }

  disconnectedCallback() {
    this.adi.clean();
  }
}

class XArticle extends HTMLElement {
  constructor() {
    super();
    this.adi = new XAttributes(this);
  }

  connectedCallback() {
    this.adi.addAttributes();
  }

  disconnectedCallback() {
    this.adi.clean();
  }
}

class XAside extends HTMLElement {
  constructor() {
    super();
    this.adi = new XAttributes(this);
  }

  connectedCallback() {
    this.adi.addAttributes();
  }

  disconnectedCallback() {
    this.adi.clean();
  }
}

class XNav extends HTMLElement {
  constructor() {
    super();
    this.adi = new XAttributes(this);
  }

  connectedCallback() {
    this.adi.addAttributes();
  }

  disconnectedCallback() {
    this.adi.clean();
  }
}

class XTr extends HTMLTableRowElement {
  constructor() {
    super();
    this.adi = new XAttributes(this);
  }

  connectedCallback() {
    this.adi.addAttributes();
  }

  disconnectedCallback() {
    this.adi.clean();
  }
}

class XTd extends HTMLTableCellElement {
  constructor() {
    super();
    this.adi = new XAttributes(this);
  }

  connectedCallback() {
    this.adi.addAttributes();
  }

  disconnectedCallback() {
    this.adi.clean();
  }
}

customElements.define("x-button", XButton, { extends: "button" });
customElements.define("x-div", XDiv, { extends: "div" });
customElements.define("x-input", XInput, { extends: "input" });
customElements.define("x-textarea", XTextArea, { extends: "textarea" });
customElements.define("x-form", XForm, { extends: "form" });
customElements.define("x-label", XLabel, { extends: "label" });
customElements.define("x-body", XBody, { extends: "body" });
customElements.define("x-select", XSelect, { extends: "select" });
customElements.define("x-a", XAnchor, { extends: "a" });
customElements.define("x-ul", XUnorderedList, { extends: "ul" });
customElements.define("x-ol", XOrderedList, { extends: "ol" });
customElements.define("x-li", XList, { extends: "li" });
customElements.define("x-tr", XTr, { extends: "tr" });
customElements.define("x-td", XTd, { extends: "td" });
customElements.define("x-script", XScript, { extends: "script" });
customElements.define("x-p", XParagraph, { extends: "p" });
customElements.define("x-span", XSpan, { extends: "span" });
customElements.define("x-s", XS, { extends: "s" });
customElements.define("x-h1", XH1, { extends: "h1" });
customElements.define("x-h2", XH2, { extends: "h2" });
customElements.define("x-h3", XH3, { extends: "h3" });
customElements.define("x-h4", XH4, { extends: "h4" });
customElements.define("x-h5", XH5, { extends: "h5" });
customElements.define("x-h6", XH6, { extends: "h6" });
customElements.define("x-img", XImg, { extends: "img" });
customElements.define("x-footer", XFooter, { extends: "footer" });
customElements.define("x-header", XHeader, { extends: "header" });
customElements.define("x-main", XMain, { extends: "main" });
customElements.define("x-address", XAddress, { extends: "address" });
customElements.define("x-section", XSection, { extends: "section" });
customElements.define("x-article", XArticle, { extends: "article" });
customElements.define("x-aside", XAside, { extends: "aside" });
customElements.define("x-nav", XNav, { extends: "nav" });
customElements.define("x-lang", XLang);
customElements.define("x-load", XLoad);
customElements.define("inaxium-js", XBootstrap);
customElements.define("iframe-doc", IframeDoc, { extends: "iframe" });
