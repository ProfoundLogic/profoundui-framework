//  Profound UI Runtime  -- A Javascript Framework for Rich Displays
//  Copyright (c) 2014 Profound Logic Software, Inc.
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



pui.help = {};


pui.help.show = function() {

  // get record level properties from meta data
  var layers = pui.oldRenderParms["layers"];
  if (layers == null) return;
  var layer = layers[layers.length - 1];
  var formats = layer.formats;
  if (formats == null) return;  
  if (formats.length == 0) return;    
  var recordName = pui.cursorValues.record;  
  var format = formats[0];
  for (var i = 0; i < formats.length; i++) {
    if (formats[i].name == recordName) {
      format = formats[i];
      break;
    }
  }
  var props = format["metaData"]["screen"];

  // find matching help panel
  var panelSuffix = null;
  var done = false;
  var idx = 1;
  while (!done) {
    var suffix = "";
    if (idx > 1) suffix = " " + String(idx);
    if (props["help record" + suffix] == null && props["help panel group" + suffix] == null) {
      done = true;
    }
    else {
      // check help panel condition first
      var condition = props["help panel condition" + suffix];
      if (condition != null && pui.isBound(condition)) {
        var dataValue;
        if (condition.dataType == "expression") {
          dataValue = pui.evalIndicatorExpression(condition.fieldName, data);
        }
        else {
          dataValue = data[fieldName];
        }
        if (dataValue != "1" && dataValue != "true" && dataValue != true) {
          idx++;
          continue;
        }
      }      
      var helpArea = props["help area" + suffix];      
      // check for record level match
      if (helpArea == "" || helpArea == null) {
        panelSuffix = suffix;
        break;
      }
      // check for row / column position match
      var parts = helpArea.split(" ");
      if (parts.length == 4) {
        var fromRow = Number(parts[0]);
        var fromCol = Number(parts[1]);
        var toRow = Number(parts[2]);        
        var toCol = Number(parts[3]);
        var row = Number(pui.cursorValues.row);
        var col = Number(pui.cursorValues.column);
        if (!isNaN(fromRow) && !isNaN(toRow) && !isNaN(row) && !isNaN(fromCol) && !isNaN(toCol) && !isNaN(col)) {
          if (row >= fromRow && row <= toRow && col >= fromCol && col <= toCol) {
            panelSuffix = suffix;
            break;
          }
        }        
      }
      // check for id match for a field or a constant
      if (helpArea == pui.cursorValues.elementId) {
        panelSuffix = suffix;
        break;
      }
      idx++;
    }
  }
  
  // show help
  if (panelSuffix == null) {
    var extendedHelpShown = pui.help.extendedHelp(props);
    //if (!extendedHelpShown) {
      // should submit screen with aid=0xF3 (Help) here ?
    //}
  }
  
  if (panelSuffix != null) {
    if (props["help record" + panelSuffix] != null) {
      var helpRecord = props["help record" + panelSuffix];
      var helpFile = props["help display file"];
      var helpLibrary;
      if (helpFile == null) {
        helpFile = format["file"];
        helpLibrary = format["library"];
        if (helpLibrary == null || helpLibrary == "") helpLibrary = "*LIBL";
      }
      else {
        helpFileParts = helpFile.split("/");
        if (helpFileParts.length == 2) {
          helpLibrary = helpFileParts[0];
          helpFile = helpFileParts[1];
        }
        else {
          helpLibrary = "*LIBL";
        }
        
      }
      pui.showWaitAnimation();
      ajaxJSON({
        "url": getProgramURL("PUI0009108.pgm"),
        "method": "post",
        "params": {
          "record": helpRecord,
          "library": helpLibrary,
          "file": helpFile,
          "AUTH": pui.appJob["auth"]
        },
        "async": true,
        "handler": function(response) {
          pui.hideWaitAnimation(true);
          var success = response["success"];
          if (success == true) {
            pui.help.renderHelpRecord(response["metaData"]);
          }
          else {
            pui.help.error(response);
          }
        }
      });
    }
    if (props["help panel group" + panelSuffix] != null) {
      var helpPanelGroup = props["help panel group" + panelSuffix];
      var helpPanelGroupParts = helpPanelGroup.split("/");
      var helpPanlelLibrary;
      if (helpPanelGroupParts.length == 2) {
        helpPanlelLibrary = helpPanelGroupParts[0];
        helpPanelGroup = helpPanelGroupParts[1];
      }
      else {
        helpPanlelLibrary = "*LIBL";
      }
      var helpModule = props["help module" + panelSuffix]; 
      // TODO: The help module and objects need to be multiple occurrence... 
      // Send a parameter "modules" that has the total count, and then 
      // pgroup1, library1, module1, etc. 
      pui.showWaitAnimation();
      ajaxJSON({
        "url": getProgramURL("PUI0009108.pgm"),
        "method": "post",
        "params": {
          "modules": "1",
          "pgroup1": helpPanelGroup,
          "library1": helpPanlelLibrary,
          "module1": helpModule,
          "AUTH": pui.appJob["auth"]
        },
        "async": true,
        "handler": function(response) {
          pui.hideWaitAnimation(true);
          var success = response["success"];
          if (success == true) {
            pui.help.renderPanelGroup(response["html"], true, props);
          }
          else {
            pui.help.error(response);
          }
        }
      });
    }
  }

}


