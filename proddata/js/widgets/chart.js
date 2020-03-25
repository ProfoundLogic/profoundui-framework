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


pui["charts"] = {};
pui.chartsRendered = [];

pui.widgets.chartTypes = ["Column3D", "Column2D", "Bar2D", "Line", "Area2D", "Pie2D", "Pie3D", "Doughnut3D", "Other..."];
pui.widgets.chartNames = ["3D Column", "2D Column", "2D Bar", "Line", "Area", "2D Pie", "3D Pie", "Doughnut"];

/**
 * Given some XML or JSON data, construct a new FusionCharts object and render it. This should
 * be called after the data is already loaded in the browser; e.g. after AJAX response arrives.
 * 
 * Note: Recent FusionCharts documentation (e.g. v3.11) recommends loading chart data in the
 * constructor rather than calling setXMLData or setJSONData. Either seems to behave the same.
 * 
 * @param {Object} parms   Description of parameters:
 * - dom - chart container
 * - domId - set for DB-driven, "chart url json", and "chart url" types. 
 * - type - chart type
 * - transparent (optional true)
 * - xmlURL or xmlData or jsonURL or jsonData
 *   
 * @returns {undefined}
 */
pui.widgets.renderChart = function(parms) {
  if (parms.dom.isRendering) return;
  
  parms.dom.isRendering = true;
  
  if (typeof FusionCharts == "undefined") {
    // Dependency scripts should have been loaded before render-time.
    // If they didn't, then indicate a problem to the user and stop.
    parms.dom.innerHTML = "<br/>&nbsp;&nbsp;" 
      + pui["getLanguageText"]("runtimeMsg", "failed to load x", [pui["getLanguageText"]("runtimeText","chart")] );
    console.log("Dependency FusionCharts not defined before rendering.");
    return;
  }
  
  if (inDesignMode()) return;  //User switched to design mode while async request was loading in Genie.
  
  var maptype = parms.dom.pui.properties["map type"];
  var isMap = maptype != null && maptype != "";

  // dom.id becomes null when the chart is in the background behind a windowed record format. The id attribute is set when the first
  // format is rendered. Then certain charts send XHR. The next format may clear "id" attributes from the first format before the
  // response arrives. To avoid setting multiple chart ids to "_Chart", don't render without an id. Otherwise disposing causes errors.
  if (parms.dom.id != null && parms.dom.id != "")
    var chartId = parms.dom.id + "_Chart";
  else if (parms.domId != null)
      var chartId = parms.domId + "_Chart";   //certain charts send the additional domId property.
  else {
    console.log("Stopped rendering chart; missing id attribute.");
    return;
  }

  var fc_parms = {
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
  };

  // Allow the chart/map to be clickable by adding special things to the data.
  if (typeof(parms.dom.pui.properties["chart response"]) != "undefined" || typeof(parms.dom.pui.properties["onchartclick"]) != "undefined") {
    // Add a listener for legacy xmlurl chart to run after FusionCharts loads the data from the url.
    if (parms.xmlURL != null) {
      fc_parms["events"]["dataLoadRequestCompleted"] = pui.widgets.addChartLinks;
    }

    //If XML or JSON data is loaded and ready now, add the links now.
    if (parms.xmlData != null) {
      parms.xmlData = pui.widgets.addXMLChartLinks(parms.dom.id, parms.xmlData, isMap);
    }
    else if (parms.jsonData != null) {
      parms.jsonData = pui.widgets.addJSONChartLinks(parms.dom.id, parms.jsonData, isMap);
    }
  }
  
  // Set dataSources for the FusionCharts constructor.
  if (parms.xmlData != null) {
    fc_parms["dataFormat"] = "xml";
    fc_parms["dataSource"] = parms.xmlData; 
  }
  else if (parms.jsonData != null) {
    fc_parms["dataFormat"] = "json";
    fc_parms["dataSource"] = parms.jsonData;
  }

  var chartObj = new FusionCharts(fc_parms);
  pui.chartsRendered.push(chartId);
  chartObj.dom = parms.dom;
  if (parms.transparent == true) chartObj.setTransparent(true);

  if (parms.xmlURL != null && pui["legacy chart data url"] == true){
    // Let FusionCharts handle the XHR. (This was the "chart url" behavior before PUI 5.5.0.)
    chartObj.setXMLUrl(parms.xmlURL);
  }

  parms.dom.style.backgroundColor = "";
  chartObj.render();
  parms.dom.chart = document.getElementById(chartId);
  if (parms.dom.chart != null && parms.dom.chart.style.visibility == "visible")
    parms.dom.chart.style.visibility = "";  // this inherits visibility from parent div

  function complete() {
    parms.dom.isRendering = false;    //FusionCharts code finished running.
  }
};

