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





var toolbar = null;
var screenPropertiesObj = new Object();
var cachedPropertiesModel = null;
var cachedPropertiesNamedModel = null;
var cachedScreens = {};

pui.suppressPropertyScriptingErrors = false;



// Provides list of properties and their definitions
function getPropertiesModel() {
  if (cachedPropertiesModel != null) return cachedPropertiesModel;
  
  var borderStyles = ["none", "dotted", "dashed", "solid", "double", "groove", "ridge", "inset", "outset"];
  var borderWidths = ["thin", "medium", "thick", "0px", "1px", "2px", "3px", "4px", "5px", "Other..."];
  var paddings = ["auto", "0px", "1px", "2px", "3px", "4px", "5px", "6px", "7px", "8px", "9px", "Other..."];
  var colorHelp = "<br><br><u>Usage</u>: Enter a color name or select a color.<br><br> <u>Valid colors by name</u> : <span style='color:aqua;'>aqua</span>, <span style='color:black;'>black</span>, <span style='color:blue;'>blue</span>, <span style='color:fuchsia;'>fuchsia</span>, <span style='color:gray;'>gray</span>, <span style='color:green;'>green</span>, <span style='color:lime;'>lime</span>, <span style='color:maroon;'>maroon</span>, <span style='color:navy;'>navy</span>, <span style='color:olive;'>olive</span>, <span style='color:purple;'>purple</span>, <span style='color:red;'>red</span>, <span style='color:silver;'>silver</span>, <span style='color:teal;'>teal</span>, <span style='color:white;background-color:black;'>white</span>, and <span style='color:yellow;background-color:black;'>yellow</span>. All other colors must be specified using a hex value (ex: <span style='color:#FF0000;'>#FF0000</span>).";
  var measureHelp = " Specify in pixels. <br>Ex: 12px";
  var overflowHelp = "<br><br><u>Valid options</u>: <br>'visible' - lets the content flow beyond the dimensions of the element without a scrollbar.<br><br>'hidden' - does not display a scrollbar and hides overflowing content.<br><br>'scroll' - always displays the scrollbar.  <br><br>'auto' - displays the scrollbar only when the element's content goes beyond the elements dimensions.";
  
  cachedPropertiesModel = [
    { name: "Identification", category: true },
    { name: "id", attribute: "id", maxLength: 75, help: "Specifies the ID of the current element.  ID's are used to access the element using CSS and JavaScript code.", bind: false, canBeRemoved: false },
    { name: "parent window", attribute: "parentWindow", help: "Sets the window that this field belongs to.", context: "genie" },    
    { name: "screen identifier", choices: ["true", "false"], blankChoice: false, help: "If set to true, this element will be used to detect the screen.  The identifier element should be a static output field that is unique to this screen.  For example, if the screen has a unique heading, it can be used as the identifier.  At least one element on the screen must be marked as an identifier before you can save the screen.  When appropriate, you can use a combination of several elements to uniquely identify the screen.", context: "genie" },
    { name: "field type", choices: pui.widgets.getWidgetList(false), blankChoice: false, help: "Determines the type of control that is used to render the element.", bind: false, canBeRemoved: false },
    { name: "description", help: "Use this property to provide a text description (or comment) for the element.", bind: false },
    { name: "button style", choices: pui.widgets.getButtonStyles, help: "Identifies the look and feel of the button.", controls: ["styled button"] },
    { name: "panel style", choices: pui.widgets.getPanelStyles, help: "Identifies the look and feel of the panel.", controls: ["panel"] },
    { name: "value", help: "Sets the initialization value for the current element.", translate: true },
    { name: "response", format: "1 / 0", readOnly: true, hideFormatting: true, validDataTypes: ["indicator", "char", "zoned"], help: "Specifies a response indicator that is returned to your program when the element is clicked.", controls: ["button", "styled button", "graphic button", "hyperlink", "image", "css button"], context: "dspf" },
    { name: "menu response", readOnly: true, hideFormatting: true, help: "Specifies a response field to be populated with the selected menu option.", controls: ["menu"], context: "dspf" },    
    { name: "tab response", readOnly: true, format: "number", hideFormatting: true, validDataTypes: ["zoned"], help: "Specifies a numeric response field to be populated when a tab is selected.  Each tab within a Tab Panel is identified by a sequential index, starting with 0 for the first tab, 1 for the second tab, and so on.", controls: ["tab panel"], context: "dspf" },
    { name: "upload response", readOnly: true, hideFormatting: true, validDataTypes: ["char"], help: "Specifies a data structure response field to be populated when files are uploaded.", controls: ["file upload"], context: "dspf" },
    { name: "radio button group", readOnly: true, help: "This property allows you to associate multiple radio buttons together by specifying a unique field name.", controls: ["radio button"], context: "dspf"},
    { name: "chart response", readOnly: true, hideFormatting: true, validDataTypes: ["char"], help: "Specifies a response field to be populated with the name of the data point selected by the user.", controls: ["chart"], context: "dspf" },
        
    { name: "Font and Text", category: true },
    { name: "color", stylename: "color", type: "color", help: "Defines the color of the text inside the given element." + colorHelp, formattingProp: true },
    { name: "font family", stylename: "fontFamily", choices: ["Arial", "Consolas", "Courier New", "Georgia", "Monospace", "Tahoma", "Times New Roman", "Sans-Serif", "Serif", "Trebuchet MS", "Verdana", "Other..."],help: "The font face for the text of the current element.<br>Ex: <span style='font-family:arial;'>Arial</span>, <span style='font-family:times new roman;'>Times New Roman</span>, <span style='font-family:verdana;'>Verdana</span>, etc.", formattingProp: true },
    { name: "font size", stylename: "fontSize", format: "px", choices: ["8px", "9px", "10px", "11px", "12px", "13px", "14px", "15px", "16px", "17px", "18px", "19px", "20px", "21px", "22px", "23px", "24px", "25px", "26px", "27px", "28px", "29px", "30px", "0.75em", "1.00em", "1.25em", "1.50em", "1.75em", "2.00em", "Other..."],help: "The size of the text for the current element.<br>Ex: <span style='font-size:12px;'>12px</span> <span style='font-size:14px;'>14px</span> <span style='font-size:16px;'>16px</span>", formattingProp: true },
    { name: "font style", stylename: "fontStyle", format: "italic / normal", choices: ["normal", "italic", "oblique"], help: "The style of the font: Normal, <span style='font-style:italic;'>Italic</span>, or <span style='font-style:oblique;'>Oblique</span> (oblique and italic are the same for most fonts).", formattingProp: true },
    { name: "font variant", stylename: "fontVariant", choices: ["normal", "small-caps"], help: "Normal or <span style='font-variant:small-caps;'>small caps</span>. Small caps shows the text with all caps but same height as a lower case letter.", formattingProp: true },
    { name: "font weight", stylename: "fontWeight", format: "bold / normal", choices: ["normal", "bolder", "bold", "lighter", "100", "200", "300", "400", "500", "600", "700", "800", "900" ],help: "Font's weight. Most common used are <span style='font-weight:bold;'>bold</span> and <span style='font-weight:lighter;'>lighter</span>.", formattingProp: true },
    { name: "letter spacing", stylename: "letterSpacing", format: "px", choices: ["normal", "-3px", "-2px", "-1px", "0px", "1px", "2px", "3px", "4px", "5px", "6px", "7px", "8px", "9px", "10px", "11px", "12px", "13px", "14px", "15px", "16px", "17px", "18px", "19px", "20px", "Other..."],help: "Spacing between each letter of a word. <span style='letter-spacing:5px;'>Positive(5px)</span> increases space between each letter, <span style='letter-spacing:-1px;'>negative(-1px)</span> decreases it.", formattingProp: true },
    { name: "text align", stylename: "textAlign", choices: ["left", "right", "center", "justify"], help: "Alignment of the text in the current element.(Left, Right, Center, Justify).<br><table cellpadding='0' cellspacing='2'><tr><td><div style='text-align:left;width:125px;border:1px solid black;'>Left</div></td></tr><tr><td><div style='text-align:right;width:125px;border:1px solid black;'>Right</div></td></tr><tr><td><div style='text-align:center;width:125px;border:1px solid black;'>Center</div></td></tr><tr><td><div style='text-align:justify;width:125px;border:1px solid black;'>Justify</div></td></tr></table>", formattingProp: true },
    { name: "text decoration", stylename: "textDecoration", format: "underline / none", choices: ["none", "underline", "overline", "line-through"],help: "Decoration on the text of the current element. <br><br>None, <span style='text-decoration:underline;'>Underline</span>, <span style='text-decoration:overline;'>Overline</span>, <span style='text-decoration:line-through;'>Line-through</span>. ", formattingProp: true },
    { name: "text transform", stylename: "textTransform", choices: ["capitalize", "uppercase", "lowercase", "none"],help: "Transforms the default formatting of the text. <br><br>Capitalize(first character only),UPPERCASE(all), lowercase(all)." },
    { name: "white space", stylename: "whiteSpace", choices: ["normal", "pre", "nowrap"], help: "Determines how white space inside an element is handled.  The default is no-wrap.", controls: ["html container", "hyperlink"] },
    { name: "word spacing", stylename: "wordSpacing", format: "px", choices: ["normal", "-3px", "-2px", "-1px", "0px", "1px", "2px", "3px", "4px", "5px", "6px", "7px", "8px", "9px", "10px", "11px", "12px", "13px", "14px", "15px", "16px", "17px", "18px", "19px", "20px", "21px", "22px", "23px", "24px", "25px", "Other..."],help: "Spacing between each word in the current element. <span style='word-spacing:-2px;'>Negative decreases spacing</span>, <span style='word-spacing:2px;'>positive increases spacing</span>.", formattingProp: true },

    { name: "Field Settings", category: true },
    { name: "ajax url", type: "long", help: "Specifies the content url for an ajax container.", controls: ["ajax container"] },
    { name: "iframe url", type: "long", help: "Specifies the content url for an IFrame (inline frame) element.", controls: ["iframe"] },
    { name: "frame border", choices: ["true", "false"], blankChoice: false, help: "Determines whether the IFrame (inline frame) element will have a border.", controls: ["iframe"] },    
    { name: "theme", choices: ["A - Black", "B - Blue", "C - Gray", "D - Light Gray", "E - Yellow", "F - Green", "G - Red", "Other..."], help: "Specifies the jQuery Mobile theme to use for the button.  The theme is associated with a set of cascading style sheet rules.", controls: ["css button"] },
    { name: "has header", choices: ["true", "false"], help: "Determines whether the panel has a header.", controls: ["css panel", "layout"] },
    { name: "header height", format: "number", help: "Specifies the height of the panel header.", controls: ["css panel", "layout"] },
    { name: "header theme", choices: ["A - Black", "B - Blue", "C - Gray", "D - Light Gray", "E - Yellow", "F - Green", "G - Red", "Other..."], help: "Specifies the jQuery Mobile theme to use for the panel header.  The theme is associated with a set of cascading style sheet rules.", controls: ["css panel", "layout"] },
    { name: "body theme", choices: ["A - Black", "B - Blue", "C - Gray", "D - Light Gray", "E - Yellow", "F - Green", "G - Red", "Other..."], help: "Specifies the jQuery Mobile theme to use for the panel body.  The theme is associated with a set of cascading style sheet rules.", controls: ["css panel", "layout"] },
    { name: "icon position", choices: ["left", "right"], help: "Specifies the position of the icon.  If a position is not provided, no icon is displayed.", controls: ["css button"] },
    { name: "icon", choices: ["left arrow", "right arrow", "up arrow", "down arrow", "delete", "plus", "minus", "check", "gear", "refresh", "forward", "back", "grid", "star", "alert", "info", "home", "search"], help: "Identifies the icon to display in the position specified by the \"icon position\" property.", controls: ["css button"] },
    { name: "small button", choices: ["true", "false"], help: "This property uses CSS to provide a smaller, more compact version of the button that is useful in toolbars and tight spaces.", controls: ["css button"] },
    { name: "straight edge", choices: ["all", "left", "right", "top", "bottom"], help: "Determines which parts of the element will have a straight edge instead of rounded corners.", controls: ["css button", "css panel", "layout"] },    
    { name: "hyperlink reference", help: "This property specifies an href attribute for the hyperlink.  It is used as an alternative to the response property or the onclick event property.", controls: ["hyperlink", "css button"] },
    { name: "target", help: "This property specifies where to open the hyperlink reference.", choices: ["_parent", "_blank", "_top", "_self"], controls: ["hyperlink", "css button"] },
    { name: "checked value", help: "For a checkbox field, specifies the value to send to the application when the checkbox is checked.", controls: ["checkbox"], bind: false },
    { name: "unchecked value", help: "For a checkbox field, specifies the value to send to the application when the checkbox is not checked.", controls: ["checkbox"], bind: false },
    { name: "on value", help: "Specifies the value to send to the application when the on/off switch is on.", controls: ["on off switch"], bind: false },
    { name: "off value", help: "Specifies the value to send to the application when the on/off switch is off.", controls: ["on off switch"], bind: false },
    { name: "on text", help: "Specifies the text to to display for the \"on\" state of an on/off switch.  The default text is ON.", controls: ["on off switch"], translate: true },
    { name: "off text", help: "Specifies the text to to display for the \"off\" state of an on/off switch.  The default text is OFF.", controls: ["on off switch"], translate: true },
    { name: "wide handle", choices: ["true", "false"], type: "boolean", help: "Specifies whether the on/off switch should display a wide handle for switching state.  The default is true.  If false is selected, a narrow handle will be used.", hideFormatting: true, validDataTypes: ["indicator", "expression"], controls: ["on off switch"] },
    { name: "date format", choices: ["MM/DD/YY", "MM/DD/YYYY", "DD/MM/YY", "DD/MM/YYYY", "DD.MM.YY", "DD.MM.YYYY", "MMDDYY", "MMDDYYYY", "DDMMYY", "DDMMYYYY", "YYMMDD", "YY/MM/DD", "YYYYMMDD", "YYYY-MM-DD"], help: "Defines the date format that is returned from the pop-up calendar.", controls: ["date field"], context: "genie" },
    { name: "default value", help: "Specifies a default value for a field.  The specified value is displayed on the first output operation.  On subsequent output operations, the program value appears.", controls: ["combo box", "date field", "output field", "password field", "select box", "spinner", "text area", "textbox"], bind: false, context: "dspf", viewdesigner: false },
    { name: "default value condition", validDataTypes: ["indicator", "expression"], hideFormatting: true, readOnly: true, format: "true / false", type: "boolean", help: "Determines if the default value is applied.", controls: ["combo box", "date field", "output field", "password field", "select box", "spinner", "text area", "textbox"], context: "dspf", viewdesigner: false },
    { name: "blank value", multOccur: true, help: "Use this property to map blank field data to a different value during input and output operations.  This property is typically used with elements whose value is bound to a date, time, or timestamp field.  To specify multiple blank values, right-click the property and select Add Another Blank Value.", controls: ["combo box", "date field", "output field", "password field", "spinner", "text area", "textbox"], bind: false, context: "dspf" },
    { name: "override data", choices: ["true", "false"], type: "boolean", help: "Use this property to together with the \"put override\" property to override existing data contents already on the display.  It represents the OVRDTA keyword.", hideFormatting: true, validDataTypes: ["indicator", "expression"], controls: ["combo box", "date field", "output field", "password field", "select box", "spinner", "text area", "textbox"], context: "dspf", viewdesigner: false },
    { name: "override attribute", choices: ["true", "false"], type: "boolean", help: "Use this property to together with the \"put override\" property to override existing attributes already on the display.  It represents the OVRATR keyword.", hideFormatting: true, validDataTypes: ["indicator", "expression"], controls: ["combo box", "date field", "output field", "password field", "select box", "spinner", "text area", "textbox"], context: "dspf", viewdesigner: false },
    { name: "put retain", choices: ["true", "false"], type: "boolean", help: "You use this property with the \"overlay\" property to prevent the handler from deleting data that is already on the display when the application displays the record again. It represents the PUTRETAIN keyword.", hideFormatting: true, validDataTypes: ["indicator", "expression"], controls: ["combo box", "date field", "output field", "password field", "select box", "spinner", "text area", "textbox"], context: "dspf", viewdesigner: false },
    { name: "disabled", attribute: "disabled", choices: ["true", "false"], type: "boolean", help: "Determines whether the element is disabled or not. The user cannot use a disabled field in any way." + ((context == "genie") ? " A disabled field is not submitted to the server application." : ""), hideFormatting: true, validDataTypes: ["indicator", "expression"]},
    { name: "html", type: "long", allowNewLines: true, help: "Used to define custom html in an html container.", controls: ["html container"], translate: true },
    { name: "image source", type: "image", attribute: "src", help: "Specifies the path to an image for an image or a graphic button.", controls: ["graphic button", "image"] },
    { name: "hover image source", type: "image", help: "Specifies the path to an image that will be displayed when the user hovers the mouse cursor over the image element.", controls: ["image"] },
    { name: "click image source", type: "image", help: "Specifies the path to an image that will be displayed when the user presses down the mouse on the image element.", controls: ["image"] },
    { name: "alternate text", attribute: "alt", help: "Specifies the alternate text for an image.  The alternate text appears when the image cannot be rendered.", controls: ["image"], translate: true },
    { name: "label", help: "Specifies the caption text associated with a checkbox or a radio button.", controls: ["checkbox", "radio button"], translate: true },
    { name: "orientation", choices: ["horizontal", "vertical"], help: "Specifies the orientation of a slider or a menu element.", controls: ["menu", "slider"] },
    { name: "min value", format: "number", help: "Defines the minimum value for a spinner or slider element.", controls: ["slider", "spinner"] },
    { name: "max value", format: "number", help: "Defines the maximum value for a spinner or slider element.", controls: ["slider", "spinner"] },
    { name: "increment value", format: "number", help: "Specifies how much the value in a spinner or slider element increases or decreases.  The default value is 1.", controls: ["slider", "spinner"] },
    { name: "read only", attribute: "readOnly", choices: ["true", "false"], type: "boolean", help: "Defines whether the current element is read only or not.  A read only element prevents the user from changing its value; however, the user can still interact with the element.", controls: ["checkbox", "combo box", "date field", "on off switch", "password field", "radio button", "signature pad", "spinner", "text area", "textbox"], hideFormatting: true, validDataTypes: ["indicator", "expression"]},
    { name: "input only", choices: ["true", "false"], bind: false, type: "boolean", help: "Defines whether the current element is input only or not.  An input only element is always initialized when the screen appears.", controls: ["checkbox", "combo box", "date field", "password field", "select box", "spinner", "text area", "textbox"], context: "dspf", viewdesigner: false },
    { name: "empty text", controls: ["combo box", "date field", "spinner", "text area", "textbox"], help: "Specifies the default text to place into an empty field.  When the field receives focus, the text is removed.  This property is similar to the \"placeholder\" property, but provides support for older browser that may not yet support the placeholder HTML5 attribute.", translate: true},
    { name: "placeholder", attribute: "placeholder", controls: ["combo box", "date field", "spinner", "text area", "textbox", "password field"], help: "Uses the HTML5 placeholder attribute to specify a short hint that describes the expected value of an input field.  Older browsers may not support this feature.", translate: true},
    { name: "input type", choices: ["date", "datetime", "email", "time", "month", "number", "tel", "url"], controls: ["combo box", "date field", "textbox"], help: "Specifies an HTML5 input type.  Some types may not yet be supported by the user's browser or mobile device.  If a type is not specified or if the selected type is not supported, a standard textbox element will be used."},
    { name: "related field", help: "This property allows you to create a radio button group by associating multiple radio buttons with a field from the original application.  Specify the id of the field to associate the radio button with.  Additionally, this property can associate a text area with a group of textboxes by specify a comma separated list of textbox id's.", controls: ["radio button", "text area"], context: "genie"},
    { name: "select box height", format: "number", attribute: "size", choices: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "Other..."], help: "If specified, the select box appears as a list box; if omitted, the select box appears as a dropdown.", controls: ["select box"] },
    { name: "multiple", attribute: "multiple", choices: ["true", "false"], type: "boolean" , help: "Specifies that multiple options can be selected at once in a List Box.  The options are returned as a comma separated list.", controls: ["select box"], context: "dspf", hideFormatting: true, validDataTypes: ["indicator", "expression"] },
    { name: "set focus", choices: ["true", "false"], type: "boolean" , help: "This property determines if the focus will be set to this field when the screen loads.", controls: ["checkbox", "combo box", "date field", "password field", "radio button", "select box", "spinner", "text area", "textbox"], context: "dspf", hideFormatting: true, validDataTypes: ["indicator", "expression"] },
    { name: "auto advance", choices: ["true", "false"], type: "boolean" , help: "Use this property to indicate that the user does not need to press Enter or otherwise manually submit the screen.  Whenever the user keys a character (including a blank) into the last position of the field, the screen contents are submitted to the server as if the Enter key had been pressed.", controls: ["combo box", "date field", "password field", "spinner", "textbox"], context: "dspf", hideFormatting: true, validDataTypes: ["indicator", "expression"] },
    { name: "allow field exit", choices: ["true", "false"], type: "boolean", help: "This property determines whether the field exit key (Numeric Pad Plus Sign by default) can be used to progress to the next input element.", controls: ["combo box", "date field", "select box", "spinner", "textbox"], context: "dspf", hideFormatting: true, validDataTypes: ["indicator", "expression"], viewdesigner: false },
    { name: "allow dup key", choices: ["true", "false"], type: "boolean" , help: "This property determines whether the Dup key (Shift-Insert by default) can be used on this element.  It represents the DUP DDS keyword.", controls: ["textbox"], context: "dspf", hideFormatting: true, validDataTypes: ["indicator", "expression"], viewdesigner: false },
    { name: "dup key response", format: "1 / 0", readOnly: true, hideFormatting: true, validDataTypes: ["indicator"], help: "Specifies a response indicator that is returned to your program when the Dup key is used on this element.", controls: ["textbox"], context: "dspf", viewdesigner: false },
    { name: "prevent auto tab", choices: ["true", "false"], type: "boolean" , help: "This proprty prevents automatic tabbing on this element even when the pui[\"auto tab\"] flag is set to true.", controls: ["combo box", "date field", "password field", "spinner", "textbox"], context: "dspf", hideFormatting: true, validDataTypes: ["indicator", "expression"] },
    { name: "shortcut key", choices: ["Enter", "Escape", "PageUp", "PageDown", "PrtScn", "Pause/Break", "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12", "F13", "F14", "F15", "F16", "F17", "F18", "F19", "F20", "F21", "F22", "F23", "F24", "Alt-F1", "Alt-F2", "Alt-F3", "Alt-F4", "Alt-F5", "Alt-F6", "Alt-F7", "Alt-F8", "Alt-F9", "Alt-F10", "Alt-F11", "Alt-F12", "Alt-F13", "Alt-F14", "Alt-F15", "Alt-F16", "Alt-F17", "Alt-F18", "Alt-F19", "Alt-F20", "Alt-F21", "Alt-F22", "Alt-F23", "Alt-F24", "Ctrl-F1", "Ctrl-F2", "Ctrl-F3", "Ctrl-F4", "Ctrl-F5", "Ctrl-F6", "Ctrl-F7", "Ctrl-F8", "Ctrl-F9", "Ctrl-F10", "Ctrl-F11", "Ctrl-F12", "Ctrl-F13", "Ctrl-F14", "Ctrl-F15", "Ctrl-F16", "Ctrl-F17", "Ctrl-F18", "Ctrl-F19", "Ctrl-F20", "Ctrl-F21", "Ctrl-F22", "Ctrl-F23", "Ctrl-F24"], help: "Specifies a keyboard shortcut that can be used to trigger this element.", controls: ["button", "styled button", "graphic button", "hyperlink", "image", "menu", "css button"], context: "dspf" },
    { name: "cursor row", format: "number", help: "Identifies the cursor row number associated with this widget.", controls: ["combo box", "date field", "html container", "output field", "password field", "select box", "spinner", "text area", "textbox"], context: "dspf", viewdesigner: false },
    { name: "cursor column", format: "number", help: "Identifies the cursor column number associated with this widget.", controls: ["combo box", "date field", "html container", "output field", "password field", "select box", "spinner", "text area", "textbox"], context: "dspf", viewdesigner: false },
    { name: "changed", format: "1 / 0", readOnly: true, hideFormatting: true, validDataTypes: ["indicator"], help: "Specifies a response indicator that is set on if the data within the input element is modified.", controls: ["checkbox", "combo box", "date field", "password field", "select box", "spinner", "text area", "textbox"], context: "dspf" },
    { name: "is blank", format: "1 / 0", readOnly: true, hideFormatting: true, validDataTypes: ["indicator"], help: "Specifies a response indicator that is set on if the data within the input element is blank.  The property allows you to distinguish between a blank and a zero within a numeric field.", controls: ["date field", "password field", "spinner", "text area", "textbox"], context: "dspf" },

    { name: "messages", type: "messages", readOnly: true, bind: false, help: "Identifies messages used to populate this element.", relatedProperties: ["clear message", "message id prefix", "message id", "message file", "message library", "message condition"], context: "dspf", controls: ["button", "output field", "styled button", "text area", "textbox", "css button"], canBeRemoved: false }, 
    { name: "clear message", label: "Clear Message", checkbox: true, bind: false, multOccur: true, hide: true, help: "", context: "dspf", controls: ["button", "output field", "styled button", "text area", "textbox", "css button"]}, 
    { name: "message id prefix", label: "Message Id Prefix", uppercase: true, maxLength: 3, multOccur: true, hide: true, help: "", context: "dspf", controls: ["button", "output field", "styled button", "text area", "textbox", "css button"]}, 
    { name: "message id", label: "Message Id", uppercase: true, maxLength: 7, multOccur: true, hide: true, help: "", context: "dspf", controls: ["button", "output field", "styled button", "text area", "textbox", "css button"]}, 
    { name: "message file", label: "Message File", uppercase: true, maxLength: 10, multOccur: true, hide: true, help: "", context: "dspf", controls: ["button", "output field", "styled button", "text area", "textbox", "css button"]}, 
    { name: "message library", label: "Library", uppercase: true, maxLength: 10, multOccur: true, hide: true, help: "", context: "dspf", controls: ["button", "output field", "styled button", "text area", "textbox", "css button"]}, 
    { name: "message condition", label: "Condition", validDataTypes: ["indicator", "expression"], hideFormatting: true, readOnly: true, multOccur: true, hide: true, readOnly: true, format: "1 / 0", type: "boolean", help: "", context: "dspf", context: "dspf", controls: ["button", "output field", "styled button", "text area", "textbox", "css button"]},
  
    { name: "Validation", category: true, context: "dspf" },
    { name: "error message location", choices: ["left", "right", "top", "bottom", "alert"], validDataTypes: ["char", "indicator", "expression"], format: "Custom Values", help: "Controls the position and orientation of validation and error tool tips. When \"alert\" is selected, an alert box will be used instead of a tool tip. If not set, the default value \"right\" is used.", context: "dspf"},
    { name: "mandatory entry", choices: ["true", "false"], type: "boolean", hideFormatting: true, validDataTypes: ["indicator", "expression"], help: "When set to true, the user must modify the field by typing at least one character into the input box.  A blank is a valid character.", controls: ["combo box", "date field", "password field", "spinner", "text area", "textbox"], context: "dspf"},
    { name: "mandatory fill", choices: ["true", "false"], type: "boolean", hideFormatting: true, validDataTypes: ["indicator", "expression"], help: "When set to true, the user must type characters in all positions of the input box.", controls: ["combo box", "date field", "password field", "spinner", "textbox"], context: "dspf"},    
    { name: "required", choices: ["true", "false"], type: "boolean", hideFormatting: true, validDataTypes: ["indicator", "expression"], help: "When set to true, the element cannot be empty.", controls: ["combo box", "date field", "file upload", "password field", "select box", "spinner", "text area", "textbox"], context: "dspf"},
    { name: "valid values", type: "list", controls: ["combo box", "date field", "password field", "spinner", "text area", "textbox"], help: "Specifies a list of values that are valid for the user to type into the input box.  The values should be comma separated.", context: "dspf"},
    { name: "comparison operator", choices: ["Equal", "Not Equal", "Greater Than", "Greater Than or Equal", "Less Than", "Less Than or Equal"], controls: ["combo box", "date field", "password field", "spinner", "text area", "textbox"], help: "Identifies the relational operator used to compare data in the input box with the specified comparison value.", context: "dspf"},
    { name: "comparison value", controls: ["combo box", "date field", "password field", "spinner", "text area", "textbox"], help: "Specifies the value used for comparing against data in the input box.  This property is used in combination with the comparison operator property.", context: "dspf"},
    { name: "range low", controls: ["combo box", "date field", "password field", "spinner", "text area", "textbox"], help: "Specifies the minimum value for range validity checking.  The data in the input box must be greater than or equal to this value.", context: "dspf"},
    { name: "range high", controls: ["combo box", "date field", "password field", "spinner", "text area", "textbox"], help: "Specifies the maximum value for range validity checking.  The data in the input box must be less than or equal to this value.", context: "dspf"},
    { name: "validate name", choices: ["true", "false"], type: "boolean", hideFormatting: true, validDataTypes: ["indicator", "expression"], help: "Use this property to specify that the data typed into the field must be a valid simple name. The first character must be $, #, @, or A through Z. The remaining characters must be alphanumeric ($, #, @, A through Z, 0 through 9, or underscore (_), and must not contain embedded blanks.", controls: ["combo box", "textbox"], context: "dspf"},
    { name: "validate email", choices: ["true", "false"], type: "boolean", hideFormatting: true, validDataTypes: ["indicator", "expression"], help: "Use this property to specify that the data typed into the field must be in the format of an email address.", controls: ["combo box", "textbox"], context: "dspf"},
    { name: "allow blanks", choices: ["true", "false"], type: "boolean", hideFormatting: true, validDataTypes: ["indicator", "expression"], help: "When set to true, blank input will satisfy validity checking should any other associated validity check fail.", controls: ["combo box", "date field", "password field", "spinner", "text area", "textbox"], context: "dspf"},
    { name: "error messages", type: "errmessages", readOnly: true, bind: false, help: "Identifies error messages to be displayed in association with this element.", relatedProperties: ["error message", "error message id", "error message file", "error message library", "replacement data", "error condition", "error response", "error enhanced mode"], context: "dspf", canBeRemoved: false }, 
    { name: "error message", label: "Message Text", multOccur: true, hide: true, help: "", context: "dspf"}, 
    { name: "error message id", label: "Message Id", uppercase: true, maxLength: 7, multOccur: true, hide: true, help: "", context: "dspf"}, 
    { name: "error message file", label: "Message File", maxLength: 10, uppercase: true, multOccur: true, hide: true, help: "", context: "dspf"}, 
    { name: "error message library", label: "Library", maxLength: 10, uppercase: true, multOccur: true, hide: true, help: "", context: "dspf"}, 
    { name: "replacement data", label: "Replacement Data", validDataTypes: ["char"], hideFormatting: true, readOnly: true, multOccur: true, hide: true, help: "", context: "dspf"}, 
    { name: "error condition", label: "Error Condition", validDataTypes: ["indicator", "expression"], hideFormatting: true, readOnly: true, multOccur: true, hide: true, readOnly: true, format: "1 / 0", type: "boolean", help: "", context: "dspf"},
    { name: "error response", label: "Error Response", validDataTypes: ["indicator"], hideFormatting: true, readOnly: true, multOccur: true, hide: true, readOnly: true, format: "1 / 0", type: "boolean", help: "",context: "dspf"},
    { name: "error enhanced mode", label: "Enhanced Mode", checkbox: true, bind: false, multOccur: true, hide: true, help: "If checked, allows error messages to display without ERRMSG/ERRMSGID-type restrictions. Errors can display regardless of whether format is already on the screen, and output data is also sent.", context: "dspf" }, 
    { name: "set as modified", choices: ["true", "false"], type: "boolean", hideFormatting: true, validDataTypes: ["indicator", "expression"], help: "Marks an input field as modified when it is first displayed.", controls: ["check box", "combo box", "date field", "password field", "radio button", "select box", "slider", "spinner", "text area", "textbox"], context: "dspf"},
    { name: "bypass validation", choices: ["true", "false", "send data"], type: "boolean", controls: ["button", "styled button", "graphic button", "hyperlink", "image", "menu", "tab panel", "chart", "css button"], help: "This property, typically used on Cancel or Undo buttons, specifies that the element will not trigger client-side validation and will automatically discard all data modified by the user on the screen.  It represents the CAxx set of DDS keywords.  You can select \"send data\" to bypass all client-side validation except for field data type validation and still send all data modified by the user.", context: "dspf" },
  
    { name: "Auto-Complete Choices", category: true, controls: ["textbox"] },
    { name: "Selection Choices", category: true, controls: ["combo box", "select box"] },
    { name: "Menu Options", category: true, controls: ["menu"] },
    { name: "choices", type: "list", help: "Specifies the options for a select box (dropdown or list box), text field with autocomplete, combo box, or menu.  The options should be comma separated.  To specify submenus for a menu, indent the choices using a dash or a series of dashes.", controls: ["combo box", "menu", "select box", "textbox"], translate: true },
    { name: "choice values", type: "list", help: "Specifies alternate option values to send to the application for a select box (dropdown or list box), text field with auto complete, combo box, or menu. The values should be comma separated.", controls: ["combo box", "menu", "select box", "textbox"] },
    { name: "hover background color", type: "color", help: "Defines the background color of a menu option when the user hovers the mouse over it." + colorHelp, controls: ["menu"] },
    { name: "hover text color", type: "color", help: "Defines the text color of a menu option when the user hovers the mouse over it." + colorHelp, controls: ["menu"] },
    { name: "animate", choices: ["true", "false"], blankChoice: false, help: "Determines if hovering over menu options is animated.", controls: ["menu"] },
    { name: "border color", type: "color", help: "The color of the border used for menu options." + colorHelp, controls: ["menu"] },
    { name: "menu option padding", choices: paddings, format: "px", help: "Sets the distance between the edge of the menu option and the menu option text." + measureHelp, controls: ["menu"] },
    { name: "menu option indent", choices: paddings, format: "px", help: "Sets the distance between the left edge of the menu option and the menu option text." + measureHelp, controls: ["menu"] },
    { name: "option image", type: "image", help: "Defines the background image displayed under each menu option.", controls: ["menu"] },
    { name: "option hover image", type: "image", help: "Defines the background image displayed when the user hovers over a menu option.", controls: ["menu"] },
    { name: "onoptionclick", type: "js", help: "Initiates a client-side script when a menu option is clicked.  The choice value is passed to the event as a parameter named \"value\".  The choice text is passed to the event as a parameter named \"text\".", controls: ["menu"] },

    { name: "Database-Driven Auto-Complete", category: true, controls: ["textbox"] },
    { name: "Database-Driven Selection", category: true, controls: ["combo box", "select box"] },
    { name: "choices database file", type: "file", uppercase: true, help: "Database file to be used for a dynamic database-driven dropdown box, list box, or text field with autocomplete. Specify it in the format 'database file' or 'library/database file'.", controls: ["combo box", "select box", "textbox"] },
    { name: "choice options field", type: "field", multiple: true, uppercase: true, help: "Database field name used to retrieve the options for a dynamic dropdown box, list box, combo box, or text field with auto complete. Multiple fields can be specifed for a text field with auto complete. In this case, the field names should be comma separated.", controls: ["combo box", "select box", "textbox"] },
    { name: "choice values field", type: "field", uppercase: true, help: "Database field name used to retrieve the values sent back to the application.  If omitted, the choice options field is used. In the case of a text field with autocomplete that has multiple option fields, the first option field is used.", controls: ["combo box", "select box", "textbox"] },
    { name: "choices selection criteria", type: "long", help: "Optional expression identifying which records should be retrieved from the choices database file.", controls: ["combo box", "select box", "textbox"] },
    { name: "choices parameter value", bind: true, type: "long", hide: (pui["secLevel"] == 0) ? true : false, multOccur: true, help: "Value for parameter marker in \"choices selection criteria\" property. Parameter markers are specified using a question mark. Profound UI will accept values from the client for any parameter marker values which are not bound to program fields. Parameter markers are numbered in order of occurence, from left to right. To specify multiple parameter marker values, right-click the property and select Add Another Choices Parameter Value.", controls: ["combo box", "select box", "textbox"] },
    { name: "blank option", choices: ["true", "false"], help: "When set to true, a database-driven dropdown box will display a blank option before the options from the database file are displayed.", controls: ["combo box", "select box"] },
    { name: "blank option label", help: "By default, the blank option contains no text.  Use this property to specify alternate text to be displayed in the blank option.  The value sent to the server will still be blank.", controls: ["combo box", "select box"], translate: true },
    { name: "order by", type: "field", multiple: true, uppercase: true, help: "Optional expression identifying which fields determine the order of the choices.", controls: ["combo box", "select box", "grid"] },
    { name: "max choices", format: "number", help: "Optional maximum number of choices to provide for a dynamic dropdown box, list box, or text field with auto complete. If blank: defaults to 500 for dropdown, 10 for auto complete.", controls: ["combo box", "select box", "textbox"] },
    { name: "contains match", choices: ["true", "false"], help: "When set to true, the auto-complete query finds records that contain the search text.  When set to false, the auto-complete query finds records that start with the search text.  The default value is false.", controls: ["textbox"] },
    
    { name: "Dynamic Auto-Complete", category: true, controls: ["textbox"] },
    { name: "Dynamic Selection", category: true, controls: ["combo box", "select box"] },
    { name: "choices url", type: "long", help: "Sets the url to a Web service that returns the choice options and values in JSON format. If a choices url is used, the database file, choice options field, choice value field, and max choices properties are ignored.", controls: ["combo box", "select box", "textbox"] },
  
    { name: "Chart Settings", category: true, controls: ["chart"] },
    { name: "chart type", choices: pui.widgets.chartTypes, help: "Identifies the type of chart to display.  The chart type maps to a .swf flash file in the proddata/charts folder on the IFS.  If Flash is not available, HTML5 is used to render the chart.", controls: ["chart"] },
    { name: "chart options", help: "Specifies chart options as a set of XML attributes that are to be attached to the FusionCharts &lt;chart&gt; tag.  The format of the attributes is described on the FusionCharts documentation site <a href=\"http://docs.fusioncharts.com/charts\" target=\"_blank\">http://docs.fusioncharts.com/charts</a>.", controls: ["chart"] },
    { name: "chart overlay", choices: ["true", "false"], help: "When set to true, the Chart panel will overlay any other content on the screen, regardless of z-index settings. When set to false, the Chart panel will behave according to normal layering rules, based on z-index. The default value is false.", controls: ["chart"] },  
    { name: "onchartclick", type: "js", help: "Initiates a client-side script when a chart section is clicked.  The name of the chart section is passed to the event as a parameter named \"name\".", controls: ["chart"] },


    { name: "Chart Data" + ((context == "genie") ? " from Screen" : ""), category: true, controls: ["chart"] },
    { name: "names", type: "list", help: "Specifies a list of names representing the data points on the chart or a list of screen element id's from which the names could be retrieved.  The list should be comma separated.", controls: ["chart"], translate: true },
    { name: "values", type: "list", help: "Specifies a list of numerical values used to build the chart or a list of screen element id's from which the values could be retrieved. The list should be comma separated.", controls: ["chart"] },

    { name: "Database-Driven Chart", category: true, controls: ["chart"] },
    { name: "database file", type: "file", uppercase: true, help: "Database file to use for the chart's data source. Specify it in the format 'database file' or 'library/database file'.", controls: ["chart"] },
    { name: "name field", type: "field", uppercase: true, help: "Database field that determines the names by which records would be represented in the chart.", controls: ["chart"] },
    { name: "value field", type: "field", uppercase: true, help: "Database field that determines the numerical values from which the chart is to be built.", controls: ["chart"] },
    { name: "summary option", choices: ["none", "average", "count", "sum", "maximum", "minimum"], help: "Determines how values are used when creating the chart.", controls: ["chart"] },
    { name: "selection criteria", type: "long", help: "Optional expression identifying which records should be retrieved from the database file.", controls: ["chart"] },
    { name: "parameter value", bind: true, type: "long", hidden: (pui["secLevel"] == 0) ? true : false, multOccur: true, help: "Value for parameter marker in \"selection criteria\" property. Parameter markers are specified using a question mark. Profound UI will accept values from the client for any parameter marker values which are not bound to program fields. Parameter markers are numbered in order of occurence, from left to right. To specify multiple parameter marker values, right-click the property and select Add Another Parameter Value.", controls: ["chart"] },    
    { name: "record limit", format: "number", help: "Sets a limit on how many records are to be used in the chart.", controls: ["chart"] },

    { name: "Dynamic Chart", category: true, controls: ["chart"] },
    { name: "chart url", type: "long", help: "Sets the url to a web service that returns the chart definition and data in XML format as specified in the FusionCharts Data Formats section of the FusionCharts documentation site <a href=\"http://docs.fusioncharts.com/charts\" target=\"_blank\">http://docs.fusioncharts.com/charts</a>.", controls: ["chart"] },
    { name: "chart xml", type: "long", allowNewLines: true, help: "Sets the XML data for the chart as specified in the FusionCharts Data Formats section of the FusionCharts documentation site <a href=\"http://docs.fusioncharts.com/charts\" target=\"_blank\">http://docs.fusioncharts.com/charts</a>.", controls: ["chart"] },
    { name: "chart json", type: "long", allowNewLines: true, help: "Sets the JSON data for the chart as specified in the FusionCharts Data Formats section of the FusionCharts documentation site <a href=\"http://docs.fusioncharts.com/charts\" target=\"_blank\">http://docs.fusioncharts.com/charts</a>.  The data can be provided as a string or as a JavaScript object through the use of property scripting.", controls: ["chart"] },
    
    { name: "Background", category: true },
    { name: "background color", stylename: "backgroundColor", type: "color", help: "Defines the background color of the given element." + colorHelp, formattingProp: true },
    { name: "background image", type: "image", stylename: "backgroundImage", help: "Defines the background image of the current element.", formattingProp: true },
    { name: "background position", stylename: "backgroundPosition", choices: ["top", "center", "bottom", "left"],help: "Position of the background within the current element.", formattingProp: true },
    { name: "background repeat", stylename: "backgroundRepeat", choices: ["repeat-x", "repeat-y", "no-repeat", "repeat"],help: "Defines how to repeat the background, repeat-x: repeats horizontally, repeat-y: repeats vertically, no-repeat: doesn't repeat at all, repeat: repeats horizontally and vertically.", formattingProp: true },

    { name: "Position", category: true },
    { name: "left", stylename: "left", format: "px", help: "Represents the x-coordinate of the current element. Specify in pixels" + ((context == "genie") ? "." : " or as a percentage.") },
    { name: "top", stylename: "top", format: "px", help: "Represents the y-coordinate of the current element. Specify in pixels" + ((context == "genie") ? "." : " or as a percentage.") },
    { name: "right", stylename: "right", format: "px", help: "Position of the element from the right of the screen" + ((context == "genie") ? "." : " or layout container.") + " Specify in pixels" + ((context == "genie") ? "." : " or as a percentage.") },
    { name: "bottom", stylename: "bottom", format: "px", help: "Position of the element from the bottom of the screen" + ((context == "genie") ? "." : " or layout container.") + " Specify in pixels" + ((context == "genie") ? "." : " or as a percentage.")},
    { name: "height", stylename: "height", format: "px", help: "Height of the current element. Specify in pixels" + ((context == "genie") ? "." : " or as a percentage.") },
    { name: "width", stylename: "width", format: "px", help: "Width of the current element. Specify in pixels" + ((context == "genie") ? "." : " or as a percentage.") },
    { name: "min height", stylename: "minHeight", format: "px", help: "Minimum height of the current element." + measureHelp },
    { name: "min width", stylename: "minWidth", format: "px", help: "Minimum width of the current element." + measureHelp },
    { name: "max height", stylename: "maxHeight", format: "px", help: "Maximum height of the current element." + measureHelp },
    { name: "max width", stylename: "maxWidth", format: "px", help: "Maximum width of the current element." + measureHelp },
    { name: "z index", stylename: "zIndex", format: "number", help: "The stacking order of the current element, expressed as an integer value. The element with the higher z index will overlay lesser elements." },
    { name: "auto arrange", choices: ["true", "false"], help: "This property is used to automatically position action buttons or links in order to accommodate for converted overlay screens.", controls: ["button", "styled button", "graphic button", "hyperlink", "css button"], context: "dspf" },
    { name: "locked in place", choices: ["true", "false"], help: "If set to true, the element cannot be moved or sized.", bind: false },

    { name: "Drag and Drop", category: true, controls: ["html container", "output field", "image"], context: "dspf" },
    { name: "allow drag", choices: ["true", "false"], type: "boolean", help: "This property determines if the element can be drag and dropped.", controls: ["html container", "output field", "image"], context: "dspf" },
    { name: "use proxy", choices: ["true", "false"], type: "boolean", help: "This property determines if a drag and drop proxy is created.  If set to true, instead of dragging the element around, a proxy element is created and moved instead.", controls: ["html container", "output field", "image"], context: "dspf" },
    { name: "ondragstart", type: "js", help: "Initiates a client-side script when the user first starts to drag the element.  Information about the drag and drop operation is provided using the global pui.dragDropInfo object.", controls: ["html container", "output field", "image"], context: "dspf" },
    { name: "drop targets", type: "list", help: "Specifies a list of target element id's, which indentify where this element can be dropped.", controls: ["html container", "output field", "image"], context: "dspf" },
    { name: "ondragenter", type: "js", help: "Initiates a client-side script when the user drags an element over a valid drop target.  Information about the drag and drop operation is provided using the global pui.dragDropInfo object.", controls: ["html container", "output field", "image"], context: "dspf" },
    { name: "ondragleave", type: "js", help: "Initiates a client-side script when the user moves an element out of a valid drop target during a drag operation.  Information about the drag and drop operation is provided using the global pui.dragDropInfo object.", controls: ["html container", "output field", "image"], context: "dspf" },
    { name: "ondrop", type: "js", help: "Initiates a client-side script when the mouse is released during a drag and drop operation.  Information about the drag and drop operation is provided using the global pui.dragDropInfo object.", controls: ["html container", "output field", "image"], context: "dspf" },

    { name: "Tabs", category: true },
    { name: "tab panel style", choices: pui.widgets.getTabStyles, help: "Identifies the look and feel of the tab panel.", controls: ["tab panel"] },
    { name: "tab names", type: "list", help: "This property identifies a comma separated list of tab names for a Tab Panel.", controls: ["tab panel"], translate: true },
    { name: "active tab", format: "number", help: "This property specifies the initial active tab on a Tab Panel. Each tab within a Tab Panel is identified by a sequential index, starting with 0 for the first tab, 1 for the second tab, and so on.  The default value for the active tab index is 0.", controls: ["tab panel"] },
    { name: "ontabclick", type: "js", help: "Initiates a client-side script when a tab is clicked.  The tab index is passed to the event as a parameter named \"tab\".  If the client-side script evaluates to false, the tab will not be switched.", controls: ["tab panel"] },
    { name: "tab keys", type: "list", help: "This property identifies a comma separated list of function keys assigned to each tab within a Tab Panel.  The function keys in the list are automatically pressed when the appropriate tab is selected, allowing users to navigate the original application through a tab interface.", controls: ["tab panel"], context: "genie" },
    { name: "parent tab panel", help: "This property specifies the id of the Tab Panel to which this element belongs.  The property is set automatically when you drag and drop the element onto a Tab Panel.", bind: false },
    { name: "parent tab", help: "This property specifies the tab index of the specific tab to which this element belongs.  Each tab within a Tab Panel is identified by a sequential index, starting with 0 for the first tab, 1 for the second tab, and so on.  The property is set automatically when you drag and drop the element onto a Tab Panel.", bind: false },
    { name: "parent field set", help: "This property specifies the id of the Field Set Panel to which this element belongs.  The property is set automatically when you drag and drop the element onto a Field Set Panel.", bind: false },
    
    { name: "File Upload", category: true, controls: ["file upload"]},
    { name: "selection mode", controls: ["file upload"], bind: false, choices: ["standard", "enhanced"], help: "When set to \"enhanced\" the file upload control will allow for selection of multiple files at once from the browser's file selector. This is accomplished by SHIFT+Click or CNTRL+Click or CNTRL+A. When \"standard\" mode is used, the user must select each file for upload one by one. The default mode is \"standard\".<br /><br /><strong>Note: </strong>Not all browsers support \"enhanced\" mode. For example, Internet Explorer does not. In such browsers, the control will work in \"standard\" mode regardless of this setting."},
    { name: "number of files", controls: ["file upload"], format: "number", hideFormatting: true, validDataTypes: ["zoned"], help: "This property specifies the maximum number of files that can be uploaded at one time."},    
    { name: "size limit", controls: ["file upload"], hideFormatting: true, validDataTypes: ["zoned"], help: "Specifies the size limit (in MB) for each file. The default value is 10."},
    { name: "target directory", controls: ["file upload"], defaultDataLength: 50, hideFormatting: true, validDataTypes: ["char"], help: "This property specifies the IFS directory where uploaded files will be saved."},
    { name: "rename to", controls: ["file upload"], defaultDataLength: 50, hideFormatting: true, validDataTypes: ["char"], help: "Specifies an alternate file name to be used when the uploaded file is saved.<br /><br />Note: This property is ignored when more than 1 file is uploaded."},
    { name: "overwrite files", controls: ["file upload"], choices: ["true", "false"], type: "boolean", hideFormatting: true, validDataTypes: ["indicator", "expression"], help: "Specifies the action to take when 1 or more files being saved already exists in the IFS target directory. When set to \"true\", the existing file(s) will be overwritten. When set to \"false\" an error will be returned and no files will be overwritten. The default setting is \"false\"."},
    { name: "allowed type", controls: ["file upload"], multOccur: true, choices: ["text/plain", "application/vnd.ms-word", "application/vnd.ms-excel", "application/pdf", "image/gif", "image/jpg", "image/png", "Other..."], hideFormatting: true, validDataTypes: ["char"], help: "Specifies a MIME file type (as reported by the web browser) which is allowed to be uploaded. If not set, any file type will be allowed.<br /><br />To specify multiple types, right-click the property and select Add Another Allowed Type."},
    { name: "onupload", type: "js", help: "Initiates a client-side script when files are uploaded.", controls: ["file upload"], context: "genie" },
    
    { name: "Borders", category: true },
    { name: "border radius", stylename: "borderRadius", format: "px", choices: ["1px", "2px", "3px", "4px", "5px", "6px", "7px", "8px", "9px", "10px","11px", "12px", "13px", "14px", "15px", "16px", "17px", "18px", "19px", "20px", "Other..."], help: "This property allow you to create rounded corners by specifying a border radius." },
    { name: "border bottom color", stylename: "borderBottomColor", type: "color", help: "The color of the element's bottom side of the border." + colorHelp },
    { name: "border bottom style", stylename: "borderBottomStyle", choices: borderStyles, help: "The style of the element's bottom side of the border." },
    { name: "border bottom width", format: "px", stylename: "borderBottomWidth", choices: borderWidths, help: "The thickness of the element's bottom side of the border." },
    { name: "border left color", stylename: "borderLeftColor", type: "color", help: "The color of the element's left side of the border." + colorHelp },
    { name: "border left style", stylename: "borderLeftStyle", choices: borderStyles, help: "The style of the element's left side of the border." },
    { name: "border left width", format: "px", stylename: "borderLeftWidth", choices: borderWidths, help: "The thickness of the element's left side of the border." },
    { name: "border right color", stylename: "borderRightColor", type: "color", help: "The color of the element's right bottom side of the border." + colorHelp },
    { name: "border right style", stylename: "borderRightStyle", choices: borderStyles, help: "The style of the element's right side of the border." },
    { name: "border right width", format: "px", stylename: "borderRightWidth", choices: borderWidths, help: "The thickness of the element's right side of the border." },
    { name: "border top color", stylename: "borderTopColor", type: "color", help: "The color of the element's top side of the border." + colorHelp },
    { name: "border top style", stylename: "borderTopStyle", choices: borderStyles, help: "The style of the element's top side of the border." },
    { name: "border top width", format: "px", stylename: "borderTopWidth", choices: borderWidths, help: "The thickness of the element's top side of the border." },
 
    { name: "Padding", category: true },    
    { name: "padding bottom", format: "px", stylename: "paddingBottom", choices: paddings, help: "Sets the distance between the bottom edge of the current element and the element's content." + measureHelp, formattingProp: true },
    { name: "padding left", format: "px", stylename: "paddingLeft", choices: paddings, help: "Sets the distance between the left edge of the current element and the element's content." + measureHelp, formattingProp: true },
    { name: "padding right", format: "px", stylename: "paddingRight", choices: paddings, help: "Sets the distance between the right edge of the current element and the element's content." + measureHelp, formattingProp: true },
    { name: "padding top", format: "px", stylename: "paddingTop", choices: paddings, help: "Sets the distance between the top edge of the current element and the element's content." + measureHelp, formattingProp: true },

    { name: "Classes", category: true, context: "dspf" },
    { name: "css class", multOccur: true, help: "Defines a custom cascading style sheet class to assign to the element.  To specify multiple classes, right-click the property and select Add Another CSS Class.", context: "dspf" },
    { name: "focus class", help: "Defines a custom cascading style sheet class for when the element receives focus.", context: "dspf", controls: ["combo box", "date field", "password field", "select box", "spinner", "text area", "textbox"] },
    { name: "display attribute field", readOnly: true, hideFormatting: true, validDataTypes: ["char"], defaultDataLength: 1, help: "This property identifies a field containing a display attribute hex value.  It represents the DSPATR keyword with a program to system field parameter.  The hex value is translated to the appropriate css class at run time.", context: "dspf", viewdesigner: false },
    
    { name: "Misc", category: true },    
    { name: "css class", attribute: "class", help: "Defines a custom cascading style sheet class to assign to the element.", context: "genie" },
    { name: "cursor", stylename: "cursor", choices: ["auto", "default", "crosshair", "pointer", "move", "e-resize", "ne-resize", "nw-resize", "n-resize", "se-resize", "sw-resize", "s-resize", "w-resize", "text", "wait", "help", "Other..."], help: "Determines how the mouse cursor should look when hovering over the element. <br><br><u>Valid options</u>: <span style='cursor:default;'>default</span>, <span style='cursor:crosshair;'>crosshair</span>, <span style='cursor:pointer;'>pointer</span>, <span style='cursor:move;'>move</span>, <span style='cursor:e-resize;'>e-resize</span>, <span style='cursor:ne-resize;'>ne-resize</span>, <span style='cursor:nw-resize;'>nw-resize</span>, <span style='cursor:n-resize;'>n-resize</span>, <span style='cursor:se-resize;'>se-resize</span>, <span style='cursor:sw-resize;'>sw-resize</span>, <span style='cursor:s-resize;'>s-resize</span>, <span style='cursor:w-resize;'>w-resize</span>, <span style='cursor:text;'>text</span>, <span style='cursor:wait;'>wait</span>, <span style='cursor:help;'>help</span>.<br><br>Hover over the options above to see the cursor.", formattingProp: true },
    { name: "overflow x", stylename: "overflowX", choices: ["visible", "hidden", "scroll", "auto"], help: "Determines whether a horizontal scrollbar should be displayed for this element." + overflowHelp, formattingProp: true },
    { name: "overflow y", stylename: "overflowY", choices: ["visible", "hidden", "scroll", "auto"], help: "Determines whether a vertical scrollbar should be displayed for this element." + overflowHelp, formattingProp: true },
    { name: "tab index", format: "number", attribute: "tabIndex", help: "Determines the tab order for input elements on the screen." + (context == "genie" ? " This property does not take effect unless the Prevent Auto Tab property is set to true under Screen Properties." : "") },
    { name: "tool tip", type: "long", allowNewLines: true, attribute: "title", translate: true, help: "Defines the text to appear in a tool tip when the user hovers the mouse over this element." },
    { name: "user defined data", multOccur: true, help: "Specifies user-defined general purpose data associated with the widget.  To provide multiple user defined data values, right-click the property and select Add Another User Defined Value." },
    { name: "visibility", format: "visible / hidden", stylename: "visibility", choices: ["hidden", "visible"], help: "Determines whether the element is visible or hidden.  Hidden elements appear dimmed out in design mode, and invisible at runtime." },
    
    { name: "Events", category: true },
    { name: "onblur", type: "js", help: "Initiates a client-side script when the element loses focus." },
    { name: "onchange", type: "js", help: "Initiates a client-side script when the element value is changed." },
    { name: "onclick", type: "js", help: "Initiates a client-side script when the element is clicked." },
    { name: "ondblclick", type: "js", help: "Initiates a client-side script when the element is double-clicked." },
    { name: "onfocus", type: "js", help: "Initiates a client-side script when the element receives focus." },
    { name: "onkeydown", type: "js", help: "Initiates a client-side script when a keyboard key is being pressed down on this element." },
    { name: "onkeypress", type: "js", help: "Initiates a client-side script when the user presses and releases a keyboard key on this element." },
    { name: "onkeyup", type: "js", help: "Initiates a client-side script when the user releases a keyboard key on this element." },
    { name: "onmousedown", type: "js", help: "Initiates a client-side script when the mouse is pressed down on this element." },
    { name: "onmousemove", type: "js", help: "Initiates a client-side script when the mouse is moving within this element." },
    { name: "onmouseout", type: "js", help: "Initiates a client-side script when the mouse is moved off this element." },
    { name: "onmouseover", type: "js", help: "Initiates a client-side script when the mouse is moved over this element." },
    { name: "onmouseup", type: "js", help: "Initiates a client-side script when the mouse button is released off this element." },
    { name: "onselect", controls: ["combo box", "textbox"], type: "js", help: "Initiates a client-side script when a selection is made from the selection list of an auto-complete textbox or a combo box. In the case of an auto-complete textbox, the selected record is passed to the function as a JSON object that has properties named after the selected fields." },
    { name: "onspin", controls: ["spinner"], type: "js", help: "Initiates a client-side script when the up or down arrow is clicked on a spinner element." }
  ];
  
  return cachedPropertiesModel;
}

