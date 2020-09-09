
var customers = {
  "123": "ABC Company",
  "124": "XYZ Company",
  "125": "PLS, Inc."
}

var data = {};

function customerInquiry() {
  pui.show({
    path: "../custInq.json",
    data: data,
    handler: function(response) {
      pui.applyResponse(data, response);
      if (response["btnExit"] == "1") {
        document.body.innerHTML = "<br/>You have exited the application.";
        return;
      }
      var customerNumber = response["CSID"];
      if (customerNumber != null) data["CSNAME"] = customers[customerNumber];
      customerInquiry();
    } 
  });
}
