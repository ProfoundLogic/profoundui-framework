// Implementation Plan:
// - call pui.timeoutMonitor.timer.reset() in the onuseractivity function
// - call pui.timeoutMonitor.start() in the rendering functions in both Profound UI and Genie
// - call pui.timeoutMonitor.end() when a screen is submitted

pui.timeoutMonitor = {};

pui.timeoutMonitor.timer = new pui["Timer"]();
pui.timeoutMonitor.timer.action = function() {
  var returnValue = true;
  if (pui["onbeforetimeout"] != null && typeof pui["onbeforetimeout"] == "function"){
    returnValue = pui["onbeforetimeout"]();
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
  function showMessage(container) {
    document.body.style.backgroundColor = "#ffffff";
    document.body.style.backgroundImage = "none";
    container.innerHTML = '<div style="font-family: Trebuchet MS; width: 95%; text-align: center; font-size: 200%;"><br/>' + 
                              pui.getLanguageText("runtimeMsg", "session timed out") + '</div>';
  }
  showMessage(pui.runtimeContainer);
  pui.showWaitAnimation();
  var url = getProgramURL("PUI0001200.pgm");  // handler
  if (pui.genie != null) {
    url = getProgramURL("PUI0002110.pgm");    // 5250 session controller
  }
  if (pui.psid != null && pui.psid != "") url += "/" + pui.psid;
  ajaxJSON({
    "url": url,
    "method": "post",
    "sendAsBinary": false,
    "suppressAlert": true,
    "params": {
      "timeout": "1"
    },
    "handler": function(response) {
      if (pui.genie != null) {
        // When used outside of Genie, the 'onload' processing in the 
        // time out screen will handle these flags.
        pui.confirmOnClose = false;
        pui.shutdownOnClose = false;      
        showMessage(document.body);
      }
      else {
        // render time out screen from PUISCREENS
        response.container = pui.runtimeContainer;
        pui.handler = function() { };
        pui.render(response);
      }
      if (pui["ontimeout"] != null && typeof pui["ontimeout"] == "function"){
        pui["ontimeout"]();
      }      
    },
    "onfail": function(req) {
      showMessage(document.body);
    }
  });
}

pui.timeoutMonitor.start = function() {  // this is called when a screen is rendered
  pui.timeoutMonitor.timer.stop();
  pui.timeoutMonitor.keepalive.stop();
  if (pui.timeout == null) return;
  var keepAliveValue = pui.timeout - 10;  // keep alive value is 10 seconds less than the timeout value 
  if (keepAliveValue < 3) return;     // check if keep alive is too frequent
  pui.timeoutMonitor.timer.timeout = pui.timeout;
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
