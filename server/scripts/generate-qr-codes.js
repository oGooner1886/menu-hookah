import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateTableSign } from '../src/services/security.service.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Домен по умолчанию (можно передать аргументом: node generate-qr-codes.js https://my-domain.ru)
const baseUrl = process.argv[2] || process.env.PUBLIC_MENU_URL || 'https://gustolounge.ru';

// Список всех столов Gusto Lounge
const tables = [
  // Зеленый зал
  { number: '1', name: 'Стол 1', section: 'Зеленый зал' },
  { number: '2', name: 'Стол 2', section: 'Зеленый зал' },
  { number: '3', name: 'Стол 3', section: 'Зеленый зал' },
  { number: '4', name: 'Стол 4', section: 'Зеленый зал' },
  { number: '5', name: 'Стол 5', section: 'Зеленый зал' },
  { number: '6', name: 'Стол 6', section: 'Зеленый зал' },
  { number: '7', name: 'Стол 7', section: 'Зеленый зал' },
  { number: '8', name: 'Стол 8', section: 'Зеленый зал' },
  { number: '9', name: 'Стол 9', section: 'Зеленый зал' },
  { number: '10', name: 'Стол 10', section: 'Зеленый зал' },
  { number: '11', name: 'Стол 11', section: 'Зеленый зал' },
  { number: '12', name: 'Стол 12', section: 'Зеленый зал' },
  { number: '13', name: 'Стол 13', section: 'Зеленый зал' },
  { number: '14', name: 'Стол 14', section: 'Зеленый зал' },
  { number: '15', name: 'Стол 15', section: 'Зеленый зал' },
  { number: '16', name: 'Стол 16', section: 'Зеленый зал' },
  { number: '51', name: 'Балкон левый', section: 'Зеленый зал' },
  { number: '52', name: 'Балкон центральный', section: 'Зеленый зал' },
  { number: '17', name: 'Стол 17', section: 'Зеленый зал' },
  { number: '18', name: 'Стол 18', section: 'Зеленый зал' },
  // Второй зал
  { number: '21', name: 'Стол 21', section: 'Второй зал' },
  { number: '22', name: 'Стол 22', section: 'Второй зал' },
  { number: '23', name: 'Стол 23', section: 'Второй зал' },
  { number: '24', name: 'Стол 24', section: 'Второй зал' },
  { number: '25', name: 'Стол 25', section: 'Второй зал' },
  { number: '26', name: 'Стол 26', section: 'Второй зал' },
  { number: '27', name: 'Стол 27', section: 'Второй зал' },
  { number: '28', name: 'Стол 28', section: 'Второй зал' },
  { number: '29', name: 'Стол 29', section: 'Второй зал' },
  { number: '30', name: 'Балкон правый', section: 'Второй зал' },
];

// ============================================================================
// Встроенный генератор матрицы QR-кода (ECC Level H — 30% коррекции ошибок)
// ============================================================================
const EXP = new Uint8Array(512);
const LOG = new Uint8Array(256);
(() => {
  let x = 1;
  for (let i = 0; i < 255; i++) {
    EXP[i] = x;
    LOG[x] = i;
    x = (x << 1) ^ (x & 128 ? 0x11d : 0);
  }
  for (let i = 255; i < 512; i++) EXP[i] = EXP[i - 255];
})();

function gfMul(a, b) {
  return a === 0 || b === 0 ? 0 : EXP[LOG[a] + LOG[b]];
}

function rsGeneratorPoly(degree) {
  let poly = [1];
  for (let i = 0; i < degree; i++) {
    const next = new Array(poly.length + 1).fill(0);
    const root = EXP[i];
    for (let j = 0; j < poly.length; j++) {
      next[j] ^= poly[j];
      next[j + 1] ^= gfMul(poly[j], root);
    }
    poly = next;
  }
  return poly;
}

function rsEncode(data, ecLen) {
  const gen = rsGeneratorPoly(ecLen);
  const rem = new Uint8Array(ecLen);
  for (let i = 0; i < data.length; i++) {
    const factor = data[i] ^ rem[0];
    rem.copyWithin(0, 1);
    rem[ecLen - 1] = 0;
    for (let j = 0; j < ecLen; j++) {
      rem[j] ^= gfMul(gen[j + 1], factor);
    }
  }
  return rem;
}

