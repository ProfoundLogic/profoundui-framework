
function buildGraphicButton(parms) {
  var dom = parms.dom;
  var value = parms.evalProperty("value");
  var imageSource = parms.evalProperty("image source");
  if (parms.properties["value"] == "script: value") {
    if (value == "") value = parms.dom.innerHTML;
    if (value.substr(0,5).toLowerCase() == "<img ") {
      var pos = value.indexOf(">");
      if (pos >= 0) {
        value = value.substr(pos + 1);
      }
      else {
        value = "";
      }
    }
  }
  var graphic = "";
  if (imageSource != null && imageSource != "") {
    graphic = '<img src="' + imageSource + '" style="vertical-align:middle;padding-bottom:2px;" /> ';
  }
  dom.setAttribute("type", "button");
  dom.innerHTML = graphic + value;
}


pui.widgets.add({
  name: "graphic button",
  tag: "button",
  inputType: "button",
  newValue: "Accept",
  inlineEdit: true,
  defaults: {
    "width": !quirksMode ? "100px" : null,
    "image source": "/profoundui/proddata/images/accept.png",
    color: "#009933",
    "font weight": "bold"
  },

  propertySetters: {
  
    "field type": function(parms) {
      buildGraphicButton(parms);
    },
    
    "value": function(parms) {
      parms.properties["value"] = parms.value;
      buildGraphicButton(parms);
    },
    
    "image source": function(parms) {
      parms.properties["image source"] = parms.value;
      buildGraphicButton(parms);
    }
    
  }
  
});



