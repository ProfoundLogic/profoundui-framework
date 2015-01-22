//  Profound UI Runtime  -- A Javascript Framework for Rich Displays
//  Copyright (c) 2015 Profound Logic Software, Inc.
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


 
/*****************************************************************************************************/
/*                                                                                                   */
/* RPGsp AJAX Library Core                                                                           */
/* Profound Logic Software, Inc.                                                                     */
/* Version: 1.5.7                                                                                    */
/* Author: David Russo / Alex Roytman                                                                */
/* Created on: 07/09/2008                                                                            */
/*                                                                                                   */
/* Version 1.2 changes: Added ajaxXML() function to wrap simple XML requests.                        */
/*                                                                                                   */
/* Version 1.3 changes: Added ajaxSubmit() function to submit forms using AJAX                       */
/*                                                                                                   */
/* Version 1.4 changes: Added Firefox 3 fix for POSTs (tries to use XMLHTTP.sendAsBinary(postData)   */
/*                                                                                                   */
/* Version 1.5 changes: Added alternate JSON-style parameter processing for RPGspRequest() and       */
/*                      shorthand functions.                                                         */
/*                                                                                                   */
/*                      Added ajaxJSON() function to perform requests with automatic evaluation of   */
/*                      JSON response.                                                               */
/*                                                                                                   */
/* Version 1.5.3 chgs:  Add ability to pass arrays into params for multiple occurrence parameters    */
/*                                                                                                   */
/* Version 1.5.4 chgs:  Made compatible with closure compiler                                        */
/*                                                                                                   */
/* Version 1.5.5 chgs:  Eliminated duplicate storage of request headers in array. All request        */
/*                      headers are now stored in the "headers" member, regardless of how they were  */
/*                      added to the request -- setRequestHeader() or constructor param.             */
/*                                                                                                   */
/*                      Content-Type header will no longer be overridden if set manually by user.    */
/*                                                                                                   */
/*                      Content-Length header is now sent on a POST request.                         */
/*                                                                                                   */
/*                      New property so that "sendAsBinary" (for FF) can be disabled by the user.    */
/*                                                                                                   */
/* Version 1.5.6 chgs:  Made compatible with Google Closure Compiler. For real, this time! :-)       */
/*                                                                                                   */
/* Version 1.5.7 chgs:  Only send Content-Length with a user Content-Type                            */
/*                                                                                                   */
/* Supported browsers:  IE6+                                                                         */
/*                      Firefox 1.5+ / Win                                                           */
/*                      Netscape 8+ / Win                                                            */
/*                      Opera 9 / Win                                                                */
/*                      Safari 3 Beta / Win                                                          */
/*                      Chrome                                                                       */
/*****************************************************************************************************/
  
/**
 * RPGspRequest Class
 * @constructor
 */

