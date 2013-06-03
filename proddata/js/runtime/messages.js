//  Profound UI Runtime  -- A Javascript Framework for Rich Displays
//  Copyright (c) 2013 Profound Logic Software, Inc.
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

if (pui["runtimeMsg"] == null) pui["runtimeMsg"] = {};
if (pui["runtimeText"] == null) pui["runtimeText"] = {};


pui.getLanguageText = function(dict, msgid, varvals) {

  var lang = pui["language"] || "en_US";
  var msg  = pui[dict][lang][msgid];
 
  // for backward compat w/old pui["runtimeMessages"][xxx] support.
  
  if (dict=="runtimeMsg" && typeof(pui["runtimeMessages"][msgid]) != "undefined") {
    msg = pui["runtimeMessages"][msgid];
  }
  
  // for backward compat w/old pui["fileupload"][xxx] support.
  
  if ((dict=="runtimeMsg"||dict=="runtimeText") && msgid.substr(0,7) == "upload " 
       && typeof(pui["fileupload"][msgid.substr(8)]) != "undefined") {
    msg = pui["fileupload"][msgid.substr(8)];
    if (msgid == "upload file limit") 
       msg = msg.replace("{FILE_LIMIT}", "&1");
  }
  
  // for backward compat w/old pui[xxxxx] texts
  
  if (dict == "runtimeText") {
    var oldtext = [ "close browser text", "csv export text", "filter text",
                    "next link text", "previous link text", "remove filters text",
                    "session ended text",  "sort ascending text", "sort descending text" ]; 
    for (var m=0; m<oldtext.length; m++) {
      if ( msgid==oldtext[m] && typeof(pui[oldtext[m]]) != "undefined" ) {
         msg = pui[oldtext[m]];
      }
    }
  }
                  
  // for backward compat w/old pui[xxxxx] messages
  
  if (dict == "runtimeMsg") {
    var oldmsg = [ "closeMessage", "no connection message" ];
    for (var m=0; m<oldmsg.length; m++) {
      if ( msgid==oldmsg[m] && typeof(pui[oldmsg[m]]) != "undefined" ) {
         msg = pui[oldmsg[m]];
      }
    }
  }
  
  // insert any replacement variable values &1, &2, &3, etc.

  if (varvals!=null) {
    for (var m=1; m<=varvals.length; m++) {
      msg = msg.replace("&"+m, varvals[m-1]);
    }    
  }

  return msg;
}

pui.copyDictionary = function(dict, fromLang, toLang) {
  if (pui[dict][toLang] == null) pui[dict][toLang] = {};
  for (msg in pui[dict][fromLang]) {
    pui[dict][toLang][msg] = pui[dict][fromLang][msg];
  }  
}

pui.copyAllLanguageText = function(fromLang, toLang) {
  pui.copyDictionary("runtimeMsg", fromLang, toLang);
  pui.copyDictionary("runtimeText", fromLang, toLang);
}

pui["runtimeMsg"]["en_US"] = {};
pui["runtimeMsg"]["en_US"]["closeMessage"]            = "This will end your session.";
pui["runtimeMsg"]["en_US"]["no connection message"]   = "Unable to reach server.  Check your connection and try again.";
pui["runtimeMsg"]["en_US"]["upload file limit"]       = "Limit of &1 file(s) exceeded.";
pui["runtimeMsg"]["en_US"]["upload size limit"]       = "Limit of &1MB per file exceeded";
pui["runtimeMsg"]["en_US"]["upload no files"]         = "No files selected.";
pui["runtimeMsg"]["en_US"]["upload duplicate file"]   = "Duplicate files selected.";
pui["runtimeMsg"]["en_US"]["upload file exists"]      = "One or more files already exist on the file system.";
pui["runtimeMsg"]["en_US"]["upload prevented"]        = "Operation prevented by exit program.";
pui["runtimeMsg"]["en_US"]["upload input limit"]      = "Total input size limit exceeded.";
pui["runtimeMsg"]["en_US"]["upload no session"]       = "Not connected to a valid session.";
pui["runtimeMsg"]["en_US"]["upload timeout"]          = "Transaction timed out.";
pui["runtimeMsg"]["en_US"]["upload invalid response"] = "The server response is missing or invalid.";
pui["runtimeMsg"]["en_US"]["close browser text"]      = "To complete the log off process, please close your browser window.";
pui["runtimeMsg"]["en_US"]["session ended text"]      = "Your session has ended.";
pui["runtimeMsg"]["en_US"]["outside ucs2"]            = 'Characters are outside of UCS-2 range.';
pui["runtimeMsg"]["en_US"]["invalid number"]          = '&1 is not a valid number.';
pui["runtimeMsg"]["en_US"]["invalid length"]          = '&1 has an incorrect data length or decimal position.';
pui["runtimeMsg"]["en_US"]["invalid decimal"]         = '&1 has too many decimal places. (max: &2)';
pui["runtimeMsg"]["en_US"]["invalid choice"]          = '"&1" is invalid. Valid choices are: "&2" or "&3".';
pui["runtimeMsg"]["en_US"]["invalid date"]            = '"&1" is not a valid date. Example format: &2';
pui["runtimeMsg"]["en_US"]["invalid time"]            = '"&1" is not a valid time. Example format: &2';
pui["runtimeMsg"]["en_US"]["invalid time stamp"]      = '"&1" is not a valid time stamp. Example format: &2';
pui["runtimeMsg"]["en_US"]["invalid percent"]         = '&1 is not a valid decimal.';
pui["runtimeMsg"]["en_US"]["invalid digits"]          = '"&1" contains too many digits. Max: &2';
pui["runtimeMsg"]["en_US"]["exceeds whole"]           = '"&1" exceeds the maximum number of digits for the whole number portion (&2 digits).';
pui["runtimeMsg"]["en_US"]["exceeds decimal"]         = '"&1" exceeds the maximum number of digits for the decimal portion (&2 digits).';
pui["runtimeMsg"]["en_US"]["zip too long"]            = 'Zip code is too long. (Maximum: &1 digits)';
pui["runtimeMsg"]["en_US"]["phone too long"]          = 'Phone number is too long. (Maximum: &1 digits)';
pui["runtimeMsg"]["en_US"]["ssno too long"]           = 'Social security number is too long. (Maximum: &1 digits)';
pui["runtimeMsg"]["en_US"]["invalid custom val"]      = 'Invalid custom validation function.';
pui["runtimeMsg"]["en_US"]["error custom val"]        = 'Error in custom validation function.';

pui["runtimeText"]["en_US"] = {};
pui["runtimeText"]["en_US"]["upload select text"]   = "Select Files";
pui["runtimeText"]["en_US"]["upload clear text"]    = "Clear";
pui["runtimeText"]["en_US"]["upload remove text"]   = "Remove";
pui["runtimeText"]["en_US"]["upload upload text"]   = "Upload";
pui["runtimeText"]["en_US"]["csv export text"]      = "Export to Excel";
pui["runtimeText"]["en_US"]["filter text"]          = "Filter";
pui["runtimeText"]["en_US"]["remove filters text"]  = "Remove All Filters";
pui["runtimeText"]["en_US"]["next link text"]       = "Next";
pui["runtimeText"]["en_US"]["previous link text"]   = "Previous";
pui["runtimeText"]["en_US"]["sort ascending text"]  = "Sort Ascending";
pui["runtimeText"]["en_US"]["sort descending text"] = "Sort Descending";

pui.copyAllLanguageText("en_US", "en_UK");
