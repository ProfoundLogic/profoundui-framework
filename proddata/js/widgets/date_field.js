

var calobj=null;
var gDateField = new Array();
var gDateCount = 0;
pui.currentDateField = null;

function show_calendar(dateField, str_datetime, format) {
  var arr_months, week_days;
  var locale = null;
  if (context == "dspf" && dateField.formattingInfo) {
    locale = dateField.formattingInfo.locale;
  }
  if (context == "genie") {
    locale = pui.genie.config["locale"];
  }
  if (locale == "") locale = null;
  if (locale) {
    arr_months = pui.locales[locale]['monthNames'];
    dayNames = pui.locales[locale]['shortDayNames'];
    week_days = [];
    for(var i=0; i<dayNames.length; i++){
      week_days.push(dayNames[i]);
    }
  }
	else{
	  arr_months = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
	  week_days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
	}
	var n_weekstart = 0;
  if (locale && pui.locales[locale]['weekStart']) {
    n_weekstart = pui.locales[locale]['weekStart'];
  }

  pui.currentDateField = dateField;
  
	var dt_datetime = (str_datetime == null || str_datetime == "" ?  new Date() : str2dt(str_datetime));
	if(dt_datetime==null) dt_datetime = new Date();

	var dt_prev_month = new Date(dt_datetime);
	dt_prev_month.setMonth(dt_datetime.getMonth()-1);
	var dt_next_month = new Date(dt_datetime);
	dt_next_month.setMonth(dt_datetime.getMonth()+1);
	var dt_prev_year = new Date(dt_datetime);
	dt_prev_year.setFullYear(dt_datetime.getFullYear()-1);
	var dt_next_year = new Date(dt_datetime);
	dt_next_year.setFullYear(dt_datetime.getFullYear()+1);
	var dt_firstday = new Date(dt_datetime);
	dt_firstday.setDate(1);
	dt_firstday.setDate(1-(7+dt_firstday.getDay()-n_weekstart)%7);
	var dt_lastday = new Date(dt_next_month);
	dt_lastday.setDate(0);
	
	var today = new Date();

	var str_buffer = new String (
		"<table cellspacing=\"0\" border=\"0\" width=\"100%\">\n"+
		"<tr><td class=\"brndrow1\">\n"+
		"<table cellspacing=\"0\" cellpadding=\"4\" border=\"0\" width=\"100%\">\n"+
		"<tr>\n	<td class=\"brndrow1\">" + 

    "<span arrow=\"1\" style=\"cursor:pointer\" onclick=\"show_calendar(pui.currentDateField"+
    ", '"+ dt2dtstr(dt_prev_year)+"'+document.cal.time.value, '" + format + "');\">"+
    "<img arrow=\"1\" src=\"\/profoundui\/proddata\/images\/prev_year.png\" width=\"16\" height=\"16\" border=\"0\""+
    " alt=\"previous month\"></span>" +

    "<span arrow=\"1\" style=\"cursor:pointer\" onclick=\"show_calendar(pui.currentDateField"+
    ", '"+ dt2dtstr(dt_prev_month)+"'+document.cal.time.value, '" + format + "');\">"+
    "<img arrow=\"1\" src=\"\/profoundui\/proddata\/images\/prev_month.png\" width=\"16\" height=\"16\" border=\"0\""+
    " alt=\"previous month\"></span>" +
		
		"</td>\n" +
		"	<td class=\"calendar\" align=\"center\" class=\"brndrow1\" colspan=\"5\">"+
		"<font color=\"white\" face=\"tahoma, verdana\"><b>"
		+arr_months[dt_datetime.getMonth()]+" "+dt_datetime.getFullYear()+"</b></font></td>\n"+
		"	<td class=\"brndrow1\" align=\"right\">" + 
		
		"<span arrow=\"1\" style=\"cursor:pointer\" onclick=\"show_calendar(pui.currentDateField"+
		", '"+dt2dtstr(dt_next_month)+"'+document.cal.time.value, '" + format + "');\">"+
		"<img arrow=\"1\" src=\"\/profoundui\/proddata\/images\/next_month.png\" width=\"16\" height=\"16\" border=\"0\""+
		" alt=\"next month\"></span>" + 
		
		"<span arrow=\"1\" style=\"cursor:pointer\" onclick=\"show_calendar(pui.currentDateField"+
		", '"+dt2dtstr(dt_next_year)+"'+document.cal.time.value, '" + format + "');\">"+
		"<img arrow=\"1\" src=\"\/profoundui\/proddata\/images\/next_year.png\" width=\"16\" height=\"16\" border=\"0\""+
		" alt=\"next month\"></span>" + 
		
		"</td>\n</tr>\n"
	);
	var dt_current_day = new Date(dt_firstday);
	// print weekdays titles
	str_buffer += "<tr>\n";
	for (var n=0; n<7; n++)
		str_buffer += "	<td class=\"calendar brndrow2\" align=\"center\">"+
		"<font color=\"white\" face=\"verdana, tahoma\">"+
		week_days[(n_weekstart+n)%7]+"</font></td>\n";
	// print calendar table
	str_buffer += "</tr>\n";
	while (dt_current_day.getMonth() == dt_datetime.getMonth() ||
		dt_current_day.getMonth() == dt_firstday.getMonth()){
		// print row heder
		str_buffer += "<tr>\n";
		for (var n_current_wday = 0; n_current_wday < 7; n_current_wday++){
			if (dt_current_day.getDate() == dt_datetime.getDate() &&
			  	dt_current_day.getMonth() == dt_datetime.getMonth()) {
				// print current date
				str_buffer += "	<td class=\"calendar\" onmouseover=\"this.style.backgroundColor='yellow'\" onmouseout=\"this.style.backgroundColor='#FFB6C1'\" bgcolor=\"#FFB6C1\" align=\"right\"";
			}
			else if (dt_current_day.getDay() == 0 || dt_current_day.getDay() == 6) {
				// weekend days
				str_buffer += "	<td class=\"calendar\" onmouseover=\"this.style.backgroundColor='yellow'\" onmouseout=\"this.style.backgroundColor='#eeeeee'\" bgcolor=\"#eeeeee\" align=\"right\"";
			}
			else {
				// print working days of current month
				str_buffer += "	<td class=\"calendar\" onmouseover=\"this.style.backgroundColor='yellow'\" onmouseout=\"this.style.backgroundColor='white'\" bgcolor=\"white\" align=\"right\"";
      }
			if (dt_current_day.getDate() == today.getDate() &&
         dt_current_day.getMonth() == today.getMonth() &&
         dt_current_day.getYear() == today.getYear()) {
				// print today's date
				str_buffer += "	style=\"border: 2px solid #CCCCFF;\"";
			}
			if (dt_current_day.getMonth() == dt_datetime.getMonth()) {
				str_buffer += " onclick=\"javascript:pui.currentDateField"+
				".value='"+usa_dt(dt_current_day,format,dateField.formattingInfo)+"'; calendar_select();\">"+
				"<font color=\"black\" face=\"verdana, tahoma\">";
		  }
			else {
  			// print days of other months
				str_buffer += " onclick=\"javascript:pui.currentDateField"+
				".value='"+usa_dt(dt_current_day,format,dateField.formattingInfo)+"'; calendar_select();\">"+
				"<font color=\"gray\" face=\"verdana, tahoma\">";
		  }
			str_buffer += dt_current_day.getDate()+"</font></td>\n";
			dt_current_day.setDate(dt_current_day.getDate()+1);
		}
		// print row footer
		str_buffer += "</tr>\n";
	}
	// print calendar footer
	str_buffer +=
		"</table>\n" +
		"</tr>\n</td>\n</table>\n" +
		"<form name=\"cal\">"+
		"<input type=\"hidden\" name=\"time\" value=\""+dt2tmstr(dt_datetime)+
		"\">\n</form>\n";

	calobj = document.getElementById("popcal");
	var clickobj = dateField.calimg;
	calobj.style.width ="180px";
	calobj.innerHTML = str_buffer;
	
	var left = findPosX(clickobj) + 6;
	var top = findPosY(clickobj) + 1 + clickobj.firstChild.height;



  if (parseInt(dateField.style.top) > 250) {  // don't want calendar to bellow the bottom of the screen
    top -= 150;
    left += 11;
  }		

  var winSize = pui["getWindowSize"]();
  var maxLeft = winSize.width - 230; // 230 is the width of the popup calendar plus the scrollbar
  if (maxLeft < 0) maxLeft = 0;
  if (left > maxLeft) left = maxLeft;
	
	calobj.style.left = left + "px";
	calobj.style.top = top + "px";

	calobj.style.visibility = "visible";
}

