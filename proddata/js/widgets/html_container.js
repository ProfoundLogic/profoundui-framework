
pui.widgets.add({
  name: "html container",
  inlineEdit: true,
  defaults: {
    html: "<i>HTML Content</i>",
    "white space": "normal",
    width: "200px",
    height: "100px"
  },

  propertySetters: {
  
    "field type": function(parms) {
      parms.dom.innerHTML = parms.evalProperty("html");
    },
    
    "html": function(parms) {
      parms.dom.innerHTML = parms.value;
    }

  }

});

