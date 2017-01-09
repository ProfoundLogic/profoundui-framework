//  Profound UI Runtime  -- A Javascript Framework for Rich Displays
//  Copyright (c) 2017 Profound Logic Software, Inc.
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



pui.applyEditWord = function(obj) {

  var edtwrd = obj.edtWrd;
  var value = obj.value;
  var decPos = Number(obj.decPos);

  // apply key filter  
  var keyFilter = '[\\d';
  for (var i = 0; i < edtwrd.length; i++) {
    var ch = edtwrd.substr(i, 1);
    var keyFilterChar = ch;
    if (ch == " ") continue;
    if (ch == "&") keyFilterChar = " ";
    keyFilterChar = pui.formatting.escapeRe(keyFilterChar);
    keyFilter += keyFilterChar;
  }
  keyFilter += "]";
  obj.keyFilter = new RegExp(keyFilter);

  // Make sure value is a number
  //   and make sure number converted to a string.
  //
  //  Note: We don't want to use the output from Number() here,
  //        since this will lose precision on numbers with more than 15
  //        digits (limit of the 64-bit floating point used by JS)
  //        But it's okay to use it to test if it's a valid number.
  var charValue;
  if (isNaN(Number(value))) {
    charValue = "0";
  }
  else {
    charValue = String(value);
  }
  
  // format value as a string of digits
  charValue = charValue.replace("-", "");  // remove negative sign
  var numParts = charValue.split(".");
  var intPortion = numParts[0];
  var decPortion = "";
  if (numParts.length > 1) decPortion = numParts[1];
  if (decPos == null || isNaN(decPos)) decPos = 0;
  while (decPortion.length > decPos) {
    decPortion = decPortion.substr(decPortion.length - 1);
  }
  while (decPos > decPortion.length) {
    decPortion += "0";
  }
  charValue = intPortion + decPortion;
  while (charValue.substr(0,1) == "0") {
    charValue = charValue.substr(1);
  }
  
  // get currency symbol
  var curSym = "$";
  if (pui.appJob != null && pui.appJob.curSym != null) {
    curSym = pui.appJob.curSym;
  }
  
  // get edit word - it must be present and must be surrounded by single quotes
  if (edtwrd == null || edtwrd == "") return value;  
  edtwrd = trim(edtwrd);
  if (edtwrd.length < 3) return value;
  if (edtwrd.substr(0, 1) != "'") return value;
  if (edtwrd.substr(edtwrd.length - 1, 1) != "'") return value;
  edtwrd = edtwrd.substr(1, edtwrd.length - 2);
  
  // get zero suppression position
  var zeroSuppressPos = edtwrd.indexOf("0") + 1;  
  var zeroSuppressPos2 = edtwrd.indexOf("*") + 1;
  if (zeroSuppressPos == 0 || (zeroSuppressPos2 != 0 && zeroSuppressPos2 < zeroSuppressPos)) {
    zeroSuppressPos = zeroSuppressPos2;
  }  
  
  // look for farthest right character that can be replaced by a digit
  // to determine where the body part of the edit word ends
  var bodyEndPos = -1;
  for (var i = edtwrd.length - 1; i >= 0; i = i - 1) {
    if (i + 1 == zeroSuppressPos || edtwrd.substr(i, 1) == " ") {
      bodyEndPos = i;
      break;
    }
  }
  
  // get body, status, and expansion parts of the edit word
  var editBody = edtwrd.substr(0, bodyEndPos + 1);
  var editStatus = "";
  var editExpansion = "";
  var done = false;
  var encounteredSign = false;
  for (var i = bodyEndPos + 1; i < edtwrd.length; i++) {
    if (edtwrd.substr(i, 2) == "CR") {
      encounteredSign = true;
      i++;
      continue;
    }
    if (edtwrd.substr(i, 1) == "-") {
      encounteredSign = true;
      continue;
    }
    if (edtwrd.substr(i, 1) == "&") {
      continue;
    }
    if (edtwrd.substr(i, 1) == "*" && !encounteredSign) {
      continue;
    }
    editStatus = edtwrd.substring(bodyEndPos + 1, i);
    editExpansion = edtwrd.substr(i);
    done = true;
    break;
  }
  if (!done) {
    editStatus = edtwrd.substr(bodyEndPos + 1);
  }

  // format body part of edit word  
  var newValue = "";
  var beforeSignificantDigits = false;
  var asteriskProtection = false;
  var floatingCurSym = false;
  var zeroSuppress = false;
  if (zeroSuppressPos == 0) zeroSuppress = true;
  function getDigit() {
    if (charValue.length > 0) {
      var ch = charValue.substr(charValue.length - 1, 1);
      charValue = charValue.substr(0, charValue.length - 1);
      if (ch == "0" && charValue.length == 0 && zeroSuppress) {
        if (asteriskProtection) ch = "*";
        else ch = " ";
      }
    }
    else {
      ch = "0";
      if (zeroSuppress) ch = " ";
      if (asteriskProtection) ch = "*";
    }
    return ch;
  }
  for (var i = editBody.length - 1; i >= 0; i = i - 1) {
    var ch = editBody.substr(i, 1);
    var newCh = ch;
    if (ch == " ") {
      newCh = getDigit();
    }
    else if (ch == "&") {
      newCh = " ";
    }
    else if (ch == "0" && i + 1 == zeroSuppressPos) {
      newCh = getDigit();
    }
    else if (ch == "*") {
      asteriskProtection = true;
      newCh = getDigit();      
    }
    else if (ch == curSym) {
      if (i + 2 == zeroSuppressPos) {
        // floating currency symbol
        newCh = getDigit();
        floatingCurSym = true;
      }
    }
    else if (ch == "." || ch == ",") {
      if (beforeSignificantDigits) {
        newCh = " ";
        if (asteriskProtection) newCh = "*";
      }
    }
    else {
      if (beforeSignificantDigits) {
        newCh = " ";
        if (asteriskProtection) newCh = "*";
      }
    }
    
    newValue = newCh + newValue;
    
    if (i <= zeroSuppressPos) zeroSuppress = true;
    if (zeroSuppress && charValue.length == 0) {
      beforeSignificantDigits = true;
    }
  }
  
  // format status part of edit word
  editStatus = editStatus.replace(/&/g, " ");
  editStatus = editStatus.replace(/\*/g, " ");
  if (value >= 0) {
    editStatus = editStatus.replace("CR", "  ");
    editStatus = editStatus.replace("-", " ");
  }

  // combine body, status, expansion results, and add floating currency symbol if applicable
  var newValue = newValue + editStatus + editExpansion;
  obj.maxLength = newValue.length;
  var newValue = trim(newValue);
  if (asteriskProtection && newValue.substr(0,1) != "*") newValue = "*" + newValue;
  if (floatingCurSym) newValue = curSym + newValue;

  return newValue;

}


