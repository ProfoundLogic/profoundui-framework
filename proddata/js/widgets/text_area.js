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
 * Event handler for textarea change and paste events. Make sure the text fits inside the bounds set when the textarea 
 * has maximum lengths per line, as set by the JSON, which would be set from field lengths server side.
 * When pasting, the newlines should be preserved, even if lines are wrapped.
 * Test cases: see Issue 4766.
 * @param {Event|Object} e
 * @returns {undefined}
 */
pui.textArea_cleanUp = function(e) {
  var obj = getTarget(e);
  //An array of strings with numbers indicating the allowed length of each line. index 0 is the first line, etc.
  var lineLengths = obj.lineLengths;
  if (lineLengths == null) return;
  var val = obj.value;
  var len = val.length;
  // A model of the green-screen fields. Array of strings that is used to wrap and fit the text in the textarea.
  var lines = [];
  
  lines.push("");
  var curLine = 0;    //Tracks which string in the "lines" model that characters are added to.
  var cursorPos = textArea_getCursorPosition(obj);
  var origCursorPos = cursorPos;
  if (!e) e = window.event;
  var key = e.which;
  if (!key) key = e.keyCode;
  var ename = e.type;
  if (ename == "keydown" && key == 17) obj.controlKeyDown = true;
  if (ename == "keyup") obj.controlKeyDown = false;
    
  // Handle paste differently than what happens with user typing, because ACS does things that way.
  // This tries to handle pasting similarly to ACS while still making sense for web input. Issue 4766.
  if (ename == "paste"){
    e.preventDefault();
    e.stopPropagation();
    var paste = (e.clipboardData || window.clipboardData).getData("text");
    if (paste == null || paste.length == 0) return false;
    paste = paste.replace(/\r/g, "");  //remove all CR.
    paste = paste.replace(/\t/g, " "); //replace tabs with spaces.
    if (paste.length == 0) return;
    // Replaces selected text or inserts text at the cursor when there is no selection.
    // (.selectionStart|End Require IE9 or newer standard browser.)
    val = val.substr(0, obj.selectionStart) + paste + val.substr(obj.selectionEnd);
    len = val.length;
    
    // Pre-process: split text by words, preserve \n, ignore \r, replace \t with space.      
    var words = [];
    var startpos = 0;
    for (var i=0; i < len; i++){
      var ch = val.substr(i,1);
      if (ch == "\n" || ch == " "){
        if (startpos < i){
          words.push( val.substring(startpos, i) );   //There was a previous word; queue it.
        }
        startpos = i + 1;     //The next word starts after this position.
        words.push(ch);       //The space is a word.
      }
      else if (i == len - 1 && startpos < len){
        words.push( val.substring(startpos) ); //At end of the string; paste the word.
      }
    }
    
    var curword = 0;
    var atStartOfLine = true;
    // Look at each word. Populate the model of fields with the words. Wrap when necessary.
    while (curword < words.length){
      var curLineLengthMax = parseInt(lineLengths[curLine],10); //lineLengths are strings. Assume they parse.
      if (words[curword] == "\n"){
        if (!madeNewLine()) break;
        atStartOfLine = true;
        curword++;
      }
      else if (words[curword] == " "){
        // If there is room left on the current line, add the space.
        if (getCurLineLength() < curLineLengthMax ){
          lines[curLine] += " ";
          atStartOfLine = false;
        }
        else{   // Else, it is ignored. But a new line is begun.
          if (!madeNewLine()) break;
          atStartOfLine = true;
        }
        curword++;
      }
      else{ //The word is more than a whitespace character.
        var curLineLength = getCurLineLength();
        if (curLineLength + words[curword].length <= curLineLengthMax){   //If space is available.
          //Add the word to the line
          lines[curLine] += words[curword];
          curword++;
          atStartOfLine = false;
        }
        else{   //No space for the word is available on this line.
          if (atStartOfLine){
            var bigword = words[curword];
            words.splice(curword, 1 );  //Remove the big word.
            var splitat = 0;
            var addcount = 0;   // Used so each added word is inserted after the previous.
            // Split the big word up and add it to the list of words until it's all there.
            while (splitat < bigword.length){
              words.splice(curword + addcount, 0, bigword.substr(splitat, curLineLengthMax) );  //Insert part of the word.
              splitat += curLineLengthMax;
              addcount++;
            }
            // The loop will start over on the new word.
          }
          else{ //Start a new line. The next loop iteration will handle it.
            if (!madeNewLine()){
              //There are no more lines. Add as many characters as will fit.
              var roomonline = curLineLengthMax - curLineLength;
              lines[curLine] += words[curword].substr(0, roomonline);
              break;
            }
            atStartOfLine = true;
          }
        }
      }
    }
  } //done handling paste.

  if (key == 8 && ename == "keyup") return;
  if (key == 8 && ename == "keydown" && cursorPos > 0) {  // backspace
    if (pui["is_ie"] && val.length < cursorPos) cursorPos = val.length;
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
  var cursorLine;         //Gets the last line number in the model.
 
  if (ename != "paste"){  //Wrapping when typing is different than wrapping when pasting.
    // Look at each character in the field. Populate the model of fields with the text-area data. Wrap when necessary.
    for (var i = 0; i < len; i++) {
      var ch = val.substr(i, 1);
      if (ch == "\n" || ch == "\r") {
        if (i < origCursorPos) cursorPos = cursorPos - 1;  //Shrink the length by one; \r and \n are not part of the text.
        if (ch == "\n") {
          if (!merge) {
            if (!madeNewLine()) break;
          }
          merge = false;
        }
      }
      else {
        if (getCurLineLength() >= lineLengths[curLine] ) {  // The current line has no more space.
          if (!madeNewLine()) break;
          // Skips the next newline. Necessary when typing will shift things past the end of the line.
          merge = true;
        }
        lines[curLine] += ch;
      }
      if (origCursorPos == i) {
        cursorLine = curLine;
      }
    } //end for
  }
  
  if (origCursorPos == len) {
    cursorLine= curLine;
  }
  var newVal = "";
  for (var i = 0; i <= curLine; i++) {
    newVal += lines[i];
    if (i != curLine) {
      newVal += "\n";
      //Move cursor past the newline. Don't do for paste, because cursor stays put then.
      if (newVal.length-1 < cursorPos && ename != "paste") cursorPos += 1;
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
  
  // Length of the latest line being built.
  function getCurLineLength(){
    // If the current line we're on is from a unicode field of type "G" use the actual length...
    if (obj.related[curLine].fieldInfo["DBCSDataType"] && obj.related[curLine].fieldInfo["DBCSDataType"] == "G") {
      return lines[curLine].length;
    }
    return getEBCDICByteCount(lines[curLine]);
  }
  
  // Makes a new line for wrapping or returns false when there are no lines available.
  function madeNewLine(){
    if (curLine >= lineLengths.length - 1) {
      return false;
    }
    curLine++;
    lines.push("");
    return true;
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
              selection_range.moveEnd("character", -1);
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
              after_range.moveEnd("character", -1);
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
        // This can be removed once you�re confident it�s working correctly
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
  } //end textArea_getCursorPosition().
  
};  //end of pui.textArea_cleanUp().

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
      if (parms.design)
        parms.dom.spellcheck = false;
      // Retain default browser behavior unless the user sets this...
      else if (typeof pui["allow spellcheck"] == "boolean")
        parms.dom.spellcheck = pui["allow spellcheck"];
    },
    
    "value": function(parms) {
      parms.dom.value = parms.value;
    }
  
  }
  
});

