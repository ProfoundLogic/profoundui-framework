
pui.imageElementMouseOver = function(event) {
  var image = getTarget(event);
  if (image.tagName != "IMG") return;
  if (image.hoverImage != null && image.hoverImage != "") {
    image.isMouseOver = true;
    if (image.isMouseDown != true) {
      image.src = image.hoverImage;
    }
  }
}

pui.imageElementMouseOut = function(event) {
  var image = getTarget(event);
  if (image.tagName != "IMG") return;
  image.isMouseOver = false;
  if (image.originalImage != null) {
    if (image.isMouseDown != true) {
      image.src = image.originalImage;
    }
  }
}

pui.imageElementMouseDown = function(event) {
  var image = getTarget(event);
  if (image.tagName != "IMG") return;
  if (image.clickImage != null && image.clickImage != "") {
    image.isMouseDown = true;
    image.src = image.clickImage;
  }
}

pui.imageElementMouseUp = function(image) {
  if (image.originalImage != null) {
    image.isMouseDown = false;
    if (image.isMouseOver == true) {
      image.src = image.hoverImage;
    }
    else {
      image.src = image.originalImage;
    }
  }
}

pui.widgets.add({
  name: "image",
  tag: "img",
  
  propertySetters: {

    "field type": function(parms) {
      parms.dom.onselectstart = function(e) { return false };
      parms.dom.ondragstart = function(e) { return false };
      if (typeof parms.dom.style.MozUserSelect!="undefined") parms.dom.style.MozUserSelect = "none";
      parms.dom.originalImage = parms.evalProperty("image source");
      parms.dom.src = parms.dom.originalImage;
      
      function preload(imageSrc) {
        var image = new Image(); 
        image.src = imageSrc;
      }

      var hoverImage = parms.evalProperty("hover image source")
      parms.dom.hoverImage = hoverImage;
      if (hoverImage != null && hoverImage != "") {
        addEvent(parms.dom, "mouseover", pui.imageElementMouseOver);
        addEvent(parms.dom, "mouseout", pui.imageElementMouseOut);
        var preloadImage1 = new Image();
        preloadImage1.src = hoverImage;
      }
      var clickImage = parms.evalProperty("click image source")
      parms.dom.clickImage = clickImage;
      if (clickImage != null && clickImage != "") {
        addEvent(parms.dom, "mousedown", pui.imageElementMouseDown);
        addEvent(document, "mouseup", function() {
          pui.imageElementMouseUp(parms.dom);
        });
        var preloadImage2 = new Image();
        preloadImage2.src = clickImage;
      }
    },
    
    "image source": function(parms) {
      parms.dom.originalImage = parms.value;
    },

    "hover image source": function(parms) {
      parms.dom.hoverImage = parms.value;
      if (parms.value != null && parms.value != "") {
        addEvent(parms.dom, "mouseover", pui.imageElementMouseOver);
        addEvent(parms.dom, "mouseout", pui.imageElementMouseOut);
        var preloadImage = new Image();
        preloadImage.src = parms.value;
      }
    },

    "click image source": function(parms) {
      parms.dom.clickImage = parms.value;
      if (parms.value != null && parms.value != "") {
        addEvent(parms.dom, "mousedown", pui.imageElementMouseDown);
        addEvent(document, "mouseup", function() {
          pui.imageElementMouseUp(parms.dom);
        });
        var preloadImage = new Image();
        preloadImage.src = parms.value;
      }
    }

  }

});

