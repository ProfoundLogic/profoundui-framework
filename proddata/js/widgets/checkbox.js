
pui.widgets.add({
  name: "checkbox",
  tag: "input",
  inputType: "checkbox",
  labelProperty: "label",
  resizable: false,
  defaults: {
    label: "Checkbox"
  },

  propertySetters: {
  
    "field type": function(parms) {
      var objValue = parms.evalProperty("value");
      var checkedValue = parms.evalProperty("checked value");
      parms.dom.checkedValue = checkedValue;
      if (!quirksMode) {
        if (!is_ie) {
          parms.dom.style.margin = "2px";
        }
      }
      if (context == "genie" && parms.dom.originallyChecked != null && parms.properties["value"] == null && parms.properties["checked value"] == null) {
        parms.dom.checked = parms.dom.originallyChecked;
      }
      else {
        if (objValue == checkedValue) parms.dom.checked = true;
        else parms.dom.checked = false;
      }
      if (!parms.design) {
        var uncheckedValue = parms.evalProperty("unchecked value");
        parms.dom.uncheckedValue = uncheckedValue;
        checkboxObjects.push(parms.dom);
        var labelText = parms.evalProperty("label");
        if (labelText != "") buildLabel(parms.dom, labelText);
        if (context == "dspf") {
          addEvent(parms.dom, "click", function() {
            if (parms.dom.readOnly) {
              if (parms.dom.checked == false) parms.dom.checked = true;
              else if (parms.dom.checked == true) parms.dom.checked = false;
            }
          });
        }
      }
    },
    
    "value": function(parms) {
      var checkedValue = parms.evalProperty("checked value");
      parms.dom.checkedValue = checkedValue;
      if (parms.value == checkedValue) parms.dom.checked = true;
      else parms.dom.checked = false;    
    },
    
    "checked value": function(parms) {
      var objValue = parms.evalProperty("value");
      var checkedValue = parms.value;
      parms.dom.checkedValue = checkedValue;
      if (objValue == checkedValue) parms.dom.checked = true;
      else parms.dom.checked = false;
    }
    
  }

});

