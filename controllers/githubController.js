const { updateHelpScoutTicketStatus } = require('../utils/helpscoutApi');
const { getIssueNumber } = require('../utils/db');
const inboxRepoMapping = require('../config/mapping');

const handleGitHubWebhook = async (req, res) => {
  const data = req.body;
  const { number: issueNumber, state } = data.issue;
  const { full_name: repo } = data.repository;

  const conversationId = getIssueNumber(issueNumber);

  if (conversationId && Object.values(inboxRepoMapping).flat().some(rule => rule.repo === repo)) {
    try {
      if (state === 'closed') {
        await updateHelpScoutTicketStatus(conversationId, 'closed');
      } else {
        await updateHelpScoutTicketStatus(conversationId, 'active');
      }
      
      res.json({ status: 'success' });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(400).json({ error: 'Invalid repository or conversation ID' });
  }
};

module.exports = { handleGitHubWebhook };
