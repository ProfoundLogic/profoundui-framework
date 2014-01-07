//  Profound UI Runtime  -- A Javascript Framework for Rich Displays
//  Copyright (c) 2014 Profound Logic Software, Inc.
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







function textArea_cleanUp(e) {
  var obj = getTarget(e);
  var lineLengths = obj.lineLengths;
  if (lineLengths == null) return;
  var val = obj.value;
  var len = val.length;
  var lines = [];
  lines.push("");
  var curLine = 0;
  var cursorPos = textArea_getCursorPosition(obj); 
  var origCursorPos = cursorPos; 
  if (!e) e = window.event;
  var key = e.which;
  if (!key) key = e.keyCode;
  var ename = e.type;
  if (ename == "keydown" && key == 17) obj.controlKeyDown = true;
  if (ename == "keyup") obj.controlKeyDown = false;

  if (key == 8 && ename == "keyup") return;
  if (key == 8 && ename == "keydown" && cursorPos > 0) {  // backspace
    if (val.substr(cursorPos-1, 1) == "\n") {
      val = val.substr(0, cursorPos - 1) + val.substr(cursorPos);
      cursorPos = cursorPos - 1;
    }
    if (val.substr(cursorPos-1, 1) == "\r") {
      val = val.substr(0, cursorPos - 1) + val.substr(cursorPos);
      cursorPos = cursorPos - 1;
    }
    val = val.substr(0, cursorPos - 1) + val.substr(cursorPos);
    cursorPos = cursorPos - 1;
    if (e.preventDefault) e.preventDefault();
    if (e.stopPropagation) e.stopPropagation();
    e.cancelBubble = true;
    e.returnValue = false;
    origCursorPos = cursorPos;
  }
  
  if (key == 13 && ename == "keydown") {  // enter
    var lineCount = 0;
    for (var i = 0; i < len; i++) {
      var ch = val.substr(i, 1);
      if (ch == "\n") lineCount++;      
    }
    if (lineCount+1 >= lineLengths.length) {
      if (e.preventDefault) e.preventDefault();
      e.returnValue = false;        
    }
    else {
      if (e.stopPropagation) e.stopPropagation();
      e.cancelBubble = true;
    }
  }
  
  var merge = false;
  var cursorLine;
  for (var i = 0; i < len; i++) {
    var ch = val.substr(i, 1);
    if (ch == "\n" || ch == "\r") {
      if (i < origCursorPos) cursorPos = cursorPos - 1;
      if (ch == "\n") {
        if (!merge) {
          if (curLine >= lineLengths.length - 1) {
            break;
          }
          curLine++;
          lines.push("");
        }
        merge = false;
      }
    }
    else {
      if (lines[curLine].length >= lineLengths[curLine]) {
        if (curLine >= lineLengths.length - 1) {
          break;
        }
        curLine++;
        lines.push("");
        merge = true;
      }
      lines[curLine] += ch;
    }
    if (origCursorPos == i) {
      cursorLine = curLine;
    }
  }
  if (origCursorPos == len) {
    cursorLine= curLine;
  }
  var newVal = "";
  for (var i = 0; i <= curLine; i++) {
    newVal += lines[i];
    if (i != curLine) {
      newVal += "\n";
      if (newVal.length-1 <= cursorPos) cursorPos += 1;
    }
  }
  var oldVal = obj.value.replace(/\r/g, "");
  if (ename == "keydown" && !obj.controlKeyDown && textArea_isNormalKey(key)) {
    if (lines.length >= lineLengths.length && cursorLine != null) {
      var full = true;
      for (var i = cursorLine; i < lineLengths.length; i++) {
        if (lines[i].length < lineLengths[i]) {
          full = false;
          break;
        }
      }
      if (full) {
        if (e.preventDefault) e.preventDefault();
        if (e.stopPropagation) e.stopPropagation();
        e.cancelBubble = true;
        e.returnValue = false;        
        return;  
      }
    }
  }
  if (newVal != oldVal) {
    obj.value = newVal;
    textArea_setSelRange(obj, cursorPos, cursorPos);
  }
}


function textArea_isNormalKey(key) {
  if (key >= 48 && key <= 90) return true;
  if (key >= 96 && key <= 111) return true;
  if (key >= 186 && key <= 192) return true;
  if (key >= 219 && key <= 222) return true;
  if (key == 32) return true;
  return false;
}


