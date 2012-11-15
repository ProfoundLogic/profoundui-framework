pui.formatting = {
  Date: {
    formats: { locales: {} },
    parsers: { locales: {} },
    getFormatCode: function(chr, locale) {
      switch(chr){
        case 'n': return '(date.getMonth()+1)';
        case 'm': return 'pui.formatting.leftPad(date.getMonth()+1, 2, "0")';
        case 'M': return 'pui.locales["' + locale +'"].shortMonthNames[date.getMonth()]';
        case 'F': return 'pui.locales["' + locale + '"].monthNames[date.getMonth()]';
        case 'j': return 'date.getDate()';
        case 'd': return 'pui.formatting.leftPad(date.getDate(), 2, "0")';
        case 'S': return 'pui.formatting.Date.getSuffix(date.getDate())';
        case 'D': return 'pui.locales["' + locale + '"].shortDayNames[date.getDay()]';
        case 'l': return 'pui.locales["' + locale + '"].dayNames[date.getDay()]';
        case 'y': return 'pui.formatting.leftPad("" + date.getFullYear(), 4, "0").slice(2)';
        case 'Y': return 'pui.formatting.leftPad(date.getFullYear(), 4, "0")';
        case 'g': return '((date.getHours() % 12) ? date.getHours() % 12 : 12)';
        case 'G': return 'date.getHours()';
        case 'h': return 'pui.formatting.leftPad((date.getHours() % 12) ? date.getHours() % 12 : 12, 2, "0")';
        case 'H': return 'pui.formatting.leftPad(date.getHours(), 2, "0")';
        case 'R': return '(pui.formatting.Date.isMidnight(date) ? "24" : pui.formatting.leftPad(date.getHours(), 2, "0"))';
        case 'i': return 'pui.formatting.leftPad(date.getMinutes(), 2, "0")';
        case 's': return 'pui.formatting.leftPad(date.getSeconds(), 2, "0")';
        case 'u': return 'pui.formatting.leftPad(date.getMilliseconds(), 3, "0")';
        case 'a': return '(date.getHours() < 12 ? "am" : "pm")';
        case 'A': return '(date.getHours() < 12 ? "AM" : "PM")';
        case 'z': return 'pui.formatting.leftPad(Math.ceil((date - (new Date(date.getFullYear(), 0, 1)))/86400000)+1, 3, "0")';
        default: return '"' + chr.replace(/('|\\|"|\.)/, '\\$1') + '"'; //"
      }
    },
    getParseObj: function(chr, matchIndex, locale) {
      /*  returns an object with the following properties:
          {  
            r: string representation of the regular expression capturing group to match,
            c: the code to get the parsed value from the string once the full regular expression match is executed
            g: group count. helps keep track of match index. 1 for a capturing group, 0 for non-capturing (?:foo)
          }
      */
      switch(chr){
        case 'n': return { r: '(\\\\d{1,2})', c: 'm = parseInt(matches[' + matchIndex + '], 10) - 1;', g: 1 };
        case 'm': return { r: '(\\\\d{2})', c: 'm = parseInt(matches[' + matchIndex + '], 10) - 1;', g: 1 };
        case 'M': return { r: '(' + pui.locales[locale]['shortMonthNames'].join('|') + ')', c: 'm = pui.formatting.Date.getMonthNum(matches[' + matchIndex + '], "' + locale + '", true);', g: 1 };
        case 'F': return { r: '(' + pui.locales[locale]['monthNames'].join('|') + ')', c: 'm = pui.formatting.Date.getMonthNum(matches[' + matchIndex + '], "' + locale + '", false);', g: 1 };
        case 'j': return { r: '(\\\\d{1,2})', c: 'd = parseInt(matches[' + matchIndex + '], 10);', g: 1 };
        case 'd': return { r: '(\\\\d{2})', c: 'd = parseInt(matches[' + matchIndex + '], 10);', g: 1 };
        case 'S': return { r: '(?:st|nd|rd|th)', c: '', g: 0 };
        case 'D': return { r: '(?:' + pui.locales[locale]['shortDayNames'].join('|') + ')', c: '', g: 0 };
        case 'l': return { r: '(?:' + pui.locales[locale]['dayNames'].join('|') + ')', c: '', g: 0 };
        case 'y': return { r: '(\\\\d{2})', c: 'y = parseInt(matches[' + matchIndex + '], 10); y += (y > pui.formatting.Date.y2k ? 1900 : 2000);', g: 1 };
        case 'Y': return { r: '(\\\\d{4})', c: 'y = parseInt(matches[' + matchIndex + '], 10);', g: 1 };
        case 'g': return { r: '(\\\\d{1,2})', c: 'h = parseInt(matches[' + matchIndex + '], 10);', g: 1 };
        case 'G': return { r: '(\\\\d{1,2})', c: 'h = parseInt(matches[' + matchIndex + '], 10);', g: 1 };
        case 'h': return { r: '(\\\\d{1,2})', c: 'h = parseInt(matches[' + matchIndex + '], 10);', g: 1 };
        case 'H': return { r: '(\\\\d{1,2})', c: 'h = parseInt(matches[' + matchIndex + '], 10);', g: 1 };
        case 'R': return { r: '(\\\\d{1,2})', c: 'h = parseInt(matches[' + matchIndex + '], 10);', g: 1 };
        case 'i': return { r: '(\\\\d{2})', c: 'i = parseInt(matches[' + matchIndex + '], 10);', g: 1 };
        case 's': return { r: '(\\\\d{2})', c: 's = parseInt(matches[' + matchIndex + '], 10);', g: 1 };
        case 'u': return { r: '(\\\\d{3})', c: 'u = parseInt(matches[' + matchIndex + '], 10);', g: 1 };
        case 'a': return { r: '(am|pm)', c: 'if(matches[' + matchIndex + '] == "am"){ if(h == 12) h = 0; }else if(h < 12) h += 12;', g: 1 };
        case 'A': return { r: '(AM|PM)', c: 'if(matches[' + matchIndex + '] == "AM"){ if(h == 12) h = 0; }else if(h < 12) h += 12;', g: 1 };
        case 'z': return { r: '(\\\\d{1,3})', c: 'd = parseInt(matches[' + matchIndex + '], 10);', g: 1 };
        default: return { r: chr.replace(/('|\\|"|\.)/, '\\\\$1'), c: '', g: 0 }; // '
      }
    },
    parse: function(str, format, locale) {
      if(!(pui.formatting.Date.parsers.locales[locale] && pui.formatting.Date.parsers.locales[locale][format])){
        pui.formatting.Date.newParser(format, locale);
      }
      return pui.formatting.Date.parsers.locales[locale][format](str);
    },
    newFormat: function(format, locale) {
      var esc = false;
      var chr = '';
      var fn = 'return ';
      for(var i=0; i<format.length; i++){
        chr = format.charAt(i);
        if(!esc && chr == '\\'){ // 
          esc = true;
        }
        else if(esc) {
          fn += '"' + chr.replace(/('|\\|")/g, '\\$1') + '" + '; // "
          esc = false;
        }
        else{
          fn += pui.formatting.Date.getFormatCode(chr, locale) + ' + "" + ';
        }
      }
      fn = fn.replace(/\+\s$/, '') || '""'; // remove trailing + and [space]
      fn += ';';
      if(!pui.formatting.Date.formats.locales[locale]){
        pui.formatting.Date.formats.locales[locale] = {};
      }
      
      pui.formatting.Date.formats.locales[locale][format] = new Function('date', fn);
    },
    newParser: function(format, locale) {
      var esc = false;
      var chr = '';
      var regex = '';
      var code = '';
      var matchIndex = 1;
                
      for(var i=0; i<format.length; i++){
        chr = format.charAt(i);
        if(!esc && chr == '\\'){
          esc = true;
        }
        else if(esc){
          regex += chr.replace(/('|\\)/g, '\\$1');   // '
          esc = false;
        }
        else{
          var parseObj = pui.formatting.Date.getParseObj(chr, matchIndex, locale);
          matchIndex += parseObj.g;
          regex += parseObj.r;
          code += parseObj.c;
        }
      }
      
      var fn = 'var y = 1, m = 0, d = 1; \
        var h = 0, i = 0, s = 0, u = 0; \
        var regexObj = new RegExp("^' +
        regex +
        '$"); \
        var matches = str.match(regexObj); \
        if(matches && matches.length > 0){' +
        code +
        'var dt = new Date(y, m, d, h, i, s, u); \
        dt.setFullYear(y);' +
        
        //strict validation: prevent date rollover
        'if(dt.getFullYear() !== y || dt.getMonth() !== m || dt.getDate() !== d ||  \
        dt.getHours() !== h || dt.getMinutes() !== i || dt.getSeconds() !== s) \
        return null;' +
        
        'return dt; \
        }else return null;';
        
      if(!pui.formatting.Date.parsers.locales[locale]){
        pui.formatting.Date.parsers.locales[locale] = {};
      }
      
      pui.formatting.Date.parsers.locales[locale][format] = new Function('str', fn);
    },
    getSuffix: function(day) {
      switch(day){
        case 1:
        case 21:
        case 31:
          return 'st';
        case 2:
        case 22:
          return 'nd';
        case 3:
        case 23:
          return 'rd';
        default:
          return 'th';
      } 
    },
    getMonthNum: function(month, locale, abbrev) {
      var months;
      if(abbrev){
        months = pui.locales[locale].shortMonthNames;
      }
      else {
        months = pui.locales[locale].monthNames;
      }
      for(var i=0; i<12; i++){
        if(months[i] == month){
          return i;
        }
      }
      return 0;
    },
    isMidnight: function(d) {
      return (d.getHours() === 0 &&
              d.getMinutes() === 0 &&
              d.getSeconds() === 0 &&
              d.getMilliseconds() === 0);
    },
    stdDatePattern: 'Y-m-d',
    stdTimePattern: 'H:i:s',
    stdTimeStampPattern: 'Y-m-d-H.i.s.uu',
    y2k: 39 //RPG's standard cutoff for dates with 2 digit year.
  },
  leftPad: function(str, len, chr) {
    str += '';
    while(str.length < len){
      str = chr + str;
    }
    return str;
  },
  rightPad: function(str, len, chr) {
    str += '';
    while(str.length < len){
      str += chr;
    }
    return str;
  },
  isNumericType: function(dataType) {
    return (/^(?:zoned|floating|packed)$/).test(dataType);
  },
  encodeGraphic: function(text, fieldLength) {
  	// Blank pad field to full length.
  	while (text.length < fieldLength) {
  		text += " ";
  	}
    // encode
  	var encoded = "";
  	for (var i = 0; i < text.length; i++) {  
  		var charCode = text.charCodeAt(i);
  		if (charCode > 0xFFFF) {
  			// Character is outside of UCS-2 (fixed 2-byte encoding) range.
  			return { msg: "Characters are outside of UCS-2 range." };
  		}
  		// Hex digits MUST be uppercased.
  		charCode = charCode.toString(16).toUpperCase();
  		// Hex codes MUST have all leading zeros.
  		while (charCode.length < 4) {
  			charCode = "0" + charCode;
  		}  
  		encoded += charCode;
  	}
  	return encoded;
  },
  decodeGraphic: function(input) {
 
    var output = ""; 
    for (var i = 0; i < input.length; i += 4) {
      output += String.fromCharCode(parseInt(input.substr(i, 4), 16));
    }
    return output;
  
  },
  keywords: {
    DATFMT: {
      '*JOB': { pattern: 'Ymd', defaultSep: '-' },
      '*MDY': { pattern: 'mdy', defaultSep: '/' },
      '*DMY': { pattern: 'dmy', defaultSep: '/' },
      '*YMD': { pattern: 'ymd', defaultSep: '/' },
      '*JUL': { pattern: 'yz', defaultSep: '/' },
      '*ISO': { pattern: 'Ymd', defaultSep: '-' },
      '*USA': { pattern: 'mdY', defaultSep: '/' },
      '*EUR': { pattern: 'dmY', defaultSep: '.' },
      '*JIS': { pattern: 'Ymd', defaultSep: '-' }
    },
    DATSEP: {
      '*JOB': '/',
      '/': '/',
      '-': '-',
      '.': '.',
      ',': ',',
      ' ': ' '
    },
    TIMFMT: {
      '*HMS': { pattern: 'Ris', defaultSep: ':' },
      '*ISO': { pattern: 'Ris', defaultSep: '.' },
      '*USA': { pattern: 'hi A', defaultSep: ':' },
      '*EUR': { pattern: 'Ris', defaultSep: '.' },
      '*JIS': { pattern: 'Ris', defaultSep: ':' }
    },
    TIMSEP: {
      '*JOB': ':',
      ':': ':',
      '.': '.',
      ',': ',',
      ' ': ' '
    }
  },
  escapeRe: (function() {
    var re = /([\.\*\+\?\^\$\{\}\(\)\|\-\[\]\/\\])/g;
    return function(str) {
      return str.replace(re, '\\$1');
    };
  })()
};

Date.prototype.format = function(str, locale) {
  
  if(!(pui.formatting.Date.formats.locales[locale] && pui.formatting.Date.formats.locales[locale][str])){
    pui.formatting.Date.newFormat(str, locale);
  }
  
  return pui.formatting.Date.formats.locales[locale][str](this);

};

pui.FieldFormat = {
  format: function(obj) {
    if (obj.revert) {
      var value = null;
      if (typeof pui["validate"] == "function") {
        value = pui["validate"](obj);
      }
      if (value == null || value == false) {
        value = this[obj.formatting].revert(obj);
        if(typeof value === 'object') return value;
        else return value + '';
      }
      else {
        if(typeof value === 'object') return value;
        else return value + '';
      }
    }
    else{
      this.isValidFormat(obj);
      return this[obj.formatting].format(obj) + '';
    }
  },
  "Text": {
    format: function(obj) {
      var value = obj.value + '';

      if (obj.customPattern != "") {
        if (obj.customPattern == "y/m") {
          if (value.length > 2) {
            value = value.substr(0, value.length - 2) + "/" + value.substr(value.length - 2);
          }
        }
      }
      
      if (obj.dataType == "graphic") {
        value = pui.formatting.decodeGraphic(value);
      }

      if(obj.trimTrailing === true || obj.trimTrailing === "true"){
        value = value.replace(/\s+$/g, '');
      }
      else{
        while(value.length < obj.dataLength){
          value += ' ';
        }
      }

      if(obj.trimLeading === true || obj.trimLeading === "true"){
        value = value.replace(/^\s+/g, '');
      }

      if(obj.textTransform == 'uppercase'){
        value = value.toUpperCase();
      }
      else if(obj.textTransform == 'lowercase'){
        value = value.toLowerCase();
      }
      else if(obj.textTransform == 'capitalize'){
        value = value.replace(/(?:^[a-z]| +[a-z])/g, function(str) {
          return str.toUpperCase();
        });
      }

      obj.maxLength = (obj.dataLength == "undefined" ? null : obj.dataLength);
      
      return value;
    },
    revert: function(obj) {
      var value = obj.value + '';
      value = value.replace(/\s+$/g, '');
      if (obj.blankFill == "true" && obj.dataType == "char") {
        var dataLength = Number(obj.dataLength);
        if (!isNaN(dataLength)) {
          value = pui.formatting.leftPad(value, dataLength, " ");
        }
      }      
      if(obj.textTransform == 'uppercase'){
        value = value.toUpperCase();
      }
      else if(obj.textTransform == 'lowercase'){
        value = value.toLowerCase();
      }
      else if(obj.textTransform == 'capitalize'){
        value = value.replace(/(?:^[a-z]| +[a-z])/g, function(str) {
          return str.toUpperCase();
        });
      }
      if (obj.dataType == "graphic") {
        var dataLength = parseInt(obj.dataLength, 10);
        value = pui.formatting.encodeGraphic(value, dataLength);        
      }
      return value;
    }
  },
  "Number": {
    format: function(obj) {
      var commaDecimal = (pui.appJob != null && (pui.appJob["decimalFormat"] == "I" || pui.appJob["decimalFormat"] == "J"));

      var strValue = (obj.value || 0) + '';
      var numValue = parseFloat(strValue, 10) || 0;
      
      var strInt;      
      //scrap everything from decimal point on
      strInt = strValue.replace(/\..*/, '');
      if (strInt == "" && pui.appJob["decimalFormat"] == "J") {
        strInt = "0";
      }
      
      var strDec;
      //scrap everything up to and including decimal point      
      strValueWithDecimalPoint = strValue;
      if (strValueWithDecimalPoint.indexOf(".") == -1) strValueWithDecimalPoint += ".";
      strDec = strValueWithDecimalPoint.replace(/.*\./, ''); 
      
      var dataLength = parseInt(obj.dataLength, 10);
      var decLength = parseInt(obj.decPos, 10);
      var maxLength = dataLength;
      var keyFilter = '[\\d';

      if (obj.edtWrd != null && obj.edtWrd != "") {    
        if(pui.formatting.isNumericType(obj.dataType)) {
          return pui.applyEditWord(obj);
        }
      }

      if (decLength > 0){
        strDec = pui.formatting.rightPad(strDec, decLength, '0');
        strValue = strInt + (commaDecimal ? ',' : '.') + strDec;
        maxLength++;
        if (commaDecimal) keyFilter += ',';
        else keyFilter += '\\.';
      }
      
      if(obj.zeroFill === true || obj.zeroFill === "true"){
        strValue = pui.formatting.leftPad(strValue, dataLength + (decLength ? 1 : 0), '0');
      }
      
      if(obj.numSep === true || obj.numSep === "true"){
        var regex = /(\d+)(\d{3})/;
        while(regex.test(strInt)){
          strInt = strInt.replace(regex, '$1' + (commaDecimal ? '.' : ',') + '$2');
        }
        strValue = strInt + (decLength > 0 ? (commaDecimal ? ',' : '.') + strDec : '');
        if (commaDecimal) keyFilter += '\\.';
        else keyFilter += ',';
        var commaCount = dataLength - decLength - 1;
        commaCount = (commaCount >= 0 ? commaCount : 0);
        maxLength += Math.floor(commaCount / 3);
      }

      //format negative numbers
      var isNegative = numValue < 0;
      strValue = strValue.replace(/-/g, '');
      if(obj.negNum == '(999.00)'){
        if(isNegative){
          strValue = '(' + strValue + ')';
        }
        maxLength += 2;
        keyFilter += '\\(\\)';
      }
      else if(obj.negNum == '999.00-'){
        if (isNegative) {
          strValue += '-';
        }
        else {
          strValue += ' ';
        }
        maxLength++;
        keyFilter += '\\-';
      }
      else if(obj.negNum == '999.00 CR'){
        if(isNegative){
          strValue = strValue + ' CR';
        }
        maxLength += 3;
        keyFilter += 'CR\\s';
      }
      else if(obj.negNum == '-999.00'){
        if(isNegative){
          strValue = '-' + strValue;
        }
        maxLength++;
        keyFilter += '\\-';
      }

      if(obj.curSym){
        if (obj.curSym == "EUR") {
          strValue = strValue + " EUR";
        }
        else if (obj.curSym == "$") {
          if (strValue.substr(0,1) == "-") {
            strValue = "-$" + strValue.substr(1);
          }
          else {
            strValue = obj.curSym + strValue;
          }
        }
        else {
          strValue = obj.curSym + strValue;
        }
        maxLength += obj.curSym.length;
        keyFilter += pui.formatting.escapeRe(obj.curSym);
      }

      if(obj.units){
        strValue += obj.units;
        maxLength += obj.units.length;
        keyFilter += pui.formatting.escapeRe(obj.units);
      }

      if(obj.zeroBalance === false || obj.zeroBalance === "false"){
        if(numValue === 0){
          strValue = '';
        }
      }
      
      keyFilter += ']';
      if (isNaN(maxLength)) maxLength = null;
      obj.maxLength = maxLength;
      obj.keyFilter = new RegExp(keyFilter);

      return strValue;
    },
    revert: function(obj) {
      var commaDecimal = (pui.appJob != null && (pui.appJob["decimalFormat"] == "I" || pui.appJob["decimalFormat"] == "J"));
      var decimalChar = ".";
      if (commaDecimal) decimalChar = ",";
      var value = obj.value + '';
      if (obj.edtWrd != null && obj.edtWrd != null) {
        var originalValue = value;
        value = "";
        for (var i = 0; i < originalValue.length; i++) {
          var ch = originalValue.substr(i,1);
          if ((ch < "0" || ch > "9") && (ch != decimalChar)) {
            ch = "";
          }
          value += ch;
        }
      }
      var parts;
      if(obj.numSep){
        if (commaDecimal) value = value.replace(/\./g, '');
        else value = value.replace(/,/g, '');
        parts = value.split(decimalChar);
        if(parts.length > 1){
          if (commaDecimal) parts[0] = parts[0].replace(/\./g, '');
          else parts[0] = parts[0].replace(/,/g, '');
          value = parts.join('.');
        }
      }
      
      if (obj.curSym){
        value = value.replace(new RegExp('^' + pui.formatting.escapeRe(obj.curSym)), '');
      }

      if(obj.units){
        value = value.replace(new RegExp(pui.formatting.escapeRe(obj.units) + '$'), '');
      }
      
      var valid = true;
      var stripped = value.replace(/[^\d\-]/g, '');
      if(/-/.test(stripped) && !/(^-|-$)/.test(stripped)){
        valid = false;
      }
      
      if(obj.negNum && /[\-()CR]/.test(value)){
        if(obj.negNum == '(999.00)'){
          value = value.replace(/\(/, '').replace(/\)/, '');
        }
        else if(obj.negNum == '999.00-' || obj.negNum == '-999.00'){
          value = value.replace(/-/, '');
        }
        else if(obj.negNum == '999.00 CR'){
          value = value.replace(/ CR/, '');
        }
        value = '-' + value;
      }
      if (valid && value == "-") {
        valid = false;
      }

      value = trim(value);

      if(valid){
        valid = !(/[^\d.\-]/.test(value)) && value.split('-').length <= 2 && value.split('.').length <= 2;
      }
      
      var errorMsg = obj.value + ' is not a valid number.';
      if(valid){
        parts = value.replace(/-/, '').split('.');
        if(parts[0].length > parseInt(obj.dataLength, 10) - parseInt(obj.decPos, 10)){
          valid = false;
          errorMsg = obj.value + ' has an incorrect data length or decimal position.';
        }
        if(parts.length == 2){
          if(parts[1].length > parseInt(obj.decPos, 10)){
            valid = false;
            errorMsg = obj.value + ' has too many decimal places. (max: ' + obj.decPos + ')';
          }
          else if(value.indexOf('.') == -1){
            valid = value.replace(/-/g,'').length <= obj.dataLength;
            errorMsg = obj.value + ' has too many decimal places. (max: ' + obj.decPos + ')';
          }
          else if(value.indexOf('.') == value.length - 1){
            valid = false;
          }
        }
      }

      if (valid && obj.zeroFill == "true" && obj.dataType == "char") {
        value = pui.formatting.leftPad(value, parseInt(obj.dataLength, 10), '0');
      }      
      
      if (valid && obj["numBlankFill"] == "true" && obj.dataType == "char") {
        var dataLength = Number(obj.dataLength);
        if (!isNaN(dataLength)) {
          value = pui.formatting.leftPad(value, dataLength, " ");
        }
      }      
      
      return valid ? value : { msg: errorMsg };

    }
  },
  "Indicator": {
    format: function(obj) {
      var value = obj.value + '';
      var on, off;
      if(obj.indFormat == 'Custom Values'){
        on = obj.customTrue;
        off = obj.customFalse;
      }
      else{
        on = obj.indFormat.split(' / ')[0];
        off = obj.indFormat.split(' / ')[1];
      }
      if (on != "" || off != "") {
        obj.keyFilter = new RegExp('[' + pui.formatting.escapeRe(on + off) + ']');
      }
      obj.maxLength = (on.length > off.length ? on.length : off.length);
      return (value === '1' ? on : off);
    },
    revert: function(obj) {
      var value = obj.value + '';
      var on, off;
      if(obj.indFormat == 'Custom Values'){
        on = obj.customTrue;
        off = obj.customFalse;
      }
      else{
        on = obj.indFormat.split(' / ')[0];
        off = obj.indFormat.split(' / ')[1];
      }
      if(value === on || value === off){
        return (value === on ? '1' : '0');
      }
      else{
        return { msg: '"' + obj.value + '" is invalid. Valid choices are: "' + on + '" or "' + off + '".' };
      }
    }
  },
  "Date": {
    format: function(obj) {
      var value = obj.value + '';
      var parsedKWs = this.parseKeywords(obj.keywords);
      if (pui.formatting.isNumericType(obj.dataType)) {
        if (value == "0" && obj.dataType == "zoned" && obj.dataLength == 6) {
          if (obj.dateFormat == "m/d/y" || obj.dateFormat == "d/m/y") {
            obj.maxLength = 8;
            return "00/00/00";
          }
        }        
        if (value == "" || value == "0") return "";
        //determine date format from numeric data
        parsedKWs.internal = (obj.dateFormat || parsedKWs.display).replace(/[^mdyY]/g, '');
        if(/Y/.test(parsedKWs.internal)){
          if (obj.dataLength == 6 && (parsedKWs.internal == "Ym" || parsedKWs.internal == "mY")) {
            // add day portion as "01"
            value = value + "01";
            parsedKWs.internal += "d";
          }
          value = pui.formatting.leftPad(value, 8, '0');
        }
        else if(/y/.test(parsedKWs.internal)){
          if (obj.dataLength == 4 && (parsedKWs.internal == "ym" || parsedKWs.internal == "my")) {
            // add day portion as "01"
            value = value + "01";
            parsedKWs.internal += "d";
          }
          value = pui.formatting.leftPad(value, 6, '0');
        }
      }
      var d = pui.formatting.Date.parse(value, parsedKWs.internal, obj.locale);
      obj.dateFormat = obj.dateFormat || parsedKWs.display;
      if (d) {
        if (d.format('Y-m-d', 'en_US') == '0001-01-01') value = "";
        else value = d.format(obj.dateFormat, obj.locale);
      }
      return value;
    },
    revert: function(obj) {
      var value = obj.value + '';
      var parsedKWs = this.parseKeywords(obj.keywords);
      //determine date format from numeric data
      if (pui.formatting.isNumericType(obj.dataType)) {
        parsedKWs.internal = (obj.dateFormat || parsedKWs.display).replace(/[^mdyY]/g, '');
      }
      var d;
      var dateFormat = obj.dateFormat;
      if (dateFormat == null || dateFormat == "") {
        dateFormat = parsedKWs.internal;
      }
      if (obj.dataType == "zoned") {
        // check for omitted leading zero and autopad it with a "0"
        if ( ((value.length == 5) && (dateFormat == "m/d/y" || dateFormat == "d/m/y")) ||
             ((value.length == 7) && (dateFormat == "m/d/Y" || dateFormat == "d/m/Y")) ) {
          value = "0" + value;
        }
      }      
      if (obj.dataType == "char") {
        // check for omitted leading zero and autopad it with a "0"
        if ( ((value.length == 7) && (dateFormat == "m/d/y" || dateFormat == "d/m/y")) ||
             ((value.length == 9) && (dateFormat == "m/d/Y" || dateFormat == "d/m/Y")) ) {
          value = "0" + value;
        }
      }      
      if (obj.dataType == "zoned" && parseInt(obj.dataLength, 10) == value.length) {
        if ( ((value.length == 6) && (dateFormat == "m/d/y" || dateFormat == "d/m/y")) ||
             ((value.length == 8) && (dateFormat == "m/d/Y" || dateFormat == "d/m/Y")) ) {
          value = value.substr(0,2) + "/" + value.substr(2,2) + "/" + value.substr(4);
        }
        if (value.length == 6 && dateFormat == "m/Y") {
          value = value.substr(0,2) + "/" + value.substr(2);
        }
        if (value.length == 6 && dateFormat == "Y/m") {
          value = value.substr(0,4) + "/" + value.substr(4);
        }
      }
      if(value === ''){
        d = pui.formatting.Date.parse('0001-01-01', 'Y-m-d', 'en_US');
      }
      else{
        d = pui.formatting.Date.parse(value, dateFormat, obj.locale);
      }
      if (dateFormat == "m/d/y" || dateFormat == "d/m/y") {
        if (value == "00/00/00" && obj.dataType == "char") return "0";
        if (value == "00/00/00") return "0";
      }
      if (dateFormat == "m/d/Y" || dateFormat == "d/m/Y") {
        if (value == "00/00/0000" && obj.dataType == "char") return "";
        if (value == "00/00/0000") return "0";
      }
      if (obj.dataType == "zoned" && value == "") {
        return "0";
      }
      if (obj.dataType == "char") {
        return value;
      }
      if (d) {
        return d.format(parsedKWs.internal, obj.locale);
      }
      else {
        var yr = (new Date()).getFullYear();
        d = pui.formatting.Date.parse(yr + '-03-07-14.30.15.000000', 'Y-m-d-H.i.s.u000', obj.locale);
        return { msg: '"' + obj.value + '" is not a valid date. Example format: ' + d.format(dateFormat, obj.locale) };
      }
    },
    parseKeywords: function(keywords) {
      var datFmt, datSep;
      if(keywords && keywords.length > 0){
        var datFmtRegex = /^\s*DATFMT\s*\(\s*(\*\w{3})\s*\)\s*$/;
        var datSepRegex = /^\s*DATSEP\s*\(\s*(?:(\*JOB)|'(.)')\s*\)\s*$/;
        for(var i=0; i<keywords.length; i++){
          var kw = keywords[i].toUpperCase();
          if(datFmtRegex.test(kw)){
            datFmt = kw.replace(datFmtRegex, '$1');
          }
          else if(datSepRegex.test(kw)){
            datSep = kw.replace(datSepRegex, '$1' + '$2');
          }
        }
      }
      
      datFmt = datFmt || '*ISO';
      datSep = datSep || '*JOB';
      
      var internalPattern;
      if(pui.formatting.keywords.DATFMT[datFmt]){
        internalPattern = pui.formatting.keywords.DATFMT[datFmt].pattern;
      }
      else{
        internalPattern = pui.formatting.keywords.DATFMT['*ISO'].pattern;
      }
      
      var internalSep;
      var overridable = /^(?:\*MDY|\*DMY|\*YMD|\*JUL)$/.test(datFmt);
      if(overridable){
        internalSep = pui.formatting.keywords.DATSEP[datSep];
      }
      else{
        if(pui.formatting.keywords.DATFMT[datFmt]){
          internalSep = pui.formatting.keywords.DATFMT[datFmt].defaultSep;
        }
        else{
          internalSep = '-';
        }
      }
      
      var displayPattern = internalPattern;
      if(datFmt == '*JOB' && pui.appJob && pui.appJob.dateFormat){
        datFmt = pui.appJob.dateFormat;
        displayPattern = pui.formatting.keywords.DATFMT[datFmt].pattern;
      }
      
      var displaySep = internalSep;
      overridable = /^(?:\*MDY|\*DMY|\*YMD|\*JUL)$/.test(datFmt);
      if(overridable){
        if(datSep == '*JOB' && pui.appJob && pui.appJob.dateSeparator){
          datSep = pui.appJob.dateSeparator;
        }
        displaySep = pui.formatting.keywords.DATSEP[datSep];
      }
      
      return {
        internal: internalPattern.replace(/\B/g, internalSep),
        display: displayPattern.replace(/\B/g, displaySep)
      };
      
    }
  },
  "Time": {
    format: function(obj) {
      var value = obj.value + '';
      var parsedKWs = this.parseKeywords(obj.keywords);
      if(pui.formatting.isNumericType(obj.dataType)){
        //determine time format from numeric data
        parsedKWs.internal = (obj.timeFormat || parsedKWs.display).replace(/[^Hgis]/g, '');
        value = pui.formatting.leftPad(value, parseInt(obj.dataLength, 10), '0');
      }
      var value6 = value;
      var format6 = parsedKWs.internal;
      if (value6.length == 4) {
        format6 += "s";
        value6 += "00";
      }
      var d = pui.formatting.Date.parse(value6, format6, obj.locale);
      if(d){
        if(obj.timeFormat === ''){
          obj.timeFormat = parsedKWs.display;
        }
        //Check for null time since RPG uses 00:00:00 (AM) for null and 24:00:00 (AM) for midnight
        if(/^0*$/.test(value.replace(/\D/g, ''))){
          return d.format(obj.timeFormat, obj.locale).replace(/(?:12|24)/g, '00');
        }
        return d.format(obj.timeFormat, obj.locale);
      }
      return value;
    },
    revert: function(obj) {
      var value = obj.value + '';
      var parsedKWs = this.parseKeywords(obj.keywords);
      if(pui.formatting.isNumericType(obj.dataType)){
        //determine time format from numeric data
        parsedKWs.internal = (obj.timeFormat || parsedKWs.display).replace(/[^Hgis]/g, '');
      }
      var d;
      if(value === ''){
        d = pui.formatting.Date.parse('00:00:00', 'H:i:s', 'en_US');
      }
      else{
        d = pui.formatting.Date.parse(value, obj.timeFormat, obj.locale);
      }
      if(d){
        if(/^0*$/.test(value.replace(/\D/g, ''))){
          var formatted = d.format(parsedKWs.internal, obj.locale);
          formatted = formatted.replace(/(?:12|24)/g, '00');
          formatted = formatted.replace(/PM/i, 'AM');
          return formatted;
        }
        else if(d.getHours() === 0 && d.getMinutes() === 0 && d.getSeconds() === 0){
          // Midnight must produce 24:00:00
          return d.format(parsedKWs.internal, obj.locale);
        }
        else {
          // But 12:00:01 (AM) must produce 00:00:01.
          // Replace 'R' formatting character with 'H' before sending back to the server to prevent a time greater than '24:00:00'
          parsedKWs.internal = parsedKWs.internal.replace(/([^\\]?)R/g, '$1' + 'H');
          return d.format(parsedKWs.internal, obj.locale);
        }
      }
      else{
        var yr = (new Date()).getFullYear();
        d = pui.formatting.Date.parse(yr + '-03-07-14.30.15.000000', 'Y-m-d-H.i.s.u000', obj.locale);
        return { msg: '"' + obj.value + '" is not a valid time. Example format: ' + d.format(obj.timeFormat, obj.locale) };
      }
    },
    parseKeywords: function(keywords) {
      var timFmt, timSep;
      if(keywords && keywords.length > 0){
        var timFmtRegex = /^\s*TIMFMT\s*\(\s*(\*\w{3})\s*\)\s*$/;
        var timSepRegex = /^\s*TIMSEP\s*\(\s*(?:(\*JOB)|'(.)')\s*\)\s*$/;
        for(var i=0; i<keywords.length; i++){
          var kw = keywords[i].toUpperCase();
          if(timFmtRegex.test(kw)){
            timFmt = kw.replace(timFmtRegex, '$1');
          }
          else if(timSepRegex.test(kw)){
            timSep = kw.replace(timSepRegex, '$1' + '$2');
          }
        }
      }
      
      timFmt = timFmt || '*ISO';
      timSep = timSep || '*JOB';
      
      var internalPattern;
      if(pui.formatting.keywords.TIMFMT[timFmt]){
        internalPattern = pui.formatting.keywords.TIMFMT[timFmt].pattern;
      }
      else{
        internalPattern = pui.formatting.keywords.TIMFMT['*ISO'].pattern;
      }
      
      var internalSep;
      if(timFmt == '*HMS'){
        internalSep = pui.formatting.keywords.TIMSEP[timSep] || ':';
      }
      else{
        if(pui.formatting.keywords.TIMFMT[timFmt]){
          internalSep = pui.formatting.keywords.TIMFMT[timFmt].defaultSep;
        }
        else{
          internalSep = '.';
        }
      }
      
      var displayPattern = internalPattern;
      
      var displaySep = internalSep;
      if(timFmt == '*HMS'){
        if(timSep == '*JOB' && pui.appJob && pui.appJob.timeSeparator){
          timSep = pui.appJob.timeSeparator;
        }
        displaySep = pui.formatting.keywords.TIMSEP[timSep];
      }
      
      return {
        internal: internalPattern.replace(/\B/g, internalSep),
        display: displayPattern.replace(/\B/g, displaySep)
      };
      
    }
  },
  "Time Stamp": {
    format: function(obj) {
      var value = obj.value + '';
      if(obj.timeStampFormat){
        var d = pui.formatting.Date.parse(value, pui.formatting.Date.stdTimeStampPattern, obj.locale);
        if(d){
          value = d.format(obj.timeStampFormat, obj.locale);
        }
      }
      return value;
    },
    revert: function(obj) {
      var value = obj.value + '';
      var d = pui.formatting.Date.parse(value, obj.timeStampFormat, obj.locale);
      if(d){
        value = d.format(pui.formatting.Date.stdTimeStampPattern, obj.locale);
      }
      else{
        var yr = (new Date()).getFullYear();
        d = pui.formatting.Date.parse(yr + '-09-09-14.30.15.000000', pui.formatting.Date.stdTimeStampPattern, obj.locale);
        return { msg: '"' + obj.value + '" is not a valid time stamp. Example format: ' + d.format(obj.timeStampFormat, obj.locale) };
      }
      return value;
    }
  },
  "Special": {
    format: function(obj) {
      var value = obj.value + '';
      var validKeys = '\\d';
      var maxLength;
      
      switch(obj.special){
        case 'Percentage':
          value = value.replace(/[^\d\-.]/g, '');
          maxLength = parseInt(obj.dataLength, 10) + 2; // +2 for negative and percentage sign
          if(pui.formatting.isNumericType(obj.dataType) && parseInt(obj.decPos, 10) > 0){
            var dec = (parseFloat('.' + (value.split(/\./)[1] || '0'), 10).toFixed(parseInt(obj.decPos, 10)) + '').split(/\./)[1];
            value = value.split(/\./)[0] + '.' + dec;
            validKeys += '\\.';
            maxLength++;
          }
          validKeys += '\\-\\$';
          value += '%';
          break;
        case 'Zip Code':
          value = value.replace(/[^\d]/g, '');
          value = pui.formatting.leftPad(value, 5, '0');
          maxLength = 5;
          break;
        case 'Zip Code + 4':
          value = value.replace(/[^\d]/g, '');
          value = pui.formatting.leftPad(value, 9, '0');
          value = value.slice(0, value.length-4) + '-' + value.slice(-4);
          validKeys += '\\-';
          maxLength = 10;
          break;
        case 'Phone Number':
          value = value.replace(/[^\d]/g, '');
          var num = '';
          var len = value.length;
          for(var i=len-1; i>=0; i--){
            if(i == len-5){
              num = '-' + num;
            }
            if(i == len-8){
              num = ') ' + num;
            }
            num = value.charAt(i) + num;
          }
          if(len > 7){
            num = '(' + num;
          }
          value = num;
          validKeys += '\\-() ';
          maxLength = 14;
          break;
        case 'Social Security Number':
          value = value.replace(/[^\d]/g, '');
          value = pui.formatting.leftPad(value, 9, '0');
          value = value.slice(0, value.length-6) + '-' + value.slice(-6, -4) + '-' + value.slice(-4);
          validKeys += '\\-';
          maxLength = 11;
      }
      obj.keyFilter = new RegExp('[' + validKeys + ']');
      obj.maxLength = maxLength;
      return value;
    },
    revert: function(obj) {
      var value = obj.value + '';
      var maxLength;
      switch(obj.special){
        case 'Percentage':
          value = value.replace(/%/g, '');
          if(value.length > 0){
            if(!(/^-?\d*\.?\d+$/.test(value))){
              return { msg: value + ' is not a valid decimal.' };
            }
            if(value.length - value.split('.').length-1 > obj.dataLength + (parseInt(obj.decPos, 10) === 0 ? 0 : 1)){
              return { msg: '"' + value + '" contains too many digits. Max: ' + obj.dataLength };
            }
            if(pui.formatting.isNumericType(obj.dataType)){
              var wholeNums = parseInt(obj.dataLentgh, 10) - parseInt(obj.decPos, 10);
              var parts = value.split('.');
              if(parts[0].length > wholeNums){
                return { msg: '"' + value + '" exceeds the maximum number of digits for the whole number portion (' + wholeNums + ' digits).' };
              }
              if(parts[1] && parts[1].length > parseInt(obj.decPos, 10)){
                return { msg: '"' + value + '" exceeds the maximum number of digits for the decimal portion (' + obj.decPos + ' digits).' };
              }
            }
          }
          return value;
        case 'Zip Code':
          if(pui.formatting.isNumericType(obj.dataType)){
            value = value.replace(/[^\d]/g, '');
            maxLength = parseInt(obj.dataLength, 10) - parseInt(obj.decPos, 10);
            if(maxLength > 5){
              maxLength = 5;
            }
            if(value.length > maxLength){
              return { msg: 'Zip Code is too long. (Maximum ' + maxLength + ' digits)' };
            }
          }
          else{
            maxLength = parseInt(obj.dataLength, 10);
            if(value.length > maxLength){
              value = value.replace(/[^\d]/g, '');
              if(value.length > maxLength){
                return { msg: 'Zip code is too long. (Maximum ' + maxLength + ' digits)' };
              }
            }
          }
          return value;
        case 'Zip Code + 4':
          if(pui.formatting.isNumericType(obj.dataType)){
            value = value.replace(/[^\d]/g, '');
            maxLength = parseInt(obj.dataLength, 10) - parseInt(obj.decPos, 10);
            if(maxLength > 9){
              maxLength = 9;
            }
            if(value.length > maxLength){
              return { msg: 'Zip Code is too long. (Maximum ' + maxLength + ' digits)' };
            }
          }
          else{
            maxLength = parseInt(obj.dataLength, 10);
            if(value.length > maxLength){
              value = value.replace(/[^\d]/g, '');
              if(value.length > maxLength){
                return { msg: 'Zip code is too long. (Maximum ' + maxLength + ' digits)' };
              }
            }
          }
          return value;
        case 'Phone Number':
          if(pui.formatting.isNumericType(obj.dataType)){
            value = value.replace(/[^\d]/g, '');
            maxLength = parseInt(obj.dataLength, 10) - parseInt(obj.decPos, 10);
            if(maxLength > 10){
              maxLength = 10;
            }
            if(value.length > maxLength){
              return { msg: 'Phone number is too long. (Maximum ' + maxLength + ' digits)' };
            }
          }
          else{
            maxLength = parseInt(obj.dataLength, 10);
            if(value.length > maxLength){
              value = value.replace(/[^\d]/g, '');
              if(value.length > maxLength){
                return { msg: 'Phone number is too long. (Maximum ' + maxLength + ' digits)' };
              }
            }
          }
          return value;
        case 'Social Security Number':
          if(pui.formatting.isNumericType(obj.dataType)){
            value = value.replace(/[^\d]/g, '');
            maxLength = parseInt(obj.dataLength, 10) - parseInt(obj.decPos, 10);
            if(maxLength > 9){
              maxLength = 9;
            }
            if(value.length > maxLength){
              return { msg: 'Social security number is too long. (Maximum ' + maxLength + ' digits)' };
            }
          }
          else{
            maxLength = parseInt(obj.dataLength, 10);
            if(value.length > maxLength){
              value = value.replace(/[^\d]/g, '');
              if(value.length > maxLength){
                return { msg: 'Social security number is too long. (Maximum ' + maxLength + ' digits)' };
              }
            }
          }
          return value;
      }
    }
  },
  "Custom": {
    format: function(obj) {
      if(obj.customFunction !== ''){
        var value, func;
        try{
          func = eval('(' + obj.customFunction + ')');
        }
        catch(err1){
          return { msg: 'Invalid custom validation function.\n\n' + err1.message || err1.description };
        }
        if(typeof func === 'function'){
          try{
            value = func(obj);
          }
          catch(err2){
            return { msg: 'Error in custom validation function.\n\n' + err2.message || err2.description };
          }
          return value;
        }
      }
      if(obj.customPattern !== ''){
        if(obj.dataType == 'date'){
          obj.dateFormat = obj.customPattern;
          obj.formatting = 'Date';
        }
        else if(obj.dataType == 'time'){
          obj.timeFormat = obj.customPattern;
          obj.formatting = 'Time';
        }
        else if(obj.dataType == 'timestamp'){
          obj.timeStampFormat = obj.customPattern;
          obj.formatting = 'Time Stamp';
        }
        else {
          obj.formatting = 'Date';
          timePatternChars = ["H", "i",  "s",  "u",  "g",  "a",  "A"];
          for (var i = 0; i < timePatternChars.length; i++) {
            if (obj.customPattern.indexOf(timePatternChars[i]) != -1) {
              obj.formatting = 'Time Stamp';
              break;
            }
          }
          if (obj.formatting == 'Time Stamp') obj.timeStampFormat = obj.customPattern;
          if (obj.formatting == 'Date') obj.dateFormat = obj.customPattern;
        }
        return pui.FieldFormat.format(obj);
      }
    },
    revert: function(obj) {
      if(obj.customFunction !== ''){
        return pui.FieldFormat["Custom"].format(obj);
      }
    }
  },
  validate: function(value, obj) {
  
    var types = {
      "char": { def: '',  rx: '.*' },
      "graphic": { def: '',  rx: '.*' },
      "zoned": { def: '0', rx: '-?\\d*\\.?\\d*' },
      "indicator": { def: '0', rx: '[01]' },
      "expression": { def: '0', rx: '.*' },
      "floating": { def: '0', rx: '-?\\d*\\.?\\d*' },
      "date": { def: '0001-01-01', rx: '\\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[1-2][0-9]|3[0-1])' },
      "time": { def: '00:00:00', rx: '(?:[0-1][0-9]|2[0-3])(?::[0-5][0-9]){2}' },
      "timestamp": { def: '0001-01-01-00.00.00.000000', rx: '\\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[1-2][0-9]|3[0-1])-(?:[0-1][0-9]|2[0-3])(?:\\.[0-5][0-9]){2}\\.\\d{6}' }
    };
    
    var rx = new RegExp('^' + types[obj.dataType].rx + '$', 'i');
    //if(!value.test(rx)
    
    return value;
  
  },
  isValidFormat: (function() {
  
    var invalid = {
      "char": {},
      "graphic": {
        "Number": true,
        "Indicator": true,
        "Date": true,
        "Time": true,
        "Time Stamp": true,
        "Special": true
      },
      "zoned": {
        "Time Stamp": true
      },
      "indicator": {
        "Date": true,
        "Time": true,
        "Time Stamp": true,
        "Special": true
      },
      "expression": {
        "Text": true,
        "Number": true,
        "Date": true,
        "Time": true,
        "Time Stamp": true,
        "Special": true
      },
      "floating": {
        "Time Stamp": true
      },
      "date": {
        "Number": true,
        "Indicator": true,
        "Time": true,
        "Special": true
      },
      "time": {
        "Number": true,
        "Indicator": true,
        "Date": true,
        "Time Stamp": true,
        "Special": true
      },
      "timestamp": {
        "Number": true,
        "Indicator": true,
        "Special": true
      },
      "reference": {}
    };
    
    return function(obj) {
      if(!invalid[obj.dataType] || invalid[obj.dataType][obj.formatting]){
        obj.formatting = 'Text';
        return false;
      }
      return true;
    };
    
  })()
};