/**
 * Handler called by FusionCharts after "chart url" (XML) data finishes loading.
 * (Only runs when pui["legacy chart data url"] is true.)
 * @param {Object} eventObject
 * @param {Object} argumentsObject
 * @returns {undefined}
 */
pui.widgets.addChartLinks = function(eventObject, argumentsObject) {
  
  if( typeof argumentsObject["cancelDataLoad"] == "function")
    argumentsObject["cancelDataLoad"]();
  var id = eventObject["sender"].dom.id;
  
  var maptype = eventObject["sender"].dom.pui.properties["map type"];
  var isMap = maptype != null && maptype != "";
  
  if (argumentsObject["dataFormat"] == "xml") {
    //Note: at some point FusionCharts changed, and the second argument became "dataSource" instead of "data".
    var xml = pui.widgets.addXMLChartLinks(id, argumentsObject["dataSource"], isMap);
    eventObject["sender"]["setXMLData"](xml);
  }
  //The case for JSON URL is no longer needed. Removed in 5.7.1. MD.
};

/**
 * Add attributes to the XML tags so FusionCharts will call our doChartLink when someone
 * clicks on a data node in the chart or map.
 * 
 * For maps, this assumes the XML is in the form <chart><set id="" value="" /></chart>.
 * 
 * @param {String} id
 * @param {String} xml
 * @param {Boolean} isMap
 * @returns {doc.xml|String}
 */
