//  Profound UI Runtime  -- A Javascript Framework for Rich Displays
//  Copyright (c) 2020 Profound Logic Software, Inc.
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
 * Responsive Layout. A Profound UI Layout with DIV containers arranged using CSS Grid Layout rules.
 * Styles are set in an embedded &lt;style&gt; tag rather than inline styles. Alternately, the styles
 * can be set in external CSS.
 * @param {Object|undefined} parms  Parameters used to build the layout template. Undefined when called by ResponsiveDialog.
 * @param {Element|undefined} dom   A new or cloned DIV element when constructor is called elsewhere than ResponsiveDialog.
 * @constructor
 */
pui.ResponsiveLayout = function(parms, dom){
  pui.layout.Template.call(this, parms, dom);  //super(). sets up container, forProxy, designMode, etc.
  
  // Public
  this.previewMode = (parms && parms.previewMode);   //Is the layout used as a preview in the Responsive Editor. (See ResponsiveDialog)
  
  // Pseudo-private properties, inheritable.
  this._numchildren = 0;
  this._mainnode = document.createElement('div');  //The DIV to contain the container DIVs. Style rules apply to this one.
  this._mainnode.className = this.MAINCLASS;
  this.container.appendChild(this._mainnode);
  
  this._stylenode = this._addStyleNode('', this.container);
  
  this._containerNames = [];  //List of box container names to aid in designing screens.

  // Private.
  this._useViewport = true;
  this._maxChecks = 500;
  this._checkCount = 0;
  this._tmo_checkwid = 0;
  this._origCssText = "";    //The css text as set by setRules, after IDs are replaced.
  
  this._origCssRulesText = ""; //The "style rules" property as set by setRules, before the IDs are replaced.
  
  this._boundCheckWidth = this._checkWidth.bind(this); //Allow the _checkWidth callback to setTimeout access the ResponsiveLayout object.
  
  // Needed for assigning unique attribute to these layouts in background layers so their styles appear. Incremented in each ResponsiveLayout constructor.
  this._backgroundFallback = pui.ResponsiveLayout.prototype._responsiveLayoutTracker++;
  
  if (pui.runtimeContainer && pui.runtimeContainer.id == "5250"){
    // Used to set inline styles for the 5250 div ensuring the layout isn't cramped at the top. #5311.
    var genieStylenode = document.querySelector('style[forcegenieheight="true"]');
    if (!genieStylenode){
      // The style was not already set by another responsive layout, so set it now. 100px leaves room for some background headers.
      var tmpnode = this._addStyleNode('div[id="5250"] { height: calc(100vh - 100px); }', pui.runtimeContainer);
      tmpnode.setAttribute("forcegenieheight", "true");
      // The node will disappear automatically when a new screen is rendered, because the 5250 div is cleared.
    }
  }
  
  this.initialSetProperties(parms);
};
pui.ResponsiveLayout.prototype = Object.create(pui.layout.Template.prototype);

// Static constants
Object.defineProperties(pui.ResponsiveLayout.prototype, {
  TXT_CANNOTREMOVE: { value: 'The section cannot be removed because it contains other elements that must be removed first.' },
  DEFAULTNUMITEMS: { value: 8 },   //If "layout items" property is not a number, then use this default.
  MAINCLASS: { value: 'puiresp' }  //Class name of the node that has "display:grid" CSS style.
});

// Prototype properties: attached to prototype once, not to the class instances each time a constructor is called.
pui.ResponsiveLayout.prototype._findRulesRegex1 = /^(screen|all)\s*(.*)$/i;
pui.ResponsiveLayout.prototype._findRulesRegex2 = /and\s*\([^)]+\)/gi;
pui.ResponsiveLayout.prototype._findRulesRegex_minmax = /^and\s*\(\s*(min|max)-(width|height)\s*:\s*(\d+)\s*px\s*\)$/i;
pui.ResponsiveLayout.prototype._findRulesRegex_orient = /^and\s*\(\s*orientation\s*:\s*(portrait|landscape)\s*\)/i;

