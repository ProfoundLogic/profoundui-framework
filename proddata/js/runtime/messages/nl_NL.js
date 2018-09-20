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

// ------------------------------------------------------------
//   Dutch -- Netherlands
// -------------------------------------------------------------
var nl_NL = function(dict) {

    var dictMsg = {};

    switch (dict) {

        case "runtimeMsg":
            dictMsg["closeMessage"]                 = "Hiermee wordt uw sessie afgesloten.";
            dictMsg["no connection message"]        = "Geen contact met de server mogelijk. Controleer de verbinding en probeer opnieuw.";
            dictMsg["upload file limit"]            = "Limiet van &1 bestand(en) overschreden.";
            dictMsg["upload size limit"]            = "Limiet van &1MB per bestand overschreden";
            dictMsg["upload no files"]              = "Geen bestanden geselecteerd.";
            dictMsg["upload duplicate file"]        = "Identieke bestanden geselecteerd.";
            dictMsg["upload file exists"]           = "Een of meerdere bestanden staan al in het file systeem.";
            dictMsg["upload prevented"]             = "Handeling geblokkeerd door het exit programma.";
            dictMsg["upload input limit"]           = "Limiet van totale input grootte overschreden.";
            dictMsg["upload no session"]            = "Geen verbinding met een geldige sessie.";
            dictMsg["upload timeout"]               = "Timeout van de transactie.";
            dictMsg["upload invalid response"]      = "Geen(geldig) antwoord van de server.";  //Also used in Atrium for Ajax error.
            dictMsg["upload cancelled"]             = "Upload geannuleerd.";
            dictMsg["close browser text"]           = "Sluit het browser scherm om het logoff proces te voltooien.";
            dictMsg["session ended text"]           = "Sessie is beëindigd.";
            dictMsg["outside ucs2"]                 = "Tekens niet UCS-2.";
            dictMsg["invalid number"]               = "&1 is geen geldig nummer.";
            dictMsg["invalid length"]               = "Lengte of aantal decimalen van &1 is ongeldig.";
            dictMsg["invalid decimal"]              = "Aantal decimalen van &1 ongeldig. (max: &2)";
            dictMsg["invalid choice"]               = "\"&1\" is ongeldig. Geldige keuzes zijn: \"&2\" of \"&3\".";
            dictMsg["invalid date"]                 = "\"&1\" is geen geldige datum. Voorbeeld opmaak: &2";
            dictMsg["invalid time"]                 = "\"&1\" is geen geldige tijd. Voorbeeld opmaak: &2";
            dictMsg["invalid time stamp"]           = "\"&1\" is geen geldige time stamp. Voorbeeld opmaak: &2";
            dictMsg["invalid percent"]              = "&1 is geen geldige decimaal.";
            dictMsg["invalid digits"]               = "\"&1\" heeft teveel cijfers. Max: &2";
            dictMsg["exceeds whole"]                = "\"&1\" overschrijd het maximaal aantal cijfers voor het totale veld (&2 cijfers).";
            dictMsg["exceeds decimal"]              = "\"&1\" overschrijd het maximaal aantal cijfers voor het decimale deel (&2 cijfers).";
            dictMsg["zip too long"]                 = "Postcode te lang. (Maximum: &1 cijfers)";
            dictMsg["phone too long"]               = "Telefoonnummer te lang. (Maximum: &1 cijfers)";
            dictMsg["ssno too long"]                = "Sofinummer te lang. (Maximum: &1 cijfers)";
            dictMsg["invalid custom val"]           = "Ongeldige maatwerk controle routine.";
            dictMsg["error custom val"]             = "Fout in maatwerk controle routine.";
            dictMsg["ME"]                           = "Verplicht veld. Hier iets ingeven.";
            dictMsg["MF"]                           = "Verplicht opvullen van veld. Alle posities van het veld vullen.";
            dictMsg["required"]                     = "Blanco is een ongeldige waarde. Dit veld is vereist.";
            dictMsg["file required"]                = "Selecteer minstens één bestand.";
            dictMsg["signature overflow"]           = "De afbeelding van de handtekening overschrijdt het maximale aantal bytes. Verwijder de handtekening en probeer opnieuw.";
            dictMsg["validValues"]                  = "Ongeldige waarde. Geldige waarden zijn: ";
            dictMsg["upload invalid type"]          = "Eén of meerdere bestandstypes zijn ongeldig.";
            dictMsg["invalid email"]                = "Ongeldig email addres.";
            dictMsg["session timed out"]            = "Uw sessie is verlopen.";
            dictMsg["invalid low range"]            = "Waarde moet zijn groter of gelijk aan &1";
            dictMsg["invalid high range"]           = "Waarde moet zijn kleiner of gelijk aan &1";
            dictMsg["invalid range"]                = "Waarde moet liggen tussen &1 en &2.";
            dictMsg["unmonitored exception"]        = "Het programma heeft een fout ontdekt. Voor hulp neem contact op met de systeembeheerder.";
            dictMsg["loading x"]                    = "Laden &1...";
            dictMsg["data src not specfd x"]        = "Data source niet gespecificeerd voor &1...";
            dictMsg["name fld not specfd x"]        = "Veldnaam niet gespecificeerd voor &1...";
            dictMsg["val fld not specfd x"]         = "Waarde voor veld niet gespecificeerd voor &1...";
            dictMsg["failed to load x"]             = "Laden &1 mislukt.";
            dictMsg["cannot rmv last col"]          = "U kunt de laatste kolom niet verwijderen.";
            dictMsg["cannot find col"]              = "Kan de gespecificeerde kolom-id niet vinden.";
            dictMsg["subfile deletion"]             = "Weet je het zeker dat je de subfile wilt verwijderen?";
            dictMsg["downloading x"]                = "Downloaden &1.";
            dictMsg["ie9 too low xlsxpics"]         = "Afbeeldingen kunnen niet worden geëxporteerd met IE9 of eerdere versies.";

            // Atrium only.
            dictMsg["num sessions exceeded"]        = "Aantal toegestane sessies is overschreden.";
            dictMsg["unable to load portal"]        = "Kan de portal instellingen of onderdelen van de navigatie niet laden.";
            dictMsg["unable to load macr act"]      = "Kan de macro acties niet laden.";
            dictMsg["unable to load macr var"]      = "Kan de macro variabelen niet laden.";
            dictMsg["unable to load scrn lst"]      = "Kan de lijst met schermen niet laden.";
            dictMsg["unable to load new sett"]      = "Kan de nieuwe instellingen niet laden.";
            dictMsg["unable to load x"]             = "Kan &1 niet laden.";
            dictMsg["unable to add x"]              = "Kan &1 niet toevoegen. ";
            dictMsg["unable to rename x"]           = "Kan de naam van &1 niet wijzigen.";
            dictMsg["unable to delete x"]           = "Kan &1 niet verwijderen.";
            dictMsg["unable to update x"]           = "Kan &1 niet bijwerken.";
            dictMsg["unable to reassn x"]           = "Kan &1 niet opnieuw toewijzen.";
            dictMsg["unable to reorder items"]      = "Kan de volgorde van de items niet wijzigen.";
            dictMsg["unable to save theme"]         = "Kan de themainstelling niet veiligstellen.";
            dictMsg["unable eval script url"]       = "Kan het web app URL script niet uitvoeren.";
            dictMsg["close browser text AT"]        = "Sessie wijzigingen die niet zijn veiliggesteld, zijn verloren.";
            dictMsg["close all tabs"]               = "Alle tabs sluiten?";
            dictMsg["close tab"]                    = "Wilt u deze tab sluiten?";
            dictMsg["invalid script url"]           = "Ongeldige waarde voor een web app URL script.";
            dictMsg["unrecognized format"]          = "Opmaak wordt niet herkend.";
            dictMsg["screen already defined"]       = "Scherm \"&1\" is reeds gedefinieerd.";
            dictMsg["macro already defined"]        = "Macro \"&1\" is reeds gedefinieerd.";
            dictMsg["no screen ids"]                = "Er zijn geen scherm identifiers om af te beelden";
            dictMsg["confirm delete"]               = "Bevestig verwijderen";
            dictMsg["no actions"]                   = "Er zijn geen acties om af te beelden.";
            dictMsg["msg action input var"]         = "Geef de waarde van variabele \"&1\" in het veld op regel &2 positie &3.";
            dictMsg["msg action input user"]        = "Geef het huidige gebruikers profiel in het veld op regel &1 positie &2.";
            dictMsg["msg action input js"]          = "Geef het resultaat van de JavaScript expression <strong>&1</strong> in het veld op regel &2 positie &3.";
            dictMsg["msg action input other"]       = "Geef de waarde \"&1\" in het veld op regel &2 positie &3.";
            dictMsg["msg presskey var"]             = "Druk op de toets die is gedefinieerd in variabele \"&1\".";
            dictMsg["msg presskey other"]           = "Druk op de \"&1\" toets.";
            dictMsg["msg del scrn from macro"]      = "Wilt u werkelijk de geselecteerde schermen uit deze macro verwijderen?<br /> Alle gekoppelde acties worden ook verwijderd.";
            dictMsg["choose scrn macro"]            = "Kies een scherm of macro om daarvan de eigenschappen te bewerken.";
            dictMsg["choose a nav or toolbar"]      = "Kies een navigatie of toolbar om daarvan de eigenschappen te bewerken.";
            dictMsg["confirm del sel x"]            = "Weet u het zeker dat u de geselecteerde &1 wilt verwijderen?";
            dictMsg["permission settings"]          = "instellen machtiging(en)";
            dictMsg["adding x"]                     = "Bezig met toevoegen &1...";
            dictMsg["deleting x"]                   = "Bezig met verwijderen &1 ...";
            dictMsg["reassigning x"]                = "Opnieuw toewijzen van &1...";
            dictMsg["loading"]                      = "Bezig met laden...";
            dictMsg["saving"]                       = "Bezig met veiligstellen...";
            dictMsg["x added"]                      = "&1 toegevoegd.";
            dictMsg["x deleted"]                    = "&1 verwijderd.";
            dictMsg["x reassigned"]                 = "&1 opnieuw toegewezen.";
            dictMsg["x updated"]                    = "&1 bijgewerkt.";
            dictMsg["x saved"]                      = "&1 veiliggesteld.";
            dictMsg["msg del group"]                = "Wilt u groep \"&1\" echt verwijderen?<br /><br />Na het verwijderen van een groep worden ook de subgroepen en bijhorende gebruikers verwijderd.<br /><br />Wilt u verder gaan?";
            dictMsg["conf reassign users 1"]        = "Wilt u echt opnieuw toewijzen ";
            dictMsg["conf reassign users 2a"]       = "gebruiker \"&1\" ";
            dictMsg["conf reassign users 2b"]       = "de geselecteerde gebruikers ";
            dictMsg["conf reassign users 3"]        = " naar groep \"&1\"?";
            dictMsg["conf reassign group"]          = "Wilt u echt groep \"&1\" aan groep \"&2\" toewijzen?";
            dictMsg["conf delete users 1"]          = "Wilt u deze gebruiker(s) echt verwijderen  ";
            dictMsg["conf delete users 2a"]         = "gebruiker \"&1\"?";
            dictMsg["conf delete users 2b"]         = "de geselecteerde gebruikers?";
            dictMsg["no users"]                     = "Er zijn geen gebruikers.";
            dictMsg["cannot delete own grp"]        = "U kunt uw eigen groep niet verwijderen.";
            dictMsg["cannot delete own usr"]        = "U kunt uw eigen profiel niet verwijderen.";
            dictMsg["not auth reassign prf"]        = "U bent niet bevoegd tot het opnieuw toewijzen van uw eigen profiel.";
            dictMsg["typeselect macro name"]        = "Type of selecteer een macro naam...";
            dictMsg["any child items will"]         = "De onderliggende items worden ook verwijderd.";
            dictMsg["password must be"]             = "Wachtwoorden moeten bestaan uit tenminste 6 characters.";
            dictMsg["type or sel home page"]        = "Type of selecteer een home page...";
            dictMsg["x is already in list"]         = "\"&1\" staat al in de lijst.";
            dictMsg["x is not valid libname"]       = "\"&1\" is geen geldige bibliotheeknaam.";
            dictMsg["no libraries in list"]         = "Geen bibliotheken in de lijst";
            dictMsg["add libl entry"]               = "Voeg een entry toe aan de lijst met bibliotheken";
            dictMsg["would you like add ano"]       = "Wilt u een nog een toevoegen?";
            dictMsg["already in suppl grp x"]       = "Gebruiker is reeds opgenomen in de aanvullende groep \"&1\".";

            break;

        case "runtimeText":
            dictMsg["upload select text"]           = "Selecteer bestanden";
            dictMsg["upload clear text"]            = "Wissen";
            dictMsg["upload remove text"]           = "Verwijder";
            dictMsg["upload upload text"]           = "Upload tekst";
            dictMsg["upload drophere text"]         = "Zet bestanden hier neer";
            dictMsg["upload browser unsupported"]   = "Drag/drop van bestanden vereist Internet Explorer 10 of recentere versies, Chrome, of Firefox";
            dictMsg["upload finished text"]         = "Upload gereed";
            dictMsg["excel export text"]            = "Export naar Excel";    //Replaces "csv export text".
            dictMsg["export to x"]                  = "Export naar &1";
            dictMsg["filter text"]                  = "Filter";
            dictMsg["find text"]                    = "Zoek";
            dictMsg["reset data"]                   = "Reset";
            dictMsg["remove filters text"]          = "Verwijder alle filters";
            dictMsg["displayed columns"]            = "Displayed Columns";
            dictMsg["next link text"]               = "Volgende";
            dictMsg["previous link text"]           = "Vorige";
            dictMsg["sort ascending text"]          = "Sorteer oplopend";
            dictMsg["sort descending text"]         = "Sorteer afdalend";
            dictMsg["row"]                          = "rij";
            dictMsg["rows"]                         = "rijen";
            dictMsg["page"]                         = "Pagina";
            dictMsg["collapseAll"]                  = "Inklappen";
            dictMsg["expandAll"]                    = "Uitklappen";
            dictMsg["user"]                         = "Gebruiker";
            dictMsg["password"]                     = "Wachtwoord";
            dictMsg["sign on"]                      = "Aanmelding";
            dictMsg["pui"]                          = "Profound UI";
            dictMsg["pui sign on"]                  = dictMsg["sign on"] + " " + dictMsg["pui"];
            dictMsg["pjs"]                          = "Profound.js";
            dictMsg["pjs sign on"]                  = dictMsg["sign on"] + " " + dictMsg["pjs"];
            dictMsg["message id"]                   = "Bericht-Id";
            dictMsg["ctlr job"]                     = "Controle Taak";
            dictMsg["app job"]                      = "Applicatie Taak";
            dictMsg["joblog download"]              = "Download Taak Logboeken";
            dictMsg["curr user"]                    = "Huidige Gebruiker";
            dictMsg["remote ip"]                    = "IP adres op Afstand";
            dictMsg["remote port"]                  = "Poortnummer op Afstand";
            dictMsg["severity"]                     = "Ernst";
            dictMsg["date"]                         = "Datum";
            dictMsg["time"]                         = "Tijd";
            dictMsg["program"]                      = "Programma";
            dictMsg["procedure"]                    = "Procedure";
            dictMsg["lines"]                        = "Regel(s)";
            dictMsg["message"]                      = "Boodschap";
            dictMsg["new session"]                  = "Nieuwe Sessie";
            dictMsg["close"]                        = "Sluiten";
            dictMsg["current password"]             = "Huidig wachtwoord";
            dictMsg["new password"]                 = "Nieuw wachtwoord";
            dictMsg["repeat new password"]          = "Herhaal nieuw wachtwoord";
            dictMsg["submit"]                       = "Aanbieden";
            dictMsg["exit"]                         = "Einde";
            dictMsg["warning"]                      = "Waarschuwing";
            dictMsg["change password"]              = "Wijzig wachtwoord";
            dictMsg["cancel"]                       = "Afbreken";
            dictMsg["find text"]                    = "Vinden";
            dictMsg["remove filter"]                = "Verwijderen Filter";
            dictMsg["chart"]                        = "Grafiek";
            dictMsg["section"]                      = "Sectie";
            dictMsg["version"]                      = "Versie";
            dictMsg["fixPack"]                      = "Fix Pack";
            // Atrium only.
            dictMsg["yes"]                          = "Ja";
            dictMsg["no"]                           = "Nee";
            dictMsg["settings"]                     = "Instellingen";
            dictMsg["favorites"]                    = "Favorieten";
            dictMsg["type query press en"]          = "Type vraag, druk op enter.";
            dictMsg["add to favorites"]             = "Voeg toe aan Favorieten";
            dictMsg["rmv from favorites"]           = "Verwijder uit Favorieten";
            dictMsg["please wait"]                  = "Wachten aub...";
            dictMsg["control panel"]                = "Controle Venster";
            dictMsg["my settings"]                  = "Mijn instellingen";
            dictMsg["about atrium"]                 = "Info Atrium";
            dictMsg["about atrium msg"]             = dictMsg["version"] + " " + window["pui"]["baseVersion"] + ", " + dictMsg["fixPack"] + " " + window["pui"]["fixPackVersion"] + "<br /><br />"
                                                    + "Copyright &copy 1999-" + new Date().getFullYear() + " Profound Logic Software, Inc.<br /><br />"
                                                    + "Warning: This computer program is protected by copyright law<br />"
                                                    + "and international treaties. Unauthorized reproduction or<br />"
                                                    + "distribution of this program, or any portion of it, may result in<br />"
                                                    + "severe civil and criminal penalties, and will be prosecuted to the<br />"
                                                    + "maximum extent possible under the law.<br /><br />"
                                                    + "Patented. &nbsp;U.S. Patent No. 8,667,405 B2.";
            dictMsg["item"]                         = "Item";
            dictMsg["open selected item"]           = "Open het geselecteerde item";
            dictMsg["of"]                           = "van";
            dictMsg["no results to dsp"]            = "Geen resultaten";
            dictMsg["displaying results"]           = "Toon resultaat";
            dictMsg["search results"]               = "Zoek resultaat";
            dictMsg["new folder"]                   = "Nieuwe folder";
            dictMsg["rename"]                       = "Hernoem";
            dictMsg["description"]                  = "Omschrijving";
            dictMsg["ok"]                           = "OK";
            dictMsg["add"]                          = "Voeg toe";
            dictMsg["add x"]                        = "Voeg &1 toe";
            dictMsg["delete"]                       = "Verwijder";
            dictMsg["screen"]                       = "Scherm";
            dictMsg["screens"]                      = "Schermen";
            dictMsg["macro"]                        = "Macro";
            dictMsg["macros"]                       = "Macros";
            dictMsg["screen id"]                    = "Scherm identificatie";
            dictMsg["screen ids"]                   = "Scherm identificaties";
            dictMsg["field row"]                    = "Veld rij";
            dictMsg["field column"]                 = "Veld kolom";
            dictMsg["field value"]                  = "Veld waarde";
            dictMsg["value"]                        = "Waarde";
            dictMsg["action"]                       = "Actie";
            dictMsg["actions"]                      = "Acties";
            dictMsg["detect once"]                  = "Eenmalige detectie";
            dictMsg["delete screen"]                = "Verwijder scherm";
            dictMsg["genie macros"]                 = "Genie macros";
            dictMsg["screen name"]                  = "Schermnaam";
            dictMsg["identifier"]                   = "Identificatie";
            dictMsg["identifiers"]                  = "Identificaties";
            dictMsg["macro name"]                   = "Naam macro";
            dictMsg["close browser wintab"]         = "Sluit het browser scherm of de tab.";
            dictMsg["select"]                       = "Selecteer";
            dictMsg["write value in field"]         = "Geef het veld een waarde";
            dictMsg["press a key"]                  = "Druk op een toets";
            dictMsg["a literal value"]              = "Een vaste waarde";
            dictMsg["a variable value"]             = "Een variabele waarde";
            dictMsg["cur user profile"]             = "Het huidige gebruikersprofiel";
            dictMsg["result js expr"]               = "Het resultaat van een JavaScript expressie";
            dictMsg["action data"]                  = "Gegevens van de actie";
            dictMsg["data type"]                    = "Data type";
            dictMsg["users"]                        = "Gebruikers";
            dictMsg["all groups"]                   = "Alle groepen";
            dictMsg["supplemental groups"]          = "Aanvullende groepen";
            dictMsg["users w primary grp"]          = "Gebruikers met primaire groep \"&1\"";
            dictMsg["users w suppl grp"]            = "Gebruikers met aanvullende groep \"&1\"";
            dictMsg["group"]                        = "Groep";
            dictMsg["groups"]                       = "Groepen";
            dictMsg["edit"]                         = "Wijzigen";
            dictMsg["edit x"]                       = "Wijzigen &1";
            dictMsg["manager"]                      = "Manager";
            dictMsg["administrator"]                = "Beheerder";
            dictMsg["primary group"]                = "Primaire groep";
            dictMsg["delete x"]                     = "Verwijder &1";
            dictMsg["reassign x"]                   = "Wijs &1 opnieuw toe";
            dictMsg["navigation item"]              = "Navigatie item";
            dictMsg["navigation items"]             = "Navigatie items";
            dictMsg["navigation panel"]             = "Navigatie panel";
            dictMsg["home pages"]                   = "Home pagina's";
            dictMsg["menu group"]                   = "Menu groep";
            dictMsg["menu item"]                    = "Menu item";
            dictMsg["toolbar items"]                = "Eenheden werkbalk";
            dictMsg["toolbar"]                      = "Werkbalk";
            dictMsg["button"]                       = "Knop";
            dictMsg["pulldown menu"]                = "Afrolmenu";
            dictMsg["pulldown menu item"]           = "item afrolmenu";
            dictMsg["separator bar"]                = "Scheidingsteken";
            dictMsg["spacer"]                       = "Spatie";
            dictMsg["item details"]                 = "Detail item";
            dictMsg["item number"]                  = "Item nummer";
            dictMsg["item type"]                    = "Item type";
            dictMsg["genie macro"]                  = "Genie macro";
            dictMsg["rdf application"]              = "Rich Display File toepassing";
            dictMsg["web application"]              = "Web toepassing";
            dictMsg["pc command"]                   = "PC commando";
            dictMsg["dspf program library"]         = "Display file programma bibliotheek";
            dictMsg["dspf program"]                 = "Display file programma";
            dictMsg["variable name x"]              = "Naam variabele &1";
            dictMsg["a tab in the portal"]          = "Een tab in de portal";
            dictMsg["a new browser wind"]           = "Een nieuwe browser window of tab";
            dictMsg["update"]                       = "Bijwerken";
            dictMsg["fill"]                         = "Vullen";
            dictMsg["permissions"]                  = "Permissies";
            dictMsg["user/group name"]              = "Gebruiker-/groepsnaam";
            dictMsg["all users groups"]             = "Alle gebruikers en groepen";
            dictMsg["type"]                         = "Type";
            dictMsg["access"]                       = "Toegang";
            dictMsg["allow"]                        = "Toestaan";
            dictMsg["disallow"]                     = "Weigeren";
            dictMsg["navigation"]                   = "Navigatie";
            dictMsg["add usrgrp perm"]              = "Toevoegen gebruikers-/groepsmachtigingen";
            dictMsg["membership"]                   = "Lid van";
            dictMsg["none"]                         = "Geen";
            dictMsg["remove"]                       = "Verwijder";
            dictMsg["appearance"]                   = "Vorm";
            dictMsg["home page"]                    = "Home pagina";
            dictMsg["tree"]                         = "Tree";
            dictMsg["accordion"]                    = "Accordeon";
            dictMsg["min search chars"]             = "Minimum aantal zoek lettertekens";
            dictMsg["libl for rdf apps"]            = "Lijst van bibliotheken voor de Rich Display File toepassingen";
            dictMsg["library list"]                 = "Lijst van bibliotheken";
            dictMsg["library"]                      = "Bibliotheek";
            dictMsg["use atrium def libl"]          = "Gebruik de standaard Atrium lijst van bibliotheken";
            dictMsg["use jobd libl"]                = "Gebruik de lijst van bibliotheken van de JOBD";
            dictMsg["specify libl"]                 = "Geef de lijst van bibliotheken op";
            dictMsg["up"]                           = "Op";
            dictMsg["down"]                         = "Neer";
            dictMsg["move up"]                      = "Omhoog";
            dictMsg["move down"]                    = "Naar beneden";
            dictMsg["global settings"]              = "Globale instellingen";
            dictMsg["save"]                         = "Stel veilig";
            dictMsg["add usr to supp grp"]          = "Voeg gebruiker toe aan aanvullende groep";
            // Atrium.help tool-tip titles and texts. (Some are used for other fields than just tool-tips.)
            dictMsg["member of"]                    = "Lid van";
            dictMsg["member of hlp"]                = "De groep waarvan deze gebruiker/groep lid is.";
            dictMsg["group name"]                   = "Groepsnaam";
            dictMsg["group name hlp"]               = "De schermnaam voor deze groep.";
            dictMsg["inherit settings"]             = "Neem instellingen over";
            dictMsg["inherit settings hlp"]         = "Als deze optie wordt aangevinkt, neemt de gebruiker/groep de instellingen over van de bovenliggende gebruiker. Indien niet aangevinkt heeft de gebruiker/groep zijn eigen instellingen.";
            dictMsg["user name"]                    = "Naam gebruiker";
            dictMsg["user name hlp"]                = "De schermnaam van dit gebruikersprofiel.";
            dictMsg["access role"]                  = "Toegangs bevoegdheden";
            dictMsg["access role hlp"]              = "Beheert de toegang van deze gebruiker. Administrators kunnen alle groepen en gebruikers beheren en daarnaast ook de bevoegdheden binnen de toepassing. Managers kunnen de gebruikers- en groepssettings binnen hun eigen groep aanpassen. Eindgebruikers hebben geen speciale bevoegdheden.";
            dictMsg["can edit profile"]             = "Kan profiel bijwerken";
            dictMsg["can edit profile hlp"]         = "Geeft de gebruiker het recht om de \"appearance\" en \"navigation\" instellingen aan te passen, en ook het wachtwoord. De overige instellingen kunnen nooit door een gebruiker worden gewijzigd.";
            dictMsg["user profile"]                 = "Gebruikersprofiel";
            dictMsg["user profile hlp"]             = "De naam van het gebruikersprofiel. Namen van gebruikersprofielen zijn hoofdlettergevoelig, tenzij de IBM i profielen worden gebruikt.";
            dictMsg["password hlp"]                 = "Set/reset het wachtwoord. Wachtwoorden zijn hoofdlettergevoelig.";
            dictMsg["conf password"]                = "Bevestig wachtwoord";
            dictMsg["conf password hlp"]            = "Bij set/reset van het wachtwoord moet de waarde van dit veld exact overeenkomen met het nieuwe wachtwoord. Wachtwoorden zijn hoofdlettergevoelig.";
            // Atrium.help tool-tip - User/group Appearance preferences.
            dictMsg["browser title"]                = "Titel van de browser";
            dictMsg["browser title hlp"]            = "Instellen van de tekst die wordt getoond in de titelbar van de browser.";
            dictMsg["show banner"]                  = "Toon banner";
            dictMsg["show banner hlp"]              = "Haal het vinkje weg bij deze optie als u de banner aan de bovenkant van de portal wilt verbergen.";
            dictMsg["banner height"]                = "Banner hoogte";
            dictMsg["banner height hlp"]            = "Stelt de hoogte in pixels in van de banner aan de bovenkant van de portal. Deze instelling wordt overgeslagen als de banner niet wordt getoond. Geldige waarden: 0-600 pixels.";
            dictMsg["banner url"]                   = "URL van de banner";
            dictMsg["banner url hlp"]               = "Stelt de URL in waar de banneropmaak is opgeslagen. URL kan absoluut of gekwalificeerd worden opgegeven.";
            dictMsg["theme"]                        = "Thema";
            dictMsg["theme hlp"]                    = "Stelt het standaard thema in. Dit kan worden gewijzigd door individuele gebruikers als <strong>\"Sta gebruikers toe om een thema te selecteren\"</strong> actief is.";
            dictMsg["allow sel theme"]              = "Sta gebruikers toe om een thema te selecteren";
            dictMsg["allow sel theme hlp"]          = "Als dit is aangevinkt, is het voor gebruikers mogelijk een eigen thema te selecteren met behulp van de control in de toolbar.";
            dictMsg["show menu search"]             = "Toon zoekmenu";
            dictMsg["show menu search hlp"]         = "Haal vinkje weg om de menu zoekfaciliteit uit te schakelen.";
            dictMsg["show fav sys"]                 = "Toon de Favorieten";
            dictMsg["show fav sys hlp"]             = "Haal vinkje weg om de Favorieten uit te schakelen.";
            dictMsg["show fav start"]               = "Toon tab Favorieten bij het opstarten";
            dictMsg["show fav start hlp"]           = "Indien aangevinkt, wordt de tab Favorieten weergegeven bij het opstarten. Anders wordt (standaard) de tab Navigatie getoond. Deze optie is alleen beschikbaar als Favorieten tonen is ingeschakeld.";
            dictMsg["limit num sessn"]              = "Beperk het aantal sessies";
            dictMsg["limit num sessn hlp"]          = "Het aantal toegestane Atrium sessies voor deze gebruiker/groep. De waarde nul staat voor een onbeperkt aantal sessies. De beperking geldt per web browser.";
            // Atrium.help tool-tip - User/Group navigation preferences.
            dictMsg["show hmpg start"]              = "Toon home pagina na start";
            dictMsg["show hmpg start hlp"]          = "Indien aangevinkt wordt er bij het starten van de portal een eigen home page getoond.";
            dictMsg["home page url"]                = "URL home pagina";
            dictMsg["home page url hlp"]            = "Stelt de URL in met de locatie van de home page. URL kan absoluut of gekwalificeerd worden opgegeven.";
            dictMsg["navi pnl title"]               = "Title van het navigatie panel";
            dictMsg["navi pnl title hlp"]           = "Deze tekst wordt getoond in de titel bar van het navigatie panel.";
            dictMsg["navi pnl width"]               = "Breedte van navigatie panel na het opstarten";
            dictMsg["navi pnl width hlp"]           = "Stelt de breedte in pixels in van het navigatie panel na het opstarten. De gebruiker kan de grootte van het panel aanpassen of het panel, indien nodig, verbergen. Geldige waarden: 0-2000 pixels.";
            dictMsg["navi type"]                    = "Type navigatie";
            dictMsg["navi type hlp"]                = "Stelt binnen de navigatie het type menu in, \"tree\" of \"accordion\". Deze instelling is niet van invloed op de toolbar.";
            dictMsg["single click nav"]             = "Enkele muisklik navigatie";
            dictMsg["single click nav hlp"]         = "Als deze optie is aangevinkt wordt een menu optie opgestart met een enkele muisklik. Anders wordt een menu optie opgestart met een dubbele klik. Deze instelling is niet van invloed op de toolbar.";
            // Atrium.help tool-tip - Library list.
            dictMsg["current library"]              = "Huidige bibliotheek";
            dictMsg["current library hlp"]          = "Geef de huidige bibliotheek op, *USRPRF, or *CRTDFT.";
            dictMsg["job descr"]                    = "Taak beschrijving";
            dictMsg["job descr hlp"]                = "Geef een job description op voor de lijst met bibliotheken. *USRPRF kan worden opgegeven als de Atrium gebruikers gelijk zijn aan de IBM i gebruikers profielen.";
            dictMsg["job descr lib"]                = "Job description bibliotheek";
            dictMsg["job descr lib hlp"]            = "Geef de bibliotheek op met de job description. Hier kan *LIBL of *CURLIB worden opgegeven.";
            // Atrium.help tool-tip - Navigation / Toolbar items.
            dictMsg["item name"]                    = "Naam item";
            dictMsg["item name hlp"]                = "Stelt de naam in van het display voor het navigatie of toolbar item.";
            dictMsg["action type"]                  = "Actie type";
            dictMsg["action type hlp"]              = "Stelt het type toepassing in dat door dit item wordt gestart.";
            dictMsg["url"]                          = "URL";
            dictMsg["url hlp"]                      = "Stelt de URL in van de Web toepassing. De URL kan worden opgegeven als een absoluut pad of als een volledig gekwalificeerde URL. In de URL kunnen Query string parameters worden meegegeven.";
            dictMsg["genie url"]                    = "Genie URL";
            dictMsg["genie url hlp"]                = "Stelt de URL in die wordt gebruikt om Genie te starten. Als hier niets wordt ingevuld wordt de standaard Genie URL /profoundui/auth/genie gebruikt. Dit veld is handig als er een andere Genie URL nodig is of als er met query string parameters wordt  gewerkt. Bijvoorbeeld: /profoundui/auth/genie?skin=MyCompany";
            dictMsg["open as"]                      = "Openen als";
            dictMsg["open as hlp"]                  = "Keuze of de toepassing onder een nieuwe tab in de portal wordt gestart, of in een afzonderlijke browser window of een tab. Of de browser een nieuwe window gebruikt of een tab is afhankelijk van de gebruikersinstelling in de browser.";
            dictMsg["opens once only"]              = "Open eenmalig";
            dictMsg["opens once only hlp"]          = "Standaard wordt er een nieuwe tab geopend met het opstarten van een item. Als er al een tab is geopend in de portal wordt er een nieuwe toegevoegd. Er is geen limiet aan het aantal tabs dat op deze manier kan worden geopend. Als deze optie wordt aangevinkt kan de gebruiker niet meer dan 1 tab per item openen. Als er al een tab is geopend voor dit item zal deze na de selectie worden gebruikt. Deze optie is niet actief als er is gekozen voor het openen van het item in een afzonderlijk browser window of tab.";
            dictMsg["icon"]                         = "Icoon";
            dictMsg["icon hlp"]                     = "Optioneel. Geef de naam op van een icon file voor gebruik door het navigatie of toolbar item. Geldige icon file formaten zijn GIF, JPG, or PNG. Het wordt aanbevolen om transparente GIFs te gebruiken. Gebruik het absolute pad van de root van de Atrium installatie. Als er geen icon is opgegeven gebruikt Atrium een default icon voor de navigatie. Mits hier opgegeven, worden er geen icons voor de toolbar items getoond.";
            dictMsg["parameter"]                    = "Parameter";
            dictMsg["parameter hlp"]                = "Optioneel: Geef een parameter mee die bij het starten aan het Rich Display programma wordt doorgegeven.";

            break;

        default:
            console.log("Unknown Dictionary Type : '" + dict + "'");
    }

    return dictMsg;
};