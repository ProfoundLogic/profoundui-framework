

pui.widgets.add({
  name: "iframe",
  newId: "IFrame",
  menuName: "IFrame",
  defaults: {
    width: "400px",
    height: "300px",
    "z index": "25",
    "background color": "#FFFFFF",
    "frame border": "true"
  },
  
  propertySetters: {
  
    "field type": function(parms) {
      if (parms.design) {
        parms.dom.innerHTML = "IFrame content will appear here.";
        parms.dom.style.overflow = "hidden";
      }
      else {
        parms.dom.innerHTML = "";
        url = parms.evalProperty("iframe url");
        if (url == null || url == "") {
          parms.dom.innerHTML = "IFrame URL property not specified.";
        }
        else {
          var widthHeight = "";
          var width = parseInt(parms.properties["width"]);
          var height = parseInt(parms.properties["height"]);
          if (width > 0) widthHeight += ' width="' + width + '"';
          if (height > 0) widthHeight += ' height="' + height + '"';
          var html = '<iframe src="' + url;
          html += '" frameborder="';
          html += (parms.properties["frame border"] == "true") ? "1" : "0";
          html += '"' + widthHeight + '>';
          parms.dom.innerHTML = html;
        }
      }
    }
    
  }
  
});

