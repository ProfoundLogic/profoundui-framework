//  Profound UI Runtime  -- A Javascript Framework for Rich Displays
//  Copyright (c) 2016 Profound Logic Software, Inc.
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



pui.layout.template.cssPanelTemplate = function(parms) {  
  
  var properties = parms.properties;
  var designMode = parms.designMode;
  var proxyMode = parms.proxyMode;
  var returnProps = parms.returnProps;
  var existingDom = parms.dom;

  if (returnProps) {
    return pui.layout.mergeProps([
      { name: "has header", choices: ["true", "false"], help: "Determines whether the panel has a header." },
      { name: "header height", format: "number", help: "Specifies the height of the panel header." },
      { name: "header text", help: "Specifies the text that will appear in the panel header.", translate: true },
      { name: "header theme", choices: ["A - Black", "B - Blue", "C - Gray", "D - Light Gray", "E - Yellow", "F - Green", "G - Red", "Other..."], help: "Specifies the jQuery Mobile theme to use for the panel header.  The theme is associated with a set of cascading style sheet rules." },
      { name: "body theme", choices: ["A - Black", "B - Blue", "C - Gray", "D - Light Gray", "E - Yellow", "F - Green", "G - Red", "Other..."], help: "Specifies the jQuery Mobile theme to use for the panel body.  The theme is associated with a set of cascading style sheet rules." },
      { name: "straight edge", choices: ["all", "left", "right", "top", "bottom"], help: "Determines which parts of the element will have a straight edge instead of rounded corners." },
      { name: "color", stylename: "color", type: "color", help: "Defines the color of the text inside the given element." },
      { name: "font family", stylename: "fontFamily", choices: ["Arial", "Consolas", "Courier New", "Georgia", "Monospace", "Tahoma", "Times New Roman", "Sans-Serif", "Serif", "Trebuchet MS", "Verdana", "Other..."],help: "The font face for the text of the current element.<br>Ex: <span style='font-family:arial;'>Arial</span>, <span style='font-family:times new roman;'>Times New Roman</span>, <span style='font-family:verdana;'>Verdana</span>, etc."},
      { name: "font size", stylename: "fontSize", format: "px", choices: ["8px", "9px", "10px", "11px", "12px", "13px", "14px", "15px", "16px", "17px", "18px", "19px", "20px", "21px", "22px", "23px", "24px", "25px", "26px", "27px", "28px", "29px", "30px", "0.75em", "1.00em", "1.25em", "1.50em", "1.75em", "2.00em", "Other..."],help: "The size of the text for the current element.<br>Ex: <span style='font-size:12px;'>12px</span> <span style='font-size:14px;'>14px</span> <span style='font-size:16px;'>16px</span>"},
      { name: "font style", stylename: "fontStyle", format: "italic / normal", choices: ["normal", "italic", "oblique"], help: "The style of the font: Normal, <span style='font-style:italic;'>Italic</span>, or <span style='font-style:oblique;'>Oblique</span> (oblique and italic are the same for most fonts)."},
      { name: "font weight", stylename: "fontWeight", format: "bold / normal", choices: ["normal", "bolder", "bold", "lighter", "100", "200", "300", "400", "500", "600", "700", "800", "900" ],help: "Font's weight. Most common used are <span style='font-weight:bold;'>bold</span> and <span style='font-weight:lighter;'>lighter</span>."},
      { name: "text align", stylename: "textAlign", choices: ["left", "right", "center", "justify"], help: "Alignment of the text in the current element.(Left, Right, Center, Justify).<br><table cellpadding='0' cellspacing='2'><tr><td><div style='text-align:left;width:125px;border:1px solid black;'>Left</div></td></tr><tr><td><div style='text-align:right;width:125px;border:1px solid black;'>Right</div></td></tr><tr><td><div style='text-align:center;width:125px;border:1px solid black;'>Center</div></td></tr><tr><td><div style='text-align:justify;width:125px;border:1px solid black;'>Justify</div></td></tr></table>"},
      { name: "text decoration", stylename: "textDecoration", format: "underline / none", choices: ["none", "underline", "overline", "line-through"],help: "Decoration on the text of the current element. <br><br>None, <span style='text-decoration:underline;'>Underline</span>, <span style='text-decoration:overline;'>Overline</span>, <span style='text-decoration:line-through;'>Line-through</span>. "},
      { name: "text transform", stylename: "textTransform", choices: ["capitalize", "uppercase", "lowercase", "none"], help: "Transforms the default formatting of the text. <br><br>Capitalize(first character only),UPPERCASE(all), lowercase(all)."}
    ]);
  }

  if (existingDom != null) {
    dom = existingDom.cloneNode(false);
  }
  else {
    dom = document.createElement("div");
  }
  dom.innerHTML = "";
  var panel = new pui.CSSPanel();
  panel.forLayout = true;
  panel.container = dom;
  panel.init();
  dom.panel = panel;
  dom.sizeMe = function() {
    dom.panel.resize();
  }
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
  if (height == null) height = "300px";
  panel.setHeight(height);
  
  if (proxyMode) {
    dom.style.position = "relative";
  }

  return dom;

}

