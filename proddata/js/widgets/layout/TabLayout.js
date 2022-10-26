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
  this._rendered = false;   //Becomes true after initial render.
  this._storageKey = null;  //For persistent storage when movableTabs is true. Set by pui.renderFormat().
  this._tabSpans = [];      //The clickable tab SPAN elements. The array is convenient and preserves the original tab order.
  
    
  // Importing from TabPanel made some methods own properties of this, so those would be used over the prototype properties. Assign the correct
  // prototype methods to this. (Note: when assigning a method to an object the method's "this" is that object; i.e. this TabLayout; no need to bind.)
  this.drawChanged = pui.TabLayout.prototype.drawChanged;
  this._cannotRemoveTab = pui.TabLayout.prototype._cannotRemoveTab;
  this._createScrollButton = pui.TabLayout.prototype._createScrollButton;
  
  this.linkToDom(dom); //assigns this.container, etc.
    
  // Use a default value when the "tab names" property is empty or not set.
  if (parms.properties && parms.properties['tab names'] == null) this.setProperty('tab names');
  
  // Setting properties initially is required for handling special cases:
  // * "template" set after other properties; then, applyTemplate reloads the class, clearing previously set properties.
  // * "tab response" of 0 formatted as "" would keep renderFormat from setting the property.
  this._initialSetProperties(parms);  
};
pui.TabLayout.prototype = Object.create(pui.layout.Template.prototype);  //TabLayout is subclass of Template.


/**
 * Assign template-specific properties to a DOM element. pui.layout.template.applyTemplate calls this.
 * Overrides pui.layout.Template.linkToDom.
 * @param {Element} dom
 * @public
 */
pui.TabLayout.prototype.linkToDom = function(dom){
  pui.layout.Template.prototype.linkToDom.call(this, dom);  //Assign this.container=dom; set layoutT; assign resize to sizeMe.
 
  if (!this.designMode){
    // Setup APIs that users can call like getObj('TabLayout1').showTab(1);
    dom.setTab = this.setTab.bind(this);
    dom.getTab = this.getTab.bind(this);
    dom.refresh = this.refresh.bind(this);
    dom["hideTab"] = this.hideTab.bind(this);
    dom["showTab"] = this.showTab.bind(this);
  }
};

/**
 * Property setter for any property. Called by pui.Layout.setProperty, and sets templateProps on the layout object.
 * Note: the "tab keys" property is not implemented, because "tab keys" is for Genie, and layouts are not for Genie.
 * Overrides pui.layout.Template.setProperty.
 * @param {String} property
 * @param {String|undefined} value
 * @returns {Boolean}    When true is returned, the pui.Layout.prototype.setProperty will not process the property change any more.
 * @public
 */
pui.TabLayout.prototype.setProperty = function(property, value){
  switch (property){
    ///////////////////////////////////////////////////////////////////////////
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
            if (this._cannotRemoveTab(i - 1)){
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
        }
      }
      else {
        this.tabs = names;
      }
      
      if (this._rendered) { 
        // When applyProperty... is called after initial rendering, then draw what has changed (e.g. changing properties in designer).
        this._addRemoveTabs();
        this.drawChanged();
      }
      break;
      /////////////////////////////////////////////////////////////////////////
    
    case 'active tab':
      // Set the initial active tab. Assume "active tab" is only set when the tab panel is rendering initially.
      if (!this.designMode) {
        value = parseInt(value, 10);
        if (!isNaN(value) && this.selectedTab != value) this.selectedTab = value;
        this.sendActiveTab = true;
      }
      break;

    case 'ontabclick':
      if (!this.designMode) this._ontabclick = value;
      break;
      
    case 'tab response':
      // The property can only be bound to a decimal field, so always set the flag when the property is set.
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
      
    // Inherited.
    case 'color':
    case 'font family':
    case 'font size':
    case 'font style':
    case 'font weight':
    case 'text transform':
    // Not inherited.
    case 'text decoration':
      // Do nothing with these; applyPropertyToField sets the style on the main DIV element due to "propConfig.stylename". 
      // Tabs inherit these styles from the main DIV. (Also, tabs may not exist when this property is set.)
      break;
      
    case 'movable tabs':
      if (!this.designMode){
        // Allow tabs to be moved by the user. #7008.
        this._movabletabs = value === 'true' || value === true;
        // In case applyProperty is called after rendering, then update tabs.
        if (this._rendered) this.drawChanged();
      }
      break;
    
    default:
      return false;  //Let pui.Layout.prototype.setProperty handle other properties.
  }
  
  // Store template property values--any handled by this class.
  if (this.container.layout && this.container.layout.templateProps){
    this.container.layout.templateProps[property] = value;
  }
  return true;
};

