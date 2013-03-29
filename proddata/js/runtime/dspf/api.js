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



// Automate the clicking of a button/link/image that has a response property
// Parameter: id or dom object reference to a button/link/image
//            the parameter is option -- if not passed, a response is still sent to the server
// Example: pui.click("Submit");
// Example: var obj = getObj("Submit"); pui.click(obj);
// Example: var obj = getObj("Submit"); pui.click(obj);
pui.click = function(button, skipjs) {
  setTimeout(function() {
    if (typeof button != "object") button = getObj(button);
    var originalResponseValue;
    if (button != null) {
      if (skipjs != true && button.onclick != null && typeof button.onclick == "function") {
        button.onclick();
        return;
      }
      originalResponseValue = button.responseValue;
      if (button.responseValue == "0" || button.subfileRow != null) {
        button.responseValue = "1";
      }
      if (button.shortcutKey != null) {
        pui.keyName = button.shortcutKey;
      }
      pui.bypassValidation = button.bypassValidation;
    }
    var returnVal = pui.respond();
    pui.bypassValidation = "false";
    
    if (returnVal == false && button != null) {
      button.responseValue = originalResponseValue;
    }    
  },
  0);
}


// Goes to a url and skips the "This will end your session" confirmation box
// Example: pui.link("mailto:support@profoundlogic.com");
pui["link"] = function(url) {
  pui.skipConfirm = true;
  setTimeout(function() {
    location.href = url;
  }, 1);
  setTimeout(function() { 
    pui.skipConfirm=false; 
  }, 100);
}


// move all elements located between from and to pixels up or down by a certain amount of pixels
// useful in forms, where you want to collapse a section of the form that is not visible
// Example: pui.shiftElements(100, 9999, -100)
pui["shiftElements"] = function(from, to, moveBy) {

  function processEls(tag) {
    var els = document.getElementsByTagName(tag);
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      var top = parseInt(el.style.top);
      if (el.parentNode == pui.runtimeContainer && !isNaN(top) && top >= from && top <= to) {
        top += moveBy;
        el.style.top = top + "px";
      }
    }
  }
  
  processEls("div");       // move output fields and labels
  processEls("input");     // move textboxes, checkboxes, radio buttons
  processEls("select");    // move dropdowns
  processEls("textarea");  // move text areas

}


// gets the height of the PUI runtime container based on the 
// absolute position and height of the elements within it
// useful in positioning a footer that is placed into start.html
// Example: getObj("footer").style.top = pui.getRuntimeContainerHeight() + "px";
pui["getRuntimeContainerHeight"] = function() {
  var containerHeight = 0;
  function processEls(tag) {
    var els = document.getElementsByTagName(tag);
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      var top = parseInt(el.style.top);
      if (el.parentNode == pui.runtimeContainer && !isNaN(top)) {
        var height = el.offsetHeight;
        if (!isNaN(height)) {
          height += top;
          if (height > containerHeight) containerHeight = height;
        }
      }
    }
  }
  
  processEls("div");       // check output fields and labels
  processEls("input");     // check textboxes, checkboxes, radio buttons
  processEls("select");    // check dropdowns
  processEls("textarea");  // check text areas
  
  return containerHeight;
}


pui["showHelp"] = function() {
  pui.help.show();
}


function getSystemName() {
  if (inDesignMode()) {
    return "SSSSSSSS";
  }
  else {
    if (pui.appJob == null || pui.appJob["sysName"] == null) return "";
    else return pui.appJob["sysName"];
  }
}



