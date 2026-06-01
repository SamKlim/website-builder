import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "exports");
const PUBLIC_TUTORS = path.resolve(ROOT, "..", "public", "tutors");
const PUBLIC_IMAGES = path.resolve(ROOT, "..", "public", "insight-tutors", "example-images");

const C = {
  coral: "#F0744A",
  sage: "#8EAF8A",
  bg: "#F4F4F2",
  text: "#1A1615",
  muted: "#6B6867",
  secondary: "#555551",
  white: "#FFFFFF",
  cardBorder: "#DCDCDA",
  border: "#E2DFDB",
  chalkboard: "#1A1615",
};

const RADIUS_CARD = 16;
const GRID_GAP = 24;
const GRID_PAD = 48;

const FONT_HEADING = "Insight Heading";
const FONT_BODY = "Insight Sans";

let FONT_DEFS = "";

const TUTOR_ORDER = [
  "samantha",
  "michaela",
  "georgia",
  "alex",
  "stephanie",
  "sophie",
  "alyssa",
  "zara",
];

const HERO_CARDS = [
  {
    slug: "alyssa",
    name: "Alyssa",
    bullets: ["99.6 ATAR", "Specialist Maths: 51", "VCE Methods specialist"],
  },
  {
    slug: "samantha",
    name: "Samantha",
    bullets: ["99.05 ATAR", "Qualified Software Engineer", "General Maths: 46"],
  },
  {
    slug: "stephanie",
    name: "Stephanie",
    bullets: ["98.05 ATAR", "VCE English & Literature", "English: 48 study score"],
  },
];

function esc(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function loadFontDefs() {
  const loraPath = path.join(ROOT, "brand", "fonts", "Lora.ttf");
  const interPath = path.join(ROOT, "brand", "fonts", "Inter.ttf");
  const loraB64 = (await fs.readFile(loraPath)).toString("base64");
  const interB64 = (await fs.readFile(interPath)).toString("base64");

  FONT_DEFS = `<defs>
    <style>
      @font-face {
        font-family: '${FONT_HEADING}';
        src: url(data:font/truetype;charset=utf-8;base64,${loraB64}) format('truetype');
        font-weight: 100 900;
      }
      @font-face {
        font-family: '${FONT_BODY}';
        src: url(data:font/truetype;charset=utf-8;base64,${interB64}) format('truetype');
        font-weight: 100 900;
      }
    </style>
  </defs>`;
}

function solidCanvas(w, h, content, bg = C.bg) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    ${FONT_DEFS}
    <rect width="${w}" height="${h}" fill="${bg}"/>
    ${content}
  </svg>`;
}

function roundMaskSvg(w, h, radius) {
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
      <rect x="0" y="0" width="${w}" height="${h}" rx="${radius}" ry="${radius}" fill="white"/>
    </svg>`,
  );
}

async function roundedPhoto(photoPath, size, radius = 12) {
  return sharp(photoPath)
    .resize(size, size, { fit: "cover", position: "top" })
    .composite([{ input: roundMaskSvg(size, size, radius), blend: "dest-in" }])
    .png()
    .toBuffer();
}

function logoMark(x, y, scale) {
  return `<g transform="translate(${x}, ${y}) scale(${scale})">
    <path d="M14 23 L4 17 L4 5 L14 11 Z" fill="${C.coral}"/>
    <path d="M14 23 L24 17 L24 5 L14 11 Z" fill="${C.coral}" fill-opacity="0.55"/>
    <line x1="14" y1="23" x2="14" y2="11" stroke="white" stroke-opacity="0.5" stroke-width="1.4"/>
    <circle cx="14" cy="11" r="1.2" fill="white" fill-opacity="0.4"/>
  </g>`;
}

function checkBullet(x, y, label) {
  return `
    <circle cx="${x}" cy="${y - 3}" r="8" fill="${C.sage}"/>
    <text x="${x}" y="${y}" text-anchor="middle" font-family="${FONT_BODY}" font-size="10" font-weight="700" fill="white">✓</text>
    <text x="${x + 18}" y="${y}" font-family="${FONT_BODY}" font-size="14" fill="${C.secondary}">${esc(label)}</text>
  `;
}