const VERSION_TABLE_H = {
  1: { ec: 17, groups: [[1, 9]], align: [] },
  2: { ec: 28, groups: [[1, 16]], align: [6, 18] },
  3: { ec: 22, groups: [[2, 13]], align: [6, 22] },
  4: { ec: 16, groups: [[4, 9]], align: [6, 26] },
  5: { ec: 22, groups: [[2, 11], [2, 12]], align: [6, 30] },
  6: { ec: 28, groups: [[4, 15]], align: [6, 34] },
  7: { ec: 26, groups: [[4, 13], [1, 14]], align: [6, 22, 38] },
  8: { ec: 26, groups: [[4, 14], [2, 15]], align: [6, 24, 42] },
};

function createQrMatrix(text) {
  const bytes = Buffer.from(text, 'utf8');
  let ver = 1;
  let info = null;
  for (let v = 1; v <= 8; v++) {
    const entry = VERSION_TABLE_H[v];
    const cap = entry.groups.reduce((s, [b, d]) => s + b * d, 0);
    if (bytes.length + 2 <= cap) {
      ver = v;
      info = { ...entry, totalData: cap };
      break;
    }
  }
  if (!info) throw new Error('URL слишком длинный для QR v1..8-H');

  const bits = [];
  const pushBits = (val, len) => {
    for (let i = len - 1; i >= 0; i--) bits.push((val >> i) & 1);
  };
  pushBits(0b0100, 4);
  pushBits(bytes.length, 8);
  for (const b of bytes) pushBits(b, 8);

  const maxBits = info.totalData * 8;
  pushBits(0, Math.min(4, maxBits - bits.length));
  while (bits.length % 8 !== 0) bits.push(0);

  const dataBytes = new Uint8Array(info.totalData);
  for (let i = 0; i < bits.length / 8; i++) {
    let val = 0;
    for (let b = 0; b < 8; b++) val = (val << 1) | bits[i * 8 + b];
    dataBytes[i] = val;
  }
  const padBytes = [0xec, 0x11];
  for (let i = bits.length / 8, p = 0; i < info.totalData; i++, p ^= 1) {
    dataBytes[i] = padBytes[p];
  }

  const dataBlocks = [];
  const ecBlocks = [];
  let offset = 0;
  for (const [numBlocks, dataLen] of info.groups) {
    for (let b = 0; b < numBlocks; b++) {
      const block = dataBytes.slice(offset, offset + dataLen);
      offset += dataLen;
      dataBlocks.push(block);
      ecBlocks.push(rsEncode(block, info.ec));
    }
  }

  const finalCodewords = [];
  const maxDataLen = Math.max(...dataBlocks.map((b) => b.length));
  for (let i = 0; i < maxDataLen; i++) {
    for (const block of dataBlocks) {
      if (i < block.length) finalCodewords.push(block[i]);
    }
  }
  for (let i = 0; i < info.ec; i++) {
    for (const block of ecBlocks) {
      finalCodewords.push(block[i]);
    }
  }

  const size = ver * 4 + 17;
  const matrix = Array.from({ length: size }, () => new Int8Array(size).fill(0));
  const reserved = Array.from({ length: size }, () => new Uint8Array(size).fill(0));

  const setModule = (r, c, dark, res = true) => {
    if (r < 0 || r >= size || c < 0 || c >= size) return;
    matrix[r][c] = dark ? 1 : 0;
    if (res) reserved[r][c] = 1;
  };

  const drawFinder = (r0, c0) => {
    for (let dr = -1; dr <= 7; dr++) {
      for (let dc = -1; dc <= 7; dc++) {
        const r = r0 + dr;
        const c = c0 + dc;
        if (r < 0 || r >= size || c < 0 || c >= size) continue;
        const inOuter = dr >= 0 && dr <= 6 && dc >= 0 && dc <= 6;
        const onBorder = dr === 0 || dr === 6 || dc === 0 || dc === 6;
        const inInner = dr >= 2 && dr <= 4 && dc >= 2 && dc <= 4;
        setModule(r, c, inOuter && (onBorder || inInner), true);
      }
    }
  };
  drawFinder(0, 0);
  drawFinder(0, size - 7);
  drawFinder(size - 7, 0);

  const align = info.align;
  for (let i = 0; i < align.length; i++) {
    for (let j = 0; j < align.length; j++) {
      if ((i === 0 && j === 0) || (i === 0 && j === align.length - 1) || (i === align.length - 1 && j === 0)) {
        continue;
      }
      const r0 = align[i];
      const c0 = align[j];
      for (let dr = -2; dr <= 2; dr++) {
        for (let dc = -2; dc <= 2; dc++) {
          setModule(r0 + dr, c0 + dc, Math.max(Math.abs(dr), Math.abs(dc)) !== 1, true);
        }
      }
    }
  }

  for (let i = 8; i < size - 8; i++) {
    if (!reserved[6][i]) setModule(6, i, i % 2 === 0, true);
    if (!reserved[i][6]) setModule(i, 6, i % 2 === 0, true);
  }

  setModule(4 * ver + 9, 8, true, true);
  for (let i = 0; i < 9; i++) {
    if (!reserved[8][i]) reserved[8][i] = 1;
    if (!reserved[i][8]) reserved[i][8] = 1;
  }
  for (let i = 0; i < 8; i++) {
    reserved[8][size - 1 - i] = 1;
    reserved[size - 1 - i][8] = 1;
  }

  if (ver >= 7) {
    let rem = ver;
    for (let i = 0; i < 12; i++) rem = (rem << 1) ^ ((rem >> 11) & 1 ? 0x1f25 : 0);
    const vBits = (ver << 12) | rem;
    for (let i = 0; i < 18; i++) {
      const bit = ((vBits >> i) & 1) === 1;
      const a = size - 11 + (i % 3);
      const b = Math.floor(i / 3);
      setModule(b, a, bit, true);
      setModule(a, b, bit, true);
    }
  }

  const allBits = [];
  for (const cw of finalCodewords) {
    for (let b = 7; b >= 0; b--) allBits.push((cw >> b) & 1);
  }

  let bitIdx = 0;
  let upward = true;
  for (let right = size - 1; right >= 1; right -= 2) {
    if (right === 6) right = 5;
    for (let vert = 0; vert < size; vert++) {
      const r = upward ? size - 1 - vert : vert;
      for (let j = 0; j < 2; j++) {
        const c = right - j;
        if (!reserved[r][c]) {
          matrix[r][c] = bitIdx < allBits.length ? allBits[bitIdx++] : 0;
        }
      }
    }
    upward = !upward;
  }

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (!reserved[r][c] && (r + c) % 2 === 0) matrix[r][c] ^= 1;
    }
  }

  const fmtData = 0b10 << 3;
  let fmtRem = fmtData;
  for (let i = 0; i < 10; i++) fmtRem = (fmtRem << 1) ^ ((fmtRem >> 9) & 1 ? 0x537 : 0);
  const fmtBits = ((fmtData << 10) | fmtRem) ^ 0x5412;

  const fmtCoords1 = [
    [8, 0], [8, 1], [8, 2], [8, 3], [8, 4], [8, 5], [8, 7], [8, 8],
    [7, 8], [5, 8], [4, 8], [3, 8], [2, 8], [1, 8], [0, 8],
  ];
  const fmtCoords2 = [
    [size - 1, 8], [size - 2, 8], [size - 3, 8], [size - 4, 8], [size - 5, 8], [size - 6, 8], [size - 7, 8],
    [8, size - 8], [8, size - 7], [8, size - 6], [8, size - 5], [8, size - 4], [8, size - 3], [8, size - 2], [8, size - 1],
  ];
  for (let i = 0; i < 15; i++) {
    const bit = (fmtBits >> (14 - i)) & 1;
    matrix[fmtCoords1[i][0]][fmtCoords1[i][1]] = bit;
    matrix[fmtCoords2[i][0]][fmtCoords2[i][1]] = bit;
  }

  return matrix;
}

