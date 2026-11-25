// Copies the game files from the repo root into www/ — the directory
// Capacitor syncs into the Android APK (webDir in capacitor.config.json).
// www/ is generated (gitignored): the repo root stays the single source of
// truth, and the GitHub Actions build regenerates www/ on every run.
// The game itself (index.html + assets/) is copied VERBATIM — never edit
// the game files here; changes come from the web artifact (lm-l-lgz).
// Usage: node scripts/sync-www.js
'use strict';
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const www = path.join(root, 'www');

// Files/dirs copied verbatim (the game itself + policy + icons).
const COPY = [
  'index.html', 'privacy.html',
  'icon-192.png', 'icon-512.png',
  'assets',
];
// Never copied into the APK (docs, tests, build tooling, sources).
const SKIP = new Set([
  'www', 'android', 'node_modules', '.git', '.github',
  'scripts', 'package.json', 'package-lock.json', 'capacitor.config.json',
  'icon.webp',
]);

fs.rmSync(www, { recursive: true, force: true });
fs.mkdirSync(www, { recursive: true });
for (const name of COPY) {
  const src = path.join(root, name);
  if (!fs.existsSync(src)) {
    throw new Error('sync-www: missing expected file: ' + name);
  }
  if (SKIP.has(name)) continue;
  fs.cpSync(src, path.join(www, name), { recursive: true });
}
const mp3s = fs.readdirSync(path.join(www, 'assets', 'voice')).filter(f => f.endsWith('.mp3')).length
  + fs.readdirSync(path.join(www, 'assets', 'quran')).filter(f => f.endsWith('.mp3')).length;
console.log('sync-www: copied ' + COPY.length + ' entries into www/ (' + mp3s + ' MP3s bundled)');
