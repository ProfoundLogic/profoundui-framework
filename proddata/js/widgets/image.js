//  Profound UI Runtime  -- A Javascript Framework for Rich Displays
//  Copyright (c) 2013 Profound Logic Software, Inc.
//
//  This file is part of the Profound UI Runtime
//
//  The Profound UI Runtime is free software: you can redistribute it and/or modify
//  it under the terms of the GNU Lesser General Public License as published by
//  the Free Software Foundation, either version 3 of the License, or
//  (at your option) any later version.
//
//  The Profound UI Runtime is distributed in the hope that it will be useful,
//  but WITHOUT ANY WARRANTY; without even the implied warranty of
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//  GNU Lesser General Public License for more details.
//
//  You should have received a copy of the GNU Lesser General Public License
//  In the COPYING and COPYING.LESSER files included with the Profound UI Runtime.
//  If not, see <http://www.gnu.org/licenses/>.



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