pui.cachedMeta = {};
pui["show"] = function(parms) {
  
  // display meta data object or a path to a json file representing the display meta data should be provided
  var path = parms["path"];        // string - can be IFS path or in the form of LIBRARY/FILE(SOURCE)
  var meta = parms["meta"];        // object
  
  // the name of the format or multiple formats to be displayed should be provided
  // if omitted, the first format in the meta data is used
  var format = parms["format"];
  var formats = parms["formats"];
  
  var data = parms["data"];
  if (data == null) data = {};
  
  var handler = parms["handler"];
  
  if (meta == null && path == null) return;
  
  if (meta == null && pui.cachedMeta[path] != null) {
    meta = pui.cachedMeta[path];
  }
  
  if (meta == null) {    
    var ajaxParms = {      
      "method": "post",
      "handler": function(metaObj) {
        parms["meta"] = metaObj;
        pui.cachedMeta[path] = metaObj;
        pui["show"](parms);
      }
    }
    var memberInfo = pui.parseLibraryFileMember(path);
    if (memberInfo == null) {
      ajaxParms["url"] = path;    
      ajaxJSON(ajaxParms);
    }
    else {
      ajaxParms["url"]= getProgramURL("PUI0001102.pgm");
      ajaxParms["params"]= memberInfo;
      ajaxParms["handler"] = function(json) {
        json = json.replace(/''/g, "'");  // decode single quotes
        pui.display = null;
        eval(json);
        parms["meta"] = pui.display;
        pui.cachedMeta[path] = pui.display;
        pui["show"](parms);
      }
      ajax(ajaxParms);
    }
    return;
  }
  
  if (formats == null && format != null) {
    formats = [];
    formats.push(format);
  }
  
  var formatList = [];
  if (formats != null) {
    for (var i = 0; i < meta["formats"].length; i++) {
      var formatEntry = meta["formats"][i];
      for (var j = 0; j < formats.length; j++) {
        if (formatEntry["screen"]["record format name"] == formats[j]) {
          formatList.push({
            "metaData": formatEntry,
            "data": data,
            "name": formatEntry["screen"]["record format name"]
          });
          break;
        }
      }
    }
  }
  
  if (formatList.length == 0) {
    formatList.push({
      "metaData": meta["formats"][0],
      "data": data
    });    
  }
  

  var container = parms["container"];
  if (container != null && typeof container == "string") container = getObj(parms["container"]);

  if (container == null) pui.runtimeContainer = getObj("pui");
  
  var layers = [{ "formats": formatList }];
  
  var obj = {
    container: pui.runtimeContainer,
    "appJob": {},
    "layers": layers,
    success: true
  }
  
  if (container == null) {
    pui.handler = handler;
    if (pui.handler == null) pui.handler = function() { };
    pui.render(obj);
  }
  else {
    container.innerHTML = "";
    var format = layers[0]["formats"][0];
    format.lastLayer = true;
    format.lastFormat = true;
    format.container = container;
    pui.renderFormat(format);
  }

}



pui["applyResponse"] = function(data, response) {
  for (var entry in response) {
    data[entry] = response[entry];
  }
}


pui["setMLTCHCFLD"] = function(fieldId, checkboxes) {
  if (pui.bypassValidation == "true") return;
  var count = 0;
  for (var i = 0; i < checkboxes.length; i++) {
    var checkbox = getObj(checkboxes[i]);
    if (checkbox != null && checkbox.checked == true) count++;
  }

  // can't use changeElementValue since this would normally be called with onsubmit, which occurs after the response is already built
  // changeElementValue(fieldId, String(count));
  
  // instead, we update the response object directly
  // first, we find the field in pui.responseElements 
  var elem = getObj(fieldId);
  if (elem != null) { 
    for (var fieldName in pui.responseElements) {
      var doms = pui.responseElements[fieldName];
      var dom = doms[0];
      if (dom == elem) {
        pui.referenceToResponse[fieldName] = String(count);
        return;
      }     
    }
  }
  
}


pui["setPSHBTNFLD"] = function(fieldId, button) {
  // Retrive Choice Number from Button Id
  var id = button.id;
  var choiceNumber = "";
  for (var i = id.length - 1; i >= 0; i = i - 1) {
    var ch = id.substr(i, 1);
    if (ch < "0" || ch > "9") break;
    choiceNumber = ch + choiceNumber;
  }
  choiceNumber = Number(choiceNumber);

  // Set Push Button Field
  if (!isNaN(choiceNumber)) {
    changeElementValue(fieldId, String(choiceNumber));
  }

  // Submit Screen
  pui.click(button, true);
}




