
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
