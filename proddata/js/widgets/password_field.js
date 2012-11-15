
pui.widgets.add({
  name: "password field",
  tag: "input",
  inputType: "password",
  newId: "Password",

  propertySetters: {
  
    "field type": function(parms) {
      parms.dom.value = parms.evalProperty("value");
      if (!parms.design && pui.iPadEmulation && !pui.iPhoneEmulation) {
        addEvent(parms.dom, "focus", function(event) {
          getObj("ipadKeyboard").style.display = "";
        });
        addEvent(parms.dom, "blur", function(event) {
          getObj("ipadKeyboard").style.display = "none";
        });
      }
    },
    
    "value": function(parms) {
      parms.dom.value = parms.value;
    }
  
  }
  
});

