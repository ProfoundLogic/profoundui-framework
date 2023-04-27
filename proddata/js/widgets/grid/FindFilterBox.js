//  Profound UI Runtime  -- A Javascript Framework for Rich Displays
//  Copyright (c) 2020 Profound Logic Software, Inc.
//
//  This file is part of the Profound UI Runtime
//
//  The Profound UI Runtime is free software: you can redistribute it and/or modify
//  it under the terms of the GNU Lesser General Public License as published by
//  the Free Software Foundation, either version 3 of the License, or
//  (at your option) any later version.
//
//  The Profound UI Runtime is distributed in the hope that it will be useful,
//  but WITHOUT ANY WARRANTY; without even the implied warranty of
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//  GNU Lesser General Public License for more details.
//
//  You should have received a copy of the GNU Lesser General Public License
//  In the COPYING and COPYING.LESSER files included with the Profound UI Runtime.
//  If not, see <http://www.gnu.org/licenses/>.

/**
 * Grid Find/Filter Box Class
 * @param {Element} container   Parent element for the FindFilterBox elements.
 * @param {Object} grid         A Grid associated with this FindFilterBox.
 * @constructor
 */

pui.FindFilterBox = function(container, grid) {
  // Private Properties
  this._grid = grid;
  this._timeoutId = null; // Needed for clearTimeout in the keyup and paste handlers.
  this._currentQF = null; // Gets the current quick-filter INPUT when events are handled.

  if (container == null) container = document.body; // this would occur in design mode, where the ffbox is not used
  this._container = container;
  this._div = document.createElement("div");
  this._div.className = "pui-find-filter";
  this._div.style.display = "none";
  this._contentDiv = document.createElement("div");
  this._contentDiv.className = "pui-find-filter-content";
  this._box = document.createElement("input");
  this._box.className = "pui-find-filter-box";
  this._box.addEventListener("input", this);
  this._box.addEventListener("keydown", this);
  this._box.addEventListener("blur", this);
  this._contentDiv.appendChild(this._box);
  this._div.appendChild(this._contentDiv);
  this._container.appendChild(this._div);

  // Public Properties
  this.type = null; // can be "find" or "filter" or "pgfilter"

  this.interval = 100; // How long to wait after the user stops typing before doing find/filter.
  this.onsearch = null; // To be set to either a find or a filtering function of the grid.
};

// Public Methods

/**
 * Handle events whose listeners are "this", "grid.ffbox", etc.
 * @param {Event} e
 */
pui.FindFilterBox.prototype["handleEvent"] = function(e) {
  var text;
  if (e.target && e.target.className === "qf" && e.target.tagName === "INPUT") this._currentQF = e.target;
  else this._currentQF = null;

  switch (e.type) {
    case "input":
      if (this.type == "pgfilter") return; // A paging filter should not start filtering until Enter is pressed; else page submits before it's typed.
      if (typeof this.onsearch === "function") {
        clearTimeout(this._timeoutId);
        // Enqueue the find|filter event; avoids re-rendering the grid during quick inputs.
        this._timeoutId = setTimeout(this._keyuptimeout, this.interval, this);
      }
      break;

    case "keydown":
      var key = e.keyCode;
      if (key == 13) { // Enter
        if (this.type == "find") {
          if (typeof this.onsearch === "function") {
            text = this._currentQF ? this._currentQF.value : this._box.value;
            this.onsearch(text, true);
          }
        }
        else if (this.type == "filter") {
          this._grid.highlighting.text = "";
          this._grid.getData();
          this.hide();
        }
        else if (this.type == "pgfilter") {
          if (typeof this.onsearch === "function") {
            text = this._currentQF ? this._currentQF.value : this._box.value;
            this.onsearch(text); // These don't start filtering until Enter is pressed.
          }
        }
        preventEvent(e);
      }
      else if (key == 27) { // Escape
        this._grid.highlighting.text = "";
        this._grid.getData();
        this.hide();
        preventEvent(e);
      }
      break;

    case "blur":
      // Note: Chrome may fire the blur event after the grid was destroyed for paging filters, so check before using the grid.
      if (this._grid) {
        if (this._grid.highlighting) this._grid.highlighting.text = "";
        if (this._grid.getData) this._grid.getData();
      }
      this.hide();
      break;

    case "focus":
      e.stopPropagation();
      e.preventDefault();
      if (e.target.className === "qf") {
        // The focus event is from a quick-filter input element; start filtering in that column.
        var headerCell = e.target.parentNode;
        this._grid["startFilter"](headerCell);
      }
      break;
  }
};

pui.FindFilterBox.prototype.show = function() {
  this._div.style.display = "";
};

pui.FindFilterBox.prototype.hide = function() {
  this._div.style.display = "none";
};

pui.FindFilterBox.prototype.positionByGridColumn = function(cell) {
  var grid = cell.parentNode;
  if (grid == null) return;
  var gridParent = grid.parentNode;
  if (gridParent == null) return;

  var left, top, width;
  left = grid.offsetLeft + cell.offsetLeft;
  top = grid.offsetTop - 40;
  width = cell.offsetWidth;

  // Compensate if the grid is inside a window. Fixes "center window"
  // positioning issues. See issue 2544 for test cases.
  var acont = pui["getActiveContainer"]();
  if (acont != null && acont.isPUIWindow === true) {
    left += acont.offsetLeft;
    top += acont.offsetTop;
  }

  if (gridParent.getAttribute("container") == "true") {
    var offset = pui.layout.getContainerOffset(gridParent);
    top += offset.y;
    left += offset.x;
  }

  this.setPosition(left, top, width);
};

pui.FindFilterBox.prototype.setPosition = function(left, top, width) {
  if (width == null) width = 200;
  var boxWidth = width - 15;
  if (boxWidth < 20) boxWidth = 20;
  this._div.style.left = left + "px";
  this._div.style.top = top + "px";
  this._div.style.width = width + "px";
  this._box.style.width = boxWidth + "px";
};

/**
 * Set the filter input box's placeholder text. Set to "Find..." or "Filter..." by startFind or startFilter.
 * @param {String} placeholder
 */
pui.FindFilterBox.prototype.setPlaceholder = function(placeholder) {
  this._box["placeholder"] = placeholder;
};

pui.FindFilterBox.prototype.focus = function() {
  this._box.focus();
};

pui.FindFilterBox.prototype.clear = function() {
  this._box.value = "";
};

pui.FindFilterBox.prototype.setText = function(text) {
  this._box.value = text;
};

/**
 * Handle a queued keypress on a find/filter box.
 * @param {pui.FindFilterBox} me
 */
pui.FindFilterBox.prototype._keyuptimeout = function(me) {
  // Prevent uneccessary scroll causing ffbox to lose focus -- 6385
  if (me._grid && me._grid.scrollbarObj && me._grid.scrollbarObj.type == "sliding") me._grid.scrollbarObj.ready = false;
  // set box to filter or find
  var text = me._currentQF ? me._currentQF.value : me._box.value;
  me.onsearch(text);
  if (me._grid && me._grid.scrollbarObj && me._grid.scrollbarObj.type == "sliding") me._grid.scrollbarObj.ready = true;
};
