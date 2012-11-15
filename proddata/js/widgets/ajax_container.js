
pui.widgets.add({
  name: "ajax container",
  defaults: {
    width: "200px",
    height: "100px"
  },

  propertySetters: {
  
    "field type": function(parms) {
      if (parms.design) {
        parms.dom.innerHTML = "AJAX content will appear here.";
        parms.dom.style.overflow = "hidden";
      }
      else {
        parms.dom.innerHTML = "";
        url = parms.evalProperty("ajax url");
        if (url == null || url == "") {
          parms.dom.innerHTML = "AJAX URL property not specified.";
        }
        else {
          ajax(url, function(response) {
            try {
              parms.dom.innerHTML = response;
            }
            catch(err) {
              parms.dom.innerHTML = err.message;
            }
          })
        }
      }
    }
    
  }
  
});

