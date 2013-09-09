//  Profound UI Runtime  -- A Javascript Framework for Rich Displays
//  Copyright (c) 2013 Profound Logic Software, Inc.
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
 * Grid Class
 * @constructor
 */

pui.Grid = function() {
  // public properties
  if (pui.designer.DataFields != null) {
    this.dataFields = new pui.designer.DataFields();
    this.dataFields.forGrid = true;
  }
  else {
    // dummy object
    this.dataFields = {};
    this.dataFields.forGrid = true;
    this.dataFields.addUsage = function() {};
    this.dataFields.removeUsage = function() {};
    this.dataFields.removeDesignItem = function() {};
    this.dataFields.removeUnused = function() {};
  }
  this.cleared = true;  
  this.runtimeChildren = [];
  this.dataArray = [];
  this.fieldNames = [];
  this.ref = {};  // reference field info
  
  this.recordFormatName = "";
  
  this.vLines = [];
  this.hLines = [];
  this.tableDiv = null;
  this.cells = [];
  this.container = null;
  this.borderColor = "";
  this.borderWidth = 1;
  
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
  if (context == "dspf") this.hoverEffect = true;
  this.pagingScrollBar = true;
  this.slidingScrollBar = false;
  if (context == "dspf") {
    this.pagingScrollBar = false;
    this.slidingScrollBar = true;
  }
  
  this.subfileEnd = false;
  
  this.subfileHidden = false;
  
  this.pagingBar = new pui.PagingBar();
  
  this.visibility = "";
  
  this.columnHeadings = [];

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
  this.cellProps["odd row font color"] = "#555555";
  if (context == "genie") this.cellProps["odd row font color"] = "";
  this.cellProps["odd row background"] = "#e5f1f4";
  this.cellProps["odd row background"] = "#efefef";
  this.cellProps["even row font color"] = "#555555";
  if (context == "genie") this.cellProps["even row font color"] = "";
  this.cellProps["even row background"] = "#f8fbfc";
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
  
  this.totalRecs = null;
  
  this.csvFileName = null;
  this.exportWithHeadings = false;
  
  this.findOption = false;
  this.filterOption = false;
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
  
  this.expanded = true;
  this.initCollapsed = null;
  this.initExpanded = null;
  this.foldMultiple = 1;
  this.singleRowZoom = false;
  
  this.fileId = null;
  this.placeCursorRRN = null;
  
  this.defaultSortOrderArray = [];
  this.initialSortColumn = null;
  this.columnSortResponse = null;
  this.contextMenuId = null;
  
  this.dataConsumed = false;
  
  this.initialPageNumber = 1;
  
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
  
  var headerCellProxy;
  var headerCellProxyContainer;
  var columnPointer; 
  
  var maskCover = null;
  
  this.enableDesign = function() {
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
      addRowIcon.onclick = function(event) {
        var itm = me.tableDiv.designItem;
        itm.designer.undo.start("Add Grid Row");
        itm.designer.undo.add(itm, "number of rows");
        me.addRow();
        me.mirrorDownAll();
        me.doExpandToLayout();
        me.selectMe();
      }
    }
    if (removeRowIcon == null) {
      removeRowIcon = createIcon("minus", "Remove Row");
      removeRowIcon.onclick = function() {      
        var minRow = me.hasHeader ? 2 : 1;
        if (me.cells.length > minRow) {    
          var itm = me.tableDiv.designItem;
          itm.designer.undo.start("Remove Grid Row");
          itm.designer.undo.add(itm, "number of rows");
          me.removeRow();
          me.doExpandToLayout();
          me.selectMe();
        }
      }
    }
    if (addColumnIcon == null) {
      addColumnIcon = createIcon("plus", "Add New Column");
      addColumnIcon.onclick = function() {
        var itm = me.tableDiv.designItem;
        itm.designer.undo.start("Add Grid Column");
        itm.designer.undo.add(itm, "column widths");
        itm.designer.undo.add(itm, "number of columns");        
        me.addColumn();
        me.sizeAllCells();
        me.doExpandToLayout();
        me.selectMe();
      }
    }
    if (removeColumnIcon == null) {
      removeColumnIcon = createIcon("minus", "Remove Column");
      removeColumnIcon.onclick = function() {        
        var lastCol = me.vLines.length - 2;
        if (lastCol < 1) return;
        if (me.hasChildren(lastCol)) {
          pui.alert("The column cannot be removed because it contains other elements that must be removed first.");
          return;
        }
        var itm = me.tableDiv.designItem;
        itm.designer.undo.start("Remove Grid Column");
        itm.designer.undo.add(itm, "column widths");
        itm.designer.undo.add(itm, "number of columns");
        me.removeLastColumn();
        me.doExpandToLayout();
        me.selectMe();
      }
    }
    if (nwHandle == null) nwHandle = createHandle("nw");
    if (neHandle == null) neHandle = createHandle("ne");
    if (swHandle == null) swHandle = createHandle("sw");
    if (seHandle == null) seHandle = createHandle("se");
    
    me.tableDiv.customSelect = function() {
      if (!me.designMode) return;
      if (nwHandle != null) nwHandle.style.visibility = "";
      if (neHandle != null) neHandle.style.visibility = "";
      if (swHandle != null) swHandle.style.visibility = "";
      if (seHandle != null) seHandle.style.visibility = "";
    }
    
    me.tableDiv.customUnselect = function() {
      if (nwHandle != null) nwHandle.style.visibility = "hidden";
      if (neHandle != null) neHandle.style.visibility = "hidden";
      if (swHandle != null) swHandle.style.visibility = "hidden";
      if (seHandle != null) seHandle.style.visibility = "hidden";
    }
    
    me.clearData();
    
    if (me.visibility == "hidden") {
      me.doThisToTableDivs(function(domObj) {
        domObj.style.visibility = "";
      });
    }
    positionIcons();
    me.setScrollBar();
    me.sendToDesigner();
  }
  
  this.doExpandToLayout = function() {
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
    me["setNumberOfRows"](numRows);
    me.dontSelect = false;
    
    // set left and top to 0
    var diffLeft = parseInt(me.tableDiv.style.left);
    var diffTop = parseInt(me.tableDiv.style.top);
    me.doThisToTableDivs(function(domObj) {
      domObj.style.left = (parseInt(domObj.style.left) - diffLeft) + "px";
      domObj.style.top = (parseInt(domObj.style.top) - diffTop) + "px";
    });
    me.setScrollBar();
    me.setHeadings();
  }
  
  this.isInitCollapsed = function() {
    if (me.foldMultiple <= 1) return false;
    var collapsed = me.initCollapsed;
    if (me.initExpanded == true) collapsed = false;  // initExpanded overrides initCollapsed
    if (me.initCollapsed == null && me.initExpanded == false) collapsed = true;
    if (collapsed == null) collapsed = false;
    return collapsed;
  }
  
  this.collapse = function(button) {
    //if (me.visibility == "hidden") return;
    if (!me.expanded) return;
    if (me.foldMultiple <= 1) return;
    if (me.zoomDiv != null) me.zoomDiv.style.display = "none";
    me.expanded = false;
    var rowCount = me.cells.length;
    if (me.hasHeader) rowCount -= 1;
    rowCount = rowCount * (me.foldMultiple - 1)
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
      button.title = pui.getLanguageText("runtimeText", "expandAll");
    }
  }

  this.expand = function(button) {
    if (me.expanded) return;
    if (me.foldMultiple <= 1) return;
    if (me.zoomDiv != null) me.zoomDiv.style.display = "none";
    me.expanded = true;
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
      button.title = pui.getLanguageText("runtimeText", "collapseAll");
    }
  }
  
  this.toggle = function(button) {
    if (me.expanded) {
      me.collapse(button);
    }
    else {
      me.expand(button);
    }
  }
  
  this.setExpander = function(button) {
    
  }
  
  this["rowZoom"] = function(rowCells) {
    if (context != "dspf") return;
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
      me.zoomDiv.onclick = function() {
        me.zoomDiv.style.display = "none";
      }
      me.zoomDiv.onmouseout = function(e) {
        var target = e ? e.relatedTarget : event.toElement;  
        try {  // this is needed because of a ff bug that issues message: Permission denied to access property 'parentNode' from a non-chrome context
          if (target != null && target.parentNode != null) {
            if (target.parentNode == me.zoomDiv) return;
            if (target.parentNode.parentNode == me.zoomDiv) return;
          }
        }
        catch(e) {
        }
        me.zoomDiv.style.display = "none";
      }
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
  }
  
  this.exportCSV = function(file) {
    var delimiter;
    if (typeof(pui["csv separator"]) == "string") {
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
    var fileName = file;
    if (fileName == null) fileName = me.csvFileName;
    if (fileName == null || fileName == "") fileName = me.tableDiv.id;
    fileName = encodeURIComponent(fileName);

    if (me.isDataGrid()) {
      me.getData(fileName);
      return;
    }

    // initialize column array, each array element will hold the index to the dataArray
    var columnArray = [];
    var numericData = [];
    var graphicData = [];
    for (var i = 0; i < me.vLines.length - 1; i++) {
      columnArray.push(-1);
      numericData.push(false);
      graphicData.push(false);
    }
    
    // go through all grid elements, retrieve field names, and identify data index by field name
    for (var i = 0; i < me.runtimeChildren.length; i++) {
      var itm = me.runtimeChildren[i];
      if (itm["visibility"] != "hidden") {
        var col = Number(itm["column"]);
        if (!isNaN(col) && col >= 0 && col < columnArray.length && columnArray[col] == -1) {
          var val = itm["value"];
          if (itm["field type"] == "html container") val = itm["html"];
          if (pui.isBound(val) && val["dataType"] != "indicator" && val["dataType"] != "expression") {
            var fieldName = pui.fieldUpper(val["fieldName"]);
            for (var j = 0; j < me.fieldNames.length; j++ ) {
              if (fieldName == me.fieldNames[j]) {
                columnArray[col] = j;
                if (val["formatting"] == "Number") {
                   numericData[col] = true;
                }
                if (val["dataType"] == "graphic") {
                   graphicData[col] = true;
                }
                break;
              }
            }
          }
        }
      }
    }
    
    var data = "";
    
    // build csv headings
    if (me.hasHeader && me.exportWithHeadings) {
      for (var i = 0; i < columnArray.length; i++) {
        var idx = columnArray[i];
        if (idx > -1) {
          var heading = getInnerText(me.cells[0][i]);
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
    for (var i = 0; i < me.dataArray.length; i++) {
      var line = "";      
      var record = me.dataArray[i];
      for (var j = 0; j < columnArray.length; j++) {
        var idx = columnArray[j];
        if (idx > -1) {
          var value = record[idx];
          if (graphicData[j]) {
             value = pui.formatting.decodeGraphic(value);
          } 
          if (numericData[j] && pui.appJob != null && (pui.appJob["decimalFormat"] == "I" || pui.appJob["decimalFormat"] == "J")) {
             value = value.replace('.', ',');
          }
          value = value.replace(/"/g, '""');  // "
          if (line != "") line += delimiter;
          line += '"' + rtrim(value) + '"';
        }
      }
      if (data != "") data += "\n";
      data += line;
    }

    pui.downloadAsAttachment("text/csv", fileName + ".csv", data);
    
  }
  
  this.hasChildren = function(colNumber) {
    if (context == "genie") return false;    
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
  }
  
  this.getChildren = function() {
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
  }
  
  this.getSubfilePage = function() {
    var sflPage = me.hLines.length - 1;
    if (me.hasHeader) sflPage = sflPage - 1;
    return sflPage;
  }
  
  this.mirrorDown = function(col) {
    if (context == "genie") return;
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
      if (obj.style.position == "absolute" && !obj.isSizie && !obj.isInlineEditBox) {
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
  }
  
  this.mirrorDownAll = function() {
    if (context == "genie") return;
    var numCols = me.vLines.length - 1;    
    for (var col = 0; col < numCols; col++) {
      me.mirrorDown(col);
    }
  }
  
  this.getCellValue = function(row, col) {
    var rowNum = row;
    var topRecord = 1;
    if (context == "dspf" || me.isDataGrid()) topRecord = me.recNum;
    rowNum = rowNum - topRecord;
    if (me.hasHeader) rowNum++;
    var rowObj = me.cells[rowNum];
    if (rowObj == null) return null;
    var cell = rowObj[col];
    if (cell == null) return null;
    var value = getInnerText(cell);
    return value;
  }
  
  this.getDataValue = function(row, fieldName) {
    if (typeof row != "number") return null;
    if (typeof fieldName != "string") return null;
    var record = me.dataArray[row - 1];
    if (record == null) return null;
    fieldName = pui.fieldUpper(fieldName);
    
    // check changed values in response elements first
    var qualField = pui.formatUpper(me.recordFormatName) + "." + fieldName +  "." + row;
    var elems = pui.responseElements[qualField];
    if (elems != null && elems.length == 1) {
      var elem = elems[0];
      if (elem != null) {
        return getElementValue(elem);
      }      
    }

    var columnIndex = null;
    for (var i = 0; i < me.fieldNames.length; i++ ) {
      if (fieldName == me.fieldNames[i]) {
        columnIndex = i;
        break;
      }
    }
    if (columnIndex == null) return null;
    return record[columnIndex];
  }
  
  this["setDataValue"] = function(rowNum, fieldName, value) {
    var field = null;
    for (var i = 0; i < me.runtimeChildren.length; i++) {
      field = me.runtimeChildren[i];
      if (pui.isBound(field.value) && field.value["fieldName"] == fieldName) break;
    }
    if (field == null) return false;
    var el = field.domEls[rowNum - 1];
    if (el == null) return false;
    if (el.tagName == "INPUT" || el.tagName == "TEXTAREA" || el.tagName === "SELECT") el.value = value;
    if (el.tagName == "DIV") el.innerHTML = value;
    el.modified = true;
    return true;
  }

  this.atTop = function() {
    if (me.recNum > 1) return false;
    else return true;
  }
  
  this.pageUp = function() { 
  
    if (executeEvent("onpageup") == false) {
    
      return;
    
    }  
    
    if (context == "genie") {
    
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
      if (pui.touchDevice || pui.iPadEmulation) me.getData();
    }
    else {
      me.getData();
    }
    setTimeout(function() {
      me.unMask();
      // place cursor on first row
      var rowNum = 0;
      if (me.hasHeader) rowNum++;
      var row = me.cells[rowNum];
      setTimeout(function() {
        placeCursorOnRow(row);
      }, 100);
    }, 1);
  }

  this.atBottom = function() {
    var numRows = me.cells.length;
    if (me.hasHeader) numRows = numRows - 1;
    var lastRow = me.recNum + numRows - 1;
    if (me.dataArray.length > lastRow) return false;
    else return true;
  }

  this.pageDown = function() {   
  
    if (executeEvent("onpagedown") == false) {
    
      return;
    
    }
    
    if (context == "genie") {
    
      pressKey("pagedown");
      return;
    
    }    
   
    me.mask();
    var numRows = me.cells.length;
    if (me.hasHeader) numRows = numRows - 1;
    me.recNum += numRows;
    var lastRow = me.recNum + numRows - 1;
    if (me.dataArray.length < lastRow && me.scrollbarObj != null) {
      me.recNum = me.recNum - lastRow + me.dataArray.length;
      if (me.recNum < 1) me.recNum = 1;
    }
    if (me.slidingScrollBar) {
      me.scrollbarObj.setScrollTopToRow(me.recNum);
      if (pui.touchDevice || pui.iPadEmulation) me.getData();
    }
    else {
      me.getData();
    }
    setTimeout(function() {
      me.unMask();
      // place cursor on first row
      var rowNum = 0;
      if (me.hasHeader) rowNum++;
      var row = me.cells[rowNum];
      setTimeout(function() {
        placeCursorOnRow(row);
      }, 100);
    }, 1);
  }
  
  this.unMask = function() {
    if (maskCover != null) maskCover.style.display = "none";
  }
  
  this.mask = function() {
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
    //maskCover.style.zIndex = 250;
    //maskCover.style.backgroundColor = "#CCCCCC";
    //maskCover.style.opacity = 0.35;
    //maskCover.style.filter = "alpha(opacity=35)";
    me.tableDiv.parentNode.appendChild(maskCover);
  }
  
  this.getData = function(csvFile) {
    if (me.tableDiv.disabled == true) return;
    if (me.designMode) return;
    var numRows = me.cells.length;
    if (me.hasHeader) numRows = numRows - 1;
    if (numRows < 1) return;
    var sql = me.dataProps["custom sql"];
    var orderBy = "";
    if (sql == null || sql == "") {
      var file        = me.dataProps["database file"];
      var fields      = me.dataProps["database fields"];
      var whereClause = me.dataProps["selection criteria"];
      orderBy         = me.dataProps["order by"];
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
        if (typeof(pui["csv separator"]) == "string") {
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
        addField("UTF8", "Y");
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
          var headings = "";
          for (var i = 0; i < me.cells[0].length; i++) {
            var heading = getInnerText(me.cells[0][i]);
            heading = heading.replace(/"/g, '""');  // "
            if (headings != "") headings += delimiter;
            headings += '"' + heading + '"';
          }          
          addField("headings", headings);
        }
        document.body.appendChild(form);
        pui.skipConfirm = true;
        form.submit();    
        setTimeout(function() {
          form.parentNode.removeChild(form);
          pui.skipConfirm = false;
        }, 0);        
        return;
      }
      if (me.scrollbarObj != null) {
        if (me.scrollbarObj.type == "paging") me.scrollbarObj.atTop = (me.recNum == 1);
        if (me.tableDiv.style.visibility != "hidden") me.scrollbarObj.draw();
      }
      me.clearData();
      runSQL(sql, numRows, me.recNum, receiveData, (me.totalRecs == null), dataURL, true);
    }
    else if (context == "dspf") {
      me.tableDiv.cursorRRN = 0;
      me.tableDiv.returnRRN = me.recNum;
      if (me.fileId != null) {
        pui.topRRNs["toprrn." + me.fileId] = me.recNum;
      }
      me.clearData();
      var rowNum = (me.hasHeader ? 1 : 0);
      var lastRow = me.recNum + numRows - 1;
      if (me.dataArray.length < lastRow && me.scrollbarObj != null) {
        me.recNum = me.recNum - lastRow + me.dataArray.length;
        if (me.recNum < 1) me.recNum = 1;
        lastRow = me.dataArray.length;
      }
      me.hideTips();
      for (var i = me.recNum; i <= lastRow ; i++) {
      
        var fieldData = {};        
        var valuesData = me.dataArray[i-1];        
        if (valuesData == null || valuesData.length == 0) {
          fieldData.empty = true;
        }
        else {
          for (var j = 0; j < me.fieldNames.length; j++) {
            fieldData[me.fieldNames[j]] = valuesData[j];
          }
        }        

        if (me.selectionEnabled) {
          me.setRowBackground(rowNum);
        }

        if (fieldData.empty != true) {
          var subfileRow = me.dataArray[i-1].subfileRow;
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
            dataArrayIndex: i - 1
          });
          if (me.selectionEnabled && me.selectionField != null) {
            var qualField = pui.formatUpper(me.recordFormatName) + "." + pui.fieldUpper(me.selectionField.fieldName) +  "." + subfileRow;
            if (pui.responseElements[qualField] == null) {
              me.dataArray[i-1].selection = {
                modified: false,
                type: "grid selection",
                value: me.selectionField.dataType == "indicator" ? "0" : " ",
                subfileRow: subfileRow,
                formattingInfo: me.selectionField
              }
              pui.responseElements[qualField] = [];
              pui.responseElements[qualField].push(me.dataArray[i-1].selection);
            }
          }
        }
        rowNum++;
      }
      if (me.scrollbarObj != null && me.scrollbarObj.type == "sliding") {
        me.scrollbarObj.totalRows = me.dataArray.length;
      }
      if (me.tableDiv.style.visibility != "hidden" && me.scrollbarObj != null) me.scrollbarObj.draw();
      if (me.pagingBar != null) {
        me.pagingBar.pageNumber = parseInt((me.recNum + numRows * 2 - 2) / numRows) + me.initialPageNumber - 1;
        me.pagingBar.draw();
      }
      me.cleared = false;      
    }
    
    
    function receiveData(data, totalRecs) {
      if (totalRecs != null) me.totalRecs = totalRecs;
      var paddingCSS = getPaddingCSS();
      // Column order can differ from SQL when backend SQL statements are used, and the 
      // user has re-ordered the columns.
      var cellMap = new Array(me.cells[0].length);
      for (var i = 0; i < me.cells[0].length; i++) {
        cellMap[me.cells[0][i].columnId] = i;
      }
      for (var i = 0; i < data.length; i++) {
        var record = data[i];
        var colNum = 0;
        for (var j in record) {
          var rowNum = i + (me.hasHeader ? 1 : 0);
          var row = me.cells[rowNum];
          if (colNum < row.length) {            
            var dataValue = record[j];
            var alignCSS = "";
            var idx;
            if (pui["secLevel"] > 0) {
              idx = cellMap[colNum];
            }
            else {
              idx = colNum;
            }
            if (row[idx].style.textAlign != null && row[idx].style.textAlign != "") {
              alignCSS = " text-align:" + row[idx].style.textAlign;
            }
            row[idx].innerHTML = '<div style="' + paddingCSS + alignCSS + '">' + dataValue + '</div>';
          }
          colNum++;
        }
      }
      if (me.scrollbarObj != null) {
        if (me.scrollbarObj.type == "paging") {
          me.scrollbarObj.atBottom = false;
          if (me.totalRecs != null) {
            var numRows = me.cells.length;
            if (me.hasHeader) numRows = numRows - 1;
            if (me.recNum + numRows > me.totalRecs) {
              me.scrollbarObj.atBottom = true;
            }
          }
          me.scrollbarObj.reset();
        }
        if (me.scrollbarObj.type == "sliding") {
          if (me.totalRecs != null) me.scrollbarObj.totalRows = me.totalRecs;
        }
      }
      if (me.tableDiv.style.visibility != "hidden" && me.scrollbarObj != null) me.scrollbarObj.draw();
      me.cleared = false;
    }    
    
  }

  this.clearData = function() {
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
  }

  this.hideTips = function() {
    for (var domid in me.validationTips) {
      var tip = me.validationTips[domid];
      tip.hideNow();
    }
  }

  this.destroy = function() {
    for (var i = me.vLines.length - 1; i >= 0; i = i - 1) {
      me.vLines[i].parentNode.removeChild(me.vLines[i]);
    }  
    for (var i = me.hLines.length - 1; i >= 0; i = i - 1) {
      me.hLines[i].parentNode.removeChild(me.hLines[i]);
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
    delete me.runtimeChildren;
    delete me.fieldNames;
    delete me.ref;
    delete me.vLines;
    delete me.hLines;
    delete me.cells;
    delete me.columnHeadings;
    delete me.validationTips;
    delete me.cellProps;
    delete me;
  }
  
  this.getColumnWidths = function() {
    var widths = "";
    for (var i = 1; i < me.vLines.length; i++) {
      var width = parseInt(me.vLines[i].style.left) - parseInt(me.vLines[i-1].style.left);
      if (widths == "") {
        widths += String(width);
      }
      else {
        widths += "," + String(width);
      }
    }
    return widths;
  }

  this.setColumnWidths = function(widths) {
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
  }
  
  this.selectMe = function() {
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
  }
  
  this.sendToDesigner = function(forced) {
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
  }
  
  function sendPropertyToDesigner(itm, propertyName, value) {
    stringValue = String(value);
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
    if (is_ie && quirksMode) {
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
          if (addHeight < -me.rowHeight + 5) addHeight = -me.rowHeight + 5
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
            if (tableBottom > parseInt(me.hLines[me.hLines.length-1].style.top) + me.rowHeight - 3) {
              var addedSome = false;
              while (parseInt(me.hLines[me.hLines.length-1].style.top) < tableBottom) {
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
      designUtils.addEvent(document, "mouseup",   mouseup);  
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
  
  this.setHeadings = function() {
    if (!me.hasHeader) return;
    if (me.cells.length <= 0) return;
    var paddingCSS = getPaddingCSS();
    for (var i = 0; i < me.cells[0].length; i++) {
      if (me.columnHeadings.length <= i) {
        me.cells[0][i].innerHTML = "";
      }
      else {
        var alignCSS = "";
        if (me.cells[0][i].style.textAlign != null && me.cells[0][i].style.textAlign != "") {
          alignCSS = " text-align:" + me.cells[0][i].style.textAlign;
        }
        me.cells[0][i].innerHTML = '<div style="' + paddingCSS + alignCSS + '">' + me.columnHeadings[i] + '</div>';
        centerHeadingVertically(me.cells[0][i]);
      }      
      // This method runs when the user resizes columns, and the sort icon becomes orphaned.
      var placeIcon = false;
      if (me.designMode == false && me.sortable == true && me.sortIcon != null) {      
        if (clientSortColumnId == me.cells[0][i].columnId) {
          placeIcon = true;
        }
        else if (me.tableDiv.columnSortResponseField != null && me.initialSortColumn == me.cells[0][i].columnId) {
          placeIcon = true;
        }
        if (placeIcon) {
          if (me.sortIcon.parentNode != null) {
            me.sortIcon.parentNode.removeChild(me.sortIcon);
          }
          var destination = me.cells[0][i];
          if (destination.firstChild != null && destination.firstChild.tagName == "DIV") {
            destination = destination.firstChild;
          }
          destination.appendChild(me.sortIcon);
        }
      }
    }
  }
  
  this.clearHeadings = function() {
    if (!me.hasHeader) return;
    if (me.cells.length <= 0) return;
    for (var i = 0; i < me.cells[0].length; i++) {
      me.cells[0][i].innerHTML = "";
    }
  }
  
  this.makeSortable = function() {
    if (!me.sortable) return;
    if (context != "dspf") return;
    if (!me.hasHeader) return;
    if (me.cells.length <= 0) return;
    var headerRow = me.cells[0];
    if ( (me.dataProps["database file"] != null && me.dataProps["database file"] != "") &&
         (me.dataProps["custom sql"] == null || me.dataProps["custom sql"] == "" ) &&
         (me.dataProps["data url"] == null || me.dataProps["data url"] == "" ) &&
         (me.dataProps["database fields"] != null && me.dataProps["database fields"] != "") ) {
      var fields = pui.getFieldList(me.dataProps["database fields"]);
      for (var i = 0; i < fields.length; i++) {
        headerRow[i].fieldName = fields[i];
        if (!pui.iPadEmulation) {
          headerRow[i].style.cursor = "pointer";
        }
        attachClickEventForSQL(headerRow[i]);
        headerRow[i].sortDescending = !isDefaultSortDescending(i);
      }
      if (me.initialSortColumn != null) {
        sortColumnUsingSQL(headerRow[me.initialSortColumn]);
      }
    }
    else {
      for (var i = 0; i < me.runtimeChildren.length; i++) {
        var itm = me.runtimeChildren[i];
        var col = Number(itm["column"]);
        var val = itm["value"];
        if (itm["field type"] == "html container") val = itm["html"];
        if (pui.isBound(val) && !isNaN(col) && col < headerRow.length && headerRow[col].sortIndex == null) {
          var fieldName = pui.fieldUpper(val["fieldName"]);
          for (var j = 0; j < me.fieldNames.length; j++ ) {
            if (fieldName == me.fieldNames[j]) {
              headerRow[col].sortIndex = j;
              headerRow[col].fieldName = fieldName;
              headerRow[col].dataType = val["dataType"];
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
        sortColumn(headerRow[me.initialSortColumn]);
      }
    }
        
    function attachClickEventForSQL(cell) {
      function doSort() {
        sortColumnUsingSQL(cell);
      }
      addEvent(cell, "click", doSort);
      cell.sortColumn = doSort;
    }

    function attachClickEvent(cell) {
      function doSort() {
        if (me.tableDiv.columnSortResponseField != null) {
          me.columnSortResponse = String(cell.col);
          pui.columnSortResponseGrid = me;
          var returnVal = pui.respond();
          pui.columnSortResponseGrid = null;
        }
        else {
          sortColumn(cell);
        }
      }
      addEvent(cell, "click", doSort);
      cell.sortColumn = doSort;
    }
  }
  
  this.restoreState = function() {
       
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
    
    // Restore saved column widths.
    if (resizableColumns == true) {
      
      var colWidths = state["colWidths"];
      if (colWidths != null) {
        
        me.setColumnWidths(colWidths);
        me.sizeAllCells();
        me.setHeadings();      
        
      }
    
    }    
        
    // Restore saved column sequence.
    if (movableColumns == true) {
      
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
        
    // Restore saved client-side column sort.
    if (me.sortable && me.tableDiv.columnSortResponseField == null) {
    
      var sort = state["sort"];
      if (sort != null && sort["columnId"] != null && sort["descending"] != null) {
        
        var sortCell;
        for (var i = 0; i < me.cells[0].length; i++) {
          
          if (me.cells[0][i].columnId == sort["columnId"]) {
            
            sortCell = me.cells[0][i];
            sortCell.sortDescending = !sort["descending"];
            
          }
          
        }
                
        if (me.isDataGrid()) {
          
          sortColumnUsingSQL(sortCell, true);
          
        }
        else {
         
          sortColumn(sortCell, true);
          
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
      headerRow[col].sortDescending = !isDefaultSortDescending(col);
    }
  }
    
  function sortColumn(cell, restoring) {
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

    if (me.tableDiv.columnSortResponseField == null) {
      clientSortColumnId = cell.columnId;
      removeAllResponseElements();
      for (var i = 0; i < me.runtimeChildren.length; i++) {
        me.runtimeChildren[i].domEls = [];
      }
      pui.rrnTracker = {};   // to do -- problem ... rrn tracker doesn't handle multiple grids?

      if (!me.sorted) {
        for (var i = 0; i < me.dataArray.length; i++) {
         me.dataArray[i].subfileRow = i + 1;
        }
      }
      me.dataArray.sort(function(row1, row2) {
        var value1 = row1[sortIndex];
        var value2 = row2[sortIndex];
        if (cell.dataType == "zoned" || cell.dataType == "floating") {
          value1 = Number(value1);
          value2 = Number(value2);
        }
        if (cell.dataType == "reference") {
          var refObj = me.ref[cell.fieldName];
          if (refObj != null) {
            if (refObj.dataType == 7 || refObj.dataType == 9 ||  refObj.dataType == 10) {  // zoned, packed, floating
              value1 = Number(value1);
              value2 = Number(value2);
            }
          }
        }
        if ((desc && value1 < value2) || (!desc && value1 > value2)) return -1;
        else return 1;
      });
      me.sorted = true;

      if (me.scrollbarObj != null && me.scrollbarObj.type == "sliding") {
        me.scrollbarObj.setScrollTopToRow(1);
      }        
    
      me.recNum = 1;
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
    me.sortBy = cell.fieldName;
    desc = !desc;
    if (desc) me.sortBy += " DESC";

    me.sorted = true;

    if (me.scrollbarObj != null && me.scrollbarObj.type == "sliding") {
      me.scrollbarObj.setScrollTopToRow(1);
    }
    me.recNum = 1;
    me.getData();
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
    var fieldXRef = {};
    for (var i = 0; i < me.fieldNames.length; i++) {
      fieldXRef[me.fieldNames[i]] = i;
    }
    var toRemove = [];
    var startsWith = pui.formatUpper(me.recordFormatName) + ".";
    for (var fldName in pui.responseElements) {
      if (fldName.substr(0, startsWith.length) == startsWith) {
        // place user's response back into dataArray before removing
        var shortFieldName = fldName.substr(startsWith.length);
        var parts = shortFieldName.split(".");
        if (parts.length == 2) {
          var fieldIdx = fieldXRef[parts[0]]
          if (fieldIdx != null) {
            var dom = pui.responseElements[fldName][0];
            if (dom != null && dom.dataArrayIndex != null) {
              var rowData = me.dataArray[dom.dataArrayIndex];
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
                var oldRevert = dom.formattingInfo.revert;
                dom.formattingInfo.value = value;
                dom.formattingInfo.revert = true;
                value = pui.FieldFormat.format(dom.formattingInfo);
                dom.formattingInfo.value = oldValue;
                dom.formattingInfo.revert = oldRevert;                
                if (typeof value == "object") {
                  // Error.
                  value = "";
                }
                rowData[fieldIdx] = value;
              }
            }
          }
        }
        toRemove.push(fldName);
      }
    }
    for (var i = 0; i < toRemove.length; i++) {
      delete pui.responseElements[toRemove[i]];
    }
  }
    
  function loadState() {
    
    var state;
    
    if (localStorage[me.storageKey] != null) {
                  
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
        
        if (eventName == "onrowclick") {
          
          eval("var isRightClick = arguments[2];");
          
        }        

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
          if (me.dataArray[adjustedRow - 1] != null && me.dataArray[adjustedRow - 1].subfileRow != null) {
            adjustedRow = me.dataArray[adjustedRow - 1].subfileRow;
          }
          eval("row = " + adjustedRow);          
        }
        var returnVal = eval(eventCode);
        if (returnVal == false) return false;
      }
      catch(err) {
        pui.alert(eventName.substr(0, 1).toUpperCase() + eventName.substr(1) + " Error:\n" + err.message);
        return false;
      }
    }
  }
  
  this.consumeDataFromScreen = function(multiple, newGrid) {
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

    var rowNum = 0;
    if (me.hasHeader) rowNum++;
    for (var row = startRow; row <= endRow; row += multiple) {
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
          var objCass;
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
            fieldInfo = obj.fieldInfo
          }
          else {
            text = obj.innerHTML;
            objClass = obj.className;
            left = parseInt(obj.style.left);
            top = parseInt(obj.style.top);
            fieldInfo = obj.fieldInfo
            obj.parentNode.removeChild(obj);
          }
          if (objClass == null || objClass == "" || objClass == "A20") {
            objClass = "";
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
  }
  
  this.setScrollBar = function() {
  
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
        if (context == "genie") me.scrollbarObj.ready = true;
      }
      me.scrollbarObj.container = me.container;
      me.scrollbarObj.zIndex = me.scrollZIndex;
      me.scrollbarObj.designMode = me.designMode;
      if (stype == "sliding") {
        me.scrollbarObj.onSetRow = function(recNum) {
          me.recNum = recNum;
          me.getData();
          me.placeCursor(true);
        }
        me.scrollbarObj.onchange = function(recNum) {
          if (me.isDataGrid()) {
            me.clearData();
          }
        }
        me.scrollbarObj.enableMouseWheel(me.tableDiv);        
      }
      
      if (stype == "paging") {
        me.scrollbarObj.onpageup = function() {
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
          else if (context == "dspf") {
            pui.handleHotKey({}, "PageUp");
          }
          else if (context == "genie") {
            pressKey("PageUp");
            return true;
          }        
        }

        me.scrollbarObj.onpagedown = function() {
          var returnVal = executeEvent("onpagedown");
          if (returnVal == false) return false;
          if (me.isDataGrid()) {
            var numRows = me.cells.length;
            if (me.hasHeader) numRows = numRows - 1;
            me.recNum += numRows;
            me.getData();
            return true;
          }
          else if (context == "dspf") {
            pui.handleHotKey({}, "PageDown");
          }
          else if (context == "genie") {
            pressKey("PageDown");
            return true;
          }
        }
      }
      
      me.scrollbarObj.init(me.tableDiv);
    }
    if (needScrollBar) {
      var bwidth = me.borderWidth;
      if (me.designMode && bwidth < minBWidth) bwidth = minBWidth;
      var scrollBarWidth = 23;
      if (pui.touchDevice || pui.iPadEmulation) scrollBarWidth = 0;
      me.scrollbarObj.x = parseInt(me.vLines[me.vLines.length - 1].style.left) - scrollBarWidth;
      me.scrollbarObj.y = parseInt(me.tableDiv.style.top) + bwidth;
      if (stype == "paging") {
        me.scrollbarObj.height = me.getStyleAsInt("height") - bwidth;
        if (me.scrollbarObj.height < 0) me.scrollbarObj.height = 0;
      }
      if (stype == "sliding") {
        if (me.isDataGrid()) me.scrollbarObj.interval = 250;
        else  me.scrollbarObj.interval = 1;
        var numRows = me.cells.length;
        if (me.hasHeader) numRows = numRows - 1;
        me.scrollbarObj.rowsPerPage = numRows;
        me.scrollbarObj.rowHeight = me.rowHeight;
        me.scrollbarObj.borderWidth = bwidth;
        if (me.designMode) me.scrollbarObj.totalRows = numRows * 3;  // sample scroll
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
        adj = - adj;
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
  }
  
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
    icon.onmousedown = function(event) {
      designUtils.preventEvent(event);
    }
    me.container.appendChild(icon);  
    return icon;
  }
  
  function positionIcons() {
    if (!me.designMode) return;
    var y = 0;
    var x = 0;
    var n = me.hLines.length;
    if (n > 0) {
      x = parseInt(me.hLines[n-1].style.left);
      y = parseInt(me.hLines[n-1].style.top) - 20;
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
      x = parseInt(me.vLines[n-1].style.left) - 20;
      y = parseInt(me.vLines[n-1].style.top) + 5;      
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
  
  this.getStyleAsInt = function(styleProperty) {
    var returnValue = parseInt(me.tableDiv.style[styleProperty]);
    if (isNaN(returnValue)) returnValue = 0;
    return returnValue;
  }
  
  this.setProperty = function(property, value) {
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
          if (typeof(pui["grid text selection"]) == "undefined" || pui["grid text selection"] == false) {
            me.tableDiv.onselectstart = function(e) { return false };
            if (typeof me.tableDiv.style.MozUserSelect!="undefined") me.tableDiv.style.MozUserSelect = "none";
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
        var curTop = parseInt(me.hLines[topLineIdx].style.top)
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
        if (me.hasHeader && (value == false || value == "false") ) {
          me.clearHeadings();          
          me.hasHeader = false;
          if (context == "dspf") {
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
        if (!me.hasHeader && (value == true || value == "true" || value == "") ) {
          if (me.cells.length <= 1) {
            me.addRow();
          }
          me.hasHeader = true;
          if (context == "dspf") {
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
        }
        break;

      case "resizable columns":
        if (!me.designMode && (value == true || value == "true" )) {
          resizableColumns = true;
          for (var i = 0; i < me.vLines.length; i++) {
            lineDesign(me.vLines, i, true, true);
          }        
        }
        break;

      case "movable columns":
        if (!me.designMode && me.hasHeader && (value == true || value == "true" )) {
          movableColumns = true;
          var headerRow = me.cells[0];
          for (var col = 0; col < headerRow.length; col++) {
            cellDesign(headerRow[col], true);
          }
        }
        break;
      
      case "persist state": 
        persistState = (me.designMode == false && typeof(window.localStorage) != "undefined" && (value == true || value == "true"));
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
      
      case "context menu id":
        if (!me.designMode) {
          me.contextMenuId = value;
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
        if (value != null && value != "") me.pagingBar.pageUpResponseDefined = true;
        break;
        
      case "page down response":
        if (value != null && value != "") me.pagingBar.pageDownResponseDefined = true;
        break;        
        
      case "csv export":
        me.pagingBar.csvExport = (value == true || value == "true");
        if (me.designMode) {
          me.pagingBar.draw();
          positionIcons();
        }
        break;

      case "csv file name":
        me.csvFileName = value;
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
        if (context == "genie") {
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
      case "data url":
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
        me.doThisToTableDivs(function(domObj) {
          domObj.style.top = (parseInt(domObj.style.top) - diff) + "px";
        });
        me.setScrollBar();
        break;
        
      case "left":
        var left = value;
        if (pui.isBound(left)) left = left.designValue;
        var diff = parseInt(me.tableDiv.style.left) - pui.safeParseInt(left);
        me.doThisToTableDivs(function(domObj) {
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
            if (parseInt(me.vLines[n-1].style.left) + 5 > left) {
              left = parseInt(me.vLines[n-1].style.left) + 5;
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
          me.rowHeight = curTop - parseInt(me.hLines[i-1].style.top);
          if (me.rowHeight < 5) me.rowHeight = 5;
          var downto = 0;
          if (me.hasHeader) downto = 1;
          for (j = i - 1; j >= downto; j = j - 1) {
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
          me.doThisToTableDivs(function(domObj) {
            domObj.style.visibility = value;
          });
          if (value == "hidden" && me.scrollbarObj != null) me.scrollbarObj.hide();
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
        me.events[property] = value;
        break;
      
      default:
        pui.alert("Grid property not handled: " + property);
    }
  }
  
  this.doThisToTableDivs = function(handler) {  
    for (var i = 0; i < me.vLines.length; i++) {
      var line = me.vLines[i];
      handler(line)
    }
    for (var i = 0; i < me.hLines.length; i++) {
      var line = me.hLines[i];
      handler(line)
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
  }  
  
  this.setCursorRRN = function(row) {
    if (me.recNum != null && !isNaN(me.recNum) && me.recNum > 0) {
      me.tableDiv.cursorRRN = row + me.recNum;
      if (me.hasHeader) {
        me.tableDiv.cursorRRN = me.tableDiv.cursorRRN - 1;
      }
      if (me.dataArray[me.tableDiv.cursorRRN - 1] == null || me.dataArray[me.tableDiv.cursorRRN - 1].length == 0) {
        me.tableDiv.cursorRRN = 0;
      }
      else if (me.dataArray[me.tableDiv.cursorRRN - 1].subfileRow != null) {
        me.tableDiv.cursorRRN = me.dataArray[me.tableDiv.cursorRRN - 1].subfileRow;
      }
    }
  }
  
  this.placeCursor = function(onTimeout) {
    var rrn = me.placeCursorRRN;
    me.placeCursorRRN = null;
    if (rrn == null) return;
    var rowNum = rrn - me.recNum;
    if (rowNum < 0) return;
    if (me.hasHeader) rowNum++;
    if (rowNum > me.cells.length - 1) return;
    var row = me.cells[rowNum];
    if (onTimeout == true) {
      setTimeout(function() {
        placeCursorOnRow(row);
      }, 1);
    }
    else {
      placeCursorOnRow(row);
    }
  }

  this.setRowBackground = function(row, hover) {
    var even = ((row % 2) == 1);
    if (me.hasHeader) even = !even;
    if (me.cells == null) return;
    var cols = me.cells[row];
    
    var selected = false;
    if (me.selectionEnabled) {
      if (me.recNum != null && !isNaN(me.recNum) && me.recNum > 0) {
        var adjustedRow = row + me.recNum - 1 + (me.hasHeader ? 0 : 1);
        if (me.dataArray[adjustedRow - 1] != null && me.dataArray[adjustedRow - 1].length > 0) {
          if (me.dataArray[adjustedRow - 1].selected == null) {
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
                if (me.dataArray[adjustedRow - 1][me.selectionFieldIndex] == me.selectionValue) {
                  me.dataArray[adjustedRow - 1].selected = true;
                }
              }
            }
          }
          if (me.dataArray[adjustedRow - 1].selected == true) {
            selected = true;
          }
        }
      }
    }

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
      if (context == "genie") {
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
          cols[i].style.backgroundImage = "url('" + selectionImage + "')";
        }
        pui.addCssClass(cols[i], "selected");
      }
      else if (hover == true) {
        setColor(cols[i], me.cellProps["hover font color"], i);
        cols[i].style.backgroundColor = me.cellProps["hover background"];
        if (me.cellProps["hover image"] != null && me.cellProps["hover image"] != "") {
          cols[i].style.backgroundImage = "url('" + me.cellProps["hover image"] + "')";
          cols[i].style.backgroundRepeat = "repeat-x";        
        }
        pui.addCssClass(cols[i], "hover");
      }
      else {
        if (even) {
          setColor(cols[i], me.cellProps["even row font color"], i);
          if (me.cellProps["even row background"] == null) {
            cols[i].style.backgroundColor = "";
          }
          else {
            cols[i].style.backgroundColor = me.cellProps["even row background"];
          }
        }
        else {
          setColor(cols[i], me.cellProps["odd row font color"], i);
          if (me.cellProps["odd row background"] == null) {
            cols[i].style.backgroundColor = "";
          }
          else {
            cols[i].style.backgroundColor = me.cellProps["odd row background"];
          }
        }
        cols[i].style.backgroundImage = "";
      }
    }
    if (hover != true && me.zoomIcon != null) me.zoomIcon.style.display = "none";
    if (hover == true && me.zoomIcon != null) me.zoomIcon.style.display = "";
  }
  
  // set design events on a cell div
  function cellDesign(cell, movableColumns) {
    if (!me.designMode && movableColumns != true) return;
    if (!me.designMode && movableColumns == true) {
      me.tableDiv.parentNode.onselectstart = function(e) {        
        if (me.dragging) {
          preventEvent(e);
          return false;
        }
      }
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
      var cursorStartX = getMouseX(event);
      var cursorStartY = getMouseY(event);
      var startGridX = parseInt(me.tableDiv.style.left);
      var startGridY = parseInt(me.tableDiv.style.top);
      me.doThisToTableDivs(function(domObj) {
        domObj.startLeft = pui.safeParseInt(domObj.style.left);
        domObj.startTop = pui.safeParseInt(domObj.style.top);
      });
      var inLayoutContainer = false;
      if (context == "dspf" && me.tableDiv.parentNode.getAttribute("container") == "true") {
        inLayoutContainer = true;
      }

      function mousemove(event) {
        var y = getMouseY(event) - cursorStartY;
        var x = getMouseX(event) - cursorStartX;
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
            for (var i = 0; i < me.vLines.length; i++) {
              var line = me.vLines[i];
              var lineLeft = parseInt(line.style.left);
              var mouseLeft = x + cursorStartX;
              if (me.designMode) {
                mouseLeft = mouseLeft - me.tableDiv.designItem.designer.getLeftOffset();
              }
              else if (pui.genie != null) {
                mouseLeft -= pui.runtimeContainer.offsetLeft;
              }
              if (context == "dspf" && me.tableDiv.parentNode.getAttribute("container") == "true") {
                mouseLeft = mouseLeft - pui.layout.getContainerOffset(me.tableDiv.parentNode).x;
              }
              if (!me.designMode) {
                var windowDiv = me.tableDiv.parentNode;
                if (windowDiv.isPUIWindow == true) {
                  mouseLeft -= parseInt(windowDiv.style.left);
                }
              }
              var diff = Math.abs(lineLeft - mouseLeft);
              if (diff < 15) {
                if (columnPointer != null && columnPointer.parentNode != line.parentNode) {
                  columnPointer.parentNode.removeChild(columnPointer);
                  columnPointer = null;
                }
                if (columnPointer == null) {
                  columnPointer = document.createElement("img");
                  columnPointer.src = pui.normalizeURL("/profoundui/proddata/images/grids/column-pointer.gif");
                  columnPointer.style.position = "absolute";
                  columnPointer.style.zIndex = me.moveColumnZIndex + 1;
                  line.parentNode.appendChild(columnPointer);
                }
                columnPointer.style.display = "";
                columnPointer.style.top = (parseInt(line.style.top) - 10) + "px";
                columnPointer.style.left = (parseInt(line.style.left) - 4) + "px";
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

          var offsetX = designItem.designer.getLeftOffset();
          var offsetY = designItem.designer.getTopOffset();
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
        me.doThisToTableDivs(function(domObj) {
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
        if (columnPointer != null) {
          columnPointer.style.display = "none";
          if (columnPointer.matchedCol != null) {
            me.moveColumn(cell.col, columnPointer.matchedCol);
            columnPointer.matchedCol = null;            
            if (persistState) { 
              var colSequence = [];
              for (var i = 0; i < me.cells[0].length; i++) {
                colSequence.push(me.cells[0][i].columnId);
              }  
              saveState(colSequence, "colSequence");
            }
          }
        }
        if (me.designMode) {
          var itm = me.tableDiv.designItem;
          if (itm != null) {
            if (itm.moved) {

              var designer = itm.designer;
              if (designer.dropContainer != null) {
              
                designer.undo.clear();
                container = designer.dropContainer;
              
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
                me.doThisToTableDivs(function(domObj) {
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
              
              }
              
              else {            
              
                if (inLayoutContainer) {              
                  if (designer.proxyDiv.style.display == "") {
                    // move outside of container onto the main screen
                    designer.undo.clear(); 

                    var diffTop = parseInt(designer.proxyDiv.style.top) - parseInt(itm.dom.style.top);
                    var diffLeft = parseInt(designer.proxyDiv.style.left) - parseInt(itm.dom.style.left);              
                    me.doThisToTableDivs(function(domObj) {
                      domObj.parentNode.removeChild(domObj);
                      designer.container.appendChild(domObj);
                      domObj.style.top = (parseInt(domObj.style.top) + diffTop) + "px";
                      domObj.style.left = (parseInt(domObj.style.left) + diffLeft) + "px";
                    });                           
                    if (me.scrollbarObj != null) me.scrollbarObj.changeContainer(designer.container);
                    if (me.pagingBar != null) me.pagingBar.changeContainer(designer.container);
                    me.container = designer.container;
                    me.setScrollBar();
                    
                    itm.properties.top = designer.proxyDiv.style.top;
                    itm.properties.left = designer.proxyDiv.style.left;                
                    designer.proxyDiv.style.display = "none";               
                    designer.selection.clear();
                    designer.selection.add(itm);
                    designer.addSelectionToTabs();
                    pui.ide.refreshElementList();                  
                  }
                }
                designer.addSelectionToTabs();
                me.doExpandToLayout();
                if (context == "dspf") pui.ide.refreshRibbon();
              }

            }
            else {
              me.tableDiv.designItem.designer.undo.removeLastGroup();
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
      addEvent(document, "mouseup",   mouseup);
      preventEvent(event);
      if (me.designMode && me.tableDiv.designItem != null) {
        me.tableDiv.designItem.moved = false;
        var designer = me.tableDiv.designItem.designer;
        var selection = designer.selection;
        var undoText = "Move Selection";
        if (selection.resizers.length == 1) undoText = "Move Grid";
        designer.undo.start(undoText);
        designer.undo.noRefresh = true;
        selection.addToUndo(["left", "top", "parent tab panel", "parent tab panel"]);
        designer.undo.noRefresh = false;
      }      
    }
    addEvent(cell, "mousedown", mousedown);
  }
  
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
    if (me.borderWidth < minBWidth) {
      line.style.borderWidth = "2px";
      if (!isVertical) line.style.width = (parseInt(line.style.width) + 2 - me.borderWidth) + "px";
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
          if (addHeight < -me.rowHeight + 5) addHeight = -me.rowHeight + 5
          if (typeof me.scrollbarObj.increaseHeight == "function") me.scrollbarObj.increaseHeight(addHeight);
        }
        if (me.designMode) {
          psBar.set(me.tableDiv.designItem);
        }
        else {
          me.alignColumnTotals();
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
        if (bwidth < minBWidth) bwidth = minBWidth;
        line.style.borderWidth = bwidth + "px"; 
        line.style.borderColor = me.borderColor; 
        if (!isVertical) line.style.borderTopStyle = designBorderStyle;
        if (isVertical) line.style.borderRightStyle = designBorderStyle;
        if (!isVertical && i == lines.length - 1 && (i >= 2 || (me.hasHeader && i == 1))) {
          var tableBottom = parseInt(line.style.top);
          var minRow = me.hasHeader ? 2 : 1;
          if (me.cells.length > minRow) {
            me.removeRow();
            if (tableBottom > parseInt(lines[lines.length-1].style.top) + me.rowHeight - 3) {
              var addedSome = false;
              while (parseInt(lines[lines.length-1].style.top) < tableBottom) {
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
          me.alignColumnTotals();
          if (isVertical && persistState) {
            var colWidths = new Array(me.cells[0].length);
            for (var j = 0; j < me.cells[0].length; j++) {
              var cell = me.cells[0][j];
              colWidths[cell.columnId] = cell.clientWidth;
            }
            saveState(colWidths, "colWidths");
          }
        }
        removeEvent(document, "mousemove", mousemove);
        removeEvent(document, "mouseup", mouseup);
      }
      addEvent(document, "mousemove", mousemove);
      addEvent(document, "mouseup",   mouseup);  
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
    addEvent(line, "mouseover", function() { 
      if (!me.dragging) {
        var bwidth = 3;
        if (me.borderWidth > 3) bwidth = me.borderWidth;
        line.style.borderWidth = bwidth + "px"; 
        line.style.borderColor = "#333333"; 
        if (!isVertical) line.style.borderTopStyle = "solid";
        if (isVertical) line.style.borderRightStyle = "solid";
      }
    });
    addEvent(line, "mouseout", function() { 
      if (!line.dragging) {
        var bwidth = me.borderWidth;
        if (bwidth < minBWidth) bwidth = minBWidth;
        line.style.borderWidth = bwidth + "px"; 
        line.style.borderColor = me.borderColor; 
        if (!isVertical) line.style.borderTopStyle = designBorderStyle;
        if (isVertical) line.style.borderRightStyle = designBorderStyle;
      }
    });  
  }
  
  function doResize(x, y, lineIndex, isVertical, startTop, startLeft) {
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
      if (i > 0 && left < parseInt(lines[i-1].style.left) + 5) {
        left = parseInt(lines[i-1].style.left) + 5; 
      }
      if (i < lines.length - 1 && left > parseInt(lines[i+1].style.left) - 5) {
        left = parseInt(lines[i+1].style.left) - 5; 
      }
    }
    if (!isVertical) {
      if (i > 0 && top < parseInt(lines[i-1].style.top) + 5) {
        top = parseInt(lines[i-1].style.top) + 5;
      }
      if (i < lines.length - 1 && top > parseInt(lines[i+1].style.top) - 6) {
        top = parseInt(lines[i+1].style.top) - 6; 
      }
    }
    if (!isVertical) line.style.top  = top + "px";
    if (isVertical) line.style.left = left + "px";
    if (!isVertical && (i != 0 || !me.hasHeader) && i != lines.length - 1) {
      if (i < lines.length - 1) me.rowHeight = parseInt(lines[i+1].style.top) - parseInt(lines[i].style.top);
      else me.rowHeight = parseInt(lines[i].style.top) - parseInt(lines[i-1].style.top);
      var curTop = top;
      for (j = i + 1; j < lines.length; j++) {
        curTop += me.rowHeight;
        lines[j].style.top = curTop + "px";
      }
      curTop = top;
      var downto = 0;
      if (me.hasHeader) downto = 1;
      for (j = i - 1; j >= downto; j = j - 1) {
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
      me.rowHeight = parseInt(lines[i].style.top) - parseInt(lines[i-1].style.top);
    }
    if (i == 0 && isVertical) {
      me.tableDiv.style.left = left + "px";
      setLineLefts();
    }
    if (isVertical && (lines.length - 1 == i || i == 0)) {
      if (isVertical) setLineWidths();
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
      if (bwidth < minBWidth && me.designMode) bwidth = minBWidth;
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
    //content.style.height = height + "px";
    content.style.marginTop = (-parseInt(height / 2)) + "px";
    var width = parseInt(cell.style.width);
    if (isNaN(width)) width = 0;
    width = width - 8;  // account for some padding (4 pixels on each side)
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
    
    cell.onmouseover = function() {
      if (me.dragging) return;
      if (!me.hasHeader) executeEvent("onrowmouseover", row + 1);
      if (me.hasHeader && row != 0) executeEvent("onrowmouseover", row);
      if (!me.hoverEffect) return;
      if (pui.touchDevice || pui.iPadEmulation) return;
      var header = (row == 0 && me.hasHeader);
      if (header) return;
      var cols = me.cells[row];
      
      me.setRowBackground(row, true);

      if (me.singleRowZoom && !me.expanded && (row > 0 || !me.hasHeader)) {      
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
        me.zoomIcon.onclick = function(e) {
          me["rowZoom"](me.cells[row]);
          preventEvent(e);
        }

      }
    }

    cell.onmouseout = function() {
      if (!me.hasHeader) executeEvent("onrowmouseout", row + 1);
      if (me.hasHeader && row != 0) executeEvent("onrowmouseout", row);
      var header = (row == 0 && me.hasHeader);
      if (header) return;      
      me.setRowBackground(row);
    }
    
    cell.onmousedown = function(event) {
      // Handle context menu
      if (pui.isRightClick(event)) {
        if (me.designMode) return;
        function stopContextMenu(event) {
          if (!event) event = window.event;
          if (event.preventDefault) event.preventDefault();
          if (event.stopPropagation) event.stopPropagation();
          event.cancelBubble = true;
          event.returnValue = false;        
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
        var contextMenuId = me.contextMenuId;
        if (contextMenuId == null) contextMenuId = "";
        contextMenuId = trim(contextMenuId);
        if (contextMenuId == "") return;
        var contextMenu = getObj(contextMenuId);
        if (contextMenu == null) return;
        
        // disable browser's context menu
        document.body.oncontextmenu = stopContextMenu;
        
        // select row
        cell.onclick(event);
        
        // show custom context menu
        var x = pui.getMouseX(event);
        var y = pui.getMouseY(event);
        var parent = contextMenu.parentNode;
        if (parent != null && parent.tagName == "FORM") parent = parent.parentNode;  // this will handle Genie (although the the context menu option is not available in Genie yet)
        if (parent != null) {
        
          var offset = {};
          if (context == "dspf" && parent.getAttribute("container") == "true") {
          
            offset = pui.layout.getContainerOffset(parent);
            offset.x += pui.runtimeContainer.offsetLeft;
            offset.y += pui.runtimeContainer.offsetTop;
            
          }
          else {
          
            offset.x = parent.offsetLeft;
            offset.y = parent.offsetTop;
            
          }        
        
          x -= offset.x;
          y -= offset.y;
          
        }  
        contextMenu.style.zIndex = me.contextMenuZIndex;
        contextMenu.style.visibility = "";
        contextMenu.style.display = "";
        // Position after show, as some browsers (FF) report menu width 0 when hidden.
        var maxX = document.documentElement.clientWidth - contextMenu.clientWidth - 10;  // width of menu plus scrollbar
        var maxY = document.documentElement.clientHeight - contextMenu.clientHeight - 10; // height of menu plus scrollbar
        if (x > maxX) x = maxX; 
        if (y > maxY) y = maxY;     
        contextMenu.style.left = x + "px";
        contextMenu.style.top = y + "px";        
        
        addEvent(document, "click", function() {
          contextMenu.style.visibility = "hidden";
          contextMenu.style.display = "none";
        });
        
        preventEvent(event);
        if (event != null && event.stopPropagation != null) event.stopPropagation();      
        return false;
      }
    }
    
    cell.onclick = function(e) {      
      var target = getTarget(e);
      var isRight = pui.isRightClick(e);
      if (target.tagName != "INPUT" && target.tagName != "SELECT" && target.tagName != "OPTION") {
        if (!me.hasHeader) executeEvent("onrowclick", row + 1, isRight);
        if (me.hasHeader && row != 0) executeEvent("onrowclick", row, isRight);
      }
      if (context == "dspf" && !me.designMode) {
      
        me.setCursorRRN(row);
        
        if (me.selectionEnabled && target.tagName != "INPUT" && target.tagName != "SELECT" && (row > 0 || !me.hasHeader)) {
          if (me.recNum != null && !isNaN(me.recNum) && me.recNum > 0) {
          
            if (!e) e = window.event;
          
            if (me.singleSelection || (me.extendedSelection && !e.ctrlKey && !e.shiftKey)) {
              var numRows = me.hLines.length - 1;
              for (var i = 0; i < me.dataArray.length; i++) {
                var curRow = i - me.recNum + 1 + (me.hasHeader ? 1 : 0);                
                if ((!e.ctrlKey) || (curRow != row)) {  // this condition allows the user to unselect a record using the ctrl key
                  if (me.dataArray[i].selected == true) {
                    pui.modified = true;
                    me.dataArray[i].selected = false;
                    if (me.selectionField != null && me.dataArray[i].selection != null) {
                      me.dataArray[i].selection.modified = true;
                      me.dataArray[i].selection.value = (me.selectionField.dataType == "indicator" ? "0" : " ");
                    }
                  }
                }
                if ((curRow >= 0 && !me.hasHeader) || curRow >= 1) {
                  if (curRow < numRows) {
                    me.setRowBackground(curRow);
                  }
                }
              }
            }
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
              for (var i = 0; i < me.dataArray.length; i++) {

                var curRow = i - me.recNum + 1;
                if (i+1 >= fromRecordNum && i+1 <= toRecordNum) {
                  if (me.dataArray[i].selected != true) {
                    pui.modified = true;
                    me.dataArray[i].selected = true;
                    if (me.selectionField != null) {
                      if (me.dataArray[i].selection == null) {
                        me.dataArray[i].selection = {
                          type: "grid selection",
                          subfileRow: i + 1,
                          formattingInfo: me.selectionField
                        }
                        var qualField = pui.formatUpper(me.recordFormatName) + "." + pui.fieldUpper(me.selectionField.fieldName) +  "." + (i + 1);
                        if (pui.responseElements[qualField] == null) {
                          pui.responseElements[qualField] = [];
                          pui.responseElements[qualField].push(me.dataArray[i].selection);
                        }
                      }                    
                      me.dataArray[i].selection.modified = true;
                      me.dataArray[i].selection.value = me.selectionValue;
                    }
                  }
                }
                else {
                  if (me.dataArray[i].selected == true) {
                    pui.modified = true;
                    me.dataArray[i].selected = false;
                    if (me.selectionField != null) {
                      if (me.dataArray[i].selection == null) {
                        me.dataArray[i].selection = {
                          type: "grid selection",
                          subfileRow: i + 1,
                          formattingInfo: me.selectionField
                        }
                        var qualField = pui.formatUpper(me.recordFormatName) + "." + pui.fieldUpper(me.selectionField.fieldName) +  "." + (i + 1);
                        if (pui.responseElements[qualField] == null) {
                          pui.responseElements[qualField] = [];
                          pui.responseElements[qualField].push(me.dataArray[i].selection);
                        }
                      }
                      me.dataArray[i].selection.modified = true;
                      me.dataArray[i].selection.value = (me.selectionField.dataType == "indicator" ? "0" : " ");
                    }
                  }
                }
                if ((curRow >= 0 && !me.hasHeader) || curRow >= 1) {
                  if (curRow < numRows) {
                    me.setRowBackground(curRow);
                  }
                }
              }
            }
            else if (me.dataArray[adjustedRow - 1] != null && me.dataArray[adjustedRow - 1].length > 0) {
              if (me.dataArray[adjustedRow - 1].selected == true) me.dataArray[adjustedRow - 1].selected = false;
              else me.dataArray[adjustedRow - 1].selected = true;
              if (me.selectionField != null && me.dataArray[adjustedRow - 1] != null && me.dataArray[adjustedRow - 1].selection != null) {
                me.dataArray[adjustedRow - 1].selection.modified = true;
                if (me.dataArray[adjustedRow - 1].selected) {
                  me.dataArray[adjustedRow - 1].selection.value = me.selectionValue;
                }
                else {
                  me.dataArray[adjustedRow - 1].selection.value = (me.selectionField.dataType == "indicator" ? "0" : " ");
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
              var dom = getObj(itm["id"] + "." + recNum);
              if (dom != null) {
                pui.returnCursor(e, dom);
                break;
              }
            }
          }
        }
        
        // position cursor to an input element in the first column, if it's there
        // Don't do this when text selection flag is set, as the browser removes text selection
        // when a box receives focus.
        if (typeof(pui["grid text selection"]) == "undefined" || pui["grid text selection"] == false) {
          if (target.tagName != "INPUT" && target.tagName != "SELECT" && target.tagName != "TEXTAREA") {
            // position to input box in first column, if it is present
            var cell = me.cells[row][0];
            placeCursorOnCell(cell);
          }
        }
      }
    }
    
    cell.ondblclick = function() {
      if (me.designMode) {
        if (me.hasHeader && row == 0) {
          var itm = me.tableDiv.designItem;
          if (!pui.isBound(itm.properties["column headings"]) && !pui.isTranslated(itm.properties["column headings"])) {
            itm.designer.inlineEditBox.onUpdate = function(newHeading) {
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
            }
            itm.designer.inlineEditBox.onStyleUpdate = function(propName, styleName, styleValue) {
              var styleValues = "";
              for (var col = 0; col < me.cells[0].length; col++) {                
                var cellStyleValue = me.cells[0][col].style[styleName];
                if (cellStyleValue == null) cellStyleValue = "";
                if (propName.indexOf("color") >= 0) {
                  cellStyleValue = designUtils.normalizeColor(cellStyleValue);
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
            }
            itm.designer.inlineEditBox.show(itm, cell, "grid");
          }
        }
      }
      else {      
        if (!me.hasHeader) executeEvent("onrowdblclick", row + 1);
        if (me.hasHeader && row != 0) executeEvent("onrowdblclick", row);
      }
    }
    
    //cell.innerHTML = "content";
    if (!me.cells[row]) me.cells[row] = new Array();
    cell.row = row;
    cell.col = col;
    me.cells[row][col] = cell;
    if (me.designMode) sizeCell(row, col);    
    return cell;
  }

  function placeCursorOnRow(row) {
    for (var i = 0; i < row.length; i++) {
      var cell = row[i];
      var success = placeCursorOnCell(cell);
      if (success) return;
    }
  }

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
    try {
      inputBox.focus();
      if (inputBox.createTextRange != null) {
        // for IE, this makes the cursor appear - workaround for IE8 bug where the cursor just doesn't show
        if (inputBox.select != null) inputBox.select();
        var tr = inputBox.createTextRange();
        if (tr != null && tr.collapse !=  null && tr.select != null) {
          tr.collapse();
          tr.select();
        }
      }
      if (pui["highlight on focus"]) inputBox.select();
    }
    catch (e) {
    }
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
    setCellStyle(cell, col, "color", header ? "header font color" : even ? "even row font color" : "odd row font color");
    setCellStyle(cell, col, "backgroundColor", header ? "header background" : even ? "even row background" : "odd row background");
    var cssClass = "";
    if (header) {
      var headerImage = me.cellProps["header image"];
      if (headerImage != null && headerImage != "") {
        cell.style.backgroundImage = "url('" + headerImage + "')";
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
  
  this.setAllCellStyles = function() {
    for (var row = 0; row < me.cells.length; row++) {
      for (var col = 0; col < me.cells[row].length; col++) {
        var cell = me.cells[row][col];
        var header = (row == 0 && me.hasHeader);
        var even = ((row % 2) == 1);
        if (me.hasHeader) even = !even;        
        setCellStyles(cell, header, even, col)
      }
    }  
  }  

  function sizeCell(row, col) {    
    var rowObj = me.cells[row];
    var last = false;
    if (me.vLines.length - 2 == col) last = true;
    if (row == 0 && me.hasHeader) last = false;
    var cell = rowObj[col];
    cell.style.top = (parseInt(me.hLines[row].style.top) - me.getStyleAsInt("top")) + "px";
    cell.style.left = (parseInt(me.vLines[col].style.left) - me.getStyleAsInt("left")) + "px";
    cell.style.height = (parseInt(me.hLines[row+1].style.top) - parseInt(me.hLines[row].style.top)) + "px";
    var width = (parseInt(me.vLines[col+1].style.left) - parseInt(me.vLines[col].style.left));
    if (last && (me.pagingScrollBar || me.slidingScrollBar)) {
      if (!(pui.touchDevice || pui.iPadEmulation)) {
        width = width - 16;  // reduce by scrollbar width
      }
    }
    if (width < 0) width = 0;
    cell.style.width = width + "px";
  }
  
  // run sql on the server and return result set
  // parms:
  //   sql statement -- used only in backwards compat. security mode.
  //   max number of records to return - defaults to 99
  //   starting record (allows for paging) - defaults to 1
  //   callback function
  //   optional total flag -- when true the server will return total record count on response object.  
  //   optional custom url to process the request (overrides the standard process)
  function runSQL(sql, limit, start, callback, total, customURL, cache) {
    if (limit == null) limit = 99;
    if (start == null) start = 1;
    if (cache) {
      if (pui.sqlcache == null) pui.sqlcache = {};
      if (pui.sqlcache[start] == null) pui.sqlcache[start] = {};
      if (pui.sqlcache[start].sql === sql &&
          pui.sqlcache[start].pstring === pstring &&
          pui.sqlcache[start].limit === limit &&
          pui.sqlcache[start].customURL === customURL) {
    		if (callback != null) {
    		  callback(pui.sqlcache[start].results, pui.sqlcache[start].totalRecs);
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
      
      var pstring = pui.getSQLParams(me.dataProps);
      if (pstring != "") {
      
        req["postData"] += "&" + pstring;
      
      }       
    
    }
    else {
    
      req["postData"] += "&q=" + pui.aes.encryptString(sql);
    
    } 
    req["postData"] += "&limit=" + limit + "&start=" + start;
    if (total != null && total == true) req["postData"] += "&getTotal=1";
    req["onready"] = function(req) { 	
      var response = checkAjaxResponse(req, "Run SQL SELECT Query");
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
        }  
        if (callback != null) callback(response.results, response.totalRecs);
        else returnVal = response.results;
      }
    }
    req.send();  
    if (callback == null) return returnVal;
  }  
  
  this.sizeAllCells = function() {
    for (var row = 0; row < me.cells.length; row++) {
      for (var col = 0; col < me.cells[row].length; col++) {
        sizeCell(row, col);
      }
    }
    if (columnSignature == null) {
      columnSignature = me.getColumnWidths();
    }
  }

  this.isDataGrid = function() {
    if ((me.dataProps["custom sql"] != null && me.dataProps["custom sql"] != "") ||
        (me.dataProps["data url"] != null && me.dataProps["data url"] != "") ||
        (me.dataProps["database file"] != null && me.dataProps["database file"] != "")) {
      return true;
    }
    else {
      return false;
    }  
  }
  
  this.setBorderColor = function(borderColor) {
    if (!borderColor) borderColor = me.borderColor;
    for (var i = 0; i < me.vLines.length; i++) {
      me.vLines[i].style.borderRightColor = borderColor;
    }
    for (var i = 0; i < me.hLines.length; i++) {
      me.hLines[i].style.borderTopColor = borderColor;
    }
    me.borderColor = borderColor;
  }

  this.setBorderWidth = function(borderWidth) {
    if (!borderWidth) borderWidth = me.borderWidth;
    borderWidth = parseInt(borderWidth);
    if (borderWidth < minBWidth && me.designMode) borderWidth = minBWidth;
    for (var i = 0; i < me.vLines.length; i++) {
      me.vLines[i].style.borderRightWidth = borderWidth;
    }
    for (var i = 0; i < me.hLines.length; i++) {
      me.hLines[i].style.borderTopWidth = borderWidth;
    }
    me.borderWidth = borderWidth;
    setLineWidths();
    me.setScrollBar();
  }
  
  this.hide = function() {
    me.doThisToTableDivs(function(domObj) {
      domObj.style.visibility = "hidden";
    });
    if (me.scrollbarObj != null) me.scrollbarObj.hide();  
    if (me.pagingBar != null) me.pagingBar.hide();
  }
  
  this.hideSubfile = function() {
    me.subfileHidden = true;
    if (!me.hasHeader) {
      me.hide();
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
  }

  this.show = function() {
    me.doThisToTableDivs(function(domObj) {
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
  }

  this.addColumn = function() {
    var n = me.vLines.length;
    var vLine = document.createElement("div");
    vLine.className = "grid-vline";
    if (!me.designMode) {
      vLine.relatedGrid = me;
    }
    vLine.style.position = "absolute";
    var x = parseInt(me.tableDiv.style.left);
    if (n > 0) {
      x = parseInt(me.vLines[n-1].style.left) + me.defaultColumnWidth;
    }
    vLine.style.left = x + "px";
    vLine.style.top = me.tableDiv.style.top;
    var height = 0;
    if (me.hLines.length > 0) {
      height = parseInt(me.hLines[me.hLines.length - 1].style.top) - parseInt(me.tableDiv.style.top);
    }
    vLine.style.height = height + "px";
    var bwidth = me.borderWidth;
    if (bwidth < minBWidth && me.designMode) bwidth = minBWidth;
    vLine.style.borderRightStyle = "solid";
    vLine.style.borderRightWidth = bwidth + "px";
    vLine.style.borderRightColor = me.borderColor;
    vLine.style.fontSize = "0px";
    vLine.style.padding = "0px";
    vLine.style.zIndex = me.vBorderZIndex;
    me.container.appendChild(vLine);
    me.vLines[n] = vLine;
    setLineWidths();
    lineDesign(me.vLines, n, true);
    if (n > 0) {
      var columnId = n - 1;
      for (var row = 1; row < me.hLines.length; row++) {
        var cell = makeCell(row-1, columnId);
        cell.columnId = columnId;
        cellDesign(cell);
      }
    }
    positionIcons();
    me.setScrollBar();
  }
  
  this["removeColumn"] = function(colIndex) {
    me.moveColumn(colIndex, me.cells[0].length);  // move column to end
    me.removeLastColumn();
  }
  
  this.removeLastColumn = function() {
    n = me.vLines.length;
    if (n <= 0) return;
    n = n - 1;
    me.vLines[n].parentNode.removeChild(me.vLines[n]);
    me.vLines[n] = null;
    me.vLines.splice(n, 1);
    if (n > 0) {
      for (var row = 0; row < me.cells.length; row++) {
        me.cells[row][n-1].parentNode.removeChild(me.cells[row][n-1]);
        me.cells[row][n-1] = null;
        me.cells[row].splice(n-1, 1);
      }
    }
    setLineWidths();
    positionIcons();
    me.setScrollBar();
  }
  
  this.moveColumn = function(from, to) {
    for (var row = 0; row < me.cells.length; row++) {
      var cell = me.cells[row][from];
      me.cells[row].splice(to, 0, cell);  // insert a copy of the cell into the to position
      var adjustedFrom = from;
      if (to <= from) adjustedFrom++;  // from has moved - we inserted something infront of it 
      me.cells[row].splice(adjustedFrom, 1);  // remove the from cell
      // adjust col numbers on cells
      for (var col = 0; col < me.cells[row].length; col++) {
        cell = me.cells[row][col];
        cell.col = col;
      }
    }
    // adjust vertical lines
    for (var i = 1; i < me.vLines.length - 1; i++) {
      me.vLines[i].style.left = (parseInt(me.vLines[i-1].style.left) + parseInt(me.cells[0][i-1].style.width)) + "px";
    }
    if (me.designMode) {
      // adjust grid properties
      var changed = false; 
      var itm = me.tableDiv.designItem;
      function movePropertyParts(propName) {
        var value = itm.properties[propName];
        if (value == null || value == "" || pui.isBound(value) || pui.isTranslated(value)) return;
        arr = value.split(",");
        if (arr.length == 1 && propName != "column headings" && propName != "column widths") {
          // One value is applicable to all columns
          return;
        }
        var numCols = me.cells[0].length;
        while (arr.length > numCols) {
          arr.pop();
        }
        while (arr.length < numCols) {
          arr.push("");
        }
        arr.splice(to, 0, arr[from]);  // copy
        var adjustedFrom = from;
        if (to <= from) adjustedFrom++;  // from has moved - we inserted something infront of it 
        arr.splice(adjustedFrom, 1);  // remove the from entry
        var newValue = arr.join(",");        
        if (value != newValue) {
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
      if (columnHeadings == null) columnHeadings = "";
      me.columnHeadings = columnHeadings.split(",");
      movePropertyParts("odd row font color");
      movePropertyParts("odd row background");
      movePropertyParts("even row font color");
      movePropertyParts("even row background");
      movePropertyParts("column widths");
      if (changed) {
        itm.designer.makeDirty();
        itm.designer.propWindow.refresh();
      }
    }
    me.sizeAllCells();
    if (!me.designMode) {
      if (me.isDataGrid()) {
        var fields = me.dataProps["database fields"];
        if (fields != null && fields != "") {
          fields = fields.split(",");
          fields.splice(to, 0, fields[from]);  // insert from field into the to position
          var adjustedFrom = from;
          if (to <= from) adjustedFrom++;  // from has moved - we inserted something infront of it 
          fields.splice(adjustedFrom, 1);  // remove the from cell
          me.dataProps["database fields"] = fields.join(",");
        }        
      }
      else {
        for (var i = 0; i < me.runtimeChildren.length; i++) {
          var itm = me.runtimeChildren[i];
          var col = Number(itm["column"]);
          var newCol = col;
          if (to > from) {
            if (col > from && col < to) newCol = newCol - 1;
            if (col == from) newCol = to - 1;
          } 
          if (from > to) {
            if (col >= to && col < from) newCol = newCol + 1;
            if (col == from) newCol = to;
          }
          if (col != newCol) itm["column"] = String(newCol);
        }
      }
      
      me.columnHeadings.splice(to, 0, me.columnHeadings[from]);  // insert from column heading into the to position
      var adjustedFrom = from;
      if (to <= from) adjustedFrom++;  // from has moved - we inserted something infront of it 
      me.columnHeadings.splice(adjustedFrom, 1);  // remove the from cell

      me.alignColumnTotals();
    }
  }
  
  this.addRow = function() {
    var n = me.hLines.length;
    var hLine = document.createElement("div");
    hLine.className = "grid-hline";
    if (!me.designMode) {
      hLine.relatedGrid = me;
    }
    hLine.style.position = "absolute";
    hLine.style.left = me.tableDiv.style.left;
    var y = parseInt(me.tableDiv.style.top);
    if (n > 0) {
      var height = me.rowHeight;
      if (n == 1 && me.hasHeader) height = me.headerHeight;
      y = parseInt(me.hLines[n-1].style.top) + height;
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
    hLine.style.borderTopStyle = "solid";
    hLine.style.borderTopWidth = bwidth + "px";
    hLine.style.borderTopColor = me.borderColor;
    hLine.style.fontSize = "0px";
    hLine.style.padding = "0px";
    hLine.style.zIndex = me.hBorderZIndex;
    if (me.tableDiv.style.visibility == "hidden") hLine.style.visibility = "hidden";
    me.container.appendChild(hLine);
    me.hLines[n] = hLine;
    setLineHeights();
    lineDesign(me.hLines, n, false);
    if (n > 0) {
      for (var col = 1; col < me.vLines.length; col++) {
        var columnId = col - 1;
        var cell = makeCell(n-1, columnId); 
        cell.columnId = columnId;
        cellDesign(cell);
      }
    }
    positionIcons();
    me.setScrollBar();
  }

  this.removeRow = function() {
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
  }

  this.alignColumnTotals = function() {
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
  }
  
  this["setNumberOfRows"] = function(numRows) {
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
  }
  
  this["render"] = function() {
    me.sizeAllCells();
    me.setAllCellStyles();
    me.setHeadings();
    if (me.subfileHidden) {
    
      me.hideSubfile();
    
    }
  }
  
  this["refresh"] = function() {
    me.recNum = 1;
    me.totalRecs = null;
    if (me.slidingScrollBar) {
      me.scrollbarObj.totalRows = me.totalRecs;
    }  
    me.getData();    
  }
  
  this.getPropertiesModel = function() {
    var model = [
      { name: "Identification", category: true },
      { name: "id", maxLength: 75, attribute: "id", help: "Sets the ID of the grid.", bind: false, canBeRemoved: false },
      { name: "record format name", help: "Identifies the record format that is used to access this grid from server code.", maxLength: (pui.viewdesigner ? null : 10), bind: false, context: "dspf", canBeRemoved: false },
      { name: "description", help: "Describes the record format.", bind: false, context: "dspf" },
      { name: "parent window", attribute: "parentWindow", help: "Sets the window that this field belongs to.", context: "genie" },
      { name: "screen identifier", choices: ["true", "false"], blankChoice: false, help: "If set to true, this element will be used to detect the screen.  The identifier element should be a static output field that is unique to this screen.  For example, if the screen has a unique heading, it can be used as the identifier.  At least one element on the screen must be marked as an identifier before you can save the screen.  When appropriate, you can use a combination of several elements to uniquely identify the screen.", context: "genie" },
      { name: "field type", choices: ["grid"], blankChoice: false, help: "Determines the type of control that is used to render the element.", bind: false, canBeRemoved: false },
      { name: "value", help: "Sets the initialization value for the current element." },
      
      { name: "Subfile Settings", category: true, context: "dspf" },
      { name: "display subfile", choices: ["true", "false"], hideFormatting: true, validDataTypes: ["indicator", "expression"], help: "This property tells the system when to display grid records.  It represents the SFLDSP keyword.", context: "dspf", viewdesigner: false },
      { name: "display control record", choices: ["true", "false"], hideFormatting: true, validDataTypes: ["indicator", "expression"], help: "This property tells the system when to display the subfile control record.  It represents the SFLDSPCTL keyword.", context: "dspf", viewdesigner: false },
      { name: "initialize subfile", choices: ["true", "false"], hideFormatting: true, validDataTypes: ["indicator", "expression"], help: "This property tells the system to initialize all records within the subfile.  It represents the SFLINZ keyword.", context: "dspf", viewdesigner: false },
      { name: "subfile records not active", choices: ["true", "false"], bind: false, help: "This property can be used together with the \"initialize subfile\" property to initialize a subfile with no active records.  It represents the SFLRNA keyword.", context: "dspf", viewdesigner: false },
      { name: "delete subfile", choices: ["true", "false"], hideFormatting: true, validDataTypes: ["indicator", "expression"], help: "This property tells the system when to delete the subfile area.  It represents the SFLDLT keyword.", context: "dspf", viewdesigner: false },
      { name: "clear subfile", choices: ["true", "false"], hideFormatting: true, validDataTypes: ["indicator", "expression"], help: "This property tells the system when to clear all records from the subfile.  It represents the SFLCLR keyword.", context: "dspf", viewdesigner: false },
      { name: "subfile size", format: "number", hideFormatting: true, validDataTypes: ["zoned"], help: "This property represents the SFLSIZ keyword, which specifies the number of records that can be placed into the subfile. However, if your program places a record with a relative record number larger than the SFLSIZ value into the subfile, the subfile is automatically extended to contain it (up to a maximum of 9999 records).  If this property is not specified, the subfile page value plus one is used.  The subfile page value is determined from the \"number of rows\" property minus the header row if it is present.", context: "dspf", viewdesigner: false },
      { name: "subfile record number", format: "number", hideFormatting: true, validDataTypes: ["zoned", "reference"], help: "This property identifies the scrollbar position when the subfile is first displayed." + (pui.viewdesigner ? "" : "  It represents the SFLRCDNBR keyword."), context: "dspf" },
      { name: "position at top", choices: ["true", "false"], bind: false, help: "When this property is set to true, the subfile record identified by the \"subfile record number\" property will display in the top row of the grid." + (pui.viewdesigner ? "" : "  This property is equivalent to the SFLRCDNBR(*TOP) keyword."), context: "dspf" },
      { name: "place cursor", choices: ["true", "false"], bind: false, help: "When this property is set to true, the cursor is placed in the subfile record identified by the contents of the \"subfile record number\" property. The cursor is positioned at the first input-capable field in the subfile record." + (pui.viewdesigner ? "" : "  This property is equivalent to the SFLRCDNBR(CURSOR) keyword."), context: "dspf" },
      { name: "subfile end", choices: ["true", "false"], hideFormatting: true, validDataTypes: ["indicator", "expression"], help: "This property is used to indicate that a subfile with a paging bar has loaded all of its records." + (pui.viewdesigner ? "" : "  It represents the SFLEND keyword."), context: "dspf" },
      { name: "subfile next changed", choices: ["true", "false"], hideFormatting: true, validDataTypes: ["indicator", "expression"], help: "This property represents the SFLNXTCHG keyword, which forces the user to correct program-detected typing errors in subfile records.  The program can cause a record to be changed so that a get-next-changed operation must read the record again.", context: "dspf", viewdesigner: false },
      { name: "cursor record number", readOnly: true, format: "number", hideFormatting: true, validDataTypes: ["zoned"], help: "This property can be bound to a numeric field, which will return the relative record number of the record on which the cursor is located." + (pui.viewdesigner ? "" : "  It represents the SFLCSRRRN keyword."), context: "dspf" },
      { name: "cursor progression", choices: ["left to right", "top to bottom"], help: "This property determines the tab order for input elements within the subfile." + (pui.viewdesigner ? "" : "  It represents the SFLCSRPRG keyword."), context: "dspf" },
      { name: "subfile return rrn", readOnly: true, format: "number", hideFormatting: true, validDataTypes: ["zoned", "reference"], help: "This property can be bound to a numeric field, which will return the relative record number of the top visible record within a grid." + (pui.viewdesigner ? "" : "  It represents the SFLSCROLL keyword."), context: "dspf" },
      { name: "subfile changed", format: "1 / 0", readOnly: true, hideFormatting: true, validDataTypes: ["indicator"], help: "Specifies a response indicator that is set on if the input data within the subfile is modified.", context: "dspf" },
      
      { name: "Message Subfile Settings", category: true, context: "dspf", viewdesigner: false },
      { name: "subfile message key", readOnly: true, hideFormatting: true, validDataTypes: ["char"], defaultDataLength: 4, help: "This property specifies a field that is used to select messages from a program message queue for display.  Your program places a message reference key in this field. The property represents the SFLMSGKEY keyword on a subfile record format.", context: "dspf", viewdesigner: false },
      { name: "subfile program message queue", readOnly: true, hideFormatting: true, validDataTypes: ["char"], help: "This property specifies a field that contains the name of the program message queue used to build a message subfile.  It represents the SFLPGMQ keyword on a subfile record format.", context: "dspf", viewdesigner: false },
      { name: "subfile control program message queue", readOnly: true, hideFormatting: true, validDataTypes: ["char"], help: "This property specifies a field that contains the name of the program message queue used to build a message subfile when used in conjunction with the <i>subfile initialize</i> property.  It represents the SFLPGMQ keyword on a subfile control record format.", context: "dspf", viewdesigner: false },
      
      { name: "Font and Text", category: true },
      { name: "font family", choices: ["Arial", "Consolas", "Courier New", "Fantasy", "Georgia", "Monospace", "Tahoma", "Times New Roman", "Sans-Serif", "Serif", "Trebuchet MS", "Verdana", "Other..."],help: "The font face for the text inside the grid.  To define a different font for each grid column, select <i>Other...</i> and specify a comma separated list of fonts."},
      { name: "font size", format: "px", choices: ["8px", "9px", "10px", "11px", "12px", "13px", "14px", "15px", "16px", "17px", "18px", "19px", "20px", "21px", "22px", "23px", "24px", "25px", "26px", "27px", "28px", "29px", "30px", "Other..."],help: "The size of the text inside the grid.  To specify a different font size for each grid column, select <i>Other...</i> and specify a comma separated list of font sizes."},
      { name: "font style", format: "italic / normal", choices: ["normal", "italic", "oblique", "Other..."], help: "The style of the font in the grid.  To specify a different font style for each grid column, select <i>Other...</i> and specify a comma separated list of font styles."},
      { name: "font variant", choices: ["normal", "small-caps", "Other..."], help: "Normal or <span style='font-variant:small-caps;'>small caps</span>. Small caps shows the text with all caps but same height as a lower case letter."},
      { name: "font weight", format: "bold / normal", choices: ["normal", "bolder", "bold", "lighter", "100", "200", "300", "400", "500", "600", "700", "800", "900", "Other..." ],help: "Specifies the weight of the font inside the grid. To specify a different font weight for each grid column, select <i>Other...</i> and specify a comma separated list of font weights."},
      { name: "letter spacing", format: "px", choices: ["normal", "-3px", "-2px", "-1px", "0px", "1px", "2px", "3px", "4px", "5px", "6px", "7px", "8px", "9px", "10px", "11px", "12px", "13px", "14px", "15px", "16px", "17px", "18px", "19px", "20px", "Other..."],help: "Spacing between each letter of a word. To specify a different value for each grid column, select <i>Other...</i> and specify a comma separated list of values."},
      { name: "text align", choices: ["left", "right", "center", "justify", "Other..."], help: "Alignment of text inside cells of the grid element.  To specify a different alignment option for each grid column, select <i>Other...</i> and specify a comma separated list of values."},
      { name: "text decoration", format: "underline / none", choices: ["none", "underline", "overline", "line-through", "Other..."],help: "Decoration of the text inside the grid. To specify a different value for each grid column, select <i>Other...</i> and specify a comma separated list of values."},
      { name: "text transform", choices: ["capitalize", "uppercase", "lowercase", "none", "Other..."],help: "Transforms the default formatting of the text inside the grid. To specify a different value for each grid column, select <i>Other...</i> and specify a comma separated list of values."},
      { name: "word spacing", format: "px", choices: ["normal", "-3px", "-2px", "-1px", "0px", "1px", "2px", "3px", "4px", "5px", "6px", "7px", "8px", "9px", "10px", "11px", "12px", "13px", "14px", "15px", "16px", "17px", "18px", "19px", "20px", "21px", "22px", "23px", "24px", "25px", "Other..."],help: "Spacing between each word in the cells of the grid.  To specify a different value for each grid column, select <i>Other...</i> and specify a comma separated list of values."},
  
      { name: "Header", category: true },
      { name: "has header", choices: ["true", "false"], help: "Determines whether the grid has a header row." },
      { name: "header height", help: "Specifies the height of the header row.  This can also be specified by dragging the grid's top border with the mouse.", bind: false, canBeRemoved: false },
      { name: "header font family", choices: ["Arial", "Consolas", "Courier New", "Fantasy", "Georgia", "Monospace", "Tahoma", "Times New Roman", "Sans-Serif", "Serif", "Trebuchet MS", "Verdana", "Other..."],help: "The font face for the text inside the grid header row.  To define a different font for each grid column, select <i>Other...</i> and specify a comma separated list of fonts."},
      { name: "header font size", format: "px", choices: ["8px", "9px", "10px", "11px", "12px", "13px", "14px", "15px", "16px", "17px", "18px", "19px", "20px", "21px", "22px", "23px", "24px", "25px", "26px", "27px", "28px", "29px", "30px", "Other..."],help: "The size of the text inside the grid header row.  To specify a different font size for each grid column, select <i>Other...</i> and specify a comma separated list of font sizes."},
      { name: "header font style", format: "bold / normal", choices: ["normal", "italic", "oblique", "Other..."], help: "Specifies the style of the font inside the grid header row. To specify a different font style for each grid column, select <i>Other...</i> and specify a comma separated list of font styles." },
      { name: "header font weight", format: "italic / normal", choices: ["normal", "bolder", "bold", "lighter", "100", "200", "300", "400", "500", "600", "700", "800", "900", "Other..." ],help: "Specifies the weight of the font inside the grid header row. To specify a different font weight for each grid column, select <i>Other...</i> and specify a comma separated list of font weights."},      
      { name: "header text align", choices: ["left", "right", "center", "justify", "Other..."], help: "Alignment of text inside the cells of the grid header row.  To specify a different alignment option for each cell, select <i>Other...</i> and specify a comma separated list of values."},
      { name: "header font color", type: "color", help: "Defines the color of the text inside the header row.  To define a different color for each grid cell in the header row, specify a comma separated list of color values." },
      { name: "header background", type: "color", help: "Defines the background color of the header row.  To define a different color for each grid cell in the header row, specify a comma separated list of color values." },
      { name: "header image", type: "image", help: "Defines a repeating background image for the header row." },
      { name: "column headings", type: "list", help: "Specifies a comma separated list of heading text for each column of the grid.", translate: true },
  
      { name: "Colors", category: true },    
      { name: "odd row font color", type: "color", help: "Defines the color of text inside the odd rows of the grid.  To define a different color for each grid column, specify a comma separated list of color values." },
      { name: "odd row background", type: "color", help: "Defines the background color of the odd rows in the grid.  To define a different color for each grid column, specify a comma separated list of color values." },
      { name: "even row font color", type: "color", help: "Defines the color of text inside the even rows of the grid.  To define a different color for each grid column, specify a comma separated list of color values." },
      { name: "even row background", type: "color", help: "Defines the background color of the even rows in the grid.  To define a different color for each grid column, specify a comma separated list of color values." },
      { name: "hover font color", type: "color", help: "Defines the color of text when the user hovers the mouse cursor over a grid row.  To define a different color for each grid column, specify a comma separated list of color values." },
      { name: "hover background", type: "color", help: "Defines the background color of a grid row when the user hovers the mouse cursor over it.  To define a different color for each grid column, specify a comma separated list of color values." },
      { name: "selection font color", type: "color", help: "Defines the color of text when the user selects a grid row.", context: "dspf" },
      { name: "selection background", type: "color", help: "Defines the background color of a grid row when the user selects it.", context: "dspf" },
  
      { name: "Grid Settings", category: true },
      { name: "number of rows", help: "Specifies the number of rows in the grid, including the header row.", bind: false, canBeRemoved: false },
      { name: "number of columns", help: "Specifies the number of columns in the grid.", bind: false, canBeRemoved: false },      
      { name: "row height", help: "Specifies the height that will be applied to each row, not including the header row.  This can also be controlled by resizing the grid with the mouse.", bind: false, canBeRemoved: false },
      { name: "hover effect", choices: ["true", "false"], help: "Determines whether the grid rows will be highlighted when the user hovers the mouse over them." },
      { name: "hover image", type: "image", help: "Defines a repeating cell background image for the hover effect." },
      { name: "row selection", choices: ["none", "single", "multiple (simple)", "multiple (extended)"], help: "Determines if rows within the grid can be selected by the user with a click of the mouse.  <br/><br/>Possible values are: <br/><br/><b>none</b> - rows cannot be selected <br/><br/><b>single</b> - only one row can be selected <br/><br/><b>multiple (simple)</b> - multiple rows can be selected by simply clicking on the rows <br/><br/><b>multiple (extended)</b> - multiple rows can be selected with the use of the Shift and Ctrl keys", context: "dspf" },
      { name: "selection field", format: "1 / 0", readOnly: true, hideFormatting: true, validDataTypes: ["char", "indicator"], defaultDataLength: 1, help: "This property must be bound to an indicator or a character field, which will be used to both set and return the selected state on each record.  If a character field is specified, the selection value property will be used to populate the field when a row is selected.", context: "dspf" },      
      { name: "selection value", help: "Specifies the value used to populate the selection field when a grid row is selected.", bind: false, context: "dspf" },      
      { name: "selection image", type: "image", help: "Defines a repeating cell background image for row selection.", context: "dspf" },
      { name: "column widths", type: "list", help: "Specifies a comma separated list of column widths for this grid.", bind: false, canBeRemoved: false },
      { name: "scrollbar", choices: context == "genie" ? ["true", "false"] : ["none", "sliding", "paging"], help: context == "genie" ? "Determines whether a vertical scrollbar for paging through data records will appear within the grid.  If the grid is not a database-driven grid, the scrollbar will automatically send the PageUp/PageDown keys to the underlying application." : "Determines the type of vertical scrollbar used to scroll through records within the grid.  A sliding scrollbar scrolls freely, while a paging scrollbar scrolls one page of records at a time only." },
      { name: "scroll tool tip", choices: ["none", "row number", "row range"], help: "Determines if the row number or the row number range should be displayed in a tool tip when the user scrolls through the data in the grid.", context: "dspf" },
      { name: "sortable columns", choices: ["true", "false"], help: "Enables column sorting.  If set to true, the user will be able to click on the column headings to resort the data.", context: "dspf" },
      { name: "default sort order", choices: ["Ascending", "Descending", "Other..."], help: "Specifies the default order for sortable columns.  When the user clicks a column, the default sort order is used initially.  To provide a different sort order for each grid column, select <i>Other...</i> and specify a comma separated list.  Entries in the list can be abbreviated using the letter A for Ascending and D for Descending.", context: "dspf" },
      { name: "initial sort column", format: "number", help: "This property specifies the column used to for inital sorting.  Each grid column is identified by a sequential index, starting with 0 for the first column, 1 for the second column, and so on.  If the property is omitted or set to blanks, sorting is not initiated when the grid is first rendered.", context: "dspf" },
      { name: "column sort response", format: "number", readOnly: true, validDataTypes: ["zoned"], help: "Specifies a response variable for server-side sorting.  If omitted, client-side sorting is used.  The response is a numeric value that represents a column in the grid.  Each grid column is identified by a sequential index, starting with 0 for the first column, 1 for the second column, and so on.  It is the responsibility of the program to keep track of the sort direction, and to display an up or down arrow in the appropriate column using the \"initial sort column\" and \"default sort order\" properties.", context: "dspf" },
      { name: "resizable columns", choices: ["true", "false"], help: "Allows the user to resize grid columns at run time.", context: "dspf" },
      { name: "movable columns", choices: ["true", "false"], help: "Allows the user to rearrange grid columns at run time.", context: "dspf" },
      { name: "persist state", choices: ["true", "false"], help: "Specifies whether the grid state should be saved when the user sorts, moves, or resizes columns.  When set to true, the state is saved to browser local storage with each user action, and automatically restored the next time the grid is dislpayed.", context: "dspf" },
      //{ name: "find option", choices: ["true", "false"], help: "Presents an option to search grid data when the grid heading is right-clicked.", context: "dspf" },
      //{ name: "filter option", choices: ["true", "false"], help: "Presents an option to filter grid data when the grid heading is right-clicked.", context: "dspf" },
      { name: "export option", choices: ["true", "false"], help: "Presents an option to export grid data to Excel using the CSV format when the grid heading is right-clicked.", context: "dspf" },
      { name: "context menu id", help: "Specifies the id of a Menu widget used to display a context menu when the user right-clicks a grid row.", hideFormatting: true, validDataTypes: ["char"], context: "dspf" },
  
      { name: "Paging Bar", category: true, context: "dspf" },
      { name: "show paging controls", choices: ["true", "false"], hideFormatting: true, validDataTypes: ["indicator", "expression"], help: "Displays links for navigating to the previous page and the next page of records." },
      { name: "show page number", choices: ["true", "false"], hideFormatting: true, validDataTypes: ["indicator", "expression"], help: "This property determines whether the page number should display within the paging bar.", context: "dspf" },
      { name: "initial page number", format: "number", hideFormatting: true, validDataTypes: ["zoned"], help: "Specifies the initial page number to use when the page number is displayed within the paging bar.  If not specified, page number 1 is used.", context: "dspf" },
      { name: "show bar", choices: ["true", "false"], hideFormatting: true, validDataTypes: ["indicator", "expression"], help: "Displays a bar at the bottom of the grid even if no paging bar elements are selected to be displayed.  This can be used to show miscellaneous information such as column totals.", context: "dspf" },
      { name: "page down condition", validDataTypes: ["indicator", "expression"], hideFormatting: true, readOnly: true, format: "true / false", type: "boolean", help: "Determines if the next page link is enabled.", context: "dspf" },
      { name: "page down response", format: "1 / 0", readOnly: true, hideFormatting: true, validDataTypes: ["indicator"], help: "Specifies a response indicator that is returned to your program when the next page link is clicked.", context: "dspf" },
      { name: "page up condition", validDataTypes: ["indicator", "expression"], hideFormatting: true, readOnly: true, format: "true / false", type: "boolean", help: "Determines if the previous page link is enabled.", context: "dspf" },
      { name: "page up response", format: "1 / 0", readOnly: true, hideFormatting: true, validDataTypes: ["indicator"], help: "Specifies a response indicator that is returned to your program when the previous page link is clicked.", context: "dspf" },
      { name: "csv export", choices: ["true", "false"], help: "Displays a link allowing the user to export grid data to Excel using the CSV format.", context: "dspf" },
      { name: "csv file name", help: "Defines the name of the download file used to export grid data to CSV format.  The .csv extension is automatically appended to the name.  If omitted, the record format name is used.", context: "dspf", translate: true },
      { name: "export with headings", choices: ["true", "false"], help: "Specifies whether subfile headings should be exported as the first row of the CSV file.", context: "dspf" },
      
      { name: "Row Folding", category: true, context: "dspf" },      
      { name: "fold multiple", choices: ["2", "3", "4", "Other..."], help: "The property determines the height of a collapsed row, which is calculated at by taking the row height property and dividing it by the fold multiple.   The multiple represents the number of collapsed rows that can fit into one expanded row.", bind: false, context: "dspf" },
      { name: "expanded", choices: ["true", "false"], hideFormatting: true, validDataTypes: ["indicator", "expression"], help: "Determines if the rows are first displayed in expanded (also known as folded) mode." + (pui.viewdesigner ? "" : "  This property is similar to the SFLFOLD keyword."), context: "dspf" },
      { name: "collapsed", choices: ["true", "false"], hideFormatting: true, validDataTypes: ["indicator", "expression"], help: "Determines if the rows are first displayed in collapsed (also known as truncated) mode." + (pui.viewdesigner ? "" : "  This property is similar to the SFLDROP keyword."), context: "dspf" },
      { name: "return mode", format: "1 / 0", readOnly: true, hideFormatting: true, validDataTypes: ["char", "indicator"], help: "This property can be bound to a field that will provide an indication of whether the grid rows were in expanded (also known as folded) mode or in collapsed (also known as truncated) mode on input." + (pui.viewdesigner ? "" : "  It represents the SFLMODE keyword.  The bound field will contain a value of 0 if the grid rows are in expanded mode and a value of 1 if the grid rows are in collapsed mode."), context: "dspf" },
      { name: "single row zoom", choices: ["true", "false"], hideFormatting: true, validDataTypes: ["indicator", "expression"], help: "Determines if a zoom icon is shown on collapsed rows.  Once the user clicks the icon, the row is expanded.  All other rows remain collapsed.", context: "dspf" },

      { name: "Grid Data", category: true },
      { name: "database file", type: "file", uppercase: true, help: "Database file to use for a grid that is tied directly to a database.  You can specify a 'database file' or 'library/database file'.  If library is omitted, the session's library list is used." },
      { name: "database fields", type: "field", multiple: true, uppercase: true, help: "A set of database field names to use to retrieve the data for a database-driven grid. The field names should be comma separated.", descriptionsHandler: function(descriptions) {
        if (!confirm("Use field descriptions as column headings?")) return;
        me.setProperty("column headings", descriptions);
        var itm = me.tableDiv.designItem;        
        sendPropertyToDesigner(itm, "column headings", descriptions);
        itm.designer.propWindow.refreshProperty("column headings")
      }},
      { name: "selection criteria", type: "long", help: "Optional expression identifying which records should be retrieved from the database file." },
      { name: "order by", type: "field", multiple: true, uppercase: true, help: "Optional expression identifying which fields determine the order of the records retrieved from the database file." },
      { name: "custom sql", type: "long", help: "Specifies an sql statement to use to retrieve the records for a database-driven grid." },
      { name: "parameter value", type: "long", hidden: (pui["secLevel"] == 0) ? true : false, multOccur: true, help: "Value for parameter marker in \"selection criteria\" or \"custom sql\" property. Parameter markers are specified using a question mark. Profound UI will accept values from the client for any parameter marker values which are not bound to program fields. Parameter markers are numbered in order of occurence, from left to right. To specify multiple parameter marker values, right-click the property and select Add Another Parameter Value." },    
      { name: "data url", type: "long", help: "Sets the url to a Web service that returns JSON data for a database-driven grid." },

      { name: "Grid Data from Screen", category: true, context: "genie" },
      { name: "starting row", help: "Specifies the starting subfile row for retrieving data from the screen.", context: "genie" },
      { name: "ending row", help: "Specifies the ending subfile row for retrieving data from the screen.", context: "genie" },
      { name: "data columns", type: "list", help: "Specifies a comma separated list of column numbers for retrieving data from the screen.", context: "genie"},

      { name: "Position", category: true },
      { name: "left", format: "px", help: "Represents the x-coordinate of the current element.", canBeRemoved: false },
      { name: "top", format: "px", help: "Represents the y-coordinate of the current element.", canBeRemoved: false },
      { name: "height", help: "Height of the grid.", bind: false, canBeRemoved: false },
      { name: "width", help: "Width of the grid.", bind: false, canBeRemoved: false },
      { name: "expand to layout", choices: ["true", "false"], help: "If set to true, the grid will automatically expand to the full size of a layout container.", context: "dspf", bind: false },
      { name: "z index", format: "number", help: "The stacking order of the current element, expressed as an integer value. The element with the higher z index will overlay lesser elements." },
      { name: "locked in place", choices: ["true", "false"], help: "If set to true, the grid cannot be moved or sized in the Visual Designer.", bind: false },
  
      { name: "Drag and Drop", category: true, context: "dspf" },
      { name: "allow drag", choices: ["true", "false"], type: "boolean", help: "This property determines if rows within the grid can be drag and dropped.", context: "dspf" },
      { name: "ondragstart", type: "js", help: "Initiates a client-side script when the user first starts to drag a row within the grid. Information about the drag and drop operation is provided using the global pui.dragDropInfo object.", context: "dspf" },
      { name: "drop targets", type: "list", help: "Specifies a list of target element id's, which indentify where the row can be dropped.", context: "dspf" },
      { name: "ondragenter", type: "js", help: "Initiates a client-side script when the user drags a row over a valid drop target.  Information about the drag and drop operation is provided using the global pui.dragDropInfo object.", context: "dspf" },
      { name: "ondragleave", type: "js", help: "Initiates a client-side script when the user moves a row out of a valid drop target during a drag operation.  Information about the drag and drop operation is provided using the global pui.dragDropInfo object.", context: "dspf" },
      { name: "ondrop", type: "js", help: "Initiates a client-side script when the mouse is released during a drag and drop operation.  Information about the drag and drop operation is provided using the global pui.dragDropInfo object.", context: "dspf" },

      { name: "Tabs", category: true },
      { name: "parent tab panel", help: "This property specifies the id of the Tab Panel to which this element belongs.  The property is set automatically when you drag and drop the element onto a Tab Panel.", bind: false },
      { name: "parent tab", help: "This property specifies the tab index of the specific tab to which this element belongs.  Each tab within a Tab Panel is identified by a sequential index, starting with 0 for the first tab, 1 for the second tab, and so on.  The property is set automatically when you drag and drop the element onto a Tab Panel.", bind: false },
      { name: "parent field set", help: "This property specifies the if of the Field Set Panel to which this element belongs.  The property is set automatically when you drag and drop the element onto a Field Set Panel.", bind: false },

      { name: "Borders", category: true },
      { name: "border color", type: "color", help: "The color of the grid's outer borders and inner separators." },
      { name: "border width", format: "px", choices: ["0px", "1px", "2px", "3px", "4px", "5px", "Other..."], help: "The thickness of the grid's outer borders and inner separators." },
   
      { name: "Padding", category: true },    
      { name: "padding bottom", format: "px", choices: ["0px", "1px", "2px", "3px", "4px", "5px", "6px", "7px", "8px", "9px", "Other..."], help: "Sets the distance between the bottom edge of a grid cell and the cell's content." },
      { name: "padding left", format: "px", choices: ["0px", "1px", "2px", "3px", "4px", "5px", "6px", "7px", "8px", "9px", "Other..."], help: "Sets the distance between the left edge of a grid cell and the cell's content." },
      { name: "padding right", format: "px", choices: ["0px", "1px", "2px", "3px", "4px", "5px", "6px", "7px", "8px", "9px", "Other..."], help: "Sets the distance between the right edge of a grid cell and the cell's content." },
      { name: "padding top", format: "px", choices: ["0px", "1px", "2px", "3px", "4px", "5px", "6px", "7px", "8px", "9px", "Other..."], help: "Sets the distance between the top edge of a grid cell and the cell's content." },

      { name: "Misc", category: true },    
      { name: "css class", multOccur: (context == "dspf" ? true : false), attribute: "class", help: "Defines a custom cascading style sheet class to assign to the element." + (context == "dspf" ? "  To specify multiple classes, right-click the property and select Add Another CSS Class." : "") },
      { name: "tool tip", type: "long", help: "Defines the text to appear in a tool tip when the user hovers the mouse over this element.", translate: true },
      { name: "visibility", format: "visible / hidden", choices: ["hidden", "visible"], help: "Determines whether the element is visible or hidden." },
      
      { name: "Events", category: true },
      { name: "onrowclick", type: "js", help: "Initiates a client-side script when a row within the grid is clicked.  The script can determine the row number using the <b>row</b> variable.", bind: false },
      { name: "onrowdblclick", type: "js", help: "Initiates a client-side script when a row within the grid is double-clicked.  The script can determine the row number using the <b>row</b> variable.", bind: false },
      { name: "onrowmouseover", type: "js", help: "Initiates a client-side script when the mouse is moved over a row within the grid.  The script can determine the row number using the <b>row</b> variable.", bind: false },
      { name: "onrowmouseout", type: "js", help: "Initiates a client-side script when the mouse is moved off of a row within the grid.  The script can determine the row number using the <b>row</b> variable.", bind: false },
      { name: "onpagedown", type: "js", help: "Initiates a client-side script when the user pages down using the grid's scrollbar.  To prevent the grid's default paging action, the script must evaluate to <i>false</i>.", bind: false },
      { name: "onpageup", type: "js", help: "Initiates a client-side script when the user pages up using the grid's scrollbar.  To prevent the grid's default paging action, the script must evaluate to <i>false</i>.", bind: false }
    ];
    
    return model;
  }
  
}