// Provides list of global screen properties and their definitions
function getScreenPropertiesModel(designScreen) {
	
	if (context == "dspf") {
  	var model = [
    	{ name: "Identification", category: true },
    	{ name: "record format name", help: "Identifies the record format that is used to access this screen from server code.", maxLength: (pui.viewdesigner ? null : 10), bind: false, canBeRemoved: false },
    	{ name: "description", help: "Describes the record format.", bind: false },
    	{ name: "document title", help: "Specifies the document title to use when this screen is displayed.  Web browsers usually display the document title in a window's title bar when the window is open, and in the task bar when the window is minimized." },
    	
    	{ name: "External Files", category: true },
      { name: "external css", type: "cssfile", multOccur: true, help: "Identifies the location of an external cascading style sheet file to apply to this screen.  To specify multiple files, right-click the property and select Add Another External CSS." },
      { name: "external javascript", type: "jsfile", multOccur: true, help: "Identifies the location of an external JavaScript file to load on this screen.  To specify multiple files, right-click the property and select Add Another External JavaScript." },
    	
      { name: "Overlay", category: true },
    	{ name: "overlay", choices: ["true", "false"], type: "boolean", help: "Specifies that the screen you are defining should appear on the display without the entire display being cleared first.", hideFormatting: true, validDataTypes: ["indicator", "expression"], viewdesigner: false },
    	{ name: "overlay range", help: "Specifies a range of row numbers for this record format.  This can be used to emulate certain behaviors of legacy green-screens in converted applications.", bind: false, viewdesigner: false },
    	{ name: "design overlay formats", type: "list", help: "Specifies a list of additional record formats to render in the designer when this record format is selected.  This property is only used at design-time.  It is ignored at run-time.", bind: false },

    	{ name: "Behavior", category: true },
    	{ name: "disable enter key", choices: ["true", "false"], type: "boolean", help: "This property determines if pressing the Enter key will cause a response to be sent to the server.  If set to true and the Enter key is not used as a shortcut key, the response will not be sent.  Otherwise, the response is sent automatically." },
    	{ name: "initialize record", choices: ["true", "false"], type: "boolean", bind: false, help: "Specifies that if this record is not already on the display, it is to be written to the display before an input operation is sent from the program.  It represents the INZRCD keyword.", viewdesigner: false },
    	{ name: "protect", choices: ["true", "false"], type: "boolean", help: "Specifies that when this record is displayed, all input-capable fields already on the display become protected.  The read only property is set to true and the PR css class is applied.", hideFormatting: true, validDataTypes: ["indicator", "expression"] },
      { name: "erase formats", type: "eraseformats", readOnly: true, bind: false, help: "Identifies record formats to be erased when this record is written.", relatedProperties: ["erase format", "erase condition"], canBeRemoved: false, viewdesigner: false }, 
      { name: "erase format", label: "Record Format Name", maxLength: 10, uppercase: true, multOccur: true, hide: true, bind: false, help: "", viewdesigner: false }, 
      { name: "erase condition", label: "Erase Condition", validDataTypes: ["indicator", "expression"], hideFormatting: true, readOnly: true, multOccur: true, hide: true, format: "1 / 0", type: "boolean", help: "", viewdesigner: false },
    	{ name: "assume", choices: ["true", "false"], help: "Use this property to specify that the program is to assume that a record is already shown on the display when this file is opened.", bind: false, viewdesigner: false },
    	{ name: "clear line", choices: ["*END", "*NO", "*ALL", "Other..."], help: "Use this property to clear (delete) a specific number of lines before the record is displayed. It represents the CLRL keyword.", bind: false, viewdesigner: false },
    	{ name: "starting line", help: "This property identifies the starting line of the record format.  It is used in conjunction with \"clear line\" property to specify where the clearing of lines begins.  It represents the SLNO keyword.", bind: false, viewdesigner: false },
    	{ name: "put override", choices: ["true", "false"], type: "boolean", help: "Use this property to override data contents or attributes of specific fields within a record.  It represents the PUTOVR keyword.", hideFormatting: true, validDataTypes: ["indicator", "expression"], viewdesigner: false },
    	{ name: "override data", choices: ["true", "false"], type: "boolean", help: "Use this property to together with the \"put override\" property to override existing data contents already on the display.  It represents the OVRDTA keyword.", hideFormatting: true, validDataTypes: ["indicator", "expression"], viewdesigner: false },
    	{ name: "override attribute", choices: ["true", "false"], type: "boolean", help: "Use this property to together with the \"put override\" property to override existing attributes already on the display.  It represents the OVRATR keyword.", hideFormatting: true, validDataTypes: ["indicator", "expression"], viewdesigner: false },
    	{ name: "put retain", choices: ["true", "false"], type: "boolean", help: "You use this property with the \"overlay\" property to prevent the handler from deleting data that is already on the display when the application displays the record again. It represents the PUTRETAIN keyword.", hideFormatting: true, validDataTypes: ["indicator", "expression"], viewdesigner: false },
    	{ name: "return data", choices: ["true", "false"], type: "boolean", bind: false, help: "Specifies that when your program sends an input operation to this record format, the program is to return the same data that was returned on the previous input operation sent to this record format.  This property is ignored if the record format has not already been read.  It represents the RTNDTA keyword.", viewdesigner: false },

    	{ name: "Response", category: true },
    	{ name: "changed", format: "1 / 0", readOnly: true, hideFormatting: true, validDataTypes: ["indicator"], help: "Specifies a response indicator that is set on if data on any input element within the record format is modified." },
    	{ name: "set off", multOccur: true, format: "1 / 0", readOnly: true, hideFormatting: true, validDataTypes: ["indicator"], help: "Specifies response indicators that are to be set off.  To specify additional set off indicators, right-click the property and select Add Another Set Off.", viewdesigner: false },
    	{ name: "valid command key", format: "1 / 0", readOnly: true, hideFormatting: true, validDataTypes: ["indicator"], help: "Specifies a response indicator that is set on when a response that is not associated with the Enter shortcut key is sent to the server.", viewdesigner: false },
    	{ name: "back button", format: "1 / 0", readOnly: true, hideFormatting: true, validDataTypes: ["indicator"], help: "Specifies a response indicator that is set on when the user presses the browser's back button.  This feature will only work in browsers that support the HTML5 history.pushState() method." },
    	
    	{ name: "Messages", category: true },
      { name: "error messages", type: "errmessages", readOnly: true, bind: false, help: "Identifies error messages to be displayed in association with this element.", relatedProperties: ["error message", "error message id", "error message file", "error message library", "replacement data", "error condition", "error response", "error enhanced mode"], canBeRemoved: false}, 
      { name: "error message", label: "Message Text", multOccur: true, hide: true, help: ""}, 
      { name: "error message id", label: "Message Id", uppercase: true, maxLength: 7, multOccur: true, hide: true, help: ""}, 
      { name: "error message file", label: "Message File", maxLength: 10, uppercase: true, multOccur: true, hide: true, help: ""}, 
      { name: "error message library", label: "Library", maxLength: 10, uppercase: true, multOccur: true, hide: true, help: ""}, 
      { name: "replacement data", label: "Replacement Data", validDataTypes: ["char"], hideFormatting: true, readOnly: true, multOccur: true, hide: true, help: ""}, 
      { name: "error condition", label: "Error Condition", validDataTypes: ["indicator", "expression"], hideFormatting: true, readOnly: true, multOccur: true, hide: true, format: "1 / 0", type: "boolean", help: ""},
      { name: "error response", label: "Error Response", validDataTypes: ["indicator"], hideFormatting: true, readOnly: true, multOccur: true, hide: true, format: "1 / 0", type: "boolean", help: ""},
      { name: "error enhanced mode", label: "Enhanced Mode", checkbox: true, bind: false, multOccur: true, hide: true, help: "If checked, allows error messages to display without ERRMSG/ERRMSGID-type restrictions. Errors can display regardless of whether format is already on the screen, and output data is also sent." }, 

      { name: "Help", category: true, viewdesigner: false },
      { name: "help titles", type: "helptitles", readOnly: true, bind: false, help: "Identifies the help title for the help panel.  Multiple titles can be specified and conditioned using indicators.", relatedProperties: ["help title", "help title condition"], canBeRemoved: false, viewdesigner: false }, 
      { name: "help title", label: "Help Title", multOccur: true, bind: false, hide: true, help: "", viewdesigner: false }, 
      { name: "help title condition", label: "Condition", validDataTypes: ["indicator", "expression"], hideFormatting: true, readOnly: true, multOccur: true, hide: true, format: "1 / 0", type: "boolean", help: "", viewdesigner: false },

      { name: "help panels", type: "helppanels", readOnly: true, bind: false, help: "Identifies the help area and the specifc help record or help panel group to display when the help button is clicked.", relatedProperties: ["help record", "help display file", "help panel group", "help module", "help area", "help panel condition"], canBeRemoved: false, viewdesigner: false }, 
      { name: "help record", label: "Help Record", uppercase: true, maxLength: 10, multOccur: true, bind: false, hide: true, help: "", viewdesigner: false },
      { name: "help display file", label: "Help Display File", uppercase: true, maxLength: 21, multOccur: true, bind: false, hide: true, help: "", viewdesigner: false },  
      { name: "help panel group", label: "Help Panel Group", uppercase: true, maxLength: 21, multOccur: true, bind: false, hide: true, help: "", viewdesigner: false },  
      { name: "help module", label: "Help Module", uppercase: true, maxLength: 32, multOccur: true, bind: false, hide: true, help: "", viewdesigner: false },
      { name: "help area", label: "Help Area", multOccur: true, bind: false, hide: true, help: "", viewdesigner: false },
      { name: "help panel condition", label: "Condition", validDataTypes: ["indicator", "expression"], hideFormatting: true, readOnly: true, multOccur: true, hide: true, format: "1 / 0", type: "boolean", help: "", viewdesigner: false },
    	
    	{ name: "Window", category: true },
    	{ name: "show as window", choices: ["true", "false"], type: "boolean", help: "Determines whether this screen is shown as a pop-up window.", hideFormatting: true, validDataTypes: ["indicator", "expression"] },
      { name: "window left", format: "px", help: "Represents the x-coordinate of the window.  Can be expressed in pixels or columns." },
      { name: "window top", format: "px", help: "Represents the y-coordinate of the window.  Can be expressed in pixels or rows." },
    	{ name: "center window", choices: ["true", "false"], type: "boolean", help: "If set to true, the window will be centered within the boundaries of the previously rendered screen.", hideFormatting: true, validDataTypes: ["indicator", "expression"] },
    	{ name: "mask screen", choices: ["true", "false"], type: "boolean", help: "Determines if the screen is masked when a window is displayed.  Defaults to true.", hideFormatting: true, validDataTypes: ["indicator", "expression"] },
    	{ name: "remove windows", choices: ["true", "false"], type: "boolean", help: "Specify this property to remove all existing windows on the display before this window is displayed.", hideFormatting: true, validDataTypes: ["indicator", "expression"], viewdesigner: false },
    	{ name: "window reference", help: "Use this property to refer to a record format name where the window and its properties have been defined.", maxLength: 10, bind: false, viewdesigner: false },
    	
    	{ name: "Cursor Location", category: true },
      { name: "return cursor record", readOnly: true, hideFormatting: true, validDataTypes: ["char"], help: "This property can be bound to a character field, which will be used to receive the name of the record format on which the cursor is located." },
      { name: "return cursor field", readOnly: true, hideFormatting: true, validDataTypes: ["char"], help: "This property can be bound to a character field, which will be used to receive the name of the field on which the cursor is located." },
      { name: "return cursor position", readOnly: true, format: "number", hideFormatting: true, validDataTypes: ["zoned"], help: "This property can be bound to a numeric field, which will be used to reveive the relative position of the cursor within an element." },
      { name: "return cursor row", readOnly: true, format: "number", hideFormatting: true, validDataTypes: ["zoned"], help: "This property can be bound to a numeric field, which will contain the row on which the cursor is located.  The row number is based on the <i>cursor row</i> property assigned to the widgets on the screen.", viewdesigner: false },
      { name: "return cursor column", readOnly: true, format: "number", hideFormatting: true, validDataTypes: ["zoned"], help: "This property can be bound to a numeric field, which will contain the column on which the cursor is located.  The column number is based on the <i>cursor column</i> property assigned to the widgets on the screen.", viewdesigner: false },
      { name: "set cursor condition", readOnly: true, hideFormatting: true, validDataTypes: ["indicator", "expression"], format: "true / false", help: "This property can provide an indicator condition, which will be used to determine whether the <i>set cursor row</i> and <i>set cursor column</i> properties are used to set focus.", viewdesigner: false },
      { name: "set cursor row", format: "number", hideFormatting: true, validDataTypes: ["zoned"], help: "This property is used to set focus on a specific widget by identifying the widget's assigned cursor row and cursor column properties.", viewdesigner: false },
      { name: "set cursor column", format: "number", hideFormatting: true, validDataTypes: ["zoned"], help: "This property is used to set focus on a specific widget by identifying the widget's assigned cursor row and cursor column properties.", viewdesigner: false },
      { name: "no focus", choices: ["true", "false"], type: "boolean", help: "This property indicates that no field should receive focus when the screen first renders.", hideFormatting: true, validDataTypes: ["indicator", "expression"] },
    	
    	{ name: "Drag and Drop Response", category: true },
    	{ name: "dd element id", readOnly: true, hideFormatting: true, validDataTypes: ["char"], help: "This property can be bound to a character field, which will be used to retrieve the id of the element that is drag and dropped." },
    	{ name: "dd record number", readOnly: true, format: "number", hideFormatting: true, validDataTypes: ["zoned"], help: "This property can be bound to a numeric field, which will be used to retrieve the record number of the subfile row that is drag and dropped." },
    	{ name: "target element id", readOnly: true, hideFormatting: true, validDataTypes: ["char"], help: "This property can be bound to a character field, which will be used to retrieve the id of the target element in a drag and drop operation.  Use this property to determine where an element was dropped." },
    	{ name: "target record number", readOnly: true, format: "number", hideFormatting: true, validDataTypes: ["zoned"], help: "This property can be bound to a numeric field, which will be used to retrieve the record number of the target subfile row in a drag and drop operation.  Use this property to determine where within a subfile an element was dropped." },
    	{ name: "bypass validation", choices: ["true", "false", "send data"], type: "boolean", help: "This property specifies that a drag and drop operation will not trigger client-side validation and will automatically discard all data modified by the user on the screen.  You can select \"send data\" to bypass all client-side validation except for field data type validation and still send all data modified by the user.", hideFormatting: true, validDataTypes: ["indicator", "expression"] },

      { name: "Events", category: true },
      { name: "onload", type: "js", help: "Initiates a client-side script when the screen loads." },
      { name: "onsubmit", type: "js", help: "Initiates a client-side script or expression before a response is submitted to the screen.  This typically occurs when a button or a hyperlink is clicked.  If the expression evaluates to <i>false</i>, the response is not submitted." }
  	];
  	return model;	  
	}
	
  if (designScreen.isWindow == true) {
  	var model = [
    	{ name: "Identification", category: true },
    	{ name: "screen name", help: "The screen name is used to save the current screen to the server.  The screen is saved to a .scn file under the selected skin.  In addition to specifying a screen name, you will have to mark one or more fields as screen identifiers.", canBeRemoved: false },
      { name: "Events", category: true },
      { name: "onpageload", type: "js", help: "Initiates a client-side script when the page loads but before screen design customizations are applied." },
      { name: "onload", type: "js", help: "Initiates a client-side script when the screen loads." }
  	];
  	return model;
  }	
	
  var colorHelp = "<br><br><u>Usage</u>: Enter a color name or select a color.<br><br> <u>Valid colors by name</u> : <span style='color:aqua;'>aqua</span>, <span style='color:black;'>black</span>, <span style='color:blue;'>blue</span>, <span style='color:fuchsia;'>fuchsia</span>, <span style='color:gray;'>gray</span>, <span style='color:green;'>green</span>, <span style='color:lime;'>lime</span>, <span style='color:maroon;'>maroon</span>, <span style='color:navy;'>navy</span>, <span style='color:olive;'>olive</span>, <span style='color:purple;'>purple</span>, <span style='color:red;'>red</span>, <span style='color:silver;'>silver</span>, <span style='color:teal;'>teal</span>, <span style='color:white;background-color:black;'>white</span>, and <span style='color:yellow;background-color:black;'>yellow</span>. All other colors must be specified using a hex value (ex: <span style='color:#FF0000;'>#FF0000</span>)."
  var model = [
    { name: "Identification", category: true },
    { name: "screen name", help: "The screen name is used to save the current screen to the server.  The screen is saved to a .scn file under the selected skin.  In addition to specifying a screen name, you will have to mark one or more fields as screen identifiers.", canBeRemoved: false },    

    { name: "Subfile Options", category: true },
    { name: "detect subfile", variable: "pui.genie.config.detectSubfile", choices: ["true", "false"], type: "boolean", help: "This flag determines whether Genie should look for a subfile on the current screen.  The default value for this property is true." },
    { name: "detect subfile patterns", variable: "pui.genie.config.detectSubfilePatterns", choices: ["true", "false"], type: "boolean", help: "This flag tells Genie to look for a subfile by detecting a pattern of rows that are formatted in the same way.  When a subfile is detected using this method, a grid widget is created over it.  If the flag is not set to true, Genie looks for Option Headings, instead, in order to detect the subfile." },
    { name: "find option column", variable: "pui.genie.config.findOptionColumn", choices: ["true", "false"], type: "boolean", help: "When \"detect subfile patterns\" is selected, this flag is used to prevent false positives by only creating grids on subfiles where an Option Column exists." },
    { name: "option headings", type: "list", variable: "pui.genie.config.optionHeadings", help: "Specifies a comma separated list of headings to look for to identify a subfile option column.  This method of detecting subfiles is used only when the \"detect subfile patterns\" option is not selected." },
    { name: "subfile start", variable: "pui.genie.config.subfileStartLine", choices: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27], help: "Subfile start and subfile end properties specify the row numbers where the screen's subfile starts and ends.  This explicitly overrides all subfile detection." },
    { name: "subfile end", variable: "pui.genie.config.subfileEndLine", choices: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27], help: "Subfile start and subfile end properties specify the row numbers where the screen's subfile starts and ends.  This explicitly overrides all subfile detection." },
    { name: "outline subfile", variable: "pui.genie.config.outlineSubfile", choices: ["true", "false"], type: "boolean", help: "If a subfile is found using the Option Headings method, this flag determines whether an outline is drawn around the subfile area." },
    { name: "subfile outline color", variable: "pui.genie.config.subfileOutlineColor", type: "color", help: "Sets the outline color when the \"outline subfile\" option is used. This can be give either as a CSS color name, such as \"red\", or as a hex code, such as \"#FF0000\". The default color is \"yellow\"." },
    { name: "separate subfile lines", variable: "pui.genie.config.separateSubfileLines", choices: ["true", "false"], type: "boolean", help: "If a subfile is found using the Option Headings method, this flag determines whether a separator line is drawn between each subfile line." },
    { name: "hide subfile options", variable: "pui.genie.config.hideSubfileOpt", choices: ["true", "false"], type: "boolean", help: "If a subfile is found using the Option Headings method, this flag tells Genie to find and hide an option input box on each subfile line.  Instead of using the input box, the user will be able to right-click the subfile to select the appropriate option." },
    { name: "row highlight color", variable: "pui.genie.config.hiColor", type: "color", help: "Defines the color of the row when it is hovered over with the mouse." + colorHelp },
    { name: "row highlight font color", variable: "pui.genie.config.hiFontColor", type: "color", help: "Defines the color of the text within the row when the row is hovered over with the mouse." + colorHelp },
    { name: "striped subfile", variable: "pui.genie.config.stripedSubfile", choices: ["true", "false"], type: "boolean", help: "This flag determines if the subfile rows are striped with alternate colors." },
    { name: "odd row color", variable: "pui.genie.config.oddRowColor", type: "color", help: "The color of the odd rows in a striped subfile." + colorHelp },
    { name: "even row color", variable: "pui.genie.config.evenRowColor", type: "color", help: "The color of the even rows in a striped subfile." + colorHelp },

    { name: "Misc", category: true }, 
    { name: "alert errors", variable: "pui.genie.config.alertErrors", choices: ["true", "false"], type: "boolean", help: "When set to true, Genie presents green-screen errors in an alert box.  When set to false, errors are displayed at the bottom of the screen only." },    
    { name: "detect menus", variable: "pui.genie.config.detectMenus", choices: ["true", "false"], type: "boolean", help: "When set to true, Genie looks for menu panels on this screen and and transforms the menu options into hyperlinks. The default value is true." },    
    { name: "detect date fields", variable: "pui.genie.config.detectDateFields", choices: ["true", "false"], type: "boolean", help: "When set to true, Genie looks for date fields on this screen and automatically attaches a calendar control to any field that it finds." },    
    { name: "default date format", variable: "pui.genie.config.defaultDateFormat", choices: ["MM/DD/YY", "MM/DD/YYYY", "DD/MM/YY", "DD/MM/YYYY", "DD.MM.YY", "DD.MM.YYYY", "MMDDYY", "MMDDYYYY", "DDMMYY", "DDMMYYYY", "YYMMDD", "YYYYMMDD", "YYYY-MM-DD"], help: "Defines the default date format to be used in calendar controls." },
    { name: "enlarge headings", variable: "pui.genie.config.enlargeHeadings", choices: ["true", "false"], type: "boolean", help: "When set to true, Genie looks for the screen heading and automatically increases its font size and adds a shadow." },
    { name: "function key buttons", variable: "pui.genie.config.functionKeyButtons", choices: ["true", "false"], type: "boolean", help: "This flag determines whether function key labels, such as 'F3=Exit', are transformed into buttons." },
    { name: "hide function key names", variable: "pui.genie.config.hideFKeyNames", choices: ["true", "false"], type: "boolean", help: "This flag looks for function key labels and removes the function key name.  For example, 'F3=Exit' becomes 'Exit'.  The user will be able to click on the field to send the appropriate function key to the server." },
    { name: "overtype mode", variable: "pui.genie.config.overtypeMode", choices: ["true", "false"], type: "boolean", help: "Determines if the default keyboard cursor mode is overtype or insert.  In overtype mode, the characters you type replace existing characters one by one.  In insert mode, the characters you type move existing text to the right.  The default value is true." },
    { name: "highlight on focus", variable: "pui.genie.config.highlightOnFocus", choices: ["true", "false"], type: "boolean", help: "Highlights text in input fields when focus is received.  The default value is false." },
    { name: "prevent auto tab", variable: "pui.genie.config.preventAutoTab", choices: ["true", "false"], type: "boolean", help: "If set to false, Genie overrides the browser's default behavior of the Tab key with its own automatic tabbing.  If set to true, the browser's default behavior is used for tabbing.  The default value is false." },
    { name: "set field background color", variable: "pui.genie.config.setFieldBackground", choices: ["true", "false"], type: "boolean", help: "If set to true, Genie will set the background color of all fields to the match the main screen background color, preventing any underlying items from showing through. If set to false, all fields will be given a transparent background, allowing any underlying items to show through. The default value is false." },
    { name: "use fixed font", variable: "pui.genie.config.useFixedFont", choices: ["true", "false"], type: "boolean", help: "If set to true, Genie will set the font for this screen to Monospace. If set to false, Genie will use the font specified in the style sheet for this skin. The default value is false." },

    { name: "Events", category: true },
    { name: "onpageload", type: "js", help: "Initiates a client-side script when the page loads but before screen design customizations are applied." },
    { name: "onload", type: "js", help: "Initiates a client-side script when the screen loads including all screen design customizations." },
    { name: "onsubmit", type: "js", help: "Initiates a client-side script or expression before a response is submitted to the screen.  This typically occurs when a function key is pressed or a button/hyperlink is clicked.  If the expression evaluates to <i>false</i>, the response is not submitted." },
    { name: "subfile row onclick", type: "js", help: "Initiates a client-side script when a subfile row is clicked.  The JavaScript variable hiLine reports the line that is currently highlighted.  This event only fires when the \"detect subfile patterns\" option is not selected." },
    { name: "subfile row ondblclick", type: "js", help: "Initiates a client-side script when a subfile row is double-clicked.  The JavaScript variable hiLine reports the line that is currently highlighted.  This event only fires when the \"detect subfile patterns\" option is not selected." }
  ];
  
  return model;  
}


