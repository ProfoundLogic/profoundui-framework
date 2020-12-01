/*
 * Global externs
 *
 * Anything listed here won't be renamed by the Closure compiler. This is useful when referencing
 * third-party or newer JavaScript built-in functions that our version of Closure doesn't know about.
 */

Array.isArray = function(value) {};

Object.defineProperty = function() {};
Object.keys = function(value) {};
Object.getOwnPropertyNames = function(value){};
Function.bind = function(value){};

// pui.Ajax properties.
Object.onfail = function(value) {};
Object.onsuccess = function(value) {};
Object.suppressAlert = {};
Object.postData = {};
Promise.then = function(value){};

// drag and drop web API
Object.ondrop = function(event) {};
Object.ondragend = function(event) {};
Object.ondragover = function(event) {};
Object.ondragleave = function(event) {};

FileReader.readAsText = {}; //used in JumpStart, 

Object.transformOrigin = {}; //Style for "transform-origin".
Object.backgroundSize = {}; // style for "background-size".

String.trim = function(value){};

Element.dataset = {}; //HTML5 data attributes.

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

Event.dataTransfer.dropEffect = {};   //Used in JumpStart

Element.oninput = {};

Date.toISOString = function() {};

navigator.clipboard = {
  writeText: {}
};
