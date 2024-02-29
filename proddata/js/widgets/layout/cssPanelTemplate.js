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
 * Returns a DIV element to contain the widget. CSSPanel is not a layout; this function helps make one out of it.
 * @param {Object} parms
 * @param {Element} dom   A new or cloned DIV element.
 * @returns {Element|Object}
 */
pui.layout.template.cssPanelTemplate = function(parms, dom) {
  var properties = parms.properties;
  var proxyMode = parms.proxyMode;

  var panel = new pui.CSSPanel();
  panel.forLayout = true;
  panel.container = dom;
  panel.init();
  dom.panel = panel;
  dom.sizeMe = function() {
    dom.panel.resize();
  };
  var headerText = properties["header text"];
  if (headerText != null) panel.setText(headerText);
  var headerTheme = properties["header theme"];
  if (headerTheme != null) panel.setHeaderSwatch(headerTheme);
  var bodyTheme = properties["body theme"];
  if (bodyTheme != null) panel.setBodySwatch(bodyTheme);
  panel.setStraightEdge(properties["straight edge"]);
  var hasHeader = properties["has header"];
  hasHeader = (hasHeader !== "false" && hasHeader !== false);
  panel.setHasHeader(hasHeader);
  var headerHeight = properties["header height"];
  if (headerHeight != null) panel.setHeaderHeight(headerHeight);
  panel.setAllStyles(properties);
  var height = properties["height"];
  if (height == null) height = dom.style.height || "300px";
  panel.setHeight(height);

  if (proxyMode) {
    dom.style.position = "relative";
  }

  return dom;
};