// Turn a model from an array to an object that you can access by property name
function makeNamedModel(model) {
  var namedModel = {};
  for (var i = 0; i < model.length; i++) {
    namedModel[model[i].name] = model[i];
  }
  return namedModel;
}



function getPropertiesNamedModel() {
  if (cachedPropertiesNamedModel != null) return cachedPropertiesNamedModel;
  cachedPropertiesNamedModel = makeNamedModel(getPropertiesModel());
  return cachedPropertiesNamedModel;
}


// API used to apply property values in customization scripts
function applyDesignProperty(domObj, propertyName, propertyValue) {

  // Accept either DOM object or id.
  if (typeof(domObj) == "string") domObj = getObj(domObj);
  
  if (domObj == null) return null;
  
  if (propertyName == "shortcut key") pui.assignShortcutKey(propertyValue, domObj);
  
  var nmodel;
  if (domObj.propertiesNamedModel == null) nmodel = getPropertiesNamedModel();
  else nmodel = domObj.propertiesNamedModel;
  var propConfig = nmodel[propertyName];
  if (propConfig != null) {
    if (domObj["pui"] == null || domObj["pui"]["properties"] == null) {      
      var value = "";
      var fieldType = "output field"
      if (domObj.tagName == "DIV") {
        value = getInnerText(domObj);
      }
      if (domObj.tagName == "INPUT") {
        value = domObj.value;
        fieldType = "textbox";
        if (domObj.type == "button" || domObj.type == "submit") fieldType = "button";
      }
      if (propertyName == "field type") fieldType = propertyValue;
      if (domObj["pui"] == null) domObj["pui"] = {};
      domObj["pui"]["properties"] = { 
        "field type": fieldType,
        "value": value 
      };
    }    
    domObj["pui"]["properties"][propertyName] = propertyValue;
    var returnObj = applyPropertyToField(propConfig, domObj["pui"]["properties"], domObj, propertyValue, false);
    return returnObj;
  }
}