pui["buildFKeyMenu"] = function(parms) {

  if (parms == null) parms = {};

  var prefix = parms["prefix"];  // id prefix to identify fkeys - "link" or "btn"
  if (prefix == null) prefix = "btn";
  
  var fkeyMenuId = parms["fkeyMenuId"];
  if (fkeyMenuId == null) {
    fkeyMenuId = "fkeyMenu";
    if (parms["format"] != null) fkeyMenuId = parms["format"] + "_" + fkeyMenuId;
    if (parms["file"] != null) fkeyMenuId = parms["file"] + "_" + fkeyMenuId;
  }
  
  var skipF24 = parms["skipF24"];
  if (skipF24 == null) skipF24 = true;
  
  var skipHelp = parms["skipHelp"];
  if (skipHelp == null) skipHelp = false;
  
  var availableKeys = parms["availableKeys"];  // can be specified as an id or an array of id's
                                               // if not passed, all keys are assummed to be available
                                               // the id points to an output element with content such as "F3=Exit  F5=Refresh  F12=Cancel"
  if (typeof availableKeys == "string") {
    availableKeys = [ availableKeys ];  // convert to array
  }
  var availableKeysString = "";
  if (availableKeys != null) {
    for (var i = 0; i < availableKeys.length; i++) {
      var dom = getObj(availableKeys[i]);
      if (dom != null) {
        availableKeysString += " " + getInnerText(dom);
      }
    }
  }
  availableKeysString = trim(availableKeysString);
  
  var fkeyMenuDOM = getObj(fkeyMenuId);
  if (fkeyMenuDOM == null) return;
  
  //var isWin = (pui.lastWindow != null);
  //if (fkeyMenuDOM == null) {
  //  if (isWin) {
  //    // imitate menu dom
  //    fkeyMenuDOM = {
  //      menuWidget: {
  //        draw: function() {}
  //      },
  //      parentNode: pui.lastWindow
  //    }
  //  }
  //  else {
  //    return;
  //  }
  //}

  var fkeyMenuWidget = fkeyMenuDOM.menuWidget;
  if (fkeyMenuWidget == null) return;
  
  var container = fkeyMenuDOM.parentNode;
  if (container == null) return;
  
  fkeyMenuWidget.choices = [];
  fkeyMenuWidget.choiceValues = [];

  //if (isWin) {
  //  pui.autoArrange.left = pui.autoArrange.startLeft;
  //  pui.autoArrange.prevTop = null;
  //}
  
  var elem = container.firstChild;
  while (elem != null) {
    var id = elem.id;
    if (id == null || id.length <= prefix.length || id.substr(0, prefix.length) != prefix) {
      elem = elem.nextSibling;
      continue;
    }  
    var lookFor = id.substr(prefix.length);
    if (lookFor.substr(0,2) == "CA" || lookFor.substr(0,2) == "CF") {
      lookFor = Number(lookFor.substr(2));
      if (isNaN(lookFor) || lookFor < 1 || lookFor > 24) {
        elem = elem.nextSibling;
        continue;
      }
      lookFor = "F" + lookFor;
    }
    lookFor += "=";
    if (lookFor == "Submit=") lookFor = null;
    //if (isWin && pui.autoArrange.prevTop == null) pui.autoArrange.prevTop = parseInt(elem.style.top);
    elem.style.left = "-250px";
    elem.style.top = "-250px";
    var idx = -1;
    if (lookFor != null && availableKeysString != "") {
      idx = availableKeysString.indexOf(lookFor);
      if (idx == -1) {
        elem = elem.nextSibling;
        continue;
      }
    }
    if (lookFor == "F24=" && skipF24) {
      elem = elem.nextSibling;
      continue;
    }
    if (lookFor == "HELP=" && skipHelp) {
      elem = elem.nextSibling;
      continue;
    }
    if (elem.style.display == "none") {
      elem = elem.nextSibling;
      continue;
    }
    if (elem.style.visibility == "hidden") {
      elem = elem.nextSibling;
      continue;
    }
    var text;
    if (elem.tagName == "INPUT") text = elem.value;
    else text = getInnerText(elem);
    if (idx != -1) {
      var avText = "";
      var equalSigns = 0;
      var i, j;
      // search for next equal sign (which is the 2nd equal sign from idx)
      for (i = idx; i < availableKeysString.length; i++) {
        var ch = availableKeysString.substr(i,1);
        if (ch == "=") equalSigns++;
        if (equalSigns >= 2) break;
      }
      // go back to the previous space
      if (equalSigns >= 2) {        
        while (i > 0 && availableKeysString.substr(i,1) != " ") {
          i = i - 1;
        }
      }
      // capture text until we get to the original equal sign
      for (j = i - 1; j >= 0; j = j - 1) {
        var ch = availableKeysString.substr(j,1);
        if (ch == "=") break;
        avText = ch + avText;
      }
      // if there is any text, use it instead of the original button/link value
      avText = trim(avText);
      if (avText != "") {
        text = avText;
      }
    }
    fkeyMenuWidget.choices.push(text);
    fkeyMenuWidget.choiceValues.push(id);

    //if (isWin) {
    //  elem.style.top = pui.autoArrange.prevTop + "px";
    //  elem.style.left = pui.autoArrange.left + "px";
    //  if (elem.tagName == "INPUT") elem.value = text;
    //  if (pui.autoArrange.prevTop != null && Math.abs(parseInt(elem.style.top) - pui.autoArrange.prevTop) > 5) {
    //    pui.autoArrange.left = pui.autoArrange.startLeft;
    //  }
    //  else {
    //    pui.autoArrange.left += pui["horizontal button spacing"];
    //  }
    //}

    elem = elem.nextSibling;
  }
  
  fkeyMenuDOM["onoptionclick"] = function(value, text) {
    pui.click(value);
  }
  
  fkeyMenuWidget.draw();
  
}




