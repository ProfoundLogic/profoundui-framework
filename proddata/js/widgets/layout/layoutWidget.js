

pui.widgets.add({
  name: "layout",
  canBelongToGrid: false,
  defaults: {
  },
  
  globalPropertySetter: function(parms) {
    if (parms.dom.layout == null) {
      parms.dom.layout = new pui.layout.Layout();
      parms.dom.layout.layoutDiv = parms.dom;
      parms.dom.layout.designItem = parms.designItem;
      if (parms.design) {
        parms.designItem.multipleSelection = false;
      }
    }

    var setProperty = true;
    if (parms.propertyName == "field type" || parms.propertyName == "template") {
      parms.dom.style.padding = "0px";
      parms.dom.style.borderWidth = "0px";
      
      // this is temporary and hacky ... we assume we want 100% height for browser viewport (should at least remove this once this screen has finished?)
      if (!parms.design && parms.properties["height"] == "100%" && parms.dom.parentNode.id == "pui") {
      
        // If height is unset, IE returns "auto", and all others return "0px"
        
        var parentStyle = pui.getComputedStyle( parms.dom.parentNode );
        if (parentStyle != null && ( parentStyle["height"]=="0px" || parentStyle["height"]=="auto" )) {
          document.body.style.padding = "0";
          document.body.style.height = "100%";
          document.body.parentNode.style.padding = "0";
          document.body.parentNode.style.height = "100%";
          document.body.style.overflow = "hidden";
          parms.dom.parentNode.style.padding = "0";
          parms.dom.parentNode.style.height = "100%";
        } 
        
      }
      
      if (parms.design) {
        if (!parms.dom.layout.designMode) {
          parms.dom.layout.enableDesign();
        }
        parms.dom.designItem = parms.designItem;
        parms.designItem.multipleSelection = false;
        if (parms.propertyName == "field type") {
          parms.dom.layout.setProperty("width", parms.properties["width"]);
          parms.dom.layout.setProperty("height", parms.properties["height"]);
        }
      }
      parms.dom.layout.template = parms.properties["template"];
      var savedTemplateName = null;
      if (parms.propertyName == "template") {
        savedTemplateName = parms.dom.layout.template;
        parms.dom.layout.template = parms.value;
      }
      else if (!parms.design) {
        addEvent(window, "resize", parms.dom.layout.stretch);
      }
      nmodel = makeNamedModel(pui.layout.getPropertiesModel());
      for (var prop in parms.properties) {
        if (!nmodel[prop]) parms.dom.layout.templateProps[prop] = parms.properties[prop];
      }
      var rv = parms.dom.layout.applyTemplate();
      if (rv.success == false && savedTemplateName != null) {
        parms.dom.layout.template = savedTemplateName;
        parms.dom.layout.updatePropertyInDesigner("template", savedTemplateName);
        setProperty = false;
      }
      if (rv.success == true && (!parms.design || toolbar.loadingDisplay || toolbar.pastingFormat)) {
        parms.dom.layout.containers = rv.containers;
      }
    }
    if (setProperty) parms.dom.layout.setProperty(parms.propertyName, parms.value);
  },
  
  initialize: function(parms) {
  }
    
});

