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

if (pui["runtimeMsg"] == null) pui["runtimeMsg"] = {};
if (pui["runtimeText"] == null) pui["runtimeText"] = {};
if (pui["runtimeMessages"] == null) pui["runtimeMessages"] = {};


pui["getLanguageText"] = function(dict, msgid, varvals) {

  var lang = pui["language"] || "en_US";
  var msg  = pui[dict][lang][msgid];

  // If for some reason a message is undefined in the selected
  // language, fall back to US English.
  
  if (typeof(msg) == "undefined") {
    msg = pui[dict]["en_US"][msgid];
  }
 
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
  
  // Support old "csv export text" language setting, which has been replaced with "excel export text".
  var csvid = "csv export text";
  var excelexpid = "excel export text";
  if (msgid == excelexpid && typeof pui["runtimeText"][lang][csvid] != "undefined"){
    msg = pui["runtimeText"][lang][csvid];
  }
  
  // for backward compat w/old pui[xxxxx] texts
  
  if (dict == "runtimeText") {
    var tmpmsgid = msgid;
    if (msgid == excelexpid){
      tmpmsgid = csvid;   //Lets the next loop use pui["csv export text"], if necessary.
    }
    
    var oldtext = [ "close browser text", "csv export text", "filter text", "reset data",
                    "next link text", "previous link text", "remove filters text",
                    "session ended text",  "sort ascending text", "sort descending text" ]; 
    for (var m=0; m<oldtext.length; m++) {
      if ( tmpmsgid==oldtext[m] && typeof(pui[oldtext[m]]) != "undefined" ) {
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
};

pui.copyDictionary = function(dict, fromLang, toLang) {
  if (pui[dict][toLang] == null) pui[dict][toLang] = {};
  for (msg in pui[dict][fromLang]) {
    pui[dict][toLang][msg] = pui[dict][fromLang][msg];
  }  
};

pui.copyAllLanguageText = function(fromLang, toLang) {
  pui.copyDictionary("runtimeMsg", fromLang, toLang);
  pui.copyDictionary("runtimeText", fromLang, toLang);
};

// ----------------------------------
//  USA English
// ----------------------------------

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
pui["runtimeMsg"]["en_US"]["upload invalid response"] = "The server response is missing or invalid.";  //Also used in Atrium for Ajax error.
pui["runtimeMsg"]["en_US"]["upload cancelled"]        = "Upload canceled.";
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
pui["runtimeMsg"]["en_US"]["ME"]                      = "Mandatory entry field. You must enter data.";
pui["runtimeMsg"]["en_US"]["MF"]                      = "Mandatory fill field. You must fill the input box completely.";
pui["runtimeMsg"]["en_US"]["required"]                = "The value cannot be blank. This field is required.";
pui["runtimeMsg"]["en_US"]["file required"]           = "You must select at least one file.";
pui["runtimeMsg"]["en_US"]["signature overflow"]      = "The signature drawing size exceeds the maximum number of bytes available for storing the signature.  Please clear the signature pad and try again.";
pui["runtimeMsg"]["en_US"]["validValues"]             = "Value entered is not valid. Valid values are: ";
pui["runtimeMsg"]["en_US"]["upload invalid type"]     = "One or more files are of invalid type.";
pui["runtimeMsg"]["en_US"]["invalid email"]           = "Invalid email address.";
pui["runtimeMsg"]["en_US"]["session timed out"]       = "Your session has timed out.";
pui["runtimeMsg"]["en_US"]["invalid low range"]       = "Value must be greater than or equal to &1.";
pui["runtimeMsg"]["en_US"]["invalid high range"]      = "Value must be less than or equal to &1.";
pui["runtimeMsg"]["en_US"]["invalid range"]           = "Valid range is &1 to &2.";
pui["runtimeMsg"]["en_US"]["unmonitored exception"]   = "The program has encountered an unmonitored exception. Please contact the system administrator for assistance.";
pui["runtimeMsg"]["en_US"]["loading x"]               = "Loading &1...";
pui["runtimeMsg"]["en_US"]["data src not specfd x"]   = "Data source not specified for &1...";
pui["runtimeMsg"]["en_US"]["name fld not specfd x"]   = "Name field not specified for &1...";
pui["runtimeMsg"]["en_US"]["val fld not specfd x"]    = "Value field not specified for &1...";
pui["runtimeMsg"]["en_US"]["failed to load x"]        = "Failed to load &1.";
pui["runtimeMsg"]["en_US"]["cannot rmv last col"]     = "You cannot remove the last column.";
pui["runtimeMsg"]["en_US"]["cannot find col"]         = "Cannot find the specified columnId.";
pui["runtimeMsg"]["en_US"]["subfile deletion"]        = "Are you sure you want to delete the subfile?";
pui["runtimeMsg"]["en_US"]["downloading x"]           = "Downloading &1";
pui["runtimeMsg"]["en_US"]["ie9 too low xlsxpics"]    = "Images cannot be exported using IE9 or lower.";

// Atrium only.
pui["runtimeMsg"]["en_US"]["num sessions exceeded"]   = "Number of allowed sessions exceeded.";
pui["runtimeMsg"]["en_US"]["unable to load portal"]   = "Unable to load portal settings or navigation items.";
pui["runtimeMsg"]["en_US"]["unable to load macr act"] = "Unable to load macro actions.";
pui["runtimeMsg"]["en_US"]["unable to load macr var"] = "Unable to load macro variables.";
pui["runtimeMsg"]["en_US"]["unable to load scrn lst"] = "Unable to load screen list.";
pui["runtimeMsg"]["en_US"]["unable to load new sett"] = "Unable to load new settings.";
pui["runtimeMsg"]["en_US"]["unable to load x"]        = "Unable to load &1.";
pui["runtimeMsg"]["en_US"]["unable to add x"]         = "Unable to add &1.";
pui["runtimeMsg"]["en_US"]["unable to rename x"]      = "Unable to rename &1.";
pui["runtimeMsg"]["en_US"]["unable to delete x"]      = "Unable to delete &1.";
pui["runtimeMsg"]["en_US"]["unable to update x"]      = "Unable to update &1.";
pui["runtimeMsg"]["en_US"]["unable to reassn x"]      = "Unable to reassign &1.";
pui["runtimeMsg"]["en_US"]["unable to reorder items"] = "Unable to reorder items.";
pui["runtimeMsg"]["en_US"]["unable to save theme"]    = "Unable to save theme setting.";
pui["runtimeMsg"]["en_US"]["unable eval script url"]  = "Unable to evaluate scripted web app URL.";
pui["runtimeMsg"]["en_US"]["close browser text AT"]   = "Unsaved changes to the session(s) will be lost.";
pui["runtimeMsg"]["en_US"]["close all tabs"]          = "Close all tabs?";
pui["runtimeMsg"]["en_US"]["close tab"]               = "Do you want to close this tab?";
pui["runtimeMsg"]["en_US"]["invalid script url"]      = "Invalid value for scripted web app URL.";
pui["runtimeMsg"]["en_US"]["unrecognized format"]     = "Unrecognized format.";
pui["runtimeMsg"]["en_US"]["screen already defined"]  = "Screen \"&1\" is already defined.";
pui["runtimeMsg"]["en_US"]["macro already defined"]   = "Macro \"&1\" is already defined.";
pui["runtimeMsg"]["en_US"]["no screen ids"]           = "There are no screen identifiers to display";
pui["runtimeMsg"]["en_US"]["confirm delete"]          = "Confirm Delete";
pui["runtimeMsg"]["en_US"]["no actions"]              = "There are no actions to display.";
pui["runtimeMsg"]["en_US"]["msg action input var"]    = "Enter the value in variable \"&1\" into the field at row &2 column &3.";
pui["runtimeMsg"]["en_US"]["msg action input user"]   = "Enter the current user profile into the field at row &1 column &2.";
pui["runtimeMsg"]["en_US"]["msg action input js"]     = "Enter the result of JavaScript expression <strong>&1</strong> into the field at row &2 column &3.";
pui["runtimeMsg"]["en_US"]["msg action input other"]  = "Enter the value \"&1\" into the field at row &2 column &3.";
pui["runtimeMsg"]["en_US"]["msg presskey var"]        = "Press the key defined in variable \"&1\".";
pui["runtimeMsg"]["en_US"]["msg presskey other"]      = "Press the \"&1\" key.";
pui["runtimeMsg"]["en_US"]["msg del scrn from macro"] = "Are you sure you want to delete the selected screen(s) from this macro?<br /> All associated actions will also be deleted.";
pui["runtimeMsg"]["en_US"]["choose scrn macro"]       = "Choose a screen or macro to work with its properties.";
pui["runtimeMsg"]["en_US"]["choose a nav or toolbar"] = "Choose a navigation or toolbar item to work with its properties.";
pui["runtimeMsg"]["en_US"]["confirm del sel x"]       = "Are you sure you want to delete the selected &1?";
pui["runtimeMsg"]["en_US"]["permission settings"]     = "permission setting(s)";
pui["runtimeMsg"]["en_US"]["adding x"]                = "Adding &1...";
pui["runtimeMsg"]["en_US"]["deleting x"]              = "Deleting &1 ...";
pui["runtimeMsg"]["en_US"]["reassigning x"]           = "Reassigning &1...";
pui["runtimeMsg"]["en_US"]["loading"]                 = "Loading...";
pui["runtimeMsg"]["en_US"]["saving"]                  = "Saving...";
pui["runtimeMsg"]["en_US"]["x added"]                 = "&1 added.";
pui["runtimeMsg"]["en_US"]["x deleted"]               = "&1 deleted.";
pui["runtimeMsg"]["en_US"]["x reassigned"]            = "&1 reassigned.";
pui["runtimeMsg"]["en_US"]["x updated"]               = "&1 updated.";
pui["runtimeMsg"]["en_US"]["x saved"]                 = "&1 saved.";
pui["runtimeMsg"]["en_US"]["msg del group"]           = "Are you sure you want to delete group \"&1\"?<br /><br />Deleting groups also deletes any subgroups and any associated users.<br /><br />Are you sure you want to continue?";
pui["runtimeMsg"]["en_US"]["conf reassign users 1"]   = "Are you sure you want to reassign ";
pui["runtimeMsg"]["en_US"]["conf reassign users 2a"]  = "user \"&1\" ";
pui["runtimeMsg"]["en_US"]["conf reassign users 2b"]  = "the selected users ";
pui["runtimeMsg"]["en_US"]["conf reassign users 3"]   = " to group \"&1\"?";
pui["runtimeMsg"]["en_US"]["conf reassign group"]     = "Are you sure you want to reassign group \"&1\" to group \"&2\"?";
pui["runtimeMsg"]["en_US"]["conf delete users 1"]     = "Are you sure you want to delete ";
pui["runtimeMsg"]["en_US"]["conf delete users 2a"]    = "user \"&1\"?";
pui["runtimeMsg"]["en_US"]["conf delete users 2b"]    = "the selected users?";
pui["runtimeMsg"]["en_US"]["no users"]                = "There are no users to display.";
pui["runtimeMsg"]["en_US"]["cannot delete own grp"]   = "You cannot delete your own group.";
pui["runtimeMsg"]["en_US"]["cannot delete own usr"]   = "You cannot delete your own user profile.";
pui["runtimeMsg"]["en_US"]["not auth reassign prf"]   = "You are not authorized to reassign your own profile.";
pui["runtimeMsg"]["en_US"]["typeselect macro name"]   = "Type or select macro name...";
pui["runtimeMsg"]["en_US"]["any child items will"]    = "Any child items will also be deleted.";
pui["runtimeMsg"]["en_US"]["password must be"]        = "Passwords must be at least 6 characters.";
pui["runtimeMsg"]["en_US"]["type or sel home page"]   = "Type or select home page...";
pui["runtimeMsg"]["en_US"]["x is already in list"]    = "\"&1\" is already in the list.";
pui["runtimeMsg"]["en_US"]["x is not valid libname"]  = "\"&1\" is not a valid library name.";
pui["runtimeMsg"]["en_US"]["no libraries in list"]    = "No libraries in the list";
pui["runtimeMsg"]["en_US"]["add libl entry"]          = "Add library list entry";
pui["runtimeMsg"]["en_US"]["would you like add ano"]  = "Would you like to add another?";
pui["runtimeMsg"]["en_US"]["already in suppl grp x"]  = "User is already in supplemental group \"&1\".";

pui["runtimeText"]["en_US"] = {};
pui["runtimeText"]["en_US"]["upload select text"]   = "Select Files";
pui["runtimeText"]["en_US"]["upload clear text"]    = "Clear";
pui["runtimeText"]["en_US"]["upload remove text"]   = "Remove";
pui["runtimeText"]["en_US"]["upload upload text"]   = "Upload";
pui["runtimeText"]["en_US"]["upload drophere text"] = "Drop files here";
pui["runtimeText"]["en_US"]["upload browser unsupported"] = "Drag/drop files requires Internet Explorer 10 or higher, Chrome, or Firefox";
pui["runtimeText"]["en_US"]["upload finished text"] = "Finished";
pui["runtimeText"]["en_US"]["excel export text"]    = "Export to Excel";    //Replaces "csv export text".
pui["runtimeText"]["en_US"]["export to x"]          = "Export to &1";
pui["runtimeText"]["en_US"]["filter text"]          = "Filter";
pui["runtimeText"]["en_US"]["find text"]            = "Find";
pui["runtimeText"]["en_US"]["reset data"]           = "Reset";
pui["runtimeText"]["en_US"]["remove filters text"]  = "Remove All Filters";
pui["runtimeText"]["en_US"]["next link text"]       = "Next";
pui["runtimeText"]["en_US"]["previous link text"]   = "Previous";
pui["runtimeText"]["en_US"]["sort ascending text"]  = "Sort Ascending";
pui["runtimeText"]["en_US"]["sort descending text"] = "Sort Descending";
pui["runtimeText"]["en_US"]["row"]                  = "row";
pui["runtimeText"]["en_US"]["rows"]                 = "rows";
pui["runtimeText"]["en_US"]["page"]                 = "Page";
pui["runtimeText"]["en_US"]["collapseAll"]          = "Collapse All";
pui["runtimeText"]["en_US"]["expandAll"]            = "Expand All";
pui["runtimeText"]["en_US"]["user"]                 = "User";
pui["runtimeText"]["en_US"]["password"]             = "Password";
pui["runtimeText"]["en_US"]["pui"]                  = "Profound UI";
pui["runtimeText"]["en_US"]["pui sign on"]          = "Profound UI Sign On";
pui["runtimeText"]["en_US"]["sign on"]              = "Sign On";
pui["runtimeText"]["en_US"]["message id"]           = "Message Id";
pui["runtimeText"]["en_US"]["severity"]             = "Severity";
pui["runtimeText"]["en_US"]["date"]                 = "Date";
pui["runtimeText"]["en_US"]["time"]                 = "Time";
pui["runtimeText"]["en_US"]["program"]              = "Program";
pui["runtimeText"]["en_US"]["procedure"]            = "Procedure";
pui["runtimeText"]["en_US"]["lines"]                = "Line(s)";
pui["runtimeText"]["en_US"]["message"]              = "Message";
pui["runtimeText"]["en_US"]["new session"]          = "New Session";
pui["runtimeText"]["en_US"]["close"]                = "Close";
pui["runtimeText"]["en_US"]["current password"]     = "Current Password";
pui["runtimeText"]["en_US"]["new password"]         = "New Password";
pui["runtimeText"]["en_US"]["repeat new password"]  = "Repeat New Password";
pui["runtimeText"]["en_US"]["submit"]               = "Submit";
pui["runtimeText"]["en_US"]["exit"]                 = "Exit";
pui["runtimeText"]["en_US"]["warning"]              = "Warning";
pui["runtimeText"]["en_US"]["change password"]      = "Change Password";
pui["runtimeText"]["en_US"]["cancel"]               = "Cancel";
pui["runtimeText"]["en_US"]["find text"]            = "Find";
pui["runtimeText"]["en_US"]["remove filter"]        = "Remove Filter";
pui["runtimeText"]["en_US"]["chart"]                = "Chart";
pui["runtimeText"]["en_US"]["section"]              = "Section";
// Atrium only.
pui["runtimeText"]["en_US"]["yes"]                  = "Yes";
pui["runtimeText"]["en_US"]["no"]                   = "No";
pui["runtimeText"]["en_US"]["settings"]             = "Settings";
pui["runtimeText"]["en_US"]["favorites"]            = "Favorites";
pui["runtimeText"]["en_US"]["type query press en"]  = "Type query, press Enter.";
pui["runtimeText"]["en_US"]["add to favorites"]     = "Add to Favorites";
pui["runtimeText"]["en_US"]["rmv from favorites"]   = "Remove from Favorites";
pui["runtimeText"]["en_US"]["please wait"]          = "Please wait...";
pui["runtimeText"]["en_US"]["control panel"]        = "Control Panel";
pui["runtimeText"]["en_US"]["my settings"]          = "My Settings";
pui["runtimeText"]["en_US"]["about atrium"]         = "About Atrium";
pui["runtimeText"]["en_US"]["about atrium msg"]     = "Version: " + window["pui"]["version"] +  "<br /><br />"
  +"Copyright &copy 1999-" + new Date().getFullYear() + " Profound Logic Software, Inc.<br /><br />"
  +"Warning: This computer program is protected by copyright law<br />"
  +"and international treaties. Unauthorized reproduction or<br />"
  +"distribution of this program, or any portion of it, may result in<br />"
  +"severe civil and criminal penalties, and will be prosecuted to the<br />"
  +"maximum extent possible under the law.<br /><br />"
  +"Patented. &nbsp;U.S. Patent No. 8,667,405 B2.";
pui["runtimeText"]["en_US"]["item"]                 = "Item";
pui["runtimeText"]["en_US"]["open selected item"]   = "Open Selected Item";
pui["runtimeText"]["en_US"]["no results to dsp"]    = "No results to display.";
pui["runtimeText"]["en_US"]["displaying results"]   = "Displaying results";
pui["runtimeText"]["en_US"]["search results"]       = "Search Results";
pui["runtimeText"]["en_US"]["new folder"]           = "New Folder";
pui["runtimeText"]["en_US"]["rename"]               = "Rename";
pui["runtimeText"]["en_US"]["description"]          = "Description";
pui["runtimeText"]["en_US"]["ok"]                   = "OK";
pui["runtimeText"]["en_US"]["add"]                  = "Add";
pui["runtimeText"]["en_US"]["add x"]                = "Add &1";
pui["runtimeText"]["en_US"]["delete"]               = "Delete";
pui["runtimeText"]["en_US"]["screen"]               = "Screen";
pui["runtimeText"]["en_US"]["screens"]              = "Screens";
pui["runtimeText"]["en_US"]["macro"]                = "Macro";
pui["runtimeText"]["en_US"]["macros"]               = "Macros";
pui["runtimeText"]["en_US"]["screen id"]            = "Screen Identifier";
pui["runtimeText"]["en_US"]["screen ids"]           = "Screen Identifiers";
pui["runtimeText"]["en_US"]["field row"]            = "Field Row";
pui["runtimeText"]["en_US"]["field column"]         = "Field Column";
pui["runtimeText"]["en_US"]["field value"]          = "Field Value";
pui["runtimeText"]["en_US"]["value"]                = "Value";
pui["runtimeText"]["en_US"]["action"]               = "Action";
pui["runtimeText"]["en_US"]["actions"]              = "Actions";
pui["runtimeText"]["en_US"]["detect once"]          = "Detect Once";
pui["runtimeText"]["en_US"]["delete screen"]        = "Delete Screen";
pui["runtimeText"]["en_US"]["genie macros"]         = "Genie Macros";
pui["runtimeText"]["en_US"]["screen name"]          = "Screen name";
pui["runtimeText"]["en_US"]["identifier"]           = "Identifier";
pui["runtimeText"]["en_US"]["identifiers"]          = "Identifiers";
pui["runtimeText"]["en_US"]["macro name"]           = "Macro name";
pui["runtimeText"]["en_US"]["close browser wintab"] = "Close the browser window or tab.";
pui["runtimeText"]["en_US"]["select"]               = "Select";
pui["runtimeText"]["en_US"]["write value in field"] = "Write a value into a field";
pui["runtimeText"]["en_US"]["press a key"]          = "Press a key";
pui["runtimeText"]["en_US"]["a literal value"]      = "A literal value";
pui["runtimeText"]["en_US"]["a variable value"]     = "A variable value";
pui["runtimeText"]["en_US"]["cur user profile"]     = "The current user profile";
pui["runtimeText"]["en_US"]["result js expr"]       = "The result of a JavaScript expression";
pui["runtimeText"]["en_US"]["action data"]          = "Action data";
pui["runtimeText"]["en_US"]["data type"]            = "Data type";
pui["runtimeText"]["en_US"]["users"]                = "Users";
pui["runtimeText"]["en_US"]["all groups"]           = "All Groups";
pui["runtimeText"]["en_US"]["supplemental groups"]  = "Supplemental Groups";
pui["runtimeText"]["en_US"]["users w primary grp"]  = "Users whose Primary Group is \"&1\"";
pui["runtimeText"]["en_US"]["users w suppl grp"]    = "Users with Supplemental Group for \"&1";
pui["runtimeText"]["en_US"]["group"]                = "Group";
pui["runtimeText"]["en_US"]["groups"]               = "Groups";
pui["runtimeText"]["en_US"]["edit"]                 = "Edit";
pui["runtimeText"]["en_US"]["edit x"]               = "Edit &1";
pui["runtimeText"]["en_US"]["manager"]              = "Manager";
pui["runtimeText"]["en_US"]["administrator"]        = "Administrator";
pui["runtimeText"]["en_US"]["primary group"]        = "Primary Group";
pui["runtimeText"]["en_US"]["delete x"]             = "Delete &1";
pui["runtimeText"]["en_US"]["reassign x"]           = "Reassign &1";
pui["runtimeText"]["en_US"]["navigation item"]      = "Navigation Item";
pui["runtimeText"]["en_US"]["navigation items"]     = "Navigation Items";
pui["runtimeText"]["en_US"]["navigation panel"]     = "Navigation Panel";
pui["runtimeText"]["en_US"]["home pages"]           = "Home Pages";
pui["runtimeText"]["en_US"]["menu group"]           = "Menu Group";
pui["runtimeText"]["en_US"]["menu item"]            = "Menu Item";
pui["runtimeText"]["en_US"]["toolbar items"]        = "Toolbar Items";
pui["runtimeText"]["en_US"]["toolbar"]              = "Toolbar";
pui["runtimeText"]["en_US"]["button"]               = "Button";
pui["runtimeText"]["en_US"]["pulldown menu"]        = "Pulldown Menu";
pui["runtimeText"]["en_US"]["pulldown menu item"]   = "Pulldown Menu Item";
pui["runtimeText"]["en_US"]["separator bar"]        = "Separator Bar";
pui["runtimeText"]["en_US"]["spacer"]               = "Spacer";
pui["runtimeText"]["en_US"]["item details"]         = "Item Details";
pui["runtimeText"]["en_US"]["item number"]          = "Item number";
pui["runtimeText"]["en_US"]["item type"]            = "Item type";
pui["runtimeText"]["en_US"]["genie macro"]          = "Genie Macro";
pui["runtimeText"]["en_US"]["rdf application"]      = "Rich Display File Application";
pui["runtimeText"]["en_US"]["web application"]      = "Web Application";
pui["runtimeText"]["en_US"]["pc command"]           = "PC Command";
pui["runtimeText"]["en_US"]["dspf program library"] = "Display file program library";
pui["runtimeText"]["en_US"]["dspf program"]         = "Display file program";
pui["runtimeText"]["en_US"]["variable name x"]      = "Variable name &1";
pui["runtimeText"]["en_US"]["a tab in the portal"]  = "A tab in the portal";
pui["runtimeText"]["en_US"]["a new browser wind"]   = "A new browser window or tab";
pui["runtimeText"]["en_US"]["update"]               = "Update";
pui["runtimeText"]["en_US"]["fill"]                 = "Fill";
pui["runtimeText"]["en_US"]["permissions"]          = "Permissions";
pui["runtimeText"]["en_US"]["user/group name"]      = "User/Group Name";
pui["runtimeText"]["en_US"]["all users groups"]     = "All Users and Groups";
pui["runtimeText"]["en_US"]["type"]                 = "Type";
pui["runtimeText"]["en_US"]["access"]               = "Access";
pui["runtimeText"]["en_US"]["allow"]                = "Allow";
pui["runtimeText"]["en_US"]["disallow"]             = "Disallow";
pui["runtimeText"]["en_US"]["navigation"]           = "Navigation";
pui["runtimeText"]["en_US"]["add usrgrp perm"]      = "Add User/Group Permissions";
pui["runtimeText"]["en_US"]["membership"]           = "Membership";
pui["runtimeText"]["en_US"]["none"]                 = "None";
pui["runtimeText"]["en_US"]["remove"]               = "Remove";
pui["runtimeText"]["en_US"]["appearance"]           = "Appearance";
pui["runtimeText"]["en_US"]["home page"]            = "Home page";
pui["runtimeText"]["en_US"]["tree"]                 = "Tree";
pui["runtimeText"]["en_US"]["accordion"]            = "Accordion";
pui["runtimeText"]["en_US"]["min search chars"]     = "Minimum search characters";
pui["runtimeText"]["en_US"]["libl for rdf apps"]    = "Library List for Rich Display File Applications";
pui["runtimeText"]["en_US"]["library list"]         = "Library list";
pui["runtimeText"]["en_US"]["library"]              = "Library";
pui["runtimeText"]["en_US"]["use atrium def libl"]  = "Use Atrium default library list";
pui["runtimeText"]["en_US"]["use jobd libl"]        = "Use library list from JOBD";
pui["runtimeText"]["en_US"]["specify libl"]         = "Specify library list";
pui["runtimeText"]["en_US"]["up"]                   = "Up";
pui["runtimeText"]["en_US"]["down"]                 = "Down";
pui["runtimeText"]["en_US"]["move up"]              = "Move Up";
pui["runtimeText"]["en_US"]["move down"]            = "Move Down";
pui["runtimeText"]["en_US"]["global settings"]      = "Global settings";
pui["runtimeText"]["en_US"]["save"]                 = "Save";
pui["runtimeText"]["en_US"]["add usr to supp grp"]  = "Add User to Supplemental Group";
// Atrium.help tool-tip titles and texts. (Some are used for other fields than just tool-tips.)
pui["runtimeText"]["en_US"]["member of"]            = "Member of";
pui["runtimeText"]["en_US"]["member of hlp"]        = "The group that this user/group belongs to.";
pui["runtimeText"]["en_US"]["group name"]           = "Group name";
pui["runtimeText"]["en_US"]["group name hlp"]       = "The display name for this group.";
pui["runtimeText"]["en_US"]["inherit settings"]     = "Inherit settings";
pui["runtimeText"]["en_US"]["inherit settings hlp"] = "When this option is checked, the user/group will inherit settings from its parent. When unchecked, the user/group will have its own settings data.";
pui["runtimeText"]["en_US"]["user name"]            = "User Name";
pui["runtimeText"]["en_US"]["user name hlp"]        = "The display name of this user profile.";
pui["runtimeText"]["en_US"]["access role"]          = "Access Role";
pui["runtimeText"]["en_US"]["access role hlp"]      = "Controls the access role of this user. Administrators can manage all groups and users, and can also control application authorities. Managers can configure user and group settings within their own group. Users have no special privileges.";
pui["runtimeText"]["en_US"]["can edit profile"]     = "Can edit profile";
pui["runtimeText"]["en_US"]["can edit profile hlp"] = "Allows the user to edit \"appearance\" and \"navigation\" settings, and to change the password. All other settings are never editable by the user.";
pui["runtimeText"]["en_US"]["user profile"]         = "User Profile";
pui["runtimeText"]["en_US"]["user profile hlp"]     = "The user profile name. User profile names are case sensitive, unless IBM i profiles are used.";
pui["runtimeText"]["en_US"]["password hlp"]         = "Sets/resets the password. Passwords are case sensitive.";
pui["runtimeText"]["en_US"]["conf password"]        = "Confirm Password";
pui["runtimeText"]["en_US"]["conf password hlp"]    = "When setting/resetting the password, this field must match exactly to the new password given. Passwords are case sensitive.";
// Atrium.help tool-tip - User/group Appearance preferences.
pui["runtimeText"]["en_US"]["browser title"]        = "Browser title";
pui["runtimeText"]["en_US"]["browser title hlp"]    = "Sets the text that will display in the browser's title bar.";
pui["runtimeText"]["en_US"]["show banner"]          = "Show banner";
pui["runtimeText"]["en_US"]["show banner hlp"]      = "Uncheck this option if you do not wish to show the banner at the top of the portal.";
pui["runtimeText"]["en_US"]["banner height"]        = "Banner height";
pui["runtimeText"]["en_US"]["banner height hlp"]    = "Sets the height of the banner at the top of the portal in pixels. This setting is ignored if you have chosen not to show the banner. Valid values are 0-600 pixels.";
pui["runtimeText"]["en_US"]["banner url"]           = "Banner URL";
pui["runtimeText"]["en_US"]["banner url hlp"]       = "Sets the URL where the banner content is located. Can be either an absolute or fully qualified URL.";
pui["runtimeText"]["en_US"]["theme"]                = "Theme";
pui["runtimeText"]["en_US"]["theme hlp"]            = "Sets the default theme. This can be overridden by individual users if <strong>\"Allow users to select theme\"</strong> is enabled.";
pui["runtimeText"]["en_US"]["allow sel theme"]      = "Allow user to select theme";
pui["runtimeText"]["en_US"]["allow sel theme hlp"]  = "If checked, users will have the ability to select their desired theme using a control in the toolbar.";
pui["runtimeText"]["en_US"]["show menu search"]     = "Show menu search";
pui["runtimeText"]["en_US"]["show menu search hlp"] = "Uncheck to disable the menu search feature.";
pui["runtimeText"]["en_US"]["show fav sys"]         = "Show favorites system";
pui["runtimeText"]["en_US"]["show fav sys hlp"]     = "Uncheck to disable the favorites system.";
pui["runtimeText"]["en_US"]["show fav start"]       = "Show favorites on startup";
pui["runtimeText"]["en_US"]["show fav start hlp"]   = "If checked, the Favorites panel is shown on startup. Otherwise the Navigation panel will be shown (default). This option will only be available if Favorites system is enabled.";
pui["runtimeText"]["en_US"]["limit num sessn"]      = "Limit number of sessions";
pui["runtimeText"]["en_US"]["limit num sessn hlp"]  = "Number of Atrium sessions allowed for this user/group. A value of zero allows for unlimited sessions. The limitation is applied per web browser.";
// Atrium.help tool-tip - User/Group navigation preferences.
pui["runtimeText"]["en_US"]["show hmpg start"]      = "Show home page on startup";
pui["runtimeText"]["en_US"]["show hmpg start hlp"]  = "If checked, a customizable home page will be launched in the portal on startup.";
pui["runtimeText"]["en_US"]["home page url"]        = "Home page URL";
pui["runtimeText"]["en_US"]["home page url hlp"]    = "Sets the URL where the home page content is located. Can be either an absolute or fully qualified URL.";
pui["runtimeText"]["en_US"]["navi pnl title"]       = "Navigation panel title";
pui["runtimeText"]["en_US"]["navi pnl title hlp"]   = "Sets the text that will display in the navigation panel's title bar.";
pui["runtimeText"]["en_US"]["navi pnl width"]       = "Navigation panel start width";
pui["runtimeText"]["en_US"]["navi pnl width hlp"]   = "Sets the starting width of the navigation panel in pixels. The user can resize or even hide the panel as desired. Valid values are 0-2000 pixels.";
pui["runtimeText"]["en_US"]["navi type"]            = "Navigation type";
pui["runtimeText"]["en_US"]["navi type hlp"]        = "Controls the type of menu used in the navigation panel, \"tree\" or \"accordion\". This setting does not apply to the toolbar.";
pui["runtimeText"]["en_US"]["single click nav"]     = "Single click navigation";
pui["runtimeText"]["en_US"]["single click nav hlp"] = "If checked, menu items in the navigation panel will launch on a single click. Otherwise, they will launch only on double click. This setting does not apply to the toolbar.";
// Atrium.help tool-tip - Library list.
pui["runtimeText"]["en_US"]["current library"]      = "Current library";
pui["runtimeText"]["en_US"]["current library hlp"]  = "Specify the current library, *USRPRF, or *CRTDFT.";
pui["runtimeText"]["en_US"]["job descr"]            = "Job description";
pui["runtimeText"]["en_US"]["job descr hlp"]        = "Specify a job description to set the library list from. *USRPRF can be specified if the Atrium users are IBM i user profiles.";
pui["runtimeText"]["en_US"]["job descr lib"]        = "Job description library";
pui["runtimeText"]["en_US"]["job descr lib hlp"]    = "Specify the library for the job description. *LIBL or *CURLIB can be specified.";
// Atrium.help tool-tip - Navigation / Toolbar items.
pui["runtimeText"]["en_US"]["item name"]            = "Item name";
pui["runtimeText"]["en_US"]["item name hlp"]        = "Sets the display name of the navigation or toolbar item.";
pui["runtimeText"]["en_US"]["action type"]          = "Action type";
pui["runtimeText"]["en_US"]["action type hlp"]      = "Sets the type of application that this item launches.";
pui["runtimeText"]["en_US"]["url"]                  = "URL";
pui["runtimeText"]["en_US"]["url hlp"]              = "Sets the URL of the Web application. This can be specified either as an absolute path or a fully qualified URL. Query string parameters may be specified on the URL.";
pui["runtimeText"]["en_US"]["genie url"]            = "Genie URL";
pui["runtimeText"]["en_US"]["genie url hlp"]        = "Sets the URL that is used to launch Genie. If not specified, the default Genie URL /profoundui/auth/genie will be used. This field is useful if an alternate Genie URL or query string parameters are required. For example: /profoundui/auth/genie?skin=MyCompany";
pui["runtimeText"]["en_US"]["open as"]              = "Open as";
pui["runtimeText"]["en_US"]["open as hlp"]          = "Sets whether to launch the item as a new tab in the portal, or as a new browser window or tab. Whether the browser uses a new window or tab depends on the user's browser settings.";
pui["runtimeText"]["en_US"]["opens once only"]      = "Opens once only";
pui["runtimeText"]["en_US"]["opens once only hlp"]  = "By default, if the user launches this item when a tab is already open to it in the portal, another tab will be opened to the item. There is no limitation on the number of tabs the user can open in this way. When this open is checked, the user will not be able to open more than one tab to this item. If there is already a tab open for the item when the user selects it, the existing tab will be activated. This option is ignored when opening the item in a new browser window or tab.";
pui["runtimeText"]["en_US"]["icon"]                 = "Icon";
pui["runtimeText"]["en_US"]["icon hlp"]             = "Optional. Sets an icon file to be used for the navigation or toolbar item. The icon file can be in GIF, JPG, or PNG format. Transparent GIFs are recommended. The path should be given as an absolute path from the root of the Atrium installation. If no icon is specified, Atrium will use a default icon for navigation items. No icon will be shown for toolbar items unless specified here.";
pui["runtimeText"]["en_US"]["parameter"]            = "Parameter";
pui["runtimeText"]["en_US"]["parameter hlp"]        = "Optional: Specifies a parameter that will be passed to your Rich Display program when it is launched.";


// ----------------------------------
//  UK English -- just a copy of USA
// ----------------------------------
pui.copyAllLanguageText("en_US", "en_UK");
pui["runtimeMsg"]["en_UK"]["upload cancelled"]      = "Upload cancelled.";
pui["runtimeText"]["en_UK"]["favorites"]            = "Favourites";
pui["runtimeText"]["en_UK"]["add to favorites"]     = "Add to Favourites";
pui["runtimeText"]["en_UK"]["rmv from favorites"]   = "Remove from Favourites";
pui["runtimeText"]["en_UK"]["show fav sys"]         = "Show favourites system";
pui["runtimeText"]["en_UK"]["show fav sys hlp"]     = "Uncheck to disable the favourites system.";
pui["runtimeText"]["en_UK"]["show fav start"]       = "Show favourites on startup";
pui["runtimeText"]["en_UK"]["show fav start hlp"]   = "If checked, the Favourites panel is shown on startup. Otherwise the Navigation panel will be shown (default). This option will only be available if Favourites system is enabled.";


// ----------------------------------
//  German / Germany
// ----------------------------------
pui.copyAllLanguageText("en_US", "de_DE");
pui["runtimeMsg"]["de_DE"]["closeMessage"]            = "Die Sitzung wird beendet.";
pui["runtimeMsg"]["de_DE"]["no connection message"]   = "System i5 ist nicht erreichbar, bitte die Kommunikation prüfen und erneut versuchen.";
pui["runtimeMsg"]["de_DE"]["upload file limit"]       = "Maximum von &1 Datei(en) ist erreicht.";
pui["runtimeMsg"]["de_DE"]["upload size limit"]       = "Maximum von &1MB je Datei ist erreicht";
pui["runtimeMsg"]["de_DE"]["upload no files"]         = "Keine Datei(en) ausgewählt.";
pui["runtimeMsg"]["de_DE"]["upload duplicate file"]   = "Doppelte Dateien ausgewählt.";
pui["runtimeMsg"]["de_DE"]["upload file exists"]      = "Eine oder mehrere Datei(en) existieren bereits im Dateisystem.";
pui["runtimeMsg"]["de_DE"]["upload prevented"]        = "Operation untersagt durch Prüfprogramm.";
pui["runtimeMsg"]["de_DE"]["upload input limit"]      = "Gesamte Eingabegröße ist überschritten.";
pui["runtimeMsg"]["de_DE"]["upload no session"]       = "Keine Verbindung zu einer gültigen Sitzung.";
pui["runtimeMsg"]["de_DE"]["upload timeout"]          = "Zeitüberschreitung Vorgang.";
pui["runtimeMsg"]["de_DE"]["upload invalid response"] = "Die Server Antwort fehlt oder ist ungültig.";
pui["runtimeMsg"]["de_DE"]["close browser text"]      = "Bitte das Browserfenster schließen, um die Abmeldung zu vervollständigen.";
pui["runtimeMsg"]["de_DE"]["session ended text"]      = "Die Sitzung ist beendet.";
pui["runtimeMsg"]["de_DE"]["outside ucs2"]            = 'Buchstaben außerhalb des UCS-2 Bereichs.';
pui["runtimeMsg"]["de_DE"]["invalid number"]          = '&1 ist keine gültige Nummer.';
pui["runtimeMsg"]["de_DE"]["invalid length"]          = '&1 hat ungültige Datenlänge oder Dezimalstelle.';
pui["runtimeMsg"]["de_DE"]["invalid decimal"]         = '&1 hat zu viele Dezimalstellen. (max: &2)';
pui["runtimeMsg"]["de_DE"]["invalid choice"]          = '"&1" ist ungültig. Gültige Werte sind "&2" oder "&3".';
pui["runtimeMsg"]["de_DE"]["invalid date"]            = '"&1" ist kein gültiges Datum. Beispielformat: &2';
pui["runtimeMsg"]["de_DE"]["invalid time"]            = '"&1" ist keine gültige Zeit. Beispielformat: &2';
pui["runtimeMsg"]["de_DE"]["invalid time stamp"]      = '"&1" ist kein gültiger Zeitstempel. Beispielformat: &2';
pui["runtimeMsg"]["de_DE"]["invalid percent"]         = '&1 ist kein gültige Zahl.';
pui["runtimeMsg"]["de_DE"]["invalid digits"]          = '"&1" enthält zu viele Ziffern. Max: &2';
pui["runtimeMsg"]["de_DE"]["exceeds whole"]           = '"&1" überschreitet die maximale Anahl von Ziffern der gesamten Zahl (&2 Stellen).';
pui["runtimeMsg"]["de_DE"]["exceeds decimal"]         = '"&1" überschreitet die maximale Anzahl von Ziffern für den Nachkommateil (&2 Stellen).';
pui["runtimeMsg"]["de_DE"]["zip too long"]            = 'Postleitzahl ist zu lang. (Max.: &1 Ziffern)';
pui["runtimeMsg"]["de_DE"]["phone too long"]          = 'Telefonnummer ist zu lang. (Max.: &1 Ziffern)';
pui["runtimeMsg"]["de_DE"]["ssno too long"]           = 'Sozialversicherungsnummer ist zu lang. (Max.: &1 Ziffern)';
pui["runtimeMsg"]["de_DE"]["invalid custom val"]      = 'ungültige benutzerdefinierte Prüffunktion.';
pui["runtimeMsg"]["de_DE"]["error custom val"]        = 'Fehler in benutzerdefinierter Prüffunktion.';
pui["runtimeMsg"]["de_DE"]["ME"]                      = "Pflichtfeld, bitte Daten eingeben.";
pui["runtimeMsg"]["de_DE"]["MF"]                      = "Pflichtfeld, eine vollständige Eingabe ist notwendig.";
pui["runtimeMsg"]["de_DE"]["required"]                = "Der Wert kann nicht leer sein, Eingabe erforderlich.";
pui["runtimeMsg"]["de_DE"]["file required"]           = "Bitte mindestens eine Datei auswählen.";
pui["runtimeMsg"]["de_DE"]["signature overflow"]      = "Die Größe der Signatur überschreitet die maximale Speichergröße. Bitte löschen und erneut versuchen.";
pui["runtimeMsg"]["de_DE"]["validValues"]             = "Eingegebener Wert ist nicht gültig. Gültige Werte sind: ";
pui["runtimeMsg"]["de_DE"]["upload invalid type"]     = "Eine oder mehrere Dateien haben den falschen Typcode.";
pui["runtimeMsg"]["de_DE"]["invalid email"]           = "ungültige E-Mail-Adresse.";
pui["runtimeMsg"]["de_DE"]["session timed out"]       = "Ihre Sitzung ist abgelaufen.";
pui["runtimeMsg"]["de_DE"]["invalid low range"]       = "Wert muss größer sein als &1";
pui["runtimeMsg"]["de_DE"]["invalid high range"]      = "Wert muss kleiner oder gleich &1 sein";
pui["runtimeMsg"]["de_DE"]["invalid range"]           = "Gültiger Bereich ist zwischen &1 und &2";
pui["runtimeMsg"]["de_DE"]["unmonitored exception"]   = "Das Programm hat einen nicht überwachten Fehler gefunden. Bitte kontaktieren Sie ihren Systemadministrator.";
pui["runtimeMsg"]["de_DE"]["loading"]                 = "übertragen...";
pui["runtimeMsg"]["de_DE"]["subfile deletion"]        = "Wollen Sie wirklich die Subfile löschen?"; 
pui["runtimeText"]["de_DE"]["upload select text"]   = "Dateiauswahl";
pui["runtimeText"]["de_DE"]["upload clear text"]    = "Löschen";
pui["runtimeText"]["de_DE"]["upload remove text"]   = "Entfernen";
pui["runtimeText"]["de_DE"]["upload upload text"]   = "Heraufladen";
pui["runtimeText"]["de_DE"]["excel export text"]    = "Export nach Excel";
pui["runtimeText"]["de_DE"]["excel to x"]           = "Export nach &1";
pui["runtimeText"]["de_DE"]["filter text"]          = "Filter";
pui["runtimeText"]["de_DE"]["remove filters text"]  = "Alle Filter entfernen";
pui["runtimeText"]["de_DE"]["next link text"]       = "Nächste";
pui["runtimeText"]["de_DE"]["previous link text"]   = "Vorige";
pui["runtimeText"]["de_DE"]["sort ascending text"]  = "Sortierung aufsteigend";
pui["runtimeText"]["de_DE"]["sort descending text"] = "Sortierung absteigend";
pui["runtimeText"]["de_DE"]["row"]                  = "Zeile";
pui["runtimeText"]["de_DE"]["rows"]                 = "Zeilen";
pui["runtimeText"]["de_DE"]["page"]                 = "Seite";
pui["runtimeText"]["de_DE"]["collapseAll"]          = "alles zuklappen";
pui["runtimeText"]["de_DE"]["expandAll"]            = "alles aufklappen";
pui["runtimeText"]["de_DE"]["user"]                 = "Benutzer";
pui["runtimeText"]["de_DE"]["password"]             = "Passwort";
pui["runtimeText"]["de_DE"]["pui"]                  = "Profound UI";
pui["runtimeText"]["de_DE"]["pui sign on"]          = "Profound UI Anmeldung";
pui["runtimeText"]["de_DE"]["sign on"]              = "Aanmelding";
pui["runtimeText"]["de_DE"]["message id"]           = "Nachrichten Id";
pui["runtimeText"]["de_DE"]["severity"]             = "Schwere";
pui["runtimeText"]["de_DE"]["date"]                 = "Datum";
pui["runtimeText"]["de_DE"]["time"]                 = "Zeit";
pui["runtimeText"]["de_DE"]["program"]              = "Programm";
pui["runtimeText"]["de_DE"]["procedure"]            = "Prozedur";
pui["runtimeText"]["de_DE"]["lines"]                = "Zeile(n)";
pui["runtimeText"]["de_DE"]["message"]              = "Nachricht";
pui["runtimeText"]["de_DE"]["new session"]          = "Neue Sitzung";
pui["runtimeText"]["de_DE"]["close"]                = "Schließen";
pui["runtimeText"]["de_DE"]["current password"]     = "Aktuelles Passwort";
pui["runtimeText"]["de_DE"]["new password"]         = "Neues Passwort";
pui["runtimeText"]["de_DE"]["repeat new password"]  = "Wiederholung neues Passwort";
pui["runtimeText"]["de_DE"]["submit"]               = "Bestätigen";
pui["runtimeText"]["de_DE"]["exit"]                 = "Ende";
pui["runtimeText"]["de_DE"]["warning"]              = "Warnung";
pui["runtimeText"]["de_DE"]["change password"]      = "Ändern Passwort";
pui["runtimeText"]["de_DE"]["cancel"]               = "Abbrechen";
pui["runtimeText"]["de_DE"]["find text"]            = "Finden";
pui["runtimeText"]["de_DE"]["remove filter"]        = "Filter entfernen";


// ----------------------------------
//  Portuguese (Portugal)
// ----------------------------------

pui.copyAllLanguageText("en_US", "pt_PT");
pui["runtimeMsg"]["pt_PT"]["closeMessage"]            = "Isto terminará a sua sessão.";
pui["runtimeMsg"]["pt_PT"]["no connection message"]   = "Não é possível estabelecer ligação com o servidor. Verifique a ligação e tente de novo.";
pui["runtimeMsg"]["pt_PT"]["upload file limit"]       = "Limite de &1 ficheiro(s) excedido.";
pui["runtimeMsg"]["pt_PT"]["upload size limit"]       = "Limite de &1MB por ficheiro excedido";
pui["runtimeMsg"]["pt_PT"]["upload no files"]         = "Não há ficheiros selecionados.";
pui["runtimeMsg"]["pt_PT"]["upload duplicate file"]   = "Foram selecionados ficheiros em duplicado.";
pui["runtimeMsg"]["pt_PT"]["upload file exists"]      = "Um ou mais ficheiros já existem no sistema de ficheiros.";
pui["runtimeMsg"]["pt_PT"]["upload prevented"]        = "Operação impedida por 'exit program'.";
pui["runtimeMsg"]["pt_PT"]["upload input limit"]      = "Foi excedido o limite do tamanho total do 'input'.";
pui["runtimeMsg"]["pt_PT"]["upload no session"]       = "Não está conectado a uma sessão válida.";
pui["runtimeMsg"]["pt_PT"]["upload timeout"]          = "Foi excedido o tempo limite para a transacção.";
pui["runtimeMsg"]["pt_PT"]["upload invalid response"] = "Não existe resposta do servidor ou a mesma é inválida.";
pui["runtimeMsg"]["pt_PT"]["close browser text"]      = "A fim de completar o processo de encerramento da sessão, por favor feche a janela do browser.";
pui["runtimeMsg"]["pt_PT"]["session ended text"]      = "A sua sessão foi encerrada.";
pui["runtimeMsg"]["pt_PT"]["outside ucs2"]            = 'Caractéres fora do âmbito UCS-2.';
pui["runtimeMsg"]["pt_PT"]["invalid number"]          = '&1 não é um número válido.';
pui["runtimeMsg"]["pt_PT"]["invalid length"]          = '&1 tem comprimento ou casas décimais incorrectos.';
pui["runtimeMsg"]["pt_PT"]["invalid decimal"]         = '&1 tem demasiadas casas décimais. (max: &2)';
pui["runtimeMsg"]["pt_PT"]["invalid choice"]          = '"&1" é inválido. Escolhas válidas são: "&2" ou "&3".';
pui["runtimeMsg"]["pt_PT"]["invalid date"]            = '"&1" não é uma data válida. Exemplo de formato correcto: &2';
pui["runtimeMsg"]["pt_PT"]["invalid time"]            = '"&1" não é um valor de tempo correcto. Exemplo de formato correcto: &2';
pui["runtimeMsg"]["pt_PT"]["invalid time stamp"]      = '"&1" não é um registo de tempo válido. Exemplo de formato correcto: &2';
pui["runtimeMsg"]["pt_PT"]["invalid percent"]         = '&1 não é um valor décimal.';
pui["runtimeMsg"]["pt_PT"]["invalid digits"]          = '"&1" contém demasiados dígitos. Max: &2';
pui["runtimeMsg"]["pt_PT"]["exceeds whole"]           = '"&1" excede o número máximo de dígitos para a parte numérica do campo (&2 digits).';
pui["runtimeMsg"]["pt_PT"]["exceeds decimal"]         = '"&1" excede o número máximo de dígitos para a parte décimal do campo (&2 digits).';
pui["runtimeMsg"]["pt_PT"]["zip too long"]            = 'O código postal é demasiado grande. (Maximum: &1 digits)';
pui["runtimeMsg"]["pt_PT"]["phone too long"]          = 'O número de telefone é demasiado grande. (Maximum: &1 digits)';
pui["runtimeMsg"]["pt_PT"]["ssno too long"]           = 'O código da segurança social é demasiado grande. (Maximum: &1 digits)';
pui["runtimeMsg"]["pt_PT"]["invalid custom val"]      = 'Validação de função customizada inválida.';
pui["runtimeMsg"]["pt_PT"]["error custom val"]        = 'Erro na validação de função costumizada.';
pui["runtimeMsg"]["pt_PT"]["ME"]                      = "Campo obrigatório. Tem que introduzir dados.";
pui["runtimeMsg"]["pt_PT"]["MF"]                      = "Campo de preenchimento total obrigatório. Deve preencher completamente a caixa de entrada.";
pui["runtimeMsg"]["pt_PT"]["required"]                = "O valor não pode estar em branco. Este campo é requerido.";
pui["runtimeMsg"]["pt_PT"]["file required"]           = "Deve seleccionar pelo menos um ficheiro.";
pui["runtimeMsg"]["pt_PT"]["signature overflow"]      = "A imagem da assinatura excede o número máximo de bytes disponíveis para o seu armazenamento. Por favor limpe a caixa da assinatura e tente de novo.";
pui["runtimeMsg"]["pt_PT"]["validValues"]             = "O valor introduzido não é válido. Valores válidos: ";
pui["runtimeMsg"]["pt_PT"]["upload invalid type"]     = "Um ou mais ficheiros são de tipo inválido.";
pui["runtimeMsg"]["pt_PT"]["invalid email"]           = "inválido e-mail.";
pui["runtimeMsg"]["pt_PT"]["session timed out"]       = "A sua sessão expirou.";
pui["runtimeMsg"]["pt_PT"]["invalid low range"]       = "O valor deve ser maior ou igual a &1";
pui["runtimeMsg"]["pt_PT"]["invalid high range"]      = "O valor deve ser menor ou igual a &1";
pui["runtimeMsg"]["pt_PT"]["invalid range"]           = "O Intervalo válido é de &1 a &2";
pui["runtimeMsg"]["pt_PT"]["unmonitored exception"]   = "A aplicação encontrou uma excepção não monitorizada. Por favor conte o administrador de systema.";
pui["runtimeMsg"]["pt_PT"]["loading"]                 = "A carregar...";
pui["runtimeMsg"]["pt_PT"]["subfile deletion"]        = "Tem certeza que deseja excluir o subarquivo?";  
pui["runtimeText"]["pt_PT"]["upload select text"]   = "Ficheiros Selecionados";
pui["runtimeText"]["pt_PT"]["upload clear text"]    = "Limpar";
pui["runtimeText"]["pt_PT"]["upload remove text"]   = "Remover";
pui["runtimeText"]["pt_PT"]["upload upload text"]   = "Enviar";
pui["runtimeText"]["pt_PT"]["excel export text"]    = "Exportar para Excel";
pui["runtimeText"]["pt_PT"]["excel to x"]           = "Exportar para &1";
pui["runtimeText"]["pt_PT"]["filter text"]          = "Filtrar";
pui["runtimeText"]["pt_PT"]["remove filters text"]  = "Remover Todos os  Filtros";
pui["runtimeText"]["pt_PT"]["next link text"]       = "Próximo";
pui["runtimeText"]["pt_PT"]["previous link text"]   = "Anterior";
pui["runtimeText"]["pt_PT"]["sort ascending text"]  = "Ordenar Ascendentemente";
pui["runtimeText"]["pt_PT"]["sort descending text"] = "Ordenar Descendentemente";
pui["runtimeText"]["pt_PT"]["row"]                  = "linha";
pui["runtimeText"]["pt_PT"]["rows"]                 = "linhas";
pui["runtimeText"]["pt_PT"]["page"]                 = "Página";
pui["runtimeText"]["pt_PT"]["collapseAll"]          = "Recolher tudo";
pui["runtimeText"]["pt_PT"]["expandAll"]            = "Expandir tudo";
pui["runtimeText"]["pt_PT"]["user"]                 = "Utilizador";
pui["runtimeText"]["pt_PT"]["password"]             = "Palavra Passe";
pui["runtimeText"]["pt_PT"]["pui"]                  = "Profound UI";
pui["runtimeText"]["pt_PT"]["pui sign on"]          = "Entrar em Profound UI";
pui["runtimeText"]["pt_PT"]["sign on"]              = "Entrar";
pui["runtimeText"]["pt_PT"]["message id"]           = "Id da mensagem";
pui["runtimeText"]["pt_PT"]["severity"]             = "Severidade";
pui["runtimeText"]["pt_PT"]["date"]                 = "Data";
pui["runtimeText"]["pt_PT"]["time"]                 = "Hora";
pui["runtimeText"]["pt_PT"]["program"]              = "Programa";
pui["runtimeText"]["pt_PT"]["procedure"]            = "Procedimento";
pui["runtimeText"]["pt_PT"]["lines"]                = "Linha(s)";
pui["runtimeText"]["pt_PT"]["message"]              = "Mensagem";
pui["runtimeText"]["pt_PT"]["new session"]          = "Nova Sessão";
pui["runtimeText"]["pt_PT"]["close"]                = "Fechar";
pui["runtimeText"]["pt_PT"]["current password"]     = "Palavra Chave Actual";
pui["runtimeText"]["pt_PT"]["new password"]         = "Palavra Chave Nova";
pui["runtimeText"]["pt_PT"]["repeat new password"]  = "Repetir Palavra Chave";
pui["runtimeText"]["pt_PT"]["submit"]               = "Submeter";
pui["runtimeText"]["pt_PT"]["exit"]                 = "Sair";
pui["runtimeText"]["pt_PT"]["warning"]              = "Aviso";
pui["runtimeText"]["pt_PT"]["change password"]      = "Alterar Palavra Chave";
pui["runtimeText"]["pt_PT"]["cancel"]               = "Cancelar";
pui["runtimeText"]["pt_PT"]["find text"]            = "Encontrar";
pui["runtimeText"]["pt_PT"]["remove filter"]        = "Retirar filtro";


// ------------------------------------------------------------
//  Portuguese (Copy for Brazil)
//   only difference is to replace "ficheiro" with "arquivo"
// -------------------------------------------------------------
pui.copyAllLanguageText("pt_PT", "pt_BR");
pui["runtimeMsg"]["pt_BR"]["upload file limit"]       = "Limite de &1 arquivo(s) excedido.";
pui["runtimeMsg"]["pt_BR"]["upload size limit"]       = "Limite de &1MB por arquivo excedido";
pui["runtimeMsg"]["pt_BR"]["upload no files"]         = "Não há arvquivos selecionados.";
pui["runtimeMsg"]["pt_BR"]["upload duplicate file"]   = "Foram selecionados arvquivos em duplicado.";
pui["runtimeMsg"]["pt_BR"]["upload file exists"]      = "Um ou mais arquivos já existem no sistema de arquivos.";
pui["runtimeMsg"]["pt_BR"]["file required"]           = "Deve seleccionar pelo menos um arquivo.";
pui["runtimeText"]["pt_BR"]["upload select text"]     = "Arquivos Selecionados";
pui["runtimeText"]["pt_BR"]["row"]                    = "fileira";
pui["runtimeText"]["pt_BR"]["rows"]                   = "fileiras";
pui["runtimeMsg"]["pt_BR"]["upload invalid type"]     = "Um ou mais arquivos são de tipo inválido.";
pui["runtimeMsg"]["pt_BR"]["session timed out"]       = "A sua sessão expirou.";
pui["runtimeMsg"]["pt_BR"]["loading"]                 = "Carregando...";

// ------------------------------------------------------------
//  Spanish / Spain
// -------------------------------------------------------------
pui.copyAllLanguageText("en_US", "es_ES");
pui["runtimeMsg"]["es_ES"]["closeMessage"]            = "Esto cerrará su sesión.";
pui["runtimeMsg"]["es_ES"]["no connection message"]   = "No es posible establecer ligación al servidor. Verifique la ligación y él intente de nuevo.";
pui["runtimeMsg"]["es_ES"]["upload file limit"]       = "Límite de &1 archivo(s) excedido.";
pui["runtimeMsg"]["es_ES"]["upload size limit"]       = "Límite de &1MB por archivo excedido";
pui["runtimeMsg"]["es_ES"]["upload no files"]         = "No hay archivos seleccionados.";
pui["runtimeMsg"]["es_ES"]["upload duplicate file"]   = "Archivos seleccionados en duplicado.";
pui["runtimeMsg"]["es_ES"]["upload file exists"]      = "Uno o más archivos ya existen en lo sistema de archivos.";
pui["runtimeMsg"]["es_ES"]["upload prevented"]        = "Operación embargada por 'exit program'.";
pui["runtimeMsg"]["es_ES"]["upload input limit"]      = "El límite del tamaño total del 'input' fue excedido.";
pui["runtimeMsg"]["es_ES"]["upload no session"]       = "No está conectado con una sesión válida.";
pui["runtimeMsg"]["es_ES"]["upload timeout"]          = "El tiempo límite por la transacción fue excedido.";
pui["runtimeMsg"]["es_ES"]["upload invalid response"] = "No hay contestación del servidor o ella es inválida.";
pui["runtimeMsg"]["es_ES"]["close browser text"]      = "Para terminar el proceso de cierre de la sesión, por favor cierre el browser.";
pui["runtimeMsg"]["es_ES"]["session ended text"]      = "Su sesión fue cerrada.";
pui["runtimeMsg"]["es_ES"]["outside ucs2"]            = 'Caracteres fuera de la gama UCS-2.';
pui["runtimeMsg"]["es_ES"]["invalid number"]          = '&1 no es un numero válido.';
pui["runtimeMsg"]["es_ES"]["invalid length"]          = '&1 tiene longitud o casas decimales incorrectos.';
pui["runtimeMsg"]["es_ES"]["invalid decimal"]         = '&1 tiene excesivas casas decimales. (max: &2)';
pui["runtimeMsg"]["es_ES"]["invalid choice"]          = '"&1" es inválido. Las opciones válidas son: "&2" ou "&3".';
pui["runtimeMsg"]["es_ES"]["invalid date"]            = '"&1" no es una fecha válida. Ejemplo del formato correcto: &2';
pui["runtimeMsg"]["es_ES"]["invalid time"]            = '"&1" no es un valor de tiempo correcto. Ejemplo del formato correcto: &2';
pui["runtimeMsg"]["es_ES"]["invalid time stamp"]      = '"&1" no es un registro del tiempo válido. Ejemplo del formato correcto: &2';
pui["runtimeMsg"]["es_ES"]["invalid percent"]         = '&1 no es un valor decimal.';
pui["runtimeMsg"]["es_ES"]["invalid digits"]          = '"&1" contiene demasiado dígitos. Max: &2';
pui["runtimeMsg"]["es_ES"]["exceeds whole"]           = '"&1" excede el número máximo de dígitos para la parte numérica del campo (&2 digits).';
pui["runtimeMsg"]["es_ES"]["exceeds decimal"]         = '"&1" excede el número máximo de dígitos para la parte decimal del campo (&2 digits).';
pui["runtimeMsg"]["es_ES"]["zip too long"]            = 'El código postal es demasiado grande. (Máximo: &1 digits)';
pui["runtimeMsg"]["es_ES"]["phone too long"]          = 'El número de teléfono es demasiado grande. (Máximo: &1 digits)';
pui["runtimeMsg"]["es_ES"]["ssno too long"]           = 'El código de la Seguridad Social es demasiado grande. (Máximo: &1 digits)';
pui["runtimeMsg"]["es_ES"]["invalid custom val"]      = 'Validación de función custom inválida.';
pui["runtimeMsg"]["es_ES"]["error custom val"]        = 'Error en la validación de función costum.';
pui["runtimeMsg"]["es_ES"]["ME"]                      = "Campo de entrada obligatorio. Usted debe incorporar datos.";
pui["runtimeMsg"]["es_ES"]["MF"]                      = "Campo de introducción total obligatoria. Usted debe llenar la caja de entrada totalmente .";
pui["runtimeMsg"]["es_ES"]["required"]                = "El valor no puede estar en blanco. Se requiere este campo.";
pui["runtimeMsg"]["es_ES"]["file required"]           = "Debe seleccionar al menos un archivo.";
pui["runtimeMsg"]["es_ES"]["signature overflow"]      = "La imagen de la firma excede el número máximo de los bytes disponibles para su almacenaje. Por favor borre la caja de la firma e intente de nuevo .";
pui["runtimeMsg"]["es_ES"]["validValues"]             = "El valor introducido es inválido. Valores válidos son: ";
pui["runtimeMsg"]["es_ES"]["upload invalid type"]     = "Uno o más archivos son de tipo inválido.";
pui["runtimeMsg"]["es_ES"]["invalid email"]           = "dirección de correo electrónico no es válida.";
pui["runtimeMsg"]["es_ES"]["session timed out"]       = "El tiempo de su sesión ha expirado.";
pui["runtimeMsg"]["es_ES"]["invalid low range"]       = "El valor debe ser mayor o igual a &1";
pui["runtimeMsg"]["es_ES"]["invalid high range"]      = "El valor debe ser menor o igual a &1";
pui["runtimeMsg"]["es_ES"]["invalid range"]           = "El valor debe estar comprendido entre &1 y &2";
pui["runtimeMsg"]["es_ES"]["unmonitored exception"]   = "Este programa ha encontrado algunas excepciones no monitorieadas. Favor contactar al administrador del sistema para su ayuda.";
pui["runtimeMsg"]["es_ES"]["loading"]                 = "cargando...";

pui["runtimeText"]["es_ES"]["upload select text"]   = "Archivos Seleccionados";
pui["runtimeText"]["es_ES"]["upload clear text"]    = "Borrar";
pui["runtimeText"]["es_ES"]["upload remove text"]   = "Remover";
pui["runtimeText"]["es_ES"]["upload upload text"]   = "Cargar";
pui["runtimeText"]["es_ES"]["excel export text"]    = "Exportar para Excel";
pui["runtimeText"]["es_ES"]["excel to x"]           = "Exportar para &1";
pui["runtimeText"]["es_ES"]["filter text"]          = "Filtrar";
pui["runtimeText"]["es_ES"]["remove filters text"]  = "Remover Todos os Filtros";
pui["runtimeText"]["es_ES"]["next link text"]       = "Próximo";
pui["runtimeText"]["es_ES"]["previous link text"]   = "Anterior";
pui["runtimeText"]["es_ES"]["sort ascending text"]  = "Ordenación Ascendente";
pui["runtimeText"]["es_ES"]["sort descending text"] = "Ordenación Descendente";
pui["runtimeText"]["es_ES"]["row"]                  = "línea";
pui["runtimeText"]["es_ES"]["rows"]                 = "líneas";
pui["runtimeText"]["es_ES"]["page"]                 = "Página";
pui["runtimeText"]["es_ES"]["collapseAll"]          = "Contraer todo";
pui["runtimeText"]["es_ES"]["expandAll"]            = "Expandir todo";
pui["runtimeText"]["es_ES"]["user"]                 = "Usuario";
pui["runtimeText"]["es_ES"]["password"]             = "Contraseña";
pui["runtimeText"]["es_ES"]["pui"]                  = "Profound UI";
pui["runtimeText"]["es_ES"]["pui sign on"]          = "Profound UI Ingreso";
pui["runtimeText"]["es_ES"]["sign on"]              = "Ingreso";
pui["runtimeText"]["es_ES"]["message id"]           = "Identificacion de mensaje";
pui["runtimeText"]["es_ES"]["severity"]             = "Severidad";
pui["runtimeText"]["es_ES"]["date"]                 = "Fecha";
pui["runtimeText"]["es_ES"]["time"]                 = "Hora";
pui["runtimeText"]["es_ES"]["program"]              = "Programa";
pui["runtimeText"]["es_ES"]["procedure"]            = "Procedimiento";
pui["runtimeText"]["es_ES"]["lines"]                = "Linea(s)";
pui["runtimeText"]["es_ES"]["message"]              = "Mensaje";
pui["runtimeText"]["es_ES"]["new session"]          = "Nueva sesión";
pui["runtimeText"]["es_ES"]["close"]                = "Cerrar";
pui["runtimeText"]["es_ES"]["current password"]     = "Contraseña Actual";
pui["runtimeText"]["es_ES"]["new password"]         = "Nueva contraseña";
pui["runtimeText"]["es_ES"]["repeat new password"]  = "Repetir nueva contraseña";
pui["runtimeText"]["es_ES"]["submit"]               = "Enviar";
pui["runtimeText"]["es_ES"]["exit"]                 = "Salir";
pui["runtimeText"]["es_ES"]["warning"]              = "Advertencia";
pui["runtimeText"]["es_ES"]["change password"]      = "Cambiar contraseña";
pui["runtimeText"]["es_ES"]["cancel"]               = "Cancelar";
pui["runtimeText"]["es_ES"]["find text"]            = "Encontrar";
pui["runtimeText"]["es_ES"]["remove filter"]        = "Quitar filtro";


// ------------------------------------------------------------
//  Copy Spanish Spanish to Mexican Spanish
// -------------------------------------------------------------
pui.copyAllLanguageText("es_ES", "es_MX");
pui["runtimeMsg"]["es_MX"]["closeMessage"]            = "Esto finalizará su sesión.";
pui["runtimeMsg"]["es_MX"]["no connection message"]   = "No se puede accesar el servidor. Verifique su conexión y trate de nuevo.";
pui["runtimeMsg"]["es_MX"]["upload file limit"]       = "Límite de &1 archivo(s) excedido.";
pui["runtimeMsg"]["es_MX"]["upload size limit"]       = "Límite de &1MB por archivo excedido";
pui["runtimeMsg"]["es_MX"]["upload no files"]         = "No hay archivos seleccionados.";
pui["runtimeMsg"]["es_MX"]["upload duplicate file"]   = "Archivos duplicados seleccionados.";
pui["runtimeMsg"]["es_MX"]["upload file exists"]      = "Uno a más archivos ya existen en el sistema de archivos.";
pui["runtimeMsg"]["es_MX"]["upload prevented"]        = "Operación evitada por programa de salida.";
pui["runtimeMsg"]["es_MX"]["upload input limit"]      = "Límite de tamaño total de entrada excedido";
pui["runtimeMsg"]["es_MX"]["upload no session"]       = "No está conectado en una sesión válida.";
pui["runtimeMsg"]["es_MX"]["upload timeout"]          = "La transacción excedió el límite de tiempo.";
pui["runtimeMsg"]["es_MX"]["upload invalid response"] = "La respuesta del servidor es inválida o no se encuentra.";
pui["runtimeMsg"]["es_MX"]["close browser text"]      = "Para completar el proceso de cierre de sesión, favor cerrar la ventana de su navegador.";
pui["runtimeMsg"]["es_MX"]["session ended text"]      = "Su sesión ha terminado.";
pui["runtimeMsg"]["es_MX"]["outside ucs2"]            = 'Los caracteres están fuera del rango del UCS-2.';
pui["runtimeMsg"]["es_MX"]["invalid number"]          = '&1 no es un número válido.';
pui["runtimeMsg"]["es_MX"]["invalid length"]          = '&1 tiene un largo de datos, o posición decimal incorrectos.';
pui["runtimeMsg"]["es_MX"]["invalid decimal"]         = '&1 tiene demasiadas posiciones decimales. (Máx.: &2)';
pui["runtimeMsg"]["es_MX"]["invalid choice"]          = '"&1" es inválido. Las opciones válidas son: "&2" o "&3".';
pui["runtimeMsg"]["es_MX"]["invalid date"]            = '"&1" no es una fecha  válida. Ejemplo del formato : &2';
pui["runtimeMsg"]["es_MX"]["invalid time"]            = '"&1" no es una la hora válida. Ejemplo del formato : &2';
pui["runtimeMsg"]["es_MX"]["invalid time stamp"]      = '"&1" no es una fecha-hora válida. Ejemplo del formato: &2';
pui["runtimeMsg"]["es_MX"]["invalid percent"]         = '&1 no es un decimal válido.';
pui["runtimeMsg"]["es_MX"]["invalid digits"]          = '"&1"contiene demasiados dígitos. Máx: &2';
pui["runtimeMsg"]["es_MX"]["exceeds whole"]           = '"&1" excede el número máximo de dígitos para la porción del número entero (&2 dígitos).';
pui["runtimeMsg"]["es_MX"]["exceeds decimal"]         = '"&1" excede el número máximo de dígitos para la porción decimal (&2 dígitos).';
pui["runtimeMsg"]["es_MX"]["zip too long"]            = 'Código de área es demasiado largo. (Máximo: &1 dígitos)';
pui["runtimeMsg"]["es_MX"]["phone too long"]          = 'Número de Teléfono es demasiado largo. (Máximo: &1 dígitos)';
pui["runtimeMsg"]["es_MX"]["ssno too long"]           = 'Número de Seguro Social muy largo. (Máximo: &1 dígitos)';
pui["runtimeMsg"]["es_MX"]["invalid custom val"]      = 'Función de validación personalizada es inválida.';
pui["runtimeMsg"]["es_MX"]["error custom val"]        = 'Error en la validación de la función personalizada.';
pui["runtimeMsg"]["es_MX"]["invalid email"]           = "dirección de correo electrónico no es válida.";
pui["runtimeMsg"]["es_MX"]["ME"]                      = "Campo de entrada obligatorio. Debe ingresar los datos.";
pui["runtimeMsg"]["es_MX"]["MF"]                      = "Campo de relleno obligatorio. Debe rellenar el cuadro de entrada completamente.";
pui["runtimeMsg"]["es_MX"]["required"]                = "El valor no puede ser blanco. Este campo es requerido.";
pui["runtimeMsg"]["es_MX"]["file required"]           = "Debe seleccionar al menos un archivo.";
pui["runtimeMsg"]["es_MX"]["signature overflow"]      = "El tamaño del dibujo de la firma excede el número máximo de bytes disponible para almacenar la firma. Por favor borre el área de firma y trate de nuevo.";
pui["runtimeMsg"]["es_MX"]["validValues"]             = "El valor ingresado es invalido. Los valores válidos son: ";
pui["runtimeMsg"]["es_MX"]["session timed out"]       = "El tiempo de su sesión ha expirado.";

pui["runtimeText"]["es_MX"]["upload select text"]     = "Seleccionar Archivos";
pui["runtimeText"]["es_MX"]["upload clear text"]      = "Limpiar";
pui["runtimeText"]["es_MX"]["upload remove text"]     = "Eliminar";
pui["runtimeText"]["es_MX"]["upload upload text"]     = "Subir";
pui["runtimeText"]["es_MX"]["excel export text"]      = "Exportar a Excel";
pui["runtimeText"]["es_MX"]["excel to x"]             = "Exportar a &1";
pui["runtimeText"]["es_MX"]["filter text"]            = "Filtrar";
pui["runtimeText"]["es_MX"]["remove filters text"]    = "Eliminar todos los filtros";
pui["runtimeText"]["es_MX"]["next link text"]         = "Siguiente";
pui["runtimeText"]["es_MX"]["previous link text"]     = "Anterior";
pui["runtimeText"]["es_MX"]["sort ascending text"]    = "Orden Ascendente";
pui["runtimeText"]["es_MX"]["sort descending text"]   = "Orden Descendente";
pui["runtimeText"]["es_MX"]["row"]                    = "fila";
pui["runtimeText"]["es_MX"]["rows"]                   = "filas";
pui["runtimeText"]["es_MX"]["page"]                   = "Página";

//pui["runtimeText"]["es_MX"]["show fav start"]       = "Mostrar favoritos en el arranque";
//pui["runtimeText"]["es_MX"]["show fav start hlp"]   = "Si es seleccionado, el panel Favoritos se muestra en el arranque. De lo contrario el panel Navegación será el que se muestre (acción por omisión). Esta opción solo estará disponible si se habilita el sistema Favoritos.";


// ------------------------------------------------------------
//  Viva la France!
// -------------------------------------------------------------
pui.copyAllLanguageText("en_US", "fr_FR");
pui["runtimeMsg"]["fr_FR"]["closeMessage"]            = "Ceci terminera votre session.";
pui["runtimeMsg"]["fr_FR"]["no connection message"]   = "Impossible d'établir une connexion au serveur. S'il vous plaît, vérifiez la connexion et essayez à nouveau.";
pui["runtimeMsg"]["fr_FR"]["upload file limit"]       = "Limite de &1 fichier(s) dépassée.";
pui["runtimeMsg"]["fr_FR"]["upload size limit"]       = "Limite de &1MB par fichier dépassée.";
pui["runtimeMsg"]["fr_FR"]["upload no files"]         = "Pas de fichiers sélectionnés.";
pui["runtimeMsg"]["fr_FR"]["upload duplicate file"]   = "Fichiers sélectionnés en double.";
pui["runtimeMsg"]["fr_FR"]["upload file exists"]      = "Un ou plusieurs fichiers existent déjà dans le système de fichiers.";
pui["runtimeMsg"]["fr_FR"]["upload prevented"]        = "Opération empêchée par «exit program».";
pui["runtimeMsg"]["fr_FR"]["upload input limit"]      = "Limite de taille totale des données dépassée.";
pui["runtimeMsg"]["fr_FR"]["upload no session"]       = "Vous n'êtes pas connecté(e) à une session valide.";
pui["runtimeMsg"]["fr_FR"]["upload timeout"]          = "Le temps limite pour la transaction a été dépassé.";
pui["runtimeMsg"]["fr_FR"]["upload invalid response"] = "Le serveur ne répond pas ou n'est pas joignable.";
pui["runtimeMsg"]["fr_FR"]["upload cancelled"]		    = "Téléversement annulé";
pui["runtimeMsg"]["fr_FR"]["close browser text"]      = "Pour terminer la session, veuillez fermez la fenêtre du navigateur.";
pui["runtimeMsg"]["fr_FR"]["session ended text"]      = "Votre session est terminée.";
pui["runtimeMsg"]["fr_FR"]["outside ucs2"]            = 'Caractères en dehors de la norme UCS-2.';
pui["runtimeMsg"]["fr_FR"]["invalid number"]          = "&1 n'est pas un nombre valide.";
pui["runtimeMsg"]["fr_FR"]["invalid length"]          = '&1 a une longueur ou une position de décimale incorrecte.';
pui["runtimeMsg"]["fr_FR"]["invalid decimal"]         = "&1 comporte trop de décimales. (max: &2)";
pui["runtimeMsg"]["fr_FR"]["invalid choice"]          = "\"&1\" est incorrect. Les choix possibles sont: \"&2\" ou \"&3\".";
pui["runtimeMsg"]["fr_FR"]["invalid date"]            = "\"&1\" n'est pas une date valide. Exemple de format correct: &2";
pui["runtimeMsg"]["fr_FR"]["invalid time"]            = "\"&1\" n'est pas une heure valide. Exemple de format correct: &2";
pui["runtimeMsg"]["fr_FR"]["invalid time stamp"]      = "\"&1\" n'est pas un horodatage valide. Exemple de format correct: &2";
pui["runtimeMsg"]["fr_FR"]["invalid percent"]         = "&1 n'est pas une décimale valide.";
pui["runtimeMsg"]["fr_FR"]["invalid digits"]          = "\"&1\" contient un nombre de chiffres trop élévé. Max: &2";
pui["runtimeMsg"]["fr_FR"]["exceeds whole"]           = '"&1" dépasse le nombre maximum de chiffres pour la partie numérique du champ (&2 digits).';
pui["runtimeMsg"]["fr_FR"]["exceeds decimal"]         = '"&1" dépasse le nombre maximum de chiffres pour la partie décimale du champ (&2 digits).';
pui["runtimeMsg"]["fr_FR"]["zip too long"]            = 'Le code postal est trop long. (Maximum: &1 digits)';
pui["runtimeMsg"]["fr_FR"]["phone too long"]          = 'Le numéro de téléphone est trop long. (Maximum: &1 digits)';
pui["runtimeMsg"]["fr_FR"]["ssno too long"]           = 'Le code de sécurité sociale est trop long. (Maximum: &1 digits)';
pui["runtimeMsg"]["fr_FR"]["invalid custom val"]      = 'La fonction de validation personnalisée est invalide.';
pui["runtimeMsg"]["fr_FR"]["error custom val"]        = 'Erreur dans la fonction de validation personnalisée.';
pui["runtimeMsg"]["fr_FR"]["ME"]                      = "Ce champ est obligatoire.";
pui["runtimeMsg"]["fr_FR"]["MF"]                      = "Tous les caractères de ce champ doivent être saisis.";
pui["runtimeMsg"]["fr_FR"]["required"]                = "Ce champ est obligatoire et ne peut être à blanc.";
pui["runtimeMsg"]["fr_FR"]["file required"]           = "Vous devez sélectionner au moins un fichier.";
pui["runtimeMsg"]["fr_FR"]["signature overflow"]      = "L'image de la signature dépasse le nombre maximum de bytes disponibles pour son stockage. S'il vous plaît, effacez la signature et essayez à nouveau.";
pui["runtimeMsg"]["fr_FR"]["validValues"]             = "La valeur saisie n'est pas valide. Les valeurs valides sont :";
pui["runtimeMsg"]["fr_FR"]["upload invalid type"]     = "Un ou plusieurs fichiers sont de type invalide.";
pui["runtimeMsg"]["fr_FR"]["invalid email"]           = "Adresse email invalide.";
pui["runtimeMsg"]["fr_FR"]["session timed out"]       = "Votre session a expiré.";
pui["runtimeMsg"]["fr_FR"]["invalid low range"]       = "La valeur doit être supérieure ou égale à &1";
pui["runtimeMsg"]["fr_FR"]["invalid high range"]      = "La valeur doit être inférieure ou égale à &1";
pui["runtimeMsg"]["fr_FR"]["invalid range"]           = "La valeur doit être comprise entre &1 et &2.";
pui["runtimeMsg"]["fr_FR"]["unmonitored exception"]   = "Le programme a rencontré une erreur non prévue. Prière de contacter l'administrateur système pour toute assistance.";
// Atrium
pui["runtimeMsg"]["fr_FR"]["num sessions exceeded"]   = "Nombre de sessions dépassé.";
pui["runtimeMsg"]["fr_FR"]["unable to load portal"]   = "Impossible de charger les paramètres ou les éléments de navigation du portail.";
pui["runtimeMsg"]["fr_FR"]["unable to load macr act"] = "Impossible de charger les actions des macros.";
pui["runtimeMsg"]["fr_FR"]["unable to load macr var"] = "Impossible de charger les variables des macros.";
pui["runtimeMsg"]["fr_FR"]["unable to load scrn lst"] = "Impossible de charger la liste des écrans.";
pui["runtimeMsg"]["fr_FR"]["unable to load new sett"] = "Impossible de charger les nouveaux paramètres.";
pui["runtimeMsg"]["fr_FR"]["unable to load x"]        = "Impossible de charger &1.";
pui["runtimeMsg"]["fr_FR"]["unable to add x"]         = "Impossible d'ajouter &1.";
pui["runtimeMsg"]["fr_FR"]["unable to rename x"]      = "Impossible de renommer &1.";
pui["runtimeMsg"]["fr_FR"]["unable to delete x"]      = "Impossible de supprimer &1.";
pui["runtimeMsg"]["fr_FR"]["unable to update x"]      = "Impossible de mettre à jour &1.";
pui["runtimeMsg"]["fr_FR"]["unable to reassn x"]      = "Impossible de réassigner &1.";
pui["runtimeMsg"]["fr_FR"]["unable to reorder items"] = "Impossible de réordonner les éléments.";
pui["runtimeMsg"]["fr_FR"]["unable to save theme"]    = "Impossible d'enregistrer le paramètre du thème.";
pui["runtimeMsg"]["fr_FR"]["unable eval script url"]  = "Impossible d'évaluer le script d'URL de l'application Web.";
pui["runtimeMsg"]["fr_FR"]["close browser text AT"]   = "Les modifications non enregistrées de la session ou des sessions seront perdus.";
pui["runtimeMsg"]["fr_FR"]["close all tabs"]          = "Fermer tous les onglets ?";
pui["runtimeMsg"]["fr_FR"]["close tab"]               = "Voulez-vous fermer cet onglet ?";
pui["runtimeMsg"]["fr_FR"]["invalid script url"]      = "Valeurs invalides dans le script d'URL de l'application Web.";
pui["runtimeMsg"]["fr_FR"]["unrecognized format"]     = "Format non reconnu.";
pui["runtimeMsg"]["fr_FR"]["screen already defined"]  = "Écran \"&1\" déjà défini.";
pui["runtimeMsg"]["fr_FR"]["macro already defined"]   = "Macro \"&1\" déjà définie.";
pui["runtimeMsg"]["fr_FR"]["no screen ids"]           = "Il n'y a aucun identifiant d'écran à afficher";
pui["runtimeMsg"]["fr_FR"]["confirm delete"]          = "Confirmer la suppression";
pui["runtimeMsg"]["fr_FR"]["no actions"]              = "Il n'y a aucune action à afficher";
pui["runtimeMsg"]["fr_FR"]["msg action input var"]    = "Entrer la valeur de la variable \"&1\" dans le champ en ligne &2 colonne &3.";
pui["runtimeMsg"]["fr_FR"]["msg action input user"]   = "Entrer le profil de l'utilisateur en cours dans le champ en ligne &1 colonne &2.";
pui["runtimeMsg"]["fr_FR"]["msg action input js"]     = "Entrer le résultat de l'expression JavaScript <strong>&1</strong> dans le champ en ligne &2 colonne &3.";
pui["runtimeMsg"]["fr_FR"]["msg action input other"]  = "Entrer la valeur \"&1\" dans le champ en ligne &2 colonne &3.";
pui["runtimeMsg"]["fr_FR"]["msg presskey var"]        = "Appuyer sur la touche définie dans la variable \"&1\".";
pui["runtimeMsg"]["fr_FR"]["msg presskey other"]      = "Appuyer sur la touche \"&1\".";
pui["runtimeMsg"]["fr_FR"]["msg del scrn from macro"] = "Êtes-vous sûr(e) de vouloir supprimer le(s) écran(s) sélectionné(s) de cette macro ?<br /> Toutes les actions associées seront aussi supprimées.";
pui["runtimeMsg"]["fr_FR"]["choose scrn macro"]       = "Choisir un écran ou une macro pour définir ses propriétés.";
pui["runtimeMsg"]["fr_FR"]["choose a nav or toolbar"] = "Choisir un élément de navigation ou de barre d'outils pour définir ses propriétés.";
pui["runtimeMsg"]["fr_FR"]["confirm del sel x"]       = "Êtes-vous sûr(e) de vouloir supprimer le/la &1 sélectionné(e) ?";
pui["runtimeMsg"]["fr_FR"]["permission settings"]     = "paramètre(s) d'autorisation";
pui["runtimeMsg"]["fr_FR"]["adding x"]                = "Ajout en cours de &1...";
pui["runtimeMsg"]["fr_FR"]["deleting x"]              = "Suppession en cours de &1 ...";
pui["runtimeMsg"]["fr_FR"]["reassigning x"]           = "Réassignement en cuors de &1...";
pui["runtimeMsg"]["fr_FR"]["loading"]                 = "Chargement...";
pui["runtimeMsg"]["fr_FR"]["subfile deletion"]        = "Êtes-vous certain de vouloir supprimer le sous-fichier?";
pui["runtimeMsg"]["fr_FR"]["saving"]                  = "Enregistrement en cours...";
pui["runtimeMsg"]["fr_FR"]["x added"]                 = "&1 ajouté(e).";
pui["runtimeMsg"]["fr_FR"]["x deleted"]               = "&1 supprimé(e).";
pui["runtimeMsg"]["fr_FR"]["x reassigned"]            = "&1 réassigné(e).";
pui["runtimeMsg"]["fr_FR"]["x updated"]               = "&1 mis(e) à jour.";
pui["runtimeMsg"]["fr_FR"]["x saved"]                 = "&1 enregistré(e).";
pui["runtimeMsg"]["fr_FR"]["msg del group"]           = "Êtes-vous sûr(e) de vouloir supprimer le groupe \"&1\" ?<br /><br />Supprimer des groupes entraîne aussi la suppression de tous les sous-groupes et de toutes les associations d'utilisateurs.<br /><br />Êtes-vous sûr(e) de vouloir continuer ?";
pui["runtimeMsg"]["fr_FR"]["conf reassign users 1"]   = "Êtes-vous sûr(e) de vouloir réassigner ";
pui["runtimeMsg"]["fr_FR"]["conf reassign users 2a"]  = "l'utilisateur \"&1\" ";
pui["runtimeMsg"]["fr_FR"]["conf reassign users 2b"]  = "les utilisateurs sélectionnés ";
pui["runtimeMsg"]["fr_FR"]["conf reassign users 3"]   = " au group \"&1\" ?";
pui["runtimeMsg"]["fr_FR"]["conf reassign group"]     = "Êtes-vous sûr(e) de vouloir réassigner le group \"&1\" au group \"&2\" ?";
pui["runtimeMsg"]["fr_FR"]["conf delete users 1"]     = "Êtes-vous sûr(e) de vouloir supprimer ";
pui["runtimeMsg"]["fr_FR"]["conf delete users 2a"]    = "l'utilisateur \"&1\" ?";
pui["runtimeMsg"]["fr_FR"]["conf delete users 2b"]    = "les utilisateurs sélectionnés ?";
pui["runtimeMsg"]["fr_FR"]["no users"]                = "Il n'y a aucun utilisateur à  afficher.";
pui["runtimeMsg"]["fr_FR"]["cannot delete own grp"]   = "Vous ne pouvez pas supprimer votre propre groupe.";
pui["runtimeMsg"]["fr_FR"]["cannot delete own usr"]   = "Vous ne pouvez pas supprimer votre propre profil.";
pui["runtimeMsg"]["fr_FR"]["not auth reassign prf"]   = "Vous n'êtes pas autorisé(e) à réassigner votre propre profil.";
pui["runtimeMsg"]["fr_FR"]["typeselect macro name"]   = "Saisir ou sélectionner un nom de macro...";
pui["runtimeMsg"]["fr_FR"]["any child items will"]    = "Tout élément enfant sera aussi supprimé.";
pui["runtimeMsg"]["fr_FR"]["password must be"]        = "Les mots de passe doivent comporter au moins 6 caractères.";
pui["runtimeMsg"]["fr_FR"]["type or sel home page"]   = "Saisir ou sélectionner une page d'accueil...";
pui["runtimeMsg"]["fr_FR"]["x is already in list"]    = "\"&1\" figure déjà dans la liste.";
pui["runtimeMsg"]["fr_FR"]["x is not valid libname"]  = "\"&1\" n'est pas un nom valide de bibliothèque.";
pui["runtimeMsg"]["fr_FR"]["no libraries in list"]    = "Aucune bibliothèque dans la liste";
pui["runtimeMsg"]["fr_FR"]["add libl entry"]          = "Ajouter une entrée dans la liste de bibliothèque";
pui["runtimeMsg"]["fr_FR"]["would you like add ano"]  = "Voulez-vous en ajouter une autre ?";
pui["runtimeMsg"]["fr_FR"]["already in suppl grp x"]  = "L'utilisateur figure déjà dans le groupe supplémentaire \"&1\".";

pui["runtimeText"]["fr_FR"]["upload select text"]   = "Fichiers sélectionnés ";
pui["runtimeText"]["fr_FR"]["upload clear text"]    = "Effacer ";
pui["runtimeText"]["fr_FR"]["upload remove text"]   = "Retirer ";
pui["runtimeText"]["fr_FR"]["upload upload text"]   = "Envoyer ";
pui["runtimeText"]["fr_FR"]["upload drophere text"] = "Déposer les fichiers ici.";
pui["runtimeText"]["fr_FR"]["upload browser unsupported"] = "Glisser/déposer des fichiers requiert Internet Explorer 10 ou plus récent, Chrome, ou Firefox";
pui["runtimeText"]["fr_FR"]["upload finished text"] = "Fini";
pui["runtimeText"]["fr_FR"]["excel export text"]    = "Exporter vers Excel ";
pui["runtimeText"]["fr_FR"]["excel to x"]           = "Exporter vers &1";
pui["runtimeText"]["fr_FR"]["filter text"]          = "Filtrer ";
pui["runtimeText"]["fr_FR"]["remove filters text"]  = "Supprimer tous les filtres ";
pui["runtimeText"]["fr_FR"]["next link text"]       = "Suivante ";
pui["runtimeText"]["fr_FR"]["previous link text"]   = "Précédente ";
pui["runtimeText"]["fr_FR"]["sort ascending text"]  = "Trier dans l'ordre croissant";
pui["runtimeText"]["fr_FR"]["sort descending text"] = "Trier dans l'ordre décroissant";
pui["runtimeText"]["fr_FR"]["row"]                  = "ligne";
pui["runtimeText"]["fr_FR"]["rows"]                 = "lignes";
pui["runtimeText"]["fr_FR"]["page"]                 = "Page";
pui["runtimeText"]["fr_FR"]["collapseAll"]          = "Tout replier";
pui["runtimeText"]["fr_FR"]["expandAll"]            = "Tout déplier";
pui["runtimeText"]["fr_FR"]["user"]                 = "Utilisateur";
pui["runtimeText"]["fr_FR"]["password"]             = "Mot de passe";
pui["runtimeText"]["fr_FR"]["pui"]                  = "Profound UI";
pui["runtimeText"]["fr_FR"]["pui sign on"]          = "Identification Profound UI";
pui["runtimeText"]["fr_FR"]["sign on"]              = "Identification";
pui["runtimeText"]["fr_FR"]["message id"]           = "N° du message";
pui["runtimeText"]["fr_FR"]["severity"]             = "Sévérité";
pui["runtimeText"]["fr_FR"]["date"]                 = "Date";
pui["runtimeText"]["fr_FR"]["time"]                 = "Heure";
pui["runtimeText"]["fr_FR"]["program"]              = "Programme";
pui["runtimeText"]["fr_FR"]["procedure"]            = "Procédure";
pui["runtimeText"]["fr_FR"]["lines"]                = "Ligne(s)";
pui["runtimeText"]["fr_FR"]["message"]              = "Message";
pui["runtimeText"]["fr_FR"]["new session"]          = "Nouvelle session";
pui["runtimeText"]["fr_FR"]["close"]                = "Fermer";
pui["runtimeText"]["fr_FR"]["current password"]     = "Mot de passe actuel";
pui["runtimeText"]["fr_FR"]["new password"]         = "Nouveau mot de passe";
pui["runtimeText"]["fr_FR"]["repeat new password"]  = "Répéter le nouveau mot de passe";
pui["runtimeText"]["fr_FR"]["submit"]               = "Soumettre";
pui["runtimeText"]["fr_FR"]["exit"]                 = "Quitter";
pui["runtimeText"]["fr_FR"]["warning"]              = "Avertissement";
pui["runtimeText"]["fr_FR"]["change password"]      = "Modifier le mot de passe";
pui["runtimeText"]["fr_FR"]["cancel"]               = "Annuler";
pui["runtimeText"]["fr_FR"]["find text"]            = "Trouver";
pui["runtimeText"]["fr_FR"]["remove filter"]        = "Supprimer le filtre";
// Atrium 
pui["runtimeText"]["fr_FR"]["settings"]             = "Paramètres";
pui["runtimeText"]["fr_FR"]["favorites"]            = "Favoris";
pui["runtimeText"]["fr_FR"]["type query press en"]  = "Saisir une requête, appuyer sur Entrée.";
pui["runtimeText"]["fr_FR"]["add to favorites"]     = "Ajouter aux favoris";
pui["runtimeText"]["fr_FR"]["rmv from favorites"]   = "Supprimer des favoris";
pui["runtimeText"]["fr_FR"]["please wait"]          = "Veuillez patienter...";
pui["runtimeText"]["fr_FR"]["control panel"]        = "Panneau de contrôle";
pui["runtimeText"]["fr_FR"]["my settings"]          = "Mes paramètres";
pui["runtimeText"]["fr_FR"]["about atrium"]         = "À propos d'Atrium";
pui["runtimeText"]["fr_FR"]["about atrium msg"]     = "Version: " + window["pui"]["version"] +  "<br /><br />"
  +"Copyright &copy 1999-" + new Date().getFullYear() + " Profound Logic Software, Inc.<br /><br />"
  +"Attention: Ce logiciel est protégé par le code de la propriété intellectuelle<br />"
  +"et des traités internationaux. Toute reproduction non autorisée ou<br />"
  +"distribution de ce logiciel, même partielle, peut entraîner<br />"
  +"de graves sanctions civiles ou pénales, et entraînera<br />"
  +"les poursuites maximales possibles prévues par la loi.<br /><br />"
  +"Breveté. &nbsp;U.S. Brevet No. 8,667,405 B2.";
pui["runtimeText"]["fr_FR"]["item"]                 = "Élément";
pui["runtimeText"]["fr_FR"]["open selected item"]   = "Ouvrir l'élément sélectionné";
pui["runtimeText"]["fr_FR"]["no results to dsp"]    = "Aucun résultat à afficher.";
pui["runtimeText"]["fr_FR"]["displaying results"]   = "Résultats en cours d'affichage";
pui["runtimeText"]["fr_FR"]["search results"]       = "Recherche en cours";
pui["runtimeText"]["fr_FR"]["new folder"]           = "Nouveau dossier";
pui["runtimeText"]["fr_FR"]["rename"]               = "Renommer";
pui["runtimeText"]["fr_FR"]["description"]          = "Description";
pui["runtimeText"]["fr_FR"]["ok"]                   = "OK";
pui["runtimeText"]["fr_FR"]["yes"]                  = "Oui";
pui["runtimeText"]["fr_FR"]["no"]                   = "Non";
pui["runtimeText"]["fr_FR"]["add"]                  = "Ajouter";
pui["runtimeText"]["fr_FR"]["add x"]                = "Ajouter &1";
pui["runtimeText"]["fr_FR"]["delete"]               = "Supprimer";
pui["runtimeText"]["fr_FR"]["screen"]               = "Écran";
pui["runtimeText"]["fr_FR"]["screens"]              = "Écrans";
pui["runtimeText"]["fr_FR"]["macro"]                = "Macro";
pui["runtimeText"]["fr_FR"]["macros"]               = "Macros";
pui["runtimeText"]["fr_FR"]["screen id"]            = "Identifiant de l'écran";
pui["runtimeText"]["fr_FR"]["screen ids"]           = "Identifiants d'écran";
pui["runtimeText"]["fr_FR"]["field row"]            = "Champ Ligne";
pui["runtimeText"]["fr_FR"]["field column"]         = "Champ Colonne";
pui["runtimeText"]["fr_FR"]["field value"]          = "Valeur du champ";
pui["runtimeText"]["fr_FR"]["value"]                = "Valeur";
pui["runtimeText"]["fr_FR"]["action"]               = "Action";
pui["runtimeText"]["fr_FR"]["actions"]              = "Actions";
pui["runtimeText"]["fr_FR"]["detect once"]          = "Détection unique";
pui["runtimeText"]["fr_FR"]["delete screen"]        = "Supprimer Écran";
pui["runtimeText"]["fr_FR"]["genie macros"]         = "Macros Genie";
pui["runtimeText"]["fr_FR"]["screen name"]          = "Nom d'écran";
pui["runtimeText"]["fr_FR"]["identifier"]           = "Identifier";
pui["runtimeText"]["fr_FR"]["identifiers"]          = "Identifiers";
pui["runtimeText"]["fr_FR"]["macro name"]           = "Nom de la macro";
pui["runtimeText"]["fr_FR"]["close browser wintab"] = "Fermer la fenêtre ou l'onglet du navigateur.";
pui["runtimeText"]["fr_FR"]["select"]               = "Sélectionner";
pui["runtimeText"]["fr_FR"]["write value in field"] = "Saisir une valeur dans un champ";
pui["runtimeText"]["fr_FR"]["press a key"]          = "Appuyer sur une touche";
pui["runtimeText"]["fr_FR"]["a literal value"]      = "Une constante";
pui["runtimeText"]["fr_FR"]["a variable value"]     = "Une variable";
pui["runtimeText"]["fr_FR"]["cur user profile"]     = "Le profil utilisateur en cours";
pui["runtimeText"]["fr_FR"]["result js expr"]       = "Le résultat d'une expression JavaScript";
pui["runtimeText"]["fr_FR"]["action data"]          = "Donnée de l'action";
pui["runtimeText"]["fr_FR"]["data type"]            = "Type de donnée";
pui["runtimeText"]["fr_FR"]["users"]                = "Utilisateurs";
pui["runtimeText"]["fr_FR"]["all groups"]           = "Tous les groupes";
pui["runtimeText"]["fr_FR"]["supplemental groups"]  = "Groupes supplémentaires";
pui["runtimeText"]["fr_FR"]["users w primary grp"]  = "Utilisateurs dont le groupe principal est \"&1\"";
pui["runtimeText"]["fr_FR"]["users w suppl grp"]    = "Utilisateurs ayant pour groupe supplémentaire \"&1";
pui["runtimeText"]["fr_FR"]["group"]                = "Groupe";
pui["runtimeText"]["fr_FR"]["groups"]               = "Groupes";
pui["runtimeText"]["fr_FR"]["edit"]                 = "Modifier";
pui["runtimeText"]["fr_FR"]["edit x"]               = "Modifier &1";
pui["runtimeText"]["fr_FR"]["manager"]              = "Gérer";
pui["runtimeText"]["fr_FR"]["administrator"]        = "Administrateur";
pui["runtimeText"]["fr_FR"]["primary group"]        = "Groupe principal";
pui["runtimeText"]["fr_FR"]["delete x"]             = "Supprimer &1";
pui["runtimeText"]["fr_FR"]["reassign x"]           = "Réassigner &1";
pui["runtimeText"]["fr_FR"]["navigation item"]      = "Élément de Navigation";
pui["runtimeText"]["fr_FR"]["navigation items"]     = "Éléments de Navigation";
pui["runtimeText"]["fr_FR"]["navigation panel"]     = "Panneau de Navigation";
pui["runtimeText"]["fr_FR"]["home pages"]           = "Pages d'accueil";
pui["runtimeText"]["fr_FR"]["menu group"]           = "Groupe de Menu";
pui["runtimeText"]["fr_FR"]["menu item"]            = "Élément de Menu";
pui["runtimeText"]["fr_FR"]["toolbar items"]        = "Éléments de Barre d'outils";
pui["runtimeText"]["fr_FR"]["toolbar"]              = "Barre d'outils";
pui["runtimeText"]["fr_FR"]["button"]               = "Bouton";
pui["runtimeText"]["fr_FR"]["pulldown menu"]        = "Menu déroulant";
pui["runtimeText"]["fr_FR"]["pulldown menu item"]   = "Élément de Menu déroulant";
pui["runtimeText"]["fr_FR"]["separator bar"]        = "Barre de séparation";
pui["runtimeText"]["fr_FR"]["spacer"]               = "Espace";
pui["runtimeText"]["fr_FR"]["item details"]         = "Détail de l'élément";
pui["runtimeText"]["fr_FR"]["item number"]          = "N° de l'élément";
pui["runtimeText"]["fr_FR"]["item type"]            = "Type d'élément";
pui["runtimeText"]["fr_FR"]["genie macro"]          = "Macro Genie";
pui["runtimeText"]["fr_FR"]["rdf application"]      = "Application Rich Display File";
pui["runtimeText"]["fr_FR"]["web application"]      = "Application web";
pui["runtimeText"]["fr_FR"]["pc command"]           = "Commande PC";
pui["runtimeText"]["fr_FR"]["dspf program library"] = "Bibliothèque du programme";
pui["runtimeText"]["fr_FR"]["dspf program"]         = "Nom du programme";
pui["runtimeText"]["fr_FR"]["variable name x"]      = "Variable name &1";
pui["runtimeText"]["fr_FR"]["a tab in the portal"]  = "Un onglet dans le portail";
pui["runtimeText"]["fr_FR"]["a new browser wind"]   = "Une nouvelle fenêtre ou onglet du navigateur";
pui["runtimeText"]["fr_FR"]["update"]               = "Mettre à jour";
pui["runtimeText"]["fr_FR"]["fill"]                 = "Remplir";
pui["runtimeText"]["fr_FR"]["permissions"]          = "Autorisations";
pui["runtimeText"]["fr_FR"]["user/group name"]      = "Nom Utilisateur/Groupe";
pui["runtimeText"]["fr_FR"]["all users groups"]     = "Tous les Utilisateurs et Groupes";
pui["runtimeText"]["fr_FR"]["type"]                 = "Type";
pui["runtimeText"]["fr_FR"]["access"]               = "Droit";
pui["runtimeText"]["fr_FR"]["allow"]                = "Autoriser";
pui["runtimeText"]["fr_FR"]["disallow"]             = "Interdire";
pui["runtimeText"]["fr_FR"]["navigation"]           = "Navigation";
pui["runtimeText"]["fr_FR"]["add usrgrp perm"]      = "Ajouter des Autorisations Utilisateur/Groupe";
pui["runtimeText"]["fr_FR"]["membership"]           = "Appartenance";
pui["runtimeText"]["fr_FR"]["none"]                 = "Aucun";
pui["runtimeText"]["fr_FR"]["remove"]               = "Supprimer";
pui["runtimeText"]["fr_FR"]["appearance"]           = "Appearance";
pui["runtimeText"]["fr_FR"]["home page"]            = "Page d'accueil";
pui["runtimeText"]["fr_FR"]["tree"]                 = "Ramification";
pui["runtimeText"]["fr_FR"]["accordion"]            = "Accordéon";
pui["runtimeText"]["fr_FR"]["min search chars"]     = "Caractères minimum de recherche";
pui["runtimeText"]["fr_FR"]["libl for rdf apps"]    = "Liste des bibliothèques pour les applications Rich Display File";
pui["runtimeText"]["fr_FR"]["library list"]         = "Liste des bibliothèques";
pui["runtimeText"]["fr_FR"]["library"]              = "Bibliothèque";
pui["runtimeText"]["fr_FR"]["use atrium def libl"]  = "Utiliser la liste des bibliothèques par défaut de l'Atrium";
pui["runtimeText"]["fr_FR"]["use jobd libl"]        = "Utiliser la liste des bibliothèques de la JOBD";
pui["runtimeText"]["fr_FR"]["specify libl"]         = "Spécifier la liste des bibliothèques";
pui["runtimeText"]["fr_FR"]["up"]                   = "Haut";
pui["runtimeText"]["fr_FR"]["down"]                 = "Bas";
pui["runtimeText"]["fr_FR"]["move up"]              = "Déplacer vers le haut";
pui["runtimeText"]["fr_FR"]["move down"]            = "Déplacer vers le bas";
pui["runtimeText"]["fr_FR"]["global settings"]      = "Paramètres généraux";
pui["runtimeText"]["fr_FR"]["save"]                 = "Enregistrer";
pui["runtimeText"]["fr_FR"]["add usr to supp grp"]  = "Ajouter un utilisateur à un Groupe Supplémentaire";
// Atrium.help tool-tip titles and texts. (Some are used for other fields than just tool-tips.)
pui["runtimeText"]["fr_FR"]["member of"]            = "Membre de";
pui["runtimeText"]["fr_FR"]["member of hlp"]        = "Le groupe auquel appartient cet utilisateur/groupe.";
pui["runtimeText"]["fr_FR"]["group name"]           = "Nom du Groupe";
pui["runtimeText"]["fr_FR"]["group name hlp"]       = "Le nom affiché pour ce Groupe.";
pui["runtimeText"]["fr_FR"]["inherit settings"]     = "Hériter des paramètres";
pui["runtimeText"]["fr_FR"]["inherit settings hlp"] = "Si cette option est cochée, l'utilisateur/groupe héritera des paramètres de son parent. Si décochée, l'utilisateur/groupe aura ses propres données de paramètres.";
pui["runtimeText"]["fr_FR"]["user name"]            = "Nom d'utilisateur";
pui["runtimeText"]["fr_FR"]["user name hlp"]        = "Nom affiché pour cet utilisateur.";
pui["runtimeText"]["fr_FR"]["access role"]          = "Rôle";
pui["runtimeText"]["fr_FR"]["access role hlp"]      = "Contrôle le rôle de cet utilisateur. Les Administrateurs peuvent gérer tous les groupes et utilisateurs, et peuvent aussi gérer les droits des éléments. Les Managers peuvent configurer les paramètres des groupes et utilisateurs au sein de leur propre groupe. Les Utilisateurs n'ont aucun privilège.";
pui["runtimeText"]["fr_FR"]["can edit profile"]     = "Peut modifier un profil";
pui["runtimeText"]["fr_FR"]["can edit profile hlp"] = "Autorise l'utilisateur à modifier les paramètres \"d'apparence\" et \"de navigation\" , et à modifier le mot de passe. Aucun autre paramètre n'est modifiable par l'utilisateur.";
pui["runtimeText"]["fr_FR"]["user profile"]         = "Profil Utilisateur";
pui["runtimeText"]["fr_FR"]["user profile hlp"]     = "Le nom du profil utilisateur. Les noms des profils utilisateurs sont sensibles à la casse, sauf pour les profils IBM i.";
pui["runtimeText"]["fr_FR"]["password hlp"]         = "Définir/réinitialiser le mot de passe. Les mots de passe sont sensibles à la casse.";
pui["runtimeText"]["fr_FR"]["conf password"]        = "Confirmer le Mot de passe";
pui["runtimeText"]["fr_FR"]["conf password hlp"]    = "Quand le Mot de passe est défini/réinitialisé, ce champ doit correspondre au nouveau Mot de passe. Les mots de passe sont sensibles à la casse.";
// Atrium.help tool-tip - User/group Appearance preferences.
pui["runtimeText"]["fr_FR"]["browser title"]        = "Titre du Navigateur";
pui["runtimeText"]["fr_FR"]["browser title hlp"]    = "Définit le texte affiché dans la barre de titre du navigateur.";
pui["runtimeText"]["fr_FR"]["show banner"]          = "Afficher la bannière";
pui["runtimeText"]["fr_FR"]["show banner hlp"]      = "Décocher cette option si vous ne souhaitez pas afficher la bannière en haut du portail.";
pui["runtimeText"]["fr_FR"]["banner height"]        = "Hauteur de la bannière";
pui["runtimeText"]["fr_FR"]["banner height hlp"]    = "Définit en pixels la hauteur de la bannière en haut du portail. Ce paramètre est ignoré si vous avez choisi de ne pas afficher la bannière. Plage des valeurs valides : 0 à 600 pixels.";
pui["runtimeText"]["fr_FR"]["banner url"]           = "URL de la bannière";
pui["runtimeText"]["fr_FR"]["banner url hlp"]       = "Définit l'URL du contenu de la bannière. L'URL peut être aboslue ou relative.";
pui["runtimeText"]["fr_FR"]["theme"]                = "Thème";
pui["runtimeText"]["fr_FR"]["theme hlp"]            = "Définit le Thème par défaut. Ce paramètre peut être écrasé individuellement par chaque utilisateur si <strong>\"Autoriser l'utilisateur à choisir le thème\"</strong> est activé.";
pui["runtimeText"]["fr_FR"]["allow sel theme"]      = "Autoriser l'utilisateur à choisir le thème";
pui["runtimeText"]["fr_FR"]["allow sel theme hlp"]  = "Si coché, les utilisateurs auront la possibilité de choisir le thème via un menu déroulant dans la barre d'outils.";
pui["runtimeText"]["fr_FR"]["show menu search"]     = "Afficher la zone de recherche";
pui["runtimeText"]["fr_FR"]["show menu search hlp"] = "Décocher pour masquer la zone de recherche.";
pui["runtimeText"]["fr_FR"]["show fav sys"]         = "Afficher les favoris";
pui["runtimeText"]["fr_FR"]["show fav sys hlp"]     = "Décocher pour masquer les favoris.";
pui["runtimeText"]["fr_FR"]["show fav start"]       = "Afficher les favoris au démarrage";
pui["runtimeText"]["fr_FR"]["show fav start hlp"]   = "Si coché, le panneau des Favoris sera affiché au démarrage. Sinon, le Panneau de navigation sera affiché (par défaut). Cette option n'est disponible que si le système de Favoris est actifa été activé.";
pui["runtimeText"]["fr_FR"]["limit num sessn"]      = "Limiter le nombre de sessions";
pui["runtimeText"]["fr_FR"]["limit num sessn hlp"]  = "Nombre maximum de sessions autorisé par l'Atrium pour cet utilisateur/groupe. Une valeur de zéro correspond à un nombre illimité de sessions. La limite est fixée par navigateur.";
// Atrium.help tool-tip - User/Group navigation preferences.
pui["runtimeText"]["fr_FR"]["show hmpg start"]      = "Afficher la page d'accueil au démarrage";
pui["runtimeText"]["fr_FR"]["show hmpg start hlp"]  = "Si coché, une page d'accueil personnalisable sera affichée au démarrage.";
pui["runtimeText"]["fr_FR"]["home page url"]        = "URL de la page d'accueil";
pui["runtimeText"]["fr_FR"]["home page url hlp"]    = "Définit l'URL du contenu de la page d'accueil. L'URL peut être aboslue ou relative.";
pui["runtimeText"]["fr_FR"]["navi pnl title"]       = "Titre du panneau de Navigation";
pui["runtimeText"]["fr_FR"]["navi pnl title hlp"]   = "Définit le texte à afficher dans la barre de titre du panneau de Navigation.";
pui["runtimeText"]["fr_FR"]["navi pnl width"]       = "Largeur initiale du panneau de Navigation";
pui["runtimeText"]["fr_FR"]["navi pnl width hlp"]   = "Définit en pixels la largeur initiale du panneau de Navigation. L'utilisateur peut modifier ou même masquer le panneau à sa guise. Plage des valeurs valides : 0-2000 pixels.";
pui["runtimeText"]["fr_FR"]["navi type"]            = "Type de Navigation";
pui["runtimeText"]["fr_FR"]["navi type hlp"]        = "Contrôle le type de menu utilisé dans le panneau de Navigation, \"ramification\" ou \"accordéon\". Ce paramètre ne s'applique pas aux barres d'outils.";
pui["runtimeText"]["fr_FR"]["single click nav"]     = "Navigation en un clic";
pui["runtimeText"]["fr_FR"]["single click nav hlp"] = "Si coché, les éléments du menu dans le panneau de Navigation seront exécuté sur un simple clic. Sinon, ils ne seront exécutés qu'après un double-clic. Ce paramètre ne s'applique pas aux barres d'outils.";
// Atrium.help tool-tip - Library list.
pui["runtimeText"]["fr_FR"]["current library"]      = "Bibliothèque en cours";
pui["runtimeText"]["fr_FR"]["current library hlp"]  = "Spécifie la bibliothèque en cours, *USRPRF or *CRTDFT.";
pui["runtimeText"]["fr_FR"]["job descr"]            = "Description du job";
pui["runtimeText"]["fr_FR"]["job descr hlp"]        = "Spécifie la description du job afin d'en déduire la liste des bibliothèques. *USRPRF peut être spécifié si les utilisateurs de l'Atrium ont des profils IBM i.";
pui["runtimeText"]["fr_FR"]["job descr lib"]        = "Bibliothèque de la description du job";
pui["runtimeText"]["fr_FR"]["job descr lib hlp"]    = "Spécifie la bibliothèque pour la description du job. *LIBL ou *CURLIB peuvent être spécifiées.";
// Atrium.help tool-tip - Navigation / Toolbar items.
pui["runtimeText"]["fr_FR"]["item name"]            = "Nom de l'élément";
pui["runtimeText"]["fr_FR"]["item name hlp"]        = "Définit le nom d'affichage de l'élément de navigation ou de la barre d'outils.";
pui["runtimeText"]["fr_FR"]["action type"]          = "Type d'action";
pui["runtimeText"]["fr_FR"]["action type hlp"]      = "Définit le type de l'application lancée par cet élément.";
pui["runtimeText"]["fr_FR"]["url"]                  = "URL";
pui["runtimeText"]["fr_FR"]["url hlp"]              = "Définit l'URL de l'application Web. L'URL peut être aboslue ou relative. Des paramètres de requête peuvent être spécifiés dans l'URL.";
pui["runtimeText"]["fr_FR"]["genie url"]            = "URL Genie";
pui["runtimeText"]["fr_FR"]["genie url hlp"]        = "Définit l'URL utilisée pour lancer le Genie. Si non spécifiée, l'URL Genie par défaut /profoundui/auth/genie sera utilisée. Ce champ est utile dans le cas d'une URL Genie personnalisée ou lorsque des paramètres de requêtes sont nécessaires. par exemple : /profoundui/auth/genie?skin=MyCompany";
pui["runtimeText"]["fr_FR"]["open as"]              = "Ouvrir en tant que";
pui["runtimeText"]["fr_FR"]["open as hlp"]          = "Définit si l'élément doit être ouvert dans un nouvel onglet du portail ou en tant que nouvelle fenêtre/nouvel onglet du navigateur. L'utilisation d'une fenêtre ou onglet du navigateur dépend des réglages de celui-ci.";
pui["runtimeText"]["fr_FR"]["opens once only"]      = "Exécution unique";
pui["runtimeText"]["fr_FR"]["opens once only hlp"]  = "Par défaut, si l'utilisateur exécute l'élément alors que celui-ci est déjà ouvert dans le portail, un nouvel onglet est utilisé. Il n'y a pas de limite du nombre d'onglets que l'utilisateur est capable d'ouvrir de cette façon. Quand cette option est cochée, l'utilisateur ne pourra ouvrir qu'un seul onglet correspondant à cet élément. Si l'onglet est déjà ouvert, le fait d'exécuter l'élément activera cet onglet. Cette option est ignorée si l'élément s'ouvre dans une nouvelle fenêtre ou un nouvel onglet du navigateur.";
pui["runtimeText"]["fr_FR"]["icon"]                 = "Icône";
pui["runtimeText"]["fr_FR"]["icon hlp"]             = "Optionnel. Définit l'icône utilisée dans le menu de navigation ou la barre d'outils. L'icône peut être au format GIF, JPG ou PNG. Les GIF transparents sont recommandés. Le chemin devra être spécifié en absolu depuis le répertoire racine d'installation de l'Atrium. Si aucune icône n'est spécifiée, l'Atrium utilisera l'icône par défaut pour les éléments de navigation. Aucune icône ne sera affichée pour les éléments de la barre d'outils sauf si spécifiée ici.";
pui["runtimeText"]["fr_FR"]["parameter"]            = "Paramètre";
pui["runtimeText"]["fr_FR"]["parameter hlp"]        = "Optionnel: Spécifie un paramètre qui sera passé au program Rich Display lors de son exécution.";

//--------------------------------------------------------------
//  French Canadian Eh!
//--------------------------------------------------------------
pui.copyAllLanguageText("en_US", "fr_CA");
pui["runtimeMsg"]["fr_CA"]["closeMessage"]            = "Votre session sera fermée.";
pui["runtimeMsg"]["fr_CA"]["no connection message"]   = "Impossible d'accéder le serveur.  Veuillez vérifier votre connexion et réessayer.";
pui["runtimeMsg"]["fr_CA"]["upload file limit"]       = "La limite de &1 fichier(s) est dépassée.";
pui["runtimeMsg"]["fr_CA"]["upload size limit"]       = "La limite de &1MB par fichier est dépassée.";
pui["runtimeMsg"]["fr_CA"]["upload no files"]         = "Aucun fichier sélectionné.";
pui["runtimeMsg"]["fr_CA"]["upload duplicate file"]   = "Doublon(s) dans les fichiers sélectionnés.";
pui["runtimeMsg"]["fr_CA"]["upload file exists"]      = "Un ou plusieurs fichier(s) existe déjà sur le système.";
pui["runtimeMsg"]["fr_CA"]["upload prevented"]        = "L'opération est bloquée par le programme de sortie.";
pui["runtimeMsg"]["fr_CA"]["upload input limit"]      = "L'entrée de données dépasse la limite.";
pui["runtimeMsg"]["fr_CA"]["upload no session"]       = "Il n'y a aucune connection à une session valide.";
pui["runtimeMsg"]["fr_CA"]["upload timeout"]          = "La transaction a expirée.";
pui["runtimeMsg"]["fr_CA"]["upload invalid response"] = "La réponse du serveur est manquante ou invalide.";
pui["runtimeMsg"]["fr_CA"]["close browser text"]      = "Veuillez fermer votre navigateur pour compléter le processus de déconnection.";
pui["runtimeMsg"]["fr_CA"]["session ended text"]      = "Votre session s'est terminée.";
pui["runtimeMsg"]["fr_CA"]["outside ucs2"]            = 'Caractères non-permis parmi les valeurs permises dans le UCS-2.';
pui["runtimeMsg"]["fr_CA"]["invalid number"]          = "&1 n'est pas un numéro valide.";
pui["runtimeMsg"]["fr_CA"]["invalid length"]          = "&1 n'a pas le bon nombre de caractères ou de décimales.'";
pui["runtimeMsg"]["fr_CA"]["invalid decimal"]         = '&1 contient trop de décimales. (max: &2)';
pui["runtimeMsg"]["fr_CA"]["invalid choice"]          = '"&1" est invalide. Les choix valides sont: "&2" ou "&3".';
pui["runtimeMsg"]["fr_CA"]["invalid date"]            = '"&1" est une date invalide. Exemple de format: &2';
pui["runtimeMsg"]["fr_CA"]["invalid time"]            = '"&1" est une heure invalide. Exemple de format: &2';
pui["runtimeMsg"]["fr_CA"]["invalid time stamp"]      = '"&1" est une date et heure invalide. Exemple de format: &2';
pui["runtimeMsg"]["fr_CA"]["invalid percent"]         = "&1 n'est pas une décimale valide.";
pui["runtimeMsg"]["fr_CA"]["invalid digits"]          = '"&1" contient trop de caractères. Max: &2';
pui["runtimeMsg"]["fr_CA"]["exceeds whole"]           = '"&1" dépasse le nombre de caractères maximum pour le nombre avant les décimales (&2 caractères).';
pui["runtimeMsg"]["fr_CA"]["exceeds decimal"]         = '"&1" dépasse le nombre de caractères maximum pour les décimales (&2 caractères).';
pui["runtimeMsg"]["fr_CA"]["zip too long"]            = 'Le code postal est trop long. (Maximum: &1 caractères)';
pui["runtimeMsg"]["fr_CA"]["phone too long"]          = 'Le numéro de téléphone est trop long. (Maximum: &1 caractères)';
pui["runtimeMsg"]["fr_CA"]["ssno too long"]           = "Le numéro d'assurance sociale est trop long. (Maximum: &1 caractères)";
pui["runtimeMsg"]["fr_CA"]["invalid custom val"]      = 'La fonction de validation est invalide.';
pui["runtimeMsg"]["fr_CA"]["error custom val"]        = 'Erreur dans la fonction de validation.';
pui["runtimeMsg"]["fr_CA"]["ME"]                      = "Le champ est obligatoire.";
pui["runtimeMsg"]["fr_CA"]["MF"]                      = "Chaque caractère doit être remplit pour ce champ.";
pui["runtimeMsg"]["fr_CA"]["required"]                = "Le champ doit être remplit.";
pui["runtimeMsg"]["fr_CA"]["file required"]           = "Au moins un fichier doit être choisi.";
pui["runtimeMsg"]["fr_CA"]["signature overflow"]      = "La grosseur de la signature dépasse l'espace de stockage permis. Veuillez effacer la signature et réessayer.";
pui["runtimeMsg"]["fr_CA"]["validValues"]             = "La valeur entrée est invalide. Les valeurs valides sont: ";
pui["runtimeMsg"]["fr_CA"]["upload invalid type"]     = "Un ou plusieurs fichiers sont de type invalide.";
pui["runtimeMsg"]["fr_CA"]["invalid email"]           = "L'adresse courriel est invalide.";
pui["runtimeMsg"]["fr_CA"]["session timed out"]       = "Votre session est expirée.";
pui["runtimeMsg"]["fr_CA"]["invalid low range"]       = "La valeur doit être supérieure ou égale à &1";
pui["runtimeMsg"]["fr_CA"]["invalid high range"]      = "La valeur doit être inférieure ou égale à &1";
pui["runtimeMsg"]["fr_CA"]["invalid range"]           = "La valeur doit se situer entre &1 et &2";
pui["runtimeMsg"]["fr_CA"]["unmonitored exception"]   = "Le programme a rencontré une erreur non controlée. Veuillez contacter l'administrateur du système.";
pui["runtimeMsg"]["fr_CA"]["loading"]                 = "En chargement...";

pui["runtimeText"]["fr_CA"]["upload select text"]   = "Sélection de fichiers";
pui["runtimeText"]["fr_CA"]["upload clear text"]    = "Effacer";
pui["runtimeText"]["fr_CA"]["upload remove text"]   = "Supprimer";
pui["runtimeText"]["fr_CA"]["upload upload text"]   = "Téléversement";
pui["runtimeText"]["fr_CA"]["excel export text"]    = "Exporter vers Excel ";
pui["runtimeText"]["fr_CA"]["excel to x"]           = "Exporter vers &1";
pui["runtimeText"]["fr_CA"]["filter text"]          = "Filtrer";
pui["runtimeText"]["fr_CA"]["remove filters text"]  = "Enlever les filtres";
pui["runtimeText"]["fr_CA"]["next link text"]       = "Suivante";
pui["runtimeText"]["fr_CA"]["previous link text"]   = "Précédente";
pui["runtimeText"]["fr_CA"]["sort ascending text"]  = "Tri ascendant";
pui["runtimeText"]["fr_CA"]["sort descending text"] = "Tri descendant";
pui["runtimeText"]["fr_CA"]["row"]                  = "rangée";
pui["runtimeText"]["fr_CA"]["rows"]                 = "rangées";
pui["runtimeText"]["fr_CA"]["page"]                 = "Page";
pui["runtimeText"]["fr_CA"]["collapseAll"]          = "Réduire tout";
pui["runtimeText"]["fr_CA"]["expandAll"]            = "Ouvrir tout";
pui["runtimeText"]["fr_CA"]["user"]                 = "Utilisateur";
pui["runtimeText"]["fr_CA"]["password"]             = "Mot de passe";
pui["runtimeText"]["fr_CA"]["pui"]                  = "Profound UI";
pui["runtimeText"]["fr_CA"]["pui sign on"]          = "Connection Profound UI";
pui["runtimeText"]["fr_CA"]["sign on"]              = "Connection";
pui["runtimeText"]["fr_CA"]["message id"]           = "Identifiant de message";
pui["runtimeText"]["fr_CA"]["severity"]             = "Sévérité";
pui["runtimeText"]["fr_CA"]["date"]                 = "Date";
pui["runtimeText"]["fr_CA"]["time"]                 = "Heure";
pui["runtimeText"]["fr_CA"]["program"]              = "Programme";
pui["runtimeText"]["fr_CA"]["procedure"]            = "Procédure";
pui["runtimeText"]["fr_CA"]["lines"]                = "Ligne(s)";
pui["runtimeText"]["fr_CA"]["message"]              = "Message";
pui["runtimeText"]["fr_CA"]["new session"]          = "Nouvelle Session";
pui["runtimeText"]["fr_CA"]["close"]                = "Fermer";
pui["runtimeText"]["fr_CA"]["current password"]     = "Mot de passe actuel";
pui["runtimeText"]["fr_CA"]["new password"]         = "Nouveau mot de passe";
pui["runtimeText"]["fr_CA"]["repeat new password"]  = "Répéter le mot de passe";
pui["runtimeText"]["fr_CA"]["submit"]               = "Soumettre";
pui["runtimeText"]["fr_CA"]["exit"]                 = "Quitter";
pui["runtimeText"]["fr_CA"]["warning"]              = "Avertissement";
pui["runtimeText"]["fr_CA"]["change password"]      = "Changer mot de passe";
pui["runtimeText"]["fr_CA"]["cancel"]               = "Annuler";
pui["runtimeText"]["fr_CA"]["find text"]            = "Trouver";
pui["runtimeText"]["fr_CA"]["remove filter"]        = "Supprimer le filtre";


// ------------------------------------------------------------
//  Italiano
// -------------------------------------------------------------
pui.copyAllLanguageText("en_US", "it_IT");
pui["runtimeMsg"]["it_IT"]["closeMessage"]            = "Questo terminerà la sessione.";   
pui["runtimeMsg"]["it_IT"]["no connection message"]   = "Impossibile raggiungere il server. Controllare la connessione e riprovare.";
pui["runtimeMsg"]["it_IT"]["upload file limit"]       = "Limite di &1 file superato.";
pui["runtimeMsg"]["it_IT"]["upload size limit"]       = "Limite di &1MB per file superato.";
pui["runtimeMsg"]["it_IT"]["upload no files"]         = "Nessun file selezionato.";
pui["runtimeMsg"]["it_IT"]["upload duplicate file"]   = "Sono stati selezionati file duplicati.";
pui["runtimeMsg"]["it_IT"]["upload file exists"]      = "Uno o più file sono già presenti nel file system.";
pui["runtimeMsg"]["it_IT"]["upload prevented"]        = "Operazione impedita da exit program.";
pui["runtimeMsg"]["it_IT"]["upload input limit"]      = "Superato limite della dimensione totale input.";
pui["runtimeMsg"]["it_IT"]["upload no session"]       = "Non collegato ad una sessione valida.";
pui["runtimeMsg"]["it_IT"]["upload timeout"]          = "Scaduto il tempo per la transazione.";
pui["runtimeMsg"]["it_IT"]["upload invalid response"] = "La risposta del server è mancante o non è valida.";
pui["runtimeMsg"]["it_IT"]["close browser text"]      = "Per completare la chiusura della sessione, chiudere la finestra del browser.";
pui["runtimeMsg"]["it_IT"]["session ended text"]      = "La sessione si è conclusa.";
pui["runtimeMsg"]["it_IT"]["outside ucs2"]            = "Caratteri fuori dall'ambito UCS-2.";
pui["runtimeMsg"]["it_IT"]["invalid number"]          = "&1 non è un numero valido.";  
pui["runtimeMsg"]["it_IT"]["invalid length"]          = '&1 ha lunghezza dati o posizione decimale errata.';
pui["runtimeMsg"]["it_IT"]["invalid decimal"]         = '&1 ha troppe cifre decimali. (max: &2) ';
pui["runtimeMsg"]["it_IT"]["invalid choice"]          = '"&1" non è valido. Scelte valide sono: "&2" o "&3".';
pui["runtimeMsg"]["it_IT"]["invalid date"]            = '"&1" non è una data valida. Esempio di formato corretto: &2';
pui["runtimeMsg"]["it_IT"]["invalid time"]            = '"&1" non è un valore di tempo corretto. Esempio di formato corretto: &2';
pui["runtimeMsg"]["it_IT"]["invalid time stamp"]      = "\"&1\" non è un riferimento di tempo valido.  Esempio di formato corretto: &2";
pui["runtimeMsg"]["it_IT"]["invalid percent"]         = '&1 non è un decimale valido.';
pui["runtimeMsg"]["it_IT"]["invalid digits"]          = '"&1" contiene troppe cifre. Max: &2';
pui["runtimeMsg"]["it_IT"]["exceeds whole"]           = '"&1" supera il numero massimo di cifre per la parte intera del numero (&2 digits).';
pui["runtimeMsg"]["it_IT"]["exceeds decimal"]         = '"&1" supera il numero massimo di cifre per la parte decimale (&2 digits).';
pui["runtimeMsg"]["it_IT"]["zip too long"]            = 'CAP è troppo lungo. (Massimo: &1 cifre)';
pui["runtimeMsg"]["it_IT"]["phone too long"]          = 'Numero di telefono è troppo lungo. (Massimo: &1 cifre)';
pui["runtimeMsg"]["it_IT"]["ssno too long"]           = 'Codice fiscale è troppo lungo. (Massimo: &1 cifre)';
pui["runtimeMsg"]["it_IT"]["invalid custom val"]      = "Non valida funzione di validazione personalizzata.";
pui["runtimeMsg"]["it_IT"]["error custom val"]        = 'Errore nella funzione di convalida personalizzata.';
pui["runtimeMsg"]["it_IT"]["ME"]                      = "Campo con obbligo di riempimento. È necessario immettere dati.";
pui["runtimeMsg"]["it_IT"]["MF"]                      = "Campo con obbligo di riempimento. È necessario riempire completamente la casella dati.";
pui["runtimeMsg"]["it_IT"]["required"]                = "Il valore non può essere vuoto. Questo campo è obbligatorio.";
pui["runtimeMsg"]["it_IT"]["file required"]           = "È necessario selezionare almeno un file.";
pui["runtimeMsg"]["it_IT"]["signature overflow"]      = "La dimensione del testo firma supera il numero massimo di byte disponibili per memorizzare la firma.  Si prega di cancellare la pad per la firma elettronica e provare di nuovo.";
pui["runtimeMsg"]["it_IT"]["validValues"]             = "Valore inserito non è valido. I valori validi sono: ";
pui["runtimeMsg"]["it_IT"]["upload invalid type"]     = "Uno o più file sono di tipo non valido.";
pui["runtimeMsg"]["it_IT"]["invalid email"]           = "mail non valido.";
pui["runtimeMsg"]["it_IT"]["session timed out"]       = "La tua sessione é scaduta.";
pui["runtimeMsg"]["it_IT"]["invalid low range"]       = "Il valore deve essere maggiore o uguale a &1";
pui["runtimeMsg"]["it_IT"]["invalid high range"]      = "Il valore deve essere minore o uguale a &1";
pui["runtimeMsg"]["it_IT"]["invalid range"]           = "Intervallo valido da &1 a &2";
pui["runtimeMsg"]["it_IT"]["unmonitored exception"]   = "Il programma ha raggiunto un'eccezione non gestita. Per assistenza, si prega di contattare l'amministratore di sistema.";
pui["runtimeMsg"]["it_IT"]["loading"]                 = "Caricamento...";  
pui["runtimeMsg"]["it_IT"]["subfile deletion"]        = "Sei sicuro di che voler eliminare il subfile?";
pui["runtimeText"]["it_IT"]["upload select text"]   = "Seleziona File";
pui["runtimeText"]["it_IT"]["upload clear text"]    = "Cancella";
pui["runtimeText"]["it_IT"]["upload remove text"]   = "Rimuovi";
pui["runtimeText"]["it_IT"]["upload upload text"]   = "Carica";
pui["runtimeText"]["it_IT"]["excel export text"]    = "Esporta in Excel";
pui["runtimeText"]["it_IT"]["excel to x"]           = "Esporta in &1";
pui["runtimeText"]["it_IT"]["filter text"]          = "Filtra";
pui["runtimeText"]["it_IT"]["remove filters text"]  = "Rimuovi tutti i filtri";
pui["runtimeText"]["it_IT"]["next link text"]       = "Successivo";
pui["runtimeText"]["it_IT"]["previous link text"]   = "Precedente";
pui["runtimeText"]["it_IT"]["sort ascending text"]  = "Ordinare in Senso Ascendente";
pui["runtimeText"]["it_IT"]["sort descending text"] = "Ordinare in Senso Discendente";
pui["runtimeText"]["it_IT"]["row"]                  = "riga";
pui["runtimeText"]["it_IT"]["rows"]                 = "righe";
pui["runtimeText"]["it_IT"]["page"]                 = "Pagina";
pui["runtimeText"]["it_IT"]["collapseAll"]          = "Comprimi tutto";
pui["runtimeText"]["it_IT"]["expandAll"]            = "Espandi tutto";
pui["runtimeText"]["it_IT"]["user"]                 = "Utente";
pui["runtimeText"]["it_IT"]["password"]             = "Password";
pui["runtimeText"]["it_IT"]["pui"]                  = "Profound UI";
pui["runtimeText"]["it_IT"]["pui sign on"]          = "Accesso Profound UI";
pui["runtimeText"]["it_IT"]["sign on"]              = "Accesso";
pui["runtimeText"]["it_IT"]["message id"]           = "Id Messaggio";
pui["runtimeText"]["it_IT"]["severity"]             = "Gravità";
pui["runtimeText"]["it_IT"]["date"]                 = "Data";
pui["runtimeText"]["it_IT"]["time"]                 = "Ora";
pui["runtimeText"]["it_IT"]["program"]              = "Programma";
pui["runtimeText"]["it_IT"]["procedure"]            = "Procedura";
pui["runtimeText"]["it_IT"]["lines"]                = "Linea(e)";
pui["runtimeText"]["it_IT"]["message"]              = "Messaggio";
pui["runtimeText"]["it_IT"]["new session"]          = "Nuova Sessione";
pui["runtimeText"]["it_IT"]["close"]                = "Chiudi";
pui["runtimeText"]["it_IT"]["current password"]     = "Password attuale";
pui["runtimeText"]["it_IT"]["new password"]         = "Nuova Password";
pui["runtimeText"]["it_IT"]["repeat new password"]  = "Ripeti Nuova Password";
pui["runtimeText"]["it_IT"]["submit"]               = "Invia";
pui["runtimeText"]["it_IT"]["exit"]                 = "Esci";
pui["runtimeText"]["it_IT"]["warning"]              = "Attenzione";
pui["runtimeText"]["it_IT"]["change password"]      = "Cambia Password";
pui["runtimeText"]["it_IT"]["cancel"]               = "Cancella";
pui["runtimeText"]["it_IT"]["find text"]            = "Trovare";
pui["runtimeText"]["it_IT"]["remove filter"]        = "Rimuovi Filtro";

//pui["runtimeText"]["it_IT"]["show fav start"]       = "Mostra i favoriti all’avvio";
//pui["runtimeText"]["it_IT"]["show fav start hlp"]   = "Se selezionata, all’avvio sarà mostrato il pannello Favoriti. Altrimenti sarà mostrato il pannello di Navigazione (default). Tale opzione è disponibile soltanto se è abilitato il sistema dei Favoriti.";


// ------------------------------------------------------------
//  Hebrew
// -------------------------------------------------------------
pui.copyAllLanguageText("en_US", "he_IL");
pui["runtimeMsg"]["he_IL"]["closeMessage"]            = " זה מסיים את הפעלת המחשב שלך."; 
pui["runtimeMsg"]["he_IL"]["no connection message"]   = " אין אפשרות להגיע לשרת. בדוק את החיבור שלך ונסה שוב.";
pui["runtimeMsg"]["he_IL"]["upload file limit"]       = " מגבלה של &1 קובץ (ים) חרגו.";
pui["runtimeMsg"]["he_IL"]["upload size limit"]       = ' מגבלה של מ"ב &1 לקובץ חרגו.';
pui["runtimeMsg"]["he_IL"]["upload no files"]         = " לא נבחרו קבצים.";
pui["runtimeMsg"]["he_IL"]["upload duplicate file"]   = " קבצים כפולים נבחרו.";
pui["runtimeMsg"]["he_IL"]["upload file exists"]      = " אחד או יותר הקבצים כבר קיימים במערכת הקבצים."; 
pui["runtimeMsg"]["he_IL"]["upload prevented"]        = " המבצע למנוע על ידי תכנית היציאה.";
pui["runtimeMsg"]["he_IL"]["upload input limit"]      = " מגבלת גודל קלט הכולל חרגו."; 
pui["runtimeMsg"]["he_IL"]["upload no session"]       = " אינה מחובר להפעלת מסוף בתוקף.";
pui["runtimeMsg"]["he_IL"]["upload timeout"]          = " עסקה תם הזמן שהוקצב.";
pui["runtimeMsg"]["he_IL"]["upload invalid response"] = " תגובת השרת היא חסרה או לא חוקית.";
pui["runtimeMsg"]["he_IL"]["close browser text"]      = " כדי להשלים את תהליך התנתקות, בבקשה לסגור את חלון הדפדפן שלך.";
pui["runtimeMsg"]["he_IL"]["session ended text"]      = " הפעלת המסוף שלך הסתיימה.";
pui["runtimeMsg"]["he_IL"]["outside ucs2"]            = " התווים הן מחוץ לטווח של UCS-2.";
pui["runtimeMsg"]["he_IL"]["invalid number"]          = ' מספר &1 לא חוקי ';
pui["runtimeMsg"]["he_IL"]["invalid length"]          = ' אורך &1 נתונים שגוי או עמדה עשרונית';
pui["runtimeMsg"]["he_IL"]["invalid decimal"]         = ' מקומות עשרוניים רבים מדי &1(מקס &2)';
pui["runtimeMsg"]["he_IL"]["invalid choice"]          = ' אינו חוקית. אפשרויות חוקיות הן: "&2" או "&3" "&1"';
pui["runtimeMsg"]["he_IL"]["invalid date"]            = ' תאריך "&1" לא חוקי. פורמט דוגמה: &2 ';
pui["runtimeMsg"]["he_IL"]["invalid time"]            = " זמן &1 לא חוקי. פורמט דוגמה: &2";
pui["runtimeMsg"]["he_IL"]["invalid time stamp"]      = ' חותמת זמן לא חוקית. פורמט דוגמה: &2 "&1"';
pui["runtimeMsg"]["he_IL"]["invalid percent"]         = ' עשרוני לא חוקית &1';
pui["runtimeMsg"]["he_IL"]["invalid digits"]          = ' יותר מדי ספרות ב-&1. מקס: 2&';
pui["runtimeMsg"]["he_IL"]["exceeds whole"]           = ' עולה על המספר המרבי של ספרות לכל חלק המספר "&1" (&2 ספרות)';
pui["runtimeMsg"]["he_IL"]["exceeds decimal"]         = ' עולה על המספר המרבי של ספרות לחלק העשרוני "&1" (&2 ספרות)';
pui["runtimeMsg"]["he_IL"]["zip too long"]            = ' המיקוד הוא ארוך מדי. מקסימום: &1 ספרות';
pui["runtimeMsg"]["he_IL"]["phone too long"]          = ' מספר טלפון ארוך מדי. מקסימום: &1 ספרות';
pui["runtimeMsg"]["he_IL"]["ssno too long"]           = ' מספר הביטוח הלאומי הוא ארוך מדי. מקסימום: &1 ספרות';
pui["runtimeMsg"]["he_IL"]["invalid custom val"]      = ' פונקציה לא חוקי התיקוף מותאמת אישית';
pui["runtimeMsg"]["he_IL"]["error custom val"]        = ' שגיאה בפונקצית התיקוף מותאמת אישית';
pui["runtimeMsg"]["he_IL"]["ME"]                      = " שדה הזנת חובה. עליך להזין נתונים";
pui["runtimeMsg"]["he_IL"]["MF"]                      = " שדה מילוי חובה. עליך למלא את תיבת הקלט לחלוטין";
pui["runtimeMsg"]["he_IL"]["required"]                = " הערך אינו יכול להיות ריק. שדה זה נדרש";
pui["runtimeMsg"]["he_IL"]["file required"]           = " עליך לבחור קובץ אחד לפחות";
pui["runtimeMsg"]["he_IL"]["signature overflow"]      = " גודל ציור החתימה חורג מהערך המרבי. אנא לנקות את משטח החתימה ונסה שוב";
pui["runtimeMsg"]["he_IL"]["validValues"]             = " ערך הזנה אינו חוקי. ערכים חוקיים הם";
pui["runtimeMsg"]["he_IL"]["upload invalid type"]     = "אחד או יותר מהקבצים מסוג לא חוקי";
pui["runtimeMsg"]["he_IL"]["invalid email"]           = 'כתובת דוא"ל לא חוקי';
pui["runtimeMsg"]["he_IL"]["session timed out"]       = "סביבת העבודה שלך נסגרה.";
pui["runtimeMsg"]["he_IL"]["invalid low range"]       = "ערך חייב להיות גדול או שווה ל- &1";
pui["runtimeMsg"]["he_IL"]["invalid high range"]      = "ערך חייב להיות קטן או שווה ל- &1";
pui["runtimeMsg"]["he_IL"]["invalid range"]           = "טווח חוקי הוא &1 ל- &2.";
pui["runtimeMsg"]["he_IL"]["unmonitored exception"]   = "התכנית נתקלה בחריג בלתי מבוקר. אנא צור קשר עם מנהל המערכת לעזרה";
pui["runtimeMsg"]["he_IL"]["loading"]                 = "טוען";

pui["runtimeText"]["he_IL"]["upload select text"]   = " בחר קבצים ";
pui["runtimeText"]["he_IL"]["upload clear text"]    = " נקה ";
pui["runtimeText"]["he_IL"]["upload remove text"]   = " הסר ";
pui["runtimeText"]["he_IL"]["upload upload text"]   = " העלה ";
pui["runtimeText"]["he_IL"]["excel export text"]    = " יצוא לאקסל ";
pui["runtimeText"]["he_IL"]["filter text"]          = " מסנן ";
pui["runtimeText"]["he_IL"]["remove filters text"]  = " הסר את כל המסננים ";
pui["runtimeText"]["he_IL"]["next link text"]       = " הבאה ";
pui["runtimeText"]["he_IL"]["previous link text"]   = " הקודם ";
pui["runtimeText"]["he_IL"]["sort ascending text"]  = " מיין לפי סדר עולה ";
pui["runtimeText"]["he_IL"]["sort descending text"] = " מיין בסדר יורד ";
pui["runtimeText"]["he_IL"]["row"]                  = " שורה ";
pui["runtimeText"]["he_IL"]["rows"]                 = " שורות ";
pui["runtimeText"]["he_IL"]["page"]                 = " עמוד ";
pui["runtimeText"]["he_IL"]["collapseAll"]          = "לכווץ הכל";
pui["runtimeText"]["he_IL"]["expandAll"]            = "להרחיב הכל";
pui["runtimeText"]["he_IL"]["user"]                 = "משתמש";
pui["runtimeText"]["he_IL"]["password"]             = "סיסמא";
pui["runtimeText"]["he_IL"]["pui"]                  = "Profound UI";
pui["runtimeText"]["he_IL"]["pui sign on"]          = "Profound UI להירשם";
pui["runtimeText"]["he_IL"]["sign on"]              = "להירשם";
pui["runtimeText"]["he_IL"]["message id"]           = "זיהוי הודעה";
pui["runtimeText"]["he_IL"]["severity"]             = "רצינות";
pui["runtimeText"]["he_IL"]["date"]                 = "תאריך";
pui["runtimeText"]["he_IL"]["time"]                 = "זמן";
pui["runtimeText"]["he_IL"]["program"]              = "תכנית";
pui["runtimeText"]["he_IL"]["procedure"]            = "פרוצדורה";
pui["runtimeText"]["he_IL"]["lines"]                = "שורה";
pui["runtimeText"]["he_IL"]["message"]              = "הודעה";
pui["runtimeText"]["he_IL"]["new session"]          = "מושב חדש";
pui["runtimeText"]["he_IL"]["close"]                = "לסגור";
pui["runtimeText"]["he_IL"]["current password"]     = "סיסמא נוכחית";
pui["runtimeText"]["he_IL"]["new password"]         = "סיסמא חדשה";
pui["runtimeText"]["he_IL"]["repeat new password"]  = "חזור על סיסמא חדשה";
pui["runtimeText"]["he_IL"]["submit"]               = "שלח";
pui["runtimeText"]["he_IL"]["exit"]                 = "יציאה";
pui["runtimeText"]["he_IL"]["warning"]              = "אזהרה";
pui["runtimeText"]["he_IL"]["change password"]      = "שינוי סיסמא";
pui["runtimeText"]["he_IL"]["cancel"]               = "לבטל";
pui["runtimeText"]["he_IL"]["find text"]            = "מצא";
pui["runtimeText"]["he_IL"]["remove filter"]        = "הסר סינון";



// ------------------------------------------------------------
//   Dutch -- Netherlands
// -------------------------------------------------------------
pui.copyAllLanguageText("en_US", "nl_NL");
pui["runtimeMsg"]["nl_NL"]["closeMessage"]            = "Hiermee wordt uw sessie afgesloten.";
pui["runtimeMsg"]["nl_NL"]["no connection message"]   = "Geen contact met de server mogelijk. Controleer de verbinding en probeer opnieuw.";
pui["runtimeMsg"]["nl_NL"]["upload file limit"]       = "Limiet van &1 bestand(en) overschreden.";
pui["runtimeMsg"]["nl_NL"]["upload size limit"]       = "Limiet van &1MB per bestand overschreden";
pui["runtimeMsg"]["nl_NL"]["upload no files"]         = "Geen bestanden geselecteerd.";
pui["runtimeMsg"]["nl_NL"]["upload duplicate file"]   = "Identieke bestanden geselecteerd.";
pui["runtimeMsg"]["nl_NL"]["upload file exists"]      = "Een of meerdere bestanden staan al in het file systeem.";
pui["runtimeMsg"]["nl_NL"]["upload prevented"]        = "Handeling geblokkeerd door het exit programma.";
pui["runtimeMsg"]["nl_NL"]["upload input limit"]      = "Limiet van totale input grootte overschreden.";
pui["runtimeMsg"]["nl_NL"]["upload no session"]       = "Geen verbinding met een geldige sessie.";
pui["runtimeMsg"]["nl_NL"]["upload timeout"]          = "Timeout van de transactie.";
pui["runtimeMsg"]["nl_NL"]["upload invalid response"] = "Geen(geldig) antwoord van de server.";
pui["runtimeMsg"]["nl_NL"]["close browser text"]      = "Sluit het browser scherm om het logoff proces te voltooien.";
pui["runtimeMsg"]["nl_NL"]["session ended text"]      = "Sessie is beëindigd.";
pui["runtimeMsg"]["nl_NL"]["outside ucs2"]            = "Tekens niet UCS-2.";
pui["runtimeMsg"]["nl_NL"]["invalid number"]          = "&1 is geen geldig nummer.";
pui["runtimeMsg"]["nl_NL"]["invalid length"]          = "Lengte of aantal decimalen van &1 is ongeldig.";
pui["runtimeMsg"]["nl_NL"]["invalid decimal"]         = "Aantal decimalen van &1 ongeldig. (max: &2)";
pui["runtimeMsg"]["nl_NL"]["invalid choice"]          = "\"&1\" is ongeldig. Geldige keuzes zijn: \"&2\" of \"&3\".";
pui["runtimeMsg"]["nl_NL"]["invalid date"]            = "\"&1\" is geen geldige datum. Voorbeeld opmaak: &2";
pui["runtimeMsg"]["nl_NL"]["invalid time"]            = "\"&1\" is geen geldige tijd. Voorbeeld opmaak: &2";
pui["runtimeMsg"]["nl_NL"]["invalid time stamp"]      = "\"&1\" is geen geldige time stamp. Voorbeeld opmaak: &2";
pui["runtimeMsg"]["nl_NL"]["invalid percent"]         = "&1 is geen geldige decimaal.";
pui["runtimeMsg"]["nl_NL"]["invalid digits"]          = "\"&1\" heeft teveel cijfers. Max: &2";
pui["runtimeMsg"]["nl_NL"]["exceeds whole"]           = "\"&1\" overschrijd het maximaal aantal cijfers voor het totale veld (&2 cijfers).";
pui["runtimeMsg"]["nl_NL"]["exceeds decimal"]         = "\"&1\" overschrijd het maximaal aantal cijfers voor het decimale deel (&2 cijfers).";
pui["runtimeMsg"]["nl_NL"]["zip too long"]            = "Postcode te lang. (Maximum: &1 cijfers)";
pui["runtimeMsg"]["nl_NL"]["phone too long"]          = "Telefoonnummer te lang. (Maximum: &1 cijfers)";
pui["runtimeMsg"]["nl_NL"]["ssno too long"]           = "Sofinummer te lang. (Maximum: &1 cijfers)";
pui["runtimeMsg"]["nl_NL"]["invalid custom val"]      = "Ongeldige maatwerk controle routine.";
pui["runtimeMsg"]["nl_NL"]["error custom val"]        = "Fout in maatwerk controle routine.";
pui["runtimeMsg"]["nl_NL"]["ME"]                      = "Verplicht veld. Hier iets ingeven.";
pui["runtimeMsg"]["nl_NL"]["MF"]                      = "Verplicht opvullen van veld. Alle posities van het veld vullen.";
pui["runtimeMsg"]["nl_NL"]["required"]                = "Blanco is een ongeldige waarde. Dit veld is vereist.";
pui["runtimeMsg"]["nl_NL"]["file required"]           = "Selecteer minstens één bestand.";
pui["runtimeMsg"]["nl_NL"]["signature overflow"]      = "De afbeelding van de handtekening overschrijdt het maximale aantal bytes. Verwijder de handtekening en probeer opnieuw.";
pui["runtimeMsg"]["nl_NL"]["validValues"]             = "Ongeldige waarde. Geldige waarden zijn: ";
pui["runtimeMsg"]["nl_NL"]["upload invalid type"]     = "Eén of meerdere bestandstypes zijn ongeldig.";
pui["runtimeMsg"]["nl_NL"]["invalid email"]           = "Ongeldig email addres.";
pui["runtimeMsg"]["nl_NL"]["session timed out"]       = "Uw sessie is verlopen.";
pui["runtimeMsg"]["nl_NL"]["invalid low range"]       = "Waarde moet zijn groter of gelijk aan &1";
pui["runtimeMsg"]["nl_NL"]["invalid high range"]      = "Waarde moet zijn kleiner of gelijk aan &1";
pui["runtimeMsg"]["nl_NL"]["invalid range"]           = "Waarde moet liggen tussen &1 en &2.";
pui["runtimeMsg"]["nl_NL"]["unmonitored exception"]   = "Het programma heeft een fout ontdekt. Voor hulp neem contact op met de systeembeheerder.";
pui["runtimeMsg"]["nl_NL"]["loading"]                 = "bezig met laden...";
pui["runtimeMsg"]["nl_NL"]["subfile deletion"]        = "Weet je het zeker dat je de subfile wilt verwijderen?";
// Atrium
pui["runtimeMsg"]["nl_NL"]["num sessions exceeded"]   = "Aantal toegestane sessies is overschreden.";
pui["runtimeMsg"]["nl_NL"]["unable to load portal"]   = "Kan de portal instellingen of onderdelen van de navigatie niet laden.";
pui["runtimeMsg"]["nl_NL"]["unable to load macr act"] = "Kan de macro acties niet laden.";
pui["runtimeMsg"]["nl_NL"]["unable to load macr var"] = "Kan de macro variabelen niet laden.";
pui["runtimeMsg"]["nl_NL"]["unable to load scrn lst"] = "Kan de lijst met schermen niet laden.";
pui["runtimeMsg"]["nl_NL"]["unable to load new sett"] = "Kan de nieuwe instellingen niet laden.";
pui["runtimeMsg"]["nl_NL"]["unable to load x"]        = "Kan &1 niet laden.";
pui["runtimeMsg"]["nl_NL"]["unable to add x"]         = "Kan &1 niet toevoegen. ";
pui["runtimeMsg"]["nl_NL"]["unable to rename x"]      = "Kan de naam van &1 niet wijzigen.";
pui["runtimeMsg"]["nl_NL"]["unable to delete x"]      = "Kan &1 niet verwijderen.";
pui["runtimeMsg"]["nl_NL"]["unable to update x"]      = "Kan &1 niet bijwerken.";
pui["runtimeMsg"]["nl_NL"]["unable to reassn x"]      = "Kan &1 niet opnieuw toewijzen.";
pui["runtimeMsg"]["nl_NL"]["unable to reorder items"] = "Kan de volgorde van de items niet wijzigen.";
pui["runtimeMsg"]["nl_NL"]["unable to save theme"]    = "Kan de themainstelling niet veiligstellen.";
pui["runtimeMsg"]["nl_NL"]["unable eval script url"]  = "Kan het web app URL script niet uitvoeren.";
pui["runtimeMsg"]["nl_NL"]["close browser text AT"]   = "Sessie wijzigingen die niet zijn veiliggesteld, zijn verloren.";
pui["runtimeMsg"]["nl_NL"]["close all tabs"]          = "Alle tabs sluiten?";
pui["runtimeMsg"]["nl_NL"]["close tab"]               = "Wilt u deze tab sluiten?";
pui["runtimeMsg"]["nl_NL"]["invalid script url"]      = "Ongeldige waarde voor een web app URL script.";
pui["runtimeMsg"]["nl_NL"]["unrecognized format"]     = "Opmaak wordt niet herkend.";
pui["runtimeMsg"]["nl_NL"]["screen already defined"]  = "Scherm \"&1\" is reeds gedefinieerd.";
pui["runtimeMsg"]["nl_NL"]["macro already defined"]   = "Macro \"&1\" is reeds gedefinieerd.";
pui["runtimeMsg"]["nl_NL"]["no screen ids"]           = "Er zijn geen scherm identifiers om af te beelden";
pui["runtimeMsg"]["nl_NL"]["confirm delete"]          = "Bevestig verwijderen";
pui["runtimeMsg"]["nl_NL"]["no actions"]              = "Er zijn geen acties om af te beelden.";
pui["runtimeMsg"]["nl_NL"]["msg action input var"]    = "Geef de waarde van variabele \"&1\" in het veld op regel &2 positie &3.";
pui["runtimeMsg"]["nl_NL"]["msg action input user"]   = "Geef het huidige gebruikers profiel in het veld op regel &1 positie &2.";
pui["runtimeMsg"]["nl_NL"]["msg action input js"]     = "Geef het resultaat van de JavaScript expression <strong>&1</strong> in het veld op regel &2 positie &3.";
pui["runtimeMsg"]["nl_NL"]["msg action input other"]  = "Geef de waarde \"&1\" in het veld op regel &2 positie &3.";
pui["runtimeMsg"]["nl_NL"]["msg presskey var"]        = "Druk op de toets die is gedefinieerd in variabele \"&1\".";
pui["runtimeMsg"]["nl_NL"]["msg presskey other"]      = "Druk op de \"&1\" toets.";
pui["runtimeMsg"]["nl_NL"]["msg del scrn from macro"] = "Wilt u werkelijk de geselecteerde schermen uit deze macro verwijderen?<br /> Alle gekoppelde acties worden ook verwijderd.";
pui["runtimeMsg"]["nl_NL"]["choose scrn macro"]       = "Kies een scherm of macro om daarvan de eigenschappen te bewerken.";
pui["runtimeMsg"]["nl_NL"]["choose a nav or toolbar"] = "Kies een navigatie of toolbar om daarvan de eigenschappen te bewerken.";
pui["runtimeMsg"]["nl_NL"]["confirm del sel x"]       = "Weet u het zeker dat u de geselecteerde &1 wilt verwijderen?";
pui["runtimeMsg"]["nl_NL"]["permission settings"]     = "instellen machtiging(en)";
pui["runtimeMsg"]["nl_NL"]["adding x"]                = "Bezig met toevoegen &1...";
pui["runtimeMsg"]["nl_NL"]["deleting x"]              = "Bezig met verwijderen &1 ...";
pui["runtimeMsg"]["nl_NL"]["reassigning x"]           = "Opnieuw toewijzen van &1...";
pui["runtimeMsg"]["nl_NL"]["loading"]                 = "Bezig met laden ...";
pui["runtimeMsg"]["nl_NL"]["saving"]                  = "Bezig met veiligstellen...";
pui["runtimeMsg"]["nl_NL"]["x added"]                 = "&1 toegevoegd.";
pui["runtimeMsg"]["nl_NL"]["x deleted"]               = "&1 verwijderd.";
pui["runtimeMsg"]["nl_NL"]["x reassigned"]            = "&1 opnieuw toegewezen.";
pui["runtimeMsg"]["nl_NL"]["x updated"]               = "&1 bijgewerkt.";
pui["runtimeMsg"]["nl_NL"]["x saved"]                 = "&1 veiliggesteld.";
pui["runtimeMsg"]["nl_NL"]["msg del group"]           = "Wilt u groep \"&1\" echt verwijderen?<br /><br />Na het verwijderen van een groep worden ook de subgroepen en bijhorende gebruikers verwijderd.<br /><br />Wilt u verder gaan?";
pui["runtimeMsg"]["nl_NL"]["conf reassign users 1"]   = "Wilt u echt opnieuw toewijzen ";
pui["runtimeMsg"]["nl_NL"]["conf reassign users 2a"]  = "gebruiker \"&1\" ";
pui["runtimeMsg"]["nl_NL"]["conf reassign users 2b"]  = "de geselecteerde gebruikers ";
pui["runtimeMsg"]["nl_NL"]["conf reassign users 3"]   = " naar groep \"&1\"?";
pui["runtimeMsg"]["nl_NL"]["conf reassign group"]     = "Wilt u echt groep \"&1\" aan groep \"&2\" toewijzen?";
pui["runtimeMsg"]["nl_NL"]["conf delete users 1"]     = "Wilt u deze gebruiker(s) echt verwijderen  ";
pui["runtimeMsg"]["nl_NL"]["conf delete users 2a"]    = "gebruiker \"&1\"?";
pui["runtimeMsg"]["nl_NL"]["conf delete users 2b"]    = "de geselecteerde gebruikers?";
pui["runtimeMsg"]["nl_NL"]["no users"]                = "Er zijn geen gebruikers.";
pui["runtimeMsg"]["nl_NL"]["cannot delete own grp"]   = "U kunt uw eigen groep niet verwijderen.";
pui["runtimeMsg"]["nl_NL"]["cannot delete own usr"]   = "U kunt uw eigen profiel niet verwijderen.";
pui["runtimeMsg"]["nl_NL"]["not auth reassign prf"]   = "U bent niet bevoegd tot het opnieuw toewijzen van uw eigen profiel.";
pui["runtimeMsg"]["nl_NL"]["typeselect macro name"]   = "Type of selecteer een macro naam...";
pui["runtimeMsg"]["nl_NL"]["any child items will"]    = "De onderliggende items worden ook verwijderd.";
pui["runtimeMsg"]["nl_NL"]["password must be"]        = "Wachtwoorden moeten bestaan uit tenminste 6 characters.";
pui["runtimeMsg"]["nl_NL"]["type or sel home page"]   = "Type of selecteer een home page...";
pui["runtimeMsg"]["nl_NL"]["x is already in list"]    = "\"&1\" staat al in de lijst.";
pui["runtimeMsg"]["nl_NL"]["x is not valid libname"]  = "\"&1\" is geen geldige bibliotheeknaam.";
pui["runtimeMsg"]["nl_NL"]["no libraries in list"]    = "Geen bibliotheken in de lijst";
pui["runtimeMsg"]["nl_NL"]["add libl entry"]          = "Voeg een entry toe aan de lijst met bibliotheken";
pui["runtimeMsg"]["nl_NL"]["would you like add ano"]  = "Wilt u een nog een toevoegen?";
pui["runtimeMsg"]["nl_NL"]["already in suppl grp x"]  = "Gebruiker is reeds opgenomen in de aanvullende groep \"&1\".";

pui["runtimeText"]["nl_NL"]["upload select text"]     = "Selecteer bestanden";
pui["runtimeText"]["nl_NL"]["upload clear text"]      = "Wissen";
pui["runtimeText"]["nl_NL"]["upload remove text"]     = "Verwijder";
pui["runtimeText"]["nl_NL"]["upload upload text"]     = "Upload";
pui["runtimeText"]["nl_NL"]["excel export text"]      = "Export naar Excel";
pui["runtimeText"]["nl_NL"]["excel to x"]             = "Export naar &1";
pui["runtimeText"]["nl_NL"]["filter text"]            = "Filter";
pui["runtimeText"]["nl_NL"]["remove filters text"]    = "Verwijder alle filters";
pui["runtimeText"]["nl_NL"]["next link text"]         = "Volgende";
pui["runtimeText"]["nl_NL"]["previous link text"]     = "Vorige";
pui["runtimeText"]["nl_NL"]["sort ascending text"]    = "Sorteer oplopend";
pui["runtimeText"]["nl_NL"]["sort descending text"]   = "Sorteer afdalend";
pui["runtimeText"]["nl_NL"]["row"]                    = "rij";
pui["runtimeText"]["nl_NL"]["rows"]                   = "rijen";
pui["runtimeText"]["nl_NL"]["page"]                   = "Pagina";
pui["runtimeText"]["nl_NL"]["collapseAll"]            = "Inklappen";
pui["runtimeText"]["nl_NL"]["expandAll"]              = "Uitklappen";
pui["runtimeText"]["nl_NL"]["user"]                   = "Gebruiker";
pui["runtimeText"]["nl_NL"]["password"]               = "Wachtwoord";
pui["runtimeText"]["nl_NL"]["pui"]                    = "Profound UI";
pui["runtimeText"]["nl_NL"]["pui sign on"]            = "Aanmelding Profound UI";
pui["runtimeText"]["nl_NL"]["sign on"]                = "Aanmelding";
pui["runtimeText"]["nl_NL"]["message id"]             = "Bericht-Id";
pui["runtimeText"]["nl_NL"]["severity"]               = "Severity";
pui["runtimeText"]["nl_NL"]["date"]                   = "Datum";
pui["runtimeText"]["nl_NL"]["time"]                   = "Tijd";
pui["runtimeText"]["nl_NL"]["program"]                = "Programma";
pui["runtimeText"]["nl_NL"]["procedure"]              = "Procedure";
pui["runtimeText"]["nl_NL"]["lines"]                  = "Regel(s)";
pui["runtimeText"]["nl_NL"]["message"]                = "Boodschap";
pui["runtimeText"]["nl_NL"]["new session"]            = "Nieuwe Sessie";
pui["runtimeText"]["nl_NL"]["close"]                  = "Sluiten";
pui["runtimeText"]["nl_NL"]["current password"]       = "Huidig wachtwoord";
pui["runtimeText"]["nl_NL"]["new password"]           = "Nieuw wachtwoord";
pui["runtimeText"]["nl_NL"]["repeat new password"]    = "Herhaal nieuw wachtwoord";
pui["runtimeText"]["nl_NL"]["submit"]                 = "Aanbieden";
pui["runtimeText"]["nl_NL"]["exit"]                   = "Einde";
pui["runtimeText"]["nl_NL"]["warning"]                = "Waarschuwing";
pui["runtimeText"]["nl_NL"]["change password"]        = "Wijzig wachtwoord";
pui["runtimeText"]["nl_NL"]["cancel"]                 = "Afbreken";
pui["runtimeText"]["nl_NL"]["find text"]              = "Vinden";
pui["runtimeText"]["nl_NL"]["remove filter"]          = "Verwijderen Filter";
// Atrium
pui["runtimeText"]["nl_NL"]["yes"]                  = "Ja";
pui["runtimeText"]["nl_NL"]["no"]                   = "Nee";
pui["runtimeText"]["nl_NL"]["settings"]             = "Instellingen";
pui["runtimeText"]["nl_NL"]["favorites"]            = "Favorieten";
pui["runtimeText"]["nl_NL"]["type query press en"]  = "Type vraag, druk op enter.";
pui["runtimeText"]["nl_NL"]["add to favorites"]     = "Voeg toe aan favorieten";
pui["runtimeText"]["nl_NL"]["rmv from favorites"]   = "Verwijder uit favorieten";
pui["runtimeText"]["nl_NL"]["please wait"]          = "Wachten aub...";
pui["runtimeText"]["nl_NL"]["control panel"]        = "Control Panel";
pui["runtimeText"]["nl_NL"]["my settings"]          = "Mijn instellingen";
pui["runtimeText"]["nl_NL"]["about atrium"]         = "Info Atrium";
pui["runtimeText"]["nl_NL"]["item"]                 = "Item";
pui["runtimeText"]["nl_NL"]["open selected item"]   = "Open het geselecteerde item";
pui["runtimeText"]["nl_NL"]["no results to dsp"]    = "Geen resultaten";
pui["runtimeText"]["nl_NL"]["displaying results"]   = "Toon resultaat";
pui["runtimeText"]["nl_NL"]["search results"]       = "Zoek resultaat";
pui["runtimeText"]["nl_NL"]["new folder"]           = "Nieuwe folder";
pui["runtimeText"]["nl_NL"]["rename"]               = "Hernoem";
pui["runtimeText"]["nl_NL"]["description"]          = "Omschrijving";
pui["runtimeText"]["nl_NL"]["ok"]                   = "OK";
pui["runtimeText"]["nl_NL"]["add"]                  = "Voeg toe";
pui["runtimeText"]["nl_NL"]["add x"]                = "Voeg &1 toe";
pui["runtimeText"]["nl_NL"]["delete"]               = "Verwijder";
pui["runtimeText"]["nl_NL"]["screen"]               = "Scherm";
pui["runtimeText"]["nl_NL"]["screens"]              = "Schermen";
pui["runtimeText"]["nl_NL"]["macro"]                = "Macro";
pui["runtimeText"]["nl_NL"]["macros"]               = "Macros";
pui["runtimeText"]["nl_NL"]["screen id"]            = "Scherm identificatie";
pui["runtimeText"]["nl_NL"]["screen ids"]           = "Scherm identificaties";
pui["runtimeText"]["nl_NL"]["field row"]            = "Veld rij";
pui["runtimeText"]["nl_NL"]["field column"]         = "Veld kolom";
pui["runtimeText"]["nl_NL"]["field value"]          = "Veld waarde";
pui["runtimeText"]["nl_NL"]["value"]                = "Waarde";
pui["runtimeText"]["nl_NL"]["action"]               = "Actie";
pui["runtimeText"]["nl_NL"]["actions"]              = "Acties";
pui["runtimeText"]["nl_NL"]["detect once"]          = "Eenmalige detectie";
pui["runtimeText"]["nl_NL"]["delete screen"]        = "Verwijder scherm";
pui["runtimeText"]["nl_NL"]["genie macros"]         = "Genie macros";
pui["runtimeText"]["nl_NL"]["screen name"]          = "Schermnaam";
pui["runtimeText"]["nl_NL"]["identifier"]           = "Identificatie";
pui["runtimeText"]["nl_NL"]["identifiers"]          = "Identificaties";
pui["runtimeText"]["nl_NL"]["macro name"]           = "Naam macro";
pui["runtimeText"]["nl_NL"]["close browser wintab"] = "Sluit het browser scherm of de tab.";
pui["runtimeText"]["nl_NL"]["select"]               = "Selecteer";
pui["runtimeText"]["nl_NL"]["write value in field"] = "Geef het veld een waarde";
pui["runtimeText"]["nl_NL"]["press a key"]          = "Druk op een toets";
pui["runtimeText"]["nl_NL"]["a literal value"]      = "Een vaste waarde";
pui["runtimeText"]["nl_NL"]["a variable value"]     = "Een variabele waarde";
pui["runtimeText"]["nl_NL"]["cur user profile"]     = "Het huidige gebruikersprofiel";
pui["runtimeText"]["nl_NL"]["result js expr"]       = "Het resultaat van een JavaScript expressie";
pui["runtimeText"]["nl_NL"]["action data"]          = "Gegevens van de actie";
pui["runtimeText"]["nl_NL"]["data type"]            = "Data type";
pui["runtimeText"]["nl_NL"]["users"]                = "Gebruikers";
pui["runtimeText"]["nl_NL"]["all groups"]           = "Alle groepen";
pui["runtimeText"]["nl_NL"]["supplemental groups"]  = "Aanvullende groepen";
pui["runtimeText"]["nl_NL"]["users w primary grp"]  = "Gebruikers met primaire groep \"&1\"";
pui["runtimeText"]["nl_NL"]["users w suppl grp"]    = "Gebruikers met aanvullende groep \"&1";
pui["runtimeText"]["nl_NL"]["group"]                = "Groep";
pui["runtimeText"]["nl_NL"]["groups"]               = "Groepen";
pui["runtimeText"]["nl_NL"]["edit"]                 = "Wijzigen";
pui["runtimeText"]["nl_NL"]["edit x"]               = "Wijzigen &1";
pui["runtimeText"]["nl_NL"]["manager"]              = "Manager";
pui["runtimeText"]["nl_NL"]["administrator"]        = "Administrator";
pui["runtimeText"]["nl_NL"]["primary group"]        = "Primaire groep";
pui["runtimeText"]["nl_NL"]["delete x"]             = "Verwijder &1";
pui["runtimeText"]["nl_NL"]["reassign x"]           = "Wijs &1 opnieuw toe";
pui["runtimeText"]["nl_NL"]["navigation item"]      = "Navigatie item";
pui["runtimeText"]["nl_NL"]["navigation items"]     = "Navigatie items";
pui["runtimeText"]["nl_NL"]["navigation panel"]     = "Navigatie panel";
pui["runtimeText"]["nl_NL"]["home pages"]           = "Home pagina's";
pui["runtimeText"]["nl_NL"]["menu group"]           = "Menu groep";
pui["runtimeText"]["nl_NL"]["menu item"]            = "Menu item";
pui["runtimeText"]["nl_NL"]["toolbar items"]        = "Eenheden werkbalk";
pui["runtimeText"]["nl_NL"]["toolbar"]              = "Werkbalk";
pui["runtimeText"]["nl_NL"]["button"]               = "Knop";
pui["runtimeText"]["nl_NL"]["pulldown menu"]        = "Afrolmenu";
pui["runtimeText"]["nl_NL"]["pulldown menu item"]   = "item afrolmenu";
pui["runtimeText"]["nl_NL"]["separator bar"]        = "Scheidingsteken";
pui["runtimeText"]["nl_NL"]["spacer"]               = "Spatie";
pui["runtimeText"]["nl_NL"]["item details"]         = "item detail";
pui["runtimeText"]["nl_NL"]["item number"]          = "item nummmer";
pui["runtimeText"]["nl_NL"]["item type"]            = "item type";
pui["runtimeText"]["nl_NL"]["genie macro"]          = "Genie macro";
pui["runtimeText"]["nl_NL"]["rdf application"]      = "Rich Display File toepassing";
pui["runtimeText"]["nl_NL"]["web application"]      = "Web toepassing";
pui["runtimeText"]["nl_NL"]["pc command"]           = "PC commando";
pui["runtimeText"]["nl_NL"]["dspf program library"] = "Display file programma bibliotheek";
pui["runtimeText"]["nl_NL"]["dspf program"]         = "Display file programma";
pui["runtimeText"]["nl_NL"]["variable name x"]      = "Naam variabele &1";
pui["runtimeText"]["nl_NL"]["a tab in the portal"]  = "Een tab in de portal";
pui["runtimeText"]["nl_NL"]["a new browser wind"]   = "Een nieuwe browser window of tab";
pui["runtimeText"]["nl_NL"]["update"]               = "Bijwerken";
pui["runtimeText"]["nl_NL"]["fill"]                 = "Vullen";
pui["runtimeText"]["nl_NL"]["permissions"]          = "Permissies";
pui["runtimeText"]["nl_NL"]["user/group name"]      = "Gebruiker-/groepsnaam";
pui["runtimeText"]["nl_NL"]["all users groups"]     = "Alle gebruikers en groepen";
pui["runtimeText"]["nl_NL"]["type"]                 = "Type";
pui["runtimeText"]["nl_NL"]["access"]               = "Toegang";
pui["runtimeText"]["nl_NL"]["allow"]                = "Toestaan";
pui["runtimeText"]["nl_NL"]["disallow"]             = "Weigeren";
pui["runtimeText"]["nl_NL"]["navigation"]           = "Navigatie";
pui["runtimeText"]["nl_NL"]["add usrgrp perm"]      = "Toevoegen gebruikers-/groepsmachtigingen";
pui["runtimeText"]["nl_NL"]["membership"]           = "Lid van";
pui["runtimeText"]["nl_NL"]["none"]                 = "Geen";
pui["runtimeText"]["nl_NL"]["remove"]               = "Verwijder";
pui["runtimeText"]["nl_NL"]["appearance"]           = "Vorm";
pui["runtimeText"]["nl_NL"]["home page"]            = "Home pagina";
pui["runtimeText"]["nl_NL"]["tree"]                 = "Tree";
pui["runtimeText"]["nl_NL"]["accordion"]            = "Accordion";
pui["runtimeText"]["nl_NL"]["min search chars"]     = "Minimum aantal zoek lettertekens";
pui["runtimeText"]["nl_NL"]["libl for rdf apps"]    = "Lijst van bibliotheken voor de Rich Display File toepassingen";
pui["runtimeText"]["nl_NL"]["library list"]         = "Lijst van bibliotheken";
pui["runtimeText"]["nl_NL"]["library"]              = "Bibliotheek";
pui["runtimeText"]["nl_NL"]["use atrium def libl"]  = "Gebruik de standaard Atrium lijst van bibliotheken";
pui["runtimeText"]["nl_NL"]["use jobd libl"]        = "Gebruik de lijst van bibliotheken van de JOBD";
pui["runtimeText"]["nl_NL"]["specify libl"]         = "Geef de lijst van bibliotheken op";
pui["runtimeText"]["nl_NL"]["up"]                   = "Op";
pui["runtimeText"]["nl_NL"]["down"]                 = "Neer";
pui["runtimeText"]["nl_NL"]["move up"]              = "Omhoog";
pui["runtimeText"]["nl_NL"]["move down"]            = "Naar beneden";
pui["runtimeText"]["nl_NL"]["global settings"]      = "Globale instellingen";
pui["runtimeText"]["nl_NL"]["save"]                 = "Stel veilig";
pui["runtimeText"]["nl_NL"]["add usr to supp grp"]  = "Voeg gebruiker toe aan aanvullende groep";
// Atrium.help tool-tip titles and texts. (Some are used for other fields than just tool-tips.)
pui["runtimeText"]["nl_NL"]["member of"]            = "Lid van";
pui["runtimeText"]["nl_NL"]["member of hlp"]        = "De groep waarvan deze gebruiker/groep lid is.";
pui["runtimeText"]["nl_NL"]["group name"]           = "Groepsnaam";
pui["runtimeText"]["nl_NL"]["group name hlp"]       = "De schermnaam voor deze groep.";
pui["runtimeText"]["nl_NL"]["inherit settings"]     = "Neem instellingen over";
pui["runtimeText"]["nl_NL"]["inherit settings hlp"] = "Als deze optie wordt aangevinkt, neemt de gebruiker/groep de instellingen over van de bovenliggende gebruiker. Indien niet aangevinkt heeft de gebruiker/groep zijn eigen instellingen.";
pui["runtimeText"]["nl_NL"]["user name"]            = "Naam gebruiker";
pui["runtimeText"]["nl_NL"]["user name hlp"]        = "De schermnaam van dit gebruikersprofiel.";
pui["runtimeText"]["nl_NL"]["access role"]          = "Toegangs bevoegdheden";
pui["runtimeText"]["nl_NL"]["access role hlp"]      = "Beheert de toegang van deze gebruiker. Administrators kunnen alle groepen en gebruikers beheren en daarnaast ook de bevoegdheden binnen de toepassing. Managers kunnen de gebruikers- en groepssettings binnen hun eigen groep aanpassen. Eindgebruikers hebben geen speciale bevoegdheden.";
pui["runtimeText"]["nl_NL"]["can edit profile"]     = "Kan profiel bijwerken";
pui["runtimeText"]["nl_NL"]["can edit profile hlp"] = "Geeft de gebruiker het recht om de \"appearance\" en \"navigation\" instellingen aan te passen, en ook het wachtwoord. De overige instellingen kunnen nooit door een gebruiker worden gewijzigd.";
pui["runtimeText"]["nl_NL"]["user profile"]         = "Gebruikersprofiel";
pui["runtimeText"]["nl_NL"]["user profile hlp"]     = "De naam van het gebruikersprofiel. Namen van gebruikersprofielen zijn hoofdlettergevoelig, tenzij de IBM i profielen worden gebruikt.";
pui["runtimeText"]["nl_NL"]["password hlp"]         = "Set/reset het wachtwoord. Wachtwoorden zijn hoofdlettergevoelig.";
pui["runtimeText"]["nl_NL"]["conf password"]        = "Bevestig wachtwoord";
pui["runtimeText"]["nl_NL"]["conf password hlp"]    = "Bij set/reset van het wachtwoord moet de waarde van dit veld exact overeenkomen met het nieuwe wachtwoord. Wachtwoorden zijn hoofdlettergevoelig.";
// Atrium.help tool-tip - User/group Appearance preferences.
pui["runtimeText"]["nl_NL"]["browser title"]        = "Titel van de browser";
pui["runtimeText"]["nl_NL"]["browser title hlp"]    = "Instellen van de tekst die wordt getoond in de titelbar van de browser.";
pui["runtimeText"]["nl_NL"]["show banner"]          = "Toon banner";
pui["runtimeText"]["nl_NL"]["show banner hlp"]      = "Haal het vinkje weg bij deze optie als u de banner aan de bovenkant van de portal wilt verbergen.";
pui["runtimeText"]["nl_NL"]["banner height"]        = "Banner hoogte";
pui["runtimeText"]["nl_NL"]["banner height hlp"]    = "Stelt de hoogte in pixels in van de banner aan de bovenkant van de portal. Deze instelling wordt overgeslagen als de banner niet wordt getoond. Geldige waarden: 0-600 pixels.";
pui["runtimeText"]["nl_NL"]["banner url"]           = "URL van de banner";
pui["runtimeText"]["nl_NL"]["banner url hlp"]       = "Stelt de URL in waar de banneropmaak is opgeslagen. URL kan absoluut of gekwalificeerd worden opgegeven.";
pui["runtimeText"]["nl_NL"]["theme"]                = "Thema";
pui["runtimeText"]["nl_NL"]["theme hlp"]            = "Stelt het standaard thema in. Dit kan worden gewijzigd door individuele gebruikers als <strong>\"Sta gebruikers toe om een thema te selecteren\"</strong> actief is.";
pui["runtimeText"]["nl_NL"]["allow sel theme"]      = "Sta gebruikers toe om een thema te selecteren";
pui["runtimeText"]["nl_NL"]["allow sel theme hlp"]  = "Als dit is aangevinkt, is het voor gebruikers mogelijk een eigen thema te selecteren met behulp van de control in de toolbar.";
pui["runtimeText"]["nl_NL"]["show menu search"]     = "Toon zoekmenu";
pui["runtimeText"]["nl_NL"]["show menu search hlp"] = "Haal vinkje weg om de menu zoekfaciliteit uit te schakelen.";
pui["runtimeText"]["nl_NL"]["show fav sys"]         = "Toon de favorieten";
pui["runtimeText"]["nl_NL"]["show fav sys hlp"]     = "Haal vinkje weg om de favorieten uit te schakelen.";
pui["runtimeText"]["nl_NL"]["limit num sessn"]      = "Beperk het aantal sessies";
pui["runtimeText"]["nl_NL"]["limit num sessn hlp"]  = "Het aantal toegestane Atrium sessies voor deze gebruiker/groep. De waarde nul staat voor een onbeperkt aantal sessies. De beperking geldt per web browser.";
// Atrium.help tool-tip - User/Group navigation preferences.
pui["runtimeText"]["nl_NL"]["show hmpg start"]      = "Toon home pagina na start";
pui["runtimeText"]["nl_NL"]["show hmpg start hlp"]  = "Indien aangevinkt wordt er bij het starten van de portal een eigen home page getoond.";
pui["runtimeText"]["nl_NL"]["home page url"]        = "URL home pagina";
pui["runtimeText"]["nl_NL"]["home page url hlp"]    = "Stelt de URL in met de locatie van de home page. URL kan absoluut of gekwalificeerd worden opgegeven.";
pui["runtimeText"]["nl_NL"]["navi pnl title"]       = "Title van het navigatie panel";
pui["runtimeText"]["nl_NL"]["navi pnl title hlp"]   = "Deze tekst wordt getoond in de titel bar van het navigatie panel.";
pui["runtimeText"]["nl_NL"]["navi pnl width"]       = "Breedte van navigatie panel na het opstarten";
pui["runtimeText"]["nl_NL"]["navi pnl width hlp"]   = "Stelt de breedte in pixels in van het navigatie panel na het opstarten. De gebruiker kan de grootte van het panel aanpassen of het panel, indien nodig, verbergen. Geldige waarden: 0-2000 pixels.";
pui["runtimeText"]["nl_NL"]["navi type"]            = "Type navigatie";
pui["runtimeText"]["nl_NL"]["navi type hlp"]        = "Stelt binnen de navigatie het type menu in, \"tree\" of \"accordion\". Deze instelling is niet van invloed op de toolbar.";
pui["runtimeText"]["nl_NL"]["single click nav"]     = "Enkele muisklik navigatie";
pui["runtimeText"]["nl_NL"]["single click nav hlp"] = "Als deze optie is aangevinkt wordt een menu optie opgestart met een enkele muisklik. Anders wordt een menu optie opgestart met een dubbele klik. Deze instelling is niet van invloed op de toolbar.";
//Atrium.help tool-tip - Library list.
pui["runtimeText"]["nl_NL"]["current library"]      = "Huidige bibliotheek";
pui["runtimeText"]["nl_NL"]["current library hlp"]  = "Geef de huidige bibliotheek op, *USRPRF, or *CRTDFT.";
pui["runtimeText"]["nl_NL"]["job descr"]            = "Job description";
pui["runtimeText"]["nl_NL"]["job descr hlp"]        = "Geef een job description op voor de lijst met bibliotheken. *USRPRF kan worden opgegeven als de Atrium gebruikers gelijk zijn aan de IBM i gebruikers profielen.";
pui["runtimeText"]["nl_NL"]["job descr lib"]        = "Job description bibliotheek";
pui["runtimeText"]["nl_NL"]["job descr lib hlp"]    = "Geef de bibliotheek op met de job description. Hier kan *LIBL of *CURLIB worden opgegeven.";
// Atrium.help tool-tip - Navigation / Toolbar items.
pui["runtimeText"]["nl_NL"]["item name"]            = "Naam item";
pui["runtimeText"]["nl_NL"]["item name hlp"]        = "Stelt de naam in van het display voor het navigatie of toolbar item.";
pui["runtimeText"]["nl_NL"]["action type"]          = "Actie type";
pui["runtimeText"]["nl_NL"]["action type hlp"]      = "Stelt het type toepassing in dat door dit item wordt gestart.";
pui["runtimeText"]["nl_NL"]["url"]                  = "URL";
pui["runtimeText"]["nl_NL"]["url hlp"]              = "Stelt de URL in van de Web toepassing. De URL kan worden opgegeven als een absoluut pad of als een volledig gekwalificeerde URL. In de URL kunnen Query string parameters worden meegegeven.";
pui["runtimeText"]["nl_NL"]["genie url"]            = "Genie URL";
pui["runtimeText"]["nl_NL"]["genie url hlp"]        = "Stelt de URL in die wordt gebruikt om Genie te starten. Als hier niets wordt ingevuld wordt de standaard Genie URL /profoundui/auth/genie gebruikt. Dit veld is handig als er een andere Genie URL nodig is of als er met query string parameters wordt  gewerkt. Bijvoorbeeld: /profoundui/auth/genie?skin=MyCompany";
pui["runtimeText"]["nl_NL"]["open as"]              = "Openen als";
pui["runtimeText"]["nl_NL"]["open as hlp"]          = "Keuze of de toepassing onder een nieuwe tab in de portal wordt gestart, of in een afzonderlijke browser window of een tab. Of de browser een nieuwe window gebruikt of een tab is afhankelijk van de gebruikersinstelling in de browser.";
pui["runtimeText"]["nl_NL"]["opens once only"]      = "Open eenmalig";
pui["runtimeText"]["nl_NL"]["opens once only hlp"]  = "Standaard wordt er een nieuwe tab geopend met het opstarten van een item. Als er al een tab is geopend in de portal wordt er een nieuwe toegevoegd. Er is geen limiet aan het aantal tabs dat op deze manier kan worden geopend. Als deze optie wordt aangevinkt kan de gebruiker niet meer dan 1 tab per item openen. Als er al een tab is geopend voor dit item zal deze na de selectie worden gebruikt. Deze optie is niet actief als er is gekozen voor het openen van het item in een afzonderlijk browser window of tab.";
pui["runtimeText"]["nl_NL"]["icon"]                 = "Icon";
pui["runtimeText"]["nl_NL"]["icon hlp"]             = "Optioneel. Geef de naam op van een icon file voor gebruik door het navigatie of toolbar item. Geldige icon file formaten zijn GIF, JPG, or PNG. Het wordt aanbevolen om transparente GIFs te gebruiken. Gebruik het absolute pad van de root van de Atrium installatie. Als er geen icon is opgegeven gebruikt Atrium een default icon voor de navigatie. Mits hier opgegeven, worden er geen icons voor de toolbar items getoond.";
pui["runtimeText"]["nl_NL"]["parameter"]            = "Parameter";
pui["runtimeText"]["nl_NL"]["parameter hlp"]        = "Optioneel: Geef een parameter mee die bij het starten aan het Rich Display programma wordt doorgegeven.";