// Applies property value to field in design mode or at run-time
function applyPropertyToField(propConfig, properties, domObj, newValue, isDesignMode, designItem, resizer, subfileRow) {

  if (newValue == "Other..." && isDesignMode && propConfig.name != "value") return domObj;
  
  var dom = domObj;

  // Calculate Effective Value, set changed flag
  var originalValue;
  if (isDesignMode) {
    originalValue = designItem.originalValue;
    designItem.changed = true;
  }
  else {
    if (properties.originalValue != null) {
      originalValue = properties.originalValue;
    }
    else {
      if (domObj.tagName == "DIV") {
        if (domObj.comboBoxWidget != null) originalValue = domObj.comboBoxWidget.getValue();
        else if (domObj.slider != null) originalValue = domObj.slider.value;
        else originalValue = getInnerText(domObj);
      }
      else {
        originalValue = domObj.value;
      }
      properties.originalValue = originalValue;
    }
  }
  var effectiveValue = evalPropertyValue(newValue, originalValue, domObj);  
  var propConfigName = propConfig.name;

  // Process change in field type
  var widget;
  var newDomObj;
  if (propConfigName == "field type") {
    widget = pui.widgets[effectiveValue];
    if (widget == null) return dom;
    var tag = widget.tag;
    var inpType = widget.inputType;

    switch(effectiveValue) {
      case "button":
        // when switching an element to be a button, enforce default cursor
        if (isDesignMode) {
          if (!pui.isBound(designItem.properties["cursor"])) {
            designItem.properties["cursor"] = "default";
            designItem.propertiesChanged["cursor"] = true;
          }
        }
        break;
      case "select box":
        // protected field will not be turned into a select box
        if (!isDesignMode && domObj.readOnly && domObj.tagName == "INPUT") {
          tag = "input";
          inpType = domObj.type;
        }
        if (isDesignMode && pui["is_old_ie"] && pui["ie_mode"] == 6 && 
            (String(designItem.properties["select box height"]) == "" || 
             String(designItem.properties["select box height"]) == "1" || 
             String(designItem.properties["select box height"]) == "undefined")) {
          tag = "input";
          inpType = "text";
        }
        break;
    }
    
    var rebuildCSSAttr = false;
    var reassigModifiedEvents = false;
    
    // Rebuild the object if tag is different, or if the input tag type is changing.
    var mismatch = (domObj.tagName.toLowerCase() != tag);
    if (!mismatch && domObj.tagName.toLowerCase() == "input") {
      if (domObj.type != inpType) {
        mismatch = true;
        if (domObj.type == "number" && inpType == "text") mismatch = false;
      }
    }
    //if (domObj.tagName.toLowerCase() != tag || (domObj.tagName.toLowerCase() == "input" && domObj.type != inpType)) {
    if (mismatch) {
      rebuildCSSAttr = true;   
      newDomObj = document.createElement(tag);
      if (tag == "input" || (!pui["is_old_ie"] && tag == "button")) newDomObj.type = inpType;
      if (domObj.parentNode != null) domObj.parentNode.replaceChild(newDomObj, domObj);
      newDomObj.style.left = domObj.style.left;
      newDomObj.style.top = domObj.style.top;
      newDomObj.style.width = domObj.style.width;
      newDomObj.style.height = domObj.style.height;
      newDomObj.style.position = domObj.style.position;
      newDomObj.style.cursor = domObj.style.cursor;
      newDomObj.style.visibility = domObj.style.visibility;
      newDomObj.id = domObj.id;
      newDomObj.name = domObj.name;
      if (context == "dspf") {
        if (domObj.cursorRecord != null) newDomObj.cursorRecord = domObj.cursorRecord;
        if (domObj.cursorField != null) newDomObj.cursorField = domObj.cursorField;
      }
      if (context == "genie") {
        newDomObj.fieldInfo = domObj.fieldInfo;
        if (pui.genie.focusField == domObj) pui.genie.focusField = newDomObj;
        reassigModifiedEvents = true;
      }
      // Carry over "hide" class, if present.
      if (domObj.className.indexOf("hide") != -1) {
        newDomObj.className = "hide";
        if (isDesignMode) {
          newDomObj.style.visibility = "visible";
          newDomObj.style.filter = "alpha(opacity=30)";
          newDomObj.style.opacity = 0.30;
        }        
      }
      // Carry over maxlength attribute, if present.
      if (domObj.getAttribute("maxlength") != null) {
        newDomObj.setAttribute("maxlength", domObj.getAttribute("maxlength"));
      }
      // Carry over disabled attribute
      newDomObj.disabled = domObj.disabled;
      // Carry over tab panel related fields
      if (domObj.parentTabPanel != null) newDomObj.parentTabPanel = domObj.parentTabPanel;
      if (domObj.parentTab != null) newDomObj.parentTab = domObj.parentTab;
      
      // Carry over bound SQL property flag.
      if (domObj.hasBoundSQLProps) newDomObj.hasBoundSQLProps = true;
      
      if (context == "genie") {
        attachInputEvents(newDomObj);
      }
      if (isDesignMode) {
        designItem.dom = newDomObj;
        if (resizer != null) resizer.attachTo(designItem);
        designItem.designer.attachMouseDownEvent(newDomObj, designItem);
      }
      if (domObj.readOnly) {
        if (tag == "input") {
          if (newDomObj.type == "checkbox" || newDomObj.type == "radio") {
            if (context == "genie") {
              addEvent(newDomObj, "click", disableInputControl);
            }
          }
        }
        else if (tag == "textarea") {
          newDomObj.readOnly = true;
        }
      } 
    }
    else {
      newDomObj = domObj;
      if (tag == "div" && effectiveValue != "tab panel") newDomObj.tabPanel = null;  // in case element used to be a tab panel, deactivate all tab panel functionality
      if (isDesignMode || effectiveValue == "chart" || effectiveValue == "radio button") rebuildCSSAttr = true;
    }
    
    // set all css and attribute properties
    if (rebuildCSSAttr) {
      var model = getPropertiesModel();
      for (var i = 0; i < model.length; i++) {
        var propName = model[i].name;
        var propValue = properties[propName];
        if (propValue != null && propValue != "") {
          var isStyleProp = (model[i].stylename != null);
          if (propName == "overflow x" || propName == "overflow y") {
            if (properties["field type"] == "layout") isStyleProp = false;
          }
          if (isStyleProp) {
            if (model[i].stylename == "visibility" && isDesignMode) {
              if (propValue == "hidden") {
                newDomObj.style.filter = "alpha(opacity=30)";
                newDomObj.style.opacity = 0.30;
              }
              else {
                newDomObj.style.filter = "";
                newDomObj.style.opacity = "";
              }
            }
            else {
              try { newDomObj.style[model[i].stylename] = pui.getPosDimString(model[i].stylename, propValue) }
              catch (e) {}
            }
          }
          if (model[i].attribute != null) {
            if (model[i].type == "boolean" && propValue == "true") propValue = true;
            if (model[i].type == "boolean" && propValue == "false") propValue = false;
            if (model[i].attribute == "disabled" && isDesignMode) propValue = false; 
            //try { newDomObj[model[i].attribute] = propValue }
            try { 
              if (propValue == false) {
                if (newDomObj.getAttribute(model[i].attribute) != null) {
                  newDomObj.removeAttribute(model[i].attribute);
                }
              }
              else {
                var valueToAssign = evalPropertyValue(propValue, originalValue, newDomObj);
                if (model[i].attribute == "src") valueToAssign = pui.normalizeURL(valueToAssign, true);
                newDomObj.setAttribute(model[i].attribute, valueToAssign);
                if (model[i].attribute == "class") {
                  newDomObj.className = propValue;
                }
              }
            }
            catch (e) {  }         
          }
        }
      }
    }
    if (context == "dspf") {
      var classes = [];
      classes.push(properties["css class"]);
      var clsNum = 2;
      var cls = properties["css class " + clsNum];
      while (cls != null) {
        classes.push(cls);
        clsNum++;
        cls = properties["css class " + clsNum];
      }
      var attr = properties["display attribute field"];
      var dspAtrField = false;
      if (attr != null && !pui.isBound(attr) && attr != "" && attr != " ") {
        classes = classes.concat(pui.attrToCSS(attr));
        dspAtrField = true;
      }
      assignDomClasses(newDomObj, classes, dspAtrField);
    }
    dom = newDomObj;
    if (!widget.resizable) {
      dom.style.width = "";
      dom.style.height = "";
    }
  }
  else {
    widget = pui.widgets[properties["field type"]];
    if (widget == null) return dom;
  }

  // make properties accessible by custom JavaScript at runtime
  if (dom["pui"] == null) dom["pui"] = {};
  if (dom["pui"]["properties"] == null) dom["pui"]["properties"] = {};
  dom["pui"]["properties"][propConfigName] = effectiveValue;

  if (propConfigName == "value" && newValue != "script: value" && !isDesignMode && context == "genie" && dom.fieldInfo != null && dom.fieldInfo["idx"] != null) {
    if (!(dom.tagName == "INPUT" && dom.type == "radio" && dom.checked != true)) {
      pui.response[dom.fieldInfo["idx"]] = dom;
    }
  }

  if (isDesignMode && propConfigName == "screen identifier" && context == "genie") {
    var borderColor = "red";
    if (newValue == "true" || newValue == true) borderColor = "red";
    else borderColor = "#cccccc";
    if (dom.style.borderLeftStyle == "dotted") dom.style.borderLeftColor = borderColor;
    if (dom.style.borderRightStyle == "dotted") dom.style.borderRightColor = borderColor;
    if (dom.style.borderTopStyle == "dotted") dom.style.borderTopColor = borderColor;
    if (dom.style.borderBottomStyle == "dotted") dom.style.borderBottomColor = borderColor;	    
  }


  // Execute widget's property setter methods
  var globalSetter = widget.globalPropertySetter;
  var setters = widget.propertySetters;
  var setter = null;
  if (setters != null) {
    setter = setters[propConfigName];
  }
  var setterParms;
  if (setter != null || globalSetter != null) {
    setterParms = {
      newValue: newValue,
      value: effectiveValue,
      design: isDesignMode,
      properties: properties,
      originalValue: originalValue,
      dom: dom,
      oldDom: domObj,
      propertyName: propConfigName,
      designItem: designItem,
      resizer: resizer,
      evalProperty: function(propName) {
        return evalPropertyValue(this.properties[propName], this.originalValue, this.dom);
      }
    };
  }
  if (globalSetter != null) {
    if (globalSetter(setterParms) == false) return;
  }
  if (setter != null) {
    if (setter(setterParms) == false) return;
  }

  if (reassigModifiedEvents) {
    if (newDomObj.comboBoxWidget != null) {
      var box = newDomObj.comboBoxWidget.getBox();
      pui.assignModifiedEvents(box);
      box.fieldInfo = newDomObj.fieldInfo;
      attachInputEvents(box);
      newDomObj.comboBoxWidget.setMaxLength(domObj.maxLength);
    }
    else {    
      pui.assignModifiedEvents(newDomObj);
    }
  }


  // Process change to id
  if (propConfigName == "id" && isDesignMode) {  
    var designer = designItem.designer;
    var selection = designer.selection;
    
    if (designItem.dom.id != newValue && document.getElementById(newValue) != null) {
      if (!(pui["is_old_ie"] && designItem.dom.id.toUpperCase() == newValue.toUpperCase())) {  // IE has a bug -- getElementById is case insensitive
        pui.alert('The ID "' + newValue + '" is already in use.')
        designer.propWindow.refresh();
        return dom;
      }
    }
    
    // Update screen properties object for new items when id changes to prevent 
    // double-saving of the item.
    for (var i = 0; i < selection.resizers.length; i++) {
      if (designItem.properties.newitem == "true") {
        if (screenPropertiesObj[designer.currentScreen.screenId] && screenPropertiesObj[designer.currentScreen.screenId].items) {
          var items = screenPropertiesObj[designer.currentScreen.screenId].items;
          for (var j = 0; j < items.length; j++) {
            if (items[j].id == designItem.properties.id) {
              items[j].id = newValue;
            }
          }
        }  
      }
    }
    
    if (selection.resizers.length == 1) {
      designer.propWindow.setHeader("Properties - " + effectiveValue);
    }    
  }
  

  // Process change in Parent Tab Panel or Parent Tab
  if (propConfigName == "parent tab panel" && (isDesignMode || properties["visibility"] != "hidden")) {
    domObj.parentTabPanel = effectiveValue;
  }
  if (propConfigName == "parent tab") {
    domObj.parentTab = effectiveValue;
  }
  
  // Set up empty text
  if (propConfigName == "empty text" && !isDesignMode) {
    pui.setEmptyText(domObj, effectiveValue);
  }


  var js = null;
  if (String(newValue).substr(0, 3).toLowerCase() == "js:") {
    js = newValue.substr(3);
  }
  if (String(newValue).substr(0, 11).toLowerCase() == "javascript:") {
    js = newValue.substr(11);
  }
  if (String(newValue).substr(0, 7).toLowerCase() == "script:") {
    js = newValue.substr(7);
  }
  
  // Process stylesheet property change
  if (propConfig.stylename != null) {
    if (propConfig.stylename == "visibility" && isDesignMode) {
      if (effectiveValue == "hidden") {
        domObj.style.filter = "alpha(opacity=30)";
        domObj.style.opacity = 0.30;
      }
      else {
        domObj.style.filter = "";
        domObj.style.opacity = "";
        domObj.style.visibility = effectiveValue;
      }
    }
    else if (propConfig.stylename == "backgroundColor" && domObj.tabPanel != null) {
      if (effectiveValue) domObj.tabPanel.backColor = effectiveValue;
      else domObj.tabPanel.backColor = "#eeeeff";
      if (context == "genie" || isDesignMode) domObj.tabPanel.draw();
    }
    else {
      try {
        domObj.style[propConfig.stylename] = pui.getPosDimString(propConfig.stylename, effectiveValue);
      }
      catch(err) {
        if (js == null && isDesignMode) {
          var msg = "'" + newValue + "' is not a valid value for " + propConfigName + ".";
          if (toolbar.loadingDisplay) {
            var formatName = toolbar.designer.screenProperties[toolbar.designer.currentScreen.screenId]["record format name"];
            if (properties["grid"] != null) {
              var gridDom = getObj(properties["grid"]);
              if (gridDom != null && gridDom.grid != null) { 
                formatName = gridDom.grid.recordFormatName;
              }
            }
            msg += "\n\n\nRecord Format: " + formatName;
            msg += "\n\nElement Id: " + properties["id"];
            msg += "\n\nElement Type: " + properties["field type"];
          }
          pui.alert(msg);
        }
      }
      if (domObj.tabPanel != null) {
        if (propConfig.stylename == "color" || propConfig.stylename == "fontFamily" || propConfig.stylename == "fontSize" || propConfig.stylename == "height" || propConfig.stylename == "width") {
          if (context == "genie" || isDesignMode) domObj.tabPanel.draw();
        }
      } 
    }
    if (propConfig.stylename == "visibility" && effectiveValue == "hidden" && !isDesignMode && properties["field type"] == "date field") {
      setTimeout(function() { if (domObj.calimg && domObj.style.visibility == "hidden") domObj.calimg.style.visibility = "hidden"; }, 1);
    }
    if (propConfig.stylename == "visibility" && effectiveValue == "hidden" && !isDesignMode && properties["field type"] == "spinner") {
      setTimeout(function() { 
        if (domObj.spinner && domObj.style.visibility == "hidden") domObj.spinner.hide(); 
      }, 1);
    }
    if (propConfig.stylename == "color" && domObj.firstChild != null && domObj.firstChild.tagName == "A") {
      domObj.firstChild.style.color = effectiveValue;
    }
    else if (propConfig.stylename == "color" && domObj.firstChild != null && domObj.firstChild.nextSibling != null && domObj.firstChild.nextSibling.tagName == "A") {  // assuming first child is a text node, and has a sibling that is a hyperlink
      domObj.firstChild.nextSibling.style.color = effectiveValue;
    }

    if (propConfig.stylename == "textDecoration" && domObj.firstChild != null && domObj.firstChild.tagName == "A") {
      domObj.firstChild.style.textDecoration = effectiveValue;
    }
    else if (propConfig.stylename == "textDecoration" && domObj.firstChild != null && domObj.firstChild.nextSibling != null && domObj.firstChild.nextSibling.tagName == "A") {  // assuming first child is a text node, and has a sibling that is a hyperlink
      domObj.firstChild.nextSibling.style.textDecoration = effectiveValue;
    }
    
    if (propConfig.stylename == "width" && !widget.resizable) domObj.style.width = "";
    if (propConfig.stylename == "height" && !widget.resizable) domObj.style.height = "";
  }

  // Process attribute property change
  if (propConfig.attribute != null) {
    if (effectiveValue == "") {
      try {
        domObj.removeAttribute(propConfig.attribute);
        if (propConfig.attribute == "class") {
          domObj.className = "";
        }                    
      }
      catch(err) {
        if (js == null && isDesignMode) pui.alert(err.message);
      }
    }
    else {
      try {
        var valueToAssign = effectiveValue;
        if (propConfig.type == "boolean" && valueToAssign == "true") { 
          valueToAssign = true;
          if (propConfig.attribute == "disabled" && isDesignMode) valueToAssign = false; 
        }
        if (propConfig.type == "boolean" && valueToAssign == "false") valueToAssign = false;
        if (valueToAssign == false) {
          if (domObj.getAttribute(propConfig.attribute) != null) {
            domObj.removeAttribute(propConfig.attribute);
          }
        }
        else {
          if (propConfig.attribute == "src") valueToAssign = pui.normalizeURL(valueToAssign, true);
          domObj.setAttribute(propConfig.attribute, valueToAssign);
          if (propConfig.attribute == "class") {
            domObj.className = valueToAssign;
          }                    
        }
      }
      catch(e) {
        if (js == null && isDesignMode) {
          var msg = "'" + newValue + "' is not a valid value for " + propConfigName + "."
          if (toolbar.loadingDisplay) {
            var formatName = toolbar.designer.screenProperties[toolbar.designer.currentScreen.screenId]["record format name"];
            if (properties["grid"] != null) {
              var gridDom = getObj(properties["grid"]);
              if (gridDom != null && gridDom.grid != null) { 
                formatName = gridDom.grid.recordFormatName;
              }
            }
            msg += "\n\n\nRecord Format: " + formatName;
            msg += "\n\nElement Id: " + properties["id"];
            msg += "\n\nElement Type: " + properties["field type"];
          }
          pui.alert(msg);
        }
      }
    }
  }
  
  // Process classes
  if (context == "dspf" && (propConfigName.substr(0,9) == "css class" || propConfigName == "display attribute field")) {
    var classes = [];
    classes.push(properties["css class"]);
    var clsNum = 2;
    var cls = properties["css class " + clsNum];
    while (cls != null) {
      classes.push(cls);
      clsNum++;
      cls = properties["css class " + clsNum];
    }
    var idx = Number(propConfigName.substr(10));
    if (isNaN(idx) || idx < 1 || idx > 99) idx = 1;
    if (propConfigName != "display attribute field") classes[idx - 1] = effectiveValue;
    var attr = properties["display attribute field"];
    var dspAtrField = false;
    if (attr != null && !pui.isBound(attr) && attr != "" && attr != " ") {
      classes = classes.concat(pui.attrToCSS(attr));
      dspAtrField = true;
    }
    assignDomClasses(domObj, classes, dspAtrField);
  }
 
  // Attach Events
  if (propConfig.type == "js") {
    var func = null;
    if (propConfigName == "ontabclick") {
      func = function() {
        eval("var tab = arguments[0];");
        try {
          return eval(newValue);
        }
        catch(err) {
          pui.alert(propConfigName.substr(0,1).toUpperCase() + propConfigName.substr(1) + " Error:\n" + err.message);        
        }
      }
    }
    else if (propConfigName == "onoptionclick") {
      func = function() {
        eval("var value = arguments[0];");
        eval("var text = arguments[1];");
        try {
          eval(newValue);
        }
        catch(err) {
          pui.alert(propConfigName.substr(0,1).toUpperCase() + propConfigName.substr(1) + " Error:\n" + err.message);        
        }
      }
    }
    else if (propConfigName == "onspin") {
      func = function() {
        try {
          eval(newValue);
        }
        catch(err) {
          pui.alert(propConfigName.substr(0,1).toUpperCase() + propConfigName.substr(1) + " Error:\n" + err.message);        
        }
      }
    }
    else if (propConfigName == "onchartclick") {
      func = function() {
        eval("var name = arguments[0];");
        try {
          var customFunction = eval(newValue);
          if (typeof customFunction == "function") {
            customFunction(arguments[0]);
          }
        }
        catch(err) {
          pui.alert(propConfigName.substr(0,1).toUpperCase() + propConfigName.substr(1) + " Error:\n" + err.message);    
        }
      }
    }
    else if (propConfigName != "onselect") { // Handling for "onselect" one is provided inside the auto complete class.
      func = function(e) {
        if ( (domObj.getAttribute!=null && domObj.getAttribute("disabled")=="true" )
          || ( domObj.disabled!=null && domObj.disabled==true ) ) {
          return;
        }
        eval("var row;");
        if (subfileRow != null) {
          eval("row = " + subfileRow + ";");
        }
        pui["temp_event"] = e;
        eval("var event = pui.temp_event;");
        try {
          var customFunction = eval(newValue);
          if (typeof customFunction == "function") {
            if (!e) e = window.event;
            customFunction(e, this);
          }
        }
        catch(err) {
          pui.alert(propConfigName.substr(0,1).toUpperCase() + propConfigName.substr(1) + " Error:\n" + err.message);        
        }
      }
    }
    if (!isDesignMode && func != null) {
      domObj[propConfigName] = func;
      if (domObj.comboBoxWidget != null) {
        if (propConfigName != "onselect") domObj.comboBoxWidget.assignJSEvent(propConfigName, func);
      }
    }
  } 
  
  // Reflect changes to designer  
  if (isDesignMode) {
    if (newValue != "" || properties[propConfigName] != null) 
      properties[propConfigName] = newValue;
    designItem.propertiesChanged[propConfigName] = true;
    if (propConfigName == "field type" ||
        propConfigName == "left" ||
        propConfigName == "top" ||
        propConfigName == "z index" ||
        propConfigName == "visibility" ||
        propConfigName == "height" ||
        propConfigName == "width" ||
        propConfigName == "label" ||
        propConfigName == "color" ||
        propConfigName == "font family" ||
        propConfigName == "font size" ||
        propConfigName == "font style" ||
        propConfigName == "font weight") {
      designItem.drawIcon();
    }
    designItem.mirrorDown();
    if (resizer != null) resizer.positionSizies();
    if (context == "dspf") {
      if (propConfigName == "id") {
        pui.ide.refreshFieldList();      
      }
      if (propConfigName == "id" || propConfigName == "field type" || propConfigName == "value") {
        pui.ide.refreshElementList();
      }
      designItem.designer.makeDirty();
    }
  }

  // Execute widget's property after setter methods
  globalSetter = widget.globalAfterSetter;
  setters = widget.afterSetters;
  setter = null;
  if (setters != null) {
    setter = setters[propConfigName];
  }
  var setterParms;
  if (setter != null || globalSetter != null) {
    setterParms = {
      newValue: newValue,
      value: effectiveValue,
      design: isDesignMode,
      properties: properties,
      originalValue: originalValue,
      dom: dom,
      oldDom: domObj,
      propertyName: propConfigName,
      designItem: designItem,
      resizer: resizer,
      evalProperty: function(propName) {
        return evalPropertyValue(this.properties[propName], this.originalValue, this.dom);
      }
    };
  }
  if (globalSetter != null) {
    globalSetter(setterParms);
  }
  if (setter != null) {
    setter(setterParms);
  }

  return dom;

}