/**
 * Рендеринг векторного SVG QR-кода в стиле Swiss Minimal (жидкие капсулы + каплевидные уголки)
 */
function buildSwissQrSvg(matrix) {
  const N = matrix.length;
  const PAD = 2;
  const totalView = N + PAD * 2;
  const fg = '#14171A';
  const accent = '#2E7D32';
  const mid = (N - 1) / 2;

  const isFinderZone = (r, c) =>
    (r < 7 && c < 7) || (r < 7 && c >= N - 7) || (r >= N - 7 && c < 7);
  const isCenterCutout = (r, c) => Math.hypot(r - mid, c - mid) <= 5.4;
  const isDark = (r, c) => {
    if (r < 0 || r >= N || c < 0 || c >= N) return false;
    if (isFinderZone(r, c) || isCenterCutout(r, c)) return false;
    return matrix[r][c] === 1;
  };

  const renderEye = (r0, c0) => {
    const x = c0 + PAD;
    const y = r0 + PAD;
    return `<rect x="${x + 0.5}" y="${y + 0.5}" width="6" height="6" rx="2.1" fill="none" stroke="${fg}" stroke-width="1"/><rect x="${x + 2}" y="${y + 2}" width="3" height="3" rx="1.15" fill="${accent}"/>`;
  };

  let out = `<svg class="qr-svg" viewBox="0 0 ${totalView} ${totalView}" xmlns="http://www.w3.org/2000/svg">`;
  out += renderEye(0, 0) + renderEye(0, N - 7) + renderEye(N - 7, 0);

  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      if (!isDark(r, c)) continue;
      const x = c + PAD;
      const y = r + PAD;
      out += `<circle cx="${x + 0.5}" cy="${y + 0.5}" r="0.42" fill="${fg}"/>`;
      if (isDark(r, c + 1)) {
        out += `<rect x="${x + 0.5}" y="${y + 0.08}" width="1" height="0.84" fill="${fg}"/>`;
      }
      if (isDark(r + 1, c)) {
        out += `<rect x="${x + 0.08}" y="${y + 0.5}" width="0.84" height="1" fill="${fg}"/>`;
      }
    }
  }
  out += `</svg>`;
  return out;
}