pui["capturePhoto"] = function(parms) {
  var dir = parms["dir"];
  if (dir == null) dir = "/www/profoundui/htdocs/profoundui/userdata/images";
  var overwrite = parms["overwrite"];
  if (overwrite !== true) overwrite = false;
  var fileName = parms["fileName"];
  if (fileName == null) fileName = "image.jpg";
  var handler = parms["handler"];
  var quality = parms["quality"];
  if (quality == null) quality = 50;
  if (handler == null) {
    handler = function(response) {
      if (response["success"] == false) {
        alert(response["error"]);
      }
      else if (response["success"] == true) {
        alert("Photo captured successfully.");
      }
      else {
        alert("Invalid response.");  // this shouldn't happen
      }
    }
  }
  
  
  if (navigator["camera"] == null) {
    handler({
      "success": false,
      "error": "Camera unavailable."
    });
    return;
  }
  
  

  // Retrieve image file location from specified source
  // If we change sourcetype to Camera.PictureSourceType.CAMERA,
  // We can pull up the camera and take a picture and use that picture.
  
  navigator["camera"]["getPicture"](uploadPhoto,
                              function(msg) { 
                                handler({ "success": false, "error": msg });
                              },
                              { 
                                "quality": quality, 
                                "destinationType": navigator["camera"]["DestinationType"]["FILE_URI"],
                                "sourceType": navigator["camera"]["PictureSourceType"]["CAMERA"] 
                              }
  );

  function uploadPhoto(imageURI) {
      var options = new window["FileUploadOptions"]();
      options["fileKey"] = "file";
      options["fileName"] = imageURI.substr(imageURI.lastIndexOf('/')+1);
      options["mimeType"] = "image/jpeg";

      var params = {};
      params["dir"] = dir;
      params["overwrite"] = (overwrite ? "1" : "0");
      params["flimit"] = "1";
      params["slimit"] = "50";  // 50 MB limit
      params["filename"] = fileName;

      options["params"] = params;

      var ft = new window["FileTransfer"]();
      var url = getProgramURL("PUI0009109.PGM");
      url += "?AUTH=" + encodeURIComponent(pui["appJob"]["auth"]);
      url += "&mode=ajax";
      ft["upload"](imageURI, 
                encodeURI(url),
                function(response) {
                  var jsonResponse = {};
                  try {
                    jsonResponse = eval("(" + decodeURIComponent(response["response"]) + ")");
                  }
                  catch(e) {
                    jsonResponse["success"] = false;
                    jsonResponse["error"] = "Invalid response.";
                  }
                  response["success"]  = jsonResponse["success"];
                  if (!response["success"]) {
                  
                    if (jsonResponse["key"]) {
                    
                      response["error"] = pui["fileupload"][jsonResponse["key"]];
                    
                    }
                    else {
                    
                      response["error"]  = jsonResponse["error"];
                    
                    }
                  
                  }
                  handler(response);
                }, 
                function(response) {
                  response["success"] = false;
                  response["error"] = "An error has occurred: Code = " + response["code"];
                  handler(response);
                }, 
                options
      );
      
  }
                                
}

