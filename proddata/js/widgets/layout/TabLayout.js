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
 * TabLayout Class. Subclass of pui.layout.Template and adopts from the TabPanel class.
 * @param {Object} parms  Parameters used to build the layout template.
 * @param {Element} dom   A new or cloned DIV element constructor.
 * @constructor
 */
pui.TabLayout = function(parms, dom) {
  TabPanel.call(this);  //Import TabPanel properties and methods into this instance.
  
  pui.layout.Template.call(this, parms, dom);  //Super class constructor.
  
  // Private
  
  this._tabSpans = [];  //The clickable tab SPAN elements.
  
  // Variables needed for checking that this object's elements are ready to get scroll buttons.
  this._maxChecks = 500;
  this._checkCount = 0;
  this._tmo_checkwidth = 0;
  
  // A function bound so that the class method can be used as a callback to setTimeout.
  this._checkWidthOnTimeoutBound = this._checkWidthOnTimeout.bind(this);
  
  // Hack: until TabLayout methods are moved into prototypes, methods from this prototype must be assigned here.
  this.draw = pui.TabLayout.prototype.draw.bind(this);
  this.selectedTabChanged = pui.TabLayout.prototype.selectedTabChanged.bind(this);
  this.cannotRemoveTab = pui.TabLayout.prototype.cannotRemoveTab;
  this.createScrollButton = pui.TabLayout.prototype.createScrollButton;
  
  this.linkToDom(dom); //assigns this.container, etc.
  
  // Create the tab headers and the body wrapper.
  this._headerArea = document.createElement("div"); //wraps all tab spans.
  this._headerArea.className = "pui-tablayout-hdr";
  this.setTopDivReference(this._headerArea);
  this.container.appendChild(this._headerArea);

  this._bodyWrap = document.createElement("div");
  this._bodyWrap.className = "pui-tablayout-body";
  this.container.appendChild(this._bodyWrap);


  // Add +/- icons to the container DOM element. The container gets replaced at least once while
  // properties are assigned. But child nodes are migrated to the new DOM (applyTemplate.js:~72).
  if (this.designMode ){
    this.createAddRemoveIcons();
  }

  this.addScrollButtons(); //Note: these are initially hidden.
    
  this.container.style.overflow = "hidden";
  if (parms.proxyMode) {
    this.container.style.position = "relative";
  }
  // Use a default value when "tab names" is empty.
  if (parms.properties && parms.properties['tab names'] == null) this.setProperty('tab names');
    
  this.initialSetProperties(parms);
};
pui.TabLayout.prototype = Object.create(pui.layout.Template.prototype);  //TabLayout is subclass of Template.

// Public methods
  
/**
 * Draws elements for each tab, the content-area, the scroll buttons, and the -/+ buttons (in design mode).
 * Called when some properties are applied. Styles should be set in stylesheet, but properties may set them later.
 *   (Overrides TabPanel.draw.)
 * Pre-Conditions: this.tabs must be an array with tab names.
 * @returns {undefined}
 */
pui.TabLayout.prototype.draw = function(){
  
  var numTabsDesired = this.tabs.length;
  var i = this._tabSpans.length;
  
  // Append elements when the number of tabs increased.
  while (numTabsDesired > this._tabSpans.length){

    // Create a parent span to encapsulate the tab text, left, and right border.
    var outerSpan = document.createElement("span");

    if (this._hiddenTabs[i]) outerSpan.style.display = "none";
    if (i == this.selectedTab) outerSpan.className = "selected-tab";
    
    var leftSpan = document.createElement("span");
    var rightSpan = document.createElement("span");
    var tabSpan = document.createElement("span");
    tabSpan.tabId = i;
    tabSpan.innerHTML = this.tabs[i];
    tabSpan.setAttribute("isTab", "true");

    tabSpan.addEventListener('dblclick', this);
    tabSpan.addEventListener('click', this);

    outerSpan.appendChild(leftSpan);
    outerSpan.appendChild(tabSpan);
    outerSpan.appendChild(rightSpan);

    this._headerArea.appendChild(outerSpan);
    this._tabSpans.push(tabSpan);
  
    var bodyDiv = document.createElement("div");
    bodyDiv.setAttribute("container", "true");

    if (i != this.selectedTab) bodyDiv.style.display = "none";
    
    bodyDiv.tabId = i;

    this._bodyWrap.appendChild(bodyDiv);

    i++;
  }
  
  // Remove elements when the number of tabs decreased.
  while (numTabsDesired < this._tabSpans.length){  
    var children = this._headerArea.children;
    this._headerArea.removeChild( children[ children.length - 1 ] );
    
    children = this._bodyWrap.children;
    this._bodyWrap.removeChild( children[ children.length - 1 ] );

    this._tabSpans.pop();
  }
  
  // Set tabspan texts.
  for (var i=0, n=this.tabs.length; i < n; i++){
    this._tabSpans[i].innerHTML = this.tabs[i];
  }
  this.checkScrollButtons();
  this.selectedTabChanged();  //Make sure the visible tabs reflects the value of me.selectedTab, which can change in tab_panel.js
};

