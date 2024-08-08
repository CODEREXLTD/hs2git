const conversationToIssueMap = new Map();

const saveMapping = (conversationId, issueNumber) => {
  conversationToIssueMap.set(conversationId, issueNumber);
};

const getIssueNumber = (conversationId) => {
  return conversationToIssueMap.get(conversationId);
};

module.exports = {
  saveMapping,
  getIssueNumber
};