async function createUniformTile(photoPath, w, h) {
  const radius = RADIUS_CARD;

  const photo = await sharp(photoPath)
    .resize(w, h, { fit: "cover", position: "top" })
    .composite([{ input: roundMaskSvg(w, h, radius), blend: "dest-in" }])
    .png()
    .toBuffer();

  const border = Buffer.from(
    solidCanvas(
      w,
      h,
      `<rect x="0.5" y="0.5" width="${w - 1}" height="${h - 1}" rx="${radius}" fill="none" stroke="${C.cardBorder}" stroke-width="1"/>`,
      "transparent",
    ),
  );

  return sharp(photo)
    .composite([{ input: border, left: 0, top: 0 }])
    .png()
    .toBuffer();
}

async function renderStackedTutorCard(photoPath, name, bullets, cardW, cardH) {
  const photoSize = 80;
  const photoRadius = 12;
  const photo = await roundedPhoto(photoPath, photoSize, photoRadius);
  const shadow = 6;
  const pad = 14;
  const textX = pad + photoSize + 14;
  const bulletStartY = 50;
  const bulletGap = 22;

  const bulletsSvg = bullets
    .map((label, i) => checkBullet(textX, bulletStartY + i * bulletGap, label))
    .join("");

  const cardSvg = Buffer.from(
    solidCanvas(
      cardW + shadow,
      cardH + shadow,
      `
      <rect x="${shadow}" y="${shadow}" width="${cardW}" height="${cardH}" rx="${RADIUS_CARD}" ry="${RADIUS_CARD}" fill="${C.coral}"/>
      <rect x="0" y="0" width="${cardW}" height="${cardH}" rx="${RADIUS_CARD}" ry="${RADIUS_CARD}" fill="${C.white}" stroke="${C.cardBorder}" stroke-width="1"/>
      <text x="${textX}" y="36" font-family="${FONT_HEADING}" font-size="20" font-weight="500" fill="${C.text}">${esc(name)}</text>
      ${bulletsSvg}
    `,
    ),
  );

  return sharp(cardSvg)
    .composite([{ input: photo, left: pad, top: Math.round((cardH - photoSize) / 2) }])
    .png()
    .toBuffer();
}

function computeCardPlacements({ canvasH, cardH, cardCount, gap, areaLeft, stagger }) {
  const totalH = cardCount * cardH + (cardCount - 1) * gap;
  const startY = Math.round((canvasH - totalH) / 2);

  return Array.from({ length: cardCount }, (_, i) => ({
    left: areaLeft + (stagger[i] ?? 0),
    top: startY + i * (cardH + gap),
  }));
}

async function exportHeroTutorCards() {
  const w = 1200;
  const h = 630;
  const leftPad = 64;
  const cardW = 488;
  const cardH = 112;
  const cardGap = 20;
  const cardsLeft = 612;
  const stagger = [0, 10, 5];

  const placements = computeCardPlacements({
    canvasH: h,
    cardH,
    cardCount: HERO_CARDS.length,
    gap: cardGap,
    areaLeft: cardsLeft,
    stagger,
  });

  const composites = [];

  for (let i = 0; i < HERO_CARDS.length; i += 1) {
    const tutor = HERO_CARDS[i];
    const photoPath = path.join(PUBLIC_TUTORS, `${tutor.slug}.png`);
    const placement = placements[i];
    if (!tutor || !placement) continue;

    const card = await renderStackedTutorCard(photoPath, tutor.name, tutor.bullets, cardW, cardH);
    composites.push({ input: card, left: placement.left, top: placement.top });
  }

  const headlineSize = 42;
  const headlineLine = Math.round(headlineSize * 1.05);
  const subSize = 19;
  const subLine = 28;

  const base = Buffer.from(
    solidCanvas(w, h, `
      ${logoMark(leftPad, 52, 1.55)}
      <text x="${leftPad}" y="108" font-family="${FONT_HEADING}" font-size="${headlineSize}" font-weight="500" letter-spacing="-0.02em" fill="${C.text}">
        <tspan x="${leftPad}" dy="0">The most personal</tspan>
        <tspan x="${leftPad}" dy="${headlineLine}">VCE tutoring,</tspan>
        <tspan x="${leftPad}" dy="${headlineLine}">designed </tspan>
        <tspan fill="${C.coral}">for you.</tspan>
      </text>
      <text x="${leftPad}" y="248" font-family="${FONT_BODY}" font-size="${subSize}" fill="${C.muted}">
        <tspan x="${leftPad}" dy="0">Tutors in the top 2% of Victoria.</tspan>
        <tspan x="${leftPad}" dy="${subLine}">VCE Maths &amp; English · Melbourne · Online</tspan>
      </text>
      <rect x="${leftPad}" y="324" width="196" height="44" rx="22" fill="rgba(255,255,255,0.72)" stroke="rgba(26,22,21,0.18)" stroke-width="1"/>
      <text x="${leftPad + 98}" y="352" text-anchor="middle" font-family="${FONT_BODY}" font-size="14" font-weight="500" fill="${C.text}">Book a free class</text>
    `),
  );

  await sharp(base)
    .composite(composites)
    .png()
    .toFile(path.join(OUT, "hero", "personalised-tutoring-1200x630.png"));
}