console.log('\n========================================================================');
console.log(`ГЕНЕРАЦИЯ ПОДПИСАННЫХ QR-ССЫЛОК (Базовый URL: ${baseUrl})`);
console.log(`Секретный ключ TABLE_SECRET: "${process.env.TABLE_SECRET || 'gusto_lounge_table_secret_2026'}"`);
console.log('========================================================================\n');

const results = tables.map((t) => {
  const sign = generateTableSign(t.number);
  const fullUrl = `${baseUrl.replace(/\/$/, '')}/gusto/menu?table=${t.number}&sign=${sign}`;
  const matrix = createQrMatrix(fullUrl);
  const qrSvg = buildSwissQrSvg(matrix);
  const paddedNum = String(t.number).padStart(2, '0');
  const subtitle = t.name.startsWith('Балкон') ? `${t.section} • ${t.name}` : t.section;

  return {
    ...t,
    paddedNum,
    subtitle,
    sign,
    fullUrl,
    qrSvg,
  };
});

console.table(
  results.map((r) => ({
    '№': r.number,
    'Название': r.name,
    'Зал': r.section,
    'Подпись (sign)': r.sign,
    'Ссылка для QR': r.fullUrl,
  }))
);

// Читаем оригинальный логотип Gusto Lounge из client/src/assets/images
const logoPath = path.resolve(__dirname, '../../client/src/assets/images/favicon.png');
const logoBase64 = fs.readFileSync(logoPath).toString('base64');
const logoDataUri = `data:image/png;base64,${logoBase64}`;

const logoMedallionHtml = `
  <div class="qr-medallion">
    <img class="gusto-logo-img" alt="Gusto Lounge" />
  </div>`;

const cardsHtml = results
  .map(
    (r) => `
    <div class="qr-card">
      <div class="card-top">
        <div class="card-top-left">
          <div class="brand">GUSTO LOUNGE</div>
          <div class="section-name">${r.subtitle}</div>
        </div>
        <div class="table-num">${r.paddedNum}</div>
      </div>

      <div class="qr-stage">
        ${r.qrSvg}
        ${logoMedallionHtml}
      </div>

      <div class="card-bottom">
        <span class="bottom-label">Меню и заказ</span>
        <span class="bottom-cta">QR →</span>
      </div>
    </div>`
  )
  .join('\n');

