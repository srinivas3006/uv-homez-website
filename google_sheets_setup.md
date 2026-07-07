# How to Connect Your Contact Form to Google Sheets

Since you are presenting the UI to your client first, I have already prepared the website's code (`index.html` and `main.js`) to seamlessly link to a Google Sheet. It will look like it's working natively on the site (showing "Sending..." and "Sent successfully!") without refreshing the page.

When you are ready to make the form actually send data, just follow these exact steps:

### Step 1: Create the Google Sheet
1. Go to [Google Sheets](https://sheets.google.com) and create a new Blank Spreadsheet.
2. Name the spreadsheet (e.g., "UV Homez Leads").
3. In the first row (A1 to E1), add these exact headers:
   - **Timestamp** (A1)
   - **name** (B1)
   - **phone** (C1)
   - **email** (D1)
   - **message** (E1)

### Step 2: Add the Apps Script
1. In your Google Sheet menu, click on **Extensions > Apps Script**.
2. Delete any code there and paste this exact script:

```javascript
var sheetName = 'Sheet1';
var scriptProp = PropertiesService.getScriptProperties();

function initialSetup () {
  var activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  scriptProp.setProperty('key', activeSpreadsheet.getId());
}

function doPost (e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var doc = SpreadsheetApp.openById(scriptProp.getProperty('key'));
    var sheet = doc.getSheetByName(sheetName);

    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var nextRow = sheet.getLastRow() + 1;

    var newRow = headers.map(function(header) {
      return header === 'Timestamp' ? new Date() : e.parameter[header];
    });

    sheet.getRange(nextRow, 1, 1, newRow.length).setValues([newRow]);

    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'success', 'row': nextRow }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  catch (e) {
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'error', 'error': e }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  finally {
    lock.releaseLock();
  }
}
```
3. Click the **Save** icon (floppy disk).
4. Click **Run > initialSetup** (at the top bar). It will ask for permissions. Click **Review Permissions**, select your Google account, click **Advanced**, and then click **Go to Untitled project (unsafe)** to allow it.

### Step 3: Deploy as a Web App
1. At the top right, click the blue **Deploy** button > **New deployment**.
2. Click the gear icon next to "Select type" and choose **Web app**.
3. Under "Execute as", choose **Me (your email)**.
4. Under "Who has access", select **Anyone**. *(This is required so the public website can send data to it!)*
5. Click **Deploy**.
6. Copy the **Web app URL** it gives you.

### Step 4: Link it to the Website
1. Open `src/main.js` in your code editor.
2. Scroll to the very bottom to the `initContactForm()` function (around line 175).
3. Find this line:
   ```javascript
   const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_SCRIPT_WEB_APP_URL_HERE';
   ```
4. Replace `'YOUR_GOOGLE_SCRIPT_WEB_APP_URL_HERE'` with the Web app URL you just copied (keep the quotes).

**You're Done!** Now whenever a client fills out the form on your website, it will instantly pop up in your Google Sheet!
