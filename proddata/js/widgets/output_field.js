
function buildOutputField(parms, value) {
  if (!parms.design) {
    var originalValue = getInnerText(parms.oldDom);
    if (originalValue != null && originalValue != "" && parms.dom.originalValue == null) {
      parms.dom.originalValue = originalValue;
    }       
  }
  parms.dom.innerHTML = "";
  var text = value;
  text = text.replace(/ /g, "\u00a0");
  parms.dom.appendChild(document.createTextNode(text));
  if (context == "dspf" && parms.design) {
    var overflowX = parms.properties["overflow x"];
    if (overflowX == null) overflowX = "";
    var overflowY = parms.properties["overflow y"];
    if (overflowY == null) overflowY = "";
    if (parms.propertyName == "value" && typeof parms.newValue == "object" ||
        parms.propertyName != "value" && typeof parms.properties.value == "object") {      
      if (overflowX == "") parms.dom.style.overflowX = "hidden";
      if (overflowY == "") parms.dom.style.overflowY = "hidden";
    }
    else {
      parms.dom.style.overflowX = overflowX;
    }
  }
}



pui.widgets.add({
  name: "output field",
  newValue: "New Output Field",
  inlineEdit: true,

  propertySetters: {
  
    "field type": function(parms) {
      buildOutputField(parms, parms.evalProperty("value"));      
    },
    
    "value": function(parms) {
      if (parms.design || parms.properties["value"] != "script: value") {
        buildOutputField(parms, parms.value);
      }
    },
    
    "overflow x": function(parms) {
      if (context == "dspf" && parms.design && typeof parms.properties.value == "object" && (parms.value == "" || parms.value == null)) {
        parms.properties["overflow x"] = "";
        parms.dom.style.overflowX = "hidden";
        return false;
      }
    }
        
  }
  
});


