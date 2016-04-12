//  Profound UI Runtime  -- A Javascript Framework for Rich Displays
//  Copyright (c) 2016 Profound Logic Software, Inc.
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
 * @constructor
 */

pui.FindFilterBox = function() {

	// Private Properties
	var me = this;
	var div;
	var contentDiv;
	var box;

	// Public Properties
	this.container = null;
	this.grid = null;
	this.headerCell = null;
	this.type = null;  // can be "find" or "filter"

	// Public Methods
	this.init = function() {
		div = document.createElement("div");
		div.className = "pui-find-filter";
		div.style.display = "none";
		contentDiv = document.createElement("div");
		contentDiv.className = "pui-find-filter-content";  
		box = document.createElement("input");
		box.className = "pui-find-filter-box";
		addEvent(box, "keyup", function(e) {
      if (!e) e = window.event;
      var key = e.keyCode;
		  if (key == 13) return;  // Enter
			var text = box.value;
			if (typeof me.onsearch === "function") {
				me.onsearch(text);
			}
		});
		addEvent(box, "keydown", function(e) {
      if (!e) e = window.event;
      var key = e.keyCode;
		  if (key == 13) {  // Enter
		    if (me.type == "find") {
    			if (typeof me.onsearch === "function") {
      			var text = box.value;
    				me.onsearch(text, true);
    			}
		    }
		    if (me.type == "filter") {
    		  me.grid.highlighting.text = "";
    		  me.grid.getData();
		      me.hide();
		    }
		    preventEvent(e);
		  }
		  if (key == 27) {  // Escape
  		  me.grid.highlighting.text = "";
  		  me.grid.getData();
  		  me.hide();
		    preventEvent(e);
		  }
		});
		addEvent(box, "blur", function(e) {
		  me.grid.highlighting.text = "";
		  me.grid.getData();
		  me.hide();
		});
		contentDiv.appendChild(box);
		div.appendChild(contentDiv);
		me.container.appendChild(div);
	};

	this.show = function() {
		div.style.display = "";
	};

	this.hide = function() {
		div.style.display = "none";
	};

	this.positionByGridColumn = function(cell) {
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

		me.setPosition(left, top, width);    
	};
	
	this.changeContainer = function(newContainer) {
    if (me.container === newContainer) return;
    me.container.removeChild(div);
    me.container = newContainer;
    newContainer.appendChild(div);
    
	};

	this.setPosition = function(left, top, width) {
		if (width == null) width = 200;
		var boxWidth = width - 15;
		if (boxWidth < 20) boxWidth = 20;
		div.style.left = left + "px";
		div.style.top = top + "px";
		div.style.width = width + "px";
		box.style.width = boxWidth + "px";
	};
	
	this.setPlaceholder = function(placeholder) {
		box["placeholder"] = placeholder;
	};
	
	this.focus = function() {
	  box.focus();
	};
	
	this.clear = function() {
	  box.value = "";
	};

	this.setText = function(text) {
	  box.value = text;
	};

};

