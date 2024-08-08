const axios = require('axios');
const qs = require('qs');

const helpscoutClientId = process.env.HELPSCOUT_CLIENT_ID;
const helpscoutClientSecret = process.env.HELPSCOUT_CLIENT_SECRET;
const helpscoutRefreshToken = process.env.HELPSCOUT_REFRESH_TOKEN;
const helpscoutBaseUrl = 'https://api.helpscout.net/v2';

let helpscoutAccessToken = process.env.HELPSCOUT_ACCESS_TOKEN;

const helpscoutHeaders = {
  'Authorization': `Bearer ${helpscoutAccessToken}`
};


const refreshAccessToken = async () => {
  try {
    const response = await axios.post('https://api.helpscout.net/v2/oauth2/token', qs.stringify({
      grant_type: 'refresh_token',
      refresh_token: helpscoutRefreshToken,
      client_id: helpscoutClientId,
      client_secret: helpscoutClientSecret
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    helpscoutAccessToken = response.data.access_token;
    process.env.HELPSCOUT_ACCESS_TOKEN = helpscoutAccessToken;

    // Optionally, update the refresh token if a new one is provided
    if (response.data.refresh_token) {
      process.env.HELPSCOUT_REFRESH_TOKEN = response.data.refresh_token;
    }

    return helpscoutAccessToken;
  } catch (error) {
    console.error(`Error refreshing HelpScout access token: ${error.message}`);
    throw error;
  }
};

const getHelpScoutTicket = async (conversationId) => {

  if (conversationId === 'mock') {
    return {
      subject: 'Mock Ticket Title',
      body: 'This is a mock ticket body for testing purposes.'
    };
  }

  try {
    const response = await axios.get(`${helpscoutBaseUrl}/conversations/${conversationId}`, { headers: helpscoutHeaders });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      // Token might be expired, refresh it and retry
      await refreshAccessToken();
      return getHelpScoutTicket(conversationId);
    }

    console.error(`Error fetching HelpScout ticket: ${error.message}`);
    throw error;
  }
};

const updateHelpScoutTicketStatus = async (conversationId, status) => {
  try {
    const response = await axios.patch(`${helpscoutBaseUrl}/conversations/${conversationId}`, { status }, { headers: helpscoutHeaders });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      // Token might be expired, refresh it and retry
      await refreshAccessToken();
      return updateHelpScoutTicketStatus(conversationId, status);
    }

    console.error(`Error updating HelpScout ticket status: ${error.message}`);
    throw error;
  }
};

module.exports = {
  getHelpScoutTicket,
  updateHelpScoutTicketStatus
};