function assignDomClasses(dom, classes, lastClassIsDspAtrField) {
  var classArray = [];
  var RI = false;
  var toCombineWithRI = [];
  var foundColor = false;
  var colorIdx = null;
  function isColor(cssClass) {
    return (cssClass == "BLU" || cssClass == "GRN" || cssClass == "PNK" || cssClass == "RED" || cssClass == "TRQ" || cssClass == "WHT" || cssClass == "YLW");
  }
  for (var i = 0; i < classes.length; i++) {
    var dspAtrField = false;
    if (lastClassIsDspAtrField && i == classes.length - 1) dspAtrField = true;
    var cssClass = classes[i];
    if (cssClass == null || cssClass == "") continue;
    if (isColor(cssClass)) {
      if (foundColor && !dspAtrField) continue;  // only 1 color is applied at runtime / "display attribute field" is an exception
      if (!foundColor) {
        foundColor = true;
        colorIdx = classArray.length;
      }
      else if (dspAtrField && colorIdx != null) {
        classArray[colorIdx] = cssClass;
        continue;
      }
    }
    classArray.push(cssClass);
    //if (classString != "") classString += " ";
    //classString += cssClass;
    if (cssClass == "PR" || cssClass == "PR-UL") {
      dom.readOnly = true;
      dom.tabIndex = "-1";
      if (dom.tagName == "SELECT") {
        dom.disabled = true;
      }
      if (dom.comboBoxWidget != null) {
        var boxDom = dom.comboBoxWidget.getBox();
        boxDom.readOnly = true;
        boxDom.disabled = true;
        boxDom.tabIndex = "-1";
      }
    }
    if (cssClass == "RI") RI = true;
    if (isColor(cssClass) || cssClass == "HI") {
      toCombineWithRI.push(cssClass);
    }
  }
  if (RI) {
    for (var i = 0; i < toCombineWithRI.length; i++) {
      //classString += " RI-" + toCombineWithRI[i];
      classArray.push("RI-" + toCombineWithRI[i]);
    }
  }
  var classString = classArray.join(" ");
  dom.setAttribute("class", classString);
  dom.className = classString;  
}

