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

pui.setupMobileEmulator = function() {
  var puiDiv = getObj("pui");
  if (puiDiv == null) return;
  var mobileDiv = document.createElement("div");

  var canvasSizeArray = pui.canvasSize.split("x");
  var curHeight = Number(canvasSizeArray[1]);
  if (isNaN(curHeight)) curHeight = 320;
  var curWidth = Number(canvasSizeArray[0]);
  if (isNaN(curWidth)) curWidth = 640;

  mobileDiv.style.position = "absolute";
  mobileDiv.isCanvasOutline = true;
  mobileDiv.style.border = "2px solid #999999";
  mobileDiv.style.backgroundColor = "#333333";
  mobileDiv.style.borderRadius = "15px";
  mobileDiv.style.boxShadow = "6px 6px 12px rgba(50, 66, 64, 0.67)";
  mobileDiv.style.width = (curWidth + 60) + "px";
  mobileDiv.style.height = (curHeight + 60) + "px";
  mobileDiv.style.top = "40px";
  mobileDiv.style.left = "20px";

  puiDiv.style.width = curWidth + "px";
  puiDiv.style.height = curHeight + "px";
  puiDiv.style.left = "50px";
  puiDiv.style.top = "70px";
  puiDiv.classList.add("pui-mobile-emulator");

  puiDiv.parentNode.insertBefore(mobileDiv, puiDiv);

  var dropdown = document.createElement("select");
  dropdown.style.position = "absolute";
  dropdown.style.width = "200px";
  dropdown.style.top = "10px";
  dropdown.style.left = "50px";
  dropdown.style.fontFamily = "sans-serif";
  dropdown.style.fontSize = "13px";

  function fillDropdown() {
    var i; // loop iterator
    var x;
    for (i = dropdown.options.length - 1; i >= 0; i--) {
      dropdown.remove(i);
    }
    var currentSizeExists = false;
    for (i = 0; i < pui.mobileEmulatorSizes.length; i++) {
      var size = pui.mobileEmulatorSizes[i];
      if (size["height"] == null) continue;
      if (size["width"] == null) continue;
      x = dropdown.options.length;
      dropdown.options[x] = new Option(size["description"], size["height"] + "x" + size["width"]);
      if ((size["height"] == curHeight && size["width"] == curWidth) ||
           (size["width"] == curHeight && size["height"] == curWidth)) {
        dropdown.options[x].selected = true;
        currentSizeExists = true;
      }
    }
    if (!currentSizeExists) {
      x = dropdown.options.length;
      dropdown.options[x] = new Option(curHeight + " x " + curWidth, curHeight + "x" + curWidth);
      dropdown.options[x].selected = true;
    }
  }

  fillDropdown();

  ajaxJSON({
    "url": getProgramURL("PUI0009112.pgm"),
    "method": "post",
    "params": {
      "workspace_id": pui["isCloud"] ? pui.cloud.ws.id : ""
    },
    "suppressAlert": true,
    "handler": function(response) {
      if (response["success"] != true) {
        if (response["message"] != null) pui.alert(response["message"]);
        else pui.alert("Error occurred while loading canvas sizes.");
      }
      else {
        var sizes = response["sizes"];
        if (sizes != null && sizes != "") {
          pui.mobileEmulatorSizes = eval(sizes);
          fillDropdown();
        }
      }
    },
    "onfail": function(response) {
      pui.alert("Error occurred while loading canvas sizes.");
    }
  });

  dropdown.onchange = function() {
    var sizeArray = dropdown.value.split("x");
    curHeight = Number(sizeArray[1]);
    if (isNaN(curHeight)) curHeight = 320;
    curWidth = Number(sizeArray[0]);
    if (isNaN(curWidth)) curWidth = 640;
    mobileDiv.style.width = (curWidth + 60) + "px";
    mobileDiv.style.height = (curHeight + 60) + "px";
    puiDiv.style.width = curWidth + "px";
    puiDiv.style.height = curHeight + "px";
    pui.resize();
  };

  document.body.appendChild(dropdown);

  var rotateImage = document.createElement("img");
  rotateImage.src = "/profoundui/proddata/images/FlatIcons/24x24/rotate.png";
  rotateImage.style.position = "absolute";
  rotateImage.style.top = "8px";
  rotateImage.style.left = "260px";
  rotateImage.style.cursor = "pointer";
  rotateImage.title = "Rotate";

  rotateImage.onclick = function() {
    var temp = mobileDiv.style.height;
    mobileDiv.style.height = mobileDiv.style.width;
    mobileDiv.style.width = temp;
    var temp2 = puiDiv.style.height;
    puiDiv.style.height = puiDiv.style.width;
    puiDiv.style.width = temp2;
    pui.resize();
  };
  document.body.appendChild(rotateImage);
};

