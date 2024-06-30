const fs = require('fs');
const { execSync } = require('child_process');

const versionFile = 'version.txt';

function getCurrentVersion() {
  return fs.readFileSync(versionFile, 'utf-8').trim();
}

function writeNewVersion(version) {
  fs.writeFileSync(versionFile, version);
}

function incrementVersion(type, currentVersion) {
  let [major, minor, patch] = currentVersion.split('.').map(Number);

  switch (type) {
    case 'major':
      major += 1;
      minor = 0;
      patch = 0;
      break;
    case 'minor':
      minor += 1;
      patch = 0;
      break;
    case 'patch':
      patch += 1;
      break;
    default:
      console.error('Invalid version increment type. Use major, minor, or patch.');
      process.exit(1);
  }

  return `${major}.${minor}.${patch}`;
}

function commitAndTagVersion(newVersion) {
  execSync(`git add ${versionFile}`);
  execSync(`git commit -m "Bump version to ${newVersion}"`);
  execSync(`git tag v${newVersion}`);
  execSync('git push origin main --tags');
}

if (process.argv.length !== 3) {
  console.error('Usage: node version.js {major|minor|patch}');
  process.exit(1);
}

const type = process.argv[2];
const currentVersion = getCurrentVersion();
console.log(`Current version: ${currentVersion}`);

const newVersion = incrementVersion(type, currentVersion);
console.log(`New version: ${newVersion}`);

writeNewVersion(newVersion);
commitAndTagVersion(newVersion);
