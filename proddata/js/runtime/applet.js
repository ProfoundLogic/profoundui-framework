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



function loadPCCommandApplet(callback) {

  if (getObj("PCCommandApplet") == null) {
  	var applet = document.createElement("applet");
  	applet.id = "PCCommandApplet";
  	applet.archive = "/profoundui/proddata/applet/PCIntegration.jar";
  	applet.code = "com.profoundlogic.genie.PCIntegration";
  	applet.style.height = "0px";
  	applet.style.width = "0px";
  	var temp = eval(callback);
  	if (typeof(temp) == "function") { // Test if it's a good function...
  	  var param = document.createElement("param");
  	  param.setAttribute("name", "callback");
  	  param.setAttribute("value", callback);
  	  applet.appendChild(param);
  	}
  	document.body.appendChild(applet); 
  }

}

function runPCCommand(command) {

	var applet = getObj("PCCommandApplet");
	if (!applet) return;
	try {
		applet["runCommand"](command);
	}
	catch(e) {
		var msg = "Unable to execute \"" + command + "\".\n\n"
		if (e != null) {
		  msg += e.name + ":\n\n" + e.message + ".";
		}
		alert(msg);
	}  

}

function copyToClipboard(data) {

	var applet = getObj("PCCommandApplet");
	if (!applet) return;
	applet["copyToClipboard"](data);

}
