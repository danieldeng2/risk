import sharp from "sharp";
import { writeFileSync, mkdirSync } from "fs";

const W = 1200;
const H = 630;

const svg = `
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1a1a2e"/>
      <stop offset="100%" stop-color="#16213e"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="${W}" height="${H}" fill="url(#bg)"/>

  <!-- Subtle grid lines -->
  <line x1="0" y1="210" x2="${W}" y2="210" stroke="#2a2a4a" stroke-width="1"/>
  <line x1="0" y1="420" x2="${W}" y2="420" stroke="#2a2a4a" stroke-width="1"/>
  <line x1="400" y1="0" x2="400" y2="${H}" stroke="#2a2a4a" stroke-width="1"/>
  <line x1="800" y1="0" x2="800" y2="${H}" stroke="#2a2a4a" stroke-width="1"/>

  <!-- Accent left bar -->
  <rect x="0" y="0" width="6" height="${H}" fill="#e94560"/>

  <!-- Title -->
  <text x="80" y="220" font-family="system-ui, -apple-system, sans-serif"
        font-size="80" font-weight="700" fill="#eaeaea" letter-spacing="-2">
    Risk Game
  </text>
  <text x="80" y="320" font-family="system-ui, -apple-system, sans-serif"
        font-size="80" font-weight="700" fill="#e94560" letter-spacing="-2">
    Calculator
  </text>

  <!-- Tagline -->
  <text x="80" y="400" font-family="system-ui, -apple-system, sans-serif"
        font-size="30" fill="#8892a4">
    Instant, exact battle odds for the board game Risk
  </text>

  <!-- Feature pills -->
  <rect x="80" y="440" width="210" height="48" rx="8" fill="#2a2a4a"/>
  <text x="185" y="471" font-family="system-ui, -apple-system, sans-serif"
        font-size="22" fill="#eaeaea" text-anchor="middle">Min Attackers</text>

  <rect x="306" y="440" width="240" height="48" rx="8" fill="#2a2a4a"/>
  <text x="426" y="471" font-family="system-ui, -apple-system, sans-serif"
        font-size="22" fill="#eaeaea" text-anchor="middle">Probability Lookup</text>

  <rect x="562" y="440" width="180" height="48" rx="8" fill="#2a2a4a"/>
  <text x="652" y="471" font-family="system-ui, -apple-system, sans-serif"
        font-size="22" fill="#eaeaea" text-anchor="middle">Lookup Table</text>

  <!-- URL -->
  <text x="80" y="580" font-family="system-ui, -apple-system, sans-serif"
        font-size="22" fill="#2a2a4a">
    danieldeng2.github.io/risk
  </text>

  <!-- Decorative dice graphic (right side) -->
  <!-- Dice body -->
  <rect x="920" y="160" width="200" height="200" rx="28" fill="#2a2a4a" stroke="#3a3a6a" stroke-width="2"/>
  <!-- Dice dots for "5" pattern -->
  <circle cx="960" cy="205" r="14" fill="#e94560"/>
  <circle cx="1080" cy="205" r="14" fill="#e94560"/>
  <circle cx="960" cy="260" r="14" fill="#e94560"/>
  <circle cx="1020" cy="260" r="14" fill="#e94560"/>
  <circle cx="1080" cy="260" r="14" fill="#e94560"/>
  <circle cx="960" cy="315" r="14" fill="#e94560"/>
  <circle cx="1080" cy="315" r="14" fill="#e94560"/>

  <!-- Second dice (offset, behind) -->
  <rect x="870" y="120" width="200" height="200" rx="28" fill="#16213e" stroke="#2a2a4a" stroke-width="2"/>
  <!-- Dice dots for "3" pattern -->
  <circle cx="910" cy="160" r="14" fill="#8892a4"/>
  <circle cx="970" cy="220" r="14" fill="#8892a4"/>
  <circle cx="1030" cy="280" r="14" fill="#8892a4"/>
</svg>
`;

mkdirSync("public", { recursive: true });

sharp(Buffer.from(svg))
  .png()
  .toFile("public/og.png")
  .then(() => console.log("Generated public/og.png"))
  .catch((err) => { console.error(err); process.exit(1); });
