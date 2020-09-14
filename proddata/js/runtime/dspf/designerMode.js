
pui.viewdesigner = false;
pui.nodedesigner = false;
if (window["pui_cloud_designer"]) {
  pui.nodedesigner = true;
}
else if (location.pathname.match(/^\/ide/i)) {
  pui.nodedesigner = true;
}
else {
  var match = location.pathname.match(/\/([^\/]+)\/?$/i);
  if (match && match[1].toLowerCase() === "viewdesigner")
    pui.viewdesigner = true;
  else if (match && match[1].toLowerCase() === "nodedesigner")
    pui.nodedesigner = true;
  delete match;
}
pui.codeBased = false;