const axios = require('axios');

const githubToken = process.env.GITHUB_TOKEN;
const githubBaseUrl = 'https://api.github.com';

const githubHeaders = {
  'Authorization': `token ${githubToken}`
};

const createGitHubIssue = async (repo, title, body) => {
  try {
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

module.exports = {
  createGitHubIssue,
  updateGitHubIssueState
};