// Evaluate property if javascript used
function evalPropertyValue(propertyValue) {

  var effectiveValue = "";

  if (pui.isBound(propertyValue) || pui.isTranslated(propertyValue)) {
    if (propertyValue.designValue != null) effectiveValue = propertyValue.designValue;
    return effectiveValue;
  }  

  // Calculate Effective Value
  if (propertyValue == null) propertyValue = "";
  var js = null;
  if (String(propertyValue).substr(0, 3).toLowerCase() == "js:") {
    js = propertyValue.substr(3);
  }
  if (String(propertyValue).substr(0, 11).toLowerCase() == "javascript:") {
    js = propertyValue.substr(11);
  }
  if (String(propertyValue).substr(0, 7).toLowerCase() == "script:") {
    js = propertyValue.substr(7);
  }
  if (js == null) {
    effectiveValue = propertyValue;
  }
  else {
    eval("var value = arguments[1];");
    eval("var obj = arguments[2];");
    try {
      effectiveValue = eval(js);
    }
    catch(err) {
      if (!pui.suppressPropertyScriptingErrors) {
        pui.suppressPropertyScriptingErrors = true;
        setTimeout(function() { 
          pui.alert("Expression '" + trim(js) + "' contains an error:\n\n" + err.message); 
          pui.suppressPropertyScriptingErrors = false;
        }, 1);
      }
    }
  }
  return effectiveValue;
}



