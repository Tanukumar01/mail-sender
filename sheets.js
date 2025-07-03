const { google } = require('googleapis');
require('dotenv').config();

const auth = new google.auth.GoogleAuth({
  keyFile: 'service-account.json',
  scopes: ['https://www.googleapis.com/auth/spreadsheets']
});
const sheets = google.sheets('v4');
const sheetId = process.env.SHEET_ID;

// Assumed column order:
// 0: TicketID, 1: Subject, 2: ticket Content, 3: PlaybookName, 4: Status, 5: Issue Number, 6: GHI Status, 7: Re-Trigger Playbook, 8: BugSolved Triggered, 9: Customer Email

async function getCustomerEmailByIssue(issueNumber) {
  const client = await auth.getClient();
  const range = 'Sheet1'; // Change if your sheet/tab name is different
  const res = await sheets.spreadsheets.values.get({
    auth: client,
    spreadsheetId: sheetId,
    range
  });
  const rows = res.data.values;
  if (!rows || rows.length === 0) return null;
  // Find header row
  const header = rows[0];
  const issueCol = header.findIndex(h => h.toLowerCase().includes('issue number'));
  const emailCol = header.findIndex(h => h.toLowerCase().includes('customer email'));
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][issueCol] && String(rows[i][issueCol]) === String(issueNumber)) {
      return rows[i][emailCol];
    }
  }
  return null;
}

async function updateSheet(issueNumber, { reTriggered, bugSolved }) {
  const client = await auth.getClient();
  const range = 'Sheet1'; // Change if your sheet/tab name is different
  const res = await sheets.spreadsheets.values.get({
    auth: client,
    spreadsheetId: sheetId,
    range
  });
  const rows = res.data.values;
  if (!rows || rows.length === 0) return;
  const header = rows[0];
  const issueCol = header.findIndex(h => h.toLowerCase().includes('issue number'));
  const reTrigCol = header.findIndex(h => h.toLowerCase().includes('re-trigger playbook'));
  const bugSolvedCol = header.findIndex(h => h.toLowerCase().includes('bugsolved triggered'));
  let targetRow = -1;
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][issueCol] && String(rows[i][issueCol]) === String(issueNumber)) {
      targetRow = i + 1; // 1-based for Sheets API
      break;
    }
  }
  if (targetRow === -1) return;
  // Update the columns
  const updateRequests = [];
  if (reTrigCol !== -1) {
    updateRequests.push({
      range: `Sheet1!${String.fromCharCode(65 + reTrigCol)}${targetRow}`,
      values: [[reTriggered]]
    });
  }
  if (bugSolvedCol !== -1) {
    updateRequests.push({
      range: `Sheet1!${String.fromCharCode(65 + bugSolvedCol)}${targetRow}`,
      values: [[bugSolved]]
    });
  }
  for (const req of updateRequests) {
    await sheets.spreadsheets.values.update({
      auth: client,
      spreadsheetId: sheetId,
      range: req.range,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: req.values }
    });
  }
}

module.exports = { getCustomerEmailByIssue, updateSheet }; 