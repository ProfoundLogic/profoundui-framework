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
//  Italiano
// -------------------------------------------------------------
var it_IT = function(dict) {

    var dictMsg = {};

    switch (dict) {

        case "runtimeMsg":
            dictMsg["closeMessage"]                 = "Questo terminerà la sessione.";
            dictMsg["no connection message"]        = "Impossibile raggiungere il server. Controllare la connessione e riprovare.";
            dictMsg["upload file limit"]            = "Limite di &1 file superato.";
            dictMsg["upload size limit"]            = "Limite di &1MB per file superato.";
            dictMsg["upload no files"]              = "Nessun file selezionato.";
            dictMsg["upload duplicate file"]        = "Sono stati selezionati file duplicati.";
            dictMsg["upload file exists"]           = "Uno o più file sono già presenti nel file system.";
            dictMsg["upload prevented"]             = "Operazione impedita da exit program.";
            dictMsg["upload input limit"]           = "Superato limite della dimensione totale input.";
            dictMsg["upload no session"]            = "Non collegato ad una sessione valida.";
            dictMsg["upload timeout"]               = "Scaduto il tempo per la transazione.";
            dictMsg["upload invalid response"]      = "La risposta del server è mancante o non è valida."; //Also used in Atrium for Ajax error.
            dictMsg["upload cancelled"]             = "Caricamento cancellato.";
            dictMsg["close browser text"]           = "Per completare la chiusura della sessione, chiudere la finestra del browser.";
            dictMsg["session ended text"]           = "La sessione si è conclusa.";
            dictMsg["outside ucs2"]                 = "Caratteri fuori dall'ambito UCS-2.";
            dictMsg["invalid number"]               = "&1 non è un numero valido.";  
            dictMsg["invalid length"]               = '&1 ha lunghezza dati o posizione decimale errata.';
            dictMsg["invalid decimal"]              = '&1 ha troppe cifre decimali. (max: &2)';
            dictMsg["invalid choice"]               = '"&1" non è valido. Scelte valide sono: "&2" o "&3".';
            dictMsg["invalid date"]                 = '"&1" non è una data valida. Esempio di formato corretto: &2';
            dictMsg["invalid time"]                 = '"&1" non è un valore di tempo corretto. Esempio di formato corretto: &2';
            dictMsg["invalid time stamp"]           = "\"&1\" non è un riferimento di tempo valido.  Esempio di formato corretto: &2";
            dictMsg["invalid percent"]              = '&1 non è un decimale valido.';
            dictMsg["invalid digits"]               = '"&1" contiene troppe cifre. Max: &2';
            dictMsg["exceeds whole"]                = '"&1" supera il numero massimo di cifre per la parte intera del numero (&2 digits).';
            dictMsg["exceeds decimal"]              = '"&1" supera il numero massimo di cifre per la parte decimale (&2 digits).';
            dictMsg["zip too long"]                 = 'CAP è troppo lungo. (Massimo: &1 cifre)';
            dictMsg["phone too long"]               = 'Numero di telefono è troppo lungo. (Massimo: &1 cifre)';
            dictMsg["ssno too long"]                = 'Codice fiscale è troppo lungo. (Massimo: &1 cifre)';
            dictMsg["invalid custom val"]           = "Non valida funzione di validazione personalizzata.";
            dictMsg["error custom val"]             = 'Errore nella funzione di convalida personalizzata.';
            dictMsg["ME"]                           = "Campo con obbligo di riempimento. È necessario immettere dati.";
            dictMsg["MF"]                           = "Campo con obbligo di riempimento. È necessario riempire completamente la casella dati.";
            dictMsg["required"]                     = "Il valore non può essere vuoto. Questo campo è obbligatorio.";
            dictMsg["file required"]                = "È necessario selezionare almeno un file.";
            dictMsg["signature overflow"]           = "La dimensione del testo firma supera il numero massimo di byte disponibili per memorizzare la firma. Si prega di cancellare la pad per la firma elettronica e provare di nuovo.";
            dictMsg["validValues"]                  = "Valore inserito non è valido. I valori validi sono: ";
            dictMsg["upload invalid type"]          = "Uno o più file sono di tipo non valido.";
            dictMsg["invalid email"]                = "mail non valido.";
            dictMsg["session timed out"]            = "La tua sessione é scaduta.";
            dictMsg["invalid low range"]            = "Il valore deve essere maggiore o uguale a &1";
            dictMsg["invalid high range"]           = "Il valore deve essere minore o uguale a &1";
            dictMsg["invalid range"]                = "Intervallo valido da &1 a &2";
            dictMsg["unmonitored exception"]        = "Il programma ha raggiunto un'eccezione non gestita. Per assistenza, si prega di contattare l'amministratore di sistema.";
            dictMsg["loading x"]                    = "Caricamento di &1 in corso...";
            dictMsg["data src not specfd x"]        = "Risorsa non specificata per &1...";
            dictMsg["name fld not specfd x"]        = "Campo Nome non specificato per &1...";
            dictMsg["val fld not specfd x"]         = "Campo valore non specificato per &1...";
            dictMsg["failed to load x"]             = "Caricamento di &1 non riuscito.";
            dictMsg["cannot rmv last col"]          = "L'ultima colonna non può essere rimossa.";
            dictMsg["cannot find col"]              = "Id della colonna non trovato.";
            dictMsg["subfile deletion"]             = "Sei sicuro di che voler eliminare il subfile?";
            dictMsg["downloading x"]                = "Download di &1 in corso";
            dictMsg["ie9 too low xlsxpics"]         = "Le immagini non possono essere esportate con IE9 o versioni precedenti.";
			dictMsg["keyboard input inhibited"]     = "La voce della tastiera non è consentita in questo campo.";
			
            // Atrium only.
            dictMsg["num sessions exceeded"]        = "È stato superato il numero di sessioni consentite.";
            dictMsg["unable to load portal"]        = "Impossibile caricare le impostazioni del portale o gli elementi della navigazione.";
            dictMsg["unable to load macr act"]      = "Impossibile caricare le azioni della macro.";
            dictMsg["unable to load macr var"]      = "Impossibile caricare le variabili della macro.";
            dictMsg["unable to load scrn lst"]      = "Impossibile caricare la lista delle schermate.";
            dictMsg["unable to load new sett"]      = "Impossibile caricare le nuove impostazioni.";
            dictMsg["unable to load x"]             = "Impossibile caricare &1.";
            dictMsg["unable to add x"]              = "Impossibile aggiungere &1.";
            dictMsg["unable to rename x"]           = "Impossibile rinominare &1.";
            dictMsg["unable to delete x"]           = "Impossibile cancellare &1.";
            dictMsg["unable to update x"]           = "Impossibile aggiornare &1.";
            dictMsg["unable to reassn x"]           = "Impossibile riassegnare &1.";
            dictMsg["unable to reorder items"]      = "Impossibile riordinare gli elementi.";
            dictMsg["unable to save theme"]         = "Impossibile salvare le impostazioni del tema.";
            dictMsg["unable eval script url"]       = "Impossibile risolvere l'URL della web app.";
            dictMsg["close browser text AT"]        = "I cambiamenti non salvati della sessione (o sessioni) andranno persi.";
            dictMsg["close all tabs"]               = "Chiudere tutte le schede?";
            dictMsg["close tab"]                    = "Chiudere la scheda?";
            dictMsg["invalid script url"]           = "Valore URL della web app non valido.";
            dictMsg["unrecognized format"]          = "Formato non riconosciuto.";
            dictMsg["screen already defined"]       = "La schermata \"&1\" è già definita.";
            dictMsg["macro already defined"]        = "La macro \"&1\" è già definita.";
            dictMsg["no screen ids"]                = "Non ci sono identificatori della schermata da mostrare";
            dictMsg["confirm delete"]               = "Conferma cancellazione";
            dictMsg["no actions"]                   = "Non ci sono azioni da mostrare.";
            dictMsg["msg action input var"]         = "Inserire il valore della variabile \"&1\" nel campo alla riga &2 e colonna &3.";
            dictMsg["msg action input user"]        = "Inserire il profilo utente attuale nel campo alla riga &1 e colonna &2.";
            dictMsg["msg action input js"]          = "Inserire il risultato dell'espressione JavaScript <strong>&1</strong> nel campo alla riga &2 e colonna &3.";
            dictMsg["msg action input other"]       = "Inserire il valore \"&1\" nel campo alla riga &2 e colonna &3.";
            dictMsg["msg presskey var"]             = "Premere il tasto definito nella variabile \"&1\".";
            dictMsg["msg presskey other"]           = "Premere il tasto \"&1\".";
            dictMsg["msg del scrn from macro"]      = "Sei sicuro di voler eliminare le schermate selezionate da questa macro?<br /> Anche tutte le azioni associate saranno eliminate.";
            dictMsg["choose scrn macro"]            = "Seleziona una schermata o una macro per lavorare con le sue proprietà.";
            dictMsg["choose a nav or toolbar"]      = "Seleziona un elemento di navigazione o della barra degli strumenti per lavorare con le sue proprietà.";
            dictMsg["confirm del sel x"]            = "Sei sicuro di voler cancellare &1?";
            dictMsg["permission settings"]          = "l'Impostazione/le Impostazioni di Autorizzazione";
            dictMsg["adding x"]                     = "Aggiunta di &1 in corso...";
            dictMsg["deleting x"]                   = "Eliminazione di &1 in corso...";
            dictMsg["reassigning x"]                = "Riassegnamento di &1 in corso...";
            dictMsg["loading"]                      = "Caricamento in corso...";
            dictMsg["saving"]                       = "Salvataggio in corso...";
            dictMsg["x added"]                      = "&1 aggiunto.";
            dictMsg["x deleted"]                    = "&1 eliminato.";
            dictMsg["x reassigned"]                 = "&1 riassegnato.";
            dictMsg["x updated"]                    = "&1 aggiornato.";
            dictMsg["x saved"]                      = "&1 salvato.";
            dictMsg["msg del group"]                = "Sei sicuro di voler eliminare il gruppo \"&1\"?<br /><br />Cancellando un gruppo verranno eliminati anche tutti i suoi sottogruppi e gli utenti associati.<br /><br />Sei sicuro di voler continuare?";
            dictMsg["conf reassign users 1"]        = "Sei sicuro di voler riassegnare ";
            dictMsg["conf reassign users 2a"]       = "l'utente \"&1\" ";
            dictMsg["conf reassign users 2b"]       = "gli utenti selezionati ";
            dictMsg["conf reassign users 3"]        = " al gruppo \"&1\"?";
            dictMsg["conf reassign group"]          = "Sei sicuro di voler riassegnare il gruppo \"&1\" al grupo \"&2\"?";
            dictMsg["conf delete users 1"]          = "Sei sicuro di voler eliminare ";
            dictMsg["conf delete users 2a"]         = "l'utente \"&1\"?";
            dictMsg["conf delete users 2b"]         = "gli utenti selezionati?";
            dictMsg["no users"]                     = "Non ci sono utenti da mostrare.";
            dictMsg["cannot delete own grp"]        = "Non puoi cancellare il tuo gruppo.";
            dictMsg["cannot delete own usr"]        = "Non puoi cancellare il tuo profilo utente.";
            dictMsg["not auth reassign prf"]        = "Non sei autorizzato a riassegnare il tuo profilo.";
            dictMsg["typeselect macro name"]        = "Digita o seleziona il nome della macro...";
            dictMsg["any child items will"]         = "Anche eventuali elementi figli verranno eliminati.";
            dictMsg["password must be"]             = "La passwords deve essere lunga almeno 6 caratteri.";
            dictMsg["type or sel home page"]        = "Digita o seleziona home page...";
            dictMsg["x is already in list"]         = "\"&1\" è già nella lista.";
            dictMsg["x is not valid libname"]       = "\"&1\" non è un nome libreria valido.";
            dictMsg["no libraries in list"]         = "Nella lista non è presente nessuna libreria";
            dictMsg["add libl entry"]               = "Aggiungi voce alla lista librerie";
            dictMsg["would you like add ano"]       = "Vuoi aggiungerne un'altra?";
            dictMsg["already in suppl grp x"]       = "L'utente è già nel gruppo supplementare \"&1\".";
            dictMsg["cannot move screen"]           = "Impossibile spostare il Macro Screen";
            dictMsg["ready to add"]                 = "(La schermata è pronta per l’aggiunta di azioni)";
            dictMsg["duplicate actions"]            = "Sono presenti azioni duplicate per questa riga/colonna; potrebbero verificarsi risultati imprevisti. Si prega di rivedere le azioni e cancellare i duplicati.";

            break;

        case "runtimeText":
            dictMsg["upload select text"]           = "Seleziona File";
            dictMsg["upload clear text"]            = "Cancella";
            dictMsg["upload remove text"]           = "Rimuovi";
            dictMsg["upload upload text"]           = "Carica";
            dictMsg["upload drophere text"]         = "Rilascia qui i file";
            dictMsg["upload browser unsupported"]   = "La funzione drag&drop richiede Internet Explorer 10 o più recente, Chrome, o Firefox";
            dictMsg["upload finished text"]         = "Upload completato";
            dictMsg["excel export text"]            = "Esporta in Excel";    //Replaces "csv export text".
            dictMsg["export to x"]                  = "Esporta in &1";
            dictMsg["filter text"]                  = "Filtra";
            dictMsg["find text"]                    = "Cerca";
            dictMsg["reset data"]                   = "Ripristina i dati";
            dictMsg["remove filters text"]          = "Rimuovi tutti i filtri";
            dictMsg["displayed columns"]            = "Colonne Visualizzate";
            dictMsg["next link text"]               = "Successivo";
            dictMsg["previous link text"]           = "Precedente";
            dictMsg["sort ascending text"]          = "Ordinare in Senso Ascendente";
            dictMsg["sort descending text"]         = "Ordinare in Senso Discendente";
			dictMsg["sort..."]                      = "Ordina...";
            dictMsg["sort"]                         = "Ordina";
            dictMsg["sort multiple"]                = "Ordina Colonne Multiple";
            dictMsg["column"]                       = "Colonna";
            dictMsg["direction"]                    = "Direzione";
            dictMsg["order"]                        = "Priorità"; 
            dictMsg["row"]                          = "riga";
            dictMsg["rows"]                         = "righe";
            dictMsg["page"]                         = "Pagina";
            dictMsg["collapseAll"]                  = "Comprimi tutto";
            dictMsg["expandAll"]                    = "Espandi tutto";
            dictMsg["user"]                         = "Utente";
            dictMsg["password"]                     = "Password";
            dictMsg["sign on"]                      = "Accesso";
            dictMsg["pui"]                          = "Profound UI";
            dictMsg["pui sign on"]                  = dictMsg["sign on"] + " " + dictMsg["pui"];
            dictMsg["pjs"]                          = "Profound.js";
            dictMsg["pjs sign on"]                  = dictMsg["sign on"] + " " + dictMsg["pjs"];
            dictMsg["message id"]                   = "Id Messaggio";
            dictMsg["ctlr job"]                     = "Job di controllo";
            dictMsg["app job"]                      = "Application job";
            dictMsg["joblog download"]              = "Scarica job log";
            dictMsg["curr user"]                    = "Utente corrente";
            dictMsg["remote ip"]                    = "Indirizzo IP remoto";
            dictMsg["remote port"]                  = "Porta remota";
            dictMsg["severity"]                     = "Gravità";
            dictMsg["date"]                         = "Data";
            dictMsg["time"]                         = "Ora";
            dictMsg["program"]                      = "Programma";
            dictMsg["procedure"]                    = "Procedura";
            dictMsg["lines"]                        = "Linea(e)";
            dictMsg["message"]                      = "Messaggio";
            dictMsg["new session"]                  = "Nuova Sessione";
            dictMsg["close"]                        = "Chiudi";
            dictMsg["current password"]             = "Password Attuale";
            dictMsg["new password"]                 = "Nuova Password";
            dictMsg["repeat new password"]          = "Ripeti Nuova Password";
            dictMsg["submit"]                       = "Invia";
            dictMsg["exit"]                         = "Esci";
            dictMsg["warning"]                      = "Attenzione";
            dictMsg["change password"]              = "Cambia Password";
            dictMsg["cancel"]                       = "Cancella";
            dictMsg["find text"]                    = "Trovare";
            dictMsg["remove filter"]                = "Rimuovi Filtro";
            dictMsg["chart"]                        = "Grafico";
            dictMsg["section"]                      = "Sezione";
            dictMsg["version"]                      = "Versione";
            dictMsg["fixPack"]                      = "Fix Pack";
            // Atrium only.
            dictMsg["yes"]                          = "Sì";
            dictMsg["no"]                           = "No";
            dictMsg["settings"]                     = "Impostazioni";
            dictMsg["favorites"]                    = "Preferiti";
            dictMsg["type query press en"]          = "Digita la query, premi Invio.";
            dictMsg["add to favorites"]             = "Aggiungi ai Preferiti";
            dictMsg["rmv from favorites"]           = "Rimuovi dai Preferiti";
            dictMsg["please wait"]                  = "Attendere...";
            dictMsg["control panel"]                = "Pannello di controllo";
            dictMsg["my settings"]                  = "Le mie impostazioni";
            dictMsg["about atrium"]                 = "Informazioni su Atrium";
            dictMsg["about atrium msg"]             = dictMsg["version"] + " " + window["pui"]["baseVersion"] + ", " + dictMsg["fixPack"] + " " + window["pui"]["fixPackVersion"] + "<br /><br />"
                                                    + "Copyright &copy 1999-" + new Date().getFullYear() + " Profound Logic Software, Inc.<br /><br />"
                                                    + "Attenzione: questo programma è protetto dalla legge sul copyright<br />"
                                                    + "e nda trattati internazionali. La riproduzione o distribuzione non<br />"
                                                    + "autorizzata di questo programma, o parte di esso, può comportare<br />"
                                                    + "gravi sanzioni civili e penali e sarà perseguita nella misura massima<br />"
                                                    + "consentita dalla legge.<br /><br />"
                                                    + "Brevettato. &nbsp; Brevetto U.S. No. 8,667,405 B2.";
            dictMsg["item"]                         = "l'Elemento";
            dictMsg["open selected item"]           = "Apri l'elemento selezionato";
            dictMsg["of"]                           = "di";
            dictMsg["no results to dsp"]            = "Nessun risultato da mostrare.";
            dictMsg["displaying results"]           = "Risultati";
            dictMsg["search results"]               = "Risultati della ricerca";
            dictMsg["new folder"]                   = "Nuova cartella";
            dictMsg["rename"]                       = "Rinomina";
            dictMsg["description"]                  = "Descrizione";
            dictMsg["ok"]                           = "OK";
            dictMsg["add"]                          = "Aggiungi";
            dictMsg["add x"]                        = "Aggiungi &1";
            dictMsg["delete"]                       = "Elimina";
            dictMsg["screen"]                       = "la Schermata";
            dictMsg["screens"]                      = "le Schermate";
            dictMsg["macro"]                        = "la Macro";
            dictMsg["macros"]                       = "le Macro";
            dictMsg["screen id"]                    = "l'Identificatore della schermata";
            dictMsg["screen ids"]                   = "gli Identificatori della schermata";
            dictMsg["field row"]                    = "Riga del campo";
            dictMsg["field column"]                 = "Colonna del campo";
            dictMsg["field value"]                  = "Valore del campo";
            dictMsg["value"]                        = "Valore";
            dictMsg["action"]                       = "Action";
            dictMsg["actions"]                      = "Action";
            dictMsg["detect once"]                  = "Individua una sola volta";
            dictMsg["delete screen"]                = "Elimina schermata";
            dictMsg["genie macros"]                 = "Macro di Genie";
            dictMsg["screen name"]                  = "Nome della schermata";
            dictMsg["identifier"]                   = "l'Identificatore";
            dictMsg["identifiers"]                  = "gli Identificatori";
            dictMsg["macro name"]                   = "Nome della macro";
            dictMsg["close browser wintab"]         = "Chiudi la finestra o la scheda del browser.";
            dictMsg["select"]                       = "Seleziona";
            dictMsg["write value in field"]         = "Scrivi un valore in un campo";
            dictMsg["press a key"]                  = "Premi un tasto";
            dictMsg["a literal value"]              = "Un valore letterale";
            dictMsg["a variable value"]             = "Il valore di una variabile";
            dictMsg["cur user profile"]             = "Il profilo utente attuale";
            dictMsg["result js expr"]               = "Il risultato dell'espressione JavaScript";
            dictMsg["action data"]                  = "Action data";
            dictMsg["data type"]                    = "Tipo di dato";
            dictMsg["users"]                        = "Utenti";
            dictMsg["all groups"]                   = "Tutti i gruppi";
            dictMsg["supplemental groups"]          = "Gruppi supplementari";
            dictMsg["users w primary grp"]          = "Utenti il cui gruppo primario è \"&1\"";
            dictMsg["users w suppl grp"]            = "Utenti con gruppo supplementare \"&1\"";
            dictMsg["group"]                        = "Gruppo";
            dictMsg["groups"]                       = "Gruppi";
            dictMsg["edit"]                         = "Modifica";
            dictMsg["edit x"]                       = "Modifica &1";
            dictMsg["manager"]                      = "Manager";
            dictMsg["administrator"]                = "Amministratore";
            dictMsg["primary group"]                = "Gruppo primario";
            dictMsg["delete x"]                     = "Elimina &1";
            dictMsg["reassign x"]                   = "Riassegna &1";
            dictMsg["navigation item"]              = "Elemento di Navigazione";
            dictMsg["navigation items"]             = "Elementi di Navigazione";
            dictMsg["navigation panel"]             = "Pannello di Navigazione";
            dictMsg["home pages"]                   = "Home Page";
            dictMsg["menu group"]                   = "Gruppo del menu";
            dictMsg["menu item"]                    = "Elemento del menu";
            dictMsg["toolbar items"]                = "Elementi della barra degli strumenti";
            dictMsg["toolbar"]                      = "Barra degli strumenti";
            dictMsg["button"]                       = "Bottone";
            dictMsg["pulldown menu"]                = "Menu a tendina";
            dictMsg["pulldown menu item"]           = "Elemento del menu a tendina";
            dictMsg["separator bar"]                = "Barra di separazione";
            dictMsg["spacer"]                       = "Spaziatore";
            dictMsg["item details"]                 = "Dettagli dell'elemento";
            dictMsg["item number"]                  = "Numero dell'elemento";
            dictMsg["item type"]                    = "Tipo dell'elemento";
            dictMsg["genie macro"]                  = "Macro di Genie";
            dictMsg["rdf application"]              = "Rich Display File Application";
            dictMsg["web application"]              = "Web Application";
            dictMsg["pc command"]                   = "PC Command";
            dictMsg["dspf program library"]         = "Libreria del programma del display file";
            dictMsg["dspf program"]                 = "Programma del display file";
            dictMsg["variable name x"]              = "Nome della variabile &1";
            dictMsg["a tab in the portal"]          = "Una scheda nel portale";
            dictMsg["a new browser wind"]           = "Una nuova finestra o scheda nel browser";
            dictMsg["update"]                       = "Aggiorna";
            dictMsg["fill"]                         = "Riempi";
            dictMsg["permissions"]                  = "Permessi";
            dictMsg["user/group name"]              = "Nome Utente/Gruppo";
            dictMsg["all users groups"]             = "Tutti gli utenti e i gruppi";
            dictMsg["type"]                         = "Tipo";
            dictMsg["access"]                       = "Accesso";
            dictMsg["allow"]                        = "Permetti";
            dictMsg["disallow"]                     = "Non permettere";
            dictMsg["navigation"]                   = "Navigazione";
            dictMsg["add usrgrp perm"]              = "Aggiungi permessi a utente/gruppo";
            dictMsg["membership"]                   = "di appartenenza";
            dictMsg["none"]                         = "Nessuno";
            dictMsg["remove"]                       = "Rimuovi";
            dictMsg["appearance"]                   = "Aspetto";
            dictMsg["home page"]                    = "Home page";
            dictMsg["tree"]                         = "Albero";
            dictMsg["accordion"]                    = "Accordion";
            dictMsg["min search chars"]             = "Numero minimo di caratteri per la ricerca";
            dictMsg["libl for rdf apps"]            = "Lista librerie per le applicazioni Rich Display File";
            dictMsg["library list"]                 = "Lista librerie";
            dictMsg["library"]                      = "Libreria";
            dictMsg["use atrium def libl"]          = "Usa la lista librerie predefinita di Atrium";
            dictMsg["use jobd libl"]                = "Usa la lista librerie dal JOBD";
            dictMsg["specify libl"]                 = "Specifica lista librerie";
            dictMsg["up"]                           = "Su";
            dictMsg["down"]                         = "Giù";
            dictMsg["move up"]                      = "Muovi su";
            dictMsg["move down"]                    = "Muovi giù";
            dictMsg["global settings"]              = "Impostazioni globali";
            dictMsg["save"]                         = "Salva";
            dictMsg["add usr to supp grp"]          = "Aggiungi utente al gruppo supplementale";
            // Atrium.help tool-tip titles and texts. (Some are used for other fields than just tool-tips.)
            dictMsg["member of"]                    = "Membro di";
            dictMsg["member of hlp"]                = "Il gruppo a cui questo utente/gruppo appartiene.";
            dictMsg["group name"]                   = "Nome del gruppo";
            dictMsg["group name hlp"]               = "Il nome visualizzato per questo gruppo.";
            dictMsg["inherit settings"]             = "Eredita impostazioni";
            dictMsg["inherit settings hlp"]         = "Quando questa opzione è selezionata, l'utente o il gruppo erediteranno le impostazioni dal gruppo genitore. Quando non è selezionata, l'utente o il gruppo avranno le proprie impostazioni.";
            dictMsg["user name"]                    = "Nome utente";
            dictMsg["user name hlp"]                = "Il nome visualizzato per questo profilo utente.";
            dictMsg["access role"]                  = "Ruolo";
            dictMsg["access role hlp"]              = "Controlla il ruolo di quest'utente. Gli amministratori possono gestire tutti gli utenti e i gruppi, e possono anche controllare le autorizzazioni delle applicazioni. I manager possono configurare le impostazioni di utenti e gruppi all'interno del loro gruppo. Gli utenti non hanno privilegi speciali.";
            dictMsg["can edit profile"]             = "Può modificare il profilo";
            dictMsg["can edit profile hlp"]         = "Permette all'utente di modificare le impostazioni di \"Aspetto\" and \"Navigazione\", e di cambiare la password. Tutte le altre impostazioni non sono mai modificabili dall'utente.";
            dictMsg["user profile"]                 = "Profilo utente";
            dictMsg["user profile hlp"]             = "Il nome del profilo utente. I nomi dei profili utente fanno distinzione fra maiuscole e minuscole, a meno che non vengano usati i profili IBM i.";
            dictMsg["password hlp"]                 = "Imposta/reimposta la password. Le passwords fanno distinzione fra maiuscole e minuscole.";
            dictMsg["conf password"]                = "Conferma la password";
            dictMsg["conf password hlp"]            = "Quando si remposta la password, questo campo deve esattamente combaciare esattamente con la nuova password. Le passwords fanno distinzione fra maiuscole e minuscole.";
            // Atrium.help tool-tip - User/group Appearance preferences.
            dictMsg["browser title"]                = "Titolo del browser";
            dictMsg["browser title hlp"]            = "Imposta il testo che comparirà nella barra del titolo del browser.";
            dictMsg["show banner"]                  = "Mostra banner";
            dictMsg["show banner hlp"]              = "Deseleziona questa opzione se non vuoi mostrare il banner in cima al portale.";
            dictMsg["banner height"]                = "Altezza del banner";
            dictMsg["banner height hlp"]            = "Imposta l'altezza in pixel del banner in cima al portale. Questa impostazione sarà ignorata se si è scelto di non mostrare il banner. I valori accettati sono da 0 a 600 pixel.";
            dictMsg["banner url"]                   = "URL del banner";
            dictMsg["banner url hlp"]               = "Imposta l'URL dove si trova contenuto del banner. Può essere un URL assoluto o completo.";
            dictMsg["theme"]                        = "Tema";
            dictMsg["theme hlp"]                    = "Imposta il tema predefinito. Questa impostazione può essere sovrascritta dagli utenti se <strong>\"Permetti all'utente di scegliere il tema\"</strong> è selezionato.";
            dictMsg["allow sel theme"]              = "Permetti all'utente di scegliere il tema";
            dictMsg["allow sel theme hlp"]          = "Se è selezionato, gli utenti avranno la possibilità di impostare il tema attraverso un comando nella barra degli strumenti.";
            dictMsg["show menu search"]             = "Mostra ricerca del menu";
            dictMsg["show menu search hlp"]         = "Deseleziona per disabilitare la funzione di ricerca nel menu.";
            dictMsg["show fav sys"]                 = "Mostra il sistema dei preferiti";
            dictMsg["show fav sys hlp"]             = "Deseleziona per disattivare il sistema dei preferiti.";
            dictMsg["show fav start"]               = "Mostra preferiti all'apertura del portale";
            dictMsg["show fav start hlp"]           = "Se selezionato, il pannello dei preferiti viene mostrato all'apertura del portale. Altrimenti verrà mostrato il pannello di navigazione (predefinito). Quest'opzione sarà disponibile solo se il sistema dei Preferiti è attivo.";
            dictMsg["limit num sessn"]              = "Limita il numero delle sessioni";
            dictMsg["limit num sessn hlp"]          = "Numero di sessioni di Atrium permesse a questo utente/gruppo. Il valore zero permette sessioni infinite. Il limite è applicato per browser.";
            // Atrium.help tool-tip - User/Group navigation preferences.
            dictMsg["show hmpg start"]              = "Mostra home page all'apertura del portale";
            dictMsg["show hmpg start hlp"]          = "Se è selezionato, all'apertura del portale verrà lanciata una home page personalizzabile.";
            dictMsg["home page url"]                = "URL dell'home page";
            dictMsg["home page url hlp"]            = "Imposta l'URL dov'è situata la home page. Può essere sia un persorso assoluto che un URL completo.";
            dictMsg["navi pnl title"]               = "Titolo del pannello di navigazione";
            dictMsg["navi pnl title hlp"]           = "Imposta il testo che apparirà nella barra del titolo del pannello di navigazione.";
            dictMsg["navi pnl width"]               = "Larghezza iniziale del pannello di navigazione";
            dictMsg["navi pnl width hlp"]           = "Imposta la larghezza iniziale del pannello di navigazione, in pixel. L'utente può ridimensionare o nascondere il pannello a piacere. I valori accettati sono da 0 a 2000 pixel.";
            dictMsg["navi type"]                    = "Tipo di navigazione";
            dictMsg["navi type hlp"]                = "Controlla il tipo di menu usato nel pannello di navigazione, \"albero\" o \"accordion\". Quest'impostazione non si applica alla barra degli strumenti.";
            dictMsg["single click nav"]             = "Navigazione a click singolo";
            dictMsg["single click nav hlp"]         = "Se selezionato, gli elementi di navigazione verranno lanciati al click singolo, altrimenti verranno lanciati con doppio click. Quest'impostazione non si applica alla barra degli strumenti.";
            // Atrium.help tool-tip - Library list.
            dictMsg["current library"]              = "Libreria attuale";
            dictMsg["current library hlp"]          = "Specifica la libreria attuale, *USRPRF, o *CRTDFT.";
            dictMsg["job descr"]                    = "Descrizione del lavoro";
            dictMsg["job descr hlp"]                = "Specifica una descrizione del lavoro da cui impostare la lista di librerie. *USRPRF può essere usato se gli utenti di Atrium sono profili utente su IBM i.";
            dictMsg["job descr lib"]                = "Libreria della descrizione del lavoro";
            dictMsg["job descr lib hlp"]            = "Specifica la libreria della descrizione del lavoro. Possono essere usati *LIBL o *CURLIB.";
            // Atrium.help tool-tip - Navigation / Toolbar items.
            dictMsg["item name"]                    = "Nome dell'elemento";
            dictMsg["item name hlp"]                = "Imposta il nome mostrato dell'elemento di navigazione o della barra degli strumenti.";
            dictMsg["action type"]                  = "Tipo di azione";
            dictMsg["action type hlp"]              = "Imposta il tipo di applicazione lanciata da questo elemento.";
            dictMsg["url"]                          = "URL";
            dictMsg["url hlp"]                      = "Imposta l'URL della Web application. Può essere specificato sia come percorso assoluto sia come URL completo. I parametri di query possono essere specificati dell'URL.";
            dictMsg["genie url"]                    = "Genie URL";
            dictMsg["genie url hlp"]                = "Imposta l'URL da usare per lanciare Genie. Se non è specificato, verrà usato l'ULR predefinito /profoundui/auth/genie. Questo campo è utile se sono necessari un URL alternativo o dei parametri di query per Genie. Per esempio: /profoundui/auth/genie?skin=MyCompany";
            dictMsg["open as"]                      = "Apri come";
            dictMsg["open as hlp"]                  = "Sceglie se aprire l'elemento come una nuova scheda nel portale, o come una nuova scheda o finestra del browser. Il fatto che il browser usi una nuova scheda o una nuova finestra dipende dalle impostazioni del browser dell'utente.";
            dictMsg["opens once only"]              = "Apri una sola volta";
            dictMsg["opens once only hlp"]          = "Di default, se l'utente lancia un elemento, questo verrà aperto in un'altra scheda, anche se c'è già una scheda aperta nel portale per questo stesso elemento. Non c'è un limite al numero di schede che l'utente può aprire per uno stesso elemento. Quando questa opzione è selezionata, l'utente potrà aprire una sola scheda per questo elemento. Se c'è già una scheda aperta, verrà selezionata. Questa opzione verrà ignorata quando si apre l'elemento in una nuova finestra o scheda del browser.";
            dictMsg["icon"]                         = "Icona";
            dictMsg["icon hlp"]                     = "Opzionale. Imposta un file icona da usare per l'elemento della barra degli strumenti. Il file può essere in formato GIF, JPG, o PNG. Si consiglia di usare GIF trasparenti. Il percorso del file deve essere specificato come percorso assoluto rispetto alla root dell'installazione di Atrium. Se non è specificata nessuna icona, Atrium userà un'icona predefinita per gli elementi di navigazione, mentre per gli elementi della barra degli strumenti non verrà mostrata nessuna icona.";
            dictMsg["parameter"]                    = "Parametro";
            dictMsg["parameter hlp"]                = "Opzionale: specifica un parametro che verrà inviato al Rich Display program quando viene lanciato.";

            break;

        default:
            console.log("Unknown Dictionary Type : '" + dict + "'");
    }

    return dictMsg;
};