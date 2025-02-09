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

// ------------------------------------------------------------
//  Hebrew
// -------------------------------------------------------------
// eslint-disable-next-line no-unused-vars
var he_IL = function(dict) {
  var dictMsg = {};

  switch (dict) {
    case "runtimeMsg":
      dictMsg["closeMessage"] = " זה מסיים את הפעלת המחשב שלך.";
      dictMsg["no connection message"] = " אין אפשרות להגיע לשרת. בדוק את החיבור שלך ונסה שוב.";
      dictMsg["upload file limit"] = " מגבלה של &1 קובץ (ים) חרגו.";
      dictMsg["upload size limit"] = ' מגבלה של מ"ב &1 לקובץ חרגו.';
      dictMsg["upload no files"] = " לא נבחרו קבצים.";
      dictMsg["upload duplicate file"] = " קבצים כפולים נבחרו.";
      dictMsg["upload file exists"] = " אחד או יותר הקבצים כבר קיימים במערכת הקבצים.";
      dictMsg["upload prevented"] = " המבצע למנוע על ידי תכנית היציאה.";
      dictMsg["upload input limit"] = " מגבלת גודל קלט הכולל חרגו.";
      dictMsg["upload no session"] = " אינה מחובר להפעלת מסוף בתוקף.";
      dictMsg["upload timeout"] = " עסקה תם הזמן שהוקצב.";
      dictMsg["upload invalid response"] = " תגובת השרת היא חסרה או לא חוקית."; // Also used in Atrium for Ajax error.
      dictMsg["upload cancelled"] = "Upload canceled.";
      dictMsg["close browser text"] = " כדי להשלים את תהליך התנתקות, בבקשה לסגור את חלון הדפדפן שלך.";
      dictMsg["session ended text"] = " הפעלת המסוף שלך הסתיימה.";
      dictMsg["outside ucs2"] = " התווים הן מחוץ לטווח של UCS-2.";
      dictMsg["invalid number"] = " מספר &1 לא חוקי ";
      dictMsg["invalid length"] = " אורך &1 נתונים שגוי או עמדה עשרונית";
      dictMsg["invalid decimal"] = " מקומות עשרוניים רבים מדי &1(מקס &2)";
      dictMsg["invalid choice"] = ' אינו חוקית. אפשרויות חוקיות הן: "&2" או "&3" "&1"';
      dictMsg["invalid date"] = ' תאריך "&1" לא חוקי. פורמט דוגמה: &2 ';
      dictMsg["invalid time"] = " זמן &1 לא חוקי. פורמט דוגמה: &2";
      dictMsg["invalid time stamp"] = ' חותמת זמן לא חוקית. פורמט דוגמה: &2 "&1"';
      dictMsg["invalid percent"] = " עשרוני לא חוקית &1";
      dictMsg["invalid digits"] = " יותר מדי ספרות ב-&1. מקס: 2&";
      dictMsg["exceeds whole"] = ' עולה על המספר המרבי של ספרות לכל חלק המספר "&1" (&2 ספרות)';
      dictMsg["exceeds decimal"] = ' עולה על המספר המרבי של ספרות לחלק העשרוני "&1" (&2 ספרות)';
      dictMsg["zip too long"] = " המיקוד הוא ארוך מדי. מקסימום: &1 ספרות";
      dictMsg["phone too long"] = " מספר טלפון ארוך מדי. מקסימום: &1 ספרות";
      dictMsg["ssno too long"] = " מספר הביטוח הלאומי הוא ארוך מדי. מקסימום: &1 ספרות";
      dictMsg["invalid custom val"] = " פונקציה לא חוקי התיקוף מותאמת אישית";
      dictMsg["error custom val"] = " שגיאה בפונקצית התיקוף מותאמת אישית";
      dictMsg["ME"] = " שדה הזנת חובה. עליך להזין נתונים";
      dictMsg["MF"] = " שדה מילוי חובה. עליך למלא את תיבת הקלט לחלוטין";
      dictMsg["required"] = " הערך אינו יכול להיות ריק. שדה זה נדרש";
      dictMsg["file required"] = " עליך לבחור קובץ אחד לפחות";
      dictMsg["signature overflow"] = " גודל ציור החתימה חורג מהערך המרבי. אנא לנקות את משטח החתימה ונסה שוב";
      dictMsg["validValues"] = " ערך הזנה אינו חוקי. ערכים חוקיים הם";
      dictMsg["upload invalid type"] = "אחד או יותר מהקבצים מסוג לא חוקי";
      dictMsg["invalid email"] = 'כתובת דוא"ל לא חוקי';
      dictMsg["session timed out"] = "סביבת העבודה שלך נסגרה.";
      dictMsg["invalid low range"] = "ערך חייב להיות גדול או שווה ל- &1";
      dictMsg["invalid high range"] = "ערך חייב להיות קטן או שווה ל- &1";
      dictMsg["invalid range"] = "טווח חוקי הוא &1 ל- &2.";
      dictMsg["unmonitored exception"] = "התכנית נתקלה בחריג בלתי מבוקר. אנא צור קשר עם מנהל המערכת לעזרה";
      dictMsg["loading x"] = "Loading &1...";
      dictMsg["data src not specfd x"] = "Data source not specified for &1...";
      dictMsg["name fld not specfd x"] = "Name field not specified for &1...";
      dictMsg["val fld not specfd x"] = "Value field not specified for &1...";
      dictMsg["failed to load x"] = "Failed to load &1.";
      dictMsg["cannot rmv last col"] = "You cannot remove the last column.";
      dictMsg["cannot find col"] = "Cannot find the specified columnId.";
      dictMsg["subfile deletion"] = "Are you sure you want to delete the subfile?";
      dictMsg["downloading x"] = "Downloading &1";
      dictMsg["ie9 too low xlsxpics"] = "Images cannot be exported using IE9 or lower.";
      dictMsg["keyboard input inhibited"] = "Keyboard entry not allowed in this field.";

      // Atrium only.
      dictMsg["num sessions exceeded"] = "Number of allowed sessions exceeded.";
      dictMsg["unable to load portal"] = "Unable to load portal settings or navigation items.";
      dictMsg["unable to load macr act"] = "Unable to load macro actions.";
      dictMsg["unable to load macr var"] = "Unable to load macro variables.";
      dictMsg["unable to load scrn lst"] = "Unable to load screen list.";
      dictMsg["unable to load new sett"] = "Unable to load new settings.";
      dictMsg["unable to load x"] = "Unable to load &1.";
      dictMsg["unable to add x"] = "Unable to add &1.";
      dictMsg["unable to rename x"] = "Unable to rename &1.";
      dictMsg["unable to delete x"] = "Unable to delete &1.";
      dictMsg["unable to update x"] = "Unable to update &1.";
      dictMsg["unable to reassn x"] = "Unable to reassign &1.";
      dictMsg["unable to reorder items"] = "Unable to reorder items.";
      dictMsg["unable to save theme"] = "Unable to save theme setting.";
      dictMsg["unable eval script url"] = "Unable to evaluate scripted web app URL.";
      dictMsg["close browser text AT"] = "Unsaved changes to the session(s) will be lost.";
      dictMsg["close all tabs"] = "Close all tabs?";
      dictMsg["close tab"] = "Do you want to close this tab?";
      dictMsg["invalid script url"] = "Invalid value for scripted web app URL.";
      dictMsg["unrecognized format"] = "Unrecognized format.";
      dictMsg["screen already defined"] = "Screen \"&1\" is already defined.";
      dictMsg["macro already defined"] = "Macro \"&1\" is already defined.";
      dictMsg["no screen ids"] = "There are no screen identifiers to display";
      dictMsg["confirm delete"] = "Confirm Delete";
      dictMsg["no actions"] = "There are no actions to display.";
      dictMsg["msg action input var"] = "Enter the value in variable \"&1\" into the field at row &2 column &3.";
      dictMsg["msg action input user"] = "Enter the current user profile into the field at row &1 column &2.";
      dictMsg["msg action input js"] = "Enter the result of JavaScript expression <strong>&1</strong> into the field at row &2 column &3.";
      dictMsg["msg action input other"] = "Enter the value \"&1\" into the field at row &2 column &3.";
      dictMsg["msg presskey var"] = "Press the key defined in variable \"&1\".";
      dictMsg["msg presskey other"] = "Press the \"&1\" key.";
      dictMsg["msg del scrn from macro"] = "Are you sure you want to delete the selected screen(s) from this macro?<br /> All associated actions will also be deleted.";
      dictMsg["choose scrn macro"] = "Choose a screen or macro to work with its properties.";
      dictMsg["choose a nav or toolbar"] = "Choose a navigation or toolbar item to work with its properties.";
      dictMsg["confirm del sel x"] = "Are you sure you want to delete the selected &1?";
      dictMsg["permission settings"] = "permission setting(s)";
      dictMsg["adding x"] = "Adding &1...";
      dictMsg["deleting x"] = "Deleting &1 ...";
      dictMsg["reassigning x"] = "Reassigning &1...";
      dictMsg["loading"] = "טוען";
      dictMsg["saving"] = "Saving...";
      dictMsg["x added"] = "&1 added.";
      dictMsg["x deleted"] = "&1 deleted.";
      dictMsg["x reassigned"] = "&1 reassigned.";
      dictMsg["x updated"] = "&1 updated.";
      dictMsg["x saved"] = "&1 saved.";
      dictMsg["msg del group"] = "Are you sure you want to delete group \"&1\"?<br /><br />Deleting groups also deletes any subgroups and any associated users.<br /><br />Are you sure you want to continue?";
      dictMsg["conf reassign users 1"] = "Are you sure you want to reassign ";
      dictMsg["conf reassign users 2a"] = "user \"&1\" ";
      dictMsg["conf reassign users 2b"] = "the selected users ";
      dictMsg["conf reassign users 3"] = " to group \"&1\"?";
      dictMsg["conf reassign group"] = "Are you sure you want to reassign group \"&1\" to group \"&2\"?";
      dictMsg["conf delete users 1"] = "Are you sure you want to delete ";
      dictMsg["conf delete users 2a"] = "user \"&1\"?";
      dictMsg["conf delete users 2b"] = "the selected users?";
      dictMsg["no users"] = "There are no users to display.";
      dictMsg["cannot delete own grp"] = "You cannot delete your own group.";
      dictMsg["cannot delete own usr"] = "You cannot delete your own user profile.";
      dictMsg["not auth reassign prf"] = "You are not authorized to reassign your own profile.";
      dictMsg["typeselect macro name"] = "Type or select macro name...";
      dictMsg["any child items will"] = "Any child items will also be deleted.";
      dictMsg["password must be"] = "Passwords must be at least 6 characters.";
      dictMsg["type or sel home page"] = "Type or select home page...";
      dictMsg["x is already in list"] = "\"&1\" is already in the list.";
      dictMsg["x is not valid libname"] = "\"&1\" is not a valid library name.";
      dictMsg["no libraries in list"] = "No libraries in the list";
      dictMsg["add libl entry"] = "Add library list entry";
      dictMsg["would you like add ano"] = "Would you like to add another?";
      dictMsg["already in suppl grp x"] = "User is already in supplemental group \"&1\".";
      dictMsg["cannot move screen"] = "Unable to move Macro Screen";
      dictMsg["ready to add"] = "(Ready to add actions on this screen)";
      dictMsg["duplicate actions"] = "Duplicate action(s) found for this row/column, unpredictable results could occur. Please review actions and delete duplicates.";

      break;

    case "runtimeText":
      dictMsg["upload select text"] = " בחר קבצים ";
      dictMsg["upload clear text"] = " נקה ";
      dictMsg["upload remove text"] = " הסר ";
      dictMsg["upload upload text"] = " העלה ";
      dictMsg["upload drophere text"] = "Drop files here";
      dictMsg["upload browser unsupported"] = "Drag/drop files requires Internet Explorer 10 or higher, Chrome, or Firefox";
      dictMsg["upload finished text"] = "Finished";
      dictMsg["excel export text"] = " יצוא לאקסל "; // Replaces "csv export text".
      dictMsg["export to x"] = "Export to &1";
      dictMsg["filter text"] = " מסנן ";
      dictMsg["find text"] = "Find";
      dictMsg["reset data"] = "Reset";
      dictMsg["remove filters text"] = " הסר את כל המסננים ";
      dictMsg["displayed columns"] = "Displayed Columns";
      dictMsg["next link text"] = " הבאה ";
      dictMsg["previous link text"] = " הקודם ";
      dictMsg["sort ascending text"] = " מיין לפי סדר עולה ";
      dictMsg["sort descending text"] = " מיין בסדר יורד ";
      dictMsg["sort..."] = "Sort...";
      dictMsg["sort"] = "Sort";
      dictMsg["sort multiple"] = "Sort Multiple Columns";
      dictMsg["column"] = "Column";
      dictMsg["direction"] = "Direction";
      dictMsg["order"] = "Order";
      dictMsg["row"] = " שורה ";
      dictMsg["rows"] = " שורות ";
      dictMsg["page"] = " עמוד ";
      dictMsg["collapseAll"] = "לכווץ הכל";
      dictMsg["expandAll"] = "להרחיב הכל";
      dictMsg["user"] = "משתמש";
      dictMsg["password"] = "סיסמא";
      dictMsg["sign on"] = "להירשם";
      dictMsg["pui"] = "Profound UI";
      dictMsg["pui sign on"] = dictMsg["pui"] + " " + dictMsg["sign on"];
      dictMsg["pjs"] = "Profound.js";
      dictMsg["pjs sign on"] = dictMsg["pjs"] + " " + dictMsg["sign on"];
      dictMsg["message id"] = "זיהוי הודעה";
      dictMsg["ctlr job"] = "Controller Job";
      dictMsg["app job"] = "Application Job";
      dictMsg["joblog download"] = "Download Job Logs";
      dictMsg["curr user"] = "Current User";
      dictMsg["remote ip"] = "Remote IP Address";
      dictMsg["remote port"] = "Remote Port";
      dictMsg["severity"] = "רצינות";
      dictMsg["date"] = "תאריך";
      dictMsg["time"] = "זמן";
      dictMsg["program"] = "תכנית";
      dictMsg["procedure"] = "פרוצדורה";
      dictMsg["lines"] = "שורה";
      dictMsg["message"] = "הודעה";
      dictMsg["new session"] = "מושב חדש";
      dictMsg["close"] = "לסגור";
      dictMsg["current password"] = "סיסמא נוכחית";
      dictMsg["new password"] = "סיסמא חדשה";
      dictMsg["repeat new password"] = "חזור על סיסמא חדשה";
      dictMsg["submit"] = "שלח";
      dictMsg["exit"] = "יציאה";
      dictMsg["warning"] = "אזהרה";
      dictMsg["change password"] = "שינוי סיסמא";
      dictMsg["cancel"] = "לבטל";
      dictMsg["find text"] = "מצא";
      dictMsg["remove filter"] = "הסר סינון";
      dictMsg["chart"] = "Chart";
      dictMsg["section"] = "Section";
      dictMsg["version"] = "Version";
      dictMsg["fixPack"] = "Fix Pack";
      // Atrium only.
      dictMsg["yes"] = "Yes";
      dictMsg["no"] = "No";
      dictMsg["settings"] = "Settings";
      dictMsg["favorites"] = "Favorites";
      dictMsg["type query press en"] = "Type query, press Enter.";
      dictMsg["add to favorites"] = "Add to Favorites";
      dictMsg["rmv from favorites"] = "Remove from Favorites";
      dictMsg["please wait"] = "Please wait...";
      dictMsg["control panel"] = "Control Panel";
      dictMsg["my settings"] = "My Settings";
      dictMsg["about atrium"] = "About Atrium";
      dictMsg["about atrium msg"] = dictMsg["version"] + " " + window["pui"]["baseVersion"] + ", " + dictMsg["fixPack"] + " " + window["pui"]["fixPackVersion"] + "<br /><br />" +
                                                    "Copyright &copy 1999-" + new Date().getFullYear() + " Profound Logic Software, Inc.<br /><br />" +
                                                    "Warning: This computer program is protected by copyright law<br />" +
                                                    "and international treaties. Unauthorized reproduction or<br />" +
                                                    "distribution of this program, or any portion of it, may result in<br />" +
                                                    "severe civil and criminal penalties, and will be prosecuted to the<br />" +
                                                    "maximum extent possible under the law.<br /><br />" +
                                                    "Patented. &nbsp;U.S. Patent No. 8,667,405 B2.";
      dictMsg["item"] = "Item";
      dictMsg["open selected item"] = "Open Selected Item";
      dictMsg["of"] = "שֶׁל";
      dictMsg["no results to dsp"] = "No results to display.";
      dictMsg["displaying results"] = "Displaying results";
      dictMsg["search results"] = "Search Results";
      dictMsg["new folder"] = "New Folder";
      dictMsg["rename"] = "Rename";
      dictMsg["description"] = "Description";
      dictMsg["ok"] = "OK";
      dictMsg["add"] = "Add";
      dictMsg["add x"] = "Add &1";
      dictMsg["delete"] = "Delete";
      dictMsg["screen"] = "Screen";
      dictMsg["screens"] = "Screens";
      dictMsg["macro"] = "Macro";
      dictMsg["macros"] = "Macros";
      dictMsg["screen id"] = "Screen Identifier";
      dictMsg["screen ids"] = "Screen Identifiers";
      dictMsg["field row"] = "Field Row";
      dictMsg["field column"] = "Field Column";
      dictMsg["field value"] = "Field Value";
      dictMsg["value"] = "Value";
      dictMsg["action"] = "Action";
      dictMsg["actions"] = "Actions";
      dictMsg["detect once"] = "Detect Once";
      dictMsg["delete screen"] = "Delete Screen";
      dictMsg["genie macros"] = "Genie Macros";
      dictMsg["screen name"] = "Screen name";
      dictMsg["identifier"] = "Identifier";
      dictMsg["identifiers"] = "Identifiers";
      dictMsg["macro name"] = "Macro name";
      dictMsg["close browser wintab"] = "Close the browser window or tab.";
      dictMsg["select"] = "Select";
      dictMsg["write value in field"] = "Write a value into a field";
      dictMsg["press a key"] = "Press a key";
      dictMsg["a literal value"] = "A literal value";
      dictMsg["a variable value"] = "A variable value";
      dictMsg["cur user profile"] = "The current user profile";
      dictMsg["result js expr"] = "The result of a JavaScript expression";
      dictMsg["action data"] = "Action data";
      dictMsg["data type"] = "Data type";
      dictMsg["users"] = "Users";
      dictMsg["all groups"] = "All Groups";
      dictMsg["supplemental groups"] = "Supplemental Groups";
      dictMsg["users w primary grp"] = "Users whose Primary Group is \"&1\"";
      dictMsg["users w suppl grp"] = "Users with Supplemental Group for \"&1\"";
      dictMsg["group"] = "Group";
      dictMsg["groups"] = "Groups";
      dictMsg["edit"] = "Edit";
      dictMsg["edit x"] = "Edit &1";
      dictMsg["manager"] = "Manager";
      dictMsg["administrator"] = "Administrator";
      dictMsg["primary group"] = "Primary Group";
      dictMsg["delete x"] = "Delete &1";
      dictMsg["reassign x"] = "Reassign &1";
      dictMsg["navigation item"] = "Navigation Item";
      dictMsg["navigation items"] = "Navigation Items";
      dictMsg["navigation panel"] = "Navigation Panel";
      dictMsg["home pages"] = "Home Pages";
      dictMsg["menu group"] = "Menu Group";
      dictMsg["menu item"] = "Menu Item";
      dictMsg["toolbar items"] = "Toolbar Items";
      dictMsg["toolbar"] = "Toolbar";
      dictMsg["button"] = "Button";
      dictMsg["pulldown menu"] = "Pulldown Menu";
      dictMsg["pulldown menu item"] = "Pulldown Menu Item";
      dictMsg["separator bar"] = "Separator Bar";
      dictMsg["spacer"] = "Spacer";
      dictMsg["item details"] = "Item Details";
      dictMsg["item number"] = "Item number";
      dictMsg["item type"] = "Item type";
      dictMsg["genie macro"] = "Genie Macro";
      dictMsg["rdf application"] = "Rich Display File Application";
      dictMsg["web application"] = "Web Application";
      dictMsg["pc command"] = "PC Command";
      dictMsg["launcher command"] = "Launcher Command";
      dictMsg["dspf program library"] = "Display file program library";
      dictMsg["dspf program"] = "Display file program";
      dictMsg["variable name x"] = "Variable name &1";
      dictMsg["a tab in the portal"] = "A tab in the portal";
      dictMsg["a new browser wind"] = "A new browser window or tab";
      dictMsg["update"] = "Update";
      dictMsg["fill"] = "Fill";
      dictMsg["permissions"] = "Permissions";
      dictMsg["user/group name"] = "User/Group Name";
      dictMsg["all users groups"] = "All Users and Groups";
      dictMsg["type"] = "Type";
      dictMsg["access"] = "Access";
      dictMsg["allow"] = "Allow";
      dictMsg["disallow"] = "Disallow";
      dictMsg["navigation"] = "Navigation";
      dictMsg["add usrgrp perm"] = "Add User/Group Permissions";
      dictMsg["membership"] = "Membership";
      dictMsg["none"] = "None";
      dictMsg["remove"] = "Remove";
      dictMsg["appearance"] = "Appearance";
      dictMsg["home page"] = "Home page";
      dictMsg["tree"] = "Tree";
      dictMsg["accordion"] = "Accordion";
      dictMsg["min search chars"] = "Minimum search characters";
      dictMsg["libl for rdf apps"] = "Library List for Rich Display File Applications";
      dictMsg["library list"] = "Library list";
      dictMsg["library"] = "Library";
      dictMsg["use atrium def libl"] = "Use Atrium default library list";
      dictMsg["use jobd libl"] = "Use library list from JOBD";
      dictMsg["specify libl"] = "Specify library list";
      dictMsg["up"] = "Up";
      dictMsg["down"] = "Down";
      dictMsg["move up"] = "Move Up";
      dictMsg["move down"] = "Move Down";
      dictMsg["global settings"] = "Global settings";
      dictMsg["save"] = "Save";
      dictMsg["add usr to supp grp"] = "Add User to Supplemental Group";
      // Atrium.help tool-tip titles and texts. (Some are used for other fields than just tool-tips.)
      dictMsg["member of"] = "Member of";
      dictMsg["member of hlp"] = "The group that this user/group belongs to.";
      dictMsg["group name"] = "Group name";
      dictMsg["group name hlp"] = "The display name for this group.";
      dictMsg["inherit settings"] = "Inherit settings";
      dictMsg["inherit settings hlp"] = "When this option is checked, the user/group will inherit settings from its parent. When unchecked, the user/group will have its own settings data.";
      dictMsg["user name"] = "User Name";
      dictMsg["user name hlp"] = "The display name of this user profile.";
      dictMsg["access role"] = "Access Role";
      dictMsg["access role hlp"] = "Controls the access role of this user. Administrators can manage all groups and users, and can also control application authorities. Managers can configure user and group settings within their own group. Users have no special privileges.";
      dictMsg["can edit profile"] = "Can edit profile";
      dictMsg["can edit profile hlp"] = "Allows the user to edit \"appearance\" and \"navigation\" settings, and to change the password. All other settings are never editable by the user.";
      dictMsg["user profile"] = "User Profile";
      dictMsg["user profile hlp"] = "The user profile name. User profile names are case sensitive, unless IBM i profiles are used.";
      dictMsg["password hlp"] = "Sets/resets the password. Passwords are case sensitive.";
      dictMsg["conf password"] = "Confirm Password";
      dictMsg["conf password hlp"] = "When setting/resetting the password, this field must match exactly to the new password given. Passwords are case sensitive.";
      // Atrium.help tool-tip - User/group Appearance preferences.
      dictMsg["browser title"] = "Browser title";
      dictMsg["browser title hlp"] = "Sets the text that will display in the browser's title bar.";
      dictMsg["show banner"] = "Show banner";
      dictMsg["show banner hlp"] = "Uncheck this option if you do not wish to show the banner at the top of the portal.";
      dictMsg["banner height"] = "Banner height";
      dictMsg["banner height hlp"] = "Sets the height of the banner at the top of the portal in pixels. This setting is ignored if you have chosen not to show the banner. Valid values are 0-600 pixels.";
      dictMsg["banner url"] = "Banner URL";
      dictMsg["banner url hlp"] = "Sets the URL where the banner content is located. Can be either an absolute or fully qualified URL.";
      dictMsg["theme"] = "Theme";
      dictMsg["theme hlp"] = "Sets the default theme. This can be overridden by individual users if <strong>\"Allow users to select theme\"</strong> is enabled.";
      dictMsg["allow sel theme"] = "Allow user to select theme";
      dictMsg["allow sel theme hlp"] = "If checked, users will have the ability to select their desired theme using a control in the toolbar.";
      dictMsg["show menu search"] = "Show menu search";
      dictMsg["show menu search hlp"] = "Uncheck to disable the menu search feature.";
      dictMsg["show fav sys"] = "Show Favorites system";
      dictMsg["show fav sys hlp"] = "Uncheck to disable the Favorites system.";
      dictMsg["show fav start"] = "Show Favorites on startup";
      dictMsg["show fav start hlp"] = "If checked, the Favorites panel is shown on startup. Otherwise the Navigation panel will be shown (default). This option will only be available if Favorites system is enabled.";
      dictMsg["limit num sessn"] = "Limit number of sessions";
      dictMsg["limit num sessn hlp"] = "Number of Atrium sessions allowed for this user/group. A value of zero allows for unlimited sessions. The limitation is applied per web browser.";
      // Atrium.help tool-tip - User/Group navigation preferences.
      dictMsg["show hmpg start"] = "Show home page on startup";
      dictMsg["show hmpg start hlp"] = "If checked, a customizable home page will be launched in the portal on startup.";
      dictMsg["home page url"] = "Home page URL";
      dictMsg["home page url hlp"] = "Sets the URL where the home page content is located. Can be either an absolute or fully qualified URL.";
      dictMsg["navi pnl title"] = "Navigation panel title";
      dictMsg["navi pnl title hlp"] = "Sets the text that will display in the navigation panel's title bar.";
      dictMsg["navi pnl width"] = "Navigation panel start width";
      dictMsg["navi pnl width hlp"] = "Sets the starting width of the navigation panel in pixels. The user can resize or even hide the panel as desired. Valid values are 0-2000 pixels.";
      dictMsg["navi type"] = "Navigation type";
      dictMsg["navi type hlp"] = "Controls the type of menu used in the navigation panel, \"tree\" or \"accordion\". This setting does not apply to the toolbar.";
      dictMsg["single click nav"] = "Single click navigation";
      dictMsg["single click nav hlp"] = "If checked, menu items in the navigation panel will launch on a single click. Otherwise, they will launch only on double click. This setting does not apply to the toolbar.";
      // Atrium.help tool-tip - Library list.
      dictMsg["current library"] = "Current library";
      dictMsg["current library hlp"] = "Specify the current library, *USRPRF, or *CRTDFT.";
      dictMsg["job descr"] = "Job description";
      dictMsg["job descr hlp"] = "Specify a job description to set the library list from. *USRPRF can be specified if the Atrium users are IBM i user profiles.";
      dictMsg["job descr lib"] = "Job description library";
      dictMsg["job descr lib hlp"] = "Specify the library for the job description. *LIBL or *CURLIB can be specified.";
      // Atrium.help tool-tip - Navigation / Toolbar items.
      dictMsg["item name"] = "Item name";
      dictMsg["item name hlp"] = "Sets the display name of the navigation or toolbar item.";
      dictMsg["action type"] = "Action type";
      dictMsg["action type hlp"] = "Sets the type of application that this item launches.";
      dictMsg["url"] = "URL";
      dictMsg["url hlp"] = "Sets the URL of the Web application. This can be specified either as an absolute path or a fully qualified URL. Query string parameters may be specified on the URL.";
      dictMsg["genie url"] = "Genie URL";
      dictMsg["genie url hlp"] = "Sets the URL that is used to launch Genie. If not specified, the default Genie URL /profoundui/auth/genie will be used. This field is useful if an alternate Genie URL or query string parameters are required. For example: /profoundui/auth/genie?skin=MyCompany";
      dictMsg["open as"] = "Open as";
      dictMsg["open as hlp"] = "Sets whether to launch the item as a new tab in the portal, or as a new browser window or tab. Whether the browser uses a new window or tab depends on the user's browser settings.";
      dictMsg["opens once only"] = "Opens once only";
      dictMsg["opens once only hlp"] = "By default, if the user launches this item when a tab is already open to it in the portal, another tab will be opened to the item. There is no limitation on the number of tabs the user can open in this way. When this open is checked, the user will not be able to open more than one tab to this item. If there is already a tab open for the item when the user selects it, the existing tab will be activated. This option is ignored when opening the item in a new browser window or tab.";
      dictMsg["icon"] = "Icon";
      dictMsg["icon hlp"] = "Optional. Sets an icon file to be used for the navigation or toolbar item. The icon file can be in GIF, JPG, or PNG format. Transparent GIFs are recommended. The path should be given as an absolute path from the root of the Atrium installation. If no icon is specified, Atrium will use a default icon for navigation items. No icon will be shown for toolbar items unless specified here.";
      dictMsg["parameter"] = "Parameter";
      dictMsg["parameter hlp"] = "Optional: Specifies a parameter that will be passed to your Rich Display program when it is launched.";

      break;

    default:
      console.log("Unknown Dictionary Type : '" + dict + "'");
  }

  return dictMsg;
};
