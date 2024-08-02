# Helpscout to Github issue creation

## How to install
```
npm install
```

### Configure API Keys:

#### GitHub Access Key:
Open ```utils/githubApi.js``` and place your GitHub API key.

#### HelpScout Access Key:
Open ```utils/helpscoutApi.js``` and place your HelpScout API key.

### Start the app
```
npm start
```

## Mapping HelpScout Inbox IDs to GitHub Repositories
Go to file (utils/inboxRepoMapping.js) to associate HelpScout inbox IDs with GitHub repositories and tags. Here is an example mapping file:

```
const inboxRepoMapping = {
    'a20405536174aa76': [
        {
            repo: 'hs2git',
            tags: ['bug', 'critical']
        }
    ],
    // Add more mappings as needed
};

module.exports = inboxRepoMapping;
```

## Explanation:
- Each key in the inboxRepoMapping object represents a HelpScout inbox ID.
- The value for each key is an array of objects, where each object specifies:
    - repo: The GitHub repository name.
    - tags: An array of tags that should be assigned to issues created from this inbox.

## Example Mapping:
If you have a HelpScout inbox with ID a20405536174aa76 and want to map it to the GitHub repository hs2git with tags bug and critical, your inboxRepoMapping would look like the example above.