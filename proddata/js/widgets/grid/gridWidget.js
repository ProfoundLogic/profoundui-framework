

pui.widgets.add({
  name: "grid",
  customSizing: true,
  canBelongToGrid: false,
  defaults: {
    //"font family": "Verdana",
    //"font size": "13px",
    //"text align": "center",
    "number of rows": "7",
    "number of columns": "3",
    "column widths": "150,150,150",
    "column headings": "Heading 1,Heading 2,Heading 3"
  },
  
  globalPropertySetter: function(parms) {
    if (parms.dom.grid == null) {
      parms.dom.grid = new pui.Grid();
      parms.dom.grid.container = parms.dom.parentNode;
      parms.dom.grid.tableDiv = parms.dom;
      
      // improve performance in IE (IE is very slow when setting the .scrollTop property on a div)
      if (is_ie && !parms.design && parms.properties["scrollbar"] == "paging" && context == "dspf") {
        parms.dom.grid.dontSetPagingScrollTop = true;
        setTimeout(function() {
          parms.dom.grid.dontSetPagingScrollTop = false;
          if (parms.dom.grid.scrollbarObj != null) parms.dom.grid.scrollbarObj.draw()
        }, 0);
      }
      
      if (parms.properties["css class"] != null && parms.properties["css class"] != "") {
        parms.dom.className = parms.properties["css class"];
        parms.dom.grid.cellProps = {};
        parms.dom.grid.cellPropDefaults = {};
      }
      if (!parms.dom.style.top) parms.dom.style.top = "0px";
      if (!parms.dom.style.left) parms.dom.style.left = "0px";
      parms.dom.propertiesModel = parms.dom.grid.getPropertiesModel();
      parms.dom.propertiesNamedModel = makeNamedModel(parms.dom.propertiesModel);
      parms.dom.grid.setProperty("has header", parms.properties["has header"]);
      if (parms.design) {
        parms.designItem.multipleSelection = false;
        parms.dom.grid.setProperty("number of rows", parms.properties["number of rows"]);
        parms.dom.grid.setProperty("number of columns", parms.properties["number of columns"]);
        parms.dom.grid.setProperty("column widths", parms.properties["column widths"]);
        parms.dom.grid.setProperty("column headings", parms.properties["column headings"]);
        parms.dom.grid.setAllCellStyles();
        parms.dom.grid.sizeAllCells();      
        parms.dom.grid.setHeadings();
      }
      else {
        if (context == "dspf" && parms.properties["cursor progression"] != "top to bottom") {
          // set up the columns first, so that rows are later, creating the cells from left to right
          parms.dom.grid.setProperty("number of columns", parms.properties["number of columns"]);
        }
        if (context == "dspf" && parms.properties["cursor progression"] == "top to bottom") {
          // set up the rows first, so that columns are added later, creating the cells from top to bottom
          parms.dom.grid.setProperty("number of rows", parms.properties["number of rows"]);
        }
      }
    }
    if (parms.propertyName == "field type") {
      parms.dom.sizeMe = function() {
        if (parms.dom.grid.expandToLayout) parms.dom.grid.doExpandToLayout();
      }
      if (parms.design) {
        var rowHeight = parseInt(parms.properties["row height"]);
        if (!isNaN(rowHeight) && rowHeight > 0) parms.dom.grid.rowHeight = rowHeight;
        if (!parms.dom.grid.designMode) {
          parms.dom.grid.enableDesign();
          parms.dom.grid.setProperty("show paging controls", parms.properties["show paging controls"]);
          parms.dom.grid.setProperty("csv export", parms.properties["csv export"]);
        }
        parms.dom.designItem = parms.designItem;
        parms.designItem.multipleSelection = false;
      }
      parms.dom.style.borderWidth = "0px";
      parms.dom.style.padding = "0px";
      parms.dom.initTop = parms.properties["top"];
      function setPropIfThere(prop) {
        if (parms.properties[prop] != null && parms.properties[prop] != "") {
          parms.dom.grid.setProperty(prop, parms.properties[prop]);
        }
      }
      setPropIfThere("header image");
      setPropIfThere("header background");
      setPropIfThere("header font color");
      setPropIfThere("header font size");
      setPropIfThere("header height");
      setPropIfThere("header font weight");
      setPropIfThere("header font family");
      setPropIfThere("odd row background");
      setPropIfThere("even row background");
      setPropIfThere("hover effect");
      setPropIfThere("hover image");
      setPropIfThere("hover background");
      setPropIfThere("hover font color");
      setPropIfThere("header text align");
      setPropIfThere("row height");
      setPropIfThere("border color");
    }
    parms.dom.grid.setProperty(parms.propertyName, parms.value);
  },
  
  initialize: function(parms) {
    var sql = null;
    if (!parms.design && parms.dom != null && parms.dom.grid != null) {
      parms.dom.grid.setAllCellStyles();
      parms.dom.grid.sizeAllCells();      
      parms.dom.grid.setHeadings();
      if (parms.dom.grid.pagingBar != null) {
        parms.dom.grid.pagingBar.draw();
        parms.dom.grid.pagingBar.position();
      }
    }
    
    // reset top since other properties may have affected it
    if (parms.dom.initTop) parms.dom.grid.setProperty("top", parms.dom.initTop);
    parms.dom.initLeft = parms.properties["left"];    

    if (context == "genie" && !parms.design && parms.dom != null && parms.dom.grid != null) {
      parms.dom.grid.consumeDataFromScreen(1, true);
    }
  }
    
});




