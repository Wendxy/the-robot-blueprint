import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve('dist');
const base = (process.env.BASE_PATH || '/').replace(/\/$/, '') + '/';
const origin = new URL(process.env.SITE_URL || 'http://localhost:4321').origin;
async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map(entry => entry.isDirectory() ? walk(path.join(directory, entry.name)) : path.join(directory, entry.name)))).flat();
}
const htmlFiles = (await walk(root)).filter(file => file.endsWith('.html'));
let checked = 0;
const failures = [];
for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  const relative = path.relative(root, file).split(path.sep).join('/');
  const pageUrl = new URL(base + relative.replace(/index\.html$/, ''), origin);
  for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    const value = match[1].replaceAll('&amp;', '&');
    if (/^(?:mailto:|tel:|data:|javascript:)/.test(value)) continue;
    const url = new URL(value, pageUrl);
    if (url.origin !== origin) continue;
    if (!url.pathname.startsWith(base)) {
      failures.push(`${relative}: escapes deployment base: ${value}`);
      continue;
    }
    const deployedPath = decodeURIComponent(url.pathname.slice(base.length));
    let target = path.join(root, deployedPath);
    try {
      if ((await stat(target)).isDirectory()) target = path.join(target, 'index.html');
      await stat(target);
      if (url.hash && target.endsWith('.html')) {
        const targetHtml = target === file ? html : await readFile(target, 'utf8');
        const id = decodeURIComponent(url.hash.slice(1));
        if (!targetHtml.includes(`id="${id}"`)) failures.push(`${relative}: missing anchor: ${value}`);
      }
      checked++;
    } catch {
      failures.push(`${relative}: missing file: ${value}`);
    }
  }
}
if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log(`Checked ${checked} local links and assets across ${htmlFiles.length} pages (base: ${base}).`);
