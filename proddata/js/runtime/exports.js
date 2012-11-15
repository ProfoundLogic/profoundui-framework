/* 
 * Exports (for obfuscation)
 */


window['hideElement'] = hideElement;
window['hideElements'] = hideElements;
window['removeElement'] = removeElement;
window['removeElements'] = removeElements;
window['getElementValue'] = getElementValue;
window['get'] = get;
window['getObj'] = getObj;
window['postToNewWindow'] = postToNewWindow;
window['postTo'] = postTo;
window['changeElementValue'] = changeElementValue;
window['changeElementClass'] = changeElementClass;
window['newElement'] = newElement;
window['preventEvent'] = preventEvent;
window['setTab'] = setTab;
window['ltrim'] = ltrim;
window['rtrim'] = rtrim;
window['trim'] = trim;
window['attachCalendar'] = attachCalendar;
window['createNamedElement'] = createNamedElement;
window['getInnerText'] = getInnerText;
window['setDOMAttribute'] = setDOMAttribute;
window['getActualStyle'] = getActualStyle;
window['addEvent'] = addEvent;
window['removeEvent'] = removeEvent;
window['getMouseX'] = getMouseX;
window['getMouseY'] = getMouseY;
window['showErrors'] = showErrors;
window['applyProperty'] = applyDesignProperty;
window['show_calendar'] = show_calendar;
window['hide_calendar'] = hide_calendar;
window['calendar_select'] = calendar_select;
window['currentDate'] = currentDate;
window['currentTime'] = currentTime;
window['currentUser'] = currentUser;
window['getQueryStringParms'] = getQueryStringParms;

window['loadPCCommandApplet'] = loadPCCommandApplet;
window['runPCCommand'] = runPCCommand;
window['copyToClipboard'] = copyToClipboard;

window['pui']['UTF8'] = pui.UTF8;
window['pui']['UTF8']['encode'] = pui.UTF8.encode;
window['pui']['UTF8']['decode'] = pui.UTF8.decode;

// prevent closure from creating $ variables to avoid conflicts with libararies like jQuery - not 100% sure if this is the right method
var $ = function() {};
window['$'] = $;
// do something similar with "id" variable (Ext seems to set window.id, which was causing conflicts with closure)
window['id'] = window.id;