/**
 * Handle selectedTab change. Show this tab's container, hide containers for non-active tabs.
 * Called by parent methods, processTabChange, et al. (Overrides)
 * Pre-Conditions: this.selectedTab is the active tab.
 * @returns {undefined}
 */
pui.TabLayout.prototype.selectedTabChanged = function(){
  this.selectedTab = parseInt(this.selectedTab, 10);

  // Hide hidden tabs; make sure others aren't hidden.
  for (var i=0, n=this.tabs.length; i < n; i++){
    var outerSpan = this._headerArea.childNodes[i];
    outerSpan.style.display = this._hiddenTabs[i] ? "none" : "";
  }

  for (var i=0, n=this.tabs.length; i < n; i++){
    if (i === this.selectedTab){
      this._bodyWrap.children[i].style.display = "";
      this._tabSpans[i].parentNode.className = "selected-tab";

      var layout = this.container.layout;
      if (layout != null){
        // Lazy loads the items, if they weren't already.
        if (!this.designMode) layout.renderItems( this.selectedTab );
        
        // Make sure any child layouts and widgets in this tab know they are visible now.
        if (layout.childrenSized[this.selectedTab] !== true) layout.sizeContainers( this.selectedTab );
      }
    }
    else {
      this._bodyWrap.children[i].style.display = "none";
      this._tabSpans[i].parentNode.className = "";
    }
  }
};

/**
 * Handle a change to template style properties; e.g. color, font family.
 * @param {String} styleName
 * @param {String} styleValue
 */
pui.TabLayout.prototype.setStyle = function(styleName, styleValue){
  if (pui.isBound(styleValue)) styleValue = "";
  var parts = styleName.split(" ");
  if (parts.length == 2) { //If the value has two words, capitalize the 2nd word.
    styleName = parts[0] + parts[1].substr(0, 1).toUpperCase() + parts[1].substr(1);
  }
  for (var i=0, n=this._tabSpans.length; i < n; i++){
    this._tabSpans[i].style[styleName] = styleValue;
  }
};

/**
 * Returns true if widgets are inside the specified tab; else false. Called in removeIconOnClick. (Overrides)
 * @param {Number} i   The tab number we're checking for removal.
 * @returns {Boolean}  Returns true if any of the body DIVs have children; else false.
 */
pui.TabLayout.prototype.cannotRemoveTab = function(i){
  var children = this._bodyWrap.children;
  return (children && children[i] && children[i].children && children[i].children.length > 0);
};

/**
 * Create a scroll left or right button. Styles must be set in CSS stylesheet. (Overrides)
 * @param {String} cssClass
 * @returns {Element}
 */
