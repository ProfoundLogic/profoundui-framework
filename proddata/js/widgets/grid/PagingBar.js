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
 * Paging Bar Class
 * @constructor
 */

pui.PagingBar = function() {
  this.x = 100;
  this.y = 100;
  this.width = 500;
  this.csvExport = false;
  this.xlsxExport = false;
  this.xlsxExportPics = false;
  this.showPagingControls = false;
  this.showPageNumber = false;
  this.showRecordNumberRange = false;
  this.showBar = false;
  this.pageUpCondition = null;
  this.pageDownCondition = null;

  // These remain false when their responses are not set, even for paging scrollbar.
  this.pageUpResponseDefined = false; // true when grid "page up response" is set.
  this.pageDownResponseDefined = false; // true when grid "page down response" is set.

  // Become true in renderForamt() for paging scrollbar depending on pui.keyMap.
  this.pageUpHotKeyDefined = false;
  this.pageDownHotKeyDefined = false;

  this.pageNumber = 1;
  this.container = null;
  this.grid = null;

  this.prevImg = null;
  this.prevLink = null;
  this.nextImg = null;
  this.nextLink = null;

  var div;
  var exportImg;
  var exportLink;
  var exportImgXLSX;
  var exportLinkXLSX;
  this._tempStatusDiv = null;

  var spacesSpan1;
  var spacesSpan2;
  var pageSpan;
  var rcdNbrRangeSpan;

  var me = this;

  /**
   * Handle the "Previous" paging control and PageUp key for Genie, scrolling
   * grids, and some paging grids.
   * @param {boolean} fromClick   True when handling a click on "Previous" link.
   * @returns {undefined}
   */
  function autoPageUp(fromClick) {
    // if (me.prevLink.disabled || me.prevLink.disabled === undefined) return;
    if (context != "genie" || pui.usingGenieHandler) {
      // pui.attachResponse/clickEvent handles pageUp for clicks when "page up response" is defined.
      // pageUpHotKeyDefined can be true even if "page up response" is undefined,
      // so we must handle clicks when "page up response" is not defined.
      // pui.handleHotKey handles PageUp key when the grid is paging type.
      if (me.pageUpHotKeyDefined && (!fromClick || me.pageUpResponseDefined)) return;
      if (me.grid.designMode) return;
      if (me.grid.atTop()) return;
    }
    me.grid.pageUp();
  }

  /**
   * Handle the "Next" paging control and PageDown key for Genie, scrolling
   * grids, and some paging grids.
   * @param {boolean} fromClick    True when handling a click on "Next" link.
   * @returns {undefined}
   */
  function autoPageDown(fromClick) {
    // if (me.nextLink.disabled || me.nextLink.disabled === undefined) return;
    if (context != "genie" || pui.usingGenieHandler) {
      if (me.pageDownHotKeyDefined && (!fromClick || me.pageDownResponseDefined)) return;
      if (me.grid.designMode) return;
      if (me.grid.atBottom()) return;
    }
    me.grid.pageDown();
  }

  this.init = function() {
    div = document.createElement("div");
    div.style.position = "absolute";
    div.style.backgroundRepeat = "repeat-x";
    div.style.textAlign = "center";
    div.style.paddingTop = "5px";
    div.style.overflow = "hidden";
    div.onselectstart = function(e) {
      return false;
    };
    if (typeof div.style.MozUserSelect != "undefined") div.style.MozUserSelect = "none";

    me.container.appendChild(div);

    me._tempStatusDiv = document.createElement("div"); // An element that is shown temporarily for feedback.
    me._tempStatusDiv.className = "tempStatus";
    me._tempStatusDiv.innerHTML = "<span></span><span></span>";
    me._tempStatusDiv.addEventListener("click", me);
    div.appendChild(me._tempStatusDiv);

    exportImg = document.createElement("div");
    exportImg.style.cursor = "pointer";
    exportImg.style.position = "absolute";
    exportImg.style.top = "4px";
    exportImg.style.left = "4px";
    exportImg.style.height = "14px";
    exportImg.style.padding = "1px";
    exportImg.style.width = "14px";
    exportImg.onclick = function() {
      if (me.grid.designMode) return;
      me.grid.exportCSV();
    };
    pui.addCssClass(exportImg, "export-image-icon");
    pui.addCssClass(exportImg, "csv-export-image-icon");
    div.appendChild(exportImg);

    exportLink = document.createElement("span");
    exportLink.innerHTML = pui["getLanguageText"]("runtimeText", "excel export text");
    exportLink.style.position = "absolute";
    exportLink.style.top = "5px";
    exportLink.style.left = "24px";
    exportLink.style.textDecoration = "underline";
    exportLink.style.cursor = "pointer";
    exportLink.onclick = function() {
      if (me.grid.designMode) return;
      me.grid.exportCSV();
    };
    exportLink.className = "paging-link csv-paging-link";
    div.appendChild(exportLink);

    exportImgXLSX = document.createElement("div");
    exportImgXLSX.style.cursor = "pointer";
    exportImgXLSX.style.position = "absolute";
    exportImgXLSX.style.top = "4px";
    exportImgXLSX.style.left = "4px"; // When both links are on, this changes.
    exportImgXLSX.style.height = "14px";
    exportImgXLSX.style.padding = "1px";
    exportImgXLSX.style.width = "14px";
    exportImgXLSX.onclick = function() {
      if (me.grid.designMode) return;
      me.grid.exportCSV(null, true);
    };
    pui.addCssClass(exportImgXLSX, "export-image-icon");
    pui.addCssClass(exportImgXLSX, "xlsx-export-image-icon");
    div.appendChild(exportImgXLSX);

    exportLinkXLSX = document.createElement("span");
    // Show "Export to Excel" when only XLSX is enabled. If both XLSX and CSV are enabled, show "Export to Excel XLSX".
    exportLinkXLSX.innerHTML = pui["getLanguageText"]("runtimeText", "export to x", ["XLSX"]);
    exportLinkXLSX.style.position = "absolute";
    exportLinkXLSX.style.top = "5px";
    exportLinkXLSX.style.left = "24px";
    exportLinkXLSX.style.textDecoration = "underline";
    exportLinkXLSX.style.cursor = "pointer";
    exportLinkXLSX.onclick = function() {
      if (me.grid.designMode) return;
      me.grid.exportCSV(null, true);
    };
    exportLinkXLSX.className = "paging-link xlsx-paging-link";
    div.appendChild(exportLinkXLSX);

    me.prevImg = document.createElement("div");
    me.prevImg.className = "prev-image-icon";
    me.prevImg.style.verticalAlign = "top";
    me.prevImg.style.display = "inline-block";
    me.prevImg.style.height = "16px";
    me.prevImg.style.width = "16px";
    me.prevImg.shortcutKey = "PageUp";
    me.prevImg.responseValue = "0";
    me.prevImg.parentPagingBar = me;
    me.prevImg.prevPage = true;
    me.prevImg.onmouseover = function() {
      if (me.prevImg.disabled) return;
      pui.addCssClass(me.prevLink, "paging-link-hover");
    };
    me.prevImg.onmouseout = function() {
      if (me.prevImg.disabled) return;
      pui.removeCssClass(me.prevLink, "paging-link-hover");
    };
    me.prevImg.onclick = function() {
      autoPageUp(true);
    };
    div.appendChild(me.prevImg);

    me.prevLink = document.createElement("span");
    me.prevLink.innerHTML = pui["getLanguageText"]("runtimeText", "previous link text");
    me.prevLink.href = "javascript:void(0)";
    me.prevLink.style.verticalAlign = "top";
    me.prevLink.shortcutKey = "PageUp";
    me.prevLink.responseValue = "0";
    me.prevLink.parentPagingBar = me;
    me.prevLink.prevPage = true;
    me.prevLink.onmouseover = function() {
      if (me.prevLink.disabled) {
        return;
      }
      pui.addCssClass(me.prevLink, "paging-link-hover");
    };
    me.prevLink.onmouseout = function() {
      if (me.prevLink.disabled) {
        return;
      }
      pui.removeCssClass(me.prevLink, "paging-link-hover");
    };
    me.prevLink.onclick = function() {
      autoPageUp(true);
    };
    me.prevLink.className = "paging-link previous-paging-link";
    div.appendChild(me.prevLink);

    spacesSpan1 = document.createElement("span");
    spacesSpan1.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
    div.appendChild(spacesSpan1);

    pageSpan = document.createElement("span");
    pageSpan.style.fontFamily = "Arial";
    pageSpan.style.fontSize = "11px";
    pageSpan.style.fontWeight = "bold";
    pageSpan.style.verticalAlign = "top";
    pageSpan.className = "paging-number";
    div.appendChild(pageSpan);

    spacesSpan2 = document.createElement("span");
    spacesSpan2.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
    div.appendChild(spacesSpan2);

    rcdNbrRangeSpan = document.createElement("span");
    rcdNbrRangeSpan.style.fontFamily = "Arial";
    rcdNbrRangeSpan.style.fontSize = "11px";
    rcdNbrRangeSpan.style.fontWeight = "bold";
    rcdNbrRangeSpan.style.verticalAlign = "top";
    rcdNbrRangeSpan.className = "paging-number";
    div.appendChild(rcdNbrRangeSpan);

    spacesSpan2 = document.createElement("span");
    spacesSpan2.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
    div.appendChild(spacesSpan2);

    me.nextLink = document.createElement("span");
    me.nextLink.innerHTML = pui["getLanguageText"]("runtimeText", "next link text");
    me.nextLink.href = "javascript:void(0)";
    me.nextLink.style.verticalAlign = "top";
    me.nextLink.shortcutKey = "PageDown";
    me.nextLink.responseValue = "0";
    me.nextLink.parentPagingBar = me;
    me.nextLink.nextPage = true;
    me.nextLink.onmouseover = function() {
      if (me.nextLink.disabled) return;
      pui.addCssClass(me.nextLink, "paging-link-hover");
    };
    me.nextLink.onmouseout = function() {
      if (me.nextLink.disabled) return;
      pui.removeCssClass(me.nextLink, "paging-link-hover");
    };
    me.nextLink.onclick = function() {
      autoPageDown(true);
    };
    me.nextLink.className = "paging-link next-paging-link";
    div.appendChild(me.nextLink);

    me.nextImg = document.createElement("div");
    me.nextImg.className = "next-image-icon";
    me.nextImg.style.verticalAlign = "top";
    me.nextImg.style.display = "inline-block";
    me.nextImg.style.height = "16px";
    me.nextImg.style.width = "16px";
    me.nextImg.shortcutKey = "PageDown";
    me.nextImg.responseValue = "0";
    me.nextImg.parentPagingBar = me;
    me.nextImg.nextPage = true;
    me.nextImg.onmouseover = function() {
      if (me.nextImg.disabled) return;
      pui.addCssClass(me.nextLink, "paging-link-hover");
    };
    me.nextImg.onmouseout = function() {
      if (me.nextImg.disabled) return;
      pui.removeCssClass(me.nextLink, "paging-link-hover");
    };
    me.nextImg.onclick = function() {
      autoPageDown(true);
    };
    div.appendChild(me.nextImg);

    if (!me.pageDownResponseDefined || !me.pageUpResponseDefined) {
      pui.autoPageGrid = true;
    }

    // HACK:   Both this (handleKeyDown) and pui.handleHotKey (in dspf/render.js) fire
    //         for PageUp/PageDown.  (Even if not using a scrollbar rather than the
    //         paging bar!) Therefore, if PageUp/PageDown are defined as hot keys, then
    //         pui.handleHotKey handles them, and the autoPageUp/autoPageDown routines
    //         (called below) will ignore them. If they are not hot keys (i.e. not in
    //         pui.keyMap[]) then this routine handles them, and pui.handleHotKey
    //         does not do pageup/pagedown within the grid's data array, but it
    //         still handles submitting to the RPG program when the top/bottom of
    //         the grid is reached. This approach is confusing, and should probably
    //         fixed up to be handled solely by the pui.handleHotKey routine.  -SK
    if (!me.grid.designMode && pui.runtimeContainer != null && div != null && div.parentNode != null) {
      function handleKeyDown(e) {
        if (div == null || div.parentNode == null) {
          removeEvent(pui.runtimeContainer, "keydown", handleKeyDown);
          return;
        }
      	if (!e) e = window.event;
        var key = e.keyCode;
        if (key == 33) autoPageUp();
        if (key == 34) autoPageDown();
      }
      addEvent(pui.runtimeContainer, "keydown", handleKeyDown);
    }

    function mousedown(event) {
      if (!me.grid.designMode) return;
      me.grid.tableDiv.designItem.designer.hideDialogs();
      me.grid.selectMe();

      if (pui.isRightClick(event)) {
        if (me.grid.tableDiv.designItem) {
          me.grid.tableDiv.designItem.designer.globalRightClickMenu.hide();
          me.grid.tableDiv.designItem.designer.showContextMenu(event);
        }
        designUtils.preventEvent(event);
        if (event.stopPropagation) event.stopPropagation();
        return false;
      }
      if (me.grid.tableDiv.designItem != null && me.grid.tableDiv.designItem.designer.rightClickMenu != null) {
        me.grid.tableDiv.designItem.designer.rightClickMenu.hide();
      }

      if (me.lockedInPlace) {
        designUtils.preventEvent(event);
        return;
      }

      var cursorStartX = getMouseX(event);
      var cursorStartY = getMouseY(event);
      var startGridX = parseInt(me.grid.tableDiv.style.left);
      var startGridY = parseInt(me.grid.tableDiv.style.top);
      me.grid.doThisToTableDivs(function(domObj) {
        domObj.startLeft = parseInt(domObj.style.left);
        domObj.startTop = parseInt(domObj.style.top);
      });
      function mousemove(event) {
        var y = getMouseY(event) - cursorStartY;
        var x = getMouseX(event) - cursorStartX;
        var designItem = me.grid.tableDiv.designItem;
        if (designItem != null) {
          var selection = designItem.designer.selection;
          if (selection.snapToGrid) {
            x += me.grid.tableDiv.startLeft;
            y += me.grid.tableDiv.startTop;
            x = selection.snap(x, pui.multX);
            y = selection.snap(y, pui.multY, (context == "genie" ? 3 : 0));
            x -= me.grid.tableDiv.startLeft;
            y -= me.grid.tableDiv.startTop;
          }
        }
        me.grid.doThisToTableDivs(function(domObj) {
          domObj.style.top = (domObj.startTop + y) + "px";
          domObj.style.left = (domObj.startLeft + x) + "px";
        });
        if (designItem != null) designItem.moved = true;
        me.grid.setScrollBar();
        var psBar = pui.designer.psBar;
        if (psBar.container == null) {
          psBar.container = document.body;
          psBar.init();
        }
        psBar.set(me.grid.tableDiv.designItem);
        psBar.show();
      }
      function mouseup() {
        if (me.grid.tableDiv.designItem != null) {
          if (me.grid.tableDiv.designItem.moved) {
            me.grid.tableDiv.designItem.designer.addSelectionToTabs();
            if (context == "dspf") pui.ide.refreshRibbon();
          }
          else {
            me.grid.tableDiv.designItem.designer.undo.removeLastGroup();
          }
        }
        me.grid.sendToDesigner();
        var psBar = pui.designer.psBar;
        if (psBar != null && psBar.container != null) psBar.hide();
        removeEvent(document, "mousemove", mousemove);
        removeEvent(document, "mouseup", mouseup);
      }
      addEvent(document, "mousemove", mousemove);
      addEvent(document, "mouseup", mouseup);
      preventEvent(event);
      if (me.grid.designMode && me.grid.tableDiv.designItem != null) {
        me.grid.tableDiv.designItem.moved = false;
        var designer = me.grid.tableDiv.designItem.designer;
        var selection = designer.selection;
        var undoText = "Move Selection";
        if (selection.resizers.length == 1) undoText = "Move Grid";
        designer.undo.start(undoText);
        designer.undo.noRefresh = true;
        selection.addToUndo(["left", "top", "parent tab panel", "parent tab panel"]);
        designer.undo.noRefresh = false;
      }
    }
    addEvent(div, "mousedown", mousedown);
  };

  this.position = function() {
    if ((me.csvExport || me.xlsxExport || me.showPagingControls || me.showPageNumber || me.showRecordNumberRange || me.showBar) &&
        me.grid.tableDiv.style.display != "none" && me.grid.tableDiv.style.visibility != "hidden") {
      div.style.left = me.x + "px";
      div.style.top = me.y + "px";
      div.style.width = me.width + "px";
      div.style.display = "";
      div.style.zIndex = me.grid.tableDiv.style.zIndex;
    }
    else {
      div.style.display = "none";
    }
  };

  this.hide = function() {
    div.style.display = "none";
  };

  this.destroy = function() {
    me._tempStatusDiv.removeEventListener("click", me);
    div.innerHTML = "";
    if (div.parentNode != null) div.parentNode.removeChild(div);
    div = null;
    exportImg = null;
    exportLink = null;
    exportImgXLSX = null;
    exportLinkXLSX = null;
    spacesSpan1 = null;
    spacesSpan2 = null;
    pageSpan = null;
    rcdNbrRangeSpan = null;
    me.deleteOwnProperties();
    me = null;
  };

  this.setClassName = function(cssClass) {
    // two classes are actually assigned here (grid specific and generic)
    // for example, the className may look like this: "crystal-grid-paging-bar paging-bar"
    if (div == null) return;
    if (cssClass == null) cssClass = "";
    cssClass = trim(cssClass);
    if (cssClass != "") {
      cssClass = cssClass.split(" ").shift();
      cssClass += "-paging-bar";
    }
    cssClass += " paging-bar";
    cssClass = trim(cssClass);
    if (div.className != cssClass) div.className = cssClass;
  };

  this.draw = function() {
    me._tempStatusDiv.style.display = "none"; // By default, the temporary status div should not be visible.

    me.setClassName(me.grid.tableDiv.className);

    if ((me.csvExport || me.xlsxExport || me.showPagingControls || me.showPageNumber || me.showRecordNumberRange || me.showBar) &&
        me.grid.tableDiv.style.display != "none" && me.grid.tableDiv.style.visibility != "hidden") {
      me.position();

      var disp = me.csvExport ? "" : "none";
      exportImg.style.display = disp;
      exportLink.style.display = disp;

      disp = me.xlsxExport ? "" : "none";
      exportImgXLSX.style.display = disp;
      exportLinkXLSX.style.display = disp;

      // If both XLSX export and CSV export are set, use different text, and different position for XLSX link.
      if (me.xlsxExport && me.csvExport) {
        exportLink.innerHTML = pui["getLanguageText"]("runtimeText", "export to x", ["Excel CSV"]);
        exportLinkXLSX.innerHTML = pui["getLanguageText"]("runtimeText", "export to x", ["Excel XLSX"]);
        exportImgXLSX.style.left = "160px";
        exportLinkXLSX.style.left = "180px";

        // The paging links, page number may be too far left for all text; or the grid may not be wide enough.
        var leftcomp = exportLinkXLSX.parentNode.offsetWidth;
        var parentWidth = leftcomp;
        var rightComp = leftcomp;
        if (me.showPagingControls) {
          leftcomp = me.prevImg.offsetLeft;
          rightComp = me.nextImg.offsetLeft + me.nextImg.offsetWidth;
        }
        else if (me.showPageNumber) {
          leftcomp = pageSpan.offsetLeft;
          rightComp = pageSpan.offsetLeft + pageSpan.offsetWidth;
        }
        else if (me.showRecordNumberRange) {
          leftcomp = rcdNbrRangeSpan.offsetLeft;
          rightComp = rcdNbrRangeSpan.offsetLeft + rcdNbrRangeSpan.offsetWidth;
        };

        if (exportLinkXLSX.offsetLeft + exportLinkXLSX.offsetWidth > leftcomp || rightComp > parentWidth) {
          // The text runs over, so use less.
          exportLink.innerHTML = pui["getLanguageText"]("runtimeText", "export to x", ["CSV"]);
          exportLinkXLSX.innerHTML = pui["getLanguageText"]("runtimeText", "export to x", ["XLSX"]);
          exportImgXLSX.style.left = "122px";
          exportLinkXLSX.style.left = "144px";
          if (me.showPagingControls) rightComp = me.nextImg.offsetLeft + me.nextImg.offsetWidth;
          else if (me.showPagingControls) rightComp = pageSpan.offsetLeft + pageSpan.offsetWidth;
          if (exportLinkXLSX.offsetLeft + exportLinkXLSX.offsetWidth > leftcomp || rightComp > parentWidth) {
            // The text still runs over, so use less.
            exportLinkXLSX.innerHTML = "XLSX";
            exportImgXLSX.style.left = "124px";
            exportLinkXLSX.style.left = "144px";
            if (me.showPagingControls) rightComp = me.nextImg.offsetLeft + me.nextImg.offsetWidth;
            else if (me.showPagingControls) rightComp = pageSpan.offsetLeft + pageSpan.offsetWidth;
            if (exportLinkXLSX.offsetLeft + exportLinkXLSX.offsetWidth > leftcomp || rightComp > parentWidth) {
              // The text still runs over, so use less.
              exportLink.innerHTML = "CSV";
              exportImgXLSX.style.left = "60px";
              exportLinkXLSX.style.left = "80px";
            }
          }
        }
      }
      else {
        // Only one export option is on; just show "Export to Excel" for whichever is on.
        exportLink.innerHTML = pui["getLanguageText"]("runtimeText", "excel export text");
        exportLinkXLSX.innerHTML = pui["getLanguageText"]("runtimeText", "excel export text");
        exportImgXLSX.style.left = "4px";
        exportLinkXLSX.style.left = "24px";
      }

      if (me.showPagingControls) {
        me.prevImg.style.display = "inline-block";
        me.prevLink.style.display = "";
        me.nextImg.style.display = "inline-block";
        me.nextLink.style.display = "";
        me.prevImg.disabled = false;
        me.prevLink.disabled = false;
        me.nextImg.disabled = false;
        me.nextLink.disabled = false;

        if (context != "genie") {
          if (!me.grid.designMode && me.grid.atTop() && (me.pageUpCondition == "false" || !me.pageUpResponseDefined)) {
            me.prevImg.disabled = true;
            me.prevLink.disabled = true;
            pui.addCssClass(me.prevLink, "paging-link-disabled");
            pui.addCssClass(me.prevImg, "prev-image-icon-disabled");
          }
          else {
            pui.removeCssClass(me.prevLink, "paging-link-disabled");
            pui.removeCssClass(me.prevImg, "prev-image-icon-disabled");
          }

          if (!me.grid.designMode && me.grid.atBottom() &&
               ((me.grid.subfileEnd && pui["page down on subfile end"] != true) || me.pageDownCondition == "false" || !me.pageDownResponseDefined)) {
            me.nextImg.disabled = true;
            me.nextLink.disabled = true;
            pui.addCssClass(me.nextLink, "paging-link-disabled");
            pui.addCssClass(me.nextImg, "next-image-icon-disabled");
          }
          else {
            pui.removeCssClass(me.nextLink, "paging-link-disabled");
            pui.removeCssClass(me.nextImg, "next-image-icon-disabled");
          }
        }
      }
      else {
        me.prevImg.style.display = "none";
        me.prevLink.style.display = "none";
        me.nextImg.style.display = "none";
        me.nextLink.style.display = "none";
      }

      if (me.showPageNumber) {
        pageSpan.style.display = "";
        pageSpan.innerHTML = pui["getLanguageText"]("runtimeText", "page") + " " + me.pageNumber;
      }
      else {
        pageSpan.style.display = "none";
      }

      if (me.showRecordNumberRange) {
        var myGrid = me.grid;
        var myRecordCound = myGrid["getRecordCount"]();
        if (myGrid.designMode) {
          myGrid.firstDisplayedRRN = 1;
          myGrid.lastDisplayedRRN = myGrid.getSubfilePage();
          myRecordCound = myGrid.lastDisplayedRRN;
        }
        rcdNbrRangeSpan.style.display = "";
        rcdNbrRangeSpan.innerHTML = "Showing " + myGrid.firstDisplayedRRN + "-" +
          myGrid.lastDisplayedRRN + " of " + myRecordCound;
      }
      else {
        rcdNbrRangeSpan.style.display = "none";
      }
    }

    else {
      div.style.display = "none";
    }
  };

  this.changeContainer = function(newContainer) {
    me.container = newContainer;
    div.parentNode.removeChild(div);
    me.container.appendChild(div);
  };

  this.getHeight = function() {
    return div.offsetHeight;
  };

  /**
   * Show the temporary status div and hide everything else in the PagingBar.
   * @param {undefined|String} onHideText  Text that is displayed after the temporary status DIV is clicked
   *                                       or hideTempStatus is called; e.g. "Cancelled".
   * @param {undefined|String} clickCb     Function called after the temporary status DIV is clicked; e.g. abort download.
   */
  this.showTempStatusDiv = function(onHideText, clickCb) {
    exportImg.style.display = "none";
    exportLink.style.display = "none";
    exportImgXLSX.style.display = "none";
    exportLinkXLSX.style.display = "none";

    me.prevImg.style.display = "none";
    me.prevLink.style.display = "none";
    me.nextImg.style.display = "none";
    me.nextLink.style.display = "none";
    pageSpan.style.display = "none";

    me._tempDelayedHideText = onHideText;
    me._tempDelayedHideCb = clickCb;
    me._tempStatusDiv.style.cursor = "pointer";
    me._tempStatusDiv.style.display = "block";
  };

  /**
   * Attach Grids Drag-n-Drop events to this PagingBar.
   * @param {Function} dragDropCallback
   * @returns {undefined}
   */
  this.attachDragDropEvents = function(dragDropCallback) {
    dragDropCallback(div);
  };
};
pui.PagingBar.prototype = Object.create(pui.BaseClass.prototype);