// If the layout goes into a background layer, then this helps identify it instead of using the container ID. #4778.
// Without something like this, background responsive layout styles cannot match the layout. Incremented with each constructor call.
pui.ResponsiveLayout.prototype._responsiveLayoutTracker = 0;

// Prototype functions: allocated to prototype once, not every time a constructor is called.

/**
 * Called when pui.render sets elements to be in the background of another layer and lose their IDs.
 * (Function is assigned to DOM by applyTemplate.js)
 * @returns {undefined}
 */
pui.ResponsiveLayout.prototype.sentToBackground = function(){
  this.container.setAttribute("puirespbg", this._backgroundFallback);
  this.setRules(); //Refresh the rules, using attribute selectors instead of IDs.
};

pui.ResponsiveLayout.prototype.destroy = function(){
  if (this.container) this.container.removeAttribute("puirespbg");
  pui.layout.Template.prototype.destroy.call(this); //remove properties attached to this.container, call deleteOwnProperties.
};

/**
 * Handle when the number of items is changed or set.
 * Pre-Condition: This.container must be set to some node before this is called.
 * @param {Number} numitems
 */
pui.ResponsiveLayout.prototype.setNumItems = function(numitems) {
  var mainnode = this._mainnode;
  var mainchildren = mainnode.children;
  // Append elements when the number of sections increased.
  while (mainchildren.length < numitems ){
    var div = document.createElement("div");
    div.setAttribute("container", "true"); //Allows other widgets to go into this div.
    this._setContainerName(mainchildren.length, div);
    mainnode.appendChild(div);
  }

  // Remove elements when the number of sections decreased.
  while (mainchildren.length > numitems){
    var child = mainchildren[ mainchildren.length - 1 ];
    mainnode.removeChild(child);
  }

  this._numchildren = mainnode.children.length;

  this._setContainers( mainnode.children );  //Make sure the Layout object associated with this knows where the containers are.

  // When the number of containers change, then CSS can make the containers resize; child nodes need to be told of the resize.
  var layout = this.container.layout;
  if (layout) layout.sizeContainers();
};


/**
 * Set CSS style. Placeholders, #_id_, are replaced with the container's ID or .x-dd-drag-proxy if in proxy mode.
 * Pre-Conditions: The container must be set on this.
 * @param {String|Null} cssrulestxt  If null or undefined: if origCssRulesText is null, existing rules are removed;
 *                                                         Else rules are refreshed. e.g. ID has changed.
 * @returns {undefined}
 */