// -------------------------------------------------------------------
//  This is the original applyEditMask() function.  It does not follow
//  IBM's specs, but we are keeping it to allow backward compatibility
//  via the pui["use original edit mask"] config option.
// -------------------------------------------------------------------

pui.applyEditMaskOriginal = function(dom, event, pos) {
  // get key code
  event = event || window.event;
  var key;
  if (event != null) key = event.keyCode;   

  // get edit word, edit mask, and value
  var formatting = dom.formattingInfo;
  if (formatting == null) return;
  var edtMsk = formatting.edtMsk;
  var edtWrd = formatting.edtWrd;
  if (edtMsk == null || edtMsk == "") return;
  if (edtWrd == null || edtWrd == "") return;  // for now, edit masks only work with edit words
  if (edtWrd.length > 1 && edtWrd.substr(0, 1) == "'" && edtWrd.substr(edtWrd.length-1, 1) == "'") {
    edtWrd = edtWrd.substr(1, edtWrd.length - 2);
  }
  if (edtMsk.length > 1 && edtMsk.substr(0, 1) == "'" && edtMsk.substr(edtMsk.length-1, 1) == "'") {
    edtMsk = edtMsk.substr(1, edtMsk.length - 2);
  }
  var value = dom.value;
  if (value == null) return;
  
  // derive mask character array
  var mask = [];
  var n = edtMsk.length;
  if (edtWrd.length < n) n = edtWrd.length;
  for (var i = 0; i < n; i++) {
    wrdCh = edtWrd.substr(i, 1);
    mskCh = edtMsk.substr(i, 1);
    if (wrdCh == " " || wrdCh == "0" || mskCh == " ") {
      mask.push(null);
    }
    else {
      if (wrdCh == "&") mask.push(" ");
      else mask.push(wrdCh);
    }
  }
  
  // apply mask
  n = mask.length;
  while (value.length < n) {
    if (key == null || key == 0) value = " " + value;
    else value += " ";
  }
  if (value.length > n) {
    value = value.substr(0, n);
  }
  var fillCh = "0";
  for (var i = 0; i < n; i++) {
    var maskCh = mask[i];
    var valueCh = value.substr(i, 1);
    if (maskCh != null && valueCh != maskCh) {
      value = value.substr(0, i) + maskCh + value.substr(i+1);
    }
    else if (maskCh == null && (valueCh < "0" || valueCh > "9")) {
      value = value.substr(0, i) + fillCh + value.substr(i+1);
    }
  }
  value = rtrim(value);
  
  if (value != rtrim(dom.value) || pos != null) {
    if (pos == null) pos = getCursorPosition(dom);
    
    if (key != 8) {  // not backspace
      while (pos < mask.length && mask[pos] != null) pos++;
    }    
    
    dom.value = value;
    
    // position cursor
    if (dom.createTextRange != null && !pui["is_opera"]) { 
      var tr = dom.createTextRange(); 
      if (tr) { 
        tr.moveStart("character", pos);
        tr.collapse(); 
        tr.select(); 
      }
    }
    else if (dom.selectionStart != null) {  // Firefox
      dom.setSelectionRange(pos, pos);
    }
  }
}


