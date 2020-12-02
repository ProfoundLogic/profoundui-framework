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




var calobj=null;
var gDateField = new Array(); 
var gDateCount = 0;
pui.currentDateField = null;

function show_calendar(dateField, str_datetime, format) {
  var arr_months, week_days;
  var locale;
  var n_weekstart = 0;
  var weekHead;
  var showWeekNum = "false";
  if (dateField.puiShowWeekNumber != null && dateField.puiShowWeekNumber === "true"){
    showWeekNum = dateField.puiShowWeekNumber;
  }

  if (pui["locale"] && pui.locales[pui["locale"]])
    locale = pui["locale"];
  else {
    
    if (context == "dspf" && dateField.formattingInfo)
      locale = dateField.formattingInfo.locale;
    else if (context == "genie")
      locale = pui.genie.config["locale"];
    if (locale == "")
      locale = null;
    
  }
  if (locale) {
    arr_months = pui.locales[locale]['monthNames'];
    dayNames = pui.locales[locale]['shortDayNames'];
    if(pui.locales[locale]['weekNumberShort']){
      var weekHead = pui.locales[locale]['weekNumberShort'];
    }
    else if(showWeekNum == "true"){weekHead = "Wk";}

    week_days = [];
    if (pui.locales[locale]['weekStart'])
      n_weekstart = pui.locales[locale]['weekStart'];
    for(var i=0; i<dayNames.length; i++){
      week_days.push(dayNames[i]);
    }
  }
  else{
    arr_months = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
    week_days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
    if(showWeekNum == "true"){weekHead = "Wk";}
  }

  pui.currentDateField = dateField;
  
  var dt_datetime = (str_datetime == null || str_datetime == "" ?  new Date() : str2dt(str_datetime));
  if(dt_datetime==null) dt_datetime = new Date();

  var curMonth = dt_datetime.getMonth();
  var dt_prev_month = new Date(dt_datetime);
  dt_prev_month.setMonth(curMonth - 1);
  // check if the date stayed in the same month, and if so go back (in JavaScript, substracting a month from March 31st gives you March 3rd, February being a short month)
  while (dt_prev_month.getMonth() == curMonth) {
    dt_prev_month.setDate(dt_prev_month.getDate() - 1);
  }
  var dt_next_month = new Date(dt_datetime);
  dt_next_month.setMonth(curMonth + 1);
  // check if the date overflowed to the following month, and if so go back (in JavaScript, adding a month to January 31st gives you a date in the beginning of March)
  var next = curMonth + 1;
  if (next == 12) next = 0;
  while (dt_next_month.getMonth() != next) {
    dt_next_month.setDate(dt_next_month.getDate() - 1);
  }
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

  var outerTable = document.createElement("table");
  outerTable.className = "pui-calendar-outer-table";

  var outerBody = document.createElement("tbody");
  outerTable.appendChild(outerBody);
  
  var otRow = document.createElement("tr");
  outerBody.appendChild(otRow);

  var otCell = document.createElement("td");
  otCell.className = "brndrow1";
  otRow.appendChild(otCell);

  var innerTable = document.createElement("table");
  innerTable.className = "pui-calendar-inner-table";
  otCell.appendChild(innerTable);

  var innerBody = document.createElement("tbody");
  innerTable.appendChild(innerBody);

  var itRow = document.createElement("tr");
  innerBody.appendChild(itRow);
  
  var arrowsPrevYear = document.createElement("td");
  arrowsPrevYear.className = "brndrow1";
  arrowsPrevYear.colSpan = "1";

  var prevYear = document.createElement("span");
  prevYear.setAttribute("arrow", "1");
  prevYear.className = "pui-calendar-arrow-prev-year";
  var prevYearString = dt2dtstr(dt_prev_year);
  prevYear.onclick = function(e) { 
    show_calendar(pui.currentDateField, prevYearString + document.cal.time.value, format);
    preventEvent(e);
  };
  arrowsPrevYear.appendChild(prevYear);
  itRow.appendChild(arrowsPrevYear);
  
  var arrowsPrevMonth = document.createElement("td");
  arrowsPrevMonth.className = "brndrow1";
  arrowsPrevMonth.colSpan = "1";
  
  var prevMonth = document.createElement("span");
  prevMonth.setAttribute("arrow", "1");
  prevMonth.className = "pui-calendar-arrow-prev-month";
  var prevMonthString = dt2dtstr(dt_prev_month);
  prevMonth.onclick = function(e) { 
    show_calendar(pui.currentDateField, prevMonthString + document.cal.time.value, format);
    preventEvent(e);
  };
  arrowsPrevMonth.appendChild(prevMonth);
  itRow.appendChild(arrowsPrevMonth);

  var monthYear = document.createElement("td");
  monthYear.className = "calendar brndrow1 pui-calendar-month-year-header";
  monthYear.colSpan = "3";
  if(showWeekNum == "true"){monthYear.colSpan = "4";}
  monthYear.innerHTML = arr_months[dt_datetime.getMonth()] + " " + dt_datetime.getFullYear();
  itRow.appendChild(monthYear);

  var arrowsNextMonth = document.createElement("td");
  arrowsNextMonth.className = "brndrow1 pui_calendar_brndrow1_right";
  arrowsNextMonth.colSpan = "1";

  var nextMonth = document.createElement("span");
  nextMonth.setAttribute("arrow", "1");
  nextMonth.className = "pui-calendar-arrow-next-month";
  var nextMonthString = dt2dtstr(dt_next_month);
  nextMonth.onclick = function(e) { 
    show_calendar(pui.currentDateField, nextMonthString + document.cal.time.value, format);
    preventEvent(e);
  };
  arrowsNextMonth.appendChild(nextMonth);
  itRow.appendChild(arrowsNextMonth);

  var arrowsNextYear = document.createElement("td");
  arrowsNextYear.className = "brndrow1 pui_calendar_brndrow1_right";
  arrowsNextYear.colSpan = "1";

  var nextYear = document.createElement("span");
  nextYear.setAttribute("arrow", "1");
  nextYear.className = "pui-calendar-arrow-next-year";
  var nextYearString = dt2dtstr(dt_next_year);
  nextYear.onclick = function(e) { 
    show_calendar(pui.currentDateField, nextYearString + document.cal.time.value, format);
    preventEvent(e);
  };
  arrowsNextYear.appendChild(nextYear);
  itRow.appendChild(arrowsNextYear);

  var dt_current_day = new Date(dt_firstday);

  // print weekdays titles
  var weekdays = document.createElement("tr");
  if(weekHead){
    var weekName = document.createElement("td");
    weekName.className = "calendar brndrow2 pui-calendar-week-number-header";
    weekName.innerHTML = weekHead;
    weekdays.appendChild(weekName);
  }
  for (var n=0; n<7; n++) {
    var dayName = document.createElement("td");
    dayName.className = "calendar brndrow2 pui-calendar-weekday-header";
    dayName.innerHTML = week_days[(n_weekstart+n)%7];
    weekdays.appendChild(dayName);
  }

  innerBody.appendChild(weekdays);

  // print calendar table
  
  while (dt_current_day.getMonth() == dt_datetime.getMonth() ||
           dt_current_day.getMonth() == dt_firstday.getMonth()) {

    //calculate default week number
    if(showWeekNum == "true"){
      if(weekNum == null) {var weekNum = 1;}
      var startDate = dt_current_day;
      if(startDate.getDay() == n_weekstart){
        // Get Thursday in current week -- this will also mdetrmine which year the week is in
        var currentThursday = new Date(startDate.getTime());
        currentThursday.setHours(0, 0, 0, 0);
        if(n_weekstart == 0){currentThursday.setDate(currentThursday.getDate() + 4);}
        else if(n_weekstart == 1){currentThursday.setDate(currentThursday.getDate() + 3);}
        else if(n_weekstart == 6){currentThursday.setDate(currentThursday.getDate() + 5);}
        
        // January 4 is always in week 1.
        var Jan4 = new Date(currentThursday.getFullYear(), 0, 4);
        // Get the Thursday in week 1 and calculate the number of weeks from current week to week 1.
        weekNum = 1 + Math.round(((currentThursday.getTime() - Jan4.getTime()) / 86400000
                              - 3 + (Jan4.getDay() + 6) % 7) / 7);
      }
      
      if (typeof pui["week number calculator"] == "function") {
        weekNum = pui["week number calculator"](startDate);
      }
    }
    // print row header
    var dayRow = document.createElement("tr");

    //Create week number cell only at the start of the week
    if(showWeekNum == "true" && dt_current_day.getDay() == n_weekstart){
      var weekNumCell = document.createElement("td");
      var weekNumClass = "calendar pui-calendar-week-number";
      weekNumCell.className = weekNumClass;
      weekNumCell.innerHTML = weekNum;
      dayRow.appendChild(weekNumCell);
    }

    for (var n_current_wday = 0; n_current_wday < 7; n_current_wday++){

      var oneDay = document.createElement("td");
      var dayClass;

      if (dt_current_day.getDate() == dt_datetime.getDate() &&
          dt_current_day.getMonth() == dt_datetime.getMonth()) {
        // print current date
        dayClass = "calendar pui-calendar-selected-date";
      }
      else if (dt_current_day.getDay() == 0 || dt_current_day.getDay() == 6) {
        // weekend days
        dayClass = "calendar pui-calendar-weekend-date";
      }
      else {
        // print working days of current month
        dayClass = "calendar pui-calendar-workday-date";
      }
      
      if (dt_current_day.getDate() == today.getDate() &&
         dt_current_day.getMonth() == today.getMonth() &&
         dt_current_day.getYear() == today.getYear()) {
        // print today's date
        dayClass += " pui-calendar-current-date";
      }

      if (dt_current_day.getMonth() == dt_datetime.getMonth()) {
        dayClass += " pui-calendar-day-active-month";
      }
      else {
        dayClass += " pui-calendar-day-inactive-month";
      }

      oneDay.className = dayClass;
      oneDay.puiCurrentDate = usa_dt(dt_current_day, format, dateField.formattingInfo);

      oneDay.onclick = function(e) {
        pui.currentDateField.value = e.target.puiCurrentDate;
        calendar_select();
        preventEvent(e);
      }

      oneDay.innerHTML = dt_current_day.getDate();
      dayRow.appendChild(oneDay);
      
      dt_current_day.setDate(dt_current_day.getDate()+1);
    }
    
    innerBody.appendChild(dayRow);

  }

  if (dateField.puiShowToday != null && dateField.puiShowToday === "true") {
    var todayButtonRow = document.createElement("tr");
    innerBody.appendChild(todayButtonRow);
  
    var todayButtonCell = document.createElement("td");
    todayButtonCell.className = "pui-calendar-today-button-row";
    todayButtonCell.colSpan = "7";
    if(showWeekNum == "true"){todayButtonCell.colSpan = "8";}
    todayButtonRow.appendChild(todayButtonCell);
     
    var todayButton = document.createElement("span");
    todayButton.className = "pui-calendar-today-button";
    todayButton.innerHTML = "Today";
    todayButton.onclick = function(e) {
      var currentDate = usa_dt(today, format, dateField.formattingInfo);
      pui.currentDateField.value = currentDate;
      show_calendar(pui.currentDateField, document.cal.time.value, format);
      preventEvent(e);
    }
    todayButtonCell.appendChild(todayButton);
  }

  var calForm = document.createElement("form");
  calForm.name = "cal";

  var hiddenTime = document.createElement("input");
  hiddenTime.type = "hidden";
  hiddenTime.name = "time";
  hiddenTime.value = dt2tmstr(dt_datetime);
  calForm.appendChild(hiddenTime);
 
  calobj = document.getElementById("popcal");
  calobj.innerHTML = "";

  calobj.className = "pui-calendar";
  var cls = trim(dateField.className.split(" ")[0]);
  if (cls != "")
    calobj.className += " pui-calendar-" + cls;
  
  var clickobj = dateField.calimg;
  calobj.appendChild(outerTable);
  calobj.appendChild(calForm);
  
  var offset = pui.getOffset(clickobj);
  var left = offset[0] + 6;
  var top = offset[1] + 1 + clickobj.offsetHeight; 



  if (dateField.offsetTop > 250) {  // don't want calendar to go below the bottom of the screen
    top -= 150;
    left += 11;
  }    

  var winSize = pui["getWindowSize"]();
  var max = winSize["width"] - 250; // 250 is the width of the popup calendar (table) plus the scrollbar.
  if (max < 0) max = 0;
  if (left > max) left = max;
  
  max = Math.max(0, winSize["height"] - 170 + window.pageYOffset); //the popup height + 11px.
  if (top > max) top = max;
  
  calobj.style.left = left + "px";
  calobj.style.top = top + "px";

  // Using setTimeout() to prevent the 'click' event from "bleeding through" to the 
  //  popup calendar when using pui.showCalendar() on Android.
  setTimeout( function() { calobj.style.visibility = "visible"; }, 0 );
}

