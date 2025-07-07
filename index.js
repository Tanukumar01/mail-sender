const express = require('express');
const { getIssues } = require('./github');
const { sendTriggeredMail, sendResolvedMail } = require('./mailer');
const { getCustomerEmailByIssue, updateSheet } = require('./sheets');

const app = express();

app.get('/process-issues', processIssuesHandler);
app.post('/process-issues', processIssuesHandler);

function processIssuesHandler(req, res) {
  (async () => {
    try {
      const issues = await getIssues();
      for (const issue of issues) {
        const customerEmail = await getCustomerEmailByIssue(issue.number);
        if (!customerEmail) continue;
        if (issue.state === 'open') {
          await sendTriggeredMail(customerEmail);
          await updateSheet(issue.number, { reTriggered: 'Triggered', bugSolved: 'No' });
        } else if (issue.state === 'closed') {
          await sendResolvedMail(customerEmail, issue.body);
          await updateSheet(issue.number, { reTriggered: 'Not retriggered', bugSolved: 'Yes' });
        }
      }
      res.json({ status: 'success', message: 'Processed all issues.' });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  })();
}

app.listen(3000, () => console.log('Server running on port 3000')); 