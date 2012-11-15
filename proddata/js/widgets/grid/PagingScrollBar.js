
/**
 * Paging Scrollbar Class
 * @constructor
 */

pui.PagingScrollBar = function() {

  this.x = 0;
  this.y = 0;
  this.height = 300;
  this.zIndex = 100;
  this.atTop = false;
  this.atBottom = false;
  this.designMode = false;
  this.container = null;
  this.onpageup = null;
  this.onpagedown = null;
  this.type = "paging";
  this.ready = false;

  var me = this;

  var ignoreOnScroll = false;
  var pagedUp = false;
  var pagedDown = false;
  var midPoint = 0;
  var outerDiv;
  var innerDiv;
  
  this.init = function() {    
    outerDiv = document.createElement("div");
    outerDiv.style.position = "absolute";
    outerDiv.style.width = "23px";
    outerDiv.style.overflowY = "scroll";
    outerDiv.style.overflowX = "hidden";
    outerDiv.style.padding = "0px";
    innerDiv = document.createElement("div");
    innerDiv.style.position = "absolute";
    innerDiv.style.left = "0px";
    innerDiv.style.top = "0px";     
    innerDiv.innerHTML = "&nbsp;";
    innerDiv.fontSize = "0px";
    
    outerDiv.onmousedown = function(event) {
      if (me.designMode) designUtils.preventEvent(event);
    }
        
    outerDiv.onscroll = function() {
      var midPoint = parseInt(me.height / 2);
      
      if (me.designMode || (me.atTop && me.atBottom)) {        
        outerDiv.scrollTop = midPoint;
        return;
      }        
    
      var returnVal;
      if (ignoreOnScroll) {
        ignoreOnScroll = false;
        return;
      }
      if (pagedDown) {
        ignoreOnScroll = true;
        outerDiv.scrollTop = me.height * 2;
        return;
      }
      if (pagedUp) {
        ignoreOnScroll = true;
        outerDiv.scrollTop = 0;
        return;
      }
      if (me.atBottom && !me.atTop) {
        if (me.onpageup != null) {
          returnVal = me.onpageup();
          if (returnVal == false) {
            me.draw();
            return;
          }
        }      
        //pressKey("PageUp");
        pagedUp = true;
        ignoreOnScroll = true;
        outerDiv.scrollTop = 0;
        return;
      }
      if (me.atTop && !me.atBottom) {
        if (me.onpagedown != null) {
          returnVal = me.onpagedown();
          if (returnVal == false) {
            me.draw();
            return;
          }
        }      
        //pressKey("PageDown");
        pagedDown = true;
        ignoreOnScroll = true;
        outerDiv.scrollTop =  me.height * 2;
        return;
      }
      
      if (outerDiv.scrollTop > midPoint) {
        if (me.onpagedown != null) {
           returnVal = me.onpagedown();
          if (returnVal == false) {
            me.draw();
            return;
          }
        }            
        //pressKey("PageDown");
        pagedDown = true;
        ignoreOnScroll = true;
        outerDiv.scrollTop = me.height * 2;
      }
      else {
        if (me.onpageup != null) {
           returnVal = me.onpageup();
            if (returnVal == false) {
              me.draw();
              return;
            }
        }      
        //pressKey("PageUp");
        ignoreOnScroll = true;
        outerDiv.scrollTop = 0;
        pagedUp = true;
      }
    }
    
    outerDiv.appendChild(innerDiv);
    me.container.appendChild(outerDiv); 
  }  
  
  this.draw = function() {
    ignoreOnScroll = true;
    outerDiv.style.zIndex = me.zIndex;
    outerDiv.style.visibility = "";
    var left = me.x;
    var top = me.y;
    var height = me.height;
    if (height < 0) height = 0;
    midPoint = parseInt(height / 2);    
    outerDiv.style.left = left + "px";
    outerDiv.style.top = top + "px";
    outerDiv.style.height = height + "px";
    innerDiv.style.height = (height * 2) + "px";    
    var scrollTop;
    if (me.atBottom && !me.atTop) {
      scrollTop = height * 2;
    }
    else if (me.atTop && !me.atBottom) {
      scrollTop = 0;
    }
    else {
      scrollTop = midPoint;
    }
    if (!me.grid.dontSetPagingScrollTop) {
      outerDiv.scrollTop = scrollTop;
    }
  }
    
  this.reset = function() {
    pagedUp = false;
    pagedDown = false;
  }
  
  this.hide = function() {
    outerDiv.style.visibility = "hidden";
  }
  
  this.destroy = function() {
    outerDiv.parentNode.removeChild(outerDiv);
    innerDiv.parentNode.removeChild(innerDiv);
  }

  this.changeContainer = function(newContainer) {
    me.container = newContainer;
    outerDiv.parentNode.removeChild(outerDiv);
    me.container.appendChild(outerDiv); 
  }

}
