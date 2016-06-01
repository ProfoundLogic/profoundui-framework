//  Profound UI Runtime  -- A Javascript Framework for Rich Displays
//  Copyright (c) 2016 Profound Logic Software, Inc.
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


pui["charts"] = {};
pui.chartsRendered = [];
pui.scriptLoading = false; //Help prevent multiple script tags from getting into head.

pui.widgets.chartTypes = ["Column3D", "Column2D", "Bar2D", "Line", "Area2D", "Pie2D", "Pie3D", "Doughnut3D", "Other..."];
pui.widgets.chartNames = ["3D Column", "2D Column", "2D Bar", "Line", "Area", "2D Pie", "3D Pie", "Doughnut"];

pui.widgets.renderChart = function(parms) {
  // description of parms:
  //   - dom - chart container
  //   - type - chart type
  //   - transparent (optional true)
  //   - xmlURL or xmlData or jsonURL or jsonData
  
  if (parms.dom.isRendering)
    return;
  
  parms.dom.isRendering = true;    
  
  function loadChart() {
    var chartId = parms.dom.id + "_Chart";
    if (FusionCharts(chartId)) FusionCharts(chartId).dispose();
    var chartObj = new FusionCharts({
      "type": parms.type.toLowerCase(),
      "id": chartId,
      "width": "100%",
      "height": "100%",
      "renderAt": parms.dom,
      "events": {
        "renderComplete": complete,
        "dataLoadError": complete,
        "dataInvalid": complete,
        "noDataToDisplay": complete
      }
    });
    pui.chartsRendered.push(chartId);
    chartObj.dom = parms.dom;
    if (parms.transparent == true) chartObj.setTransparent(true);
    
    // Process chart data if necessary.
    if (typeof(parms.dom.pui.properties["chart response"]) != "undefined" || typeof(parms.dom["onchartclick"]) == "function") {
    
      if (parms.xmlURL != null || parms.jsonURL != null) {
      
        FusionCharts(chartId)["addEventListener"]("DataLoadRequestCompleted", pui.widgets.addChartLinks);
      
      }
      
      if (parms.xmlData != null) {
      
        parms.xmlData = pui.widgets.addXMLChartLinks(parms.dom.id, parms.xmlData);
      
      }
      else if (parms.jsonData != null) {
      
        parms.jsonData = pui.widgets.addJSONChartLinks(parms.dom.id, parms.jsonData);
      
      }
    
    }
    
    if (parms.xmlURL != null){
      // Let FusionCharts handle the XHR.
      if( pui["legacy chart data url"] == true ){
        chartObj.setXMLUrl(parms.xmlURL);
        tidyup();
      }else{
        // Load XML string using our own ajax code to avoid non-Chrome problem with some
        // URLs in FusionCharts. The URL should not have ampersands encoded as %26.
        ajax({
          url: parms.xmlURL,
          method: "get",
          async: true,
          handler: function(responseText){
            chartObj.setXMLData(responseText);
            tidyup();
          }
        });
      }
    }
    else if (parms.xmlData != null){
      chartObj.setXMLData(parms.xmlData);
      tidyup();
    }
    else if (parms.jsonURL != null) {
      // Use our own ajax code to avoid non-Chrome problem with some URLs in FusionCharts.
      // Note: as of 6/1/16, there is no way to choose a URL for JSON data in VD,
      // so this code is never called. (Thus, no need for "legacy" fallback.)
      ajax({
        url: parms.jsonURL,
        method: "get",
        async: true,
        handler: function(responseText){
          chartObj.setJSONData(responseText);
          tidyup();
        }
      });
    }
    else if (parms.jsonData != null){
      chartObj.setJSONData(parms.jsonData);
      tidyup();
    }
    else{
      tidyup();
    }
    
    // Code to run after chart data is loaded by one of the various data methods.
    // (Calling this in the XHR response handler avoids Synchronous XMLHttpRequest
    // deprecation warnings that would appear when doing synchronous XHRs, then
    // subsequently running this code in the same thread.)
    function tidyup(){
      parms.dom.style.backgroundColor = "";
      chartObj.render();
      parms.dom.chart = document.getElementById(chartId);
      if (parms.dom.chart != null && parms.dom.chart.style.visibility == "visible")
        parms.dom.chart.style.visibility = "";  // this inherits visibility from parent div
    }
        
    function complete() {
      
      parms.dom.isRendering = false;
      
    }
    
  }
  
  function loadScript(url, callback) {
    var done = false;
    var head = document.getElementsByTagName("head")[0];
    var script = document.createElement("script");
    script.type= "text/javascript";
    script.onreadystatechange= function () {
      if (script.readyState == "complete" || script.readyState == "loaded") {
        if (typeof FusionCharts == "undefined") return;
        if (!done) callback();
        done = true;
        pui.scriptLoading = false; //Allow other charts to stop waiting to load.
      }
    };
    script.onload = function() {
        if (typeof FusionCharts == "undefined") return;
        if (!done) callback();
        done = true;
        pui.scriptLoading = false; //Allow other charts to stop waiting to load.
    };
    script.src = url;
    head.appendChild(script);
  }

  if (typeof FusionCharts == "undefined") {
    // Check if another call to pui.widgets.renderChart is busy loading the script.
    // Without this check, each chart loads pui-fusioncharts.js separately and
    // adds as many script tags to the head as there are charts.
    if(!pui.scriptLoading){
      // No other chart is loading the script file, so we will.
      pui.scriptLoading = true;
      loadScript(pui.normalizeURL('/FusionChartsXT/js/pui-fusioncharts.js'), function() {
        loadChart();
      });
    }else{
      var waitCount = 0;
      // Another chart is loading pui-fusioncharts.js, so wait until it finishes.
      var waitintval = setInterval(function(){
        if(!pui.scriptLoading){
          loadChart();
          clearInterval(waitintval);
        }
        // Give up waiting after 2 minutes.
        else if(waitCount > 2400){
          clearInterval(waitintval);
        }
        waitCount++;
      }, 50);
    }
  }
  else {
    loadChart();
  }

};

