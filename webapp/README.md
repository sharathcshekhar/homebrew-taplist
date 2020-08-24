# Instructions for creating the WebApp

1. Creating the App Script:
	1. Go to https://script.google.com/home/start and create a new project
	2. Copy the code in keglevel.js and paste it into the editor. 
2. Creating Spreadsheet:
	1. Create a new blank Google spreadsheet, and create as many sheets within the spreadsheet as the number of taps you want to monitor.
	2. Name the sub-sheets as Tap-1, Tap-2, ... Tap-n. 
	3. In each sub-sheet, create these four columns: "Date, Id, Dispensed, Remaining, Size".
	4. This spreadsheet will be your cloud database. Copy the URL of this sheet.
3. Integrating Sheets and App Script: In the App Script project, there are three variables that you have to set in script properties
(File > Project Properties > Script Properties)
	1. url: This is the URL of the Google Spreadsheet you created in the previous step.
	2. wr-access-key: This is like a password, you can set it to whatever you want. The string has to be passed as "access-key" with all POST calls to the webapp.
	3. rd-access-key: The string has to be passed as "access-key" with all GET calls to the webapp.
4. Now deploy the WebApp with a new version, and get the URL of the WebApp. 

Note: if you use this WebApp to build a taplist on a publicly hosted website, your rd-access-key will be exposed as it is needed to make the API call.
So keep in mind that this is a very weak form of security. On the other hand, the write access key is used only inside your Android App and won't be exposed.
So the write key is a much stronger security. 


# Working of the WebApp

## POST
Whenever POST is called on the Web App, one row is added to your spreadsheet. The POST accepts four self explanatory variables in a form data.
Sample CURL command:
		
	curl  --request POST 'https://script.google.com/macros/s/xxxxxx/exec' \
	      --form 'action=addItem' \
	      --form 'tap=1' \
	      --form 'remaining=10' \
	      --form 'size=200' \
	      --form 'dispensed=60'
	      --form 'access_key=wr_access_key'

Since I have only two taps I am monitoring, I have a check in the App Script to ensure the tap is either 1 or 2. You can modify as needed.
You may see that the WebApp also timestamps and adds a rowId to each entry.

## GET
GET API returns the last row in the spreadsheet. It takes action (which is always getRaw), access_key (rd_access_key that you set in properties), and tap (the tap number).
Example CURL command:

	curl --request GET 'https://script.google.com/macros/s/xxxxxx/exec?action=getRaw&access_key=top_secret&tap=1'

This gives you a JSON output like this:
		
	{
	  "date": "2020-08-23T17:55:55.753Z",
	  "dispensed": 6167,
	  "remaining": 3297,
	  "size": 9842,
	  "percent_available": 33.5
	}
