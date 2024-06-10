/*
 * Global externs
 *
 * Anything listed here won't be renamed by the Closure compiler. This is useful when referencing
 * third-party or newer JavaScript built-in functions that our version of Closure doesn't know about.
 */

Array.isArray = function(value) {};

// JavaScript functions.
Object.defineProperty = function() {};
Object.defineProperties = function() {};
Object.entries = function() {};
Object.keys = function(value) {};
Object.getOwnPropertyNames = function(value) {};
Object.hasOwn = function(value) {}; // used in openapi-output-values.js. Short version of hasOwnProperties
Object.assign = function(value) {}; // used in some question-type entries
Object.handleEvent = function(event) {}; // Any object may be an event handler if it has this property.
Function.bind = function(value) {};
Object.before = {};

Event.stopImmediatePropagation = function() {};

// Map functions -- used by ShowMultiFilterPanel in Grid.js
Map.has = function() {};
Map.set = function() {};
Map.entries = function() {};

// pui.Ajax properties.
Object.onfail = function(value) {};
Object.onsuccess = function(value) {};
Object.suppressAlert = {};
Object.postData = {};
Promise.then = function(value) {};

// drag and drop web API
Object.ondrop = function(event) {};
Object.ondragend = function(event) {};
Object.ondragover = function(event) {};
Object.ondragleave = function(event) {};

FileReader.readAsText = {}; // used in JumpStart,

Object.transformOrigin = {}; // Style for "transform-origin".
Object.backgroundSize = {}; // style for "background-size".

String.trim = function(value) {};

Element.dataset = {}; // HTML5 data attributes.

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
Event.target.result = {}; // Used by FileReader onload event in JumpStart.

Event.dataTransfer.dropEffect = {}; // Used in JumpStart

Element.oninput = {};

Element.prepend = {};

Date.toISOString = function() {};

navigator.clipboard = {
  writeText: {}
};

// Profound UI
Object.multOccur = {};
