//  Profound UI Runtime  -- A Javascript Framework for Rich Displays
//  Copyright (c) 2022 Profound Logic Software, Inc.
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



pui["errorScreen"] = {};

pui["errorScreen"]["onload"] = function() {

  if (pui["errorScreen"]["getStack"]()) {
    applyProperty("ErrorStackDownload", "visibility", "visible");
  }

  if ((window["puiMobileClient"] == null && window["device"] != null &&
    window["device"]["platform"] == "iOS") ||
    pui.genie != null) {

    applyProperty("btnBack", "visibility", "hidden");
    applyProperty("btnBack", "field type", "graphics button");

  }

  var jobinfo;
  if (pui.genie != null) {

    applyProperty("NewSessionButton", "value", pui.getLanguageText("runtimeText", "ok"));
    applyProperty("NewSessionButton", "onclick", "pui.click();");

    if (pui.appJob != null && typeof pui.appJob["appjoblogkey"] === "string" && pui.appJob["appjoblogkey"].length > 0){
      // The job log can be downloaded if a key exists for it.
      applyProperty("JobLogDownload", "visibility", "visible");
    }
  }
  else {
    // Not in Genie. Automatically attempt to fetch the job log from the server before it
    // is cleared. The download link should display after the log downloads.
    sessionStorage.removeItem("joblog");

    jobinfo = pui["get"]("ESAPPJOBLOGKEY");
    if (jobinfo.length > 0) {
      // Load a helper function that facilitates prompting the user to save; then, download.
      var filesaverPath = "/jszip/FileSaver.min.js";
      if (typeof saveAs == "function"){
        downloadJobLog();
      }
      else {
        pui["loadJS"]({ "path": filesaverPath, "callback": downloadJobLog });
      }
    }
    else {
      console.log("Cannot download job log without job key.");
    }
  }

  pui.formatErrorText();
  pui.confirmOnClose = false;
  pui.shutdownOnClose = false;
  createMaximizeIcon();
  pui["errorScreen"]["interactiveStack"]();

  var xhr;
  function downloadJobLog(){
    xhr = new XMLHttpRequest();
    xhr.addEventListener("error", xhrerror);
    xhr.addEventListener("load", joblogFetch);
    xhr.open("POST", pui.getProgramURL("PUI0009118.pgm"), true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send("jobinfo=" + jobinfo);
  }

  function joblogFetch(){
    if (typeof xhr.response === "string" && xhr.response.length > 0){
      var contentDisp = xhr.getResponseHeader("Content-Disposition");
      if (contentDisp === "attachment"){
        // The Content-Disposition header is "attachment" when the response is good.
        sessionStorage.setItem("joblog", xhr.response);  //Store the results in memory.
        applyProperty("JobLogDownload", "visibility", "visible");  //show the download link.
      }
      else {
        // The response is error plain text.
        console.log(pui["getLanguageText"]("runtimeMsg", "failed to load x", ["Job Log"]) + "<br>" + xhr.response);
      }
    }
    else {
      console.log("Job log download error: Empty Response");
    }
  }

  function xhrerror(err){
    console.log("Job log download error:", error);
  }

  function createMaximizeIcon() {
    pui["errorScreen"]["maximizeIcon"] = document.createElement("div");
    pui["errorScreen"]["maximizeIcon"].id = "MaximizeIcon";
    pui["errorScreen"]["maximizeIcon"].title = "Maximize";
    pui.runtimeContainer.appendChild(pui["errorScreen"]["maximizeIcon"]);
    pui["errorScreen"]["maximizeIcon"].className = "";
    applyProperty("MaximizeIcon", "field type", "icon");
    applyProperty("MaximizeIcon", "icon", "fontAwesome-regular:window-maximize");
    applyProperty("MaximizeIcon", "css class", "pui-error-screen-maximize-icon");
    window.addEventListener("resize", pui["errorScreen"]["positionMaximizeIcon"]);
    pui["errorScreen"]["maximizeIcon"].addEventListener("click", pui["errorScreen"]["maximize"]);
    pui["errorScreen"]["positionMaximizeIcon"]();
  }

}


pui.formatErrorText = function() {
  var dom = document.getElementById("ESHELP");
  var text;
  if (dom != null) {
    text = dom.innerHTML;
    if (text != null) {
      var searchFor = "Recovery  . . . :";
      text = text.replace(searchFor, "<br/><br/>" + searchFor);
      searchFor = searchFor.replace("  ", " ");  // replace 2 spaces with one (IE)
      text = text.replace(searchFor, "<br/><br/>" + searchFor);
      dom.innerHTML = text;
    }
  }
};


pui["errorScreen"]["maximize"] = function() {
  if (!pui["errorScreen"]["maximizeIcon"].pui.properties["icon"].includes("maximize")) {
    pui["errorScreen"]["restore"]();
    return;
  }

  var panel = document.querySelector("#ErrorPanel");

  pui["errorScreen"]["savedStyle"] = [];
  var save = pui["errorScreen"]["saveStyle"];
  save(panel, "left");
  save(panel, "width");
  save(panel, "top");
  save(panel, "height");

  panel.style.left = "5px";
  panel.style.width = "calc(100% - 10px)";
  panel.style.top = "5px";
  panel.style.height = window.innerHeight - 10 + "px";
  applyProperty(panel, "height", panel.style.height);
  pui["errorScreen"]["positionMaximizeIcon"]();

  applyProperty("MaximizeIcon", "icon", "fontAwesome-regular:window-restore");
}

pui["errorScreen"]["restore"] = function() {
  if (pui["errorScreen"]["maximizeIcon"].pui.properties["icon"].includes("maximize")) {
    pui["errorScreen"]["onload"]["mazimize"]();
    return;
  }

  // Restore the panel to its original size and position.
  var panel = document.querySelector("#ErrorPanel");
  for (var i = 0; i < pui["errorScreen"]["savedStyle"].length; i++) {
    var entry = pui["errorScreen"]["savedStyle"][i];
    entry.dom.style[entry.prop] = entry.value;
  }
  applyProperty(panel, "height", panel.style.height);

  pui["errorScreen"]["positionMaximizeIcon"]();

  applyProperty("MaximizeIcon", "icon", "fontAwesome-regular:window-maximize");
}


pui["errorScreen"]["positionMaximizeIcon"] = function() {
  setTimeout(function() {
    if (pui["errorScreen"]["maximizeIcon"]) {
      var panel = document.querySelector("#ErrorPanel");
      var x = panel.offsetLeft + panel.offsetWidth - 35;
      var y = panel.offsetTop + 10;
      pui["errorScreen"]["maximizeIcon"].style.left = x + "px";
      pui["errorScreen"]["maximizeIcon"].style.top = y + "px";
    }
  }, 100);
}

pui["errorScreen"]["savedStyle"] = [];
pui["errorScreen"]["saveStyle"] = function(dom, prop) {
  var newEntry = { "dom": dom, "prop": prop, "value": dom.style[prop] };
  pui["errorScreen"]["savedStyle"].push(newEntry);
}


pui["errorScreen"]["downloadStack"] = function() {
  pui.downloadAsAttachment("text/plain", "error stack.txt", pui["errorScreen"]["getStack"]());
}


pui["errorScreen"]["getStack"] = function() {
  var stackData = get("ESSTACK");
  try {
    stackData = JSON.parse(stackData);
  }
  catch (e) {
    return "";
  }
  if (!stackData.stackText) {
    return "";
  }
  return stackData.stackText;
}


pui["errorScreen"]["interactiveStack"] = function() {

  // Load the highlighter if it's not already loaded
  if (typeof hljs !== "object") {
    pui["loadCSS"](pui.normalizeURL("/vlog/vs2015.min.css"));
    pui["loadJS"]({
      "path": pui.normalizeURL("/vlog/highlight.min.js"),
      "callback": function() {
        pui["errorScreen"]["interactiveStack"]();
      },
      "onerror": function() {
      }

    });
    return;
  }

  // Set up the error screen
  var container = getObj("ESHELP");
  container.innerHTML = "";
  var selectedEntry = null;

  // Create two side-by-side divs
  var left = document.createElement("div");
  var right = document.createElement("div");
  left.classList.add("pui-error-screen-stack-left");
  right.classList.add("pui-error-screen-stack-right");
  right.innerHTML = '<pre class="error-code-lines"></pre><pre><code></code></pre>';
  container.appendChild(left);
  container.appendChild(right);

  // Add error stack entries to the left div
  var stackData = get("ESSTACK");
  try {
    stackData = JSON.parse(stackData);
  }
  catch (e) {
    return;
  }
  if (!stackData.parsedStack ||  stackData.parsedStack.length === 0) {
    return;
  }
  var stack = stackData.parsedStack;
  for (var i = 0; i < stack.length; i++) {
    var entry = stack[i];
    var div = document.createElement("div");
    div.classList.add("pui-error-screen-stack-entry");
    div.innerText = entry.text;
    div.title = entry.title;
    entry.div = div;
    entry.codeObj = stackData.stackCode[i];
    // convert object to string
    var codeLines = [];
    entry.code = "";
    for (var lineKey in entry.codeObj) {
      var codeLine = lineKey + " " + entry.codeObj[lineKey];
      if (Number(lineKey) === entry.lineNumber) {
        // codeLine = `<mark class="pui-error-screen-highlighted-line">${codeLine}</mark>`;
        //codeLine = "«" + codeLine + "»";
      }
      codeLines.push(codeLine);
    }
    entry.code = codeLines.join("\n");

    div.addEventListener("click", function() {
      showStackEntry(entry);
    });
    left.appendChild(div);
  }
  showStackEntry(stack[0]);

  function showStackEntry(entry) {
    if (selectedEntry != null) {
      selectedEntry.div.classList.remove("pui-stack-entry-selected");
    }
    selectedEntry = entry;
    if (!entry || !entry.div) return;
    entry.div.classList.add("pui-stack-entry-selected");
    var code = right.querySelector(".pui-error-screen-stack-right pre code");
    code.textContent = entry.code;
    if (!entry.code) code.textContent = "\n// Code not available for this error stack entry.\n";
    if (typeof hljs === "object") hljs.highlightBlock(code);
    if (!entry.code) return;

    // Highlight the line of code in error
    var codeLines = right.querySelector(".pui-error-screen-stack-right pre.error-code-lines");
    codeLines.innerHTML = "";
    for (var lineKey in entry.codeObj) {
      var span = document.createElement("span");
      span.classList.add("error-code-line");
      span.innerHTML = "&nbsp;";
      if (Number(lineKey) === entry.lineNumber) {
        span.classList.add("highlighted-error-code-line");
      }
      codeLines.appendChild(span);
      // Add a new line text node
      codeLines.appendChild(document.createTextNode("\n"));
    }

  }

}
