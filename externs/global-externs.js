/*
 * Global externs
 *
 * Anything listed here won't be renamed by the Closure compiler. This is useful when referencing
 * third-party or newer JavaScript built-in functions that our version of Closure doesn't know about.
 */

Array.isArray = function(value) {};

Object.keys = function(value) {};

// pui.Ajax properties.
Object.onfail = function(value) {};
Object.onsuccess = function(value) {};
Object.suppressAlert = {};

FileReader.readAsText = {}; //used in JumpStart, 

Object.transformOrigin = {}; //Style for "transform-origin".
Object.backgroundSize = {}; // style for "background-size".

String.trim = function(value){};

/*
 * mouse wheel event properties
 */
Event.deltaY = {};
Event.deltaX = {};
Event.deltaX = {};
Event.deltaMode = {};
Event.wheelDelta = {};
Event.detail = {};

Event.target = {};
Event.target.result = {}; //Used by FileReader onload event in JumpStart.
Element.oninput = {};

Date.toISOString = function() {};