function RPGspRequest(arg) {

  // Public fields.
  this["method"]         = null;
  this["postData"]       = null;
  this["url"]            = null;
  this["async"]          = null;
  this["user"]           = null;
  this["password"]       = null;
  this["suppressAlert"]  = null;
  this["onsuccess"]      = null;
  this["onfail"]         = null;
  this["onready"]        = null;
  this["headers"]        = {};
  this["params"]         = null;
  this["sendAsBinary"]   = true;
  
  // Private fields.
  var xmlhttpObj     = null;  
  var statusMessage  = null;
  var sendOK         = null;
  var sending        = null;
  var alertFn = (typeof(pui) != "undefined" && typeof(pui.alert) != "undefined") ? pui.alert : alert;
  
  // Reference to object that allows privileged methods to access the public members.
  var me = this;    
  
  // CONSTRUCTOR START.
  
  // Handle alternate parameter style.
  if (typeof(arguments[0]) == "object") {
    var paramObj = arguments[0];
    for (var i in paramObj) {
      if (typeof(this[i]) != "undefined") {
        this[i] = paramObj[i];
      }
    }    
  }
  else {
    this["url"] = arguments[0];
  }
  
  // Create page request object.
  if (window.XMLHttpRequest) {
    xmlhttpObj = new XMLHttpRequest();    
  }
  else if (window.ActiveXObject) {
    xmlhttpObj = new ActiveXObject("Microsoft.XMLHTTP");
  }
  else {
    alertFn("Ajax request error: Unsupported browser.");
    return;
  }
  
  // CONSTRUCTOR END.
  
  // Privileged methods.
  this.send = function() {

                // Validate the properties set by the user, and assign defaults for those 
                // properties not set.
                var method   = null;
                var async    = null;
                var postData = null; 
                
                if (me["method"] == null) {
                  method = "GET";
                }
                else {
                  if ((typeof me["method"] != "string") && (me["method"].toUpperCase() != "GET" || me["method"].toUpperCase() != "POST" || me["method"].toUpperCase() != "PUT")) {
                    alertFn('Invalid value for property: "method".');
                    return;
                  }
                  else {
                    method = me["method"].toUpperCase();
                  }                
                }
                
                if (method == "POST") {
                  if (me["postData"] != null) {
                    if (typeof me["postData"] != "string") {
                      alertFn('Invalid value for property: "postData".');
                      return;
                    }
                    else {
                      postData = me["postData"];
                    }
                  }
                  else {
                    // Never send null POST data. This confuses Chrome into changing the request type
                    // and failing, in some situations.
                    postData = "";
                  }  
                } 
                
                if (me["async"] == null) {
                  async = true;
                }
                else if (me["async"] != true && me["async"] != false) {
                  alertFn('Invalid value for property: "async".');
                  return;
                }
                else {
                  async = me["async"];
                }
                
                // TODO: Somehow validate if this is a correctly formed URL to avoid JS errors on the send().
                if (typeof me["url"] != "string") {
                  alertFn('Invalid value for property: "url".');
                  return;
                }
                
                if (me["user"] != null) {
                  if (typeof me["user"] != "string") {
                    alertFn('Invalid value for property: "user".');
                    return;                    
                  }
                }
                
                if (me["password"] != null) {
                  if (typeof me["password"] != "string") {
                    alertFn('Invalid value for property: "password".');
                    return;                    
                  }
                }

                if (me["onsuccess"] != null) {
                  if (typeof me["onsuccess"] != "function") {
                    alertFn('Invalid value for event: "onsuccess".');
                    return;
                  }
                }
                
                if (me["onfail"] != null) {
                  if (typeof me["onfail"] != "function") {
                    alertFn('Invalid value for event: "onfail".');
                    return;
                  }
                }
                
                if (me["onready"] != null) {
                  if (typeof me["onready"] != "function") {
                    alertFn('Invalid value for event: "onready".');
                    return;
                  }
                }

                // Handle params object.      
                var url = me["url"];
                var params = me["params"];
              
                if (typeof(params) == "object") {
                  var paramString = "";  
                  for (var name in params) {
                    var paramValue = params[name];
                    var paramValues = [];
                    if (typeof paramValue == "object") {  // handle multiple occurrences
                      if (paramValue.length != null && paramValue.length > 0) {
                        paramValues = paramValue;
                      }
                    }
                    else {
                      paramValues.push(paramValue);  // there is only 1 value
                    }
                    for (var i = 0; i < paramValues.length; i++) {
                      if (paramString != "") paramString += "&";
                      paramString += encodeURIComponent(name) + "=" + encodeURIComponent(paramValues[i]);     
                    }
                  }
                  if (paramString != "") {
                    if (method.toUpperCase() == "POST") {
                      if (postData != null && postData != "") postData += "&";
                      else postData = "";
                      postData += paramString;  
                    }
                    else {
                      // Try to "intelligently" append to the URL.
                      var urlParts = url.split("?");
                      if (urlParts.length == 2 && urlParts[1] != "") {
                        url = urlParts[0] + "?" + urlParts[1] + "&" + paramString;
                      }
                      else {
                        url += "?" + paramString;
                      }
                    }
                  }
                }
                
                try {
                
                  xmlhttpObj.open(method, url, async, me["user"], me["password"]);
                  
                  // Set any headers specified.
                  var userCT = false;
                  var headers = me["headers"];
                  for (var name in headers) {
                    xmlhttpObj.setRequestHeader(name, headers[name]);
                    if (name.toUpperCase() == "CONTENT-TYPE") {
                      userCT = true;  
                    }
                  }                  
                  
                  // Set content-type and content-length headers if POST request.
                  if (method == "POST") {
                    if (!userCT) {
                      xmlhttpObj.setRequestHeader('Content-type','application/x-www-form-urlencoded');
                    }
                    else {
                      xmlhttpObj.setRequestHeader("Content-Length", (postData != null) ? postData.length : 0);
                    }
                  }
                  
                }
                catch(e) {
                  alertFn(e);
                  return;
                }
                
                sending = true;
                
                // Register handler only if sending an asynchronous request. Otherwise, call the
                // handler after the send. 
                // This is necessary to get around a Mozilla quirk - the handler is not called for synchronous requests.
                if (async == true) xmlhttpObj.onreadystatechange = handler;            

                if (me["sendAsBinary"] == true) {
                
                  try {
                    xmlhttpObj["sendAsBinary"](postData);
                  }
                  catch(e) {
                    xmlhttpObj.send(postData);   
                  }                
                
                }
                else {
                  xmlhttpObj.send(postData);   
                }

                
                if (async != true) handler();
                  
                function handler() {
                 if (xmlhttpObj.readyState == 4) {
                  statusMessage = xmlhttpObj.status + " - " + xmlhttpObj.statusText;
                  if (me["onready"] != null) me["onready"](me);
                  if (xmlhttpObj.status == 200) {
                    sendOK = true;
                    if (me["onsuccess"] != null) me["onsuccess"](me);
                  }
                  else {
                    sendOK = false;
                    if (me["suppressAlert"] != true) {
                      alertFn(statusMessage);
                    }
                    if (me["onfail"] != null) me["onfail"](me);
                  }
                   sending = false;
                 }
                }
                
  }
  this["send"] = this.send;
  
  this.ok = function() {
  
    if (sendOK != null) {
      return sendOK;
    }
    else {
      return false;
    }
    
  }
  this["ok"] = this.ok;
            
  this.getResponseText = function() {
  
    return xmlhttpObj.responseText;
    
  }
  this["getResponseText"] = this.getResponseText;
                         
  this.getResponseXML =  function() {
  
    return xmlhttpObj.responseXML;
    
  }
  this["getResponseXML"] = this.getResponseXML;                         
                         
  this.getStatus = function() {
  
    return xmlhttpObj.status; 
    
  }
  this["getStatus"] = this.getStatus;
                   
  this.getStatusText = function() {
  
    return xmlhttpObj.statusText; 
    
  }
  this["getStatusText"] = this.getStatusText;
                       
  this.getStatusMessage = function() {
  
    return statusMessage;
    
  }
  this["getStatusMessage"] = this.getStatusMessage;
                          
  this.getAllResponseHeaders = function() {
  
    if (!sendOK) return;
    
    try {
      return xmlhttpObj.getAllResponseHeaders();
    }
    catch(e) {
      alertFn(e);
    }
    
  }
  this["getAllResponseHeaders"] = this.getAllResponseHeaders;
  
  this.getResponseHeader = function(headerName) {
  
    if (!sendOK) return;
    
    try {
      return xmlhttpObj.getResponseHeader(headerName);
    }
    catch(e) {
      alertFn(e);
    }
    
  }
  this["getResponseHeader"] = this.getResponseHeader;
  
  this.setRequestHeader = function(headerLabel, headerValue) {
  
    me["headers"][headerLabel] = headerValue;
    
  }
  this["setRequestHeader"] = this.setRequestHeader;
  
  this.abort = function() {
  
    if (sending == null || sending == true) return;
    
    try {
      xmlhttpObj.abort();
    }
    catch(e) {
      alertFn(e);
    }
    
  }
  this["abort"] = this.abort;
  
}