pui.help.renderHelpRecord = function(meta) {
  
  var items = meta["items"];
  var namedModel = getPropertiesNamedModel();
  var container = document.createElement("div");
  container.style.width = "1000px";
  container.style.height = "750px";
  container.style.zIndex = 999;
  container.style.position = "absolute";
  container.style.backgroundColor = "white";
  pui.runtimeContainer.appendChild(container);

  for (var i = 0; i < items.length; i++) {
  
    var properties = items[i];
    
    if (properties["id"] == "btnHELP") continue;

    // create dom element for item
    var dom = document.createElement("div");
    dom.style.position = "absolute";
    var leftpx = properties.left;
    var toppx = properties.top;
    if (leftpx == null) leftpx = "0px";
    if (toppx == null) toppx = "0px";
    dom.style.left = leftpx;
    dom.style.top = toppx;
    container.appendChild(dom);
    if (properties["field type"] == "button" || properties["field type"] == "styled button") {
      dom.onclick = function() {
        // close help panel
        container.innerHTML = "";
        container.parentNode.removeChild(container);
        container = null;
      }
    }
  
    // apply all properties
    for (var propname in properties) {
      var propConfig = pui.getPropConfig(namedModel, propname);
      if (propConfig != null) {
        var propValue = properties[propname];
        if (propValue != null && propValue != "") {
          dom = applyPropertyToField(propConfig, properties, dom, propValue, false);
        }          
      }
    }
  	    	        
  }

}



pui.help.error = function(response) {

  var id = response["id"];
  var msg = response["message"];
  var help = response["help"];
  
  var text = "An error has occurred trying to display help text.";
  if (id != null) text += "\n\nError Id: " + id;
  if (msg != null) text += "\n\nMessage: " + msg;
  if (help != null) text += "\n\n" + help;
  
  pui.alert(text);

}



pui.help.renderPanelGroup = function(html, showExtendedHelpButton, props) {

  var container = document.createElement("div");
  container.style.width = "1000px";
  container.style.height = "750px";
  container.style.zIndex = 999;
  container.style.position = "absolute";
  container.style.backgroundColor = "white";
  container.style.padding = "10px";
  pui.runtimeContainer.appendChild(container);

  container.innerHTML = html;

  var returnButton = document.createElement("input");
  returnButton.type = "button";
  returnButton.value = "Return to Application";
  returnButton.onclick = function() {
    // close help panel
    container.innerHTML = "";
    container.parentNode.removeChild(container);
    container = null;
  }
  container.appendChild(returnButton);
  
  if (showExtendedHelpButton == true) {
    container.appendChild(document.createTextNode("    "));
    var extendedHelpButton = document.createElement("input");
    extendedHelpButton.type = "button";
    extendedHelpButton.value = "Extended Help";
    extendedHelpButton.onclick = function() {
      pui.help.extendedHelp(props, container);
    }
    container.appendChild(extendedHelpButton);
  }
  
  if (pui["help panel group toc"] == false) {
    tocDiv = container.firstChild;
    if (tocDiv != null && tocDiv.nodeType == 3) tocDiv = tocDiv.nextSibling;  // skip text node
    if (tocDiv != null && tocDiv.tagName == "DIV" && tocDiv.firstChild != null && tocDiv.firstChild.tagName == "A" && tocDiv.firstChild.name == "TOC") {
      tocDiv.style.display = "none";
    }
  }
  
}



pui.help.extendedHelp = function(props, container) {

  var params = {
    "modules": 0,
    "AUTH": pui.appJob["auth"]
  }

  var done = false;
  var idx = 1;
  while (!done) {
    var suffix = "";
    if (idx > 1) suffix = " " + String(idx);
    if (props["help record" + suffix] == null && props["help panel group" + suffix] == null) {
      done = true;
    }
    else {
      // check help panel condition first
      var condition = props["help panel condition" + suffix];
      if (condition != null && pui.isBound(condition)) {
        var dataValue;
        if (condition.dataType == "expression") {
          dataValue = pui.evalIndicatorExpression(condition.fieldName, data);
        }
        else {
          dataValue = data[fieldName];
        }
        if (dataValue != "1" && dataValue != "true" && dataValue != true) {
          idx++;
          continue;
        }
      }
      
      var helpPanelGroup = props["help panel group" + suffix];
      if (helpPanelGroup != null) {
        
        var helpPanelGroupParts = helpPanelGroup.split("/");
        var helpPanlelLibrary;
        if (helpPanelGroupParts.length == 2) {
          helpPanlelLibrary = helpPanelGroupParts[0];
          helpPanelGroup = helpPanelGroupParts[1];
        }
        else {
          helpPanlelLibrary = "*LIBL";
        }
        var helpModule = props["help module" + suffix]; 

        params["modules"]++;
        params["pgroup" + params["modules"]]= helpPanelGroup;
        params["library" + params["modules"]]= helpPanlelLibrary;
        params["module" + params["modules"]]= helpModule;
      }
      
      idx++;
    }
  }

  if (params["modules"] <= 0) {
    return false;
  }

  ajaxJSON({
    "url": getProgramURL("PUI0009108.pgm"),
    "method": "post",
    "params": params,
    "async": true,
    "handler": function(response) {
      pui.hideWaitAnimation(true);
      var success = response["success"];
      if (success == true) {
        if (container != null) {
          // close original container
          container.innerHTML = "";
          container.parentNode.removeChild(container);
          container = null;
        }
        pui.help.renderPanelGroup(response["html"]);
      }
      else {
        pui.help.error(response);
      }
    }
  });
  
  return true;

}


