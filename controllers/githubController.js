const { updateHelpScoutTicketStatus } = require('../utils/helpscoutApi');

const handleGitHubWebhook = async (req, res) => {
  const data = req.body;
  const { number: issueNumber, state } = data.issue;
  const { full_name: repo } = data.repository;

  console.log(data)

  // Implement logic to retrieve HelpScout conversation ID from saved mapping
  const conversationId = getConversationIdFromIssueNumber(issueNumber);

  const repos = Object.values(inboxRepoMapping).flatMap(rules => rules.map(rule => rule.repo));
    if (repos.includes(repo)) {
        if (state === 'closed') {
            await updateHelpScoutTicketStatus(conversationId, 'closed');
        } else {
            await updateHelpScoutTicketStatus(conversationId, 'active');
        }
    }

  res.json({ status: 'success' });
};

const getConversationIdFromIssueNumber = (issueNumber) => {
  // Implement logic to retrieve HelpScout conversation ID from saved mapping
  return 'some_conversation_id';
};

module.exports = { handleGitHubWebhook };