function ajax(url, handler) {

  var ajaxRequest;
  
  // Handle optional parameter style and async/handler variables.
  var ajaxRequest;
  var async;
  var callback;
  var responseText = "";  
  
  if (arguments.length == 1 && typeof(arguments[0]) == "object") {
    // In this case, the parameters are passed as a single JSON object to the RPGspRequest() constructor.
    // The callback and async properties need to be "nulled" in this case to maintain
    // consistent operation of this function.  
    var paramObj = arguments[0];
    paramObj["async"] = null;
    paramObj["onsuccess"] = null;
    //paramObj["onfail"] = null;
    if (typeof(paramObj["handler"]) == "function") {
      async = true;
      callback = paramObj["handler"];
    }
    else {
      async = false;
    } 
  }
  else {
    // Otherwise determine mode of operation based on the function parameters.
    if (handler != null && typeof(handler) == "function") {
      async = true;
      callback = handler;
    }
    else {
      async = false;
    }
  }
  var ajaxRequest  = new RPGspRequest(arguments[0]);
  ajaxRequest["async"] = async;
  ajaxRequest["onsuccess"] = internalHandler;
  ajaxRequest.send();
  
  if (async == false) {
    return responseText;
  }
  
  function internalHandler(ajaxRequest) {
    responseText += ajaxRequest.getResponseText();
    if (async == true) {
      callback(responseText);
    }
  }  

}

