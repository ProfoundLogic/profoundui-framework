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



pui["dragDropInfo"] = {};

pui.attachDragDrop = function(dom, properties) {
  var drop, recordNumber;
  var tryScrollTimeout = 0; //Helps avoid calling tryScroll repeatedly when the mouse moves.
  var scrollDelay = 350;    //The grid will scroll another record up or down every 350 milliseconds after the initial delay.
  var initialScrollDelay = scrollDelay;   //By default, wait 350 milliseconds before the grid begins to scroll up or down.
  if (typeof pui["drop scroll wait"] == 'number'){
    // "drop scroll wait" allows the customer to set the initial delay before scrolling starts. Issue #5062.
    initialScrollDelay = pui["drop scroll wait"];
  }

  dom.onselectstart = function(e) { 
    if (isGrid || isHTMLContainer) {
      //So that the user can select the text inside of a textarea or input element if nested in a Grid or HTML container 
      var target = getTarget(e);
      if (target.tagName == 'TEXTAREA' || target.tagName == 'INPUT') return true; 
    }
    return false;
  };
  if (typeof dom.style.MozUserSelect!="undefined") dom.style.MozUserSelect = "none";

  var useProxy = (properties["use proxy"] == "true");
  var isGrid = (dom.grid != null);
  var isHTMLContainer = (properties['field type'] == 'html container');

  if (isGrid) {
    useProxy = true;
    setTimeout(function() {
      var lastRow = dom.grid.cells.length - 1;
      if (!dom.grid.isDataGrid()) {
        var dataRecords = dom.grid.dataArray;
        if (dom.grid.isFiltered()) dataRecords = dom.grid.filteredDataArray;
        var minLastRow = dataRecords.length - dom.grid.recNum + 1;
        if (lastRow > minLastRow) lastRow = minLastRow;
      }
      if ((properties["cursor"] == null || properties["cursor"] == "") && !pui.iPadEmulation) {
        for (var i = (dom.grid.hasHeader ? 1 : 0); i <= lastRow; i++) {
          var rowObj = dom.grid.cells[i];
          for (var j = 0; j < rowObj.length; j++) {
            rowObj[j].style.cursor = "move";
          }
        }
      }
    }, 1);
  }

  function mousedown(event) {
    if (event["pointerType"] && event["stopImmediatePropagation"]) event["stopImmediatePropagation"]();
    var clickedOn = getTarget(event);
    var offset = pui.getOffset(dom.parentNode);
    var offsetX = offset[0];
    var offsetY = offset[1];    
    
    var touchEvent = false;

    if (event) {
      if (event.touches != null) {
        if (event.touches.length != 1) return;
        touchEvent = true;
      } else if (event["pointerType"] === 'touch') {
        touchEvent = true;
      }
    }
    if (touchEvent) event.preventDefault();
    // get grid row    
    var row;
    recordNumber = null;

    if (isHTMLContainer) {
      if (clickedOn.tagName == 'TEXTAREA' || clickedOn.tagName == 'INPUT') return;
    }

    if (isGrid) {
      var dataRecords = dom.grid.dataArray;
      if (dom.grid.isFiltered()) dataRecords = dom.grid.filteredDataArray;
      var lastRow = dom.grid.cells.length - 1;
      if (!dom.grid.isDataGrid()) {
        var minLastRow = dataRecords.length - dom.grid.recNum + 1;
        if (lastRow > minLastRow) lastRow = minLastRow;
      }    
      var firstRow = 0;
      if (dom.grid.hasHeader) firstRow = 1;
      var clickedOn = getTarget(event);
      if (clickedOn.tagName == "A" || clickedOn.tagName == "IMG" || clickedOn.tagName == "INPUT" || clickedOn.tagName == "SELECT" || clickedOn.tagName == "TEXTAREA") {
        return;
      }
      while (clickedOn != null && (clickedOn.row == null || clickedOn.col == null)) {
        clickedOn = clickedOn.parentNode;
      }
      if (clickedOn != null && clickedOn.row >= firstRow) {
        row = clickedOn.row;
      }
      else {
        return;
      }
      if (row > lastRow) {
        return;
      }
      
      recordNumber = row + dom.grid.recNum;
      if (dom.grid.hasHeader) {
        recordNumber = recordNumber - 1;
      }
      if (dataRecords.length > 0 && dataRecords[recordNumber - 1] !== null && 
          dataRecords[recordNumber - 1].length != 0 &&
          dataRecords[recordNumber - 1].subfileRow != null) {
        recordNumber = dataRecords[recordNumber - 1].subfileRow;
      }
      dom.grid.dragdropBusy = true; //Prevent the page from scrolling as a result of the touch event.
    }
    
    var dropTargetIds = properties["drop targets"];
    var dropTargets = [];
    if (dropTargetIds != null && dropTargetIds != "") {
      dropTargetIds = dropTargetIds.split(",");
      // Look in each drop target widget and make a list of drop target elements.
      for (var i = 0; i < dropTargetIds.length; i++) {
        var dropTarget = getObj(dropTargetIds[i]);
        if (dropTarget != null) {
          // If the target is a grid, then each of its lines may be drop targets.
          if (dropTarget.grid != null) {
            var lines = dropTarget.grid.hLines;
            var lastLine = lines.length - 1;
            if (!dropTarget.grid.isDataGrid()) {
              dataRecords = dropTarget.grid.dataArray;
              if (dropTarget.grid.isFiltered()) dataRecords = dropTarget.grid.filteredDataArray;
              var minLastLine = dataRecords.length - dropTarget.grid.recNum + 2;
              if (lastLine > minLastLine) lastLine = minLastLine;
              // Note: if grid is DB-driven then there's no current way to get RRN, so row index becomes target record number.
            }
            var headerAdjust = dropTarget.grid.hasHeader ? 1 : 0;
            var lastDropIndex = headerAdjust;
            if (dataRecords.length == 0){
              lastLine = headerAdjust - 1;   //All records are filtered out, or there are none; 
            }
            // Allow elements to be dropped on every line by adding the lines to a list and setting an index. (Includes line above the first row.)
            // Note: the grid may scroll when dragged, and grid.recNum may change; do not calculate target record numbers here.
            for (var j = headerAdjust; j < lines.length; j++) {
              // For when the item is not dropped below empty rows, then the subfileRow or row index will become the target record number.
              if (j <= lastLine){
                lines[j].dropIndex = j;   //dropIndex becomes the "row" returned by getDropInfo.
                lastDropIndex = j;
              }
              // If there are blank rows in the subfile, then use the last record number for the remaining lines. More intuitive on empty grids. #5415
              else {
                lines[j].dropIndex = lastDropIndex;
              }
              dropTargets.push(lines[j]);
            }
          }
          else {
            dropTargets.push(dropTarget);
          }
        }
      }
    }

    var proxy = dom;
    if (useProxy) {
      if (isGrid) {
        var cols = dom.grid.cells[row];
        var cell0 = cols[0];
        proxy = document.createElement("div");
        proxy.style.position = "absolute";
        proxy.style.left = dom.style.left;
        proxy.style.top = (parseInt(dom.style.top) + parseInt(cell0.style.top)) + "px";
        var width = parseInt(dom.style.width);
        width = width - 2;
        if (properties["scrollbar"] != "none") width = width - 16;
        if (width < 5) width = 5;
        proxy.style.width = width + "px";
        var height = parseInt(cell0.style.height);
        height = height - 2;
        if (height < 5) height = 5;
        proxy.style.height = height + "px";        
        for (var i = 0; i < cols.length; i++) {
          var cloneCell = cols[i].cloneNode(true);
          cloneCell.style.top = "0px";
          cloneCell.onclick = null;
          cloneCell.onmousedown = null;
          cloneCell.onmouseup = null;
          proxy.appendChild(cloneCell);          
        }
      }
      else {
        proxy = dom.cloneNode(true);
      }
      proxy.style.zIndex = 701;
      if (!pui.iPadEmulation) {
        proxy.style.cursor = "move";
      }
      proxy.style.opacity = 0.60;
      proxy.style.filter = "alpha(opacity=60)";
      proxy.style.border = "1px solid #333333";
    }
    // For centering horizontal and vertical options. 
    if (proxy.style.top.indexOf('calc') !== -1) {
      proxy.style.top = window.getComputedStyle(dom, null).getPropertyValue("top");
    }
    if (proxy.style.left.indexOf('calc') !== -1) {
      proxy.style.left = window.getComputedStyle(dom, null).getPropertyValue("left");
    }

    var cursorStartX = getMouseX(event);
    var cursorStartY = getMouseY(event);
    var startDomX = parseInt(proxy.style.left);
    var startDomY = parseInt(proxy.style.top);
    var dropInto = null;
    var savedOnselectstart = document.onselectstart;

    pui["dragDropInfo"] = {};
    pui["dragDropInfo"]["dd element"] = dom;
    pui["dragDropInfo"]["dd element id"] = dom.id;
    if (recordNumber != null) pui["dragDropInfo"]["dd record number"] = recordNumber;
    pui["dragDropInfo"]["proxy"] = proxy;
    pui["dragDropInfo"]["event"] = event;
    if (recordNumber != null) pui["dragDropInfo"]["text"] = "ondragstart: Dragging row " + recordNumber + " of grid " + dom.id;
    else pui["dragDropInfo"]["text"] = "ondragstart: Dragging element " + dom.id;
    executeEvent("ondragstart");

    function mousemove(event) {
      if (event["pointerType"] && event["stopImmediatePropagation"]) event["stopImmediatePropagation"]();
      var mousey = getMouseY(event);
      var mousex = getMouseX(event);
      var y = mousey - cursorStartY;
      var x = mousex - cursorStartX;

      //For Issue 3634, Chrome has a bug where the mousemove would get called with a mousedown. This will let the click event occur if defined. 
      if (x == 0 && y == 0) return true;

      if (!pui.hasParent(proxy)) {
        document.body.appendChild(proxy);
      }
    
      if (isGrid && dom.grid.contextMenuId) {
      
        var contextMenu = getObj(dom.grid.contextMenuId);
        contextMenu.style.visibility = "hidden";
        contextMenu.style.display = "none";        
      
      }
    
      if (useProxy) {
        y = y + offsetY;
        x = x + offsetX;
      }
      
      proxy.style.top = (startDomY + y) + "px";
      proxy.style.left = (startDomX + x) + "px";
      
      if (touchEvent) event.preventDefault();
      
      var prevDropInto = dropInto;
      var foundTarget = false;      
      for (var i = 0; i < dropTargets.length; i++) {
        var tgt = dropTargets[i];
        var left = proxy.offsetLeft;
        var top = proxy.offsetTop;
        var right = left + proxy.offsetWidth;
        var bottom = top + proxy.offsetHeight;
        if (tgt.targetOffsetX == null || tgt.targetOffsetY == null) {
          var targetOffset = pui.getOffset(tgt.parentNode);
          tgt.targetOffsetX = targetOffset[0];
          tgt.targetOffsetY = targetOffset[1];
        }
        var left2 = tgt.offsetLeft + tgt.targetOffsetX;
        var top2 = tgt.offsetTop + tgt.targetOffsetY;
        var right2 = left2 + tgt.offsetWidth;
        var bottom2 = top2 + tgt.offsetHeight;
        if (tgt.parentNode.getAttribute("container") == "true") {
          // part of the grid or element may be cut off by the container (like in a horizontally scrolling grid), so we must account for that
          var altRight2 = right2 - tgt.offsetWidth + tgt.parentNode.offsetWidth - tgt.offsetLeft;
          if (altRight2 < right2) right2 = altRight2;
        }
        
        // Check if the mouse is outside the grid of this target. Allows large rows to be more easily dragged in side-by-side grids. #5192.
        var mouseOutsideGrid = false;
        if (tgt.relatedGrid != null){
          var tgrdoff = pui.getOffset(tgt.relatedGrid.tableDiv);  //[left,top].
          
          var tgrdright = tgrdoff[0] + tgt.relatedGrid.tableDiv.offsetWidth;
          var tgrdbot = tgrdoff[1] + tgt.relatedGrid.tableDiv.offsetHeight;
          if ( mousex > tgrdright || mousex < tgrdoff[0] || mousey > tgrdbot || mousey < tgrdoff[1] ){
            mouseOutsideGrid = true;
          }
        }
        
        // Do not use this as a drop-target, because one's already picked or it's not near the proxy or mouse.
        if (foundTarget || (left2 > right || right2 < left || top2 > bottom || bottom2 < top) || mouseOutsideGrid) {
          if (tgt.relatedGrid != null) {
            pui.removeCssClass(tgt, "grid-drop-target");
          }
          else {
            if (tgt.tagName == "IMG") {
              if (tgt.backgroundColorBeforeDrag != null) tgt.style.backgroundColor = tgt.backgroundColorBeforeDrag;
            }
            if (tgt.borderColorBeforeDrag != null) tgt.style.borderColor = tgt.borderColorBeforeDrag;
          }
        }
        else {
          if (tgt.relatedGrid != null) {
            pui.addCssClass(tgt, "grid-drop-target");
          }
          else {
            if (tgt.borderColorBeforeDrag == null) tgt.borderColorBeforeDrag = tgt.style.borderColor;          
            if (tgt.borderColorBeforeDrag == null) tgt.borderColorBeforeDrag = "";
            tgt.style.borderColor = "#9999ff";
            if (tgt.tagName == "IMG") {
              if (tgt.backgroundColorBeforeDrag == null) tgt.backgroundColorBeforeDrag = tgt.style.backgroundColor;
              if (tgt.backgroundColorBeforeDrag == null) tgt.backgroundColorBeforeDrag = "";
              tgt.style.backgroundColor = "#D8F0FD";
            }
          }
          foundTarget = true;
          dropInto = tgt;
        }
      }      
      if (!foundTarget) {
        dropInto = null;
      }
      if (prevDropInto != dropInto) {
        clearTimeout(tryScrollTimeout);   //Avoid grids scrolling when a new drag is happening.
        if (prevDropInto != null) {
          pui["dragDropInfo"] = {};
          pui["dragDropInfo"]["dd element"] = dom;
          pui["dragDropInfo"]["dd element id"] = dom.id;
          if (recordNumber != null) pui["dragDropInfo"]["dd record number"] = recordNumber;
          pui["dragDropInfo"]["proxy"] = proxy;
          pui["dragDropInfo"]["event"] = event;
          drop = getDropInfo(prevDropInto);
          pui["dragDropInfo"]["target element"] = drop.dom;
          pui["dragDropInfo"]["target element id"] = drop.id;
          if (drop.recordNumber != null) pui["dragDropInfo"]["target record number"] = drop.recordNumber;
          if (recordNumber != null) pui["dragDropInfo"]["text"] = "ondragleave: Dragging row " + recordNumber + " of grid " + dom.id;
          else pui["dragDropInfo"]["text"] = "ondragleave: Dragging element " + dom.id;
          if (drop.recordNumber != null) pui["dragDropInfo"]["text"] += " off of row " + drop.recordNumber + " of grid " + drop.id;
          else pui["dragDropInfo"]["text"] += " off of element " + drop.id;
          executeEvent("ondragleave");
        }
        if (dropInto != null) {
          pui["dragDropInfo"] = {};
          pui["dragDropInfo"]["dd element"] = dom;
          pui["dragDropInfo"]["dd element id"] = dom.id;
          if (recordNumber != null) pui["dragDropInfo"]["dd record number"] = recordNumber;
          pui["dragDropInfo"]["proxy"] = proxy;
          pui["dragDropInfo"]["event"] = event;
          drop = getDropInfo(dropInto);
          pui["dragDropInfo"]["target element"] = drop.dom;
          pui["dragDropInfo"]["target element id"] = drop.id;
          if (drop.recordNumber != null) pui["dragDropInfo"]["target record number"] = drop.recordNumber;
          if (recordNumber != null) pui["dragDropInfo"]["text"] = "ondragenter: Dragging row " + recordNumber + " of grid " + dom.id;
          else pui["dragDropInfo"]["text"] = "ondragenter: Dragging element " + dom.id;
          if (drop.recordNumber == 0) pui["dragDropInfo"]["text"] += " before row " + (drop.recordNumber + 1) + " of grid " + drop.id;
          else if (drop.recordNumber != null) pui["dragDropInfo"]["text"] += " after row " + drop.recordNumber + " of grid " + drop.id;
          else pui["dragDropInfo"]["text"] += " over element " + drop.id;
          executeEvent("ondragenter");
          if (canScrollUp() || canScrollDown()) {
            // Note: if "wait" is -1, then scrolling on dragover is disabled.
            if (initialScrollDelay >= 0){
              clearTimeout(tryScrollTimeout);
              tryScrollTimeout = setTimeout(tryScroll, initialScrollDelay);
            }
          }
        }
      }
      
      if (!touchEvent) preventEvent(event);
    }
    
    function mouseup() {
      clearTimeout(tryScrollTimeout);   //Prevent any further grid scrolling.

      if (useProxy) {
        if (pui.hasParent(proxy)) {
        
          proxy.parentNode.removeChild(proxy);
          
        }
        proxy = null;
      }
      if (touchEvent) {
        removeEvent(document, "touchmove", mousemove);
        removeEvent(document, "touchend", mouseup);
      }
      else {
        removeEvent(document, "mousemove", mousemove);
        removeEvent(document, "mouseup", mouseup);
      }
      document.onselectstart = savedOnselectstart;
      
      if (dropInto != null) {
        
        pui["dragDropInfo"] = {};
        pui["dragDropInfo"]["dd element"] = dom;
        pui["dragDropInfo"]["dd element id"] = dom.id;
        if (recordNumber != null) pui["dragDropInfo"]["dd record number"] = recordNumber;
        pui["dragDropInfo"]["proxy"] = proxy;
        pui["dragDropInfo"]["event"] = event;
        drop = getDropInfo(dropInto);
        pui["dragDropInfo"]["target element"] = drop.dom;
        pui["dragDropInfo"]["target element id"] = drop.id;
        if (drop.recordNumber != null) pui["dragDropInfo"]["target record number"] = drop.recordNumber;
        if (recordNumber != null) pui["dragDropInfo"]["text"] = "ondrop: Dropped row " + recordNumber + " of grid " + dom.id;
        else pui["dragDropInfo"]["text"] = "ondrop: Dropped element " + dom.id;
        if (drop.recordNumber == 0) pui["dragDropInfo"]["text"] += " before row " + (drop.recordNumber + 1) + " of grid " + drop.id;
        else if (drop.recordNumber != null) pui["dragDropInfo"]["text"] += " after row " + drop.recordNumber + " of grid " + drop.id;
        else pui["dragDropInfo"]["text"] += " into element " + drop.id;
        
        if (dropInto.relatedGrid != null) {
          pui.removeCssClass(dropInto, "grid-drop-target");
        }
        else {
          if (dropInto.tagName == "IMG") {
            dropInto.style.backgroundColor = dropInto.backgroundColorBeforeDrag;            
          }
          if (dropInto.backgroundColorBeforeDrag != null) {
            dropInto.style.borderColor = dropInto.backgroundColorBeforeDrag;
          }
        }

        if (!(drop.dom.id == dom.id && recordNumber != null && drop.recordNumber != null && (recordNumber == drop.recordNumber || recordNumber == drop.recordNumber + 1))) {
          pui["dragDropInfo"]["cancel"] = false;
          executeEvent("ondrop");
          if (pui["dragDropInfo"]["cancel"] != true) {
            if (pui.dragDropFields.ddElementId != null || pui.dragDropFields.ddRecordNumber || pui.dragDropFields.targetElementId != null || pui.dragDropFields.targetRecordNumber) {
              pui.dragDropFields.respond = true;
              pui.bypassValidation = pui.ddBypassValidation;
              pui.respond();
              pui.bypassValidation = "false";
              pui.responseRoutine = null;
              pui.responseRoutineRow = null;
              pui.responseRoutineGrid = null;
            }
          }
        }

      }
      
      if (!useProxy && pui.dragDropFields.respond != true) {
        dom.style.left = startDomX + "px";
        dom.style.top = startDomY + "px";
      }
      
      if (isGrid){
        dom.grid.dragdropBusy = false;
      }

      recordNumber = drop = null;
    } //end mouseup.
    
    if (touchEvent) {
      addEvent(document, "touchmove", mousemove);
      addEvent(document, "touchend",   mouseup);
    }
    else {
      addEvent(document, "mousemove", mousemove);
      addEvent(document, "mouseup",   mouseup);
    }
    document.onselectstart = function(e) { 
      return false; 
    };  
     
  } //end mousedown.
  
  function canScrollUp() {
    if (drop.row == null) return false;
    if (drop.grid.atTop()) return false;
    if (drop.row == 0) return true;
    if (drop.row == 1 && drop.grid.hasHeader) return true;
    return false;
  }
  
  function canScrollDown() {
    if (drop.row == null) return false;
    if (drop.grid.atBottom()) return false;
    if (drop.row == drop.grid.cells.length) return true;
    return false;
  }
  
  /**
   * Check if the grid can be scrolled up/down, depending which grid line is hovered over, and scroll. tryScroll is a timeout callback.
   */
  function tryScroll() {
    var go = false;
    if (canScrollUp()) {
      drop.grid.recNum -= 1;
      drop.recordNumber -= 1;
      go = true;
    }
    else if (canScrollDown()) {
      drop.grid.recNum += 1;
      drop.recordNumber += 1;
      go = true;
    }
    if (go) {
      // scroll the grid
      if (drop.grid.slidingScrollBar) drop.grid.scrollbarObj.setScrollTopToRow(drop.grid.recNum);
      else drop.grid.getData();

      // fire appropriate ondragleave/ondragenter events
      if (recordNumber != null) pui["dragDropInfo"]["text"] = "ondragleave: Dragging row " + recordNumber + " of grid " + dom.id;
      else pui["dragDropInfo"]["text"] = "ondragleave: Dragging element " + dom.id;
      pui["dragDropInfo"]["text"] += " off of row " + pui["dragDropInfo"]["target record number"] + " of grid " + drop.id;
      executeEvent("ondragleave");

      pui["dragDropInfo"]["target record number"] = drop.recordNumber;
      if (recordNumber != null) pui["dragDropInfo"]["text"] = "ondragenter: Dragging row " + recordNumber + " of grid " + dom.id;
      else pui["dragDropInfo"]["text"] = "ondragenter: Dragging element " + dom.id;
      if (drop.recordNumber == 0) pui["dragDropInfo"]["text"] += " before row " + (drop.recordNumber + 1) + " of grid " + drop.id;
      else pui["dragDropInfo"]["text"] += " after row " + drop.recordNumber + " of grid " + drop.id;
      executeEvent("ondragenter");

      // try to scroll more...
      clearTimeout(tryScrollTimeout);
      tryScrollTimeout = setTimeout(tryScroll, scrollDelay + 35);
    }
  }
  
  /**
   * Return 
   * @param {Object|WebElement} dropEl    A grid line or another element.
   * @returns {Object}
   */
  function getDropInfo(dropEl) {
    var grid = dropEl.relatedGrid;
    if (grid == null) {
      return { dom: dropEl, id: dropEl.id };
    }
    else {
      var row = dropEl.dropIndex;
      var headerAdjust = grid.hasHeader ? 1 : 0;
      // When the grid has not been sorted or filtered, then the target record number corresponds to the row index.
      var dataRecordsPos = grid.recNum - 1 + row - headerAdjust;
      var recnum = dataRecordsPos > 0 ? dataRecordsPos : 0;    //In case dataRecordsPos is out of bounds use 0, the top of subfile.

      var dataRecords = grid.isFiltered() ? grid.filteredDataArray : grid.dataArray;
      if (dataRecordsPos > 0 && dataRecords.length > 0 && dataRecords[0] && dataRecords[0].subfileRow != null){
        // The grid is filtered/sorted: target record number should use subfile record number instead of the visible row index. #5999
        if (dataRecordsPos < dataRecords.length ){
          // The item was dropped on or after the first record and before the last record.
          recnum = dataRecords[dataRecordsPos - 1].subfileRow;
        }
        else {
          // The item was dropped at the last grid line when the grid was scrolled to the bottom; e.g. RN is 12 when dropping on/below record 12.
          recnum = dataRecords[dataRecords.length - 1].subfileRow;
        }
      }

      return { dom: grid.tableDiv, grid: grid, id: grid.tableDiv.id, row: row, recordNumber: recnum };
    }      
  }
 
  // The updated version of iScroll in 5.14.0 and later uses Pointer Events
  // These events get called before the mousedown event and get cancelled. 
  // This causes drag and drop to not work correctly in web browsers.
  // Add an event listener for pointerdown instead of mouse down and then
  // stop the immediate propnagation so that drag and drop works smoothly. 
  // #4632
  if (window["PointerEvent"]) {
    addEvent(dom, "pointerdown", mousedown);
  } else {
    addEvent(dom, "mousedown", mousedown);
    addEvent(dom, "touchstart", mousedown);
  }


  function executeEvent(eventName) {
    var eventCode = properties[eventName];
    if (pui.isRoutine(eventCode)) {
      pui.bypassValidation = pui.ddBypassValidation;
      pui["runLogic"](eventCode.routine);
    }
    else if (eventCode != null && eventCode != "") {
      try {
        var returnVal = eval(eventCode);
        if (returnVal == false) return false;
      }
      catch(err) {
        pui.scriptError(err, eventName + " Error:\n");
        return false;
      }
    }
  }

};