const htmlContent = `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>QR-коды столов — Gusto Lounge (Swiss Minimal)</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #0f1115;
      color: #fff;
      padding: 30px;
      -webkit-font-smoothing: antialiased;
    }
    .header-bar {
      max-width: 1080px;
      margin: 0 auto 30px auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #181c23;
      padding: 16px 24px;
      border-radius: 12px;
      border: 1px solid #282f3c;
    }
    .header-title h1 {
      font-size: 19px;
      margin-bottom: 4px;
      color: #f3f4f6;
    }
    .header-title p {
      font-size: 13px;
      color: #9ca3af;
    }
    .print-btn {
      background: #2E7D32;
      color: #ffffff;
      font-weight: 600;
      padding: 10px 20px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
      transition: background 0.2s;
    }
    .print-btn:hover {
      background: #388E3C;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(225px, 1fr));
      gap: 22px;
      max-width: 1080px;
      margin: 0 auto;
    }
    .qr-card {
      background: #FAF9F6;
      color: #111315;
      border-radius: 16px;
      padding: 18px 18px 16px 18px;
      border: 1px solid #E5E4DF;
      box-shadow: 0 6px 18px rgba(0, 0, 0, 0.22);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      page-break-inside: avoid;
      break-inside: avoid;
    }
    .card-top {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      border-bottom: 1px solid #E5E4DF;
      padding-bottom: 10px;
      margin-bottom: 14px;
    }
    .brand {
      font-size: 10px;
      font-weight: 600;
      letter-spacing: 0.18em;
      color: #71717A;
      text-transform: uppercase;
    }
    .section-name {
      font-size: 13px;
      font-weight: 700;
      color: #111315;
      margin-top: 2px;
    }
    .table-num {
      font-size: 28px;
      font-weight: 800;
      letter-spacing: -0.03em;
      line-height: 1;
      color: #111315;
    }
    .qr-stage {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 2px 0;
    }
    .qr-svg {
      width: 176px;
      height: 176px;
      display: block;
    }
    .qr-medallion {
      position: absolute;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: #FAF9F6;
      border: 1.5px solid #2E7D32;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.10);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 3px;
    }
    .gusto-logo-img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      display: block;
    }
    .card-bottom {
      margin-top: 14px;
      padding-top: 10px;
      border-top: 1px solid #E5E4DF;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 11px;
    }
    .bottom-label {
      color: #52525B;
      font-weight: 500;
    }
    .bottom-cta {
      color: #2E7D32;
      font-weight: 700;
    }

    @media print {
      body {
        background: #fff !important;
        padding: 0 !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      .header-bar {
        display: none !important;
      }
      .grid {
        grid-template-columns: repeat(3, 1fr) !important;
        gap: 14px !important;
        max-width: 100% !important;
      }
      .qr-card {
        box-shadow: none !important;
        border: 1px solid #D4D4CE !important;
      }
    }
  </style>
</head>
<body>
  <div class="header-bar">
    <div class="header-title">
      <h1>Таблички с QR-кодами столов — Swiss Minimal</h1>
      <p>Базовый URL: <strong>${baseUrl}</strong> • Всего столов: <strong>${results.length}</strong> • Векторный QR (ECC Level H)</p>
    </div>
    <button class="print-btn" onclick="window.print()">Распечатать все наклейки (Ctrl + P)</button>
  </div>

  <div class="grid">
    ${cardsHtml}
  </div>
  <script>
    const LOGO_URI = "${logoDataUri}";
    document.querySelectorAll('.gusto-logo-img').forEach(img => { img.src = LOGO_URI; });
  </script>
</body>
</html>`;

const outPath = path.join(__dirname, 'print-qr-cards.html');
fs.writeFileSync(outPath, htmlContent, 'utf-8');

console.log(`\nГотово! Создан интерактивный лист для печати (Swiss Minimal):`);
console.log(`-> ${outPath}`);
console.log(`Просто откройте этот HTML в браузере и нажмите Печать (Ctrl + P).\n`);
