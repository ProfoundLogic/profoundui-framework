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

// eslint-disable-next-line no-unused-vars
function allowKeysSimple(allowedUnicodes, e) {
  var key;

  key = e.keyCode;

  for (var i = 0; i < allowedUnicodes.length; i++) {
    if (allowedUnicodes[i] == key) {
      if (e.modifiers && Event.SHIFT_MASK) {
        // case exits
      }
      else {
        return true;
      }
    }
  }
  disableAction(e);
  return false;
}

// this function determines if a field bound to a property belongs to the subfile rather
// than a standard record format or a control record
pui.isSubfileProperty = function(propertyName) {
  switch (propertyName) {
    case "subfile next changed": return true;
    case "subfile message key": return true;
    case "subfile program message queue": return true;
    case "selection field": return true;
    case "row is hidden field": return true;
    case "tree level field": return true;
    case "subfile changed": return true;
    case "row font color": return true;
    case "row background": return true;
    case "grid row translation placeholder value": return true;
    default: return false;
  }
};

pui.unicodeToHex = function(unicode) {
  if (unicode === null) return;

  var codesArray = [];

  codesArray[128] = "20";
  codesArray[129] = "21";
  codesArray[130] = "22";
  codesArray[131] = "23";
  codesArray[132] = "24";
  codesArray[10] = "25";
  codesArray[23] = "26";
  codesArray[27] = "27";
  codesArray[136] = "28";
  codesArray[137] = "29";
  codesArray[138] = "2A";
  codesArray[139] = "2B";
  codesArray[140] = "2C";
  codesArray[5] = "2D";
  codesArray[6] = "2E";
  codesArray[7] = "2F";
  codesArray[144] = "30";
  codesArray[145] = "31";
  codesArray[22] = "32";
  codesArray[147] = "33";
  codesArray[148] = "34";
  codesArray[149] = "35";
  codesArray[150] = "36";
  codesArray[4] = "37";
  codesArray[152] = "38";
  codesArray[153] = "39";
  codesArray[154] = "3A";
  codesArray[155] = "3B";
  codesArray[20] = "3C";
  codesArray[21] = "3D";
  codesArray[158] = "3E";
  codesArray[26] = "3F";

  codesArray[181] = "A0";
  codesArray[126] = "A1";
  codesArray[115] = "A2";
  codesArray[116] = "A3";
  codesArray[117] = "A4";
  codesArray[118] = "A5";
  codesArray[119] = "A6";
  codesArray[120] = "A7";
  codesArray[121] = "A8";
  codesArray[122] = "A9";
  codesArray[161] = "AA";
  codesArray[191] = "AB";
  codesArray[208] = "AC";
  codesArray[221] = "AD";
  codesArray[222] = "AE";
  codesArray[174] = "AF";
  codesArray[94] = "B0";
  codesArray[163] = "B1";
  codesArray[165] = "B2";
  codesArray[183] = "B3";
  codesArray[169] = "B4";
  codesArray[167] = "B5";
  codesArray[182] = "B6";
  codesArray[188] = "B7";
  codesArray[189] = "B8";
  codesArray[190] = "B9";
  codesArray[91] = "BA";
  codesArray[93] = "BB";
  codesArray[175] = "BC";
  codesArray[168] = "BD";
  codesArray[180] = "BE";
  codesArray[215] = "BF";

  return codesArray[unicode];
};

