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
 * SignaturePad Class
 * @constructor
 */

pui.SignaturePad = function() {
  var me = this;
  var canvasContext;
  var canvas;
  var previous = {};
  var strokes = [];
  var clearBox;
  var moveBox;

  this.container = null;
  this.className = "pui-signature-pad-canvas";
  this.designMode = false;
  this.designItem = null;

  function setContext() {
    if (canvas.getContext == null) return;
    canvasContext = canvas.getContext("2d");
    if (canvasContext == null) return;
    if (me.color != null) canvasContext.strokeStyle = me.color;
    if (me.backgroundColor != null) {
      canvas.style.backgroundColor = me.backgroundColor;
      canvasContext.fillStyle = me.backgroundColor;
      canvasContext.fillRect(0, 0, me.container.offsetWidth, me.container.offsetHeight);
    }
    canvasContext.lineJoin = "round";
    canvasContext.lineWidth = 5;
  }

  function drawLine(x1, y1, x2, y2) {
    if (canvasContext == null) return;
    if (x2 == null && y2 == null) {
      canvasContext.lineTo(x1, y1);
    }
    else {
      canvasContext.moveTo(x1, y1);
      canvasContext.lineTo(x2, y2);
    }
    canvasContext.stroke();
  }

  function setModified() {
    me.container.modified = true;
    pui.updateReactState(me.container);
  }

  function startDrawing(event) {
    if (me.readOnly || me.disabled) return;

    if (canvasContext == null) return;

    // Make sure signature location is correct when designer canvas is zoomed.
    var zoomFactor = 1;
    if (context == "dspf" && toolbar && toolbar.designer && toolbar.designer.container) zoomFactor = toolbar.zoomFactor;

    var offset = pui.getOffset(me.container, true);

    var touchEvent = false;
    if (event != null && event.touches != null) {
      if (event.touches.length != 1) {
        return;
      }
      touchEvent = true;
    }

    strokes.push([]); // new stroke
    previous.x = (getMouseX(event) - offset[0]) * zoomFactor;
    previous.y = (getMouseY(event) - offset[1]) * zoomFactor;
    canvasContext.beginPath();
    drawLine(previous.x, previous.y, previous.x, previous.y);
    var stroke = strokes[strokes.length - 1];
    stroke.push(previous.x);
    stroke.push(previous.y);
    setModified();

    function keepDrawing(event) {
      if (me.readOnly || me.disabled) return;

      if (event != null && event.touches != null) {
        if (event.touches.length != 1) {
          return;
        }
      }

      var x = (getMouseX(event) - offset[0]) * zoomFactor;
      var y = (getMouseY(event) - offset[1]) * zoomFactor;

      // drawLine(previous.x, previous.y, x, y);
      drawLine(x, y);

      var stroke = strokes[strokes.length - 1];
      stroke.push(x);
      stroke.push(y);

      previous.x = x;
      previous.y = y;
    }

    function stopDrawing() {
      canvasContext.closePath();
      if (touchEvent) {
        removeEvent(canvas, "touchmove", keepDrawing);
        removeEvent(canvas, "touchend", stopDrawing);
        removeEvent(document, "touchend", stopDrawing);
      }
      else {
        removeEvent(canvas, "mousemove", keepDrawing);
        removeEvent(canvas, "mouseup", stopDrawing);
        removeEvent(document, "mouseup", stopDrawing);
      }
      pui.updateReactState(me.container);
    }

    if (pui.isRightClick(event)) {
      return;
    }

    if (touchEvent) {
      addEvent(canvas, "touchmove", keepDrawing);
      addEvent(canvas, "touchend", stopDrawing);
      addEvent(document, "touchend", stopDrawing);
    }
    else {
      addEvent(canvas, "mousemove", keepDrawing);
      addEvent(canvas, "mouseup", stopDrawing);
      addEvent(document, "mouseup", stopDrawing);
    }

    if (me.designMode && !me.designItem.isSelected()) {
      // select widget
      var designer = me.designItem.designer;
      var selection = designer.selection;
      selection.clear();
      selection.add(me.designItem);
      designer.propWindow.refresh();
    }

    preventEvent(event);
    return false;
  }

  this.init = function() {
    me.container.innerHTML = "";
    me.container.className = "pui-signature-pad-container";
    canvas = document.createElement("canvas");
    if (!me.designMode) canvas.innerHTML = "Your browser does not support HTML5 Canvas.<br/>Signature pad widget will not function.";
    me.container.appendChild(canvas);
    clearBox = document.createElement("div");
    clearBox.className = "pui-signature-pad-clear-box";
    clearBox.innerHTML = "Clear";
    clearBox.onmousedown = function(e) {
      preventEvent(e);
      return false;
    };
    clearBox.onclick = function(e) {
      me.clear();
      setModified();
    };
    me.container.appendChild(clearBox);
    if (me.designMode) {
      moveBox = document.createElement("div");
      moveBox.className = "pui-signature-pad-move-box";
      moveBox.innerHTML = "Move";
      me.container.appendChild(moveBox);
    }
    me.resize();
    // In case the canvas is in an IScroll, prevent the IScroll from handling the event.
    // pointerdown is captured before mousedown, making IScroll scroll. #6640.
    canvas.addEventListener("pointerdown", function(e) {
      e.stopPropagation();
    });

    addEvent(canvas, "mousedown", startDrawing);
    addEvent(canvas, "touchstart", startDrawing);
    addEvent(me.container, "dblclick", function(e) {
      if (me.designMode) {
        var propWindow = me.designItem.designer.propWindow;
        propWindow.setActiveProperty("value", null, true, e);
        propWindow.bindingDialog.selectField();
      }
    });
    if (me.designMode) {
      if (pui["is_chrome"] || (pui["is_old_ie"] && pui["ie_mode"] < 10)) {
        // chrome has strange rendering issues when trying to move canvas element in the designer
        // ie6,7,8,9 do not support canvas
        canvas.style.display = "none";
        moveBox.style.display = "none";
      }
    }
  };

  this.resize = function(dontClear) {
    canvas.style.width = me.container.offsetWidth + "px";
    canvas.style.height = me.container.offsetHeight + "px";
    canvas.setAttribute("width", me.container.offsetWidth);
    canvas.setAttribute("height", me.container.offsetHeight);
    setContext();
    if (dontClear == true) me.redraw();
    else strokes = [];
  };

  this.clear = function() {
    if (canvasContext != null) canvasContext.clearRect(0, 0, me.container.offsetWidth, me.container.offsetHeight);
    me.resize();
  };

  this.setColor = function(color) {
    me.color = color;
    setContext();
  };

  this.setBackgroundColor = function(color) {
    me.backgroundColor = color;
    setContext();
  };

  this.showOrHideClearBox = function() {
    if (me.readOnly || me.disabled) clearBox.style.visibility = "hidden";
    else clearBox.style.visibility = "";
  };

  this.getValue = function() {
    var json = "[";
    for (var i = 0; i < strokes.length; i++) {
      var points = strokes[i];
      if (i > 0) json += ",";
      json += "[";
      for (j = 0; j < points.length; j++) {
        if (j > 0) json += ",";
        json += points[j];
      }
      json += "]";
    }
    json += "]";
    return json;
  };

  this.setValue = function(value) {
    me.clear();
    if (value.length < 5 || value.substr(0, 2) != "[[" || value.substr(value.length - 2, 2) != "]]") {
      return;
    }
    try {
      strokes = eval("(" + value + ")");
    }
    catch (e) { };
    me.redraw();
  };

  this.redraw = function() {
    if (canvasContext == null) return;
    canvasContext.beginPath();
    for (var i = 0; i < strokes.length; i++) {
      var points = strokes[i];
      for (var j = 0; j < points.length; j += 2) {
        if (j + 1 > points.length) break; // point values should come as x,y pairs
        var prevIndex = j - 2;
        if (prevIndex < 0) prevIndex = 0;
        var x1 = points[prevIndex];
        var y1 = points[prevIndex + 1];
        var x2 = points[j];
        var y2 = points[j + 1];
        drawLine(x1, y1, x2, y2);
      }
    }
    canvasContext.closePath();
  };
};

