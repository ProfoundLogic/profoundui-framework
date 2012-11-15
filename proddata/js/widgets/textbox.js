
pui.widgets.add({
  name: "textbox",
  tag: "input",
  newId: "TextBox",
  defaults: {
    "css class": "input"
  },

  propertySetters: {
  
    "field type": function(parms) {
      parms.dom.value = parms.evalProperty("value");
      if (!parms.design) {
        applyAutoComp(parms.properties, parms.originalValue, parms.dom);
        if (pui.iPadEmulation && !pui.iPhoneEmulation) {
          addEvent(parms.dom, "focus", function(event) {
            getObj("ipadKeyboard").style.display = "";
          });
          addEvent(parms.dom, "blur", function(event) {
            getObj("ipadKeyboard").style.display = "none";
          });
        }
      }
      if (parms.design) parms.dom.readOnly = true;
    },
    
    "value": function(parms) {
      parms.dom.value = parms.value;
    }
  
  }
  
});