function allZeros(strd) {
  for (var i = 0; i < strd.length; i++) {
    var ch = strd.substr(i,1);
    if (ch >= "1" && ch <= "9") return false;
  }
  return true;  
}

function str2dt(str_datetime){
	var re_date = /^(\d+)\-(\d+)\-(\d+)\s+(\d+)\:(\d+)\:(\d+)$/;
	var result = re_date.exec(str_datetime);
	if (!result) {
		// invalid date format
		return new Date();
  }
	return (new Date (result[3], result[2]-1, result[1], result[4], result[5], result[6]));
}
function dt2dtstr(dt_datetime){
	return (new String (
			dt_datetime.getDate()+"-"+(dt_datetime.getMonth()+1)+"-"+dt_datetime.getFullYear()+" "));
}
function usa_dt(dt_datetime, format, formattingInfo){

  var dateFormat = null;
  if (formattingInfo != null) {
    dateFormat = formattingInfo.dateFormat;
    if (dateFormat == null) {
      dateFormat = formattingInfo.customPattern;
    }
    if (dateFormat != null) {
      return dt_datetime.format(dateFormat, formattingInfo.locale);
    }
  }

  var month;
  var mon;
  var day;
  var dy;
  var yr;
  var yr2;
  var yr4;
  var returnVal;

  month       = new String(dt_datetime.getMonth() + 1);
  day         = new String(dt_datetime.getDate());
  yr          = new String(dt_datetime.getFullYear());

	mon=month;
	if(month.length==1) mon = "0" + month;
	
	dy=day;
	if(day.length==1) dy = "0" + day;
	if( yr.length == 4 ){
	  yr4 = yr;
	  yr = yr.substring(2,4);
	  yr2 = yr;
	}
	else{
	  yr2 = yr;
	  yr = yr.substring(yr.length - 2,yr.length);
	  yr4 = yr;
	}
	
	returnVal = format;
	returnVal = returnVal.replace("YYYY", yr4);
	returnVal = returnVal.replace("YY", yr2);
	returnVal = returnVal.replace("MM", mon);
	returnVal = returnVal.replace("DD", dy);
	
  return returnVal;
}
function usa_dtstr2str(str_date, format, formattingInfo) {
	if(str_date == null || str_date=="" || allZeros(str_date)) return "";

  var dateFormat = null;
  if (formattingInfo != null) {
    dateFormat = formattingInfo.dateFormat;
    if (dateFormat == null) {
      dateFormat = formattingInfo.customPattern;
    }
  	if (dateFormat != null) {
  	  var d = pui.formatting.Date.parse(str_date, dateFormat, formattingInfo.locale);
  	  if(d){
  	    return d.format('d-m-Y 00:00:00', formattingInfo.locale);
  	  }
  	}
 }
	
	var mo = "";	
	var moPos = format.indexOf("MM");
	if (moPos >= 0) mo = str_date.substr(moPos, 2);
	if (mo.substr(0,1) == " ") mo = "0" + mo.substr(1,1);
	
	var day = "";	
	var dayPos = format.indexOf("DD");
	if (dayPos >= 0) day = str_date.substr(dayPos, 2);
	if (day.substr(0,1) == " ") day = "0" + day.substr(1,1);
	
	var yr2 = "";
	var yr4 = "";
	var yr2Pos = format.indexOf("YY");
	var yr4Pos = format.indexOf("YYYY");
	if (yr4Pos >= 0) {
	  yr4 = str_date.substr(yr4Pos, 4);	
	}
	else {
	  if (yr2Pos >= 0) {
    	yr2 = str_date.substr(yr2Pos, 2);	
    	var century = 2000;
    	if (Number(yr2) > 39) century = 1900;
    	yr4 = Number(yr2) + century;
   }
  }
	
	var str=day+"-"+mo+"-"+""+yr4+" "+"00:00:00";
	
	return str;
}
function dt2tmstr (dt_datetime) {
	return (new String (dt_datetime.getHours()+":"+dt_datetime.getMinutes()+":"+dt_datetime.getSeconds()));
}
function findPosX(obj){
	var curleft = 0;
	if(obj.offsetParent)
		while(1){
		  curleft += obj.offsetLeft;
		  if(!obj.offsetParent) break;
		  obj = obj.offsetParent;
		}
	else if(obj.x) curleft += obj.x;
	return curleft;
}
function findPosY(obj){
	var curtop = 0;
	if(obj.offsetParent)
		while(1){
		  curtop += obj.offsetTop;
		  if(!obj.offsetParent) break;
		  obj = obj.offsetParent;
		}
	else if(obj.y) curtop += obj.y;
	return curtop;
}
function hide_calendar(){
  var id = 'popcal';
	if(calobj == null) return;
	var obj=document.getElementById(id);
	obj.style.visibility="hidden";
	calobj=null;
}

