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
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
//  GNU Lesser General Public License for more details.
//
//  You should have received a copy of the GNU Lesser General Public License
//  In the COPYING and COPYING.LESSER files included with the Profound UI Runtime.
//  If not, see <http://www.gnu.org/licenses/>.

/**
 * Base class for Grids that contains the data and data methods. (Some display logic belongs in subclasses so the grid can 
 * be implemented differently without breaking existing screens; e.g. mobile and accessibility could be in other classes.)
 * 
 * todo: grid data should be stored inside the class (model), not inside the DOM (view). the DOM should render when the view needs updating. e.g. 
 *       columnInfo object contains header values when columns are hidden, but data is in me.cells[0] otherwise. Move data to columnInfo always.
 * @constructor
 */
pui.BaseGrid = function(){
  this.dataArray = [];              //A collection of objects containing data for each subfile record.
  this.visibleDataArray = [];      //A subset of the records in this.dataArray.
  this.fieldNames = [];
  
  this.expandToLayout = false;
};
pui.BaseGrid.prototype = Object.create(pui.BaseClass.prototype);  //Inherit the deleteOwnProperties method.

/**
 * Return true if the properties window should prevent the user from changing a property under certain circumstances.
 * @param {String} property
 * @returns {Boolean}
 */
 pui.BaseGrid.prototype.isPropertyReadOnly = function(property){
  switch (property){
    case "number of rows":
    case "height":
      return this.expandToLayout;
  }
  return false;
};

/**
 * @param {Object} itm
 * @param {String} propertyName
 * @param {type} value
 * @returns {Boolean}
 */
pui.BaseGrid.prototype.sendPropertyToDesigner = function(itm, propertyName, value) {
  var stringValue = String(value);
  if (itm.properties[propertyName] != stringValue) {
    if (pui.isBound(itm.properties[propertyName])) {
      if (propertyName == "top" || propertyName == "left") itm.properties[propertyName].designValue = stringValue;
    }
    else {
      itm.properties[propertyName] = stringValue;
    }
    itm.propertiesChanged[propertyName] = true;
    itm.changed = true;
    itm.designer.changedScreens[itm.designer.currentScreen.screenId] = true;
    return true;
  }
  return false;
};

//
// End of BaseGrid class.
//


/**
 * Grid Class.
 * Implemented with absolutely positioned DIV cells, DIV horizontal lines, and DIV vertical lines.
 * @constructor
 */

pui.Grid = function () {
  pui.BaseGrid.call(this);  //Call the parent constructor to set inherited properties--this.dataArray, this.fieldNames, etc.
  
  // public properties
  if (pui.designer.DataFields != null) {
    this.dataFields = new pui.designer.DataFields();
    this.dataFields.forGrid = true;
  }
  else {
    // dummy object
    this.dataFields = {};
    this.dataFields.forGrid = true;
    this.dataFields.addUsage = function () {};
    this.dataFields.removeUsage = function () {};
    this.dataFields.removeDesignItem = function () {};
    this.dataFields.removeUnused = function () {};
  }
  this.cleared = true;
  this.runtimeChildren = [];
  this.forceDataArray = false;

  this.ref = {}; // reference field info

  this.recordFormatName = "";

  this.vLines = [];
  this.hLines = [];
  this.tableDiv = null;
  this.mainClass = "";
  this.cells = [];
  this.container = null;
  this.borderColor = "";
  this.borderWidth = null;

  this.cellCursor = "default";

  this.scrollToolTip = "row number";

  this.defaultColumnWidth = 75;
  this.rowHeight = 26;
  this.headerHeight = 30;
  this.hasHeader = true;
  this.showQuickFilters = false;
  this.sortable = false;
  this.sorted = false;
  this.sortBy = null;
  this.rowsHidden = 0;    //Count of how many rows are hidden.
  this.hoverEffect = false;
  if (context == "dspf" || pui.usingGenieHandler) this.hoverEffect = true;
  this.pagingScrollBar = true;
  this.slidingScrollBar = false;
  if (context == "dspf" || pui.usingGenieHandler) {
    this.pagingScrollBar = false;
    this.slidingScrollBar = true;
  }

  // object property setting for maximum number of columns permitted in a Grid
  this.maxNumberOfColumns = 100;
  this.rowclicked = 0;
  this.columnclicked = 0;

  this.subfileEnd = false;

  this.subfileHidden = false;

  this.pagingBar = new pui.PagingBar();

  this.visibility = "";

  this.columnHeadings = [];
  this.columnInfo = [];

  this.validationTips = {};

  this.selectedColumn = null;

  this.cellProps = {};
  this.cellProps["font family"] = "Verdana";
  this.cellProps["font size"] = "13px";
  this.cellProps["text align"] = "center";
  this.cellProps["header font color"] = "#ffffff";
  this.cellProps["header background"] = "#6699ff";
  this.cellProps["header image"] = "";
  this.cellProps["header font weight"] = "bold";
  this.cellProps["header font style"] = "normal";
  this.cellProps["row font color"] = "";
  this.cellProps["row background"] = "";
  this.cellProps["odd row font color"] = "#555555";
  if (context == "genie") this.cellProps["odd row font color"] = "";
  //this.cellProps["odd row background"] = "#e5f1f4";
  this.cellProps["odd row background"] = "#efefef";
  this.cellProps["even row font color"] = "#555555";
  if (context == "genie") this.cellProps["even row font color"] = "";
  //this.cellProps["even row background"] = "#f8fbfc";
  this.cellProps["even row background"] = "#fcfcfc";
  this.cellProps["hover font color"] = "#555555";
  this.cellProps["hover background"] = "#dfe8f6";
  this.cellProps["hover image"] = "";
  this.cellProps["selection font color"] = "#ffffff";
  this.cellProps["selection background"] = "#6699cc";
  this.cellProps["selection image"] = "";

  this.cellPropDefaults = {};
  for (var prop in this.cellProps) {
    this.cellPropDefaults[prop] = this.cellProps[prop];
  }

  /**
   * An object with properties like "starting row" set when Genie detects subfiles, and database-driven properties like "database file". Exported for #5079.
   */
  this["dataProps"] = {};

  this.paddingProps = {};

  this.events = {};

  this.designMode = false;
  this.lockedInPlace = false;
  this.dragging = false;
  this.dragdropBusy = false;    //Sliding scrollbar should avoid scrolling the page when this is true. set in dragDrop.js.
  this.hBorderZIndex = 96;
  this.vBorderZIndex = 97;
  this.scrollZIndex = 97;
  this.iconZIndex = 99;
  this.contextMenuZIndex = 100;
  this.rowZoomZIndex = 701;
  this.moveColumnZIndex = 702;

  this.scrollbarObj = null;

  this.totalRecs = null; //The total number of records in a resultset for data grids.

  this.exportFileName = null;
  this.exportWithHeadings = false;
  this.exportVisableOnly = false;

  this.findOption = false;
  this.filterOption = false;
  this.filterByValOption = false;
  this.movableColumns = false;
  this.hidableColumns = false;
  this.resetOption = false;
  this.exportOption = null;

  this.dontSelect = false;

  this.selectionEnabled = false;
  this.singleSelection = false;
  this.extendedSelection = false;
  this.selectionField = null;
  this.hiddenField = null;
  this.treeLevelData = null;
  this.gridTree = null;
  this.treeLevelDataInitDone = false;
  this.hasTreeLevelColumn = false;
  this.treeLevelField = null;
  this.treeLevelColumnId = null;
  this.treeLevelItemId = "_____puiButtonToggleTreeLevel";
  this.lastSelectedRRN = null;
  this.hiddenFieldIndex = null;
  this.selectionFieldIndex = null;
  this.selectionValue = "1";
  this.selectedRecordNum = null;  //Determines where a range starts to handle shift+click multiple selections.
  this.filterResponseTextMax = 20;
  this.filterResponseColMax = 3;
  this.filterResponse = null; //Indicates a column was filtered for paging grid; also used by pui.respond.

  this.rowFontColorField = null;
  this.rowFontColorFieldIndex = null;
  this.rowBackgroundField = null;
  this.rowBackgroundFieldIndex = null;

  this["expanded"] = true;
  this.initCollapsed = null;
  this.initExpanded = null;
  this.foldMultiple = 1;
  this.singleRowZoom = false;

  this.fileId = null;
  this.placeCursorRRN = null;

  this.defaultSortOrderArray = [];
  this.initialSortColumn = null;      //Value is null or a number value.
  this.initialSortField = null;
  this.columnSortResponse = null;
  this.fieldNameSortResponse = null;
  this.returnSortOrder = null;
  this.initialSortColumnMulti = null; //Array if "initial sort column" is a comma-separated list.
  this.initialSortFieldMulti = null; //Array if "initial sort field" is a comma-separated list.
  this.initialSortFieldMultiData = []; //Array if "initial sort field" is a comma seperated list and the grid is a Data grid
  
  this.contextMenuId = null;

  this.dataConsumed = false;

  this.initialPageNumber = 1;

  this.ffbox = new pui.FindFilterBox(pui.runtimeContainer, this);
  this.ffHeaderCell = null;  //Is set in startFind and startFilter and read in find and doFilter. Indicates which column is finding/filtering.

  this.highlighting = {
    columnId: 0,
    col: 0,
    text: ""
  };

  this.propagateScrollEvents = false;
  this.getCurrentColumnFromId = getCurrentColumnFromId;
  // Prevents attaching on scroll events and drawing scrollbar twice. Needed for grids in lazy load layouts.
  this.scrollBarsSetupAfterRender = false;

  this.storageKey = null;
  this.storedState = null;    //Used with server-side Persist State. https://docs.profoundlogic.com/x/CoC7Aw
  
  // Expose these closured functions to the object so that prototyped methods can reach them. (Avoids having to move everything into prototypes at once.)
  this._setLineTops = setLineTops;
  this._setLineHeights = setLineHeights;
  this._positionIcons = positionIcons;
  
  var me = this;

  var addRowIcon;
  var removeRowIcon;
  var addColumnIcon;
  var removeColumnIcon;
  var nwHandle;
  var neHandle;
  var swHandle;
  var seHandle;
  var minBWidth = 1;
  var designBorderStyle = "solid";
  var persistState = false;
  var sessionState = false;
  var programState = false;
  var movableColumns = false;
  var resizableColumns = false;
  var columnSignature;
  var clientSortColumnId;
  var customGridSortFunction; 

  var headerCellProxy;
  var headerCellProxyContainer;
  var columnPointer;

  var loadingDiv = null;
  var maskCover = null;
  var animationDiv = null;

  // Prevent filtering too quickly on dataGrids. Grid state can get buggy if you change
  // filters while a prior AJAX request has been sent but the response is not received.
  var waitingOnRequest = false;

  var dataGridDidInitialSort = false; //Becomes true after setting up initial sort column in getData.
  var dataGridDidInitialSortOnce = false; //If initial sort was done once in getData()
  var suppressGetData = false; //Keep getData from running when called in functions already inside getData
  var dataGridDidRestoreState = false; //Becomes true after restoring datagrid state in getData.

  // These three members are only for data grids. They are passed to the CGI program.
  var findText;
  var findColumn;
  var findStartRow;

  var ondbload = null;
  
  var sortMultiOrder = [];    //Order of priority of sorting multiple columns.
  var sortMultiPanel = null;  //UI for picking multiple sort columns.
  var filterMultiPanel = null; //UI for picking multiple filters from a data list to set on one column.
  var filterMultiPanelLoading = null; //panel that shows while filterMultiPanel is loading

  this.enableDesign = function () {
    me.designMode = true;
    me.tableDiv.destroy = me.destroy;
    if (me.scrollbarObj != null) me.scrollbarObj.designMode = true;
    for (var i = 0; i < me.vLines.length; i++) {
      lineDesign(me.vLines, i, true);
    }
    for (var i = 0; i < me.hLines.length; i++) {
      lineDesign(me.hLines, i, false);
    }
    for (var row = 0; row < me.cells.length; row++) {
      for (var col = 0; col < me.cells[row].length; col++) {
        cellDesign(me.cells[row][col]);
      }
    }
    if (addRowIcon == null) {
      addRowIcon = createIcon("plus", "Add New Row");
      addRowIcon.onclick = function (event) {
        var itm = me.tableDiv.designItem;
        itm.designer.undo.start("Add Grid Row");
        itm.designer.undo.add(itm, "number of rows");
        me.addRow();
        me.mirrorDownAll();
        me.doExpandToLayout();
        me.selectMe();
      };
    }
    if (removeRowIcon == null) {
      removeRowIcon = createIcon("minus", "Remove Row");
      removeRowIcon.onclick = function () {
        var minRow = me.hasHeader ? 2 : 1;
        if (me.cells.length > minRow) {
          var itm = me.tableDiv.designItem;
          itm.designer.undo.start("Remove Grid Row");
          itm.designer.undo.add(itm, "number of rows");
          me.removeLastRowCells();
          me.doExpandToLayout();
          me.selectMe();
        }
      };
    }
    if (addColumnIcon == null) {
      addColumnIcon = createIcon("plus", "Add New Column");
      addColumnIcon.onclick = function () {
        var itm = me.tableDiv.designItem;
        if (itm.properties["number of columns"] > me.maxNumberOfColumns) {
          pui.alert("Maximum number of columns reached.")
          return;
        }
        itm.designer.undo.start("Add Grid Column");
        itm.designer.undo.add(itm, "column widths");
        itm.designer.undo.add(itm, "number of columns");
        me.addColumn();
        me.sizeAllCells();
        me.doExpandToLayout();
        me.selectMe();
      };
    }
    if (removeColumnIcon == null) {
      removeColumnIcon = createIcon("minus", "Remove Column");
      removeColumnIcon.onclick = function () {
        var lastCol = me.vLines.length - 2;
        if (lastCol < 1) return;
        if (me.hasChildren(lastCol)) {
          var arr1 = me.numberChildren(lastCol);
          if (arr1 != null) {
            pui.alert("The column cannot be removed because it contains other elements that must be removed first.\n\n" +
              "To remove column elements, go to the Elements tab. Then, search the element list for the ID(s) listed below:\n" +
              arr1.join("\n") + "\n\nSelect each element and click the Remove Element icon.");
          }
          return;
        }
        var itm = me.tableDiv.designItem;
        itm.designer.undo.start("Remove Grid Column");
        itm.designer.undo.add(itm, "column widths");
        itm.designer.undo.add(itm, "number of columns");
        itm.designer.undo.add(itm, "column headings");
        me.removeLastColumn();
        me.doExpandToLayout();
        me.selectMe();
      };
    }
    if (nwHandle == null) nwHandle = createHandle("nw");
    if (neHandle == null) neHandle = createHandle("ne");
    if (swHandle == null) swHandle = createHandle("sw");
    if (seHandle == null) seHandle = createHandle("se");

    me.tableDiv.customSelect = function () {
      if (!me.designMode) return;
      if (nwHandle != null) nwHandle.style.visibility = "";
      if (neHandle != null) neHandle.style.visibility = "";
      if (swHandle != null) swHandle.style.visibility = "";
      if (seHandle != null) seHandle.style.visibility = "";
    };

    me.tableDiv.customUnselect = function () {
      if (nwHandle != null) nwHandle.style.visibility = "hidden";
      if (neHandle != null) neHandle.style.visibility = "hidden";
      if (swHandle != null) swHandle.style.visibility = "hidden";
      if (seHandle != null) seHandle.style.visibility = "hidden";
    };

    me.clearData();

    if (me.visibility == "hidden") {
      me.doThisToTableDivs(function (domObj) {
        domObj.style.visibility = "";
      });
    }
    if (context == "genie" && me.contextMenuId != null) {
      var menu = getObj(me.contextMenuId);
      if (menu) {
        menu.style.visibility = "";
        menu.style.display = "";
      }
    }
    positionIcons();
    me.setScrollBar();
    me.pagingBar.attachDragDropEvents(cellDesign);
    me.sendToDesigner();
  };

  this.doExpandToLayout = function(force) {
    if (!force) {
      if (me.designMode && toolbar.loadingDisplay) return;
    }
    if (!me.expandToLayout) return;
    var container = me.tableDiv.parentNode;
    if (container.getAttribute("container") != "true") return;
    var height = container.offsetHeight;
    var width = container.offsetWidth;
    if (height === 0 && width === 0 && container.parentNode && container.parentNode.classList.contains("pui-tablayout-body")) {
      height = container.parentNode.offsetHeight - 2;
      width = container.parentNode.offsetWidth - 2;
    }
    var colWidths = me.getColumnWidths().split(",");
    var sum = 0;
    for (var i = 0; i < colWidths.length; i++) {
      var colWidth = colWidths[i];
      colWidth = Number(colWidth);
      colWidths[i] = colWidth;
      sum += colWidth;
    }
    var diff = (width - sum) / colWidths.length;
    diff = parseInt(diff);
    for (var i = 0; i < colWidths.length; i++) {
      colWidths[i] += diff;
    }
    me.setColumnWidths(colWidths);

    if (me.hasHeader) height -= me.headerHeight;
    if (me.pagingBar) height -= me.pagingBar.getHeight();
    var numRows = height / me.rowHeight;
    if (me.hasHeader) numRows += 1;
    numRows = parseInt(numRows);
    if (numRows < 1) numRows = 1;
    me.dontSelect = true;

    me["setNumberOfRows"](numRows);
    me.dontSelect = false;

    // set left and top to 0
    var diffLeft = parseInt(me.tableDiv.style.left);
    var diffTop = parseInt(me.tableDiv.style.top);
    me.doThisToTableDivs(function (domObj) {
      domObj.style.left = (parseInt(domObj.style.left) - diffLeft) + "px";
      domObj.style.top = (parseInt(domObj.style.top) - diffTop) + "px";
    });
    me.setScrollBar();
    me.setHeadings();
  };

  this.isInitCollapsed = function () {
    if (me.foldMultiple <= 1) return false;
    var collapsed = me.initCollapsed;
    if (me.initExpanded == true) collapsed = false; // initExpanded overrides initCollapsed
    if (me.initCollapsed == null && me.initExpanded == false) collapsed = true;
    if (collapsed == null) collapsed = false;
    return collapsed;
  };

  this.isTreeInitCollapsed = function () {
    if (me.treeLevelField === null)
      return false;
    var treeInitCollapsed = me.treeInitCollapsed;
    if (treeInitCollapsed === undefined)
      treeInitCollapsed = false;
    return treeInitCollapsed;
  };

  this.collapse = function (button) {
    //if (me.visibility == "hidden") return;
    if (!me["expanded"]) return;
    if (me.foldMultiple <= 1) return;
    if (me.zoomDiv != null) me.zoomDiv.style.display = "none";
    me["expanded"] = false;
    var rowCount = me.cells.length;
    if (me.hasHeader) rowCount -= 1;
    rowCount = rowCount * (me.foldMultiple - 1);
    if (!me.subfileHidden) {
      me.setProperty("row height", parseInt(me.rowHeight / me.foldMultiple));
      for (var i = 0; i < rowCount; i++) {
        me.addRow();
      }
      me.sizeAllCells();
      me.setAllCellStyles();
      me.getData();
      // disable any elements that are below the visible portion of the cell
      for (var row = 0; row < me.cells.length; row++) {
        for (var col = 0; col < me.cells[row].length; col++) {
          var cell = me.cells[row][col];
          var child = cell.firstChild;
          var height = parseInt(cell.style.height);
          if (isNaN(height)) continue;
          while (child != null) {
            var top = parseInt(child.style.top);
            if (isNaN(top)) top = 0;
            if (top > height && (child.tagName == "INPUT" || child.tagName == "SELECT" || child.tagName == "TEXTAREA") && !child.disabled) {
              child.reenableOnExpand = true;
              child.disabled = true;
            }
            child = child.nextSibling;
          }
          cell.scrollTop = 0;
        }
      }
    }
    if (button != null && button.tagName == "IMG") {
      button.src = pui.normalizeURL("/profoundui/proddata/images/icons/expandall.gif");
      button.title = pui["getLanguageText"]("runtimeText", "expandAll");
    }
  };

  this.expand = function (button) {
    if (me["expanded"]) return;
    if (me.foldMultiple <= 1) return;
    if (me.zoomDiv != null) me.zoomDiv.style.display = "none";
    me["expanded"] = true;
    var rowCount = me.cells.length;
    if (me.hasHeader) rowCount -= 1;
    rowCount = parseInt(rowCount / me.foldMultiple);
    rowCount = rowCount * (me.foldMultiple - 1);
    if (!me.subfileHidden) {
      me.setProperty("row height", me.rowHeight * me.foldMultiple);
      for (var i = 0; i < rowCount; i++) {
        me.removeLastRowCells();
      }
      me.sizeAllCells();
      me.setAllCellStyles();
      me.getData();
      // reenable any elements that were below the visible portion of the cell when collapsed
      for (var i = 0; i < me.runtimeChildren.length; i++) {

        var domEls = me.runtimeChildren[i].domEls;
        if (domEls) {

          for (var idx in domEls) {

            // This check in case custom properties were added to 
            // the array.
            if (!isNaN(parseInt(idx, 10))) {

              var dom = domEls[idx];

              if (dom.reenableOnExpand) {

                dom.reenableOnExpand = false;
                dom.disabled = false;

              }

            }

          }

        }

      }

      //for (var row = 0; row < me.cells.length; row++) {
      //  for (var col = 0; col < me.cells[row].length; col++) {
      //    var cell = me.cells[row][col];
      //    var child = cell.firstChild;
      //    while (child != null) {
      //      var top = parseInt(child.style.top);
      //      if (child.reenableOnExpand) {
      //        child.reenableOnExpand = false;
      //        child.disabled = false;
      //      }
      //      child = child.nextSibling;
      //    }
      //  }
      //}
    }
    if (button != null && button.tagName == "IMG") {
      button.src = pui.normalizeURL("/profoundui/proddata/images/icons/collapseall.gif");
      button.title = pui["getLanguageText"]("runtimeText", "collapseAll");
    }
  };

  this.toggle = function (button) {
    if (me["expanded"]) {
      me.collapse(button);
    }
    else {
      me.expand(button);
    }
  };

  this.setExpander = function (button) {

  };

  this["rowZoom"] = function (rowCells) {
    if (context != "dspf" && !pui.usingGenieHandler) return;
    if (typeof rowCells == "number") {
      var rowNum = rowCells - me.recNum;
      if (me.hasHeader) rowNum++;
      rowCells = me.cells[rowNum];
      if (rowCells == null) return;
    }
    if (me.zoomDiv == null) {
      me.zoomDiv = document.createElement("div");
      me.zoomDiv.style.height = (me.rowHeight * me.foldMultiple) + "px";
      me.zoomDiv.style.zIndex = me.rowZoomZIndex;
      me.zoomDiv.style.left = parseInt(me.tableDiv.style.left) + "px";
      me.zoomDiv.onclick = function () {
        me.zoomDiv.style.display = "none";
      };
      me.zoomDiv.onmouseout = function (e) {
        var target = e ? e.relatedTarget : event.toElement;
        try { // this is needed because of a ff bug that issues message: Permission denied to access property 'parentNode' from a non-chrome context
          if (target != null && target.parentNode != null) {
            if (target.parentNode == me.zoomDiv) return;
            if (target.parentNode.parentNode == me.zoomDiv) return;
          }
        }
        catch(e) {
        }
        me.zoomDiv.style.display = "none";
      };
      me.tableDiv.parentNode.appendChild(me.zoomDiv);
    }
    var width = parseInt(me.tableDiv.style.width);
    if (me.slidingScrollBar || me.pagingScrollBar) width = width - 21;
    me.zoomDiv.style.width = width + "px";
    me.zoomDiv.innerHTML = "";
    me.zoomDiv.className = me.tableDiv.className;
    me.zoomDiv.classList.add('zoomrow');
    me.zoomDiv.style.top = parseInt(me.tableDiv.style.top) + parseInt(rowCells[0].style.top) - parseInt(me.rowHeight * (me.foldMultiple - 1) / 2) + "px";
    for (var i = 0; i < rowCells.length; i++) {
      var cell = rowCells[i];
      var clone = cell.cloneNode(true);
      clone.style.top = "0px";
      clone.style.height = parseInt(me.zoomDiv.style.height) + 2 + "px";
      if (!pui.iPadEmulation) {
        clone.style.cursor = "pointer";
      }
      for (var j = 0; j < clone.childNodes.length; j++) {
        var child = clone.childNodes[j];
        if (child.getAttribute("isZoomIcon") == "true") {
          child.style.display = "none";
        }
        if (child.tagName == "INPUT") {
          var childClass = child.className;
          if (childClass == null) childClass = null;
          childClass += " PR";
          child.className = trim(childClass);
          child.readOnly = true;
        }
        if (child.tagName == "SELECT") {
          child.disabled = true;
        }
      }
      me.zoomDiv.appendChild(clone);
    }
    me.zoomDiv.style.display = "";
  };

  // Expose API call.
  this["exportXLSX"] = function (fileName) {
    return me.exportCSV(fileName, true);
  };

  /**
   * Build a CSV or XLSX document, and show a Save-As prompt in the browser.
   * 
   * @param {String} fileName     Base filename to use in the Save As prompt. When undefined, the
   *                              "export file name" property or the record format name is used.
   * @param {Boolean} exportXLSX  When true, exports to XLSX file. Else, exports as CSV.
   * @returns {undefined}
   */
  this.exportCSV = function (fileName, exportXLSX) {
    // If "xlsx export" is not set but a config flag is, then "Export to Excel" uses XLSX.
    if (!me.pagingBar.xlsxExport && (pui["csv exports xlsx"] === true || pui["csv exports xlsx"] === "true"))
      exportXLSX = true;

    var delimiter;
    if (typeof (pui["csv separator"]) == "string") {
      // This flag not defined by default.
      delimiter = pui["csv separator"];
    }
    else {
      delimiter = ",";
      if (pui.appJob != null && (pui.appJob["decimalFormat"] == "I" || pui.appJob["decimalFormat"] == "J")) {
        delimiter = ";";
      }
    }
    var stringDelimiter = '"';
    if (typeof (pui["csv string delimiter"]) == "string") {
       stringDelimiter = pui["csv string delimiter"];
    }
    if (me.designMode) return;
    if (fileName == null) fileName = me.exportFileName;
    if (fileName == null || fileName == "") fileName = me.tableDiv.id;

    if (me.isDataGrid() && me.forceDataArray == false) {
      if (exportXLSX) {
        me.exportExcel_DataGrid(fileName);
      } else {
        me.getData(fileName);
      }
      return;
    }
    
    if (context == "genie" && !pui.usingGenieHandler) {
      pui.alert("In 5250 mode, the \"csv export\" feature requires an SQL-driven subfile.");
      return;
    }

    fileName = encodeURIComponent(fileName);

    // initialize column array, each array element will hold the index to the dataArray, which has the records from the subfile.
    // Multiple widgets may use the same field, so there isn't a one-to-one relationship between columnArray, dataArray, and the export.
    var columnArray = [];
    var numericData = [];
    var graphicData = [];
    var boundVisibility = [];
    var boundValFormats = [];
    var imageData = [];
    var hyperlinks = [], columnIds = [];

    saveResponsesToDataArray(); //save any changes the user may have made to the widgets before exporting #6869
    
    var totalColumns = me.vLines.length - 1;
    if (me.hidableColumns && !me.exportVisableOnly) totalColumns = me.columnInfo.length; //More columns will export than there are ones visible.
    
    for (var i = 0; i < totalColumns; i++) {
      columnArray.push(-1);
      numericData.push(false);
      graphicData.push(false);
      boundVisibility.push(false);
      boundValFormats.push(false);
      imageData.push(false);
      hyperlinks.push(false);
      columnIds.push(-1);
    }

    var colcount = 0;

    // go through all grid elements, retrieve field names, and identify data index by field name   
    for (var i=0, n=me.runtimeChildren.length; i < n; i++) {
      var itm = me.runtimeChildren[i];
      // Look only for widgets that are not hidden.
      if (itm["visibility"] != "hidden") {
        var col = Number(itm["column"]);
        // If: "col" is valid and a widget for the column was not already found. (there can be multiple widgets per column, but only one exports).
        if (!isNaN(col) && col >= 0 && col < columnArray.length && columnArray[col] == -1) {
          if (pui.isBound(itm["visibility"])) {
            boundVisibility[col] = itm["visibility"];
          }
          var val = itm["value"];
          if (itm["radio button group"])
            val = itm["radio button group"];
          if (itm["field type"] == "html container") val = itm["html"];

          if (itm["field type"] == "image" && exportXLSX) val = itm["image source"];
          
          // Let hyperlinks export both bound values and bound references. (Feature 4579)
          if (itm["field type"] == "hyperlink"){
            var hyperlink = itm["hyperlink reference"];
            hyperlinks[col] = {};
            
            if (pui.isBound(hyperlink) && hyperlink["dataType"] != "indicator" && hyperlink["dataType"] != "expression") {
              // If the hyperlink reference is bound, then it should be exported with XLSX as a link.
              // Find the column for the hyperlink-reference fieldname.
              var fieldName = pui.fieldUpper(hyperlink["fieldName"]);
              for (var j=0, m=me.fieldNames.length; j < m; j++ ) {
                if (fieldName == me.fieldNames[j]) {
                  hyperlinks[col].linkBound = j;
                  break;
                }
              }
              
              if (!pui.isBound(val) || val["dataType"] == "indicator" || val["dataType"] == "expression") {
                // The regular value is not bound (or is indicator/expression), so use the hyperlink reference as the binding.
                hyperlinks[col].value = val;    //The value will be used as link text for each row.
                val = hyperlink;  //make sure the column is exported.
              }
            }else if(hyperlink != null && hyperlink.length > 0){
              // The link is hard-coded. The link will be used for every row.
              hyperlinks[col].link = hyperlink;
            }
          } //done handling hyperlink field.

          if (pui.isBound(val) && val["dataType"] != "indicator" && val["dataType"] != "expression") {
            var fieldName = pui.fieldUpper(val["fieldName"]);
            for (var j=0, m=me.fieldNames.length; j < m; j++ ) {
              if (fieldName == me.fieldNames[j]) {
                columnIds[col] = itm['columnId']; //Map the columnId to the mapping of columns -> me.dataArray.
                columnArray[col] = j;             //Map the column number to the corresponding index in fieldNames and me.dataArray.
                colcount++;

                if (val["formatting"] == "Number") {
                  numericData[col] = true;  //Needed for CSV exports when appjob uses comma decimal separators. #7351.
                }

                boundValFormats[col] = val;  //Save this info so we can format later.
                
                if (val["dataType"] == "graphic") {
                  graphicData[col] = true;
                }
                
                //If the item is an image, then it will be exported with XLSX.
                if (exportXLSX){
                  if (itm["field type"] == "image"){
                    //Set base-line values in case the domEl isn't set--something that shouldn't happen.
                    imageData[col] = { left: 2, top: 2, height: 16, width: 16 };
                    // Look for a picture that is visible in the grid.
                    if (itm.domEls != null && itm.domEls.length > 0){
                      for (var domelid=0; domelid < itm.domEls.length; domelid++){
                        if (itm.domEls[domelid] && itm.domEls[domelid].offsetWidth > 0 && itm.domEls[domelid].offsetHeight > 0 ){
                          imageData[col] = { left: itm.domEls[domelid].offsetLeft, top: itm.domEls[domelid].offsetTop,
                            height: itm.domEls[domelid].offsetHeight, width: itm.domEls[domelid].offsetWidth };
                          break;
                        }
                      }
                    }
                  } //done setting up picture dimensions for XLSX export.
                  else if (itm["field type"] == "hyperlink"){
                    if (hyperlinks[col].value == null ){    //Link text was not hard-coded; val is the text.
                      hyperlinks[col].valueBound = true;  //Flag that columnArray[col] has the location of the bound value.
                    }
                    //note: if val was the bound hyperlink, then hyperlinks[col].linkBound already has the location.
                  }
                } //done if exportXLSX.
                break;
              } //done handling found field name.
            } //done finding field name column for bound field.
          } //end if value is bound, not indicator, not expression.
        } //end if item column is valid.
      }
    }
    
    // Get widths and headings of all columns, including hidden ones. #6476.    
    var widths, headings, col, n, columnId;
    if (me.hidableColumns && !me.exportVisableOnly) {
      widths = []; headings = [];
      var matchesCurCol = function(el){ return el['columnId'] == columnId; };
      for (col=0, n=columnIds.length; col < n; col++) {
        columnId = columnIds[col];
        var heading='', width=100;
        if (columnId >= 0){
          // Find the entry in columnInfo for the currentColumn.
          var found = me.columnInfo.find(matchesCurCol);
          if (found){
            heading = found['blankHeader'] ? '' : found['name'];
            width = pui.safeParseInt(found['orginalWidth']);
          }
        }
        headings[col] = heading;
        widths[col] = width;
      }
    }

    var data = ""; //CSV data.
    var worksheet;
    var workbook;
    var drawing;
    var useDrawing = false;
    if (exportXLSX){
      worksheet = new pui.xlsx_worksheet(colcount);
      workbook = new pui.xlsx_workbook(worksheet);
      worksheet.defaultRowHeightpx = me.rowHeight;
      var widthsUse = [];
      
      if (!me.hidableColumns || me.exportVisableOnly) widths = me.getColumnWidths().split(",");
      
      for (var i = 0; i < columnArray.length && i < widths.length; i++) { //Get column widths. Omit any columns that are not being exported.
        if (columnArray[i] > -1) {
          widthsUse.push(Number(widths[i]));
        }
      }
      worksheet.setColumnWidths( widthsUse );
      drawing = new pui.xlsx_drawing();
      colcount = 0;
      // Look at each column containing a value, set the format. Use same order that cell values will use.
      for (var i = 0; i < columnArray.length; i++) {
        if (columnArray[i] > -1) {
          worksheet.setColumnFormat(boundValFormats[i], colcount); //pass data type, decPos, etc.
          colcount++;
        }
      }
    }

    //Build cell headings.
    var worksheetCol = 0;
    if (me.hasHeader && me.exportWithHeadings) {
      if (exportXLSX) worksheet.newRow();
      for (var i = 0; i < columnArray.length; i++) {
        var idx = columnArray[i];
        if (idx > -1) {
          var heading = "";
          if (me.hidableColumns && !me.exportVisableOnly) heading = headings[i];
          else heading = getInnerText(me.cells[0][i]);
          
          heading = heading.replace(/<br>/g, " ");
          if (exportXLSX) worksheet.setCell(rtrim(heading), worksheetCol++);
          heading = heading.replace(/"/g, '""');  // "  encode quotes
          heading = heading.replace("\n", "");  // chrome appends new line chars at the end of the heading when using getInnerText()
          heading = heading.replace("\r", "");
          if (data != "") data += delimiter;
          data += stringDelimiter + heading + stringDelimiter;
        }
      }
      
      if (exportXLSX) worksheet.headerRowHeightpx = me.headerHeight;
    }

    data = "\uFEFF" + data;
    
    // build csv or XLSX data    
    var dataRecords = me.dataArray;
    if (me.isFiltered()) dataRecords = me.visibleDataArray;
    for (var i = 0, n=dataRecords.length; i < n; i++) {
      var line = "";
      var record = dataRecords[i];
      if(record.hideRow != null && record.hideRow == true) continue;
      // build fieldData for use with pui.evalBoundProperties
      //  Note that fieldData is not necessarily in the same sequence as columnArray
      //    but this doesn't matter, since pui.evalBoundProperties does lookup by
      //    column name.

      var fieldData = {};
      if (record == null || record.length == 0) {
        fieldData.empty = true;
      }
      else {
        for (var j = 0; j < me.fieldNames.length; j++) {
          fieldData[me.fieldNames[j]] = record[j];
        }
      }

      // build CSV and XLSX data for this row.

      if (exportXLSX) worksheet.newRow();
      worksheetCol = 0;

      for (var j = 0, m=columnArray.length; j < m; j++) {
        var idx = columnArray[j];
        if (idx > -1) {
          var value = record[idx];
          
          if (hyperlinks[j] != null && hyperlinks[j].value != null){
            // value was a hard-coded href link, use it as cell text.
            value = hyperlinks[j].value;
          }
          
          if (graphicData[j] && (me['dataProps'] == null || me['dataProps']['load fields into widgets'] !== "true")) {
            // Decode values that the handler encoded in base64. (With load-fields-into-widgets, the CGI programs don't encode graphic fields.)
            value = pui.formatting.decodeGraphic(value);
          }

          if (!exportXLSX && numericData[j] && pui.appJob != null && (pui.appJob["decimalFormat"] == "I" || pui.appJob["decimalFormat"] == "J")) {
            if (typeof value !== 'string') value = String(value);  //PJS program could write number, null, or boolean.
            value = value.replace('.', ',');  //Data exported to CSV should use whatever decimal separator the application job uses. #7351.
          }

          var bndvalfmt = boundValFormats[j];
          if (typeof bndvalfmt === 'object' && bndvalfmt !== null){
            var formatting = bndvalfmt['formatting'];
            if (formatting === 'Date' || formatting === 'Time' || formatting === 'Time Stamp'){
              // Format CSV date same as rendered date; "0001-01-01" becomes "".
              value = pui.evalBoundProperty(bndvalfmt, fieldData, me.ref);
            }
          }
          
          if (boundVisibility[j] !== false) {
            if (pui.evalBoundProperty(boundVisibility[j], fieldData, me.ref) == "hidden") {
              value = "";
            }
          }
          
          var xlsxvalue = value; //XLSX need not escape quotes (").
          
          if (typeof value === 'string') value = value.replace(/"/g, '""');  //Escape all double-quotes. Note: type may be number. #4085.
          
          if (line != "") line += delimiter;
          line += stringDelimiter + rtrim(value) + stringDelimiter;
          
          if (exportXLSX){
            
            if (typeof imageData[j] == "object" && imageData[j] != null){   //The cell data is an image.
              useDrawing = true;
              worksheet.setCell("", worksheetCol);     //Add a blank cell.
              if (typeof xlsxvalue === 'string' && xlsxvalue.length > 0) 
                drawing.addImage(worksheet.lastRowNum, worksheetCol, xlsxvalue, imageData[j] );
            }
            else {
              //The cell data is a string or number and not an image.
              var linkstring = null;
              if (typeof hyperlinks[j] == "object" && hyperlinks[j] != null){
                // There is a hyperlink in the cell.
                if (hyperlinks[j].link != null){
                  linkstring = hyperlinks[j].link; //hard-coded link
                } else if(hyperlinks[j].linkBound != null){
                  linkstring = record[ hyperlinks[j].linkBound ];  //bound link.
                }
              }
              
              worksheet.setCell(rtrim(xlsxvalue), worksheetCol, linkstring);
            } //end else: cell data that is not an image.

            worksheetCol++;
          }
        }
      }
      if (data != "") data += "\n";
      data += line;
    } //done building data from subfile records.
    
    if (exportXLSX){
      if (useDrawing && me.pagingBar.xlsxExportPics ){
        // Export with pictures.
        worksheet.useDrawing = true;
        workbook.drawing = drawing;
        workbook.feedbackObj = me.pagingBar;
        me.pagingBar.setTempStatus(pui["getLanguageText"]("runtimeMsg", "downloading x", ["..."]));
        me.pagingBar.showTempStatusDiv();
      }
      
      workbook.download(fileName);
    }
    else {
      pui.downloadAsAttachment("text/csv", fileName + ".csv", data);
    }
  };

  /**
   * Request Data-driven grid data for the entire file, unfiltered, unsorted.
   * Without a way to know the column data types, cells are stored as strings.
   * @param {String} fileName
   * @returns {undefined}
   */
  this.exportExcel_DataGrid = function (fileName) {
    if (pui["secLevel"] <= 0) {
      console.log("Export not implemented for low security level.");
      return;
    }

    var limit = me.totalRecs;
    if (limit == null) limit = 9999;
    
    var url = getProgramURL("PUI0009102.PGM");
    var dataURL = me["dataProps"]["data url"];
    if (dataURL == "") dataURL = null;
    if (dataURL) {
      url = pui.appendAuth(dataURL);
      setupajax();
    }
    else if(me["dataProps"]["database file"] && me["dataProps"]["database file"].length > 0){
      // If URL is for database-driven grid, then we know the file and can fetch the column data types.
      // TODO: Change PUI0009102 to return the dataType and decPos, and remove this extra XHR.
      var dblib = "";
      var dbfile = me["dataProps"]["database file"].split("/");
      if (dbfile.length > 1) {
        dblib = dbfile[0];
        dbfile = dbfile[1];
      } else {
        dbfile = dbfile[0];
      }
      
      ajaxJSON({
        "url": getProgramURL("PUI0009101.pgm"),
        "method": "post",
        "params": {
          "context": "genie", //Makes PUI0009101 use SyncJob so it works if the URL does/doesn't have "/auth".
          "file": dbfile,
          "library": dblib,
          "AUTH": (pui.pjs_session_id ? pui.pjs_session_id : pui.appJob.auth),
          "workspace_id": (pui["isCloud"] && pui.cloud.ws.id ? pui.cloud.ws.id : ""),
          "q": encodeURIComponent(pui.getSQLVarName(me.tableDiv))
        },
        "async": true,
        "handler": function (response) {
          var fldresp = null;
          if (response != null && response["fields"] != null)
            fldresp = response["fields"];
          setupajax(fldresp);
        },
        'suppressAlert': true,
        'onfail': function(){
          console.log('Failed to fetch column data types for formatting. All cells in the XLSX file will contain character data.');
          setupajax();
        }
      });
      me.mask();
      me.gridLoading();
    } else {
      setupajax();
    }

    // Call CGI program or webservice to fetch data. Called directly or in callback.
    function setupajax(fields) {
      var xhr = new XMLHttpRequest();  //We use XMLHttpRequest here instead of ajaxJSON so that the progress event listener can be used.
      xhr.open("POST", url, true);
      xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
      var formData = {data: {}};      //Note: this cannot be a FormData object, because 9102 in PJS doesn't handle multipart. #6433.
      formData.append = function(key, val){
        formData.data[key] = encodeURIComponent(val);
      };
      formData.get = function(){
        var str = '';
        var amp = '';
        for( var key in formData.data){
          str += amp + key + '=' + formData.data[key];
          amp = '&';
        }
        return str;
      };

      if (pui.pjs_session_id) formData.append("AUTH", pui.pjs_session_id);
      else formData.append("AUTH", pui.appJob.auth);
      formData.append("q", encodeURIComponent(pui.getSQLVarName(me.tableDiv)));
      pui.getSQLParams(me["dataProps"], null, formData);
      formData.append("limit", limit);
      formData.append("start", "1");
      
      if (typeof me.filterString === 'string' && me.filterString.length > 0) {
        var pairs = me.filterString.substring(1).split('&');
        pairs.forEach(function(pair) {
          pair = pair.split('=');
          formData.append(pair[0], pair[1]);
        });
      }
      
      if (pui["read db driven data as ebcdic"] !== true) formData.append("UTF8", "Y");
      
      var orderBy = me["dataProps"]["order by"];
      if (me.sortBy != null) orderBy = me.sortBy;
      if (orderBy && orderBy != "") {
        
        formData.append("order", orderBy);

      }
      else if (getDBDriver() == "mssql") {

        // Order by is required for OFFSET/FETCH.
        // This should give the same sort as if order by was not used.
        formData.append("order", "(select null)");

      }

      var fetchCounter = me["dataProps"]["allow any select statement"];
      if (fetchCounter != null && (fetchCounter == "true" || fetchCounter == true))
        formData.append("FetchCounter", "Y");
      if (pui["isCloud"])
        formData.append("workspace_id", pui.cloud.ws.id);

      me.pagingBar.setTempStatusIcon('cancel', 'cancel');
      me.pagingBar.setTempStatus( pui["getLanguageText"]("runtimeMsg", "downloading x", ["..."]) );
      me.pagingBar.showTempStatusDiv(
        pui["getLanguageText"]("runtimeMsg", "cancelled"),
        function(){ 
          //Abort the download when the cancel icon is clicked.
          xhr.abort();
          me['unMask']();
        }      
      );
      
      xhr.onreadystatechange = function() {
        // state 4=done, status 0 happens upon abort; no need to alert on abort.
        if (xhr.readyState != 4 || xhr.status == 0) return;
        try {
          if (xhr.status != 200) throw 'XMLHTTPRequest status: ' + xhr.status;

          // Note: Fixing bad characters on the server-side slows downloads; thus, use eval, which is more lenient than JSON.parse #6149.
          var responseObj = eval("(" + xhr.responseText + ")");
          
          if (!responseObj) throw 'Failed';
          if (responseObj["success"] != true){
            if (responseObj['errorText']) throw 'Failed: ' + responseObj['errorText'];
            throw 'Failed';
          }
          var response = responseObj["response"];
          if (response == null || response["results"] == null) throw 'Invalid Response';

          if (me["dataProps"]["data transform function"]) {
            try {         // transform data before export, if needed
              var fn = eval("window." + me["dataProps"]["data transform function"]);
              response = fn(xhr.responseText);
            }
            catch(e) {
              pui.logException(e);
            }
          }
          if (fields != null){
            response["fields"] = fields;
          }
          
          // Only download the XLSX file when there are results. Show a message otherwise.
          if (response["results"].length > 0){
            makexlsx(response);
          }
          else {
            me.pagingBar.setTempStatusIcon('','');
            me.pagingBar.setTempStatus( pui['getLanguageText']('runtimeMsg','no data') );
            me.pagingBar.showTempStatusDiv();
            me.pagingBar.hideTempStatusSlowly();
          }
          me["unMask"]();
        }
        catch (exc) {
          var msg = pui["getLanguageText"]("runtimeText", "excel export text");
          console.warn(msg, exc);
          pui.alert( msg +":\n"+ exc.toString() );
          me["unMask"]();
          me.pagingBar.draw();
        }
      };
      
      // Show the download progress to the user on the paging bar.
      var firstTS=0, lastTS=0;
      xhr.addEventListener('progress', function(progress){
        var msg = pui.formatBytes(progress["loaded"], 1);
        var total = progress["timeStamp"] - firstTS;
        if (firstTS == 0){
          firstTS = progress["timeStamp"];
        }
        else if(total > 0){
          var rate = progress["loaded"] / total * 1000;
          var seconds = Math.round(total / 1000);
          msg += ' ('+ pui.formatBytes(rate, 0) +'/s; '+ seconds +'s)';
          
          // Throttle updates to wait 500ms since last timestamp before updating.
          if (progress["timeStamp"] - lastTS < 250){
            return;
          }
        }
        me.pagingBar.setTempStatus( pui["getLanguageText"]("runtimeMsg", "downloading x", [msg]));
        lastTS = progress["timeStamp"];
      });

      xhr.send(formData.get());
      me.mask();
      me.gridLoading();
    }
    
    // Take the data retrieved, create and download an excel file. response.results must be a non-empty array.
    function makexlsx(response) {
      var field, colNum, heading, colEl, len;
      // Used to find array elements whose "field" property matches the closured field var.
      function matchingField(el){ return el['field'] == field; }
      
      // Setup the field order - array of field names. Usually, the order is the order of keys of objects in the results array.
      var fieldOrder = [];
      if ((me.movableColumns || me.hidableColumns) && Array.isArray(me.columnInfo) && me.columnInfo.length > 0){
        // Get info on all visible columns or all columns, and sort that in order of being displayed.
        var sortedcolinf = me.columnInfo.filter(function(el){ return el['showing'] || me.exportVisableOnly != true; });
        sortedcolinf.sort(function(a,b){
          var colA = a['currentColumn'];
          if (colA < 0) colA = 999 + a['columnId'];  //Put hidden columns to the right of all visible cells in a relative order.
          var colB = b['currentColumn'];
          if (colB < 0) colB = 999 + b['columnId'];
          return colA - colB;
        });
        // Get the field order from each column that has a "field" property.
        for (colNum=0, len=sortedcolinf.length; colNum < len && (colEl = sortedcolinf[colNum]) && colEl['field']; colNum++){
          fieldOrder.push({
            fieldName: colEl['field'],
            name: colEl['blankHeader'] ? '' : colEl['name']
          });
        }
      }
      else {
        for (field in response["results"][0]) {
          fieldOrder.push({fieldName: field, fullName: field });
        }
      }

      var numCols = 0;
      if (response["colWidths"] != null)
        numCols = response["colWidths"].length;
      else {
        // In case the web service doesn't return "colWidths" with its data, count the number of fields in the results.
        numCols = Object.keys(response["results"][0]).length;
      }
      // Do not export all the columns when there are fewer than "numCols", as when "export only visible columns" is true.
      if (fieldOrder.length > 0 && fieldOrder.length < numCols) numCols = fieldOrder.length;

      var worksheet = new pui.xlsx_worksheet(numCols);
      var workbook = new pui.xlsx_workbook(worksheet);
      workbook.feedbackObj = me.pagingBar;
            
      // If the DB-Driven grid got a PUI0009101 response, then set the column formats if we can match columns.
      if (response['fields'] != null) {
        // Find the field info for each column. Note: the order of keys in "fields" may not match the order in "results".
        fieldOrder.forEach(function(el, idx){
          field = el.fieldName;
          var foundEl = response['fields'].find( matchingField );          
          var format = foundEl ? { "dataType": foundEl["type"], "decPos": foundEl["decPos"] } : {'dataType':'char'};
          worksheet.setColumnFormat(format, idx);
        });
      }

      if (me.hasHeader && me.exportWithHeadings) {
        // Get headings for each column.
        colNum = 0;
        worksheet.newRow();
        // if (me.hidableColumns || me.movableColumns){
        if (me.hidableColumns){  
          // If any columns remain, then they are likely hidden. Find their headings by their field name.
          if (Array.isArray(me.columnInfo) && me.columnInfo.length > 0){
            for (len=fieldOrder.length; colNum < len && (colEl = fieldOrder[colNum]); colNum++){
              field = colEl.fieldName;
              var foundEl = me.columnInfo.find( matchingField );
              heading = (foundEl ? foundEl['name'] : '');
              worksheet.setCell(heading, colNum);
            }
          }
        }
        else if (me.cells[0] instanceof Array && me.cells[0].length > 0){
          // Assume the column data is in the same order as the fields in this case.
          for (var n=fieldOrder.length; colNum < n; colNum++){
            // Get the headings directly from the DOM cells.
            heading = me.cells[0][colNum] ? rtrim(getInnerText(me.cells[0][colNum])) : '';
            worksheet.setCell(heading, colNum);
          }
        }
        
        worksheet.headerRowHeightpx = me.headerHeight;
      }

      // Look at each result cell. and add to worksheet.
      for (var rowNum=0, n=response["results"].length; rowNum < n; rowNum++) {
        worksheet.newRow();
        var row = response["results"][rowNum];
        colNum = 0;
        for (var j=0, m=fieldOrder.length; j < m; j++){
          field = fieldOrder[j];
          var value = row[field.fieldName];
          // An alias may be in lowercase when the result may be upper. #6600.
          if (value == null && field.fieldName) value = row[ field.fieldName.toUpperCase() ];
          
          worksheet.setCell(value, colNum, null, response['fields'] == null);
          colNum++;
        }
      }

      workbook.download(fileName);      
    } //end makexlsx().
  };

  this.hasChildren = function (colNumber) {
    if (context == "genie" && !pui.usingGenieHandler) return false;
    var startCol = colNumber;
    var endCol = colNumber;
    if (colNumber == null) {
      startCol = 0;
      endCol = me.vLines.length - 2;
    }
    var row = 0;
    if (me.hasHeader) row = 1;
    if (endCol < 0) return false;
    for (var col = startCol; col <= endCol; col++) {
      var cell = me.cells[row][col];
      var obj = cell.firstChild;
      while (obj != null) {
        if (obj.style.position == "absolute" && !obj.isSizie) return true;
        obj = obj.nextSibling;
      }
    }
    return false;
  };

  this.numberChildren = function (colNumber) { // function is to count number of element in the grid column
    var arr2 = [];
    var startCol = colNumber;
    var endCol = colNumber;
    if (colNumber == null) {
      startCol = 0;
      endCol = me.vLines.length - 2;
    }
    var row = 0;
    if (me.hasHeader) row = 1;
    for (var col = startCol; col <= endCol; col++) {
      var cell = me.cells[row][col];
      for (var i = 0; i < cell.children.length; i++) {
        var temp = cell.children[i].id;
        if (temp == "" || temp == null) { continue; }
        else {
          temp = " " + temp;
          arr2.push(temp);
        }
      }
    }
    return arr2;
  };

  this.getChildren = function () {
    var children = [];
    var designer = me.tableDiv.designItem.designer;
    var items = designer.items;
    for (var i = 0; i < items.length; i++) {
      var itm = items[i];
      if (itm.getParentGrid() == me) {
        children.push(itm);
      }
    }
    return children;
  };

  this.getSubfilePage = function () {
    var sflPage = me.hLines.length - 1;
    if (me.hasHeader) sflPage = sflPage - 1;
    return sflPage;
  };

  this.mirrorDown = function (col) {
    if (context == "genie" && !pui.usingGenieHandler) return;
    if (!me.designMode) return;
    var startRow;
    var modelCell;
    var dupSpan = document.createElement("span");
    if (me.hasHeader) {
      modelCell = me.cells[1][col];
      startRow = 2;
    }
    else {
      modelCell = me.cells[0][col];
      startRow = 1;
    }

    var obj = modelCell.firstChild;
    while (obj != null) {
      if (obj.style.position == "absolute" && !obj.isSizie && !obj.isInlineEditBox && !obj.isPctDiv) {
        var clone = obj.cloneNode(true);
        clone.id = "";
        if (clone.removeDesignEvents != null) clone.removeDesignEvents(clone);
        dupSpan.appendChild(clone);
      }
      obj = obj.nextSibling;
    }

    for (var row = startRow; row < me.cells.length; row++) {
      me.cells[row][col].innerHTML = "";
      me.cells[row][col].appendChild(dupSpan.cloneNode(true));
    }
  };

  this.mirrorDownAll = function () {
    if (context == "genie" && !pui.usingGenieHandler) return;
    var numCols = me.vLines.length - 1;
    for (var col = 0; col < numCols; col++) {
      me.mirrorDown(col);
    }
  };

  this.getCellValue = function (row, col) {
    var rowNum = row;
    var topRecord = 1;
    if (context == "dspf" || me.isDataGrid() || pui.usingGenieHandler) topRecord = me.recNum;
    rowNum = rowNum - topRecord;
    if (me.hasHeader) rowNum++;
    var rowObj = me.cells[rowNum];
    if (rowObj == null) return null;
    var cell = rowObj[getCurrentColumnFromId(col)];
    if (cell == null) return null;
    var value = getInnerText(cell);
    return value;
  };

  function getDataArrayForRow(row, useFilter) {

    var dataRecords = me.dataArray;
    if (useFilter && me.isFiltered()) dataRecords = me.visibleDataArray;
    var record = dataRecords[row - 1];

    // if data array has been sorted, we need to get the record
    // based on it's original subfile row number rather than
    // it's position in the array.
    if (typeof me.sorted != "undefined" && me.sorted === true || me.isFiltered()) {
      record = null;
      for (var i = 0; i < dataRecords.length; i++) {
        if (dataRecords[i].subfileRow == row) {
          record = dataRecords[i];
          break;
        }
      }
    }

    return record;
  }

  function getColumnIndex(fieldName) {
    var columnIndex = null;
    for (var i = 0; i < me.fieldNames.length; i++) {
      if (fieldName == me.fieldNames[i]) {
        columnIndex = i;
        break;
      }
    }
    return columnIndex;
  }

  this.getDataValue = function (row, fieldName) {
    if (typeof row != "number") return null;
    if (typeof fieldName != "string") return null;
    var record = getDataArrayForRow(row, false);
    if (record == null) return null;
    fieldName = pui.fieldUpper(fieldName);
    if (fieldName.length > 10 && !(pui["pjsDefaultMode"] === "case-sensitive" || pui.handler != null)) fieldName = pui.longFieldNameTable[fieldName];
    // check changed values in response elements first
    var qualField = pui.formatUpper(me.recordFormatName) + "." + fieldName;
    if (pui.handler != null) qualField = fieldName;
    qualField +=  "." + row;
    var elems = pui.responseElements[qualField];
    if (elems != null && elems.length == 1) {
      var elem = elems[0];
      if (elem != null) {
        // This is not always a dom element, such as with 'selection field', etc.
        if (!elem.tagName) {
          if (typeof elem.responseValue != "undefined")
            return elem.responseValue;
          else
            return elem.value;
        }
        else {
          return getElementValue(elem);
        }
      }
    }
    var columnIndex = getColumnIndex(fieldName);
    if (columnIndex == null) return null;
    return record[columnIndex];
  };


  this["getAllDataValues"] = function (filtered) {

    if (me.fieldNames.length < 1) return null;
    saveResponsesToDataArray();

    var useFilter = (filtered != null && !filtered) ? false : true;
    var dataRecords = me.dataArray;
    if (useFilter && me.isFiltered()) dataRecords = me.visibleDataArray;
    var result = [];

    for (var y = 0; y < dataRecords.length; y++) {
      var record = {};
      for (var x = 0; x < me.fieldNames.length; x++) {
        var fieldName = me.fieldNames[x];
        if (pui.longFieldNameTable[fieldName]) fieldName = pui.longFieldNameTable[fieldName];
        record[fieldName] = dataRecords[y][x];
      }
      result.push(record);
    }

    return result;
  };


  this["setDataValue"] = function (rowNum, fieldName, value) {

    // Update dataArray
    fieldName = pui.fieldUpper(fieldName);
    if (fieldName.length > 10 && !(pui["pjsDefaultMode"] === "case-sensitive" || pui.handler != null)) fieldName = pui.longFieldNameTable[fieldName];
    var record = getDataArrayForRow(rowNum, false);
    if (record != null) {
      var idx = getColumnIndex(fieldName);
      if (idx != null) {
        record[idx] = value;
        // If this is the "selection field" we should also update record.selected (Redmine #3458)
        if (me.selectionEnabled
        && me.selectionField
        && me.selectionField.fieldName
        && fieldName == pui.fieldUpper(me.selectionField.fieldName)) {
          var rowIsSelected = (value == me.selectionValue);
          var rowNewValue = rowIsSelected ? me.selectionValue : me.selectionField.dataType == "indicator" ? "0" : " ";
          if (record.selected != rowIsSelected) {
            record.selected = rowIsSelected;
            pui.modified = true;

            // This will be here if the row has already been rendered
            if (record.selection) {
              record.selection.modified = true;
              record.selection.value = rowNewValue;

              // This will run if the row has not yet been rendered.
              // In that case we need to stick an element into the response array.
            } else {
              var qualField = pui.formatUpper(me.recordFormatName) + "." + fieldName + "." + rowNum;
              if (pui.responseElements[qualField] == null) {
                record.selection = {
                  responseValue: String(value),
                  modified: true,
                  type: "grid selection",
                  value: rowNewValue,
                  subfileRow: rowNum,
                  formattingInfo: me.selectionField,
                  modifiedBeforeRender: true
                };
                pui.responseElements[qualField] = [record.selection];
              }
              if (pui.responseElements[qualField][0] != null && pui.responseElements[qualField][0].modifiedBeforeRender) {
                pui.responseElements[qualField][0].responseValue = String(value);
              }
            }
          }
          if (rowIsSelected) {
            me.selectedRecordNum = rowNum;
          }
        }
      }
    }


    // find the DOM element
    var field = null;
    var property = null;
    var formattingInfo = null;
    var list = [];
    for (var i = 0; i < me.runtimeChildren.length; i++) {
      var runtimeChild = me.runtimeChildren[i];
      for (var prop in runtimeChild) {
        var propValue = runtimeChild[prop];
        if (pui.isBound(propValue) && pui.fieldUpper(propValue["fieldName"]) === fieldName) {
          var formattingInfo = Object.assign({}, propValue);
          formattingInfo.value = value;
          list.push({
            field: runtimeChild,
            property: prop,
            formattingInfo: formattingInfo
          });
        }
      }
    }
    if (list.length === 0) return false;

    for (var x = 0; x < list.length; x++) {
      var entry = list[x];
      var field = entry.field;
      var property = entry.property;
      
      var el = field.domEls[rowNum - 1];

      // If an element has never been rendered, there is no way to mark it "modified" because
      // there is no DOM element. As a workaround, we'll add a simple object containing 
      // the value to the pui.responseElements array. If this does get rendered, the
      // code in runtime/dspf/render.js will replace this object with the real DOM element.

      if (el == null) {

        // Look for another row that has been rendered so
        // we can get info about the DOM elements
        // NOTE: This assumes the DOM elements for each row will be the same.

        var domTest = null;
        for (var i in field.domEls) {
          domTest = field.domEls[i];
          break;
        }

        if (domTest && pui.isInputCapableProperty(property, domTest) && me.isDataGrid() == false) {
          var qualField = pui.formatUpper(me.recordFormatName) + "." + fieldName + "." + rowNum;
          if (pui.responseElements[qualField] == null) {
            pui.responseElements[qualField] = [{
              responseValue: String(value),
              modifiedBeforeRender: true
            }];
          }
          if (pui.responseElements[qualField][0] != null && pui.responseElements[qualField][0].modifiedBeforeRender) {
            pui.responseElements[qualField][0].responseValue = String(value);
          }
        }

        continue;
      }

      // Prevent format() from base64-decoding a Graphic field. Assume setDataValue is passed the desired value. Issue 7701.
      entry.formattingInfo['__pui_skipdecode'] = true;

      // Update DOM element
      if (property === "value") {
        changeElementValue(el, pui.FieldFormat.format(entry.formattingInfo));
      }
      else {
        applyProperty(el, property, pui.FieldFormat.format(entry.formattingInfo));
      }
    }

    return true;
  };

  this.atTop = function () {
    if (me.recNum > 1) return false;
    else return true;
  };

  this.pageUp = function () {

    if (executeEvent("onpageup") == false) {

      return;

    }

    if ( (pui.usingGenieHandler && me.atTop())
        || (!pui.usingGenieHandler && context=="genie")) {
      pressKey("pageup");
      return;
    }

    me.mask();
    me.gridLoading();
    var numRows = me.cells.length;
    if (me.hasHeader) numRows = numRows - 1;
    me.recNum = me.recNum - numRows;
    if (me.recNum < 1) me.recNum = 1;
    if (me.slidingScrollBar) {
      me.scrollbarObj.setScrollTopToRow(me.recNum);
      if ((pui["is_touch"] && !pui["is_mouse_capable"]) || pui.iPadEmulation) me.getData();
    }
    else {
      me.getData();
    }
    setTimeout(function () {
      me["unMask"]();
      if (typeof (pui.cursorValues.noFocus) == "undefined" || pui.cursorValues.noFocus == false) {
        // place cursor on first row
        var rowNum = 0;
        if (me.hasHeader) rowNum++;
        var row = me.cells[rowNum];
        setTimeout(function () {
          placeCursorOnRow(row);
        }, 100);
      }
    }, 1);
  };

  this.atBottom = function () {
    var numRows = me.cells.length;
    if (me.hasHeader) numRows = numRows - 1;
    var lastRow = me.recNum + numRows - 1;

    if (me.isDataGrid() && me["dataProps"]["load all rows"] != "true") {
      return (me.totalRecs <= lastRow);
    } else {
      var dataRecords = me.dataArray;
      if (me.isFiltered()) dataRecords = me.visibleDataArray;
      return (dataRecords.length <= lastRow);
    }
  };

  this.pageDown = function () {

    if (executeEvent("onpagedown") == false) {

      return;

    }

    if ( (pui.usingGenieHandler && me.atBottom())
      || (!pui.usingGenieHandler && context=="genie")) {
      pressKey("pagedown");
      return;
    }

    me.mask();
    me.gridLoading();
    var numRows = me.cells.length;
    if (me.hasHeader) numRows = numRows - 1;
    me.recNum += numRows;
    var lastRow = me.recNum + numRows - 1;

    if (me.isDataGrid() && me.forceDataArray != true) {
      if (me.totalRecs < lastRow && me.scrollbarObj != null) {
        me.recNum = me.recNum - lastRow + me.totalRecs;
        if (me.recNum < 1) me.recNum = 1;
      }
    } else {
      var dataRecords = me.dataArray;
      if (me.isFiltered()) dataRecords = me.visibleDataArray;
      if (dataRecords.length < lastRow && me.scrollbarObj != null) {
        me.recNum = me.recNum - lastRow + dataRecords.length;
        if (me.recNum < 1) me.recNum = 1;
      }
    }

    if (me.slidingScrollBar) {
      me.scrollbarObj.setScrollTopToRow(me.recNum);
      if ((pui["is_touch"] && !pui["is_mouse_capable"]) || pui.iPadEmulation) me.getData();
    }
    else {
      me.getData();
    }
    setTimeout(function () {
      me["unMask"]();
      if (typeof (pui.cursorValues.noFocus) == "undefined" || pui.cursorValues.noFocus == false) {
        // place cursor on first row
        var rowNum = 0;
        if (me.hasHeader) rowNum++;
        var row = me.cells[rowNum];
        setTimeout(function () {
          placeCursorOnRow(row);
        }, 100);
      }
    }, 1);
  };
  
  // Expose recNum -- the current grid record number. Needed for testing pageUp and pageDown in obfuscated code.
  this["getRecNum"] = function(){ return me.recNum; };
  
  this["unMask"] = function () {
    if (loadingDiv != null) loadingDiv.style.display = "none";
    if (animationDiv != null) animationDiv.style.display = "none";
    if (maskCover != null) maskCover.style.display = "none";
  };
  this.gridLoading = function (){
    //Container to hold the mask and animation in, for better positioning
    if (me.designMode) return;
    var gridDiv = me.tableDiv;
    if (gridDiv.style.visibility == "hidden") return;
    if (me.tableDiv.parentNode == null) return;
    //Get grid size
    var left = parseInt(gridDiv.style.left);
    var top = parseInt(gridDiv.style.top);
    var width = parseInt(gridDiv.style.width) - 2;
    var height = parseInt(gridDiv.style.height);
    //Create div
    if (loadingDiv == null) loadingDiv = document.createElement("div");
    loadingDiv.style.display = "block";
    //Set size
    if (me.hasHeader) {
      top += me.headerHeight;
      height = height - me.headerHeight;
    }
    loadingDiv.style.left = left + "px";
    loadingDiv.style.top = top + "px";
    loadingDiv.style.width = width + "px";
    loadingDiv.style.height = height + "px";
    loadingDiv.className = "pui-grid-loading";
    me.tableDiv.parentNode.appendChild(loadingDiv);

    //Call animation
    me.showGridWaitAnimation();
  };
  this.mask = function () {
    if (me.designMode) return;
    var gridDiv = me.tableDiv;
    if (gridDiv.style.visibility == "hidden") return;
    if (me.tableDiv.parentNode == null) return;
    var left = parseInt(gridDiv.style.left);
    var top = parseInt(gridDiv.style.top);
    var width = parseInt(gridDiv.style.width) - 2;
    var height = parseInt(gridDiv.style.height);
    if (maskCover == null) maskCover = document.createElement("div");
    maskCover.style.display = "block";
    if (me.hasHeader) {
      top += me.headerHeight;
      height = height - me.headerHeight;
    }
    maskCover.style.position = "absolute";
    maskCover.style.left = left + "px";
    maskCover.style.top = top + "px";
    maskCover.style.width = width + "px";
    maskCover.style.height = height + "px";
    maskCover.className = "grid-mask";
    me.tableDiv.parentNode.appendChild(maskCover);
  };

  this.showGridWaitAnimation = function() {
    //Make sure the wait animation is needed
    if (me.designMode|| maskCover == null || maskCover.style.display == "none") return;
    var gridDiv = me.tableDiv;
    if (gridDiv.style.visibility == "hidden") return;
    if (me.tableDiv.parentNode == null) return;

    //Set size
    var left = parseInt(loadingDiv.style.left);
    var top = parseInt(loadingDiv.style.top);
    var width = parseInt(loadingDiv.style.width) - 2;
    var height = parseInt(loadingDiv.style.height) - 5;
    
    if (animationDiv == null) animationDiv = document.createElement("div");
    animationDiv.style.display = "block";
    if (me.hasHeader) {
      top += me.headerHeight;
      height = height - me.headerHeight;
    }

    //Adjust size, so it doesn't get too big, too small, or too wide
    if(height > 100){
      height = 100;
      if(width < 100){height = width - 5;}
    }
    if(height < 35){height = 35;}

    //Apply height & animation class
    animationDiv.style.width = height + "px";
    animationDiv.style.height = height + "px";
    animationDiv.className = "pui-animation pui-grid-animation";
    //Attach to loading div on grid
    loadingDiv.appendChild(animationDiv); 
  };

  /**
   * Populate the grid cells. Data-grids may fetch data from a URL. Handler-driven grids
   * fill internal data arrays.
   * @param {String|undefined} csvFile  Filename specified in exportCSV when grid is data-grid.
   */
  this.getData = function (csvFile) {
    
    // 7647: make explicit call to hide context menu because scrolling the grid does not result in the
    // context menu from being hidden and the 'onclick' is unrecognised.
    me.hideContextMenu();

    if (me.tableDiv.disabled == true) return;
    if (me.designMode) return;
    var numRows = me.cells.length;
    if (me.hasHeader) numRows = numRows - 1;
    if (numRows < 1) return;

    if(me.forceDataArray == false){
      // Do some things before making the first XHR for data grids.
      if (me.isDataGrid()){
        if (!dataGridDidInitialSortOnce){
          dataGridDidInitialSortOnce = true;
          suppressGetData = true; //so GetData isn't called recursively
          dataGridDidInitialSort = doInitialSort(true);
          suppressGetData = false;
        }
        // Only once, load any stored filter and sort options.
        if (!dataGridDidRestoreState) {
          restoreStateDataGrid();
          dataGridDidRestoreState = true; //Only restore filters/sort once.
        }
      }
      
      // The SQL string helps Grid decide to use pui.sqlcache; it is only sent to the CGI program when secLevel is 0.
      var sql = me["dataProps"]["custom sql"];
      var orderBy = "";
      // There was no "custom sql", so build the string from DB-driven properties.
      if (sql == null || sql == "") {
        var file = me["dataProps"]["database file"];
        var fields = me["dataProps"]["database fields"];
        var whereClause = me["dataProps"]["selection criteria"];
        orderBy = me["dataProps"]["order by"];
        if (me.sortBy != null) orderBy = me.sortBy;
        if (fields != null && fields != "" && file != null && file != "") {
          sql = "SELECT " + fields + " FROM " + file;
          if (whereClause && whereClause != "") {
            sql += " WHERE " + whereClause;
          }
          if (orderBy && orderBy != "") {
            sql += " ORDER BY " + orderBy;
          }
        }
      } else if (me.sortBy != null) {
        // Allow the cache comparison know if sorting changed.
        sql += " ORDER BY " + me.sortBy;
      }
    }
    var dataURL = me["dataProps"]["data url"];
    if (dataURL == "") dataURL = null;
    if (sql == null) sql = "";
    if (me.forceDataArray == false && (sql != "" || dataURL != null)) {
      if (csvFile != null) {
        if (sql == null || sql == "") return;
        var delimiter = ",";
        var decType = ".";
        var stringDelimiter = '"';
        if (pui.appJob != null && (pui.appJob["decimalFormat"] == "I" || pui.appJob["decimalFormat"] == "J")) {
          delimiter = ";";
          decType = ",";
        }
        if (typeof (pui["csv separator"]) == "string") {
          delimiter = pui["csv separator"];
        }
        if (typeof (pui["csv string delimiter"]) == "string") {
          stringDelimiter = pui["csv string delimiter"];
        }
        var form = document.createElement("form");
        form.action = getProgramURL("PUI0009107.pgm");
        form.method = "post";
        function addField(fieldName, fieldValue) {
          var field = createNamedElement("input", fieldName);
          field.type = "hidden";
          field.value = fieldValue;
          form.appendChild(field);
        }
        if (pui["isCloud"])
          addField("workspace_id", pui.cloud.ws.id);
        addField("delimiter", delimiter);
        addField("stringDelimiter", (stringDelimiter==='') ? "*NONE": stringDelimiter);
        if (pui["read db driven data as ebcdic"] !== true) addField("UTF8", "Y");
        addField("decType", decType);
        addField("fileName", csvFile + ".csv");
        if (pui["secLevel"] > 0) {

          addField("q", encodeURIComponent(pui.getSQLVarName(me.tableDiv)));

          var params = {};
          pui.getSQLParams(me["dataProps"], params);

          for (var fieldName in params) {

            addField(fieldName, encodeURIComponent(params[fieldName]));

          }

          if (orderBy && orderBy != "") {

            addField("order", orderBy);

          }
          else if (getDBDriver() == "mssql") {

            // Order by is required for OFFSET/FETCH.
            // This should give the same sort as if order by was not used.
            addField("order", "(select null)");

          }

        }
        else {

          addField("q", pui.aes.encryptString(sql));

        }
        addField("AUTH", pui.pjs_session_id ? pui.pjs_session_id : pui.appJob.auth);
        if (me.hasHeader && me.exportWithHeadings) {
          if (me.hidableColumns) {
            var headings = "";
            me.columnInfo.forEach(function (col) {
              var heading = col["name"];
              if (col["blankHeader"]) heading = "";
              heading = heading.replace(/"/g, '""');
              if (headings) headings += delimiter;
              headings += stringDelimiter + heading + stringDelimiter;
            });
          } else {
            var headings = "";
            for (var i = 0; i < me.cells[0].length; i++) {
              var heading = getInnerText(me.cells[0][i]);
              heading = heading.replace(/"/g, '""'); // "
              if (headings != "") headings += delimiter;
              headings += stringDelimiter + heading + stringDelimiter;
            }
          }
          addField("headings", headings);
        }

        // add the filterString as input fields
        if (typeof me.filterString === 'string' && me.filterString.length > 0) {
          var pairs = me.filterString.substring(1).split('&');
          pairs.forEach(function(pair) {
              pair = pair.split('=');
              addField(pair[0], decodeURIComponent(pair[1]));
          });
        }

        document.body.appendChild(form);
        pui.skipConfirm = true;
        form.submit();
        setTimeout(function () {
          form.parentNode.removeChild(form);
          pui.skipConfirm = false;
        }, 0);
        return;
      }
      if (me.scrollbarObj != null) {
        if (me.scrollbarObj.type == "paging") me.scrollbarObj.atTop = (me.recNum == 1);
        if (me.tableDiv.style.visibility != "hidden") me.scrollbarObj.draw();
      }

      var startRow = me.recNum;
      if (findText != null && findColumn != null && findStartRow > 0) {
        // When doing Find, startRow may be one higher than me.recNum. Then, if the CGI program
        // returns nothing because nothing was found, we can leave the grid cells as they were.
        startRow = findStartRow;
      }
      else
        // We aren't doing a server-side Find, so clear all cells.
        me.clearData();

      var receiveRoutine = receiveData;
      var limit = numRows;
      if(me["dataProps"]["load fields into widgets"] == "true"){
        receiveRoutine = receiveIntoDataArray;
        if(me["dataProps"]["load all rows"] == "true"){
          limit = -1;
        }
        me.mask();
        me.gridLoading();
      }
      runSQL(sql, limit, startRow, receiveRoutine, (me.totalRecs == null), dataURL, true);
    }
    else if (context == "dspf" || pui.usingGenieHandler) {
      var dataRecords = me.dataArray;
      if (me.isFiltered()) dataRecords = me.visibleDataArray;
      me.tableDiv.cursorRRN = 0;
      var rrn = me.recNum;
      if (dataRecords[me.recNum - 1] && dataRecords[me.recNum - 1].subfileRow != null) {
        rrn = dataRecords[me.recNum - 1].subfileRow;
      }
      me.tableDiv.returnRRN = rrn;
      if (me.fileId != null) {
        pui.topRRNs["toprrn." + me.fileId] = rrn;
      }
      me.clearData();
      var rowNum = (me.hasHeader ? 1 : 0);
      var lastRow = me.recNum + numRows - 1;
      // If filter causes RRN to be too high, put RRN in range of records (#5259). Or, if there is a scrollbar, scroll to the end.
      // Note: it is expected behavior that empty rows will exist when there is no scrollbar (#5524)
      if (me.forceDataArray == false && dataRecords.length < lastRow && (me.isFiltered() || me.scrollbarObj != null) ) {
        
        me.recNum = me.recNum - lastRow + dataRecords.length;
        if (me.recNum < 1) me.recNum = 1;
        lastRow = dataRecords.length;
      }
      me.hideTips();
      var firstRow = me.recNum;
      if(me.forceDataArray == true && me["dataProps"]["load all rows"] != "true"){
        firstRow = 1;
        lastRow = numRows;
      }

      var treeLevelItem = getTreeLevelItem();
      me.firstDisplayedRRN = 0;
      me.lastSelectedRRN = null;

      for (var i = firstRow; i <= lastRow; i++) {

        if (me.gridRecordData) {
          var gridRecord = me.gridRecordData[i - 1];
        }
        if (!gridRecord) gridRecord = {};

        var fieldData = {};
        var valuesData = dataRecords[i - 1];
        if (valuesData == null || valuesData.length == 0) {
          fieldData.empty = true;
        }
        else {
          for (var j = 0; j < me.fieldNames.length; j++) {
            fieldData[me.fieldNames[j]] = valuesData[j];
          }
        }
        //6583 - if the SQL database column name is long, the fieldname used to get the data will be wrong
            //set pui_show use the longname in render.js > EvalBoundProperty()
        if(me["dataProps"]["load fields into widgets"] == "true"){
          fieldData["__pui_show"] = true;
          
          // Avoid graphic fields being base64-decoded in pui.FieldFormat.format; only the handler encodes them as base64 for transfer.
          fieldData['__pui_skipdecode'] = true;
        }
        var setRowBg = me.selectionEnabled || me.rowFontColorField != null || me.rowBackgroundField != null;

        if (fieldData.empty != true) {
          var subfileRow = dataRecords[i - 1].subfileRow;
          if (subfileRow == null) subfileRow = i;
          if (setRowBg) me.setRowBackground(rowNum, false, i - 1 );  //Note: if rows are hidden rowNum may not correspond to the correct value in this.dataArray. 6391.

          if (treeLevelItem !== null) 
            handleTreeLevelItemPerRow(treeLevelItem);
          
          if (me.firstDisplayedRRN == 0)
            me.firstDisplayedRRN = subfileRow;
          me.lastDisplayedRRN = subfileRow;

          pui.renderFormat({
            designMode: false,
            name: pui.formatUpper(me.recordFormatName),
            metaData: {
              items: me.runtimeChildren
            },
            data: fieldData,
            gridRecord: gridRecord,
            ref: me.ref,
            errors: me.errors,
            rowNum: rowNum,
            subfileRow: subfileRow,
            dataArrayIndex: i - 1,
            highlighting: me.highlighting,
            treeLevelItem: treeLevelItem
          });
          
          if (me.selectionEnabled && me.selectionField != null) {
            var qualField = pui.formatUpper(me.recordFormatName) + "." + pui.fieldUpper(me.selectionField.fieldName) + "." + subfileRow;
            if (pui.responseElements[qualField] == null) {
              dataRecords[i - 1].selection = {
                modified: false,
                type: "grid selection",
                value: me.selectionField.dataType == "indicator" ? "0" : " ",
                subfileRow: subfileRow,
                formattingInfo: me.selectionField
              };
              pui.responseElements[qualField] = [];
              pui.responseElements[qualField].push(dataRecords[i - 1].selection);
            }
          }
          
          if (me.hiddenField != null) {
            var qualField = pui.formatUpper(me.recordFormatName) + "." + pui.fieldUpper(me.hiddenField.fieldName) + "." + subfileRow;
            if (pui.responseElements[qualField] == null) {
              dataRecords[i - 1].hiddenFieldInfo = {
                modified: false,
                type: "grid hidden field",
                value: "0",
                subfileRow: subfileRow,
                formattingInfo: me.hiddenField
              };
              pui.responseElements[qualField] = [];
              pui.responseElements[qualField].push(dataRecords[i - 1].hiddenFieldInfo);
            }
            
          }
        }
        else if (setRowBg){
          me.setRowBackground(rowNum);
        }
        
        rowNum++;
      }

      // #7190: Background of some rows beyond the last visible row may have been set previously. Reset them.
      if (setRowBg && (lastRow < numRows)) {
        for (var rowNbr = lastRow + 1 ; rowNbr <= numRows; rowNbr++) {
          me.setRowBackground(rowNbr);
        }
      }

      if (me.hasTreeLevelColumn && me.treeLevelField !== null && me.lastSelectedRRN !== null) {
        var myTreeLevelItemId = me.tableDiv.id + me.treeLevelItemId + "." + me.lastSelectedRRN;
        var myTreeLevelItemObj = getObj(myTreeLevelItemId);
        if (myTreeLevelItemObj !== null)
          myTreeLevelItemObj.focus();          // so that left/right arrow keys would expand/collapse tree level
      }

      if (me.isDataGrid() && me["dataProps"]["load all rows"] != "true") {
        me.firstDisplayedRRN = me.firstDisplayedRRN + (me.recNum - 1);
        me.lastDisplayedRRN  = me.lastDisplayedRRN  + (me.recNum - 1);
      }
      if (me.scrollbarObj != null && me.scrollbarObj.type == "sliding") {
        me.scrollbarObj.totalRows = (me.forceDataArray && me["dataProps"]["load all rows"] != "true") ? me.totalRecs : dataRecords.length;
      }
      if (me.tableDiv.style.visibility != "hidden" && me.scrollbarObj != null) {
        me.scrollbarObj.draw();
        // Sliding scrollbar must know when grid is done loading so that a flag can be cleared after queued functions finish.
        if (typeof me.scrollbarObj.gridRequestFinished == "function") me.scrollbarObj.gridRequestFinished();
      }
      if (me.pagingBar != null) {
        me.pagingBar.pageNumber = parseInt((me.recNum + numRows * 2 - 2) / numRows) + me.initialPageNumber - 1;
        me.pagingBar.draw();
      }
      me.cleared = false;
    }
    /**
     * Callback for runSQL.
     * @param {Object|Array} data       Received data from XHR or pui.sqlcache.
     * @param {Null|Number} totalRecs   When set, the XHR responded to getTotal with this.
     * @param {Null|Number} matchRow    When doing Find, returns row on which match was found and data starts.
     * @returns {undefined}
     */
    //For loading database driven grids into wigets
    function receiveIntoDataArray(data, totalRecs, matchRow) {
      if (me == null || me.cells == null) return; // since this is asynchronous, the user may have moved to the next screen by and the grid may no longer exist
      if (totalRecs != null) me.totalRecs = totalRecs;

      me.fieldNames = [];
      me.visibleDataArray = [];
      //Clears DOM elements
      me["clear"](false);
      me.sorted = false;
      if(me["dataProps"]["load all rows"] == "true"){
        resetAllDefaultSortDescending(false);
      }

      //Get data from sql request and put into data array
      if(data.length >= 1){
        for(var fieldName in data[0]){
          me.fieldNames.push(pui.fieldUpper(fieldName));
        }
        for(var i = 0; i < data.length; i++){
          me.dataArray[i] = [];
          me.visibleDataArray[i] = [];
          var record = data[i];
          var fieldNumber = 0;
          for(var fieldName in record){
            var fieldValue = record[fieldName];
            me.dataArray[i][fieldNumber] = fieldValue;
            me.visibleDataArray[i][fieldNumber] = fieldValue;
            fieldNumber ++;
          }
        }
      }
      //set true to work with data array in GetData
      me.forceDataArray = true;
      me.getData();

      //reapply filter after restoring state
      if(me["dataProps"]["load all rows"] == "true" && me.isFiltered() && persistState){
        var state = restoreStatePreCheck();
        var filters = state["filters"];
        if (filters != null) {
          //waitingOnRequest prevents filter from being set
          me.waitingOnRequest = false;
          for (var i = 0; i < filters.length; i++) {
            var col = state["filters"][i]["column"];
            var text = state["filters"][i]["text"];
            if (text == null || text == "")
              me["removeFilter"](col);
            else
              me["setFilter"](col, text);
          }
          me.waitingOnRequest = true;
        }
      }
      if(me["dataProps"]["load all rows"] == "true" && me.hasHeader && me.cells.length > 0){ 
        var headerRow = me.cells[0];
        for(i = 0; i < headerRow.length; i++){
          if(headerRow[i].sortIndex){
            headerRow[i].sortIndex = null;
          }
        }
        me.makeSortable(false);
      }
      me["unMask"]();
      if(me["dataProps"]["load all rows"] != "true"){
        me.forceDataArray = false;
      }
      var numRows = me.cells.length;
      if (me.hasHeader) numRows = numRows - 1;

      if (me.scrollbarObj != null) {
        if (me.scrollbarObj.type == "paging") {
          setTimeout(function () {
            me.scrollbarObj.destroy();
            me.scrollbarObj = null;
            me.setScrollBar();
          }, 250);
        }
        else if (me.scrollbarObj.type == "sliding") {
          if (me.totalRecs != null) {
            me.scrollbarObj.totalRows = me.totalRecs;
            if (matchRow > 0) { //If this response is the result of a Find.
              // Position the scrollbar to where the data is--if possible, without making another XHR. If the 
              // Found record is the last record, the scrollbar will resend and position on the last row.
              me.scrollbarObj.setScrollTopToRow(me.recNum, true);
            }
          }
        }
      }
      if (me.tableDiv.style.visibility != "hidden" && me.scrollbarObj != null) {
        me.scrollbarObj.draw();
        // Sliding scrollbar must know when grid is done loading so that a flag can be cleared after queued functions finish.
        if (typeof me.scrollbarObj.gridRequestFinished == "function") me.scrollbarObj.gridRequestFinished();
      }
      me.cleared = false;
    }

    /**
     * Callback for runSQL.
     * @param {Object|Array} data       Received data from XHR or pui.sqlcache.
     * @param {Null|Number} totalRecs   When set, the XHR responded to getTotal with this.
     * @param {Null|Number} matchRow    When doing Find, returns row on which match was found and data starts.
     * @returns {undefined}
     */
    function receiveData(data, totalRecs, matchRow) {
      function colIdMatchingIdx(el){ return el['columnId'] === idx; }
      
      if (me == null || me.cells == null) return; // since this is asynchronous, the user may have moved to the next screen by and the grid may no longer exist
      if (totalRecs != null) me.totalRecs = totalRecs;
      if (matchRow > 0) {
        me.recNum = matchRow; // Set in response to a Find operation.
        me.clearData(); // Only clear data when results were found.
      }

      var paddingCSS = getPaddingCSS();
      // Column order can differ from SQL when backend SQL statements are used, and the 
      // user has re-ordered the columns.
      var cellMap = new Array(me.cells[0].length);
      for (var i = 0; i < me.cells[0].length; i++) {
        cellMap[me.cells[0][i].columnId] = i;
      }
      
      // Preserve field name into me.columnInfo so that the field can be later matched to custom-sql and DBD XLSX export response data. #6476, #6600.
      // Assume the data returned by the server is in the grid's original column order: the first field is in column 0, etc. 
      if ((me.movableColumns || me.hidableColumns) && data.length > 0 && me.columnInfo.length){
        var idx=0;
        for (var j in data[0]) {
          var col = me.columnInfo.find( colIdMatchingIdx );
          if (col) col['field'] = j;
          idx++;
        }
      }

      me.firstDisplayedRRN = 0;

      // For each returned record, put the data into grid cells.
      for (var i = 0; i < data.length; i++) {

        if (me.firstDisplayedRRN == 0)
          me.firstDisplayedRRN = (i + 1) + (me.recNum - 1);
        me.lastDisplayedRRN = (i + 1) + (me.recNum - 1);

        var record = data[i];
        var colNum = 0;
        var rowNum = i + (me.hasHeader ? 1 : 0);
        //Row could be null if grid is in layout, expand-to-layout true, and layout is changing number of rows.
        var row = me.cells[rowNum];

        if (row != null) { //There are enough cells to hold this record.
          for (var j in record) {
            var rlength = row.length;
            // If hidable columns, set the column length to the total amount of columns
            if (me.hidableColumns && me.columnInfo.length) rlength = me.columnInfo.length;
            if (colNum < rlength) {
              var dataValue = record[j];
              var alignCSS = "";
              var idx;
              if (pui["secLevel"] > 0) {
                idx = cellMap[colNum];
              }
              else {
                idx = colNum;
              }
              // When columns can be hidden or moved, then the export order can change. Track info to help with exporting from DBD etc. grids.
              if (me.hidableColumns) {
                // If the current column is hidden continue.
                if (idx == undefined) {
                  colNum++;
                  continue;
                }
                if (me.cellProps["text align"]) {
                  var textAlignArr = me.cellProps["text align"].split(',');
                  if (textAlignArr[colNum]) alignCSS = " text-align:" + textAlignArr[colNum];
                }
              }
              else if (row[idx].style.textAlign != null && row[idx].style.textAlign != "") {
                alignCSS = " text-align:" + row[idx].style.textAlign;
              }
              row[idx].innerHTML = '<div style="' + paddingCSS + alignCSS + '" class="dbd">' + dataValue + '</div>';

              // Highlight cells in the column.
              if (me.highlighting != null && me.highlighting.text != "" && (idx === me.highlighting.col || me.highlighting.col === "*all")) {
                if (row[idx].tagName == "DIV") {
                  pui.highlightText(row[idx], me.highlighting.text);
                  row[idx].highlighted = true;
                }
              }
            }
            colNum++;
          }
        }
      }
      var numRows = me.cells.length;
      if (me.hasHeader) numRows = numRows - 1;

      if (me.scrollbarObj != null) {
        if (me.scrollbarObj.type == "paging") {
          setTimeout(function () {
            me.scrollbarObj.destroy();
            me.scrollbarObj = null;
            me.setScrollBar();
          }, 250);
        }
        else if (me.scrollbarObj.type == "sliding") {
          if (me.totalRecs != null) {
            me.scrollbarObj.totalRows = me.totalRecs;
            if (matchRow > 0) { //If this response is the result of a Find.
              // Position the scrollbar to where the data is--if possible, without making another XHR. If the 
              // Found record is the last record, the scrollbar will resend and position on the last row.
              me.scrollbarObj.setScrollTopToRow(me.recNum, true);
            }
          }
        }
      }
      if (me.tableDiv.style.visibility != "hidden" && me.scrollbarObj != null) {
        me.scrollbarObj.draw();
        // Sliding scrollbar must know when grid is done loading so that a flag can be cleared after queued functions finish.
        if (typeof me.scrollbarObj.gridRequestFinished == "function") me.scrollbarObj.gridRequestFinished();
      }

      // Update the pagingbar after each response.
      if (me.pagingBar != null) {
        me.pagingBar.pageNumber = parseInt((me.recNum + numRows * 2 - 2) / numRows) + me.initialPageNumber - 1;
        me.pagingBar.draw();
      }
      me.cleared = false;
    } //end of receiveData().

    function getTreeLevelItem() {

      var treeLevelItem = null;
      if (me.hasTreeLevelColumn && me.treeLevelField !== null) {
        if (me.treeLevelData == null) {      // do one time only for load all grid or db grid with load all option
          me.treeLevelData = [];
          for (var ii = 0; ii < me.dataArray.length; ii++) {
            var treeLevelData = {treeLevel: me.getDataValue(ii+1, me.treeLevelField), treeLevelCollapsed: false};
            me.treeLevelData.push(treeLevelData);
          }
          me.gridTree = new pui.GridTree();
          me.gridTree.load(me.treeLevelData);
        }

        if (!me.treeLevelDataInitDone) {
          me.treeLevelDataInitDone = true;
          me.currentLeft = null;
          var treeLevelColumnId = me.getTreeLevelColumnId();
          // This is done at init; before columns can be hidden/moved.
          for (var jj = 0; jj < me.runtimeChildren.length; jj++) {
            if (me.runtimeChildren[jj]["columnId"] == treeLevelColumnId) {   // compare static design value
              var currentLeft = me.runtimeChildren[jj]["left"];
              if (currentLeft === undefined) 
                currentLeft = "10px";   // default; 
              currentLeft = currentLeft.substring(0, currentLeft.indexOf("px"));
              currentLeft = parseInt(currentLeft);
              me.currentLeft = currentLeft;
              break;    
            }
          }
        }
        var myGridId = me.tableDiv.id;
        var myOnclickFunction = 'myFunction = function (event, elem) {\n  getObj(\"' + myGridId + 
                                '\").grid.toggleTreeLevel(rrn);\n}\n\n';
        treeLevelItem = {
          "id": myGridId + me.treeLevelItemId,
          "field type": "graphic button",
          "left": "10px",
          "top": "0px",
          "css class": "pui-button-tree-level",
          "icon position": "left",
          "onclick": myOnclickFunction,
          "grid": myGridId,
          "visibility": "visible"
        };

        treeLevelItem["columnId"] = me.treeLevelColumnId;                   // design value; static
        // "column" is run-time; may change due to move/hide columns
        treeLevelItem["column"] = treeLevelItem["columnId"].toString();     // default; may change     
      }   // endif me.hasTreeLevelColumn

      return treeLevelItem;

    } //end of getTreeLevelItem()

    function handleTreeLevelItemPerRow(treeLevelItem) {

      var treeLevelDataIndex = (subfileRow - 1);
      treeLevelItem["icon"] = "fontAwesome-solid:minus-square-tree-level";
      treeLevelItem["visibility"] = "visible";
      if (me.treeLevelData[treeLevelDataIndex].treeLevelCollapsed)
        treeLevelItem["icon"] = "fontAwesome-solid:plus-square-tree-level";
      var myTreeLevel = me.treeLevelData[treeLevelDataIndex].treeLevel;
      // indent tree level
      // Note that this is done per row since it depends on the tree level
      for (var jj = 0; jj < me.runtimeChildren.length; jj++) {
        if (me.runtimeChildren[jj]["columnId"] == treeLevelItem["columnId"]) {  // compare static design time
          treeLevelItem["column"] = me.runtimeChildren[jj]["column"];           // run-time  
          var newLeft = me.currentLeft + ((myTreeLevel-1)*10);
          treeLevelItem["left"] = newLeft + "px";
          me.runtimeChildren[jj]["left"] = (newLeft + 20) + "px";
          break;    
        }
      }
      // If this row does NOT have any lower-level row, do NOT show +/- icon
      // Note: me.treeLevelData[] uses zero-based index
      if ((treeLevelDataIndex + 1) >= me.treeLevelData.length || me.treeLevelData[treeLevelDataIndex + 1].treeLevel <= myTreeLevel)
        treeLevelItem["visibility"] = "hidden";   // just hide it or NOT create at all?

    } //end of handleTreeLevelItemPerRow()

  }; //end of getData().

  this.clearData = function () {
    if (me.cleared) return;
    var touchTarget;
    if (me.scrollbarObj != null) {
      touchTarget = me.scrollbarObj.touchTarget;
    }
    for (var row = (me.hasHeader ? 1 : 0); row < me.cells.length; row++) {
      for (var col = 0; col < me.cells[row].length; col++) {
        var cell = me.cells[row][col];
        var elem = cell.firstChild;
        while (elem) {
          if (elem == touchTarget) {
            // can't remove touch target (this cancels touchmove events on mobile devices), so temporary place it into the main grid div
            elem.style.display = "none";
            elem.redisplay = true;
            me.tableDiv.appendChild(elem);
          }
          else {
            cell.removeChild(elem);
          }
          elem = cell.firstChild;
        }
      }
    }
    me.cleared = true;
  };

  this.hideTips = function () {
    for (var domid in me.validationTips) {
      var tip = me.validationTips[domid];
      tip.hideNow();
    }
  };

  this.destroy = function () {
    if (me.contextMenuId) removeEvent(document, "click", me.hideContextMenu);
    for (var i = me.vLines.length - 1; i >= 0; i = i - 1) {
      if (me.vLines[i].parentNode != null) me.vLines[i].parentNode.removeChild(me.vLines[i]);
    }
    for (var i = me.hLines.length - 1; i >= 0; i = i - 1) {
      if (me.hLines[i].parentNode != null) me.hLines[i].parentNode.removeChild(me.hLines[i]);
    }
    if (me.scrollbarObj != null) me.scrollbarObj.destroy();
    if (me.pagingBar != null) me.pagingBar.destroy();
    if (me.gridMenu != null) me.gridMenu.destroy();
    if (nwHandle != null) nwHandle.parentNode.removeChild(nwHandle);
    if (neHandle != null) neHandle.parentNode.removeChild(neHandle);
    if (swHandle != null) swHandle.parentNode.removeChild(swHandle);
    if (seHandle != null) seHandle.parentNode.removeChild(seHandle);
    if (addRowIcon != null) addRowIcon.parentNode.removeChild(addRowIcon);
    if (removeRowIcon != null) removeRowIcon.parentNode.removeChild(removeRowIcon);
    if (addColumnIcon != null) addColumnIcon.parentNode.removeChild(addColumnIcon);
    if (removeColumnIcon != null) removeColumnIcon.parentNode.removeChild(removeColumnIcon);
    if (columnPointer != null) columnPointer.parentNode.removeChild(columnPointer);
    columnPointer = null;
    sortMultiOrder = null;
    sortMultiPanel = null;
    filterMultiPanel = null;
    filterMultiPanelLoading = null;
    try {
      this.deleteOwnProperties();   //Deletes anything that is set like "this.something = foo", including me.dataArray, me.fieldNames, me.runtimeChildren, etc.
      delete me;
    } catch(ignored){}
  };

  this.getColumnWidths = function () {
    var widths = "";
    for (var i = 1; i < me.vLines.length; i++) {
      var width = parseInt(me.vLines[i].style.left) - parseInt(me.vLines[i - 1].style.left);
      if (widths == "") {
        widths += String(width);
      }
      else {
        widths += "," + String(width);
      }
    }
    return widths;
  };

  this.setColumnWidths = function (widths) {
    if (typeof widths == "string") widths = widths.split(",");
    if (me.vLines.length <= 0) return;
    var curLeft = parseInt(me.vLines[0].style.left);
    for (var i = 1; i < me.vLines.length; i++) {
      var width = me.defaultColumnWidth;
      var x = i - 1;
      if (x < widths.length) {
        width = pui.safeParseInt(widths[x], 50);
      }
      curLeft += width;
      me.vLines[i].style.left = curLeft + "px";
    }
    setLineWidths();
    if (me.designMode) me.sizeAllCells();
    positionIcons();
    me.setScrollBar();
    me.setHeadings();
    me.sendToDesigner(true);
  };

  this.selectMe = function () {
    if (me.dontSelect) return;
    if (!me.designMode) return;
    var itm = me.tableDiv.designItem;
    if (itm == null) return;
    itm.designer.inlineEditBox.update();
    var selection = itm.designer.selection;
    if (selection.resizers.length == 1 && selection.resizers[0].designItem == itm) {
      me.sendToDesigner();
      return;
    }
    selection.clear();
    selection.add(itm);
    me.sendToDesigner(true);
  };

  this.sendToDesigner = function (forced) {
    if (!me.designMode) return;
    if (toolbar.loadingDisplay) return;
    var itm = me.tableDiv.designItem;
    if (itm == null) return;
    var subfileHeight = itm.properties['height'] === '#subfileHeight' ? '#subfileHeight' : me.tableDiv.style.height;
    
    var numRows;
    if (itm.properties['number of rows'] !== '#rowsPerPageRDF'){
      numRows = me.hLines.length - 1;
      if (numRows < 0) numRows = 0;
      numRows = String(numRows);
    }
    else numRows = itm.properties['number of rows']; //value is from JumpStart template. #6217.
    
    var numCols = me.vLines.length - 1;
    if (numCols < 0) numCols = 0;
    numCols = String(numCols);
    
    var changed = false;
    changed = me.sendPropertyToDesigner(itm, "number of rows", numRows) || changed;
    changed = me.sendPropertyToDesigner(itm, "number of columns", numCols) || changed;
    changed = me.sendPropertyToDesigner(itm, "row height", me.rowHeight) || changed;
    changed = me.sendPropertyToDesigner(itm, "header height", me.headerHeight) || changed;
    changed = me.sendPropertyToDesigner(itm, "column widths", me.getColumnWidths()) || changed;
    changed = me.sendPropertyToDesigner(itm, "left", me.tableDiv.style.left) || changed;
    changed = me.sendPropertyToDesigner(itm, "top", me.tableDiv.style.top) || changed;
    changed = me.sendPropertyToDesigner(itm, "height", subfileHeight) || changed;
    changed = me.sendPropertyToDesigner(itm, "width", me.tableDiv.style.width) || changed;
    if (changed){
      itm.designer.makeDirty();
      if (context === 'dspf') pui.ide.refreshRibbon();
    }
    if (changed || forced) itm.designer.propWindow.refresh();
  };

  function createHandle(type) {
    var handle = document.createElement("div");
    handle.style.position = "absolute";
    handle.style.border = "1px solid #0000ff";
    if (pui["is_old_ie"] && pui["is_quirksmode"]) {
      handle.style.height = "6px";
      handle.style.width = "6px";
      handle.style.padding = "0px";
    }
    else {
      handle.style.height = "3px";
      handle.style.width = "3px";
      handle.style.padding = "1px";
    }
    handle.style.fontSize = "0px";
    handle.style.backgroundColor = "#dddddd";
    handle.style.cursor = type + "-resize";
    handle.style.zIndex = designUtils.zSizie;
    handle.style.visibility = "hidden";
    handle.isSizie = true;

    function mousedown(event) {

      var psBar = pui.designer.psBar;
      if (psBar.container == null) {
        psBar.container = document.body;
        psBar.init();
      }
      psBar.set(me.tableDiv.designItem);
      psBar.show();

      me.tableDiv.designItem.designer.hideDialogs();
      if (me.lockedInPlace) return;
      if (me.hLines.length < 1 || me.vLines.length < 1) return;

      var cursorStartX = designUtils.getX(event);
      var cursorStartY = designUtils.getY(event);

      me.hLines[0].startTop = parseInt(me.hLines[0].style.top);
      me.hLines[0].startLeft = parseInt(me.hLines[0].style.left);
      me.vLines[0].startTop = parseInt(me.vLines[0].style.top);
      me.vLines[0].startLeft = parseInt(me.vLines[0].style.left);
      me.hLines[me.hLines.length - 1].startTop = parseInt(me.hLines[me.hLines.length - 1].style.top);
      me.hLines[me.hLines.length - 1].startLeft = parseInt(me.hLines[me.hLines.length - 1].style.left);
      me.vLines[me.vLines.length - 1].startTop = parseInt(me.vLines[me.vLines.length - 1].style.top);
      me.vLines[me.vLines.length - 1].startLeft = parseInt(me.vLines[me.vLines.length - 1].style.left);

      function mousemove(event) {
        var y = designUtils.getY(event) - cursorStartY;
        var x = designUtils.getX(event) - cursorStartX;
        var hIndex = 0;
        var vIndex = 0;
        if (type == "sw" || type == "se") hIndex = me.hLines.length - 1;
        if (type == "ne" || type == "se") vIndex = me.vLines.length - 1;
        doResize(x, y, hIndex, false, me.hLines[hIndex].startTop, me.hLines[hIndex].startLeft);
        doResize(x, y, vIndex, true, me.vLines[vIndex].startTop, me.vLines[vIndex].startLeft);
        if ((type == "sw" || type == "se") && me.hLines.length > 2) {
          var addHeight = y;
          if (addHeight < -me.rowHeight + 5) addHeight = -me.rowHeight + 5;
          if (typeof me.scrollbarObj.increaseHeight == "function") me.scrollbarObj.increaseHeight(addHeight);
        }
        psBar.set(me.tableDiv.designItem);
      }
      function mouseup() {
        designUtils.removeEvent(document, "mousemove", mousemove);
        designUtils.removeEvent(document, "mouseup", mouseup);
        if ((type == "sw" || type == "se") && (me.hLines.length >= 3 || (me.hasHeader && me.hLines.length == 2))) {
          var tableBottom = parseInt(me.hLines[me.hLines.length - 1].style.top);
          var minRow = me.hasHeader ? 2 : 1;
          if (me.cells.length > minRow) {
            me.removeLastRowCells();
            if (tableBottom > parseInt(me.hLines[me.hLines.length - 1].style.top) + me.rowHeight - 3) {
              var addedSome = false;
              while (parseInt(me.hLines[me.hLines.length - 1].style.top) < tableBottom) {
                me.addRow();
                addedSome = true;
              }
              if (addedSome) me.mirrorDownAll();
            }
          }
          else {
            me.rowHeight = parseInt(me.hLines[me.hLines.length - 1].style.top) - parseInt(me.hLines[me.hLines.length - 2].style.top);
          }
        }
        me.doExpandToLayout();
        me.sendToDesigner();
        psBar.hide();
      }
      designUtils.addEvent(document, "mousemove", mousemove);
      designUtils.addEvent(document, "mouseup", mouseup);
      var designer = me.tableDiv.designItem.designer;
      designer.undo.start("Size Grid");
      // order matters -- left/top have to be added to undo first, so they can be undone last
      designer.selection.addToUndo(["left", "top", "number of rows", "header height", "column widths"]);
      designUtils.preventEvent(event);
    }
    designUtils.addEvent(handle, "mousedown", mousedown);

    me.container.appendChild(handle);
    return handle;
  }

  /**
   * Get CSS style string based on grid padding properties. Defaults are set in profoundui.css.
   * These inline styles end up in header cells and database-driven-grid data cells.
   * @returns {String}
   */
  function getPaddingCSS() {
    var paddingCSS = "";

    var paddingValue = me.paddingProps["padding bottom"];
    if (paddingValue != null && paddingValue != "") paddingCSS += "padding-bottom:" + paddingValue + ";";
    
    paddingValue = me.paddingProps["padding left"];
    if (paddingValue != null && paddingValue != "") paddingCSS += "padding-left:" + paddingValue + ";";
    
    paddingValue = me.paddingProps["padding right"];
    if (paddingValue != null && paddingValue != "") paddingCSS += "padding-right:" + paddingValue + ";";
    
    paddingValue = me.paddingProps["padding top"];
    if (paddingValue != null && paddingValue != "") paddingCSS += "padding-top:" + paddingValue + ";";
    
    return paddingCSS;
  }
  
  /**
   * Set all column headings. This is called many times when the grid is created. Removes and restores icons in each column.
   * It's also called on mouse moves of resizing columns or the grid.
   * @param {Array|undefined} headings    Array of strings with headings. Optional parameter to set column headings for hideable columns.
   */
  this.setHeadings = function (headings) {
    if (!me.hasHeader) return;
    if (me.cells.length <= 0) return;
    var paddingCSS = getPaddingCSS();
    var headerRow = me.cells[0];
    for (var i = 0, n=headerRow.length; i < n; i++) {
      var headerCell = headerRow[i];
      var hasFilter = false;
      var multiSortIcon = null;
      // Remove existing icons
      if (me.designMode == false) {
        if (headerCell.filterIcon != null){
          hasFilter = true;
          me.removeFilterIcon(headerCell);
        }
        if (headerCell.multiSortIcon != null){
          multiSortIcon = headerCell.multiSortIcon;
          if (multiSortIcon.parentNode != null) multiSortIcon.parentNode.removeChild(multiSortIcon);
        }
      }
      
      if (me.columnHeadings.length <= i) {
        // There are no column headings defined for this column, so ensure no text exists.
        headerCell.innerHTML = "";
      }
      else {
        var alignCSS = "";
        if (headerCell.style.textAlign != null && headerCell.style.textAlign != "") {
          alignCSS = " text-align:" + headerCell.style.textAlign;
        }
        // Set heading text from argument or from data already set.
        var hdrhtml = '<div';
        if (me.showQuickFilters) hdrhtml += ' class="qf"';
        hdrhtml += ' style="' + paddingCSS + alignCSS + '">';   //Appy styles that are set in grid properties.
        if (me.hidableColumns && headings && headings[i]) hdrhtml += headings[i];
        else if(me.columnHeadings[i]) hdrhtml += me.columnHeadings[i];
        headerCell.innerHTML = hdrhtml + '</div>';
      }
      
      // This method runs when the user resizes columns, and the sort/filter icons becomes orphaned.     
      if (hasFilter) {
        me.setFilterIcon(headerCell);
      }
      
      var placeSortIcon = false;
      
      if (me.designMode == false && me.sortable == true) {        // Add the multisort or regular sort icon to this column.
        if (multiSortIcon != null){
          appendIcon(headerCell, multiSortIcon);    //For load-all grids with multisort icons.
        }
        else if (me.sortIcon != null) {
          if (clientSortColumnId == headerCell.columnId) {
            placeSortIcon = true;
          }
          else if (me.tableDiv.columnSortResponseField != null && me.initialSortColumn == headerCell.columnId) {
            placeSortIcon = true;
          }
          else if (me.tableDiv.fieldNameSortResponseField != null && me.initialSortField != null && 
                   me.initialSortField == me.getFieldNameFromColumnIndex(headerCell.col, parseInt(me.tableDiv.initialSortFieldLength))) { // use .col, not .columnId
            placeSortIcon = true;
          }

          if (placeSortIcon) {
            detachSortIcon();
            appendIcon(headerCell, me.sortIcon);
          }
        }
      }
      
      if (me.showQuickFilters){
        var input = document.createElement('input');
        input.type = 'text';
        input.className = 'qf';
        input['placeholder'] = pui["getLanguageText"]("runtimeText", "filter text") + "...";
        if (me.designMode) {
          input.disabled = true;
        }
        else {
          input.addEventListener('mousedown', me._stopProp);  //prevent clicks on input to cause the cell to sort.
          input.addEventListener('click', me._stopProp);
          
          input.addEventListener('focus', me.ffbox);   //calls startFilter
          input.addEventListener('input', me.ffbox);   //handle filter input, including paste.
          input.addEventListener('keydown', me.ffbox); //handle enter/return.
          input.addEventListener('blur', me.ffbox);
        }
        headerCell.appendChild(input);
        var filterText = headerCell.filterText;
        if (typeof filterText === 'string' && filterText.length > 0) input.value = filterText;
      }
    }
  };

  this.clearHeadings = function () {
    if (!me.hasHeader) return;
    if (me.cells.length <= 0) return;
    for (var i = 0; i < me.cells[0].length; i++) {
      me.cells[0][i].innerHTML = "";
    }
  };

  /**
   * Add "click" handler to header cell.
   * (Called when grid is custom SQL by makeSortable, called by renderFormat after getData.)
   * @param {Object} cell  Header cell DOM element.
   * @returns {undefined}
   */
  function attachClickEventForSQL(cell) {
    if (!pui.iPadEmulation) {
      cell.style.cursor = "pointer";
    }

    function doSort() {
      if (!me.waitingOnRequest) //Respond to clicks only when data is not loading.
        sortColumnUsingSQL(cell, false);
    }
    addEvent(cell, "click", doSort);
    cell.sortColumn = doSort;    
  }

  /**
   * Setup the UI to allow sorting a column. Parse server response for sort column and direction when available.
   * Called when the "sortable columns" property is set; i.e. when rendering (for genie),
   * and always near the end of pui.renderFormat() for each gridsToRender. And when showing a hidden column.
   * @param {undefined|Boolean} skipInitialSort   True when called for hide-show columns. (See issue 5913.)
   * @returns {undefined}
   */
  this.makeSortable = function (skipInitialSort) {
    if (!me.sortable) return;
    if (context != "dspf" && !pui.usingGenieHandler) return;
    if (!me.hasHeader) return;
    if (me.cells.length <= 0) return;
    var headerRow = me.cells[0];
    // Setup click events for DB-driven grid specified by "database file"; it knows the fieldNames at this point. Custom SQL doesn't.
    if ((me["dataProps"]["database file"] != null && me["dataProps"]["database file"] != "") &&
      (me["dataProps"]["custom sql"] == null || me["dataProps"]["custom sql"] == "") &&
      (me["dataProps"]["data url"] == null || me["dataProps"]["data url"] == "") &&
      (me["dataProps"]["database fields"] != null && me["dataProps"]["database fields"] != "") &&
      (me["dataProps"]["load all rows"] != "true") ) {
      var fields = pui.getFieldList(me["dataProps"]["database fields"]);
      for (var i = 0; i < fields.length; i++) {
        if (!headerRow[i]) continue;
        headerRow[i].fieldName = fields[i];
        attachClickEventForSQL(headerRow[i]);
      }
    }
    else if (((me["dataProps"]["custom sql"] != null && me["dataProps"]["custom sql"] != "")
          || (me["dataProps"]["data url"] != null && me["dataProps"]["data url"] != "")) 
          && (me["dataProps"]["load all rows"] != "true") ){

      // Custom SQL and data URL grids can sort given the column number.
      var numCols = me.vLines.length - 1;
      for (var i = 0; i < numCols; i++) {
        attachClickEventForSQL(headerRow[i]);
      }
    }
    else if(me["dataProps"]["load all rows"] == "true" &&  me.forceDataArray == false){
      //Skip setting up sorting before database has loaded on a load all, database driven grid
    }
    else {
      // Make each header cell of a Load-All or Page-at-a-time grid respond to sort clicks. (Custom SQL is setup after data loads.)
      for (var i = 0; i < me.runtimeChildren.length; i++) {
        var itm = me.runtimeChildren[i];
        var col = Number(itm["column"]);
        var val = itm["value"];
        if (itm["field type"] == "html container") val = itm["html"];
        // Note: checking for .sortIndex avoids attaching sort handlers multiple times.
        if (pui.isBound(val) && !isNaN(col) && col >= 0 && col < headerRow.length && headerRow[col] && headerRow[col].sortIndex == null) {
          var fieldName = pui.fieldUpper(val["fieldName"]);
          for (var j = 0; j < me.fieldNames.length; j++) {
            if (fieldName == me.fieldNames[j]) {
              headerRow[col].sortIndex = j;
              headerRow[col].fieldName = fieldName;
              headerRow[col].dataType = val["dataType"];
              headerRow[col].fieldFormat = val;
              if (val["dateFormat"]) headerRow[col].dateFormat = val["dateFormat"];
              if (!pui.iPadEmulation) {
                headerRow[col].style.cursor = "pointer";
              }
              attachClickEvent(headerRow[col]);
              break;
            }
          }
        }
      }
      if (!skipInitialSort) doInitialSort();
    }

    function attachClickEvent(cell) {
      function doSort() {
        if (me.tableDiv.columnSortResponseField != null) {
          me.columnSortResponse = String(cell.columnId);
          pui.columnSortResponseGrid = me;
          pui.respond();
          pui.columnSortResponseGrid = null;
        }
        else if (me.tableDiv.fieldNameSortResponseField != null) {
          me.fieldNameSortResponse = me.getFieldNameFromColumnIndex(cell.col, parseInt(me.tableDiv.fieldNameSortResponseFieldLength));    // use .col, not .columnId
          if (me.fieldNameSortResponse == null) {
            me.returnSortOrder = null;
            return;
          }
          pui.fieldNameSortResponseGrid = me;
          pui.respond();
          pui.fieldNameSortResponseGrid = null;
        }
        else {
          sortColumn(cell);
        }
      }
      addEvent(cell, "click", doSort);
      cell.sortColumn = doSort;
    }
  };
  
  /**
   * This does the initial sorting or setup of the grid when "initial sort field|column" properties are set, or when the multi-sort
   * dialog is submitted with nothing checked, this resets the sorting to the initial sort columns/fields. Initially, for load-all
   * grids the grid data is sorted; for DBD grids, the columns are setup.
   * @param {Boolean|undefined} suppressXHR     For DBD grids avoid making XMLHTTPRequest when true.
   * @returns {Boolean}   Returns true if initial sort fields were set; false if none were.
   */
  function doInitialSort(suppressXHR){
    function headerIsSortCol(arrEl, hcell){
      return parseInt(arrEl,10) === hcell.columnId;
    }
    function headerIsSortField(arrEl, hcell){
      return arrEl === hcell.fieldName;
    }
    function getIsDescending(arrEl, hdrcell){
      return isDefaultSortDescending(hdrcell.columnId);
    }
    
    var headerRow = me.cells[0];
    // Setup sort direction and icons based on initial/default fields or server response.
    if (me.initialSortColumnMulti instanceof Array){
      importArrIntoMultiSort(me.initialSortColumnMulti, headerIsSortCol, getIsDescending);
      if (me.isDataGrid() && me["dataProps"]["load all rows"] != "true"){
        sortColumnUsingSQL(null, suppressXHR);  //Setup columns but do not make XHR.
      } 
      else {
        sortColumn(null, true);
      }
    }
    else if (me.initialSortFieldMulti instanceof Array ){
      if (me.isDataGrid() && me["dataProps"]["load all rows"] != "true"){
        //convert me.initialsSortFieldMulti to use colIds, which are not null at this time
        for(i = 0; i < me.initialSortFieldMulti.length; i++){
          me.initialSortFieldMultiData[i] = me.getColumnIndexFromFieldName(me.initialSortFieldMulti[i]);
        }
        importArrIntoMultiSort(me.initialSortFieldMultiData, headerIsSortCol, getIsDescending);
         sortColumnUsingSQL(null, suppressXHR);
      }
      else {
        importArrIntoMultiSort(me.initialSortFieldMulti, headerIsSortField, getIsDescending);
        sortColumn(null, true);
      }
    }
    else if (me.initialSortColumn != null) {
      if (headerRow[me.initialSortColumn]){
        if (me.isDataGrid() && me["dataProps"]["load all rows"] != "true"){
          sortColumnUsingSQL(headerRow[me.initialSortColumn], suppressXHR);
        }
        else {
          sortColumn(headerRow[me.initialSortColumn], true);
        }
      }
    }
    else if (me.initialSortField != null) {
      var initialSortColumn = me.getColumnIndexFromFieldName(me.initialSortField);
      if(me.isDataGrid() && me["dataProps"]["load all rows"] != "true"){
        if (initialSortColumn != null) sortColumnUsingSQL(headerRow[initialSortColumn], suppressXHR);
      }
      else{
        if (initialSortColumn != null) sortColumn(headerRow[initialSortColumn], true);
      }
    }
    else {
      return false;
    }
    return true;
  }

  /**
   * Returns undefined if persistState isn't enabled or not setup.
   * Returns a state object otherwise.
   * @returns {undefined|Array|Object}
   */
  function restoreStatePreCheck() {
    if (persistState == false) {
      return;
    }

    var state = loadState();
    if (state == null) {
      return;
    }

    // Reset storage if number/width of columns has changed.
    if (state["cols"] == null || state["cols"] != columnSignature) {
      saveState({});
      return;
    }
    return state;
  }

  // Called after the grid has loaded. dataGrid state is restored before the first XHR,
  // in restoreStateDataGrid().
  this.restoreState = function () {

    var state = restoreStatePreCheck();
    if (state == null) {
      return;
    }

    // Restore saved column widths.
    if (resizableColumns && !me.hidableColumns) {
      var colWidths = state["colWidths"];
      if (colWidths != null) {
        me.setColumnWidths(colWidths);
        me.sizeAllCells();
        me.setHeadings();
      }
    }

    // Restore saved column sequence.
    if (movableColumns && !me.hidableColumns) {
      var colSequence = state["colSequence"];
      if (colSequence != null) {
        var cells = new Array(colSequence.length);
        for (var i = 0; i < cells.length; i++) {
          cells[i] = me.cells[0][colSequence[i]];
        }
        for (var i = 0; i < cells.length; i++) {
          var from = cells[i].col;
          var to = i;
          me.moveColumn(from, to);
        }
      }
    }
    // restore hidable columns sequence
    if (me.hidableColumns) {
      var colState = state["hidableColState"];
      var widths = state["colWidths"];
      if (widths) widths = widths.filter(function(size){ return (size); });
      if (colState) {
        var savedCols = colState["cols"];
        // return newCols array
        var cols = savedCols.map(function (col) { return col; });
        var colSequence = state["colSequence"];
        if (cols != null) {
          cols.sort(function(a, b) {
            if (a["savedColumn"] > b["savedColumn"]) return 1;
            else return -1;
          })
          .forEach(function (col) {
            var columnId = col["columnId"];
            if (columnId !== undefined) {
              // Find the entry in me.columnInfo whose column ID matches the saved column. Set the found name, etc. (and stop looking).
              me.columnInfo.every(function(orgCol) {
                if (orgCol["columnId"] === columnId) {
                  col['blankHeader'] = orgCol['blankHeader'];  //7384: prevent header from being cleared when saved state header was blank but the new header was not.
                  col["name"] = orgCol["name"];
                  col['field'] = orgCol['field']; //For DBD grids, field names are stored with the columns. Save to allow later matching. #6600
                  return false;
                }
                return true;
              });
              if (!col["showing"]) me.rmvColumn(columnId);
              else if (movableColumns) {
                var curCol = getCurrentColumnFromId(columnId);
                if (curCol >= 0 && curCol != col["savedColumn"]) me.moveColumn(curCol, col["savedColumn"]);
              }
            }
          });
          if (colSequence) cols.colSequence = colSequence;
          me.columnInfo = cols;
          // Resort columnInfo array based on saved state. 
          me.columnInfo.sort(function(a, b) {
            var indexA = null; 
            var indexB = null;
            savedCols.every(function (col, index) {
              if (a["columnId"] === col["columnId"]) indexA = index;
              if (b["columnId"] === col["columnId"]) indexB = index;
              if (indexA !== null && indexB !== null) return false;
              return true;
            });
            return indexA > indexB ? 1: -1;
          });
        }
      }
      if (widths) {
        me.setColumnWidths(widths);
        me.sizeAllCells();
      }
      if (me.expandToLayout) me.doExpandToLayout();
      me.setHeadings(me.getHeadings(me.columnInfo));
    }

    restoreSort(state, true, sortColumn);

    var filters = state["filters"];
    if (filters != null && !me.isDataGrid()) {
      for (var i = 0; i < filters.length; i++) {
        var col = state["filters"][i]["column"];
        var text = state["filters"][i]["text"];
        if (text == null || text == "")
          me["removeFilter"](col);
        else
          me["setFilter"](col, text);

      }
    }

  };
  
  /**
   * Parse the persisted sort order and call the appropriate sorting function.
   * @param {Object} state            From the localStorage data.
   * @param {Boolean} skipIfDataGrid  When true, prevent sort from happening twice for DBD grids.
   * @param {Function} sortFunc       sortColumn or sortColumnUsingSQL depending on grid type.
   * @returns {undefined}
   */
  function restoreSort(state, skipIfDataGrid, sortFunc){
    var skip = skipIfDataGrid && me.isDataGrid();
    
    if (me.sortable && !skip && me.tableDiv.columnSortResponseField == null && me.tableDiv.fieldNameSortResponseField == null) {

      var sort = state["sort"];
      if (sort != null){
        if (sort["columnId"] != null && sort["descending"] != null) {
          var sortCell;
          for (var i = 0; i < me.cells[0].length; i++) {

            if (me.cells[0][i].columnId == sort["columnId"]) {
              sortCell = me.cells[0][i];
              sortCell.sortDescending = !sort["descending"];
              break;
            }
          }
          if (sortCell){
            sortFunc(sortCell, true);
          }
        }
        else if (sort['multiSort'] instanceof Array){
          sortMultiOrder = [];
          function matches(arrEl, hcell){
            return hcell.columnId === arrEl['columnId'];
          }
          function getIsDescending(arrEl){
            return arrEl['descending'];
          }
          importArrIntoMultiSort(sort['multiSort'], matches, getIsDescending);
          
          sortFunc(null, true);
        }
      }
    }
  }
  
  /**
   * Restore filter and sort order of a data grid. This should be called only once:
   * the first time getData is called. This does not cause new AJAX calls.
   * @returns {undefined}
   */
  function restoreStateDataGrid() {
    var state = restoreStatePreCheck();
    if (state == null) {
      return;
    }

    restoreSort(state, false, sortColumnUsingSQL);

    var filters = state["filters"];
    if (filters != null) {

      // Set each filter on header cells without causing a request.
      for (var i = 0; i < filters.length; i++) {
        var col = state["filters"][i]["column"];
        var text = state["filters"][i]["text"];

        var headerCell = me.cells[0][getCurrentColumnFromId(col)];
        if (headerCell == null) return;
        if (text != null && text != "") {
          me.highlighting.columnId = headerCell.columnId; //The last filtered column gets highlighted.
          me.highlighting.col = headerCell.col;
          me.highlighting.text = text;
          me.setFilterIcon(headerCell);
          headerCell.filterText = text;
        } else {
          me.highlighting.text = null;
          me.removeFilterIcon(headerCell);
          headerCell.filterText = null;
        }
      }
    }
  }
  
  /**
   * For each element in an array: compare it to header cells, add to sortMultiOrder if matching, and set the sortDescending property
   * based on the callback if matching.
   * @param {Array} arr           List of column numbers, field names, etc.
   * @param {Function} matches    Compares array element to a property in the header cell, returning true if matching.
   * @param {Function} getIsDescending    Returns true if the header is to be set descending; else false. Called for each matching header.
   */
  function importArrIntoMultiSort(arr, matches, getIsDescending ){
    var headerRow = me.cells[0];
    for (var i=0; i < arr.length; i++){
      // Find the header cell that matches the current element.
      for (var col=0; col < headerRow.length; col++){
        var hcell = headerRow[col];
        if (matches(arr[i], hcell)){
          hcell.sortDescending = getIsDescending(arr[i], hcell);
          sortMultiOrder.push(hcell);
          break;
        }
      }
    }
  }
  
  /**
   * Clear all sortMultiOrder entries and make the argument the one entry. 
   * (Called by either sortColumn or sortColumnUsingSQL when cell clicked, initial sort is set, or restore one sort column happens.)
   * Post-Conditions: headerCell.sortDescending has 
   * @param {Number} columnId   
   * @param {Boolean} ascending     The value to set the header.sortDescending property to.
   * @returns {undefined}
   */
  function multiSortOnlyUseThis( columnId, ascending ){
    function matches(arrEl, hcell){
      return hcell.columnId == arrEl;
    }
    function getIsDescending(){
      return ascending;
    }
    sortMultiOrder = [];
    importArrIntoMultiSort( [ columnId ], matches, getIsDescending );
  }
  
  /**
   * Return whether the column's default sort direction is descending. If there is only one entry in defaultSortOrderArray, then all
   * columns use that value.
   * @param {Number} col  The columnId to check for a value in "default sort order".
   * @returns {Boolean}   Default direction is false, meaning the default direction for a column is ascending.
   */
  function isDefaultSortDescending(col) {
    var sortOrder = null;
    if (me.defaultSortOrderArray.length == 0) return false;
    if (me.defaultSortOrderArray.length == 1) {
      sortOrder = me.defaultSortOrderArray[0];
    }
    else {
      sortOrder = me.defaultSortOrderArray[col];
    }
    if (sortOrder == null) return false;
    if (sortOrder.length < 1) return false;
    sortOrder = sortOrder.substr(0, 1).toUpperCase();
    return (sortOrder == "D");
  }

  /**
   * Set .sortDescending on all header cells to default values. Necessary because other columns may have been sorted previously; when
   * one or more columns are being sorted now, those other columns can be sorted in the correct direction when clicked in the future.
   * @param {Boolean} forMultiSort  "true" passed when called from multi-sort panel only. See comments below.
   * @returns {undefined}
   */
  function resetAllDefaultSortDescending(forMultiSort) {
    var headerRow = me.cells[0];
    for (var col = 0; col < headerRow.length; col++) {
      // fix for #7194: parm forMultiSort is added to handle multi-sort.
      // Prior to the fix for #7194, the code is always
      // headerRow[col].sortDescending =!isDefaultSortDescending(headerRow[col].columnId)
      // with the "!".
      // That logic is needed so that after 1st load, when you click a column to do client-side sorting,
      // then the column is sorted Ascending.
      // But that logic does NOT work when we need to return the "return sort order" for server-side sorting for 
      // multi-sort. In that case, we must NOT use the "!". Otherwise, the sort order for any column NOT used
      // on multi-sort panel is *opposite* of what it should be (the default sort order). In a sense, that should not 
      // matter since the column is NOT used for sorting anyway, but it's wrong; the doc page says we return
      // the default sort order for any unsorted column, so we should make it work like that.
      // To minimize regression bugs, parm "forMultiSort" is added to this function. "true" is passed for 
      // multi-sort only, and default of "false" is passed everywhere else, so that the behavior for all other cases
      // is the same as before.
      if (forMultiSort)
        // note that there is no "!" here
        headerRow[col].sortDescending =   isDefaultSortDescending(headerRow[col].columnId); //use .columnId instead of .col in case column moved.
      else
        // note the "!" here
        headerRow[col].sortDescending = ! isDefaultSortDescending(headerRow[col].columnId); //use .columnId instead of .col in case column moved.
    }
  }
  
  /**
   * Set which columns are in the multi-sort, set the direction, and execute the sort.
   * @param {Array} colPriority   An array of objects with keys, col and asc; columnId and do-sort-ascending.
   * @returns {undefined}
   */
  this.multisort = function(colPriority){
    clientSortColumnId = null;
    sortMultiOrder = [];
    if (!(colPriority instanceof Array)) return;
    
    resetAllDefaultSortDescending(true);
    
    var returnOrder = '';
    var columnResponse = '';
    var fieldNameResponse = '';
    var comma = '';
    
    function elementMatchesHeaderCell(arrEl, hcell){
      return arrEl.cid === hcell.columnId;
    }

    function getIsDescendingAndSetResponseFields(arrEl, hcell){
      columnResponse += comma + arrEl.cid;
      if (me.tableDiv.fieldNameSortResponseField != null){
        fieldNameResponse += comma + me.getFieldNameFromColumnIndex( hcell.col, parseInt(me.tableDiv.fieldNameSortResponseFieldLength) );   // use .col, not .columnId
      }
      comma = ',';
      return arrEl.desc;
    }

    importArrIntoMultiSort(colPriority, elementMatchesHeaderCell, getIsDescendingAndSetResponseFields);

    // Build the returnSortOrder response value, which requires a value for every column.
    // There may be some hidden columns; need to return the default sort order
    // for those hidden columns also.
    comma = '';
    var columnIdMax = 0;
    if (me.runtimeChildren.length > 0) {
      var columnIdMaxCol = me.runtimeChildren.reduce(function(prev, current) {return (prev["columnId"] > current["columnId"]) ? prev : current;});
      columnIdMax = columnIdMaxCol["columnId"];
    }
    
    for (var columnId=0; columnId <= columnIdMax; columnId++) {
      // check if this columnId is displayed; if yes, return sort order as stored in me.cells[0]
      // otherwise, return default sort order for that columnId
      var columnDisplayed = false;
      for (var i=0; i < me.cells[0].length; i++) {
        if (me.cells[0][i].columnId === columnId ) {                  // column is displayed
          returnOrder += comma + (me.cells[0][i].sortDescending ? 'D' : 'A');
          comma = ',';
          columnDisplayed = true;
          break;
        }
      }
      if (!columnDisplayed) {
        returnOrder += comma + (isDefaultSortDescending(columnId) ? 'D' : 'A');
        comma = ',';
      }
    }

    // Respond, or send db-driven request, or do client-side sorting.
    if (me.tableDiv.columnSortResponseField != null) {
      me.columnSortResponse = columnResponse;
      pui.columnSortResponseGrid = me;
      if (me.tableDiv.returnSortOrderField != null) me.returnSortOrder = returnOrder;
      pui.respond();
      pui.columnSortResponseGrid = null;
    }
    else if (me.tableDiv.fieldNameSortResponseField != null) {
      me.fieldNameSortResponse = fieldNameResponse;
      if (me.fieldNameSortResponse == null) {
        me.returnSortOrder = null;
      }
      else {
        if (me.tableDiv.returnSortOrderField != null) me.returnSortOrder = returnOrder;
        pui.fieldNameSortResponseGrid = me;
        pui.respond();
        pui.fieldNameSortResponseGrid = null;
      }
    }
    else {
      if (sortMultiOrder.length == 0){
        // User submitted the multi-sort with all columns unchecked.
        if(!doInitialSort(false)) restoreOriginalSortOrder();
      }
      else {
        if (me.isDataGrid() && me.forceDataArray == false) {
          sortColumnUsingSQL(null, false);
        }
        else {
          sortColumn(null, false);
        }
      } 
    }
  };

  /**
   * When a grid header is clicked, this is called to sort the internal data. Multi-column sort may also call this.
   * @param {Object|Null} cell  DOM element of header cell. When null, a multi-column sort must be the caller.
   *                            When not null, the cell becomes the only entry in the multi-column sort priority.
   * @param {Boolean} restoringOrInitialSort
   * @returns {undefined}
   */
  function sortColumn(cell, restoringOrInitialSort) {
    if (me.gridMenu != null) me.gridMenu.hide();
    if (cell == null && sortMultiOrder.length < 1) return;
    
    var desc;   //Was descending; sort will become ascending if true. The cell was descending when clicked, so the user is switching the order.
                //With multi-sort and doInitialSort, the cell.sortDescending should have previously been set to the desired direction.
    if (cell != null){
      desc = cell.sortDescending;
      resetAllDefaultSortDescending(false);
      if (desc == null){
        desc = cell.sortDescending;  //Use the default that was just set. false here means sort will become ascending.
      }
      multiSortOnlyUseThis( cell.columnId, ! desc );
    }
    
    var sortingFunction;
    if (customGridSortFunction !== undefined) {
      try {
        var args = 'value1, value2, fieldName, isDescending, fieldDateFormat, fieldFormat, multiFields';
        sortingFunction = new Function(args, customGridSortFunction);
      } catch (error) {
        if (error) {
          console.log('Sort function error: ');
          console.error(error);
        }
      }
    }
    
    if (me.tableDiv.columnSortResponseField == null && me.tableDiv.fieldNameSortResponseField == null) {
      if (cell != null) clientSortColumnId = cell.columnId;
      pui.rrnTracker = {}; // to do -- problem ... rrn tracker doesn't handle multiple grids?

      if (!me.sorted) {
        for (var i = 0; i < me.dataArray.length; i++) {
          me.dataArray[i].subfileRow = i + 1;
        }
      }
      for (var i = 0; i < me.dataArray.length; i++) {
        me.dataArray[i].beforeSort = i;
      }
      // Set me.sorted to true before calling saveResponsesToDataArray()
      // so that it will use the subfileRow set earlier. #4365 #4143
      me.sorted = true;
      saveResponsesToDataArray();

      // Populate arguments for the custom sort functions.
      var fieldNameUpper = "";
      var fieldDateFormat = null;
      var fieldFormat = {};
      var multiFields = null;
      function loadFieldInfo(hcell){
        if (typeof hcell.fieldName === 'string') fieldNameUpper = hcell.fieldName.toUpperCase();
        if (hcell.dateFormat) fieldDateFormat = hcell.dateFormat;
        if (hcell.fieldFormat) fieldFormat = hcell.fieldFormat;
      }
      
      if (cell != null) { 
        loadFieldInfo(cell);
      }
      else if (customGridSortFunction !== undefined || typeof pui['gridSort'] == 'function'){
        multiFields = [];
        
        for (var i=0; i < sortMultiOrder.length; i++){
          loadFieldInfo(sortMultiOrder[i]);
          multiFields.push({ 'fieldName': fieldNameUpper, 'fieldDateFormat': fieldDateFormat, 'fieldFormat': fieldFormat });
        }
      }
      // done preparing for custom sort functions.

      function doSort(row1, row2) {
        var value1, value2;
        
        function loadValues(sIndex, dataType, fieldName){
          value1 = row1[sIndex];
          value2 = row2[sIndex];
          
          if (dataType == "zoned" || dataType == "floating") {
            value1 = Number(value1);
            value2 = Number(value2);
          }
          else if (dataType == "reference") {
            var refObj = me.ref[fieldName];
            if (refObj != null) {
              if (refObj.dataType == 7 || refObj.dataType == 9 || refObj.dataType == 10) { // zoned, packed, floating
                value1 = Number(value1);
                value2 = Number(value2);
              }
            }
          }
          else if (dataType == "graphic"){
            value1 = pui.formatting.decodeGraphic(value1);
            value2 = pui.formatting.decodeGraphic(value2);
          }
        }

        if (cell != null){
          loadValues(cell.sortIndex, cell.dataType, cell.fieldName);
        }
        else {
          // Get values from columns in order of sort priority.
          var foundDiff = false;
          var useVal1, useVal2;
          for (var i=0; i < sortMultiOrder.length; i++){
            var tmpcell = sortMultiOrder[i];
            loadValues(tmpcell.sortIndex, tmpcell.dataType, tmpcell.fieldName);
            
            if (customGridSortFunction !== undefined || typeof pui['gridSort'] == 'function'){
              multiFields[i]['value1'] = value1;
              multiFields[i]['value2'] = value2;
            }

            if (!foundDiff && value1 != value2){      //Values used for comparison are the first differences found.
              desc = !tmpcell.sortDescending;  //In multi-sort, sortDescending has the desired direction, but the sort function expects the opposite.
              useVal1 = value1;
              useVal2 = value2;
              foundDiff = true;
            }
          }
          if (desc == null) desc = true;
          if (useVal1 != null) value1 = useVal1;
          if (useVal2 != null) value2 = useVal2;
        }

        if (typeof sortingFunction == 'function'){
          return customSortHandler(sortingFunction, value1, value2, fieldNameUpper, desc, fieldDateFormat, fieldFormat, multiFields);
        }
        else if (typeof pui["gridSort"] == "function") {
          return customSortHandler(pui["gridSort"], value1, value2, fieldNameUpper, desc, fieldDateFormat, fieldFormat, multiFields );
        }
        else {
          // Decide if the value in one row is higher/lower than next row. See issues 5030 and 4297 for test cases.
          // If sort order is descending, then value1 should be before value2 if value1 is lower.
          if ((desc && value1 < value2) || (!desc && value1 > value2)) return -1;   //value1 should appear before value2 in the grid when order is ascending.
          else if (value1 == value2) {
            // If the values are the same, then this secondarily sorts by the initial order that records were written to the subfile. That keeps records from 
            // jumping around (#4297). By changing the sort order when "desc" changes, grids with all same values can sort in a reverse direction than the initial order (#5030).
            // When in ascending order, secondary order is FIFO. When in descending order, secondary order is LIFO. (See Sortable Columns doc page.)
            if ((desc && row1.subfileRow < row2.subfileRow) || (!desc && row1.subfileRow > row2.subfileRow)) return -1;
            else return 1;
          }
          else return 1;  //value1 should appear after value2 in the grid when order is ascending.
        }
      }
      // Handle the pui.gridSort and the screen level defined grid function. 
      function customSortHandler(func, value1, value2, fieldNameUpper, desc, fieldDateFormat, fieldFormat, multiFields) {
        var returnVal = func(value1, value2, fieldNameUpper, desc, fieldDateFormat, fieldFormat, multiFields);
        if (typeof returnVal != "number") returnVal = 0;
        if (returnVal > 0) {
          if (desc) return -1;
          else return 1;
        }
        if (returnVal < 0) {
          if (desc) return 1;
          else return -1;
        }
        return 0;
      }
      
      me.dataArray.sort(doSort);
      if (me.isFiltered()) me.visibleDataArray.sort(doSort);

      updateResponseElementsDataArrayIndex();

      me.recNum = 1;
      if (me.sflrcdnbr > 0 && restoringOrInitialSort) {

        // These are automatic sorts at render time. 
        // Need to set grid 'recNum' property (data array sequence number)
        // based on rrn provided by the program.

        for (var i = 0; i < me.dataArray.length; i++) {

          if (me.dataArray[i].subfileRow == me.sflrcdnbr) {

            me.recNum = i + 1;
            break;

          }

        }

      }

      if (me.scrollbarObj != null && me.scrollbarObj.type == "sliding") {

        me.scrollbarObj.setScrollTopToRow(me.recNum);

      }
      if(suppressGetData == false){
        me.getData();
      }

    }

    if (cell != null){
      desc = !desc;
      cell.sortDescending = desc;
      setSortIcon(cell, desc);
    }
    else {
      detachSortIcon();
      setMultiSortIcons();
    }

    if (persistState && !restoringOrInitialSort) {

      var obj = {};
      if (cell != null){
        obj["columnId"] = cell.columnId;
        obj["descending"] = cell.sortDescending;
      } else if(sortMultiOrder.length > 0 ) {
        obj['multiSort'] = [];
        for (var i=0; i < sortMultiOrder.length; i++){
          obj['multiSort'].push({
            'columnId': sortMultiOrder[i].columnId,
            'descending': sortMultiOrder[i].sortDescending
          });
        }
      }
      saveState(obj, "sort");

    }

  }
  
  /**
   * Update the data array index in pui.responseElements to point to the new data array index (after sorting).
   * @returns {undefined}
   */
  function updateResponseElementsDataArrayIndex(){
    var indexXRef = [];
    for (var i = 0; i < me.dataArray.length; i++) {
      indexXRef[me.dataArray[i].beforeSort] = i;
    }
    var startsWith = pui.formatUpper(me.recordFormatName) + ".";
    for (var fldName in pui.responseElements) {
      if (fldName.substr(0, startsWith.length) == startsWith) {
        var shortFieldName = fldName.substr(startsWith.length);
        var parts = shortFieldName.split(".");
        if (parts.length == 2) {
          var dom = pui.responseElements[fldName][0];
          dom.dataArrayIndex = indexXRef[dom.dataArrayIndex];
        }
      }
    }
  }
  
  /**
   * Put the grid data in the same order that the handler responded with or in the order that DBD grid loaded without order-by.
   * @returns {undefined}
   */
  function restoreOriginalSortOrder(){
    function doInternalSort(row1, row2){
      return row1.subfileRow > row2.subfileRow ? 1 : -1;
    }
    
    detachSortIcon();
    hideMultiSortIcons();
    me.recNum = 1;
    
    if (me.isDataGrid() && me.forceDataArray == false){
      me.sortBy = "";
      me.mask();
      me.gridLoading();
      dataGridDidInitialSort = false;   //Use "initial sort column".
    }
    else {
      me.dataArray.sort(doInternalSort);
      if (me.isFiltered()) me.visibleDataArray.sort(doInternalSort);
      updateResponseElementsDataArrayIndex();
    }
    
    if (me.scrollbarObj != null && me.scrollbarObj.type == "sliding") {
      me.scrollbarObj.setScrollTopToRow(me.recNum);
    }
    
    me.getData();
    
    me["clearState"]("sort"); //Clear sort order for persist state.
  }
  
  /**
   * Update the UI to show a column as sorted, set the sort column, and reload
   * the grid when not restoring.
   * @param {Object} cell         The header cell of the column to sort.
   * @param {Boolean} restoringOrAvoidXHR   When true, a new XHR isn't made.
   * @returns {undefined}
   */
  function sortColumnUsingSQL(cell, restoringOrAvoidXHR) {
    var desc;
    if (me.gridMenu != null) me.gridMenu.hide();
    if (cell == null && sortMultiOrder.length < 1) return;

    // The cell was clicked, meaning the user is switching the order, initial sort is sorting one column, or restoreSort is sorting it.
    if (cell != null){
      clientSortColumnId = cell.columnId;
      
      desc = cell.sortDescending;     //desc means "was descending". true here means sort will become ascending.
      resetAllDefaultSortDescending(false);
      if (desc == null){
        desc = cell.sortDescending;  //Use the default that was just set. false here means sort will become ascending.
      }
      desc = !desc;   //desc means "the desired sort order" after this line. true means sort should become descending.

      multiSortOnlyUseThis( cell.columnId, desc );
      
      // Set the "ORDER BY" SQL clause. A column number works fine in db-driven and custom sql queries.
      me.sortBy = cell.columnId + 1 + (desc ? " DESC" : "");
    }
    else {
      // With multi-sort and doInitialSort, the sortDescending should have previously been set to the desired direction.
      me.sortBy = '';
      var comma = '';
      for (var i=0; i < sortMultiOrder.length; i++){
        desc = sortMultiOrder[i].sortDescending;
        if (desc == null) desc = isDefaultSortDescending(cell.columnId);
        me.sortBy += comma + (sortMultiOrder[i].columnId + 1) + (desc ? ' DESC' : '');
        comma = ', ';
      }
    }
    me.sorted = true;

    // Avoid creating an XHR when restoring, which happens before the first XHR for data grids.
    if (!restoringOrAvoidXHR) {

      if (me.scrollbarObj != null && me.scrollbarObj.type == "sliding") {
        me.scrollbarObj.setScrollTopToRow(1);
      }
      me.recNum = 1;
      me.mask(); //disable UI until server responds.
      me.gridLoading();
      me.getData();
    }

    if (cell != null){
      cell.sortDescending = desc; //note: multiSortOnlyUseThis already causes this to be set, so this may be redundant.
      setSortIcon(cell, desc);
    }
    else {
      detachSortIcon();
      setMultiSortIcons();
    }

    if (persistState && !restoringOrAvoidXHR) {
      
      if (cell != null) {
        var obj = {};
        obj["columnId"] = cell.columnId;
        obj["descending"] = cell.sortDescending;
      }
      else if (sortMultiOrder.length > 0){
        var obj = {};
        obj['multiSort'] = [];
        for (var i=0; i < sortMultiOrder.length; i++){
          obj['multiSort'].push({
            'columnId': sortMultiOrder[i].columnId,
            'descending': sortMultiOrder[i].sortDescending
          });
        }
      }
      saveState(obj, "sort");
    }

  }
  // Detach the sortIcon from its parent (header/div).
  function detachSortIcon(){
    if (me.sortIcon != null && me.sortIcon.parentNode != null) me.sortIcon.parentNode.removeChild(me.sortIcon);
  }
  // Add sortIcon to a header cell, moving it from other cells if it existed.
  function setSortIcon(hcell, desc){
    hideMultiSortIcons();
    hcell.setAttribute("sortorder", 0); 
    if (me.sortIcon == null) {
      me.sortIcon = document.createElement("div");
    }
    else {      // Remove existing icon from its previous parent.
      if (me.sortIcon.parentNode != null) me.sortIcon.parentNode.removeChild(me.sortIcon);
    }
    
    me.sortIcon.className = (desc ? "grid-sort-arrow-descending" : "grid-sort-arrow-ascending");
    appendIcon(hcell, me.sortIcon);
  }
  // Attach icon element to header cell or first DIV of header. Icon must be an element not already in DOM.
  function appendIcon(hcell, iconEl){
    var destination = hcell;
    if (destination.firstChild != null && destination.firstChild.tagName == "DIV") {
      destination = destination.firstChild;
    }
    destination.appendChild(iconEl);
  }
  
  // Hide any existing icons.
  function hideMultiSortIcons(){
    for (var i=0; i < me.cells[0].length; i++){
      var hcell = me.cells[0][i];
      hcell.removeAttribute("sortorder");
      if (hcell.multiSortIcon != null){
        hcell.multiSortIcon.style.display = 'none';
      }
    }
  }
  
  // Display multi-sort icons for sorted columns.
  function setMultiSortIcons(){
    hideMultiSortIcons();
    
    for (var i=0; i < sortMultiOrder.length; i++){
      var hcell = sortMultiOrder[i];
      hcell.setAttribute("sortorder", i); //keeps track of sort level (primary, secondary, etc) for each sorted column
      if (hcell.multiSortIcon == null) {
        hcell.multiSortIcon = document.createElement('div');
        hcell.multiSortIcon.onclick = function(e){
          if (!pui.isRightClick(e)){
            preventEvent(e);
            me.showMultiSortPanel();
          }
        };
        appendIcon(hcell, hcell.multiSortIcon);
      }
      hcell.multiSortIcon.className = (hcell.sortDescending === true ? "grid-sort-arrow-descending" : "grid-sort-arrow-ascending");
      hcell.multiSortIcon.style.display = '';
    }
  }

  function saveResponsesToDataArray() {
    var fieldXRef = {};
    for (var i = 0; i < me.fieldNames.length; i++) {
      fieldXRef[me.fieldNames[i]] = i;
    }
    var startsWith = pui.formatUpper(me.recordFormatName) + ".";
    for (var fldName in pui.responseElements) {
      if (fldName.substr(0, startsWith.length) == startsWith) {
        var shortFieldName = fldName.substr(startsWith.length);
        var parts = shortFieldName.split(".");
        if (parts.length == 2) {
          var fieldIdx = fieldXRef[parts[0]];
          if (fieldIdx != null) {
            var dom = pui.responseElements[fldName][0];
            if (dom != null && dom.subfileRow != null) {
              var rowData;
              // if the subfile is not sorted use the dataArrayIndex. #4365 
              // when filtered check to see if the subfileRow is the same as the dom subfileRow. #4716
              // otherwise loop through the dataArray to find the subfileRow of the dom element. #4143
              if (!me.sorted && dom.dataArrayIndex != null) {
                if (me.dataArray[dom.dataArrayIndex] && me.dataArray[dom.dataArrayIndex].subfileRow != undefined && me.dataArray[dom.dataArrayIndex].subfileRow !== dom.dataArrayIndex) {
                  for (var i = 0; i < me.dataArray.length; i++) {
                    if (me.dataArray[i].subfileRow === dom.subfileRow) {
                      rowData = me.dataArray[i];
                      break;
                    }
                  }
                } else {
                  rowData = me.dataArray[dom.dataArrayIndex];
                }
              } else {
                for (var i = 0; i < me.dataArray.length; i++) {
                  if (me.dataArray[i].subfileRow === dom.subfileRow) {
                    rowData = me.dataArray[i];
                    break;
                  }
                }
              }
              if (rowData != null) {
                var value = dom.value;
                if (dom.comboBoxWidget != null) {
                  value = dom.comboBoxWidget.getValue();
                }
                if (dom.floatingPlaceholder != null) {
                  value = dom.floatingPlaceholder.getValue();
                }
                if (dom.onOffSwitch != null) {
                  value = "";
                  if (dom.onOffSwitch.isOn && dom.onOffSwitch.onValue != null) {
                    value = dom.onOffSwitch.onValue;
                  }
                  else if (!dom.onOffSwitch.isOn && dom.onOffSwitch.offValue != null) {
                    value = dom.onOffSwitch.offValue;
                  }
                }
                if (dom.tagName == "INPUT" && dom.type == "checkbox") {
                  if (dom.checked) {
                    if (dom.checkedValue != null && dom.checkedValue != "") value = dom.checkedValue;
                    else value = "1";
                  }
                  else {
                    if (dom.uncheckedValue != null && dom.uncheckedValue != "") value = dom.uncheckedValue;
                    else value = " ";
                  }
                }
                if((dom.isLoading == null || dom.isLoading === false) && dom.modified === true){
                  var oldValue = dom.formattingInfo.value;
                  var oldRevert = dom.formattingInfo["revert"];
                  dom.formattingInfo.value = value;
                  dom.formattingInfo["revert"] = true;
                  value = pui.FieldFormat.format(dom.formattingInfo);
                  dom.formattingInfo.value = oldValue;
                  dom.formattingInfo["revert"] = oldRevert;
                  if (typeof value == "object") {
                    // Error.
                    value = "";
                  }
                  rowData[fieldIdx] = value;
                }
              }
            }
          }
        }
      }
    }
  }

  function loadState() {

    var state = null;

    if ((pui.isLocalStorage() && localStorage[me.storageKey] != null)|| (pui.isSessionStorage() && sessionStorage[me.storageKey] != null) || (programState && pui.programStorage[me.storageKey] != null)) {

      try {

        if(sessionState == true){
          state = JSON.parse(sessionStorage[me.storageKey]);
        }
        else if(programState == true){
          state = JSON.parse(pui.programStorage[me.storageKey]);
        }
        else{
          state = JSON.parse(localStorage[me.storageKey]);
        }
        

      }
      catch(e) {

      }

    } 
    
    if (me.storedState != null && me.storedState != "") {

      state = JSON.parse(me.storedState);

    }
    else if (state != null && state != "") {

      me.storedState = JSON.stringify(state);
      
    }

    return state;

  }

  function saveState(value, key) {

    var stg;
    if (key == null) {

      // Root object.
      stg = value;

    }
    else {

      stg = loadState();
      if (stg == null) {

        stg = {};

      }

      stg[key] = value;

    }

    stg["cols"] = columnSignature;
    me.storedState = JSON.stringify(stg);
    if (persistState == true){
      if(sessionState == true){
        sessionStorage[me.storageKey] = JSON.stringify(stg);
      }
      else if(programState == true){
        pui.programStorage[me.storageKey] = JSON.stringify(stg);
      }
      else{
        localStorage[me.storageKey] = JSON.stringify(stg);
      }
    }

  }

  /**
   * Execute a user-defined event. (The argument names get obfuscated, but the user code expects them not to be.)
   * @param {String} eventName
   * @param {undefined|Number} rowNum  When set, this is the visible row number associated with the event; if rowNum is 1, then the row is the first data row.
   * @param {undefined|Boolean} isRghtClk  
   * @param {undefined|Event} event
   * @param {undefined|Number} column
   * @returns {undefined|Boolean}  Returns false upon error; else returns undefined.
   */
  function executeEvent(eventName, rowNum, isRghtClk, event, column) {
    if (me.designMode) return;
    var dataRecords;
    var eventCode = me.events[eventName];
    var idx = -1;
    if (rowNum != null){
      idx = me._getDataIndexFromDOMRow(rowNum - (me.hasHeader ? 0 : 1 ));  //Get the index of dataArray for the row. Handles hidden rows.
      dataRecords = me.isFiltered() ? me.visibleDataArray : me.dataArray;
    }
    
    if (pui.isRoutine(eventCode)) {
        var routineRow = null;
        var routineGrid = null;
        if (idx >= 0) {
          var routineRow = idx + 1;
          if (dataRecords[idx] != null && dataRecords[idx].subfileRow != null) {
            routineRow = dataRecords[idx].subfileRow;
          }
          routineGrid = me.recordFormatName;
        }

      pui["runLogic"](eventCode.routine, routineRow, routineGrid);
      return;
    }
    if (eventCode != null && eventCode != "") {
      try {
        pui["temporary_property"] = me;
        eval("var grid = pui.temporary_property;");
        pui["temporary_property"] = me.tableDiv;
        eval("var dom = pui.temporary_property;");

        eval("var row = arguments[1];");
        eval("var rowNumber = arguments[1];");
        
        // 7536: ensure rowclicked property visible to event code
        pui["temporary_property"] = me.rowclicked;
        eval("var rowclicked = pui.temporary_property");

        // 7208: ensure colclicked property visible to event code
        pui["temporary_property"] = me.columnclicked;
        eval("var columnclicked = pui.temporary_property");

        if (eventName == "onrowclick") {
          eval("var isRightClick = arguments[2];");
        }

        if (arguments.length >= 4) {
          eval("var event = arguments[3]");
        }

        eval("var column = arguments[4];");

        if (rowNum != null) {
          if (!me.hasHeader) rowNum -= 1;
          var rowCellsArray = me.cells[rowNum];
          pui["temporary_property"] = rowCellsArray;
          eval("var rowCells = pui.temporary_property;");
        }
        
        if (idx >= 0) {
          var adjustedRow = idx + 1;  //The "row" begins with 1 being the first row.
          eval("rowNumber = " + adjustedRow);
          if (dataRecords[idx] != null && dataRecords[idx].subfileRow != null) {
            adjustedRow = dataRecords[idx].subfileRow;
          }
          eval("row = " + adjustedRow);
          eval("var rrn = " + adjustedRow);
        }
        
        delete pui["temporary_property"];
        var returnVal = eval(eventCode);
        if (returnVal == false) return false;
      }
      catch(err) {
        pui.scriptError(err, eventName.substr(0, 1).toUpperCase() + eventName.substr(1) + " Error:\n");
        return false;
      }
    }
  }

  this.consumeDataFromScreen = function (multiple, newGrid) {
    if (me.dataConsumed) return;
    me.dataConsumed = true;
    var startRow = Number(me["dataProps"]["starting row"]);
    var endRow = Number(me["dataProps"]["ending row"]);
    if (isNaN(startRow) || isNaN(endRow)) return;
    if (me["dataProps"]["data columns"] == null) return;

    var colArray = [];
    for (var x = 0; x < multiple; x++) {
      var prop = "data columns";
      if (x > 0) prop += " " + (x + 1);
      var dataColumns = me["dataProps"][prop];
      colArray[x] = dataColumns.split(",");
    }

    me.dataArray = [];
    me.recNum = 1;

    var rowNum = 0;
    if (me.hasHeader) rowNum++;
    for (var row = startRow; row <= endRow; row += multiple) {
      var dataArrayRow = rowNum - (me.hasHeader ? 1 : 0);
      me.dataArray[dataArrayRow] = [];
      me.dataArray[dataArrayRow].selected = false;
      for (var x = 0; x < multiple; x++) {
        for (var i = 0; i < colArray[x].length; i++) {
          var col = colArray[x][i];
          var id = "D_" + (row + x) + "_" + col;
          var parentId = me.tableDiv.parentNode.id;
          if (parentId != null && parentId.substr(0, 6) == "window") {
            var winNum = parseInt(parentId.substr(6, 1));
            if (!isNaN(winNum) && winNum > 0) {
              id += "_W" + winNum;
            }
          }
          var obj = getObj(id);
          var text;
          var objClass;
          var left;
          var top;
          var pos;
          var fieldInfo;
          if (obj == null) {
            //try an input field
            id = "I_" + (row + x) + "_" + col;
            obj = getObj(id);
            if (obj == null) {
              //try an input field in a window
              if (!isNaN(winNum) && winNum > 0) {
                id += "_W" + winNum;
              }
            }
            obj = getObj(id);
            if (obj == null) continue;
            if (me.scrollbarObj != null && me.scrollbarObj.type == "paging")
              me.scrollbarObj.enableMouseWheel(obj);  
            if (!obj.readOnly) continue;
            text = obj.value;
            text = text.replace(/ /g, "&nbsp;");
            obj.style.display = "none";
            objClass = obj.className;
            left = parseInt(obj.style.left);
            top = parseInt(obj.style.top);
            fieldInfo = obj.fieldInfo;
          }
          else {
            text = obj.innerHTML;
            objClass = obj.className;
            left = parseInt(obj.style.left);
            top = parseInt(obj.style.top);
            fieldInfo = obj.fieldInfo;
            obj.parentNode.removeChild(obj);
            if (me.scrollbarObj != null && me.scrollbarObj.type == "paging")
              me.scrollbarObj.enableMouseWheel(obj);
          }
          if (objClass == null || objClass == "" || objClass == "A20") {
            objClass = "";
          } else if (objClass.indexOf("readOnly") != -1) {
            // The data has other formatting; keep everything except readOnly and input. Issues 2551 & 1438.
            objClass = pui.removeFromStringList(objClass, "readOnly");
            objClass = pui.removeFromStringList(objClass, "input"); //input looks ugly in a grid.
          }
          var colNum = i;
          if (multiple > 1) colNum = 0;
          if (me.cells.length <= rowNum) break;
          var cell = me.cells[rowNum][colNum];
          if (cell != null) {
            var div = document.createElement("div");
            div.className = objClass;
            div.innerHTML = text;
            me.dataArray[dataArrayRow][colNum] = text.replace(/&nbsp;/g, " ");
            div.style.position = "absolute";
            left -= parseInt(cell.style.left);
            left -= parseInt(me.tableDiv.style.left);
            if (newGrid == true || multiple == 1) left = 5;
            div.style.left = left + "px";
            top -= parseInt(cell.style.top);
            top -= parseInt(me.tableDiv.style.top);
            if (newGrid == true || multiple == 1) top = 5;
            div.style.top = top + "px";
            div.fieldInfo = fieldInfo;
            addEvent(div, "click", setPos);
            if (multiple == 1) {
              cell.fieldInfo = fieldInfo;
              addEvent(cell, "click", setPos);
            }
            cell.appendChild(div);
          }
        }
      }
      rowNum++;
    }
  };

  this.setScrollBar = function () {

    if (me.pagingBar.container == null) {
      me.pagingBar.container = me.container;
      me.pagingBar.grid = me;
      me.pagingBar.init();
      me.pagingBar.draw();
    }
    me.pagingBar.x = parseInt(me.tableDiv.style.left);
    me.pagingBar.y = parseInt(me.tableDiv.style.top);
    var tableDivHeight = parseInt(me.tableDiv.style.height);
    if (isNaN(tableDivHeight)) tableDivHeight = 0;
    me.pagingBar.y += tableDivHeight;
    me.pagingBar.width = parseInt(me.tableDiv.style.width);
    if (isNaN(me.pagingBar.width) || me.pagingBar.width < 10) me.pagingBar.width = 10;
    me.pagingBar.width = me.pagingBar.width - 2;
    if (!me.designMode) {
      me.pagingBar.draw();
    }
    me.pagingBar.position();

    var needScrollBar = true;
    if (me.hLines.length < 2) needScrollBar = false;
    if (me.hLines.length < 3 && me.hasHeader) needScrollBar = false;
    if (me.vLines.length < 2) needScrollBar = false;
    if (!me.pagingScrollBar && !me.slidingScrollBar) needScrollBar = false;
    var stype = "paging";
    if (me.slidingScrollBar) stype = "sliding";
    if (context == "genie" && !me.designMode && me.isDataGrid()) stype = "sliding";
    if (needScrollBar && ((me.scrollbarObj == null) || (me.scrollbarObj != null && me.scrollbarObj.type != stype))) {
      if (me.scrollbarObj != null) me.scrollbarObj.destroy();
      if (stype == "paging") {
        me.scrollbarObj = new pui.PagingScrollBar();
        me.scrollbarObj.grid = me;
      }
      if (stype == "sliding") {
        me.scrollbarObj = new pui.SlidingScrollBar();
        if (context == "genie" && !pui.usingGenieHandler) me.scrollbarObj.ready = true;
      }
      me.scrollbarObj.container = me.container;
      me.scrollbarObj.zIndex = me.scrollZIndex;
      me.scrollbarObj.designMode = me.designMode;
      if (stype == "sliding") {
        me.scrollbarObj.onSetRow = function (recNum) {
          // Note: even if recNum == me.recNum, we still need to call getData for certain grids; e.g.
          // a grid inside an unselected tab panel tab. Without calling getData, the data would be hidden.
          me.recNum = recNum;
          // Grid may be destroyed if user submits before sliding scrollbar's sendRow() timeout wakes up.
          if (me == null || me.cells == null) return;
          me.getData();
          me.placeCursor(true);
        };
        me.scrollbarObj.onchange = function (recNum) {
          if (me.isDataGrid()) {
            if(me["dataProps"]["load all rows"] != "true"){
              me.clearData();
            }
          }
        };
        me.scrollbarObj.enableMouseWheel(me.tableDiv);
      }

      if (stype == "paging") {
        me.scrollbarObj.onpageup = function () {
          var returnVal = executeEvent("onpageup");
          if (returnVal == false) return false;
          if (me.forceDataArray == false && me.isDataGrid()) {
            if (me.recNum > 1) {
              var numRows = me.cells.length;
              if (me.hasHeader) numRows = numRows - 1;
              me.recNum = me.recNum - numRows;
              if (me.recNum < 1) me.recNum = 1;
              me.getData();
            }
            return true;
          }
          else if (me.forceDataArray == true || context == "dspf" || pui.usingGenieHandler) {
            pui.scrolledGridName = me.recordFormatName;
            pui.handleHotKey({}, "PageUp");
            if (me.scrollbarObj.type == "paging" && pui.screenIsReady) {
              setTimeout(function () {
                me.scrollbarObj.destroy();
                me.scrollbarObj = null;
                me.setScrollBar();
              }, 250);
            }
          }
          else if (context == "genie") {
            pressKey("PageUp");
            return true;
          }
        };

        me.scrollbarObj.onpagedown = function () {
          var returnVal = executeEvent("onpagedown");
          if (returnVal == false) return false;
          if (me.forceDataArray == false && me.isDataGrid()) {
            var numRows = me.cells.length;
            if (me.hasHeader) numRows = numRows - 1;
            me.recNum += numRows;
            me.getData();
            return true;
          }
          else if (me.forceDataArray == true || context == "dspf" || pui.usingGenieHandler) {
            pui.scrolledGridName = me.recordFormatName;
            pui.handleHotKey({}, "PageDown");
            if (me.scrollbarObj.type == "paging" && pui.screenIsReady) {
              setTimeout(function () {
                me.scrollbarObj.destroy();
                me.scrollbarObj = null;
                me.setScrollBar();
              }, 250);
            }
          }
          else if (context == "genie") {
            pressKey("PageDown");
            return true;
          }
        };
        me.scrollbarObj.enableMouseWheel(me.tableDiv);
      }

      me.scrollbarObj.init(me.tableDiv);
    }
    if (needScrollBar) {
      var bwidth = me.borderWidth;
      if (bwidth === null || (me.designMode && bwidth < minBWidth)) bwidth = minBWidth;
      var scrollBarWidth = 23;
      if ((pui["is_touch"] && !pui["is_mouse_capable"] && !me.designMode) || pui.iPadEmulation) scrollBarWidth = 0;

      me.scrollbarObj.x = parseInt(me.vLines[me.vLines.length - 1].style.left) - scrollBarWidth;

      // check if the grid is inside a simple layout container with horizontal scrolling
      // if so, attach vertical scrollbar to the layout
      var horizontalScroll = false;
      if (!me.designMode && me.container != null && me.container.tagName == "DIV" && me.container.getAttribute("container") == "true") {
        var parent = me.container.parentNode;
        if (parent != null && parent.tagName == "DIV" && parent.style.overflowX == "scroll") {
          var layoutDiv = parent.parentNode;
          if (layoutDiv != null && layoutDiv.tagName == "DIV" && layoutDiv.pui != null && layoutDiv.pui.properties != null && layoutDiv.pui.properties["template"] == "simple container" && layoutDiv.pui.properties["overflow x"] == "scroll") {
            if (layoutDiv.offsetWidth < me.tableDiv.offsetWidth + me.tableDiv.offsetLeft) {
              me.scrollbarObj.x = layoutDiv.offsetWidth - scrollBarWidth + 2 + parent.scrollLeft;
              parent.onscroll = function () {
                // Note: if there are two grids inside the layout, scrollbarObj could be null in one. 6478.
                if (me.scrollbarObj){
                  me.scrollbarObj.x = layoutDiv.offsetWidth - scrollBarWidth + 2 + parent.scrollLeft;
                  if (me.tableDiv.style.visibility != "hidden") {
                    // Pass true to the draw method to stop the scrollbar from scrolling 
                    // and causing the grid to re-render the items #4262. 
                    me.scrollbarObj.draw(true);
                  }
                }
              };
            }
          }
        }
      }

      me.scrollbarObj.y = parseInt(me.tableDiv.style.top) + bwidth;

      if (stype == "paging") {
        me.scrollbarObj.height = me.getStyleAsInt("height") - bwidth;
        if (me.scrollbarObj.height < 0) me.scrollbarObj.height = 0;
        if(me.isDataGrid()){
          me.scrollbarObj.atTop = me.atTop();
          me.scrollbarObj.atBottom = me.atBottom(); 
        }
      }
      if (stype == "sliding") {
        if (!me.isDataGrid() || (me["dataProps"]["load fields into widgets"] == 'true' && me["dataProps"]["load all rows"] == 'true')){
          me.scrollbarObj.interval = 1;  //Grids that do not make network requests on each scroll event can scroll smoothly.
        }
        else {
          me.scrollbarObj.interval = 250;  //Grids that make network requests on each scroll event need a delay.
        }
        var numRows = me.cells.length;
        if (me.hasHeader) numRows = numRows - 1;
        me.scrollbarObj.rowsPerPage = numRows;
        me.scrollbarObj.rowHeight = me.rowHeight;
        me.scrollbarObj.borderWidth = bwidth;
        if (me.designMode) me.scrollbarObj.totalRows = numRows * 3; // sample scroll
        if (me.scrollToolTip == "row number") {
          me.scrollbarObj.showRowNum = true;
          me.scrollbarObj.showRowRange = false;
        }
        else if (me.scrollToolTip == "row range") {
          me.scrollbarObj.showRowNum = false;
          me.scrollbarObj.showRowRange = true;
        }
        else {
          me.scrollbarObj.showRowNum = false;
          me.scrollbarObj.showRowRange = false;
        }
      }
      if (me.hasHeader) {
        var adj = me.headerHeight;
        me.scrollbarObj.y += adj;
        adj = -adj;
        me.scrollbarObj.height += adj;
      }
      if (me.tableDiv.style.visibility != "hidden") {
        me.scrollbarObj.draw();
      }
    }
    else {
      if (me.scrollbarObj != null) {
        me.scrollbarObj.destroy();
        me.scrollbarObj = null;
      }
    }
  };

  function createIcon(type, tooltipText) {
    var icon = document.createElement("div");
    icon.style.position = "absolute";
    icon.style.left = "200px";
    icon.style.top = "200px";
    icon.style.width = "16px";
    icon.style.height = "18px";
    icon.style.fontSize = "0px";
    icon.style.overflow = "hidden";
    icon.style.backgroundImage = "url('" + pui.normalizeURL("/profoundui/proddata/images/icons/") + type + ".gif')";
    icon.style.backgroundRepeat = "no-repeat";
    icon.style.cursor = "pointer";
    icon.style.zIndex = me.iconZIndex;
    icon.title = tooltipText;
    icon.style.color = "white";
    icon.style.padding = "0px";
    icon.onmousedown = function (event) {
      designUtils.preventEvent(event);
    };
    me.container.appendChild(icon);
    return icon;
  }

  function positionIcons() {
    if (!me.designMode) return;
    if (addRowIcon == null) return;
    if (removeRowIcon == null) return;
    var y = 0;
    var x = 0;
    var n = me.hLines.length;
    if (n > 0) {
      x = parseInt(me.hLines[n - 1].style.left);
      y = parseInt(me.hLines[n - 1].style.top) - 20;
    }
    else {
      x = me.getStyleAsInt("left");
      y = me.getStyleAsInt("top") - 20;
    }
    addRowIcon.style.left = x + "px";
    addRowIcon.style.top = y + "px";
    y -= 14;
    removeRowIcon.style.left = x + "px";
    removeRowIcon.style.top = y + "px";

    n = me.vLines.length;
    if (n > 0) {
      x = parseInt(me.vLines[n - 1].style.left) - 20;
      y = parseInt(me.vLines[n - 1].style.top) + 5;
    }
    else {
      x = me.getStyleAsInt("left") - 20;
      y = me.getStyleAsInt("top") + 5;
    }
    addColumnIcon.style.left = x + "px";
    addColumnIcon.style.top = y + "px";
    x -= 14;
    removeColumnIcon.style.left = x + "px";
    removeColumnIcon.style.top = y + "px";

    x = me.getStyleAsInt("left") - 2;
    y = me.getStyleAsInt("top") - 2;
    nwHandle.style.left = x + "px";
    nwHandle.style.top = y + "px";

    x += me.getStyleAsInt("width") - 2;
    neHandle.style.left = x + "px";
    neHandle.style.top = y + "px";

    y += me.getStyleAsInt("height") + 1;
    if (me.pagingBar.csvExport || me.pagingBar.showPagingControls || me.pagingBar.showPageNumber || me.pagingBar.showRecordNumberRange || me.pagingBar.showBar) {
      y += 25;
    }
    seHandle.style.left = x + "px";
    seHandle.style.top = y + "px";

    x = me.getStyleAsInt("left") - 2;
    swHandle.style.left = x + "px";
    swHandle.style.top = y + "px";
  }

  this.getStyleAsInt = function (styleProperty) {
    var returnValue = parseInt(me.tableDiv.style[styleProperty]);
    if (isNaN(returnValue)) returnValue = 0;
    return returnValue;
  };

  /**
   * Set properties during building of grid.
   * @param {String} property
   * @param {String|Number|Boolean|Null|undefined} value
   * @param {undefined|String} unevaledValue
   */
  this.setProperty = function (property, value, unevaledValue) {
    if (value == null) value = "";

    if (property.indexOf("parameter value") == 0) {

      me["dataProps"][property] = value;
      return;

    }
    
    var propertyToSwitch = property;
    var multOccurMatch = /^(database file) \d+$/.exec(property);
    if (multOccurMatch != null && multOccurMatch[1] != null){
      propertyToSwitch = multOccurMatch[1];  //handle any number of "database file n" properties.
    }

    var multOccurMatch = /^(grid row translation placeholder key) \d+$/.exec(property);
    if (multOccurMatch != null && multOccurMatch[1] != null){
      propertyToSwitch = multOccurMatch[1];  //handle any number of "translation placeholder key n" properties.
    }

    var multOccurMatch = /^(grid row translation placeholder value) \d+$/.exec(property);
    if (multOccurMatch != null && multOccurMatch[1] != null){
      propertyToSwitch = multOccurMatch[1];  //handle any number of "translation placeholder value n" properties.
    }

    switch (propertyToSwitch) {
      case "id":
      case "parent window":
      case "screen identifier":
      case "field type":
      case "value":

      case "color":

      case "display subfile":
      case "display control record":
      case "initialize subfile":
      case "subfile records not active":
      case "delete subfile":
      case "clear subfile":
      case "subfile size":
      case "subfile next changed":
      case "subfile record number":
      case "position at top":
      case "place cursor":
      case "cursor record number":
      case "cursor progression":
      case "subfile return rrn":
      case "subfile changed":

      case "subfile message key":
      case "subfile program message queue":
      case "subfile control program message queue":

      case "allow drag":
      case "ondragstart":
      case "drop targets":
      case "ondragenter":
      case "ondragleave":
      case "ondrop":

      case "return mode":

      case "selection field":
      case "row is hidden field":
      case "tree level field":

      case "column sort response":
      
      case "right":
      case "bottom":

        // nothing to do here
        break;

      case "field name sort response":
        // nothing to do here
        break;

      case "return sort order":
        break;

      case "record format name":
        me.recordFormatName = value;
        if (context == "dspf") {
          var itm = me.tableDiv.designItem;
          if (itm != null) {
            itm.properties[property] = value;
            recordFormats.refresh();
          }
        }
        break;

      case "description":
        if (context == "dspf") {
          var itm = me.tableDiv.designItem;
          if (itm != null) {
            itm.properties[property] = value;
            recordFormats.refresh();
          }
        }
        break;

      case "font family":
      case "font size":
      case "font style":
      case "font variant":
      case "font weight":
      case "letter spacing":
      case "text align":
      case "text decoration":
      case "text transform":
      case "word spacing":
      case "header font color":
      case "header background":
      case "header image":
      case "row font color":
      case "row background":
      case "odd row font color":
      case "odd row background":
      case "even row font color":
      case "even row background":
      case "hover font color":
      case "hover background":
      case "hover image":
      case "selection font color":
      case "selection background":
      case "selection image":
      case "header font family":
      case "header font size":
      case "header font weight":
      case "header font style":
      case "header text align":
        if (value == "" && me.cellPropDefaults[property] != null) {
          me.cellProps[property] = me.cellPropDefaults[property];
        }
        else {
          me.cellProps[property] = value;
        }
        if (me.designMode) {
          me.setAllCellStyles();
          if (property == "text align" ||
            property == "header text align" ||
            property == "header font family" ||
            property == "header font size" ||
            property == "header font style" ||
            property == "header font weight") {
            me.setHeadings();
          }
        }
        break;

      case "row selection":
        if (value == "single" || value == "multiple (simple)" || value == "multiple (extended)") {
          me.selectionEnabled = true;
          if (value == "single") {
            me.singleSelection = true;
            me.extendedSelection = false;
          }
          else {
            me.singleSelection = false;
            if (value == "multiple (extended)") me.extendedSelection = true;
            else me.extendedSelection = false;
          }
          if (typeof (pui["grid text selection"]) == "undefined" || pui["grid text selection"] == false) {
            me.tableDiv.onselectstart = function(e) { return false; };
            if (typeof me.tableDiv.style.MozUserSelect != "undefined") me.tableDiv.style.MozUserSelect = "none";
          }
        }
        else {
          me.selectionEnabled = false;
          me.singleSelection = false;        
          me.extendedSelection = false;
        }
        break;

      case "selection value":
        if (value != null && value != "") me.selectionValue = value;
        break;

      case "number of rows":
        var oldNumRows = me.hLines.length - 1;
        if (oldNumRows < 0) oldNumRows = 0;
        var newNumRows = (value === '#rowsPerPageRDF') ? 14 : parseInt(value);  //When viewing a JumpStart template, use 14 for number of rows. 6217.
        if (isNaN(newNumRows)) newNumRows = oldNumRows;
        if (newNumRows < 1) newNumRows = 1;
        if (me.hasHeader && newNumRows < 2) newNumRows = 2;
        if (newNumRows > 99 && me.designMode) newNumRows = 99;
        if (newNumRows > oldNumRows) {
          while (newNumRows > me.hLines.length - 1) me.addRow();
          me.mirrorDownAll();
        }
        if (newNumRows < oldNumRows) {
          while (newNumRows < me.hLines.length - 1) me.removeLastRowCells();
        }
        if (me.tableDiv.designItem != null) me.tableDiv.designItem.properties[property] = value;
        me.sendToDesigner();
        break;

      case "number of columns":
        var oldNumCols = me.vLines.length - 1;
        if (oldNumCols < 0) oldNumCols = 0;
        var newNumCols = parseInt(value);
        if (newNumCols > me.maxNumberOfColumns) {
          pui.alert('WARNING: Number of maximum columns reached when loading Grid.');
        }
        if (isNaN(newNumCols)) newNumCols = oldNumCols;
        if (newNumCols < 1) newNumCols = 1;
        if (newNumCols > me.maxNumberOfColumns && me.designMode) newNumCols = me.maxNumberOfColumns;
        if (newNumCols > oldNumCols) {
          while (newNumCols > me.vLines.length - 1) me.addColumn();
        }
        if (newNumCols < oldNumCols) {
          while (newNumCols < me.vLines.length - 1) {
            var lastCol = me.vLines.length - 2;
            if (me.designMode && me.hasChildren(lastCol)) break;
            me.removeLastColumn();
          }
        }
        if (me.designMode) me.sizeAllCells();
        if (me.tableDiv.designItem != null) me.tableDiv.designItem.properties[property] = value;
        me.sendToDesigner();
        break;

      case "row height":
        if (isNaN(parseInt(value)) || parseInt(value) <= 0) {
          me.sendToDesigner(true);
          break;
        }
        me.rowHeight = parseInt(value);
        var topLineIdx = me.hasHeader ? 1 : 0;
        if (me.hLines.length <= topLineIdx) return;
        var curTop = parseInt(me.hLines[topLineIdx].style.top);
        for (var i = topLineIdx + 1; i < me.hLines.length; i++) {
          curTop += me.rowHeight;
          me.hLines[i].style.top = curTop + "px";
        }
        setLineHeights();
        if (me.designMode){
          if (me.expandToLayout){
            me.doExpandToLayout();  //Row height affects grid height and number of rows, so re-evaluate those.
          }
          else {
            me.sizeAllCells();  //doExpandToLayout->setNumberOfRows calls this; avoid calling 2x.
          }
        }
        positionIcons();
        me.setScrollBar();
        me.sendToDesigner();
        break;
        
      case "header height":
        if (isNaN(parseInt(value)) || parseInt(value) <= 0) {
          me.sendToDesigner(true);
          break;
        }
        me.headerHeight = parseInt(value);
        if (me.showQuickFilters){
          me._headerHeightSansQF = me.headerHeight;  //Save original height in case it should be restored later.
          // Add 20 pixels to the height if there are both headings and quick filters 
          if (me.columnHeadings != "") me.headerHeight += 20;
        }
        me._headerHeightChange();
        break;

      case "has header":
        if (me.showQuickFilters && (value == false || value == "false")){
          // Headers are required with quick filters.
          me._hasHeaderSansQF = false;
        }
        else if (me.hasHeader && (value == false || value == "false")) {
          // Remove the header.
          me.clearHeadings();
          me.hasHeader = false;
          if (context == "dspf" || pui.usingGenieHandler) {
            var numCols = me.vLines.length - 1;
            for (var col = 0; col < numCols; col++) {
              moveCellContent(me.cells[1][col], me.cells[0][col]);
            }
            me.mirrorDownAll();
          }
          if (me.hLines.length > 1) {
            me.hLines[0].style.top = (parseInt(me.hLines[1].style.top) - me.rowHeight) + "px";
            setLineTops();
            setLineHeights();
            if (me.designMode) me.sizeAllCells();
            positionIcons();
            me.setScrollBar();
            //me.sendToDesigner();
          }
          if (me.designMode) me.setAllCellStyles();
        }
        if (!me.hasHeader && (value == true || value == "true" || value == "")) {
          // Add the header.
          if (me.cells.length <= 1) {
            me.addRow();
          }
          me.hasHeader = true;
          if (context == "dspf" || pui.usingGenieHandler) {
            var numCols = me.vLines.length - 1;
            for (var col = 0; col < numCols; col++) {
              moveCellContent(me.cells[0][col], me.cells[1][col]);
            }
            me.mirrorDownAll();
          }
          if (me.hLines.length > 1) {
            me.hLines[0].style.top = (parseInt(me.hLines[1].style.top) - me.headerHeight) + "px";
            setLineTops();
            setLineHeights();
            if (me.designMode) me.sizeAllCells();
            positionIcons();
            me.setScrollBar();
            //me.sendToDesigner();
          }
          me.setAllCellStyles();
          me.setHeadings();
        }
        break;
        
      case 'show quick filters':
        // See issue 6279 for test cases.
        me.showQuickFilters = (value == true || value === 'true');
        if (me.showQuickFilters){
          // Enable headers, because this property requires them.
          if (!me.hasHeader) {
            me._hasHeaderSansQF = me.hasHeader;
            me.setProperty('has header', 'true');
          }
          
          if (me._headerHeightSansQF == null){
            me._headerHeightSansQF = me.headerHeight;
            // Add 20 pixels to the height if there are both headings and quick filters 
            // if (me.columnHeadings != "") me.headerHeight += 20;
          }
          me._headerHeightChange();
        }
        else {
          if (me._headerHeightSansQF != null){
            // Restore "header height" and "has header" in case those properties were set before "show quick filters", and if that was unset.
            me.headerHeight = me._headerHeightSansQF;
            delete me._headerHeightSansQF;
            me._headerHeightChange();
          }
          
          if (me._hasHeaderSansQF === false){
            delete me._hasHeaderSansQF;
            me.setProperty('has header', 'false');
          }
        }
        me.setHeadings();
        break;

      case "column widths":
        me.setColumnWidths(value);
        break;

      case "column headings":
        if (!pui.isBound(value) && !pui.isTranslated(value)) {
          me.columnHeadings = pui.parseCommaSeparatedList(value);
        }
        me.setHeadings();
        
        // if (me.designMode && !me.hidableColumns && me.columnInfo instanceof Array){
        if (!me.designMode && !me.hidableColumns && me.columnInfo instanceof Array){   //Fixes column names reverting to original value on rename and then resize.
          for (var i=0; i < me.columnInfo.length && i < me.columnHeadings.length; i++){
            me.columnInfo[i]['name'] = me.columnHeadings[i];
          }
        }

        // normally, "column headings" is processed before "hide columns option",
        // but just in case it's not, we need to perform "hide columns option" logic here
        // to make data in me.columnInfo[] accurate, since that's based on me.columnHeadings[]
        if (me.hidableColumns) {
          me.columnInfo = [];
          me.setProperty("hide columns option", true);
        }
          
        break;

      case "sortable columns":
        me.sortable = (value == "true");
        if (context == "genie") me.makeSortable();
        if (me.hasTreeLevelColumn)
          me.sortable = false;    
        break;

      case "default sort order":
        if (!me.designMode) {
          if (value == null) {
            me.defaultSortOrderArray = [];
          }
          else {
            me.defaultSortOrderArray = value.split(",");
          }
        }
        break;

      case "initial sort column":
        if (!me.designMode) {
          me.initialSortColumn = parseInt(value);
          if (isNaN(me.initialSortColumn)) me.initialSortColumn = null;
          
          if (typeof value === 'string'){
            me.initialSortColumnMulti = value.split(',');
            if (me.initialSortColumnMulti.length <= 1) me.initialSortColumnMulti = null;
          }
        }
        break;

      case "initial sort field":
        if (!me.designMode) {
          me.initialSortField = value.trim();
          
          if (typeof value === 'string'){
            me.initialSortFieldMulti = value.split(',');
            if (me.initialSortFieldMulti.length <= 1) me.initialSortFieldMulti = null;
          }
        }
        break;

      case "resizable columns":
        if (!me.designMode && (value == true || value == "true")) {
          resizableColumns = true;
          this.resizableColumns = true;
          for (var i = 0; i < me.vLines.length; i++) {
            lineDesign(me.vLines, i, true, true);
          }
        }
        break;

      case "movable columns":
        if (!me.designMode && me.hasHeader && (value == true || value == "true")) {
          movableColumns = true;
          this.movableColumns = true;
          var headerRow = me.cells[0];
          if (headerRow == null) { // rows have not been created yet, this is possible depending on the order of properties in the JSON
            me.addRow();
            headerRow = me.cells[0];
            if (headerRow == null) {
              me.addRow();
              headerRow = me.cells[0];
            }
          }
          for (var col = 0; col < headerRow.length; col++) {
            cellDesign(headerRow[col], true);
          }
        }
        break;

      case "persist state":
        if(value == "true" || value == true){
          persistState = (me.designMode == false && pui.isLocalStorage() ); 
        }
        else if (value === "session only") {
          persistState = (me.designMode == false && pui.isSessionStorage() ); 
          sessionState = (me.designMode == false && pui.isSessionStorage() );
        }
        else if (value === "program only") {
          persistState = (me.designMode == false); 
          programState = true;
        }
        break;

      case "expand to layout":
        var expandToLayout = (value == true || value == "true");
        if (expandToLayout != me.expandToLayout) {
          me.expandToLayout = expandToLayout;
          if (me.expandToLayout) {
            if (me.designMode) {
              me.doExpandToLayout();
              me.tableDiv.designItem.properties["expand to layout"] = "true";
              me.tableDiv.designItem.propertiesChanged["expand to layout"] = true;
              me.tableDiv.designItem.designer.propWindow.refreshProperty("expand to layout");
            }
          }
        }
        break;

      case "find option":
        me.findOption = (value == true || value == "true");
        break;

      case "filter option":
        me.filterOption = (value == true || value == "true");
        break;
      case "filter by value option":
        me.filterByValOption = (value == true || value == "true");
        break;

      case "hide columns option":
        me.hidableColumns = (value == true || value == "true");
        // Generate column info for each column
        var colNum = me.vLines.length - 1;
        var colWidths = me.getColumnWidths()
          .split(',')
          .map(function(num){ return Number(num); });  
        for (var i = 0; i < colNum; i++) {
          var header = me.columnHeadings[i];
          var blankHeader = false;
          if (!header || typeof header === 'string' && !header["trim"]()) {
            header = 'Column ' + (i + 1);
            blankHeader = true;
          }
          var col = {
            "name": header,
            "columnId": i,
            "currentColumn": i,
            "width": colWidths[i],
            "orginalWidth": colWidths[i],
            "showing": true,
            "blankHeader": blankHeader
          };
          me.columnInfo.push(col);
        }
        break;

      case "reset option":
        me.resetOption = (value == true || value == "true");
        break;

      case "export option":
        if (value == true || value == "true") {
          me.exportOption = true;
        }
        else if (value == false || value == "false") {
          me.exportOption = false;
        }
        else {
          me.exportOption = null;
        }
        break;      
      
      case "export only visible columns":
        if (value == true || value == "true") me.exportVisableOnly = true;
        else me.exportVisableOnly = false;
        break;

      case "context menu id":
        if (!me.designMode) {
          removeEvent(document, "click", me.hideContextMenu);
          var contextMenuId = trim(value);
          if (contextMenuId != "") {

            me.contextMenuId = contextMenuId;

          }
          if (pui["is_touch"]) {
            me.tableDiv.onselectstart = function(e) { return false; };
            if (typeof me.tableDiv.style.MozUserSelect != "undefined") me.tableDiv.style.MozUserSelect = "none";                     
            if (typeof me.tableDiv.style.webkitUserSelect != "undefined") me.tableDiv.style.webkitUserSelect = "none";
          }                     
          addEvent(document, "click", me.hideContextMenu);
        }
        break;
        
      case "show paging controls":
        me.pagingBar.showPagingControls = (value == true || value == "true");
        if (me.designMode) {
          me.pagingBar.draw();
          positionIcons();
        }
        break;

      case "show page number":
        me.pagingBar.showPageNumber = (value == true || value == "true");
        if (me.designMode) {
          me.pagingBar.draw();
          positionIcons();
        }
        break;

      case "initial page number":
        var page = Number(value);
        if (isNaN(page)) page = 1;
        me.pagingBar.pageNumber = page;
        me.initialPageNumber = page;
        if (me.designMode) {
          me.pagingBar.draw();
          positionIcons();
        }
        break;

      case "show record number range":
        me.pagingBar.showRecordNumberRange = (value == true || value == "true");
        if (me.designMode) {
          me.pagingBar.draw();
          positionIcons();
        }
        break;

      case "show bar":
        me.pagingBar.showBar = (value == true || value == "true");
        if (me.designMode) {
          me.pagingBar.draw();
          positionIcons();
        }
        break;

      case "page down condition":
        me.pagingBar.pageDownCondition = value;
        break;

      case "subfile end":
        me.subfileEnd = (value == true || value == "true");
        break;

      case "page up condition":
        me.pagingBar.pageUpCondition = value;
        break;

      case "page up response":
        if (value != null && value != "") {
          me.pagingBar.pageUpResponseDefined = true;
          me.pagingBar.pageUpHotKeyDefined = true;
        }
        break;

      case "page down response":
        if (value != null && value != "") {
          me.pagingBar.pageDownResponseDefined = true;
          me.pagingBar.pageDownHotKeyDefined = true;
        }
        break;
        
      case "filter response": //render.js also handles this property by setting dom.filterResponseField, which gets recfmt.field.
        // Decide from the server response if headers should show filters.
        if (!me.designMode) parseFilterResponse(value);
        break;
        
      case "filter response text max":
        var newval = parseInt(value,10);
        me.filterResponseTextMax = isNaN(newval) ? 20 : newval;
        if (me.filterResponseTextMax < 1) me.filterResponseTextMax = 1;
        if (!me.designMode) parseFilterResponse();  //Reprocess filter response, which should come first.
        break;
      case "filter response column max":
        var newval = parseInt(value,10);
        me.filterResponseColMax = isNaN(newval) ? 3 : newval;
        if (me.filterResponseColMax < 1) me.filterResponseColMax = 1;
        if (!me.designMode) parseFilterResponse();  //Reprocess filter response, which should come first.
        break;

      case "csv export":
        me.pagingBar.csvExport = (value == true || value == "true");
        if (me.designMode) {
          me.pagingBar.draw();
          positionIcons();
        }
        break;

      case "xlsx export":
        me.pagingBar.xlsxExport = (value == true || value == "true");
        if (me.designMode) {
          me.pagingBar.draw();
          positionIcons();
        }
        break;

      case "xlsx export pics":
        me.pagingBar.xlsxExportPics = (value == true || value == "true");
        break;

      case "export file name":
        me.exportFileName = value;
        break;

      case "export with headings":
        me.exportWithHeadings = (value == true || value == "true");
        break;

      case "fold multiple":
        me.foldMultiple = parseInt(value);
        if (isNaN(me.foldMultiple) || me.foldMultiple < 1) me.foldMultiple = 1;
        break;

      case "tree level column":
        me.treeLevelColumnId = parseInt(value);
        me.hasTreeLevelColumn = true;
        me.sortable = false;    
        break;

      case "expanded":
        if (!me.designMode) {
          if (value == "true") me.initExpanded = true;
          if (value == "false") me.initExpanded = false;
        }
        break;

      case "collapsed":
        if (!me.designMode) {
          if (value == "true") me.initCollapsed = true;
          if (value == "false") me.initCollapsed = false;
        }
        break;

      case "tree level collapsed":
        if (!me.designMode) {
          if (value == "true") me.treeInitCollapsed = true;
          if (value == "false") me.treeInitCollapsed = false;
        }
        break;
        
      case "single row zoom":
        if (value == "true") {
          me.singleRowZoom = true;
        }
        break;

      case "scrollbar":
        if (context == "genie" && !pui.usingGenieHandler) {
          if (value == true || value == "true" || value == "") me.pagingScrollBar = true;
          else me.pagingScrollBar = false;
          me.sizeAllCells();
          me.setScrollBar();
        }
        else {
          me.slidingScrollBar = true;
          me.pagingScrollBar = false;
          if (value == "none") {
            me.slidingScrollBar = false;
            me.pagingScrollBar = false;
          }
          if (value == "paging") {
            me.slidingScrollBar = false;
            if (me.isDataGrid()) {
              me.pagingScrollBar = true;
            }
            else {
              //me.pagingScrollBar = false;
              me.pagingScrollBar = true;
            }
          }
          if (me.designMode) me.sizeAllCells();
          me.setScrollBar();
        }
        break;

      case "scroll tool tip":
        me.scrollToolTip = value;
        me.setScrollBar();
        break;

      case "remote system name":
      case "database connection":
      case "database file":
      case "database join":
      case "database fields":
      case "selection criteria":
      case "order by":
      case "sortable":
      case "custom sql":
      case "allow any select statement":
      case "load fields into widgets":
      case "load all rows":
      case "data url":
      case "data transform function":
      case "starting row":
      case "ending row":
      case "data columns":
      case "data columns 2":
      case "data columns 3":
      case "data columns 4":
        // Note: trim to avoid meaningless " " values disrupting grid behavior. (Grid only tests for "" and null values.) #5980.
        me["dataProps"][property] = (typeof value == "string" ? value.trim(): value);
        break;

      case "hover effect":
        me.hoverEffect = (value == true || value == "true");
        break;

      case "top":
        var top = value;
        if (pui.isBound(top)) top = top.designValue;
        var diff = parseInt(me.tableDiv.style.top) - pui.safeParseInt(top);
        me.doThisToTableDivs(function (domObj) {
          domObj.style.top = (parseInt(domObj.style.top) - diff) + "px";
        });
        me.setScrollBar();
        break;

      case "left":
        var left = value;
        if (pui.isBound(left)) left = left.designValue;
        var diff = parseInt(me.tableDiv.style.left) - pui.safeParseInt(left);
        me.doThisToTableDivs(function (domObj) {
          domObj.style.left = (parseInt(domObj.style.left) - diff) + "px";
        });
        me.setScrollBar();
        break;

      case "width":
        if (!me.designMode || !toolbar.loadingDisplay) {
          var n = me.vLines.length;
          n = n - 1;
          if (n > 0) {
            var width = pui.safeParseInt(value);
            var left = me.getStyleAsInt("left") + width;
            if (parseInt(me.vLines[n - 1].style.left) + 5 > left) {
              left = parseInt(me.vLines[n - 1].style.left) + 5;
            }
            // To account for bug where saving and reopening will add one width to last column to the Genie Desinger. #4149
            if (context === 'genie') {
              var lastLineLeft = parseInt(me.vLines[n].style.left);
              if (lastLineLeft && (left - lastLineLeft === 1)) left = lastLineLeft;
            }
            me.vLines[n].style.left = left + "px";
            setLineWidths();
            if (me.designMode) me.sizeAllCells();
            positionIcons();
            me.setScrollBar();
            me.sendToDesigner();
          }
        }
        break;

      case "height":
        if (value === '#subfileHeight'){
          if (me.tableDiv.designItem != null) me.tableDiv.designItem.properties[property] = value;
          value = '436px';  //When viewing a JumpStart template use this value for height. #6217.
        }
        var i = me.hLines.length - 1;
        if (i != 0 || !me.hasHeader) {
          var diff = pui.safeParseInt(value) - parseInt(me.tableDiv.style.height);
          var diffPerRow = diff / (i - (me.hasHeader ? 1 : 0));
          var curTop = parseInt(diffPerRow) + parseInt(me.hLines[i].style.top);
          me.hLines[i].style.top = curTop + "px";
          me.rowHeight = curTop - parseInt(me.hLines[i - 1].style.top);
          if (me.rowHeight < 5) me.rowHeight = 5;
          var downto = 0;
          if (me.hasHeader) downto = 1;
          for (var j = i - 1; j >= downto; j = j - 1) {
            curTop = curTop - me.rowHeight;
            me.hLines[j].style.top = curTop + "px";
          }
          if (me.hasHeader) {
            me.hLines[0].style.top = (parseInt(me.hLines[1].style.top) - me.headerHeight) + "px";
          }
        }
        setLineTops();
        setLineHeights();
        if (me.designMode) me.sizeAllCells();
        positionIcons();
        me.setScrollBar();
        me.sendToDesigner();
        break;

      case "z index":
        value = parseInt(value);
        if (isNaN(value)) value = "";
        me.tableDiv.style.zIndex = value;
        if (me.pagingBar != null) me.pagingBar.position();
        break;

      case "border color":
        me.setBorderColor(value);
        break;

      case "border width":
        me.setBorderWidth(value);
        break;

      case "padding bottom":
      case "padding left":
      case "padding right":
      case "padding top":
        me.paddingProps[property] = value;
        me.setHeadings();
        break;

      case "visibility":
        me.visibility = value;
        if (!me.designMode) {
          me.doThisToTableDivs(function (domObj) {
            domObj.style.visibility = value;
          });
          if (me.scrollbarObj != null) {
            if (value == "hidden") me.scrollbarObj.hide();
            else me.scrollbarObj.draw();
          }
        }
        if (me.designMode) {
          if (value == "hidden") {
            me.tableDiv.style.filter = "alpha(opacity=30)";
            me.tableDiv.style.opacity = 0.30;
          }
          else {
            me.tableDiv.style.filter = "";
            me.tableDiv.style.opacity = "";
          }
        }
        break;

      case "locked in place":
        if (value == true || value == "true") me.lockedInPlace = true;
        else me.lockedInPlace = false;
        break;

      case "css class":
        if (me.designMode) {
          me.mainClass = value;
          if (me.slidingScrollBar) {
            me.scrollbarObj.setClassName(value);
          }
        }
        if (me.pagingBar != null) me.pagingBar.setClassName(value);
        break;

      case "css class 2":
      case "css class 3":
      case "css class 4":
      case "css class 5":
      case "css class 6":
      case "css class 7":
      case "css class 8":
      case "css class 9":
        // extra css classes are not assigned to paging bar at this time, just the main grid
        break;

      case "tool tip":
        me.tableDiv.title = value;
        break;

      case "parent tab panel":
      case "parent tab":
      case "parent field set":
        break;

      case "onrowclick":
      case "onrowdblclick":
      case "onrowmouseover":
      case "onrowmouseout":
      case "onpagedown":
      case "onpageup":
      case "onscroll":
      case "onfilterchange":
        // For backwards compatiblity, use 'value' if 'unevaledValue' is not passed.
        // See Redmine #6558
        if (typeof unevaledValue == "undefined") {
          me.events[property] = value;
        }
        else {
          me.events[property] = unevaledValue;
        }
        break;

      case "ondbload":
        ondbload = value;
        break;

      case "propagate scroll events":
        if (value === true || value === "true") {
          me.propagateScrollEvents = true;
        }
        else {
          me.propagateScrollEvents = false;
        }
        break;
      case "sort function":
        if (value) {
          customGridSortFunction = value;
        }
        break;
      case "grid row translation placeholders":
        break;
      case "grid row translation placeholder key":
        break;
      case "grid row translation placeholder value":
        break;
      case "row clicked":
        break;
      case "column clicked":
        break;  

      default:
        if (typeof property === "string" && property.substr(0, 17) === "user defined data") break;
        pui.alert("Grid property not handled: " + property);
    }
  };

  this.doThisToTableDivs = function (handler) {
    for (var i = 0; i < me.vLines.length; i++) {
      var line = me.vLines[i];
      handler(line);
    }
    for (var i = 0; i < me.hLines.length; i++) {
      var line = me.hLines[i];
      handler(line);
    }
    handler(me.tableDiv);
    if (addRowIcon != null) handler(addRowIcon);
    if (removeRowIcon != null) handler(removeRowIcon);
    if (addColumnIcon != null) handler(addColumnIcon);
    if (removeColumnIcon != null) handler(removeColumnIcon);
    if (nwHandle != null) handler(nwHandle);
    if (neHandle != null) handler(neHandle);
    if (swHandle != null) handler(swHandle);
    if (seHandle != null) handler(seHandle);
  };

  this.setCursorRRN = function (row) {
    var idx = me._getDataIndexFromDOMRow(row);
    if (idx >= 0){
      var dataRecords = me.isFiltered() ? me.visibleDataArray : me.dataArray;
      if (dataRecords[idx] == null || dataRecords[idx].length == 0) {
        me.tableDiv.cursorRRN = 0;
      }
      else if (dataRecords[idx].subfileRow != null) {
        me.tableDiv.cursorRRN = dataRecords[idx].subfileRow;
      }
      else {
        me.tableDiv.cursorRRN = idx + 1;
      }      
    }
    // else: if the row is invalid, leave the cursor at the last valid row.
  };

  this["setCursorRecordNumber"] = function (rrn) {

    if (typeof rrn == "number" && rrn > 0 && rrn < 9999) {

      me.tableDiv.cursorRRN = rrn;

    }

  };

  this.placeCursor = function (onTimeout) {
    var rrn = me.placeCursorRRN;
    me.placeCursorRRN = null;
    if (rrn == null) return;
    var rowNum = rrn - me.recNum;
    if (rowNum < 0) return;
    if (me.hasHeader) rowNum++;
    if (rowNum > me.cells.length - 1) return;
    var row = me.cells[rowNum];
    if (onTimeout == true) {
      setTimeout(function () {
        placeCursorOnRow(row);
      }, 1);
    }
    else {
      placeCursorOnRow(row);
    }
  };

  function checkRowHidden(record) {

    var hidden = false;
    var dirty = false;

    if (record.hideRow == null) {
      if (me.hiddenField != null) {
        if (me.hiddenFieldIndex == null) {
          // Nothing has set this index yet; find which index has the field and save it.
          for (var i = 0; i < me.fieldNames.length; i++) {
            if (pui.fieldUpper(me.hiddenField.fieldName) == me.fieldNames[i]) { 
              //checks for hiddenField field name in dataArray
              me.hiddenFieldIndex = i;
              break;
            }
          }
        }
        if (me.hiddenFieldIndex != null) {
          //check if hiddenField value is 1
          if (record[me.hiddenFieldIndex] == "1" && !record.hideRow) {
            record.hideRow = true;
            dirty = true;
          }
        }
      }
    }

    // if this routine ended up marking a row hidden (due to a bound field)
    // update the visibleDataArray accordingly.

    if (dirty) {
      me.rowsHidden = 0;
      me.visibleDataArray = [];
      for (var i = 0; i < me.dataArray.length; i++) {
        var record = me.dataArray[i];
        if (record.subfileRow == null) record.subfileRow = i + 1;
        me.setFilteredOut(record);
        if (!record.filteredOut && !record.hideRow) {
          me.visibleDataArray.push(record);
        }
        if (record.hideRow) {
          me.rowsHidden++;
        }
      }
      dirty = false;
    }

    if (record.hideRow == true) {
      hidden = true;
    }

    return hidden;
  }

  this.setupHiddenRows = function() {

    for(var i = 0; i < me.dataArray.length; i++){
      var record = me.dataArray[i];
      checkRowHidden(record);
    }

    // rebuild me.visibleDataArray without any hidden rows
    me.visibleDataArray = [];
    me.rowsHidden = 0;
    for (var i = 0; i < me.dataArray.length; i++) {
      var record = me.dataArray[i];
      if (record.subfileRow == null) record.subfileRow = i + 1;
      me.setFilteredOut(record);
      if (!record.filteredOut && !record.hideRow) {
        me.visibleDataArray.push(record);
      }
      if (record.hideRow) {
        me.rowsHidden++;
      }
    }

  };

  function checkSelected(record) {

    if (record == null) return false;

    var selected = false;

    if (record.selected == null) {
      if (me.selectionField != null) {
        if (me.selectionFieldIndex == null) {
          for (var i = 0; i < me.fieldNames.length; i++) {
            if (pui.fieldUpper(me.selectionField.fieldName) == me.fieldNames[i]) {
              me.selectionFieldIndex = i;
              break;
            }
          }
        }
        if (me.selectionFieldIndex != null) {
          if (record[me.selectionFieldIndex] == me.selectionValue) {
            record.selected = true;
          }
        }
      }
    }
    if (record.selected == true) {
      selected = true;
    }

    return selected;
  }


  this["isRowSelected"] = function (row) {
    var rec = getDataArrayForRow(row, true);
    return checkSelected(rec);
  };


  this["getSelectedRows"] = function () {

    var selRows = [];
    var dataRecords = me.dataArray;
    if (me.isFiltered()) dataRecords = me.visibleDataArray;
    var start = 0;

    for (var row = start; row < dataRecords.length; row++) {

      if (checkSelected(dataRecords[row])) {
        var rrn = row + 1;
        if (typeof me.sorted != "undefined" && me.sorted === true || me.isFiltered()) {
          rrn = dataRecords[row].subfileRow;
        }
        selRows.push(rrn);
      }
    }

    return selRows;
  };

  /**
   * Set background color of a row.
   * @param {Number} row               The visible row number being colored.
   * @param {Boolean|undefined} hover  When true: the mouse is hovered over the row.
   * @param {Number|undefined} recIdx  With handler grids that have bound fields, this is the index in me.dataArray that corresponds to "row".
   */
  this.setRowBackground = function (row, hover, recIdx) {
    var even = ((row % 2) == 1);
    if (me.hasHeader) even = !even;
    if (me.cells == null) return;
    var cols = me.cells[row];
    if (cols == null) return;
    var dataRecords, adjustedRow = -1;
    // Prepare data needed when fields are bound.
    if (me.recNum != null && !isNaN(me.recNum) && me.recNum > 0) {
      if (typeof recIdx == 'number' && recIdx >= 0){
          adjustedRow = recIdx + 1;     //"row" may not map to me.dataArray when fields are hidden, so use recIdx. #6391
      }
      else if(me.rowsHidden < 1){
        // When rows are not hidden the mapping from row to dataArray index works according to the formula below.
        adjustedRow = row + me.recNum - 1 + (me.hasHeader ? 0 : 1);  
      }
      
      dataRecords = me.isFiltered() ? me.visibleDataArray : me.dataArray;
      if (dataRecords[adjustedRow - 1] == null || typeof dataRecords[adjustedRow - 1].length != 'number' || dataRecords[adjustedRow - 1].length <= 0) {
        adjustedRow = -1;
      }
    }
    
    var selected = false;
    if (me.selectionEnabled && adjustedRow > 0) {
      selected = checkSelected(dataRecords[adjustedRow - 1]);
    }

    var rowBackground = null;
    if (me.rowBackgroundField != null && adjustedRow > 0) {
      if (me.rowBackgroundFieldIndex == null) {
        // Nothing has set this index yet; find which index has the field and save it.
        for (var i = 0; i < me.fieldNames.length; i++) {
          if (pui.fieldUpper(me.rowBackgroundField.fieldName) == me.fieldNames[i]) {
            me.rowBackgroundFieldIndex = i;
            break;
          }
        }
      }
      // If there is data matching the row-bg field, then set this row's background to it. The field data may be a bound value or an indicator, needing evaluation.
      // Test cases for bound character and bound indicator: Issue 4775. If the row is hidden, then do not use the color: issue 6391.
      if (me.rowBackgroundFieldIndex != null) {
        var fielddata = {};       //Prepare arguments for evalBoundProperty.
        var bgfieldname = me.fieldNames[me.rowBackgroundFieldIndex];  //Upper case, because evalBoundProperty makes it uppercase.
        fielddata[bgfieldname] = dataRecords[adjustedRow - 1][me.rowBackgroundFieldIndex];

        rowBackground = pui.evalBoundProperty(me.rowBackgroundField, fielddata, me.ref);  //Uses the bound value or translates it based on the indicator rules.
      }
    }
    if (!pui.isBound(me.cellProps["row background"]) && me.cellProps["row background"] != null && me.cellProps["row background"] != "") rowBackground = me.cellProps["row background"];

    var rowFontColor = null;
    if (me.rowFontColorField != null && adjustedRow > 0) {
      if (me.rowFontColorFieldIndex == null) {
        // Nothing has set this index yet; find which index has the field and save it.
        for (var i = 0; i < me.fieldNames.length; i++) {
          if (pui.fieldUpper(me.rowFontColorField.fieldName) == me.fieldNames[i]) {
            me.rowFontColorFieldIndex = i;
            break;
          }
        }
      }
      if (me.rowFontColorFieldIndex != null) {
        // Set the font-color from the bound value; evaluate the field in case it is an indicator.
        var fielddata = {};
        var fieldname = me.fieldNames[me.rowFontColorFieldIndex];
        fielddata[fieldname] = dataRecords[adjustedRow - 1][me.rowFontColorFieldIndex];
        
        rowFontColor = pui.evalBoundProperty(me.rowFontColorField, fielddata, me.ref);
      }
    }
    if (!pui.isBound(me.cellProps["row font color"]) && me.cellProps["row font color"] != null && me.cellProps["row font color"] != "") rowFontColor = me.cellProps["row font color"];

    function setColor(cell, color, colNum) {
      if (color == null) color = "";
      else {
        var colors = color.split(",");
        if (colors.length > 1) {
          if (colNum < colors.length) {
            color = colors[colNum];
          }
          else {
            color = colors[0];
          }
        }
      }
      cell.style.color = color;
      if (context == "genie" && !pui.usingGenieHandler) {
        for (var i = 0; i < cell.childNodes.length; i++) {
          cell.childNodes[i].style.color = color;
        }
      }
    }

    function setBackground(cell, background, colNum) {
      if (background == null) background = "";
      else {
        var backgrounds = background.split(",");
        if (backgrounds.length > 1) {
          if (colNum < backgrounds.length) {
            background = backgrounds[colNum];
          }
          else {
            background = backgrounds[0];
          }
        }
      }
      cell.style.backgroundColor = background;
      return background;
    }

    for (i = 0; i < cols.length; i++) {
      pui.removeCssClass(cols[i], "selected");
      pui.removeCssClass(cols[i], "hover");
      if (selected) {
        setColor(cols[i], me.cellProps["selection font color"], i);
        setBackground(cols[i], me.cellProps["selection background"] || "", i);
        var selectionImage = me.cellProps["selection image"];
        if (selectionImage && selectionImage.trim()) {
          cols[i].style.backgroundImage = "url('" + pui.normalizeURL(selectionImage.trim(), true) + "')";
        }
        pui.addCssClass(cols[i], "selected");
        me.lastSelectedRRN = adjustedRow;
      }
      else if (hover == true) {
        setColor(cols[i], me.cellProps["hover font color"], i);
        setBackground(cols[i], me.cellProps["hover background"] || "", i);

        var hoverImage = me.cellProps["hover image"];
        if (hoverImage && hoverImage.trim()) {
          cols[i].style.backgroundImage = "url('" + pui.normalizeURL(hoverImage.trim(), true) + "')";
          cols[i].style.backgroundRepeat = "repeat-x";
        }

        pui.addCssClass(cols[i], "hover");
      }
      else {
        rowFontColor = rowFontColor || me.cellProps["row font color"];
        if (!rowFontColor || !rowFontColor.trim())
        	rowFontColor = me.cellProps[(even ? "even" : "odd") + " row font color"];

        setColor(cols[i], rowFontColor || "", i);

        rowBackground = rowBackground || me.cellProps["row background"];
        if (!rowBackground || !rowBackground.trim()) 
          rowBackground = me.cellProps[(even ? "even" : "odd") + " row background"];

        setBackground(cols[i], rowBackground || "", i);
        cols[i].style.backgroundImage = "";
      }
    }
    if (hover != true && me.zoomIcon != null) me.zoomIcon.style.display = "none";
    if (hover == true && me.zoomIcon != null) me.zoomIcon.style.display = "";
  };

  /**
   * Setup design events on a cell div. Needed for Genie design mode and in Visual Designer.
   * @param {Object} cell
   * @param {Boolean} movableColumns
   * @param {undefined|Boolean} sortableCols  Set when called by hideShowColumn to avoid clearing cursor.
   * @returns {undefined}
   */
  function cellDesign(cell, movableColumns, sortableCols) {
    if (!me.designMode && movableColumns != true) return;
    if (!me.designMode && movableColumns == true) {
      me.tableDiv.parentNode.onselectstart = preventDragSelectStart;
    }
    // Cursor is default unless columns were hidden or shown and the cursor isn't already set to pointer for sorting. #5913.
    if (sortableCols != true && cell.style.cursor != "pointer") cell.style.cursor = "default";
    addEvent(cell, "mousedown", cellmousedown);
  }
  
  function preventDragSelectStart(e){
    if (me.dragging) {
      preventEvent(e);
      return false;
    }
  }
  
  /**
   * Handle dragging of cells to move the grid, including into and out of layouts. (Note: functions declared inside loops may be 
   * duplicated in memory for each iteration of the loop; so, this one is moved outside cellDesign, which is called repeatedly.)
   * @param {MouseEvent} event
   * @returns {undefined|Boolean}
   */
  function cellmousedown(event) {
    var cell = event.target;
    while (cell != null && cell.row == null){
      cell = cell.parentNode;
    }
    if (cell == null || cell.row == null) return false;
    var inLayoutContainer = (context == "dspf" && me.tableDiv.parentNode.getAttribute("container") == "true");
    var startXY = pui.getMouseXY(event);
    var cursorStartX = startXY.x;
    var cursorStartY = startXY.y;
    
    if (me.designMode) {
      me.tableDiv.designItem.designer.hideDialogs();
      if (context == "dspf") Ext.menu.MenuMgr.hideAll();
      me.selectMe();
      
      if (pui.isRightClick(event)) {
        if (me.tableDiv.designItem) {
          me.tableDiv.designItem.designer.globalRightClickMenu.hide();
          me.tableDiv.designItem.designer.showContextMenu(event);
        }
        designUtils.preventEvent(event);
        if (event.stopPropagation) event.stopPropagation();
        return false;
      }
      if (me.tableDiv.designItem != null && me.tableDiv.designItem.designer.rightClickMenu != null) {
        me.tableDiv.designItem.designer.rightClickMenu.hide();
      }

      if (me.lockedInPlace) {
        designUtils.preventEvent(event);
        return;
      }
      me.tableDiv.designItem.startValues.left = me.tableDiv.style.left;
      me.tableDiv.designItem.startValues.top = me.tableDiv.style.top;
      
      designUtils.preDragCalcGridsLayouts(me.tableDiv.designItem.designer, false, inLayoutContainer, false, true, cursorStartX, cursorStartY, me.tableDiv.designItem);
    }
    else {
      if (me.gridMenu != null && !pui.isRightClick(event)) me.gridMenu.hide();
    }

    me.dragging = true;
    me.doThisToTableDivs(function (domObj) {
      domObj.startLeft = pui.safeParseInt(domObj.style.left);
      domObj.startTop = pui.safeParseInt(domObj.style.top);
    });
    
    // Note: the following variables and calculations are used in mousemove but run here to be faster so the UI isn't as jumpy.
    var mouseLineDiff = {x:0, y:0};   //The difference between the mouse X,Y and a vLine's left,top offsets.
    if (me.designMode) {
      var containerOffsets = pui.getOffset(me.tableDiv.designItem.designer.container, true);
      mouseLineDiff.x += containerOffsets[0];
    }
    else {
      // Get the runtimeContainer's position relative to the page. The bounding rectangle handles
      // positions of any parent DIV elements the customer's start.html may have added. #3344.
      var rect = pui.runtimeContainer.getBoundingClientRect();

      // BoundingClientRect is relative to the viewport, so adjust for scroll position.
      if (typeof window.pageXOffset == "number") {
        mouseLineDiff.x = rect.left + window.pageXOffset;
        mouseLineDiff.y = rect.top + window.pageYOffset;
      } else {
        // window.pageXOffset doesn't exist for IE8, so use documentElement.scrollLeft.
        // See: https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect
        mouseLineDiff.x = rect.left + document.documentElement.scrollLeft;
        mouseLineDiff.y = rect.top + document.documentElement.scrollTop;
      }

      // Compensate if the grid is inside a window. (See #3532 for test cases.)
      var windowDiv = me.tableDiv.parentNode;
      var acont = pui["getActiveContainer"]();
      if (windowDiv.isPUIWindow == true) {
        mouseLineDiff.x += parseInt(windowDiv.style.left);
        mouseLineDiff.y += parseInt(windowDiv.style.top);
      }
      else if (acont != null && acont.isPUIWindow === true) {
        // Note: in RDF, the active container is a PUIWindow. In Genie, pui.runtimeContainer is
        // the active container but not a PUIWindow. So, the same offset isn't added twice.
        mouseLineDiff.x += acont.offsetLeft;
        mouseLineDiff.y += acont.offsetTop;
      }
    }

    if (inLayoutContainer) {
      //In Rich Display or Designer, compensate when the grid is in a container.
      var layContOff = pui.layout.getContainerOffset(me.tableDiv.parentNode);
      mouseLineDiff.x += layContOff.x;
      mouseLineDiff.y += layContOff.y;
    }

    var offset = {x:0, y:0};
    // Since columnPointer doesn't have same parent as the vLine, adjust columnPointer's position.
    if (!me.designMode) {
      // In RDF or Genie, the previous mouse calculations can be used because the
      // columnPointer's parent is <body>, and the mouse position is based on <body>.
      offset.y = mouseLineDiff.y;
      offset.x = mouseLineDiff.x;
    } else if (inLayoutContainer) {
      // We are in Designer and the Grid is inside a container. In Designer, the columnPointer's
      // parent is a designer div, not the body. So the mouse calculation cannot be used.
      offset = layContOff;
    }

    function mousemove(event) {
      var mouseXY = pui.getMouseXY(event);
      var deltay = mouseXY.y - cursorStartY;
      var deltax = mouseXY.x - cursorStartX;
      // Compensate for elements being visually in a different place than the event coordinates when designer canvas is zoomed.
      if (context == "dspf" && me.designMode){
        deltay = Math.round(deltay * toolbar.zoomFactor);
        deltax = Math.round(deltax * toolbar.zoomFactor);
      }
      if (me.hasHeader && cell.row == 0) {
        // move header column
        if (headerCellProxy == null) {
          headerCellProxy = cell.cloneNode(true);
          headerCellProxy.style.position = 'absolute';
          headerCellProxy.style.border = "1px solid #999999";
          headerCellProxy.style.zIndex = me.moveColumnZIndex;
          headerCellProxyContainer = document.createElement("div");
          headerCellProxyContainer.className = me.tableDiv.className;
          headerCellProxyContainer.style.borderColor = "transparent";
          cell.parentNode.parentNode.appendChild(headerCellProxyContainer);
          headerCellProxyContainer.appendChild(headerCellProxy);
          // don't display proxy immediately to allow a potential double-click to register
          headerCellProxy.style.display = "none";
          setTimeout(function() {
            if (headerCellProxy != null) {  // still there
              headerCellProxy.style.display = "";
            }
          }, 150);
        }
        headerCellProxy.style.top = (me.tableDiv.startTop + deltay) + "px";
        var cellLeft = parseInt(cell.style.left);
        if (isNaN(cellLeft)){
          var rect = cell.getBoundingClientRect();
          cellLeft = rect.left;
        }
        headerCellProxy.style.left = (me.tableDiv.startLeft + cellLeft + deltax) + "px";
        
        var matchedCol = null;
        // The mouse is within 25px above the grid or over the grid.
        if (deltay > -25 && deltay < parseInt(me.tableDiv.style.height)) {
          //Look at each vLine and decide which the mouse is nearest.
          //Adjust the mouse coordinates to the vLine's frame of reference so they can be compared.
          for (var i = 0; i < me.vLines.length; i++) {
            var line = me.vLines[i];
            var lineLeft = parseInt(line.style.left);
            var mouseLeft = mouseXY.x;

            if (me.designMode && context == "dspf") {
              lineLeft = Math.round(lineLeft * toolbar.zoomDecimal);    //Match with the scaled canvas so the mouse and elements appear together.
            }

            mouseLeft -= mouseLineDiff.x;

            var diff = Math.abs(lineLeft - mouseLeft);
            if (diff < 15) {
              // The mouse is near vLine[i].
              if (columnPointer != null && columnPointer.parentNode != line.parentNode) {
                columnPointer.parentNode.removeChild(columnPointer);
                columnPointer = null;
              }
              if (columnPointer == null) {
                columnPointer = document.createElement("img");
                columnPointer.src = pui.normalizeURL("/profoundui/proddata/images/grids/column-pointer.gif");
                columnPointer.style.position = "absolute";
                columnPointer.style.zIndex = me.moveColumnZIndex + 1;
                if (me.designMode) toolbar.designer.container.appendChild(columnPointer);
                else document.body.appendChild(columnPointer);
              }
              var top = parseInt(line.style.top) - 10;
              var left = parseInt(line.style.left) - 4;

              top += offset.y;
              left += offset.x;
              columnPointer.style.display = "";
              columnPointer.style.top = top + "px";
              columnPointer.style.left = left + "px";
              matchedCol = i;
              columnPointer.matchedCol = matchedCol;
              break;
            }
          }
        }
        if (matchedCol == null && columnPointer != null) {
          columnPointer.style.display = "none";
          columnPointer.matchedCol = null;
        }
        return;
      }

      var designItem = me.tableDiv.designItem;
      if (designItem != null) {
        pui.designer.testDragOverGridOrLayout(mouseXY.x, mouseXY.y, designItem.designer);

        var selection = designItem.designer.selection;
        if (selection.snapToGrid) {
          deltax += me.tableDiv.startLeft;
          deltay += me.tableDiv.startTop;
          deltax = selection.snap(deltax, pui.multX);
          deltay = selection.snap(deltay, pui.multY, (context == "genie" ? 3 : 0));
          deltax -= me.tableDiv.startLeft;
          deltay -= me.tableDiv.startTop;
        }
      }
      me.doThisToTableDivs(function (domObj) {
        domObj.style.top = (domObj.startTop + deltay) + "px";
        domObj.style.left = (domObj.startLeft + deltax) + "px";
      });
      if (designItem != null) designItem.moved = true;
      me.setScrollBar();
      var psBar = pui.designer.psBar;
      if (psBar.container == null) {
        psBar.container = document.body;
        psBar.init();
      }
      psBar.set(me.tableDiv.designItem);
      psBar.show();
    }
    function mouseup() {
      me.dragging = false;
      if (headerCellProxy != null) {
        headerCellProxy.parentNode.removeChild(headerCellProxy);
        headerCellProxyContainer.parentNode.removeChild(headerCellProxyContainer);
        headerCellProxy = null;
        headerCellProxyContainer = null;
      }
      var columnWasMoved = false;
      if (columnPointer != null) {
        columnPointer.style.display = "none";
        if (columnPointer.matchedCol != null) {
          var itm = me.tableDiv.designItem;
          if (itm != null) itm.designer.undo.addSnapshot("Move Column", itm.designer);
          me.moveColumn(cell.col, columnPointer.matchedCol);
          // if hidable columns, update the column inforamtion and save the colSequence to the object
          if (me.hidableColumns) {
            var cols = me.columnInfo.map(function (col) {
              if (!col["showing"]) col["currentColumn"] = -1;
              else {
                var curCol = getCurrentColumnFromId(col["columnId"]);
                col["currentColumn"] = curCol;
                col["savedColumn"] = curCol;
              }
              return col;
            });
            var colSequence = [];
            me.cells[0].forEach(function (cell) {
              colSequence.push(cell.columnId);
            });
            cols.colSequence = colSequence;
            me.columnInfo = cols;
          }
          columnWasMoved = true;
          columnPointer.matchedCol = null;

          if (persistState) {
            // If hidable columns, we already have the colSequence 
            if (!colSequence) {
              var colSequence = [];
              for (var i = 0; i < me.cells[0].length; i++) {
                colSequence.push(me.cells[0][i].columnId);
              }
            }
            saveState(colSequence, "colSequence");
            if (me.hidableColumns) {
              var state = restoreStatePreCheck();
              if (state) {
                var colState = state["hidableColState"];
                if (!colState) colState = { "cols": cols, "headings": me.columnHeadings };
                else {
                  colState["cols"] = cols;
                  colState["headings"] = me.columnHeadings;
                }
              } else {
                var colState = { "cols": cols, "headings": me.columnHeadings };
              }
              var colWidths = me
                .getColumnWidths()
                .split(',')
                  .map(function (size) { return Number(size); });

              saveState(colState, "hidableColState");
              saveState(colWidths, 'colWidths');
              me.columnInfo = cols;
            }
          }
        }
      }
      if (me.designMode) {
        var itm = me.tableDiv.designItem;
        if (itm != null) {
          if (itm.moved) {

            var designer = itm.designer;
            if (designer.dropContainer != null) {
              me.moveGridToDropContainer();
            } else {

              if (inLayoutContainer) {
                if (designer.proxyDiv.style.display == "") {
                  me.moveGridToMainCanvas();
                }
              }
              designer.addSelectionToTabs();
              me.doExpandToLayout();
              if (context == "dspf") pui.ide.refreshRibbon();
            }

          }
          else {
            if (!columnWasMoved) {
              me.tableDiv.designItem.designer.undo.removeLastGroup();
            }
          }
        }
        me.sendToDesigner();
        var psBar = pui.designer.psBar;
        if (psBar != null && psBar.container != null) psBar.hide();
        
        designUtils.postDragCleanGridsLayouts(me.tableDiv.designItem.designer);
      }
      removeEvent(document, "mousemove", mousemove);
      removeEvent(document, "mouseup", mouseup);
    }
    addEvent(document, "mousemove", mousemove);
    addEvent(document, "mouseup", mouseup);
    preventEvent(event);
    if (me.designMode && me.tableDiv.designItem != null) {
      me.tableDiv.designItem.moved = false;
      var designer = me.tableDiv.designItem.designer;
      var selection = designer.selection;
      var undoText = "Move Selection";
      if (selection.resizers.length == 1) undoText = "Move Grid";
      if (!(me.hasHeader && cell.row == 0)) {
        designer.undo.start(undoText);
        designer.undo.noRefresh = true;
        selection.addToUndo(["left", "top", "parent tab panel", "parent tab panel"]);
        designer.undo.noRefresh = false;
      }
    }
  }


  /**
   * In Visual Designer, moves the grid inside a layout container. This is called on mouseup (when dragging the grid), or when
   * the grid's record in the Designer Elements panel is moved into a layout record. designer.dropContainer must not be null.
   * 
   * @returns {undefined}
   */
  this.moveGridToDropContainer = function () {
    var itm = me.tableDiv.designItem;
    var designer = itm.designer;

    designer.undo.addSnapshot("Move " + designer.selection.getUndoDescription(), designer);
    var container = designer.dropContainer;

    var top;
    var left;
    if (designer.proxyDiv.style.display == "") {
      top = parseInt(designer.proxyDiv.style.top);
      left = parseInt(designer.proxyDiv.style.left);
    }
    else {
      top = parseInt(itm.dom.style.top);
      left = parseInt(itm.dom.style.left);
    }
    var offset = pui.layout.getContainerOffset(container);
    left = left - offset.x;
    top = top - offset.y;

    if (designer.selection.snapToGrid) {
      left = designer.selection.snap(left, pui.multX);
      top = designer.selection.snap(top, pui.multY);
    }

    var diffTop = top - parseInt(itm.dom.style.top);
    var diffLeft = left - parseInt(itm.dom.style.left);
    me.doThisToTableDivs(function (domObj) {
      domObj.parentNode.removeChild(domObj);
      container.appendChild(domObj);
      domObj.style.top = (parseInt(domObj.style.top) + diffTop) + "px";
      domObj.style.left = (parseInt(domObj.style.left) + diffLeft) + "px";
    });
    if (me.scrollbarObj != null) me.scrollbarObj.changeContainer(container);
    if (me.pagingBar != null) me.pagingBar.changeContainer(container);
    me.container = container;
    if (me.tableDiv.sizeMe != null && typeof me.tableDiv.sizeMe == "function") me.tableDiv.sizeMe();
    me.setScrollBar();

    itm.properties.top = top + "px";
    itm.properties.left = left + "px";

    designer.columnHiDiv.style.display = "none";
    designer.proxyDiv.style.display = "none";
    designer.dropContainer = null;
    designer.selection.clear();
    designer.selection.add(itm);
    designer.addSelectionToTabs();
    pui.ide.refreshElementList();
  };

  /**
   * In Visual Designer, move the grid to the main canvas. Called in mouseup handler or when the "Move to main canvas" button 
   * was pressed in Designer Elements panel. Grid must be inLayoutContainer, inDesignMode when this is called.
   * 
   * @returns {undefined}
   */
  this.moveGridToMainCanvas = function () {
    var designItem = me.tableDiv.designItem;
    var designer = designItem.designer;

    // move outside of container onto the main screen
    designer.undo.addSnapshot("Move " + designer.selection.getUndoDescription(), designer);

    var diffTop = parseInt(designer.proxyDiv.style.top) - parseInt(designItem.dom.style.top);
    var diffLeft = parseInt(designer.proxyDiv.style.left) - parseInt(designItem.dom.style.left);
    me.doThisToTableDivs(function (domObj) {
      domObj.parentNode.removeChild(domObj);
      designer.container.appendChild(domObj);
      domObj.style.top = (parseInt(domObj.style.top) + diffTop) + "px";
      domObj.style.left = (parseInt(domObj.style.left) + diffLeft) + "px";
    });
    if (me.scrollbarObj != null) me.scrollbarObj.changeContainer(designer.container);
    if (me.pagingBar != null) me.pagingBar.changeContainer(designer.container);
    me.container = designer.container;
    me.setScrollBar();

    designItem.properties.top = designer.proxyDiv.style.top;
    designItem.properties.left = designer.proxyDiv.style.left;
    designer.proxyDiv.style.display = "none";
    designer.selection.clear();
    designer.selection.add(designItem);
    designer.addSelectionToTabs();
    pui.ide.refreshElementList();
  };

  function moveCellContent(fromCell, toCell) {
    var objs = [];
    var obj = fromCell.firstChild;
    while (obj != null) {
      if (obj.style.position == "absolute" && !obj.isSizie) {
        objs.push(obj);
      }
      obj = obj.nextSibling;
    }
    toCell.innerHTML = "";
    for (var i = 0; i < objs.length; i++) {
      obj = objs[i];
      obj.parentNode.removeChild(obj);
      toCell.appendChild(obj);
    }
  }

  // set design events on a vertical/horizontal lines
  function lineDesign(lines, i, isVertical, resizableColumns) {
    if (!me.designMode && !resizableColumns) return;
    var line = lines[i];
    if (me.borderWidth !== null && me.borderWidth < minBWidth) {
      line.style.borderWidth = "2px";
      if (!isVertical) line.style.width = (parseInt(line.style.width) + 2) + "px";
    }
    if (!isVertical) line.style.borderTopStyle = designBorderStyle;
    if (isVertical) line.style.borderRightStyle = designBorderStyle;
    if (isVertical) line.style.cursor = "w-resize";
    if (!isVertical) lines[i].style.cursor = "n-resize";
    me.selectMe();
    function mousedown(event) {
      
      

      if (me.designMode) {
        var psBar = pui.designer.psBar;
        if (psBar.container == null) {
          psBar.container = document.body;
          psBar.init();
        }
        psBar.set(me.tableDiv.designItem);
        if (i == 0 || i == lines.length - 1) psBar.show();
      }
      if (me.designMode) {
        me.tableDiv.designItem.designer.hideDialogs();
        if (me.lockedInPlace) {
          designUtils.preventEvent(event);
          return;
        }
      }
      else {
        if (me.gridMenu != null) me.gridMenu.hide();
      }
      line.dragging = true;
      me.dragging = true;
      var cursorStartX = getMouseX(event);
      var cursorStartY = getMouseY(event);
      var startLeft = parseInt(line.style.left);
      var startTop = parseInt(line.style.top);
      me.selectMe();
      function mousemove(event) {
        var mouseXY = pui.getMouseXY(event);
        var y = mouseXY.y - cursorStartY;
        var x = mouseXY.x - cursorStartX;
        if (context == "dspf" && me.designMode){
          y = Math.round(y * toolbar.zoomFactor);
          x = Math.round(x * toolbar.zoomFactor);
        }
        doResize(x, y, i, isVertical, startTop, startLeft);
        if (!isVertical && i == lines.length - 1 && lines.length > 2 && me.scrollbarObj != null && me.scrollbarObj.type == "sliding") {
          var addHeight = y;
          if (addHeight < -me.rowHeight + 5) addHeight = -me.rowHeight + 5;
          if (typeof me.scrollbarObj.increaseHeight == "function") me.scrollbarObj.increaseHeight(addHeight);
        }
        if (me.designMode) {
          psBar.set(me.tableDiv.designItem);
        }
        else {
          me["alignColumnTotals"]();
        }
      }
      var bwidth = 3;
      if (me.borderWidth > 3) bwidth = me.borderWidth;
      line.style.borderWidth = bwidth + "px";
      line.style.borderColor = "#333333";
      if (!isVertical) line.style.borderTopStyle = "solid";
      if (isVertical) line.style.borderRightStyle = "solid";
      function mouseup() {
        line.dragging = false;
        me.dragging = false;
        var bwidth = me.borderWidth;
        if (bwidth === null || bwidth < minBWidth) bwidth = minBWidth;
        line.style.borderWidth = bwidth + "px";
        line.style.borderColor = me.borderColor;
        if (!isVertical) line.style.borderTopStyle = designBorderStyle;
        if (isVertical) line.style.borderRightStyle = designBorderStyle;
        if (!isVertical && i == lines.length - 1 && (i >= 2 || (me.hasHeader && i == 1))) {
          var tableBottom = parseInt(line.style.top);
          var minRow = me.hasHeader ? 2 : 1;
          if (me.cells.length > minRow) {
            me.removeLastRowCells();
            if (tableBottom > parseInt(lines[lines.length - 1].style.top) + me.rowHeight - 3) {
              var addedSome = false;
              while (parseInt(lines[lines.length - 1].style.top) < tableBottom) {
                me.addRow();
                addedSome = true;
              }
              if (addedSome) me.mirrorDownAll();
            }
          }
          else {
            me.rowHeight = parseInt(lines[lines.length - 1].style.top) - parseInt(lines[lines.length - 2].style.top);
          }
        }
        if (me.designMode) {
          me.doExpandToLayout();
          me.sendToDesigner();
          psBar.hide();
        }
        else {
          me["alignColumnTotals"]();
          if (isVertical && persistState) {
            if (!me.hidableColumns) {
              var colWidths = new Array(me.cells[0].length);
              for (var j = 0; j < me.cells[0].length; j++) {
                var cell = me.cells[0][j];
                colWidths[cell.columnId] = cell.clientWidth;
              }
            } else {
              var colWidths = me
                  .getColumnWidths()
                  .split(',')
                  .map(function (size) { return Number(size); });
            }
            saveState(colWidths, "colWidths");
          }
        }
        removeEvent(document, "mousemove", mousemove);
        removeEvent(document, "mouseup", mouseup);
      }
      addEvent(document, "mousemove", mousemove);
      addEvent(document, "mouseup", mouseup);
      preventEvent(event);
      if (me.designMode) {
        var designer = me.tableDiv.designItem.designer;
        if (isVertical) designer.undo.start("Size Grid Column");
        if (!isVertical) designer.undo.start("Size Grid Rows");
        // order matters -- left/top have to be added to undo first, so they can be undone last
        designer.selection.addToUndo(["left", "top", "number of rows", "row height", "header height", "column widths"]);
      }
    }
    addEvent(line, "mousedown", mousedown);
    addEvent(line, "mouseover", function () {
      if (!me.dragging) {
        var bwidth = 3;
        if (me.borderWidth > 3) bwidth = me.borderWidth;
        line.style.borderWidth = bwidth + "px";
        line.style.borderColor = "#333333";
        if (!isVertical) line.style.borderTopStyle = "solid";
        if (isVertical) line.style.borderRightStyle = "solid";
      }
    });
    addEvent(line, "mouseout", function () {
      if (!line.dragging) {
        var bwidth = me.borderWidth;
        if (bwidth === null || bwidth < minBWidth) bwidth = minBWidth;
        line.style.borderWidth = bwidth + "px";
        line.style.borderColor = me.borderColor;
        if (!isVertical) line.style.borderTopStyle = designBorderStyle;
        if (isVertical) line.style.borderRightStyle = designBorderStyle;
      }
    });
  }


  function doResize(x, y, lineIndex, isVertical, startTop, startLeft) {
    var excelLike = (pui["grid column resize style"] !== "simple");
    if (me.expandToLayout) excelLike = false;
    var i = lineIndex;
    var lines;
    if (isVertical) lines = me.vLines;
    else lines = me.hLines;
    var line = lines[i];
    if (isVertical) y = 0;
    if (!isVertical) x = 0;
    var top = startTop + y;
    var left = startLeft + x;
    if (isVertical) {
      if (i > 0 && left < parseInt(lines[i - 1].style.left) + 5) {
        left = parseInt(lines[i - 1].style.left) + 5;
      }
      if (i < lines.length - 1 && left > parseInt(lines[i + 1].style.left) - 5) {
        left = parseInt(lines[i + 1].style.left) - 5;
      }
    }
    if (!isVertical) {
      if (i > 0 && top < parseInt(lines[i - 1].style.top) + 5) {
        top = parseInt(lines[i - 1].style.top) + 5;
      }
      if (i < lines.length - 1 && top > parseInt(lines[i + 1].style.top) - 6) {
        top = parseInt(lines[i + 1].style.top) - 6;
      }
    }
    if (!isVertical) line.style.top = top + "px";
    if (isVertical) {
      if (excelLike && i != 0) {
        var diff = left - line.offsetLeft;
        for (var j = i + 1; j < lines.length; j++) {
          var curLine = lines[j];
          curLine.style.left = (curLine.offsetLeft + diff) + "px";
        }
      }
      line.style.left = left + "px";
    }
    if (!isVertical && (i != 0 || !me.hasHeader) && i != lines.length - 1) {
      if (i < lines.length - 1) me.rowHeight = parseInt(lines[i + 1].style.top) - parseInt(lines[i].style.top);
      else me.rowHeight = parseInt(lines[i].style.top) - parseInt(lines[i - 1].style.top);
      var curTop = top;
      for (var j = i + 1; j < lines.length; j++) {
        curTop += me.rowHeight;
        lines[j].style.top = curTop + "px";
      }
      curTop = top;
      var downto = 0;
      if (me.hasHeader) downto = 1;
      for (var j = i - 1; j >= downto; j = j - 1) {
        curTop = curTop - me.rowHeight;
        lines[j].style.top = curTop + "px";
      }
      if (me.hasHeader) {
        lines[0].style.top = (parseInt(lines[1].style.top) - me.headerHeight) + "px";
      }
    }
    if (!isVertical && i == 0 && me.hasHeader && lines.length > 1) {
      me.headerHeight = parseInt(lines[1].style.top) - parseInt(lines[0].style.top);
    }
    if (!isVertical && i == 1 && !me.hasHeader && lines.length == 2) {
      me.rowHeight = parseInt(lines[i].style.top) - parseInt(lines[i - 1].style.top);
    }
    if (i == 0 && isVertical) {
      me.tableDiv.style.left = left + "px";
      setLineLefts();
    }
    if (isVertical && (lines.length - 1 == i || i == 0)) {
      setLineWidths();
    }
    else if (excelLike && isVertical) {
      setLineWidths();
    }
    if (!isVertical) {
      setLineTops();
      setLineHeights();
    }
    if (isVertical && me.hasHeader) {
      if (me.hidableColumns) me.setHeadings(me.getHeadings(me.columnInfo));
      else me.setHeadings();
    }
    me.sizeAllCells();
    positionIcons();
    me.setScrollBar();
  }

  function setLineLefts() {
    for (var i = 0; i < me.hLines.length; i++) {
      me.hLines[i].style.left = me.tableDiv.style.left;
    }
  }

  function setLineTops() {
    me.tableDiv.style.top = me.hLines[0].style.top;
    for (var i = 0; i < me.vLines.length; i++) {
      me.vLines[i].style.top = me.tableDiv.style.top;
    }
  }

  function setLineWidths() {
    var width = 0;
    if (me.vLines.length > 0) {
      var bwidth = me.borderWidth;
      if (bwidth === null || (bwidth < minBWidth && me.designMode)) bwidth = minBWidth;
      width = parseInt(me.vLines[me.vLines.length - 1].style.left) - me.getStyleAsInt("left") + bwidth;
    }
    for (var i = 0; i < me.hLines.length; i++) {
      me.hLines[i].style.width = width + "px";
    }
    me.tableDiv.style.width = width + "px";
    //Mask doesn't adjust to new width when columns are hidden
    if(persistState && me.isDataGrid() && me["dataProps"]["load all rows"] == "true" && maskCover.style.display == "block"){
      //reset mask with new widths
      me.mask();
      me.gridLoading();
    }
  }

  function setLineHeights() {
    var height = 0;
    if (me.hLines.length > 0) {
      height = parseInt(me.hLines[me.hLines.length - 1].style.top) - me.getStyleAsInt("top");
    }
    for (var i = 0; i < me.vLines.length; i++) {
      me.vLines[i].style.height = height + "px";
    }
    me.tableDiv.style.height = height + "px";
  }

  function makeCell(row, col) {
    var cell = document.createElement("div");
    me.tableDiv.appendChild(cell);
    if (!pui.iPadEmulation && me.cellCursor != 'default') {
      cell.style.cursor = me.cellCursor;
    }
    if (row > 0 || !me.hasHeader) cell.style.webkitTapHighlightColor = "rgba(0,0,0,0)";

    var header = (row == 0 && me.hasHeader);
    var even = ((row % 2) == 1);
    if (me.hasHeader) even = !even;

    if (header) {
      if (col < me.columnHeadings.length) {
        var qfclass = me.showQuickFilters ? ' class="qf"' : '';
        cell.innerHTML = '<div'+qfclass+' style="' + getPaddingCSS() + '">' + me.columnHeadings[col] + '</div>';        
      }
    }

    if (me.designMode) setCellStyles(cell, header, even, col);

    cell.onmouseover = function (e) {
      if (me.dragging) return;
      if (!me.hasHeader) executeEvent("onrowmouseover", row + 1, null, e, col);
      if (me.hasHeader && row != 0) executeEvent("onrowmouseover", row, null, e, col);
      if (!me.hoverEffect) return;
      if ((pui["is_touch"] && !pui["is_mouse_capable"] && !me.designMode) || pui.iPadEmulation) return;
      var header = (row == 0 && me.hasHeader);
      if (header) return;
      var cols = me.cells[row];

      var dataArrayIdx = me._getDataIndexFromDOMRow(row);
      me.setRowBackground(row, true, dataArrayIdx);

      if (me.singleRowZoom && !me["expanded"] && (row > 0 || !me.hasHeader)) {
        var cell = cols[0];
        if (me.zoomIcon == null) {
          me.zoomIcon = document.createElement("img");
          me.zoomIcon.setAttribute("isZoomIcon", "true");
          me.zoomIcon.src = pui.normalizeURL("/profoundui/proddata/images/icons/zoom_in.png");
          me.zoomIcon.style.position = "absolute";
          me.zoomIcon.style.top = "6px";
          me.zoomIcon.style.left = "3px";
          if (!pui.iPadEmulation) {
            me.zoomIcon.style.cursor = "pointer";
          }
        }
        if (me.zoomIcon.parentNode != cell) {
          if (me.zoomIcon.parentNode != null) me.zoomIcon.parentNode.removeChild(me.zoomIcon);
          cell.appendChild(me.zoomIcon);
        }
        me.zoomIcon.style.display = "";
        me.zoomIcon.onclick = function (e) {
          me["rowZoom"](me.cells[row]);
          preventEvent(e);
        };

      }
    };

    cell.onmouseout = function (e) {
      if (!me.hasHeader) executeEvent("onrowmouseout", row + 1, null, e, col);
      if (me.hasHeader && row != 0) executeEvent("onrowmouseout", row, null, e, col);
      var header = (row == 0 && me.hasHeader);
      if (header) return;
      
      var dataArrayIdx = me._getDataIndexFromDOMRow(row);
      me.setRowBackground(row, false, dataArrayIdx);
    };

    cell.onmousedown = function (event) {
      // Handle context menu
      if (pui.isRightClick(event)) {
        if (me.designMode) return;
        function stopContextMenu(event) {
          if (!event) event = window.event;
          if (event.preventDefault) event.preventDefault();
          if (event.stopPropagation) event.stopPropagation();
          event.cancelBubble = true;
          event.returnValue = false;
          // remove the contextmenu event listener so that user 
          // can retrieve the context menu when not in the grid 
          document.body.oncontextmenu = null;
          return false;
        }
        if (me.hasHeader && row == 0) {
          if (me.gridMenu == null) {
            me.gridMenu = new pui.GridMenu();
            me.gridMenu.grid = me;
            me.gridMenu.init();
          }
          me.gridMenu.cell = cell;
          me.gridMenu.clickEvent = (event ? event : window.event);
          me.gridMenu.show();
          // disable browser's context menu
          document.body.oncontextmenu = stopContextMenu;
          return;
        }
        var contextMenu;
        if (me.contextMenuId) {

          contextMenu = getObj(me.contextMenuId);

        }
        if (contextMenu == null) return;

        // This is necessary as FireFox can fire the 'hide' event directly after the 
        // show event if the mouse cursor is not exactly over the menu div. This can 
        // happen if the menu border is rounded slightly with CSS. 
        // It would seem that the code below to stop event propagation would prevent that...
        // Perhaps it's a bug in FireFox.
        // See usage below and in 'hideContextMenu'...
        contextMenu.showing = true;

        // disable browser's context menu
        document.body.oncontextmenu = stopContextMenu;

        // select row
        cell.onclick(event);
        if ((event.getPreventDefault && event.getPreventDefault()) || event.cancelBubble) {

          contextMenu.showing = false;
          me.hideContextMenu();
          return;

        }


        // show custom context menu
        var x = pui.getMouseX(event);
        var y = pui.getMouseY(event);
        var offset = {x:0, y:0};
        var ctrOffset = pui.getOffset(pui.runtimeContainer);
        if (context == "genie") ctrOffset = pui.getOffset(pui["getActiveContainer"]()); //handles grid inside a window. #3541.
        var parent = contextMenu.parentNode;
        if (parent != null && parent.tagName == "FORM") parent = parent.parentNode; // this will handle Genie (although the the context menu option is not available in Genie yet)
        if (parent != null) {

          if (context == "dspf" && parent.getAttribute("container") == "true") {

            // 7489. pui.layout.getContainerOffset does not work as expected is this case
            var parentOffset = pui.getOffset(parent);
            offset.x = parentOffset[0];
            offset.y = parentOffset[1];

          }
          else if (parent.isPUIWindow) {

            offset.x = parent.offsetLeft;
            offset.y = parent.offsetTop;

          }

        }

        offset.x += ctrOffset[0];
        offset.y += ctrOffset[1];
        x -= offset.x;
        y -= offset.y;

        // Center under the finger for touch devices.
        if (pui["is_touch"] && !pui["is_mouse_capable"]) {

          x -= contextMenu.clientWidth / 2;

          contextMenu.onselectstart = function(e) { return false; };
          if (typeof contextMenu.style.MozUserSelect != "undefined") contextMenu.style.MozUserSelect = "none";
          if (typeof contextMenu.style.webkitUserSelect != "undefined") contextMenu.style.webkitUserSelect = "none";

        }

        contextMenu.style.zIndex = me.contextMenuZIndex;

        // Allow the "onoptiondisplay" event on the menu widget to be used to
        //  update the options that will be displayed.
        //
        // NOTE: Unfortunately we can't use executeEvent() here since the
        //       event is attached to the menu widget rather than the grid widget.

        if (typeof contextMenu["onoptiondisplay"] == "function") {

          var curRow = row;
          if (!me.hasHeader) curRow += 1;

          if (me.recNum != null && !isNaN(me.recNum) && me.recNum > 0) { 
            var adjustedRow = curRow; 
            adjustedRow += (me.recNum - 1);
            var rowNumber = adjustedRow;
            var dataRecords = me.dataArray;
            if (me.isFiltered()) dataRecords = me.visibleDataArray;
            if (dataRecords[adjustedRow - 1] != null && dataRecords[adjustedRow - 1].subfileRow != null) {
              adjustedRow = dataRecords[adjustedRow - 1].subfileRow;
            }
            contextMenu["onoptiondisplay"](adjustedRow, adjustedRow, rowNumber, col, me);
            contextMenu.menuWidget.draw();
          }

        }

        contextMenu.style.visibility = "";
        contextMenu.style.display = "";
        // Position after show, as some browsers (FF) report menu width 0 when hidden.
        // 7489. Calculate the maximum coordinate the pop-up menu should be placed at to not be cutoff by its container
        var screenMaxX = 0;
        var screenMaxY = 0;
        var containerMaxX = undefined;
        var containerMaxY = undefined;
        var maxX;
        var maxY;

        // Calculate the maximum coordinates which would fit within the pop-up menu's container
        if (parent != null
            && parent.clientWidth != null && parent.clientWidth >= contextMenu.clientWidth
            && parent.clientHeight != null && parent.clientHeight >= contextMenu.clientHeight) {
          containerMaxX = parent.clientWidth;
          containerMaxY = parent.clientHeight;
        }

        // Calculate the maximum coordinates that would fit within the screen
        var doc = document.documentElement;
        var docScrollLeft = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
        var docScrollTop = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
        screenMaxX = doc.clientWidth + docScrollLeft - offset.x;
        screenMaxY = doc.clientHeight + docScrollTop - offset.y;

        // Determine which set of coordinates should be used
        if (containerMaxX == undefined || containerMaxY == undefined) {
          maxX = screenMaxX;
          maxY = screenMaxY;
        }
        else {
          maxX = Math.min(screenMaxX, containerMaxX);
          maxY = Math.min(screenMaxY, containerMaxY);
        }

        // Shift max coords by the size of the pop-up menu
        maxX -= (contextMenu.clientWidth + 10); // width of menu plus scrollbar
        maxY -= (contextMenu.clientHeight + 10); // height of menu plus scrollbar

        // Make sure the pop-up is not positioned outside of the calculated maximum coordinates
        if (x > maxX) x = maxX;
        if (y > maxY) y = maxY;
        if (x < 0) x = 0;
        if (y < 0) y = 0;
        contextMenu.style.left = x + "px";
        contextMenu.style.top = y + "px";

        preventEvent(event);
        if (event != null && event.stopPropagation != null) event.stopPropagation();
        setTimeout(function () {

          contextMenu.showing = false;

        }, 250);

        return false;
      }
    };

    // Map a 'tap/hold' gesture on touch devices to the cell mousedown event.

    pui.taphold(cell, function (e) {

      // It would be nice to just create and dispatch a 'MouseEvent' here.
      // However, the documentation on this is poor, and it was not clear how to set the 
      // 'pageX' and 'pageY' properties on the created event through this interface.        
      // The 'pui.getMouseX/Y' calls in the mousedown code look at these to position the menu. 
      e.button = 3;
      cell.onmousedown(e);

    });

    cell.onclick = function (e) {
      var target = getTarget(e);
      if (target.combo)
        return;
      
      // 7536: capture row clicked from target and store in grid property
      if (typeof(target.offsetParent.row) != "undefined") {
        me.rowclicked = target.offsetParent.row;
      } else {
        me.rowclicked = target.row; 
      }
      
      // 7208: capture column clicked from target and store in grid property
      if (typeof(target.offsetParent.col) != "undefined") {
        me.columnclicked = target.offsetParent.col;
      } else {
        me.columnclicked = target.col; 
      }

      me["row clicked"] = me.rowclicked;
      me["column clicked"] = me.columnclicked;

      var isRight = pui.isRightClick(e);
      if (target.tagName != "INPUT" && target.tagName != "SELECT" && target.tagName != "OPTION" && target.tagName != "BUTTON") {
        if (!me.hasHeader) executeEvent("onrowclick", row + 1, isRight, e, col);
        if (me.hasHeader && row != 0) executeEvent("onrowclick", row, isRight, e, col);
      }
      if (!me.designMode) {

        me.setCursorRRN(row);

        var prevent = ((target.tagName == "INPUT" || target.tagName == "SELECT" ||  target.tagName == "BUTTON") && !target.disabled && !target.readOnly);
        
        var headerOffset = (me.hasHeader ? 1 : 0);

        // Select the clicked row and deselect others, or deselect the clicked row.
        if (me.selectionEnabled && !prevent && (row > 0 || !me.hasHeader)) {
          if (me.recNum != null && !isNaN(me.recNum) && me.recNum > 0) {
            var numRows = me.hLines.length - 1;   //Number of visible rows.
            
            // Deselect other records than the one clicked, including not visible or filtered ones.
            if (me.singleSelection || (me.extendedSelection && !e.ctrlKey && !e.shiftKey && !e.metaKey)) {
              var clickedRow = row + me.recNum - (me.hasHeader ? 1 : 0);

              for (var i = 0; i < me.dataArray.length; i++) {
                var curRow = i - me.recNum + 1 + headerOffset;

                // this condition allows the user to unselect a record using the ctrl key.
                //  Only do it if it's NOT a right click mouse event 
                // -or-
                //  It's a right click and they aren't on a selected row.
                var isRowSelected = (clickedRow <= me.dataArray.length) && me.dataArray[clickedRow - 1].selected;
                if (me.isFiltered()) isRowSelected = (clickedRow <= me.visibleDataArray.length) && me.visibleDataArray[clickedRow - 1].selected;

                // When right-clicking a row that isn't selected, deselect other rows.
                // When left-click + ctrl/meta key was used, deselect the clicked row.
                if (!isRight || !isRowSelected) {
                  if ((!e.ctrlKey && !e.metaKey) || (curRow != row)) {
                    if (me.dataArray[i].selected == true) {
                      handleSelection(me.dataArray[i], false, i); //Deselect.
                    }
                  }
                }
                // Set the row background on the rows of records that are visible.
                if (curRow >= headerOffset && curRow < numRows && me.rowsHidden == 0) {
                  me.setRowBackground(curRow);
                }
              }

              if (me.isFiltered() || me.rowsHidden > 0){
                me._setAllVisibleBackgrounds();   //If any were filtered or hidden, then all must be set with special handling.
              }
            } //done deselecting others.

            var dataRecords = me.isFiltered() ? me.visibleDataArray : me.dataArray;
            var adjustedRow = row + me.recNum - 1 + (me.hasHeader ? 0 : 1);

            // Compensate for any rows in the visible grid that were hidden, up to the row of the clicked cell.
            if (me.rowsHidden > 0 && me.recNum > 0){
              // Finds the index in me.dataArray for the row
              me._unhiddenRowIter(null, row, function(idx){
                adjustedRow = idx + 1;
              });
            }
            
            // Handle shift+click extended selection. Selects some, may deselect some.
            if (me.extendedSelection && e.shiftKey) {
              if (me.selectedRecordNum == null) me.selectedRecordNum = adjustedRow;
              var fromRecordNum = me.selectedRecordNum;
              var toRecordNum = adjustedRow;
              if (fromRecordNum > toRecordNum) {
                var tempRecordNum = fromRecordNum;
                fromRecordNum = toRecordNum;
                toRecordNum = tempRecordNum;
              }
              // For each record, set bg color, select if in range of the most recent 2 shift+clicks. Deselect if out of range.
              for (var i = 0; i < dataRecords.length; i++) {
                
                var curRow = i - me.recNum + 1;
                if (i + 1 >= fromRecordNum && i + 1 <= toRecordNum) {
                  if (dataRecords[i].selected != true) {
                    handleSelection(dataRecords[i], true, i);  //Select a row that isn't selected.
                  }
                }
                else {
                  if (dataRecords[i].selected == true) {
                    handleSelection(dataRecords[i], false, i);  //Deselect a selected row that is not between from/to.
                  }
                }
                if (curRow >= headerOffset && curRow < numRows && me.rowsHidden == 0) {
                  me.setRowBackground(curRow);
                }
              }
              
              if (me.rowsHidden > 0){
                me._setAllVisibleBackgrounds();   //special handling.
              }
            }
            // Else: select the clicked row, including multiple selections.
            else if (dataRecords[adjustedRow - 1] != null && dataRecords[adjustedRow - 1].length > 0) {
              // I don't know why when record.selection was null, the previous code here didn't set it up like it does in other calls to handleSelection.
              // But, to avoid breaking things I didn't consider, I added a new parameter to handleSelection, and it does what previous code here did. MD.
              if (dataRecords[adjustedRow - 1].selected == true && !isRight)
                handleSelection(dataRecords[adjustedRow - 1], false, adjustedRow - 1, true); //deselect
              else
                handleSelection(dataRecords[adjustedRow - 1], true, adjustedRow - 1, true); //select

              var dataArrayIdx;
              if (me.rowsHidden > 0) dataArrayIdx = me._getDataIndexFromDOMRow(row);  //Compensate for "row" being unreliable when any rows are hidden. #6655.
              me.setRowBackground(row, true, dataArrayIdx);  //Set the background now to show the user the selection was successfull.
            }
            me.selectedRecordNum = adjustedRow;
          }
        } //done selecting/deselecting.

        if (me.runtimeChildren.length > 0 && me.runtimeChildren[0].id == "_msgsfltext") {
          var cell = me.cells[row][0];
          var msgTextDom;
          if (cell != null) {
            msgTextDom = cell.firstChild;
          }
          if (msgTextDom != null && target != msgTextDom && msgTextDom.onclick != null && typeof msgTextDom.onclick == "function") {
            msgTextDom.onclick();
          }
        }

        // return cursor based on widgets within the cell
        // this code needs to work on the cell, but the target could be the 
        // widget in the cell...
        var cell = target;
        var prt = target.parentNode;
        if (prt && prt.row && prt.col) {

          cell = prt;

        }

        if (cell.row != null && cell.col != null && cell.tagName == "DIV" && cell.parentNode.grid == me) {
          var column = String(cell.col);
          for (var i = 0; i < me.runtimeChildren.length; i++) {
            var itm = me.runtimeChildren[i];
            if (itm["column"] == column && itm["cursor row"] != null && itm["cursor column"] != null) {
              var recNum = me.recNum + cell.row;
              if (me.hasHeader) recNum = recNum - 1;
              var cursorReturned = false;
              for (var j = 0; j < itm.domEls.length; j++) {
                var dom = itm.domEls[j];
                if (dom != null && dom.dataArrayIndex == recNum - 1) {
                  pui.returnCursor(e, dom);
                  cursorReturned = true;
                }
              }
              if (cursorReturned) break;
            }
          }
        }

        // position cursor to an input element in the first column, if it's there
        // Don't do this when text selection flag is set, as the browser removes text selection
        // when a box receives focus. We also do not want to place the cursor if the user is trying to highlight text. #6576 
        if (typeof (pui["grid text selection"]) == "undefined" || pui["grid text selection"] == false) {
          if (target.tagName != "INPUT" && target.tagName != "SELECT" && target.tagName != "TEXTAREA" && target.tagName != "BUTTON" && getSelection().toString() == '') {
            // position to input box in first column, if it is present
            var cell = me.cells[row][0];
            placeCursorOnCell(cell);
          }
        }

        if (me.hasTreeLevelColumn && me.treeLevelField !== null && adjustedRow !== undefined) {
          var myTreeLevelItemId = me.tableDiv.id + me.treeLevelItemId + "." + adjustedRow;
          var myTreeLevelItemObj = getObj(myTreeLevelItemId);
          if (myTreeLevelItemObj !== null)
            myTreeLevelItemObj.focus();          // so that left/right arrow keys would expand/collapse tree level
        }
      }
    };

    cell.ondblclick = function (e) {
      if (me.designMode) {
        if (me.hasHeader && row == 0) {
          var itm = me.tableDiv.designItem;
          if (!pui.isBound(itm.properties["column headings"]) && !pui.isTranslated(itm.properties["column headings"])) {
            itm.designer.inlineEditBox.onUpdate = function (newHeading) {
              while (newHeading.indexOf("\n") != -1) {
                newHeading = newHeading.replace("\n", "<br/>");
              }
              while (newHeading.indexOf("\r") != -1) {
                newHeading = newHeading.replace("\r", "");
              }
              if (cell.firstChild != null) cell.firstChild.innerHTML = newHeading;
              else cell.innerHTML = newHeading;
              var newHeadings = "";
              for (var col = 0; col < me.cells[0].length; col++) {
                if (col != 0) newHeadings += ",";
                var colCell = me.cells[0][col];
                var heading = getInnerText(colCell);
                if (colCell.firstChild != null && colCell.firstChild.tagName == "DIV") {
                  heading = colCell.firstChild.innerHTML;
                }
                newHeadings += heading;
              }
              itm.designer.undo.add(itm, "column headings");
              itm.properties["column headings"] = newHeadings;
              me.setProperty("column headings", newHeadings);
              itm.propertiesChanged["column headings"] = true;
              itm.changed = true;
              itm.designer.changedScreens[itm.designer.currentScreen.screenId] = true;
              itm.designer.propWindow.refreshProperty("column headings");
            };
            itm.designer.inlineEditBox.onStyleUpdate = function (propName, styleName, styleValue) {
              var styleValues = "";
              for (var col = 0; col < me.cells[0].length; col++) {
                var cellStyleValue = me.cells[0][col].style[styleName];
                if (cellStyleValue == null) cellStyleValue = "";
                if (propName.indexOf("color") >= 0) {
                  cellStyleValue = pui.normalizeColor(cellStyleValue);
                }
                if (me.cells[0][col] == cell) cellStyleValue = styleValue;
                if (col != 0) styleValues += ",";
                styleValues += cellStyleValue;
              }
              itm.properties[propName] = styleValues;
              me.setProperty(propName, styleValues);
              itm.propertiesChanged[propName] = (styleValue != "");
              itm.changed = true;
              itm.designer.changedScreens[itm.designer.currentScreen.screenId] = true;
              itm.designer.propWindow.refreshProperty(propName);
            };
            itm.designer.inlineEditBox.show(itm, cell, "grid");
          }
        }
      }
      else {      
        if (!me.hasHeader) executeEvent("onrowdblclick", row + 1, null, e, col);
        if (me.hasHeader && row != 0) executeEvent("onrowdblclick", row, null, e, col);
      }
    };

    //cell.innerHTML = "content";
    if (!me.cells[row]) me.cells[row] = new Array();
    cell.row = row;
    cell.col = col;
    me.cells[row][col] = cell;
    if (me.designMode) sizeCell(row, col);
    return cell;
  } //end makeCell().
  
  /**
   * Select or deselect a record. If selection field enabled, set it up for the record, if necessary.
   * @param {Object} record   One record from me.dataArray or visibleDataArray.
   * @param {Boolean} select  When true, selects record; when false, deselects record.
   * @param {Number} index  Used when grid not sorted; should be RRN - 1 or index in me.dataArray.
   * @param {Boolean|Undefined} leaveNullSel  When true: if record.selection is null, leave it null.
   */
  function handleSelection(record, select, index, leaveNullSel) {
    pui.modified = true;
    record.selected = select;
    if (me.selectionField != null) {
      if (record.selection == null) {
        if (leaveNullSel === true) return;
        // if the row has not been rendered and is filtered or sorted use the subfileRow or beforeSort properties 
        // else use the passed index as a fallback 
        var row;
        if (record.subfileRow) row = record.subfileRow;
        else if (record.beforeSort) row = record.beforeSort + 1;
        else row = index + 1;
        record.selection = {
          type: "grid selection",
          subfileRow: row,
          formattingInfo: me.selectionField
        };
        var qualField = pui.formatUpper(me.recordFormatName) + "." + pui.fieldUpper(me.selectionField.fieldName) + "." + row;
        if (pui.responseElements[qualField] == null) {
          pui.responseElements[qualField] = [];
          pui.responseElements[qualField].push(record.selection);
        }
      }
      record.selection.modified = true;
      if (select) record.selection.value = me.selectionValue;
      else record.selection.value = (me.selectionField.dataType == "indicator" ? "0" : " ");
      //Set the response value for rows that have not been initally rendered but have been modified with setDataValue() #4041
      if (record.selection.responseValue) record.selection.responseValue = record.selection.value;
    }
  }
  
  /**
   * Select the specified row, possibly deselecting other rows. Also sets where shift+click range begins next.
   * @param {Number} row    Relative record number of the row to select. should match RRN used in RPG program when row written.
   *   If row is out of bounds, or if record is already selected, Does nothing.
   * @param {Boolean} append   When true, other rows are not deselected when multiple-selection is allowed. When false, others are
   *   deselected if multiple-selection is allowed. If single-selection, other selected records are deselected regardless of argument.
   */
  this["selectRow"] = function(row, append){
    if (!me.selectionEnabled || row < 1 || row > me.dataArray.length ) return;
    // Before sorting and filtering, the index of dataArray maps to the RRN. 
    var useIndex = (!me.isFiltered() && (typeof me.sorted == "undefined" || me.sorted !== true));
    
    // Look at each record in the grid. Note: when you select a row, filter out that row, and then submit, the selected
    // record is still in the response; so, we make sure to check all records, even filtered out ones.
    for (var i = 0; i < me.dataArray.length; i++) {
      // The current loop row is the one specified.
      if ((useIndex && i == row - 1) || (!useIndex && me.dataArray[i].subfileRow == row) ){
        if (me.dataArray[i].selected != true ){
          handleSelection(me.dataArray[i], true, i); //select the specified record.
          if (me.recNum != null && !isNaN(me.recNum) && me.recNum > 0 ){
            me.selectedRecordNum = row + me.recNum - 1 + (me.hasHeader ? 0 : 1);
          }
        }
      }
      else{
        // Multiple-selection is not allowed or append is false, and record is selected.
        if ((me.singleSelection || !append) && me.dataArray[i].selected == true){
          handleSelection(me.dataArray[i], false, i); //deselect.
        }
      }
      
    }
    me._setAllVisibleBackgrounds();
  };
  
  /**
   * Deselect the specified row.
   * @param {Number} row    Relative record number of the row to select. should match RRN used in RPG program when row written.
   *   If row is out of bounds, or if record is not selected, does nothing.
   */
  this["deselectRow"] = function(row){
    if (!me.selectionEnabled || row < 1 || row > me.dataArray.length ) return;
    var isFiltered = me.isFiltered();
    // Before sorting and filtering, the index of dataArray maps to the row.
    if (!isFiltered && (typeof me.sorted == "undefined" || me.sorted !== true)){
      if ( me.dataArray[row - 1].selected == true) deselect(row - 1);
    }
    else{
      // After sorting or filtering, find the record to deselect in the grid.
      for (var i = 0; i < me.dataArray.length; i++) {
        if ( me.dataArray[i].subfileRow == row && me.dataArray[i].selected == true ){
          deselect(i);
          break;
        }
      }
    }
    function deselect(index){
      handleSelection(me.dataArray[index], false, index);
      if (isFiltered) me._setAllVisibleBackgrounds();  //We don't know which cell, so set all.
      else if (me.recNum != null && !isNaN(me.recNum) && me.recNum > 0){
        // Translate the data row to a row in the visible grid.
        var hdrOffset = me.hasHeader ? 1 : 0;
        var gridrow = index - me.recNum + 1 + hdrOffset; //note: recNum maps to dataArray index + 1.
        if (gridrow < me.hLines.length - 1 && gridrow >= hdrOffset)
          me.setRowBackground(gridrow);
      }
    }
  };

  /**
   * Try to place the cursor on the first input element in the row.
   * 
   * @param {Object|Array} row        An array of dom elements representing a row.
   * @returns {undefined}
   */
  function placeCursorOnRow(row) {
    for (var i = 0; i < row.length; i++) {
      var cell = row[i];
      var success = placeCursorOnCell(cell);
      if (success) return;
    }

    //In case placeCursor fails on every cell, something needs to be focused to keep pgup/pgdn 
    //keys working. The Grid doesn't see pgup/pgdn when document.body has focus. #3727.
    if (document.activeElement == document.body) {
      var activeEl = pui["getActiveContainer"]();
      activeEl.focus();
    }
  }

  /**
   * Try to focus the first supported input element in a cell. Text inputs may
   * be highlighted.
   * 
   * @param {object} cell  Cell dom in the grid.
   * @returns {boolean}    Returns true if element was found and focused. False otherwise.
   */
  function placeCursorOnCell(cell) {
    if (cell == null) return false;
    var inputBox = cell.firstChild;
    var found = false;
    while (inputBox != null) {

      if (inputBox.tagName == "INPUT" || inputBox.tagName == "TEXTAREA" || inputBox.tagName == "SELECT" || inputBox.comboBoxWidget != null || inputBox.floatingPlaceholder != null) {

        if (inputBox.style.visibility != "hidden" && inputBox.style.display != "none") {

          found = true;
          break;

        }

      }
      inputBox = inputBox.nextSibling;

    }
    if (!found) return false;
    if (inputBox.comboBoxWidget != null) inputBox = inputBox.comboBoxWidget.getBox();
    if (inputBox.floatingPlaceholder != null) inputBox = inputBox.floatingPlaceholder.getBox();
    var tag = inputBox.tagName;
    if (tag != "INPUT" && tag != "TEXTAREA" && tag != "SELECT") return false;

    // Focusing a SELECT element as a result of pressing pgup/pgdn in Firefox would
    // change the value before paging, and that's a confusing UI. See Issue 2556.
    // So don't focus a SELECT in firefox. If placeCursorOnRow called us, then it
    // will try finding another input element on the row.
    if (tag == "SELECT" && pui["is_firefox"]) return false;

    try {
      inputBox.focus(); // Focus the input element; when not firefox or not a SELECT, then it's safe to focus.

      // Only INPUT and TEXTAREA have select or createTextRange methods.
      if (tag == "INPUT" || tag == "TEXTAREA") {
        if (inputBox.createTextRange != null) {
          // for IE, this makes the cursor appear - workaround for IE8 bug where the cursor just doesn't show
          if (inputBox.select != null) inputBox.select();
          var tr = inputBox.createTextRange();
          if (tr != null && tr.collapse != null && tr.select != null) {
            tr.collapse();
            tr.select();
          }
        }
        if (pui["highlight on focus"]) inputBox.select();
      }
    }
    catch (e) {}

    return true;
  }

  function setCellStyle(cell, col, styleName, propNameParm) {
    var propName = propNameParm;
    var propValue = me.cellProps[propName];
    if (propValue == null) propValue = "";
    if (propValue == "" && propName.substr(0, 7) == "header ") {
      propName = propName.substr(7);
      propValue = me.cellProps[propName];
      if (propValue == null) propValue = "";
    }
    if (pui.isBound(propValue) || pui.isTranslated(propValue)) return;
    var propValues = propValue.split(",");
    if (propValues.length > 1) {
      var index;

      // Set the properties for the correct column header for scenario
      // with hidden columns. This logic may be needed for other properties also?
      if (propNameParm === "header font color" || propNameParm === "header background")
        index = cell.columnId;
      else
        index = col;

      if (index < propValues.length) {
        propValue = propValues[index];
      }
      else {
        propValue = propValues[0];
      }
    }
    if (propValue == "") {
      if (propNameParm.substr(0, 7) == "header ") propName = propNameParm.substr(7);
      if (me.cellPropDefaults[propNameParm] != null) propValue = me.cellPropDefaults[propNameParm];
      else if (me.cellPropDefaults[propName] != null) propValue = me.cellPropDefaults[propName];
    }
    try {
      cell.style[styleName] = propValue;
    }
    catch(e) {
    }
  }

    function setCellStyles(cell, header, even, col) {
    setCellStyle(cell, col, "fontFamily", header ? "header font family" : "font family");
    setCellStyle(cell, col, "fontSize", header ? "header font size" : "font size");
    setCellStyle(cell, col, "fontStyle", header ? "header font style" : "font style");
    setCellStyle(cell, col, "fontVariant", "font variant");
    setCellStyle(cell, col, "fontWeight", header ? "header font weight" : "font weight");
    setCellStyle(cell, col, "letterSpacing", "letter spacing");
    setCellStyle(cell, col, "textAlign", header ? "header text align" : "text align");
    setCellStyle(cell, col, "textDecoration", "text decoration");
    setCellStyle(cell, col, "textTransform", "text transform");
    setCellStyle(cell, col, "wordSpacing", "word spacing");
    var useRowFontColor = (me.designMode && me.cellProps["row font color"] != null && me.cellProps["row font color"] != "" && !pui.isBound(me.cellProps["row font color"]));
    var useRowBackground = (me.designMode && me.cellProps["row background"] != null && me.cellProps["row background"] != "" && !pui.isBound(me.cellProps["row background"]));
    setCellStyle(cell, col, "color", header ? "header font color" : useRowFontColor ? "row font color" : even ? "even row font color" : "odd row font color");
    setCellStyle(cell, col, "backgroundColor", header ? "header background" : useRowBackground ? "row background" : even ? "even row background" : "odd row background");
    var cssClass = "";
    if (header) {
      var headerImage = me.cellProps["header image"];
      if (headerImage != null && headerImage != "") {
        cell.style.backgroundImage = "url('" + pui.normalizeURL(headerImage, true) + "')";
        cell.style.backgroundRepeat = "repeat-x";
      }
      else {
        cell.style.backgroundImage = "";
        cell.style.backgroundRepeat = "";
      }
      cssClass = "cell header-cell";
    }
    else {
      cell.style.backgroundImage = "";
      cell.style.backgroundRepeat = "";
      cssClass = "cell";
      if (even) cssClass += " even";
      else cssClass += " odd";
    }
    cell.className = cssClass;
  }

  this.setAllCellStyles = function () {
    for (var row = 0; row < me.cells.length; row++) {
      var header = (row == 0 && me.hasHeader);
      for (var col = 0; col < me.cells[row].length; col++) {
        var cell = me.cells[row][col];
        var even = ((row % 2) == 1);
        if (me.hasHeader) even = !even;
        setCellStyles(cell, header, even, col);
      }
      if (!me.designMode && !header) {
        me.setRowBackground(row);
      }
    }
  };

  function sizeCell(row, col) {
    var rowObj = me.cells[row];
    var last = false;
    if (me.vLines.length - 2 == col) last = true;
    if (row == 0 && me.hasHeader) last = false;
    var cell = rowObj[col];
    cell.style.top = (parseInt(me.hLines[row].style.top) - me.getStyleAsInt("top")) + "px";
    cell.style.left = (parseInt(me.vLines[col].style.left) - me.getStyleAsInt("left")) + "px";
    cell.style.height = (parseInt(me.hLines[row + 1].style.top) - parseInt(me.hLines[row].style.top)) + "px";
    var width = (parseInt(me.vLines[col + 1].style.left) - parseInt(me.vLines[col].style.left));
    if (last && (me.pagingScrollBar || me.slidingScrollBar)) {
      if (!((pui["is_touch"] && !pui["is_mouse_capable"] && !me.designMode) || pui.iPadEmulation)) {
        var oneRowOnly = ((me.hasHeader && me.cells.length == 2) || (!me.hasHeader && me.cells.length == 1));
        if (!oneRowOnly) width = width - 16; // reduce by scrollbar width
      }
    }
    if (width < 0) width = 0;
    cell.style.width = width + "px";
  };

  /**
   * Run sql on the server and return result set.
   * 
   * @param {String} sql         sql statement -- used only in backwards compat. security mode.
   * @param {Number} limit       max number of records to return - defaults to 99
   * @param {Number} start       starting record (allows for paging) - defaults to 1
   * @param {Function} callback  callback function; usually receiveData.
   * @param {Boolean} total      optional total flag -- when true the server will return total record count on response object. 
   * @param {String} customURL   optional custom url to process the request (overrides the standard process)
   * @param {Boolean} cache      True when pui.sqlcache should be used.
   * @returns {undefined|response.results|pui.sqlcache.results}
   */
  function runSQL(sql, limit, start, callback, total, customURL, cache) {
    if (limit == null) limit = 99;
    if (start == null) start = 1;
    var pstring = null;
    if (pui["secLevel"] > 0) {
      // Setup parameters that are needed now for sqlcache comparison and later for postData.
      pstring = pui.getSQLParams(me["dataProps"]);

      //  filter logic when loading data from server
      //  need to include this logic when exporting data also
      me.filterString = "";   // format here and then pass to export function

      if (me.isFiltered() && me["dataProps"]["load all rows"] != "true") {
        var headerRow = me.cells[0];
        // Look in each column for filter text.
        var filtNum = 0; //CGI looks for fltrcol 0 to 9 and stops when one isn't found.
        for (var i = 0; i < headerRow.length; i++) {
          var headerCell = headerRow[i];
          if (headerCell.columnId >= 0 && headerCell.filterText != null) {
            me.filterString += "&fltrcol" + String(filtNum) + "=" + (headerCell.columnId + 1);
            me.filterString += me.prepareFilterText(String(filtNum), headerCell.filterText);
            pstring += me.filterString;
            filtNum++;
          }
        }
      }

      // Add parameter for Find, if it is set.
      if (findColumn != null && findText != null) {
        pstring += "&findcol=" + findColumn;
        pstring += "&findval=" + encodeURIComponent(findText);
      }

      // Allow dataURL grids to sort. 
      if (me["dataProps"]["data url"] != null && me["dataProps"]["data url"] != "" && me.sortBy != null) {
        pstring += "&order=" + me.sortBy;
      }

    } //done creating sql query parameters.

    if (cache) {
      if (pui.sqlcache == null) pui.sqlcache = {};
      if (pui.sqlcache[start] == null) pui.sqlcache[start] = {};
      if (pui.sqlcache[start].sql === sql &&
        pui.sqlcache[start].pstring === pstring &&
        pui.sqlcache[start].limit === limit &&
        pui.sqlcache[start].customURL === customURL) {
          me["unMask"](); 
          if (callback != null) {
            callback(pui.sqlcache[start].results, pui.sqlcache[start].totalRecs, pui.sqlcache[start]["matchRow"]);
            return;
          }
          else {
            return pui.sqlcache.results;
          }
      }
    }
    var returnVal = null;
    var url = getProgramURL("PUI0009102.PGM");
    if (customURL) url = pui.appendAuth(customURL);
    var req = new pui.Ajax(url);
    req["method"] = "post";
    req["async"] = true;
    if (callback == null) req["async"] = false;
    if (pui.pjs_session_id) req["postData"] = "AUTH=" + pui.pjs_session_id;
    else req["postData"] = "AUTH=" + pui.appJob.auth;
    if (pui["secLevel"] > 0) {

      req["postData"] += "&q=" + encodeURIComponent(pui.getSQLVarName(me.tableDiv));

      var orderBy = me["dataProps"]["order by"];
      if (me.sortBy != null) orderBy = me.sortBy;
      if (orderBy && orderBy != "") {

        req["postData"] += "&order=" + orderBy;

      }
      else if (getDBDriver() == "mssql") {

        // Order by is required for OFFSET/FETCH.
        // This should give the same sort as if order by was not used.
        req["postData"] += "&order=(select null)";

      }

      // Add parameters. pstring is not null if secLevel > 0, because getSQLParams always returns a string.
      if (pstring != "") {

        req["postData"] += "&" + pstring;

      }

    }
    else {

      req["postData"] += "&q=" + pui.aes.encryptString(sql);

    }
    req["postData"] += "&limit=" + limit + "&start=" + start;
    if (total != null && total == true) req["postData"] += "&getTotal=1";
    if (pui["read db driven data as ebcdic"] !== true) req["postData"] += "&UTF8=Y";

    var fetchCounter = me["dataProps"]["allow any select statement"];
    if (fetchCounter != null && (fetchCounter == "true" || fetchCounter == true))
      req["postData"] += "&FetchCounter=Y";
    
    if (pui["isCloud"])
      req["postData"] += "&workspace_id=" + pui.cloud.ws.id;

    req["onready"] = function (req) {
      if(me["dataProps"]["load fields into widgets"] != "true"){
         me["unMask"]();
      }
      var response;
      var successful = false;
      if (me["dataProps"]["data transform function"] && req.getStatus() == 200) {
        try {
          var fn = eval("window." + me["dataProps"]["data transform function"]);
          response = fn(req.getResponseText());
        }         
        catch(e) {
          pui.logException(e);
        }
      }
      else {
        response = checkAjaxResponse(req, "Run SQL SELECT Query");
      }
      if (response) {
        if (cache) {
          if (pui.sqlcache[start] == null) pui.sqlcache[start] = {};
          pui.sqlcache[start].sql = sql;
          pui.sqlcache[start].limit = limit;
          pui.sqlcache[start].start = start;
          pui.sqlcache[start].customURL = customURL;
          pui.sqlcache[start].results = response.results;
          pui.sqlcache[start].totalRecs = response.totalRecs;
          pui.sqlcache[start].pstring = pstring;
          pui.sqlcache[start]["matchRow"] = response["matchRow"];
        }
        if (callback != null) {
          callback(response.results, response.totalRecs, response["matchRow"]);
        }
        else returnVal = response.results;
        successful = true;
      }
      if (ondbload) pui.executeDatabaseLoadEvent(ondbload, successful, me.tableDiv.id);
      me.waitingOnRequest = false; //Allow filter changes and clicks to sort columns.
    };
    me.waitingOnRequest = true; //Ignore filter changes and clicks to sort columns.
    req.send();
    if (callback == null) return returnVal;
  }

  this.sizeAllCells = function () {
    for (var row = 0; row < me.cells.length; row++) {
      for (var col = 0; col < me.cells[row].length; col++) {
        sizeCell(row, col);
      }
    }
    if (columnSignature == null) {
      columnSignature = me.getColumnWidths();
    }
  };

  this.isDataGrid = function () {
    if ((me["dataProps"]["custom sql"] != null && me["dataProps"]["custom sql"] != "") ||
      (me["dataProps"]["data url"] != null && me["dataProps"]["data url"] != "") ||
      (me["dataProps"]["database file"] != null && me["dataProps"]["database file"] != "")) {
      return true;
    }
    else {
      return false;
    }
  };

  this.setBorderColor = function (borderColor) {
    if (!borderColor) borderColor = me.borderColor;
    for (var i = 0; i < me.vLines.length; i++) {
      me.vLines[i].style.borderRightColor = borderColor;
    }
    for (var i = 0; i < me.hLines.length; i++) {
      me.hLines[i].style.borderTopColor = borderColor;
    }
    me.borderColor = borderColor;
  };

  this.setBorderWidth = function (borderWidth) {
    if (borderWidth == null) borderWidth = me.borderWidth;
    borderWidth = parseInt(borderWidth);
    if (isNaN(borderWidth) || (borderWidth < minBWidth && me.designMode)) borderWidth = minBWidth;
    for (var i = 0; i < me.vLines.length; i++) {
      me.vLines[i].style.borderRightWidth = borderWidth + "px";
    }
    for (var i = 0; i < me.hLines.length; i++) {
      me.hLines[i].style.borderTopWidth = borderWidth + "px";
    }
    me.borderWidth = borderWidth;
    setLineWidths();
    me.setScrollBar();
  };

  this["hide"] = function () {
    me.doThisToTableDivs(function (domObj) {
      domObj.style.visibility = "hidden";
    });
    if (me.scrollbarObj != null) me.scrollbarObj.hide();
    if (me.pagingBar != null) me.pagingBar.hide();
  };

  this.hideSubfile = function () {
    me.subfileHidden = true;
    if (!me.hasHeader) {
      me['hide']();
      return;
    }
    for (var i = 1; i < me.cells.length; i++) {
      for (var j = 0; j < me.cells[i].length; j++) {
        me.cells[i][j].style.display = "none";
      }
    }
    for (var i = 2; i < me.hLines.length; i++) {
      me.hLines[i].style.display = "none";
    }
    for (var i = 0; i < me.vLines.length; i++) {
      me.vLines[i].style.display = "none";
    }
    if (me.scrollbarObj != null) {
      me.scrollbarObj.hide();
    }
    if (me.pagingBar != null) me.pagingBar.hide();
  };

  this["show"] = function () {
    me.doThisToTableDivs(function (domObj) {
      domObj.style.visibility = "";
    });
    var isSelected = false;
    var itm = me.tableDiv.designItem;
    if (itm != null) {
      var selection = itm.designer.selection;
      if (selection.resizers.length == 1 && selection.resizers[0].designItem == itm) isSelected = true;
    }
    if (!isSelected && me.tableDiv.customUnselect) me.tableDiv.customUnselect();
    me.setScrollBar();
  };

  this.addColumn = function (colId) {
    var n = me.vLines.length;
    var vLine = document.createElement("div");
    vLine.className = "grid-vline";
    if (me.mainClass != "") {

      vLine.className += " " + me.mainClass + "-vline";

    }
    if (!me.designMode) {
      vLine.relatedGrid = me;
    }
    vLine.style.position = "absolute";
    var x = parseInt(me.tableDiv.style.left);
    if (n > 0) {
      x = parseInt(me.vLines[n - 1].style.left) + me.defaultColumnWidth;
    }
    vLine.style.left = x + "px";
    vLine.style.top = me.tableDiv.style.top;
    var height = 0;
    if (me.hLines.length > 0) {
      height = parseInt(me.hLines[me.hLines.length - 1].style.top) - parseInt(me.tableDiv.style.top);
    }
    vLine.style.height = height + "px";
    var bwidth = me.borderWidth;
    if (bwidth === null || (bwidth < minBWidth && me.designMode)) bwidth = minBWidth;
    vLine.style.borderRightStyle = "solid";
    vLine.style.borderRightWidth = bwidth + "px";
    vLine.style.borderRightColor = me.borderColor;
    vLine.style.fontSize = "0px";
    vLine.style.padding = "0px";
    vLine.style.zIndex = me.vBorderZIndex;
    // disable context menu when right clicked on vLine
    vLine.oncontextmenu = function(e) { return false; };
    me.container.appendChild(vLine);
    me.vLines[n] = vLine;
    setLineWidths();
    lineDesign(me.vLines, n, true);
    if (n > 0) {
      var columnId = n - 1;
      for (var row = 1; row < me.hLines.length; row++) {
        var cell = makeCell(row - 1, columnId);
        // Set the newly added column's id to the parameter id if hideable columns option. 
        if (me.hidableColumns && (colId || colId == 0)) cell.columnId = colId;
        else cell.columnId = columnId;
        cellDesign(cell);
      }
    }
    positionIcons();
    me.setScrollBar();
  };

  /**
   * Given the original, design-time, columnId of a column, return its current column index.
   * @param {Number} columnId
   * @returns {Number}  Returns -1 if column not found.
   */
  function getCurrentColumnFromId(columnId) {
    var col = -1;
    if (me.cells != null && me.cells[0] != null) {
      for (var i = 0; i < me.cells[0].length; i++) {
        if (me.cells[0][i] != null && me.cells[0][i].columnId == columnId) {
          col = me.cells[0][i].col;
          break;
        }
      }
    }
    return col;
  }

  /**
   * API to remove a column; or, if "hide columns option" is true, then call the hide column method, which must do some work before 
   * removing the column to avoid breaking things in the grid. #6740.
   * @param {Number} columnId  The original columnId, as positioned in design-time.
   */
  this["removeColumn"] = function (columnId) {
    if (me.hidableColumns){
      me['hideColumn'](columnId);
    }
    else {
      me.rmvColumn(columnId);
    }
  };
  
  /**
   * Remove a column.
   * @param {Number} columnId    The original columnId, as positioned in design-time.
   */
  this.rmvColumn = function (columnId){
    var lastCol = me.vLines.length - 2;
    if (lastCol < 1) {
      pui.alert(pui["getLanguageText"]("runtimeMsg", "cannot rmv last col"));
      return;
    }
    if (!me.designMode) {
      // Find the current position of the columnId. (User may have moved it.)
      var col = getCurrentColumnFromId(columnId);
      if (col < 0) {
        pui.alert(pui["getLanguageText"]("runtimeMsg", "cannot find col"));
        return;
      }
    } else {
      var col = columnId; //Designer must use cell.col not cell.columnId.
    }

    me.moveColumn(col, me.cells[0].length); // move column to end
    me.removeLastColumn();
    me.doExpandToLayout();
    me.selectMe();
  };

  this.removeLastColumn = function () {
    var n = me.vLines.length;
    if (n <= 0) return;
    n = n - 1;
    me.vLines[n].parentNode.removeChild(me.vLines[n]);
    me.vLines[n] = null;
    me.vLines.splice(n, 1);
    if (n > 0) {
      for (var row = 0; row < me.cells.length; row++) {
        me.cells[row][n - 1].parentNode.removeChild(me.cells[row][n - 1]);
        me.cells[row][n - 1] = null;
        me.cells[row].splice(n - 1, 1);
      }
    }
    setLineWidths();
    positionIcons();
    me.setScrollBar();
  };
  // Pass the optional colObj for hideable columns
  this.moveColumn = function (from, to, colObj) {
    for (var row = 0; row < me.cells.length; row++) {
      var cell;
      var cellBeingMoved = cell = me.cells[row][from];

      // Rearrange dom cells so tabbing is correct
      if (me.cells[row].length > to) {
    	  var moveBefore = me.cells[row][to];
          if (cellBeingMoved.parentNode && moveBefore && moveBefore.parentNode) 
            cellBeingMoved.parentNode.insertBefore(cellBeingMoved, moveBefore);
      } else {
    	  var moveAfter = me.cells[row][me.cells[row].length-1];
          if (cellBeingMoved.parentNode && moveBefore && moveBefore.parentNode)
    	    cellBeingMoved.parentNode.insertBefore(cellBeingMoved, moveAfter.nextSibling);
      }

      me.cells[row].splice(to, 0, cell); // insert a copy of the cell into the to position
      var adjustedFrom = from;
      if (to <= from) adjustedFrom++; // from has moved - we inserted something infront of it 
      me.cells[row].splice(adjustedFrom, 1); // remove the from cell

      // adjust col numbers on cells
      for (var col = 0; col < me.cells[row].length; col++) {
        cell = me.cells[row][col];
        cell.col = col;
      }

    }
    // adjust vertical lines
    for (var i = 1; i < me.vLines.length - 1; i++) {
      me.vLines[i].style.left = (pui.safeParseInt(me.vLines[i - 1].style.left) + pui.safeParseInt(me.cells[0][i - 1].style.width)) + "px";
    }
    if (me.designMode) {
      // adjust grid properties
      var changed = false;
      var itm = me.tableDiv.designItem;
      var jsonAvailable = (JSON != null && typeof JSON.parse == "function" && typeof JSON.stringify == "function");
      function movePropertyParts(propName) {
        var value = itm.properties[propName];
        if (value == null || value == "" || pui.isBound(value)) return;
        var isTranslated = pui.isTranslated(value);
        if (isTranslated) {
          if (!jsonAvailable) return;
          var arr = JSON.parse(value.designValue);
        } else {
          var arr = value.split(",");
        }

        if (arr.length == 1 && propName != "column headings" && propName != "column widths") {
          // One value is applicable to all columns
          return;
        }
        var numCols = me.cells[0].length;
        while (arr.length > numCols) {
          arr.pop();
          if (isTranslated) value["translations"].pop();
        }
        while (arr.length < numCols) {
          arr.push("");
          if (isTranslated) value["translations"].push(0);
        }
        arr.splice(to, 0, arr[from]); // copy
        if (isTranslated) value["translations"].splice(to, 0, value["translations"][from]); // copy translation
        var adjustedFrom = from;
        if (to <= from) adjustedFrom++; // from has moved - we inserted something infront of it 
        arr.splice(adjustedFrom, 1); // remove the from entry
        if (isTranslated) value["translations"].splice(adjustedFrom, 1); // remove the from translation entry.
        var newValue;
        var different;
        if (isTranslated) {
          newValue = JSON.stringify(arr);
          different = (value.designValue != newValue);
          if (different) {
            // newValue gets the re-arranged comma-separated string and rearranged translations array.
            value.designValue = newValue;
            newValue = value;
          }
        } else {
          newValue = arr.join(",");
          different = (value != newValue);
        }
        if (different) {
          itm.properties[propName] = newValue;
          itm.propertiesChanged[propName] = true;
          itm.changed = true;
          itm.designer.changedScreens[itm.designer.currentScreen.screenId] = true;
          changed = true;
        }
      }
      movePropertyParts("font family");
      movePropertyParts("font size");
      movePropertyParts("font style");
      movePropertyParts("font weight");
      movePropertyParts("letter spacing");
      movePropertyParts("text align");
      movePropertyParts("text decoration");
      movePropertyParts("text transform");
      movePropertyParts("word spacing");
      movePropertyParts("header font family");
      movePropertyParts("header font size");
      movePropertyParts("header font style");
      movePropertyParts("header font weight");
      movePropertyParts("header text align");
      movePropertyParts("header font color");
      movePropertyParts("header background");
      movePropertyParts("column headings");
      var columnHeadings = me.tableDiv.designItem.properties["column headings"];
      if (pui.isTranslated(columnHeadings) && jsonAvailable) {
        me.columnHeadings = JSON.parse(columnHeadings.designValue);
      } else {
        if (columnHeadings == null || typeof columnHeadings != "string") columnHeadings = "";
        me.columnHeadings = columnHeadings.split(",");
      }
      movePropertyParts("odd row font color");
      movePropertyParts("odd row background");
      movePropertyParts("even row font color");
      movePropertyParts("even row background");
      movePropertyParts("row font color");
      movePropertyParts("row background");
      movePropertyParts("column widths");
      if (changed) {
        itm.designer.makeDirty();
        itm.designer.propWindow.refresh();
        if (context == 'dspf') pui.ide.refreshRibbon();  //Enable Save button.
      }
    } //end if me.designMode.
    me.sizeAllCells();
    if (!me.designMode) {
      if (me.isDataGrid()) {
        var fields = me["dataProps"]["database fields"];
        if (fields != null && fields != "") {
          fields = fields.split(",");
          fields.splice(to, 0, fields[from]); // insert from field into the to position
          var adjustedFrom = from;
          if (to <= from) adjustedFrom++; // from has moved - we inserted something infront of it 
          fields.splice(adjustedFrom, 1); // remove the from cell
          me["dataProps"]["database fields"] = fields.join(",");
        }
      }
      //else {
      if(me.runtimeChildren.length > 0) {
        for (var i = 0; i < me.runtimeChildren.length; i++) {
          var itm = me.runtimeChildren[i];
          var col = Number(itm["column"]);
          var newCol = col;
          if (me.hidableColumns && colObj) {
            var colId = colObj["columnId"];
            var cellId = itm['columnId'];
            // Get the column Id of the and check if it is equal to runtimeChildren's column Id. 
            // If it is move the the elements to the 'to' column.
            // If any column was at the 'to' to 'from' columns, move them to the right one.
            // The rest run our normal routine.
            if (cellId == colId) {
              newCol = to;
            } else {
              if (col >= to && col < from + 1) newCol = newCol + 1;
              else newCol = handleColCheck(to, from, col, newCol);
            }
          } else {
            newCol = handleColCheck(to, from, col, newCol);
          }
          if (col != newCol) itm["column"] = String(newCol);
        }
      }

      me.columnHeadings.splice(to, 0, me.columnHeadings[from]); // insert from column heading into the to position
      var adjustedFrom = from;
      if (to <= from) adjustedFrom++; // from has moved - we inserted something infront of it 
      me.columnHeadings.splice(adjustedFrom, 1); // remove the from cell

      me["alignColumnTotals"]();
    }
    function handleColCheck(to, from, col, newCol) {
      if (to > from) {
        if (col > from && col < to) newCol = newCol - 1;
        if (col == from) newCol = to - 1;
      }
      if (from > to) {
        if (col >= to && col < from) newCol = newCol + 1;
        if (col == from) newCol = to;
      }
      return newCol;
    }
  };

  this.addRow = function () {
    var n = me.hLines.length;
    var hLine = document.createElement("div");
    hLine.className = "grid-hline";
    if (me.mainClass != "") {

      hLine.className += " " + me.mainClass + "-hline";

    }
    if (!me.designMode) {
      hLine.relatedGrid = me;
    }
    hLine.style.position = "absolute";
    hLine.style.left = me.tableDiv.style.left;
    var y = parseInt(me.tableDiv.style.top);
    if (n > 0) {
      var height = me.rowHeight;
      if (n == 1 && me.hasHeader) height = me.headerHeight;
      y = parseInt(me.hLines[n - 1].style.top) + height;
    }
    hLine.style.top = y + "px";
    var width = 0;
    if (me.vLines.length > 0) {
      var bwidth = me.borderWidth;
      //if (bwidth < minBWidth && me.designMode) bwidth = minBWidth;   // this is done later in the lineDesign() function
      width = parseInt(me.vLines[me.vLines.length - 1].style.left) - parseInt(me.tableDiv.style.left) + bwidth;
    }
    hLine.style.width = width + "px";
    var bwidth = me.borderWidth;
    if (bwidth < minBWidth && me.designMode) bwidth = minBWidth;
    if (bwidth !== null) hLine.style.borderTopWidth = bwidth + "px";
    hLine.style.zIndex = me.hBorderZIndex;
    if (me.tableDiv.style.visibility == "hidden") hLine.style.visibility = "hidden";
    // disable context menu when right clicked on hLine
    hLine.oncontextmenu = function(e) { return false; };
    me.container.appendChild(hLine);
    me.hLines[n] = hLine;
    setLineHeights();
    lineDesign(me.hLines, n, false);
    if (n > 0) {
      for (var col = 1; col < me.vLines.length; col++) {
        var columnId = col - 1;
        var cell = makeCell(n - 1, columnId);
        cell.columnId = columnId;
        cellDesign(cell);
      }
    }
    positionIcons();
    me.setScrollBar();
  };

  /**
   * Remove DOM elements located in the last row, including the DIV and horizontal line element.
   */
  this.removeLastRowCells = function () {
    var n = me.hLines.length;
    if (n <= 0) return;
    n = n - 1;
    me.hLines[n].parentNode.removeChild(me.hLines[n]);
    me.hLines[n] = null;
    me.hLines.splice(n, 1);

    var row = me.cells.length - 1;
    if (row >= 0) {
      var colCount = me.cells[row].length;
      for (var col = colCount - 1; col >= 0; col = col - 1) {
        me.cells[row][col].parentNode.removeChild(me.cells[row][col]);
        me.cells[row][col] = null;
        me.cells[row].splice(col, 1);
      }
      me.cells.splice(row, 1);
    }
    setLineHeights();
    positionIcons();
    me.setScrollBar();
  };

  this["alignColumnTotals"] = function () {
    var rowNum = 0;
    if (me.hasHeader) rowNum = 1;
    var row = me.cells[rowNum];
    for (var i = 0; i < row.length; i++) {
      var cell = row[i];
      var children = cell.children;
      for (var j = 0; j < children.length; j++) {
        var child = children[j];
        var id = child.id;
        id = id.split(".")[0] + "_total";
        var totalObj = getObj(id);
        if (totalObj != null) {
          var left = parseInt(me.tableDiv.style.left) + parseInt(cell.style.left) + parseInt(child.style.left);
          totalObj.style.left = left + "px";
        }
      }
    }
  };

  this["scrollToRow"] = function (row) {
    row = parseInt(row, 10);
    if (isNaN(row)) {
      //me.recNum cannot be set to a string; otherwise, the grid will crash.
      //If setScrollTopToRow() passes a string, then the grid will crash after slidingScollBar's doScroll(). #3529.
      console.log("scrollToRow cannot parseInt:", row);
      return;
    }
    // if the record number is less than 1, set it back to 1. #4276.
    if (row < 1) row = 1;
    if (me.slidingScrollBar) {
      me.scrollbarObj.setScrollTopToRow(row);
    }
    else {
      me.recNum = row;
      me.getData();
    }
    
    return me["getRRN"](row);
  };

  this["setNumberOfRows"] = function (numRows) {
    me.setProperty("number of rows", String(numRows));
    me.sizeAllCells();
    me.setAllCellStyles();
    if (!me.resizeOnly) me.getData();
  };

  this["render"] = function () {
    me.sizeAllCells();
    me.setAllCellStyles();
    me.setHeadings();
    if (me.subfileHidden) {

      me.hideSubfile();

    }
  };

  this["refresh"] = function () {
    me.recNum = 1;
    me.totalRecs = null;
    me.forceDataArray = false;
    if (me.slidingScrollBar) {
      me.scrollbarObj.totalRows = me.totalRecs;
    }
    pui.sqlcache = null; //Clear the cache to force requests for new data.
    me.getData();
  };

  this["getRecordCount"] = function () {
    var count;
    if (me.isDataGrid()) {
      count = me.totalRecs;
    }
    else {
      count = me.dataArray.length;
    }
    if (count == null) count = 0;
    return count;
  };

  this["expandTreeLevel"] = function (rrn) {
    var node = me.treeLevelData[rrn-1].node;
    me.gridTree.showChildren(node);
    me.refreshGridTree(node);
  };

  this["collapseTreeLevel"] = function (rrn) {
    var node = me.treeLevelData[rrn-1].node;
    me.gridTree.hideChildren(node);
    me.refreshGridTree(node);
  };

  this["toggleTreeLevel"] = function (rrn) {
    var node = me.treeLevelData[rrn-1].node;
    me.gridTree.toggleChildren(node);
    me.refreshGridTree(node);
  }

  this.refreshGridTree = function (affectedNode) {

    // New way to handle grid tree:
    // Use a REAL model tree stored in me.gridTree.
    // Call me.gridTree.hideChildren() or me.gridTree.showChilden() or me.gridTree.toggleChildren(),
    // which will expand/collapse the nodes in the model tree.
    // Use the model tree to refresh the data in treeLevelData[].
    // Then use data in treeLevelData[] to call showShow() or hideRow() to show/hide each affected row in the grid.
    // Note that me.gridTree is a real tree structure; whereas treeLevelData[] is just an array.
    // To improve performance, each element of array treeLevelData[] contains the corresponding object 
    // "node" in the tree me.gridTree, so that we don't have to do lookup when needed.

    if (affectedNode === undefined || affectedNode === null) {      // handle whole tree
      var fromIndex = 0;
      var toIndex = me.treeLevelData.length;
    } else {                                                        // handle affected node and its descendants only
      fromIndex = parseInt(affectedNode.data) - 1                   // node.data is the RRN of the affected node
      toIndex = me.gridTree.getMaxRRN(affectedNode);                // highest RRN of node's descendants; do NOT use -1 here
    }

    for (var i = fromIndex; i < toIndex; i++) {                     // handle affected range only    
      var rrn = (i + 1);
      var node = me.treeLevelData[i].node;
      if (node.showRow)                                   
        me.handleHideRow(rrn, false, false);                        // call showRow() but does NOT call getData()
      else                                                
        me.handleHideRow(rrn, true, false);                         // call hideRow() but does NOT call getData()
      me.treeLevelData[i].treeLevelCollapsed = (node.currentState === "collapsed")? true: false;
    }
    
    me.getData();
    
  };

  this.getTreeLevelColumnId =  function () {
    // if property "tree level column" is specified, then use that; otherwise use column 0
    if (me.treeLevelColumnId !== null)
      return me.treeLevelColumnId;
    me.treeLevelColumnId = 0;         // default
    for (var i = 0; i < me.runtimeChildren.length; i++) {
      if (me.runtimeChildren[i]["value"]["fieldName"].toUpperCase() === me.treeLevelField.toUpperCase()) {   
        me.treeLevelColumnId = me.runtimeChildren[i]["columnId"];
        break;    
      }
    }
    return me.treeLevelColumnId;
  };
  
  this["clear"] = function(refresh) {
    me.dataArray = [];
    for (var i = 0; i < me.runtimeChildren.length; i++) {
      me.runtimeChildren[i].domEls = [];
    }
    if (refresh) me.refresh();
  };
  
  function buildEntryFromObject(record) {
    var entry = [];
    for (var i = 0; i < me.fieldNames.length; i++) {
      var fieldName = me.fieldNames[i];
      var value = record[fieldName];
      if (!value) value = "";
      entry.push(value);
    }
    return entry;
  }
  
  this["push"] = function(record, refresh) {    
    var entry = buildEntryFromObject(record);
    me.dataArray.push(entry);
    if (refresh) me.refresh();
  };
  
  this["addRecords"] = function(records, refresh) {
    for (var i = 0; i < records.length; i++) {
      var record = records[i];
      me["push"](record);
    }
    if (refresh) me.refresh();
  };

  this["replaceRecords"] = function(records, refresh) {
    me["clear"]();
    me["addRecords"](records);
    if (refresh) me.refresh();
  };
  
  this["splice"] = function(start, deleteCount) {
    // Adjust start assumming record number (not index) is passed in
    start = start - 1;    

    // Splice data array
    var refresh = false;
    var args = [start, deleteCount];
    var args2 = [start, deleteCount];
    for (var i = 2; i < arguments.length; i++) {
      var arg = arguments[i];
      if (typeof arg === "boolean" && i + 1 === arguments.length) refresh = true;
      if (typeof arg !== "object") continue;      
      var entry = buildEntryFromObject(arg);
      args.push(entry);
      args2.push(undefined);
    }
    me.dataArray.splice.apply(me.dataArray, args);    

    // Splice domEls
    for (var i = 0; i < me.runtimeChildren.length; i++) {
      var domEls = me.runtimeChildren[i].domEls;
      domEls.splice.apply(domEls, args2);
    }
    
    if (refresh) me.refresh();
  };

  this["insertRow"] = function(start) {
    var refresh = false;
    var args = [start, 0];
    for (var i = 1; i < arguments.length; i++) {
      var arg = arguments[i];
      if (typeof arg === "boolean" && i + 1 === arguments.length) refresh = true;
      if (typeof arg !== "object") continue;
      args.push(arg);
    }
    me["splice"].apply(me, args);
  };

  this["unshiftRow"] = function() {
    var refresh = false;
    var args = [1, 0];
    for (var i = 0; i < arguments.length; i++) {
      var arg = arguments[i];
      if (typeof arg === "boolean" && i + 1 === arguments.length) refresh = true;
      if (typeof arg !== "object") continue;
      args.push(arg);
    }
    me["splice"].apply(me, args);
    if (refresh) me.refresh();
  };

  this["removeRow"] = function(row, refresh) {
    me["splice"](row, 1);
    if (refresh) me.refresh();
  };

  this.handleHideRow = function(rrn, status, callGetData) {
    
    var row = me.getRowInDataArray(me.dataArray, rrn);
    if(row == null) return;
    var record = me.dataArray[row - 1];
    if (record == null) return;
    //if (record.hideRow != null && record.hideRow === status) return;
    
    record.hideRow = status;

    // rebuild me.visibleDataArray without any hidden rows
    me.rowsHidden = 0;
    me.visibleDataArray = [];
    for (var i = 0; i < me.dataArray.length; i++) {
      var record = me.dataArray[i];
      if (record.subfileRow == null) record.subfileRow = i + 1;
      me.setFilteredOut(record);
      if (!record.filteredOut && !record.hideRow) {
        me.visibleDataArray.push(record);
      }
      if (record.hideRow) {
        me.rowsHidden++;
      }
    }
  
    if (!me.sorted) {
      // When the grid is not sorted there is no mapping from DOM row to dataArray index, so set the mapping; some operations require it. #6391.
      for (var i = 0; i < me.dataArray.length; i++) {
        if (me.dataArray[i].subfileRow == null) me.dataArray[i].subfileRow = i + 1;
      }
    }
    
    if (callGetData) me.getData();

    pui.modified = true;
    if (me.hiddenField != null) {
      if (record.hiddenFieldInfo == null) {
        record.hiddenFieldInfo = {
          type: "grid hidden field",
          subfileRow: rrn,
          formattingInfo: me.hiddenField
        };
        var qualField = pui.formatUpper(me.recordFormatName) + "." + pui.fieldUpper(me.hiddenField.fieldName) + "." + rrn;
        if (pui.responseElements[qualField] == null) {
          pui.responseElements[qualField] = [];
          pui.responseElements[qualField].push(record.hiddenFieldInfo);
        }
      }
      record.hiddenFieldInfo.modified = true;
      record.hiddenFieldInfo.value = (status) ? "1" : "0";
      if (record.hiddenFieldInfo.responseValue) record.hiddenFieldInfo.responseValue = record.hiddenFieldInfo.value;
    }

  };

  this["hideRow"] = function(rrn) {
    me.handleHideRow(rrn, true, true);
  };

  this["showRow"] = function(rrn) {
    me.handleHideRow(rrn, false, true);
  };
  
  this["clearState"] = function (part) {

    var stg = loadState();
    if (stg != null) {

      if (typeof part == "string") {

        part = part.toLowerCase();
        for (var i in stg) {

          if (i.toLowerCase() == part) {

            delete stg[i];
            saveState(stg);
            break;

          }
        }
        
        if (me.hidableColumns){
          // If hidable columns is true, then the column order is also in hidableColState and must be reset. #5262.
          if (part === 'colsequence' && stg['hidableColState'] && stg['hidableColState']['cols']){
            if (stg['colWidths'] instanceof Array){
              var origwidths = stg['colWidths'].map(function(col){ return col; });  //get copy of current widths.
              stg['colWidths'] = [];
            }

            // The order of hidableColState.cols is the unmoved sequence; restore sequence and save the correct widths.
            var sequence = 0;
            for (var j=0; j < stg['hidableColState']['cols'].length; j++){
              var col = stg['hidableColState']['cols'][j];
              if (col['savedColumn'] != null && col['savedColumn'] >= 0 && col['showing'] ){
                if (origwidths) stg['colWidths'].push( origwidths[ col['savedColumn'] ] );

                col['savedColumn'] = sequence++;
              }
            }
          }
          else if (part == 'hidablecolstate'){
            delete stg['colWidths'];    //Reset saved widths to avoid using the wrong width.
          }
          
          saveState(stg);
        }

      }
      else {
        me.storedState = "{}";  //Ensure that settings in the server's PUISTATEP file are cleared. #6778.
        if(sessionState == true){
          try{ delete sessionStorage[me.storageKey]; }catch(exc){}
        }
        else if(programState == true){
          try{ delete pui.programStorage[me.storageKey]; }catch(exc){}
        }        
        else{
          try{ delete localStorage[me.storageKey]; }catch(exc){}
        }

      }

    }

  };

  this["getSelectedCount"] = function () {

    var count = 0;

    if (me.selectionEnabled && me.selectionField) {

      var idx;
      for (var i = 0; i < me.fieldNames.length; i++) {

        if (pui.fieldUpper(me.selectionField.fieldName) == me.fieldNames[i]) {

          idx = i;
          break;

        }

      }

      if (idx != null && idx >= 0) {

        for (var i = 0; i < me.dataArray.length; i++) {

          if (me.dataArray[i].selection && me.dataArray[i].selection.modified) {

            if (me.dataArray[i].selected) count++;

          }
          else if (me.dataArray[i][idx] == me.selectionValue) count++;

        }

      }

    }

    return count;

  };

  this.hideContextMenu = function () {
    if (!me.contextMenuId) return;
    var menu = getObj(me.contextMenuId);
    if (!menu) return;
    if (menu.showing) return;
    if (context == "genie" && me.designMode) return;

    menu.style.visibility = "hidden";
    menu.style.display = "none";
  };

  this.getFieldNameFromColumnIndex = function (columnIndex, fieldLength) {
    if (columnIndex == null || isNaN(columnIndex)) return null;
    for (var i = 0; i < me.runtimeChildren.length; i++) {
      var itm = me.runtimeChildren[i];
      var val = itm["value"];
      if (itm["field type"] == "html container") val = itm["html"];
      if (val != null && typeof val == "object" && val["fieldName"] != null) {
        var col = Number(itm["column"]);
        if (col == columnIndex) {
          // For #7062, to fix the bug but avoid breaking current code (that works around the bug) as much as possible:
          // 1. Look at the field bound to the "field name sort response" or "initial sort field".
          // 2. If it is <= 10 characters long, return the "fieldName" property.
          // 3. If it is > 10, return the "longName" if it exists (but fall back to "fieldName" if it does not).
          if (fieldLength <= 10) {
            return val["fieldName"].toUpperCase();
          } else {
            if (val["longName"] !== undefined)
              return val["longName"].toUpperCase();
            else
              return val["fieldName"].toUpperCase();
          }
        }
      }
    }
    return null;
  };

  this.getColumnIndexFromFieldName = function (fieldName) {
    // Note: customer may pass the short field name or long field name for "initial sort field"
    var fieldNameUpper = pui.fieldUpper(fieldName);
    for (var i = 0; i < me.runtimeChildren.length; i++) {
      var itm = me.runtimeChildren[i];
      var val = itm["value"];
      if (itm["field type"] == "html container") val = itm["html"];
      if (val != null && typeof val == "object" && ((val["fieldName"] != null && pui.fieldUpper(val["fieldName"]) == fieldNameUpper) || 
                                                    (val["longName"]  != null && pui.fieldUpper(val["longName"])  == fieldNameUpper)    )) {
        var columnIndex = Number(itm["column"]);
        if (columnIndex != null && !isNaN(columnIndex)) return columnIndex;
      }
    }
    return null;
  };

  this["getColumnIdFromFieldName"] = function (fieldName) {
    // Note: customer may pass the short field name or long field name
    var fieldNameUpper = pui.fieldUpper(fieldName);
    for (var i = 0; i < me.runtimeChildren.length; i++) {
      var itm = me.runtimeChildren[i];
      var val = itm["value"];
      if (itm["field type"] == "html container") val = itm["html"];
      if (val != null && typeof val == "object" && ((val["fieldName"] != null && pui.fieldUpper(val["fieldName"]) == fieldNameUpper) || 
                                                    (val["longName"]  != null && pui.fieldUpper(val["longName"])  == fieldNameUpper)    )) {
        var columnId = itm["columnId"];
        if (columnId != null && !isNaN(columnId)) return columnId;
      }
    }
    return null;
  };

  /**
   * Set headerCell.searchIndexes[] to be an array of integers that map to 
   * fields in me.dataArray[][]. Also put references to runtimeChildren[].value
   * into headerCell.pui.formats[]. The first value in .searchIndexes matches
   * the first object in .pui.formats, 2nd to 2nd, etc.
   * 
   * Called by startFind, find, setFilter, startFilter.
   * 
   * @param {Object|Element} headerCell    A DOM element for a column header.
   * @param {Boolean} all
   */
  this.setSearchIndexes = function (headerCell, all) {
    // dataGrids do not use client-side filtering and don't need searchIndexes, formats, or rtIdxs
    if (me.isDataGrid() && me.forceDataArray == false) return;
    if (headerCell.searchIndexes != null) return; //searchIndexes is already setup.
    else headerCell.searchIndexes = [];

    if (headerCell["pui"] == null) headerCell["pui"] = {};
    headerCell["pui"].formats = [];
    headerCell["pui"].rtIdxs = []; //Indices of me.runtimeChildren for this column.

    // Look at each runtimeChildren for any belonging to the headerCell's column.
    // We can't use headerCell.fieldName, because it only gets one of a column's
    // fields. There may be multiple fields.  MD.
    for (var i = 0; i < me.runtimeChildren.length; i++) {
      var itm = me.runtimeChildren[i];
      var col = Number(itm["column"]);
      var val = itm["value"];
      if (itm["field type"] == "html container") val = itm["html"];
      // The current itm maps to the headerCell's column.
      if ((pui.isBound(val) && all) || (pui.isBound(val) && !isNaN(col) && col == headerCell.col)) {
        var fieldName = pui.fieldUpper(val["fieldName"]);
        // Find the index of the dataArray column that corresponds to fieldName.
        // me.fieldNames maps me.dataArray columns to fieldNames.
        for (var j = 0; j < me.fieldNames.length; j++) {
          if (fieldName == me.fieldNames[j]) {
            headerCell.searchIndexes.push(j);
            headerCell["pui"].formats.push(val);
            headerCell["pui"].rtIdxs.push(i);
            break; //There should be one matching fieldName. no need to keep searching.
          }
        }
      }
    }
  };

  this["startFind"] = function (headerCell) {
    if (typeof headerCell == "number") headerCell = me.cells[0][getCurrentColumnFromId(headerCell)];
    if (headerCell == null) return;
    me.ffHeaderCell = headerCell;
    me.ffbox.type = "find";
    me.ffbox.onsearch = me["find"];
    me.ffbox.setPlaceholder(pui["getLanguageText"]("runtimeText", "find text") + "...");
    me.ffbox.positionByGridColumn(headerCell);
    if (me.isDataGrid()) me.ffbox.interval = 250; //Slows reloading data to 250ms after last keystroke.
    me.setSearchIndexes(headerCell);
    me.highlighting.columnId = headerCell.columnId;
    me.highlighting.col = headerCell.col;
    me.ffbox.show();
    me.ffbox.clear();
    me.ffbox.focus();
  };

  this["clearHighlighting"] = function () {
    me.highlighting.text = "";
    me.getData();
  };

  /**
   * Find data in the grid and scroll to its row. 
   * When call via API the three parameters are columnIndex, text, and next.
   * When called internally the two parameters are text, and next.
   * 
   * When next is true, start search with the record after the top visible row.
   * 
   * @param {String|Number}  parm1   columnIndex (API) or the search text.
   * @param {String|Boolean} parm2   search text (API) or next.
   * @param {Boolean|Null}   parm3   next (API) or null.
   * @returns {undefined}
   */
  this["find"] = function (parm1, parm2, parm3) {
    if (me.waitingOnRequest) return;

    var headerCell = me.ffHeaderCell;

    var text = parm1;
    var findNext = parm2;
    if (typeof parm1 == "number") { // when used as API rather than intenrally
      headerCell = me.cells[0][getCurrentColumnFromId(parm1)];
      if (headerCell == null) return;
      text = parm2;
      findNext = parm3;
      me.highlighting.columnId = headerCell.columnId;
      me.highlighting.col = headerCell.col;
      me.setSearchIndexes(headerCell);
    }

    me.highlighting.text = "";
    if (text == "") {
      me.getData();
      return;
    }

    if (me.isDataGrid() && me.forceDataArray == false) {
      me.highlighting.text = text;
      findText = text;
      findColumn = headerCell.columnId + 1; //CGI program's columns start at 1, not 0.
      findStartRow = 1;
      if (findNext) findStartRow = me.recNum + 1; //CGI program will search after top visible row.
      me.mask();
      me.gridLoading();
      me.getData();
      findText = null; //Clear to prevent other async calls to getData from searching again.
      findColumn = null;
      findStartRow = null;
    } else { //Client-side Find.
      var start = 0;
      if (findNext) start = me.recNum;
      var textLower = text.toLowerCase();
      var idxes = headerCell.searchIndexes;
      var done = false;
      var dataRecords = me.dataArray;
      if (me.isFiltered()) dataRecords = me.visibleDataArray;
      for (var i = start; i < dataRecords.length; i++) {
        for (var j = 0; j < idxes.length; j++) {
          var idx = idxes[j];
          var record = dataRecords[i];
          var value = record[idx];
          // If the header has a format for the current field, then use it.
          if( headerCell["pui"] && headerCell["pui"].formats
           && headerCell["pui"].formats[j] != null
           && typeof headerCell["pui"].formats[j] == "object"){
            headerCell["pui"].formats[j].value = value;
            value = pui.FieldFormat.format(headerCell["pui"].formats[j]);
          }
          var valueLower = value.toLowerCase();
          if (valueLower.indexOf(textLower) >= 0) {
            me.highlighting.text = text;
            var rec = i + 1;
            if (me.recNum != rec) {
              if (me.scrollbarObj != null && me.scrollbarObj.type == "sliding") {
                var rv = me.scrollbarObj.setScrollTopToRow(rec, false);
                if (rv === false) me.getData();
              } else if (me.pagingBar) {
                var lastPage = me["getRecordCount"]() - me.getSubfilePage() + 1;
                if (rec > lastPage) me["scrollToRow"](lastPage);
                else me["scrollToRow"](rec);
              } else me.getData();
            } else {
              me.getData();
            }
            done = true;
            break;
          }
        }
        if (done) break;
      }
      if (!done) {
        me.getData();
      }
    } //done client-side Find.
  };

  /**
   * Prepare filter elements for filtering column data based on a user's input.
   * Without quick filters, this shows and prepares the ffbox above a header cell. With quick filters this prepares the
   * quickfilter box in the specified header.
   * @param {Element|Number} headerCell
   */
  this["startFilter"] = function (headerCell) {
    if (typeof headerCell == "number") headerCell = me.cells[0][getCurrentColumnFromId(headerCell)];
    if (headerCell == null) return;
    me.ffHeaderCell = headerCell;
    me.ffbox.type = me.usePagingFilter() ? "pgfilter" : "filter";
    me.ffbox.onsearch = me.doFilter;
    me.ffbox.setPlaceholder(pui["getLanguageText"]("runtimeText", "filter text") + "...");
    if (!me.showQuickFilters) me.ffbox.positionByGridColumn(headerCell);
    if (me.isDataGrid()) me.ffbox.interval = 250; //Slows reloading data to 250ms after last keystroke.
    me.setSearchIndexes(headerCell);
    me.highlighting.columnId = headerCell.columnId;
    me.highlighting.col = headerCell.col;
    if (!me.showQuickFilters) {
      me.ffbox.show();
      me.ffbox.clear();
    }
    
    if (headerCell.filterText != null && headerCell.filterText != "") {
      me.ffbox.setText(headerCell.filterAll ? "" : headerCell.filterText);
      me.highlighting.text = headerCell.filterText;
      me.getData();
    }
    
    if (me.showQuickFilters) {
      var qfbox = headerCell.querySelector('input.qf');
      if (qfbox) qfbox.focus();
    }
    else me.ffbox.focus();
  };

  this.doFilter = function (text) {
    var headerCell = me.ffHeaderCell;
    if (text == "") {
      me["removeFilter"](headerCell);
    }
    else {
      me["setFilter"](headerCell, text);
    }
  };

  /**
   * Test all values loaded in the grid's specified column, and redraw
   * only those rows where the cell values pass the search text.
   * 
   * @param {Object|Number} headerCell    If a Number, the value determines which
   *   cell to pull the column information from, starting at index 0.
   *   If an Object, then headerCell is the DOM for a cell that should contain
   *   column information.
   * @param {String} text     The filter text. May be an expression.
   * @returns {undefined}
   */
  this["setFilter"] = function (headerCell, text) {
    if (me.waitingOnRequest) return;

    var all = false;
    if (headerCell === "*all") {  // special value to indicate filter on all columns, only valid for client-side filtering on load-all grids
      all = true;
      headerCell = me.cells[0][0];
    }
    else if (!me.cells[0][0].filterIcon && me.cells[0][0].filterAll) {
      me["removeFilter"](me.cells[0][0]) ;
    }

    if (typeof headerCell == "number") headerCell = me.cells[0][getCurrentColumnFromId(headerCell)];
    if (headerCell == null) return;
    if (me.usePagingFilter()) return setPagingFilter(headerCell, text);
    me.setSearchIndexes(headerCell, all);
    me.highlighting.columnId = headerCell.columnId; //need to set when called from API w/o startFilter.
    me.highlighting.col = all ? "*all" : headerCell.col;
    me.highlighting.text = text;
    if (all) {
      var headerRow = me.cells[0];
      for (var i = 0; i < headerRow.length; i++) {
        me.removeFilterIcon(headerRow[i]);
        headerRow[i].filterText = null;
      }
      headerCell.filterAll = true;
    }
    else {
      me.setFilterIcon(headerCell);
    }
    headerCell.filterText = text;
    
    if (me.showQuickFilters) {
      var qfbox = headerCell.querySelector('input.qf');
      if (qfbox) qfbox.value = text;
    }

    if (me.isDataGrid() && me.forceDataArray == false) {
      // Filter in this field for DB-driven grids. (Assume one field per column.)
      me.totalRecs = null; // make sure the CGI gives us totalRecs (count of results).
      me.recNum = 1; // Show record 1 on row 1.

      me.mask(); // disable UI until server responds.
      me.gridLoading();
    }
    else{
      // Do client-side filtering.
      var idxes = headerCell.searchIndexes;
      var col = headerCell.columnId;
      me.visibleDataArray = [];
      for (var i = 0; i < me.dataArray.length; i++) {
        var record = me.dataArray[i];
        if (all) record.filteredOutArray = [];
        if (record.subfileRow == null) record.subfileRow = i + 1;
        for (var j = 0; j < idxes.length; j++) {
          var idx = idxes[j];
          var value = record[idx];
          var ignoreTest = false;
          if (headerCell["pui"] != null) {
            // If the header has a format for the current field, then use it.
            if( headerCell["pui"].formats != null
             && headerCell["pui"].formats[j] != null
             && typeof headerCell["pui"].formats[j] == "object" ){

              var curfmt = headerCell["pui"].formats[j];
              curfmt.value = value;
              value = pui.FieldFormat.format(curfmt);
            }

            // If the field is hidden explicitly or by position, then ignore its
            // value in the filter.
            if( headerCell["pui"].rtIdxs != null
             && headerCell["pui"].rtIdxs[j] != null
             && me.runtimeChildren[headerCell["pui"].rtIdxs[j]] != null
             && typeof me.runtimeChildren[headerCell["pui"].rtIdxs[j]] == "object" ){

              var rtChild = me.runtimeChildren[headerCell["pui"].rtIdxs[j]];
              var rtleft = parseInt(rtChild["left"], 10);
              var rttop = parseInt(rtChild["top"], 10);
              if( rtChild["visibility"] == "hidden"
              || (!isNaN(rtleft) && !isNaN(rttop) && rtleft < 0 && rttop < 0))
                ignoreTest = true;
            }
          }
          if (record.filteredOutArray == null) record.filteredOutArray = [];
          record.filteredOutArray[col] = true;
          if (!ignoreTest && me.testFilter(value, text)) {
            record.filteredOutArray[col] = false;
            break;
          }
        }
        me.setFilteredOut(record);
        if (!record.filteredOut && !record.hideRow) {
          me.visibleDataArray.push(record);
        }
      }
    } //done client-side filtering.
    me.getData();
    if (persistState) me.saveFilters(all, text);
    executeEvent("onfilterchange");
  };


  this.saveFilters = function (all, text) {
    var filters = [];
    if (all) {
      filters.push({ "text": text, "column": "*all", "curCol": "*all" });
    }
    else {
      var headerRow = me.cells[0];
      for (var i = 0; i < headerRow.length; i++) {
        var headerCell = headerRow[i];
        if (headerCell.filterText != null && headerCell.filterText != "") {
          filters.push({ "text": headerCell.filterText, "column": headerCell.columnId, "curCol": headerCell.col });
        }
      }
    }
    if (filters.length < 1) {
      me["clearState"]("filters");
    }
    else {
      saveState(filters, "filters");
    }
  };


  this["getFilter"] = function (headerCell) {
    var all = false;
    if (headerCell === "*all") {
      headerCell = 0;
      all = true;
    }
    // If filter "*all" and column #0 is hidden, headerCell will have -1 value and the function will not return the current filter text.
    // Therefore, we need to force the column number to 0.
    if (typeof headerCell == "number") headerCell = me.cells[0][all ? 0 : getCurrentColumnFromId(headerCell)];
    if (headerCell == null || typeof headerCell.filterText == 'undefined') return null;
    if (all && !headerCell.filterAll || !all && headerCell.filterAll) return null;
    return headerCell.filterText;
  };

  /**
   * Return true if a cell's value should be included in filtered data; returns
   * false if the value should not be included.
   * 
   * Comparisons are case insensitive.
   * 
   * TODO: there should only be one return call; having multiple is error-prone. Also, move this into the prototype.
   * 
   * Supported expressions:
   *   between x and y
   *   values x,y,z              (exact matches)
   *   jvalues ["x","y","z"]     (same as above, but list is a JSON array of strings -- mostly for "filter by value")
   *   starts with str
   *   ==str, =str               (exact match)
   *   >=str, <=str, >str, <str
   *   !=str, <>str              (partial match)
   *   str                       (partial match)
   * 
   * @param {String} value    The data value from the cell.
   * @param {String} text     The search text, which may be an expression.
   * @returns {Boolean}       Returns true if the cell value contained the search
   *    text or passed the expression.
   */
  this.testFilter = function (value, text) {
    var commaDecimal = (pui.appJob != null && (pui.appJob["decimalFormat"] == "I" || pui.appJob["decimalFormat"] == "J"));
    if (text.substr(0, 8).toLowerCase() == "between ") {
      var parts = text.substr(8).toLowerCase().split(" ");
      if (parts.length == 3 && parts[1] == "and") {
        var from = parts[0];
        var to = parts[2];
        if (!isNaN(from) && !isNaN(to)) {
          from = Number(from);
          to = Number(to);
          value = Number(value);
        }
        else {
          value = value.toLowerCase();
        }
        return (value >= from && value <= to);
      }
    }

    if (text.substr(0, 7).toLowerCase() == "values ") {
      text = text.substr(7).toLowerCase();
      if (text == "") return true;
      var list = text.split(",");
      for (var i = 0; i < list.length; i++) {
        text = trim(list[i]).toLowerCase();
        //For filtering blanks -- should be represented by 1 space
        if (text == " " && value == "") return true;
        if (trim(value).toLowerCase() == text) return true;
      }
      return false;
    }
    else if (text.substr(0, 8).toLowerCase() == "jvalues ") {
      text = text.substr(8).toLowerCase();
      if (text == "") return true;
      try {
        var list = JSON.parse(text);
        if (!Array.isArray(list)) return false;
      }
      catch(e) { return false; }
      for (var i = 0; i < list.length; i++) {
        text = trim(list[i]).toLowerCase();
        //For filtering blanks -- should be represented by 1 space
        if (text == " " && value == "") return true;
        if (trim(value).toLowerCase() == text) return true;
      }
      return false;
    }
    else if (text.substr(0,12).toLowerCase() == "starts with ") {
      var text = text.substr(12).toLowerCase();
      return (text == value.substr(0, text.length).toLowerCase());
    }
    else if (text.substr(0,2) == "==") {
      text = text.substr(2);
      //For filtering blanks -- should be represented by 1 space
      if (text == " " && value == "") return true;
      if (text == "") return true;
      return (text.toLowerCase() == value.toLowerCase());
    }
    else if (text.substr(0,2) == ">=") {
      text = text.substr(2);
      if (text == "") return true;
      text = prepareComparisonString(text);
      value = prepareComparisonString(value);
      if (isNaN(text)) return value.toLowerCase() >= text.toLowerCase();
      else return (Number(value) >= Number(text));
    }
    else if (text.substr(0,2) == "<=") {
      text = text.substr(2);
      if (text == "") return true;
      text = prepareComparisonString(text);
      value = prepareComparisonString(value);
      if (isNaN(text)) return value.toLowerCase() <= text.toLowerCase();
      else return (Number(value) <= Number(text));
    }
    else if (text.substr(0,2) == "!=" || text.substr(0,2) == "<>") {
      text = text.substr(2);
      if (text == "") return true;
      // Alphanumeric - matches if search text contains value. Numeric - must be exact match.
      if (isNaN(text)) return (value.toLowerCase().indexOf(text.toLowerCase()) < 0);
      else return (Number(text) != Number(value));
    }
    else if (text.substr(0,1) == "=") {
      text = text.substr(1);
      //For filtering blanks -- should be represented by 1 space
      if (text == " " && value == "") return true;
      if (text == "") return true;
      return (text.toLowerCase() == value.toLowerCase());
    }
    else if (text.substr(0,1) == ">") {
      text = text.substr(1);
      if (text == "") return true;
      text = prepareComparisonString(text);
      value = prepareComparisonString(value);
      if (isNaN(text)) return value.toLowerCase() > text.toLowerCase();
      else return (Number(value) > Number(text));
    }
    else if (text.substr(0,1) == "<") {
      text = text.substr(1);
      if (text == "") return true;
      text = prepareComparisonString(text);
      value = prepareComparisonString(value);
      if (isNaN(text)) return value.toLowerCase() < text.toLowerCase();
      else return (Number(value) < Number(text));
    }
    //For filtering blanks -- should be represented by 1 space
    else if (text == " " && value == "" ) {
      return true;
    }
    else {
      return (value.toLowerCase().indexOf(text.toLowerCase()) >= 0);
    }

    function prepareComparisonString(string) {
      var string = string;
      if (commaDecimal) {
        // Strip all the thousand periods then change the comma to a decimal period
        var temp = string.split('.').join('').replace(',', '.');
        if (!isNaN(temp)) return temp;
      }
      if (string.indexOf(',') != -1) {
        var temp = string.split(',').join('');
        if (!isNaN(temp)) return temp;
      }
      return string;
    }
  };

  /**
   * Parse the user's filter text into HTTP POST parameters for the CGI program.
   * 
   * @param {String} filtNum  0-9, to be used in the output.
   * @param {String} text     User input from Filter box.
   * @returns {String}        URL encoded string with &key=value pairs for the filter.
   */
  this.prepareFilterText = function (filtNum, text) {
    var retval = "";
    text = text.toUpperCase();

    var btwnreg = /^BETWEEN (.+) AND (.+)$/;
    var matches = text.match(btwnreg);
    // between a and z
    if (matches != null && matches.length == 3) {
      retval = "&fltrtype"+filtNum+"=BET"
        + "&fltrval"+filtNum+"_0="+encodeURIComponent(matches[1])
        + "&fltrval"+filtNum+"_1="+encodeURIComponent(matches[2]);
    }
    // values a,b,c
    else if (text.substr(0, 7) == "VALUES ") {
      var vals = text.substr(7);
      if (vals != "") {
        vals = vals.split(",");

        if (vals.length > 0) {
          // This type of filter tells the CGI program how many values it will have.
          retval = "&fltrtype" + filtNum + "=VAL&fltrcnt" + filtNum + "=" + String(vals.length);
          for (var i = 0; i < vals.length; i++) {
            // Add a value. Trim whitespace because client-side filtering does for this one.
            retval += "&fltrval" + filtNum + "_" + String(i) + "=" + encodeURIComponent(trim(vals[i]));
          }
        }
      }
    }
    // jvalues ["a","b","c"]
    else if (text.substr(0, 8) == "JVALUES ") {
      var vals = text.substr(8);
      if (vals != "") {
        try {
          vals = JSON.parse(vals);
          if (!Array.isArray(vals)) vals = [];
        }
        catch(e) { vals = []; }

        if (vals.length > 0) {
          // This type of filter tells the CGI program how many values it will have.
          retval = "&fltrtype" + filtNum + "=VAL&fltrcnt" + filtNum + "=" + String(vals.length);
          for (var i = 0; i < vals.length; i++) {
            // Add a value. Trim whitespace because client-side filtering does for this one.
            retval += "&fltrval" + filtNum + "_" + String(i) + "=" + encodeURIComponent(trim(vals[i]));
          }
        }
      }
    }
    // starts with - assume character data type. CGI will put in quotes: locate('text',field) = 1
    else if (text.substr(0, 12) == "STARTS WITH ") {
      retval = "&fltrtype" + filtNum + "=STW&fltrval" + filtNum + "=" + encodeURIComponent(text.substr(12));
    }
    else if(text.substr(0,2) == "=="){
      retval = "&fltrtype" + filtNum + "=%3D&fltrval" + filtNum + "=" + encodeURIComponent(text.substr(2));
    }
    else if(text.substr(0,1) == "="){
      retval = "&fltrtype" + filtNum + "=%3D&fltrval" + filtNum + "=" + encodeURIComponent(text.substr(1));
    }
    else if(text.substr(0,2) == ">="){
      retval = "&fltrtype" + filtNum + "=%3E%3D&fltrval" + filtNum + "=" + encodeURIComponent(text.substr(2));
    }
    else if(text.substr(0,2) == "<="){
      retval = "&fltrtype" + filtNum + "=%3C%3D&fltrval" + filtNum + "=" + encodeURIComponent(text.substr(2));
    }
    else if(text.substr(0,2) == "!=" || text.substr(0,2) == "<>" ){
      retval = "&fltrtype" + filtNum + "=!%3D&fltrval" + filtNum + "=" + encodeURIComponent(text.substr(2));
    }
    else if(text.substr(0,1) == ">"){
      retval = "&fltrtype" + filtNum + "=%3E&fltrval" + filtNum + "=" + encodeURIComponent(text.substr(1));
    }
    else if(text.substr(0,1) == "<"){
      retval = "&fltrtype" + filtNum + "=%3C&fltrval" + filtNum + "=" + encodeURIComponent(text.substr(1));
    }
    else{
      // Field CONTAINS text.
      retval = "&fltrtype" + filtNum + "=CON&fltrval" + filtNum + "=" + encodeURIComponent(text);
    }
    return retval;
  };

  this.setFilteredOut = function (record) {
    record.filteredOut = false;
    if (record.filteredOutArray != null) {
      for (var j = 0; j < record.filteredOutArray.length; j++) {
        if (record.filteredOutArray[j] === true) {
          record.filteredOut = true;
          break;
        }
      }
    }
  };

  this["removeFilter"] = function (headerCell) {
    if (me.waitingOnRequest) return;
    if (typeof headerCell == "number") headerCell = me.cells[0][getCurrentColumnFromId(headerCell)];
    if (headerCell == null) return;
    me.highlighting.text = "";
    me.removeFilterIcon(headerCell);
    headerCell.filterText = null;
    
    if (me.showQuickFilters) {
      var qfbox = headerCell.querySelector('input.qf');
      if (qfbox) qfbox.value = '';
    }
    
    if (me.usePagingFilter()){
      return setPagingFilter(headerCell, "");  //Clears filter, looks for other filters, submits.
    }
    else if (me.isDataGrid() && me.forceDataArray == false) {
      me.totalRecs = null; // make sure the CGI gives us count of results.
      me.recNum = 1; // Show record 1 on row 1.

      me.mask(); // disable UI until server responds.
      me.gridLoading();
    }
    else{
      // Remove client-side filtering.
      if (headerCell.filterAll) delete headerCell.filterAll;
      var col = headerCell.columnId;
      me.visibleDataArray = [];
      for (var i = 0; i < me.dataArray.length; i++) {
        var record = me.dataArray[i];
        if (record.subfileRow == null) record.subfileRow = i + 1;
        if (record.filteredOutArray != null) {
          record.filteredOutArray[col] = false;
        }
        me.setFilteredOut(record);
        if (!record.filteredOut && !record.hideRow) {
          me.visibleDataArray.push(record);
        }
      }
    }

    me.getData();
    if (persistState) me.saveFilters();
    executeEvent("onfilterchange");
  };

  this["removeAllFilters"] = function () {
    if (me.waitingOnRequest) return;
    me.highlighting.text = "";  //#7258
    var headerRow = me.cells[0];
    for (var i = 0; i < headerRow.length; i++) {
      var headerCell = headerRow[i];
      me.removeFilterIcon(headerCell);
      headerCell.filterText = null;
      if (me.showQuickFilters) {
        var qfbox = headerCell.querySelector('input.qf');
        if (qfbox) qfbox.value = '';
      }
    }

    if (me.usePagingFilter()) return submitPagingFilter("", ""); //Clears the field, submits screen.
    
    me.visibleDataArray = [];
    for (var i = 0; i < me.dataArray.length; i++) {
      var record = me.dataArray[i];
      record.filteredOutArray = null;
      record.filteredOut = false;
      if (record.subfileRow == null) record.subfileRow = i + 1;
      if (!record.hideRow) me.visibleDataArray.push(record);
    }
    if (me.isDataGrid() && me.forceDataArray == false) {
      me.totalRecs = null; // make sure the CGI gives us count of results.
      me.recNum = 1; // Show record 1 on row 1.

      me.mask(); // disable UI until server responds.
      me.gridLoading();
    }
    me.getData();
    me["clearState"]("filters");
    executeEvent("onfilterchange");
  };

  this.getFilterCount = function () {
    var count = 0;
    var headerRow = me.cells[0];
    for (var i = 0; i < headerRow.length; i++) {
      var headerCell = headerRow[i];
      if (headerCell.filterText != null && headerCell.filterText != "") {
        count++;
      }
    }
    return count;
  };

  /**
   * Returns true if client-side filtering is enabled. Usually used to decide to use me.visibleDataArray versus me.dataArray.
   * @param {Boolean} ignoreHiddenRows  if false or not passed and there are hidden rows, it is considered "filtered", 
   *                                    if true only if rows were filteredOut via setFilter() will this return true.
   * @returns {Boolean}
   */
  this.isFiltered = function (ignoreHiddenRows) {
    if (me.filterResponse != null) return false; // With server-side filtering for paging grids, me.dataArray should be used.
    if (!ignoreHiddenRows && me.rowsHidden > 0) return true; // Use me.visibleDataArray if some rows were hidden
    var headerRow = me.cells[0];
    if (headerRow == null) return false;
    for (var i = 0; i < headerRow.length; i++) {
      var headerCell = headerRow[i];
      if (headerCell.filterText != null && headerCell.filterText != "") return true;
    }
    return false;
  };
  
  this.setFilterIcon = function (headerCell) {
    if (headerCell.filterIcon == null) {
      headerCell.filterIcon = document.createElement("img");
      headerCell.filterIcon.style.paddingLeft = "3px";
      headerCell.filterIcon.src = pui.normalizeURL("/profoundui/proddata/images/grids/filter.png");
      headerCell.style.cursor = "pointer";
      headerCell.filterIcon.onclick = function (e) {
        if (!pui.isRightClick(e)) {
          me["startFilter"](headerCell);
          preventEvent(e);
        }
      };
      var destination = headerCell;
      if (destination.firstChild != null && destination.firstChild.tagName == "DIV") {
        destination = destination.firstChild;
      }
      // Insert the icon before the sort icon (or multisort icon).
      if (me.sortIcon != null && me.sortIcon.parentNode === destination) destination.insertBefore(headerCell.filterIcon, me.sortIcon);
      else if (headerCell.multiSortIcon != null && headerCell.multiSortIcon.parentNode === destination)
        destination.insertBefore(headerCell.filterIcon, headerCell.multiSortIcon);
      else destination.appendChild(headerCell.filterIcon);
    }
  };

  this.removeFilterIcon = function (headerCell) {
    if (headerCell.filterIcon != null && headerCell.filterIcon.parentNode != null) headerCell.filterIcon.parentNode.removeChild(headerCell.filterIcon);
    headerCell.filterIcon = null;
  };

  this["isRowFilteredOut"] = function (rowNo) {
    var record = getDataArrayForRow(rowNo, false);
    var result = false;
    if (record != null && record.filteredOut != null && record.filteredOut === true) result = true;
    return result;
  };
  
  /**
   * Returns true if the grid uses server-side filtering on a paging grid.
   * @returns {Boolean}
   */
  this.usePagingFilter = function(){
    return me.tableDiv.filterResponseField != null;
  };

  /**
   * Pack the response for paging-grid server-side filtering and submit it.
   * @param {Object} headerCell   DOM element.
   * @param {String} text         If text is empty, then it's not included in the response, and the server-side program should remove the filter.
   */
  function setPagingFilter(headerCell, text){
    var headerRow = me.cells[0];
    // Due to the fact that some columns may be hidden, use "headerCell.col" instead of "headerCell.columnId" here
    if (typeof headerCell.col != "number" || headerCell.col < 0 || headerCell.col >= headerRow.length) return;
    if (typeof text != "string") text = "";
    var colnums = "";
    var fltrtexts = "";
    var responseCount = 0;
    headerCell.filterText = text;
    if (text.length > 0) addFilterToResponse(headerCell);

    //Look for all other filter texts and build the response.
    for (var i=0; i < headerRow.length && responseCount < me.filterResponseColMax; i++) {
      var colId = headerRow[i].columnId; 
      var ftext = headerRow[i].filterText;
      if (typeof colId == "number" && colId >= 0 && colId != headerCell.columnId && typeof ftext == "string" && ftext.length > 0 ){
        //This isn't the filter just set and it has text.
        addFilterToResponse(headerRow[i]);
      }
    }
    submitPagingFilter(colnums, fltrtexts);
    
    //Given a cell, add its filter text and column ID to the response.
    function addFilterToResponse(hcell){
      // This column has a filter.
      var colnum = String(hcell.columnId + 1);    //Let the columns in RPG be 1-based.
      if (colnum.length > 3){  //This should not happen. If it does, zero out the column.
        colnum = "000";
      }else{
        while (colnum.length < 3) colnum = "0" + colnum;  //left-fill with zeroes.
      }
      // Make sure the filtertext is the exact length it should be.
      var fltrtext = hcell.filterText.substring(0, me.filterResponseTextMax);
      if (fltrtext.length < me.filterResponseTextMax){
        fltrtext = fltrtext + " ".repeat(me.filterResponseTextMax - fltrtext.length);
      }
      colnums += colnum;
      fltrtexts += fltrtext;
      responseCount++;
    }
  } //end setPagingFilter
  
  /**
   * Ensure colnums data fits the data-structure and submit the filter response.
   * @param {String} colnums
   * @param {String} filtertexts
   */
  function submitPagingFilter(colnums, filtertexts){
    // Make sure the column number fields are the correct length; filter text can be empty.
    if (colnums.length < 3 * me.filterResponseColMax ){
      colnums += " ".repeat(3 * me.filterResponseColMax - colnums.length);
    }
    me.filterResponse = colnums + filtertexts;
    pui.filterResponseGrid = me;
    pui.respond();
    pui.filterResponseGrid = null;
  }
  
  /**
   * Parse the value of "filter response" and decide if and where the grid should show filter icons.
   * Sets headerCell.filterText. 
   * @param {String|Undefined} value  When undefined, reprocess the existing value; other props may have changed.
   */
  function parseFilterResponse(value){
    if (value == null || value == ""){
       if (me.filterResponse != null && me.filterResponse != ""){
         value = me.filterResponse;
       }else{
         return;
       }
    }
    var headerRow = me.cells[0];
    me.filterResponse = value;  //Signals to isFiltered() to return false so me.dataArray is used so that grid draws rows.
    // Look for each column number and filter text. 
    for (var i=0; i < me.filterResponseColMax; i++){
      var colnum = value.substring(i*3, i*3 + 3); //each colnum is only 3 digits long.
      colnum = parseInt(colnum,10);
      var startpos = i * me.filterResponseTextMax + 3 * me.filterResponseColMax;  //Start after the columnnum array.
      var filtertext = value.substring(startpos, startpos + me.filterResponseTextMax );
      filtertext = rtrim(filtertext);
      if (!isNaN(colnum) && colnum > 0 && filtertext != "" ){
        colnum -= 1; //Server starts columns at 1; grid starts at 0.
        // Look at each headerCell for the one matching this columnId.
        for (var j=0; j < headerRow.length; j++){
          if (headerRow[j].columnId == colnum){
            headerRow[j].filterText = filtertext;
            me.setFilterIcon(headerRow[j]);
            break;
          }
        }
      }else{
        break;  //Stop adding filters when response has no more.
      }
    }
  }

  /**
   * Hide a column.
   * @param {Number} colId  The original columnId, as positioned in design-time.
   * @returns {Boolean} True if successful, false if not
   */
  this["hideColumn"] = function (colId) {
    return me.handleHideShow(colId, false);
  };

  /**
   * Shows a hidden column.
   * @param {Number} colId  The original columnId, as positioned in design-time.
   * @returns {Boolean} True if successful, false if not
   */
  this["showColumn"] = function (colId) {
    return me.handleHideShow(colId, true);
  };
  
  /**
   * Return true if a columnId is hidden.
   * @param {Number} colId
   * @returns {Boolean} True if column is hidden, false if visible or if colId was NaN or if colId was out of bounds.
   */
  this["isColumnHidden"] = function (colId){
    if (typeof colId == 'string') colId = Number(colId);
    if (!isNaN(colId)) {
      for (var i=0; i < me.columnInfo.length; i++){
        if (me.columnInfo[i]['columnId'] === colId ){
          return me.columnInfo[i]['showing'] !== true;
        }
      }
    }
    return false;
  };
  
  this.getRowInDataArray = function (dataRecords, rrn) {
    var idx = rrn;
    var found = true;
    // if data array has been sorted, we need to get the record
    // based on it's original subfile row rather than
    // it's position in the array.
    if (typeof me.sorted != "undefined" && me.sorted === true || me.isFiltered(true)) {
      found = false;
      for (var i = 0; i < dataRecords.length; i++) {
        if (dataRecords[i].subfileRow == idx) {
          idx = i+1;
          found = true;
          break;
        }
      }
    } 
    if (idx < 1 || idx > dataRecords.length || found == false ) idx = null;
    return idx;
  };

  this["getRowNumber"] = function (rrn) {
    var dataRecords = me.dataArray;
    if (me.isFiltered()) dataRecords = me.visibleDataArray;
    var idx = me.getRowInDataArray(dataRecords, rrn);
    if (idx == null) idx = rrn;
    if (idx < 1) idx = 1;
    if (idx > dataRecords.length) idx = dataRecords.length;
    return idx;
  };
  
  this["getRRN"] = function (rowNum) {
	var row = rowNum;
    var dataRecords = me.dataArray;
    if (me.isFiltered()) dataRecords = me.visibleDataArray;

    if (row < 1) row = 1;
    if (row > dataRecords.length) row = dataRecords.length;

    var record = dataRecords[row - 1];
        
    return record != null && record.subfileRow ? record.subfileRow : row;
  };

  // Handle the showColumn and hideColumn API's
  this.handleHideShow = function (colId, toShow) {
    if (!this.hidableColumns) return false;
    if (typeof colId == 'string') colId = Number(colId);
    if (!isNaN(colId)) {
      var cols = me.columnInfo;
      for (var i = 0; i < cols.length; i++) {
        var col = cols[i];
        if (col["columnId"] === colId) {
          if (col["showing"] === toShow) return true;
          else return me.hideShowColumn(col);
        }
      }
    }
    return false;
  };

  // Toggle the columns with the columnObject provided. If reset is passed, dont run the getData() method 
  // Return false if hide columns is not set, or if there is only 1 column left, else returns true.
  this.hideShowColumn = function (colObj, reset) {
    if (!this.hidableColumns) return false;
    var numCols = me.vLines.length - 2;
    var cols = me.columnInfo;
    var checked = !colObj["showing"];
    if (numCols < 1 && !checked) {
      pui.alert(pui["getLanguageText"]("runtimeMsg", "cannot rmv last col"));
      return false;
    }
    var colId = colObj["columnId"];
    var curCol = colObj["currentColumn"];
    var colSequence = cols.colSequence;
    var visibleCols = [];
    var headerRow = me.cells[0];
    var totalRemovedWidth = 0;
    var excelLike = (pui["grid column resize style"] !== "simple");
    var currentColWidths = me
      .getColumnWidths()
      .split(',')
        .map(function(num){ return Number(num); });
    // Loop through the columns to toggle the current column selecte and get its current width
    // get the current widths of all displayed columns
    // add up all the hidden columns widths and remove any added adjustments from the total 
    for (var i = 0; i < cols.length; i++) {
      if (colObj === cols[i]) {
        cols[i]["showing"] = checked;
        if (!checked) {
          var newCol = getCurrentColumnFromId(cols[i]["columnId"]);
          cols[i]["width"] = currentColWidths[newCol];
        }
        colObj = cols[i];
      }
      if (cols[i]["showing"]) {
        var newCol = getCurrentColumnFromId(cols[i]["columnId"]);
        if (newCol > -1) cols[i]["width"] = currentColWidths[newCol];
        visibleCols.push(cols[i]);
      } else {
        totalRemovedWidth += cols[i]["width"] - (cols[i]["lastAdjustment"] || 0);
      }
    }
    // remove the column selected
    if (!checked) {
      me.rmvColumn(colId);
    } else {
      // else add the column, and get its current position
      me.addColumn(colId);
      var newCol = getCurrentColumnFromId(colId);
      var col = 0;
      // If the column is movable and has been moved
      if (movableColumns && colSequence) {
        // If the column was hidden when the user moved a column 
        // or if the column was previouly displayed past the current last column
        // stick it to the end, do this check first to avoid a while loop
        if (curCol == -1) col = newCol;
        else {
          // Verify the current column is in the correct position in the column mappings 
          if (colSequence[curCol] === colId) {
            // if it is, get the previous column and get its current position
            // if the previous column is currently visible, place the column right after it.
            // otherwise repeat until you find the column 
            var prevColCount = curCol - 1;
            var prevId = colSequence[prevColCount];
            while (prevId >= 0) {
              var prevCol = getCurrentColumnFromId(prevId);
              if (prevCol != -1) {
                if (prevCol <= prevColCount) col = prevCol + 1;
                break;
              } else {
                prevColCount -= 1;
                prevId = colSequence[prevColCount];
              }
            }
          }
        }
        // If the grid is not movable or the columns have not been moved
      } else {
        // Since we default with the first column, check to see if the user is re-displaying any column other than the first one.
        if (colId > 0) {
          // Filter out any columns that are after the current one 
          // and reduce it down to the column right before the current one
          var lastCol = visibleCols
              .filter(function(col) { return col["columnId"] < colId; })
              .reduce(function (prev, cur) { return cur["columnId"] >= prev? cur["columnId"]: prev; }, 0);
          col = getCurrentColumnFromId(lastCol) + 1;
        }
      }
      // We move the column to where it is meant to go, also will pass the colObj as a third parameter
      // The colObj is used to move the correct data to the right column
      me.moveColumn(newCol, col, colObj);
      me.sizeAllCells();
      me.setAllCellStyles();
    }
    // Redisplay the data shown in the grid, if a column is added or it is a database driven grid
    // Dont get the data, if we are resetting the column order since it will call getData() later 
    // And, make the columns sortable if sorting is enabled.
    if (!reset && (checked || me.isDataGrid())) me.getData();
    if (me.sortable) me.makeSortable(true);
    // Get the positions of the headings and the new widths of the columns
    var headings = [];
    var widths = visibleCols
      .sort(function (a, b) {
        var colA = getCurrentColumnFromId(a["columnId"]);
        var colB = getCurrentColumnFromId(b["columnId"]);
        if (colA > colB) return 1;
        else return -1;
      })
      .map(function (obj) {
        if (obj["blankHeader"]) headings.push('');
        else headings.push(obj["name"]);
        if (me.expandToLayout || excelLike) {
          if (me.resizableColumns) return obj["width"];
          return obj["orginalWidth"];
        }
        var adjustedWidth = Math.floor(totalRemovedWidth / visibleCols.length);
        var previousAdjust = obj["lastAdjustment"] || 0;
        for (var i = 0; i < cols.length; i++) {
          if (cols[i]["columnId"] === obj.columnId) {
            cols[i]["lastAdjustment"] = adjustedWidth;
            break;
          }
        }
        var newWidth = obj["width"] + adjustedWidth - previousAdjust;
        if (newWidth < 0) return obj["width"];
        else return newWidth;
      });

    if (persistState) {
      // Get the last posistions of all the visible columns
      var cols = cols.map(function (col) {
        if (col["showing"]) col["savedColumn"] = getCurrentColumnFromId(col["columnId"]);
        return col;
      });
      // Create a state object to save to local storage
      var colState = {
        "cols": cols,
        "headings": headings
      };
      // Save the new widths, column sequence, and column state 
      saveState(colState, "hidableColState");
      saveState(widths, 'colWidths');
      saveState(colSequence, 'colSequence');
    }
    // apply the new widths to the columns and restyle them 
    me.setColumnWidths(widths);
    me.sizeAllCells();
    me.setAllCellStyles();

    // if it the columns are movable, enable the headers to be movable
    if (movableColumns) {
      for (var col = 0; col < headerRow.length; col++) {
        cellDesign(headerRow[col], true, me.sortable);
      }
    }
    // if it the columns are resizable, enable the vLines to be resizable
    if (resizableColumns) {
      for (var i = 0; i < me.vLines.length; i++) {
        lineDesign(me.vLines, i, true, true);
      }
    }
    // expand to layout if set
    if (me.expandToLayout) me.doExpandToLayout();
    //Redraws column headings with the new headings
    me.columnHeadings = headings;
    me.setHeadings();
    resetCellDOMOrder();
    return true;
  };
  
  /**
   * Moves child nodes of the grid DOM element so that they are in the same order as in me.cells. When a column is added or moved, then
   * me.cells is not in the same order as the DOM elements. Tab order of input elements gets broken when DOM elements are out of order. #4917
   */
  function resetCellDOMOrder(){
    var rows = me.cells.length;
    var cols = me.cells[0].length;
    for(var i=0; i < rows; i++){
      for(var j=0; j < cols; j++){
        me.tableDiv.appendChild( me.cells[i][j] ); //When you an element already exists, appendChild moves it.
      }
    }
  }

  // Takes column info as an optional parm.
  // return column headings as an array. 
  this.getHeadings = function (colsInfo) {
    if (typeof colsInfo !== 'object') return me.columnHeadings.split(',');
    return colsInfo.filter(function(col) {
      return col["showing"];
    })
    .sort(function(a, b) { // Sort columns by their currentColumn value
      var colA, colB;
      if (me.designMode && a["currentColumn"] != null && b["currentColumn"] != null) {
        colA = a["currentColumn"];
        colB = b["currentColumn"];
      } else {
        colA = getCurrentColumnFromId(a["columnId"]);
        colB = getCurrentColumnFromId(b["columnId"]);
      }
      if (colA > colB) return 1;
      else return -1;
    })
    .map(function(col){
      if (col["blankHeader"]) return '';
      return col["name"];
    });
  };
  
  this.showMultiSortPanel = function() {
    if (me.tableDiv.parentNode == null) return;
    
    if (sortMultiPanel == null){
      sortMultiPanel = document.createElement('div');
      sortMultiPanel.className = 'grid-multisort' + (me.mainClass != '' ? ' ' + me.mainClass + '-multisort' : '');
      sortMultiPanel.style.top = me.tableDiv.offsetTop + 'px';
      sortMultiPanel.style.left = me.tableDiv.offsetLeft + 'px';
      
      var header = document.createElement('div');

      new pui.MoveListener({ attachto: header, move: sortMultiPanel });
      
      var btn = document.createElement('button');
      btn.className = 'pui-material-icons';
      btn.innerHTML = 'close';
      addEvent(btn, 'click', function(){
        sortMultiPanel.style.display = 'none';
      });
      header.appendChild(btn);
      btn = document.createElement('button');
      btn.className = 'pui-material-icons';
      btn.innerHTML = 'check';
      addEvent(btn, 'click', function(){
        sortMultiPanel.style.display = 'none';
        var sortparam = [];
        for (var i=0; i < includetable.tBodies[0].rows.length; i++){
          var tr = includetable.tBodies[0].rows[i];
          if (tr.order >= 0){
            sortparam.push({cid: tr.columnId, desc: tr.sortDescending});
          }
        }
        me.multisort(sortparam);
      });
      header.appendChild(btn);
      header.appendChild(document.createTextNode(pui['getLanguageText']('runtimeText','sort multiple')));
      sortMultiPanel.appendChild(header);
      
      var includetable = document.createElement('table');
      var thead = includetable.createTHead();
      var tr = thead.insertRow();
      tr['ondrop'] = move_drop;         //drag/drop: allow moving items to first row.
      tr['ondragover'] = move_dragover;
      tr['ondragleave'] = move_dragleave;
      var td = tr.insertCell();
      td.innerHTML = pui['getLanguageText']('runtimeText','sort');
      td = tr.insertCell();
      td.innerHTML = pui['getLanguageText']('runtimeText','order');
      td = tr.insertCell();
      td.innerHTML = pui['getLanguageText']('runtimeText','column');
      td = tr.insertCell();
      td.innerHTML = pui['getLanguageText']('runtimeText','direction');
      
      var tbody = document.createElement('tbody');
      includetable.appendChild(tbody);

      // If sort order was restored, sortMultiOrder may be set before the UI is made, so put things in correct order.
      // Get a list of column info while calculating order based on sortMultiOrder being set on a column.
      var rows = me.cells[0].map(function(hcell){
        var order = -1;
        for (var i=0; i < sortMultiOrder.length; i++){
          if (hcell === sortMultiOrder[i]){
            order = i;
            break;
          }
        }
        var desc = hcell.sortDescending;
        if (desc == null){
          desc = isDefaultSortDescending(hcell.columnId);
        }
        return { columnId: hcell.columnId, name: hcell['textContent'], sortDescending: desc, order: order };
      });
      rows.sort(function(a,b){
        if (a.order >= 0 && b.order >= 0) return a.order - b.order; //a is a smaller number; a comes before b.
        if (a.order >= 0 && b.order < 0) return -1; //a is checked, b is not; a comes before b.
        if (a.order < 0 && b.order >= 0) return 1; //b is checked, a is not; a comes after b.
        return 0;  //Leave alone; a and b are not checked.
      });
      
      for (var i=0; i < rows.length; i++){
        var colname = rows[i].name;
        var cid = rows[i].columnId;
        var desc = rows[i].sortDescending;
        
        tr = tbody.insertRow();
        tr.draggable = true;
        tr.columnId = cid;
        tr.sortDescending = desc;
        tr.order = rows[i].order;
        tr.ondragstart = move_dragstart;
        tr['ondragend']   = move_dragend;
        tr['ondrop']      = move_drop;
        tr['ondragover']  = move_dragover;
        tr['ondragleave'] = move_dragleave;

        td = tr.insertCell();
        var chk = document.createElement('input');
        chk.type = 'checkbox';
        chk.name = colname + '_sort';
        chk.onclick = checkonclick;
        chk.checked = tr.order >= 0;
        td.appendChild(chk);

        td = tr.insertCell();
        td.innerHTML = tr.order >= 0 ? tr.order : '&nbsp;';

        td = tr.insertCell();
        td.innerHTML = colname;
        td.draggable = true;

        td = tr.insertCell();
        btn = document.createElement('button');
        btn.className = 'pui-material-icons';
        btn.innerHTML = tr.sortDescending ? 'arrow_downward' : 'arrow_upward';
        btn.style.visibility = tr.order >= 0 ? '' : 'hidden';
        addEvent(btn, 'click', function(e){
          var tr = e.target.parentNode.parentNode;
          if (e.target.innerHTML == 'arrow_downward'){
            e.target.innerHTML = 'arrow_upward';
            tr.sortDescending = false;
          } else {
            e.target.innerHTML = 'arrow_downward';
            tr.sortDescending = true;
          }
        });
        btn.enabled = false;
        td.appendChild(btn);
      }
      sortMultiPanel.appendChild(includetable);
      me.tableDiv.parentNode.appendChild(sortMultiPanel);
    }
    else if (sortMultiPanel.style.display == ''){
      sortMultiPanel.style.top = me.tableDiv.offsetTop + 'px';  //User clicked sort, but panel is already showing. Maybe it's behind something.
      sortMultiPanel.style.left = me.tableDiv.offsetLeft + 'px';
    }
    else {
      // Panel is not showing but exists.
      var tBody = sortMultiPanel.querySelector("table").tBodies[0];
      // Reset the checkboxes, and buttons on each row.
      for (var i=0; i < tBody.childNodes.length; i++){
        var tr = tBody.childNodes[i];
        var found = false;
        for (var j=0; j < sortMultiOrder.length; j++){
          if (tr.columnId == sortMultiOrder[j].columnId ){
            tr.sortDescending = sortMultiOrder[j].sortDescending;
            tr.childNodes[0].firstChild.checked = true;
            var button = tr.childNodes[3].firstChild;
            if (button){
              button.innerHTML = tr.sortDescending ? 'arrow_downward' : 'arrow_upward';
            }
            found = true;
            break;
          }
        }
        if (!found){
          tr.childNodes[0].firstChild.checked = false;
        }
      }
      recalcRows(tBody);
    }
    sortMultiPanel.style.display = '';
    
    // Fix when there isn't enough space in a layout to show all the columns: make scrollable. 5344.
    var msHeaderHeight = 54;
    if (me.tableDiv.parentNode.getAttribute('container') == 'true' && me.tableDiv.parentNode.offsetHeight > 0 ){
      if (sortMultiPanel.offsetHeight > me.tableDiv.parentNode.offsetHeight - msHeaderHeight){
        sortMultiPanel.style.height = me.tableDiv.parentNode.offsetHeight - msHeaderHeight + 'px';
      }
    }
    
    function gettargetrow(e){
      var target = e.target;
      if (target.tagName == 'TD') target = target.parentNode;
      if (target.tagName != 'TR') return null;
      return target;
    }
    function move_dragstart(e){   // Handle dragging field rows up and down to re-order them.
      var target = gettargetrow(e);
      if (target) {
        e.stopPropagation();
        sortMultiPanel.move_srctr = target;
        pui.addCssClass(target, 'move_origin');
        try{
          e.dataTransfer.setData('text/plain', target.columnId);  //Firefox requires setData before other drag events fire.
        }catch(exc){}
      }
    }
    function move_dragend(e){ //The drag sequence of events is finished.
      var target = gettargetrow(e);
      if (target){
        pui.removeCssClass(target,'move_origin');
        sortMultiPanel.move_srctr = null;  //Prevent "move" drag from reacting to another type of drag.
      }
    }    
    function move_drop(e){    //A column name was dropped over another row. Handle the move. Note: e.dataTransfer.getData isn't needed.
      preventEvent(e);  //Prevent page from redirecting as a link.
      var target_tr = gettargetrow(e);
      if (!target_tr) return;
      
      // Clear dragover visual feedback.
      var table = target_tr.parentNode.parentNode;
      if ( target_tr.parentNode == table.tHead ){
        pui.removeCssClass(table.tHead.lastChild, 'move_valid'); //The line was below table head.
      }else{
        pui.removeCssClass(target_tr, 'move_valid');
      }
      
      if (sortMultiPanel.move_srctr == null){
        console.log('Origin row not set.');
        return;
      }
      
      var targetidx = target_tr.sectionRowIndex;
      if (target_tr.parentNode == table.tHead) targetidx = -1; //insert before first tBodies[0] row.
      targetidx++;    //document.element only has insertBefore(), so look to the next element.
      target_tr = table.tBodies[0].rows[targetidx];
      
      if (sortMultiPanel.move_srctr !== target_tr){
        table.tBodies[0].removeChild(sortMultiPanel.move_srctr);
        table.tBodies[0].insertBefore(sortMultiPanel.move_srctr, target_tr);
      }
      recalcRows(table.tBodies[0]);
    }
    function move_dragover(e){    //Show visual feedback to indicate where a row may be dropped.
      if (sortMultiPanel.move_srctr == null) return; //Prevent drop from other.
      var target_tr = gettargetrow(e);
      if (target_tr == null) return;
      var table = target_tr.parentNode.parentNode;
      
      if (target_tr.parentNode == table.tHead ){   //Target is in the table heading; allow, and show feedback.
        preventEvent(e); //without this the move_drop does not fire.
        e.dataTransfer.dropEffect = 'move';
        pui.addCssClass(table.tHead.lastChild,'move_valid');  //Show visual feedback for drop.
      }
      // Target row is in table body. Don't drop on self or on one above self.
      else if ( target_tr != sortMultiPanel.move_srctr
      && target_tr.sectionRowIndex != sortMultiPanel.move_srctr.sectionRowIndex - 1 ){
        preventEvent(e); //without this the drop is not allowed.
        e.dataTransfer.dropEffect = 'move';
        pui.addCssClass(target_tr,'move_valid');  //Show visual feedback for drop.
      }
    }
    function move_dragleave(e){   //Remove the visual feedback that had indicated where a row may have been dropped.
      preventEvent(e);
      var target = gettargetrow(e);
      if (target) {
        var table = target.parentNode.parentNode;
        if (target.parentNode == table.tHead ){
          target = table.tHead.lastChild; //The border was below the last header tr.
        }
        pui.removeCssClass(target,'move_valid'); //clear feedback.
      }
    }
    function checkonclick(e){
      recalcRows(e.target.parentNode.parentNode.parentNode);  //input, td, tr, tbody.
    }
    function recalcRows(tbody){
      var order = 0;
      // Re-calculate the order numbers, show/hide buttons.
      for (var i=0; i < tbody.rows.length; i++){
        var tr = tbody.rows[i];
        var chk = tr.cells[0].children[0];
        var ordercell = tr.cells[1];
        var btn = tr.cells[3].children[0];
        if (chk.checked){
          tr.order = order;
          ordercell.innerHTML = order;
          order++;
          btn.style.visibility = '';
        }else{
          tr.order = -1;
          ordercell.innerHTML = '';
          btn.style.visibility = 'hidden';
        }
      }
    }
  };

  //Displays a panel that allows user to pick which data from the column to filter
  this.showMultiFiltersPanel = function(headerCell) {
    if (me.tableDiv.parentNode == null) return;
    if(pui["is_ie"]) return;
    //loading animation on table while panel is loading
    me.mask();
    me.gridLoading();

    if (filterMultiPanel) {
      filterMultiPanel.parentNode.removeChild(filterMultiPanel);
      delete filterMultiPanel;
      filterMultiPanel = null;
    }

    filterMultiPanel = document.createElement('div');
    filterMultiPanel.className = 'grid-multifilter' + (me.mainClass != '' ? ' ' + me.mainClass + '-multifilter' : '');
    if(headerCell != null){
      filterMultiPanel.style.top = me.tableDiv.offsetTop + headerCell.offsetHeight + 'px';
      filterMultiPanel.style.left = me.tableDiv.offsetLeft + headerCell.offsetLeft + 'px';
      if(filterMultiPanel.style.top == null || filterMultiPanel.style.left == null){
        filterMultiPanel.style.top = me.tableDiv.offsetTop + 'px';
        filterMultiPanel.style.left = me.tableDiv.offsetLeft + 'px';
      }
    }
    else{
      filterMultiPanel.style.top = me.tableDiv.offsetTop + 'px';
      filterMultiPanel.style.left = me.tableDiv.offsetLeft + 'px';
    }

    
    var header = document.createElement('div');

    new pui.MoveListener({ attachto: header, move: filterMultiPanel });
    //Close button
    var btn = document.createElement('button');
    btn.className = 'pui-material-icons';
    btn.innerHTML = 'close';
    addEvent(btn, 'click', function(){
      filterMultiPanel.style.display = 'none';
      filterMultiPanel = null;
    });

    //Check button
    header.appendChild(btn);
    btn = document.createElement('button');
    btn.className = 'pui-material-icons';
    btn.innerHTML = 'check';
    addEvent(btn, 'click', function(){
      filterMultiPanel.style.display = 'none';
      me.mask(); // disable UI until server responds.
      me.gridLoading();
      
      //set new filtertext only on confirm == "values x, y, z..."
      count = 0;
      entries = dataMap.entries();
      dataCount = dataMap.size;
      var tempArray = [];
      for(var i = 0; i < dataCount; i++){
        entry = entries.next().value;
        data = entry[0];
        checked = entry[1];
        if(checked == true){
          count++;
          tempArray.push(data);
        }
      }
      filterText = "JVALUES " + JSON.stringify(tempArray);
      //WaitingOnRequest set to true in loadAllWithSQL - set false to allow Set Filter to run
      if(me.waitingOnRequest == true){me.waitingOnRequest = false;}
      if(me.forceDataArray == true && me["dataProps"]["load all rows"] != "true"){me.forceDataArray = false;}
      //If nothing checked, remove filter
      if(filterText == null || tempArray.length == 0){me["removeFilter"](col);}
      //Otherwise, set filter on grid
      else{ me["setFilter"](headerCell,filterText); }
      me['unMask']();
      filterMultiPanel = null;
    });
    header.appendChild(btn);
    header.appendChild(document.createTextNode(pui['getLanguageText']('runtimeText','filter multiple')));
    filterMultiPanel.appendChild(header);
    
    var includetable = document.createElement('table');
    var thead = includetable.createTHead();
    var tr = thead.insertRow();
    var td = tr.insertCell();
    td.innerHTML = pui['getLanguageText']('runtimeText','filter check');
    
    td = tr.insertCell();
    td.innerHTML = pui['getLanguageText']('runtimeText','filter data');
  
    var tbody = document.createElement('tbody');
    includetable.appendChild(tbody);

    if(headerCell !=  null){ //to prevent things from getting hung up here
      var col = headerCell.columnId; 
      me.setSearchIndexes(headerCell); 
      var idxes = headerCell.searchIndexes;
    }
    rows = me.dataArray.length;
    var dataMap = new Map();
    var entry = [];
    var entries = [];
    var data;
    var checked = false;
    var count = 0;
    var dataCount = 0;
    var rowCount = 0;
    var filterText = headerCell.filterText;
    var headerFilterText = headerCell.filterText;
    var checkFilterWithSQL = false;
    var gotFilterArr = false;

    function insertRows(){
      tr = tbody.insertRow();
      tr.columnId = col;
      tr.onclick = checkonclick;

      td = tr.insertCell();
      var chk = document.createElement('input');
      chk.type = 'checkbox';
      chk.name = data + '_filter';
      chk.checked = checked;
      td.appendChild(chk);

      td = tr.insertCell();
      td.innerHTML = data;

    }
    function displayData(){
      //Put the first 50 records in cells and display them
      entries   = dataMap.entries();
      dataCount = dataMap.size;
      var rowLimit = (dataCount < 50) ? dataCount : 50;
      
      for(var i = 0; i < rowLimit; i++){
        entry = entries.next().value;
        data = entry[0];
        checked = entry[1];
        insertRows();
        rowCount ++;
      }
      
      filterMultiPanel.appendChild(includetable);
      me.tableDiv.parentNode.appendChild(filterMultiPanel);
    }

    function checkonclick(e){
      //set data first, then check if in map, then set to data to status of checked
      
      if(e.target.localName == "td"){
        if(this.cells[0].children[0].checked == false){
          //change checkbox to true
          this.cells[0].children[0].checked = true;
          checked = true;
        }
        else {
          //change checkbox to false
          this.cells[0].children[0].checked = false;
          checked = false;
        }
      }
      if(e.target.localName == "input"){
        if(this.cells[0].children[0].checked == true){
          //change checked to true
          this.cells[0].children[0].checked = true;
          checked = true;
        }
        else {
          //change checkbox to false
          this.cells[0].children[0].checked = false;
          checked = false;
        }
      }
      //#6864 - changed from innerHTML (which returned "&" as "&amp;") to something that got the text
      data = this.cells[1].childNodes[0].nodeValue;
      if (data != null && dataMap.has(data)){
        dataMap.set(data, checked);
      }
    }
    
    if(me.isDataGrid()  && me["dataProps"]["load all rows"] != "true"){
      var limit = -1;
      var start = 1;
      var dataURL = me["dataProps"]["data url"];
      if (dataURL == "") dataURL = null;
      var hCell = headerCell;
      loadAllWithSQL(limit, start, (me.totalRecs == null), dataURL, headerCell); 
    }
    else{
      //Get data and put into a map to get a list of easily navigatable unique values
      var dataRecords = me.dataArray;
      if (me.isFiltered() && me.visibleDataArray != null && me.visibleDataArray.length > 0)
        dataRecords = me.visibleDataArray;
      for (var i = 0; i < dataRecords.length; i++) {
        var record = dataRecords[i];
        if (record.subfileRow == null) record.subfileRow = i + 1;
        for (var j = 0; j < idxes.length; j++) {
          var idx = idxes[j];
          var value = record[idx];
          var ignoreTest = false;
          if (headerCell["pui"] != null) {
            // If the header has a format for the current field, then use it.
            if( headerCell["pui"].formats != null
              && headerCell["pui"].formats[j] != null
              && typeof headerCell["pui"].formats[j] == "object" ){

              var curfmt = headerCell["pui"].formats[j];
              curfmt.value = value;
              value = pui.FieldFormat.format(curfmt);
            }
          }
          if ( headerCell["pui"].rtIdxs != null
            && headerCell["pui"].rtIdxs[j] != null
            && me.runtimeChildren[headerCell["pui"].rtIdxs[j]] != null
            && typeof me.runtimeChildren[headerCell["pui"].rtIdxs[j]] == "object" ){

            var rtChild = me.runtimeChildren[headerCell["pui"].rtIdxs[j]];
            var rtleft = parseInt(rtChild["left"], 10);
            var rttop = parseInt(rtChild["top"], 10);
            if ( rtChild["visibility"] == "hidden"
            || (!isNaN(rtleft) && !isNaN(rttop) && rtleft < 0 && rttop < 0))
              ignoreTest = true;
          }
          if (!ignoreTest) dataMap.set(value, checked);
          checked = false;
        } 
      }
      
      //Use data
      if(dataMap.size > 0){
        displayData();
        me["unMask"]();
      }  
    }



    filterMultiPanel.style.display = '';
    
    // Fix when there isn't enough space in a layout to show all the columns: make scrollable. 5344.
    var msHeaderHeight = 54;
    if (me.tableDiv.parentNode.getAttribute('container') == 'true' && me.tableDiv.parentNode.offsetHeight > 0 ){
      if (filterMultiPanel.offsetHeight > me.tableDiv.parentNode.offsetHeight - msHeaderHeight){
        filterMultiPanel.style.height = me.tableDiv.parentNode.offsetHeight - msHeaderHeight + 'px';
      }
    }

    function gettargetrow(e){
      var target = e.target;
      if (target.tagName == 'TD') target = target.parentNode;
      if (target.tagName != 'TR') return null;
      return target;
    }
  
    
    filterMultiPanel.onscroll = function(){ 
      //If all rows have displayed
      var dataLeft = dataCount - rowCount;
      if (dataCount <= 50 || dataLeft == 0) return;
      
      var scrollHeight = filterMultiPanel.offsetHeight;
        if (filterMultiPanel.scrollTop >= (filterMultiPanel.scrollHeight - filterMultiPanel.offsetHeight)) {
        //If less than 50 records are left
        if(dataLeft <= 50){
          for(var i = 0; i < dataLeft; i++){
            entry = entries.next().value;
            data = entry[0];
            checked = entry[1];
            insertRows();
            rowCount ++;
          }
        }
        //Display 50 more records
        else{
          for(var i = 0; i < 50; i++){
            entry = entries.next().value;
            data = entry[0];
            checked = entry[1];
            insertRows();
            rowCount ++;
          }
        }
      }
    };

    function loadAllWithSQL(limit, start, total, dataURL, hCell) {
      me.mask(); // disable UI until server responds.
      me.gridLoading();
      
      if (limit == null) limit = -1; 
      if (start == null) start = 1;  
      var pstring = null;

      
      // Setup parameters that are needed now for sqlcache comparison and later for postData.
      pstring = pui.getSQLParams(me["dataProps"]);

      
      //  filter logic when loading data from server
      //  need to include this logic when exporting data also
      me.filterString = "";   // format here and then pass to export function

      if (me.isFiltered()){
        var headerRow = me.cells[0];
        // Look in each column for filter text.
        var filtNum = 0; //CGI looks for fltrcol 0 to 9 and stops when one isn't found.
        for (var i = 0; i < headerRow.length; i++) {
          var headerCell = headerRow[i];
          if (headerCell.columnId >= 0 && headerCell.filterText != null) {
            me.filterString += "&fltrcol" + String(filtNum) + "=" + (headerCell.columnId + 1);
            me.filterString += me.prepareFilterText(String(filtNum), headerCell.filterText);
            pstring += me.filterString;
            filtNum++;
          }
        }
      }
        
        
        // Allow dataURL grids to sort. 
        if (me["dataProps"]["data url"] != null && me["dataProps"]["data url"] != "" && me.sortBy != null) {
          pstring += "&order=" + me.sortBy;
        }
        //done creating sql query parameters.

      var returnVal = null;
      var url = getProgramURL("PUI0009102.PGM");
      if (dataURL) url = pui.appendAuth(dataURL);
      var req = new pui.Ajax(url);
      req["method"] = "post";
      req["async"] = true;
      if (pui.pjs_session_id) req["postData"] = "AUTH=" + pui.pjs_session_id;
      else req["postData"] = "AUTH=" + pui.appJob.auth;

      req["postData"] += "&q=" + encodeURIComponent(pui.getSQLVarName(me.tableDiv));

      var orderBy = me["dataProps"]["order by"];
      if (me.sortBy != null) orderBy = me.sortBy;
      if (orderBy && orderBy != "") {

        req["postData"] += "&order=" + orderBy;

      }
      else if (getDBDriver() == "mssql") {
        // Order by is required for OFFSET/FETCH.
        // This should give the same sort as if order by was not used.
        req["postData"] += "&order=(select null)";
      }

      // Add parameters.
      if (pstring != "") {
        req["postData"] += "&" + pstring;
      }

      req["postData"] += "&limit=" + limit + "&start=" + start;
      if (total != null && total == true) req["postData"] += "&getTotal=1";
      if (pui["read db driven data as ebcdic"] !== true) req["postData"] += "&UTF8=Y";
      
      var fetchCounter = me["dataProps"]["allow any select statement"];
      if (fetchCounter != null && (fetchCounter == "true" || fetchCounter == true))
        req["postData"] += "&FetchCounter=Y";

      if (pui["isCloud"])
        req["postData"] += "&workspace_id=" + pui.cloud.ws.id;
  
      req["onready"] = function (req) {
        var response;
        var successful = false;
        
        response = checkAjaxResponse(req, "Run SQL SELECT Query");

        if (response) {
          me.mask(); // disable UI until server responds.
          me.gridLoading();
         
          var data = response.results;
          var totalRecords = response.totalRecs;
          if (totalRecords != null) me.totalRecs = totalRecords;

          if(data.length >= 1){
           
            var fieldOrder = [];    //Array of field names to be in the same order as the columns.
            for (field in response["results"][0]) {
              fieldOrder.push(field);
            }

            for(var i = 0; i < data.length; i++){
              var record = data[i];
              var fieldNumber = 0;
              //Normal database-driven grids using dataURL or CustomURL don't have the field name in the headerCell
              if(hCell.fieldName != null){
                for(var fieldName in record){
                  if (fieldName.toUpperCase() == hCell.fieldName.toUpperCase()){
                    var fieldValue = record[fieldName];
                    dataMap.set(fieldValue, false);
                  }
                }
              }
              else{
                var field, colNum, heading;
                me.dataArray = data;
                me.waitingOnRequest = false;
                me.forceDataArray = true;
                
                // Setup the field order - array of field names. Usually, the order is the order of keys of objects in the results array.
                var colFieldName = fieldOrder[hCell.columnId];
                for(var fieldName in record){
                  if (fieldName == colFieldName){
                    var fieldValue = record[fieldName];
                    dataMap.set(fieldValue, false);
                  }
                }
              }
            }
            if(dataMap.size > 0){
              displayData();
              me['unMask']();
            }
          }
        }
      };
      me.waitingOnRequest = true; //Ignore filter changes and clicks to sort columns.
      req.send();
    }
  }; //End ShowMultiFilterPanel
  
  function getDBDriver() {

    var connections = pui["getDatabaseConnections"]();
    if (connections) { // New Profound.js backend with multi-DB support.
      var connectionName = trim(me["dataProps"]["database connection"] || "");
      for (var i = 0; i < connections.length; i++) {
        var connection = connections[i];
        if ((connectionName === "" && connection["default"] === true) || connectionName === connection["name"])
          return connection["driver"];
      }
    }
    else if (typeof pui["dbDriver"] !== "undefined") {  // Old Profound.js backend w/o multi-DB support.
      return pui["dbDriver"];
    }

  }
};
pui.Grid.prototype = Object.create(pui.BaseGrid.prototype);   //Inherit from pui.BaseGrid.

/**
 * Return the properties model for Profound UI grids.
 * @returns {Array}
 * @static
 */
pui.BaseGrid.getPropertiesModel = function(){
  // ddsCompatProp: the property is for backward compatibility with legacy Display File properties.
  // 1 = help description should always warn/hide.
    var model = [{ name: "Identification", category: true },
      { name: "id", maxLength: 75, attribute: "id", helpDefault: "id", help: "Specifies the ID that is used to access the grid from client-side code.", bind: false, canBeRemoved: false },
      { name: "record format name", displayName: (pui.nodedesigner ? "name" : undefined), helpDefault: "blank", help: "Specifies the name that is used to access this grid from server code.", maxLength: (pui.viewdesigner|| pui.nodedesigner ? null : 10), bind: false, context: "dspf", canBeRemoved: false },
      { name: "description", helpDefault: "blank", help: "Describes the grid.", bind: false, context: "dspf" },
      { name: "parent window", attribute: "parentWindow", helpDefault: "blank", help: "Sets the window that this field belongs to.", context: "genie" },
      { name: "screen identifier", choices: ["true", "false"], blankChoice: false, helpDefault: "false", help: "If set to true, this element will be used to detect the screen. The identifier element should be a static output field that is unique to this screen. For example, if the screen has a unique heading, it can be used as the identifier. At least one element on the screen must be marked as an identifier before you can save the screen. When appropriate, you can use a combination of several elements to uniquely identify the screen.", context: "genie" },
      { name: "field type", displayName: "widget type", choices: ["grid"], blankChoice: false, helpDefault: "widget", help: "Determines the type of control that is used to render the element.", bind: false, canBeRemoved: false },
      { name: "value", helpDefault: "blank", help: "Sets the initialization value for the current element." },

      { name: "Subfile Settings", category: true, context: "dspf"},
      { name: "display subfile", choices: ["true", "false"], hideFormatting: true, validDataTypes: ["indicator", "expression"], helpDefault: "true", help: "This property tells the system when to display grid records. It represents the SFLDSP keyword.", context: "dspf", viewdesigner: false },
      { name: "display control record", choices: ["true", "false"], hideFormatting: true, validDataTypes: ["indicator", "expression"], helpDefault: "false", help: "This property tells the system when to display the subfile control record. It represents the SFLDSPCTL keyword.", context: "dspf", viewdesigner: false },
      { name: "initialize subfile", choices: ["true", "false"], hideFormatting: true, validDataTypes: ["indicator", "expression"], helpDefault: "false", help: "This property tells the system to initialize all records within the subfile. It represents the SFLINZ keyword.", context: "dspf", viewdesigner: false },
      { name: "subfile records not active", choices: ["true", "false"], bind: false, helpDefault: "false", help: "This property can be used together with the \"initialize subfile\" property to initialize a subfile with no active records. It represents the SFLRNA keyword.", context: "dspf", viewdesigner: false, ddsCompatProp: 1 },
      { name: "delete subfile", choices: ["true", "false"], hideFormatting: true, validDataTypes: ["indicator", "expression"], helpDefault: "false", help: "This property tells the system when to delete the subfile area. It represents the SFLDLT keyword.", context: "dspf", viewdesigner: false, ddsCompatProp: 1 },
      { name: "clear subfile", choices: ["true", "false"], hideFormatting: true, validDataTypes: ["indicator", "expression"], helpDefault: "false", help: "This property tells the system when to clear all records from the subfile. It represents the SFLCLR keyword.", context: "dspf", viewdesigner: false},
      { name: "subfile size", format: "number", hideFormatting: true, validDataTypes: ["zoned"], helpDefault: "blank", help: "This property represents the SFLSIZ keyword, which specifies the number of records that can be placed into the subfile. However, if your program places a record with a relative record number larger than the SFLSIZ value into the subfile, the subfile is automatically extended to contain it (up to a maximum of 9999 records). If this property is not specified, the subfile page value plus one is used. The subfile page value is determined from the \"number of rows\" property minus the header row if it is present.", context: "dspf", viewdesigner: false },
      { name: "subfile record number", format: "number", hideFormatting: true, validDataTypes: ["zoned", "reference"], helpDefault: "blank", help: "This property identifies the scrollbar position when the subfile is first displayed." + (pui.viewdesigner ? "" : "  It represents the SFLRCDNBR keyword."), context: "dspf" },
      { name: "position at top", choices: ["true", "false"], bind: false, helpDefault: "false", help: "When this property is set to true, the subfile record identified by the \"subfile record number\" property will display in the top row of the grid." + (pui.viewdesigner ? "" : "  This property is equivalent to the SFLRCDNBR(*TOP) keyword."), context: "dspf" },
      { name: "place cursor", choices: ["true", "false"], bind: false, helpDefault: "false", help: "When this property is set to true, the cursor is placed in the subfile record identified by the contents of the \"subfile record number\" property. The cursor is positioned at the first input-capable field in the subfile record." + (pui.viewdesigner ? "" : "  This property is equivalent to the SFLRCDNBR(CURSOR) keyword."), context: "dspf" },
      { name: "subfile end", choices: ["true", "false"], hideFormatting: true, validDataTypes: ["indicator", "expression"], helpDefault: "false", help: "This property is used to indicate that a subfile with a paging bar has loaded all of its records." + (pui.viewdesigner ? "" : "  It represents the SFLEND keyword."), context: "dspf", ddsCompatProp: 1 },
      { name: "subfile next changed", choices: ["true", "false"], hideFormatting: true, validDataTypes: ["indicator", "expression"], helpDefault: "false", help: "This property represents the SFLNXTCHG keyword, which forces the user to correct program-detected typing errors in subfile records. The program can cause a record to be changed so that a get-next-changed operation must read the record again.", context: "dspf", viewdesigner: false },
      { name: "cursor record number", readOnly: true, format: "number", hideFormatting: true, validDataTypes: ["zoned"], helpDefault: "bind", help: "This property can be bound to a numeric field, which will return the relative record number of the record on which the cursor is located." + (pui.viewdesigner ? "" : "  It represents the SFLCSRRRN keyword."), context: "dspf"},
      { name: "cursor progression", choices: ["left to right", "top to bottom"], helpDefault: "left to right", help: "This property determines the tab order for input elements within the subfile." + (pui.viewdesigner ? "" : "  It represents the SFLCSRPRG keyword."), context: "dspf", ddsCompatProp: 1 },
      { name: "subfile return rrn", readOnly: true, format: "number", hideFormatting: true, validDataTypes: ["zoned", "reference"], helpDefault: "bind", help: "This property can be bound to a numeric field, which will return the relative record number of the top visible record within a grid." + (pui.viewdesigner ? "" : "  It represents the SFLSCROLL keyword."), context: "dspf" },
      { name: "subfile changed", format: "1 / 0", readOnly: true, hideFormatting: true, validDataTypes: ["indicator"], helpDefault: "bind", help: "Specifies a response indicator that is set on if the input data within the subfile is modified.", context: "dspf", ddsCompatProp: 1 },

      { name: "Message Subfile Settings", category: true, context: "dspf", viewdesigner: false, ddsCompatProp: 1 },
      { name: "subfile message key", readOnly: true, hideFormatting: true, validDataTypes: ["char"], defaultDataLength: 4, helpDefault: "bind", help: "This property specifies a field that is used to select messages from a program message queue for display. Your program places a message reference key in this field. The property represents the SFLMSGKEY keyword on a subfile record format.", context: "dspf", viewdesigner: false, ddsCompatProp: 1 },
      { name: "subfile program message queue", readOnly: true, hideFormatting: true, validDataTypes: ["char"], helpDefault: "bind", help: "This property specifies a field that contains the name of the program message queue used to build a message subfile. It represents the SFLPGMQ keyword on a subfile record format.", context: "dspf", viewdesigner: false, ddsCompatProp: 1 },
      { name: "subfile control program message queue", readOnly: true, hideFormatting: true, validDataTypes: ["char"], helpDefault: "bind", help: "This property specifies a field that contains the name of the program message queue used to build a message subfile when used in conjunction with the <i>subfile initialize</i> property. It represents the SFLPGMQ keyword on a subfile control record format.", context: "dspf", viewdesigner: false, ddsCompatProp: 1 },

      { name: "Font and Text", category: true },
      { name: "font family", choices: ["Arial", "Consolas", "Courier New", "Fantasy", "Georgia", "Monospace", "Tahoma", "Times New Roman", "Sans-Serif", "Serif", "Trebuchet MS", "Verdana", "Other..."], helpDefault: "css", help: "The font face for the text inside the grid. To define a different font for each grid column, select <i>Other...</i> and specify a comma separated list of fonts.", helpAdd: ["other", "font"] },
      { name: "font size", format: "px", choices: ["8px", "9px", "10px", "11px", "12px", "13px", "14px", "15px", "16px", "17px", "18px", "19px", "20px", "21px", "22px", "23px", "24px", "25px", "26px", "27px", "28px", "29px", "30px", "Other..."], helpDefault: "css", help: "The size of the text inside the grid. To specify a different font size for each grid column, select <i>Other...</i> and specify a comma separated list of font sizes.", helpAdd: ["other"] },
      { name: "font style", format: "italic / normal", choices: ["normal", "italic", "oblique", "Other..."], helpDefault: "css", help: "The style of the font in the grid. To specify a different font style for each grid column, select <i>Other...</i> and specify a comma separated list of font styles.", helpAdd: ["other"] },
      { name: "font variant", choices: ["normal", "small-caps", "Other..."], helpDefault: "css", help: "Normal or <span style='font-variant:small-caps;'>small caps</span>. Small caps shows the text with all caps but same height as a lower case letter.", helpAdd: ["other"] },
      { name: "font weight", format: "bold / normal", choices: ["normal", "bolder", "bold", "lighter", "100", "200", "300", "400", "500", "600", "700", "800", "900", "Other..."], helpDefault: "css", help: "Specifies the weight of the font inside the grid. To specify a different font weight for each grid column, select <i>Other...</i> and specify a comma separated list of font weights.", helpAdd: ["other"] },
      { name: "letter spacing", format: "px", choices: ["normal", "-3px", "-2px", "-1px", "0px", "1px", "2px", "3px", "4px", "5px", "6px", "7px", "8px", "9px", "10px", "11px", "12px", "13px", "14px", "15px", "16px", "17px", "18px", "19px", "20px", "Other..."], helpDefault: "css", help: "Spacing between each letter of a word. To specify a different value for each grid column, select <i>Other...</i> and specify a comma separated list of values.", helpAdd: ["other"] },
      { name: "text align", choices: ["left", "right", "center", "justify", "Other..."], helpDefault: "css", help: "Alignment of text inside cells of the grid element. To specify a different alignment option for each grid column, select <i>Other...</i> and specify a comma separated list of values.", helpAdd: ["other"] },
      { name: "text decoration", format: "underline / none", choices: ["none", "underline", "overline", "line-through", "Other..."], helpDefault: "css", help: "Decoration of the text inside the grid. To specify a different value for each grid column, select <i>Other...</i> and specify a comma separated list of values.", helpAdd: ["other"] },
      { name: "text transform", choices: ["capitalize", "uppercase", "lowercase", "none", "Other..."], helpDefault: "css", help: "Transforms the default formatting of the text inside the grid. To specify a different value for each grid column, select <i>Other...</i> and specify a comma separated list of values.", helpAdd: ["other"] },
      { name: "word spacing", format: "px", choices: ["normal", "-3px", "-2px", "-1px", "0px", "1px", "2px", "3px", "4px", "5px", "6px", "7px", "8px", "9px", "10px", "11px", "12px", "13px", "14px", "15px", "16px", "17px", "18px", "19px", "20px", "21px", "22px", "23px", "24px", "25px", "Other..."], helpDefault: "css", help: "Spacing between each word in the cells of the grid. To specify a different value for each grid column, select <i>Other...</i> and specify a comma separated list of values.", helpAdd: ["other"] },

      { name: "Header", category: true },
      { name: "has header", choices: ["true", "false"], type: "boolean", validDataTypes: ["indicator", "expression"], hideFormatting: true, helpDefault: "true", help: "Determines whether the grid has a header row. If &quot;show quick filters&quot; is true, then a header will appear even if &quot;has header&quot; is false." },
      { name: "header height", helpDefault: "theme", help: "Specifies the height of the header row. This can also be specified by dragging the grid's top border with the mouse.", bind: false, canBeRemoved: false },
      { name: "header font family", choices: ["Arial", "Consolas", "Courier New", "Fantasy", "Georgia", "Monospace", "Tahoma", "Times New Roman", "Sans-Serif", "Serif", "Trebuchet MS", "Verdana", "Other..."], helpDefault: "css", help: "The font face for the text inside the grid header row. To define a different font for each grid column, select <i>Other...</i> and specify a comma separated list of fonts.", helpAdd: ["other","font"] },
      { name: "header font size", format: "px", choices: ["8px", "9px", "10px", "11px", "12px", "13px", "14px", "15px", "16px", "17px", "18px", "19px", "20px", "21px", "22px", "23px", "24px", "25px", "26px", "27px", "28px", "29px", "30px", "Other..."], helpDefault: "css", help: "The size of the text inside the grid header row. To specify a different font size for each grid column, select <i>Other...</i> and specify a comma separated list of font sizes.", helpAdd: ["other"] },
      { name: "header font style", format: "bold / normal", choices: ["normal", "italic", "oblique", "Other..."], helpDefault: "css", help: "Specifies the style of the font inside the grid header row. To specify a different font style for each grid column, select <i>Other...</i> and specify a comma separated list of font styles.", helpAdd: ["other"] },
      { name: "header font weight", format: "italic / normal", choices: ["normal", "bolder", "bold", "lighter", "100", "200", "300", "400", "500", "600", "700", "800", "900", "Other..."], helpDefault: "css", help: "Specifies the weight of the font inside the grid header row. To specify a different font weight for each grid column, select <i>Other...</i> and specify a comma separated list of font weights.", helpAdd: ["other"] },
      { name: "header text align", choices: ["left", "right", "center", "justify", "Other..."], helpDefault: "css", help: "Alignment of text inside the cells of the grid header row. To specify a different alignment option for each cell, select <i>Other...</i> and specify a comma separated list of values.", helpAdd: ["other"] },
      { name: "header font color", type: "color", helpDefault: "css", help: "Defines the color of the text inside the header row. To define a different color for each grid cell in the header row, specify a comma separated list of color values.", helpAdd: ["color"] },
      { name: "header background", type: "color", helpDefault: "css", help: "Defines the background color of the header row. To define a different color for each grid cell in the header row, specify a comma separated list of color values.", helpAdd: ["background color"] },
      { name: "header image", type: "image", helpDefault: "css", help: "Defines a repeating background image for the header row." },
      { name: "column headings", type: "list", helpDefault: "placeholder", help: "Specifies a comma separated list of heading text for each column of the grid.", translate: true },

      { name: "Colors", category: true },
      { name: "odd row font color", type: "color", helpDefault: "css", help: "Defines the color of text inside the odd rows of the grid. To define a different color for each grid column, specify a comma separated list of color values.", helpAdd: ["color"], helpNote: "This only applies to text displayed in a database driven grid." },
      { name: "odd row background", type: "color", helpDefault: "css", help: "Defines the background color of the odd rows in the grid. To define a different color for each grid column, specify a comma separated list of color values.", helpAdd: ["background color"] },
      { name: "even row font color", type: "color", helpDefault: "css", help: "Defines the color of text inside the even rows of the grid. To define a different color for each grid column, specify a comma separated list of color values.", helpAdd: ["color"], helpNote: "This only applies to text displayed in a database driven grid." },
      { name: "even row background", type: "color", helpDefault: "css", help: "Defines the background color of the even rows in the grid. To define a different color for each grid column, specify a comma separated list of color values.", helpAdd: ["background color"] },
      { name: "row font color", type: "color", helpDefault: "css", help: "Defines the color of text in an individual row. You can define a dynamic color for each record by binding this property to a field.", helpAdd: ["color"], helpNote: "This only applies to text displayed in a database driven grid. This property, if defined, will be used instead of <i>even row font color</i> and <i>odd row font color</i>.", context: "dspf" },
      { name: "row background", type: "color", helpDefault: "css", help: "Defines the background color of an individual row. To define a different color for each grid column, specify a comma separated list of color values. You can define a dynamic background color for each record by binding this property to a field.", helpAdd: ["background color"], helpNote: "This property, if defined, will be used instead of <i>even row background</i> and <i>odd row background</i>.", context: "dspf" },
      { name: "hover font color", type: "color", helpDefault: "css", help: "Defines the color of text when the user hovers the mouse cursor over a grid row. To define a different color for each grid column, specify a comma separated list of color values.", helpAdd: ["color"] },
      { name: "hover background", type: "color", helpDefault: "css", help: "Defines the background color of a grid row when the user hovers the mouse cursor over it. To define a different color for each grid column, specify a comma separated list of color values.", helpAdd: ["background color"] },
      { name: "selection font color", type: "color", helpDefault: "css", help: "Defines the color of text when the user selects a grid row.", helpAdd: ["color"], context: "dspf" },
      { name: "selection background", type: "color", helpDefault: "css", help: "Defines the background color of a grid row when the user selects it.", helpAdd: ["background color"], context: "dspf" },

      { name: "Grid Settings", category: true },
      { name: "number of rows", helpDefault: "theme", help: "Specifies the number of rows in the grid, including the header row. When the &quot;expand to layout&quot; grid property is true, this is set automatically.", bind: false, canBeRemoved: false },
      { name: "number of columns", helpDefault: "theme", help: "Specifies the number of columns in the grid.", bind: false, canBeRemoved: false },
      { name: "row height", helpDefault: "theme", help: "Specifies the height that will be applied to each row, not including the header row. This can also be controlled by resizing the grid with the mouse. Changing &quot;height&quot; causes this to change automatically.", bind: false, canBeRemoved: false },
      { name: "hover effect", choices: ["true", "false"], type: "boolean", validDataTypes: ["indicator", "expression"], hideFormatting: true, helpDefault: "theme", help: "Determines whether the grid rows will be highlighted when the user hovers the mouse over them." },
      { name: "hover image", type: "image", helpDefault: "theme", help: "Defines a repeating cell background image for the hover effect." },
      { name: "row selection", choices: ["none", "single", "multiple (simple)", "multiple (extended)"], helpDefault: "none", help: "Determines if rows within the grid can be selected by the user with a click of the mouse. <br/><br/>Possible values are: <br/><br/><b>none</b> - rows cannot be selected <br/><br/><b>single</b> - only one row can be selected <br/><br/><b>multiple (simple)</b> - multiple rows can be selected by simply clicking on the rows <br/><br/><b>multiple (extended)</b> - multiple rows can be selected with the use of the Shift and Ctrl keys" },
      { name: "selection field", format: "1 / 0", readOnly: true, hideFormatting: true, validDataTypes: ["char", "indicator"], defaultDataLength: 1, helpDefault: "bind", help: "This property must be bound to an indicator or a character field, which will be used to both set and return the selected state on each record. If a character field is specified, the selection value property will be used to populate the field when a row is selected.", context: "dspf" },
      { name: "selection value", helpDefault: "blank", help: "Specifies the value used to populate the selection field when a grid row is selected.", bind: false, context: "dspf" },
      { name: "selection image", type: "image", helpDefault: "theme", help: "Defines a repeating cell background image for row selection." },
      { name: "row is hidden field", format: "1 / 0", readOnly: true, hideFormatting: true, validDataTypes: ["indicator"], defaultDataLength: 1, helpDefault: "bind", help: "This property must be bound to an indicator field, which will be used to return whether a row has been hidden.", context: "dspf" },
      { name: "column widths", type: "list", helpDefault: "theme", help: "Specifies a comma separated list of column widths for this grid.", bind: false, canBeRemoved: false },
      { name: "scrollbar", choices: (context == "genie" && !pui.usingGenieHandler) ? ["true", "false"] : ["none", "sliding", "paging"], helpDefault: "sliding", help: ((context == "genie" && !pui.usingGenieHandler) ? "Determines whether a vertical scrollbar for paging through data records will appear within the grid. If the grid is not a database-driven grid, the scrollbar will automatically send the PageUp/PageDown keys to the underlying application." : "Determines the type of vertical scrollbar used to scroll through records within the grid. A sliding scrollbar scrolls freely, while a paging scrollbar scrolls one page of records at a time only.") },
      { name: "scroll tool tip", choices: ["none", "row number", "row range"], helpDefault: "true", help: "Determines if the row number or the row number range should be displayed in a tool tip when the user scrolls through the data in the grid.", context: "dspf" },
      { name: "propagate scroll events", choices: ["true", "false"], type: "boolean", validDataTypes: ["indicator", "expression"], hideFormatting: true, helpDefault: "false", help: "When this property is false (which is the default) the grid handles any scroll wheel or swipe events sent to it so that they scroll the grid, but not the window that the grid is placed inside. If you enable this property, these events will be propagated, which allows mouse wheel and swipe events to scroll the grid's parent window.", helpAdd: ["other"], context: "dspf" },
      { name: "sortable columns", choices: ["true", "false"], type: "boolean", validDataTypes: ["indicator", "expression"], hideFormatting: true, helpDefault: "false", help: "Enables column sorting. If set to true, the user will be able to click on the column headings to resort the data.", context: "dspf" },
      { name: "default sort order", choices: ["Ascending", "Descending", "Other..."], helpDefault: "Descending", help: "Specifies the default order for sortable columns. When the user clicks a column, the default sort order is used initially. To provide a different sort order for each grid column, select <i>Other...</i> and specify a comma separated list. Entries in the list can be abbreviated using the letter A for Ascending and D for Descending.", helpAdd: ["other"], context: "dspf" },
      { name: "initial sort column", format: "number", helpDefault: "blank", help: 'This property specifies the column used to for initial sorting. Each grid column is identified by a sequential index, starting with 0 for the first column, 1 for the second column, and so on. If this property and the &quot;initial sort field&quot; property are omitted or set to blanks, sorting is not initiated when the grid is first rendered.<p>The value may be a comma-separated list of column numbers, with the first entry being the primary sort, 2nd the 2nd, etc.</p>', context: "dspf" },
      { name: "initial sort field", helpDefault: "blank", help: 'This property specifies the field name used to identify the column for initial sorting. If this property and the &quot;initial sort column&quot; property are omitted or set to blanks, sorting is not initiated when the grid is first rendered.<p>The value may be a comma-separated list of field names, with the first entry being the primary sort, 2nd the 2nd, etc.</p>', hideFormatting: true, validDataTypes: ["char", "varchar"], context: "dspf" },
      { name: "column sort response", format: "number", hideFormatting: true, readOnly: true, validDataTypes: ["zoned","char"], helpDefault: "bind", help: "Specifies a response variable to receive a column number for server-side sorting. If omitted, client-side sorting is used. The response is a numeric value that represents a column in the grid. Each grid column is identified by a sequential index, starting with 0 for the first column, 1 for the second column, and so on. It is the responsibility of the program to keep track of the sort direction, and to display an up or down arrow in the appropriate column using the \"initial sort column\" and \"default sort order\" properties.", context: "dspf" },
      { name: "field name sort response", readOnly: true, helpDefault: "bind", help: "Specifies a response variable to receive a field name used for server-side sorting. If omitted, client-side sorting is used. The response represents the name of the field bound to the first widget in a column of the grid. It is the responsibility of the program to keep track of the sort direction, and to display an up or down arrow in the appropriate column using the \"initial sort field\" and \"default sort order\" properties.", hideFormatting: true, validDataTypes: ["char", "varchar"], context: "dspf" },
      { name: "return sort order", readOnly: true, helpDefault: "bind", help: "Specifies a response variable to receive the selected sort order when the user clicks on one of the sort options in the grid's built-in header context menu. The response variable will be populated with 'A' for ascending, or 'D' for descending. This property is ignored if the grid does not allow column sorting, or if client-side sorting is used.", hideFormatting: true, validDataTypes: ["char"], defaultDataLength: 1, context: "dspf" },
      { name: "sort function", type: "js", helpDefault: "blank", help: "Specifies a custom sort function that will be called. If not specified the grid will sort using built in sorting. The following variables are passed:<br /> &nbsp;&nbsp;<b>value1</b> first field value to compare <br /> &nbsp;&nbsp;<b>value2</b> second field value to compare <br />&nbsp;&nbsp;<b>fieldName</b> name fo the field <br /> &nbsp;&nbsp;<b>isDescending</b> true if sorting in descending sequence, false otherwise <br /> &nbsp;&nbsp;<b>fieldDateFormat</b> date format of the field, if the field is not a date field the value is null <br /> &nbsp;&nbsp;<b>fieldInfo</b> formatting information of the field that the grid is sorted by; if the field does not contain any formatting information, a blank object will be passed instead", context: "dspf"},
      { name: "resizable columns", choices: ["true", "false"], type: "boolean", validDataTypes: ["indicator", "expression"], hideFormatting: true, helpDefault: "false", help: "Allows the user to resize grid columns at run time.", context: "dspf" },
      { name: "movable columns", choices: ["true", "false"], type: "boolean", validDataTypes: ["indicator", "expression"], hideFormatting: true, helpDefault: "false", help: "Allows the user to rearrange grid columns at run time.", context: "dspf" },
      { name: "persist state", choices: ["true", "false", "session only", "program only"], type: "boolean", validDataTypes: ["char", "indicator", "expression"], hideFormatting: true, helpDefault: "false", help: "Specifies whether the grid state should be saved when the user sorts, moves, or resizes columns. When set to true, the state is saved to browser local storage with each user action, and automatically restored the next time the grid is displayed. When set to session only the state is saved to session storage, so the state exists only within the current tab, until it is closed. When set to session only the state is saved to session storage, so the state exists only within the current tab, until it is closed. When set to program only, the grid's state is cleared whenever a program is called for the first time; however, the state is retained through multiple renders while the program is active.", context: "dspf" },
      { name: "find option", choices: ["true", "false"], type: "boolean", validDataTypes: ["indicator", "expression"], hideFormatting: true, helpDefault: "false", help: "Presents an option to search grid data when the grid heading is right-clicked.", context: "dspf" },
      { name: "filter option", choices: ["true", "false"], type: "boolean", validDataTypes: ["indicator", "expression"], hideFormatting: true, helpDefault: "false", help: "Presents an option to filter grid data when the grid heading is right-clicked.", context: "dspf" },
      { name: "hide columns option", choices: ["true", "false"], type: "boolean", validDataTypes: ["indicator", "expression"], hideFormatting: true, helpDefault: "false", help: "Presents an option to hide and show columns for this grid when the grid heading is right-clicked. Defaults to false.", context: "dspf" },
      { name: "row clicked", format: "number",readOnly: true, helpDefault: "bind", help: "Specifies row value clicked in a grid.", context: "dspf"},
      { name: "column clicked", format: "number",readOnly: true, helpDefault: "bind", help: "Specifies column value clicked in a grid.", context: "dspf"},

      //Reset the  browser cache Data for a table
      { name: "reset option", choices: ["true", "false"], type: "boolean", validDataTypes: ["indicator", "expression"], hideFormatting: true, helpDefault: "false", help: "Presents an option to reset the persistent state for this grid when the grid heading is right-clicked.", context: "dspf" },
      { name: "export option", choices: ["true", "false"], type: "boolean", validDataTypes: ["indicator", "expression"], hideFormatting: true, helpDefault: "false", help: "Presents options to export grid data to Excel using the CSV and XLSX formats when the grid heading is right-clicked.", context: "dspf" },
      { name: "export only visible columns", choices: ["true", "false"], type: "boolean", validDataTypes: ["indicator", "expression"], hideFormatting: true, helpDefault: "false", help: "When the 'hide columns option' is set to true, this option determines whether to export only the visible columns or all of the columns. Defaults to false.", context: "dspf" },
      { name: "context menu id", helpDefault: "blank", help: "Specifies the id of a Menu widget used to display a context menu when the user right-clicks a grid row.", hideFormatting: true, validDataTypes: ["char", "varchar"] },
      
      { name: "filter response", hideFormatting: true, validDataTypes: ["char"], helpDefault: "bind", help: "Specifies a response data structure to be received by your program for server-side filtering. Use only for page-at-a-time grids, not for database-driven grids nor load-all grids. "
        + '<p>See <a href="https://docs.profoundlogic.com/x/AIF-Ag" target="_blank">Filter Response Documentation</a></p>'
        + (pui.nodedesigner ? '' : "The data structure should be defined as follows:<pre>Dcl-Ds filterinfo qualified;\n  colnum zoned(3:0) dim(c);\n  fltrtext char(s) dim(c);\nEnd-Ds;</pre>Where <b>c</b> is the value of the 'filter response column max' property, and <b>s</b> is the value of 'filter response text max'. The length should be c(3 + s); e.g. default length of 20 char with 3 column max filters is 69."),
        context: "dspf" },
        
      { name: "filter response text max", format: "number", hideFormatting: true, validDataTypes: ["zoned"], helpDefault: "20", help: "The maximum number of characters to use from a filter expression when server-side filtering is setup by the 'filter response' property. The length of the 'fltrtext' array field in the filter response data structure should be this property's value.", context: "dspf" },
      { name: "filter response column max", format: "number", hideFormatting: true, validDataTypes: ["zoned"], helpDefault: "3", help: "This is the maximum number of columns filtered at once when server-side filtering is setup by the 'filter response' property. This must be between 1 and than the 'number of columns' value, inclusive. Determines the size of the 'filter response' data structure.", context: "dspf" },
      { name: 'show quick filters', choices: ['true', 'false'], type: 'boolean', validDataTypes: ['indicator', 'expression'], hideFormatting: true, help: 'Above each column show a text-box for filtering row data. Enabling this causes a header row to display with the grid. To hide column headings and show quick filters, set &quot;column headings&quot; blank.', helpDefault: 'false', context: 'dspf' },

      { name: "Paging Bar", category: true, context: "dspf" },
      { name: "show paging controls", choices: ["true", "false"], hideFormatting: true, validDataTypes: ["indicator", "expression"], helpDefault: "false", help: "Displays links for navigating to the previous page and the next page of records." },
      { name: "show page number", choices: ["true", "false"], hideFormatting: true, validDataTypes: ["indicator", "expression"], helpDefault: "false", help: "This property determines whether the page number should display within the paging bar.", context: "dspf" },
      { name: "initial page number", format: "number", hideFormatting: true, validDataTypes: ["zoned"], helpDefault: "1", help: "Specifies the initial page number to use when the page number is displayed within the paging bar. If not specified, page number 1 is used.", context: "dspf" },
      { name: "show record number range", choices: ["true", "false"], hideFormatting: true, validDataTypes: ["indicator", "expression"], helpDefault: "false", help: "This property determines whether the record number range should display within the paging bar.", context: "dspf" },
      { name: "show bar", choices: ["true", "false"], hideFormatting: true, validDataTypes: ["indicator", "expression"], helpDefault: "false", help: "Displays a bar at the bottom of the grid even if no paging bar elements are selected to be displayed. This can be used to show miscellaneous information such as column totals.", context: "dspf" },
      { name: "page down condition", validDataTypes: ["indicator", "expression"], hideFormatting: true, readOnly: true, format: "true / false", type: "boolean", helpDefault: "bind", help: "Determines if the next page link is enabled.", context: "dspf" },
      { name: "page down response", format: "1 / 0", readOnly: true, hideFormatting: true, validDataTypes: ["indicator"], helpDefault: "bind", help: "Specifies a boolean response indicator that is returned to your program when the next page link is clicked.", context: "dspf" },
      { name: "page up condition", validDataTypes: ["indicator", "expression"], hideFormatting: true, readOnly: true, format: "true / false", type: "boolean", helpDefault: "bind", help: "Determines if the previous page link is enabled.", context: "dspf" },
      { name: "page up response", format: "1 / 0", readOnly: true, hideFormatting: true, validDataTypes: ["indicator"], helpDefault: "bind", help: "Specifies a boolean response indicator that is returned to your program when the previous page link is clicked.", context: "dspf" },

      { name: "csv export", choices: ["true", "false"], type: "boolean", validDataTypes: ["indicator", "expression"], hideFormatting: true, helpDefault: "false", help: "Displays a link allowing the user to export grid data to Excel using the CSV format." + ((context == "genie" && !pui.usingGenieHandler) ? " <br /><b>Note:</b> In 5250 mode, this option only works with SQL-driven subfiles." : "") },
      { name: "xlsx export", choices: ["true", "false"], type: "boolean", validDataTypes: ["indicator", "expression"], hideFormatting: true, helpDefault: "false", help: "Displays a link allowing the user to export grid data to Excel using the XLSX format." + ((context == "genie" && !pui.usingGenieHandler) ? " <br /><b>Note:</b> In 5250 mode, this option only works with SQL-driven subfiles." : "") },
      { name: "xlsx export pics", choices: ["true", "false"], type: "boolean", validDataTypes: ["indicator", "expression"], hideFormatting: true, helpDefault: "false", help: "Include pictures in the XLSX Export. This option only works for Load-All subfiles.", context: "dspf" },
      { name: "export file name", helpDefault: "blank", help: "Defines the name of the download file used to export grid data to CSV or XLSX formats. The .xlsx or .csv extension is automatically appended to the name. If omitted, the grid name is used." + ((context == "genie" && !pui.usingGenieHandler) ? " <br /><b>Note:</b> In 5250 mode, this option only works with SQL-driven subfiles." : ""), translate: true },
      { name: "export with headings", choices: ["true", "false"], type: "boolean", validDataTypes: ["indicator", "expression"], hideFormatting: true, helpDefault: "false", help: "Specifies whether subfile headings should be exported as the first row of the CSV file." + ((context == "genie" && !pui.usingGenieHandler) ? " <br /><b>Note:</b> In 5250 mode, this option only works with SQL-driven subfiles." : "") },

      { name: "Row Folding", category: true, context: "dspf", ddsCompatProp: 1 },
      { name: "fold multiple", choices: ["2", "3", "4", "Other..."], helpDefault: "blank", help: "The property determines the height of a collapsed row, which is calculated at by taking the row height property and dividing it by the fold multiple.  The multiple represents the number of collapsed rows that can fit into one expanded row.", helpAdd: ["other"], bind: false, context: "dspf", ddsCompatProp: 1 },
      { name: "expanded", choices: ["true", "false"], hideFormatting: true, validDataTypes: ["indicator", "expression"], helpDefault: "false", help: "Determines if the rows are first displayed in expanded (also known as folded) mode." + (pui.viewdesigner ? "" : "  This property is similar to the SFLFOLD keyword."), context: "dspf", ddsCompatProp: 1 },
      { name: "collapsed", choices: ["true", "false"], hideFormatting: true, validDataTypes: ["indicator", "expression"], helpDefault: "false", help: "Determines if the rows are first displayed in collapsed (also known as truncated) mode." + (pui.viewdesigner ? "" : "  This property is similar to the SFLDROP keyword."), context: "dspf", ddsCompatProp: 1 },
      { name: "return mode", format: "1 / 0", readOnly: true, hideFormatting: true, validDataTypes: ["char", "indicator"], helpDefault: "bind", help: "This property can be bound to a field that will provide an indication of whether the grid rows were in expanded (also known as folded) mode or in collapsed (also known as truncated) mode on input." + (pui.viewdesigner ? "" : "  It represents the SFLMODE keyword. The bound field will contain a value of 0 if the grid rows are in expanded mode and a value of 1 if the grid rows are in collapsed mode."), context: "dspf", ddsCompatProp: 1 },
      { name: "single row zoom", choices: ["true", "false"], hideFormatting: true, validDataTypes: ["indicator", "expression"], helpDefault: "false", help: "Determines if a zoom icon is shown on collapsed rows. Once the user clicks the icon, the row is expanded. All other rows remain collapsed.", context: "dspf", ddsCompatProp: 1 },
      { name: "tree level field", helpDefault: "blank", help: 'This property must be bound to a numeric field which contains the tree level of each grid record. Each higher level record that has lower level records below it would be collapsible.', hideFormatting: true, validDataTypes: ["zoned"], context: "dspf" },
      { name: "tree level column", format: "number", helpDefault: "blank", help: 'This property specifies the column used to expand and collapse the tree levels, if property "tree level field" is specified. The default is column 0. Each grid column is identified by a sequential index, starting with 0 for the first column, 1 for the second column, and so on. Note that if this property is specified, then property "tree level field" must also be specified.', hideFormatting: true, validDataTypes: ["zoned"], context: "dspf" },
      { name: "tree level collapsed", choices: ["true", "false"], hideFormatting: true, validDataTypes: ["indicator", "expression"], helpDefault: "false", help: "Determines if the rows in a grid tree are first displayed in collapsed mode.", context: "dspf"},
      
      { name: "Grid Data", category: true },
      { name: "remote system name", bind: true, uppercase: (pui.nodedesigner !== true), helpDefault: "Local", help: "Name of database where file is located. Used only if data to be retrieved is stored on a remote server.", controls: ["textbox", "combo box", "select box", "grid", "chart", "image"], nodedesigner: false},
      { name: "database connection", type: "database_connection", bind: true, hideFormatting: true, validDataTypes: ["string"], choices: pui.getDatabaseConnectionPropertyChoices, blankChoice: false, helpDefault: "[default connection]", help: "Name of the database connection to use. If not specified, the default connection is used. This property is ignored if the applcation is called from a Profound UI / Genie session. In that case, the *LOCAL IBM i database is used.<br /><br />See <a href=\"https://docs.profoundlogic.com/x/sgDrAw\" target=\"_blank\">here</a> for instructions on configuring database connections.", context: "dspf", nodedesigner: true, viewdesigner: false},
      { name: "database file", displayName: (pui.nodedesigner ? "database table" : undefined), type: "file", multOccur: (context=="dspf"), uppercase: (pui.nodedesigner !== true), helpDefault: "blank", help: "Database file to use for a grid that is tied directly to a database. You can specify a 'database file' or 'library/database file'. If library is omitted, the session's library list is used." },
      { name: "database join", type: "join", bind: false, helpDefault: "blank", help: "The Database Join specifications between multiple tables to be used for a dynamic, database-driven grid.", controls: ["chart", "grid"], context: "dspf" },
      { name: "database fields", type: "field", multiple: true, uppercase: (pui.nodedesigner !== true), helpDefault: "blank", help: "A set of database field names to use to retrieve the data for a database-driven grid. The field names should be comma separated.", hasOKHandler: true},
      { name: "selection criteria", type: "long", helpDefault: "blank", help: "Optional expression identifying which records should be retrieved from the database file." },
      { name: "order by", type: "field", multiple: true, uppercase: true, helpDefault: "blank", help: "Optional expression identifying which fields determine the order of the records retrieved from the database file." },
      { name: "custom sql", type: "long", helpDefault: "blank", help: "Specifies a sql statement to use to retrieve the records for a database-driven grid.",  hasOKHandler: true },

      { name: "allow any select statement", type: "boolean", choices: ["true", "false"], validDataTypes: ["indicator", "expression"], hideFormatting: true, helpDefault: "false", help: "Allows any valid SELECT SQL statement.<p>If this is <b>false</b> (default), a row count is retrieved by running SELECT COUNT(*) FROM (<b><i>your-custom-sql-property</i></b>), so your \"custom sql\" property must work with that syntax. This prevents the use of common table expressions, the optimize clause, and a few other things.</p><p>If set to <b>true</b>, the row count will be determined by running your statment as-is and looping through all rows to count them.</p><p><b>Note:</b> False performs better, but true allows a wider variety of SQL statements.</p>" },
      { name: "parameter value", type: "long", secLevel: 1, multOccur: true, helpDefault: "blank", help: "Value for parameter marker in \"selection criteria\" or \"custom sql\" property. Parameter markers are specified using a question mark. Profound UI will accept values from the client for any parameter marker values which are not bound to program fields. Parameter markers are numbered in order of occurrence, from left to right. To specify multiple parameter marker values, right-click the property and select Add Another Parameter Value." },
      { name: "load fields into widgets", type: "boolean", choices: ["true", "false"], validDataTypes: ["indicator", "expression"], hideFormatting: true, helpDefault: "false", help: "Allows fields from database-driven grids to be bound to widgets instead of loaded directly onto the grid", context: "dspf"},
      { name: "load all rows", type: "boolean", choices: ["true", "false"], validDataTypes: ["indicator", "expression"], hideFormatting: true, helpDefault: "false", help: "Can only be used when \"load fields into widgets\" property is true. Loads all data at once, instead of page-by-page.", context: "dspf"},

      { name: "data url", type: "long", helpDefault: "blank", help: "Sets the url to a Web service that returns JSON data for a database-driven grid." },
      { name: "data transform function", type: "long", helpDefault: "blank", help: "The name of a JavaScript function to be called to process the results of the \"data url\" program. This can be used to transform data from the program into the format expected by the grid widget." },

      { name: "Grid Data from Screen", category: true, context: "genie-nohandler" },
      { name: "starting row", helpDefault: "blank", help: "Specifies the starting subfile row for retrieving data from the screen.", context: "genie-nohandler" },
      { name: "ending row", helpDefault: "blank", help: "Specifies the ending subfile row for retrieving data from the screen.", context: "genie-nohandler" },
      { name: "data columns", type: "list", helpDefault: "blank", help: "Specifies a comma separated list of column numbers for retrieving data from the screen.", context: "genie-nohandler" },

      { name: "Translations", category: true, context: "dspf", nodedesigner: false }, 
      { name: "grid row translation placeholders", type: "translationplaceholders", readOnly: true, bind: false, helpDefault: "bind", help: "Define replacement values for the placeholders in translations.", relatedProperties: ["grid row translation placeholder key", "grid row translation placeholder value"], canBeRemoved: false, context: "dspf", nodedesigner: false }, 
      { name: "grid row translation placeholder key", label: "Placeholder Key", multOccur: true, hide: true, bind: false, help: "", context: "dspf", nodedesigner: false }, 
      { name: "grid row translation placeholder value", label: "Placeholder Value",  multOccur: true, hide: true, help: "", context: "dspf", nodedesigner: false },

      { name: "Position", category: true },
      { name: "left", format: "px", helpDefault: "position", help: "Represents the x-coordinate of the current element.", canBeRemoved: false },
      { name: "top", format: "px", helpDefault: "position", help: "Represents the y-coordinate of the current element.", canBeRemoved: false },
      { name: "right", format: "px", helpDefault: "position", help: "Position of the element from the right of the screen" + ((context == "genie") ? "." : " or layout container."), canBeRemoved: false },
      { name: "bottom", format: "px", helpDefault: "position", help: "Position of the element from the bottom of the screen" + ((context == "genie") ? "." : " or layout container."), canBeRemoved: false },
      { name: "height", helpDefault: "css", help: "Height of the grid. When the &quot;expand to layout&quot; grid property is true, this is set automatically. Changing &quot;header height&quot; changes this automatically. Changing this causes &quot;row height&quot; to change.", bind: false, canBeRemoved: false },
      { name: "width", helpDefault: "css", help: "Width of the grid.", bind: false, canBeRemoved: false },
      { name: "expand to layout", choices: ["true", "false"], helpDefault: "false", help: "If set to true, the grid will automatically expand to the full size of a layout container.", context: "dspf", bind: false },
      { name: "z index", format: "number", helpDefault: "css", help: "The stacking order of the current element, expressed as an integer value. The element with the higher z index will overlay lesser elements." },
      { name: "locked in place", choices: ["true", "false"], helpDefault: "false", help: "If set to true, the grid cannot be moved or sized in the Visual Designer.", bind: false },

      { name: "Drag and Drop", category: true, context: "dspf" },
      { name: "allow drag", choices: ["true", "false"], type: "boolean", validDataTypes: ["indicator", "expression"], hideFormatting: true, helpDefault: "false", help: "This property determines if rows within the grid can be drag and dropped.", context: "dspf" },
      { name: "ondragstart", type: "js", helpDefault: "blank", help: "Initiates a client-side script when the user first starts to drag a row within the grid. Information about the drag and drop operation is provided using the global pui.dragDropInfo object.", context: "dspf" },
      { name: "drop targets", type: "list", helpDefault: "blank", help: "Specifies a list of target element id's, which indentify where the row can be dropped.", context: "dspf" },
      { name: "ondragenter", type: "js", helpDefault: "blank", help: "Initiates a client-side script when the user drags a row over a valid drop target. Information about the drag and drop operation is provided using the global pui.dragDropInfo object.", context: "dspf" },
      { name: "ondragleave", type: "js", helpDefault: "blank", help: "Initiates a client-side script when the user moves a row out of a valid drop target during a drag operation. Information about the drag and drop operation is provided using the global pui.dragDropInfo object.", context: "dspf" },
      { name: "ondrop", type: "js", wf: true, helpDefault: "blank", help: "Initiates a client-side script when the mouse is released during a drag and drop operation. Information about the drag and drop operation is provided using the global pui.dragDropInfo object.", context: "dspf" },

      { name: "Tabs", category: true },
      { name: "parent tab panel", helpDefault: "blank", help: "This property specifies the id of the Tab Panel to which this element belongs. The property is set automatically when you drag and drop the element onto a Tab Panel.", bind: false },
      { name: "parent tab", helpDefault: "blank", help: "This property specifies the tab index of the specific tab to which this element belongs. Each tab within a Tab Panel is identified by a sequential index, starting with 0 for the first tab, 1 for the second tab, and so on. The property is set automatically when you drag and drop the element onto a Tab Panel.", bind: false },
      { name: "parent field set", helpDefault: "blank", help: "This property specifies the if of the Field Set Panel to which this element belongs. The property is set automatically when you drag and drop the element onto a Field Set Panel.", bind: false },

      { name: "Borders", category: true },
      { name: "border color", type: "color", helpDefault: "css", help: "The color of the grid's outer borders and inner separators." },
      { name: "border width", format: "px", choices: ["0px", "1px", "2px", "3px", "4px", "5px", "Other..."], helpDefault: "css", help: "The thickness of the grid's outer borders and inner separators.", helpAdd: ["other"] },

      { name: "Padding", category: true },
      { name: "padding bottom", format: "px", choices: ["0px", "1px", "2px", "3px", "4px", "5px", "6px", "7px", "8px", "9px", "Other..."], helpDefault: "css", help: "Sets the distance between the bottom edge of a grid cell and the cell's content.", helpAdd: ["other"] },
      { name: "padding left", format: "px", choices: ["0px", "1px", "2px", "3px", "4px", "5px", "6px", "7px", "8px", "9px", "Other..."], helpDefault: "css", help: "Sets the distance between the left edge of a grid cell and the cell's content.", helpAdd: ["other"] },
      { name: "padding right", format: "px", choices: ["0px", "1px", "2px", "3px", "4px", "5px", "6px", "7px", "8px", "9px", "Other..."], helpDefault: "css", help: "Sets the distance between the right edge of a grid cell and the cell's content.", helpAdd: ["other"] },
      { name: "padding top", format: "px", choices: ["0px", "1px", "2px", "3px", "4px", "5px", "6px", "7px", "8px", "9px", "Other..."], helpDefault: "css", help: "Sets the distance between the top edge of a grid cell and the cell's content.", helpAdd: ["other"] },

      { name: "Misc", category: true },
      { name: "css class", type: "cssClass", multOccur: (context == "dspf" ? true : false), attribute: "class", helpDefault: "widget", help: "Defines a custom cascading style sheet class to assign to the element." + (context == "dspf" ? "  To specify multiple classes, right-click the property and select Add Another CSS Class." : "") },
      { name: "tool tip", type: "long", helpDefault: "blank", help: "Defines the text to appear in a tool tip when the user hovers the mouse over this element.", translate: true },
      { name: "user defined data", multOccur: true, helpDefault: "blank", help: "Specifies user-defined general purpose data associated with the widget. To provide multiple user defined data values, right-click the property and select Add Another User Defined Value." },
      { name: "visibility", format: "visible / hidden", choices: ["hidden", "visible"], helpDefault: "css", help: "Determines whether the element is visible or hidden." },

      { name: "Events", category: true },
      { name: "ondbload", type: "js", helpDefault: "blank", help: "Initiates a client-side script when database data is loaded for a database-driven widget. An object named <b>response</b> will be defined that contains:<ul><li><b>success</b> - boolean true/false</li><li><b>id</b> - the widget id</li><li><b>error</b> - an object with \"id\", \"text\" and \"text2\" fields containing the error.</li></ul>" },
      { name: "onfilterchange", type: "js", helpDefault: "blank", help: "Initiates a client-side script when the filter has changed.", bind: false, context: "dspf" },
      { name: "onrowclick", wf: true, type: "js", helpDefault: "blank", help: "Initiates a client-side script when a row within the grid is clicked. The script can determine the row number using the <b>row</b> variable.", bind: false },
      { name: "onrowdblclick", wf: true, type: "js", helpDefault: "blank", help: "Initiates a client-side script when a row within the grid is double-clicked. The script can determine the row number using the <b>row</b> variable.", bind: false },
      { name: "onrowmouseover", type: "js", helpDefault: "blank", help: "Initiates a client-side script when the mouse is moved over a row within the grid. The script can determine the row number using the <b>row</b> variable.", bind: false },
      { name: "onrowmouseout", type: "js", helpDefault: "blank", help: "Initiates a client-side script when the mouse is moved off of a row within the grid. The script can determine the row number using the <b>row</b> variable.", bind: false },
      { name: "onpagedown", wf: true, type: "js", helpDefault: "blank", help: "Initiates a client-side script when the user pages down using the grid's scrollbar or the grid's paging bar. To prevent the grid's default paging action, the script must evaluate to <i>false</i>.", bind: false },
      { name: "onpageup", wf: true, type: "js", helpDefault: "blank", help: "Initiates a client-side script when the user pages up using the grid's scrollbar or the grid's paging bar. To prevent the grid's default paging action, the script must evaluate to <i>false</i>.", bind: false },
      { name: "onscroll", type: "js", helpDefault: "blank", help: "Initiates a client-side script when the user scrolls using the grid's scrollbar. The <b>row</b> variable in the script provides the top row of the grid.", bind: false }
    ];

    //Remove remote server property if PJS. Not yet ready to implement.
    if (pui.nodedesigner === true) {
      var elemIndex = model.map( function(elem) {
        return elem.name;
      }).indexOf("remote system name");

      model.splice(elemIndex, 1);
    }
    
    return model;  
};

/**
 * Handle request to get field listings for "custom sql" property change after user clicks OK on dialog.
 * @param {RPGspRequest} request
 */
pui.Grid.prototype.customSqlCallback = function (request) {
  var response, error;
  var headings = "", columnWidths = "";
  var itm = this.tableDiv.designItem;

  if (request.getStatus() != 200) {
    error = "HTTP " + request.getStatus() + " - " + request.getStatusText() + ".";
  }
  else {
    try {
      response = eval("(" + request.getResponseText() + ")");
    }
    catch(e) {
      error = "The server response is missing or invalid."; // Invalid JSON response.
    }
    if (error == null && response.success != true) { // Program-reported error.
      error = response.errorText;
    }
  }
  if (error != null) {
    pui.alert("Unable to retrieve field listing:\n" + error);
    return;
  }
  for (var i = 0; i < response.fields.length; i++) {
    if (headings != '') {
      headings += ',';
    }
    headings += trim(response.fields[i]["DB2_LABEL"]) 
             || trim(response.fields[i]["DB2_COLUMN_NAME"]) 
             || trim(response.fields[i]["DB2_SYSTEM_COLUMN_NAME"]);

    if (columnWidths != '') {
      columnWidths += ',';
    }
    // this is just an estimated width...doesn't have to be exact
    columnWidths += (parseInt(response.fields[i]["LENGTH"]) * 10);
  }
  this.setProperty("column headings", headings);
  this.sendPropertyToDesigner(itm, "column headings", headings);
  itm.designer.propWindow.refreshProperty("column headings");

  this.setProperty("number of columns", response.fields.length);
  this.sendPropertyToDesigner(itm, "number of columns", response.fields.length);
  itm.designer.propWindow.refreshProperty("number of columns");

  this.setProperty("column widths", columnWidths);
  this.sendPropertyToDesigner(itm, "column widths", columnWidths);
  itm.designer.propWindow.refreshProperty("column widths");
};

/**
 * Handle when a user clicked OK on a Properties Window dialog editing properties that have "hasOKHandler: true". Test cases see 5613.
 * @param {String} propName
 * @param {String} value
 */
pui.Grid.prototype.propDialogOnOK = function(propName, value){
  switch (propName){
    case 'custom sql':
      if (confirm("Adjust grid based on columns?")){
        var parm = { "customSql": value };
        if (pui.nodedesigner && typeof this["dataProps"]["database connection"] === "string")
          parm["connection"] = trim(this["dataProps"]["database connection"]);
        pui.getFieldDescriptions(parm, this.customSqlCallback.bind(this) );
      }
      break;

    case 'database fields':
      if (confirm("Update grid columns?")){
        // update the column headings
        this.setProperty("column headings", value);
        var itm = this.tableDiv.designItem;
        this.sendPropertyToDesigner(itm, "column headings", value);
        itm.designer.propWindow.refreshProperty("column headings");
        // update the number of columns based on the number of headings
        var count = value.split(',').length;
        this.setProperty("number of columns", count);
        this.sendPropertyToDesigner(itm, "number of columns", count);
        itm.designer.propWindow.refreshProperty("number of columns");
      }
      break;
  }
};

/**
 * When the grid contains any hidden rows, iterate over the rendered rows, skipping hidden ones, calling callbacks for visible rows.
 * Pre-Conditions: this.recNum > 0 && this.rowsHidden > 0;
 * Test Cases: see issue 6391.
 * @param {Function|undefined} visCb    A function with parameters: "dataArrayIndex" and "row", the visible DOM row; gets called for visible rows.
 * @param {Number|undefined} findRow    The number of a visible DOM row to find.
 * @param {Function|undefined} foundCb  Called when "row" is found. parameters: "dataArrayIndex" and "rowNum", the found row.
 */
pui.Grid.prototype._unhiddenRowIter = function(visCb, findRow, foundCb){
  var rowHdrOffset, idxHdrOffset, numRows = this.hLines.length - 1;
  if (this.hasHeader){
    rowHdrOffset = 1;
    idxHdrOffset = 0;
  }
  else {
    rowHdrOffset = 0;
    idxHdrOffset = 1;
  }
  
  if (this.recNum > 0 && this.rowsHidden > 0){
    var dataArray = this.isFiltered() ? this.visibleDataArray : this.dataArray;
    var dataArrayOffset = this.recNum - 1;
    var hiddenRows = 0, visibleRows = 0;
    var rowNum = rowHdrOffset;
    // Start from the first visible record, look at all visible records, calling "cb".
    for (var i=dataArrayOffset; i < dataArray.length && i < numRows + dataArrayOffset + hiddenRows; i++){
      var record = dataArray[i];
      if (record){
        if (record.hideRow === true){
          hiddenRows++;      //Skip ahead past hidden records.
        }
        else {
          visibleRows++;
          if (typeof visCb == 'function') visCb(i, rowNum, visibleRows, hiddenRows);
          rowNum++;
        }

        if (findRow >= 0 && visibleRows == findRow + idxHdrOffset && typeof foundCb == 'function'){
          foundCb(i, rowNum);
          break;
        }
      }
    }
  }
};

/**
 * Given a visible row number, return the index in this.dataArray or this.visibleDataArray whose record maps to the row.
 * @param {Number} row  The row number. If there is no header, then 0 is the first row, 1 is the 2nd, etc. Else, 1 is the first data row, 2 is the 2nd, etc.
 * @returns {Number}    Returns -1 if this.recNum is not set; else, index of this.dataArray matching row.
 */
pui.Grid.prototype._getDataIndexFromDOMRow = function(row){
  var dataArrayIdx = -1;
  if (this.recNum > 0){
    var dataArrayOffset = this.recNum - 1;    
    var headerDiff = this.hasHeader ? 1 : 0;
    if (this.rowsHidden == 0){
      dataArrayIdx = row + dataArrayOffset - headerDiff;
    }
    else {
      // Find the index for the specified row and stop looping.
      this._unhiddenRowIter(null, row, function(idx){
        dataArrayIdx = idx;
      });
    }
  }
  return dataArrayIdx;
};

/**
 * Set row backgrounds of all visible rows. Handle hidden rows.
 */
pui.Grid.prototype._setAllVisibleBackgrounds = function(){
  if (this._setAllVisibleBackgroundsCbBound == null){
    this._setAllVisibleBackgroundsCbBound = this._setAllVisibleBackgroundsCb.bind(this); //Ensure the callback can reach "this".
  }
  
  var numRows = this.hLines.length - 1;
  if (this.recNum > 0 && this.rowsHidden > 0){
    this._unhiddenRowIter(this._setAllVisibleBackgroundsCbBound);
  }
  else {
    for (var i = (this.hasHeader ? 1 : 0); i < numRows; i++){
      this.setRowBackground(i);
    }
  }
};
pui.Grid.prototype._setAllVisibleBackgroundsCb = function(dataArrayIndex, row){
  this.setRowBackground(row, false, dataArrayIndex);
};

pui.Grid.prototype._headerHeightChange = function(){
  if (this.hasHeader && this.hLines.length >= 2){
    this.hLines[0].style.top = (parseInt(this.hLines[1].style.top) - this.headerHeight) + "px";
    this._setLineTops();
    this._setLineHeights();
    if (this.designMode) this.sizeAllCells();
    this._positionIcons();
    this.setScrollBar();
    this.sendToDesigner();
  }
};

pui.Grid.prototype._stopProp = function(e){
  e.stopPropagation();
};