async function clipToRoundedRect(imageInput, screenW, screenH, screenR) {
  const img = await sharp(imageInput)
    .resize(screenW, screenH, { fit: "cover", position: "top" })
    .composite([{ input: roundMaskSvg(screenW, screenH, screenR), blend: "dest-in" }])
    .png()
    .toBuffer();
  return img;
}

function deviceGradientDefs(scale) {
  return `
    <defs>
      <linearGradient id="phoneGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#444446"/>
        <stop offset="35%" stop-color="#1C1C1E"/>
        <stop offset="100%" stop-color="#2E2E30"/>
      </linearGradient>
      <linearGradient id="laptopLid" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#ECECEC"/>
        <stop offset="55%" stop-color="#D0D0D0"/>
        <stop offset="100%" stop-color="#B8B8B8"/>
      </linearGradient>
      <linearGradient id="laptopBase" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#C4C4C4"/>
        <stop offset="100%" stop-color="#989898"/>
      </linearGradient>
      <filter id="devShadow" x="-25%" y="-15%" width="150%" height="140%">
        <feDropShadow dx="0" dy="${Math.round(10 * scale)}" stdDeviation="${Math.round(14 * scale)}" flood-color="#000000" flood-opacity="0.22"/>
      </filter>
    </defs>
  `;
}

async function buildPhoneMockup(imagePath, scale = 1) {
  const frameW = Math.round(272 * scale);
  const frameH = Math.round(552 * scale);
  const outerR = Math.round(46 * scale);
  const bezel = Math.round(11 * scale);
  const screenR = Math.round(36 * scale);
  const screenX = bezel;
  const screenY = bezel + Math.round(3 * scale);
  const screenW = frameW - bezel * 2;
  const screenH = frameH - bezel * 2 - Math.round(6 * scale);
  const islandW = Math.round(78 * scale);
  const islandH = Math.round(23 * scale);
  const islandX = (frameW - islandW) / 2;
  const islandY = screenY + Math.round(11 * scale);
  const btnW = Math.round(3 * scale);
  const btnR = Math.round(1.5 * scale);

  const frameSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${frameW}" height="${frameH}">
    ${deviceGradientDefs(scale)}
    <g filter="url(#devShadow)">
      <rect x="1" y="1" width="${frameW - 2}" height="${frameH - 2}" rx="${outerR}" fill="url(#phoneGrad)" stroke="#565658" stroke-width="${scale}"/>
      <rect x="${bezel - 1}" y="${bezel - 1}" width="${screenW + 2}" height="${screenH + 2}" rx="${screenR + 1}" fill="#080808" stroke="#333335" stroke-width="${scale}"/>
    </g>
    <rect x="${-btnW}" y="${Math.round(118 * scale)}" width="${btnW}" height="${Math.round(30 * scale)}" rx="${btnR}" fill="#222224"/>
    <rect x="${-btnW}" y="${Math.round(158 * scale)}" width="${btnW}" height="${Math.round(52 * scale)}" rx="${btnR}" fill="#222224"/>
    <rect x="${-btnW}" y="${Math.round(218 * scale)}" width="${btnW}" height="${Math.round(52 * scale)}" rx="${btnR}" fill="#222224"/>
    <rect x="${frameW}" y="${Math.round(172 * scale)}" width="${btnW}" height="${Math.round(68 * scale)}" rx="${btnR}" fill="#222224"/>
  </svg>`;

  const overlaySvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${frameW}" height="${frameH}">
    <rect x="${islandX}" y="${islandY}" width="${islandW}" height="${islandH}" rx="${islandH / 2}" fill="#000000"/>
    <circle cx="${islandX + islandW - Math.round(17 * scale)}" cy="${islandY + islandH / 2}" r="${Math.round(4.5 * scale)}" fill="#0D1B2A"/>
    <rect x="${frameW / 2 - Math.round(54 * scale)}" y="${frameH - bezel - Math.round(7 * scale)}" width="${Math.round(108 * scale)}" height="${Math.round(4 * scale)}" rx="${Math.round(2 * scale)}" fill="#8E8E93" opacity="0.85"/>
  </svg>`;

  const screen = await clipToRoundedRect(imagePath, screenW, screenH, screenR);
  const frame = await sharp(Buffer.from(frameSvg)).png().toBuffer();
  const overlay = await sharp(Buffer.from(overlaySvg)).png().toBuffer();

  return sharp(frame)
    .composite([
      { input: screen, left: screenX, top: screenY },
      { input: overlay, left: 0, top: 0 },
    ])
    .png()
    .toBuffer();
}

