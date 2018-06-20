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



pui.layout.template.accordionTemplate = function(parms) {  
  
  var properties = parms.properties;
  var designMode = parms.designMode;
  var proxyMode = parms.proxyMode;
  var returnProps = parms.returnProps;
  var existingDom = parms.dom;

  if (returnProps) {
    return pui.layout.mergeProps([
      { name: "section names", type: "list", help: "Specifies a comma separate list of section names for the accordion.", translate: true },
      { name: "active section", format: "number", help: "This property specifies the initial active section on an Accordion Layout. Each section within an Accordion is identified by a sequential index, starting with 0 for the first section, 1 for the second section, and so on.  The default value is 0." },
      { name: "header theme", choices: ["A - Black", "B - Blue", "C - Gray", "D - Light Gray", "E - Yellow", "F - Green", "G - Red", "Other..."], help: "Specifies the jQuery Mobile theme to use for the accordion headers.  The theme is associated with a set of cascading style sheet rules." },
      { name: "body theme", choices: ["A - Black", "B - Blue", "C - Gray", "D - Light Gray", "E - Yellow", "F - Green", "G - Red", "Other..."], help: "Specifies the jQuery Mobile theme to use for the content body of the accordion.  The theme is associated with a set of cascading style sheet rules." },
      { name: "small sections", choices: ["true", "false"], help: "This property uses CSS to provide a smaller, more compact version of the header sections." },
      { name: "allow collapse", choices: ["true", "false"], help: "Determines if the accordion can be fully collapsed." },
      { name: "straight edge", choices: ["all", "left", "right", "top", "bottom"], help: "Determines which parts of the element will have a straight edge instead of rounded corners." },
      pui.layout.adoptNamedProperty("color"),
      pui.layout.adoptNamedProperty("font family"),
      pui.layout.adoptNamedProperty("font size"),
      pui.layout.adoptNamedProperty("font style"),
      pui.layout.adoptNamedProperty("font weight"),
      pui.layout.adoptNamedProperty("text align"),
      pui.layout.adoptNamedProperty("text decoration"),
      pui.layout.adoptNamedProperty("text transform"),
      { name: "onsectionclick", type: "js", help: "Initiates a client-side script when an accordion section is expanded.  The section index is passed to the event as a parameter named \"section\".  If the client-side script evaluates to false, the section will not be expanded." }      
    ]);
  }

  var dom;
  if (existingDom != null) {
    dom = existingDom.cloneNode(false);
  }
  else {
    dom = document.createElement("div");
  }
  dom.innerHTML = "";
  var accordion = new pui.Accordion();
  if (proxyMode) accordion.forProxy = true;
  accordion.container = dom;
  accordion.designMode = designMode;
  accordion.init();
  dom.accordion = accordion;
  dom.sizeMe = function() {
    dom.accordion.resize();
  };
  
  var sectionNames = properties["section names"];
  accordion.setSectionNames(sectionNames);  
  var headerTheme = properties["header theme"];
  if (headerTheme != null) accordion.setHeaderSwatch(headerTheme);
  var bodyTheme = properties["body theme"];
  if (bodyTheme != null) accordion.setBodySwatch(bodyTheme);
  accordion.setStraightEdge(properties["straight edge"]);
  var mini = properties["small sections"];
  mini = (mini === "true" || mini === true);
  accordion.setMini(mini);
  accordion.setAllStyles(properties);
  var height = properties["height"];
  if (height == null) height = "300px";
  accordion.setHeight(height);
  if (!designMode) {
    var activeSection = properties["active section"];
    if (activeSection != null) {
      activeSection = Number(activeSection);
      if (!isNaN(activeSection) && activeSection != 0) {
        accordion.expandSection(activeSection);
      }
    }
  }
  
  if (proxyMode) {
    dom.style.position = "relative";
  }

  return dom;

};

