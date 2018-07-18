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



pui["dragDropInfo"] = {};

pui.attachDragDrop = function(dom, properties) {

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
    var requestNum = 0;
    var recordNumber;

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
      if (dataRecords[recordNumber - 1] !== null && 
          dataRecords[recordNumber - 1].length != 0 &&
          dataRecords[recordNumber - 1].subfileRow != null) {
        recordNumber = dataRecords[recordNumber - 1].subfileRow;
      }      
    }
  
    var dropTargetIds = properties["drop targets"];
    var dropTargets = [];
    if (dropTargetIds != null && dropTargetIds != "") {
      dropTargetIds = dropTargetIds.split(",");
      for (var i = 0; i < dropTargetIds.length; i++) {
        var dropTarget = getObj(dropTargetIds[i]);
        if (dropTarget != null) {
          if (dropTarget.grid != null) {
            var lines = dropTarget.grid.hLines;
            var lastLine = lines.length - 1;
            if (!dropTarget.grid.isDataGrid()) {
              var dataRecords = dropTarget.grid.dataArray;
              if (dropTarget.grid.isFiltered()) dataRecords = dropTarget.grid.filteredDataArray;
              var minLastLine = dataRecords.length - dropTarget.grid.recNum + 2;
              if (lastLine > minLastLine) lastLine = minLastLine;
            }
            for (var j = (dropTarget.grid.hasHeader ? 1 : 0); j <= lastLine; j++) {
              lines[j].dropIndex = j;
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
      var y = getMouseY(event) - cursorStartY;
      var x = getMouseX(event) - cursorStartX;

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
        if (foundTarget || (left2 > right || right2 < left || top2 > bottom || bottom2 < top)) {
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
        requestNum++;
        if (prevDropInto != null) {
          pui["dragDropInfo"] = {};
          pui["dragDropInfo"]["dd element"] = dom;
          pui["dragDropInfo"]["dd element id"] = dom.id;
          if (recordNumber != null) pui["dragDropInfo"]["dd record number"] = recordNumber;
          pui["dragDropInfo"]["proxy"] = proxy;
          pui["dragDropInfo"]["event"] = event;
          var drop = getDropInfo(prevDropInto);
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
          var drop = getDropInfo(dropInto);
          pui["dragDropInfo"]["target element"] = drop.dom;
          pui["dragDropInfo"]["target element id"] = drop.id;
          if (drop.recordNumber != null) pui["dragDropInfo"]["target record number"] = drop.recordNumber;
          if (recordNumber != null) pui["dragDropInfo"]["text"] = "ondragenter: Dragging row " + recordNumber + " of grid " + dom.id;
          else pui["dragDropInfo"]["text"] = "ondragenter: Dragging element " + dom.id;
          if (drop.recordNumber == 0) pui["dragDropInfo"]["text"] += " before row " + (drop.recordNumber + 1) + " of grid " + drop.id;
          else if (drop.recordNumber != null) pui["dragDropInfo"]["text"] += " after row " + drop.recordNumber + " of grid " + drop.id;
          else pui["dragDropInfo"]["text"] += " over element " + drop.id;
          executeEvent("ondragenter");
          function tryScroll(req) {
            setTimeout(function() {
              if (req != requestNum) return;
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
                setTimeout(function() {                  
                  tryScroll(req);
                }, 35);
              }
            }, 350);
          }
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
          if (canScrollUp() || canScrollDown()) {
            tryScroll(requestNum);
          }
        }
      }
      
      if (!touchEvent) preventEvent(event);
      
    }
    function getDropInfo(dropEl) {
      var grid = dropEl.relatedGrid;
      if (grid == null) {
        return { dom: dropEl, id: dropEl.id };
      }
      else {
        var row = dropEl.dropIndex;        
        var recordNumber = row;
        if (grid.hasHeader) recordNumber = recordNumber - 1;
        recordNumber = recordNumber + grid.recNum - 1;        
        return { dom: grid.tableDiv, grid: grid, id: grid.tableDiv.id, row: row, recordNumber: recordNumber };
      }      
    }
    function mouseup() {
      requestNum++;
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
        var drop = getDropInfo(dropInto);
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
            }
          }
        }

      }
      
      if (!useProxy && pui.dragDropFields.respond != true) {
        dom.style.left = startDomX + "px";
        dom.style.top = startDomY + "px";
      }
      
    }
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
    if (eventCode != null && eventCode != "") {
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

}





