// Implementation Plan:
// - include Timer.js in Profound UI and Genie
// - include this file timeoutMonitor.js in Profound UI and Genie
// - call pui.timeoutMonitoring.timer.reset() in the onuseractivity function
// - call pui.timeoutMonitoring.start() in the rendering functions in both Profound UI and Genie
// - call pui.timeoutMonitor.end() when a screen is submitted

var pui.timeoutMonitor = {};

pui.timeoutMonitor.timer = new pui["Timer"]();
pui.timeoutMonitor.timer.action = function() {
  var returnValue = true;
  if (pui["onsessiontimeout"] != null && typeof pui["onsessiontimeout"] == "function"){
    returnValue = pui["onsessiontimeout"]();
  }
  if (returnValue !== false) pui.timeoutMonitor.showTimeOutScreen();
  pui.timeoutMonitor.timer.stop();
  pui.timeoutMonitor.keepalive.stop();
}

pui.timeoutMonitor.keepalive = new pui["Timer"]();
pui.timeoutMonitor.keepalive.action = function() {
  pui["keepAlive"]();
}

pui.timeoutMonitor.showTimeOutScreen = function() {
  var url = getProgramURL("PUI0001200.pgm");  // handler
  if (pui.genie != null) {
    url = getProgramURL("PUI0002110.pgm");    // 5250 session controller
  }
  if (pui.psid != null && pui.psid != "") url += "/" + pui.psid;
  ajaxJSON({
    "url": "",
    "method": "post",
    "sendAsBinary": false,
    "suppressAlert": true,
    "params": {
      "timeout": "1"
    }
    "handler": function(response) {
      if (context == "genie" ) {
        document.body.innerHTML = "Your session has timed out.";
      }
      else {
        // to do - pui.show the received screen
      }
    },
    "onfail": function(req) {
      document.body.innerHTML = "Your session has timed out.";
    }
  };
}

pui.timeoutMonitor.getTimeoutValue = function() {
  var timeout = pui["appJob"]["timeout"];
  return timeout;
}

pui.timeoutMonitor.start = function() {  // this is called when a screen is rendered
  pui.timeoutMonitor.timer.stop();
  pui.timeoutMonitor.keepalive.stop();
  var timeout = pui.timeoutMonitor.getTimeoutValue();
  if (timeout == null) return;
  var keepAliveValue = timeout - 10;  // keep alive value is 10 seconds less than the timeout value 
  if (keepAliveValue < 3) return;     // check if keep alive is too frequent
  pui.timeoutMonitor.timer.timeout = timeout;
  //pui.timeoutMonitor.timer.showDebugInfo = true;
  pui.timeoutMonitor.keepalive.timeout = keepAliveValue;
  //pui.timeoutMonitor.keepalive.showDebugInfo = true;
  pui.timeoutMonitor.timer.start();
  pui.timeoutMonitor.keepalive.start();
}

pui.timeoutMonitor.end = function() {  // this is called when a screen is submitted
  pui.timeoutMonitor.timer.stop();
  pui.timeoutMonitor.keepalive.stop();
}
