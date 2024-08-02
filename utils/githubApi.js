const axios = require('axios');

const githubToken = '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';
const githubBaseUrl = 'https://api.github.com';

const githubHeaders = {
  'Authorization': `token ${githubToken}`
};

const createGitHubIssue = async (repo, title, body) => {
  const response = await axios.post(`${githubBaseUrl}/repos/${repo}/issues`, { title, body }, { headers: githubHeaders });
  return response.data;
};

const updateGitHubIssueState = async (repo, issueNumber, state) => {
  const response = await axios.patch(`${githubBaseUrl}/repos/${repo}/issues/${issueNumber}`, { state }, { headers: githubHeaders });
  return response.data;
};

module.exports = {
  createGitHubIssue,
  updateGitHubIssueState
};
