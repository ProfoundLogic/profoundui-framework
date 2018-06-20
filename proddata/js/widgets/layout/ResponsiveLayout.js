//  Profound UI Runtime  -- A Javascript Framework for Rich Displays
//  Copyright (c) 2018 Profound Logic Software, Inc.
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

/**
 * Responsive Layout. A PUI Layout with DIV containers arranged using CSS Grid Layout rules.
 * Styles are set in an embedded &lt;style&gt; tag rather than inline styles. The styles
 * can be set in external CSS instead.
 * @constructor
 */
pui.ResponsiveLayout = function(){
  // Public
  this.container = null;
  this.MAINCLASS = "puiresp";  //Class name of the node that has "display:grid" CSS style. (Should not change.)
  
  this.forProxy = false;
  this.designMode = false;
  this.previewMode = false;   //Is the layout used as a preview in the Responsive Editor. (See child class.)
  
  // Pseudo-private properties, inheritable.
  this._numchildren = 0;
  this._stylenode = null;
  this._mainnode = null;      //The DIV to contain the container DIVs. This DIV gets the css template rules.
  
  // Private.
  var me = this;
  
  var useViewport = true;
  var maxChecks = 500;
  var checkCount = 0;
  var tmo_checkwid = 0;
  var origCssText;    //The css text as set by setRules, after IDs are replaced.
  
  var origCssRulesText; //The "style rules" property as set by setRules, before the IDs are replaced.
  
  var DEFAULTNUMITEMS = 8;  //If "layout items" property isn't a number, use this default.
  
  this.destroy = function(){
    if (me != null){
      me._stylenode = null;
      me._mainnode = null;
      me = null;
    }
  };
  
  /**
   * Handle when the number of items is changed or set.
   * (This is called because it is set in pui.layout.template.responsiveLayoutTemplate.)
   * Pre-Condition: This.container must be set to some node before this is called.
   * @param {Number} numitems
   * @returns {undefined}
   */
  this.setNumItems = function(numitems){
    if (numitems == null || numitems === ""){
      numitems = DEFAULTNUMITEMS;
    }
    else if (pui.isBound(numitems)){
      if (numitems.designValue != null && typeof numitems.designValue == "number")
        numitems = numitems.designValue;
      else
        numitems = DEFAULTNUMITEMS;
    }
    
    if(me._mainnode == null || numitems != me._numchildren){
      me._numchildren = numitems;
      
      me.container.innerHTML = "";
      
      me._mainnode = document.createElement("div");
      me._mainnode.className = me.MAINCLASS;
      
      me.container.appendChild(me._mainnode);
      
      for (var i = 0; i < me._numchildren; i++) {
        var div = document.createElement("div");
        div.setAttribute("container", "true"); //Allows other widgets to go into this div.

        if(me.previewMode){
          div.innerHTML = (i + 1);
        }
        
        me._mainnode.appendChild(div);
      } 
    }
    
    if (me.designMode && !me.forProxy && typeof me.addDesignerIcons == "function" ){
      me.addDesignerIcons();    //Child class should implement this.
    }
  };
  
  // Note: setRules runs after this, because setRules is last in responsiveLayoutTemplate.
  // So, changing the "use viewport" option causes rules to be re-evaluated.
  this.setUseViewport = function(usev){
    if (usev == null || usev === "" || pui.isBound(usev)) return;
    useViewport = usev;
  };
  
  /**
   * Set CSS style. Placeholders, #_id_, are replaced with the container's ID or .x-dd-drag-proxy if in proxy mode.
   * Pre-Conditions: The container must be set on this.
   * @param {String|Null} cssrulestxt  If null or undefined: if origCssRulesText is null, existing rules are removed;
   *                                                         Else rules are refreshed. e.g. ID has changed.
   * @returns {undefined}
   */
  this.setRules = function(cssrulestxt){
    if (cssrulestxt == null){
      cssrulestxt = origCssRulesText || "";
    }
    else if (pui.isBound(cssrulestxt)){
      if (cssrulestxt.designValue != null && typeof cssrulestxt.designValue == "string")
        cssrulestxt = cssrulestxt.designValue;
      else
        cssrulestxt = "";
    }
    
    origCssRulesText = cssrulestxt;
    if (!me.forProxy && me.container.id.length > 0){
      //When not in proxy mode, use the ID.
      origCssText = cssrulestxt.replace(/#_id_/g, "#" + me.container.id);
    }
    else{
      //In proxy mode in designer, apply style only to proxy.
      origCssText = cssrulestxt.replace(/#_id_ >/g, ".x-dd-drag-proxy");
    }

    // Delete existing styles.
    if (me._stylenode != null){
      me._mainnode.removeChild(me._stylenode);
      me._stylenode = null;
    }
    
    // Attach the style tag if in previewMode: responsive editor requires a style node. (even when blank)
    if (me.previewMode){
      addStyleNode();
    }
    else if (origCssText != ""){  //Attach style tag if there are style rules.
      addStyleNode();
      
      if (!useViewport){  //Instead of using the viewport for widths, use the parent container.
        checkCount = 0;
        clearTimeout(tmo_checkwid);
        tmo_checkwid = setTimeout(checkWidth,1);    //Causes a wait until our container has a width.
      }
    }
  };
  
  /**
   * Resizes this layout when it is inside another layout and that layout's size changes, or when the
   * window resizes. Called when moving item to main canvas or into container. Called with width or 
   * height changes, because of Layout.js::setProperty.
   * @returns {undefined}
   */
  this.resize = function() {
    if (!useViewport && origCssText != ""){
      me._stylenode.textContent = origCssText;
      manipulateCSSOM();
    }

    sizeContainers();
  };
  
  function sizeContainers(){
    if (me.container.layout != null) {
      me.container.layout.sizeContainers();
    }
  }
  
  // Attach a <style> node to the DOM using the stored CSS text.
  function addStyleNode(){
    me._stylenode = document.createElement("style");
    me._stylenode.type = "text/css";
    if (me._stylenode.styleSheet){    //IE
      me._stylenode.cssText = origCssText;
    }else{
      me._stylenode.appendChild( document.createTextNode(origCssText) );
    }
    me._mainnode.appendChild(me._stylenode);
  }
  
  // Callback for setTimeout when "use viewport" is false. Waits for the container to have a width, 
  // then manipulates the CSSOM.
  function checkWidth(){
    checkCount++;
    if (me.container.offsetWidth > 0){
      //An instance of Responsive Layout may not be attached to the DOM. Only process one that's attached.
      if (me._stylenode.sheet != null){
        manipulateCSSOM();
      }
    }else if (checkCount < maxChecks){
      setTimeout(checkWidth,1);
    }else{
      console.log("Timed out waiting for parent width > 0.");
    }
  }
  
  /**
   * Recursively look inside the style nodes for dimensions in media queries that would satisfy the parent 
   * container's width. Any media queries that don't match are removed from the CSSOM. 
   * @returns {undefined}
   */
  function manipulateCSSOM(){
    
    
    // This only checks min|max width|height and orientation. Other features aren't checked.
    // Assume rules are split by "and", because our tool creates them that way. In the future we can do more.
    
    var regex1 = /^(screen|all)\s*(.*)$/i;
    var regex2 = /and\s*\([^)]+\)/gi;
    var regex_minmax = /^and\s*\(\s*(min|max)-(width|height)\s*:\s*(\d+)\s*px\s*\)$/i;
    var regex_orient = /^and\s*\(\s*orientation\s*:\s*(portrait|landscape)\s*\)/i;

    function findRules(parent){
      var conditionText;
      for (var i=0; i < parent.cssRules.length; i++){
        var rule = parent.cssRules[i];
        if (rule.type == rule["SUPPORTS_RULE"]){
          csstext += "@supports " + rule["conditionText"] + "{";
          findRules(rule);
          csstext += "}";
        }
        else if (rule.type == rule["MEDIA_RULE"] ){
          conditionText = rule["conditionText"] || rule.media.mediaText;  //mediaText is for IE.
          var reMatches1 = conditionText.match(regex1);
          if (reMatches1 != null){      //Rule starts with screen or all.
            
            var reMatches2 = reMatches1[2].match(regex2);
            var ruleSatisfies = true;
            if (reMatches2 != null){    //Rule has "and" with media feature in parentheses.
              
              // Look at each captured string: each media feature.
              for (var j=0; j < reMatches2.length; j++){
                var matches_minmax = reMatches2[j].match(regex_minmax);
                var matches_orient = reMatches2[j].match(regex_orient);
                
                if (matches_minmax != null){    //The rule is min|max width|height.
                  
                  var widhgt = matches_minmax[2];
                  var dim = parseInt(matches_minmax[3],10);

                  if (matches_minmax[1] == "min"){
                    if ((widhgt == "width" && me.container.offsetWidth < dim) || (widhgt == "height" && me.container.offsetHeight < dim))
                      ruleSatisfies = false;    //The rule was min-width|height, but the container was narrower|shorter than the rule.
                  }
                  else{
                    if ((widhgt == "width" && me.container.offsetWidth > dim) || (widhgt == "height" && me.container.offsetHeight > dim))
                      ruleSatisfies = false;    //The rule was max-width|height, but the container was wider|taller than the rule.
                  }
                }
                else if (matches_orient != null){
                  if (matches_orient[1] == "portrait" && me.container.offsetHeight < me.container.offsetWidth )
                    ruleSatisfies = false;    //The rule was portrait, but the container was not.
                  else if (matches_orient[1] == "landscape" && me.container.offsetHeight > me.container.offsetWidth )
                    ruleSatisfies = false;    //The rule was landscape, but the container was not.
                }
              }
            }
            if (ruleSatisfies){
              findRules(rule);
            }
          }
          else{
            console.log("Unsupported media rule:", conditionText);
          }
        }
        else if (rule.type == rule["STYLE_RULE"] ){
          // Copy each style from the CSSStyleRule's style object. (Note: we can't just use rule.cssText because
          // Edge doesn't include grid-(row|column)-gap in cssText.)
          var ruletext = rule.selectorText + "{";
          for (var j=0; j < rule.style.length; j++){
            var styleprop = rule.style[j];
            var styleval = rule.style[styleprop];
            ruletext += styleprop + ":" + styleval + "; ";
          }
          ruletext += "} ";
          csstext += ruletext;
        }
      }
    }
    
    var csstext = "";    
    findRules(me._stylenode.sheet);
    me._stylenode.textContent = csstext;
  }
  
  /**
   * Given a grid-template-rows or grid-template-columns style value, extract the size values from the string and
   * return an array of sizes. Converts "repeat()" to array of sizes. If the size is implied, then return empty array.
   * Limitations: does not handle track line-names.
   * Used in ResponsiveDialog and for translated IE css properties.
   * @param {String} str
   * @returns {Array}
   */
  this.parseSectionSizes = function(str){

    var sizes = [];

    // Detect the repeat() with an explicit number of values, and expand it.
    // If repeat was not found, then just push the word.
    function checkRepeat(destarr, word){
      var matches = word.match(/^repeat\(\s*(\d+|auto-fill|auto-fit),\s*(.+)\s*\)$/i);
      if (matches != null){
        var len = parseInt(matches[1],10);
        if (!isNaN(len)){ //First parameter is positive integer: explicit number of rows/cols.
          for (var i=0; i < len; i++){
            destarr.push(matches[2]);   //Add "len" number of units to the array.
          }
        }
        //TODO: else, handle auto-fill and auto-fit. Resizer lines would need to know to change the 2nd parameter;
        // e.g. repeat(auto-fill,200px). Resizing any line should change the 200px.
      }else{
        destarr.push(word); //Just push the word.
      }
    }

    //Read from left to right. If a space is encountered while not in a function (repeat, etc), then the space delimits values.
    var startpos = 0;
    var parenLevel = 0;
    for (var i=0; i < str.length; i++){
      var ch = str.charAt(i);
      if (parenLevel == 0 ){    //not in parentheses.
        if (ch == " "){   //end of word.
          checkRepeat(sizes, str.substring(startpos, i) );
          startpos = i + 1; //start next word after the space.
        }
        else if ((i+1) == str.length){    //end of string.
          checkRepeat(sizes, str.substring(startpos, i + 1)); //get string including i.
        }
        else if(ch == "("){
          parenLevel++;
        }
      }
      else if(ch == "("){
        parenLevel++;
      }
      else if(ch == ")"){
        parenLevel--;

        if (i+1 == str.length){ //end of string.
          checkRepeat(sizes, str.substring(startpos, i + 1)); //get string including i.
        }
      }
    }

    return sizes;
  }; //end parseSectionSizes().
};
