
pui["encode hyperlink spaces"] = null;

pui.buildHyperlink = function(dom, value, designMode, href, target) {
  dom.innerHTML = "";
  var a = document.createElement("a");
  if (designMode == true || href == null) href = "javascript:void(0)";
  a.href = href;
  if (!designMode && target != null) a.target = target;
  var text = value;
  if ( (context == "genie" && pui["encode hyperlink spaces"] != false) ||
       (pui["encode hyperlink spaces"] == true) ) {
    text = text.replace(/ /g, "\u00a0");
  }
  if (dom.style.color != null) a.style.color = dom.style.color;
  if (dom.style.textDecoration != null) a.style.textDecoration = dom.style.textDecoration;
  a.appendChild(document.createTextNode(text));
  if (is_ie && (context == "dspf" || context == "genie")) {
    addEvent(a, "click", function(e) {
      e.returnValue = false;
      return false;      
      //pui.skipConfirm = true;
      //setTimeout(function() {
      //  pui.skipConfirm = false;
      //}, 0);
    });
  }
  dom.appendChild(a);
}


pui.widgets.add({
  name: "hyperlink",
  newValue: "Click Here",
  inlineEdit: true,
  defaults: {
    color: "#0066CC"
  },
  
  propertySetters: {
  
    "field type": function(parms) {
      
      pui.buildHyperlink(parms.dom, parms.evalProperty("value"), parms.design, parms.properties["hyperlink reference"], parms.properties["target"]);
      if (parms.design) {
        designUtils.addEvent(parms.dom, "mouseover", function() {
          setTimeout(parms.designItem.designer.selection.positionSizies, 0);
        });
        designUtils.addEvent(parms.dom, "mouseout", function() {
          setTimeout(parms.designItem.designer.selection.positionSizies, 0);
        });
      }
    },
    
    "value": function(parms) {
      pui.buildHyperlink(parms.dom, parms.value, parms.design, parms.properties["hyperlink reference"], parms.properties["target"]);
    }
    
  }
  
});




