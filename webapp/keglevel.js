var ss = SpreadsheetApp.openByUrl(PropertiesService.getScriptProperties().getProperty('url'));

function doPost(e) {
  
  if (e.parameter.access_key != PropertiesService.getScriptProperties().getProperty('wr-access-key')) {
    throw new Error("Wrong Access Key");
  }
  
  var tap = getTapOrThrow(e);
  
  var sheet = ss.getSheetByName('Tap-' + tap);
  
  var action = e.parameter.action;
  
  if (action == 'addItem'){
    return addItem(e, sheet);
  }
}


function doGet(e) {
  
  if (e.parameter.access_key != PropertiesService.getScriptProperties().getProperty('rd-access-key')) {
    throw new Error("Wrong Access Key");
  }
  
  var action = e.parameter.action;
  
  switch (action) {
    
    case 'alive':
        return okJson();
      
    case 'getRaw':
      var tap = getTapOrThrow(tap);
      var sheet = ss.getSheetByName('Tap-' + tap);
      return getRawValues(sheet);
    
    case 'getPercent':
      var tap = getTapOrThrow(tap);
      var sheet = ss.getSheetByName('Tap-' + tap);
      return getPercentRemaining(sheet);
    
    case 'getHopImg':
      var beer = getBeerOrThrow(e);
      var sheet = ss.getSheetByName('Beers');
      return getHopImg(sheet, beer);
      
    case 'getSRMImg':
      var beer = getBeerOrThrow(e);
      var sheet = ss.getSheetByName('Beers');
      return getSrmImg(sheet, beer);   
      
    case 'getDescription':
      var beer = getBeerOrThrow(e);
      var sheet = ss.getSheetByName('Beers');
      return getDescription(sheet, beer);
      
    case 'getHops':
      var beer = getBeerOrThrow(e);
      var sheet = ss.getSheetByName('Beers');
      return getHops(sheet, beer);
      
    case 'getIBU':
      var beer = getBeerOrThrow(e);
      var sheet = ss.getSheetByName('Beers');
      return getIbu(sheet, beer);
      
    case 'getSRM':
      var beer = getBeerOrThrow(e);
      var sheet = ss.getSheetByName('Beers');
      return getSrm(sheet, beer);
      
    default:
      throw new Error("Invalid action");
  }
}

function getBeerOrThrow(e) {
  var beer = Number(e.parameter.beer);
  if (beer < 1 || beer > 4) {
     throw new Error("Only 4 beer Info avaiable");
  }
  return beer;
}

function getTapOrThrow(e) {
  var tap = e.parameter.tap;
  if (tap != "1" && tap != "2") {
    throw new Error("Tap number can be 1 or 2. Recieved" + tap);
  }
  return tap;
}

function okJson() {
  var okJson = {"Status": "Ok"};
  return toJson(okJson);
}

function addItem(e, sheet) {
  
  var date = new Date();

  var id = "Row-" + sheet.getLastRow(); // Item1

  var dispensed = e.parameter.dispensed;

  var remaining = e.parameter.remaining;
  
  var size = e.parameter.size;

  sheet.appendRow([date,id,dispensed,remaining,size]);
  
  return okJson();
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
  
  return toJson(kegData)
}

function toJson(d) {
  var JSONString = JSON.stringify(d);
  Logger.log(JSONString);
  return ContentService.createTextOutput(JSONString).setMimeType(ContentService.MimeType.JSON);
}

function getPercentRemaining(sheet) {
  var last = sheet.getLastRow();
  var remaining = Number(sheet.getRange(last, 4).getValue());
  var size = Number(sheet.getRange(last, 5).getValue());
  var percent = Math.round(((remaining / size) * 100) * 100) / 100;
  
  var jPercent = {"Percent-Remaining": percent};
  
  return toJson(jPercent);
}

function test() {
  var sheet = ss.getSheetByName('Beers');
  Logger.log(getDescription(sheet, 1).getContent());
}

function getHops(sheet, number) {
  var rowNum = number + 1;
  var hopCol = 10;
  var hops = sheet.getRange(rowNum, hopCol).getValues()[0][0];
  return toJson({"hops": hops});  
}

function getSrm(sheet, number) {
  var rowNum = number + 1;
  var srmCol = 6;
  var srm = sheet.getRange(rowNum, srmCol).getValues()[0][0];
  return toJson({"srm": srm}); 
}

function getIbu(sheet, number) {
  var rowNum = number + 1;
  var ibuCol = 11;
  var ibu = sheet.getRange(rowNum, ibuCol).getValues()[0][0];
  return toJson({"ibu": ibu});   
}

function getDescription(sheet, number) {
 
  var rowNum = number + 1;
  var numCols = 13;
  
  var row = sheet.getRange(rowNum, 1, 1, numCols).getValues()[0];
  
  //Beer Number(1), Name (2), Sub Title (3), Taste Notes (4), Style (5), SRM(6),
  //ABV (7), OG (8), FG (9), Hops (10), IBU (11), Brew Date (12), Tap Date (13)
  
  var beer = {
    'number': row[0],
    'title': "new" + row[1],
    'subTitle': row[2],
    'tasteNotes': row[3],
    'style': row[4],
    'srm': row[5],
    'abv': row[6],
    'og': row[7],
    'fg': row[8],
    'hops': row[9],
    'ibu': row[10],
    'brewDate': row[11],
    'tapDate': row[12]
  };
  return toJson(beer);
}

function getHopImg(sheet, number) {
  
  var ibuCol = 11; var rowNum = number + 1;
                 
  var ibu = Number(sheet.getRange(rowNum, 1, ibuCol, 1).getValues()[0][0]);
  
  var imgPost = Math.round(ibu / 10) * 10;
  var imgPre = 'hop-';
  var imgExt = '.png';
  
  var imgDir = PropertiesService.getScriptProperties().getProperty('img');
  
  var url = DriveApp.getFolderById(imgDir).getFilesByName(imgPre + imgPost + imgExt).next().getUrl();
  
  return toJson({"ibu": ibu, "img": url});
}

function getSrmImg(sheet, number) {
  
  var srmCol = 11; var rowNum = number + 1;
                 
  var srm = Number(sheet.getRange(rowNum, 1, srmCol, 1).getValues()[0][0]);
  
  var imgPost = Math.round(srm / 5) * 5; 
  var imgPre = 'srm-';
  var imgExt = '.png';
  
  var imgDir = PropertiesService.getScriptProperties().getProperty('img');
  
  var url = DriveApp.getFolderById(imgDir).getFilesByName(imgPre + imgPost + imgExt).next().getUrl();
  
  return toJson({"srm": srm, "img": url});
}