/**
 * Render the layout in the DOM. Called once in runtime, after all properties are set, allowing simpler handling of properties. 
 * In Designer, this can be called as the user sets any property in the Properties Window.
 * Overrides pui.layout.Template.render.
 * @param {Object|undefined} screenParms   Parameters sent to renderFormat that are not passed in property setters. Undefined when called in Designer.
 * @public
 */
pui.TabLayout.prototype.render = function(screenParms) {
  if (this._rendered){
    this._addRemoveTabs();
  } 
  else {
    // Create the tab headers and the body wrapper.
    this._headerArea = document.createElement('div');  //wraps all tab spans. The child elements can be re-arranged in runtime.
    this._headerArea.className = 'pui-tablayout-hdr';
    this.container.appendChild(this._headerArea);
    
    this._bodyWrap = document.createElement("div");  //wraps the tab containers. The element order does not change when tabs are re-arranged in runtime.
    this._bodyWrap.className = "pui-tablayout-body";
    this.container.appendChild(this._bodyWrap);

    // Add +/- icons to the container DOM element. The container gets replaced at least once while
    // properties are assigned. But child nodes are migrated to the new DOM (applyTemplate.js:~72).
    if (this.designMode) this.createAddRemoveIcons();
    
    if (this.forProxy) this.container.style.position = "relative";
    
    this._addRemoveTabs();

    // Arrange the tabs into an order stored in the browser.
    if (this._movabletabs && !this.designMode){
      var state;
      this._storageKey = pui.getStorageKey(screenParms, 'pui-lyt-') + '-' + this.container.id;
      if (sessionStorage[this._storageKey] != null){
        try {
          state = JSON.parse(sessionStorage[this._storageKey]);
        }
        catch(ignored) {}
      }
      
      if (state != null && Array.isArray(state['order']) && state['order'].length > 0){
        // In case the customer added a tab via applyProperty(...,'tab names'...) and the order is saved, then extra tabs must be 
        // added in order to use the saved order. #7008.
        if (this.tabs.length < state['order'].length){
          while (this.tabs.length < state['order'].length){
            this.tabs.push('');
          }
          this._addRemoveTabs();
        }
        
        var outerSpans = [];
        // Remove each tab outer element.
        while (this._headerArea.childNodes.length > 0){
          var outerSpan = this._headerArea.childNodes[0];
          this._headerArea.removeChild(outerSpan);
          outerSpans.push(outerSpan);
        }

        // Add the outer elements in the order that was saved.
        while (state['order'].length > 0){
          var tabId = state['order'][0];
          var outerSpan = outerSpans[tabId];
          this._headerArea.appendChild(outerSpan);
          state['order'].shift();
        }
      }
    }

    this.addScrollButtons();
  }
  
  this.drawChanged();
  this._getActiveTabPos();
  this._checkScrollButtons();  //Shows/hides scroll buttons, scrolls to the active tab (_lastScrollLeft).
  
  // Make sure the Layout object associated with this knows where the containers are.
  this._setContainers(this._bodyWrap.children);
  
  this._rendered = true;
};

/**
 * Add or remove tab Span and Div elements to match the number of tabs in this.tabs.
 * @private
 */
