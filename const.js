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

export const DATEFMT = Symbol("datefmt"),
  DATA = Symbol("data"),
  CURRENCY_VALUES = Symbol("currency_values"),
  SIGNAL = Symbol("signal"),
  ID = Symbol("id"),
  METHOD = Symbol("method"),
  PAYLOAD = Symbol("payload"),
  UPDATE = Symbol("update"),
  INSERT = Symbol("insert"),
  URL = Symbol("url"),
  OU = Symbol("organizational unit"),
  FIELD = Symbol("field"),
  INIT = Symbol("init"),
  CONSTRAINT = Symbol("constraint"),
  EMIT = Symbol("emit"),
  DS_MODE_CHANGED = Symbol("ds_mode_changed"),
  NONE = Symbol("none"),
  EDIT = Symbol("edit"),
  NEW = Symbol("new"),
  INPUT = "input",
  EMPTY = "",
  INSERTED = "inserted",
  REMOVED = "removed",
  TRUNCATED = "truncated",
  POST = "POST",
  DELETE = "DELETE",
  GET = "GET",
  SELECT = "select",
  KEY = "key",
  EXT = "ext",
  X_DATA = "x-data",
  AUTOFOCUS = "autofocus",
  NODE = "node",
  PUBLIC_SIDEBAR = "public-sidebar",
  SIDEBAR = "sidebar",
  REST = "rest",
  REFRESH = "refresh",
  FILTER = "filter",
  REMOVE_YOURSELF_BY_RID = "remove_yourself_by_id",
  REMOVE_YOURSELF_BY_ID = "remove_yourself_by_id",
  UI_SELECTION_CHANGED = "ui_selection_changed",
  SELECTION_CHANGED = "selection_changed",
  LANGUAGE_CHANGED = "language_changed",
  DOC_CHANGED = "doc_changed",
  TRUNCATE = Symbol("truncate"),
  DATA_FIELD_CHANGED = "data_field_changed",
  INNER = new Set([
    HTMLSpanElement,
    HTMLDivElement,
    HTMLParagraphElement,
    HTMLTextAreaElement,
    HTMLLabelElement,
    HTMLAnchorElement,
  ]),
  VALUE = new Set([HTMLInputElement, HTMLButtonElement]),
  EN = "en",
  CLICK = "click",
  CLICKED = "clicked",
  STEP = "step",
  NUMBER = "number",
  LOAD_HTML = "load_html",
  HTML_LOADED = "html_loaded",
  TYPE = "type",
  CHECKBOX = "checkbox",
  DISABLED = "disabled",
  HREF = "href",
  PLACEHOLDER = "placeholder",
  DE = "de",
  US = "us",
  GB = "gb",
  APP = "app",
  X_ID = "x-id",
  X_OID = "x-oid",
  X_RID = "x-rid",
  X_NAME = "x-name",
  X_EVENT = "x-event",
  X_FIELD = "x-field",
  X_WRITE_TO_OID = "x-write-to-oid",
  X_QUERY_FIELD = "x-query-field",
  X_DATE = "x-date",
  X_CURRENCY = "x-currency",
  X_URL = "x-url",
  X_TARGET = "x-target",
  X_REPLICATOR = "x-replicator",
  X_REFRESH = "x-refresh",
  X_DISPLAY_NONE = "x-display-none",
  X_REPLICA = "x-replica",
  X_RECEIVER = "x-receiver",
  X_HREF = "x-href",
  X_EDITOR = "x-editor",
  X_TAG = "x-tag",
  X_ROW = "row",
  X_HEAD = "head",
  X_CELL = "x-cell",
  X_COPY = "x-copy",
  X_MOVE = "x-move",
  X_LANG = "x-lang",
  X_DIT = "x-dit",
  X_SEL = "x-selected",
  X_CLICK = "x-click",
  X_NAV = "x-nav",
  X_FILTER = "x-filter",
  X_HIDDEN = "x-hidden",
  X_CONSTRAINT = "x-constraint";
