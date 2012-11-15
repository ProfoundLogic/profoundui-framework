
/**
 * Locales Class
 * @constructor
 */

pui.Locales = function() {
  // private variables
  var me = this;
  var localeArray = [];

  // public methods
  this.getLocales = function() {
    return localeArray;
  };
    
  this.add = function(obj) {
    var name = obj.name;
    if (name !== null) {
      for(var i=0; i<localeArray.length; i++){
        if(obj.text < localeArray[i].text){
          break;
        }
      }
      // add locale to the array where it belongs (alphabetically by name)
      localeArray.splice(i, 0, obj);
      me[name] = obj;
    }
  };
  
};

pui.locales = new pui.Locales();