pui.TabLayout.prototype._addRemoveTabs = function(){
  var numTabsDesired = this.tabs.length;
  var nextTabId = this._tabSpans.length;
  
  // Append elements when the number of tabs increased.
  while (numTabsDesired > this._tabSpans.length){

    var outerSpan = document.createElement("span");  //encapsulates tab text, left and right borders.    
    var tabSpan = document.createElement("span");  //holds tab text.
    tabSpan.setAttribute("isTab", "true");
    tabSpan.tabId = nextTabId;
    this._tabSpans.push(tabSpan);
    
    tabSpan.addEventListener('mousedown', this);
    if (this.designMode){
      tabSpan.addEventListener('dblclick', this);

      tabSpan.draggable = true;
      tabSpan.addEventListener('dragstart', this);
      tabSpan.addEventListener('dragend', this);
      tabSpan.addEventListener('dragover', this);
      tabSpan.addEventListener('dragleave', this);
      tabSpan.addEventListener('drop', this);
    }

    outerSpan.appendChild( document.createElement("span") );
    outerSpan.appendChild(tabSpan);
    outerSpan.appendChild( document.createElement("span") );
    this._headerArea.appendChild(outerSpan);

    var bodyDiv = document.createElement("div");
    bodyDiv.setAttribute("container", "true");
    bodyDiv.containerNumber = nextTabId + 1;  //Make sure this is set, or else saving the RDF can orphan widgets that were in this layout. 7008.
    bodyDiv.tabId = nextTabId;
    bodyDiv.style.display = 'none';
    this._bodyWrap.appendChild(bodyDiv);

    nextTabId++;
  }

  // Remove elements when the number of tabs decreased.
  while (numTabsDesired < this._tabSpans.length){
    var children = this._headerArea.children;
    this._headerArea.removeChild( children[ children.length - 1 ] );

    children = this._bodyWrap.children;
    this._bodyWrap.removeChild( children[ children.length - 1 ] );

    this._tabSpans.pop();
  }
};
  
/**
 * Draw things that change when the active tab changes: tab texts, tabIds, this tab's visible container; hide containers for non-active tabs.
 * Called when selected tab changes, by processTabChange, parent methods.
 * Overrides TabPanel.drawChanged.
 * Pre-Conditions: this.selectedTab is the active tab.
 * @public
 */