pui.hexToCSS = function(hex) {
  if (hex == null || typeof hex != "string") return [];

  var cssArray = [];

  cssArray["20"] = ["GRN"];
  cssArray["21"] = ["GRN", "RI"];
  cssArray["22"] = ["WHT"];
  cssArray["23"] = ["WHT", "RI"];
  cssArray["24"] = ["GRN", "UL"];
  cssArray["25"] = ["GRN", "UL", "RI"];
  cssArray["26"] = ["WHT", "UL"];
  cssArray["27"] = ["ND"];
  cssArray["28"] = ["RED"];
  cssArray["29"] = ["RED", "RI"];
  cssArray["2A"] = ["RED", "HI"];
  cssArray["2B"] = ["RED", "HI", "RI"];
  cssArray["2C"] = ["RED", "UL"];
  cssArray["2D"] = ["RED", "UL", "RI"];
  cssArray["2E"] = ["RED", "UL", "BL"];
  cssArray["2F"] = ["ND"];
  cssArray["30"] = ["TRQ", "CS"];
  cssArray["31"] = ["TRQ", "CS", "RI"];
  cssArray["32"] = ["YLW", "CS"];
  cssArray["33"] = ["WHT", "RI", "CS"];
  cssArray["34"] = ["TRQ", "UL", "CS"];
  cssArray["35"] = ["TRQ", "UL", "RI", "CS"];
  cssArray["36"] = ["YLW", "UL", "CS"];
  cssArray["37"] = ["ND"];
  cssArray["38"] = ["PNK"];
  cssArray["39"] = ["PNK", "RI"];
  cssArray["3A"] = ["BLU"];
  cssArray["3B"] = ["BLU", "RI"];
  cssArray["3C"] = ["PNK", "UL"];
  cssArray["3D"] = ["PNK", "UL", "RI"];
  cssArray["3E"] = ["BLU", "UL"];
  cssArray["3F"] = ["ND"];

  cssArray["A0"] = ["GRN", "PR"];
  cssArray["A1"] = ["GRN", "RI", "PR"];
  cssArray["A2"] = ["WHT", "PR"];
  cssArray["A3"] = ["WHT", "RI", "PR"];
  cssArray["A4"] = ["GRN", "UL", "PR"];
  cssArray["A5"] = ["GRN", "UL", "RI", "PR"];
  cssArray["A6"] = ["WHT", "UL", "PR"];
  cssArray["A7"] = ["ND", "PR"];
  cssArray["A8"] = ["RED", "PR"];
  cssArray["A9"] = ["RED", "RI", "PR"];
  cssArray["AA"] = ["RED", "HI", "PR"];
  cssArray["AB"] = ["RED", "HI", "RI", "PR"];
  cssArray["AC"] = ["RED", "UL", "PR"];
  cssArray["AD"] = ["RED", "UL", "RI", "PR"];
  cssArray["AE"] = ["RED", "UL", "BL", "PR"];
  cssArray["AF"] = ["ND", "PR"];
  cssArray["B0"] = ["TRQ", "CS", "PR"];
  cssArray["B1"] = ["TRQ", "CS", "RI", "PR"];
  cssArray["B2"] = ["YLW", "CS", "PR"];
  cssArray["B3"] = ["WHT", "RI", "CS", "PR"];
  cssArray["B4"] = ["TRQ", "UL", "CS", "PR"];
  cssArray["B5"] = ["TRQ", "UL", "RI", "CS", "PR"];
  cssArray["B6"] = ["YLW", "UL", "CS", "PR"];
  cssArray["B7"] = ["ND", "PR"];
  cssArray["B8"] = ["PNK", "PR"];
  cssArray["B9"] = ["PNK", "RI", "PR"];
  cssArray["BA"] = ["BLU", "PR"];
  cssArray["BB"] = ["BLU", "RI", "PR"];
  cssArray["BC"] = ["PNK", "UL", "PR"];
  cssArray["BD"] = ["PNK", "UL", "RI", "PR"];
  cssArray["BE"] = ["BLU", "UL", "PR"];
  cssArray["BF"] = ["ND", "PR"];

  return cssArray[hex];
};

pui.attrToCSS = function(attr) {
  if (attr == null || typeof attr != "string" || attr.length < 1) return [];
  var unicode = attr.charCodeAt(0);
  var hex = pui.unicodeToHex(unicode);
  return pui.hexToCSS(hex);
};

// path is in the format of "LIBRARY/FILE(MEMBER)"
pui.parseLibraryFileMember = function(path) {
  var parts = path.split("(");
  if (parts.length != 2) return null;
  var file = parts[0];
  var member = parts[1];
  if (member.substr(member.length - 1, 1) != ")") return null;
  member = member.substr(0, member.length - 1);

  parts = file.split("/");
  if (parts.length != 2) return null;
  var library = parts[0];
  file = parts[1];

  library = trim(library).toUpperCase();
  if (library == "") return null;
  file = trim(file).toUpperCase();
  if (file == "") return null;
  member = trim(member).toUpperCase();
  if (member == "") return null;

  return {
    "library": library,
    "file": file,
    "member": member
  };
};

pui.assignShortcutKey = function(shortcutKey, dom) {
  var formatName = pui.lastFormatName;
  if (context != "dspf" || formatName == null) return;

  // unassign current shortcut key
  if (pui.keyMap[formatName] != null) {
    for (var key in pui.keyMap[formatName]) {
      var doms = pui.keyMap[formatName][key];
      for (var i = 0; i < doms.length; i++) {
        if (doms[i] == dom) {
          doms.splice(i, 1);
          break;
        }
      }
    }
  }

  // assign new shortcut key
  dom.shortcutKey = shortcutKey;
  if (shortcutKey == null || shortcutKey == "") return;
  if (pui.keyMap[formatName] == null) pui.keyMap[formatName] = {};
  if (pui.keyMap[formatName][shortcutKey] == null) pui.keyMap[formatName][shortcutKey] = [];
  pui.keyMap[formatName][shortcutKey].push(dom);

  if (dom["onclick"] == null || dom.responseValue == null) {
    pui.attachResponse(dom);
  }
};

pui.getParentWindow = function(el) {
  var win;
  var prt = el.parentNode;
  while (prt != null && prt != pui.runtimeContainer) {
    if (prt.isPUIWindow == true) {
      win = prt;
      break;
    }

    prt = prt.parentNode;
  }

  return win;
};