pui.widgets.addChartLinks = function(eventObject, argumentsObject) {

  argumentsObject["cancelDataLoad"]();
  var id = eventObject["sender"].dom.id;
  
  if (argumentsObject["dataFormat"] == "xml") {
  
    eventObject["sender"]["setXMLData"](pui.widgets.addXMLChartLinks(id, argumentsObject["data"]));
  
  }
  else {
  
    eventObject["sender"]["setJSONData"](pui.widgets.addJSONChartLinks(id, argumentsObject["data"]));
  
  }

};

pui.widgets.addXMLChartLinks = function(id, xml) {

  try {

    var doc;
    if (typeof(DOMParser) != "undefined") {
    
      var parser = new DOMParser();
      doc = parser.parseFromString(xml, "text/xml");
      
    }
    else {
  
      doc = new ActiveXObject("Microsoft.XMLDOM");
      doc.async = false;
      doc.loadXML(xml);
    
    }
    
    var sets = doc.getElementsByTagName("set");
    
    for (var i = 0; i < sets.length; i++) {
    
      var set = sets[i];
      
      var name = set.getAttribute("name");
      if (name == null) {
      
        name = set.getAttribute("label");
      
      }
      
      set.setAttribute("link", "j-pui.widgets.doChartLink-{\"id\":\"" + id + "\", \"name\":\"" + name + "\"}"); 
    
    }
   
    if (typeof(XMLSerializer) != "undefined") {
    
      return new XMLSerializer().serializeToString(doc);
    
    }
    else  {
    
      return doc.xml;
    
    }

  }
  catch(e) {
  
    return xml;
  
  }

};

pui.widgets.addJSONChartLinks = function(id, json) {

  try {

    var obj = eval("(" + json + ")");
    
    var data = obj["data"];
    
    for (var i = 0; i < data.length; i++) {
    
      var set = data[i];
      set["link"] = "j-pui.widgets.doChartLink-{\"id\":\"" + id + "\", \"name\":\"" + set["label"] + "\"}";    
    
    }
  
    return obj;
  
  }
  catch(e) {
  
    return json;
  
  }

};

