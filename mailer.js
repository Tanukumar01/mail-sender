const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

function triggeredTemplate() {
  return `<!DOCTYPE html>
<html>
  <head>
    <style>
      .container { font-family: Arial, sans-serif; background: #f7f7f7; padding: 30px; }
      .card { background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.07); padding: 24px; max-width: 500px; margin: auto; }
      .header { color: #2a7ae2; font-size: 22px; margin-bottom: 12px; }
      .body { color: #333; font-size: 16px; margin-bottom: 18px; }
      .footer { color: #888; font-size: 13px; margin-top: 24px; border-top: 1px solid #eee; padding-top: 12px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="card">
        <div class="header">Your Issue Has Been Triggered</div>
        <div class="body">
          Dear Customer,<br><br>
          Thank you for reaching out to us. We have received your issue and our team is actively working on it.<br><br>
          <b>Status:</b> <span style="color:#e67e22;">Triggered</span><br>
          <br>
          We will keep you updated on the progress and notify you as soon as your issue is resolved.<br><br>
          Thank you for your patience!
        </div>
        <div class="footer">
          Best regards,<br>
          Support Team<br>
          Agentic Genie 
        </div>
      </div>
    </div>
  </body>
</html>`;
}

function resolvedTemplate(issueBody) {
  return `<!DOCTYPE html>
<html>
  <head>
    <style>
      .container { font-family: Arial, sans-serif; background: #f7f7f7; padding: 30px; }
      .card { background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.07); padding: 24px; max-width: 500px; margin: auto; }
      .header { color: #27ae60; font-size: 22px; margin-bottom: 12px; }
      .body { color: #333; font-size: 16px; margin-bottom: 18px; }
      .issue-body { background: #f1f8e9; border-left: 4px solid #27ae60; padding: 12px; margin: 16px 0; font-size: 15px; color: #222; }
      .footer { color: #888; font-size: 13px; margin-top: 24px; border-top: 1px solid #eee; padding-top: 12px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="card">
        <div class="header">Your Issue Has Been Resolved!</div>
        <div class="body">
          Dear Customer,<br><br>
          We are pleased to inform you that your reported issue has been resolved.<br><br>
          <b>Issue Details:</b>
          <div class="issue-body">
            ${issueBody}
          </div>
          If you have any further questions or concerns, please feel free to reply to this email.<br><br>
          Thank you for choosing us!
        </div>
        <div class="footer">
          Best regards,<br>
          Support Team<br>
          Agentic Genie
        </div>
      </div>
    </div>
  </body>
</html>`;
}

async function sendTriggeredMail(to) {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: 'Your issue is triggered',
    html: triggeredTemplate()
  });
}

async function sendResolvedMail(to, issueBody) {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: 'Your issue is resolved',
    html: resolvedTemplate(issueBody)
  });
}

module.exports = { sendTriggeredMail, sendResolvedMail }; 