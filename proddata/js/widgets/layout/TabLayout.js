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
 * TabLayout Class
 * @constructor
 */

pui.TabLayout = function() {
  // Imports properties from TabPanel into this object.
  TabPanel.call(this);
  
  // Public
  this.container = null;    //The DIV that contains the elements comprising this widget.
  this.forProxy = false;
  this.designMode = false;
  
  // Private
  var me = this;  
  
  var tabSpans = [];  //The clickable tab SPAN elements.
  var bodyDivs = [];  //The layout container DIVs.
  
  var headerArea = null;
  
  // Variables needed for checking that this object's elements are ready to get scroll buttons.
  var maxChecks = 500;
  var checkCount = 0;
  var tmo_checkwidth = 0;
  
  // Public Methods.
  
  this.init = function() {
    me.container.style.overflow = "hidden";
  };
  
  /**
   * Clears the container and draws new elements for each tab, the content-area, the scroll buttons, and the -/+ buttons (in design mode).
   * Called when some properties are applied. Styles should be set in stylesheet, but properties may set them later.
   *   (Overrides TabPanel.draw.)
   * Pre-Conditions: me.tabs must be an array with tab names.
   * @returns {undefined}
   */
  this.draw = function(){
    me.container.innerHTML = "";

    // Create the tab headers.
    headerArea = document.createElement("div"); //wraps all tab spans.
    headerArea.className = "pui-tablayout-hdr";
    me.setTopDivReference(headerArea);
    
    tabSpans = [];

    // Create clickable tabs for each name in the list.
    for (var i=0, n=me.tabs.length; i < n; i++){
      // Create a parent span to encapsulate the tab text, left, and right border.
      var outerSpan = document.createElement("span");
      
      if (me.isHidden[i]) outerSpan.style.display = "none";

      if (i == me.selectedTab){
        outerSpan.className = "selected-tab";
      }
      
      var leftSpan = document.createElement("span");
      var rightSpan = document.createElement("span");

      var tabSpan = document.createElement("span");
      tabSpan.tabId = i;
      tabSpan.innerHTML = me.tabs[i];
      tabSpan.setAttribute("isTab", "true");

      //Note: CSS hover covers the mouseover style change, so we don't implement those in TabLayout.

      tabSpan.ondblclick = me.tabSpanOndblclick;
      tabSpan.onclick = me.tabSpanOnclick;

      outerSpan.appendChild(leftSpan);
      outerSpan.appendChild(tabSpan);
      outerSpan.appendChild(rightSpan);
      
      headerArea.appendChild(outerSpan);
      
      tabSpans.push(tabSpan);
    }
    // done creating clickable tabs.
    me.container.appendChild(headerArea);
    
    bodyDivs = [];

    var bodyWrap = document.createElement("div");
    bodyWrap.className = "pui-tablayout-body";
    for (var i=0, n=me.tabs.length; i < n; i++){
      var bodyDiv = document.createElement("div");
      bodyDiv.setAttribute("container", "true");

      if (i != me.selectedTab){
        bodyDiv.style.display = "none";
      }

      bodyDiv.tabId = i;

      bodyWrap.appendChild(bodyDiv);
      
      bodyDivs.push(bodyDiv);
    }
    me.container.appendChild(bodyWrap);
    
    // Add +/- icons to the container DOM element. The container gets replaced at least once while
    // properties are assigned. But child nodes are migrated to the new DOM (applyTemplate.js:~72).
    if (me.designMode ){
      me.createAddRemoveIcons();
    }
    
    me.addScrollButtons(); //These are hidden to begin with.
  };
  
  /**
   * Handle selectedTab change. Show this tab's container, hide containers for non-active tabs.
   * Called by parent methods, processTabChange, et al. (Overrides)
   * Pre-Conditions: me.selectedTab is the active tab.
   * @returns {undefined}
   */
  this.selectedTabChanged = function(){
    
    // Hide hidden tabs; make sure others aren't hidden.
    for (var i=0, n=me.tabs.length; i < n; i++){
      var outerSpan = headerArea.childNodes[i];
      if (me.isHidden(i)) outerSpan.style.display = "none";
      else outerSpan.style.display = "";
    }
    
    for (var i=0, n=me.tabs.length; i < n; i++){
      if (i == me.selectedTab){
        bodyDivs[i].style.display = "";
        tabSpans[i].parentNode.className = "selected-tab";
      }else{
        bodyDivs[i].style.display = "none";
        tabSpans[i].parentNode.className = "";
      }
    }
  };
  
  /**
   * Set the names of tabs and draw (or redraw) the tab panel's HTML elements.
   * @param {String|Object} nameList    A comma-separated string list when not bound. 
   * @returns {undefined}
   */
  this.setTabNames = function(nameList) {
    if (nameList == null || nameList == "")
      nameList = me.INITIALLIST;
    else if (pui.isBound(nameList)){
      var tmplist = pui.parseCommaSeparatedList(nameList.designValue);
      if (tmplist.length == 0 ) nameList = me.INITIALLIST;
      else nameList = nameList.designValue;   //Use the bound value saved in designer.
    }
    var names = pui.parseCommaSeparatedList(nameList);
    var oldLen = me.tabs.length;
    me.tabs = names;
    
    if (names.length != oldLen) {
      // If the size of the list has changed, then redraw everything.
      me.selectedTab = 0;
      me.draw(); 
    }else{
      changeTabNames();
    }
  };
  
  /**
   * Resizes this layout when it is inside another layout and that layout's size changes;
   * called when moving item to main canvas or into container; called when width or 
   * height changes, because of Layout.js::setProperty.
   * 
   * @returns {undefined}
   */
  this.resize = function() {
    me.checkScrollButtons();

    if (me.container.layout != null) {
      me.container.layout.sizeContainers();
    }
  };
  
  this.setHeight = function(height) {
    me.container.style.height = height;
    me.resize(height);
  };
  
  /**
   * Attach the ontabclick event to the tabLayout DOM element. Parent class's tabSpanOnclick looks for it there.
   * @param {String|Null} ontabclick
   * @returns {undefined}
   */
  this.setOntabclick = function(ontabclick){
    var func = function() {
      eval("var tab = arguments[0];");
      try {
        return eval(ontabclick);
      }
      catch(err) {
        pui.scriptError(err, "Ontabclick Error:\n");
      }
    };
    if (!me.designMode) {
      me.container.ontabclick = func;
    }
  };
  
  /**
   * Handle a change to template style properties; e.g. color, font family.
   * @param {String} styleName
   * @param {String} styleValue
   * @returns {undefined}
   */
  this.setStyle = function(styleName, styleValue){
    if (pui.isBound(styleValue)) styleValue = "";
    var parts = styleName.split(" ");
    if (parts.length == 2) { //If the value has two words, capitalize the 2nd word.
      styleName = parts[0] + parts[1].substr(0, 1).toUpperCase() + parts[1].substr(1);
    }
    for (var i=0, n=tabSpans.length; i < n; i++){
      tabSpans[i].style[styleName] = styleValue;
    }
  };
  
  /**
   * Setup styles on all tabs based on the widget properties. Called after draw when the layout is being setup.
   * @param {Object} properties
   * @returns {undefined}
   */
  this.setAllStyles = function(properties){
    var styles = ["color", "font family", "font size", "font style", "font variant", "font weight", "letter spacing", "text align", "text decoration", "text transform", "word spacing"];
    for (var i=0, n=styles.length; i < n; i++) {
      var style = styles[i];
      var value = properties[style];
      if (value != null) me.setStyle(style, value);
    }
  };

  /**
   * Overrides superclass canRemoveTab. Always return false, because applyProperty will check
   * if containers are empty, so the tab layout doesn't need to. Called in removeIconOnClick.
   * @returns {Boolean}
   */
  this.cannotRemoveTab = function(){
    return false; //do we need to check? doesn't something else check applyProperty?
  };
  
  /**
   * Ensure that InlineEditBox does not look for a tabPanel when editing TabLayout tabs. (Overrides)
   * @returns {String}
   */
  this.getInlineEditBoxType = function(){
    return "tab layout";
  };
  
  /**
   * Create a scroll left or right button. Styles must be set in CSS stylesheet. (Overrides)
   * @param {String} cssClass
   * @returns {undefined}
   */
  this.createScrollButton = function(cssClass){
    var outerSpan = document.createElement("span");
    if(cssClass) outerSpan.className = "pui-tscrbtn pui-tablayout "+cssClass;
    
    var leftSpan = document.createElement("span");
    leftSpan.className = "edge";
    
    var tabSpan = document.createElement("span");
    tabSpan.className = "mid";
    
    var rightSpan = document.createElement("span");
    rightSpan.className = "edge";
    
    outerSpan.appendChild(leftSpan);
    outerSpan.appendChild(tabSpan);
    outerSpan.appendChild(rightSpan);
    
    return outerSpan;
  };
  
  /**
   * Called by applyTemplate after me.container is attached to the DOM. Some element properties are 
   * useless until the element is on the DOM. Setup those elements here.
   * Note: some properties need offsetWidth, but that has nothing until after width has been applied.
   * So, there still must be a delay.
   * @returns {undefined}
   */
  this.containerInDom = function(){
    if (me.container.offsetWidth > 0){
      // The container has a width.
      clearTimeout(tmo_checkwidth); //Make sure no previously set timeouts run.
      me.checkScrollButtons();
    }else{
      // Even though the container is attached to the DOM, it has no width. Timeouts are needed.
      checkCount = 0;
      clearTimeout(tmo_checkwidth);
      tmo_checkwidth = setTimeout(checkWidthOnTimeout,1);
    }
  };
  
  // Private Methods
  
  /**
   * Change just the tab names.
   * Pre-Conditions: me.tabs.length == tabSpans.length. (Should always be the case.)
   * @returns {undefined}
   */
  function changeTabNames(){
    for (var i=0, n=me.tabs.length; i < n; i++){
      tabSpans[i].innerHTML = me.tabs[i];
    }
  }
  
  /**
   * Callback for setTimeout when something causing applyTemplate to run; e.g. clicking +/- tabs.
   * Waits for the container to have a width, then adds scroll buttons, if necessary. (Copied from ResponsiveLayout.js)
   * @returns {undefined}
   */
  function checkWidthOnTimeout(){
    checkCount++;
    if (me.container.offsetWidth > 0){
      // Hides/shows buttons if needed.
      me.checkScrollButtons();
    }else if (checkCount < maxChecks){
      setTimeout(checkWidthOnTimeout,1);
    }else{
      console.log("Timed out waiting for parent width > 0.");
    }
  }
  
};

//Inherit from super class.
pui.TabLayout.prototype = Object.create(TabPanel.prototype);
