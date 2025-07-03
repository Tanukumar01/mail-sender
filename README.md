# GitHub Issue Notification & Google Sheets Automation

This Node.js tool automates customer notifications and Google Sheets updates based on the status of GitHub issues. It reads issues from your GitHub repository, sends styled HTML emails to customers, and updates a Google Sheet with the latest status.

## Features
- Fetches issues from a GitHub repository
- Looks up customer emails from a Google Sheet
- Sends beautiful HTML emails when an issue is triggered or resolved
- Updates Google Sheet columns for issue status and notification

## Tech Stack
- Node.js & Express
- Nodemailer (for sending emails)
- Google Sheets API
- GitHub API (@octokit/rest)

## Prerequisites
- Node.js (v14+ recommended)
- A Gmail account with [App Passwords enabled](https://support.google.com/accounts/answer/185833?hl=en)
- A Google Cloud project with Sheets API enabled
- A GitHub personal access token

## Setup

1. **Clone the repository**

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up your `.env` file**
   Create a `.env` file in the project root:
   ```env
   GITHUB_TOKEN=your_github_personal_access_token
   GITHUB_OWNER=your_github_username_or_org
   GITHUB_REPO=your_github_repo_name
   EMAIL_USER=your_gmail_address@gmail.com
   EMAIL_PASS=your_gmail_app_password
   SHEET_ID=your_google_sheet_id
   ```
   - `SHEET_ID` is the part after `/d/` and before `/edit` in your Google Sheet URL.

4. **Google Service Account**
   - Create a service account in Google Cloud Console.
   - Download the `service-account.json` file and place it in your project root.
   - Share your Google Sheet with the service account email (with Editor access).

5. **Configure your Google Sheet**
   - The sheet should have columns: `TicketID`, `Subject`, `ticket Content`, `PlaybookName`, `Status`, `Issue Number`, `GHI Status`, `Re-Trigger Playbook`, `BugSolved Triggered`, `Customer Email`.
   - The script will match issues by `Issue Number` and update the relevant row.

## Usage

1. **Start the server**
   ```bash
   node index.js
   ```

2. **Trigger the process**
   - Open your browser or use Postman to visit:
     ```
     http://localhost:3000/process-issues
     ```
   - The tool will:
     - Fetch issues from GitHub
     - Look up customer emails in the Google Sheet
     - Send notification emails
     - Update the Google Sheet columns

## Email Templates
- The tool sends beautiful HTML emails for both triggered and resolved issues.
- You can customize the templates in `mailer.js`.

## Troubleshooting
- Ensure all environment variables are set correctly.
- Make sure your service account has access to the Google Sheet.
- If you see `MODULE_NOT_FOUND` errors, run `npm install` for missing packages.
- For Gmail, use an App Password, not your regular password.

## License
MIT 