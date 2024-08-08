const axios = require('axios');

const helpscoutApiKey = process.env.HELPSCOUT_API_KEY;
const helpscoutBaseUrl = 'https://api.helpscout.net/v2';

const helpscoutHeaders = {
  'Authorization': `Bearer ${helpscoutApiKey}`
};

const getHelpScoutTicket = async (conversationId) => {
  try {
    const response = await axios.get(`${helpscoutBaseUrl}/conversations/${conversationId}`, { headers: helpscoutHeaders });
    return response.data;
  } catch (error) {
    console.error(`Error fetching HelpScout ticket: ${error.message}`);
    throw error;
  }
};

const updateHelpScoutTicketStatus = async (conversationId, status) => {
  try {
    const response = await axios.patch(`${helpscoutBaseUrl}/conversations/${conversationId}`, { status }, { headers: helpscoutHeaders });
    return response.data;
  } catch (error) {
    console.error(`Error updating HelpScout ticket status: ${error.message}`);
    throw error;
  }
};

module.exports = {
  getHelpScoutTicket,
  updateHelpScoutTicketStatus
};