function ajaxXML(url, handler) {

  var ajaxRequest;
  
  // Handle optional parameter style and async/handler variables.
  var ajaxRequest;
  var async;
  var callback;
  var responseXML = null;  
  
  if (arguments.length == 1 && typeof(arguments[0]) == "object") {
    // In this case, the parameters are passed as a single JSON object to the RPGspRequest() constructor.
    // The callback and async properties need to be "nulled" in this case to maintain
    // consistent operation of this function.  
    var paramObj = arguments[0];
    paramObj["async"] = null;
    paramObj["onsuccess"] = null;
    paramObj["onfail"] = null;
    paramObj["onsuccess"] = null;
    if (typeof(paramObj["handler"]) == "function") {
      async = true;
      callback = paramObj["handler"];
    }
    else {
      async = false;
    } 
  }
  else {
    // Otherwise determine mode of operation based on the function parameters.
    if (handler != null && typeof(handler) == "function") {
      async = true;
      callback = handler;
    }
    else {
      async = false;
    }
  }
  var ajaxRequest  = new RPGspRequest(arguments[0]);
  ajaxRequest["async"] = async;
  ajaxRequest["onsuccess"] = internalHandler;
  ajaxRequest.send();
  
  if (async == false) {
    return responseXML;
  }
  
  function internalHandler(ajaxRequest) {
    responseXML = ajaxRequest.getResponseXML();
    if (async == true) {
      callback(responseXML);
    }
  }  

}

