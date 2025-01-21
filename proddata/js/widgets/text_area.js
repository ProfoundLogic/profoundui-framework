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
 * Event handler for textarea change and paste events. Make sure the text fits inside the bounds set when the textarea
 * has maximum lengths per line, as set by the JSON, which would be set from field lengths server side.
 * When pasting, the newlines should be preserved, even if lines are wrapped.
 * Test cases: see Issues 4766, 5014.
 * @param {Event|Object} e
 * @returns {undefined}
 */
pui.textArea_cleanUp = function(e) {
  var i; // loop iterator
  var ch;
  var obj = getTarget(e);
  if (obj.lineLengths == null) return;

  // An array indicating the allowed length of each line.
  var lineLengths = [];
  for (i = 0; i < obj.lineLengths.length; i++) { // Parse all string values from lineLengths.
    lineLengths[i] = parseInt(obj.lineLengths[i], 10);
    if (isNaN(lineLengths[i])) lineLengths[i] = 0;
  }

  var val = obj.value;
  var len = val.length;
  // A model of the green-screen fields. Array of strings that is used to wrap and fit the text in the textarea.
  var lines = [];
  var valPart1;
  var valPart2;

  lines.push("");
  var curLine = 0; // Tracks which string in the "lines" model that characters are added to.
  var cursorPos = getCursorPosition(obj);
  var origCursorPos = cursorPos;

  if (!e) e = window.event;
  var key = e.which;
  if (!key) key = e.keyCode;
  var ename = e.type;
  if (ename == "keydown" && key == 17) obj.controlKeyDown = true;
  if (ename == "keyup") obj.controlKeyDown = false;

  // Handle paste differently than what happens with user typing, because ACS does things that way.
  // This tries to handle pasting similarly to ACS while still making sense for web input. Issue 4766.
  if (ename == "paste") {
    e.preventDefault();
    e.stopPropagation();
    var paste = (e.clipboardData || window.clipboardData).getData("text");
    if (paste == null || paste.length == 0) return false;
    // Pre-process: preserve \n, ignore \r, replace \t with space.
    paste = paste.replace(/\r/g, ""); // remove all CR.
    paste = paste.replace(/\t/g, " "); // replace tabs with spaces.
    if (paste.length == 0) return;
    // Replaces selected text or inserts text at the cursor when there is no selection.
    val = val.substr(0, obj.selectionStart) + paste + val.substr(obj.selectionEnd);
    len = val.length;

    wrapwords();
  }

  // Handle backspace on keydown. Removes \n, then \r, then the character before those. Note: this manually changes the textarea
  // value; when character keys or the Delete key are pressed, then the change to the textarea value is visible on "input" and
  // "keyup". The browser handles Delete by removing a character.
  if (key == 8 && ename == "keyup") return;

  // When deleting doesn't add new lines, don't skip '\n' when Delete/Backspace were pressed.
  var erasing = key == 8;
  // var erasingSplitAdjust = 0; // Long text shouldn't be split up at the newlines.
  if (key == 8 && ename == "keydown" && cursorPos > 0) { // backspace
    if (pui["is_ie"] && val.length < cursorPos) cursorPos = val.length;

    // Case where there is a selection (text is selected by the user)
    if (cursorPos === obj.selectionStart && cursorPos < obj.selectionEnd) {
      valPart1 = val.slice(0, cursorPos - 1);
      valPart2 = val.slice(obj.selectionEnd);

      // Clean up unwanted newlines, combine the two parts and adjust cursor position for the backspace
      valPart2 = valPart2.replace(/(?<!\n)\n(?!\n)/g, "");
      valPart2 = valPart2.replace(/\n{3,}/g, "\n\n");
      val = valPart1 + valPart2;
      cursorPos = cursorPos - 1;
    }
    else {
      var cursorChar = val.substr(cursorPos - 1, 1);

      // If not on a newline, remove one character
      if (cursorChar !== "\n" && cursorChar !== "\r") {
        valPart1 = val.slice(0, cursorPos - 1);
        valPart2 = val.slice(cursorPos);
        valPart2 = valPart2.replace(/(?<!\n)\n(?!\n)/g, "");
        valPart2 = valPart2.replace(/\n{3,}/g, "\n\n");
        val = valPart1 + valPart2;
      }

      // If the cursor is on a newline, we need to merge lines correctly
      if (cursorChar === "\n" || cursorChar === "\r") {
        valPart1 = val.slice(0, cursorPos - 1);
        valPart2 = val.slice(cursorPos);
        valPart2 = valPart2.replace(/(?<!\n)\n(?!\n)/g, "");
        valPart2 = valPart2.replace(/\n{3,}/g, "\n\n");
        val = valPart1 + valPart2;
      }

      cursorPos = cursorPos - 1;
    }

    // Prevent the default backspace action (deleting only one character)
    if (e.preventDefault) e.preventDefault();
    if (e.stopPropagation) e.stopPropagation();
    e.cancelBubble = true;
    e.returnValue = false;

    // Update the original cursor position
    origCursorPos = cursorPos;
  }
  // Make sure NL are not skipped when Del was typed and 'input' handles wrap. 'input' events don't know what key was typed.
  else if (key == 46 && ename == "keydown") {
    obj.doNotSkipNL = true;
    if (cursorPos <= lineLengths[0]) {
      obj.erasingSplitAdjust = true;
    }
  }
  else if (key == 46 && ename == "keyup") {
    delete obj.doNotSkipNL;
    delete obj.erasingSplitAdjust;
  }
  else if (ename == "input") {
    erasing = obj.doNotSkipNL === true;
    // erasingSplitAdjust = obj.erasingSplitAdjust === true ? 1 : 0;
  }
  // done handling backspace and delete.

  if (key == 13 && ename == "keydown") { // enter
    // Split the value based on the cursor position
    valPart1 = val.slice(0, cursorPos);
    valPart2 = val.slice(cursorPos);
    valPart2 = valPart2.replace(/(?<!\n)\n(?!\n)/g, "");
    valPart2 = valPart2.replace(/\n{3,}/g, "\n\n");

    // Check if adding a newline would exceed the line limit or boundaries
    var lineCount = 0;
    for (i = 0; i < valPart1.length; i++) {
      if (valPart1.charAt(i) == "\n") lineCount++;
    }

    // If we've reached the line limit, prevent adding a newline
    if (lineCount >= lineLengths.length) {
      // Prevent the default Enter key behavior (i.e., adding a newline)
      if (e.preventDefault) e.preventDefault();
      if (e.stopPropagation) e.stopPropagation();
      e.cancelBubble = true;
      e.returnValue = false;
      return; // Exit early to avoid adding the newline
    }

    // Add a newlines to valPart1, as long as it's within line boundary limits
    valPart1 += "\n\n";
    val = valPart1 + valPart2;

    // Prevent the default behavior of the Enter key
    if (e.preventDefault) e.preventDefault();
    if (e.stopPropagation) e.stopPropagation();
    e.cancelBubble = true;
    e.returnValue = false;

    // Update the cursor position after inserting the newline
    origCursorPos = cursorPos + 2;
  }

  //
  // Handle wrapping when user is typing.
  //
  var cursorLine; // Gets the line number in the model where the cursor was. Helps prevent overfill.

  // When the field uses CNTFLD the field should word wrap on client-side. (The server doesn't add a "wrapped" property in the JSON response for CNTFLD.)
  var isContinuedEntryField = obj.related != null && obj.related[0] != null && obj.related[0].fieldInfo != null && obj.related[0].fieldInfo["wrapped"] !== true;
  var isLongSpecialCase = false;

  // Wrap by word. Note: because val is manually changed on Backspace, we must handle that change on keydown and key 8.
  //   Listen on 'input' instead of 'keyup' to solve when holding a key down would corrupt the value.
  if (isContinuedEntryField && (ename == "input" || (ename == "keydown" && key == 8) || (ename === "keydown" && key === 13))) {
    wrapwords();
    // Determine which line the cursor is on.
    var sum = 0;
    for (i = 0; i < lines.length; i++) {
      if (cursorPos >= sum && cursorPos < (sum + lines[i].length)) {
        cursorLine = i;
        break;
      }
      sum += lines[i].length;
    }
    if (cursorPos == sum) cursorLine = lines.length - 1;
  }
  // Wrap characters onto new lines. Words may be split across lines.
  else if (ename != "paste") {
    var skipNextNL = false;
    // Look at each character in the field. Populate the model of fields with the text-area data. Wrap characters to new lines when necessary.
    for (i = 0; i < len; i++) {
      ch = val.charAt(i);
      if (ch == "\n" || ch == "\r") {
        if (i < origCursorPos) {
          cursorPos = cursorPos - 1; // Shrink the length by one; \r and \n are not part of the text.
        }
        if (ch == "\n") {
          if (!skipNextNL && (!erasing || getLineLength(curLine) > 0) && !madeNewLine()) break;
          skipNextNL = false;
        }
      }
      else {
        if (getLineLength(curLine) >= lineLengths[curLine]) { // The current line has no more space.
          if (!madeNewLine()) break;
          // Skip NL is necessary when typing will shift things past the end of the line.
          skipNextNL = true;
        }
        lines[curLine] += ch;
      }
      if (origCursorPos == i) {
        cursorLine = curLine;
      }
    } // end for
  }

  if (origCursorPos == len) {
    cursorLine = curLine;
  }

  // Construct newVal from lines
  var newVal = "";
  for (i = 0; i < lines.length; i++) { // Concatenate each line into one string.
    newVal += lines[i];
    // Only add a newline if both the current line and the next line have content
    if (
      i != curLine &&
      lines[i + 1] !== undefined
    ) {
      newVal += "\n";
      // Move cursor past the newline. Don't do for paste, because cursor stays put then. Don't do for special case.
      if (newVal.length - 1 < cursorPos && ename != "paste" && !isLongSpecialCase) {
        cursorPos += 1;
      }
    }
  }

  var oldVal = obj.value.replace(/\r/g, "");
  // Prevent more typing if the text lines are filled to capacity.
  if (ename == "keydown" && !obj.controlKeyDown && !(obj.selectionStart !== obj.selectionEnd) && isNormalKey(key)) {
    if (lines.length >= lineLengths.length && cursorLine != null) {
      var full = true;
      for (i = cursorLine; i < lineLengths.length; i++) {
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

  // Set a new set of rules for the textarea value with related fields.
  if (newVal !== oldVal && obj.related[0] != null && (ename === "paste" || key === 8 || key === 13)) {
    obj.value = newVal;
    setSelectionRange(obj, cursorPos, cursorPos);
  }

  // Set a new set of rules for the textarea value without related fields.
  if (newVal != oldVal && !obj.related) {
    obj.value = newVal;
    setSelectionRange(obj, cursorPos, cursorPos);
  }

  // Returns the length of a line. Usually for the length of the latest line being built, curLine.
  function getLineLength(lineno) {
    // If the current line we're on is from a unicode field of type "G" use the actual length...
    if (obj.related[lineno].fieldInfo["DBCSDataType"] && obj.related[lineno].fieldInfo["DBCSDataType"] == "G") {
      return lines[lineno].length;
    }
    return getEBCDICByteCount(lines[lineno]);
  }

  // Makes a new line for wrapping or returns false when there are no lines available.
  function madeNewLine() {
    if (curLine >= lineLengths.length - 1) {
      return false;
    }
    curLine++;
    lines.push("");
    return true;
  }

  /**
   * Returns true if the key is a character that can be added to the textarea value.
   * @param {Number} key    Event keycode.
   * @returns {Boolean}
   */
  function isNormalKey(key) {
    if (key >= 48 && key <= 90) return true; // 48=0 ..., 57=9, 59=;,  61='=',  65=a ... 90=z
    if (key >= 96 && key <= 111) return true; // numpad: 0 ... * + - . /
    if (key >= 186 && key <= 192) return true; // ; = , - . / `
    if (key >= 219 && key <= 222) return true; // [ \ ] '
    if (key == 32) return true;
    return false;
  }

  function setSelectionRange(inputEl, selStart, selEnd) {
    if (inputEl.setSelectionRange) {
      inputEl.focus();
      inputEl.setSelectionRange(selStart, selEnd);
    }
    else if (inputEl.createTextRange) {
      var range = inputEl.createTextRange();
      range.collapse(true);
      range.moveEnd("character", selEnd);
      range.moveStart("character", selStart);
      range.select();
    }
  }

  function getCursorPosition(textarea) {
    // get selection in firefox, opera, ...
    if (typeof (textarea.selectionStart) == "number") {
      return textarea.selectionStart;
    }
    else if (document.selection) {
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
        var before_finished = false; var selection_finished = false; var after_finished = false;
        var before_text, untrimmed_before_text, selection_text, untrimmed_selection_text, after_text, untrimmed_after_text;
        // Load the text values we need to compare
        before_text = untrimmed_before_text = before_range.text;
        selection_text = untrimmed_selection_text = selection_range.text;
        // eslint-disable-next-line no-unused-vars
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
                // eslint-disable-next-line no-unused-vars
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
                // eslint-disable-next-line no-unused-vars
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
        // This can be removed once you re confident it s working correctly
        // var untrimmed_text = untrimmed_before_text + untrimmed_selection_text + untrimmed_after_text;
        // var untrimmed_successful = false;
        // if (textarea.value == untrimmed_text) {
        //  untrimmed_successful = true;
        // }
        // ** END Untrimmed success test
        var startPoint = untrimmed_before_text.length;
        return startPoint;
      }
    }
  } // end getCursorPosition().

  // Returns array with obj.value split up by words, ' ', and '\n'. (\r and \t should already have been removed.)
  function splitTextByWords() {
    var i; // loop iterator
    var words = [];
    var startpos = 0;
    for (i = 0; i < len; i++) {
      var ch = val.charAt(i);
      if (ch == "\n" || ch == " ") {
        if (startpos < i) {
          words.push(val.substring(startpos, i)); // There was a previous word; queue it.
        }
        else if (ch == "\n") {
          words.push("");
        }
        startpos = i + 1; // The next word starts after this position.
        words.push(ch); // The space is a word.
      }
      else if (i == len - 1 && startpos < len) {
        words.push(val.substring(startpos)); // At end of the string; paste the word.
      }
    }

    if (ename != "paste") {
      // Look for words that could fill a line. Assume CNTFLD have line lengths all the same.
      // Note: '\n' are added to textarea.value to cause wrapping, potentially splitting big words.
      for (i = 0; i < words.length; i++) {
        var lineLength = lineLengths[0];
        erasingSplitAdjust = 0; // Only adjust for first line.
        if (words.length > i + 2) {
          // If this word fills a line, and the next word is not space, then merge the next word into this one.
          if (words[i].length >= lineLength && words[i + 1] === "\n" && words[i + 2] !== " " && words[i + 2] !== "\n") {
            words[i] += words[i + 2]; // Add next word to current.
            words.splice(i + 1, 2); // Remove the NL; the user didn't add it. Also remove next word.
            i--; // In case word is very long, repeat this check on the next word.
          }
        }
      }
    }
    return words;
  }

  // Populates "lines" with words, wrapping when necessary.
  function wrapwords() {
    // var roomonline;
    var words = splitTextByWords();
    var charAddCount = 0; // Track what characters have been added so that cursorPos and cursorLine can be adjusted.
    var skipNextNL = false;
    // var atStartOfLine = true;
    var pasting = ename == "paste";
    // Look at each word. Populate the model of fields with the words. Wrap when necessary.
    while (words.length > 0) {
      if (words[0] == "\n") {
        // Handle newlines
        if (!skipNextNL) {
          if (!madeNewLine()) break; // Adjusted to handle the new return value
        }
        skipNextNL = false;
        words.shift();
        if (charAddCount < cursorPos) {
          cursorPos--;
        }
      }
      else if (words[0] == " ") {
        // Handle spaces
        var lineHasRoom = getLineLength(curLine) < lineLengths[curLine];
        if (!lineHasRoom) {
          if (!madeNewLine()) break;
          if (!erasing && !pasting) skipNextNL = true;
          // atStartOfLine = true;
        }
        if ((lineHasRoom || !pasting) && words[1] !== "\n") {
          lines[curLine] += " ";
          // atStartOfLine = false;
        }
        else if (lineHasRoom && words[1] == "\n") {
          madeNewLine();
        }
        charAddCount++;
        words.shift();
      }
      else {
        var curLineLength = getLineLength(curLine);
        var wordLength = words[0].length;
        var lineLimit = lineLengths[curLine];
        // Handle words
        if (curLineLength + wordLength <= lineLimit) {
          // Word fits on the current line
          lines[curLine] += words[0];
          // atStartOfLine = false;
          charAddCount += wordLength;
          words.shift();
        }
        else {
          // Word doesn't fit on the current line
          if (erasing && curLineLength + wordLength <= lineLimit) {
            // During erasing, if the word fits on the current line, keep it here
            lines[curLine] += words[0];
            // atStartOfLine = false;
            charAddCount += wordLength;
            words.shift();
          }
          else if (wordLength <= lineLimit) {
            // Word fits on the next line
            if (!madeNewLine()) {
              // No more lines
              break;
            }
            lines[curLine] += words[0];
            // atStartOfLine = false;
            charAddCount += wordLength;
            words.shift();
          }
          else {
            // Word is longer than line length, need to split it
            var spaceLeft = lineLimit - curLineLength;
            lines[curLine] += words[0].substr(0, spaceLeft);
            words[0] = words[0].substr(spaceLeft);
            charAddCount += spaceLeft;
          }
        }
      }
    }
    if (ename == "paste") cursorPos = origCursorPos; // cursor stays put for paste.
  } // end wrapwords()
}; // end of pui.textArea_cleanUp().

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
          if (key == 13) { // enter
            event.cancelBubble = true;
          }
        });
      }
      if (parms.design) {
        parms.dom.spellcheck = false;
      }
      // PUI-425: Add an event listener to focus the input content when click.
      // PJS-1070: Add !inDesignMode() in the condition to ensure that this block only executes at runtime.
      if (context == "dspf" && !inDesignMode()) {
        addEvent(parms.dom, "click", function(e) {
          if (pui["highlight on focus"]) {
            e.target.focus();
            e.target.select();
          }
        });
      }
      // Retain default browser behavior unless the user sets this...
      else if (typeof pui["allow spellcheck"] == "boolean") {
        parms.dom.spellcheck = pui["allow spellcheck"];
      }
    },

    "value": function(parms) {
      parms.dom.value = parms.value;
    }

  },

  globalAfterSetter: function(parms) {
    if (parms.propertyName == "field type" && parms.oldDom && parms.oldDom.floatingPlaceholder != null && parms.dom && parms.dom.floatingPlaceholder == null) {
      pui.floatPlaceholder(parms.dom);
    }

    if (parms.dom && parms.dom.floatingPlaceholder != null) {
      pui.movePropertiesFromFloatingPlaceholderDiv(parms);
    }
  }

});