pui.detectMobileEmulation = function(container) {
  if (container == null) container = "pui";
  if (typeof container == "string") container = document.getElementById(container);
  if (container == null) return;
  var useFinger;
  if (container.parentNode.className == "ipad-emulator") {
    pui.iPadEmulation = true;
    useFinger = false;
  }
  if (container.parentNode.className == "iphone-emulator") {
    pui.iPadEmulation = true;
    pui.iPhoneEmulation = true;
    useFinger = false;
  }
  if (!pui.iPadEmulation) {
    if (pui.canvasSize != null) {
      pui.setupMobileEmulator();
      pui.iPadEmulation = true;
      pui.iPhoneEmulation = true;
    }
    return;
  }
  if (useFinger) {
    var finger = document.createElement("img");
    finger.src = "/profoundui/proddata/images/ipad/finger.png";
    finger.style.position = "absolute";
    finger.style.cursor = "crosshair";
    finger.style.zIndex = 99;
    addEvent(document, "mousemove", function(event) {
      var x = getMouseX(event);
      x = x + 3;
      finger.style.left = x + "px";
      var y = getMouseY(event);
      y = y + 3;
      finger.style.top = y + "px";
    });
    addEvent(document, "mousedown", function(event) {
      var x = getMouseX(event);
      x = x + 1;
      finger.style.left = x + "px";
      var y = getMouseY(event);
      y = y + 1;
      finger.style.top = y + "px";
    });
  }
  var addressbar = document.createElement("input");
  addressbar.style.position = "absolute";
  if (pui.iPhoneEmulation) {
    addressbar.style.left = "90px";
    addressbar.style.top = "164px";
    addressbar.style.width = "223px";
    addressbar.style.backgroundColor = "#d3dae4";
  }
  else {
    addressbar.style.left = "285px";
    addressbar.style.top = "89px";
    addressbar.style.width = "455px";
  }
  addressbar.style.color = "#999999";
  addressbar.style.borderStyle = "none";
  addressbar.style.fontFamily = "Trebuchet MS, Sans-Serif";
  addressbar.style.fontSize = "14px";
  addressbar.value = location.href;
  if (!pui.iPhoneEmulation) {
    addressbar.onclick = function() {
      getObj("ipadKeyboard").style.display = "";
    };
    addressbar.onblur = function() {
      getObj("ipadKeyboard").style.display = "none";
    };
  }
  document.body.appendChild(addressbar);
  if (useFinger) document.body.appendChild(finger);
};

pui.mobileEmulatorSizes = [{
  "description": "iPhone 6/7/8",
  "width": 375,
  "height": 667
}, {
  "description": "iPhone X/XS/11",
  "width": 375,
  "height": 812
}, {
  "description": "iPhone XS Max/11 Pro Max",
  "width": 414,
  "height": 896
}, {
  "description": "iPad Mini",
  "width": 768,
  "height": 1024
}, {
  "description": "iPad Pro",
  "width": 1024,
  "height": 1366
}, {
  "description": "Galaxy S8/S9",
  "width": 360,
  "height": 740
}, {
  "description": "Galaxy S10",
  "width": 360,
  "height": 760
}, {
  "description": "Galaxy S20",
  "width": 360,
  "height": 800
}, {
  "description": "Galaxy Tablet",
  "width": 800,
  "height": 1280
}];