pui.ResponsiveLayout.prototype.setRules = function(cssrulestxt) {
  if (cssrulestxt == null){
    cssrulestxt = this._origCssRulesText || "";
  }
  else if (pui.isBound(cssrulestxt)){
    if (cssrulestxt.designValue != null && typeof cssrulestxt.designValue == "string")
      cssrulestxt = cssrulestxt.designValue;
    else
      cssrulestxt = "@media screen { #_id_ > .puiresp { display:grid; } }";
  }

  this._origCssRulesText = cssrulestxt;
  if (!this.forProxy && this.container.id.length > 0){
    //When not in proxy mode, use the ID.
    this._origCssText = cssrulestxt.replace(/#_id_/g, "#" + this.container.id);
  }
  else if (this.forProxy){
    //In proxy mode in designer, apply style only to proxy.
    this._origCssText = cssrulestxt.replace(/#_id_ >/g, ".x-dd-drag-proxy");
  }
  else {
    //Assume the layout is in the background, because the ID isn't set. Rules use an attribute selector on the container.
    this._origCssText = cssrulestxt.replace(/#_id_/g, "div[puirespbg=\""+this._backgroundFallback+"\"]");
  }

  this._stylenode.textContent = this._origCssText;

  if (this._origCssText && this._origCssText.length > 0){

    //If !useViewport: instead of using the viewport for widths, use the parent container.
    //In design mode if useViewport is true, then the canvas will decide media query matches. (Note: !u || (u && d) simplifies to !u || d).
    if (!this._useViewport || this.designMode){
      this._checkCount = 0;
      clearTimeout(this._tmo_checkwid);
      this._tmo_checkwid = setTimeout(this._boundCheckWidth, 1);    //Causes a wait until our container has a width.
    }
  }
};

/**
 * Re-evaluate style rules for new dimensions when necessary and when the dimensions may have changed.
 */
pui.ResponsiveLayout.prototype.resize = function() {
  if ((!this._useViewport || this.designMode) && this._origCssText != ""){
    this._stylenode.textContent = this._origCssText;
    this._manipulateCSSOM();
  }
};

/**
 * Set list of container names for designer or the dialog.
 * @param {String|Array} nameList
 * @returns {undefined}
 */
pui.ResponsiveLayout.prototype.setContainerNames = function(nameList) {
  this._containerNames = [];
  if (nameList != null && nameList != ""){
    if (pui.isBound(nameList)){
      var tmplist = pui.parseCommaSeparatedList(nameList.designValue);
      if (tmplist.length == 0 ) this._containerNames = [];
      else this._containerNames = tmplist;   //Use the bound value saved in designer.
    } else if(nameList instanceof Array) {
      this._containerNames = nameList;
    } else {
      this._containerNames = pui.parseCommaSeparatedList(nameList);
    }
  }

  if((this.previewMode || this.designMode) && this._mainnode != null){    // If setNumItems has already run, then modify existing names.
    for (var i = 0; i < this._mainnode.childNodes.length; i++) {
      var div = this._mainnode.childNodes[i];
      if (div.tagName === 'DIV'){
        this._setContainerName(i, div);     //All divs should come before the <style> tag, so childNodes[i] should match _containerNames[i].
      }
    } 
  }
};

/**
 * Assign some text to a preview div or container in Designer; add attribute in runtime.
 * @param {Number} idx
 * @param {Object} div
 */
pui.ResponsiveLayout.prototype._setContainerName = function(idx, div) {
  var haveContainerName = typeof this._containerNames[idx] === 'string' && this._containerNames[idx].length > 0;
  var text = (idx + 1) + (haveContainerName ? ' ('+this._containerNames[idx]+')' : '');
  if (this.previewMode){
    //Content of box is the DIV number and a descriptive name if provided. e.g. it displays like: "1 (Header)".
    div.innerHTML = text;
  }
  else if (this.designMode){
    div.setAttribute("containername", text); //This will be pulled out in the CSS rules.
  }
  else if (haveContainerName){
    // Allow runtime containers to have container names inside this attribute.
    var contname = this._containerNames[idx].replace(/"/g, ' ');
    contname = contname.replace(/&/g, ' ');
    div.setAttribute("containername", contname);
  }
};

/**
 * Create and attach a <style> node to the DOM using the specified CSS text at the specified node.
 * @param {String} cssText
 * @param {Object} parentNode  HTML Element.
 * @returns {Object}    Returns the new <style> node.
 */
pui.ResponsiveLayout.prototype._addStyleNode = function(cssText, parentNode) {
  var stylenode = document.createElement("style");
  stylenode.type = "text/css";
  if (stylenode.styleSheet){    //IE
    stylenode.cssText = cssText;
  }
  else{
    stylenode.appendChild( document.createTextNode(cssText) );
  }
  return parentNode.appendChild(stylenode);
};

/**
 * Wait for the container to have a width, then manipulate the CSSOM.
 * When "use viewport" is false: can be called directly when "height" or "width" are set, or it can be a bound callback for setTimeout
 */
pui.ResponsiveLayout.prototype._checkWidth = function() {
  this._checkCount++;
  var containerToCheck = this._getContainerToCheck();
  if (containerToCheck.offsetWidth > 0){
    //An instance of Responsive Layout may not be attached to the DOM. Only process one that's attached.
    if (this._stylenode.sheet != null){
      this._manipulateCSSOM();
    }
  }
  else if (this._checkCount < this._maxChecks){
    setTimeout(this._boundCheckWidth, 1);
  }
  else{
    // TODO: if this appears much in the console, then implement what the TabLayout has:
    // notifyvisibleOnce, 
    console.log("Timed out waiting for parent width > 0.");
  }
};

/**
 * Return the DIV.puiresp element or the design mode canvas element, depending on useViewport and designMode.
 * In design mode, use the canvas, not the browser viewport. It's confusing for customers that the canvas isn't the viewport. #4820
 * @returns {WebElement|Object}
 */
pui.ResponsiveLayout.prototype._getContainerToCheck = function() {
  return (this.designMode && this._useViewport) ? getObj(appContainerId) : this.container;
};

/**
 * Recursively look inside the style nodes for dimensions in media queries that would satisfy the parent 
 * container's width. Any media queries that don't match are removed from the CSSOM.
 * For media query that matches, the styles are set, and the media query itself is dropped.
 * @returns {undefined}
 */
pui.ResponsiveLayout.prototype._manipulateCSSOM = function() {
  this._findRulesContToCheck = this._getContainerToCheck();
  this._findRulesCssText = "";
  this._findRulesRegex2.lastIndex = 0;  //ensure the search starts at 0 in case a previous "g" flag updated .lastIndex.
  if (this._stylenode.sheet != null) this._findRules(this._stylenode.sheet); //Note: the style node may be detached from the DOM while resize is called.
  this._stylenode.textContent = this._findRulesCssText;
  delete this._findRulesContToCheck;
};

/**
 * Recursive. Only checks min|max width|height and orientation. Other features aren't checked.
 * Assume rules are split by "and", because our tool creates them that way. In the future we can do more.
 * Post-Conditions: this._findRulesCssText is changed.
 * @param {Object} parent
 */
pui.ResponsiveLayout.prototype._findRules = function(parent){
  var conditionText;
  for (var i=0; i < parent.cssRules.length; i++){
    var rule = parent.cssRules[i];
    if (rule.type == rule["SUPPORTS_RULE"]){
      this._findRulesCssText += "@supports " + rule["conditionText"] + "{";
      this._findRules(rule);
      this._findRulesCssText += "}";
    }
    else if (rule.type == rule["MEDIA_RULE"] ){
      conditionText = rule["conditionText"] || rule.media.mediaText;  //mediaText is for IE.
      var reMatches1 = conditionText.match(this._findRulesRegex1);
      if (reMatches1 != null){      //Rule starts with screen or all.

        var reMatches2 = reMatches1[2].match(this._findRulesRegex2);
        var ruleSatisfies = true;
        if (reMatches2 != null){    //Rule has "and" with media feature in parentheses.

          // Look at each captured string: each media feature.
          for (var j=0; j < reMatches2.length; j++){
            var matches_minmax = reMatches2[j].match(this._findRulesRegex_minmax);
            var matches_orient = reMatches2[j].match(this._findRulesRegex_orient);

            if (matches_minmax != null){    //The rule is min|max width|height.

              var widhgt = matches_minmax[2];
              var dim = parseInt(matches_minmax[3],10);

              if (matches_minmax[1] == "min"){
                if ((widhgt == "width" && this._findRulesContToCheck.offsetWidth < dim) || (widhgt == "height" && this._findRulesContToCheck.offsetHeight < dim))
                  ruleSatisfies = false;    //The rule was min-width|height, but the container was narrower|shorter than the rule.
              }
              else{
                if ((widhgt == "width" && this._findRulesContToCheck.offsetWidth > dim) || (widhgt == "height" && this._findRulesContToCheck.offsetHeight > dim))
                  ruleSatisfies = false;    //The rule was max-width|height, but the container was wider|taller than the rule.
              }
            }
            else if (matches_orient != null){
              if (matches_orient[1] == "portrait" && this._findRulesContToCheck.offsetHeight < this._findRulesContToCheck.offsetWidth )
                ruleSatisfies = false;    //The rule was portrait, but the container was not.
              else if (matches_orient[1] == "landscape" && this._findRulesContToCheck.offsetHeight > this._findRulesContToCheck.offsetWidth )
                ruleSatisfies = false;    //The rule was landscape, but the container was not.
            }
          }
        }
        if (ruleSatisfies){
          this._findRules(rule);
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
      this._findRulesCssText += ruletext;
    }
  }
};

/**
 * Given a grid-template-rows or grid-template-columns style value, extract the size values from the string and
 * return an array of sizes. Converts "repeat()" to array of sizes. If the size is implied, then return empty array.
 * Limitations: does not handle track line-names.
 * Used in ResponsiveDialog and for translated IE css properties.
 * @param {String} str
 * @returns {Array}
 */
pui.ResponsiveLayout.prototype.parseSectionSizes = function(str) {

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

/**
 * Handle properties so that applyTemplate isn't called for every property being set, rebuilding the layout.
 * Properties can be set in any order in runtime or in Designer.
 * @param {String} property
 * @param {String} value
 * @param {undefined|String} templateProps    A collection in pui.Layout with properties for the template.
 * @returns {Boolean}  When true is returned, the caller, pui.Layout's setProperty, will return after this function returns.
 */
pui.ResponsiveLayout.prototype.setProperty = function(property, value, templateProps){
  var ret = true;
  switch (property){
    case 'id':
      if (this.container.id != value){
        this.container.id = value;
        // The responsive layout's embedded styles can use the widget's ID. So these must be refreshed.
        this.setRules();
      }
      break;
            
    case 'layout items':
      var tmpVal = parseInt(value, 10);      
      value = isNaN(tmpVal) ? this.DEFAULTNUMITEMS : tmpVal;
      
      // Check if any container being removed contain widgets. (Does nothing when containers are added.)
      var cannotRemove = false;
      if (this.designMode){
        for (var i=this._numchildren, n=tmpVal; i > n ; i--){
          var cont = this._mainnode.children[i - 1];
          if (cont && cont.children && cont.children.length > 0){
            cannotRemove = true;
            break;
          }
        }
      }
      
      if (cannotRemove){
        pui.alert(this.TXT_CANNOTREMOVE);
        // rollback the change
        value = String(this._numchildren);
        setTimeout(this._updatePropertyInDesigner.bind(this), 1, 'layout items', value);
      }
      else {
        if (value == null || value === "" || isNaN(value)){
          value = this.DEFAULTNUMITEMS;
        }
        else if (pui.isBound(value)){
          value = (value.designValue != null && typeof value.designValue == "number") ? value.designValue : this.DEFAULTNUMITEMS;
        }
        
        if (value != this._numchildren){
          this.setNumItems(value);
        }
      }
      break;
      
    case 'style rules':
      if (this._origCssRulesText != value) this.setRules(value);
      break;
      
    case 'use viewport':
      value = (value === true || value === "true");
      if (this._useViewport !== value){
        this._useViewport = value;
        // useViewport determines how rules are evaluated, so re-evaluate these.
        this.setRules();      
      }
      break;
      
    case 'container names':
      this.setContainerNames(value);  //setNumItems depends on the value set here.
      break;
      
    default:
      ret = false;  //Let the Layout's setProperty handle anything else.
      break;
  }
  
  if (templateProps) templateProps[property] = value;
  return ret;
};

/**
 * Called by Layout's globalAfterSetter. Handle properties that must be set after Layout handles them.
 * @param {String} property  property name
 */
pui.ResponsiveLayout.prototype.setPropertyAfter = function(property){
  switch (property){
    case 'height':
    case 'width':
      // The Layout class sets the width of the main DIV (and does other things).
      if (!this._useViewport){
//        this._checkWidth();
        this.setRules();
      }
      break;
  }
};

