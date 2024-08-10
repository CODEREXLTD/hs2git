const { getHelpScoutTicket } = require('../utils/helpscoutApi');
const { createGitHubIssue, getExistingGitHubIssue, updateGitHubIssueState } = require('../utils/githubApi');
const { saveMapping } = require('../utils/db');
const inboxRepoMapping = require('../config/mapping');

const determineRepo = (inboxId, tags) => {
  if (inboxId in inboxRepoMapping) {
    const rules = inboxRepoMapping[inboxId];
    for (const rule of rules) {
      if (rule.tags.some(tag => tags.includes(tag))) {
        return rule.repo;
      }
    }
  }
  return null;
};

const handleHelpScoutWebhook = async (req, res) => {
  const data = req.body;
  // const { id: conversationId, status, mailboxId: inboxId, tags } = data;
  
  const { id: conversationId, number: conversationNumber, status, mailbox: { id: inboxId }, subject: title, preview: body, tags } = data;
  const repo = determineRepo(inboxId, tags);

  if (repo) {
    try {
      const existingIssue = await getExistingGitHubIssue(repo, conversationId);

      if (existingIssue) {
        console.log(`GitHub issue for conversation ID ${conversationId} already exists.`);
        if (status === 'closed') {
          await updateGitHubIssueState(repo, existingIssue.number, 'closed');
        } else {
          await updateGitHubIssueState(repo, existingIssue.number, 'open');
        }
        res.json({ status: 'success', message: 'Issue already exists and has been updated.' });
      } else {
        const issue = await createGitHubIssue(repo, title, body, conversationId, conversationNumber);
        const issueNumber = issue.number;

        saveMapping(conversationId, issueNumber);

        if (status === 'closed') {
          await updateGitHubIssueState(repo, issueNumber, 'closed');
        } else {
          await updateGitHubIssueState(repo, issueNumber, 'open');
        } 
        res.json({ status: 'success' });
      }
    } catch (error) {
      console.error('Error processing HelpScout webhook:', error);  // Log the error details
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(400).json({ error: 'No matching repository found' });
  }
};


module.exports = { handleHelpScoutWebhook };
