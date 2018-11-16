//  Profound UI Runtime  -- A Javascript Framework for Rich Displays
//  Copyright (c) 2018 Profound Logic Software, Inc.
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
  var menuSubDiv;
  var menuDivWidth = 185; //Used to avoid positioning off screen right.
  var menSubDivShowing = false;
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
        if (menSubDivShowing) return;
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
    menuDiv.oncontextmenu = function(e) { return false; };
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
          // Handle overflow scroll for column list in an container
          if (menuSubDiv) {
            var containerHeight = gridParent["getBoundingClientRect"]()["height"];
            menuSubDiv.gridHeight = containerHeight;
          }
        }//endif container.
        // Grid is not inside a layout/container. See 2612 for test cases.
        else{
          var ctrOffset = pui.getOffset(gridParent);
          offset.x = ctrOffset[0];
          offset.y = ctrOffset[1];
          // Handle overflow scroll for column list
          if (menuSubDiv) {
            menuSubDiv.gridHeight = window.innerHeight;
          }
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
    if (menuSubDiv) {
      me.grid.container.appendChild(menuSubDiv);
      menuSubDiv.style.display = '';
      menuSubDiv.style.top = (top + menuSubDiv.row.offsetTop) + 'px';
      if (menuSubDiv.gridHeight && menuSubDiv.menuHeight) {
        var menuHeight = menuSubDiv.menuHeight;
        var gridHeight = menuSubDiv.gridHeight;
        if (menuHeight > gridHeight / 2) {
          menuSubDiv.style.height = gridHeight / 2 + 'px';
          menuSubDiv.style.overflowY = 'scroll';
        } else {
          menuSubDiv.style.overflowY = 'initial';
          menuSubDiv.style.height = 'auto';
        }
      }
      if (menuDiv.offsetLeft === maxLeft || left + menuDiv.offsetWidth > maxLeft) {
        // the offsetWidth changes when you change the left
        var menuSubDivWidth = menuSubDiv.offsetWidth;
        menuSubDiv.style.left = (menuDiv.offsetLeft - menuSubDiv.offsetWidth) + 'px';
        if (menuSubDiv.offsetWidth !== menuSubDivWidth)  menuSubDiv.style.left = (menuDiv.offsetLeft - menuSubDiv.offsetWidth) + 'px';
      }  
      else menuSubDiv.style.left = (menuDiv.offsetLeft + menuDiv.offsetWidth) + 'px';
      menuSubDiv.style.display = 'none';
    }
  };
  
  this.hide = function() {
    menuDiv.style.display = "none";
    if (menuSubDiv) me.hideSub();
  };
  this.hideSub = function() {
    menuSubDiv.style.display = "none";
  };
  this.showSub = function() {
    menuSubDiv.style.display = '';
  };
  // Private functions
  function buildMenu() {

    // remove any existing menu options so they can be rebuilt
    while(table.rows.length > 0) { 
      table.deleteRow(table.rows.length - 1);
    }
    if (menuSubDiv) menuSubDiv.parentNode.removeChild(menuSubDiv);
    // When using CSS url(), the URLs given must be qualified with https:// in SSL mode.
    // IE issues security warnings if this is not done.
    var imageBaseURL = "";
    if (HTTPS == "ON") {
      imageBaseURL = "https://" + HTTP_HOST;
    }
    imageBaseURL += "/profoundui/proddata/images/";

    var menuOptions = [];
    var menuLists = [];
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
  
    //Show Filter... if enabled. If it's a paging grid, only allow filtering up to the maximum specified in "filter response column max" property.
    if (me.grid.filterOption && (!me.grid.usePagingFilter() || me.grid.getFilterCount() < me.grid.filterResponseColMax )) {
      
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
        if (me.grid.hidableColumns) {
          var headings = properties["column headings"].split(',');
          var cols = me.grid.columnInfo.map(function(col) {
            if (!col["showing"]) me.grid.hideShowColumn(col, true);
          });
          if (me.grid.columnInfo.colSequence) me.grid.columnInfo.colSequence = null;
          while (headings.length < cols.length) headings.push('');
        }
        // Restore column order.
        var headerRow = me.grid.cells[0];
        for (var i = 0; i < headerRow.length; i++) {
          var headerCell = headerRow[i];
          if (headerCell.col != headerCell.columnId)
            me.grid.moveColumn(headerCell.col, headerCell.columnId);
        }
        
        // Reset column widths - must follow calls to moveColumn.
        var colWidths = properties["column widths"];
        me.grid.setColumnWidths(colWidths);
        me.grid.sizeAllCells();
        me.grid.sortIcon = null; //Prevent sortIcon from being drawn.
          
        //if expand to layout is set true then expand the current grid for reset option 
        if (properties["expand to layout"] == "true" || properties["expand to layout"] == true){
            me.grid.doExpandToLayout();
        }
         
        // Reset sort order.
        if (me.grid.isDataGrid()){
          me.grid.sortBy = me.grid.initialSortColumn; //(Null is OK.)
        }else{
          //TODO: Load-all grid.
        }
        if (headings) me.columnHeadings = headings;
        me.grid.setHeadings(); 

        me.grid["removeAllFilters"]();
        me.grid["clearState"]();
		  });
    }

    if (me.grid.hidableColumns) {
      menuIcons.push("icons/grid.png");
      menuOptions.push(pui["getLanguageText"]("runtimeText", "displayed columns"));
      
      var cols = me.grid.columnInfo;
      // if the grid is movable and the user has moved the columns
      // adjust the sequence the column options show in the menu
      if (me.grid.movableColumns && cols.colSequence) {
        var hiddenCols = [];
        cols.filter(function(col){
          if (col["currentColumn"] == -1 && !col["showing"]) {
            hiddenCols.push(col);
            return false;
          }
          return true;
        })
        .sort(function(a, b) {
         var colA = a["currentColumn"];
         var colB = b["currentColumn"];
         var colAHidden = false;
         var colBHidden = false;
         if (colA == -1) {
          colAHidden = true;
          colA = me.grid.getCurrentColumnFromId(a["columnId"]);
         }
         if (colB == -1) {
          colBHidden = true;
          colB = me.grid.getCurrentColumnFromId(b["columnId"]);
         }
         if (colA == colB) {
           if (colAHidden && !colBHidden) return 1;
           else return -1;
         }
         if (colA > colB) return 1;
         else return -1;
        })
        .forEach(function(col) { menuLists.push(col); });
        hiddenCols.forEach(function(col) { menuLists.push(col); });
      } else {
        cols.forEach(function(col) { menuLists.push(col); });
      }
      
      optionHandlers.push(function(colOption) {
        me.grid["alignColumnTotals"]();
        return me.grid.hideShowColumn(colOption);
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
      row.optionHandler = optionHandlers[i];
      if (menuOptions[i] != pui["getLanguageText"]("runtimeText", "displayed columns")) {
        row.onclick = function(e) {
          var obj = getTarget(e).parentNode;
          obj.optionHandler();
          me.hide();
        };
        row.isHideColOption = false;
      } 
      row.onmouseover = function(e) {
        var obj = getTarget(e).parentNode;
        if (obj.tagName == 'TD') obj = obj.parentNode;
        obj.style.backgroundColor = "#3399ff";
        obj.style.color = "#ffffff";
        if (me.grid.hidableColumns && this.isHideColOption) me.showSub();
      };
      row.onmouseout = function(e) {
        if (me.grid.hidableColumns && this.isHideColOption) {
          // For IE 8, check if the event is defined
          if (e) {
            var tgt = e.relatedTarget || e.toTarget;
            if (tgt && tgt == menuDiv) return;
            me.hideSub();
          }
        }
        var obj = getTarget(e).parentNode;
        if (obj.tagName == 'TD') obj = obj.parentNode;
        obj.style.backgroundColor = "";
        obj.style.color = "#333333";
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
      if (menuOptions[i] == pui["getLanguageText"]("runtimeText", "displayed columns")) {
        var parent = document.createElement('div');
        var subTable = document.createElement('table');
        subTable.border = 0;
        subTable.cellPadding = 3;
        subTable.cellSpacing = 0;
        optionCell.innerHTML = menuOptions[i];
        var arrow = document.createElement("img");
        arrow.src = pui.normalizeURL("/profoundui/proddata/images/menus/submenu-arrow.gif");
        arrow.style.position = "absolute";
        arrow.style.right = "3px";
        arrow.style.paddingTop = "3px";
        arrow.isSubMenuArrow = true;
        optionCell.appendChild(arrow);
        for (var z = 0; z < menuLists.length; z++) {
          var col = menuLists[z];
          var subRow = subTable.insertRow(z);
          subRow.style.color = "#333333";
          subRow.style.padding = "3px";
          subRow.style.cursor = 'pointer';
          subRow.onmouseover = function(e) {
            var obj = getTarget(e).parentNode;
            if (obj.tagName == 'TD') obj = obj.parentNode;
            obj.style.backgroundColor = "#3399ff";
            obj.style.color = "#ffffff";
          };
          subRow.onmouseout = function(e) {
            var obj = getTarget(e).parentNode;
            if (obj.tagName == 'TD') obj = obj.parentNode;
            obj.style.backgroundColor = "";
            obj.style.color = "#333333";
          };
          subRow.optionHandler = row.optionHandler;
          subRow.col = col;
          var checkBox = subRow.insertCell(0);
          checkBox.innerHTML = '<input type="checkbox" style="transform:scale(1.25); cursor:pointer;"' + (col["showing"]? 'checked': '') + '/>';
          var subCell = subRow.insertCell(1);
          subCell.innerHTML = col["name"];
          subCell.style.fontFamily = "Sans-serif";
          subCell.style.fontSize = "12px";
          subCell.style.padding = "3px 6px 3px 3px";
          subCell.style.whiteSpace = "normal";
          subRow.style.top = ((z + 1) * 25) + 'px';
          subRow.onmousedown = function(e) {
            menSubDivShowing = true;
            var target = getTarget(e);
            var obj = this;
            var checkBox = this.getElementsByTagName('input')[0];
            // If the user did not click on the checkbox, toggle the checkbox.
            var col = obj.col;
            var success = obj.optionHandler(col);
            if (target.tagName != 'INPUT' && success) {
              if (checkBox.checked) checkBox.checked = false;
              else checkBox.checked = true;
            }
            // me.hide();
          };
        }
        row.onclick = function() {
          this.classList.add('active-item');
        };
        row.isHideColOption = true;
        parent.row = row;
        parent.appendChild(subTable);
        parent.className = 'pui-hide-show-columns-list';
        parent.onmouseover = function (e) {
          menSubDivShowing = true;
          me.showSub();
        };
        parent.onmouseout = function (e) {
          menSubDivShowing = false;
        };
        if (me.grid.tableDiv) {
          var listHeight = (z + 1) * 25;
          parent.menuHeight = listHeight; 
        }
        menuSubDiv = parent;
        me.hideSub();
      }
      else optionCell.innerHTML = menuOptions[i];
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
      if (menuSubDiv && menuSubDiv.parentNode != null) menuSubDiv.parentNode.removeChild(menuSubDiv);      
      menuDiv = null;
      menuSubDiv = null;
      table = null;
      me.clickEvent = null;
      me.grid = null;
      me = null;
    }
  };

};
