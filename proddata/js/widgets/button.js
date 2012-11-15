
pui.widgets.add({
  name: "button",
  tag: "input",
  inputType: "button",
  newValue: "Click Here",
  inlineEdit: true,
  defaults: {
    "width": !quirksMode ? "100px" : null,
    "css class": "button"    
  },
  
  propertySetters: {

    "field type": function(parms) {
      parms.dom.value = parms.evalProperty("value");
      if (parms.design && parms.properties["field type"] != "button") {
        var cssClass = parms.designItem.properties["css class"];
        if (cssClass == null) cssClass = "";
        if (typeof cssClass != "object") {
          if (cssClass.indexOf("button") < 0) {
            if (cssClass != "") cssClass += " ";
            cssClass += "button";
            parms.designItem.properties["css class"] = cssClass;
            parms.designItem.propertiesChanged["css class"] = true;
            parms.dom.className = cssClass;
          }
        }
      }
      if (!parms.design) {
        addEvent(parms.dom, "keydown", function(e) {
          // prevent enter key from bubbling so that user can press enter to initiate the button 
          // otherwise the enter key response would be sent to the server instead
          var key = e.keyCode;
          if (key == 13) {
            if (!e) e = window.event;
            e.cancelBubble = true;
          }
        });
      }
    },
    
    "value": function(parms) {
      parms.dom.value = parms.value;
    }    

  }
  
});