pui.widgets.addXMLChartLinks = function(id, xml, isMap) {

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
    
    var categories = [];
    var dataSets;
    if (doc.getElementsByTagName("categories").length == 1) {
      
      var els = doc.getElementsByTagName("category");
      for (var i = 0; i < els.length; i++)
        categories.push(els[i].getAttribute("label"));
      dataSets = doc.getElementsByTagName("dataset");
    
    }
    else {
  
      dataSets = [doc];
      
    }
    for (var dataSetIdx = 0; dataSetIdx < dataSets.length; dataSetIdx++) {
      
      var dataSet = dataSets[dataSetIdx];
      var sets = dataSet.getElementsByTagName("set");
      for (var setIdx = 0; setIdx < sets.length; setIdx++) {
      
        var data = {"id": id};
        var set = sets[setIdx];
        if (dataSet.nodeName == "dataset") {
          //Multi-series.

          data["name"] = dataSet.getAttribute("seriesname"); // According to FusionCharts docs.
          if (data["name"] == null)
            data["name"] = dataSet.getAttribute("seriesName"); // According to our example.
          if (setIdx < categories.length)
          data["category"] = categories[setIdx];
        
        }
        else {
          //Single series data or map.
          
          if (isMap){
            data["name"] = set.getAttribute("id");  //Maps use tags like: <set id="" value="" />.
          }else{
            data["name"] = set.getAttribute("name");
            if (data["name"] == null)
              data["name"] = set.getAttribute("label");
          }
        }
        
        set.setAttribute("link", "j-pui.widgets.doChartLink-" + JSON.stringify(data));
      
      }     
     
      
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

/**
 * 
 * @param {String} id
 * @param {String} json
 * @param {Boolean} isMap
 * @returns {Object}
 */
pui.widgets.addJSONChartLinks = function(id, json, isMap) {

  try {

    var obj = eval("(" + json + ")");
    
    var dataSets;
    var categories = [];
    if (obj["dataset"] instanceof Array) {
      
      dataSets = obj["dataset"];
      for (var i = 0; i < obj["categories"][0]["category"].length; i++)
        categories.push(obj["categories"][0]["category"][i]["label"]);
      
    }
    else {
      
      dataSets = [obj["data"]];
      
    }
     
    for (var dataSetIdx = 0; dataSetIdx < dataSets.length; dataSetIdx++) {
    
      var data = {"id": id};
      var dataSet = dataSets[dataSetIdx];
      var sets = (dataSet["data"] instanceof Array) ? dataSet["data"] : dataSet;
      for (var setIdx = 0; setIdx < sets.length; setIdx++) {
        
        var set = sets[setIdx];
        if (dataSet["seriesname"]) {
          
          data["name"] = dataSet["seriesname"];
          if (setIdx < categories.length)
            data["category"] = categories[setIdx];
          
        }
        else {
          
          if (isMap)
            data["name"] = set["id"];    //Maps use "id" instead of "label".
          else
            data["name"] = set["label"]; //Charts use "label"
          
        }
        set["link"] = "j-pui.widgets.doChartLink-" + JSON.stringify(data);
        
      }    
    
    }
  
    return obj;
  
  }
  catch(e) {
  
    return json;
  
  }

};

pui.widgets["doChartLink"] = function(param) {

  var param = JSON.parse(param);
  var id = param["id"];
  var name = param["name"];
  var category = param["category"];
  
  var dom = getObj(id);
  
  if (typeof(dom.pui.properties["chart response"]) != "undefined") {
  
    if (category)
      dom.responseValue = category + "|" + name;
    else
      dom.responseValue = name;
    
    if (dom.bypassValidation == "true" || dom.bypassValidation == "send data") {
    
      pui.bypassValidation = dom.bypassValidation;
      
    }
    
    var returnVal = pui.respond();
    if (returnVal == false) dom.responseValue = "";  
  
  }
  else if (typeof(dom["onchartclick"]) == "function") {
  
    if (category) {

      dom["onchartclick"]({"name": name, "category": category});
     
    }
    else {
      
      dom["onchartclick"](name);
    
    }
  
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
  img.src = "/profoundui/proddata/images/charts/" + chartType + ".jpg?v=2";
  img.style.position = "absolute";
  img.style.left = "0px";
  img.style.top = "0px";
  img.style.width = "100%";
  img.style.height = "100%";
  img.isChartPreview = true;
  dom.appendChild(img);
};

pui.widgets.getChartXMLStart = function(chartOptions){
  var chartXML = '<?xml version="1.0" encoding="utf-8"?><chart';
  if (typeof chartOptions == "string" && chartOptions.length > 0) {
    chartXML += " " + chartOptions;
  }
  chartXML += '>';
  return chartXML;
};


pui.widgets.add({
  name: "chart",
  "dependencies": ["/fusionchartsxt/js/pui-fusioncharts.js"],
  defaults: {
    width: "300px",
    height: "200px",
    "background color": "#EEEEEE",
    "z index": "21"
  },
  
  propertySetters: {
  
    "field type": function(parms) {
      if (parms.dom["pui"] == null) parms.dom["pui"] = {}; //In case dom.pui isn't already set.

      // Do not render chart in tab panel until the tab is activated. Note: if this chart were listed
      // before the parent tab panel in Designer's elements list, then at runtime the tab panel wouldn't
      // have been created before the chart; it'd always be null. So the chart would always render.
      var objid = parms.evalProperty("parent tab panel");
      var tp;
      // Avoid the warning: Empty string passed to getElementById().
      if(objid != null && objid.length > 0) tp = getObj(objid);
      if (tp)
        tp = tp.tabPanel;
      var tn = parseInt(parms.evalProperty("parent tab"), 10);
      if (tp && !isNaN(tn) && tn != tp.selectedTab){
        if (typeof parms.properties["chart response"] != "undefined"){
          // When the tab click handler calls applyProperty on "field type", dom.pui.properties is the argument.
          // So if the chart is to render correctly later, dom.pui.properties must be set correctly. Issue #3333.
          parms.dom["pui"]["properties"]["chart response"] = parms.properties["chart response"];
        }
        return;
      }

      var mapType = trim(parms.evalProperty("map type"));
      var chartType;
      var isMap = (mapType != "");
      if (isMap) {

        if (mapType.toLowerCase().indexOf("maps/") == 0)
          mapType = mapType.substr(5);
        mapType = "/fusionchartsxt/js/maps/" + mapType;
        chartType = mapType;
        
      }
      else {
        
        chartType = parms.evalProperty("chart type");
        
      }
      if (parms.design) {
        pui.widgets.setChartPreview(parms.dom, chartType, isMap);
        parms.dom.style.overflow = "hidden";
        parms.dom.style.border = "1px solid #999999";
      }
      else {
        //Save ID in case a window or overlay clears the "id" attribute before the response 
        //arrives. Avoids errors when we use AJAX to load chart data before renderChart.
        var domId = parms.dom.id;
        
        // renderFormat doesn't set all dom.pui.properties that are needed later (e.g. "chart response"), so set them now.
        parms.dom["pui"]["properties"] = parms.properties;

        // Do not do this on already rendered chart or FusionCharts will 
        // lose the reference to it and methods like 'dispose()' will fail!
        if (!parms.dom.chart)
          parms.dom.innerHTML = "<br/>&nbsp;&nbsp;&nbsp;&nbsp;"
            + pui["getLanguageText"]("runtimeMsg", "loading x", [pui["getLanguageText"]("runtimeText","chart")] );
        if (chartType == "") chartType = "Bar2D";  // set a default
        var url = parms.evalProperty("chart url");
        var jsonURL = parms.evalProperty("chart url json");
        
        if (url!=null && url!="") {
          url = pui.appendAuth(url);
        }
        
        if (jsonURL!=null && jsonURL!="") {
          jsonURL = pui.appendAuth(jsonURL);
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
        
        var customSQL = parms.evalProperty("custom sql").toUpperCase();
        var orderBy   = parms.evalProperty("order by").toUpperCase();
        var maxCount  = parms.evalProperty("record limit").toUpperCase();
        var chartOptions = parms.evalProperty("chart options");
        
        if (url == "" && jsonURL == "" && customSQL == "") {
          // The chart data is provided by the properties "names" and "values",
          // or the chart is database-driven.
          var file             = parms.evalProperty("database file").toUpperCase();
          var nameField        = parms.evalProperty("name field").toUpperCase();
          var valueField       = parms.evalProperty("value field").toUpperCase();
          var summaryOption    = parms.evalProperty("summary option");
          var where            = parms.evalProperty("selection criteria").toUpperCase();
          var nameList         = parms.evalProperty("names");
          var valueList        = parms.evalProperty("values");
          
          
          if (trim(nameList) != "" && trim(valueList) != "") {
            // The chart data is in the "names" and "values" properties.
            var chartXML = pui.widgets.getChartXMLStart(chartOptions);
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
              
              var attrname = "label";
              if (isMap) attrname = "id"; //Maps use a different attribute than charts.
              
              chartXML += '<set '+attrname+'="' + pui.xmlEscape(dataName) + '" value="' + pui.xmlEscape(dataValue) + '" />';
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
            parms.dom.innerHTML = "&nbsp;&nbsp;" 
              + pui["getLanguageText"]("runtimeMsg", "data src not specfd x", [pui["getLanguageText"]("runtimeText","chart")] );
            return;
          }
          if (nameField == "") {
            parms.dom.innerHTML = "&nbsp;&nbsp;"
              + pui["getLanguageText"]("runtimeMsg", "name fld not specfd x", [pui["getLanguageText"]("runtimeText","chart")] );
            return;
          }
          //
          // The chart data is database-driven.
          //
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
              parms.dom.innerHTML = "&nbsp;&nbsp;"
                + pui["getLanguageText"]("runtimeMsg", "val fld not specfd x", [pui["getLanguageText"]("runtimeText","chart")] );
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
          
          url =  getProgramURL("PUI0009104.PGM");
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
         if( pui["read db driven data as ebcdic"] !== true ) postData += "&UTF8=Y";
         
         if (isMap) postData += "&isMap=Y"; //Tell PUI0009104 to use the correct XML for maps.
         
         if (pui["isCloud"])
           postData += "&workspace_id=" + pui.cloud.ws.id;

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
            domId: domId,
            type: chartType,
            transparent: (parms.properties["chart overlay"] != "true"),
            xmlData: data
           });
           
           var eventCode = parms.evalProperty("ondbload");
           if (typeof eventCode != "string" || eventCode == "") eventCode = null;
           if (eventCode) {
             var success = true;
             if (!response) success = false;
             pui.executeDatabaseLoadEvent(eventCode, success, parms.dom.id);
           }
           
         };
         ajaxRequest.send(); 
        }
        //done with database-driven and "names"/"values" charts.

        else if(url != "" ){      //xmlURL
        
          // Support the old data URL method in case the new one breaks
          // some people's charts.
          if( pui["legacy chart data url"] == true ){
            // Encode ampersands in the url. 

            // The url gets put into the <embed> or <object> tag parameters, where the ampersand has 
            // its own meaning.

            // This results in truncation of multiple query string parameters.
            // URL encoding the ampersands allows them to be treated normally as parameter separators.
            url = url.replace(/&/g, "%26");
            
            // FusionCharts will make the AJAX request.
            pui.widgets.renderChart({
              dom: parms.dom,
              domId: domId,
              type: chartType,
              transparent: (parms.properties["chart overlay"] != "true"),
              xmlURL: url
            });
          }
          else{
            //We make the AJAX request to avoid a problem in non-Chrome browsers with
            //some URLs in FusionCharts. The URL should not have ampersands encoded as %26.
            ajax({
              url: url,
              method: "get",
              async: true,
              handler: function(responseText){
                pui.widgets.renderChart({
                dom: parms.dom,
                domId: domId,
                type: chartType,
                transparent: (parms.properties["chart overlay"] != "true"),
                xmlData: responseText
               });
              }
            });
            
          }
        }
        
        else if(jsonURL != "") {
          
          //We make AJAX request to avoid non-Chrome problem with some URLs in FusionCharts.
          ajax({
            url: jsonURL,
            method: "get",
            async: true,
            handler: function(responseText){
              pui.widgets.renderChart({
                dom: parms.dom,
                domId: domId,
                type: chartType,
                transparent: (parms.properties["chart overlay"] != "true"),
                jsonData: responseText
              });
            }
          });
        }
        
        else if(customSQL != ""){
          
          var postData = 'AUTH=' + (context == 'genie' ? GENIE_AUTH : pui.appJob.auth);
          if (pui["secLevel"] > 0) {
            postData  += "&q=" + encodeURIComponent(pui.getSQLVarName(parms.dom));
            var pstring = pui.getSQLParams(parms.properties);
            if (pstring != "") {
              postData += "&" + pstring;
            }
          }
          else {
            var sql = customSQL;
            if (orderBy != "") sql += " ORDER BY " + orderBy;
            postData  += "&q=" + pui.aes.encryptString(sql);
          }
          postData += "&limit=" + maxCount;
          if ( pui["read db driven data as ebcdic"] !== true ) postData += "&UTF8=Y";
          if (pui["isCloud"])
            postData += "&workspace_id=" + pui.cloud.ws.id;
          
          var xhr = new pui.Ajax(getProgramURL("PUI0009102.PGM"));
          xhr['method'] = 'post';
          xhr['async'] = true;
          xhr['postData'] = postData;
          xhr['suppressAlert'] = true;
          xhr['onsuccess'] = function(){
            var chartXML = pui.widgets.getChartXMLStart(chartOptions);
            var response = checkAjaxResponse(xhr, "Custom SQL query");
            if (! response || response['results'] == null){
              var error = errors.pop();
              if (error != null && typeof error == 'object'){
                var domel = getObj(domId);
                if (domel){
                  domel.innerHTML = '<ul style="overflow-y:auto; white-space:normal"><li>Chart operation: ' + error.operation 
                          + '<li>Id: ' + error.id + '<li>Message: ' + error.text + '<li>'+ error.text2 + '</ul>';
                } else {
                  console.log(error);
                }
              }
              return;
            }
            var attrname = isMap ? 'id' : 'label';  //Maps use different attribute than charts.
            // 9102 returns an array of objects with column-name / value pairs for each column. Get each record.
            for (var i=0, n=response['results'].length; i < n; i++){
              // All but the last property are used as labels.
              var keycount = Object.keys(response['results'][i]).length;
              var label = '';
              var value = '';
              var colCount = 0;
              // Get each column in this record.
              for (var colname in response['results'][i]){
                colCount++;
                var val = response['results'][i][colname];
                if (colCount < keycount){
                  label += ' ' + val;
                }
                else {
                  value = val;
                }
              }
              chartXML += '<set '+attrname+'="'+pui.xmlEscape(trim(label))+'" value="' + pui.xmlEscape(trim(value)) + '" />'; 
            }
            chartXML += '</chart>';

            pui.widgets.renderChart({
              dom: parms.dom,
              domId: domId,
              type: chartType,
              transparent: (parms.properties["chart overlay"] != "true"),
              xmlData: chartXML
            });           
          };
          xhr.send();
        }
      } //end else, not design mode.
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
        
          parms.dom.chart.style.display = "inline-block";
        
        }        
      
      }
    
    }
    
  }  
  
});