pui.widgets.add({
  name: "signature pad",
  defaults: {
    "height": "150px",
    "width": "450px",
    "css class": "pui-signature-pad-container",
    "background color": "#ffffff" // default background for canvas
  },

  propertySetters: {

    "field type": function(parms) {
      if (parms.dom.signaturePad == null) {
        parms.dom.signaturePad = new pui.SignaturePad();
        parms.dom.signaturePad.container = parms.dom;
        parms.dom.signaturePad.designMode = parms.design;
        if (parms.design) parms.dom.signaturePad.designItem = parms.designItem;
        parms.dom.signaturePad.init();
        parms.dom.sizeMe = function() {
          parms.dom.signaturePad.resize(true);
        };
        parms.dom.alwaysSizeMe = true; // Ensure that the widget can be used in tab layout tabs other than the first. #6423.
      }
    },

    "value": function(parms) {
      if (!parms.design) {
        setTimeout(function() {
          parms.dom.signaturePad.setValue(parms.value);
        }, 0);
      }
    },

    "color": function(parms) {
      parms.dom.signaturePad.setColor(parms.value);
    },

    "read only": function(parms) {
      if (parms.value == true || parms.value == "true") {
        parms.dom.signaturePad.readOnly = true;
      }
      else {
        parms.dom.signaturePad.readOnly = false;
      }
      parms.dom.signaturePad.showOrHideClearBox();
    },

    "disabled": function(parms) {
      if (parms.value == true || parms.value == "true") {
        parms.dom.signaturePad.disabled = true;
      }
      else {
        parms.dom.signaturePad.disabled = false;
      }
      parms.dom.signaturePad.showOrHideClearBox();
    },

    "width": function(parms) {
      parms.dom.style.width = parms.value;
      parms.dom.signaturePad.resize();
    },

    "height": function(parms) {
      parms.dom.style.height = parms.value;
      parms.dom.signaturePad.resize();
    },

    "background color": function(parms) {
      parms.dom.signaturePad.setBackgroundColor(parms.value);
    }
  }

});
