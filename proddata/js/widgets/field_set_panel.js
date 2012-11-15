
pui.widgets.add({
  name: "field set panel",
  canBelongToGrid: false,
  tag: "fieldset",
  newId: "FieldSet",
  newValue: "Field Set",
  container: true,
  inlineEdit: true,
  defaults: {
    width: "300px",
    height: "200px",
    "z index": "8"
  },

  propertySetters: {
  
    "field type": function(parms) {
      parms.dom.innerHTML = "<legend>" + parms.evalProperty("value") + "</legend>";
    },
    
    "value": function(parms) {
      parms.dom.innerHTML = "<legend>" + parms.value + "</legend>";
    },

    "color": function(parms) {
      // set color on legend
      var legend = parms.dom.firstChild;
      if (legend != null && legend.tagName == "LEGEND") {
        legend.style.color = parms.value;
      }
    }
    
  }
  
});

