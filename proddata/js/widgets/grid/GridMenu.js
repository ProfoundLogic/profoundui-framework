//  Profound UI Runtime  -- A Javascript Framework for Rich Displays
//  Copyright (c) 2017 Profound Logic Software, Inc.
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
 * Grid Menu Class
 * @constructor
 */

pui.GridMenu = function() {

  // Private Properties
  var me = this;
  var menuDiv;
  var table;
  
  var menuDivWidth = 185; //Used to avoid positioning off screen right.
  
  // Public Properties
  this.grid = null;
  this.clickEvent = null;
  this.cell = null;
  
  // Public Methods
  this.init = function() {
    addEvent(document, "mousedown", function(e) {
      if (me == null) return;
      var obj = getTarget(e);
      while (obj != null) {
        if (obj == menuDiv) return;
        if (obj == me.cell) return;
        obj = obj.parentNode;
      }
      me.hide();
    });

    menuDiv = document.createElement("div");
    menuDiv.style.position = "absolute";
    menuDiv.style.border = "1px solid #718bb7";
    menuDiv.style.backgroundColor = "#f0f0f0";
    menuDiv.style.zIndex = me.grid.contextMenuZIndex;
    menuDiv.onselectstart = function(e) { return false; };
    if (typeof menuDiv.style.MozUserSelect!="undefined") menuDiv.style.MozUserSelect = "none";    
    
    table = document.createElement("table");
    table.border = 0;
    table.cellPadding = 3;
    table.cellSpacing = 0;
    table.style.width = "175px";
    me.hide();
    menuDiv.appendChild(table);
    me.grid.container.appendChild(menuDiv);
  };
  
  this.show = function() {
    var numOptions = buildMenu();
    if (numOptions == 0) {
      me.hide();
      return;
    }
    var left = 0;
    var top = 0;
    if (me.toolbar != null) {
      left = me.toolbar.div.offsetLeft + 119;
      top = me.toolbar.div.offsetTop + 47;
      if (me.toolbar.div.offsetTop > (me.menuOptions.length * 22) - 45) {
        top = top - (me.menuOptions.length * 22) + 1;
      }
    }
    if (me.clickEvent != null) {
      left = pui.getMouseX(me.clickEvent);
      top = pui.getMouseY(me.clickEvent);
      // maxLeft keeps the menu from falling past the edge of the container/page.
      var maxLeft = document.body.scrollWidth - menuDivWidth;
      var offset = {x:0, y:0};
      var gridParent = me.grid.tableDiv.parentNode;
      if (context == "dspf") {
        // Get the parent container's offset.
        if( gridParent.getAttribute("container") == "true"){
          offset = pui.layout.getContainerOffset(gridParent);
          offset.x += pui.runtimeContainer.offsetLeft;
          offset.y += pui.runtimeContainer.offsetTop;

          // If the grid is inside a container whose overflow x is hidden,
          // then the maxLeft value should be adjusted to keep the context menu
          // inside the layout. See issue 2544 for test cases.
          var parentRight = gridParent.offsetLeft + gridParent.offsetWidth;
          if( parentRight > 0 && (gridParent.style.overflowX == "hidden"
            || gridParent.style.overflow == "hidden") ){
            // The left shouldn't be farther than parentRight - width of menu.
            maxLeft = parentRight - menuDivWidth;

            var grandParent = gridParent.parentNode;
            if(grandParent != null){
              // If the grandparent is scrolled right, then maxLeft should be larger.
              if(grandParent.scrollLeft > 0)
                maxLeft += grandParent.scrollLeft;

              // Compensate for vertical scrollbar.
              if(grandParent.style.overflowY == "scroll" || grandParent.style.overflowY == "auto")
                maxLeft -= 10;            
            }//endif grandParent != null.
          }
          
          // Look for a PUI window, compensate for its offsets.
          // This fixes screens with "center window" true. See issue 2544 for test cases.
          // Only affects grids inside a layout/container.
          var acont = pui["getActiveContainer"]();
          if( acont != null && acont.isPUIWindow === true){
            offset.x += acont.offsetLeft;
            offset.y += acont.offsetTop;
          }
        }//endif container.
        // Grid is not inside a layout/container. See 2612 for test cases.
        else{
          var ctrOffset = pui.getOffset(gridParent);
          offset.x = ctrOffset[0];
          offset.y = ctrOffset[1];
        }
      }
      // Grid is not in a display file.
      else {
        var ctrOffset = pui.getOffset(gridParent);
        offset.x = ctrOffset[0];
        offset.y = ctrOffset[1];
      }
      top = top - offset.y;
      left = left - offset.x;
      if (left > maxLeft) left = maxLeft;
    }
    menuDiv.style.left = left + "px";
    menuDiv.style.top = top + "px";
    menuDiv.style.display = "";
  };
  
  this.hide = function() {
    menuDiv.style.display = "none";
  };

  // Private functions
  function buildMenu() {

    // remove any existing menu options so they can be rebuilt
    while(table.rows.length > 0) { 
      table.deleteRow(table.rows.length - 1);
    }
  
    // When using CSS url(), the URLs given must be qualified with https:// in SSL mode.
    // IE issues security warnings if this is not done.
    var imageBaseURL = "";
    if (HTTPS == "ON") {
      imageBaseURL = "https://" + HTTP_HOST;
    }
    imageBaseURL += "/profoundui/proddata/images/";

    var menuOptions = [];
    var menuIcons = [];
    var optionHandlers = [];
    if (me.grid.sortable && me.cell.sortColumn != null) {
      menuOptions.push(pui["getLanguageText"]("runtimeText", "sort ascending text"));
      menuIcons.push("icons/sort_ascending.png");
      optionHandlers.push(function() {
        me.cell.sortDescending = true;
        me.cell.sortColumn();
      });
      menuOptions.push(pui["getLanguageText"]("runtimeText", "sort descending text"));
      menuIcons.push("icons/sort_descending.png");
      optionHandlers.push(function() {
        me.cell.sortDescending = false;
        me.cell.sortColumn();
      });
    }
        
    if ( menuOptions.length > 0 && (me.grid.findOption || me.grid.filterOption) ) {
      menuOptions.push("-");
      menuIcons.push(null);
      optionHandlers.push(null);
    }
    
    if (me.grid.findOption) {
      menuOptions.push(pui["getLanguageText"]("runtimeText", "find text") + "...");
      menuIcons.push("icons/search.png");
      optionHandlers.push(function() {
        me.grid["startFind"](me.cell);
      });
    }
  
    if (me.grid.filterOption) {
      menuOptions.push(pui["getLanguageText"]("runtimeText", "filter text") + "...");
      menuIcons.push("icons/filter.png");
      optionHandlers.push(function() {
        me.grid["startFilter"](me.cell);
      });
    }
	
    if (me.grid.filterOption && me.cell.filterIcon != null) {
      menuOptions.push(pui["getLanguageText"]("runtimeText", "remove filter"));
      menuIcons.push("icons/remove_filter.png");
      optionHandlers.push(function() {
        me.grid["removeFilter"](me.cell);
      });
    }

    if (me.grid.filterOption && me.grid.getFilterCount() > 1) {
      menuOptions.push(pui["getLanguageText"]("runtimeText", "remove filters text"));
      menuIcons.push("icons/remove_filter.png");
      optionHandlers.push(function() {
        me.grid["removeAllFilters"]();
      });
    }
    
	if (me.grid.resetOption) {
      menuOptions.push(pui["getLanguageText"]("runtimeText", "reset data"));
      menuIcons.push("icons/default.png");
      optionHandlers.push(function() {
       var properties = me.grid.cells[0][0].parentNode.pui.properties;
        
        me.grid["alignColumnTotals"]();

        // Restore column order.
        var headerRow = me.grid.cells[0];
        for (var i = 0; i < headerRow.length; i++) {
          var headerCell = headerRow[i];
          if (headerCell.col != headerCell.columnId)
            me.grid.moveColumn(headerCell.col, headerCell.columnId );
        }
        
        // Reset column widths - must follow calls to moveColumn.
        var colWidths = properties["column widths"];
        me.grid.setColumnWidths(colWidths);
        me.grid.sizeAllCells();
        
        me.grid.sortIcon = null; //Prevent sortIcon from being drawn.

        me.grid.setHeadings(); //Redraws column headings, including icons; but if order wasn't restored, the headings don't match the content.
          
         //if expand to layout is set true then expand the current grid for reset option 
         if (properties["expand to layout"] == "true" || properties["expand to layout"] == true){
             me.grid.doExpandToLayout();
         }
         
        // Reset sort order.
        if (me.grid.isDataGrid() ){
          me.grid.sortBy = me.grid.initialSortColumn; //(Null is OK.)
        }else{
          //TODO: Load-all grid.
        }
        
        me.grid["removeAllFilters"]();
        me.grid["clearState"]();

		});
    }
	
    if ( (me.grid.exportOption == true) ||
         (me.grid.exportOption == null && me.grid.pagingBar != null && me.grid.pagingBar.csvExport) ) {
      if (menuOptions.length > 0 && menuOptions[menuOptions.length - 1] != "-") {
        menuOptions.push("-");
        menuIcons.push(null);
        optionHandlers.push(null);
      }
      menuOptions.push(pui["getLanguageText"]("runtimeText", "export to x",["Excel (CSV)"]) + "...");
      menuIcons.push("grids/excel.gif");
      optionHandlers.push(function() {
        me.grid.exportCSV();
      });
      menuOptions.push(pui["getLanguageText"]("runtimeText", "export to x",["Excel (XLSX)"]) + "...");
      menuIcons.push("grids/excel.gif");
      optionHandlers.push(function() {
        me.grid.exportCSV(null,true);
      });
    }

    for (var i = 0; i < menuOptions.length; i++) {
      var row = table.insertRow(i);
      row.style.color = "#333333";
      if (menuOptions[i] == "-") {
        var sepCell = row.insertCell(0);
        sepCell.colSpan = 2;
        var sepDiv = document.createElement("div");
        sepDiv.style.backgroundColor = "#e0e0e0";
        sepDiv.style.borderBottomColor= "#ffffff";
        sepDiv.style.borderBottomWidth= "1px";
        sepDiv.style.borderBottomStyle= "solid";
        sepDiv.style.height = "1px";
        sepDiv.style.lineHeight = "1px";
        sepDiv.style.fontSize = "1px";
        sepDiv.style.paddingTop = "0px";
        sepDiv.style.paddingBottom = "0px";
        sepDiv.style.width = "100%";
        sepCell.appendChild(sepDiv);
        continue;
      }
      row.style.cursor = "pointer";
      row.style.padding = "3px";
      row.onmouseover = function(e) {
        var obj = getTarget(e).parentNode;
        obj.style.backgroundColor = "#3399ff";
        obj.style.color = "#ffffff";
      };
      row.onmouseout = function(e) {
        var obj = getTarget(e).parentNode;
        obj.style.backgroundColor = "";
        obj.style.color = "#333333";
      };

      row.optionHandler = optionHandlers[i];
      row.onclick = function(e) {
        var obj = getTarget(e).parentNode;
        obj.optionHandler();
        me.hide();
      };

      var imgCell = row.insertCell(0);
      imgCell.style.width = "20px";
      var imageName = menuIcons[i];
      if (imageName != null) {
        imgCell.style.backgroundImage = "url('" + imageBaseURL + imageName + "')";
        imgCell.style.backgroundPosition = "center";
        imgCell.style.backgroundRepeat = "no-repeat";
      }
      imgCell.style.padding = "3px";
      var optionCell  = row.insertCell(1);
      optionCell.innerHTML = menuOptions[i];
      optionCell.style.fontFamily = "Sans-serif";
      optionCell.style.fontSize = "12px";
      //optionCell.style.fontWeight = "bold";
      optionCell.style.padding = "3px";
      optionCell.style.whiteSpace = "normal";
    }
    
    return menuOptions.length;
  }
  
  this.destroy = function() {
    if (menuDiv != null) {
      if (menuDiv.parentNode != null) menuDiv.parentNode.removeChild(menuDiv);      
      menuDiv = null;
      table = null;
      me.clickEvent = null;
      me.grid = null;
      me = null;
    }
  };

};
