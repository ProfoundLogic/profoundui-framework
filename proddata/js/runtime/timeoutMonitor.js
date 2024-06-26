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

// pui.timeoutMonitor.timer.reset() called in the onuseractivity function
// pui.timeoutMonitor.start() called in the rendering functions in both Rich Displays and Genie
// pui.timeoutMonitor.end() called when a screen is submitted

pui.timeoutMonitor = {};

pui.timeoutMonitor.timer = new pui["Timer"]();
pui.timeoutMonitor.timer.action = function() {
  var returnValue = true;
  if (pui["onbeforetimeout"] != null && typeof pui["onbeforetimeout"] == "function") {
    returnValue = pui["onbeforetimeout"]();
  }
  if (returnValue !== false) pui.timeoutMonitor.showTimeOutScreen();
  pui.timeoutMonitor.timer.stop();
  pui.timeoutMonitor.keepalive.stop();
};

pui.timeoutMonitor.keepalive = new pui["Timer"]();
pui.timeoutMonitor.keepalive.action = function() {
  pui["keepAlive"]();
};

pui.timeoutMonitor.showTimeOutScreen = function() {
  pui["doSessionTimeout"]();
};

pui.timeoutMonitor.start = function() { // this is called when a screen is rendered
  pui.timeoutMonitor.timer.stop();
  pui.timeoutMonitor.keepalive.stop();
  if (pui.timeout == null) return;
  var keepAliveValue = pui.timeout - 10; // keep alive value is 10 seconds less than the timeout value
  if (keepAliveValue < 3) return; // check if keep alive is too frequent
  pui.timeoutMonitor.timer.timeout = pui.timeout;
  // pui.timeoutMonitor.timer.showDebugInfo = true;
  pui.timeoutMonitor.keepalive.timeout = keepAliveValue;
  // pui.timeoutMonitor.keepalive.showDebugInfo = true;
  pui.timeoutMonitor.timer.start();
  pui.timeoutMonitor.keepalive.start();
};

pui.timeoutMonitor.end = function() { // this is called when a screen is submitted
  pui.timeoutMonitor.timer.stop();
  pui.timeoutMonitor.keepalive.stop();
};
