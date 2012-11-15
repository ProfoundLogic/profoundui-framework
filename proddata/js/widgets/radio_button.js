
pui.widgets.add({
  name: "radio button",
  tag: "input",
  inputType: "radio",
  labelProperty: "label",
  resizable: false,
  defaults: {
    label: "Radio Button"
  },
  
  propertySetters: {
  
    "field type": function(parms) {
      if (parms.design && !quirksMode) {
        if (!is_ie) {
          parms.dom.style.margin = "2px";
        }
      }
      if (!parms.design) {
        var labelText = parms.evalProperty("label");
        if (labelText != "") {
          if (parms.properties["left"] != null) parms.dom.style.left = parms.properties["left"];
          if (parms.properties["top"] != null) parms.dom.style.top = parms.properties["top"]; 
          buildLabel(parms.dom, labelText);
        }
        if (context == "dspf") {
          var value = parms.evalProperty("value");
          var groupValue = parms.evalProperty("radio button group");
          if (value != null && groupValue != null) {
            if ((value == groupValue) || (!isNaN(Number(value)) && !isNaN(Number(groupValue)) && Number(value) == Number(groupValue))) {
              if (is_ie) parms.dom.name = "radio";  // temporary name -- fixes problem of checkboxes being checked off in IE8 standards mode when radio button's checked dom property is set to true
              parms.dom.checked = true;
            }
          }        
          addEvent(parms.dom, "click", function() {
            if (parms.dom.readOnly) {
              if (parms.dom.checked == false) parms.dom.checked = true;
              else if (parms.dom.checked == true) parms.dom.checked = false;
            }
          });
        }
      }
    }      
  }
    
});