pui.TabLayout.prototype.drawChanged = function(){
  var tabSpan, bodyDiv, outerSpan, tabIdx;
  this.selectedTab = parseInt(this.selectedTab, 10);
  
  var templateProps;
  if (this.container.layout && this.container.layout.templateProps) templateProps = this.container.layout.templateProps;
  
  // For style properties that inherit, make sure tab styles use the value set for the widget property through CSS inheritance. The styles are on the main DIV.
  if (templateProps){
    this._headerArea.style.color = typeof templateProps['color'] === 'string' && templateProps['color'].length > 0 ? 'inherit' : '';
    this._headerArea.style.textTransform = typeof templateProps['text transform'] === 'string' && templateProps['text transform'].length > 0 ? 'inherit' : '';
    this._headerArea.style.fontFamily = typeof templateProps['font family'] === 'string' && templateProps['font family'].length > 0 ? 'inherit' : '';
    this._headerArea.style.fontSize = typeof templateProps['font size'] === 'string' && templateProps['font size'].length > 0 ? 'inherit' : '';
    this._headerArea.style.fontStyle = typeof templateProps['font style'] === 'string' && templateProps['font style'].length > 0 ? 'inherit' : '';
    this._headerArea.style.fontWeight = typeof templateProps['font weight'] === 'string' && templateProps['font weight'].length > 0 ? 'inherit' : '';
  }
  
  
  // For each tab, redraw the tab, hide/show containers, etc. The order of this.tabs matches what is set in the property, e.g. set in the RDF.
  for (var i=0, n=this.tabs.length; i < n; i++){
    tabSpan = this._tabSpans[i];  //Get the tab from the collection of _tabSpans, which is in the original order, same as this.tabs.
    tabSpan.innerHTML = this.tabs[i];
    
    // If the "text decoration" property is set, then set it on each tab inline. Text-decoration cannot be inherited.
    tabSpan.style.textDecoration = typeof templateProps['text decoration'] === 'string' ? templateProps['text decoration'] : '';
    
    // Hide hidden tabs; make sure others aren't hidden.
    tabIdx = this._findNodeIndexByTabId( tabSpan.tabId );
    outerSpan = this._headerArea.childNodes[ tabIdx ];
    outerSpan.style.display = this._hiddenTabs[i] ? "none" : "";
    
    if (tabSpan.tabId === this.selectedTab) tabSpan.parentNode.classList.add('selected-tab');
    else tabSpan.parentNode.classList.remove('selected-tab');

    if (!this.designMode){
      // Reset these events in case the selected tab or 'movable tabs' change.
      tabSpan.removeAttribute('draggable');
      tabSpan.removeEventListener('dragstart', this);
      tabSpan.removeEventListener('dragend', this);
      tabSpan.removeEventListener('dragover', this);
      tabSpan.removeEventListener('dragleave', this);
      tabSpan.removeEventListener('drop', this);

      if (this._movabletabs){
        // Allow tabs to be re-ordered in runtime.
        if (this.sendTabResponse){
          // When clicking a tab sends a response, then only allow dragging of selected tab.
          if (tabSpan.tabId === this.selectedTab){
            tabSpan.draggable = true;
            tabSpan.addEventListener('dragstart', this);
            tabSpan.addEventListener('dragend', this);
          }
          else {
            tabSpan.addEventListener('dragover', this);
            tabSpan.addEventListener('dragleave', this);
            tabSpan.addEventListener('drop', this);
          }
        }
        else {
          // When no response is sent, then allow dragging inactive tabs.
          tabSpan.draggable = true;
          tabSpan.addEventListener('dragstart', this);
          tabSpan.addEventListener('dragend', this);
          tabSpan.addEventListener('dragover', this);
          tabSpan.addEventListener('dragleave', this);
          tabSpan.addEventListener('drop', this);
        }
      }
    }
    
    // Setup the containers.
    bodyDiv = this._bodyWrap.children[i];
    if (i === this.selectedTab){
      bodyDiv.style.display = "";
      
      var layout = this.container.layout;
      if (layout != null){
        // Lazy loads the items, if they weren't already.
        if (!this.designMode) layout.renderItems( this.selectedTab );
        
        // Make sure any child layouts and widgets in this tab know they are visible now.
        if (layout.childrenSized[this.selectedTab] !== true) layout.sizeContainers( this.selectedTab );
      }
    }
    else {
      bodyDiv.style.display = "none";
    }
  }
  
  this._checkScrollButtons();
};

/**
 * Handler for events added like addEventListener(..., this).
 * @param {Event} e
 * @public
 */
