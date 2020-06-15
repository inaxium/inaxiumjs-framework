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

export default class Url {
  static params(url) {
    if (!url) {
      url = window.url;
    }

    // get query string from url (optional) or window
    let queryString = url ? url.split("?")[1] : window.location.search.slice(1);

    // we'll store the parameters here
    let obj = {};

    // if query string exists
    if (queryString) {
      // stuff after # is not part of query string, so get rid of it
      queryString = queryString.split("#")[0];

      // split our query string into its component parts
      let arr = queryString.split("&");

      for (let i = 0; i < arr.length; i++) {
        // separate the keys and the values
        let a = arr[i].split("=");

        // in case params look like: list[]=thing1&list[]=thing2
        let paramNum = undefined;
        let paramName = a[0].replace(/\[\d*\]/, function (v) {
          paramNum = v.slice(1, -1);
          return "";
        });

        // set parameter value (use 'true' if empty)
        let paramValue = typeof a[1] === "undefined" ? true : a[1];

        // (optional) keep case consistent
        paramName = paramName.toLowerCase();
        paramValue = paramValue.toLowerCase();

        // if parameter name already exists
        if (obj[paramName]) {
          // convert value to array (if still string)
          if (typeof obj[paramName] === "string") {
            obj[paramName] = [obj[paramName]];
          }
          // if no array index number specified...
          if (typeof paramNum === "undefined") {
            // put the value on the end of the array
            obj[paramName].push(paramValue);
          }
          // if array index number specified...
          else {
            // put the value at that index number
            obj[paramName][paramNum] = paramValue;
          }
        }
        // if param name doesn't exist yet, set it
        else {
          obj[paramName] = paramValue;
        }
      }
    }

    return obj;
  }
}