/**
 * @param {String} text
 * @param {String} className
 */
pui.PagingBar.prototype.setTempStatusIcon = function(text, className) {
  var span = this._tempStatusDiv.childNodes[0];
  span.className = className;
  span.innerHTML = text;
};

/**
 * Set the text on the temporary status div. Called by the grid.
 * @param {String} text
 */
pui.PagingBar.prototype.setTempStatus = function(text) {
  this._tempStatusDiv.childNodes[1].innerHTML = text;
};

/**
 * @param {Event} e
 */
pui.PagingBar.prototype["handleEvent"] = function(e) {
  switch (e.type) {
    case "click":
      if (e.target == this._tempStatusDiv || e.target.parentNode == this._tempStatusDiv) {
        // The temp status bar or the [x] icon was clicked, so hide the bar.
        this.hideTempStatusSlowly();
      }
      break;
  }
};

/**
 * Hide the temp status DIV after a delay. The DIV should have CSS transition defined for opacity, making a slow fade.
 */
pui.PagingBar.prototype.hideTempStatusSlowly = function() {
  this._tempStatusDiv.style.cursor = "";
  this._tempStatusDiv.style.opacity = "0";
  this.setTempStatusIcon("", "");
  if (this._tempDelayedHideText != null) this.setTempStatus(this._tempDelayedHideText);
  if (typeof this._tempDelayedHideCb == "function") this._tempDelayedHideCb();
  var delayedHide = function() {
    this.draw();
    this._tempStatusDiv.style.opacity = "";
  };
  setTimeout(delayedHide.bind(this), 2500);
};

/**
 * Implement a method called by pui.xlsx_drawing when downloading images and pui.xlsx_workbook when downloading DBD-data or compressing large files.
 * @param {String} str
 */
pui.PagingBar.prototype.setDownloadStatus = function(str) {
  this.setTempStatus(str);
};

/**
 * Implement a method called by pui.xlsx_workbook called when the download process is finished--the browser prompted the user to download.
 */
pui.PagingBar.prototype.fireDownloadCleanup = function() {
  this.draw();
};