pui.applyEditMask = function(dom, event, pos) {
	
  // for backward compatibility:
  if ( typeof pui["use original edit mask"] != "undefined" 
     && pui["use original edit mask"] === true ) {
    return pui.applyEditMaskOriginal(dom, event, pos);
  }
  // get key code
  event = event || window.event;
  var key;
  if (event != null) key = event.keyCode;   

  // get edit word, edit mask, and value
  var formatting = dom.formattingInfo;
  if (formatting == null) return;
  var edtMsk = formatting.edtMsk;
  var edtWrd = formatting.edtWrd;
  if (edtMsk == null || edtMsk == "") return;
  if (edtWrd == null || edtWrd == "") return;  // for now, edit masks only work with edit words
  if (edtWrd.length > 1 && edtWrd.substr(0, 1) == "'" && edtWrd.substr(edtWrd.length-1, 1) == "'") {
    edtWrd = edtWrd.substr(1, edtWrd.length - 2);
  }
  if (edtMsk.length > 1 && edtMsk.substr(0, 1) == "'" && edtMsk.substr(edtMsk.length-1, 1) == "'") {
    edtMsk = edtMsk.substr(1, edtMsk.length - 2);
  }
  var value = dom.value;
  if (value == null) return;
  
  // derive mask character array
  var mask = [];
  var n = edtMsk.length;
  var zeroSuppressPos = n;
  if (edtWrd.length < n) n = edtWrd.length;
  for (var i = 0; i < n; i++) {
    wrdCh = edtWrd.substr(i, 1);
    mskCh = edtMsk.substr(i, 1);
    if ((wrdCh == "0" || wrdCh == "*") && zeroSuppressPos > i) { 
       zeroSuppressPos = i;
    }
    if (wrdCh == " " || wrdCh == "0" || mskCh == " ") {
      mask.push(null);
    }
    else {
      if (wrdCh == "&") mask.push(" ");
      else mask.push(wrdCh);
    }
  }
  
  // apply mask
  n = mask.length;
  while (value.length < n) {
    if (key == null || key == 0) value = " " + value;
    else value += " ";
  }
  if (value.length > n) {
    value = value.substr(0, n);
  }
  var fillCh;
  for (var i = 0; i < n; i++) {
    if (i <= zeroSuppressPos) {
      fillCh = " ";
    }
    else {
      fillCh = "0";
    }
    var maskCh = mask[i];
    var valueCh = value.substr(i, 1);
    if (maskCh != null && valueCh != maskCh) {
      value = value.substr(0, i) + maskCh + value.substr(i+1);
    }
    else if (maskCh == null && (valueCh < "0" || valueCh > "9")) {
      value = value.substr(0, i) + fillCh + value.substr(i+1);
    }
  }
  value = rtrim(value);
  
  if (value != rtrim(dom.value) || pos != null) {
    if (pos == null) pos = getCursorPosition(dom);
    
    if (key != 8) {  // not backspace
      while (pos < mask.length && mask[pos] != null) pos++;
    }    
    
    dom.value = value;
    
    // position cursor
    if (dom.createTextRange != null && !pui["is_opera"]) { 
      var tr = dom.createTextRange(); 
      if (tr) { 
        tr.moveStart("character", pos);
        tr.collapse(); 
        tr.select(); 
      }
    }
    else if (dom.selectionStart != null) {  // Firefox 
      dom.setSelectionRange(pos, pos);
    }
  }
}


