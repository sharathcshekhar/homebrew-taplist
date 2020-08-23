var ss = SpreadsheetApp.openByUrl(PropertiesService.getScriptProperties().getProperty('url'));

function doPost(e) {
  
  if (e.parameter.access_key != PropertiesService.getScriptProperties().getProperty('wr-access-key')) {
    throw new Error("Wrong Access Key");
  }
  
  var tap = e.parameter.tap;
  if (tap != "1" && tap != "2") {
    throw new Error("Tap number can be 1 or 2");
  }
  
  var sheet = ss.getSheetByName('Tap-' + tap);
  
  var action = e.parameter.action;
  
  if(action == 'addItem'){
    return addItem(e, sheet);
  }
}


function doGet(e) {
  if (e.parameter.access_key != PropertiesService.getScriptProperties().getProperty('rd-access-key')) {
    throw new Error("Wrong Access Key");
  }
  var tap = e.parameter.tap;
  if (tap != "1" && tap != "2") {
    throw new Error("Tap number can be 1 or 2");
  }
  var sheet = ss.getSheetByName('Tap-' + tap);
  
  var action = e.parameter.action;
  if(action == 'getRaw'){
    return getRawValues(sheet);
  } else if (action == 'getPercent') {
    return getPercentRemaining(sheet)
  } else {
    throw new Error("Invalid action");
  }
  
}

function addItem(e, sheet) {
  
  var date = new Date();

  var id = "Row-" + sheet.getLastRow(); // Item1

  var dispensed = e.parameter.dispensed;

  var remaining = e.parameter.remaining;
  
  var size = e.parameter.size;

  sheet.appendRow([date,id,dispensed,remaining,size]);
  
  return ContentService.createTextOutput("Success").setMimeType(ContentService.MimeType.TEXT);
}

function getRawValues(sheet) {
  var last = sheet.getLastRow();
  var remaining = Number(sheet.getRange(last, 4).getValue())
  var size = Number(sheet.getRange(last, 5).getValue())
  
  var percent = Math.round(((remaining / size) * 100) * 100) / 100;
  
  var kegData = {
    "date": sheet.getRange(last, 1).getValue(),
    "dispensed": sheet.getRange(last, 3).getValue(),
    "remaining": remaining,
    "size": size,
    "percent_available": percent
  };

  var JSONString = JSON.stringify(kegData);
  var JSONOutput = ContentService.createTextOutput(JSONString);
  JSONOutput.setMimeType(ContentService.MimeType.JSON);
  Logger.log(JSONString)
  return JSONOutput
}

function getPercentRemaining(sheet) {
  var last = sheet.getLastRow();
  var remaining = Number(sheet.getRange(last, 4).getValue())
  var size = Number(sheet.getRange(last, 5).getValue())
  
  var percent = Math.round(((remaining / size) * 100) * 100) / 100;
  
  return ContentService.createTextOutput(percent).setMimeType(ContentService.MimeType.TEXT);
}

function testGetLastValue() {
  var sheet = ss.getSheetByName('Tap-1');
  Logger.log(getLastValue(sheet))
}