pui.TabLayout.prototype.createScrollButton = function(cssClass){
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
 * Called by applyTemplate after this.container is attached to the DOM. Some element properties are 
 * useless until the element is on the DOM. Setup those elements here.
 * Note: some properties need offsetWidth, but that has nothing until after width has been applied.
 * So, there still must be a delay.
 * @returns {undefined}
 */
pui.TabLayout.prototype._containerInDom = function(){
  if (this.container.offsetWidth > 0){
    // The container has a width.
    clearTimeout(this._tmo_checkwidth); //Make sure no previously set timeouts run.
    this.checkScrollButtons();
  }
  else{
    // Even though the container is attached to the DOM, it has no width. Timeouts are needed.
    this._checkCount = 0;
    clearTimeout(this._tmo_checkwidth);
    this._tmo_checkwidth = setTimeout(this._checkWidthOnTimeoutBound,1);
  }
};

// Private Methods

/**
 * Callback for setTimeout when something causing applyTemplate to run; e.g. clicking +/- tabs.
 * Waits for the container to have a width, then adds scroll buttons, if necessary. (Copied from ResponsiveLayout.js)
 * @returns {undefined}
 */
pui.TabLayout.prototype._checkWidthOnTimeout = function(){
  this._checkCount++;
  if (this.container.offsetWidth > 0){
    // Hides/shows buttons if needed.
    this.checkScrollButtons();
  }
  else if (this._checkCount < this._maxChecks){
    setTimeout(this._checkWidthOnTimeoutBound,1);
  }
  //else: the parent container may be hidden, so sizeContainers needs to setup the scroll buttons.
};

/**
 * When the user clicks a tab and ontabclick code is set, this is called from the parent class, TabPanel.
 * @param {Number} tab
 * @returns {undefined|Boolean}   Returns whatever the evaluated code returns or undefined.
 */
pui.TabLayout.prototype.tabSpanOnclickCb = function(tab){
  var code = this._ontabclick;
  if (typeof code === 'string' && code.length > 0){
    eval("var tab = arguments[0];");
    try {
      return eval(code);
    }
    catch(err) {
      pui.scriptError(err, "Ontabclick Error:\n");
    }
  }
};
 
pui.TabLayout.prototype['handleEvent'] = function(e){
  switch (e.type){
    case 'click': this.tabSpanOnclick(e); break;
    case 'dblclick':
      if (inDesignMode()) this.tabSpanOndblclick(e);
      else this.tabSpanOnclick(e);  //Change tabs on double-click.
      break;
  }
};

//
// Methods below are what all pui.layout.Template classes are expected to implement.
//

/**
 * Handle when the size changes for the parent of this layout or this layout is being added to something in Designer;
 * called when moving item to main canvas or into container; called when width or 
 * height changes, because of Layout.js::setProperty.
 * Scroll buttons must be added when TabLayout is initially in hidden tab/section. Also #4711.
 */
pui.TabLayout.prototype.resize = function() {
  this.checkScrollButtons();
};

/**
 * Property setter for any property. Called by pui.Layout.setProperty.
 * Note: the "tab keys" property is not implemented, because "tab keys" is for Genie, and layouts are not for Genie.
 * @param {String} property
 * @param {String|undefined} value
 * @param {undefined|Object} templateProps    A collection in pui.Layout with properties for the template.
 * @returns {Boolean}    When true is returned, the pui.Layout.prototype.setProperty will not process the property change any more.
 */
pui.TabLayout.prototype.setProperty = function(property, value, templateProps){
  switch (property){
    case 'tab names':
      // Validate the value and fallback to default if necessary.
      if (value == null || value == ""){
        value = this.INITIALLIST;
      }
      else if (pui.isBound(value)){
        var tmplist = pui.parseCommaSeparatedList(value.designValue);
        // Use the bound value saved in designer or use default.
        value = tmplist.length == 0 ? this.INITIALLIST : value.designValue;
      }
      var names = pui.parseCommaSeparatedList(value);
      var oldLen = this.tabs.length;

      if (names.length != oldLen) {
        var cannotRemove = false;
        if (this.designMode){
          // See if each tab potentially being removed can be.
          for (var i=oldLen, n=names.length; i > n; i--){
            if (this.cannotRemoveTab(i - 1)){
              cannotRemove = true;
              break;
            }
          }
        }

        if (cannotRemove){
          pui.alert(this.TXT_CANNOTREMOVE);
          value = this.tabs.join();
          // Rollback the change.
          var updatePropCallback = this._updatePropertyInDesigner.bind(this, 'tab names', value);
          setTimeout(updatePropCallback, 1);
        }
        else {
          this.tabs = names;

          // If the selected tab was removed then select the new last tab.
          if (this.selectedTab > this.tabs.length - 1) this.selectedTab = this.tabs.length - 1;

          // Make sure the Layout object associated with this knows where the containers are.
          this._setContainers(this._bodyWrap.children);
        }
      }
      else {
        this.tabs = names;
      }
      this.draw();
      // Make sure the Layout object associated with this knows where the containers are.
      this._setContainers(this._bodyWrap.children);
      break;
    
    case 'active tab':
      if (!this.designMode) {
        value = Number(value);
        if (!isNaN(value) && value != 0) {
          this.setTab(value);
        }
        this.sendActiveTab = true;
      }
      break;

    case 'ontabclick':
      if (!this.designMode) this._ontabclick = value;
      else delete this._ontabclick;
      break;
      
    case 'tab response':
      if (!this.designMode) this.sendTabResponse = true;
      break;

    case 'response AID':
      if (!this.designMode) { 
        if (typeof value !== 'string' || value.length === 0) value = false;
        this.responseAID = value;
      }
      break;
      
    case 'bypass validation':
      // Catch this case to prevent applyTemplate from running later, something that would cause everything to be rebuilt.
      // render or applyDesignProperty would set dom.bypassValidation to this value, so no need to do anything here.
      break;
      
    case "color":
    case "font family":
    case "font size":
    case "font style":
    case "font weight":
    case "text decoration":
    case "text transform":
      this.setStyle(property, value);
      break;
    
    default:
      return false;  //Let pui.Layout.prototype.setProperty handle other properties.
  }
  if (templateProps) templateProps[property] = value;
  return true;
};

/**
 * Assign template-specific properties to a DOM element. pui.layout.template.applyTemplate calls this.
 * @param {Element} dom
 */
pui.TabLayout.prototype.linkToDom = function(dom){
  pui.layout.Template.prototype.linkToDom.call(this, dom); //call super class method. assigns this.container=dom; sets layoutT.
  
  if (document.body.contains(this.container)){
    this._containerInDom(); //Finish drawing things that require elements being in DOM.
  }
  
  if (!this.designMode){
    // Setup APIs that users can call like getObj('TabLayout1').showTab(1);
    dom.setTab = this.setTab.bind(this);
    dom.getTab = this.getTab.bind(this);
    dom.refresh = this.refresh.bind(this);
    dom["hideTab"] = this.hideTab.bind(this);
    dom["showTab"] = this.showTab.bind(this);
  }
  
};