async function buildLaptopMockup(imagePath, scale = 1) {
  const lidW = Math.round(372 * scale);
  const lidH = Math.round(236 * scale);
  const lidR = Math.round(10 * scale);
  const bezelTop = Math.round(13 * scale);
  const bezelSide = Math.round(11 * scale);
  const bezelBottom = Math.round(11 * scale);
  const screenW = lidW - bezelSide * 2;
  const screenH = lidH - bezelTop - bezelBottom;
  const screenR = Math.round(3 * scale);
  const baseExtra = Math.round(56 * scale);
  const baseW = lidW + baseExtra;
  const chinH = Math.round(24 * scale);
  const footH = Math.round(5 * scale);
  const totalW = baseW;
  const totalH = lidH + chinH + footH;
  const lidX = (totalW - lidW) / 2;
  const screenX = lidX + bezelSide;
  const screenY = bezelTop;
  const baseX = lidX - baseExtra / 2;
  const baseY = lidH - Math.round(2 * scale);
  const trackW = Math.round(108 * scale);
  const trackH = Math.round(7 * scale);
  const trackX = totalW / 2 - trackW / 2;
  const trackY = baseY + Math.round(8 * scale);

  const frameSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${totalW}" height="${totalH}">
    ${deviceGradientDefs(scale)}
    <g filter="url(#devShadow)">
      <path d="M ${baseX} ${baseY} L ${baseX + baseW} ${baseY} L ${baseX + baseW + Math.round(18 * scale)} ${baseY + chinH} L ${baseX - Math.round(18 * scale)} ${baseY + chinH} Z" fill="url(#laptopBase)" stroke="#8A8A8A" stroke-width="${scale}"/>
      <rect x="${baseX - Math.round(18 * scale)}" y="${baseY + chinH - scale}" width="${baseW + Math.round(36 * scale)}" height="${footH}" rx="${Math.round(2 * scale)}" fill="#7A7A7A"/>
      <rect x="${lidX}" y="0" width="${lidW}" height="${lidH}" rx="${lidR}" fill="url(#laptopLid)" stroke="#A8A8A8" stroke-width="${scale}"/>
      <rect x="${screenX - scale}" y="${screenY - scale}" width="${screenW + scale * 2}" height="${screenH + scale * 2}" rx="${screenR + scale}" fill="#0A0A0A"/>
      <rect x="${lidX + lidW / 2 - Math.round(28 * scale)}" y="${Math.round(5 * scale)}" width="${Math.round(56 * scale)}" height="${Math.round(8 * scale)}" rx="${Math.round(4 * scale)}" fill="#B0B0B0"/>
      <circle cx="${lidX + lidW / 2}" cy="${Math.round(9 * scale)}" r="${Math.round(2 * scale)}" fill="#333333"/>
      <rect x="${trackX}" y="${trackY}" width="${trackW}" height="${trackH}" rx="${Math.round(3 * scale)}" fill="#AEAEAE" stroke="#999999" stroke-width="${scale}"/>
      <line x1="${baseX + Math.round(24 * scale)}" y1="${baseY + Math.round(4 * scale)}" x2="${baseX + baseW - Math.round(24 * scale)}" y2="${baseY + Math.round(4 * scale)}" stroke="#B5B5B5" stroke-width="${scale}" opacity="0.7"/>
    </g>
  </svg>`;

  const screen = await clipToRoundedRect(imagePath, screenW, screenH, screenR);

  const screenOverlay = Buffer.from(
    solidCanvas(
      screenW,
      screenH,
      `
      <rect width="${screenW}" height="${screenH}" fill="${C.chalkboard}" fill-opacity="0.42"/>
      <text x="${Math.round(14 * scale)}" y="${Math.round(32 * scale)}" font-family="${FONT_BODY}" font-size="${Math.round(13 * scale)}" font-weight="500" fill="white">99+ ATAR</text>
      <text x="${Math.round(14 * scale)}" y="${screenH - Math.round(18 * scale)}" font-family="${FONT_HEADING}" font-size="${Math.round(21 * scale)}" font-weight="500" fill="white">VCAA exam prep</text>
    `,
      "transparent",
    ),
  );

  const frame = await sharp(Buffer.from(frameSvg)).png().toBuffer();

  return sharp(frame)
    .composite([
      { input: screen, left: screenX, top: screenY },
      { input: screenOverlay, left: screenX, top: screenY },
    ])
    .png()
    .toBuffer();
}

async function exportHeroDevices() {
  const w = 1200;
  const h = 630;
  const scale = 1;

  const base = Buffer.from(
    solidCanvas(w, h, `
      ${logoMark(64, 48, 1.6)}
      <text x="64" y="120" font-family="${FONT_HEADING}" font-size="40" font-weight="500" fill="${C.text}">Exam-style prep,</text>
      <text x="64" y="168" font-family="${FONT_HEADING}" font-size="40" font-weight="500" fill="${C.coral}">all year round.</text>
      <text x="64" y="220" font-family="${FONT_BODY}" font-size="20" fill="${C.muted}">26 years of VCAA past exams, organised by topic.</text>
    `),
  );

  const composites = [];

  const notesPath = path.join(PUBLIC_IMAGES, "exam-vault-questions.png");
  try {
    await fs.access(notesPath);
    const phone = await buildPhoneMockup(notesPath, scale);
    composites.push({ input: phone, left: 598, top: 36 });
  } catch {
    console.warn("Exam Vault screenshot not found for device mockup");
  }

  const tutorPath = path.join(PUBLIC_TUTORS, "samantha.png");
  const laptop = await buildLaptopMockup(tutorPath, scale);
  composites.push({ input: laptop, left: 748, top: 248 });

  await sharp(base).composite(composites).png().toFile(path.join(OUT, "hero", "exam-vault-devices-1200x630.png"));
}

async function exportTeamGrid() {
  const canvasW = 1080;
  const canvasH = 1080;
  const pad = GRID_PAD;
  const gap = GRID_GAP;
  const cols = 4;
  const rows = 2;
  const headerH = 196;
  const centerX = canvasW / 2;

  const contentW = canvasW - pad * 2;
  const cellW = Math.floor((contentW - gap * (cols - 1)) / cols);
  const gridH = canvasH - headerH - pad;
  const cellH = Math.floor((gridH - gap * (rows - 1)) / rows);

  const composites = [];

  for (let i = 0; i < TUTOR_ORDER.length; i += 1) {
    const slug = TUTOR_ORDER[i];
    const col = i % cols;
    const row = Math.floor(i / cols);
    const left = pad + col * (cellW + gap);
    const top = headerH + row * (cellH + gap);
    const photoPath = path.join(PUBLIC_TUTORS, `${slug}.png`);

    try {
      await fs.access(photoPath);
    } catch {
      continue;
    }

    const tile = await createUniformTile(photoPath, cellW, cellH);
    composites.push({ input: tile, left, top });
  }

  const header = Buffer.from(
    solidCanvas(canvasW, canvasH, `
      ${logoMark(centerX - 25, 44, 1.75)}
      <text x="${centerX}" y="118" text-anchor="middle" font-family="${FONT_HEADING}" font-size="40" font-weight="500" letter-spacing="-0.02em" fill="${C.text}">Meet Your Tutors</text>
      <text x="${centerX}" y="158" text-anchor="middle" font-family="${FONT_BODY}" font-size="20" fill="${C.muted}">VCE Maths &amp; English · Melbourne</text>
    `),
  );

  await sharp(header)
    .composite(composites)
    .png()
    .toFile(path.join(OUT, "google-business", "team-grid-1080.png"));
}

async function ensureExportDirs() {
  await fs.mkdir(path.join(OUT, "google-business"), { recursive: true });
  await fs.mkdir(path.join(OUT, "hero"), { recursive: true });

  for (const dir of ["logo", "instagram-feed", "instagram-story", "open-graph", "tutor-spotlights"]) {
    await fs.rm(path.join(OUT, dir), { recursive: true, force: true });
  }
}

async function main() {
  await loadFontDefs();
  await ensureExportDirs();
  await exportTeamGrid();
  await exportHeroTutorCards();
  await exportHeroDevices();
  console.log("Exported:");
  console.log("  exports/google-business/team-grid-1080.png");
  console.log("  exports/hero/personalised-tutoring-1200x630.png");
  console.log("  exports/hero/exam-vault-devices-1200x630.png");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
