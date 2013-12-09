
if (typeof(window["pui"]) == "undefined") window["pui"] = {};

/**
 * Timer Class
 * @constructor
 */

window["pui"]["Timer"] = function() {

  // private variables
  var lastResetTime = new Date().getTime();
  var started = false;
  var intervalId;
  var me = this;
  
  // public properties
  this["timeout"] = 600;                 // timeout value in seconds
  this["showDebugInfo"] = false;         // shows elapsed time in browser's title bar
  this["action"] = null;                 // action to take when timeout occurs, specified as a function
  this["checkFrequency"] = 1000;         // how often to check whether timeout occurred, specified in milliseconds
  this["resetOnUserActivity"] = false;   // resets timer if user moves mouse or uses keyboard

  // public methods
  
  // start timer      
  this["start"] = function() {
    if (started) return;
    
    if (me["resetOnUserActivity"]) {
      if (document.body.addEventListener) {
        document.body.addEventListener("keydown", me["reset"], false);
        document.body.addEventListener("mousemove", me["reset"], false);    
        document.body.addEventListener("click", me["reset"], false);    
        document.body.addEventListener("touchstart", me["reset"], false);    
        document.body.addEventListener("touchmove", me["reset"], false);    
      }
      else if (document.body.attachEvent) {
        document.body.attachEvent("onkeydown", me["reset"]);
        document.body.attachEvent("onmousemove", me["reset"]);
        document.body.attachEvent("onclick", me["reset"]);
      }
    }
  
    me["reset"]();
    intervalId = setInterval(me["check"], me["checkFrequency"]);
    started = true;  
  }
  
  // stop timer function
  this["stop"] = function() {
    if (!started) return;
  
    clearInterval(intervalId);  
    
    if (me["resetOnUserActivity"]) {
      if (document.body.removeEventListener) {
        document.body.removeEventListener("keydown", me["reset"], false);
        document.body.removeEventListener("mousemove", me["reset"], false);    
      }
      else if (document.body.detachEvent) {
        document.body.detachEvent("onkeydown", me["reset"]);
        document.body.detachEvent("onmousemove", me["reset"]);
      }    
    }    
    
    started = false;
  }
  
  // reset the timer
  this["reset"] = function() {
    lastResetTime = new Date().getTime();
  }

  // check if timeout has occurred
  this["check"] = function() {
    var elapsedTime = (new Date().getTime()) - lastResetTime;
    if (me["showDebugInfo"]) {
      document.title = parseInt(elapsedTime / 1000);  // show elapsed time to the nearest second
    }
    if (elapsedTime >= me["timeout"] * 1000) {
      if (me["action"] != null && typeof me["action"] == "function") {
        me["action"]();
      }
      me["reset"]();
    }
  }

}
