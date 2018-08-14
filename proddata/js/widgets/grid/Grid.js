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
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
//  GNU Lesser General Public License for more details.
//
//  You should have received a copy of the GNU Lesser General Public License
//  In the COPYING and COPYING.LESSER files included with the Profound UI Runtime.
//  If not, see <http://www.gnu.org/licenses/>.




/**
 * Grid Class
 * @constructor
 */

pui.Grid = function () {
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
  this.dataArray = [];
  this.filteredDataArray = [];
  this.fieldNames = [];
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

  this.rowHeight = 23;
  this.headerHeight = 46;
  //if (context == "dspf") {
  this.rowHeight = 26;
  this.headerHeight = 30;
  //}
  this.hasHeader = true;
  this.sortable = false;
  this.sorted = false;
  this.sortBy = null;
  this.hoverEffect = false;
  if (context == "dspf" || pui.usingGenieHandler) this.hoverEffect = true;
  this.pagingScrollBar = true;
  this.slidingScrollBar = false;
  if (context == "dspf" || pui.usingGenieHandler) {
    this.pagingScrollBar = false;
    this.slidingScrollBar = true;
  }

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

  this.dataProps = {};

  this.paddingProps = {};

  this.events = {};

  this.designMode = false;
  this.lockedInPlace = false;
  this.dragging = false;
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
  this.movableColumns = movableColumns;
  this.hidableColumns = false;
  this.resetOption = false;
  this.exportOption = null;

  this.expandToLayout = false;
  this.dontSelect = false;

  this.selectionEnabled = false;
  this.singleSelection = false;
  this.extendedSelection = false;
  this.selectionField = null;
  this.selectionFieldIndex = null;
  this.selectionValue = "1";
  this.selectedRecordNum = null;

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
  this.initialSortColumn = null;
  this.initialSortField = null;
  this.columnSortResponse = null;
  this.fieldNameSortResponse = null;
  this.contextMenuId = null;

  this.dataConsumed = false;

  this.initialPageNumber = 1;

  this.ffbox = new pui.FindFilterBox();
  this.ffbox.container = pui.runtimeContainer;
  if (this.ffbox.container == null) this.ffbox.container = document.body; // this would occur in design mode, where the ffbox is not used
  this.ffbox.init();

  this.highlighting = {
    columnId: 0,
    col: 0,
    text: ""
  };

  this.propagateScrollEvents = false;
  this.getCurrentColumnFromId = getCurrentColumnFromId;

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
  var movableColumns = false;
  var resizableColumns = false;
  var columnSignature;
  var clientSortColumnId;
  var customGridSortFunction; 

  var headerCellProxy;
  var headerCellProxyContainer;
  var columnPointer;

  var maskCover = null;

  // Prevent filtering too quickly on dataGrids. Grid state can get buggy if you change
  // filters while a prior AJAX request has been sent but the response is not received.
  var waitingOnRequest = false;

  var dataGridDidInitialSort = false; //Becomes true after setting up initial sort column in getData.
  var dataGridDidRestoreState = false; //Becomes true after restoring datagrid state in getData.

  // These three members are only for data grids. They are passed to the CGI program.
  var findText;
  var findColumn;
  var findStartRow;

  var ondbload = null;

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
          me.removeRow();
          me.doExpandToLayout();
          me.selectMe();
        }
      };
    }
    if (addColumnIcon == null) {
      addColumnIcon = createIcon("plus", "Add New Column");
      addColumnIcon.onclick = function () {
        var itm = me.tableDiv.designItem;
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
            if (!String.prototype.trim) {
              String.prototype.trim = function () {
                return this.replace(/^\s+|\s+$/gm, '');
              };
            }
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
    me.sendToDesigner();
  };

  this.doExpandToLayout = function (force) {
    if (!force) {
      if (me.designMode && toolbar.loadingDisplay) return;
    }
    if (!me.expandToLayout) return;
    var container = me.tableDiv.parentNode;
    if (container.getAttribute("container") != "true") return;
    var width = container.offsetWidth;
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

    var height = container.offsetHeight;
    if (me.hasHeader) height -= me.headerHeight;
    if (me.pagingBar) height -= me.pagingBar.getHeight();
    var numRows = height / me.rowHeight;
    if (me.hasHeader) numRows += 1;
    numRows = parseInt(numRows);
    if (numRows < 1) numRows = 1;
    me.dontSelect = true;

    // If the active element prior to this event
    // is a subfile element, save it's position
    // and move the focus to a temporary
    // input field, if the gridExpanding 
    // flag is false
    var activeEl = document.activeElement;
    var proxyEl = null;
    var focusedEl = null;
    var gridExpanding = false;
    if (me.cells.length < numRows) {
      gridExpanding = true;
    }

    var timeoutDuration = 1;

    if (activeEl && activeEl.subfileRow && !gridExpanding && pui['is_android']) {
      proxyEl = document.createElement('input');
      proxyEl.type = activeEl.type;
      if (proxyEl.type == "number") {
        timeoutDuration = 1000;
      }
      proxyEl.style.position = 'absolute';
      proxyEl.style.left = '0px';
      proxyEl.style.top = '0px';
      proxyEl.style.opacity = 0;
      proxyEl.id = 'proxyEl';
      focusedEl = activeEl;
      document.body.appendChild(proxyEl);
      proxyEl.focus();

      var firstRowNumber = me.cells[0][0].firstChild.subfileRow;
      if (firstRowNumber <= activeEl.subfileRow && firstRowNumber + numRows > activeEl.subfileRow) {
        me.recNum = firstRowNumber;
      }
      else{
        me.recNum = activeEl.subfileRow;
      }
    }
    else if(me.scrollbarObj != null ){
      me.scrollbarObj.setScrollTopToRow(me.recNum);
    }


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

    // If the temporary input field variable exists
    // we need to focus on the subfile element that previously had
    // focus, and we need to remove the temporary input field variable
    // We use a timeout to avoid certain keyboard errors on android devices
    // where the numeric keyboard is "detached"
    setTimeout(function () {
      if (focusedEl && proxyEl && !gridExpanding && pui['is_android']) {
        focusedEl.focus();
        proxyEl.parentNode.removeChild(proxyEl);
      }
    }, timeoutDuration);
  };

  this.isInitCollapsed = function () {
    if (me.foldMultiple <= 1) return false;
    var collapsed = me.initCollapsed;
    if (me.initExpanded == true) collapsed = false; // initExpanded overrides initCollapsed
    if (me.initCollapsed == null && me.initExpanded == false) collapsed = true;
    if (collapsed == null) collapsed = false;
    return collapsed;
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
        me.removeRow();
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
      var width = parseInt(me.tableDiv.style.width);
      if (me.slidingScrollBar || me.pagingScrollBar) width = width - 21;
      me.zoomDiv.style.width = width + "px";
      me.zoomDiv.style.height = (me.rowHeight * me.foldMultiple) + "px";
      me.zoomDiv.style.border = "1px solid #1541c4";
      me.zoomDiv.style.overflow = "hidden";
      me.zoomDiv.style.position = "absolute";
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
    me.zoomDiv.innerHTML = "";
    me.zoomDiv.className = me.tableDiv.className;
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
    if (me.designMode) return;
    if (fileName == null) fileName = me.exportFileName;
    if (fileName == null || fileName == "") fileName = me.tableDiv.id;

    if (me.isDataGrid()) {
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
    var boundDate = [];
    var imageData = [];    
    var hyperlinks = [];
    
    var totalColumns = me.vLines.length - 1;
    if (me.hidableColumns && !me.exportVisableOnly) {
      totalColumns = me.columnInfo.length;
      var sortedColumnInfo = me.columnInfo.sort(function(a, b){
        return a["columnId"] - b["columnId"];
      });
    }
    for (var i = 0; i < totalColumns; i++) {
      columnArray.push(-1);
      numericData.push(false);
      graphicData.push(false);
      boundVisibility.push(false);
      boundDate.push(false);
      imageData.push(false);
      hyperlinks.push(false);
    }

    var tempformats = [];
    var colcount = 0;

    // go through all grid elements, retrieve field names, and identify data index by field name
    for (var i = 0; i < me.runtimeChildren.length; i++) {
      var itm = me.runtimeChildren[i];
      if (itm["visibility"] != "hidden") {
        var col = Number(itm["column"]);
        if (me.hidableColumns && !me.exportVisableOnly) col = itm["columnId"];
        if (!isNaN(col) && col >= 0 && col < columnArray.length && columnArray[col] == -1) {
          if (pui.isBound(itm["visibility"])) {
            boundVisibility[col] = itm["visibility"];
          }
          var val = itm["value"];
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
              for (var j = 0; j < me.fieldNames.length; j++ ) {
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
            for (var j = 0; j < me.fieldNames.length; j++) {
              if (fieldName == me.fieldNames[j]) {
                columnArray[col] = j;
                if (exportXLSX)
                  tempformats[col] = val;
                colcount++;
                if (val["formatting"] == "Number") {
                  numericData[col] = true;
                }
                else if(val["formatting"] == "Date"){
                  boundDate[col] = val; //Save this info so we can format later.
                }
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

    var data = ""; //CSV data.
    var worksheet;
    var workbook;
    var drawing;
    var hyperlinksXL = [];
    var useDrawing = false;
    var useHyperlinks = false;
    if (exportXLSX){
      workbook = new pui.xlsx_workbook();
      worksheet = new pui.xlsx_worksheet(colcount);
      worksheet.setDefaultRowHeight( me.rowHeight );
      if (me.hidableColumns && !me.exportVisableOnly) {
        worksheet.setColumnWidths(sortedColumnInfo.map(function(col){
           return col["orginalWidth"]; 
        }));
      } else {
        worksheet.setColumnWidths( me.getColumnWidths().split(",") );
      }
      drawing = new pui.xlsx_drawing();
      colcount = 0;
      // Look at each column containing a value, set the format. Use same order that cell values will use.
      for (var i = 0; i < columnArray.length; i++) {
        if (columnArray[i] > -1) {
          worksheet.setColumnFormat(colcount, tempformats[i]); //pass data type, decPos, etc.
          colcount++;
        }
      }
      tempformats = null;
    }

    //Build cell headings.
    if (me.hasHeader && me.exportWithHeadings) {
      if (exportXLSX) worksheet.newRow();
      for (var i = 0; i < columnArray.length; i++) {
        var idx = columnArray[i];
        if (idx > -1) {
          var heading = "";
          if (me.hidableColumns && !me.exportVisableOnly) heading = sortedColumnInfo[i]["name"];
          else heading = getInnerText(me.cells[0][i]);
          if (exportXLSX) worksheet.addCell(rtrim(heading), "char" );
          heading = heading.replace(/"/g, '""');  // "  encode quotes
          heading = heading.replace("\n", "");  // chrome appends new line chars at the end of the heading when using getInnerText()
          heading = heading.replace("\r", "");
          if (data != "") data += delimiter;
          data += '"' + heading + '"';
        }
      }
    }

    data = "\uFEFF" + data;

    // build csv data    
    var dataRecords = me.dataArray;
    if (me.isFiltered()) dataRecords = me.filteredDataArray;
    for (var i = 0; i < dataRecords.length; i++) {
      var line = "";
      var record = dataRecords[i];

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

      for (var j = 0; j < columnArray.length; j++) {
        var forceDate = false;
        var idx = columnArray[j];
        if (idx > -1) {
          var value = record[idx];
          
          if (hyperlinks[j] != null && hyperlinks[j].value != null){
            // value was a hard-coded href link, use it as cell text.
            value = hyperlinks[j].value;
          }
          
          if (graphicData[j]) {
            value = pui.formatting.decodeGraphic(value);
          }
          var xlsxvalue = value; //XLSX can't use "," as decimal separator and needn't escape '"'.
          if (numericData[j] && pui.appJob != null && (pui.appJob["decimalFormat"] == "I" || pui.appJob["decimalFormat"] == "J")) {
            value = value.replace('.', ',');
          }
          else if (typeof boundDate[j] === "object" && boundDate[j] != null ){
            // Format CSV date same as rendered date; "0001-01-01" becomes "".
            value = pui.evalBoundProperty(boundDate[j], fieldData, me.ref);
            xlsxvalue = value;
            forceDate = true; //Even if the data type is not date, make sure it is formatted as a date.
          }

          //Convert value and xlsxvalue to Strings incase they are numbers #4085
          if (typeof value === 'number') value = String(value);
          if (typeof xlsxvalue === 'number') xlsxvalue = String(xlsxvalue);

          value = value.replace(/"/g, '""'); // "
          if (boundVisibility[j] !== false) {
            if (pui.evalBoundProperty(boundVisibility[j], fieldData, me.ref) == "hidden") {
              value = "";
              xlsxvalue = "";
            }
          }
          if (line != "") line += delimiter;
          line += '"' + rtrim(value) + '"';
          
          if (exportXLSX){
            
            if (typeof imageData[j] == "object" && imageData[j] != null){   //The cell data is an image.
              useDrawing = true;
              var colNum = worksheet.addCell("");     //Add a blank cell.
              if(xlsxvalue != null && xlsxvalue.length > 0)
                drawing.addImage(worksheet.getCurRow(), colNum, xlsxvalue, imageData[j] );
            }else{ 
              //The cell data is a string or number and not an image.
              var colNum = worksheet.addCell(rtrim(xlsxvalue), (forceDate ? "date" : null) );
             
              if (typeof hyperlinks[j] == "object" && hyperlinks[j] != null){
                useHyperlinks = true;
                var linkXL = { row: worksheet.getCurRow(), col: colNum };
                if (hyperlinks[j].link != null){
                  linkXL.target = hyperlinks[j].link; //hard-coded link
                }else if(hyperlinks[j].linkBound != null){
                  linkXL.target = record[ hyperlinks[j].linkBound ];  //bound link.
                }
                
                hyperlinksXL.push(linkXL);
              }
            } //end else: cell data that is not an image.
          }
        }
      }
      if (data != "") data += "\n";
      data += line;
    } //done building data from subfile records.
    
    if (exportXLSX){
      if (useDrawing && me.pagingBar.xlsxExportPics ){
        if (pui["ie_mode"] <= 9){
          // Fail gracefully: notify the user that pics can't be exported, but still export the XLSX. 
          me.pagingBar.setTempStatus(pui["getLanguageText"]("runtimeMsg", "ie9 too low xlsxpics"));
          me.pagingBar.showTempStatusDiv();
          setTimeout(me.pagingBar.draw, 2000);
        } else {
          // For IE >= 10 and other browsers, export with pictures.
          worksheet.useDrawing();
          workbook.setDrawing(drawing);
          workbook.setCallbacks(me.pagingBar.setTempStatus, me.pagingBar.draw);
          me.pagingBar.setTempStatus(pui["getLanguageText"]("runtimeMsg", "downloading x", ["..."]));
          me.pagingBar.showTempStatusDiv();
        }
      }
      
      if (useHyperlinks){
        worksheet.setHyperlinks(hyperlinksXL);
        workbook.setHyperlinks(hyperlinksXL);
      }
      
      workbook.setFileName(fileName);
      workbook.setWorksheet(worksheet);
      if (pui["is_ie"])
        setTimeout(workbook.download, 100); //IE needs a delay to update the paging bar.
      else
        workbook.download();
    } else {
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
    var dataURL = me.dataProps["data url"];
    if (dataURL == "") dataURL = null;
    if (dataURL) {
      url = pui.appendAuth(dataURL);
      setupajax();
    }
    else if(me.dataProps["database file"] && me.dataProps["database file"].length > 0){
      // If URL is for database-driven grid, then we know the file and can fetch the column data types.
      // TODO: Change PUI0009102 to return the dataType and decPos, and remove this extra XHR.
      var dblib = "";
      var dbfile = me.dataProps["database file"].split("/");
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
          "AUTH": (context == "genie" ? GENIE_AUTH : pui.appJob.auth)
        },
        "async": true,
        "handler": function (response) {
          var fldresp = null;
          if (response != null && response["fields"] != null)
            fldresp = response["fields"];
          setupajax(fldresp);
        }
      });
      me.mask();
    } else {
      setupajax();
    }

    // Call CGI program or webservice to fetch data. Called directly or in callback.
    function setupajax(fields) {
      var req = new pui.Ajax(url);
      req["method"] = "post";
      req["async"] = true;
      if (context == "genie") req["postData"] = "AUTH=" + GENIE_AUTH;
      if (context == "dspf") req["postData"] = "AUTH=" + pui.appJob.auth;
      req["postData"] += "&q=" + encodeURIComponent(pui.getSQLVarName(me.tableDiv))
        +"&"+ pui.getSQLParams(me.dataProps) + "&limit=" + limit + "&start=1";

      if (pui["read db driven data as ebcdic"] !== true) req["postData"] += "&UTF8=Y";

      var orderBy = me.dataProps["order by"];
      if (me.sortBy != null) orderBy = me.sortBy;
      if (orderBy && orderBy != "") req["postData"] += "&order=" + orderBy;

      var fetchCounter = me.dataProps["allow any select statement"];
      if (fetchCounter != null && (fetchCounter == "true" || fetchCounter == true))
        req["postData"] += "&FetchCounter=Y";

      req["onready"] = function (req) {
        var response = checkAjaxResponse(req, "Run SQL SELECT Query");
        if (response && response["results"] && response["results"].length > 0) {
          if (fields != null)
            response["fields"] = fields;
          makexlsx(response);
        } else
          me.unMask();
      };
      req.send();
      me.mask();
    }

    // Take the data retrieved, create and download an excel file.
    function makexlsx(response) {
      var numCols = 0;
      if (response["colWidths"] != null)
        numCols = response["colWidths"].length;
      else {
        // In case the web service doesn't return "colWidths" with its data,calculate it.
        for (var colid in response["results"][0]) {
          numCols++;
        }
      }

      var worksheet = new pui.xlsx_worksheet(numCols);
      var workbook = new pui.xlsx_workbook();

      if (response["fields"] != null && response["results"].length > 0) {
        // DB-Driven grid got PUI0009101 response; set the column formats if we can match column names.
        var colNum = 0;
        for (var colid in response["results"][0]) {
          // Find the field info for the current column.
          for (var i = 0; i < response["fields"].length; i++) {
            if (response["fields"][i]["field"] == colid) {
              var fld = { "dataType": response["fields"][i]["type"], "decPos": response["fields"][i]["decPos"] };
              worksheet.setColumnFormat(colNum, fld);
              break;
            }
          }
          colNum++;
        }
      }
      if (me.hasHeader && me.exportWithHeadings) {
        worksheet.newRow();
        if (me.hidableColumns) {
          me.columnInfo.forEach(function (col, index) {
            var heading = col["name"];
            if (col["blankHeader"]) heading = "";
            worksheet.setCell(index, rtrim(heading), "char");
          });
        } else {
          for (var i = 0; i < me.cells[0].length && i < numCols; i++) {
            var heading = getInnerText(me.cells[0][i]);
            worksheet.setCell(i, rtrim(heading), "char");
          }
        }
      }

      // Look at each result cell. Format if necessary. Add to worksheet.
      for (var rowNum = 0; rowNum < response["results"].length; rowNum++) {
        worksheet.newRow();
        var row = response["results"][rowNum];
        var colNum = 0;
        for (var colid in row) {
          var value = row[colid];
          var datatype = worksheet.formats[colNum]["dataType"];
          if (datatype == "zoned" || datatype == "packed") {
            if (pui.appJob != null && (pui.appJob["decimalFormat"] == "I" || pui.appJob["decimalFormat"] == "J")) {
              //XLSX can't use "," as separator. Assume appJob decFmt is same as CGI helper job's.
              value = value.replace(/[.]/g, ""); //remove thousands separator.
              value = value.replace(",", "."); //decimal separator becomes ".".
            }
          }
          //Note: Excel accepts scientific notation as values, so float/real/double are sent verbatim.
          worksheet.setCell(colNum, value);
          colNum++;
        }
      }

      workbook.setFileName(fileName);
      workbook.setWorksheet(worksheet);
      workbook.download();
      me.unMask();
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
    if (useFilter && me.isFiltered()) dataRecords = me.filteredDataArray;
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
    var record = getDataArrayForRow(row, true);
    if (record == null) return null;
    fieldName = pui.fieldUpper(fieldName);

    // check changed values in response elements first
    var qualField = pui.formatUpper(me.recordFormatName) + "." + fieldName + "." + row;
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
    if (useFilter && me.isFiltered()) dataRecords = me.filteredDataArray;
    var result = [];

    for (var y = 0; y < dataRecords.length; y++) {
      var record = {};
      for (var x = 0; x < me.fieldNames.length; x++) {
        record[me.fieldNames[x]] = dataRecords[y][x];
      }
      result.push(record);
    }

    return result;
  };


  this["setDataValue"] = function (rowNum, fieldName, value) {

    // Update dataArray
    fieldName = pui.fieldUpper(fieldName);
    var record = getDataArrayForRow(rowNum, true);
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
    for (var i = 0; i < me.runtimeChildren.length; i++) {
      var rtval = me.runtimeChildren[i].value;
      if (pui.isBound(rtval) && pui.fieldUpper(rtval["fieldName"]) == fieldName) {
        field = me.runtimeChildren[i];
        break;
      }
    }
    if (field == null) return false;

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

      if (domTest && pui.isInputCapableProperty("value", domTest)) {
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
      return false;
    }

    // Update DOM element
    changeElementValue(el, value);
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
      me.unMask();
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

    if (me.isDataGrid()) {
      return (me.totalRecs <= lastRow);
    } else {
      var dataRecords = me.dataArray;
      if (me.isFiltered()) dataRecords = me.filteredDataArray;
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
    var numRows = me.cells.length;
    if (me.hasHeader) numRows = numRows - 1;
    me.recNum += numRows;
    var lastRow = me.recNum + numRows - 1;

    if (me.isDataGrid()) {
      if (me.totalRecs < lastRow && me.scrollbarObj != null) {
        me.recNum = me.recNum - lastRow + me.totalRecs;
        if (me.recNum < 1) me.recNum = 1;
      }
    } else {
      var dataRecords = me.dataArray;
      if (me.isFiltered()) dataRecords = me.filteredDataArray;
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
      me.unMask();
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

  this.unMask = function () {
    if (maskCover != null) maskCover.style.display = "none";
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
    else maskCover.style.display = "";
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

  /**
   * Populate the grid cells. Data-grids may fetch data from a URL. Handler-driven grids
   * fill internal data arrays.
   * @param {type} csvFile  Filename specified in exportCSV when grid is data-grid.
   * @returns {undefined}
   */
  this.getData = function (csvFile) {
    if (me.tableDiv.disabled == true) return;
    if (me.designMode) return;
    var numRows = me.cells.length;
    if (me.hasHeader) numRows = numRows - 1;
    if (numRows < 1) return;

    // Only once, setup a column to be sorted as the "initial sort column" property for data grids.
    if (me.initialSortColumn != null && !dataGridDidInitialSort && me.isDataGrid()) {
      dataGridDidInitialSort = true;
      sortColumnUsingSQL(me.cells[0][me.initialSortColumn], true); //Set initial sort column without causing XHR.
    }

    // Load any stored filter and sort options before making the first XHR for data grids.
    if (!me.dataGridDidRestoreState && me.isDataGrid()) {
      restoreStateDataGrid();
      me.dataGridDidRestoreState = true; //Only restore filters/sort once.
    }

    // The SQL string helps Grid decide to use pui.sqlcache; it is only sent to the CGI program when secLevel is 0.
    var sql = me.dataProps["custom sql"];
    var orderBy = "";
    // There was no "custom sql", so build the string from DB-driven properties.
    if (sql == null || sql == "") {
      var file = me.dataProps["database file"];
      var fields = me.dataProps["database fields"];
      var whereClause = me.dataProps["selection criteria"];
      orderBy = me.dataProps["order by"];
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
    var dataURL = me.dataProps["data url"];
    if (dataURL == "") dataURL = null;
    if (sql == null) sql = "";
    if (sql != "" || dataURL != null) {
      if (csvFile != null) {
        if (sql == null || sql == "") return;
        var delimiter = ",";
        var decType = ".";
        if (pui.appJob != null && (pui.appJob["decimalFormat"] == "I" || pui.appJob["decimalFormat"] == "J")) {
          delimiter = ";";
          decType = ",";
        }
        if (typeof (pui["csv separator"]) == "string") {
          delimiter = pui["csv separator"];
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
        addField("delimiter", delimiter);
        if (pui["read db driven data as ebcdic"] !== true) addField("UTF8", "Y");
        addField("decType", decType);
        addField("fileName", csvFile + ".csv");
        if (pui["secLevel"] > 0) {

          addField("q", encodeURIComponent(pui.getSQLVarName(me.tableDiv)));

          var params = {};
          pui.getSQLParams(me.dataProps, params);

          for (var fieldName in params) {

            addField(fieldName, encodeURIComponent(params[fieldName]));

          }

          if (orderBy && orderBy != "") {

            addField("order", orderBy);

          }

        }
        else {

          addField("q", pui.aes.encryptString(sql));

        }
        addField("AUTH", pui.appJob.auth);
        if (me.hasHeader && me.exportWithHeadings) {
          if (me.hidableColumns) {
            var headings = "";
            me.columnInfo.forEach(function (col) {
              var heading = col["name"];
              if (col["blankHeader"]) heading = "";
              heading = heading.replace(/"/g, '""');
              if (headings) headings += delimiter;
              headings += '"' + heading + '"';
            });
          } else {
            var headings = "";
            for (var i = 0; i < me.cells[0].length; i++) {
              var heading = getInnerText(me.cells[0][i]);
              heading = heading.replace(/"/g, '""'); // "
              if (headings != "") headings += delimiter;
              headings += '"' + heading + '"';
            }
          }
          addField("headings", headings);
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

      runSQL(sql, numRows, startRow, receiveData, (me.totalRecs == null), dataURL, true);
    }
    else if (context == "dspf" || pui.usingGenieHandler) {
      var dataRecords = me.dataArray;
      if (me.isFiltered()) dataRecords = me.filteredDataArray;
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
      if (dataRecords.length < lastRow && me.scrollbarObj != null) {
        me.recNum = me.recNum - lastRow + dataRecords.length;
        if (me.recNum < 1) me.recNum = 1;
        lastRow = dataRecords.length;
      }
      me.hideTips();
      for (var i = me.recNum; i <= lastRow; i++) {

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

        if (me.selectionEnabled || me.rowFontColorField != null || me.rowBackgroundField != null) {
          me.setRowBackground(rowNum);
        }

        if (fieldData.empty != true) {
          var subfileRow = dataRecords[i - 1].subfileRow;
          if (subfileRow == null) subfileRow = i;
          pui.renderFormat({
            designMode: false,
            name: pui.formatUpper(me.recordFormatName),
            metaData: {
              items: me.runtimeChildren
            },
            data: fieldData,
            ref: me.ref,
            errors: me.errors,
            rowNum: rowNum,
            subfileRow: subfileRow,
            dataArrayIndex: i - 1,
            highlighting: me.highlighting
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
        }
        rowNum++;
      }
      if (me.scrollbarObj != null && me.scrollbarObj.type == "sliding") {
        me.scrollbarObj.totalRows = dataRecords.length;
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
    function receiveData(data, totalRecs, matchRow) {
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

      // For each returned record, put the data into grid cells.
      for (var i = 0; i < data.length; i++) {
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
              // In case the user hides a column, if the current column is hidden continue
              // else check if the user has set the text align
              if (me.hidableColumns) {
                if (idx == undefined) {
                  colNum++;
                  continue;
                }
                if (me.cellProps["text align"]) {
                  var textAlignArr = me.cellProps["text align"].split(',');
                  if (textAlignArr[colNum]) alignCSS = " text-align:" + textAlignArr[colNum];
                }
              } else if (row[idx].style.textAlign != null && row[idx].style.textAlign != "") {
                alignCSS = " text-align:" + row[idx].style.textAlign;
              }
              row[idx].innerHTML = '<div style="' + paddingCSS + alignCSS + '">' + dataValue + '</div>';

              // Highlight cells in the column.
              if (me.highlighting != null && me.highlighting.text != "" && idx === me.highlighting.col) {
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
          me.scrollbarObj.atBottom = false;
          if (me.totalRecs != null) {
            if (me.recNum + numRows > me.totalRecs) {
              me.scrollbarObj.atBottom = true;
            }
          }
          me.scrollbarObj.reset();
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
    delete me.dataArray;
    delete me.filteredDataArray;
    delete me.runtimeChildren;
    delete me.fieldNames;
    delete me.ref;
    delete me.vLines;
    delete me.hLines;
    delete me.cells;
    delete me.columnHeadings;
    delete me.columnInfo;
    delete me.validationTips;
    delete me.cellProps;
    delete me;
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
    var numRows = me.hLines.length - 1;
    if (numRows < 0) numRows = 0;
    numRows = String(numRows);
    var numCols = me.vLines.length - 1;
    if (numCols < 0) numCols = 0;
    numCols = String(numCols);
    var changed = false;
    changed = sendPropertyToDesigner(itm, "number of rows", numRows) || changed;
    changed = sendPropertyToDesigner(itm, "number of columns", numCols) || changed;
    changed = sendPropertyToDesigner(itm, "row height", me.rowHeight) || changed;
    changed = sendPropertyToDesigner(itm, "header height", me.headerHeight) || changed;
    changed = sendPropertyToDesigner(itm, "column widths", me.getColumnWidths()) || changed;
    changed = sendPropertyToDesigner(itm, "left", me.tableDiv.style.left) || changed;
    changed = sendPropertyToDesigner(itm, "top", me.tableDiv.style.top) || changed;
    changed = sendPropertyToDesigner(itm, "height", me.tableDiv.style.height) || changed;
    changed = sendPropertyToDesigner(itm, "width", me.tableDiv.style.width) || changed;
    if (changed) itm.designer.makeDirty();
    if (changed || forced) itm.designer.propWindow.refresh();
  };

  function sendPropertyToDesigner(itm, propertyName, value) {
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
  }

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
            me.removeRow();
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

  function getPaddingCSS() {
    var defaultHPaddingValue = "4px";
    var defaultVPaddingValue = "0px";
    var paddingCSS = "";

    var paddingValue = me.paddingProps["padding bottom"];
    if (paddingValue == null || paddingValue == "") paddingValue = defaultVPaddingValue;
    paddingCSS += "padding-bottom:" + paddingValue + ";";

    paddingValue = me.paddingProps["padding left"];
    if (paddingValue == null || paddingValue == "") paddingValue = defaultHPaddingValue;
    paddingCSS += "padding-left:" + paddingValue + ";";

    paddingValue = me.paddingProps["padding right"];
    if (paddingValue == null || paddingValue == "") paddingValue = defaultHPaddingValue;
    paddingCSS += "padding-right:" + paddingValue + ";";

    paddingValue = me.paddingProps["padding top"];
    if (paddingValue == null || paddingValue == "") paddingValue = defaultVPaddingValue;
    paddingCSS += "padding-top:" + paddingValue + ";";

    return paddingCSS;
  }
  // Optional headings parameter to set the column headings for hideable columns
  this.setHeadings = function (headings) {
    if (!me.hasHeader) return;
    if (me.cells.length <= 0) return;
    var paddingCSS = getPaddingCSS();
    var headerRow = me.cells[0];
    for (var i = 0; i < headerRow.length; i++) {
      var headerCell = headerRow[i];
      var hasFilter = false;
      if (me.designMode == false && headerCell.filterIcon != null) {
        hasFilter = true;
        me.removeFilterIcon(headerCell);
      }
      if (me.columnHeadings.length <= i) {
        headerCell.innerHTML = "";
      }
      else {
        var alignCSS = "";
        if (headerCell.style.textAlign != null && headerCell.style.textAlign != "") {
          alignCSS = " text-align:" + headerCell.style.textAlign;
        }
        if (me.hidableColumns && headings) headerCell.innerHTML = '<div style="' + paddingCSS + alignCSS + '">' + (headings[i] ? headings[i] : "") + '</div>';
        else headerCell.innerHTML = '<div style="' + paddingCSS + alignCSS + '">' + (me.columnHeadings[i] ? me.columnHeadings[i] : "") + '</div>';
        centerHeadingVertically(headerCell);
      }
      // This method runs when the user resizes columns, and the sort/filter icons becomes orphaned.     
      if (hasFilter) {
        me.setFilterIcon(headerCell);
      }
      var placeSortIcon = false;
      if (me.designMode == false && me.sortable == true && me.sortIcon != null) {
        if (clientSortColumnId == headerCell.columnId) {
          placeSortIcon = true;
        }
        else if (me.tableDiv.columnSortResponseField != null && me.initialSortColumn == headerCell.columnId) {
          placeSortIcon = true;
        }
        else if (me.tableDiv.fieldNameSortResponseField != null && me.initialSortField != null && me.initialSortField == me.getFieldNameFromColumnIndex(headerCell.columnId)) {
          placeSortIcon = true;
        }
        if (placeSortIcon) {
          if (me.sortIcon.parentNode != null) {
            me.sortIcon.parentNode.removeChild(me.sortIcon);
          }
          var destination = headerCell;
          if (destination.firstChild != null && destination.firstChild.tagName == "DIV") {
            destination = destination.firstChild;
          }
          destination.appendChild(me.sortIcon);
        }
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
   * (Called by makeSortable and by receiveData when grid is custom SQL.)
   * @param {Object} cell  Header cell DOM element.
   * @param {Number} col   The current column number of the cell.
   * @returns {undefined}
   */
  function attachClickEventForSQL(cell, col) {
    if (!pui.iPadEmulation) {
      cell.style.cursor = "pointer";
    }

    function doSort() {
      if (!me.waitingOnRequest) //Respond to clicks only when data is not loading.
        sortColumnUsingSQL(cell);
    }
    addEvent(cell, "click", doSort);
    cell.sortColumn = doSort;

    cell.sortDescending = !isDefaultSortDescending(col);
  }

  /**
   * Setup the UI to allow sorting a column.
   * Called when the "sortable columns" property is set; i.e. when rendering (for genie),
   * and always near the end of pui.renderFormat() for each gridsToRender.
   * @returns {undefined}
   */
  this.makeSortable = function () {
    if (!me.sortable) return;
    if (context != "dspf" && !pui.usingGenieHandler) return;
    if (!me.hasHeader) return;
    if (me.cells.length <= 0) return;
    var headerRow = me.cells[0];
    // Setup click events for DB-driven grid; it knows the fieldNames at this point. Custom SQL doesn't.
    if ((me.dataProps["database file"] != null && me.dataProps["database file"] != "") &&
      (me.dataProps["custom sql"] == null || me.dataProps["custom sql"] == "") &&
      (me.dataProps["data url"] == null || me.dataProps["data url"] == "") &&
      (me.dataProps["database fields"] != null && me.dataProps["database fields"] != "")) {
      var fields = pui.getFieldList(me.dataProps["database fields"]);
      for (var i = 0; i < fields.length; i++) {
        if (!headerRow[i]) continue;
        headerRow[i].fieldName = fields[i];
        attachClickEventForSQL(headerRow[i], i);
      }
    }
    else if ((me.dataProps["custom sql"] != null && me.dataProps["custom sql"] != "")
          || (me.dataProps["data url"] != null && me.dataProps["data url"] != "") ){

      // Custom SQL and data URL grids can sort given the column number.
      var numCols = me.vLines.length - 1;
      for (var i = 0; i < numCols; i++) {
        attachClickEventForSQL(headerRow[i], i);
      }

    } else {
      // Make each header cell of a Load-All grid respond to sort clicks. (Custom SQL is setup after data loads.)
      for (var i = 0; i < me.runtimeChildren.length; i++) {
        var itm = me.runtimeChildren[i];
        var col = Number(itm["column"]);
        var val = itm["value"];
        if (itm["field type"] == "html container") val = itm["html"];
        if (pui.isBound(val) && !isNaN(col) && col < headerRow.length && headerRow[col].sortIndex == null) {
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
              headerRow[col].sortDescending = !isDefaultSortDescending(col);
              break;
            }
          }
        }
      }
      if (me.initialSortColumn != null) {
        sortColumn(headerRow[me.initialSortColumn], false, true);
      }
      else if (me.initialSortField != null) {
        var initialSortColumn = me.getColumnIndexFromFieldName(me.initialSortField);
        if (initialSortColumn != null) sortColumn(headerRow[initialSortColumn], false, true);
      }
    }

    function attachClickEvent(cell) {
      function doSort() {
        if (me.tableDiv.columnSortResponseField != null) {
          me.columnSortResponse = String(cell.columnId);
          pui.columnSortResponseGrid = me;
          var returnVal = pui.respond();
          pui.columnSortResponseGrid = null;
        }
        else if (me.tableDiv.fieldNameSortResponseField != null) {
          me.fieldNameSortResponse = me.getFieldNameFromColumnIndex(cell.col);
          if (me.fieldNameSortResponse == null) return;
          pui.fieldNameSortResponseGrid = me;
          var returnVal = pui.respond();
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
        var cols = colState["cols"];
        var headings = colState["headings"];
        var colSequence = state["colSequence"];
        if (cols != null) {
          cols.forEach(function (col) {
            if (col["columnId"] !== undefined) {
              if (!col["showing"]) me["removeColumn"](col["columnId"]);
              else if (movableColumns) {
                var curCol = getCurrentColumnFromId(col["columnId"]);
                if (curCol != col["savedColumn"]) me.moveColumn(curCol, col["savedColumn"]);
              }
            }
          });
          if (colSequence) cols.colSequence = colSequence;
          me.columnInfo = cols;
        }
      }
      if (widths) {
        me.setColumnWidths(widths);
        me.sizeAllCells();
      }
      if (me.expandToLayout) me.doExpandToLayout();
      if (headings) me.setHeadings(headings);
    }


    // Restore saved client-side column sort.
    if (me.sortable && !me.isDataGrid() && me.tableDiv.columnSortResponseField == null && me.tableDiv.fieldNameSortResponseField == null) {

      var sort = state["sort"];
      if (sort != null && sort["columnId"] != null && sort["descending"] != null) {

        var sortCell;
        for (var i = 0; i < me.cells[0].length; i++) {

          if (me.cells[0][i].columnId == sort["columnId"]) {

            sortCell = me.cells[0][i];
            sortCell.sortDescending = !sort["descending"];

          }

        }

        sortColumn(sortCell, true, false);
      }
    }

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
   * Restore filter and sort order of a data grid. This should be called only once:
   * the first time getData is called. This does not cause new AJAX calls.
   * @returns {undefined}
   */
  function restoreStateDataGrid() {
    var state = restoreStatePreCheck();
    if (state == null) {
      return;
    }

    // Restore saved client-side column sort.
    if (me.sortable && me.tableDiv.columnSortResponseField == null && me.tableDiv.fieldNameSortResponseField == null) {
      var sort = state["sort"];
      if (sort != null && sort["columnId"] != null && sort["descending"] != null) {
        var sortCell;
        for (var i = 0; i < me.cells[0].length; i++) {

          if (me.cells[0][i].columnId == sort["columnId"]) {
            sortCell = me.cells[0][i];
            sortCell.sortDescending = !sort["descending"];
          }
        }

        // Set the column properties without causing a request.
        sortColumnUsingSQL(sortCell, true);
      }
    }

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
    if (sortOrder == "D") return true;
    else return false;
  }

  function resetDefaultSort() {
    var headerRow = me.cells[0];
    for (var col = 0; col < headerRow.length; col++) {
      headerRow[col].sortDescending = !isDefaultSortDescending(headerRow[col].columnId); //use .columnId in case column moved.
    }
  }

  function sortColumn(cell, restoring, initialSort) {
    if (me.gridMenu != null) me.gridMenu.hide();
    if (cell == null) return;
    var sortIndex = cell.sortIndex;
    var desc = cell.sortDescending;
    resetDefaultSort();
    if (desc == null) desc = true;
    if (me.sortIcon == null) {
      me.sortIcon = document.createElement("img");
      me.sortIcon.style.paddingLeft = "3px";
    }
    else {
      if (me.sortIcon.parentNode != null) me.sortIcon.parentNode.removeChild(me.sortIcon);
    }

    if (me.tableDiv.columnSortResponseField == null && me.tableDiv.fieldNameSortResponseField == null) {
      clientSortColumnId = cell.columnId;
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

      var fieldNameUpper = "";
      var fieldDateFormat = null;
      var fieldFormat = {};
      if (typeof cell.fieldName == "string") fieldNameUpper = cell.fieldName.toUpperCase();
      if (cell.dateFormat) fieldDateFormat = cell.dateFormat;
      if (cell.fieldFormat) fieldFormat = cell.fieldFormat;

      function doSort(row1, row2) {
        var value1 = row1[sortIndex];
        var value2 = row2[sortIndex];
        if (cell.dataType == "zoned" || cell.dataType == "floating") {
          value1 = Number(value1);
          value2 = Number(value2);
        }
        else if (cell.dataType == "reference") {
          var refObj = me.ref[cell.fieldName];
          if (refObj != null) {
            if (refObj.dataType == 7 || refObj.dataType == 9 || refObj.dataType == 10) { // zoned, packed, floating
              value1 = Number(value1);
              value2 = Number(value2);
            }
          }
        }
        else if (cell.dataType == "graphic"){
          value1 = pui.formatting.decodeGraphic(value1);
          value2 = pui.formatting.decodeGraphic(value2);
        }
        if (customGridSortFunction !== undefined) {
          try {
            var fieldName = fieldNameUpper;
            var isDescending = desc;
            var args = "value1, value2, fieldName, isDescending, fieldDateFormat, fieldFormat";
            var sortingFunction = new Function(args,customGridSortFunction);
            if (typeof sortingFunction == "function"){
              return customSortHandler(sortingFunction, value1, value2, fieldNameUpper, desc, fieldDateFormat, fieldFormat);
            }
          } catch (error) {
            if (error) {
              console.log("Sort function error: ");
              console.error(error);
            }
          }
        } 
        else if (typeof pui["gridSort"] == "function") {
          return customSortHandler(pui["gridSort"], value1, value2, fieldNameUpper, desc, fieldDateFormat, fieldFormat );
        }
        else {
          if ((desc && value1 < value2) || (!desc && value1 > value2)) return -1;
          else if (value1 == value2) {
            if (row1.subfileRow < row2.subfileRow) return -1; 
            else return 1;
      }
          else return 1;
        }
      }
      // Handle the pui.gridSort and the screen level defined grid function. 
      function customSortHandler(func, value1, value2, fieldNameUpper, desc, fieldDateFormat, fieldFormat) {
        var returnVal = func(value1, value2, fieldNameUpper, desc, fieldDateFormat, fieldFormat);
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
      if (me.isFiltered()) me.filteredDataArray.sort(doSort);

      //
      // update the data array index in pui.responseElements
      //  to point to the new data array index (after sorting)
      //
      var indexXRef = [];
      for (i = 0; i < me.dataArray.length; i++) {
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

      me.recNum = 1;
      if (me.sflrcdnbr > 0 && (restoring || initialSort)) {

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

      me.getData();

    }

    desc = !desc;
    cell.sortDescending = desc;
    me.sortIcon.src = pui.normalizeURL("/profoundui/proddata/images/grids/") + (desc ? "descending.gif" : "ascending.gif");
    var destination = cell;
    if (destination.firstChild != null && destination.firstChild.tagName == "DIV") {
      destination = destination.firstChild;
    }
    destination.appendChild(me.sortIcon);

    if (persistState && !restoring) {

      var obj = {};
      obj["columnId"] = cell.columnId;
      obj["descending"] = cell.sortDescending;
      saveState(obj, "sort");

    }

  }

  /**
   * Update the UI to show a column as sorted, set the sort column, and reload
   * the grid when not restoring.
   * @param {Object} cell         The header cell of the column to sort.
   * @param {Boolean} restoring   (optional) When true, a new XHR isn't made.
   * @returns {undefined}
   */
  function sortColumnUsingSQL(cell, restoring) {
    if (me.gridMenu != null) me.gridMenu.hide();
    if (cell == null) return;
    clientSortColumnId = cell.columnId;
    var desc = cell.sortDescending;
    resetDefaultSort();
    if (desc == null) desc = true;
    if (me.sortIcon == null) {
      me.sortIcon = document.createElement("img");
      me.sortIcon.style.paddingLeft = "3px";
    }
    else {
      if (me.sortIcon.parentNode != null) me.sortIcon.parentNode.removeChild(me.sortIcon);
    }
    me.sortBy = cell.columnId + 1; //column number works fine in db-driven and custom sql queries.
    desc = !desc;
    if (desc) me.sortBy += " DESC";

    me.sorted = true;

    // Avoid creating an XHR when restoring, which happens before the first XHR for data grids.
    if (!restoring) {

      if (me.scrollbarObj != null && me.scrollbarObj.type == "sliding") {
        me.scrollbarObj.setScrollTopToRow(1);
      }
      me.recNum = 1;
      me.mask(); //disable UI until server responds.
      me.getData();
    }

    cell.sortDescending = desc;
    me.sortIcon.src = pui.normalizeURL("/profoundui/proddata/images/grids/") + (desc ? "descending.gif" : "ascending.gif");
    var destination = cell;
    if (destination.firstChild != null && destination.firstChild.tagName == "DIV") {
      destination = destination.firstChild;
    }
    destination.appendChild(me.sortIcon);

    if (persistState && !restoring) {

      var obj = {};
      obj["columnId"] = cell.columnId;
      obj["descending"] = cell.sortDescending;
      saveState(obj, "sort");

    }

  }

  function removeAllResponseElements() {
    saveResponsesToDataArray();
    var toRemove = [];
    var startsWith = pui.formatUpper(me.recordFormatName) + ".";
    for (var fldName in pui.responseElements) {
      if (fldName.substr(0, startsWith.length) == startsWith) {
        toRemove.push(fldName);
      }
    }
    for (var i = 0; i < toRemove.length; i++) {
      delete pui.responseElements[toRemove[i]];
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
              // otherwise loop through the dataArray to find the subfileRow of the dom element. #4143
              if (!me.sorted && dom.dataArrayIndex != null) {
                rowData = me.dataArray[dom.dataArrayIndex];
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

  function loadState() {

    var state;

    if (pui.isLocalStorage() && localStorage[me.storageKey] != null) {

      try {

        state = JSON.parse(localStorage[me.storageKey]);

      }
      catch(e) {

      }

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
    localStorage[me.storageKey] = JSON.stringify(stg);

  }

  function executeEvent(eventName) {
    if (me.designMode) return;
    var eventCode = me.events[eventName];
    if (eventCode != null && eventCode != "") {
      try {
        pui["temporary_property"] = me;
        eval("var grid = pui.temporary_property;");
        pui["temporary_property"] = me.tableDiv;
        eval("var dom = pui.temporary_property;");

        eval("var row = arguments[1];");
        eval("var rowNumber = arguments[1];");

        if (eventName == "onrowclick") {
          eval("var isRightClick = arguments[2];");
        }

        if (arguments.length >= 4) {
          eval("var event = arguments[3]");
        }

        eval("var column = arguments[4];");

        var rowNum = arguments[1];
        if (rowNum != null) {
          if (!me.hasHeader) rowNum -= 1;
          var rowCellsArray = me.cells[rowNum];
          pui["temporary_property"] = rowCellsArray;
          eval("var rowCells = pui.temporary_property;");
        }

        if (me.recNum != null && !isNaN(me.recNum) && me.recNum > 0) {
          var adjustedRow = eval("row");
          adjustedRow += (me.recNum - 1);
          eval("rowNumber = " + adjustedRow);
          var dataRecords = me.dataArray;
          if (me.isFiltered()) dataRecords = me.filteredDataArray;
          if (dataRecords[adjustedRow - 1] != null && dataRecords[adjustedRow - 1].subfileRow != null) {
            adjustedRow = dataRecords[adjustedRow - 1].subfileRow;
          }
          eval("row = " + adjustedRow);
          eval("var rrn = " + adjustedRow);
        }
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
    var startRow = Number(me.dataProps["starting row"]);
    var endRow = Number(me.dataProps["ending row"]);
    if (isNaN(startRow) || isNaN(endRow)) return;
    if (me.dataProps["data columns"] == null) return;

    var colArray = [];
    for (var x = 0; x < multiple; x++) {
      var prop = "data columns";
      if (x > 0) prop += " " + (x + 1);
      var dataColumns = me.dataProps[prop];
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
          var paddingCSS = getPaddingCSS();
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
      me.pagingBar.width = me.pagingBar.width - 2;
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
            me.clearData();
          }
        };
        me.scrollbarObj.enableMouseWheel(me.tableDiv);
      }

      if (stype == "paging") {
        me.scrollbarObj.onpageup = function () {
          var returnVal = executeEvent("onpageup");
          if (returnVal == false) return false;
          if (me.isDataGrid()) {
            if (me.recNum > 1) {
              var numRows = me.cells.length;
              if (me.hasHeader) numRows = numRows - 1;
              me.recNum = me.recNum - numRows;
              if (me.recNum < 1) me.recNum = 1;
              me.getData();
            }
            return true;
          }
          else if (context == "dspf" || pui.usingGenieHandler) {
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
          if (me.isDataGrid()) {
            var numRows = me.cells.length;
            if (me.hasHeader) numRows = numRows - 1;
            me.recNum += numRows;
            me.getData();
            return true;
          }
          else if (context == "dspf" || pui.usingGenieHandler) {
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
                me.scrollbarObj.x = layoutDiv.offsetWidth - scrollBarWidth + 2 + parent.scrollLeft;
                if (me.tableDiv.style.visibility != "hidden") {
                  // Pass true to the draw method to stop the scrollbar from scrolling 
                  // and causing the grid to re-render the items #4262. 
                  me.scrollbarObj.draw(true);
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
      }
      if (stype == "sliding") {
        if (me.isDataGrid()) me.scrollbarObj.interval = 250;
        else me.scrollbarObj.interval = 1;
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
    if (me.pagingBar.csvExport || me.pagingBar.showPagingControls || me.pagingBar.showPageNumber || me.pagingBar.showBar) {
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

  this.setProperty = function (property, value) {
    if (value == null) value = "";

    if (property.indexOf("parameter value") == 0) {

      me.dataProps[property] = value;
      return;

    }

    switch (property) {
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

      case "column sort response":

      case "right":
      case "bottom":

        // nothing to do here
        break;

      case "field name sort response":
        // nothing to do here
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
        var newNumRows = parseInt(value);
        if (isNaN(newNumRows)) newNumRows = oldNumRows;
        if (newNumRows < 1) newNumRows = 1;
        if (me.hasHeader && newNumRows < 2) newNumRows = 2;
        if (newNumRows > 99 && me.designMode) newNumRows = 99;
        if (newNumRows > oldNumRows) {
          while (newNumRows > me.hLines.length - 1) me.addRow();
          me.mirrorDownAll();
        }
        if (newNumRows < oldNumRows) {
          while (newNumRows < me.hLines.length - 1) me.removeRow();
        }
        if (me.tableDiv.designItem != null) me.tableDiv.designItem.properties[property] = value;
        me.sendToDesigner();
        break;

      case "number of columns":
        var oldNumCols = me.vLines.length - 1;
        if (oldNumCols < 0) oldNumCols = 0;
        var newNumCols = parseInt(value);
        if (isNaN(newNumCols)) newNumCols = oldNumCols;
        if (newNumCols < 1) newNumCols = 1;
        if (newNumCols > 99) newNumCols = 99;
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
        if (me.designMode) me.sizeAllCells();
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
        if (!me.hasHeader || me.hLines.length < 2) return;
        me.hLines[0].style.top = (parseInt(me.hLines[1].style.top) - me.headerHeight) + "px";
        setLineTops();
        setLineHeights();
        if (me.designMode) me.sizeAllCells();
        positionIcons();
        me.setScrollBar();
        me.sendToDesigner();
        break;

      case "has header":
        if (me.hasHeader && (value == false || value == "false")) {
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

      case "column widths":
        me.setColumnWidths(value);
        break;

      case "column headings":
        if (!pui.isBound(value) && !pui.isTranslated(value)) {
          me.columnHeadings = pui.parseCommaSeparatedList(value);
        }
        me.setHeadings();
        break;

      case "sortable columns":
        me.sortable = (value == "true");
        if (context == "genie") me.makeSortable();
        break;

      case "default sort order":
        if (!me.designMode) {
          if (value == null) {
            me.defaultSortOrderArray = [];
          }
          else {
            me.defaultSortOrderArray = value.split(",");
          }
          resetDefaultSort(); //Make sure after applyProperty the first click to sort gets correct order.
        }
        break;

      case "initial sort column":
        if (!me.designMode) {
          me.initialSortColumn = parseInt(value);
          if (isNaN(me.initialSortColumn)) me.initialSortColumn = null;
        }
        break;

      case "initial sort field":
        if (!me.designMode) {
          me.initialSortField = value;
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
        persistState = (me.designMode == false && pui.isLocalStorage() && (value == true || value == "true"));
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
          if (!header) {
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

      case "database file":
      case "database fields":
      case "selection criteria":
      case "order by":
      case "sortable":
      case "custom sql":
      case "allow any select statement":
      case "data url":
      case "data transform function":
      case "starting row":
      case "ending row":
      case "data columns":
      case "data columns 2":
      case "data columns 3":
      case "data columns 4":
        me.dataProps[property] = value;
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
        me.events[property] = value;
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
    if (me.recNum != null && !isNaN(me.recNum) && me.recNum > 0) {
      me.tableDiv.cursorRRN = row + me.recNum;
      if (me.hasHeader) {
        me.tableDiv.cursorRRN = me.tableDiv.cursorRRN - 1;
      }
      var dataRecords = me.dataArray;
      if (me.isFiltered()) dataRecords = me.filteredDataArray;
      if (dataRecords[me.tableDiv.cursorRRN - 1] == null || dataRecords[me.tableDiv.cursorRRN - 1].length == 0) {
        me.tableDiv.cursorRRN = 0;
      }
      else if (dataRecords[me.tableDiv.cursorRRN - 1].subfileRow != null) {
        me.tableDiv.cursorRRN = dataRecords[me.tableDiv.cursorRRN - 1].subfileRow;
      }
    }
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


  function checkSelected(record) {

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
    if (me.isFiltered()) dataRecords = me.filteredDataArray;
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


  this.setRowBackground = function (row, hover) {
    var even = ((row % 2) == 1);
    if (me.hasHeader) even = !even;
    if (me.cells == null) return;
    var cols = me.cells[row];

    var selected = false;
    if (me.selectionEnabled) {
      if (me.recNum != null && !isNaN(me.recNum) && me.recNum > 0) {
        var adjustedRow = row + me.recNum - 1 + (me.hasHeader ? 0 : 1);
        var dataRecords = me.dataArray;
        if (me.isFiltered()) dataRecords = me.filteredDataArray;
        if (dataRecords[adjustedRow - 1] != null && dataRecords[adjustedRow - 1].length > 0) {
          selected = checkSelected(dataRecords[adjustedRow - 1]);
        }
      }
    }

    var rowBackground = null;
    if (me.rowBackgroundField != null) {
      if (me.recNum != null && !isNaN(me.recNum) && me.recNum > 0) {
        var adjustedRow = row + me.recNum - 1 + (me.hasHeader ? 0 : 1);
        var dataRecords = me.dataArray;
        if (me.isFiltered()) dataRecords = me.filteredDataArray;
        if (dataRecords[adjustedRow - 1] != null && dataRecords[adjustedRow - 1].length > 0) {
          if (me.rowBackgroundFieldIndex == null) {
            for (var i = 0; i < me.fieldNames.length; i++) {
              if (pui.fieldUpper(me.rowBackgroundField.fieldName) == me.fieldNames[i]) {
                me.rowBackgroundFieldIndex = i;
                break;
              }
            }
          }
          if (me.rowBackgroundFieldIndex != null) {
            rowBackground = dataRecords[adjustedRow - 1][me.rowBackgroundFieldIndex];
          }
        }
      }
    }    if (!pui.isBound(me.cellProps["row background"]) && me.cellProps["row background"] != null && me.cellProps["row background"] != "") rowBackground = me.cellProps["row background"];

    var rowFontColor = null;
    if (me.rowFontColorField != null) {
      if (me.recNum != null && !isNaN(me.recNum) && me.recNum > 0) {
        var adjustedRow = row + me.recNum - 1 + (me.hasHeader ? 0 : 1);
        var dataRecords = me.dataArray;
        if (me.isFiltered()) dataRecords = me.filteredDataArray;
        if (dataRecords[adjustedRow - 1] != null && dataRecords[adjustedRow - 1].length > 0) {
          if (me.rowFontColorFieldIndex == null) {
            for (var i = 0; i < me.fieldNames.length; i++) {
              if (pui.fieldUpper(me.rowFontColorField.fieldName) == me.fieldNames[i]) {
                me.rowFontColorFieldIndex = i;
                break;
              }
            }
          }
          if (me.rowFontColorFieldIndex != null) {
            rowFontColor = dataRecords[adjustedRow - 1][me.rowFontColorFieldIndex];
          }
        }
      }
    }
    if (!pui.isBound(me.cellProps["row font color"]) && me.cellProps["row font color"] != null && me.cellProps["row font color"] != "") rowFontColor = me.cellProps["row font color"];

    function setColor(cell, color, colNum) {
      if (color == null) color = "";
      var colors = color.split(",");
      if (colors.length > 1) {
        if (colNum < colors.length) {
          color = colors[colNum];
        }
        else {
          color = colors[0];
        }
      }
      cell.style.color = color;
      if (context == "genie" && !pui.usingGenieHandler) {
        for (var i = 0; i < cell.childNodes.length; i++) {
          cell.childNodes[i].style.color = color;
        }
      }
    }

    for (i = 0; i < cols.length; i++) {
      pui.removeCssClass(cols[i], "selected");
      pui.removeCssClass(cols[i], "hover");
      if (selected) {
        setColor(cols[i], me.cellProps["selection font color"], i);
        if (me.cellProps["selection background"] == null) {
          cols[i].style.backgroundColor = "";
        }
        else {
          cols[i].style.backgroundColor = me.cellProps["selection background"];
        }
        var selectionImage = me.cellProps["selection image"];
        if (selectionImage == null || selectionImage == "") {
          cols[i].style.backgroundImage = "";
        }
        else {
          cols[i].style.backgroundImage = "url('" + pui.normalizeURL(selectionImage, true) + "')";
        }
        pui.addCssClass(cols[i], "selected");
      }
      else if (hover == true) {
        setColor(cols[i], me.cellProps["hover font color"], i);
        cols[i].style.backgroundColor = me.cellProps["hover background"];
        if (me.cellProps["hover image"] != null && me.cellProps["hover image"] != "") {
          cols[i].style.backgroundImage = "url('" + pui.normalizeURL(me.cellProps["hover image"], true) + "')";
          cols[i].style.backgroundRepeat = "repeat-x";
        }
        pui.addCssClass(cols[i], "hover");
      }
      else {
        if (rowFontColor == null || rowFontColor == "") {
          rowFontColor = me.cellProps[(even ? "even" : "odd") + " row font color"];
        }
        if (rowBackground == null || rowBackground == "") {
          rowBackground = me.cellProps[(even ? "even" : "odd") + " row background"];
        }
        setColor(cols[i], rowFontColor, i);
        if (rowBackground == null) {
          cols[i].style.backgroundColor = "";
        }
        else {
          cols[i].style.backgroundColor = rowBackground;
        }
        cols[i].style.backgroundImage = "";
      }
    }
    if (hover != true && me.zoomIcon != null) me.zoomIcon.style.display = "none";
    if (hover == true && me.zoomIcon != null) me.zoomIcon.style.display = "";
  };

  /**
   * Setup design events on a cell div. Needed for Genie design mode and in Visual Designer.
   * Handle dragging of cells to move the grid, including into and out of layouts.
   * @param {Object} cell
   * @param {Boolean} movableColumns
   * @returns {undefined}
   */
  function cellDesign(cell, movableColumns) {
    if (!me.designMode && movableColumns != true) return;
    if (!me.designMode && movableColumns == true) {
      me.tableDiv.parentNode.onselectstart = function (e) {
        if (me.dragging) {
          preventEvent(e);
          return false;
        }
      };
    }

    cell.style.cursor = "default";
    function mousedown(event) {
      if (me.designMode) {
        me.tableDiv.designItem.designer.hideDialogs();
        if (context == "dspf") Ext.menu.MenuMgr.hideAll();
        me.selectMe();

        pui.layout.template.getContainerPositions(me.tableDiv.designItem.designer);

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
      }
      else {
        if (me.gridMenu != null && !pui.isRightClick(event)) me.gridMenu.hide();
      }

      me.dragging = true;
      var cursorStartX = pui.getMouseX(event);
      var cursorStartY = pui.getMouseY(event);
      me.doThisToTableDivs(function (domObj) {
        domObj.startLeft = pui.safeParseInt(domObj.style.left);
        domObj.startTop = pui.safeParseInt(domObj.style.top);
      });
      var inLayoutContainer = false;
      if (context == "dspf" && me.tableDiv.parentNode.getAttribute("container") == "true") {
        inLayoutContainer = true;
      }

      function mousemove(event) {
        var y = pui.getMouseY(event) - cursorStartY;
        var x = pui.getMouseX(event) - cursorStartX;
        if (me.hasHeader && cell.row == 0) {
          // move header column
          if (headerCellProxy == null) {
            headerCellProxy = cell.cloneNode(true);
            headerCellProxy.style.border = "1px solid #999999";
            headerCellProxy.style.zIndex = me.moveColumnZIndex;
            headerCellProxyContainer = document.createElement("div");
            headerCellProxyContainer.className = me.tableDiv.className;
            cell.parentNode.parentNode.appendChild(headerCellProxyContainer);
            headerCellProxyContainer.appendChild(headerCellProxy);
          }
          headerCellProxy.style.top = (me.tableDiv.startTop + y) + "px";
          headerCellProxy.style.left = (me.tableDiv.startLeft + parseInt(cell.style.left) + x) + "px";
          var matchedCol = null;
          if (y > -25 && y < parseInt(me.tableDiv.style.height)) {
            //Look at each vLine and decide which the mouse is nearest.
            //Adjust the mouse coordinates to the vLine's frame of reference so they can be compared.
            for (var i = 0; i < me.vLines.length; i++) {
              var line = me.vLines[i];
              var lineLeft = parseInt(line.style.left);
              var mouseLeft = x + cursorStartX; //mouseLeft is now same as pui.getMouseX(event);

              var mouseLineDiffX = 0; //The difference between the mouse X and the vLine's left offset.
              var mouseLineDiffY = 0;

              if (me.designMode) {
                //Note: in Designer, the mouseLeft is only used in a comparison, not in positioning columnPointer.
                mouseLineDiffX += me.tableDiv.designItem.designer.getLeftOffset();
              }
              else {
                //Get the runtimeContainer's position relative to the page. The bounding rectangle handles
                //positions of any parent DIV elements the customer's start.html may have added. #3344.
                var rect = pui.runtimeContainer.getBoundingClientRect();
                //BoundingClientRect is relative to the viewport, so adjust for scroll position.
                if (typeof window.pageXOffset == "number") {
                  mouseLineDiffX = rect.left + window.pageXOffset;
                  mouseLineDiffY = rect.top + window.pageYOffset;
                } else {
                  //window.pageXOffset doesn't exist for IE8, so use documentElement.scrollLeft.
                  //See: https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect
                  mouseLineDiffX = rect.left + document.documentElement.scrollLeft;
                  mouseLineDiffY = rect.top + document.documentElement.scrollTop;
                }

                //Compensate if the grid is inside a window. (See #3532 for test cases.)
                var windowDiv = me.tableDiv.parentNode;
                var acont = pui["getActiveContainer"]();
                if (windowDiv.isPUIWindow == true) {
                  mouseLineDiffX += parseInt(windowDiv.style.left);
                  mouseLineDiffY += parseInt(windowDiv.style.top);
                } else if (acont != null && acont.isPUIWindow === true) {
                  //Note: in RDF, the active container is a PUIWindow. In Genie, pui.runtimeContainer is
                  //the active container but not a PUIWindow. So, the same offset isn't added twice.
                  mouseLineDiffX += acont.offsetLeft;
                  mouseLineDiffY += acont.offsetTop;
                }
              }

              if (context == "dspf" && me.tableDiv.parentNode.getAttribute("container") == "true") {
                //In Rich Display or Designer, compensate when the grid is in a container.
                mouseLineDiffX += pui.layout.getContainerOffset(me.tableDiv.parentNode).x;
                mouseLineDiffY += pui.layout.getContainerOffset(me.tableDiv.parentNode).y;
              }

              mouseLeft -= mouseLineDiffX;

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
                var prt = line.parentNode;
                var top = parseInt(line.style.top) - 10;
                var left = parseInt(line.style.left) - 4;
                var offset = {x:0, y:0};
                //Since columnPointer doesn't have same parent as the vLine, adjust columnPointer's position.
                if (!me.designMode) {
                  //In RDF or Genie, the previous mouse calculations can be used because the
                  //columnPointer's parent is <body>, and the mouse position is based on <body>.
                  offset.y = mouseLineDiffY;
                  offset.x = mouseLineDiffX;
                } else if (context == "dspf" && prt.getAttribute("container") == "true") {
                  //We are in Designer and the Grid is inside a container. In Designer, the columnPointer's
                  //parent is a designer div, not the body. So the mouse calculation cannot be used.
                  offset = pui.layout.getContainerOffset(prt);
                }
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
          pui.designer.testDragOverGridOrLayout({
            x: x + cursorStartX,
            y: y + cursorStartY,
            designer: designItem.designer,
            inGridCell: false,
            inLayoutContainer: inLayoutContainer,
            dom: designItem.dom,
            designItem: designItem,
            cursorStartX: cursorStartX,
            cursorStartY: cursorStartY,
            canBelongToGrid: false,
            canBelongToLayout: true
          });

          var selection = designItem.designer.selection;
          if (selection.snapToGrid) {
            x += me.tableDiv.startLeft;
            y += me.tableDiv.startTop;
            x = selection.snap(x, pui.multX);
            y = selection.snap(y, pui.multY, (context == "genie" ? 3 : 0));
            x -= me.tableDiv.startLeft;
            y -= me.tableDiv.startTop;
          }
        }
        me.doThisToTableDivs(function (domObj) {
          domObj.style.top = (domObj.startTop + y) + "px";
          domObj.style.left = (domObj.startLeft + x) + "px";
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
    addEvent(cell, "mousedown", mousedown);
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
        var y = getMouseY(event) - cursorStartY;
        var x = getMouseX(event) - cursorStartX;
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
            me.removeRow();
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
      me.setHeadings();
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

  function centerHeadingVertically(cell) {
    var content = cell.firstChild;
    if (content == null) return;
    content.style.whiteSpace = "normal";
    content.style.position = "absolute";
    content.style.top = "50%";
    var height = content.offsetHeight;
    if (height > 0) {
      content.style.marginTop = (-parseInt(height / 2)) + "px";
    }
    else {
      content.style.position = "relative";
      content.style.webkitTransform = "translateY(-50%)";
      content.style.mozTransform = "translateY(-50%)";
      content.style.msTransform = "translateY(-50%)";
      content.style.transform = "translateY(-50%)";
    }
    var width = parseInt(cell.style.width);
    if (isNaN(width)) width = 0;
    width = width - 8; // account for some padding (4 pixels on each side)
    if (width < 0) width = 0;
    content.style.left = "0px";
    content.style.width = width + "px";
  }

  function makeCell(row, col) {
    var cell = document.createElement("div");
    me.tableDiv.appendChild(cell);
    cell.style.position = "absolute";
    cell.style.overflow = "hidden";
    cell.style.padding = "0px";
    cell.style.verticalAlign = "middle";
    if (!pui.iPadEmulation) {
      cell.style.cursor = me.cellCursor;
    }
    if (row > 0 || !me.hasHeader) cell.style.webkitTapHighlightColor = "rgba(0,0,0,0)";

    var header = (row == 0 && me.hasHeader);
    var even = ((row % 2) == 1);
    if (me.hasHeader) even = !even;

    if (header) {
      if (col < me.columnHeadings.length) {
        cell.innerHTML = '<div style="' + getPaddingCSS() + '">' + me.columnHeadings[col] + '</div>';
        centerHeadingVertically(cell);
      }
    }

    if (me.designMode) setCellStyles(cell, header, even, col);

    cell.onmouseover = function (e) {
      e = e || window.event;
      if (me.dragging) return;
      if (!me.hasHeader) executeEvent("onrowmouseover", row + 1, null, e, col);
      if (me.hasHeader && row != 0) executeEvent("onrowmouseover", row, null, e, col);
      if (!me.hoverEffect) return;
      if ((pui["is_touch"] && !pui["is_mouse_capable"] && !me.designMode) || pui.iPadEmulation) return;
      var header = (row == 0 && me.hasHeader);
      if (header) return;
      var cols = me.cells[row];

      me.setRowBackground(row, true);

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
      e = e || window.event;
      if (!me.hasHeader) executeEvent("onrowmouseout", row + 1, null, e, col);
      if (me.hasHeader && row != 0) executeEvent("onrowmouseout", row, null, e, col);
      var header = (row == 0 && me.hasHeader);
      if (header) return;
      me.setRowBackground(row);
    };

    cell.onmousedown = function (event) {
      event = event || window.event;
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
        var ctrOffset = pui.getOffset(pui.runtimeContainer);
        if (context == "genie") ctrOffset = pui.getOffset(pui["getActiveContainer"]()); //handles grid inside a window. #3541.
        var parent = contextMenu.parentNode;
        if (parent != null && parent.tagName == "FORM") parent = parent.parentNode; // this will handle Genie (although the the context menu option is not available in Genie yet)
        if (parent != null) {

          var offset = {x:0, y:0};
          if (context == "dspf" && parent.getAttribute("container") == "true") {

            offset = pui.layout.getContainerOffset(parent);

          }
          else if (parent.isPUIWindow) {

            offset.x = parent.offsetLeft;
            offset.y = parent.offsetTop;

          }

          offset.x += ctrOffset[0];
          offset.y += ctrOffset[1];
          x -= offset.x;
          y -= offset.y;

        }
        // Center under the finger for touch devices.
        if (pui["is_touch"] && !pui["is_mouse_capable"]) {

          x -= contextMenu.clientWidth / 2;

          contextMenu.onselectstart = function(e) { return false; };
          if (typeof contextMenu.style.MozUserSelect != "undefined") contextMenu.style.MozUserSelect = "none";
          if (typeof contextMenu.style.webkitUserSelect != "undefined") contextMenu.style.webkitUserSelect = "none";

        }
        contextMenu.style.zIndex = me.contextMenuZIndex;
        contextMenu.style.visibility = "";
        contextMenu.style.display = "";
        // Position after show, as some browsers (FF) report menu width 0 when hidden.
        var doc = document.documentElement;
        var docScrollLeft = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
        var docScrollTop = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
        var maxX = document.documentElement.clientWidth + docScrollLeft - contextMenu.clientWidth - 10 - ctrOffset[0]; // width of menu plus scrollbar
        var maxY = document.documentElement.clientHeight + docScrollTop - contextMenu.clientHeight - 10 - ctrOffset[1]; // height of menu plus scrollbar
        if (x > maxX) x = maxX;
        if (y > maxY) y = maxY;
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

    // Interestingly, Chrome on Android seems to fire a 'onmousedown' event with the mouse button 
    // button number set to correspond to a right click when a tap/hold gesture is done. So, the 
    // normal mouse code works fine there.

    // On IOS Safari/Chrome and also the Android browser, this doesn't happen. Which is expected, as 
    // the behavior on Chrome for Android is not standard...

    if (pui["is_touch"] && !pui["is_mouse_capable"] && !pui.is_chrome) {

      pui.taphold(cell, function (e) {

        // It would be nice to just create and dispatch a 'MouseEvent' here.
        // However, the documentation on this is poor, and it was not clear how to set the 
        // 'pageX' and 'pageY' properties on the created event through this interface.        
        // The 'pui.getMouseX/Y' calls in the mousedown code look at these to position the menu. 

        e.button = 3;
        cell.onmousedown(e);

      });

    }

    cell.onclick = function (e) {

      e = e || window.event;
      var target = getTarget(e);
      if (target.tagName == "IMG" && target.combo)
        return;

      var isRight = pui.isRightClick(e);
      if (target.tagName != "INPUT" && target.tagName != "SELECT" && target.tagName != "OPTION") {
        if (!me.hasHeader) executeEvent("onrowclick", row + 1, isRight, e, col);
        if (me.hasHeader && row != 0) executeEvent("onrowclick", row, isRight, e, col);
      }
      if (!me.designMode) {

        me.setCursorRRN(row);

        var prevent = ((target.tagName == "INPUT" || target.tagName == "SELECT") && !target.disabled && !target.readOnly);

        // if (isRight && me.contextMenuId!=null && getObj(me.contextMenuId)!=null)
        //  prevent = true;

        if (me.selectionEnabled && !prevent && (row > 0 || !me.hasHeader)) {
          if (me.recNum != null && !isNaN(me.recNum) && me.recNum > 0) {

            if (!e) e = window.event;

            if (me.singleSelection || (me.extendedSelection && !e.ctrlKey && !e.shiftKey && !e.metaKey)) {
              var numRows = me.hLines.length - 1;
              var clickedRow = row + me.recNum - (me.hasHeader ? 1 : 0);

              for (var i = 0; i < me.dataArray.length; i++) {
                var curRow = i - me.recNum + 1 + (me.hasHeader ? 1 : 0);

                // this condition allows the user to unselect a record using the ctrl key.
                //  Only do it if it's NOT a right click mouse event 
                // -or-
                //  It's a right click and they aren't on a selected row.
                var isRowSelected = (clickedRow <= me.dataArray.length) && me.dataArray[clickedRow - 1].selected;
                if (me.isFiltered()) isRowSelected = (clickedRow <= me.dataArray.length) && me.filteredDataArray[clickedRow - 1].selected;

                if (!isRight || (isRight && !isRowSelected)) {
                  if ((!e.ctrlKey && !e.metaKey) || (curRow != row)) {
                    if (me.dataArray[i].selected == true) {
                      handleSelection(me.dataArray[i], true, false, i);
                    }
                  }
                }
                if ((curRow >= 0 && !me.hasHeader) || curRow >= 1) {
                  if (curRow < numRows) {
                    me.setRowBackground(curRow);
                  }
                }
              }

              if (me.isFiltered()) {
                for (var curRow = (me.hasHeader ? 1 : 0); curRow < numRows; curRow++) {
                  me.setRowBackground(curRow);
                }
              }

            }

            var dataRecords = me.dataArray;
            if (me.isFiltered()) dataRecords = me.filteredDataArray;
            var adjustedRow = row + me.recNum - 1 + (me.hasHeader ? 0 : 1);
            if (me.extendedSelection && e.shiftKey) {
              if (me.selectedRecordNum == null) me.selectedRecordNum = adjustedRow;
              var fromRecordNum = me.selectedRecordNum;
              var toRecordNum = adjustedRow;
              if (fromRecordNum > toRecordNum) {
                var tempRecordNum = fromRecordNum;
                fromRecordNum = toRecordNum;
                toRecordNum = tempRecordNum;
              }
              var numRows = me.hLines.length - 1;
              for (var i = 0; i < dataRecords.length; i++) {

                var curRow = i - me.recNum + 1;
                if (i + 1 >= fromRecordNum && i + 1 <= toRecordNum) {
                  if (dataRecords[i].selected != true) {
                    handleSelection(dataRecords[i], false, true, i);
                  }
                }
                else {
                  if (dataRecords[i].selected == true) {
                    handleSelection(dataRecords[i], true, false, i);
                  }
                }
                if ((curRow >= 0 && !me.hasHeader) || curRow >= 1) {
                  if (curRow < numRows) {
                    me.setRowBackground(curRow);
                  }
                }
              }
            }
            else if (dataRecords[adjustedRow - 1] != null && dataRecords[adjustedRow - 1].length > 0) {
              if (dataRecords[adjustedRow - 1].selected == true && !isRight) dataRecords[adjustedRow - 1].selected = false;
              else dataRecords[adjustedRow - 1].selected = true;
              if (me.selectionField != null && dataRecords[adjustedRow - 1] != null && dataRecords[adjustedRow - 1].selection != null) {
                dataRecords[adjustedRow - 1].selection.modified = true;
                if (dataRecords[adjustedRow - 1].selected) {
                  dataRecords[adjustedRow - 1].selection.value = me.selectionValue;
                  //Set the response value for rows that have not been initally rendered but have been modified with setDataValue()
                  if (dataRecords[adjustedRow - 1].selection.responseValue) dataRecords[adjustedRow - 1].selection.responseValue = dataRecords[adjustedRow - 1].selection.value;
                }
                else {
                  dataRecords[adjustedRow - 1].selection.value = (me.selectionField.dataType == "indicator" ? "0" : " ");
                  //Set the response value for rows that have not been initally rendered but have been modified with setDataValue()
                  if (dataRecords[adjustedRow - 1].selection.responseValue) dataRecords[adjustedRow - 1].selection.responseValue = dataRecords[adjustedRow - 1].selection.value;
                }
              }
              pui.modified = true;
              me.setRowBackground(row, true);
            }
            me.selectedRecordNum = adjustedRow;
          }
        }

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
        // when a box receives focus.
        if (typeof (pui["grid text selection"]) == "undefined" || pui["grid text selection"] == false) {
          if (target.tagName != "INPUT" && target.tagName != "SELECT" && target.tagName != "TEXTAREA") {
            // position to input box in first column, if it is present
            var cell = me.cells[row][0];
            placeCursorOnCell(cell);
          }
        }
      }

      function handleSelection(record, isSelected, useSelectionValue, index) {
        pui.modified = true;
        record.selected = !isSelected;
        if (me.selectionField != null) {
          if (record.selection == null) {
            // if the row has not been rendered and is filtered or sorted use the subfileRow or beforeSort properties 
            // else use the passed index as a fallback 
            var row;
            if (record.subfileRow || record.beforeSort) row = record.subfileRow || (record.beforeSort + 1);
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
          if (useSelectionValue) record.selection.value = me.selectionValue;
          else record.selection.value = (me.selectionField.dataType == "indicator" ? "0" : " ");
          //Set the response value for rows that have not been initally rendered but have been modified with setDataValue() #4041
          if (record.selection.responseValue) record.selection.responseValue = record.selection.value;
        }
      }
    };

    cell.ondblclick = function (e) {
      e = e || window.event;
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
  }

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

      if (inputBox.tagName == "INPUT" || inputBox.tagName == "TEXTAREA" || inputBox.tagName == "SELECT" || inputBox.comboBoxWidget != null) {

        if (inputBox.style.visibility != "hidden" && inputBox.style.display != "none") {

          found = true;
          break;

        }

      }
      inputBox = inputBox.nextSibling;

    }
    if (!found) return false;
    if (inputBox.comboBoxWidget != null) inputBox = inputBox.comboBoxWidget.getBox();
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
      if (col < propValues.length) {
        propValue = propValues[col];
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
      pstring = pui.getSQLParams(me.dataProps);

      if (me.isFiltered()) {
        var headerRow = me.cells[0];
        // Look in each column for filter text.
        var filtNum = 0; //CGI looks for fltrcol 0 to 9 and stops when one isn't found.
        for (var i = 0; i < headerRow.length; i++) {
          var headerCell = headerRow[i];
          if (headerCell.columnId >= 0 && headerCell.filterText != null) {
            pstring += "&fltrcol" + String(filtNum) + "=" + (headerCell.columnId + 1);
            pstring += me.prepareFilterText(String(filtNum), headerCell.filterText);
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
      if (me.dataProps["data url"] != null && me.dataProps["data url"] != "" && me.sortBy != null) {
        pstring += "&order=" + me.sortBy;
      }

    } //done creating sql query parameters.

    if (cache) {
      me.unMask();
      if (pui.sqlcache == null) pui.sqlcache = {};
      if (pui.sqlcache[start] == null) pui.sqlcache[start] = {};
      if (pui.sqlcache[start].sql === sql &&
        pui.sqlcache[start].pstring === pstring &&
        pui.sqlcache[start].limit === limit &&
        pui.sqlcache[start].customURL === customURL) {
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
    if (context == "genie") req["postData"] = "AUTH=" + GENIE_AUTH;
    if (context == "dspf") req["postData"] = "AUTH=" + pui.appJob.auth;
    if (pui["secLevel"] > 0) {

      req["postData"] += "&q=" + encodeURIComponent(pui.getSQLVarName(me.tableDiv));

      var orderBy = me.dataProps["order by"];
      if (me.sortBy != null) orderBy = me.sortBy;
      if (orderBy && orderBy != "") {

        req["postData"] += "&order=" + orderBy;

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

    var fetchCounter = me.dataProps["allow any select statement"];
    if (fetchCounter != null && (fetchCounter == "true" || fetchCounter == true))
      req["postData"] += "&FetchCounter=Y";

    req["onready"] = function (req) {
      me.unMask();
      var response;
      var successful = false;
      if (me.dataProps["data transform function"] && req.getStatus() == 200) {

        try {

          var fn = eval("window." + me.dataProps["data transform function"]);
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
    if ((me.dataProps["custom sql"] != null && me.dataProps["custom sql"] != "") ||
      (me.dataProps["data url"] != null && me.dataProps["data url"] != "") ||
      (me.dataProps["database file"] != null && me.dataProps["database file"] != "")) {
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
   * Remove a column.
   * @param {Number} columnId  The original columnId, as positioned in design-time.
   * @returns {undefined}
   */
  this["removeColumn"] = function (columnId) {
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
      var cell = me.cells[row][from];
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
      }
    } //end if me.designMode.
    me.sizeAllCells();
    if (!me.designMode) {
      if (me.isDataGrid()) {
        var fields = me.dataProps["database fields"];
        if (fields != null && fields != "") {
          fields = fields.split(",");
          fields.splice(to, 0, fields[from]); // insert from field into the to position
          var adjustedFrom = from;
          if (to <= from) adjustedFrom++; // from has moved - we inserted something infront of it 
          fields.splice(adjustedFrom, 1); // remove the from cell
          me.dataProps["database fields"] = fields.join(",");
        }
      }
      else {
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

  this.removeRow = function () {
    n = me.hLines.length;
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
  };

  this["setNumberOfRows"] = function (numRows) {
    me.setProperty("number of rows", String(numRows));
    me.sizeAllCells();
    me.setAllCellStyles();

    // Found this code to be losing changes to components after grid resize for 
    // 'expand to layout'. This causes auto-complete box to clear (due to lost hidden value)
    // and also general loss of user edits to input fields due to 'removeAllResponseElements'. 

    // It was not clear why it would need to do this, so we will disable it for now -- DR.

    //for (var i = 0; i < me.runtimeChildren.length; i++) {
    //  me.runtimeChildren[i].domEls = [];
    //}
    //removeAllResponseElements();

    me.getData();
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

      }
      else {

        try{ delete localStorage[me.storageKey]; }catch(exc){}

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

  this.getFieldNameFromColumnIndex = function (columnIndex) {
    if (columnIndex == null || isNaN(columnIndex)) return null;
    for (var i = 0; i < me.runtimeChildren.length; i++) {
      var itm = me.runtimeChildren[i];
      var val = itm["value"];
      if (itm["field type"] == "html container") val = itm["html"];
      if (val != null && typeof val == "object" && val["fieldName"] != null) {
        var col = Number(itm["column"]);
        if (col == columnIndex) return val["fieldName"].toUpperCase();
      }
    }
    return null;
  };

  this.getColumnIndexFromFieldName = function (fieldName) {
    var fieldNameUpper = pui.fieldUpper(fieldName);
    for (var i = 0; i < me.runtimeChildren.length; i++) {
      var itm = me.runtimeChildren[i];
      var val = itm["value"];
      if (itm["field type"] == "html container") val = itm["html"];
      if (val != null && typeof val == "object" && val["fieldName"] != null && pui.fieldUpper(val["fieldName"]) == fieldNameUpper) {
        var columnIndex = Number(itm["column"]);
        if (columnIndex != null && !isNaN(columnIndex)) return columnIndex;
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
   * @returns {undefined}
   */
  this.setSearchIndexes = function (headerCell) {
    // dataGrids do not use client-side filtering and don't need searchIndexes, formats, or rtIdxs
    if (me.isDataGrid()) return;
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
      if (pui.isBound(val) && !isNaN(col) && col == headerCell.col) {
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
    me.ffbox.grid = me;
    me.ffbox.headerCell = headerCell;
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

    var headerCell = me.ffbox.headerCell;

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

    if (me.isDataGrid()) {
      me.highlighting.text = text;
      findText = text;
      findColumn = headerCell.columnId + 1; //CGI program's columns start at 1, not 0.
      findStartRow = 1;
      if (findNext) findStartRow = me.recNum + 1; //CGI program will search after top visible row.
      me.mask();
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
      if (me.isFiltered()) dataRecords = me.filteredDataArray;
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

  this["startFilter"] = function (headerCell) {
    if (typeof headerCell == "number") headerCell = me.cells[0][getCurrentColumnFromId(headerCell)];
    if (headerCell == null) return;
    me.ffbox.grid = me;
    me.ffbox.headerCell = headerCell;
    me.ffbox.type = "filter";
    me.ffbox.onsearch = me.doFilter;
    me.ffbox.setPlaceholder(pui["getLanguageText"]("runtimeText", "filter text") + "...");
    me.ffbox.positionByGridColumn(headerCell);
    if (me.isDataGrid()) me.ffbox.interval = 250; //Slows reloading data to 250ms after last keystroke.
    me.setSearchIndexes(headerCell);
    me.highlighting.columnId = headerCell.columnId;
    me.highlighting.col = headerCell.col;
    me.ffbox.show();
    me.ffbox.clear();
    if (headerCell.filterText != null && headerCell.filterText != "") {
      me.ffbox.setText(headerCell.filterText);
      me.highlighting.text = headerCell.filterText;
      me.getData();
    }
    me.ffbox.focus();
  };

  this.doFilter = function (text) {
    var headerCell = me.ffbox.headerCell;
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
    if (typeof headerCell == "number") headerCell = me.cells[0][getCurrentColumnFromId(headerCell)];
    if (headerCell == null) return;
    me.setSearchIndexes(headerCell);
    me.highlighting.columnId = headerCell.columnId; //need to set when called from API w/o startFilter.
    me.highlighting.col = headerCell.col;
    me.highlighting.text = text;
    me.setFilterIcon(headerCell);
    headerCell.filterText = text;

    if (me.isDataGrid()) {
      // Filter in this field for DB-driven grids. (Assume one field per column.)
      me.totalRecs = null; // make sure the CGI gives us totalRecs (count of results).
      me.recNum = 1; // Show record 1 on row 1.

      me.mask(); // disable UI until server responds.
    }
    else{
      // Do client-side filtering.
      var idxes = headerCell.searchIndexes;
      var col = headerCell.columnId;
      me.filteredDataArray = [];
      for (var i = 0; i < me.dataArray.length; i++) {
        var record = me.dataArray[i];
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
        if (!record.filteredOut) {
          me.filteredDataArray.push(record);
        }
      }
    } //done client-side filtering.
    me.getData();
    if (persistState) me.saveFilters();
    executeEvent("onfilterchange");
  };


  this.saveFilters = function () {
    var filters = [];
    var headerRow = me.cells[0];
    for (var i = 0; i < headerRow.length; i++) {
      var headerCell = headerRow[i];
      if (headerCell.filterText != null && headerCell.filterText != "") {
        filters.push({ "text": headerCell.filterText, "column": headerCell.columnId, "curCol": headerCell.col });
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
    if (typeof headerCell == "number") headerCell = me.cells[0][getCurrentColumnFromId(headerCell)];
    if (headerCell == null || typeof headerCell.filterText == 'undefined') return null;
    return headerCell.filterText;
  };

  /**
   * Return true if a cell's value should be included in filtered data; returns
   * false if the value should not be included.
   * 
   * Comparisons are case insensitive.
   * 
   * Supported expressions:
   *   between x and y
   *   values x,y,z              (exact matches)
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
        if (value.toLowerCase() == text) return true;
      }
      return false;
    }
    else if (text.substr(0,12).toLowerCase() == "starts with ") {
      var text = text.substr(12).toLowerCase();
      return (text == value.substr(0, text.length).toLowerCase());
    }
    else if (text.substr(0,2) == "==") {
      text = text.substr(2);
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

    if (me.isDataGrid()) {
      me.totalRecs = null; // make sure the CGI gives us count of results.
      me.recNum = 1; // Show record 1 on row 1.

      me.mask(); // disable UI until server responds.
    }
    else{
      // Remove client-side filtering.
      var col = headerCell.columnId;
      me.filteredDataArray = [];
      for (var i = 0; i < me.dataArray.length; i++) {
        var record = me.dataArray[i];
        if (record.filteredOutArray != null) {
          record.filteredOutArray[col] = false;
        }
        me.setFilteredOut(record);
        if (!record.filteredOut) {
          me.filteredDataArray.push(record);
        }
      }
    }

    me.getData();
    if (persistState) me.saveFilters();
    executeEvent("onfilterchange");
  };

  this["removeAllFilters"] = function () {
    if (me.waitingOnRequest) return;
    var headerRow = me.cells[0];
    for (var i = 0; i < headerRow.length; i++) {
      var headerCell = headerRow[i];
      me.removeFilterIcon(headerCell);
      headerCell.filterText = null;
    }
    for (var i = 0; i < me.dataArray.length; i++) {
      var record = me.dataArray[i];
      record.filteredOutArray = null;
      record.filteredOut = false;
    }
    me.filteredDataArray = [];
    if (me.isDataGrid()) {
      me.totalRecs = null; // make sure the CGI gives us count of results.
      me.recNum = 1; // Show record 1 on row 1.

      me.mask(); // disable UI until server responds.
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

  this.isFiltered = function () {
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
      if (me.sortIcon != null && me.sortIcon.parentNode === destination) destination.insertBefore(headerCell.filterIcon, me.sortIcon);
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
    var colWidths = [];
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
      me["removeColumn"](colId);
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
    // And make the columns sortable is sorting is enabled
    if (!reset && (checked || me.isDataGrid())) me.getData();
    if (me.sortable) me.makeSortable();
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
        cellDesign(headerRow[col], true);
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
    return true;
  };

  this.customSqlCallback = function (request) {
    var response, error;
      var headings = "", columnWidths = "";
    var itm = me.tableDiv.designItem;

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
    for (i = 0; i < response.fields.length; i++) {
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
    me.setProperty("column headings", headings);
    sendPropertyToDesigner(itm, "column headings", headings);
    itm.designer.propWindow.refreshProperty("column headings");

    me.setProperty("number of columns", response.fields.length);
    sendPropertyToDesigner(itm, "number of columns", response.fields.length);
    itm.designer.propWindow.refreshProperty("number of columns");

    me.setProperty("column widths", columnWidths);
    sendPropertyToDesigner(itm, "column widths", columnWidths);
    itm.designer.propWindow.refreshProperty("column widths");
  };

  this.helpTextGridProperties = function(defVal, descVal, descAdd, noteVal) {
    var codeOpen = "<code style='color: blue; letter-spacing: 0px; font-weight: bold;'>";
    var codeClose = "</code>";

    var falseSpan = "<span title='The default value of the property is false.'>false</span>";
    var trueSpan = "<span title='The default value of the property is true.'>true</span>";

    var blankSpan = "<span title='The default value of the property is unset or not defined.'>[blank]</span>";

    var cssSpan = "[<span title='The default value is the value defined in the CSS &#010;(theme/developer CSS classes defined in a CSS&#010;file or \"style\" DOM attribute) for the element.'>CSS value</span>]";

    var placeholderSpan = "[<span title='The default value of the property is placeholder &#010;text, such as \"Lorem Ipsum...\" or \"HTML Content\".'>placeholder text</span>]";

    var browserSpan = "[<span title='The default is determined by the browser for the element.'>browser setting</span>]";

    var widgetSpan = "[<span title='The default value of this property is determined by the selected widget.'>selected widget</span>]";

    var themeSpan = "[<span title='The default value of this property is based on the selected widget and its theme/template/purpose.'>selected widget</span>]";

    var skinSpan = "[<span title='The default value of this property is determined by &#010;the selected skin and it's defaults, CSS, and/or JavaScript customizations.'>selected skin</span>]";

    var idSpan = "[<span title='The default ID is based on the name of the selected &#010;widget with no spaces and the first letter of each word capitalized.'>WidgetName</span>][<span title='A whole number value starting from 1 determined by how many of the same widget have previously been added to the Design grid.'>number</span>]";

    var positionSpan = "[<span title='The default values are determined by where the &#010;widget is dropped/placed on the Designer grid.'>user drop point</span>]";

    var bindSpan = "<span title='This property requires being bound and a value passed by an RPG program.'>[bound value]</span>";

    var otherText = " The 'Other...' option can be selected to write in a custom value.";
    var pixelText = "Specify in pixels. <br><br>Example: " + codeOpen + "12px" + codeClose;

    var listStyleTag = "<style>ul.listing {display: block; list-style-type: disc; padding-left: 10px; margin-left: 15px;}</style>";
    var optionsOpen = "<hr><span style='font-weight:bold;'>Valid options</span>: <br><ul class='listing'><li>";
    // var optionsClose = "</li></ul>";
    var overflowOptions = listStyleTag + optionsOpen +
      codeOpen + "visible" + codeClose + " - lets the content flow beyond the dimensions of the element without a scrollbar.</li><li>" +
      codeOpen + "hidden" + codeClose + " - does not display a scrollbar and hides overflowing content.</li><li>" +
      codeOpen + "scroll" + codeClose + " - always displays the scrollbar.</li><li>" +
      codeOpen + "auto" + codeClose + " - displays the scrollbar only when the element's content goes beyond the elements dimensions.</li></ul>";

    var fontOptions = "<hr><span style='font-weight:bold;'>Valid Font Families</span>: <select style='background-color: #eee; border:none; width: 125px; height: 14px; font-size: 12px; font-family: Arial;'>" +
      "<option>Font Family List</option>" +
      "<optgroup label='Serif'>" +
      "<option style='font-family: Georgia, serif !important;'>Georgia, serif</option>" +
      "<option style='font-family:'Palatino Linotype', 'Book Antiqua', Palatino, serif !important;'>'Palatino Linotype', 'Book Antiqua', Palatino, serif</option>" +
      "<option style='font-family: 'Times New Roman', Times, serif !important;'>'Times New Roman', Times, serif</option>" +
      "</optgroup>" +
      "<optgroup label='Sans-Serif'>" +
      "<option style='font-family: Arial, Helvetica, sans-serif !important;'>Arial, Helvetica, sans-serif</option>" +
      "<option style='font-family: 'Arial Black', Gadget, sans-serif !important;'>'Arial Black', Gadget, sans-serif</option>" +
      "<option style='font-family: 'Comic Sans MS', cursive, sans-serif !important;'>'Comic Sans MS', cursive, sans-serif</option>" +
      "<option style='font-family: Impact, Charcoal, sans-serif !important;'>&nbsp;&nbsp;&nbsp;Impact, Charcoal, sans-serif</option>" +
      "<option style='font-family: 'Lucida Sans Unicode', 'Lucida Grande', sans-serif !important;'>'Lucida Sans Unicode', 'Lucida Grande', sans-serif</option>" +
      "<option style='font-family: Tahoma, Geneva, sans-serif !important;'>Tahoma, Geneva, sans-serif</option>" +
      "<option style='font-family: 'Trebuchet MS', Helvetica, sans-serif !important;'>'Trebuchet MS', Helvetica, sans-serif</option>" +
      "<option style='font-family: Verdana, Geneva, sans-serif !important;'>Verdana, Geneva, sans-serif</option>" +
      "</optgroup>" +
      "<optgroup label='Monospace'>" +
      "<option style='font-family: 'Courier New', Courier, monospace !important;'>'Courier New', Courier, monospace</option>" +
      "<option style='font-family: 'Lucida Console', Monaco, monospace !important;'>'Lucida Console', Monaco, monospace</option>" +
      "</optgroup>" +
      "</select>" +
      "<br>All other fonts must be imported in some manner.<br><br>Example:" + codeOpen + "<br>@font-face {" +
      "<br>&ensp; font-family: myCustomFont;" +
      "<br>&ensp; src: url('myCustomFont.ttf');" +
      "<br>}<br><br>&#x1F6D1 Make sure your font file extension is supported in the browsers users will be using before attempting this." + codeClose + "<hr>";

    var colorOptions = "<hr><span style='font-weight:bold;'>Usage</span>: Enter a color name, hex, or select a color." +
      "<hr><span style='font-weight:bold;'>Valid Color Names</span>: " +
      "<select style='background-color: #eee; border:none; width: 125px; height: 14px; font-size: 12px; font-family: Arial;'>" +
      "<option>Text Colors</option>" +
      "<option style='font-weight: bold; background-color: #71706F !important; color: AliceBlue;'>AliceBlue</option>" +
      "<option style='font-weight: bold; background-color: #716363 !important; color: AntiqueWhite;'>AntiqueWhite</option>" +
      "<option style='font-weight: bold; background-color: #716363 !important; color: Aqua;'>Aqua</option>" +
      "<option style='font-weight: bold; background-color: #716363 !important; color: Aquamarine;'>Aquamarine</option>" +
      "<option style='font-weight: bold; background-color: #8A6C6C !important; color: Azure;'>Azure</option>" +
      "<option style='font-weight: bold; background-color: #716C6F !important; color: Beige;'>Beige</option>" +
      "<option style='font-weight: bold; background-color: #686964 !important; color: Bisque;'>Bisque</option>" +
      "<option style='font-weight: bold; background-color: #828282 !important; color: Black;'>Black</option>" +
      "<option style='font-weight: bold; background-color: #825A5A !important; color: BlanchedAlmond;'>BlanchedAlmond</option>" +
      "<option style='font-weight: bold; background-color: #E6E6D3 !important; color: Blue;'>Blue</option>" +
      "<option style='font-weight: bold; background-color: #E3E3E2 !important; color: BlueViolet;'>BlueViolet</option>" +
      "<option style='font-weight: bold; background-color: #D9D2D2 !important; color: Brown;'>Brown</option>" +
      "<option style='font-weight: bold; background-color: #483723 !important; color: BurlyWood;'>BurlyWood</option>" +
      "<option style='font-weight: bold; background-color: #201822 !important; color: CadetBlue;'>CadetBlue</option>" +
      "<option style='font-weight: bold; background-color: #465040 !important; color: Chartreuse;'>Chartreuse</option>" +
      "<option style='font-weight: bold; background-color: #080901 !important; color: Chocolate;'>Chocolate</option>" +
      "<option style='font-weight: bold; background-color: #372821 !important; color: Coral;'>Coral</option>" +
      "<option style='font-weight: bold; background-color: #241A20 !important; color: CornflowerBlue; '>CornflowerBlue</option>" +
      "<option style='font-weight: bold; background-color: #695C30 !important; color: Cornsilk;'>Cornsilk</option>" +
      "<option style='font-weight: bold; background-color: #F6F6F3 !important; color: Crimson;'>Crimson</option>" +
      "<option style='font-weight: bold; background-color: #4A5469 !important; color: Cyan;'>Cyan</option>" +
      "<option style='font-weight: bold; background-color: #95A5A2 !important; color: DarkBlue;'>DarkBlue</option>" +
      "<option style='font-weight: bold; background-color: #0B040E !important; color: DarkCyan;'>DarkCyan</option>" +
      "<option style='font-weight: bold; background-color: #211412 !important; color: DarkGoldenRod;'>DarkGoldenRod</option>" +
      "<option style='font-weight: bold; background-color: #2C2C2C !important; color: DarkGray;'>DarkGray</option>" +
      "<option style='font-weight: bold; background-color: #CCCCCC !important; color: DarkGreen;'>DarkGreen</option>" +
      "<option style='font-weight: bold; background-color: #403129 !important; color: DarkKhaki;'>DarkKhaki</option>" +
      "<option style='font-weight: bold; background-color: #C3D4D9 !important; color: DarkMagenta;'>DarkMagenta</option>" +
      "<option style='font-weight: bold; background-color: #DEE7ED !important; color: DarkOliveGreen;'>DarkOliveGreen</option>" +
      "<option style='font-weight: bold; background-color: #372C21 !important; color: DarkOrange;'>DarkOrange</option>" +
      "<option style='font-weight: bold; background-color: #E4E6D6 !important; color: DarkOrchid;'>DarkOrchid</option>" +
      "<option style='font-weight: bold; background-color: #BBBFAC !important; color: DarkRed;'>DarkRed</option>" +
      "<option style='font-weight: bold; background-color: #3A2923 !important; color: DarkSalmon;'>DarkSalmon</option>" +
      "<option style='font-weight: bold; background-color: #16353F !important; color: DarkSeaGreen;'>DarkSeaGreen</option>" +
      "<option style='font-weight: bold; background-color: #D9CBCB !important; color: DarkSlateBlue;'>DarkSlateBlue</option>" +
      "<option style='font-weight: bold; background-color: #D1D1D1 !important; color: DarkSlateGray;'>DarkSlateGray</option>" +
      "<option style='font-weight: bold; background-color: #1D393B !important; color: DarkTurquoise;'>DarkTurquoise</option>" +
      "<option style='font-weight: bold; background-color: #EBEDED !important; color: DarkViolet;'>DarkViolet</option>" +
      "<option style='font-weight: bold; background-color: #1B0E1E !important; color: DeepPink;'>DeepPink</option>" +
      "<option style='font-weight: bold; background-color: #053725 !important; color: DeepSkyBlue;'>DeepSkyBlue</option>" +
      "<option style='font-weight: bold; background-color: #EBEBEB !important; color: DimGray;'>DimGray</option>" +
      "<option style='font-weight: bold; background-color: #2A1237 !important; color: DodgerBlue;'>DodgerBlue</option>" +
      "<option style='font-weight: bold; background-color: #E0E6CE !important; color: FireBrick;'>FireBrick</option>" +
      "<option style='font-weight: bold; background-color: #69604C !important; color: FloralWhite;'>FloralWhite</option>" +
      "<option style='font-weight: bold; background-color: #01030E !important; color: ForestGreen;'>ForestGreen</option>" +
      "<option style='font-weight: bold; background-color: #370537 !important; color: Fuchsia;'>Fuchsia</option>" +
      "<option style='font-weight: bold; background-color: #5F4C4C !important; color: Gainsboro;'>Gainsboro</option>" +
      "<option style='font-weight: bold; background-color: #615B69 !important; color: GhostWhite;'>GhostWhite</option>" +
      "<option style='font-weight: bold; background-color: #504930 !important; color: Gold;'>Gold</option>" +
      "<option style='font-weight: bold; background-color: #442E2C !important; color: GoldenRod;'>GoldenRod</option>" +
      "<option style='font-weight: bold; background-color: #020202 !important; color: Gray;'>Gray</option>" +
      "<option style='font-weight: bold; background-color: #BCE8D6 !important; color: Green;'>Green</option>" +
      "<option style='font-weight: bold; background-color: #275C69 !important; color: GreenYellow;'>GreenYellow</option>" +
      "<option style='font-weight: bold; background-color: #4C6269 !important; color: HoneyDew;'>HoneyDew</option>" +
      "<option style='font-weight: bold; background-color: #501130 !important; color: HotPink;'>HotPink</option>" +
      "<option style='font-weight: bold; background-color: #000402 !important; color: IndianRed;'>IndianRed</option>" +
      "<option style='font-weight: bold; background-color: #A3B0B6 !important; color: Indigo;'>Indigo</option>" +
      "<option style='font-weight: bold; background-color: #695D58 !important; color: Ivory;'>Ivory</option>" +
      "<option style='font-weight: bold; background-color: #5A5208 !important; color: Khaki;'>Khaki</option>" +
      "<option style='font-weight: bold; background-color: #5C5064 !important; color: Lavender;'>Lavender</option>" +
      "<option style='font-weight: bold; background-color: #825463 !important; color: LavenderBlush;'>LavenderBlush</option>" +
      "<option style='font-weight: bold; background-color: #4B4D4B !important; color: LawnGreen;'>LawnGreen</option>" +
      "<option style='font-weight: bold; background-color: #69605D !important; color: LemonChiffon;'>LemonChiffon</option>" +
      "<option style='font-weight: bold; background-color: #334850 !important; color: LightBlue;'>LightBlue</option>" +
      "<option style='font-weight: bold; background-color: #5A0C0C !important; color: LightCoral;'>LightCoral</option>" +
      "<option style='font-weight: bold; background-color: #5D5C69 !important; color: LightCyan;'>LightCyan</option>" +
      "<option style='font-weight: bold; background-color: #64605C !important; color: LightGoldenRodYellow;'>LightGoldenRodYellow</option>" +
      "<option style='font-weight: bold; background-color: #6F4343 !important; color: LightGray;'>LightGray</option>" +
      "<option style='font-weight: bold; background-color: #355158 !important; color: LightGreen;'>LightGreen</option>" +
      "<option style='font-weight: bold; background-color: #50404B !important; color: LightPink;'>LightPink</option>" +
      "<option style='font-weight: bold; background-color: #373430 !important; color: LightSalmon;'>LightSalmon</option>" +
      "<option style='font-weight: bold; background-color: #242B35 !important; color: LightSeaGreen;'>LightSeaGreen</option>" +
      "<option style='font-weight: bold; background-color: #034B3C !important; color: LightSkyBlue;'>LightSkyBlue</option>" +
      "<option style='font-weight: bold; background-color: #240535 !important; color: LightSlateGray;'>LightSlateGray</option>" +
      "<option style='font-weight: bold; background-color: #074845 !important; color: LightSteelBlue;'>LightSteelBlue</option>" +
      "<option style='font-weight: bold; background-color: #69605C !important; color: LightYellow;'>LightYellow</option>" +
      "<option style='font-weight: bold; background-color: #165869 !important; color: Lime;'>Lime</option>" +
      "<option style='font-weight: bold; background-color: #233237 !important; color: LimeGreen;'>LimeGreen</option>" +
      "<option style='font-weight: bold; background-color: #645A50 !important; color: Linen;'>Linen</option>" +
      "<option style='font-weight: bold; background-color: #370537 !important; color: Magenta;'>Magenta</option>" +
      "<option style='font-weight: bold; background-color: #CEB291 !important; color: Maroon;'>Maroon</option>" +
      "<option style='font-weight: bold; background-color: #2C3732 !important; color: MediumAquaMarine;'>MediumAquaMarine</option>" +
      "<option style='font-weight: bold; background-color: #CCA5E7 !important; color: MediumBlue;'>MediumBlue</option>" +
      "<option style='font-weight: bold; background-color: #160D3D !important; color: MediumOrchid;'>MediumOrchid</option>" +
      "<option style='font-weight: bold; background-color: #28012C !important; color: MediumPurple;'>MediumPurple</option>" +
      "<option style='font-weight: bold; background-color: #073336 !important; color: MediumSeaGreen;'>MediumSeaGreen</option>" +
      "<option style='font-weight: bold; background-color: #0B013F !important; color: MediumSlateBlue;'>MediumSlateBlue</option>" +
      "<option style='font-weight: bold; background-color: #644463 !important; color: MediumSpringGreen;'>MediumSpringGreen</option>" +
      "<option style='font-weight: bold; background-color: #2C3D54 !important; color: MediumTurquoise;'>MediumTurquoise</option>" +
      "<option style='font-weight: bold; background-color: #E3EDFB !important; color: MediumVioletRed;'>MediumVioletRed</option>" +
      "<option style='font-weight: bold; background-color: #A4859B !important; color: MidnightBlue;'>MidnightBlue</option>" +
      "<option style='font-weight: bold; background-color: #446469 !important; color: MintCream;'>MintCream</option>" +
      "<option style='font-weight: bold; background-color: #695450 !important; color: MistyRose;'>MistyRose</option>" +
      "<option style='font-weight: bold; background-color: #695454 !important; color: Moccasin;'>Moccasin</option>" +
      "<option style='font-weight: bold; background-color: #695454 !important; color: NavajoWhite;'>NavajoWhite</option>" +
      "<option style='font-weight: bold; background-color: #CE7EBE !important; color: Navy;'>Navy</option>" +
      "<option style='font-weight: bold; background-color: #675A48 !important; color: OldLace;'>OldLace</option>" +
      "<option style='font-weight: bold; background-color: #050535 !important; color: Olive;'>Olive</option>" +
      "<option style='font-weight: bold; background-color: #110D02 !important; color: OliveDrab;'>OliveDrab</option>" +
      "<option style='font-weight: bold; background-color: #373232 !important; color: Orange;'>Orange</option>" +
      "<option style='font-weight: bold; background-color: #370E00 !important; color: OrangeRed;'>OrangeRed</option>" +
      "<option style='font-weight: bold; background-color: #231E2B !important; color: Orchid;'>Orchid</option>" +
      "<option style='font-weight: bold; background-color: #585224 !important; color: PaleGoldenRod;'>PaleGoldenRod</option>" +
      "<option style='font-weight: bold; background-color: #596561 !important; color: PaleGreen;'>PaleGreen</option>" +
      "<option style='font-weight: bold; background-color: #0C5858 !important; color: PaleTurquoise;'>PaleTurquoise</option>" +
      "<option style='font-weight: bold; background-color: #450117 !important; color: PaleVioletRed;'>PaleVioletRed</option>" +
      "<option style='font-weight: bold; background-color: #825453 !important; color: PapayaWhip;'>PapayaWhip</option>" +
      "<option style='font-weight: bold; background-color: #504C49 !important; color: PeachPuff;'>PeachPuff</option>" +
      "<option style='font-weight: bold; background-color: #372516 !important; color: Peru;'>Peru</option>" +
      "<option style='font-weight: bold; background-color: #693A5C !important; color: Pink;'>Pink</option>" +
      "<option style='font-weight: bold; background-color: #3A3347 !important; color: Plum;'>Plum</option>" +
      "<option style='font-weight: bold; background-color: #4A5982 !important; color: PowderBlue;'>PowderBlue</option>" +
      "<option style='font-weight: bold; background-color: #BAC9CE !important; color: Purple;'>Purple</option>" +
      "<option style='font-weight: bold; background-color: #BDCDC8 !important; color: RebeccaPurple;'>RebeccaPurple</option>" +
      "<option style='font-weight: bold; background-color: #370000 !important; color: Red;'>Red</option>" +
      "<option style='font-weight: bold; background-color: #580505 !important; color: RosyBrown;'>RosyBrown</option>" +
      "<option style='font-weight: bold; background-color: #F2FBE2 !important; color: RoyalBlue;'>RoyalBlue</option>" +
      "<option style='font-weight: bold; background-color: #D9D1CB !important; color: SaddleBrown;'>SaddleBrown</option>" +
      "<option style='font-weight: bold; background-color: #642119 !important; color: Salmon;'>Salmon</option>" +
      "<option style='font-weight: bold; background-color: #45382F !important; color: SandyBrown;'>SandyBrown</option>" +
      "<option style='font-weight: bold; background-color: #010E27 !important; color: SeaGreen;'>SeaGreen</option>" +
      "<option style='font-weight: bold; background-color: #825E45 !important; color: SeaShell;'>SeaShell</option>" +
      "<option style='font-weight: bold; background-color: #E8EAEE !important; color: Sienna;'>Sienna</option>" +
      "<option style='font-weight: bold; background-color: #5C4A4A !important; color: Silver;'>Silver</option>" +
      "<option style='font-weight: bold; background-color: #1F4455 !important; color: SkyBlue;'>SkyBlue</option>" +
      "<option style='font-weight: bold; background-color: #FFF2CD !important; color: SlateBlue;'>SlateBlue</option>" +
      "<option style='font-weight: bold; background-color: #13102C !important; color: SlateGray;'>SlateGray</option>" +
      "<option style='font-weight: bold; background-color: #826464 !important; color: Snow;'>Snow</option>" +
      "<option style='font-weight: bold; background-color: #546469 !important; color: SpringGreen;'>SpringGreen</option>" +
      "<option style='font-weight: bold; background-color: #09141E !important; color: SteelBlue;'>SteelBlue</option>" +
      "<option style='font-weight: bold; background-color: #554737 !important; color: Tan;'>Tan</option>" +
      "<option style='font-weight: bold; background-color: #202835 !important; color: Teal;'>Teal</option>" +
      "<option style='font-weight: bold; background-color: #744256 !important; color: Thistle;'>Thistle</option>" +
      "<option style='font-weight: bold; background-color: #372C2A !important; color: Tomato;'>Tomato</option>" +
      "<option style='font-weight: bold; background-color: #2E557C !important; color: Turquoise;'>Turquoise</option>" +
      "<option style='font-weight: bold; background-color: #710F71 !important; color: Violet;'>Violet</option>" +
      "<option style='font-weight: bold; background-color: #785757 !important; color: Wheat;'>Wheat</option>" +
      "<option style='font-weight: bold; background-color: #827373 !important; color: White;'>White</option>" +
      "<option style='font-weight: bold; background-color: #786A6A !important; color: WhiteSmoke;'>WhiteSmoke</option>" +
      "<option style='font-weight: bold; background-color: #82695C !important; color: Yellow;'>Yellow</option>" +
      "<option style='font-weight: bold; background-color: #504C43 !important; color: YellowGreen;'>YellowGreen</option>" +
      "</select>" +
      "<br>All other colors must be specified using a hex value (ex: <span style='color:#FF0000;'>#FF0000</span>)<br>&ensp;";

    var bgColorOptions = "<hr><span style='font-weight:bold;'>Usage</span>: Enter a color name, hex, or select a color." +
      "<hr><span style='font-weight:bold;'>Valid Color Names</span>: " +
      "<select style='background-color: #eee; border:none; width: 125px; height: 14px; font-size: 12px; font-family: Arial;'>" +
      "<option>Background Colors</option>" +
      "<option style='font-weight: bold; color: #71706F !important; background-color: AliceBlue !important;'>AliceBlue</option>" +
      "<option style='font-weight: bold; color: #716363 !important; background-color: AntiqueWhite !important;'>AntiqueWhite</option>" +
      "<option style='font-weight: bold; color: #716363 !important; background-color: Aqua !important;'>Aqua</option>" +
      "<option style='font-weight: bold; color: #716363 !important; background-color: Aquamarine !important;'>Aquamarine</option>" +
      "<option style='font-weight: bold; color: #8A6C6C !important; background-color: Azure !important;'>Azure</option>" +
      "<option style='font-weight: bold; color: #716C6F !important; background-color: Beige !important;'>Beige</option>" +
      "<option style='font-weight: bold; color: #686964 !important; background-color: Bisque !important;'>Bisque</option>" +
      "<option style='font-weight: bold; color: #828282 !important; background-color: Black !important;'>Black</option>" +
      "<option style='font-weight: bold; color: #825A5A !important; background-color: BlanchedAlmond !important;'>BlanchedAlmond</option>" +
      "<option style='font-weight: bold; color: #E6E6D3 !important; background-color: Blue !important;'>Blue</option>" +
      "<option style='font-weight: bold; color: #E3E3E2 !important; background-color: BlueViolet !important;'>BlueViolet</option>" +
      "<option style='font-weight: bold; color: #D9D2D2 !important; background-color: Brown !important;'>Brown</option>" +
      "<option style='font-weight: bold; color: #483723 !important; background-color: BurlyWood !important;'>BurlyWood</option>" +
      "<option style='font-weight: bold; color: #201822 !important; background-color: CadetBlue !important;'>CadetBlue</option>" +
      "<option style='font-weight: bold; color: #465040 !important; background-color: Chartreuse !important;'>Chartreuse</option>" +
      "<option style='font-weight: bold; color: #080901 !important; background-color: Chocolate !important;'>Chocolate</option>" +
      "<option style='font-weight: bold; color: #372821 !important; background-color: Coral !important;'>Coral</option>" +
      "<option style='font-weight: bold; color: #241A20 !important; background-color: CornflowerBlue !important; '>CornflowerBlue</option>" +
      "<option style='font-weight: bold; color: #695C30 !important; background-color: Cornsilk !important;'>Cornsilk</option>" +
      "<option style='font-weight: bold; color: #F6F6F3 !important; background-color: Crimson !important;'>Crimson</option>" +
      "<option style='font-weight: bold; color: #4A5469 !important; background-color: Cyan !important;'>Cyan</option>" +
      "<option style='font-weight: bold; color: #95A5A2 !important; background-color: DarkBlue !important;'>DarkBlue</option>" +
      "<option style='font-weight: bold; color: #0B040E !important; background-color: DarkCyan !important;'>DarkCyan</option>" +
      "<option style='font-weight: bold; color: #211412 !important; background-color: DarkGoldenRod !important;'>DarkGoldenRod</option>" +
      "<option style='font-weight: bold; color: #2C2C2C !important; background-color: DarkGray !important;'>DarkGray</option>" +
      "<option style='font-weight: bold; color: #CCCCCC !important; background-color: DarkGreen !important;'>DarkGreen</option>" +
      "<option style='font-weight: bold; color: #403129 !important; background-color: DarkKhaki !important;'>DarkKhaki</option>" +
      "<option style='font-weight: bold; color: #C3D4D9 !important; background-color: DarkMagenta !important;'>DarkMagenta</option>" +
      "<option style='font-weight: bold; color: #DEE7ED !important; background-color: DarkOliveGreen !important;'>DarkOliveGreen</option>" +
      "<option style='font-weight: bold; color: #372C21 !important; background-color: DarkOrange !important;'>DarkOrange</option>" +
      "<option style='font-weight: bold; color: #E4E6D6 !important; background-color: DarkOrchid !important;'>DarkOrchid</option>" +
      "<option style='font-weight: bold; color: #BBBFAC !important; background-color: DarkRed !important;'>DarkRed</option>" +
      "<option style='font-weight: bold; color: #3A2923 !important; background-color: DarkSalmon !important;'>DarkSalmon</option>" +
      "<option style='font-weight: bold; color: #16353F !important; background-color: DarkSeaGreen !important;'>DarkSeaGreen</option>" +
      "<option style='font-weight: bold; color: #D9CBCB !important; background-color: DarkSlateBlue !important;'>DarkSlateBlue</option>" +
      "<option style='font-weight: bold; color: #D1D1D1 !important; background-color: DarkSlateGray !important;'>DarkSlateGray</option>" +
      "<option style='font-weight: bold; color: #1D393B !important; background-color: DarkTurquoise !important;'>DarkTurquoise</option>" +
      "<option style='font-weight: bold; color: #EBEDED !important; background-color: DarkViolet !important;'>DarkViolet</option>" +
      "<option style='font-weight: bold; color: #1B0E1E !important; background-color: DeepPink !important;'>DeepPink</option>" +
      "<option style='font-weight: bold; color: #053725 !important; background-color: DeepSkyBlue !important;'>DeepSkyBlue</option>" +
      "<option style='font-weight: bold; color: #EBEBEB !important; background-color: DimGray !important;'>DimGray</option>" +
      "<option style='font-weight: bold; color: #2A1237 !important; background-color: DodgerBlue !important;'>DodgerBlue</option>" +
      "<option style='font-weight: bold; color: #E0E6CE !important; background-color: FireBrick !important;'>FireBrick</option>" +
      "<option style='font-weight: bold; color: #69604C !important; background-color: FloralWhite !important;'>FloralWhite</option>" +
      "<option style='font-weight: bold; color: #01030E !important; background-color: ForestGreen !important;'>ForestGreen</option>" +
      "<option style='font-weight: bold; color: #370537 !important; background-color: Fuchsia !important;'>Fuchsia</option>" +
      "<option style='font-weight: bold; color: #5F4C4C !important; background-color: Gainsboro !important;'>Gainsboro</option>" +
      "<option style='font-weight: bold; color: #615B69 !important; background-color: GhostWhite !important;'>GhostWhite</option>" +
      "<option style='font-weight: bold; color: #504930 !important; background-color: Gold !important;'>Gold</option>" +
      "<option style='font-weight: bold; color: #442E2C !important; background-color: GoldenRod !important;'>GoldenRod</option>" +
      "<option style='font-weight: bold; color: #020202 !important; background-color: Gray !important;'>Gray</option>" +
      "<option style='font-weight: bold; color: #BCE8D6 !important; background-color: Green !important;'>Green</option>" +
      "<option style='font-weight: bold; color: #275C69 !important; background-color: GreenYellow !important;'>GreenYellow</option>" +
      "<option style='font-weight: bold; color: #4C6269 !important; background-color: HoneyDew !important;'>HoneyDew</option>" +
      "<option style='font-weight: bold; color: #501130 !important; background-color: HotPink !important;'>HotPink</option>" +
      "<option style='font-weight: bold; color: #000402 !important; background-color: IndianRed !important;'>IndianRed</option>" +
      "<option style='font-weight: bold; color: #A3B0B6 !important; background-color: Indigo !important;'>Indigo</option>" +
      "<option style='font-weight: bold; color: #695D58 !important; background-color: Ivory !important;'>Ivory</option>" +
      "<option style='font-weight: bold; color: #5A5208 !important; background-color: Khaki !important;'>Khaki</option>" +
      "<option style='font-weight: bold; color: #5C5064 !important; background-color: Lavender !important;'>Lavender</option>" +
      "<option style='font-weight: bold; color: #825463 !important; background-color: LavenderBlush !important;'>LavenderBlush</option>" +
      "<option style='font-weight: bold; color: #4B4D4B !important; background-color: LawnGreen !important;'>LawnGreen</option>" +
      "<option style='font-weight: bold; color: #69605D !important; background-color: LemonChiffon !important;'>LemonChiffon</option>" +
      "<option style='font-weight: bold; color: #334850 !important; background-color: LightBlue !important;'>LightBlue</option>" +
      "<option style='font-weight: bold; color: #5A0C0C !important; background-color: LightCoral !important;'>LightCoral</option>" +
      "<option style='font-weight: bold; color: #5D5C69 !important; background-color: LightCyan !important;'>LightCyan</option>" +
      "<option style='font-weight: bold; color: #64605C !important; background-color: LightGoldenRodYellow !important;'>LightGoldenRodYellow</option>" +
      "<option style='font-weight: bold; color: #6F4343 !important; background-color: LightGray !important;'>LightGray</option>" +
      "<option style='font-weight: bold; color: #355158 !important; background-color: LightGreen !important;'>LightGreen</option>" +
      "<option style='font-weight: bold; color: #50404B !important; background-color: LightPink !important;'>LightPink</option>" +
      "<option style='font-weight: bold; color: #373430 !important; background-color: LightSalmon !important;'>LightSalmon</option>" +
      "<option style='font-weight: bold; color: #242B35 !important; background-color: LightSeaGreen !important;'>LightSeaGreen</option>" +
      "<option style='font-weight: bold; color: #034B3C !important; background-color: LightSkyBlue !important;'>LightSkyBlue</option>" +
      "<option style='font-weight: bold; color: #240535 !important; background-color: LightSlateGray !important;'>LightSlateGray</option>" +
      "<option style='font-weight: bold; color: #074845 !important; background-color: LightSteelBlue !important;'>LightSteelBlue</option>" +
      "<option style='font-weight: bold; color: #69605C !important; background-color: LightYellow !important;'>LightYellow</option>" +
      "<option style='font-weight: bold; color: #165869 !important; background-color: Lime !important;'>Lime</option>" +
      "<option style='font-weight: bold; color: #233237 !important; background-color: LimeGreen !important;'>LimeGreen</option>" +
      "<option style='font-weight: bold; color: #645A50 !important; background-color: Linen !important;'>Linen</option>" +
      "<option style='font-weight: bold; color: #370537 !important; background-color: Magenta !important;'>Magenta</option>" +
      "<option style='font-weight: bold; color: #CEB291 !important; background-color: Maroon !important;'>Maroon</option>" +
      "<option style='font-weight: bold; color: #2C3732 !important; background-color: MediumAquaMarine !important;'>MediumAquaMarine</option>" +
      "<option style='font-weight: bold; color: #CCA5E7 !important; background-color: MediumBlue !important;'>MediumBlue</option>" +
      "<option style='font-weight: bold; color: #160D3D !important; background-color: MediumOrchid !important;'>MediumOrchid</option>" +
      "<option style='font-weight: bold; color: #28012C !important; background-color: MediumPurple !important;'>MediumPurple</option>" +
      "<option style='font-weight: bold; color: #073336 !important; background-color: MediumSeaGreen !important;'>MediumSeaGreen</option>" +
      "<option style='font-weight: bold; color: #0B013F !important; background-color: MediumSlateBlue !important;'>MediumSlateBlue</option>" +
      "<option style='font-weight: bold; color: #644463 !important; background-color: MediumSpringGreen !important;'>MediumSpringGreen</option>" +
      "<option style='font-weight: bold; color: #2C3D54 !important; background-color: MediumTurquoise !important;'>MediumTurquoise</option>" +
      "<option style='font-weight: bold; color: #E3EDFB !important; background-color: MediumVioletRed !important;'>MediumVioletRed</option>" +
      "<option style='font-weight: bold; color: #A4859B !important; background-color: MidnightBlue !important;'>MidnightBlue</option>" +
      "<option style='font-weight: bold; color: #446469 !important; background-color: MintCream !important;'>MintCream</option>" +
      "<option style='font-weight: bold; color: #695450 !important; background-color: MistyRose !important;'>MistyRose</option>" +
      "<option style='font-weight: bold; color: #695454 !important; background-color: Moccasin !important;'>Moccasin</option>" +
      "<option style='font-weight: bold; color: #695454 !important; background-color: NavajoWhite !important;'>NavajoWhite</option>" +
      "<option style='font-weight: bold; color: #CE7EBE !important; background-color: Navy !important;'>Navy</option>" +
      "<option style='font-weight: bold; color: #675A48 !important; background-color: OldLace !important;'>OldLace</option>" +
      "<option style='font-weight: bold; color: #050535 !important; background-color: Olive !important;'>Olive</option>" +
      "<option style='font-weight: bold; color: #110D02 !important; background-color: OliveDrab !important;'>OliveDrab</option>" +
      "<option style='font-weight: bold; color: #373232 !important; background-color: Orange !important;'>Orange</option>" +
      "<option style='font-weight: bold; color: #370E00 !important; background-color: OrangeRed !important;'>OrangeRed</option>" +
      "<option style='font-weight: bold; color: #231E2B !important; background-color: Orchid !important;'>Orchid</option>" +
      "<option style='font-weight: bold; color: #585224 !important; background-color: PaleGoldenRod !important;'>PaleGoldenRod</option>" +
      "<option style='font-weight: bold; color: #596561 !important; background-color: PaleGreen !important;'>PaleGreen</option>" +
      "<option style='font-weight: bold; color: #0C5858 !important; background-color: PaleTurquoise !important;'>PaleTurquoise</option>" +
      "<option style='font-weight: bold; color: #450117 !important; background-color: PaleVioletRed !important;'>PaleVioletRed</option>" +
      "<option style='font-weight: bold; color: #825453 !important; background-color: PapayaWhip !important;'>PapayaWhip</option>" +
      "<option style='font-weight: bold; color: #504C49 !important; background-color: PeachPuff !important;'>PeachPuff</option>" +
      "<option style='font-weight: bold; color: #372516 !important; background-color: Peru !important;'>Peru</option>" +
      "<option style='font-weight: bold; color: #693A5C !important; background-color: Pink !important;'>Pink</option>" +
      "<option style='font-weight: bold; color: #3A3347 !important; background-color: Plum !important;'>Plum</option>" +
      "<option style='font-weight: bold; color: #4A5982 !important; background-color: PowderBlue !important;'>PowderBlue</option>" +
      "<option style='font-weight: bold; color: #BAC9CE !important; background-color: Purple !important;'>Purple</option>" +
      "<option style='font-weight: bold; color: #BDCDC8 !important; background-color: RebeccaPurple !important;'>RebeccaPurple</option>" +
      "<option style='font-weight: bold; color: #370000 !important; background-color: Red !important;'>Red</option>" +
      "<option style='font-weight: bold; color: #580505 !important; background-color: RosyBrown !important;'>RosyBrown</option>" +
      "<option style='font-weight: bold; color: #F2FBE2 !important; background-color: RoyalBlue !important;'>RoyalBlue</option>" +
      "<option style='font-weight: bold; color: #D9D1CB !important; background-color: SaddleBrown !important;'>SaddleBrown</option>" +
      "<option style='font-weight: bold; color: #642119 !important; background-color: Salmon !important;'>Salmon</option>" +
      "<option style='font-weight: bold; color: #45382F !important; background-color: SandyBrown !important;'>SandyBrown</option>" +
      "<option style='font-weight: bold; color: #010E27 !important; background-color: SeaGreen !important;'>SeaGreen</option>" +
      "<option style='font-weight: bold; color: #825E45 !important; background-color: SeaShell !important;'>SeaShell</option>" +
      "<option style='font-weight: bold; color: #E8EAEE !important; background-color: Sienna !important;'>Sienna</option>" +
      "<option style='font-weight: bold; color: #5C4A4A !important; background-color: Silver !important;'>Silver</option>" +
      "<option style='font-weight: bold; color: #1F4455 !important; background-color: SkyBlue !important;'>SkyBlue</option>" +
      "<option style='font-weight: bold; color: #FFF2CD !important; background-color: SlateBlue !important;'>SlateBlue</option>" +
      "<option style='font-weight: bold; color: #13102C !important; background-color: SlateGray !important;'>SlateGray</option>" +
      "<option style='font-weight: bold; color: #826464 !important; background-color: Snow !important;'>Snow</option>" +
      "<option style='font-weight: bold; color: #546469 !important; background-color: SpringGreen !important;'>SpringGreen</option>" +
      "<option style='font-weight: bold; color: #09141E !important; background-color: SteelBlue !important;'>SteelBlue</option>" +
      "<option style='font-weight: bold; color: #554737 !important; background-color: Tan !important;'>Tan</option>" +
      "<option style='font-weight: bold; color: #202835 !important; background-color: Teal !important;'>Teal</option>" +
      "<option style='font-weight: bold; color: #744256 !important; background-color: Thistle !important;'>Thistle</option>" +
      "<option style='font-weight: bold; color: #372C2A !important; background-color: Tomato !important;'>Tomato</option>" +
      "<option style='font-weight: bold; color: #2E557C !important; background-color: Turquoise !important;'>Turquoise</option>" +
      "<option style='font-weight: bold; color: #710F71 !important; background-color: Violet !important;'>Violet</option>" +
      "<option style='font-weight: bold; color: #785757 !important; background-color: Wheat !important;'>Wheat</option>" +
      "<option style='font-weight: bold; color: #827373 !important; background-color: White !important;'>White</option>" +
      "<option style='font-weight: bold; color: #786A6A !important; background-color: WhiteSmoke !important;'>WhiteSmoke</option>" +
      "<option style='font-weight: bold; color: #82695C !important; background-color: Yellow !important;'>Yellow</option>" +
      "<option style='font-weight: bold; color: #504C43 !important; background-color: YellowGreen !important;'>YellowGreen</option>" +
      "</select>" +
      "<br>All other colors must be specified using a hex value (ex: <span style='color:#FF0000;'>#FF0000</span>)<br>&ensp;";
    // ------------------
    // Default Value:
    var helpString = "<hr><b title='The default value(s) of this property.'>Default Value:</b> ";
    // <c>value</c>
    var posDefVals = ["css", "blank", "false", "true", "placeholder", "browser", "theme", "skin", "id", "bind", "widget", "position"];
    helpString += codeOpen;
    if (posDefVals.indexOf(defVal) != -1) {
      if (defVal === "true") {
        helpString += trueSpan;
      } else if (defVal === "blank") {
        helpString += blankSpan;
      } else if (defVal === "css") {
        helpString += cssSpan;
      } else if (defVal === "false") {
        helpString += falseSpan;
      } else if (defVal === "placeholder") {
        helpString += placeholderSpan;
      } else if (defVal === "browser") {
        helpString += browserSpan;
      } else if (defVal === "theme") {
        helpString += themeSpan;
      } else if (defVal === "skin") {
        helpString += skinSpan;
      } else if (defVal === "id") {
        helpString += idSpan;
      } else if (defVal === "bind") {
        helpString += bindSpan;
      } else if (defVal === "widget") {
        helpString += widgetSpan;
      } else if (defVal === "position") {
        helpString += positionSpan;
      }
    } else {
      helpString += defVal;
    }
    helpString += codeClose;
    // ------------------
    // Description:
    helpString += "<hr><b title='A general description of the widget's properties.'>Description: </b>";
    // Description text...
    helpString += descVal;

    // Other...
    if (descAdd.indexOf("other") != -1) {
      helpString += otherText;
    }
    // Color Examples:
    if (descAdd.indexOf("color") != -1) {
      helpString += colorOptions;
    }
    // Background Color Examples:
    if (descAdd.indexOf("background color") != -1) {
      helpString += bgColorOptions;
    }
    // Font Family Examples:
    if (descAdd.indexOf("font") != -1) {
      helpString += fontOptions;
    }
    // Font Family Examples:
    if (descAdd.indexOf("overflow") != -1) {
      helpString += overflowOptions;
    }
    // Font Family Examples:
    if (descAdd.indexOf("pixel") != -1) {
      helpString += pixelText;
    }
    // Note: Text...
    if (descAdd.indexOf("note") != -1) {
      helpString += "<br><br><b style='color: red;'>Note: </b>" + noteVal;
    }
    // ------------------
    helpString += "<hr><br>";

    return helpString;
  };

  this.getPropertiesModel = function () {
    var model = [{ name: "Identification", category: true },
      { name: "id", maxLength: 75, attribute: "id", help: me.helpTextGridProperties("id","Sets the ID of the grid.",[],""), bind: false, canBeRemoved: false },
      { name: "record format name", help: me.helpTextGridProperties("blank","Specifies the record format that is used to access this grid from server code.",[],""), maxLength: (pui.viewdesigner ? null : 10), bind: false, context: "dspf", canBeRemoved: false },
      { name: "description", help: me.helpTextGridProperties("blank","Describes the record format.",[],""), bind: false, context: "dspf" },
      { name: "parent window", attribute: "parentWindow", help: me.helpTextGridProperties("blank","Sets the window that this field belongs to.",[],""), context: "genie" },
      { name: "screen identifier", choices: ["true", "false"], blankChoice: false, help: me.helpTextGridProperties("false","If set to true, this element will be used to detect the screen. The identifier element should be a static output field that is unique to this screen. For example, if the screen has a unique heading, it can be used as the identifier. At least one element on the screen must be marked as an identifier before you can save the screen. When appropriate, you can use a combination of several elements to uniquely identify the screen.",[],""), context: "genie" },
      { name: "field type", displayName: "widget type", choices: ["grid"], blankChoice: false, help: me.helpTextGridProperties("widget","Determines the type of control that is used to render the element.",[],""), bind: false, canBeRemoved: false },
      { name: "value", help: me.helpTextGridProperties("blank","Sets the initialization value for the current element.",[],"") },

      { name: "Subfile Settings", category: true, context: "dspf" },
      { name: "display subfile", choices: ["true", "false"], hideFormatting: true, validDataTypes: ["indicator", "expression"], help: me.helpTextGridProperties("true","This property tells the system when to display grid records. It represents the SFLDSP keyword.",[],""), context: "dspf", viewdesigner: false },
      { name: "display control record", choices: ["true", "false"], hideFormatting: true, validDataTypes: ["indicator", "expression"], help: me.helpTextGridProperties("false","This property tells the system when to display the subfile control record. It represents the SFLDSPCTL keyword.",[],""), context: "dspf", viewdesigner: false },
      { name: "initialize subfile", choices: ["true", "false"], hideFormatting: true, validDataTypes: ["indicator", "expression"], help: me.helpTextGridProperties("false","This property tells the system to initialize all records within the subfile. It represents the SFLINZ keyword.",[],""), context: "dspf", viewdesigner: false },
      { name: "subfile records not active", choices: ["true", "false"], bind: false, help: me.helpTextGridProperties("false","This property can be used together with the \"initialize subfile\" property to initialize a subfile with no active records. It represents the SFLRNA keyword.",[],""), context: "dspf", viewdesigner: false },
      { name: "delete subfile", choices: ["true", "false"], hideFormatting: true, validDataTypes: ["indicator", "expression"], help: me.helpTextGridProperties("false","This property tells the system when to delete the subfile area. It represents the SFLDLT keyword.",[],""), context: "dspf", viewdesigner: false },
      { name: "clear subfile", choices: ["true", "false"], hideFormatting: true, validDataTypes: ["indicator", "expression"], help: me.helpTextGridProperties("false","This property tells the system when to clear all records from the subfile. It represents the SFLCLR keyword.",[],""), context: "dspf", viewdesigner: false },
      { name: "subfile size", format: "number", hideFormatting: true, validDataTypes: ["zoned"], help: me.helpTextGridProperties("blank","This property represents the SFLSIZ keyword, which specifies the number of records that can be placed into the subfile. However, if your program places a record with a relative record number larger than the SFLSIZ value into the subfile, the subfile is automatically extended to contain it (up to a maximum of 9999 records). If this property is not specified, the subfile page value plus one is used. The subfile page value is determined from the \"number of rows\" property minus the header row if it is present.",[],""), context: "dspf", viewdesigner: false },
      { name: "subfile record number", format: "number", hideFormatting: true, validDataTypes: ["zoned", "reference"], help: me.helpTextGridProperties("blank","This property identifies the scrollbar position when the subfile is first displayed." + (pui.viewdesigner ? "" : "  It represents the SFLRCDNBR keyword."),[],""), context: "dspf" },
      { name: "position at top", choices: ["true", "false"], bind: false, help: me.helpTextGridProperties("false","When this property is set to true, the subfile record identified by the \"subfile record number\" property will display in the top row of the grid." + (pui.viewdesigner ? "" : "  This property is equivalent to the SFLRCDNBR(*TOP) keyword."),[],""), context: "dspf" },
      { name: "place cursor", choices: ["true", "false"], bind: false, help: me.helpTextGridProperties("false","When this property is set to true, the cursor is placed in the subfile record identified by the contents of the \"subfile record number\" property. The cursor is positioned at the first input-capable field in the subfile record." + (pui.viewdesigner ? "" : "  This property is equivalent to the SFLRCDNBR(CURSOR) keyword."),[],""), context: "dspf" },
      { name: "subfile end", choices: ["true", "false"], hideFormatting: true, validDataTypes: ["indicator", "expression"], help: me.helpTextGridProperties("false","This property is used to indicate that a subfile with a paging bar has loaded all of its records." + (pui.viewdesigner ? "" : "  It represents the SFLEND keyword."),[],""), context: "dspf" },
      { name: "subfile next changed", choices: ["true", "false"], hideFormatting: true, validDataTypes: ["indicator", "expression"], help: me.helpTextGridProperties("false","This property represents the SFLNXTCHG keyword, which forces the user to correct program-detected typing errors in subfile records. The program can cause a record to be changed so that a get-next-changed operation must read the record again.",[],""), context: "dspf", viewdesigner: false },
      { name: "cursor record number", readOnly: true, format: "number", hideFormatting: true, validDataTypes: ["zoned"], help: me.helpTextGridProperties("bind","This property can be bound to a numeric field, which will return the relative record number of the record on which the cursor is located." + (pui.viewdesigner ? "" : "  It represents the SFLCSRRRN keyword."),[],""), context: "dspf" },
      { name: "cursor progression", choices: ["left to right", "top to bottom"], help: me.helpTextGridProperties("left to right","This property determines the tab order for input elements within the subfile." + (pui.viewdesigner ? "" : "  It represents the SFLCSRPRG keyword."),[],""), context: "dspf" },
      { name: "subfile return rrn", readOnly: true, format: "number", hideFormatting: true, validDataTypes: ["zoned", "reference"], help: me.helpTextGridProperties("bind","This property can be bound to a numeric field, which will return the relative record number of the top visible record within a grid." + (pui.viewdesigner ? "" : "  It represents the SFLSCROLL keyword."),[],""), context: "dspf" },
      { name: "subfile changed", format: "1 / 0", readOnly: true, hideFormatting: true, validDataTypes: ["indicator"], help: me.helpTextGridProperties("bind","Specifies a response indicator that is set on if the input data within the subfile is modified.",[],""), context: "dspf" },

      { name: "Message Subfile Settings", category: true, context: "dspf", viewdesigner: false },
      { name: "subfile message key", readOnly: true, hideFormatting: true, validDataTypes: ["char"], defaultDataLength: 4, help: me.helpTextGridProperties("bind","This property specifies a field that is used to select messages from a program message queue for display. Your program places a message reference key in this field. The property represents the SFLMSGKEY keyword on a subfile record format.",[],""), context: "dspf", viewdesigner: false },
      { name: "subfile program message queue", readOnly: true, hideFormatting: true, validDataTypes: ["char"], help: me.helpTextGridProperties("bind","This property specifies a field that contains the name of the program message queue used to build a message subfile. It represents the SFLPGMQ keyword on a subfile record format.",[],""), context: "dspf", viewdesigner: false },
      { name: "subfile control program message queue", readOnly: true, hideFormatting: true, validDataTypes: ["char"], help: me.helpTextGridProperties("bind","This property specifies a field that contains the name of the program message queue used to build a message subfile when used in conjunction with the <i>subfile initialize</i> property. It represents the SFLPGMQ keyword on a subfile control record format.",[],""), context: "dspf", viewdesigner: false },

      { name: "Font and Text", category: true },
      { name: "font family", choices: ["Arial", "Consolas", "Courier New", "Fantasy", "Georgia", "Monospace", "Tahoma", "Times New Roman", "Sans-Serif", "Serif", "Trebuchet MS", "Verdana", "Other..."], help: me.helpTextGridProperties("css","The font face for the text inside the grid. To define a different font for each grid column, select <i>Other...</i> and specify a comma separated list of fonts.",["other", "font"],"") },
      { name: "font size", format: "px", choices: ["8px", "9px", "10px", "11px", "12px", "13px", "14px", "15px", "16px", "17px", "18px", "19px", "20px", "21px", "22px", "23px", "24px", "25px", "26px", "27px", "28px", "29px", "30px", "Other..."], help: me.helpTextGridProperties("css","The size of the text inside the grid. To specify a different font size for each grid column, select <i>Other...</i> and specify a comma separated list of font sizes.",["other"],"") },
      { name: "font style", format: "italic / normal", choices: ["normal", "italic", "oblique", "Other..."], help: me.helpTextGridProperties("css","The style of the font in the grid. To specify a different font style for each grid column, select <i>Other...</i> and specify a comma separated list of font styles.",["other"],"") },
      { name: "font variant", choices: ["normal", "small-caps", "Other..."], help: me.helpTextGridProperties("css","Normal or <span style='font-variant:small-caps;'>small caps</span>. Small caps shows the text with all caps but same height as a lower case letter.",["other"],"") },
      { name: "font weight", format: "bold / normal", choices: ["normal", "bolder", "bold", "lighter", "100", "200", "300", "400", "500", "600", "700", "800", "900", "Other..."], help: me.helpTextGridProperties("css","Specifies the weight of the font inside the grid. To specify a different font weight for each grid column, select <i>Other...</i> and specify a comma separated list of font weights.",["other"],"") },
      { name: "letter spacing", format: "px", choices: ["normal", "-3px", "-2px", "-1px", "0px", "1px", "2px", "3px", "4px", "5px", "6px", "7px", "8px", "9px", "10px", "11px", "12px", "13px", "14px", "15px", "16px", "17px", "18px", "19px", "20px", "Other..."], help: me.helpTextGridProperties("css","Spacing between each letter of a word. To specify a different value for each grid column, select <i>Other...</i> and specify a comma separated list of values.",["other"],"") },
      { name: "text align", choices: ["left", "right", "center", "justify", "Other..."], help: me.helpTextGridProperties("css","Alignment of text inside cells of the grid element. To specify a different alignment option for each grid column, select <i>Other...</i> and specify a comma separated list of values.",["other"],"") },
      { name: "text decoration", format: "underline / none", choices: ["none", "underline", "overline", "line-through", "Other..."], help: me.helpTextGridProperties("css","Decoration of the text inside the grid. To specify a different value for each grid column, select <i>Other...</i> and specify a comma separated list of values.",["other"],"") },
      { name: "text transform", choices: ["capitalize", "uppercase", "lowercase", "none", "Other..."], help: me.helpTextGridProperties("css","Transforms the default formatting of the text inside the grid. To specify a different value for each grid column, select <i>Other...</i> and specify a comma separated list of values.",["other"],"") },
      { name: "word spacing", format: "px", choices: ["normal", "-3px", "-2px", "-1px", "0px", "1px", "2px", "3px", "4px", "5px", "6px", "7px", "8px", "9px", "10px", "11px", "12px", "13px", "14px", "15px", "16px", "17px", "18px", "19px", "20px", "21px", "22px", "23px", "24px", "25px", "Other..."], help: me.helpTextGridProperties("css","Spacing between each word in the cells of the grid. To specify a different value for each grid column, select <i>Other...</i> and specify a comma separated list of values.",["other"],"") },

      { name: "Header", category: true },
      { name: "has header", choices: ["true", "false"], type: "boolean", validDataTypes: ["indicator", "expression"], hideFormatting: true, help: me.helpTextGridProperties("true","Determines whether the grid has a header row.",[],"") },
      { name: "header height", help: me.helpTextGridProperties("theme","Specifies the height of the header row. This can also be specified by dragging the grid's top border with the mouse.",[],""), bind: false, canBeRemoved: false },
      { name: "header font family", choices: ["Arial", "Consolas", "Courier New", "Fantasy", "Georgia", "Monospace", "Tahoma", "Times New Roman", "Sans-Serif", "Serif", "Trebuchet MS", "Verdana", "Other..."], help: me.helpTextGridProperties("css","The font face for the text inside the grid header row. To define a different font for each grid column, select <i>Other...</i> and specify a comma separated list of fonts.",["other","font"],"") },
      { name: "header font size", format: "px", choices: ["8px", "9px", "10px", "11px", "12px", "13px", "14px", "15px", "16px", "17px", "18px", "19px", "20px", "21px", "22px", "23px", "24px", "25px", "26px", "27px", "28px", "29px", "30px", "Other..."], help: me.helpTextGridProperties("css","The size of the text inside the grid header row. To specify a different font size for each grid column, select <i>Other...</i> and specify a comma separated list of font sizes.",["other"],"") },
      { name: "header font style", format: "bold / normal", choices: ["normal", "italic", "oblique", "Other..."], help: me.helpTextGridProperties("css","Specifies the style of the font inside the grid header row. To specify a different font style for each grid column, select <i>Other...</i> and specify a comma separated list of font styles.",["other"],"") },
      { name: "header font weight", format: "italic / normal", choices: ["normal", "bolder", "bold", "lighter", "100", "200", "300", "400", "500", "600", "700", "800", "900", "Other..."], help: me.helpTextGridProperties("css","Specifies the weight of the font inside the grid header row. To specify a different font weight for each grid column, select <i>Other...</i> and specify a comma separated list of font weights.",["other"],"") },
      { name: "header text align", choices: ["left", "right", "center", "justify", "Other..."], help: me.helpTextGridProperties("css","Alignment of text inside the cells of the grid header row. To specify a different alignment option for each cell, select <i>Other...</i> and specify a comma separated list of values.",["other"],"") },
      { name: "header font color", type: "color", help: me.helpTextGridProperties("css","Defines the color of the text inside the header row. To define a different color for each grid cell in the header row, specify a comma separated list of color values.",["color"],"") },
      { name: "header background", type: "color", help: me.helpTextGridProperties("css","Defines the background color of the header row. To define a different color for each grid cell in the header row, specify a comma separated list of color values.",["background color"],"") },
      { name: "header image", type: "image", help: me.helpTextGridProperties("css","Defines a repeating background image for the header row.",[],"") },
      { name: "column headings", type: "list", help: me.helpTextGridProperties("placeholder","Specifies a comma separated list of heading text for each column of the grid.",[],""), translate: true },

      { name: "Colors", category: true },
      { name: "odd row font color", type: "color", help: me.helpTextGridProperties("css","Defines the color of text inside the odd rows of the grid. To define a different color for each grid column, specify a comma separated list of color values.",["color","note"],"This only applies to text displayed in a database driven grid.") },
      { name: "odd row background", type: "color", help: me.helpTextGridProperties("css","Defines the background color of the odd rows in the grid. To define a different color for each grid column, specify a comma separated list of color values.",["background color"],"") },
      { name: "even row font color", type: "color", help: me.helpTextGridProperties("css","Defines the color of text inside the even rows of the grid. To define a different color for each grid column, specify a comma separated list of color values.",["color","note"],"This only applies to text displayed in a database driven grid.") },
      { name: "even row background", type: "color", help: me.helpTextGridProperties("css","Defines the background color of the even rows in the grid. To define a different color for each grid column, specify a comma separated list of color values.",["background color"],"") },
      { name: "row font color", type: "color", help: me.helpTextGridProperties("css","Defines the color of text in an individual row. You can define a dynamic color for each record by binding this property to a field.",["color", "note"],"This only applies to text displayed in a database driven grid. This property, if defined, will be used instead of <i>even row font color</i> and <i>odd row font color</i>."), context: "dspf" },
      { name: "row background", type: "color", help: me.helpTextGridProperties("css","Defines the background color of an individual row. You can define a dynamic background color for each record by binding this property to a field.",["background color", "note"],"This property, if defined, will be used instead of <i>even row background</i> and <i>odd row background</i>."), context: "dspf" },
      { name: "hover font color", type: "color", help: me.helpTextGridProperties("css","Defines the color of text when the user hovers the mouse cursor over a grid row. To define a different color for each grid column, specify a comma separated list of color values.",["color"],"") },
      { name: "hover background", type: "color", help: me.helpTextGridProperties("css","Defines the background color of a grid row when the user hovers the mouse cursor over it. To define a different color for each grid column, specify a comma separated list of color values.",["background color"],"") },
      { name: "selection font color", type: "color", help: me.helpTextGridProperties("css","Defines the color of text when the user selects a grid row.",["color"],""), context: "dspf" },
      { name: "selection background", type: "color", help: me.helpTextGridProperties("css","Defines the background color of a grid row when the user selects it.",["background color"],""), context: "dspf" },

      { name: "Grid Settings", category: true },
      { name: "number of rows", help: me.helpTextGridProperties("theme","Specifies the number of rows in the grid, including the header row.",[],""), bind: false, canBeRemoved: false },
      { name: "number of columns", help: me.helpTextGridProperties("theme","Specifies the number of columns in the grid.",[],""), bind: false, canBeRemoved: false },
      { name: "row height", help: me.helpTextGridProperties("theme","Specifies the height that will be applied to each row, not including the header row. This can also be controlled by resizing the grid with the mouse.",[],""), bind: false, canBeRemoved: false },
      { name: "hover effect", choices: ["true", "false"], type: "boolean", validDataTypes: ["indicator", "expression"], hideFormatting: true, help: me.helpTextGridProperties("theme","Determines whether the grid rows will be highlighted when the user hovers the mouse over them.",[],"") },
      { name: "hover image", type: "image", help: me.helpTextGridProperties("theme","Defines a repeating cell background image for the hover effect.",[],"") },
      { name: "row selection", choices: ["none", "single", "multiple (simple)", "multiple (extended)"], help: me.helpTextGridProperties("none","Determines if rows within the grid can be selected by the user with a click of the mouse. <br/><br/>Possible values are: <br/><br/><b>none</b> - rows cannot be selected <br/><br/><b>single</b> - only one row can be selected <br/><br/><b>multiple (simple)</b> - multiple rows can be selected by simply clicking on the rows <br/><br/><b>multiple (extended)</b> - multiple rows can be selected with the use of the Shift and Ctrl keys",[],"") },
      { name: "selection field", format: "1 / 0", readOnly: true, hideFormatting: true, validDataTypes: ["char", "indicator"], defaultDataLength: 1, help: me.helpTextGridProperties("bind","This property must be bound to an indicator or a character field, which will be used to both set and return the selected state on each record. If a character field is specified, the selection value property will be used to populate the field when a row is selected.",[],""), context: "dspf" },
      { name: "selection value", help: me.helpTextGridProperties("blank","Specifies the value used to populate the selection field when a grid row is selected.",[],""), bind: false, context: "dspf" },
      { name: "selection image", type: "image", help: me.helpTextGridProperties("theme","Defines a repeating cell background image for row selection.",[],"") },
      { name: "column widths", type: "list", help: me.helpTextGridProperties("theme","Specifies a comma separated list of column widths for this grid.",[],""), bind: false, canBeRemoved: false },
      { name: "scrollbar", choices: (context == "genie" && !pui.usingGenieHandler) ? ["true", "false"] : ["none", "sliding", "paging"], help: me.helpTextGridProperties("sliding", ((context == "genie" && !pui.usingGenieHandler) ? "Determines whether a vertical scrollbar for paging through data records will appear within the grid. If the grid is not a database-driven grid, the scrollbar will automatically send the PageUp/PageDown keys to the underlying application." : "Determines the type of vertical scrollbar used to scroll through records within the grid. A sliding scrollbar scrolls freely, while a paging scrollbar scrolls one page of records at a time only."),[],"") },
      { name: "scroll tool tip", choices: ["none", "row number", "row range"], help: me.helpTextGridProperties("true","Determines if the row number or the row number range should be displayed in a tool tip when the user scrolls through the data in the grid.",[],""), context: "dspf" },
      { name: "propagate scroll events", choices: ["true", "false"], type: "boolean", validDataTypes: ["indicator", "expression"], hideFormatting: true, help: me.helpTextGridProperties("false","When this property is false (which is the default) the grid handles any scroll wheel or swipe events sent to it so that they scroll the grid, but not the window that the grid is placed inside. If you enable this property, these events will be propagated, which allows mouse wheel and swipe events to scroll the grid's parent window.",["other"],""), context: "dspf" },
      { name: "sortable columns", choices: ["true", "false"], type: "boolean", validDataTypes: ["indicator", "expression"], hideFormatting: true, help: me.helpTextGridProperties("false","Enables column sorting. If set to true, the user will be able to click on the column headings to resort the data.",[],""), context: "dspf" },
      { name: "default sort order", choices: ["Ascending", "Descending", "Other..."], help: me.helpTextGridProperties("Descending","Specifies the default order for sortable columns. When the user clicks a column, the default sort order is used initially. To provide a different sort order for each grid column, select <i>Other...</i> and specify a comma separated list. Entries in the list can be abbreviated using the letter A for Ascending and D for Descending.",["other"],""), context: "dspf" },
      { name: "initial sort column", format: "number", help: me.helpTextGridProperties("blank","This property specifies the column used to for initial sorting. Each grid column is identified by a sequential index, starting with 0 for the first column, 1 for the second column, and so on. If this property and the \"initial sort field\" property are omitted or set to blanks, sorting is not initiated when the grid is first rendered.",[],""), context: "dspf" },
      { name: "initial sort field", help: me.helpTextGridProperties("blank","This property specifies the field name used to identify the column for initial sorting. If this property and the \"initial sort column\" property are omitted or set to blanks, sorting is not initiated when the grid is first rendered.",[],""), hideFormatting: true, validDataTypes: ["char"], context: "dspf" },
      { name: "column sort response", format: "number", hideFormatting: true, readOnly: true, validDataTypes: ["zoned"], help: me.helpTextGridProperties("bind","Specifies a response variable to receive a column number for server-side sorting. If omitted, client-side sorting is used. The response is a numeric value that represents a column in the grid. Each grid column is identified by a sequential index, starting with 0 for the first column, 1 for the second column, and so on. It is the responsibility of the program to keep track of the sort direction, and to display an up or down arrow in the appropriate column using the \"initial sort column\" and \"default sort order\" properties.",[],""), context: "dspf" },
      { name: "field name sort response", readOnly: true, help: me.helpTextGridProperties("bind","Specifies a response variable to receive a field name used for server-side sorting. If omitted, client-side sorting is used. The response represents the name of the field bound to the first widget in a column of the grid. It is the responsibility of the program to keep track of the sort direction, and to display an up or down arrow in the appropriate column using the \"initial sort field\" and \"default sort order\" properties.",[],""), hideFormatting: true, validDataTypes: ["char"], context: "dspf" },
      { name: "sort function", type: "js", help:me.helpTextGridProperties( "blank","Specifies a custom sort function that will be called. If not specified the grid will sort using built in sorting. The following variables are passed:<br /> &nbsp;&nbsp;<b>value1</b> first field value to compare <br /> &nbsp;&nbsp;<b>value2</b> second field value to compare <br />&nbsp;&nbsp;<b>fieldName</b> name fo the field <br /> &nbsp;&nbsp;<b>isDescending</b> true if sorting in descending sequence, false otherwise <br /> &nbsp;&nbsp;<b>fieldDateFormat</b> date format of the field, if the field is not a date field the value is null <br /> &nbsp;&nbsp;<b>fieldInfo</b> formatting information of the field that the grid is sorted by; if the field does not contain any formatting information, a blank object will be passed instead", [], ""), context: "dspf"},
      { name: "resizable columns", choices: ["true", "false"], type: "boolean", validDataTypes: ["indicator", "expression"], hideFormatting: true, help: me.helpTextGridProperties("false","Allows the user to resize grid columns at run time.",[],""), context: "dspf" },
      { name: "movable columns", choices: ["true", "false"], type: "boolean", validDataTypes: ["indicator", "expression"], hideFormatting: true, help: me.helpTextGridProperties("false","Allows the user to rearrange grid columns at run time.",[],""), context: "dspf" },
      { name: "persist state", choices: ["true", "false"], type: "boolean", validDataTypes: ["indicator", "expression"], hideFormatting: true, help: me.helpTextGridProperties("false","Specifies whether the grid state should be saved when the user sorts, moves, or resizes columns. When set to true, the state is saved to browser local storage with each user action, and automatically restored the next time the grid is dislpayed.",[],""), context: "dspf" },
      { name: "find option", choices: ["true", "false"], type: "boolean", validDataTypes: ["indicator", "expression"], hideFormatting: true, help: me.helpTextGridProperties("false","Presents an option to search grid data when the grid heading is right-clicked.",[],""), context: "dspf" },
      { name: "filter option", choices: ["true", "false"], type: "boolean", validDataTypes: ["indicator", "expression"], hideFormatting: true, help: me.helpTextGridProperties("false","Presents an option to filter grid data when the grid heading is right-clicked.",[],""), context: "dspf" },
      { name: "hide columns option", choices: ["true", "false"], type: "boolean", validDataTypes: ["indicator", "expression"], hideFormatting: true, help: me.helpTextGridProperties("false","Presents an option to hide and show columns for this grid when the grid heading is right-clicked. Defaults to false.",[],""), context: "dspf" },

      //Reset the  browser cache Data for a table
      { name: "reset option", choices: ["true", "false"], type: "boolean", validDataTypes: ["indicator", "expression"], hideFormatting: true, help: me.helpTextGridProperties("false","Presents an option to reset the persistent state for this grid when the grid heading is right-clicked.",[],""), context: "dspf" },
      { name: "export option", choices: ["true", "false"], type: "boolean", validDataTypes: ["indicator", "expression"], hideFormatting: true, help: me.helpTextGridProperties("false","Presents options to export grid data to Excel using the CSV and XLSX formats when the grid heading is right-clicked.",[],""), context: "dspf" },
      { name: "export only visible columns", choices: ["true", "false"], type: "boolean", validDataTypes: ["indicator", "expression"], hideFormatting: true, help: me.helpTextGridProperties("false","When the 'hide columns option' is set to true, this option determines whether to export only the visible columns or all of the columns. Note this setting does not take effect for database-driven grids. Defaults to false.",[],""), context: "dspf" },
      { name: "context menu id", help: me.helpTextGridProperties("blank","Specifies the id of a Menu widget used to display a context menu when the user right-clicks a grid row.",[],""), hideFormatting: true, validDataTypes: ["char"] },

      { name: "Paging Bar", category: true, context: "dspf" },
      { name: "show paging controls", choices: ["true", "false"], hideFormatting: true, validDataTypes: ["indicator", "expression"], help: me.helpTextGridProperties("false","Displays links for navigating to the previous page and the next page of records.",[],"") },
      { name: "show page number", choices: ["true", "false"], hideFormatting: true, validDataTypes: ["indicator", "expression"], help: me.helpTextGridProperties("false","This property determines whether the page number should display within the paging bar.",[],""), context: "dspf" },
      { name: "initial page number", format: "number", hideFormatting: true, validDataTypes: ["zoned"], help: me.helpTextGridProperties("1","Specifies the initial page number to use when the page number is displayed within the paging bar. If not specified, page number 1 is used.",[],""), context: "dspf" },
      { name: "show bar", choices: ["true", "false"], hideFormatting: true, validDataTypes: ["indicator", "expression"], help: me.helpTextGridProperties("false","Displays a bar at the bottom of the grid even if no paging bar elements are selected to be displayed. This can be used to show miscellaneous information such as column totals.",[],""), context: "dspf" },
      { name: "page down condition", validDataTypes: ["indicator", "expression"], hideFormatting: true, readOnly: true, format: "true / false", type: "boolean", help: me.helpTextGridProperties("bind","Determines if the next page link is enabled.",[],""), context: "dspf" },
      { name: "page down response", format: "1 / 0", readOnly: true, hideFormatting: true, validDataTypes: ["indicator"], help: me.helpTextGridProperties("bind","Specifies a response indicator that is returned to your program when the next page link is clicked.",[],""), context: "dspf" },
      { name: "page up condition", validDataTypes: ["indicator", "expression"], hideFormatting: true, readOnly: true, format: "true / false", type: "boolean", help: me.helpTextGridProperties("bind","Determines if the previous page link is enabled.",[],""), context: "dspf" },
      { name: "page up response", format: "1 / 0", readOnly: true, hideFormatting: true, validDataTypes: ["indicator"], help: me.helpTextGridProperties("bind","Specifies a response indicator that is returned to your program when the previous page link is clicked.",[],""), context: "dspf" },

      { name: "csv export", choices: ["true", "false"], type: "boolean", validDataTypes: ["indicator", "expression"], hideFormatting: true, help: me.helpTextGridProperties("false","Displays a link allowing the user to export grid data to Excel using the CSV format." + ((context == "genie" && !pui.usingGenieHandler) ? " <br /><b>Note:</b> In 5250 mode, this option only works with SQL-driven subfiles." : ""),[],"") },
      { name: "xlsx export", choices: ["true", "false"], type: "boolean", validDataTypes: ["indicator", "expression"], hideFormatting: true, help: me.helpTextGridProperties("false","Displays a link allowing the user to export grid data to Excel using the XLSX format." + ((context == "genie" && !pui.usingGenieHandler) ? " <br /><b>Note:</b> In 5250 mode, this option only works with SQL-driven subfiles." : ""),[],"") },
      { name: "xlsx export pics", choices: ["true", "false"], type: "boolean", validDataTypes: ["indicator", "expression"], hideFormatting: true, help: me.helpTextGridProperties("false","Include pictures in the XLSX Export. This option only works for Load-All subfiles.",[],""), context: "dspf" },
      { name: "export file name", help: me.helpTextGridProperties("blank","Defines the name of the download file used to export grid data to CSV or XLSX formats. The .xlsx or .csv extension is automatically appended to the name. If omitted, the record format name is used." + ((context == "genie" && !pui.usingGenieHandler) ? " <br /><b>Note:</b> In 5250 mode, this option only works with SQL-driven subfiles." : ""),[],""), translate: true },
      { name: "export with headings", choices: ["true", "false"], type: "boolean", validDataTypes: ["indicator", "expression"], hideFormatting: true, help: me.helpTextGridProperties("false","Specifies whether subfile headings should be exported as the first row of the CSV file." + ((context == "genie" && !pui.usingGenieHandler) ? " <br /><b>Note:</b> In 5250 mode, this option only works with SQL-driven subfiles." : ""),[],"") },

      { name: "Row Folding", category: true, context: "dspf" },
      { name: "fold multiple", choices: ["2", "3", "4", "Other..."], help: me.helpTextGridProperties("blank","The property determines the height of a collapsed row, which is calculated at by taking the row height property and dividing it by the fold multiple.  The multiple represents the number of collapsed rows that can fit into one expanded row.",["other"],""), bind: false, context: "dspf" },
      { name: "expanded", choices: ["true", "false"], hideFormatting: true, validDataTypes: ["indicator", "expression"], help: me.helpTextGridProperties("false","Determines if the rows are first displayed in expanded (also known as folded) mode." + (pui.viewdesigner ? "" : "  This property is similar to the SFLFOLD keyword."),[],""), context: "dspf" },
      { name: "collapsed", choices: ["true", "false"], hideFormatting: true, validDataTypes: ["indicator", "expression"], help: me.helpTextGridProperties("false","Determines if the rows are first displayed in collapsed (also known as truncated) mode." + (pui.viewdesigner ? "" : "  This property is similar to the SFLDROP keyword."),[],""), context: "dspf" },
      { name: "return mode", format: "1 / 0", readOnly: true, hideFormatting: true, validDataTypes: ["char", "indicator"], help: me.helpTextGridProperties("bind","This property can be bound to a field that will provide an indication of whether the grid rows were in expanded (also known as folded) mode or in collapsed (also known as truncated) mode on input." + (pui.viewdesigner ? "" : "  It represents the SFLMODE keyword. The bound field will contain a value of 0 if the grid rows are in expanded mode and a value of 1 if the grid rows are in collapsed mode."),[],""), context: "dspf" },
      { name: "single row zoom", choices: ["true", "false"], hideFormatting: true, validDataTypes: ["indicator", "expression"], help: me.helpTextGridProperties("false","Determines if a zoom icon is shown on collapsed rows. Once the user clicks the icon, the row is expanded. All other rows remain collapsed.",[],""), context: "dspf" },

      { name: "Grid Data", category: true },
      { name: "database file", type: "file", uppercase: true, help: me.helpTextGridProperties("blank","Database file to use for a grid that is tied directly to a database. You can specify a 'database file' or 'library/database file'. If library is omitted, the session's library list is used.",[],"") },
      { name: "database fields", type: "field", multiple: true, uppercase: true, help: me.helpTextGridProperties("blank", "A set of database field names to use to retrieve the data for a database-driven grid. The field names should be comma separated.", [], ""), descriptionsHandler: function (descriptions) {
          if (!confirm("Update grid columns?")) return; 
          // update the column headings   
          me.setProperty("column headings", descriptions);
          var itm = me.tableDiv.designItem;
          sendPropertyToDesigner(itm, "column headings", descriptions);
          itm.designer.propWindow.refreshProperty("column headings"); 
          // update the number of columns based on the number of headings   
          var count = descriptions.split(',').length;
          me.setProperty("number of columns", count);
          sendPropertyToDesigner(itm, "number of columns", count);
          itm.designer.propWindow.refreshProperty("number of columns");
        }},
      { name: "selection criteria", type: "long", help: me.helpTextGridProperties("blank","Optional expression identifying which records should be retrieved from the database file.",[],"") },
      { name: "order by", type: "field", multiple: true, uppercase: true, help: me.helpTextGridProperties("blank","Optional expression identifying which fields determine the order of the records retrieved from the database file.",[],"") },
      { name: "custom sql", type: "long", help: me.helpTextGridProperties("blank","Specifies a sql statement to use to retrieve the records for a database-driven grid.",[],""), 
          customSqlHandler: function (customSql) {   
              if (!confirm("Adjust grid based on columns?")) return;   
              var parm = {     "customSql": customSql   };   
              pui.getFieldDescriptions(parm, me.customSqlCallback); 
          } 
      },

      { name: "allow any select statement", type: "boolean", choices: ["true", "false"], validDataTypes: ["indicator", "expression"], hideFormatting: true, help: me.helpTextGridProperties("false","Allows any valid SELECT SQL statement.<p>If this is <b>false</b> (default), a row count is retrieved by running SELECT COUNT(*) FROM (<b><i>your-custom-sql-property</i></b>), so your \"custom sql\" property must work with that syntax. This prevents the use of common table expressions, the optimize clause, and a few other things.</p><p>If set to <b>true</b>, the row count will be determined by running your statment as-is and looping through all rows to count them.</p><p><b>Note:</b> False performs better, but true allows a wider variety of SQL statements.</p>",[],"") },
      { name: "parameter value", type: "long", secLevel: 1, multOccur: true, help: me.helpTextGridProperties("blank","Value for parameter marker in \"selection criteria\" or \"custom sql\" property. Parameter markers are specified using a question mark. Profound UI will accept values from the client for any parameter marker values which are not bound to program fields. Parameter markers are numbered in order of occurence, from left to right. To specify multiple parameter marker values, right-click the property and select Add Another Parameter Value.",[],"") },
      { name: "data url", type: "long", help: me.helpTextGridProperties("blank","Sets the url to a Web service that returns JSON data for a database-driven grid.",[],"") },
      { name: "data transform function", type: "long", help: me.helpTextGridProperties("blank","The name of a JavaScript function to be called to process the results of the \"data url\" program. This can be used to transform data from the program into the format expected by the grid widget.",[],"") },

      { name: "Grid Data from Screen", category: true, context: "genie-nohandler" },
      { name: "starting row", help: me.helpTextGridProperties("blank","Specifies the starting subfile row for retrieving data from the screen.",[],""), context: "genie-nohandler" },
      { name: "ending row", help: me.helpTextGridProperties("blank","Specifies the ending subfile row for retrieving data from the screen.",[],""), context: "genie-nohandler" },
      { name: "data columns", type: "list", help: me.helpTextGridProperties("blank","Specifies a comma separated list of column numbers for retrieving data from the screen.",[],""), context: "genie-nohandler" },

      { name: "Position", category: true },
      { name: "left", format: "px", help: me.helpTextGridProperties("position","Represents the x-coordinate of the current element.",[],""), canBeRemoved: false },
      { name: "top", format: "px", help: me.helpTextGridProperties("position","Represents the y-coordinate of the current element.",[],""), canBeRemoved: false },
      { name: "right", format: "px", help: me.helpTextGridProperties("position","Represents the x-coordinate of the current element.",[],""), canBeRemoved: false },
      { name: "bottom", format: "px", help: me.helpTextGridProperties("position","Represents the y-coordinate of the current element.",[],""), canBeRemoved: false },
      { name: "height", help: me.helpTextGridProperties("css","Height of the grid.",[],""), bind: false, canBeRemoved: false },
      { name: "width", help: me.helpTextGridProperties("css","Width of the grid.",[],""), bind: false, canBeRemoved: false },
      { name: "expand to layout", choices: ["true", "false"], help: me.helpTextGridProperties("false","If set to true, the grid will automatically expand to the full size of a layout container.",[],""), context: "dspf", bind: false },
      { name: "z index", format: "number", help: me.helpTextGridProperties("css","The stacking order of the current element, expressed as an integer value. The element with the higher z index will overlay lesser elements.",[],"") },
      { name: "locked in place", choices: ["true", "false"], help: me.helpTextGridProperties("false","If set to true, the grid cannot be moved or sized in the Visual Designer.",[],""), bind: false },

      { name: "Drag and Drop", category: true, context: "dspf" },
      { name: "allow drag", choices: ["true", "false"], type: "boolean", validDataTypes: ["indicator", "expression"], hideFormatting: true, help: me.helpTextGridProperties("false","This property determines if rows within the grid can be drag and dropped.",[],""), context: "dspf" },
      { name: "ondragstart", type: "js", help: me.helpTextGridProperties("blank","Initiates a client-side script when the user first starts to drag a row within the grid. Information about the drag and drop operation is provided using the global pui.dragDropInfo object.",[],""), context: "dspf" },
      { name: "drop targets", type: "list", help: me.helpTextGridProperties("blank","Specifies a list of target element id's, which indentify where the row can be dropped.",[],""), context: "dspf" },
      { name: "ondragenter", type: "js", help: me.helpTextGridProperties("blank","Initiates a client-side script when the user drags a row over a valid drop target. Information about the drag and drop operation is provided using the global pui.dragDropInfo object.",[],""), context: "dspf" },
      { name: "ondragleave", type: "js", help: me.helpTextGridProperties("blank","Initiates a client-side script when the user moves a row out of a valid drop target during a drag operation. Information about the drag and drop operation is provided using the global pui.dragDropInfo object.",[],""), context: "dspf" },
      { name: "ondrop", type: "js", help: me.helpTextGridProperties("blank","Initiates a client-side script when the mouse is released during a drag and drop operation. Information about the drag and drop operation is provided using the global pui.dragDropInfo object.",[],""), context: "dspf" },

      { name: "Tabs", category: true },
      { name: "parent tab panel", help: me.helpTextGridProperties("blank","This property specifies the id of the Tab Panel to which this element belongs. The property is set automatically when you drag and drop the element onto a Tab Panel.",[],""), bind: false },
      { name: "parent tab", help: me.helpTextGridProperties("blank","This property specifies the tab index of the specific tab to which this element belongs. Each tab within a Tab Panel is identified by a sequential index, starting with 0 for the first tab, 1 for the second tab, and so on. The property is set automatically when you drag and drop the element onto a Tab Panel.",[],""), bind: false },
      { name: "parent field set", help: me.helpTextGridProperties("blank","This property specifies the if of the Field Set Panel to which this element belongs. The property is set automatically when you drag and drop the element onto a Field Set Panel.",[],""), bind: false },

      { name: "Borders", category: true },
      { name: "border color", type: "color", help: me.helpTextGridProperties("css","The color of the grid's outer borders and inner separators.",[],"") },
      { name: "border width", format: "px", choices: ["0px", "1px", "2px", "3px", "4px", "5px", "Other..."], help: me.helpTextGridProperties("css","The thickness of the grid's outer borders and inner separators.",["other"],"") },

      { name: "Padding", category: true },
      { name: "padding bottom", format: "px", choices: ["0px", "1px", "2px", "3px", "4px", "5px", "6px", "7px", "8px", "9px", "Other..."], help: me.helpTextGridProperties("css","Sets the distance between the bottom edge of a grid cell and the cell's content.",["other"],"") },
      { name: "padding left", format: "px", choices: ["0px", "1px", "2px", "3px", "4px", "5px", "6px", "7px", "8px", "9px", "Other..."], help: me.helpTextGridProperties("css","Sets the distance between the left edge of a grid cell and the cell's content.",["other"],"") },
      { name: "padding right", format: "px", choices: ["0px", "1px", "2px", "3px", "4px", "5px", "6px", "7px", "8px", "9px", "Other..."], help: me.helpTextGridProperties("css","Sets the distance between the right edge of a grid cell and the cell's content.",["other"],"") },
      { name: "padding top", format: "px", choices: ["0px", "1px", "2px", "3px", "4px", "5px", "6px", "7px", "8px", "9px", "Other..."], help: me.helpTextGridProperties("css","Sets the distance between the top edge of a grid cell and the cell's content.",["other"],"") },

      { name: "Misc", category: true },
      { name: "css class", type: "cssClass", multOccur: (context == "dspf" ? true : false), attribute: "class", help: me.helpTextGridProperties("widget","Defines a custom cascading style sheet class to assign to the element." + (context == "dspf" ? "  To specify multiple classes, right-click the property and select Add Another CSS Class." : ""),[],"") },
      { name: "tool tip", type: "long", help: me.helpTextGridProperties("blank","Defines the text to appear in a tool tip when the user hovers the mouse over this element.",[],""), translate: true },
      { name: "user defined data", multOccur: true, help: me.helpTextGridProperties("blank","Specifies user-defined general purpose data associated with the widget. To provide multiple user defined data values, right-click the property and select Add Another User Defined Value.",[],"") },
      { name: "visibility", format: "visible / hidden", choices: ["hidden", "visible"], help: me.helpTextGridProperties("css","Determines whether the element is visible or hidden.",[],"") },

      { name: "Events", category: true },
      { name: "ondbload", type: "js", help: me.helpTextGridProperties("blank","Initiates a client-side script when database data is loaded for a database-driven widget. An object named <b>response</b> will be defined that contains:<ul><li><b>success</b> - boolean true/false</li><li><b>id</b> - the widget id</li><li><b>error</b> - an object with \"id\", \"text\" and \"text2\" fields containing the error.</li></ul>",[],"") },
      { name: "onfilterchange", type: "js", help: me.helpTextGridProperties("blank","Initiates a client-side script when the filter has changed.",[],""), bind: false, context: "dspf" },
      { name: "onrowclick", type: "js", help: me.helpTextGridProperties("blank","Initiates a client-side script when a row within the grid is clicked. The script can determine the row number using the <b>row</b> variable.",[],""), bind: false },
      { name: "onrowdblclick", type: "js", help: me.helpTextGridProperties("blank","Initiates a client-side script when a row within the grid is double-clicked. The script can determine the row number using the <b>row</b> variable.",[],""), bind: false },
      { name: "onrowmouseover", type: "js", help: me.helpTextGridProperties("blank","Initiates a client-side script when the mouse is moved over a row within the grid. The script can determine the row number using the <b>row</b> variable.",[],""), bind: false },
      { name: "onrowmouseout", type: "js", help: me.helpTextGridProperties("blank","Initiates a client-side script when the mouse is moved off of a row within the grid. The script can determine the row number using the <b>row</b> variable.",[],""), bind: false },
      { name: "onpagedown", type: "js", help: me.helpTextGridProperties("blank","Initiates a client-side script when the user pages down using the grid's scrollbar or the grid's paging bar. To prevent the grid's default paging action, the script must evaluate to <i>false</i>.",[],""), bind: false },
      { name: "onpageup", type: "js", help: me.helpTextGridProperties("blank","Initiates a client-side script when the user pages up using the grid's scrollbar or the grid's paging bar. To prevent the grid's default paging action, the script must evaluate to <i>false</i>.",[],""), bind: false },
      { name: "onscroll", type: "js", help: me.helpTextGridProperties("blank","Initiates a client-side script when the user scrolls using the grid's scrollbar. The <b>row</b> variable in the script provides the top row of the grid.",[],""), bind: false }
    ];
    
    return model;
  };
  
};
