const axios = require('axios');

const githubToken = process.env.GITHUB_TOKEN;
const githubBaseUrl = 'https://api.github.com';

const githubHeaders = {
  'Authorization': `token ${githubToken}`
};

const createGitHubIssue = async (repo, title, issueBody, conversationId, conversationNumber) => {
  try {
    const conversationLink = `https://secure.helpscout.net/conversation/${conversationId}/${conversationNumber}/`;
    const body = `HelpScout conversation ID: ${conversationId}\n\nHelpScout conversation link: [${conversationNumber}](${conversationLink})\n\n${issueBody}`;
    const response = await axios.post(`${githubBaseUrl}/repos/${repo}/issues`, { title, body }, { headers: githubHeaders });
    return response.data;
  } catch (error) {
    console.error(`Error creating GitHub issue: ${error.message}`);
    throw error;
  }
};

const updateGitHubIssueState = async (repo, issueNumber, state) => {
  try {
    const response = await axios.patch(`${githubBaseUrl}/repos/${repo}/issues/${issueNumber}`, { state }, { headers: githubHeaders });
    return response.data;
  } catch (error) {
    console.error(`Error updating GitHub issue state: ${error.message}`);
    throw error;
  }
};

const getExistingGitHubIssue = async (repo, conversationId) => {
  try {
    const response = await axios.get(`${githubBaseUrl}/repos/${repo}/issues`, {
      headers: githubHeaders,
      params: {
        state: 'all',
        labels: conversationId
      }
    });
    return response.data.find(issue => issue.body.includes(`HelpScout conversation ID: ${conversationId}`));
  } catch (error) {
    console.error(`Error fetching GitHub issues: ${error.message}`);
    throw error;
  }
};

module.exports = {
  createGitHubIssue,
  getExistingGitHubIssue,
  updateGitHubIssueState
};