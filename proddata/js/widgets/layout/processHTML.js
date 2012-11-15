
pui.layout.template.processHTML = function(parms) {
  
  var html = pui.layout.templates[parms.template];
  var properties = parms.properties;
  var designMode = parms.designMode;
  var proxyMode = parms.proxyMode;
  var returnProps = parms.returnProps;
  var existingDom = parms.dom;

  var propList = {};
  
  function findDynamicPart() {
    var start = html.indexOf("{");
    if (start == -1) return null;
    var end = null;
    var inDoubleQuote = false;
    var inSingleQuote = false;
    var level = 0;
    for (var i = start; i < html.length; i++) {
      var ch = html.substr(i, 1);
      if (ch == "'") {
        inDoubleQuote = !inDoubleQuote;
        continue;
      }
      if (ch == '"') {
        inSingleQuote = !inSingleQuote;
        continue;
      }
      if (inDoubleQuote || inSingleQuote) continue;
      if (ch == "{") level += 1;
      if (ch == "}") level -= 1;
      if (level == 0) {
        end = i;
        break;
      }
    }
    if (end == null) return null;
    return {
      start: start,
      end: end
    }
  }
  
  function evalProperty(obj) {
    if (obj == null) return "";
    if (typeof obj == "string") return obj;
    if (typeof obj == "number" || typeof obj == "boolean") return String(obj);
    if (typeof obj == "object") {
      var prop = obj["property"];
      if (returnProps) {
        if (prop != null) {
          obj.name = prop;
          obj.bind = false;
          propList[prop] = obj;
        }
        return "";
      }
      var propValue = null;
      if (prop != null) propValue = properties[prop];
      if (propValue == null) propValue = obj["defaultValue"];
      if (propValue == null) propValue = "";
      if (typeof propValue == "object") return evalProperty(propValue);
      return propValue;
    }
    return "";
  }
  
  function evalDynamicObj(obj) {
    if (obj["designValue"] != null || obj["runtimeValue"] != null || obj["proxyValue"] != null) {
      var rv;
      if (designMode || returnProps) rv = evalProperty(obj["designValue"]);
      if (!designMode || returnProps) rv = evalProperty(obj["runtimeValue"]);
      if (proxyMode && obj["proxyValue"] != null) rv = obj["proxyValue"];
      return rv;
    }
    else if (obj["property"] != null) {
      return evalProperty(obj);
    }
  }
  
  function evalDynamicPart(part) {
    var obj;
    var expression = "(" + html.substring(part.start, part.end + 1) + ")";
    var obj = null;
    try {
      obj = eval(expression);
    }
    catch(e) { };
    if (obj == null) return "";
    return evalDynamicObj(obj);
  }

  function replaceDynamicPart(part, newValue) {
    html = html.substr(0, part.start) + newValue + html.substr(part.end + 1);
  }
  
  var dynamicPart = findDynamicPart();
  while (dynamicPart != null) {
    var newValue = evalDynamicPart(dynamicPart);
    replaceDynamicPart(dynamicPart, newValue);
    dynamicPart = findDynamicPart();
  }
  
  if (returnProps) {
    var propArray = [];
    var model = pui.layout.getPropertiesModel();
    for (var i = 0; i < model.length; i++) {
      if (model[i].templateProperties == true) {
        for (var prop in propList) {
          propArray.push(propList[prop]);
        }      
      }
      else {
        propArray.push(model[i]);
      }
    }
    return propArray;
  }
  else {
    var dom;
    if (existingDom != null) {
      dom = existingDom.cloneNode(false);
    }
    else {
      dom = document.createElement("div");
    }
    dom.innerHTML = html;
    return dom;
  }
}

