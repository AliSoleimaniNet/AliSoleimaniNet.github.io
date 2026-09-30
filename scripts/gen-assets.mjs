// Generates raster assets from hand-authored SVG: favicons, OG image and the no-WebGL poster.
// Run: pnpm assets
import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pub = (f) => join(root, 'public', f);

// ── favicons ──────────────────────────────────────────────────────────
const favicon = readFileSync(pub('favicon.svg'));
await sharp(favicon, { density: 384 }).resize(32, 32).png().toFile(pub('favicon-32.png'));
await sharp(favicon, { density: 384 }).resize(180, 180).png().toFile(pub('apple-touch-icon.png'));

// ── shared mesh motif ─────────────────────────────────────────────────
function mesh(seed, count, w, h, accent) {
  let s = seed;
  const rnd = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  const pts = Array.from({ length: count }, () => [w * 0.45 + rnd() * w * 0.55, rnd() * h]);
  let out = '';
  pts.forEach((p, i) => {
    const near = pts.map((q, j) => ({ j, d: Math.hypot(p[0] - q[0], p[1] - q[1]) })).filter((x) => x.j !== i).sort((a, b) => a.d - b.d).slice(0, 2);
    near.forEach(({ j }) => { const q = pts[j]; out += `<line x1="${p[0]}" y1="${p[1]}" x2="${q[0]}" y2="${q[1]}" stroke="${accent}" stroke-opacity=".22" stroke-width="1.2"/>`; });
  });
  pts.forEach(([x, y], i) => {
    const r = 3 + (i % 3) * 1.5;
    out += `<circle cx="${x}" cy="${y}" r="${r * 3}" fill="${accent}" fill-opacity=".10"/><circle cx="${x}" cy="${y}" r="${r}" fill="${accent}"/>`;
  });
  return out;
}

const FONT = `'Segoe UI', 'Helvetica Neue', Helvetica, Arial, sans-serif`;
const MONO = `'Cascadia Code', Consolas, 'Courier New', monospace`;

// ── OG image 1200×630 ─────────────────────────────────────────────────
const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#07090f"/><stop offset="1" stop-color="#0b1020"/></linearGradient>
  <linearGradient id="nm" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#e6e9ef"/><stop offset=".55" stop-color="#22d3ee"/><stop offset="1" stop-color="#a78bfa"/></linearGradient>
  <radialGradient id="gl" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#22d3ee" stop-opacity=".25"/><stop offset="1" stop-color="#22d3ee" stop-opacity="0"/></radialGradient>
</defs>
<rect width="1200" height="630" fill="url(#bg)"/>
<ellipse cx="900" cy="315" rx="420" ry="300" fill="url(#gl)"/>
${mesh(11, 26, 1200, 630, '#22d3ee')}
<text x="80" y="200" font-family="${MONO}" font-size="22" fill="#8b93a3">// alisoleimaninet.github.io</text>
<text x="76" y="300" font-family="${FONT}" font-size="96" font-weight="800" letter-spacing="-3" fill="url(#nm)">Ali Soleimani</text>
<text x="80" y="360" font-family="${FONT}" font-size="34" font-weight="600" fill="#22d3ee">Tech Lead · Software Architect · .NET &amp; Go</text>
<text x="80" y="410" font-family="${FONT}" font-size="24" fill="#8b93a3">Leading teams and designing scalable systems.</text>
<g font-family="${FONT}" font-size="18" font-weight="600" fill="#9be9f5">
  <rect x="80" y="460" width="210" height="40" rx="20" fill="#22d3ee" fill-opacity=".12" stroke="#22d3ee" stroke-opacity=".4"/><text x="185" y="486" text-anchor="middle">Tech Lead @ Helpsy</text>
  <rect x="304" y="460" width="120" height="40" rx="20" fill="#22d3ee" fill-opacity=".12" stroke="#22d3ee" stroke-opacity=".4"/><text x="364" y="486" text-anchor="middle">.NET · Go</text>
  <rect x="438" y="460" width="150" height="40" rx="20" fill="#22d3ee" fill-opacity=".12" stroke="#22d3ee" stroke-opacity=".4"/><text x="513" y="486" text-anchor="middle">Isfahan, IR</text>
</g>
</svg>`;
await sharp(Buffer.from(og)).png({ quality: 90 }).toFile(pub('og.png'));

// ── Poster (no-WebGL fallback) 1920×1080 ──────────────────────────────
const poster = `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#07090f"/><stop offset="1" stop-color="#0b1020"/></linearGradient>
  <radialGradient id="gl" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#22d3ee" stop-opacity=".22"/><stop offset="1" stop-color="#22d3ee" stop-opacity="0"/></radialGradient>
</defs>
<rect width="1920" height="1080" fill="url(#bg)"/>
<ellipse cx="1300" cy="520" rx="700" ry="480" fill="url(#gl)"/>
${mesh(23, 48, 1920, 1080, '#22d3ee')}
</svg>`;
await sharp(Buffer.from(poster)).webp({ quality: 78 }).toFile(pub('poster.webp'));

// ── small avatar (webp) ───────────────────────────────────────────────
try {
  await sharp(pub('avatar.jpg')).resize(160, 160).webp({ quality: 85 }).toFile(pub('avatar-160.webp'));
} catch { /* avatar missing */ }

console.log('assets generated');