function allZeros(strd) {
  for (var i = 0; i < strd.length; i++) {
    var ch = strd.substr(i,1);
    if (ch >= "1" && ch <= "9") return false;
  }
  return true;  
}

function allDigits(strd) {
  for (var i = 0; i < strd.length; i++) {
    var ch = strd.substr(i,1);
    if (ch < "0" || ch > "9") return false;
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
    var locale;
    if (pui["locale"] && pui.locales[pui["locale"]])
      locale = pui["locale"]; 
    else
      locale = formattingInfo.locale;
      dateFormat = formattingInfo.dateFormat;
      if (dateFormat == null) {
        dateFormat = formattingInfo.customPattern;
      }
      if ((dateFormat == '' || dateFormat == null) && (pui['default date pattern'])){
       dateFormat = pui['default date pattern'];
      }   
    }

    if (dateFormat != null) {
      return dt_datetime.format(dateFormat, locale);
    }

  if (formattingInfo != null && formattingInfo["dataLength"] == "8" && formattingInfo["decPos"] == "0" && (format == "MM/DD/YY" || format == "DD/MM/YY")) {
    format += "YY";
  }
  if (formattingInfo != null && formattingInfo["dataLength"] == "6" && formattingInfo["decPos"] == "0" && (format == "MM/DD/YYYY" || format == "DD/MM/YYYY")) {
    format = format.substr(0,6);
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

  var ch1 = str_date.substr(0,1);
  var ch2 = str_date.substr(1,1);
  if (ch1 >= "1" && ch1 <= "9" && ch2 == "/") str_date = "0" + str_date;

  if (formattingInfo != null && formattingInfo["edtWrd"] != null && formattingInfo["edtWrd"] != "" && allDigits(str_date)) {
    if ( (formattingInfo["edtWrd"] == "'  /  /  '" && str_date.length == 6) ||
         (formattingInfo["edtWrd"] == "'  /  /    '" && str_date.length == 8)) {
      str_date = str_date.substr(0,2) + "/" + str_date.substr(2,2) + "/" + str_date.substr(4);
    }
  }
  
  if (formattingInfo != null && formattingInfo["dataLength"] == "8" && formattingInfo["decPos"] == "0" && (format == "MM/DD/YY" || format == "DD/MM/YY")) {
    format += "YY";
  }
  if (formattingInfo != null && formattingInfo["dataLength"] == "6" && formattingInfo["decPos"] == "0" && (format == "MM/DD/YYYY" || format == "DD/MM/YYYY")) {
    format = format.substr(0,6);
  }

  var dateFormat = null;
  if (formattingInfo != null) {
     dateFormat = formattingInfo.dateFormat;   
     if (dateFormat == null) {
       dateFormat = formattingInfo.customPattern;
      }
      if ((dateFormat == '' || dateFormat == null) && (pui['default date pattern'])){
       dateFormat = pui['default date pattern'];
      };     
     if (dateFormat != null) {
      if (pui["locale"] && pui.locales[pui["locale"]])
        locale = pui["locale"]; 
      else
        locale = formattingInfo.locale;      
      var d = pui.formatting.Date.parse(str_date, dateFormat, locale);
      if(d){
        return d.format('d-m-Y 00:00:00', locale);
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
function hide_calendar(){
  var id = 'popcal';
  if(calobj == null) return;
  var obj=document.getElementById(id);
  obj.style.visibility="hidden";
  calobj=null;
}

function calendar_select() {
  pui.currentDateField.modified = true;
  pui.updateReactState(pui.currentDateField);
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
    pui.removeCssClass(pui.currentDateField, tip.getInvalidClass());
  }

  try { pui.currentDateField.focus(); }
  catch(e) {};
  if (pui.currentDateField.onchange != null) {
    pui.currentDateField.onchange();
  }
  if (pui.currentDateField.oninput != null) {
    pui.currentDateField.oninput();
  }
  pui.checkEmptyText(pui.currentDateField);
}

function cal(dateField, format) {
  if (format == null || format == "") {
    if (context == "genie") format = pui.genie.config.defaultDateFormat;
    else format = pui.defaultDateFormat;
  }
  if (format == null || format == "") format = "MM/DD/YY";  // default
  var newElem = document.createElement("div");
  newElem.className = "pui-calendar-icon";
  if (dateField["cal icon class"]) newElem.className = "pui-calendar-icon " + dateField["cal icon class"]; 
  newElem.style.left = parseInt(dateField.style.left) +  dateField.offsetWidth + 5 + "px";
  var top = parseInt(dateField.style.top);
  top += parseInt((dateField.offsetHeight - 22) / 2);
  newElem.style.top = top + "px";
  newElem.style.visibility = dateField.style.visibility;

  // If original field's visiblity was hidden with 5250 attr code (instead of 'visiblity' property)
  // then also hide the calendar image.
  if (dateField.pui==null || dateField.pui.properties==null || dateField.pui.properties["visibility"]==null || dateField.pui.properties["visibility"]=="") {
    if ( context=="genie" && dateField.fieldInfo!=null && dateField.fieldInfo["attr"]!=null ) {
      var attr = dateField.fieldInfo["attr"];
      if (attr == "27" || attr == "2F" || attr == "37" || attr == "3F") {
        newElem.style.visibility = "hidden";      
      }
    }
  }
  
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
  };
  if (dateField.parentTab!=null && dateField.parentTabPanel!=null) {
    newElem.parentTab = dateField.parentTab;
    newElem.parentTabPanel = dateField.parentTabPanel;
  }

  dateField.calimg = newElem;
  gDateField[gDateCount++] = dateField;
  if (dateField.parentNode == null) {
	  dateField.calimg.needsToBeMoved = true;
	  return;
  }
  dateField.parentNode.appendChild(newElem);
  pui.moveCal(dateField);
  dateField.calimg.needsToBeMoved = false;
 
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
    popcalDiv.style.visibility = "hidden";
    popcalDiv.id = "popcal";
    document.body.appendChild(popcalDiv);
  }
}
pui.moveCal = function(dateField){
  var gCalImage = dateField.calimg;
  if (gCalImage == null) return;
  gCalImage.style.display = "none";
  gCalImage.style.left = dateField.offsetLeft + dateField.offsetWidth + 5 + "px";
  var top = dateField.offsetTop;
  top += parseInt((dateField.offsetHeight - 22) / 2);
  gCalImage.style.top = top + "px";
  gCalImage.style.display = "block";
};
pui.moveCals = function() {
  for (var i = 0; i < gDateCount; i++) {
    pui.moveCal(gDateField[i]);
  }
};

pui.removeCal = function(dateField) {
  var cal = dateField.calimg;
  if (cal) {
    cal.parentNode.removeChild(cal);
    dateField.calimg = null;
  }
};


pui.widgets.add({
  name: "date field",
  tag: "input",
  newId: "Date",
  pickIcon1: pui.normalizeURL("/profoundui/proddata/images/cal.gif"),
  icon1Class: 'input pui-cal pui-cal-input',
  pickIcon1IsDiv: true, 
  defaults: {
    "css class": "input"
  },

  propertySetters: {
  
    "field type": function(parms) {
      parms.dom.value = parms.evalProperty("value");
      parms.dom.puiShowToday = parms.evalProperty("show today option");
      if (!parms.design) {
        if (parms.dom.tagName == "INPUT" && !parms.dom.readOnly && !parms.dom.disabled) {
          var format; 
          if (parms.properties["date format"]) {
            format = parms.properties["date format"];
          } else {
            if (context == "genie") format = pui.genie.config.defaultDateFormat;
            if (!format) {
              if (pui.defaultDateFormat) {
                format = pui.defaultDateFormat;
              } else {
                format = "MM/DD/YY";  // default format
              }
            }
          } 
          setTimeout(function() { 
          
            // Not sure why this code runs on a 1s time delay -- I found it this way. 
            // But, what happens is that automatic detect/attach of calendar in Genie runs before this, 
            // so the 'cal()' function does not run here. 
            
            // This means that it was impossible to change widget-level 'date format' to something other than 
            // Genie's configuration or screen-level value. 
            
            // -- DR.
          
            if (parms.dom.calimg == null) {
              cal(parms.dom, format); 
            }
            else if (context == "genie") {
              // Force recreate calendar, due to above -- DR.
              pui.removeCal(parms.dom);
              cal(parms.dom, format);  
            }
            
          }, 1);
          // Default off if not set by 'html auto complete' property.
          if (parms.dom.getAttribute("autocomplete") == null && (context != "genie" || !pui.genie.config.browserAutoComplete)) {
            parms.dom.setAttribute("autocomplete", "off");
            if (context == "dspf")
              parms.dom.setAttribute("name", pui.randomTextBoxName());
          }
        }
        if (pui.iPadEmulation && !pui.iPhoneEmulation) {
          addEvent(parms.dom, "focus", function(event) {
            getObj("ipadKeyboard").style.display = "";
          });
          addEvent(parms.dom, "blur", function(event) {
            getObj("ipadKeyboard").style.display = "none";
          });
        }
        parms.dom.sizeMe = function() {
          pui.moveCal(parms.dom);
        };
        parms.dom.positionMe = function() {
          pui.moveCal(parms.dom);
        };
      }
      if (parms.design) {
        parms.dom.readOnly = true;
        parms.dom.sizeMe = function() {
          var itm = parms.designItem;
          itm.drawIcon();
          itm.mirrorDown();
        };
        parms.dom.positionMe = function() {
          var itm = parms.designItem;
          itm.drawIcon();
          itm.mirrorDown();
        };
      }
    },
    "value": function(parms) {
      parms.dom.value = parms.value;
    },
    "input type": function(parms) {
      try {
        if (!parms.design) parms.dom.setAttribute("type", parms.value);
      } catch(e) { }
    },
    "visibility": function(parms) {
      if (parms.dom.calimg) {
        if (parms.value == "hidden") {
          parms.dom.calimg.style.visibility = "hidden"; 
        } else {    
          parms.dom.calimg.style.visibility = ""; 
        }        
      }
    },
    "disabled": function(parms) {
      if (parms.dom.calimg) {
        if (parms.value == "true") {
          parms.dom.calimg.style.visibility = "hidden";
        } else {
          parms.dom.calimg.style.visibility = "";
        }        
      }
    },
    "css class": function(parms) {
      var className = parms.value.split(" ").shift();
      className = "pui-cal pui-cal-" + className + " pui-calendar-icon";
      if (parms.design) {
        var icon = parms.designItem.icon1;
        icon.className = className;
        parms.dom["icon1 class"] = className;
      } else {
        if (parms.dom.calimg) {
          parms.dom.calimg.className = className; 
        } else {
          parms.dom["cal icon class"] = className;
        }
      }
    },
    "show today option": function(parms) {
       parms.dom.puiShowToday = parms.value;
    },
    "show week number": function(parms) {
      //For displaying week number with in a set cycle length (ex. 1 year = 52)
      parms.dom.puiShowWeekNumber = parms.value;
    },
    "browser auto complete": function(parms) {
      if (!parms.design) {
        parms.dom.setAttribute("autocomplete", parms.value);
        if (context == "dspf") {
          if (parms.value == "off")
            parms.dom.setAttribute("name", pui.randomTextBoxName());
          else
            parms.dom.removeAttribute("name");
        }
      }
    }
  }
  
});