function ajaxJSON(url, handler) {

  // Handle optional parameter style and async/handler variables.
  var ajaxRequest;
  var async;
  var callback;
  var responseObj = null;  
  var saveResponse = false;
  
  if (arguments.length == 1 && typeof(arguments[0]) == "object") {
    // In this case, the parameters are passed as a single JSON object to the RPGspRequest() constructor.
    // The callback and async properties need to be "nulled" in this case to maintain
    // consistent operation of this function.  
    var paramObj = arguments[0];
    paramObj["async"] = null;
    paramObj["onsuccess"] = null;
    //paramObj["onfail"] = null;
    if (paramObj["saveResponse"] == true) saveResponse = true;
    if (typeof(paramObj["handler"]) == "function") {
      async = true;
      callback = paramObj["handler"];
    }
    else {
      async = false;
    } 
  }
  else {
    // Otherwise determine mode of operation based on the function parameters.
    if (handler != null && typeof(handler) == "function") {
      async = true;
      callback = handler;
    }
    else {
      async = false;
    }
  }
  var ajaxRequest  = new RPGspRequest(arguments[0]);
  ajaxRequest["async"] = async;
  ajaxRequest["onsuccess"] = internalHandler;
  ajaxRequest.send();
  
  if (async == false) {
    return responseObj;
  }
  
  function internalHandler(ajaxRequest) {
    var responseText = ajaxRequest.getResponseText();
    if (saveResponse && typeof pui == "object") {
      pui["savedJSON"] = responseText;
    }
    try {
      responseObj = eval("(" + responseText + ")");    
    }
    catch(e) {
		callback(null, e);
		return;
    }
	if (async == true) {
	  callback(responseObj);
	}  
  }  
  

}

function ajaxSubmit(form, handler) { 
  var formObj;
  var postData = "";
  var alertFn = (typeof(pui) != "undefined" && typeof(pui.alert) != "undefined") ? pui.alert : alert;
  
  if (typeof(form)=="object") {
    formObj = form;    
  }
  else {
    formObj = document.getElementById(form);
    if (formObj==null) {
      formObj = document.forms[form];
    }
  }
  var tagName;
  if (formObj!=null) tagName = formObj.tagName;
  if (formObj==null || tagName==null || tagName.toUpperCase() != "FORM") {
    alertFn("Ajax request error: Invalid form object.");
    return "";
  }
  if (form.action == "") {
    alertFn("Ajax request error: Invalid form action.");
    return "";    
  }
  
  for (var i = 0; i < formObj.elements.length; i++) {
    var elem = formObj.elements[i];
    if (elem.name != null && elem.name != "") {
      var go = false;
      if (elem.tagName == "INPUT") {
        var elemType = elem.type;
        elemType = elemType.toLowerCase();
        if (elemType == "hidden") go = true;
        if (elemType == "password") go = true;
        if (elemType == "text") go = true;
        if (pui.isHTML5InputType(elemType)) go = true;
        if (elemType == "") go = true;
        if (elemType == "checkbox" || elemType == "radio") {
          if (elem.checked) go = true;
        }
      }
      if (elem.tagName == "TEXTAREA") go = true;
      if (elem.tagName == "SELECT") go = true;
      if (go) {
        if (postData!="") postData += "&";
        postData += elem.name + "=" + encodeURIComponent(elem.value)
      }
    }
  }
  
  var ajaxRequest  = new RPGspRequest(formObj.action);
  ajaxRequest["method"] = "POST";
  ajaxRequest["postData"] = postData;
  var responseText = "";
  var async;
  
  if (handler != null && typeof(handler) == "function") {
    async = true;
  }
  else {
    async = false;
    ajaxRequest["async"] = false;
  }
  
  ajaxRequest["onsuccess"] = internalHandler;
  ajaxRequest.send();
  
  if (async == false) {
    return responseText;
  }
  
  function internalHandler(ajaxRequest) {
    responseText += ajaxRequest.getResponseText();
    if (async == true) {
      handler(responseText);
    }
  }  
  
}

if (typeof(window["pui"]) == "undefined") {
  window["pui"] = {};
}

window["RPGspRequest"] = RPGspRequest;
window["pui"]["Ajax"] = RPGspRequest;
window["pui"]["AjaxRequest"] = RPGspRequest;
window["ajax"] = ajax;
window["ajaxXML"] = ajaxXML;
window["ajaxJSON"] = ajaxJSON;
window["ajaxSubmit"] = ajaxSubmit;