function getScreenProperties(designScreen, onsuccess, onfail) {
  var skin = pui.skin;
  var skinsFolder = "genie skins";
  var url = "/profoundui/userdata/" + skinsFolder + "/" + skin + "/screens/" + encodeURIComponent(designScreen.name) + ".scn?mod=";
  var stamp;
  if (typeof(designScreen.modified) != "undefined") stamp = designScreen.modified;
  else stamp = getTimeStamp();
  url += stamp; 
  if (cachedScreens[designScreen.name + "." + stamp] != null) {
    screenPropertiesObj[designScreen.screenId] = cachedScreens[designScreen.name + "." + stamp];
    onsuccess();
    return;
  }
  var request = new pui.Ajax(url);
  request["async"] = true;
  request["method"] = "get";
  request["suppressAlert"] = true;
  request["onsuccess"] = function() {
    var text = "(" + request.getResponseText() + ")";
    var obj = eval(text);
    screenPropertiesObj[designScreen.screenId] = obj;
    cachedScreens[designScreen.name + "." + stamp] = obj;
    onsuccess();
  }
  request["onfail"] = function() {
    pui.alert("An error occurred while loading screen '" + designScreen.name + "'.\n\nHTTP " + request.getStatus() + "\n\n" + request.getStatusText() + ".");
    onfail();    
  }
  request.send();
}




pui.addCustomProperty = function(parms) {
  var pm = getPropertiesModel();
  var found = false;
  var insertAt = pm.length;
  
  // search for category
  for (var i = 0; i < pm.length; i++) {
    if (pm[i].category == true && pm[i].name == parms.category) {
      insertAt = i + 1;
      found = true;
      break;
    }
  }

  // add category if not found
  if (!found) {
    // add category
    pm.splice(insertAt, 0, { name: parms.category, category: true, controls: parms.controls });
    insertAt++;
  }
  
  // insert property
  delete parms.category;  // the category name doesn't belong on the property definition in the properties model
  pm.splice(insertAt, 0, parms);
}