pui.TabLayout.prototype['handleEvent'] = function(e){
  switch (e.type){
    // Handle changing tabs. 
    case 'mousedown':
      if (this.designMode) e.stopPropagation();  //Prevent Resizer from moving the layout when dragging a tab.

      // If the user is clicking on a not-selected tab, switch to that tab.
      var tabId = e.currentTarget.tabId;

      if (this.selectedTab != tabId){

        // if the same field is defined on different tabs then the value of the field must be
        // the value of the first element in the field array for that tab.
        if (pui.cursorValues.record != null){
          if (pui.responseElements[(pui.cursorValues.record + '.' + pui.cursorValues.field)].length > 1){
            pui.responseElements[(pui.cursorValues.record + '.' + pui.cursorValues.field)][0].value = 
            pui.responseElements[(pui.cursorValues.record + '.' + pui.cursorValues.field)][this.selectedTab].value
            pui.responseElements[(pui.cursorValues.record + '.' + pui.cursorValues.field)][0].modified = true;
          }
        }

        if (typeof this._ontabclick === 'string' && this._ontabclick.length > 0){
          try {
            // Expose the "tab" variable, and run the ontabclick code. If the ontabclick code returns false, then prevent the tab change.
            if (eval('var tab = ' + tabId + '; ' + this._ontabclick) == false) return;
          }
          catch(err) {
            pui.scriptError(err, "Ontabclick Error:\n");
          }
        }
        
        this._preValidationSelectedTab = this.selectedTab; //In case validation fails with "tab response", selectedTab will be restored (in TabPanel.js).
        this.selectedTab = tabId;
        this._lastScrollLeft = this._headerArea.scrollLeft;
        this.processTabChange(tabId);
      }
      return;
    
    case 'dblclick':
      this.tabSpanOndblclick(e);    //In Designer, show inline edit box for changing tab names.
      return;
      
      
    //
    // Tab re-ordering events.
    //
    case 'dragstart':       
      // Dragstart is the first event to fire when a drag is started. e.target is the element from which drag started.
      e.stopPropagation();
      
      this._dragtabId = e.currentTarget.tabId;
      
      if (!isNaN(this._dragtabId)){
        try {
          // Firefox requires setData before other drag events will fire.
          e.dataTransfer.setData('text/plain', this._dragtabId);  //Dummy data to force events to fire.
          e.dataTransfer.dropEffect = 'none';
          e.dataTransfer.effectAllowed = 'move';
        } 
        catch(ignore){}
      }      
      return;


    case 'dragover':
      if (e.currentTarget.tabId == this._dragtabId) return;  //Do not allow dropping onto self.
      
      e.preventDefault();       //Let browser know that drop is allowed.
      e.stopPropagation();
      
      e.dataTransfer.dropEffect = 'move';
      e.dataTransfer.effectAllowed = 'move';
      return;

    
    case 'dragleave': 
      e.preventDefault(); 
      e.stopPropagation();
      return;
    
    
    case 'drop':
      e.preventDefault();  //Prevent page from redirecting as link.
      e.stopPropagation();
      
      if (!this._headerArea.contains(e.target)) return;  //Is the drop point valid.
      
      // Signal fetch of the data
      try {
        e.dataTransfer.getData("text/plain"); //result is ignored; not all browsers implement it the same.
      }
      catch(ignore){}
      
      var draggedTabId = this._dragtabId;
      if (isNaN(draggedTabId)) return;

      var targetId = e.currentTarget.tabId;
      if (isNaN(targetId) || targetId == draggedTabId) return;
      
      var draggedTabIdx = this._findNodeIndexByTabId(draggedTabId);
      var dropTargetIdx = this._findNodeIndexByTabId(targetId);
      var leftToRight = (draggedTabIdx < dropTargetIdx);
      
      // Re-order the tab elements.
      var draggedOuterSpan = this._headerArea.childNodes[ draggedTabIdx ];
      this._headerArea.removeChild(draggedOuterSpan);
      
      // Find the index in _headerArea of the tab matching targetId; indexes removing a child can change the index.
      dropTargetIdx = this._findNodeIndexByTabId(targetId);

      if (leftToRight) dropTargetIdx += 1;

      var targetOuterSpan = this._headerArea.childNodes[ dropTargetIdx ];
      this._headerArea.insertBefore(draggedOuterSpan, targetOuterSpan );
      
      if (this.designMode){
        var designItem = this.container.layout.designItem;
        if (designItem) designItem.designer.undo.addSnapshot('Edit Layout', designItem.designer);
        
        // Also re-order the containers.
        var bodyElToMove = this._bodyWrap.childNodes[ draggedTabIdx ];
        this._bodyWrap.removeChild(bodyElToMove);
        var bodyElMoveBefore = this._bodyWrap.childNodes[ dropTargetIdx ];
        this._bodyWrap.insertBefore(bodyElToMove, bodyElMoveBefore);
        
        // Change the tab names property, reset tabIds
        var reorderedNames = '';
        var comma = '';
        this._tabSpans = [];
        for (var i=0, n=this._headerArea.childNodes.length; i < n; i++){
          var outerSpan = this._headerArea.childNodes[i];
          var tabSpan = outerSpan.childNodes[1];
          this._tabSpans.push(tabSpan);
          tabSpan.tabId = i;
          reorderedNames += comma + tabSpan.innerHTML;
          comma = ',';
          
          var bodyDiv = this._bodyWrap.childNodes[i];
          bodyDiv.tabId = i;
          // Needed for designer to get the correct container numbers, e.g. if user saves immediatly after dragging.
          bodyDiv.containerNumber = i + 1; 
        }
        
        this.selectedTab = dropTargetIdx;
        
        this.setProperty('tab names', reorderedNames);
        this._updatePropertyInDesigner('tab names', reorderedNames);
        pui.ide.refreshRibbon();  //Make sure the Undo text is current.
        this._setContainers(this._bodyWrap.children);  //Ensure Designer can get the correct container numbers.
      }
      else {
        // Store the new order.
        if (this._storageKey){
          try {
            var state = {'order': [] };
            for (var i=0, n=this._headerArea.childNodes.length; i < n; i++){
              var outerSpan = this._headerArea.childNodes[i];
              state['order'].push( outerSpan.childNodes[1].tabId );
            }
            sessionStorage[this._storageKey] = JSON.stringify(state);
          }
          catch(ignored) {}
        }
      }
      return;
      
      
    case 'dragend': 
      delete this._dragtabId;
      return;
  }
};

