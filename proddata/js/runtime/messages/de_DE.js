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

// ----------------------------------
//  German / Germany
// ----------------------------------
var de_DE = function(dict) {

    var dictMsg = {};

    switch (dict) {

        case "runtimeMsg":
            dictMsg["closeMessage"]                 = "Die Sitzung wird beendet.";
            dictMsg["no connection message"]        = "System i5 ist nicht erreichbar, bitte die Kommunikation prüfen und erneut versuchen.";
            dictMsg["upload file limit"]            = "Maximum von &1 Datei(en) ist erreicht.";
            dictMsg["upload size limit"]            = "Maximum von &1MB je Datei ist erreicht";
            dictMsg["upload no files"]              = "Keine Datei(en) ausgewählt.";
            dictMsg["upload duplicate file"]        = "Doppelte Dateien ausgewählt.";
            dictMsg["upload file exists"]           = "Eine oder mehrere Datei(en) existieren bereits im Dateisystem.";
            dictMsg["upload prevented"]             = "Operation untersagt durch Prüfprogramm.";
            dictMsg["upload input limit"]           = "Gesamte Eingabegröße ist überschritten.";
            dictMsg["upload no session"]            = "Keine Verbindung zu einer gültigen Sitzung.";
            dictMsg["upload timeout"]               = "Zeitüberschreitung Vorgang.";
            dictMsg["upload invalid response"]      = "Die Server Antwort fehlt oder ist ungültig.";  //Also used in Atrium for Ajax error.
            dictMsg["upload cancelled"]             = "Upload canceled.";  // TODO
            dictMsg["close browser text"]           = "Bitte das Browserfenster schließen, um die Abmeldung zu vervollständigen.";
            dictMsg["session ended text"]           = "Die Sitzung ist beendet.";
            dictMsg["outside ucs2"]                 = 'Buchstaben außerhalb des UCS-2 Bereichs.';
            dictMsg["invalid number"]               = '&1 ist keine gültige Nummer.';
            dictMsg["invalid length"]               = '&1 hat ungültige Datenlänge oder Dezimalstelle.';
            dictMsg["invalid decimal"]              = '&1 hat zu viele Dezimalstellen. (max: &2)';
            dictMsg["invalid choice"]               = '"&1" ist ungültig. Gültige Werte sind "&2" oder "&3".';
            dictMsg["invalid date"]                 = '"&1" ist kein gültiges Datum. Beispielformat: &2';
            dictMsg["invalid time"]                 = '"&1" ist keine gültige Zeit. Beispielformat: &2';
            dictMsg["invalid time stamp"]           = '"&1" ist kein gültiger Zeitstempel. Beispielformat: &2';
            dictMsg["invalid percent"]              = '&1 ist kein gültige Zahl.';
            dictMsg["invalid digits"]               = '"&1" enthält zu viele Ziffern. Max: &2';
            dictMsg["exceeds whole"]                = '"&1" überschreitet die maximale Anahl von Ziffern der gesamten Zahl (&2 Stellen).';
            dictMsg["exceeds decimal"]              = '"&1" überschreitet die maximale Anzahl von Ziffern für den Nachkommateil (&2 Stellen).';
            dictMsg["zip too long"]                 = 'Postleitzahl ist zu lang. (Max.: &1 Ziffern)';
            dictMsg["phone too long"]               = 'Telefonnummer ist zu lang. (Max.: &1 Ziffern)';
            dictMsg["ssno too long"]                = 'Sozialversicherungsnummer ist zu lang. (Max.: &1 Ziffern)';
            dictMsg["invalid custom val"]           = 'ungültige benutzerdefinierte Prüffunktion.';
            dictMsg["error custom val"]             = 'Fehler in benutzerdefinierter Prüffunktion.';
            dictMsg["ME"]                           = "Pflichtfeld, bitte Daten eingeben.";
            dictMsg["MF"]                           = "Pflichtfeld, eine vollständige Eingabe ist notwendig.";
            dictMsg["required"]                     = "Der Wert kann nicht leer sein, Eingabe erforderlich.";
            dictMsg["file required"]                = "Bitte mindestens eine Datei auswählen.";
            dictMsg["signature overflow"]           = "Die Größe der Signatur überschreitet die maximale Speichergröße. Bitte löschen und erneut versuchen.";
            dictMsg["validValues"]                  = "Eingegebener Wert ist nicht gültig. Gültige Werte sind: ";
            dictMsg["upload invalid type"]          = "Eine oder mehrere Dateien haben den falschen Typcode.";
            dictMsg["invalid email"]                = "ungültige E-Mail-Adresse.";
            dictMsg["session timed out"]            = "Ihre Sitzung ist abgelaufen.";
            dictMsg["invalid low range"]            = "Wert muss größer sein als &1";
            dictMsg["invalid high range"]           = "Wert muss kleiner oder gleich &1 sein";
            dictMsg["invalid range"]                = "Gültiger Bereich ist zwischen &1 und &2";
            dictMsg["unmonitored exception"]        = "Das Programm hat einen nicht überwachten Fehler gefunden. Bitte kontaktieren Sie ihren Systemadministrator.";
            dictMsg["loading x"]                    = "Loading &1...";  // TODO
            dictMsg["data src not specfd x"]        = "Data source not specified for &1...";  // TODO
            dictMsg["name fld not specfd x"]        = "Name field not specified for &1...";  // TODO
            dictMsg["val fld not specfd x"]         = "Value field not specified for &1...";  // TODO
            dictMsg["failed to load x"]             = "Failed to load &1.";  // TODO
            dictMsg["cannot rmv last col"]          = "You cannot remove the last column.";  // TODO
            dictMsg["cannot find col"]              = "Cannot find the specified columnId.";  // TODO
            dictMsg["subfile deletion"]             = "Wollen Sie wirklich die Subfile löschen?";
            dictMsg["downloading x"]                = "Downloading &1";  // TODO
            dictMsg["ie9 too low xlsxpics"]         = "Images cannot be exported using IE9 or lower.";  // TODO

            // Atrium only.
            dictMsg["num sessions exceeded"]        = "Number of allowed sessions exceeded.";  // TODO
            dictMsg["unable to load portal"]        = "Unable to load portal settings or navigation items.";  // TODO
            dictMsg["unable to load macr act"]      = "Unable to load macro actions.";  // TODO
            dictMsg["unable to load macr var"]      = "Unable to load macro variables.";  // TODO
            dictMsg["unable to load scrn lst"]      = "Unable to load screen list.";  // TODO
            dictMsg["unable to load new sett"]      = "Unable to load new settings.";  // TODO
            dictMsg["unable to load x"]             = "Unable to load &1.";  // TODO
            dictMsg["unable to add x"]              = "Unable to add &1.";  // TODO
            dictMsg["unable to rename x"]           = "Unable to rename &1.";  // TODO
            dictMsg["unable to delete x"]           = "Unable to delete &1.";  // TODO
            dictMsg["unable to update x"]           = "Unable to update &1.";  // TODO
            dictMsg["unable to reassn x"]           = "Unable to reassign &1.";  // TODO
            dictMsg["unable to reorder items"]      = "Unable to reorder items.";  // TODO
            dictMsg["unable to save theme"]         = "Unable to save theme setting.";  // TODO
            dictMsg["unable eval script url"]       = "Unable to evaluate scripted web app URL.";  // TODO
            dictMsg["close browser text AT"]        = "Unsaved changes to the session(s) will be lost.";  // TODO
            dictMsg["close all tabs"]               = "Close all tabs?";  // TODO
            dictMsg["close tab"]                    = "Do you want to close this tab?";  // TODO
            dictMsg["invalid script url"]           = "Invalid value for scripted web app URL.";  // TODO
            dictMsg["unrecognized format"]          = "Unrecognized format.";  // TODO
            dictMsg["screen already defined"]       = "Screen \"&1\" is already defined.";  // TODO
            dictMsg["macro already defined"]        = "Macro \"&1\" is already defined.";  // TODO
            dictMsg["no screen ids"]                = "There are no screen identifiers to display";  // TODO
            dictMsg["confirm delete"]               = "Confirm Delete";  // TODO
            dictMsg["no actions"]                   = "There are no actions to display.";  // TODO
            dictMsg["msg action input var"]         = "Enter the value in variable \"&1\" into the field at row &2 column &3.";  // TODO
            dictMsg["msg action input user"]        = "Enter the current user profile into the field at row &1 column &2.";  // TODO
            dictMsg["msg action input js"]          = "Enter the result of JavaScript expression <strong>&1</strong> into the field at row &2 column &3.";  // TODO
            dictMsg["msg action input other"]       = "Enter the value \"&1\" into the field at row &2 column &3.";  // TODO
            dictMsg["msg presskey var"]             = "Press the key defined in variable \"&1\".";  // TODO
            dictMsg["msg presskey other"]           = "Press the \"&1\" key.";  // TODO
            dictMsg["msg del scrn from macro"]      = "Are you sure you want to delete the selected screen(s) from this macro?<br /> All associated actions will also be deleted.";  // TODO
            dictMsg["choose scrn macro"]            = "Choose a screen or macro to work with its properties.";  // TODO
            dictMsg["choose a nav or toolbar"]      = "Choose a navigation or toolbar item to work with its properties.";  // TODO
            dictMsg["confirm del sel x"]            = "Are you sure you want to delete the selected &1?";  // TODO
            dictMsg["permission settings"]          = "permission setting(s)";  // TODO
            dictMsg["adding x"]                     = "Adding &1...";  // TODO
            dictMsg["deleting x"]                   = "Deleting &1 ...";  // TODO
            dictMsg["reassigning x"]                = "Reassigning &1...";  // TODO
            dictMsg["loading"]                      = "übertragen...";
            dictMsg["saving"]                       = "Saving...";  // TODO
            dictMsg["x added"]                      = "&1 added.";  // TODO
            dictMsg["x deleted"]                    = "&1 deleted.";  // TODO
            dictMsg["x reassigned"]                 = "&1 reassigned.";  // TODO
            dictMsg["x updated"]                    = "&1 updated.";  // TODO
            dictMsg["x saved"]                      = "&1 saved.";  // TODO
            dictMsg["msg del group"]                = "Are you sure you want to delete group \"&1\"?<br /><br />Deleting groups also deletes any subgroups and any associated users.<br /><br />Are you sure you want to continue?";  // TODO
            dictMsg["conf reassign users 1"]        = "Are you sure you want to reassign ";  // TODO
            dictMsg["conf reassign users 2a"]       = "user \"&1\" ";  // TODO
            dictMsg["conf reassign users 2b"]       = "the selected users ";  // TODO
            dictMsg["conf reassign users 3"]        = " to group \"&1\"?";  // TODO
            dictMsg["conf reassign group"]          = "Are you sure you want to reassign group \"&1\" to group \"&2\"?";  // TODO
            dictMsg["conf delete users 1"]          = "Are you sure you want to delete ";  // TODO
            dictMsg["conf delete users 2a"]         = "user \"&1\"?";  // TODO
            dictMsg["conf delete users 2b"]         = "the selected users?";  // TODO
            dictMsg["no users"]                     = "There are no users to display.";  // TODO
            dictMsg["cannot delete own grp"]        = "You cannot delete your own group.";  // TODO
            dictMsg["cannot delete own usr"]        = "You cannot delete your own user profile.";  // TODO
            dictMsg["not auth reassign prf"]        = "You are not authorized to reassign your own profile.";  // TODO
            dictMsg["typeselect macro name"]        = "Type or select macro name...";  // TODO
            dictMsg["any child items will"]         = "Any child items will also be deleted.";  // TODO
            dictMsg["password must be"]             = "Passwords must be at least 6 characters.";  // TODO
            dictMsg["type or sel home page"]        = "Type or select home page...";  // TODO
            dictMsg["x is already in list"]         = "\"&1\" is already in the list.";  // TODO
            dictMsg["x is not valid libname"]       = "\"&1\" is not a valid library name.";  // TODO
            dictMsg["no libraries in list"]         = "No libraries in the list";  // TODO
            dictMsg["add libl entry"]               = "Add library list entry";  // TODO
            dictMsg["would you like add ano"]       = "Would you like to add another?";  // TODO
            dictMsg["already in suppl grp x"]       = "User is already in supplemental group \"&1\".";  // TODO

            break;

        case "runtimeText":
            dictMsg["upload select text"]           = "Dateiauswahl";
            dictMsg["upload clear text"]            = "Löschen";
            dictMsg["upload remove text"]           = "Entfernen";
            dictMsg["upload upload text"]           = "Heraufladen";
            dictMsg["upload drophere text"]         = "Drop files here";  // TODO
            dictMsg["upload browser unsupported"]   = "Drag/drop files requires Internet Explorer 10 or higher, Chrome, or Firefox";  // TODO
            dictMsg["upload finished text"]         = "Finished";  // TODO
            dictMsg["excel export text"]            = "Export nach Excel";    //Replaces "csv export text".
            dictMsg["export to x"]                  = "Export nach &1";
            dictMsg["filter text"]                  = "Filter";
            dictMsg["find text"]                    = "Find";  // TODO
            dictMsg["reset data"]                   = "Reset";  // TODO
            dictMsg["remove filters text"]          = "Alle Filter entfernen";
            dictMsg["next link text"]               = "Nächste";
            dictMsg["previous link text"]           = "Vorige";
            dictMsg["sort ascending text"]          = "Sortierung aufsteigend";
            dictMsg["sort descending text"]         = "Sortierung absteigend";
            dictMsg["row"]                          = "Zeile";
            dictMsg["rows"]                         = "Zeilen";
            dictMsg["page"]                         = "Seite";
            dictMsg["collapseAll"]                  = "alles zuklappen";
            dictMsg["expandAll"]                    = "alles aufklappen";
            dictMsg["user"]                         = "Benutzer";
            dictMsg["password"]                     = "Passwort";
            dictMsg["pui"]                          = "Profound UI";
            dictMsg["pui sign on"]                  = "Profound UI Anmeldung";
            dictMsg["sign on"]                      = "Aanmelding";
            dictMsg["message id"]                   = "Nachrichten Id";
            dictMsg["ctlr job"]                     = "Steuernder Job";
            dictMsg["app job"]                      = "Anwendungsjob";
            dictMsg["joblog download"]              = "Job Logs Herunterladen";
            dictMsg["curr user"]                    = "Aktueller Benutzer";
            dictMsg["remote ip"]                    = "Server IP Adresse";
            dictMsg["remote port"]                  = "Server Port";
            dictMsg["severity"]                     = "Schwere";
            dictMsg["date"]                         = "Datum";
            dictMsg["time"]                         = "Zeit";
            dictMsg["program"]                      = "Programm";
            dictMsg["procedure"]                    = "Prozedur";
            dictMsg["lines"]                        = "Zeile(n)";
            dictMsg["message"]                      = "Nachricht";
            dictMsg["new session"]                  = "Neue Sitzung";
            dictMsg["close"]                        = "Schließen";
            dictMsg["current password"]             = "Aktuelles Passwort";
            dictMsg["new password"]                 = "Neues Passwort";
            dictMsg["repeat new password"]          = "Wiederholung neues Passwort";
            dictMsg["submit"]                       = "Bestätigen";
            dictMsg["exit"]                         = "Ende";
            dictMsg["warning"]                      = "Warnung";
            dictMsg["change password"]              = "Ändern Passwort";
            dictMsg["cancel"]                       = "Abbrechen";
            dictMsg["find text"]                    = "Finden";
            dictMsg["remove filter"]                = "Filter entfernen";
            dictMsg["chart"]                        = "Chart";  // TODO
            dictMsg["section"]                      = "Section";  // TODO
            // Atrium only.
            dictMsg["yes"]                          = "Yes";  // TODO
            dictMsg["no"]                           = "No";  // TODO
            dictMsg["settings"]                     = "Settings";  // TODO
            dictMsg["favorites"]                    = "Favorites";  // TODO
            dictMsg["type query press en"]          = "Type query, press Enter.";  // TODO
            dictMsg["add to favorites"]             = "Add to Favorites";  // TODO
            dictMsg["rmv from favorites"]           = "Remove from Favorites";  // TODO
            dictMsg["please wait"]                  = "Please wait...";  // TODO
            dictMsg["control panel"]                = "Control Panel";  // TODO
            dictMsg["my settings"]                  = "My Settings";  // TODO
            dictMsg["about atrium"]                 = "About Atrium";  // TODO
            dictMsg["about atrium msg"]             = "Version " + window["pui"]["baseVersion"] + ", Fix Pack " + window["pui"]["fixPackVersion"] + "<br /><br />"
                                                    + "Copyright &copy 1999-" + new Date().getFullYear() + " Profound Logic Software, Inc.<br /><br />"
                                                    + "Warning: This computer program is protected by copyright law<br />"
                                                    + "and international treaties. Unauthorized reproduction or<br />"
                                                    + "distribution of this program, or any portion of it, may result in<br />"
                                                    + "severe civil and criminal penalties, and will be prosecuted to the<br />"
                                                    + "maximum extent possible under the law.<br /><br />"
                                                    + "Patented. &nbsp;U.S. Patent No. 8,667,405 B2.";  // TODO
            dictMsg["item"]                         = "Item";  // TODO
            dictMsg["open selected item"]           = "Open Selected Item";  // TODO
            dictMsg["no results to dsp"]            = "No results to display.";  // TODO
            dictMsg["displaying results"]           = "Displaying results";  // TODO
            dictMsg["search results"]               = "Search Results";  // TODO
            dictMsg["new folder"]                   = "New Folder";  // TODO
            dictMsg["rename"]                       = "Rename";  // TODO
            dictMsg["description"]                  = "Description";  // TODO
            dictMsg["ok"]                           = "OK";  // TODO
            dictMsg["add"]                          = "Add";  // TODO
            dictMsg["add x"]                        = "Add &1";  // TODO
            dictMsg["delete"]                       = "Delete";  // TODO
            dictMsg["screen"]                       = "Screen";  // TODO
            dictMsg["screens"]                      = "Screens";  // TODO
            dictMsg["macro"]                        = "Macro";  // TODO
            dictMsg["macros"]                       = "Macros";  // TODO
            dictMsg["screen id"]                    = "Screen Identifier";  // TODO
            dictMsg["screen ids"]                   = "Screen Identifiers";  // TODO
            dictMsg["field row"]                    = "Field Row";  // TODO
            dictMsg["field column"]                 = "Field Column";  // TODO
            dictMsg["field value"]                  = "Field Value";  // TODO
            dictMsg["value"]                        = "Value";  // TODO
            dictMsg["action"]                       = "Action";  // TODO
            dictMsg["actions"]                      = "Actions";  // TODO
            dictMsg["detect once"]                  = "Detect Once";  // TODO
            dictMsg["delete screen"]                = "Delete Screen";  // TODO
            dictMsg["genie macros"]                 = "Genie Macros";  // TODO
            dictMsg["screen name"]                  = "Screen name";  // TODO
            dictMsg["identifier"]                   = "Identifier";  // TODO
            dictMsg["identifiers"]                  = "Identifiers";  // TODO
            dictMsg["macro name"]                   = "Macro name";  // TODO
            dictMsg["close browser wintab"]         = "Close the browser window or tab.";  // TODO
            dictMsg["select"]                       = "Select";  // TODO
            dictMsg["write value in field"]         = "Write a value into a field";  // TODO
            dictMsg["press a key"]                  = "Press a key";  // TODO
            dictMsg["a literal value"]              = "A literal value";  // TODO
            dictMsg["a variable value"]             = "A variable value";  // TODO
            dictMsg["cur user profile"]             = "The current user profile";  // TODO
            dictMsg["result js expr"]               = "The result of a JavaScript expression";  // TODO
            dictMsg["action data"]                  = "Action data";  // TODO
            dictMsg["data type"]                    = "Data type";  // TODO
            dictMsg["users"]                        = "Users";  // TODO
            dictMsg["all groups"]                   = "All Groups";  // TODO
            dictMsg["supplemental groups"]          = "Supplemental Groups";  // TODO
            dictMsg["users w primary grp"]          = "Users whose Primary Group is \"&1\"";  // TODO
            dictMsg["users w suppl grp"]            = "Users with Supplemental Group for \"&1\"";  // TODO
            dictMsg["group"]                        = "Group";  // TODO
            dictMsg["groups"]                       = "Groups";  // TODO
            dictMsg["edit"]                         = "Edit";  // TODO
            dictMsg["edit x"]                       = "Edit &1";  // TODO
            dictMsg["manager"]                      = "Manager";  // TODO
            dictMsg["administrator"]                = "Administrator";  // TODO
            dictMsg["primary group"]                = "Primary Group";  // TODO
            dictMsg["delete x"]                     = "Delete &1";  // TODO
            dictMsg["reassign x"]                   = "Reassign &1";  // TODO
            dictMsg["navigation item"]              = "Navigation Item";  // TODO
            dictMsg["navigation items"]             = "Navigation Items";  // TODO
            dictMsg["navigation panel"]             = "Navigation Panel";  // TODO
            dictMsg["home pages"]                   = "Home Pages";  // TODO
            dictMsg["menu group"]                   = "Menu Group";  // TODO
            dictMsg["menu item"]                    = "Menu Item";  // TODO
            dictMsg["toolbar items"]                = "Toolbar Items";  // TODO
            dictMsg["toolbar"]                      = "Toolbar";  // TODO
            dictMsg["button"]                       = "Button";  // TODO
            dictMsg["pulldown menu"]                = "Pulldown Menu";  // TODO
            dictMsg["pulldown menu item"]           = "Pulldown Menu Item";  // TODO
            dictMsg["separator bar"]                = "Separator Bar";  // TODO
            dictMsg["spacer"]                       = "Spacer";  // TODO
            dictMsg["item details"]                 = "Item Details";  // TODO
            dictMsg["item number"]                  = "Item number";  // TODO
            dictMsg["item type"]                    = "Item type";  // TODO
            dictMsg["genie macro"]                  = "Genie Macro";  // TODO
            dictMsg["rdf application"]              = "Rich Display File Application";  // TODO
            dictMsg["web application"]              = "Web Application";  // TODO
            dictMsg["pc command"]                   = "PC Command";  // TODO
            dictMsg["dspf program library"]         = "Display file program library";  // TODO
            dictMsg["dspf program"]                 = "Display file program";  // TODO
            dictMsg["variable name x"]              = "Variable name &1";  // TODO
            dictMsg["a tab in the portal"]          = "A tab in the portal";  // TODO
            dictMsg["a new browser wind"]           = "A new browser window or tab";  // TODO
            dictMsg["update"]                       = "Update";  // TODO
            dictMsg["fill"]                         = "Fill";  // TODO
            dictMsg["permissions"]                  = "Permissions";  // TODO
            dictMsg["user/group name"]              = "User/Group Name";  // TODO
            dictMsg["all users groups"]             = "All Users and Groups";  // TODO
            dictMsg["type"]                         = "Type";  // TODO
            dictMsg["access"]                       = "Access";  // TODO
            dictMsg["allow"]                        = "Allow";  // TODO
            dictMsg["disallow"]                     = "Disallow";  // TODO
            dictMsg["navigation"]                   = "Navigation";  // TODO
            dictMsg["add usrgrp perm"]              = "Add User/Group Permissions";  // TODO
            dictMsg["membership"]                   = "Membership";  // TODO
            dictMsg["none"]                         = "None";  // TODO
            dictMsg["remove"]                       = "Remove";  // TODO
            dictMsg["appearance"]                   = "Appearance";  // TODO
            dictMsg["home page"]                    = "Home page";  // TODO
            dictMsg["tree"]                         = "Tree";  // TODO
            dictMsg["accordion"]                    = "Accordion";  // TODO
            dictMsg["min search chars"]             = "Minimum search characters";  // TODO
            dictMsg["libl for rdf apps"]            = "Library List for Rich Display File Applications";  // TODO
            dictMsg["library list"]                 = "Library list";  // TODO
            dictMsg["library"]                      = "Library";  // TODO
            dictMsg["use atrium def libl"]          = "Use Atrium default library list";  // TODO
            dictMsg["use jobd libl"]                = "Use library list from JOBD";  // TODO
            dictMsg["specify libl"]                 = "Specify library list";  // TODO
            dictMsg["up"]                           = "Up";  // TODO
            dictMsg["down"]                         = "Down";  // TODO
            dictMsg["move up"]                      = "Move Up";  // TODO
            dictMsg["move down"]                    = "Move Down";  // TODO
            dictMsg["global settings"]              = "Global settings";  // TODO
            dictMsg["save"]                         = "Save";  // TODO
            dictMsg["add usr to supp grp"]          = "Add User to Supplemental Group";  // TODO
            // Atrium.help tool-tip titles and texts. (Some are used for other fields than just tool-tips.)
            dictMsg["member of"]                    = "Member of";  // TODO
            dictMsg["member of hlp"]                = "The group that this user/group belongs to.";  // TODO
            dictMsg["group name"]                   = "Group name";  // TODO
            dictMsg["group name hlp"]               = "The display name for this group.";  // TODO
            dictMsg["inherit settings"]             = "Inherit settings";  // TODO
            dictMsg["inherit settings hlp"]         = "When this option is checked, the user/group will inherit settings from its parent. When unchecked, the user/group will have its own settings data.";  // TODO
            dictMsg["user name"]                    = "User Name";  // TODO
            dictMsg["user name hlp"]                = "The display name of this user profile.";  // TODO
            dictMsg["access role"]                  = "Access Role";  // TODO
            dictMsg["access role hlp"]              = "Controls the access role of this user. Administrators can manage all groups and users, and can also control application authorities. Managers can configure user and group settings within their own group. Users have no special privileges.";  // TODO
            dictMsg["can edit profile"]             = "Can edit profile";  // TODO
            dictMsg["can edit profile hlp"]         = "Allows the user to edit \"appearance\" and \"navigation\" settings, and to change the password. All other settings are never editable by the user.";  // TODO
            dictMsg["user profile"]                 = "User Profile";  // TODO
            dictMsg["user profile hlp"]             = "The user profile name. User profile names are case sensitive, unless IBM i profiles are used.";  // TODO
            dictMsg["password hlp"]                 = "Sets/resets the password. Passwords are case sensitive.";  // TODO
            dictMsg["conf password"]                = "Confirm Password";  // TODO
            dictMsg["conf password hlp"]            = "When setting/resetting the password, this field must match exactly to the new password given. Passwords are case sensitive.";  // TODO
            // Atrium.help tool-tip - User/group Appearance preferences.
            dictMsg["browser title"]                = "Browser title";  // TODO
            dictMsg["browser title hlp"]            = "Sets the text that will display in the browser's title bar.";  // TODO
            dictMsg["show banner"]                  = "Show banner";  // TODO
            dictMsg["show banner hlp"]              = "Uncheck this option if you do not wish to show the banner at the top of the portal.";  // TODO
            dictMsg["banner height"]                = "Banner height";  // TODO
            dictMsg["banner height hlp"]            = "Sets the height of the banner at the top of the portal in pixels. This setting is ignored if you have chosen not to show the banner. Valid values are 0-600 pixels.";  // TODO
            dictMsg["banner url"]                   = "Banner URL";  // TODO
            dictMsg["banner url hlp"]               = "Sets the URL where the banner content is located. Can be either an absolute or fully qualified URL.";  // TODO
            dictMsg["theme"]                        = "Theme";  // TODO
            dictMsg["theme hlp"]                    = "Sets the default theme. This can be overridden by individual users if <strong>\"Allow users to select theme\"</strong> is enabled.";  // TODO
            dictMsg["allow sel theme"]              = "Allow user to select theme";  // TODO
            dictMsg["allow sel theme hlp"]          = "If checked, users will have the ability to select their desired theme using a control in the toolbar.";  // TODO
            dictMsg["show menu search"]             = "Show menu search";  // TODO
            dictMsg["show menu search hlp"]         = "Uncheck to disable the menu search feature.";  // TODO
            dictMsg["show fav sys"]                 = "Show Favorites system";  // TODO
            dictMsg["show fav sys hlp"]             = "Uncheck to disable the Favorites system.";  // TODO
            dictMsg["show fav start"]               = "Favoriten Anzeige in Startmaske";
            dictMsg["show fav start hlp"]           = "Wenn ausgewählt, wird die Favoriten Anzeige in der Startmaske angezeigt. Ansonsten wird das Navigations Panel angezeigt (Standard). Diese Option ist nur verfügbar, wenn Favoriten aktiviert sind.";
            dictMsg["limit num sessn"]              = "Limit number of sessions";  // TODO
            dictMsg["limit num sessn hlp"]          = "Number of Atrium sessions allowed for this user/group. A value of zero allows for unlimited sessions. The limitation is applied per web browser.";  // TODO
            // Atrium.help tool-tip - User/Group navigation preferences.
            dictMsg["show hmpg start"]              = "Show home page on startup";  // TODO
            dictMsg["show hmpg start hlp"]          = "If checked, a customizable home page will be launched in the portal on startup.";  // TODO
            dictMsg["home page url"]                = "Home page URL";  // TODO
            dictMsg["home page url hlp"]            = "Sets the URL where the home page content is located. Can be either an absolute or fully qualified URL.";  // TODO
            dictMsg["navi pnl title"]               = "Navigation panel title";  // TODO
            dictMsg["navi pnl title hlp"]           = "Sets the text that will display in the navigation panel's title bar.";  // TODO
            dictMsg["navi pnl width"]               = "Navigation panel start width";  // TODO
            dictMsg["navi pnl width hlp"]           = "Sets the starting width of the navigation panel in pixels. The user can resize or even hide the panel as desired. Valid values are 0-2000 pixels.";  // TODO
            dictMsg["navi type"]                    = "Navigation type";  // TODO
            dictMsg["navi type hlp"]                = "Controls the type of menu used in the navigation panel, \"tree\" or \"accordion\". This setting does not apply to the toolbar.";  // TODO
            dictMsg["single click nav"]             = "Single click navigation";  // TODO
            dictMsg["single click nav hlp"]         = "If checked, menu items in the navigation panel will launch on a single click. Otherwise, they will launch only on double click. This setting does not apply to the toolbar.";  // TODO
            // Atrium.help tool-tip - Library list.
            dictMsg["current library"]              = "Current library";  // TODO
            dictMsg["current library hlp"]          = "Specify the current library, *USRPRF, or *CRTDFT.";  // TODO
            dictMsg["job descr"]                    = "Job description";  // TODO
            dictMsg["job descr hlp"]                = "Specify a job description to set the library list from. *USRPRF can be specified if the Atrium users are IBM i user profiles.";  // TODO
            dictMsg["job descr lib"]                = "Job description library";  // TODO
            dictMsg["job descr lib hlp"]            = "Specify the library for the job description. *LIBL or *CURLIB can be specified.";  // TODO
            // Atrium.help tool-tip - Navigation / Toolbar items.
            dictMsg["item name"]                    = "Item name";  // TODO
            dictMsg["item name hlp"]                = "Sets the display name of the navigation or toolbar item.";  // TODO
            dictMsg["action type"]                  = "Action type";  // TODO
            dictMsg["action type hlp"]              = "Sets the type of application that this item launches.";  // TODO
            dictMsg["url"]                          = "URL";  // TODO
            dictMsg["url hlp"]                      = "Sets the URL of the Web application. This can be specified either as an absolute path or a fully qualified URL. Query string parameters may be specified on the URL.";  // TODO
            dictMsg["genie url"]                    = "Genie URL";  // TODO
            dictMsg["genie url hlp"]                = "Sets the URL that is used to launch Genie. If not specified, the default Genie URL /profoundui/auth/genie will be used. This field is useful if an alternate Genie URL or query string parameters are required. For example: /profoundui/auth/genie?skin=MyCompany";  // TODO
            dictMsg["open as"]                      = "Open as";  // TODO
            dictMsg["open as hlp"]                  = "Sets whether to launch the item as a new tab in the portal, or as a new browser window or tab. Whether the browser uses a new window or tab depends on the user's browser settings.";  // TODO
            dictMsg["opens once only"]              = "Opens once only";  // TODO
            dictMsg["opens once only hlp"]          = "By default, if the user launches this item when a tab is already open to it in the portal, another tab will be opened to the item. There is no limitation on the number of tabs the user can open in this way. When this open is checked, the user will not be able to open more than one tab to this item. If there is already a tab open for the item when the user selects it, the existing tab will be activated. This option is ignored when opening the item in a new browser window or tab.";  // TODO
            dictMsg["icon"]                         = "Icon";  // TODO
            dictMsg["icon hlp"]                     = "Optional. Sets an icon file to be used for the navigation or toolbar item. The icon file can be in GIF, JPG, or PNG format. Transparent GIFs are recommended. The path should be given as an absolute path from the root of the Atrium installation. If no icon is specified, Atrium will use a default icon for navigation items. No icon will be shown for toolbar items unless specified here.";  // TODO
            dictMsg["parameter"]                    = "Parameter";  // TODO
            dictMsg["parameter hlp"]                = "Optional: Specifies a parameter that will be passed to your Rich Display program when it is launched.";  // TODO

            break;

        default:
            console.log("Unknown Dictionary Type : '" + dict + "'");
    }

    return dictMsg;
};