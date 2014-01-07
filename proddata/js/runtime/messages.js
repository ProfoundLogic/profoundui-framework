//  Profound UI Runtime  -- A Javascript Framework for Rich Displays
//  Copyright (c) 2014 Profound Logic Software, Inc.
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


pui.getLanguageText = function(dict, msgid, varvals) {

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
pui["runtimeMsg"]["en_US"]["ME"]                      = "Mandatory entry field. You must enter data.";
pui["runtimeMsg"]["en_US"]["MF"]                      = "Mandatory fill field. You must fill the input box completely.";
pui["runtimeMsg"]["en_US"]["required"]                = "The value cannot be blank. This field is required.";
pui["runtimeMsg"]["en_US"]["file required"]           = "You must select at least one file.";
pui["runtimeMsg"]["en_US"]["signature overflow"]      = "The signature drawing size exceeds the maximum number of bytes available for storing the signature.  Please clear the signature pad and try again.";
pui["runtimeMsg"]["en_US"]["validValues"]             = "Value entered is not valid. Valid values are: ";
pui["runtimeMsg"]["en_US"]["upload invalid type"]     = "One or more files are of invalid type.";
pui["runtimeMsg"]["en_US"]["invalid email"]          = "Invalid email address.";

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
pui["runtimeText"]["en_US"]["row"]                  = "row";
pui["runtimeText"]["en_US"]["rows"]                 = "rows";
pui["runtimeText"]["en_US"]["page"]                 = "Page";
pui["runtimeText"]["en_US"]["collapseAll"]          = "Collapse All";
pui["runtimeText"]["en_US"]["expandAll"]            = "Expand All";


// ----------------------------------
//  UK English -- just a copy of USA
// ----------------------------------
pui.copyAllLanguageText("en_US", "en_UK");


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
pui["runtimeMsg"]["de_DE"]["close browser text"]      = "Bitten das Browserfenster schließen, um die Abmeldung zu vervollständigen.";
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
pui["runtimeMsg"]["de_DE"]["invalid email"]          = "ungültige E-Mail-Adresse.";

pui["runtimeText"]["de_DE"]["upload select text"]   = "Dateiauswahl";
pui["runtimeText"]["de_DE"]["upload clear text"]    = "Löschen";
pui["runtimeText"]["de_DE"]["upload remove text"]   = "Entfernen";
pui["runtimeText"]["de_DE"]["upload upload text"]   = "Heraufladen";
pui["runtimeText"]["de_DE"]["csv export text"]      = "Export nach Excel";
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
pui["runtimeMsg"]["pt_PT"]["invalid percent"]         = '&1 não é  um valor décimal.';
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
pui["runtimeMsg"]["pt_PT"]["validValues"]              = "O valor introduzido não é válido. Valores válidos: ";
pui["runtimeMsg"]["pt_PT"]["upload invalid type"]     = "Um ou mais ficheiros são de tipo inválido.";
pui["runtimeMsg"]["pt_PT"]["invalid email"]          = "inválido e-mail.";

pui["runtimeText"]["pt_PT"]["upload select text"]   = "Ficheiros Selecionados";
pui["runtimeText"]["pt_PT"]["upload clear text"]    = "Limpar";
pui["runtimeText"]["pt_PT"]["upload remove text"]   = "Remover";
pui["runtimeText"]["pt_PT"]["upload upload text"]   = "Enviar";
pui["runtimeText"]["pt_PT"]["csv export text"]      = "Exportar para Excel";
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
pui["runtimeMsg"]["es_ES"]["invalid email"]          = "dirección de correo electrónico no es válida.";

pui["runtimeText"]["es_ES"]["upload select text"]   = "Archivos Seleccionados";
pui["runtimeText"]["es_ES"]["upload clear text"]    = "Borrar";
pui["runtimeText"]["es_ES"]["upload remove text"]   = "Remover";
pui["runtimeText"]["es_ES"]["upload upload text"]   = "Cargar";
pui["runtimeText"]["es_ES"]["csv export text"]      = "Exportar para Excel";
pui["runtimeText"]["es_ES"]["filter text"]          = "Filtrar";
pui["runtimeText"]["es_ES"]["remove filters text"]  = "Remover Todos os  Filtros";
pui["runtimeText"]["es_ES"]["next link text"]       = "Próximo";
pui["runtimeText"]["es_ES"]["previous link text"]   = "Anterior";
pui["runtimeText"]["es_ES"]["sort ascending text"]  = "Ordenación Ascendente";
pui["runtimeText"]["es_ES"]["sort descending text"] = "Ordenación Descendente";
pui["runtimeText"]["es_ES"]["row"]                  = "línea";
pui["runtimeText"]["es_ES"]["rows"]                 = "líneas";
pui["runtimeText"]["es_ES"]["page"]                 = "Página";
pui["runtimeText"]["es_ES"]["collapseAll"]          = "Recoger tudo";
pui["runtimeText"]["es_ES"]["expandAll"]            = "Espandir tudo";


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
pui["runtimeMsg"]["es_MX"]["invalid email"]          = "dirección de correo electrónico no es válida.";

pui["runtimeMsg"]["es_MX"]["ME"]                      = "Campo de entrada obligatorio. Debe ingresar los datos.";
pui["runtimeMsg"]["es_MX"]["MF"]                      = "Campo de relleno obligatorio. Debe rellenar el cuadro de entrada completamente.";
pui["runtimeMsg"]["es_MX"]["required"]                = "El valor no puede ser blanco. Este campo es requerido.";
pui["runtimeMsg"]["es_MX"]["file required"]           = "Debe seleccionar al menos un archivo.";
pui["runtimeMsg"]["es_MX"]["signature overflow"]      = "El tamaño del dibujo de la firma excede el número máximo de bytes disponible para almacenar la firma. Por favor borre el área de firma y trate de nuevo.";
pui["runtimeMsg"]["es_MX"]["validValues"]             = "El valor ingresado es invalido. Los valores válidos son: ";

pui["runtimeText"]["es_MX"]["upload select text"]     = "Seleccionar Archivos";
pui["runtimeText"]["es_MX"]["upload clear text"]      = "Limpiar";
pui["runtimeText"]["es_MX"]["upload remove text"]     = "Eliminar";
pui["runtimeText"]["es_MX"]["upload upload text"]     = "Subir";
pui["runtimeText"]["es_MX"]["csv export text"]        = "Exportar a Excel";
pui["runtimeText"]["es_MX"]["filter text"]            = "Filtrar";
pui["runtimeText"]["es_MX"]["remove filters text"]    = "Eliminar todos los filtros";
pui["runtimeText"]["es_MX"]["next link text"]         = "Siguiente";
pui["runtimeText"]["es_MX"]["previous link text"]     = "Anterior";
pui["runtimeText"]["es_MX"]["sort ascending text"]    = "Orden Ascendente";
pui["runtimeText"]["es_MX"]["sort descending text"]   = "Orden Descendente";
pui["runtimeText"]["es_MX"]["row"]                    = "fila";
pui["runtimeText"]["es_MX"]["rows"]                   = "filas";
pui["runtimeText"]["es_MX"]["page"]                   = "Página";


// ------------------------------------------------------------
//  Viva la France!
// -------------------------------------------------------------
pui.copyAllLanguageText("en_US", "fr_FR");
pui["runtimeMsg"]["fr_FR"]["closeMessage"]            = "Ça finira votre session.";
pui["runtimeMsg"]["fr_FR"]["no connection message"]   = "Il n'est pas possible d'établir liaison au serveur. S'il vous plaît, vérifiez la liaison et essaye de nouveau.";
pui["runtimeMsg"]["fr_FR"]["upload file limit"]       = "Limite de &1 fichier(s) dépassé.";
pui["runtimeMsg"]["fr_FR"]["upload size limit"]       = "Limite de &1MB par fichier dépassé ";
pui["runtimeMsg"]["fr_FR"]["upload no files"]         = "Pas de fichiers sélectionnés.";
pui["runtimeMsg"]["fr_FR"]["upload duplicate file"]   = "Fichiers sélectionnés en double.";
pui["runtimeMsg"]["fr_FR"]["upload file exists"]      = "Un ou plusieurs fichiers déjà existent dans le système de fichiers.";
pui["runtimeMsg"]["fr_FR"]["upload prevented"]        = "Opération empêchée par «exit program».";
pui["runtimeMsg"]["fr_FR"]["upload input limit"]      = "A été dépassée le limite de la dimension totale de « input ».";
pui["runtimeMsg"]["fr_FR"]["upload no session"]       = "Vous n'est pas lié à une session valable.";
pui["runtimeMsg"]["fr_FR"]["upload timeout"]          = "Le temps limite pour la transaction a été dépassée.";
pui["runtimeMsg"]["fr_FR"]["upload invalid response"] = "N'existe pas réponse du serveur ou elle est invalide.";
pui["runtimeMsg"]["fr_FR"]["close browser text"]      = "Pour compléter la fermeture de la session, s'il vous plaît, fermez la fenêtre du «browser».";
pui["runtimeMsg"]["fr_FR"]["session ended text"]      = "Votre session a été fermée.";
pui["runtimeMsg"]["fr_FR"]["outside ucs2"]            = 'Caractères en dehors du contexte UCS-2.';
pui["runtimeMsg"]["fr_FR"]["invalid number"]          = "&1 n'est pas un nombre valide.";
pui["runtimeMsg"]["fr_FR"]["invalid length"]          = '&1 a la longueur ou positions décimales incorrectes.';
pui["runtimeMsg"]["fr_FR"]["invalid decimal"]         = "&1 a d'excessives positions décimales. (max: &2)";
pui["runtimeMsg"]["fr_FR"]["invalid choice"]          = "\"&1\" c'est invalide. Choix valables son: \"&2\" ou \"&3\".";
pui["runtimeMsg"]["fr_FR"]["invalid date"]            = "\"&1\" n'est pas une date valable. Exemple de format correct: &2";
pui["runtimeMsg"]["fr_FR"]["invalid time"]            = "\"&1\" n'est pas une valeur de temps correct. Exemple de format correct: &2";
pui["runtimeMsg"]["fr_FR"]["invalid time stamp"]      = "\"&1\" n'est pas un registre de temps valable. Exemple de format correct: &2";
pui["runtimeMsg"]["fr_FR"]["invalid percent"]         = "&1 n'est pas une valeur décimale.";
pui["runtimeMsg"]["fr_FR"]["invalid digits"]          = "\"&1\" contient d'excessifs chiffres. Max: &2";
pui["runtimeMsg"]["fr_FR"]["exceeds whole"]           = '"&1" dépasse le nombre maximum de chiffres pour la partie numérique du champ (&2 digits).';
pui["runtimeMsg"]["fr_FR"]["exceeds decimal"]         = '"&1" dépasse le nombre maximum de chiffres pour la partie décimale du champ (&2 digits).';
pui["runtimeMsg"]["fr_FR"]["zip too long"]            = 'Le code postal est trop grand. (Maximum: &1 digits)';
pui["runtimeMsg"]["fr_FR"]["phone too long"]          = 'Le nombre de téléphone est trop grand. (Maximum: &1 digits)';
pui["runtimeMsg"]["fr_FR"]["ssno too long"]           = 'Le code de la sécurité sociale est trop grand. (Maximum: &1 digits)';
pui["runtimeMsg"]["fr_FR"]["invalid custom val"]      = 'Fonction faite sur commande inadmissible de validation.';
pui["runtimeMsg"]["fr_FR"]["error custom val"]        = 'Erreur dans la validation de la fonction faite sur commande.';
pui["runtimeMsg"]["fr_FR"]["ME"]                      = "Champ obligatoire. Il faut introduire des données.";
pui["runtimeMsg"]["fr_FR"]["MF"]                      = "Champ de remplissage total obligatoire. Il faut remplir complètement la boîte d'entrée.";
pui["runtimeMsg"]["fr_FR"]["required"]                = "La valeur ne peut pas être vide. Ce champ est exigé.";
pui["runtimeMsg"]["fr_FR"]["file required"]           = "Vous devez sélectionner au moins un fichier.";
pui["runtimeMsg"]["fr_FR"]["signature overflow"]      = "L'image de la signature dépasse le nombre maximum de bytes disponibles pour son stockage. S'il vous plaît, videz la boîte de la signature et essaye à nouveau.";
pui["runtimeMsg"]["fr_FR"]["validValues"]             = "La valeur introduite n'est pas valable. Valeurs valables :";
pui["runtimeMsg"]["fr_FR"]["upload invalid type"]     = "Un ou plusieurs fichiers sont de type invalide.";
pui["runtimeMsg"]["fr_FR"]["invalid email"]          = "adresse mail invalide.";

pui["runtimeText"]["fr_FR"]["upload select text"]   = "Fichiers Sélectionnés ";
pui["runtimeText"]["fr_FR"]["upload clear text"]    = "Nettoyer ";
pui["runtimeText"]["fr_FR"]["upload remove text"]   = "Enlever ";
pui["runtimeText"]["fr_FR"]["upload upload text"]   = "Envoyer ";
pui["runtimeText"]["fr_FR"]["csv export text"]      = "Exporter pour Excel ";
pui["runtimeText"]["fr_FR"]["filter text"]          = "Filtrer ";
pui["runtimeText"]["fr_FR"]["remove filters text"]  = "Enlever Tous les Filtres ";
pui["runtimeText"]["fr_FR"]["next link text"]       = "Prochain ";
pui["runtimeText"]["fr_FR"]["previous link text"]   = "Précédent ";
pui["runtimeText"]["fr_FR"]["sort ascending text"]  = "Trier dans l'ordre Croissant";
pui["runtimeText"]["fr_FR"]["sort descending text"] = "Trier dans l'ordre Décroissant";
pui["runtimeText"]["fr_FR"]["row"]                  = "rangée";
pui["runtimeText"]["fr_FR"]["rows"]                 = "rangées";
pui["runtimeText"]["fr_FR"]["page"]                 = "Page";
pui["runtimeText"]["fr_FR"]["collapseAll"]          = "Rassembler tout";
pui["runtimeText"]["fr_FR"]["expandAll"]            = "Développer tout";


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
pui["runtimeMsg"]["it_IT"]["invalid email"]          = "mail non valido.";

pui["runtimeText"]["it_IT"]["upload select text"]   = "Seleziona File";
pui["runtimeText"]["it_IT"]["upload clear text"]    = "Cancella";
pui["runtimeText"]["it_IT"]["upload remove text"]   = "Rimuovi";
pui["runtimeText"]["it_IT"]["upload upload text"]   = "Carica";
pui["runtimeText"]["it_IT"]["csv export text"]      = "Esporta in Excel";
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
pui["runtimeMsg"]["he_IL"]["invalid email"]          = 'כתובת דוא"ל לא חוקי';

pui["runtimeText"]["he_IL"]["upload select text"]   = " בחר קבצים ";
pui["runtimeText"]["he_IL"]["upload clear text"]    = " נקה ";
pui["runtimeText"]["he_IL"]["upload remove text"]   = " הסר ";
pui["runtimeText"]["he_IL"]["upload upload text"]   = " העלה ";
pui["runtimeText"]["he_IL"]["csv export text"]      = " יצוא לאקסל ";
pui["runtimeText"]["he_IL"]["filter text"]          = " מסנן ";
pui["runtimeText"]["he_IL"]["remove filters text"]  = " הסר את כל המסננים ";
pui["runtimeText"]["he_IL"]["next link text"]       = " הבאה ";
pui["runtimeText"]["he_IL"]["previous link text"]   = " הקודם ";
pui["runtimeText"]["he_IL"]["sort ascending text"]  = " מיין לפי סדר עולה ";
pui["runtimeText"]["he_IL"]["sort descending text"] = " מיין בסדר יורד ";
pui["runtimeText"]["he_IL"]["row"]                  = " שורה ";
pui["runtimeText"]["he_IL"]["rows"]                 = " שורות ";
pui["runtimeText"]["he_IL"]["page"]                 = " עמוד ";


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

pui["runtimeText"]["nl_NL"]["upload select text"]     = "Selecteer bestanden";
pui["runtimeText"]["nl_NL"]["upload clear text"]      = "Wissen";
pui["runtimeText"]["nl_NL"]["upload remove text"]     = "Verwijder";
pui["runtimeText"]["nl_NL"]["upload upload text"]     = "Upload";
pui["runtimeText"]["nl_NL"]["csv export text"]        = "Export naar Excel";
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