pui.uploadDataUrl = function(params, callback) {

  var overwrite = (params["overwrite"] === true);
  var dataURL = params["data"];
  var BASE64_MARKER = ';base64,';
  var base64Index = dataURL.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
  var encodedData = dataURL.substring(base64Index);  
  var contentType = params["imageType"];
  
  var url = getProgramURL("PUI0009109.PGM");
  url += "?AUTH=" + encodeURIComponent(pui["appJob"]["auth"]);
  url += "&mode=ajax";
  url += "&r=" + Math.floor(Math.random() * 1000000000);
  
  var myForm = [
    {
      "name": "file",
      "value": encodedData,
      "contenttype": contentType,
      "filename": params["fileName"],
      "transferencoding": "base64"
    },
    { 
      "name": "dir",
      "value": params["dir"]
    },
    {
      "name": "overwrite",
      "value": (overwrite) ? "1" : "0"
    },
    {
      "name": "flimit",
      "value": "1"
    },
    { 
      "name": "slimit",
      "value": String(Math.ceil(encodedData.length / 1048576))
    },
    { 
      "name": "filename",
      "value": params["fileName"]
    }
  ];
  
  var multiPart = new pui.MultiPart();
  multiPart.addParts(myForm);
  multiPart.send(url, function(request) {
        
    var success = true;
    var error;
    if (request.getStatus() == 200) {
      var rsp;
      try {
        rsp = eval("(" + request.getResponseText() + ")");
      }
      catch(e) {
        success = false;
        error = "Server response missing or invalid."
      }
      if (rsp) {
        success = rsp["success"];
        if (!success) {
          if (rsp["key"]) {
            error = pui["fileupload"][rsp["key"]];
          }
          else {
            error = rsp["error"];
          }
        }
      }
    }
    else {
      success = false;
      error = request.getStatus() + " - " + request.getStatusMessage() + ".";
    }
    
    if (typeof(callback) == "function") {
      callback(success, error);  
    }
        
  });
  
}  

pui["uploadSignature"] = function(params) {

  var sigpad = getObj(params["signaturePadId"]);
  if (sigpad == null || sigpad.firstChild == null) {
    return;
  }
  
  if (params["imageType"] == null) {
    params["imageType"] = "image/png";
  }
  
  if (params["fileName"] == null) {
    params["fileName"] = "signature.png";
  }
  
  var imgDataUrl = sigpad.firstChild.toDataURL(params["imageType"]);
  params["data"] = new String(imgDataUrl);
  
  pui.uploadDataUrl(params, params["handler"]);
    
}
