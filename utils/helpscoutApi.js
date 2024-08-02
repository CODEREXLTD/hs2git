const axios = require('axios');

const helpscoutApiKey = '1YQ6Fz18wqbUM8NWXnTWufGfI4lEpQeM';
const helpscoutBaseUrl = 'https://api.helpscout.net/v2';

const helpscoutHeaders = {
  'Authorization': `Bearer ${helpscoutApiKey}`
};

const getHelpScoutTicket = async (conversationId) => {
  const response = await axios.get(`${helpscoutBaseUrl}/conversations/${conversationId}`, { headers: helpscoutHeaders });
  return response.data;
};

const updateHelpScoutTicketStatus = async (conversationId, status) => {
  const response = await axios.patch(`${helpscoutBaseUrl}/conversations/${conversationId}`, { status }, { headers: helpscoutHeaders });
  return response.data;
};

module.exports = {
  getHelpScoutTicket,
  updateHelpScoutTicketStatus
};
