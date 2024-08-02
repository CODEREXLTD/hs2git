const { getHelpScoutTicket } = require('../utils/helpscoutApi');
const { createGitHubIssue, updateGitHubIssueState } = require('../utils/githubApi');
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
  const { id: conversationId, status, mailboxId: inboxId, tags } = data;

  const repo = determineRepo(inboxId, tags);
  if (repo) {
    const ticketDetails = await getHelpScoutTicket(conversationId);
    console.log(ticketDetails)
    const { subject: title, body } = ticketDetails;

    const issue = await createGitHubIssue(repo, title, body);
    const issueNumber = issue.number;

    console.log(issue)

    if (status === 'closed') {
      await updateGitHubIssueState(repo, issueNumber, 'closed');
    } else {
      await updateGitHubIssueState(repo, issueNumber, 'open');
    }
  }

  res.json({ status: 'successsss' });
};

module.exports = { handleHelpScoutWebhook };
