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

if (pui["runtimeMsg"] == null) pui["runtimeMsg"] = {};
if (pui["runtimeText"] == null) pui["runtimeText"] = {};
if (pui["runtimeMessages"] == null) pui["runtimeMessages"] = {};


pui["getLanguageText"] = function(dict, msgid, varvals) {

  var lang = pui["language"];
  if (lang == null || trim(lang) == "") {
    lang = "en_US";
    var qparm = getQueryStringParms();
    if (qparm["lang"] != null && trim(qparm["lang"]) != "") {
      lang = qparm["lang"];
    }
  }
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
  && pui["fileupload"] != null && typeof(pui["fileupload"][msgid.substr(8)]) != "undefined") {
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


// Import Dictionary Locales
pui["runtimeMsg"]["en_US"] = en_US("runtimeMsg");
pui["runtimeText"]["en_US"] = en_US("runtimeText");

pui["runtimeMsg"]["en_UK"] = en_UK("runtimeMsg");
pui["runtimeText"]["en_UK"] = en_UK("runtimeText");

pui["runtimeMsg"]["de_DE"] = de_DE("runtimeMsg");
pui["runtimeText"]["de_DE"] = de_DE("runtimeText");

pui["runtimeMsg"]["es_ES"] = es_ES("runtimeMsg");
pui["runtimeText"]["es_ES"] = es_ES("runtimeText");

pui["runtimeMsg"]["es_MX"] = es_MX("runtimeMsg");
pui["runtimeText"]["es_MX"] = es_MX("runtimeText");

pui["runtimeMsg"]["fr_CA"] = fr_CA("runtimeMsg");
pui["runtimeText"]["fr_CA"] = fr_CA("runtimeText");

pui["runtimeMsg"]["fr_FR"] = fr_FR("runtimeMsg");
pui["runtimeText"]["fr_FR"] = fr_FR("runtimeText");

pui["runtimeMsg"]["he_IL"] = he_IL("runtimeMsg");
pui["runtimeText"]["he_IL"] = he_IL("runtimeText");

pui["runtimeMsg"]["it_IT"] = it_IT("runtimeMsg");
pui["runtimeText"]["it_IT"] = it_IT("runtimeText");

pui["runtimeMsg"]["ja_JP"] = ja_JP("runtimeMsg");
pui["runtimeText"]["ja_JP"] = ja_JP("runtimeText");

pui["runtimeMsg"]["nl_NL"] = nl_NL("runtimeMsg");
pui["runtimeText"]["nl_NL"] = nl_NL("runtimeText");

pui["runtimeMsg"]["pt_BR"] = pt_BR("runtimeMsg");
pui["runtimeText"]["pt_BR"] = pt_BR("runtimeText");

pui["runtimeMsg"]["pt_PT"] = pt_PT("runtimeMsg");
pui["runtimeText"]["pt_PT"] = pt_PT("runtimeText");

pui["runtimeMsg"]["zh_HK"] = zh_HK("runtimeMsg");
pui["runtimeText"]["zh_HK"] = zh_HK("runtimeText");