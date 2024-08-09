const { getHelpScoutTicket } = require('../utils/helpscoutApi');
const { createGitHubIssue, updateGitHubIssueState } = require('../utils/githubApi');
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
  const { id: conversationId, status, mailboxId: inboxId, tags, subject: title, preview: body } = data;

  const repo = determineRepo(inboxId, tags);
  console.log('repo:', repo);
  if (repo) {
    try {
      // const ticketDetails = await getHelpScoutTicket(conversationId);
      // const { subject: title, body } = ticketDetails;

      const issue = await createGitHubIssue(repo, title, body);
      const issueNumber = issue.number;

      saveMapping(conversationId, issueNumber);

      if (status === 'closed') {
        await updateGitHubIssueState(repo, issueNumber, 'closed');
      } else {
        await updateGitHubIssueState(repo, issueNumber, 'open');
      }
      
      res.json({ status: 'success' });
    } catch (error) {
      console.error('Error processing HelpScout webhook:', error);  // Log the error details
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(400).json({ error: 'No matching repository found' });
  }
};

module.exports = { handleHelpScoutWebhook };
