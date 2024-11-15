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
  var config = pui["errorScreen"]["getConfig"]();

  if (pui["errorScreen"]["getStack"]()) {
    if (config["type"] !== "production") applyProperty("ErrorStackDownload", "visibility", "visible");
  }

  if ((window["puiMobileClient"] == null && window["device"] != null &&
    window["device"]["platform"] == "iOS") ||
    pui.genie != null) {
    applyProperty("btnBack", "visibility", "hidden");
    applyProperty("btnBack", "field type", "graphics button");
  }

  var jobinfo;
  if (pui.genie != null) {
    applyProperty("NewSessionButton", "value", pui["getLanguageText"]("runtimeText", "ok"));
    applyProperty("NewSessionButton", "onclick", "pui.click();");

    if (pui.appJob != null && typeof pui.appJob["appjoblogkey"] === "string" && pui.appJob["appjoblogkey"].length > 0) {
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
      if (typeof saveAs == "function") {
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
  if (config["type"] === "development-advanced") pui["errorScreen"]["interactiveStack"]();

  var xhr;
  function downloadJobLog() {
    xhr = new XMLHttpRequest();
    xhr.addEventListener("error", xhrerror);
    xhr.addEventListener("load", joblogFetch);
    xhr.open("POST", getProgramURL("PUI0009118.pgm"), true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send("jobinfo=" + jobinfo);
  }

  function joblogFetch() {
    if (typeof xhr.response === "string" && xhr.response.length > 0) {
      var contentDisp = xhr.getResponseHeader("Content-Disposition");
      if (contentDisp === "attachment") {
        // The Content-Disposition header is "attachment" when the response is good.
        sessionStorage.setItem("joblog", xhr.response); // Store the results in memory.
        applyProperty("JobLogDownload", "visibility", "visible"); // show the download link.
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

  function xhrerror(err) {
    console.log("Job log download error:", err);
  }

  function createMaximizeIcon() {
    pui["errorScreen"]["maximizeIcon"] = document.createElement("div");
    pui["errorScreen"]["maximizeIcon"].id = "MaximizeIcon";
    pui["errorScreen"]["maximizeIcon"].title = pui["getLanguageText"]("runtimeText", "maximize");
    pui.runtimeContainer.appendChild(pui["errorScreen"]["maximizeIcon"]);
    pui["errorScreen"]["maximizeIcon"].className = "";
    applyProperty("MaximizeIcon", "field type", "icon");
    applyProperty("MaximizeIcon", "icon", "fontAwesome-regular:window-maximize");
    applyProperty("MaximizeIcon", "css class", "pui-error-screen-maximize-icon");
    window.addEventListener("resize", pui["errorScreen"]["positionMaximizeIcon"]);
    pui["errorScreen"]["maximizeIcon"].addEventListener("click", pui["errorScreen"]["maximize"]);
    pui["errorScreen"]["positionMaximizeIcon"]();
  }
};

pui.formatErrorText = function() {
  var dom = document.getElementById("ESHELP");
  var text;
  if (dom != null) {
    text = dom.innerHTML;
    if (text != null) {
      var searchFor = "Recovery  . . . :";
      text = text.replace(searchFor, "<br/><br/>" + searchFor);
      searchFor = searchFor.replace("  ", " "); // replace 2 spaces with one (IE)
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
  pui["errorScreen"]["maximizeIcon"].title = pui["getLanguageText"]("runtimeText", "restore");
};

pui["errorScreen"]["restore"] = function() {
  if (pui["errorScreen"]["maximizeIcon"].pui.properties["icon"].includes("maximize")) {
    pui["errorScreen"]["maximize"]();
    return;
  }

  // Restore the panel to its original size and position.
  var panel = document.querySelector("#ErrorPanel");
  for (var i = 0; i < pui["errorScreen"]["savedStyle"].length; i++) {
    var entry = pui["errorScreen"]["savedStyle"][i];
    entry.dom.style[entry["prop"]] = entry.value;
  }
  applyProperty(panel, "height", panel.style.height);

  pui["errorScreen"]["positionMaximizeIcon"]();

  applyProperty("MaximizeIcon", "icon", "fontAwesome-regular:window-maximize");
  pui["errorScreen"]["maximizeIcon"].title = pui["getLanguageText"]("runtimeText", "maximize");
};

pui["errorScreen"]["positionMaximizeIcon"] = function() {
  setTimeout(function() {
    if (pui["errorScreen"]["maximizeIcon"]) {
      var panel = document.querySelector("#ErrorPanel");
      if (!panel) return;
      var x = panel.offsetLeft + panel.offsetWidth - 35;
      var y = panel.offsetTop + 10;
      pui["errorScreen"]["maximizeIcon"].style.left = x + "px";
      pui["errorScreen"]["maximizeIcon"].style.top = y + "px";
    }
  }, 100);
};

pui["errorScreen"]["savedStyle"] = [];
pui["errorScreen"]["saveStyle"] = function(dom, prop) {
  var newEntry = { "dom": dom, "prop": prop, "value": dom.style[prop] };
  pui["errorScreen"]["savedStyle"].push(newEntry);
};

pui["errorScreen"]["downloadStack"] = function() {
  pui.downloadAsAttachment("text/plain", "error stack.txt", pui["errorScreen"]["getStack"]());
};

pui["errorScreen"]["getStack"] = function() {
  var stackData = get("ESSTACK");
  try {
    stackData = JSON.parse(stackData);
  }
  catch (e) {
    return "";
  }
  if (!stackData["stackText"]) {
    return "";
  }
  return stackData["stackText"];
};

pui["errorScreen"]["getConfig"] = function() {
  var stackData = get("ESSTACK");
  try {
    stackData = JSON.parse(stackData);
  }
  catch (e) {
    return {};
  }
  if (!stackData.config) {
    return {};
  }
  return stackData.config;
};

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
  container.style.left = "10px";
  container.style.width = "calc(100% - 20px)";
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
  if (!stackData["parsedStack"] || stackData["parsedStack"].length === 0) {
    return;
  }
  var stack = stackData["parsedStack"];
  for (var i = 0; i < stack.length; i++) {
    var entry = stack[i];
    var div = document.createElement("div");
    div.classList.add("pui-error-screen-stack-entry");
    div.innerText = entry.text;
    div.title = entry.title;
    entry.div = div;
    entry.codeObj = stackData["stackCode"][i];
    // convert object to string
    var codeLines = [];
    entry.code = "";
    for (var lineKey in entry.codeObj) {
      var codeLine = lineKey + " " + entry.codeObj[lineKey];
      codeLines.push(codeLine);
    }
    entry.code = codeLines.join("\n");

    div.addEventListener("click", showStackEntry.bind(null, entry));

    left.appendChild(div);
  }
  showStackEntry(stack[0]);

  function showStackEntry(entry) {
    var config = pui["errorScreen"]["getConfig"]();
    if (selectedEntry != null) {
      selectedEntry.div.classList.remove("pui-stack-entry-selected");
      if (config["editor"]) applyProperty("EditInIDE", "visibility", "hidden");
    }
    pui["errorScreen"]["currentStackEntry"] = entry;
    selectedEntry = entry;
    if (!entry || !entry.div) return;
    if (config["editor"] &&
        entry.fileName &&
        (entry.fileName.endsWith(".js") || entry.fileName.endsWith(".json")) &&
        entry.code
    ) {
      applyProperty("EditInIDE", "visibility", "visible");
    }
    entry.div.classList.add("pui-stack-entry-selected");
    var code = right.querySelector(".pui-error-screen-stack-right pre code");
    code.innerHTML = entry.code;
    if (!entry.code) code.textContent = "\n// Code not available for this error stack entry.\n";
    if (typeof hljs === "object") hljs["highlightElement"](code);

    // Highlight the line of code in error
    var codeLines = right.querySelector(".pui-error-screen-stack-right pre.error-code-lines");
    codeLines.innerHTML = "";
    if (!entry.code) return;
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
};

pui["errorScreen"]["currentStackEntry"] = null;

pui["errorScreen"]["editInIDE"] = function() {
  if (!pui["errorScreen"]["currentStackEntry"]) return;
  var entry = pui["errorScreen"]["currentStackEntry"];
  var config = pui["errorScreen"]["getConfig"]();
  var url = config["editor"];

  // Setup common editor shortcuts
  if (url === "vscode") url = "vscode://file/$file:$line:$column";
  if (url === "pjs" || url === "profound.js" || url === "profoundjs") url = "http://localhost:8081/ide/?ifsFile=$file&line=$line&column=$column";

  // Replace variables
  var fileName = entry.fileName.replace(/\\/g, "/");
  var lineNumber = entry.lineNumber;
  var columnNumber = entry.columnNumber;
  if (!fileName.endsWith(".js")) {
    lineNumber = 1;
    columnNumber = 1;
  }
  url = url.replace("$file", fileName);
  url = url.replace("$line", lineNumber);
  url = url.replace("$column", columnNumber);

  // Open the URL
  window.open(url, "_blank");
};

pui["errorScreen"]["downloadJobLog"] = function() {
  var job_num_user_name;
  var feedback_element = getObj("JobLogDownload_fb");
  var filename_prefix = pui["getLanguageText"]("runtimeText", "app job") + " "; // e.g. "Application Job ".
  var file_ext = ".txt";

  if (pui.genie != null) {
    // In Genie the job log is the Genie App Job and can be downloaded from Profound UI via an API.
    var appJob = pui["appJob"];
    job_num_user_name = "NA";
    if (appJob["number"] && appJob["user"] && appJob["name"]) {
      job_num_user_name = appJob["number"] + "_" + appJob["user"] + "_" + appJob["name"];
    }

    pui["downloadJobLog"]({
      "outputEl": feedback_element,
      "jobinfo": appJob["appjoblogkey"],
      "filename": filename_prefix + job_num_user_name + file_ext
    });
  }
  else {
    // In Profound.js and not in Genie the job log should have already downloaded due to "onload". Prompt to save it.
    var joblog = sessionStorage.getItem("joblog");
    if (typeof joblog !== "string" || joblog.length < 1) {
      feedback_element.innerHTML = "Job log failed to download. Please check browser console for more information.";
    }
    else {
      job_num_user_name = pui.get("ESAPPJOB").replace(/\//g, "_");
      var filesaver = saveAs(
        new Blob([joblog]),
        filename_prefix + job_num_user_name + file_ext,
        { "type": "text/plain;charset=utf-8" }
      );
      filesaver.onwriteend = waitAndClearLinkText;
    }
  }

  function waitAndClearLinkText() {
    setTimeout(function() {
      feedback_element.innerHTML = "";
    }, 3000);
  }
};
