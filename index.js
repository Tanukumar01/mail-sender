const express = require('express');
const { getIssues } = require('./github');
const { sendTriggeredMail, sendResolvedMail } = require('./mailer');
const { getCustomerEmailByIssue, updateSheet } = require('./sheets');

const app = express();

app.get('/process-issues', async (req, res) => {
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
  res.send('Processed all issues.');
});

app.listen(3000, () => console.log('Server running on port 3000')); 