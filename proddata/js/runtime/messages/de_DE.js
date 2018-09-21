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
            dictMsg["upload cancelled"]             = "Dateiübertragung abgebrochen.";
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
            dictMsg["loading x"]                    = "&1 wird geladen";
            dictMsg["data src not specfd x"]        = "Die Datenquelle ist nicht angegeben für &1...";
            dictMsg["name fld not specfd x"]        = "Das Namensfeld ist nicht angegeben für &1...";
            dictMsg["val fld not specfd x"]         = "Das Wertfeld ist nicht angegeben für &1...";
            dictMsg["failed to load x"]             = "Fehler beim Laden &1.";
            dictMsg["cannot rmv last col"]          = "Die letzte Spalte kann nicht gelöscht werden.";
            dictMsg["cannot find col"]              = "Die spezifische SpaltenId kann nicht gefunden werden.";
            dictMsg["subfile deletion"]             = "Wollen Sie wirklich die Subfile löschen?";
            dictMsg["downloading x"]                = "&1 wird heruntergeladen.";
            dictMsg["ie9 too low xlsxpics"]         = "Bilder können nicht exporiert werden mit einer Version unter IE9.";

            // Atrium only.
            dictMsg["num sessions exceeded"]        = "Anzahl der Sitzungen überschritten.";
            dictMsg["unable to load portal"]        = "Die Portaleinstellungen oder Navigationselemente konnten nicht geladen werden.";
            dictMsg["unable to load macr act"]      = "Makroaktionen konnten nicht geladen werden.";
            dictMsg["unable to load macr var"]      = "Makrovariablen konnten nicht geladen werden.";
            dictMsg["unable to load scrn lst"]      = "Die Bildschirmliste konnte nicht geladen werden.";
            dictMsg["unable to load new sett"]      = "Neue Einstellungen konnten nicht geladen werden.";
            dictMsg["unable to load x"]             = "Kann &1 nicht laden.";
            dictMsg["unable to add x"]              = "Kann &1 nicht hinzufügen.";
            dictMsg["unable to rename x"]           = "Kann &1 nicht umbenennen.";
            dictMsg["unable to delete x"]           = "Kann &1 nicht löschen.";
            dictMsg["unable to reassn x"]           = "Kann &1 nicht zuweisen.";
            dictMsg["unable to reorder items"]      = "Die Artikel können nicht neu sortiert werden.";
            dictMsg["unable to save theme"]         = "Die Designeinstellung konnte nicht gespeichert werden.";
            dictMsg["unable eval script url"]       = "Die URL der Skript-Webanwendung kann nicht ausgewertet werden.";
            dictMsg["close browser text AT"]        = "Nicht gespeicherte Änderungen an den Sitzungen gehen verloren.";
            dictMsg["close all tabs"]               = "Alle Fenster schließen?";
            dictMsg["close tab"]                    = "Möchten Sie diesen Tab schließen?";
            dictMsg["invalid script url"]           = "Ungültiger Wert für die URL der skriptgesteuerten Webanwendung.";
            dictMsg["unrecognized format"]          = "Unbekanntes Format";
            dictMsg["screen already defined"]       = "Der Bildschirm \"&1\" ist bereits definiert.";
            dictMsg["macro already defined"]        = "Das Makro \"&1\" ist bereits definiert.";
            dictMsg["no screen ids"]                = "Es gibt keine Bildschirm-IDs zum Anzeigen";
            dictMsg["confirm delete"]               = "Löschen bestätigen";
            dictMsg["no actions"]                   = "Es gibt keine Aktionen zum Anzeigen.";
            dictMsg["msg action input var"]         = "Tragen Sie den Wert in die Variable \"&1\" in das Feld in Zeile &2 Spalte &3.";
            dictMsg["msg action input user"]        = "Geben Sie das aktuelle Benutzerprofil in das Feld in Zeile &1 Spalte &2.";
            dictMsg["msg action input js"]          = "Geben Sie das Ergebnis des JavaScript-Ausdrucks <strong>&1</strong> in das Feld in Zeile &2 Spalte &3 ein.";
            dictMsg["msg action input other"]       = "Geben Sie den Wert \"&1\" in das Feld in Zeile &2 Spalte &3.";
            dictMsg["msg presskey var"]             = "Drücken Sie die in der Variable \"&1\" definierte Taste.";
            dictMsg["msg presskey other"]           = "Drücken Sie die \"&1\" Taste.";
            dictMsg["msg del scrn from macro"]      = "Möchten Sie die ausgewählten Bildschirme wirklich aus diesem Makro löschen?<br /> Alle zugehörigen Aktionen werden ebenfalls gelöscht";
            dictMsg["choose scrn macro"]            = "Wählen Sie einen Bildschirm oder ein Makro, um mit seinen Eigenschaften zu arbeiten..";
            dictMsg["choose a nav or toolbar"]      = "Wählen Sie ein Navigations- oder Toolbarelement, um mit seinen Eigenschaften zu arbeiten.";
            dictMsg["confirm del sel x"]            = "Möchten Sie das ausgewählte &1 wirklich löschen?";
            dictMsg["permission settings"]          = "Berechtigungseinstellung (en)";
            dictMsg["adding x"]                     = "Hinzufügen von &1...";
            dictMsg["deleting x"]                   = "Löschen von &1 ...";
            dictMsg["reassigning x"]                = "Neuzuweisung von &1...";
            dictMsg["loading"]                      = "Wird geladen...";
            dictMsg["saving"]                       = "Speichern...";
            dictMsg["x added"]                      = "&1 hinzugefügt.";
            dictMsg["x deleted"]                    = "&1 gelöscht.";
            dictMsg["x reassigned"]                 = "&1 neu zugewiesen.";
            dictMsg["x updated"]                    = "&1 aktualisiert.";
            dictMsg["x saved"]                      = "&1 gespeichert.";
            dictMsg["msg del group"]                = "Möchten Sie die Gruppe \"&1\" wirklich löschen?<br /><br />Durch das Löschen von Gruppen werden auch alle Untergruppen und alle zugehörigen Benutzer gelöscht.<br /><br />Möchten Sie wirklich fortfahren?";
            dictMsg["conf reassign users 1"]        = "Sind Sie sicher, dass Sie neu zuweisen möchten?";
            dictMsg["conf reassign users 2a"]       = "Benutzer \"&1\" ";
            dictMsg["conf reassign users 2b"]       = "die ausgewählten Benutzer ";
            dictMsg["conf reassign users 3"]        = " gruppieren \"&1\"?";
            dictMsg["conf reassign group"]          = "Sind Sie sicher, dass Sie die Gruppe \"&1\" der Gruppe \"&2\"zuorndnen möchten?";
            dictMsg["conf delete users 1"]          = "Sind Sie sicher, dass Sie löschen möchten? ";
            dictMsg["conf delete users 2a"]         = "Benutzer \"&1\"?";
            dictMsg["conf delete users 2b"]         = "die ausgewählten Benutzer?";
            dictMsg["no users"]                     = "Es sind keine Benutzer zum Anzeigen vorhanden.";
            dictMsg["cannot delete own grp"]        = "Sie können Ihre eigene Gruppe nicht löschen.";
            dictMsg["cannot delete own usr"]        = "Sie können Ihr eigenes Benutzerprofil nicht löschen.";
            dictMsg["not auth reassign prf"]        = "Sie sind nicht berechtigt, Ihr eigenes Profil neu zuzuweisen.";
            dictMsg["typeselect macro name"]        = "Tippen oder wählen Sie den Makronamen ...";
            dictMsg["any child items will"]         = "Alle untergeordneten Elemente werden ebenfalls gelöscht.";
            dictMsg["password must be"]             = "Passwörter müssen mindestens 6 Zeichen lang sein.";
            dictMsg["type or sel home page"]        = "Geben oder wählen Sie die Startseite...";
            dictMsg["x is already in list"]         = "\"&1\" ist bereits in der Liste.";
            dictMsg["x is not valid libname"]       = "\"&1\" ist kein gültiger Bibliotheksname.";
            dictMsg["no libraries in list"]         = "Keine Bibliotheken in der Liste";
            dictMsg["add libl entry"]               = "Bibliothekslisteneintrag hinzufügen";
            dictMsg["would you like add ano"]       = "Möchten Sie ein anderes hinzufügen?";
            dictMsg["already in suppl grp x"]       = "Der Benutzer ist bereits in der Ergänzungsgruppe \"&1\".";

            break;

        case "runtimeText":
            dictMsg["upload select text"]           = "Dateiauswahl";
            dictMsg["upload clear text"]            = "Löschen";
            dictMsg["upload remove text"]           = "Entfernen";
            dictMsg["upload upload text"]           = "Heraufladen";
            dictMsg["upload drophere text"]         = "Dateien hier ablegen";
            dictMsg["upload browser unsupported"]   = "Ziehen / Ablegen von Dateien erfordert Internet Explorer 10 oder höher, Chrome oder Firefox";
            dictMsg["upload finished text"]         = "Fertig";
            dictMsg["excel export text"]            = "Export nach Excel";    //Replaces "csv export text".
            dictMsg["export to x"]                  = "Export nach &1";
            dictMsg["filter text"]                  = "Filter";
            dictMsg["find text"]                    = "Finden";
            dictMsg["reset data"]                   = "Zurücksetzen";
            dictMsg["remove filters text"]          = "Alle Filter entfernen";
            dictMsg["displayed columns"]            = "Spalten Anzeigen";
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
            dictMsg["sign on"]                      = "Anmelden";
            dictMsg["pui"]                          = "Profound UI";
            dictMsg["pui sign on"]                  = dictMsg["pui"] + " " + dictMsg["sign on"];
            dictMsg["pjs"]                          = "Profound.js";
            dictMsg["pjs sign on"]                  = dictMsg["pjs"] + " " + dictMsg["sign on"];
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
            dictMsg["change password"]              = "Passwort ändern";
            dictMsg["cancel"]                       = "Abbrechen";
            dictMsg["find text"]                    = "Finden";
            dictMsg["remove filter"]                = "Filter entfernen";
            dictMsg["chart"]                        = "Diagramm";
            dictMsg["section"]                      = "Sektion";
            dictMsg["version"]                      = "Ausführung";
            dictMsg["fixPack"]                      = "Fixpack";
            // Atrium only.
            dictMsg["yes"]                          = "Ja";
            dictMsg["no"]                           = "Nein";
            dictMsg["settings"]                     = "Einstellungen";
            dictMsg["favorites"]                    = "Favoriten";
            dictMsg["type query press en"]          = "Geben Sie Abfrage ein und drücken Sie die Eingabetaste";
            dictMsg["add to favorites"]             = "Zu den Favoriten hinzufügen";
            dictMsg["rmv from favorites"]           = "Von Favoriten entfernen";
            dictMsg["please wait"]                  = "Bitte warten...";
            dictMsg["control panel"]                = "Steuerungspanel";
            dictMsg["my settings"]                  = "Meine Einstellungen";
            dictMsg["about atrium"]                 = "Über Atrium";
            dictMsg["about atrium msg"]             = dictMsg["version"] + " " + window["pui"]["baseVersion"] + ", " + dictMsg["fixPack"] + " " + window["pui"]["fixPackVersion"] + "<br /><br />"
                                                    + "Copyright &copy 1999-" + new Date().getFullYear() + " Profound Logic Software, Inc.<br /><br />"
                                                    + "Warnung: Dieses Computerprogramm ist durch das Urheberrecht<br />"
                                                    + "und internationale Verträge geschützt. Die unerlaubte Vervielfältigung<br />"
                                                    + "oder Verbreitung dieses Programms oder eines Teils davon kann zu schwerwiegenden<br />"
                                                    + "zivil- und strafrechtlichen Konsequenzen führen und wird im größtmöglichen<br />"
                                                    + "gesetzlich zulässigen Umfang verfolgt.<br /><br />"
                                                    + "Patentiert. &nbsp;U.S. Patent No. 8,667,405 B2.";
            dictMsg["item"]                         = "Item";
            dictMsg["open selected item"]           = "Ausgewähltes Element öffnen";
            dictMsg["of"]                           = "von";
            dictMsg["no results to dsp"]            = "Keine Ergebnisse zur Anzeige";
            dictMsg["displaying results"]           = "Ergebnisse werden angezeigt";
            dictMsg["search results"]               = "Suchergebnisse";
            dictMsg["new folder"]                   = "Neuer Ordner";
            dictMsg["rename"]                       = "Umbenennen";
            dictMsg["description"]                  = "Beschreibung";
            dictMsg["ok"]                           = "OK";
            dictMsg["add"]                          = "Hinzufügen";
            dictMsg["add x"]                        = "Füge &1 hinzu";
            dictMsg["delete"]                       = "Löschen";
            dictMsg["screen"]                       = "Bildschirm";
            dictMsg["screens"]                      = "Bildschirme";
            dictMsg["macro"]                        = "Makro";
            dictMsg["macros"]                       = "Makros";
            dictMsg["screen id"]                    = "BildschirmId";
            dictMsg["screen ids"]                   = "BildschirmIds";
            dictMsg["field row"]                    = "Feldzeile";
            dictMsg["field column"]                 = "Feldspalte";
            dictMsg["field value"]                  = "Feldwert";
            dictMsg["value"]                        = "Wert";
            dictMsg["action"]                       = "Aktion";
            dictMsg["actions"]                      = "Aktionen";
            dictMsg["detect once"]                  = "Einmal erkennen";
            dictMsg["delete screen"]                = "Bildschirm löschen";
            dictMsg["genie macros"]                 = "Genie Makros";
            dictMsg["screen name"]                  = "Bildschirmname";
            dictMsg["identifier"]                   = "Identifikator";
            dictMsg["identifiers"]                  = "Identifikatoren";
            dictMsg["macro name"]                   = "Makro name";
            dictMsg["close browser wintab"]         = "Schließen Sie das Browserfenster oder die Registerkarte.";
            dictMsg["select"]                       = "Auswählen";
            dictMsg["write value in field"]         = "Schreibe einen Wert in ein Feld";
            dictMsg["press a key"]                  = "drücke eine Taste";
            dictMsg["a literal value"]              = "Ein Literalwert";
            dictMsg["a variable value"]             = "Ein variabler Wert";
            dictMsg["cur user profile"]             = "Das aktuelle Benutzerprofil";
            dictMsg["result js expr"]               = "Das Ergebnis eines JavaScript-Ausdrucks";
            dictMsg["action data"]                  = "Aktionsdaten";
            dictMsg["data type"]                    = "Datentyp";
            dictMsg["users"]                        = "Benutzer";
            dictMsg["all groups"]                   = "Alle Gruppen";
            dictMsg["supplemental groups"]          = "Ergänzende Gruppen";
            dictMsg["users w primary grp"]          = "Benutzer, deren primäre Gruppe \"&1\" ist";
            dictMsg["users w suppl grp"]            = "Benutzer mit Zusatzgruppe für \"&1\"";
            dictMsg["group"]                        = "Gruppe";
            dictMsg["groups"]                       = "Gruppen";
            dictMsg["edit"]                         = "Bearbeiten";
            dictMsg["edit x"]                       = "Bearbeiten &1";
            dictMsg["manager"]                      = "Manager";
            dictMsg["administrator"]                = "Administrator";
            dictMsg["primary group"]                = "Hauptgruppe";
            dictMsg["delete x"]                     = "&1 löschen";
            dictMsg["reassign x"]                   = "&1 Neu zuweisen";
            dictMsg["navigation item"]              = "Navigationselement";
            dictMsg["navigation items"]             = "Navigationselemente";
            dictMsg["navigation panel"]             = "Navigationsleiste";
            dictMsg["home pages"]                   = "Startseiten";
            dictMsg["menu group"]                   = "Menü Gruppen";
            dictMsg["menu item"]                    = "Menü Element";
            dictMsg["toolbar items"]                = "Symbolleistenelemente";
            dictMsg["toolbar"]                      = "Symbolleiste";
            dictMsg["button"]                       = "Taste";
            dictMsg["pulldown menu"]                = "Aufklappmenü";
            dictMsg["pulldown menu item"]           = "PAufklappmenü Element";
            dictMsg["separator bar"]                = "Trennleiste";
            dictMsg["spacer"]                       = "Abstandshalter";
            dictMsg["item details"]                 = "Item Details";
            dictMsg["item number"]                  = "Item Nummer";
            dictMsg["item type"]                    = "Item Typ";
            dictMsg["genie macro"]                  = "Genie Makro";
            dictMsg["rdf application"]              = "Rich Display File Applikation";
            dictMsg["web application"]              = "Web Applikation";
            dictMsg["pc command"]                   = "PC Befehl";
            dictMsg["dspf program library"]         = "Display file Programm Bibliothek";
            dictMsg["dspf program"]                 = "Display file Program";
            dictMsg["variable name x"]              = "Variablenname &1";
            dictMsg["a tab in the portal"]          = "Ein Tab im Portal";
            dictMsg["a new browser wind"]           = "Ein neues Browserfenster oder eine neue Registerkarte";
            dictMsg["update"]                       = "Aktualisieren";
            dictMsg["fill"]                         = "Füllen";
            dictMsg["permissions"]                  = "Berechtigungen";
            dictMsg["user/group name"]              = "Benutzer- / Gruppenname";
            dictMsg["all users groups"]             = "Alle Benutzer und Gruppen";
            dictMsg["type"]                         = "Typ";
            dictMsg["access"]                       = "Zugriff";
            dictMsg["allow"]                        = "zulassen";
            dictMsg["disallow"]                     = "Nicht zulassen";
            dictMsg["navigation"]                   = "Navigation";
            dictMsg["add usrgrp perm"]              = "Fügen Sie Benutzer- / Gruppenberechtigungen hinzu";
            dictMsg["membership"]                   = "Mitgliedschaft";
            dictMsg["none"]                         = "Keiner";
            dictMsg["remove"]                       = "Löschen";
            dictMsg["appearance"]                   = "Aussehen";
            dictMsg["home page"]                    = "Startseite";
            dictMsg["tree"]                         = "Baum";
            dictMsg["accordion"]                    = "Akkordeon";
            dictMsg["min search chars"]             = "Minimale Suchzeichen";
            dictMsg["libl for rdf apps"]            = "Bibliotheksliste für Rich Display File Anwendungen";
            dictMsg["library list"]                 = "Bibliotheksliste";
            dictMsg["library"]                      = "Bibliothek";
            dictMsg["use atrium def libl"]          = "Benutzung der Atrium Standardbibliotheksliste";
            dictMsg["use jobd libl"]                = "Benutzung der Bibliotheksliste aus der Jobbeschreibung";
            dictMsg["specify libl"]                 = "Spezifizieren Sie die Bibliotheksliste";
            dictMsg["up"]                           = "Oben";
            dictMsg["down"]                         = "Nieder";
            dictMsg["move up"]                      = "Nach oben bewegen";
            dictMsg["move down"]                    = "Nach unten bewegen";
            dictMsg["global settings"]              = "Globale Einstellungen";
            dictMsg["save"]                         = "Speichern";
            dictMsg["add usr to supp grp"]          = "Benutzer zur Zusatzgruppe hinzufügen";
            // Atrium.help tool-tip titles and texts. (Some are used for other fields than just tool-tips.)
            dictMsg["member of"]                    = "Member von";
            dictMsg["member of hlp"]                = "Die Gruppe, zu der dieser Benutzer / diese Gruppe gehört.";
            dictMsg["group name"]                   = "Gruppenname";
            dictMsg["group name hlp"]               = "Der Anzeigename für diese Gruppe.";
            dictMsg["inherit settings"]             = "Einstellungen übernehmen";
            dictMsg["inherit settings hlp"]         = "Wenn diese Option aktiviert ist, übernimmt der Benutzer / die Gruppe die Einstellungen von ihrem übergeordneten Element. Wenn sie deaktiviert ist, verfügt der Benutzer / die Gruppe über eigene Einstellungsdaten.";
            dictMsg["user name"]                    = "Benutzername";
            dictMsg["user name hlp"]                = "Der Anzeigename dieses Benutzerprofils.";
            dictMsg["access role"]                  = "Zugriffsrolle";
            dictMsg["access role hlp"]              = "Steuert die Zugriffsrolle dieses Benutzers. Administratoren können alle Gruppen und Benutzer verwalten und auch Anwendungsadministratoren steuern. Manager können Benutzer- und Gruppeneinstellungen in ihrer eigenen Gruppe konfigurieren. Benutzer haben keine besonderen Berechtigungen.";
            dictMsg["can edit profile"]             = "Kann Profil bearbeiten";
            dictMsg["can edit profile hlp"]         = "Ermöglicht dem Benutzer, die Einstellung \"appearance\" und \"navigation\" zu bearbeiten und das Passwort zu ändern. Alle anderen Einstellungen können vom Benutzer nie bearbeitet werden.";
            dictMsg["user profile"]                 = "Benutzerprofil";
            dictMsg["user profile hlp"]             = "Der Name des Benutzerprofils. Benutzerprofilnamen unterscheiden zwischen Groß- und Kleinschreibung, sofern keine IBM i-Profile verwendet werden.";
            dictMsg["password hlp"]                 = "Setzen/Zurücksetzen das Passwort. Passwörter unterscheiden zwischen Groß- und Kleinschreibung.";
            dictMsg["conf password"]                = "Bestätige das Passwort";
            dictMsg["conf password hlp"]            = "Beim Setzen / Zurücksetzen des Passworts muss dieses Feld genau mit dem neuen Passwort übereinstimmen. Passwörter unterscheiden zwischen Groß- und Kleinschreibung.";
            // Atrium.help tool-tip - User/group Appearance preferences.
            dictMsg["browser title"]                = "Browsertitel";
            dictMsg["browser title hlp"]            = "Legt den Text fest, der in der Titelleiste des Browsers angezeigt wird.";
            dictMsg["show banner"]                  = "Banner anzeigen";
            dictMsg["show banner hlp"]              = "Deaktivieren Sie diese Option, wenn Sie das Banner nicht oben im Portal anzeigen möchten.";
            dictMsg["banner height"]                = "Bannerhöhe";
            dictMsg["banner height hlp"]            = "Legt die Höhe des Banners am oberen Rand des Portals in Pixel fest. Diese Einstellung wird ignoriert, wenn Sie das Banner nicht anzeigen möchten. Gültige Werte sind 0-600 Pixel.";
            dictMsg["banner url"]                   = "Banner URL";
            dictMsg["banner url hlp"]               = "Legt die URL fest, in der sich der Bannerinhalt befindet. Kann entweder eine absolute oder eine vollqualifizierte URL sein.";
            dictMsg["theme"]                        = "Design";
            dictMsg["theme hlp"]                    = "Legt das Standarddesign fest. Dies kann von einzelnen Benutzern außer Kraft gesetzt werden, wenn <strong>\"Benutzern das Auswählen des Designs erlauben\"</strong> aktiviert ist.";
            dictMsg["allow sel theme"]              = "Benutzern das Auswählen von Designs erlauben";
            dictMsg["allow sel theme hlp"]          = "Wenn diese Option aktiviert ist, können Benutzer ihr gewünschtes Design mithilfe eines Steuerelements in der Symbolleiste auswählen.";
            dictMsg["show menu search"]             = "Menüsuche anzeigen";
            dictMsg["show menu search hlp"]         = "Deaktivieren Sie diese Option, um die Menüsuchfunktion zu deaktivieren.";
            dictMsg["show fav sys"]                 = "Favoriten System anzeigen";
            dictMsg["show fav sys hlp"]             = "Deaktivieren Sie das Kontrollkästchen, um das Favoriten-System zu deaktivieren.";
            dictMsg["show fav start"]               = "Favoriten Anzeige in Startmaske";
            dictMsg["show fav start hlp"]           = "Wenn ausgewählt, wird die Favoriten Anzeige in der Startmaske angezeigt. Ansonsten wird das Navigations Panel angezeigt (Standard). Diese Option ist nur verfügbar, wenn Favoriten aktiviert sind.";
            dictMsg["limit num sessn"]              = "Maximale Anzahl der Sitzungen";
            dictMsg["limit num sessn hlp"]          = "Anzahl der erlaubten Atrium-Sitzungen für diesen Benutzer / diese Gruppe. Ein Wert von Null ermöglicht unbegrenzte Sitzungen. Die Beschränkung wird pro Webbrowser angewendet.";
            // Atrium.help tool-tip - User/Group navigation preferences.
            dictMsg["show hmpg start"]              = "Homepage beim Start anzeigen";
            dictMsg["show hmpg start hlp"]          = "Wenn diese Option aktiviert ist, wird beim Start eine anpassbare Startseite im Portal gestartet.";
            dictMsg["home page url"]                = "Startseite URL";
            dictMsg["home page url hlp"]            = "Legt die URL für den Inhalt der Startseite fest. Kann entweder eine absolute oder eine vollqualifizierte URL sein.";
            dictMsg["navi pnl title"]               = "Titel des Navigationspanel";
            dictMsg["navi pnl title hlp"]           = "Legt den Text fest, der in der Titelleiste des Navigationsfensters angezeigt wird.";
            dictMsg["navi pnl width"]               = "Startbreite des Navigationspanels";
            dictMsg["navi pnl width hlp"]           = "Legt die Startbreite der Navigationsleiste in Pixel fest. Der Benutzer kann die Größe des Panels beliebig ändern oder sogar ausblenden. Gültige Werte sind 0-2000 Pixel.";
            dictMsg["navi type"]                    = "Navigationstyp";
            dictMsg["navi type hlp"]                = "Steuert den Menütyp, der im Navigationsbereich \"tree\" oder \"accordion\" verwendet wird. Diese Einstellung gilt nicht für die Symbolleiste.";
            dictMsg["single click nav"]             = "Einzelklick-Navigation";
            dictMsg["single click nav hlp"]         = "Wenn diese Option aktiviert ist, werden Menüelemente im Navigationsbereich mit einem einzigen Klick gestartet. Andernfalls werden sie nur mit Doppelklick gestartet. Diese Einstellung gilt nicht für die Symbolleiste.";
            // Atrium.help tool-tip - Library list.
            dictMsg["current library"]              = "Aktuelle Bibliothek";
            dictMsg["current library hlp"]          = "Geben Sie die aktuelle Bibliothek an, *USRPRF, oder *CRTDFT.";
            dictMsg["job descr"]                    = "Job Beschreibung";
            dictMsg["job descr hlp"]                = "Geben Sie eine Jobbeschreibung an, aus der die Bibliotheksliste festgelegt werden soll. * USRPRF kann angegeben werden, wenn die Atrium-Benutzer IBM i-Benutzerprofile sind.";
            dictMsg["job descr lib"]                = "Job Beschreibung Bibliothek";
            dictMsg["job descr lib hlp"]            = "Geben Sie die Bibliothek für die Jobbeschreibung an. *LIBL oder *CURLIB kann angegeben werden.";
            // Atrium.help tool-tip - Navigation / Toolbar items.
            dictMsg["item name"]                    = "Itemname";
            dictMsg["item name hlp"]                = "Legt den Anzeigenamen des Navigations- oder Symbolleistenelements fest.";
            dictMsg["action type"]                  = "Aktionstyp";
            dictMsg["action type hlp"]              = "Legt den Typ der Anwendung fest, die dieses Element startet.";
            dictMsg["url"]                          = "URL";
            dictMsg["url hlp"]                      = "Legt die URL der Webanwendung fest. Dies kann entweder als absoluter Pfad oder als vollständig qualifizierte URL angegeben werden. Query Zeichenfolgen Parameter können in der URL angegeben werden.";
            dictMsg["genie url"]                    = "Genie URL";
            dictMsg["genie url hlp"]                = "Gibt die URL an, die zum Starten von Genie verwendet wird. Wenn nicht angegeben, wird die Standard-Genie-URL /profoundui/auth/genie verwendet. Dieses Feld ist nützlich, wenn alternative URL-URLs oder Abfragezeichenfolgen erforderlich sind. Beispielsweise: /profoundui/auth/genie?skin=MyCompany";
            dictMsg["open as"]                      = "Öffnen als";
            dictMsg["open as hlp"]                  = "Legt fest, ob das Element als neue Registerkarte im Portal oder als neues Browserfenster oder als neue Registerkarte gestartet wird. Ob der Browser ein neues Fenster oder eine neue Registerkarte verwendet, hängt von den Browsereinstellungen des Benutzers ab.";
            dictMsg["opens once only"]              = "Öffnet nur einmal";
            dictMsg["opens once only hlp"]          = "Wenn der Benutzer dieses Element standardmäßig startet, obwohl im Portal bereits eine Registerkarte geöffnet ist, wird eine weitere Registerkarte für das Element geöffnet. Die Anzahl der Registerkarten, die der Benutzer auf diese Weise öffnen kann, ist nicht begrenzt. Wenn dieses Öffnen aktiviert ist, kann der Benutzer nicht mehr als eine Registerkarte für dieses Element öffnen. Wenn bereits ein Tab für das Objekt geöffnet ist, wenn der Benutzer es auswählt, wird das vorhandene Tab aktiviert. Diese Option wird ignoriert, wenn das Element in einem neuen Browserfenster oder Tab geöffnet wird.";
            dictMsg["icon"]                         = "Symbol";
            dictMsg["icon hlp"]                     = "Wahlweise. Legt eine Symboldatei fest, die für den Navigations- oder Symbolleisteneintrag verwendet werden soll. Die Symboldatei kann im GIF-, JPG- oder PNG-Format vorliegen. Transparente GIFs werden empfohlen. Der Pfad sollte als absoluter Pfad vom Stamm der Atrium-Installation angegeben werden. Wenn kein Symbol angegeben ist, verwendet Atrium ein Standardsymbol für Navigationselemente. Für Symbolleistenelemente wird kein Symbol angezeigt, es sei denn, sie sind hier angegeben.";
            dictMsg["parameter"]                    = "Parameter";
            dictMsg["parameter hlp"]                = "Optional: Gibt einen Parameter an, der beim Starten an das Rich-Display-Programm übergeben wird.";

            break;

        default:
            console.log("Unknown Dictionary Type : '" + dict + "'");
    }

    return dictMsg;
};