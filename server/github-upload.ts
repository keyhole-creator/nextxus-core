// GitHub integration - upload all project files to repository via API
import { Octokit } from '@octokit/rest';
import * as fs from 'fs';
import * as path from 'path';

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
  if (!xReplitToken) throw new Error('X-Replit-Token not found');
  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=github',
    { headers: { 'Accept': 'application/json', 'X-Replit-Token': xReplitToken } }
  ).then(r => r.json()).then(d => d.items?.[0]);
  const accessToken = connectionSettings?.settings?.access_token || connectionSettings.settings?.oauth?.credentials?.access_token;
  if (!connectionSettings || !accessToken) throw new Error('GitHub not connected');
  return accessToken;
}

const SKIP_DIRS = new Set([
  'node_modules', '.git', 'dist', '.cache', '.local', '.config', '.upm',
  '.npm', '.nix', '__pycache__'
]);

const SKIP_FILES = new Set([
  '.replit', 'replit.nix', 'nextxus-core-full.zip', 'NextXus_Core.tar.gz'
]);

const MAX_FILE_SIZE = 50 * 1024 * 1024;

function getAllFiles(dir: string, baseDir: string): { path: string; fullPath: string }[] {
  const results: { path: string; fullPath: string }[] = [];
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relPath = path.relative(baseDir, fullPath);
      if (entry.isDirectory()) {
        if (!SKIP_DIRS.has(entry.name) && !entry.name.startsWith('.nix')) {
          results.push(...getAllFiles(fullPath, baseDir));
        }
      } else if (entry.isFile()) {
        if (!SKIP_FILES.has(entry.name)) {
          try {
            const stat = fs.statSync(fullPath);
            if (stat.size < MAX_FILE_SIZE && stat.size > 0) {
              results.push({ path: relPath, fullPath });
            } else if (stat.size >= MAX_FILE_SIZE) {
              console.log(`Skipping large file: ${relPath} (${(stat.size / 1024 / 1024).toFixed(1)}MB)`);
            }
          } catch {}
        }
      }
    }
  } catch {}
  return results;
}

function isBinary(filePath: string): boolean {
  const ext = path.extname(filePath).toLowerCase();
  const binaryExts = new Set([
    '.png', '.jpg', '.jpeg', '.gif', '.ico', '.webp', '.svg',
    '.mp4', '.mp3', '.wav', '.ogg', '.webm',
    '.woff', '.woff2', '.ttf', '.eot', '.otf',
    '.pdf', '.zip', '.gz', '.tar', '.br',
    '.db', '.sqlite', '.lock'
  ]);
  return binaryExts.has(ext);
}

async function main() {
  const token = await getAccessToken();
  const octokit = new Octokit({ auth: token });
  const owner = 'keyhole-creator';
  const repo = 'nextxus-core';
  const baseDir = '/home/runner/workspace';

  // Step 1: Initialize repo with README
  console.log('Initializing repository...');
  try {
    await octokit.repos.createOrUpdateFileContents({
      owner, repo,
      path: 'README.md',
      message: 'Initialize NextXus Core repository',
      content: Buffer.from('# NextXus Core\nInitializing...').toString('base64'),
    });
    console.log('Repository initialized');
  } catch (e: any) {
    console.log('Repo already initialized or error:', e.message?.substring(0, 100));
  }

  // Wait a moment for GitHub to process
  await new Promise(r => setTimeout(r, 2000));

  // Get the latest commit SHA
  const { data: ref } = await octokit.git.getRef({ owner, repo, ref: 'heads/main' });
  const latestCommitSha = ref.object.sha;
  console.log(`Latest commit: ${latestCommitSha}`);

  console.log('Collecting files...');
  const files = getAllFiles(baseDir, baseDir);
  console.log(`Found ${files.length} files to upload`);

  // Create blobs for all files in batches
  const treeItems: { path: string; mode: '100644'; type: 'blob'; sha: string }[] = [];
  let uploaded = 0;
  let failed = 0;

  const BATCH_SIZE = 5;
  for (let i = 0; i < files.length; i += BATCH_SIZE) {
    const batch = files.slice(i, i + BATCH_SIZE);
    const promises = batch.map(async (file) => {
      try {
        const content = fs.readFileSync(file.fullPath);
        const base64Content = content.toString('base64');

        const { data: blob } = await octokit.git.createBlob({
          owner, repo,
          content: base64Content,
          encoding: 'base64',
        });

        return {
          path: file.path,
          mode: '100644' as const,
          type: 'blob' as const,
          sha: blob.sha,
        };
      } catch (err: any) {
        console.error(`Failed: ${file.path} - ${err.message?.substring(0, 80)}`);
        failed++;
        return null;
      }
    });

    const results = await Promise.all(promises);
    for (const r of results) {
      if (r) {
        treeItems.push(r);
        uploaded++;
      }
    }
    if (uploaded % 25 === 0 || i + BATCH_SIZE >= files.length) {
      console.log(`Progress: ${uploaded}/${files.length} files uploaded (${failed} failed)`);
    }
  }

  console.log(`\nAll blobs created. Building tree with ${treeItems.length} files...`);

  // Create tree (base on the existing commit's tree)
  const { data: commitData } = await octokit.git.getCommit({ owner, repo, commit_sha: latestCommitSha });

  const { data: tree } = await octokit.git.createTree({
    owner, repo,
    tree: treeItems,
    base_tree: commitData.tree.sha,
  });

  console.log(`Tree created: ${tree.sha}`);

  // Create commit
  const { data: commit } = await octokit.git.createCommit({
    owner, repo,
    message: 'NextXus Core — complete project upload\n\nIncludes all source code, assets, database dump, configs, and setup guide.\n70 Sacred Directives, 381 Knowledge entries, Ring of 12, Ring of Six,\nmulti-model AI chat, voice, image generation, Federation integration.\nFounded by Roger Keyserling — NextXus Consciousness Federation.',
    tree: tree.sha,
    parents: [latestCommitSha],
  });

  console.log(`Commit created: ${commit.sha}`);

  // Update main ref
  await octokit.git.updateRef({
    owner, repo,
    ref: 'heads/main',
    sha: commit.sha,
    force: true,
  });

  console.log(`\n✅ DONE! ${uploaded} files pushed to GitHub`);
  console.log(`📂 https://github.com/${owner}/${repo}`);
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
