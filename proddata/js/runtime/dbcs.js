

// Determines whether a Unicode Javascript character is in an EBCDIC DBCS range.
function inDBCSRange(code) {
	
	if ((code >= 19968 && code <= 40959) || // Traditional Chinese U+4E00-U+9FFF
		(code >= 19968 && code <= 40895) || // Japanese Kanji U+4E00-U+9FBF
		(code >= 12352 && code <= 12447) || // Japanese Hiragana U+3040-U+309F
		(code >= 12448 && code <= 12543) || // U+30A0-U+30FF  Japanese Katakana
		(code >= 44032 && code <= 55203) || // U+AC00-U+D7A3 Korean Hangul
		(code >= 4352 && code <= 4607)   || // U+1100-U+11FF Korean Hangul
		(code >= 12593 && code <= 12686) || // U+3131-U+318E Korean Hangul
		(code >= 65441 && code <= 65500)) { // U+FFA1-U+FFDC Korean Hangul	
		return true;
	}
	else {
		return false;
	}
}

// Determines how many bytes are needed to represent the given Unicode character string in EBCDIC.
function getEBCDICByteCount(charString) {
	var dbcs = false;
	var count = 0;
	for (var i = 0; i < charString.length; i++) {
		// DBCS
		if (inDBCSRange(charString.charCodeAt(i)) == true) {
			if (dbcs == false) count++; // Account for shift character when starting DBCS section.
			dbcs = true;
			count += 2;
		}
		// SBCS
		else {
			if (dbcs == true) count++; // Account for shift character when ending DBCS section.
			dbcs = false;
			count++;
		}
	}
	if (dbcs == true) count++; // Add last shift character if we end in DBCS.
	return count;
    
}

// Prevents "blur-ing" field if the EBCDIC byte count of its data will overrun the amount available.
function validateByteCount(event, field) {
	if (field == null) {
		event = event || window.event;
		field = event.target || event.srcElement;		
	}
	if (field.type != "text" && field.type != "password" && field.type != "number") return;
	if (field.choices != null) return;
	if (getEBCDICByteCount(rtrim(field.value)) > field.maxLength) {
		if (field == null) {
			event.cancelBubble = true;
			event.returnValue = false;
			if (event.preventDefault) event.preventDefault();
			if (event.stopPropagation) event.stopPropagation();
		}	
		removeEvent(field, "blur", validateByteCount);	
		pui.alert("Input data exceeds the field length.");
		addEvent(field, "blur", validateByteCount);
		// Necessary to call this on timer to avoid weird event behavior in FF3.
		setTimeout(function () { field.focus();
		}, 100);
		return false;
	}
	
}



