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