pui.widgets["doChartLink"] = function(param) {

  var param = eval("(" + param + ")");
  var id = param["id"];
  var name = param["name"];
  
  var dom = getObj(id);
  
  if (typeof(dom.pui.properties["chart response"]) != "undefined") {
  
    dom.responseValue = name;
    
    if (dom.bypassValidation == "true" || dom.bypassValidation == "send data") {
    
      pui.bypassValidation = dom.bypassValidation;
      
    }
    
    var returnVal = pui.respond();
    if (returnVal == false) dom.responseValue = "";  
  
  }
  else if (typeof(dom["onchartclick"]) == "function") {
  
    dom["onchartclick"](name);
  
  }
    
};

pui.widgets.setChartPreview = function(dom, chartType, isMap) {
  dom.innerHTML = "";
  if (isMap)
    chartType = "Map";
  else {
    
    var valid = false;
    for (var i = 0; i < pui.widgets.chartTypes.length; i++) {
      if (chartType == pui.widgets.chartTypes[i]) {
        if (chartType != "Other...") {
          valid = true;
          break;
        }
      }
    }
    if (!valid) chartType = "Bar2D";  // set a default
    
  }
  var img = document.createElement("img");
  img.src = "/profoundui/proddata/images/charts/" + chartType + ".jpg";
  img.style.position = "absolute";
  img.style.left = "0px";
  img.style.top = "0px";
  //img.style.width = dom.style.width;
  //img.style.height = dom.style.height;
  img.style.width = "100%";
  img.style.height = "100%";
  img.isChartPreview = true;
  dom.appendChild(img);
};