// Wrap input into a DIV and create a placeholder label
pui.floatPlaceholder = function(idOrDom) {
  var input;
  var id;
  var i; // loop iterator
  var cls;
  if (typeof idOrDom === "string") {
    id = idOrDom;
    input = getObj(id);
  }
  else {
    input = idOrDom;
    id = input.id;
  }
  if (!input || !id) return;
  var isComboBox = input.comboBoxWidget != null;
  if (isComboBox) input = input.comboBoxWidget.getBox();
  if (input.tagName !== "INPUT" && input.tagName !== "TEXTAREA") return;
  if (!input.placeholder) return;
  var div;

  if (!isComboBox) {
    div = document.createElement("div");
    for (i = 0; i < input.classList.length; i++) {
      cls = input.classList[i];
      cls = "pui-floating-placeholder-" + cls;
      div.classList.add(cls);
    }
    input.parentNode.insertBefore(div, input);
    input.parentNode.removeChild(input);
    input.removeAttribute("id");
    div.id = id;
    div.style.position = input.style.position;
    div.style.left = input.style.left;
    div.style.top = input.style.top;
    div.style.right = input.style.right;
    div.style.bottom = input.style.bottom;
    div.style.width = input.style.width;
    div.pui = input.pui;
    if (input.cursorRecord != null) {
      div.cursorRecord = input.cursorRecord;
    }
    if (input.cursorField != null) {
      div.cursorField = input.cursorField;
    }
    if (input.cursorRow != null) {
      div.cursorRow = input.cursorRow;
    }
    if (input.cursorColumn != null) {
      div.cursorColumn = input.cursorColumn;
    }
    if (input.parentTab != null) {
      div.parentTab = input.parentTab;
    }
    if (input.parentTabPanel != null) {
      div.parentTabPanel = input.parentTabPanel;
    }
    input.style.position = "";
    input.style.left = "";
    input.style.top = "";
    input.style.width = "100%";
    if (input.style.visibility) {
      div.style.visibility = input.style.visibility;
      input.style.visibility = "";
    }
    div.appendChild(input);
    div.sizeMe = input.sizeMe;
    div.alwaysSizeMe = input.alwaysSizeMe;
    div.extraDomEls = input.extraDomEls;
  }
  else {
    div = input.parentNode;
    var classes = div.className.split(" ");
    for (i = 0; i < classes.length; i++) {
      cls = classes[i];
      cls = "pui-floating-placeholder-" + cls;
      div.classList.add(cls);
    }
  }
  div.classList.add("pui-floating-placeholder-div");
  input.classList.add("pui-floating-placeholder-input");

  var label = document.createElement("label");
  label.classList.add("pui-floating-placeholder-label");
  label.innerText = input.placeholder;
  div.insertBefore(label, input.nextSibling);

  // Setup useful methods for outside use by the framework
  div.floatingPlaceholder = label;
  pui.movePrompter(input);
  label.getValue = function() {
    return input.value;
  };
  label.setValue = function(value) {
    input.value = value;
    pui.checkEmptyText(input);
  };
  label.getBox = function() {
    return input;
  };
  label.setMaxLength = function(maxLength) {
    if (maxLength) {
      input.setAttribute("maxlength", maxLength);
    }
  };
  label.assignJSEvent = function(jsEventName, func) {
    // re-assign event to the input box and remove it from the main div element
    input[jsEventName] = func;
    if (div[jsEventName] != null) {
      div[jsEventName] = function() {};
    }
  };
  label.setReadOnly = function(isReadOnly) {
    input.readOnly = isReadOnly;
  };
  label.setDisabled = function(isDisabled) {
    input.disabled = isDisabled;
  };
  label.setBoxAttribute = function(attr, value) {
    input.setAttribute(attr, value);
  };
  label.setFocus = function() {
    box.focus();
  };
};

pui.movePropertiesFromFloatingPlaceholderDiv = function(parms) {
  // If the input has a floating placeholder, then properties have been applied to the placeholder div
  // instead of the actual input. For certain properties (and this list should be added to), move them to
  // the inner input.
  var box = parms.dom.floatingPlaceholder.getBox();
  var propertyName = parms.propertyName;
  var pnm = getPropertiesNamedModel();
  var stylename;

  if (pnm[propertyName] && pnm[propertyName].stylename) stylename = pnm[propertyName].stylename;
  else if (pnm[propertyName] && pnm[propertyName].attribute) stylename = pnm[propertyName].attribute;

  if (stylename) {
    switch (propertyName) {
      case "disabled":
      case "read only":
        box[stylename] = parms.newValue;
        parms.dom.removeAttribute(stylename);
        break;
      case "border radius":
      case "text align":
      case "height":
        box.style[stylename] = parms.dom.style[stylename];
        parms.dom.style[stylename] = "";
        break;
    }
  }
};