function calendar_select() {
  pui.currentDateField.modified = true;
  if (pui.currentDateField.id != null && pui.currentDateField.id.indexOf(".") == -1 && pui.currentDateField.cursorRecord != null) {
    // not a subfile field being modified
    pui.ctlRecModified[pui.currentDateField.cursorRecord] = true;
  }
  if (context == "genie" && pui.currentDateField.fieldInfo != null && pui.currentDateField.fieldInfo["idx"] != null) {
    pui.response[pui.currentDateField.fieldInfo["idx"]] = pui.currentDateField;
  }
  hide_calendar();

  var tip = pui.currentDateField.validationTip;
  if (tip != null) {
    tip.hide();
    tip.doneShowing = true;
    pui.removeCssClass(pui.currentDateField, "invalid");
  }

  try { pui.currentDateField.focus() }
  catch(e) {};
  if (pui.currentDateField.onchange != null) {
    pui.currentDateField.onchange();
  }
  pui.checkEmptyText(pui.currentDateField);
}

function cal(dateField, format) {
  if (format == null || format == "") {
    if (context == "genie") format = pui.genie.config.defaultDateFormat;
    else format = pui.defaultDateFormat;
  }
  if (format == null || format == "") format = "MM/DD/YY";  // default
  var calHTML = '<img src="/' + pui.normalizeURL('profoundui/proddata/images/cal.gif') + '" width="16px" height="16px" border="0" alt="">';
  var newElem = document.createElement("div");
  newElem.style.position = "absolute";
  newElem.style.width = "16px";
  newElem.innerHTML = calHTML;
	//newElem.style.left = findPosX(dateField) +  dateField.offsetWidth + 5 + "px";
	//newElem.style.top = findPosY(dateField) + "px";
	newElem.style.left = parseInt(dateField.style.left) +  dateField.offsetWidth + 5 + "px";
	var top = parseInt(dateField.style.top);
	top += parseInt((dateField.offsetHeight - 22) / 2);
	newElem.style.top = top + "px";
	newElem.style.visibility = dateField.style.visibility;
	newElem.style.display = "none";
	newElem.style.cursor = "pointer";
	if (dateField.style.zIndex != null) newElem.style.zIndex = dateField.style.zIndex;
  newElem.onclick = function(e) {
	  show_calendar(dateField, usa_dtstr2str(dateField.value, format, dateField.formattingInfo), format);
    if (!e) e = window.event;
    if (e) {
      e.cancelBubble = true;
      e.returnValue = false;
      if (e.preventDefault) e.preventDefault();
      if (e.stopPropagation) e.stopPropagation();
    }
    return false;
	}
	if (dateField.parentNode == null) return;
  dateField.parentNode.appendChild(newElem);
  dateField.calimg = newElem;
  
  gDateField[gDateCount++] = dateField;
  
  moveCal(dateField);
  if (document.getElementById("popcal") == null) {
    addEvent(document, "click", function(e) {
      var target = getTarget(e);
      var parent = target;
      while (parent != null) {
        if (parent.id == "popcal" || (parent.getAttribute != null && parent.getAttribute("arrow") == "1")) return;
        parent = parent.parentNode;
      }
    	hide_calendar();
    });
    var popcalDiv = document.createElement("div");
    popcalDiv.style.position = "absolute";
    popcalDiv.style.width = "180px";
    popcalDiv.style.zIndex = 100;
    popcalDiv.id = "popcal";
    document.body.appendChild(popcalDiv);
  }
}
function moveCal(dateField){
  var gCalImage = dateField.calimg;
  gCalImage.style.display = "none";
  //gCalImage.style.left = findPosX(dateField) +  dateField.offsetWidth + 5 + "px";
  //gCalImage.style.top = findPosY(dateField) + "px";
  gCalImage.style.left = parseInt(dateField.style.left) +  dateField.offsetWidth + 5 + "px";
  var top = parseInt(dateField.style.top);
	top += parseInt((dateField.offsetHeight - 22) / 2);
  gCalImage.style.top = top + "px";
  gCalImage.style.display = "block";
}
function moveCals() {
  for (var i = 0; i < gDateCount; i++) {
    moveCal(gDateField[i]);
  }
}


