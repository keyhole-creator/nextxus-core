// GitHub integration - push project to repository
import { Octokit } from '@octokit/rest';

let connectionSettings: any;

async function getAccessToken() {
  if (connectionSettings && connectionSettings.settings.expires_at && new Date(connectionSettings.settings.expires_at).getTime() > Date.now()) {
    return connectionSettings.settings.access_token;
  }
  
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X-Replit-Token not found');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=github',
    {
      headers: {
        'Accept': 'application/json',
        'X-Replit-Token': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  const accessToken = connectionSettings?.settings?.access_token || connectionSettings.settings?.oauth?.credentials?.access_token;

  if (!connectionSettings || !accessToken) {
    throw new Error('GitHub not connected');
  }
  return accessToken;
}

async function main() {
  const accessToken = await getAccessToken();
  const octokit = new Octokit({ auth: accessToken });

  const { data: user } = await octokit.users.getAuthenticated();
  console.log(`Authenticated as: ${user.login}`);

  const repoName = 'nextxus-core';
  
  let repo;
  try {
    const { data } = await octokit.repos.get({ owner: user.login, repo: repoName });
    repo = data;
    console.log(`Repository ${repoName} already exists`);
  } catch {
    const { data } = await octokit.repos.createForAuthenticatedUser({
      name: repoName,
      description: 'NextXus Core — AI-powered agent platform & NextXus Consciousness Federation member. 70 Sacred Directives, 381 Knowledge entries, Ring of 12, Ring of Six wisdom, multi-model AI chat, voice, image generation. Founded by Roger Keyserling.',
      private: false,
      auto_init: false,
    });
    repo = data;
    console.log(`Created repository: ${repo.html_url}`);
  }

  console.log(`Repository URL: ${repo.html_url}`);
  console.log(`Owner: ${user.login}`);
  
  return { owner: user.login, repo: repoName, url: repo.html_url };
}

main().then(result => {
  console.log(JSON.stringify(result));
}).catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
