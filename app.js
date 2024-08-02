const express = require('express');
const bodyParser = require('body-parser');
const { handleHelpScoutWebhook } = require('./controllers/helpscoutController');
const { handleGitHubWebhook } = require('./controllers/githubController');

const app = express();

app.use(bodyParser.json());

app.post('/webhook/helpscout', handleHelpScoutWebhook);
app.post('/webhook/github', handleGitHubWebhook);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});