pui.widgets.add({
  name: "date field",
  tag: "input",
  newId: "Date",
  pickIcon1: pui.normalizeURL("/profoundui/proddata/images/cal.gif"),
  defaults: {
    "css class": "input"
  },

  propertySetters: {
  
    "field type": function(parms) {
      parms.dom.value = parms.evalProperty("value");
      if (!parms.design) {
        if (parms.dom.tagName == "INPUT" && !parms.dom.readOnly && !parms.dom.disabled) {
          var format; 
          format = parms.properties["date format"];
          if (format == null || format == "") {
            if (context == "genie") format = pui.genie.config.defaultDateFormat;
            else format = pui.defaultDateFormat;
          }
          if (format == null || format == "") format = "MM/DD/YY";  // default format
          setTimeout(function() { if (parms.dom.calimg == null) cal(parms.dom, format); }, 1);
        }
        if (pui.iPadEmulation && !pui.iPhoneEmulation) {
          addEvent(parms.dom, "focus", function(event) {
            getObj("ipadKeyboard").style.display = "";
          });
          addEvent(parms.dom, "blur", function(event) {
            getObj("ipadKeyboard").style.display = "none";
          });
        }
      }
      if (parms.design) parms.dom.readOnly = true;
    },
    
    "value": function(parms) {
      parms.dom.value = parms.value;
    }
  
  }
  
});