/**
 * Returns true if widgets are inside the specified tab; else false. Called in removeIconOnClick.
 * Overrides TabPanel._cannotRemoveTab.
 * @param {Number} i   The tab number we're checking for removal.
 * @returns {Boolean}  Returns true if any of the body DIVs have children; else false.
 * @private
 */
pui.TabLayout.prototype._cannotRemoveTab = function(i){
  var children = this._bodyWrap.children;
  return (children && children[i] && children[i].children && children[i].children.length > 0);
};

/**
 * Create a scroll left or right button. Styles must be set in CSS stylesheet.
 * Overrides TabPanel._createScrollButton.
 * @param {String} cssClass
 * @returns {Element}
 */
pui.TabLayout.prototype._createScrollButton = function(cssClass){
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
 * If "active tab" is bound, find the scroll position of the active tab. Do this only once, after the layout is visible.
 * @private
 */
pui.TabLayout.prototype._getActiveTabPos = function(){
  if (this.sendActiveTab && this._needScrollToActive && this._headerArea.offsetWidth > 0) {
    var idx = this._movabletabs ? this._findNodeIndexByTabId(this.selectedTab) : this.selectedTab;
    var outerSpan = this._headerArea.childNodes[idx];

    // Put the selected tab in the middle of the tab panel.
    if (outerSpan){
      this._lastScrollLeft = Math.round(outerSpan.offsetLeft - this._headerArea.offsetWidth / 2  + outerSpan.offsetWidth / 2);
      this._needScrollToActive = false;
    }
  }
};

/**
 * Find the outerSpan element whose tabSpan element matches the argument.
 * @param {Number} tabId
 * @returns {Number}
 * @private
 */
pui.TabLayout.prototype._findNodeIndexByTabId = function(tabId){
  for (var i=0, n=this._headerArea.childNodes.length; i < n; i++){
    var node = this._headerArea.childNodes[i];
    if (node.childNodes[1] && node.childNodes[1].tabId === tabId) return i;
  }
  return -1;
};

/**
 * Handle when the size changes for the parent of this layout, this layout becomes visible, or this layout is being added to 
 * something in Designer; called when moving item to main canvas or into container; called when width or height changes, because of
 * Layout.js::setProperty. 
 * Scroll buttons must be added when TabLayout is initially in hidden tab/section. Also #4711.
 * Overrides pui.layout.Template.resize.
 * @public
 */
pui.TabLayout.prototype.resize = function() {
  if (this._rendered) {
    this._getActiveTabPos();
    this._checkScrollButtons();
  }
};

/**
 * Remove DOM properties added by this class and the parent class.
 * Overrides pui.layout.Template.destroy.
 * @public
 */
pui.TabLayout.prototype.destroy = function(){
  // Remove DOM properties added by this class.
  var dom = this.container;
  if (dom){
    delete dom.setTab;
    delete dom.getTab;
    delete dom.refresh;
    delete dom["hideTab"];
    delete dom["showTab"];
  }
  pui.layout.Template.prototype.destroy.call(this);  //Remove dom.layoutT and dom.sizeMe; call deleteOwnProperties.
};