pui.widgets.add({
  name: "chart",
  defaults: {
    width: "300px",
    height: "200px",
    "background color": "#EEEEEE",
    "z index": "21"
  },
  
  propertySetters: {
  
    "field type": function(parms) {      
        
      // Do not render chart in tab panel until the tab is activated.
      var objid = parms.evalProperty("parent tab panel");
      var tp;
      // Avoid the warning: Empty string passed to getElementById().
      if(objid != null && objid.length > 0) tp = getObj();
      if (tp)
        tp = tp.tabPanel;
      var tn = parseInt(parms.evalProperty("parent tab"), 10);
      if (tp && !isNaN(tn) && tn != tp.selectedTab)
        return;
                  
      var mapType = trim(parms.evalProperty("map type"));
      var chartType;
      if (mapType != "") {
  
        if (mapType.toLowerCase().indexOf("maps/") == 0)
          mapType = mapType.substr(5);
        mapType = "/FusionChartsXT/js/maps/" + mapType;
        chartType = mapType;
        
      }
      else {
        
        chartType = parms.evalProperty("chart type");
        
      }
      if (parms.design) {
        pui.widgets.setChartPreview(parms.dom, chartType, (mapType != ""));
        parms.dom.style.overflow = "hidden";
        parms.dom.style.border = "1px solid #999999";
      }
      else {
        // not sure if the next 2 lines are needed any more
        if (parms.dom["pui"] == null) parms.dom["pui"] = {};
        parms.dom["pui"]["properties"] = parms.properties;

        // Do not do this on already rendered chart or FusionCharts will 
        // lose the reference to it and methods like 'dispose()' will fail!
        if (!parms.dom.chart)
          parms.dom.innerHTML = "<br/>&nbsp;&nbsp;&nbsp;&nbsp;Loading Chart...";        
        if (chartType == "") chartType = "Bar2D";  // set a default
        url = parms.evalProperty("chart url");
        if (url!=null && url!="") {
          url = pui.appendAuth(url);
        }
        var xml = parms.evalProperty("chart xml");
        var json = parms.evalProperty("chart json");

        if (xml != null && xml != "") {
          pui.widgets.renderChart({
            dom: parms.dom,
            type: chartType,
            transparent: (parms.properties["chart overlay"] != "true"),
            xmlData: xml
          });
          return;        
        }
        
        if (json != null && json != "") {
          pui.widgets.renderChart({
            dom: parms.dom,
            type: chartType,
            transparent: (parms.properties["chart overlay"] != "true"),
            jsonData: json
          });
          return;        
        }
        
        if (url == "") {
        
          var file             = parms.evalProperty("database file").toUpperCase();
          var nameField        = parms.evalProperty("name field").toUpperCase();
          var valueField       = parms.evalProperty("value field").toUpperCase();
          var summaryOption    = parms.evalProperty("summary option");
          var maxCount         = parms.evalProperty("record limit").toUpperCase();
          var where            = parms.evalProperty("selection criteria").toUpperCase();
          var orderBy          = parms.evalProperty("order by").toUpperCase();
          var nameList         = parms.evalProperty("names");
          var valueList        = parms.evalProperty("values");
          var chartOptions     = parms.evalProperty("chart options");
          
          if (trim(nameList) != "" && trim(valueList) != "") {
            var chartXML = '<?xml version="1.0" encoding="utf-8"?><chart';
            if (chartOptions != null && typeof chartOptions == "string" && chartOptions != "") {
              chartXML += " " + chartOptions;
            }
            chartXML += '>';
            var nameArray = pui.parseCommaSeparatedList(nameList);
            var valueArray = pui.parseCommaSeparatedList(valueList);
            var n = nameArray.length;
            if (valueArray.length > n) n = valueArray.length;
            for (var i = 0; i < n; i++) {
              var dataName = nameArray[i];
              var dataValue = valueArray[i];
              if (dataName == null) dataName = "";
              dataName = trim(dataName);
              if (dataName.substr(0, 2) == "D_" || dataName.substr(0, 2) == "I_") {
                var retrievedDataName = get(dataName);
                if (retrievedDataName != "") dataName = retrievedDataName;
              }
              var dataValue = valueArray[i];
              if (dataValue == null) dataValue = "0";
              dataValue = String(dataValue);
              dataValue = trim(dataValue);
              var char1 = dataValue.substr(0, 1);
              if ((char1 < "0" || char1 > "9") && char1 != "." && char1 != "," && char1 != "-") {
                dataValue = get(dataValue);
                if (pui.appJob.decimalFormat != "I" && pui.appJob.decimalFormat != "J") {
                  dataValue = dataValue.replace(/,/g, "");
                }
                dataValue = Number(dataValue);
              }
              else {
                dataValue = Number(dataValue);
              }
              if (isNaN(dataValue)) dataValue = 0;
              chartXML += '<set name="' + pui.xmlEscape(dataName) + '" value="' + pui.xmlEscape(dataValue) + '" />';
            }
            chartXML += '</chart>';
            
            pui.widgets.renderChart({
              dom: parms.dom,
              type: chartType,
              transparent: (parms.properties["chart overlay"] != "true"),
              xmlData: chartXML
            });

            return;
          }
          
          if (file == "") {
            parms.dom.innerHTML = "&nbsp;&nbsp;Data source not specified for chart.";
            return;
          }
          if (nameField == "") {
            parms.dom.innerHTML = "&nbsp;&nbsp;Name field not specified for chart.";
            return;
          }
          
          var summary = "";
          if (summaryOption == "average") summary = "avg(";
          if (summaryOption == "count") summary = "count(";
          if (summaryOption == "sum") summary = "sum(";
          if (summaryOption == "maximum") summary = "max(";
          if (summaryOption == "minimum") summary = "min(";

          if (valueField == null || valueField == "") {
            if (summaryOption == "count") {
              valueField = nameField;
            }
            else {
              parms.dom.innerHTML = "&nbsp;&nbsp;Value field not specified for chart.";
              return;
            }
          }
          
         var sql = "SELECT ";          
         if (summary != "") {
           valueField = summary + valueField + ")";
         }
         sql += nameField + ", ";
         sql += valueField + " ";
         sql += " FROM " + file;
         if (where != "") {
          sql += " WHERE " + where;
         }           
         if (summary != "") {
           sql += " GROUP BY " + nameField + " ";
         }
         if (summary == "" && orderBy != "") sql += " ORDER BY " + orderBy;
         else sql += " ORDER BY " + nameField;

         var url =  getProgramURL("PUI0009104.PGM");
         var postData = "AUTH=";
         if (context == "genie") postData += GENIE_AUTH;
         if (context == "dspf") postData += pui.appJob.auth;
         if (pui["secLevel"] > 0) {
         
          postData  += "&q=" + encodeURIComponent(pui.getSQLVarName(parms.dom));
          
          var pstring = pui.getSQLParams(parms.properties);
          if (pstring != "") {
          
            postData += "&" + pstring;
          
          }          
         
         }
         else {
         
          postData  += "&q=" + pui.aes.encryptString(sql);
          
         }
         postData += "&maxcount=" + maxCount;
         
         var ajaxRequest = new pui.Ajax(url);
         ajaxRequest["method"] = "post";
         ajaxRequest["async"] = true;
         ajaxRequest["postData"] = postData;
         ajaxRequest["suppressAlert"] = true;
         ajaxRequest["onsuccess"] = function() {
           if (inDesignMode()) return;  // switched to design mode while async request was processing?             
           var data = "invalid"; // Necessary to send some data, or a request gets made to the server?
           var response = checkAjaxResponse(ajaxRequest, "Run Charting Query");
           if (response) {
             data = response;
           }
           // check if the returned xml data starts with a standard response
           // if it does and the "chart options" property was specified, insert chart options into the data string
           var startsWith = '<?xml version="1.0" encoding="utf-8"?><chart>';
           if (chartOptions != null && typeof chartOptions == "string" && chartOptions != "" && data.substr(0, startsWith.length) == startsWith) {
             data = startsWith.substr(0, startsWith.length - 1) + " " + chartOptions + data.substr(startsWith.length - 1);
           }
           pui.widgets.renderChart({
             dom: parms.dom,
             type: chartType,
             transparent: (parms.properties["chart overlay"] != "true"),
             xmlData: data
           });
         };
         ajaxRequest.send(); 
          
        }
        else {
        
          // Support the old data URL method in case the new one breaks
          // some people's charts.
          if( pui["legacy chart data url"] == true ){
            // Encode ampersands in the url. 

            // The url gets put into the <embed> or <object> tag parameters, where the ampersand has 
            // its own meaning.

            // This results in truncation of multiple query string parameters.
            // URL encoding the ampersands allows them to be treated normally as parameter separators.
            url = url.replace(/&/g, "%26"); 
          }
        
          pui.widgets.renderChart({
            dom: parms.dom,
            type: chartType,
            transparent: (parms.properties["chart overlay"] != "true"),
            xmlURL: url
          });

        }
      }
    },
    
    "width": function(parms) {
      parms.dom.width = parms.value;
      var isMap = (typeof parms.properties["map type"] != "undefined");
      if (parms.design) pui.widgets.setChartPreview(parms.dom, parms.properties["chart type"], isMap);
    },
    
    "height": function(parms) {
      parms.dom.height = parms.value;
      var isMap = (typeof parms.properties["map type"] != "undefined");
      if (parms.design) pui.widgets.setChartPreview(parms.dom, parms.properties["chart type"], isMap);
    },
    
    "chart type": function(parms) {
      if (parms.design) pui.widgets.setChartPreview(parms.dom, parms.value);
    },
    "map type": function(parms) {
      if (parms.design) pui.widgets.setChartPreview(parms.dom, parms.value, true);
    },    
    "visibility": function(parms) {
    
      if (parms.dom.chart) {
      
        if (parms.value == "hidden") {
        
          parms.dom.chart.style.display = "none";
        
        }
        else {
        
          parms.dom.chart.style.display = "";
        
        }        
      
      }
    
    }
    
  }  
  
});