function textArea_setSelRange(inputEl, selStart, selEnd) { 
 if (inputEl.setSelectionRange) { 
  inputEl.focus(); 
  inputEl.setSelectionRange(selStart, selEnd); 
 } else if (inputEl.createTextRange) { 
  var range = inputEl.createTextRange(); 
  range.collapse(true); 
  range.moveEnd('character', selEnd); 
  range.moveStart('character', selStart); 
  range.select(); 
 } 
}








function textArea_getCursorPosition(textarea){
  // get selection in firefox, opera, ...
  if (typeof(textarea.selectionStart) == "number") {
    return textarea.selectionStart;
  }
  else if(document.selection) {
    var selection_range = document.selection.createRange().duplicate();
    if (selection_range.parentElement() == textarea) { // Check that the selection is actually in our textarea
      // Create three ranges, one containing all the text before the selection,
      // one containing all the text in the selection (this already exists), and one containing all
      // the text after the selection.
      var before_range = document.body.createTextRange();
      before_range.moveToElementText(textarea); // Selects all the text
      before_range.setEndPoint("EndToStart", selection_range); // Moves the end where we need it
      var after_range = document.body.createTextRange();
      after_range.moveToElementText(textarea); // Selects all the text
      after_range.setEndPoint("StartToEnd", selection_range); // Moves the start where we need it
      var before_finished = false, selection_finished = false, after_finished = false;
      var before_text, untrimmed_before_text, selection_text, untrimmed_selection_text, after_text, untrimmed_after_text;
      // Load the text values we need to compare
      before_text = untrimmed_before_text = before_range.text;
      selection_text = untrimmed_selection_text = selection_range.text;
      after_text = untrimmed_after_text = after_range.text;
      // Check each range for trimmed newlines by shrinking the range by 1 character and seeing
      // if the text property has changed. If it has not changed then we know that IE has trimmed
      // a \r\n from the end.
      do {
        if (!before_finished) {
          if (before_range.compareEndPoints("StartToEnd", before_range) == 0) {
            before_finished = true;
          } 
          else {
            before_range.moveEnd("character", -1);
            if (before_range.text == before_text) {
              untrimmed_before_text += "\r\n";
            } 
            else {
              before_finished = true;
            }
          }
        }
        if (!selection_finished) {
          if (selection_range.compareEndPoints("StartToEnd", selection_range) == 0) {
            selection_finished = true;
          } 
          else {
            selection_range.moveEnd("character", -1)
            if (selection_range.text == selection_text) {
              untrimmed_selection_text += "\r\n";
            } 
            else {
              selection_finished = true;
            }
          }
        }
        if (!after_finished) {
          if (after_range.compareEndPoints("StartToEnd", after_range) == 0) {
            after_finished = true;
          }
          else {
            after_range.moveEnd("character", -1)
            if (after_range.text == after_text) {
              untrimmed_after_text += "\r\n";
            } 
            else {
              after_finished = true;
            }
          }
        }
      }
      while ((!before_finished || !selection_finished || !after_finished));
      // Untrimmed success test to make sure our results match what is actually in the textarea
      // This can be removed once you’re confident it’s working correctly
      //var untrimmed_text = untrimmed_before_text + untrimmed_selection_text + untrimmed_after_text;
      //var untrimmed_successful = false;
      //if (textarea.value == untrimmed_text) {
      //  untrimmed_successful = true;
      //}
      // ** END Untrimmed success test
      var startPoint = untrimmed_before_text.length;
      return startPoint;
    }
  }
}






pui.widgets.add({
  name: "text area",
  tag: "textarea",

  propertySetters: {
  
    "field type": function(parms) {
      parms.dom.value = parms.evalProperty("value");
      if (parms.oldDom.maxLength && parms.dom.maxLength != parms.oldDom.maxLength) {
        parms.dom.maxLength = parms.oldDom.maxLength;
      }
      if (parms.oldDom.originalMaxLength) parms.dom.originalMaxLength = parms.oldDom.originalMaxLength;
      if (parms.oldDom.related) parms.dom.related = parms.oldDom.related; 
      if (parms.oldDom.lineLengths) parms.dom.lineLengths = parms.oldDom.lineLengths;
      if (context == "dspf" && !parms.design) {
        addEvent(parms.dom, "keydown", function(event) {
          event = event || window.event;
          var key = event.keyCode;
          if (key == 13) {  // enter
            event.cancelBubble = true;
          }
        });
      }
    },
    
    "value": function(parms) {
      parms.dom.value = parms.value;
    }
  
  }
  
});

