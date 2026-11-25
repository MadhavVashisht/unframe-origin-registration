/**
 * UNFRAME EVENTS — ORIGIN (REP YOUR STYLE)
 * Production Google Apps Script Web App Handler for Google Sheets
 *
 * Setup:
 * 1. Create or open a Google Sheet -> Extensions -> Apps Script.
 * 2. Paste this entire file into Code.gs and save.
 * 3. (Optional security) Project Settings -> Script Properties -> add `WEBHOOK_TOKEN`.
 * 4. Click Deploy -> New deployment -> Web app:
 *      - Execute as: Me
 *      - Who has access: Anyone
 * 5. Copy the Web App URL (`https://script.google.com/macros/s/.../exec`) into:
 *      - `.env` as `VITE_WEBHOOK_URL` (direct client submission), OR
 *      - Vercel env var `GOOGLE_SHEETS_WEBHOOK_URL` with `VITE_API_ENDPOINT=/api/register`.
 */

const SHEET_NAME = 'Registrations';
const HEADERS = [
  'Registration ID',
  'Submitted At',
  'Name',
  'Stage Name',
  'Age',
  'City',
  'Contact Number',
  'PAN / Aadhaar Last 6',
  'ID Format',
  'Rules Accepted',
  'Event',
  'Battle Date',
  'Event City',
];

function doGet() {
  return jsonResponse({
    status: 'ok',
    service: 'UNFRAME EVENTS — ORIGIN (REP YOUR STYLE)',
    sheet: SHEET_NAME,
  });
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(15000);

  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse({ status: 'error', error: 'Empty request payload.' });
    }

    const data = JSON.parse(e.postData.contents);
    const expectedToken = PropertiesService.getScriptProperties().getProperty('WEBHOOK_TOKEN');
    if (expectedToken && data.webhookToken !== expectedToken) {
      return jsonResponse({ status: 'error', error: 'Unauthorized webhook token.' });
    }

    const name = String(data.name || '').trim();
    const stageName = String(data.stageName || '').trim();
    const age = Number(data.age);
    const city = String(data.city || '').trim();
    const contactNumber = String(data.contactNumber || '').replace(/\D/g, '');
    const idLast6 = String(data.idLast6 || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
    const acceptedRules = Boolean(data.acceptedRules);

    if (name.length < 2 || stageName.length < 2 || city.length < 2) {
      return jsonResponse({ status: 'error', error: 'Missing required dancer details.' });
    }
    if (!Number.isInteger(age) || age < 12 || age > 65) {
      return jsonResponse({ status: 'error', error: 'Invalid age (must be 12–65).' });
    }
    if (!/^[6-9]\d{9}$/.test(contactNumber)) {
      return jsonResponse({ status: 'error', error: 'Invalid 10-digit Indian mobile number.' });
    }
    if (!/^[A-Z0-9]{6}$/.test(idLast6)) {
      return jsonResponse({ status: 'error', error: 'Invalid PAN or Aadhaar last 6 digits.' });
    }
    if (!acceptedRules) {
      return jsonResponse({ status: 'error', error: 'Rules acceptance is required.' });
    }

    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);

    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAME);
      initHeaders(sheet);
    } else if (sheet.getLastRow() === 0) {
      initHeaders(sheet);
    }

    sheet.appendRow([
      String(data.registrationId || ''),
      String(data.submittedAt || new Date().toISOString()),
      name,
      stageName,
      age,
      city,
      "'" + contactNumber,
      "'" + idLast6,
      String(data.idFormatHint || ''),
      acceptedRules,
      String(data.event || 'ORIGIN (REP YOUR STYLE)'),
      String(data.battleDate || '2027-01-17'),
      String(data.eventCity || 'DELHI'),
    ]);

    return jsonResponse({
      status: 'success',
      registrationId: String(data.registrationId || ''),
    });
  } catch (err) {
    return jsonResponse({
      status: 'error',
      error: err && err.message ? err.message : 'Failed to record registration.',
    });
  } finally {
    lock.releaseLock();
  }
}

function initHeaders(sheet) {
  sheet.appendRow(HEADERS);
  const headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#08080a');
  headerRange.setFontColor('#facc15');
  sheet.setFrozenRows(1);
}

function jsonResponse(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON
  );
}
