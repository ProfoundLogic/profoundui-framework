
// Number of outstanding auto complete queries.
var autoCompQueries = 0;

var yAdjust = -20;

var agt = navigator.userAgent.toLowerCase();
var is_major = parseInt(navigator.appVersion);
var is_minor = parseFloat(navigator.appVersion);
var is_ie     = ((agt.indexOf("msie") != -1) && (agt.indexOf("opera") == -1));
var is_ie3    = (is_ie && (is_major < 4));
var is_ie4    = (is_ie && (is_major == 4) && (agt.indexOf("msie 4")!=-1) );
var is_ie4up  = (is_ie && (is_major >= 4));
var is_ie5    = (is_ie && (is_major == 4) && (agt.indexOf("msie 5.0")!=-1) );
var is_ie5_5  = (is_ie && (is_major == 4) && (agt.indexOf("msie 5.5") !=-1));
var is_ie5up  = (is_ie && !is_ie3 && !is_ie4);
var is_ie5_5up =(is_ie && !is_ie3 && !is_ie4 && !is_ie5);
var is_ie6    = (is_ie && (is_major == 4) && (agt.indexOf("msie 6.")!=-1) );
var is_ie6up  = (is_ie && !is_ie3 && !is_ie4 && !is_ie5 && !is_ie5_5);
var is_ie7    = (is_ie && (is_major == 4) && (agt.indexOf("msie 7.")!=-1) );
var is_ie8    = (is_ie && (is_major == 4) && (agt.indexOf("msie 8.")!=-1) );
var is_ie9    = (is_ie && (is_major == 5) && (agt.indexOf("msie 9.")!=-1) );
var is_opera  = (agt.indexOf("opera") != -1);
var is_safari = (agt.indexOf("safari") != -1);
var is_firefox = (agt.indexOf("firefox") != -1);
var is_android = (agt.indexOf("android") != -1);
var is_chrome = (navigator.userAgent.toLowerCase().indexOf('chrome') != -1);
var quirksMode = (document.compatMode == "BackCompat");

if (is_ie7 || is_ie8 || is_ie9) is_ie6 = false;

var checkboxObjects = [];
var errors        = new Array();
var designScreens = new Array();
var usedIds       = new Object();

// prevent back button
if (context == "genie") window.history.forward(1);

// setup pui name space
window.pui = {};
pui["secLevel"] = 0;
pui.dummyBox = null;
pui.multX = null;
pui.multY = null;
pui.defaultDateFormat = "MM/DD/YY";
pui.touchDevice = ("ontouchstart" in window);

pui.designer = {};
pui.designer.currentDisplay = {};
pui.ide = {};
pui.cnv = {};
pui.cnv.handlers = {};

// the definitions are here to handle the calls, however this is only needed in the design ide
pui.toolbox = {};
pui.toolbox.add = function() {};

pui["field exit key"] = 107;  // numeric pad plus sign

pui["no connection message"] = "Unable to reach server.  Check your connection and try again.";
pui["no connection status"] = false;

pui.SQLDateFmts = {

  "*ISO": 1,
  "*USA": 2,  
  "*EUR": 3,
  "*JIS": 4,
  "*MDY": 5,  
  "*DMY": 6, 
  "*YMD": 7, 
  "*JUL": 8,
  "*JOB": 10

};

pui.SQLDateSeps = {

  "/": 1,
  "-": 2,
  ".": 3,
  ",": 4,
  " ": 5,
  "*BLANK": 5,
  "*JOB": 7

};

pui.SQLTimeFmts = {

  "*ISO": 1,
  "*USA": 2,  
  "*EUR": 3,
  "*JIS": 4,
  "*HMS": 9        

};

pui.SQLTimeSeps = {

  ".": 3,
  ",": 4,
  " ": 5,
  "*BLANK": 5,
  ":": 6,
  "*JOB": 7

};
