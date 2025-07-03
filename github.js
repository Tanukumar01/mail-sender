const { Octokit } = require('@octokit/rest');
require('dotenv').config();

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

async function getIssues() {
  const { data } = await octokit.issues.listForRepo({
    owner: process.env.GITHUB_OWNER,
    repo: process.env.GITHUB_REPO,
    state: 'all',
    per_page: 100
  });
  return data;
}

module.exports = { getIssues }; 