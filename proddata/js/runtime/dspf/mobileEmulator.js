
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




pui.setupMobileEmulator = function(){
  var puiDiv = getObj("pui");
	var mobileDiv = document.createElement("div");
	
	mobileDiv.style.position = "absolute";                             
	mobileDiv.isCanvasOutline = true;                                  
	mobileDiv.style.border = "2px solid #999999";                      
	mobileDiv.style.backgroundColor = "#333333";                       
	mobileDiv.style.borderRadius = "15px";                             
	mobileDiv.style.boxShadow = "6px 6px 12px rgba(50, 66, 64, 0.67)"; 
	mobileDiv.style.width = "380px";  
	mobileDiv.style.height = "540px";
	mobileDiv.style.top = "40px";
	mobileDiv.style.left = "20px";
	
	puiDiv.style.width = "320px";  
	puiDiv.style.height = "480px"
	puiDiv.style.left = "50px";
	puiDiv.style.top = "70px";
  puiDiv.style.backgroundColor = "white";
	
	puiDiv.parentNode.insertBefore(mobileDiv, puiDiv);

	var dropdown = document.createElement("select");
	dropdown.style.position = "absolute";
	dropdown.style.width = "170px";
	dropdown.style.top = "10px";
	dropdown.style.left = "50px";
	dropdown.options[0] = new Option('iPhone (320 x 480)', "320x480");
	dropdown.options[1] = new Option('iPad (768 x 1024)', "768x1024");
	dropdown.options[2] = new Option('Android (360 x 640)', "360x640");
	
	dropdown.onchange = function() {
    var sizeArray = dropdown.value.split("x");
    var width = Number(sizeArray[0]);
    if (isNaN(width)) width = 320;
    var height = Number(sizeArray[1]);
    if (isNaN(height)) height = 640;
		mobileDiv.style.width = (width + 60) + "px";
		mobileDiv.style.height = (height + 60) + "px";
		puiDiv.style.width = width + "px";
		puiDiv.style.height = height + "px";
  }
	
	document.body.appendChild(dropdown);

	var rotateImage = document.createElement("img");
	rotateImage.src = "rotate_canvas.png";
	rotateImage.style.position = "absolute";
	rotateImage.style.top = "8px";
	rotateImage.style.left = "230px";
  rotateImage.style.cursor = "pointer";
		
	rotateImage.onclick = function(){
	  var temp = mobileDiv.style.height;
		mobileDiv.style.height = mobileDiv.style.width;
		mobileDiv.style.width = temp;		
	  var temp2 = puiDiv.style.height;
		puiDiv.style.height = puiDiv.style.width;
		puiDiv.style.width = temp2;
  }
	document.body.appendChild(rotateImage);
}



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
  if (!pui.iPadEmulation) return;  
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
    }
    addressbar.onblur = function() {
      getObj("ipadKeyboard").style.display = "none";
    }
  }
  document.body.appendChild(addressbar);
  if (useFinger) document.body.appendChild(finger);
}

