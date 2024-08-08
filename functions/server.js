const express = require('express');
const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const { handleHelpScoutWebhook } = require('../controllers/helpscoutController');
const { handleGitHubWebhook } = require('../controllers/githubController');

const app = express();

app.use(bodyParser.json());

app.post('/.netlify/functions/server/webhook/helpscout', handleHelpScoutWebhook);
app.post('/.netlify/functions/server/webhook/github', handleGitHubWebhook);

module.exports.handler = serverless(app);
