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

console.log('\n========================================================================');
console.log(`ГЕНЕРАЦИЯ ПОДПИСАННЫХ QR-ССЫЛОК (Базовый URL: ${baseUrl})`);
console.log(`Секретный ключ TABLE_SECRET: "${process.env.TABLE_SECRET || 'gusto_lounge_table_secret_2026'}"`);
console.log('========================================================================\n');

const results = tables.map((t) => {
  const sign = generateTableSign(t.number);
  const fullUrl = `${baseUrl.replace(/\/$/, '')}/gusto/menu?table=${t.number}&sign=${sign}`;
  return {
    ...t,
    sign,
    fullUrl,
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

// Генерация красивого готового HTML-документа для печати наклеек / тейбл-тентов
const cardsHtml = results
  .map((r) => {
    const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=8&data=${encodeURIComponent(r.fullUrl)}`;
    return `
    <div class="qr-card">
      <div class="brand">GUSTO LOUNGE</div>
      <div class="table-name">${r.name}</div>
      <div class="section-name">${r.section}</div>
      <div class="qr-wrapper">
        <img src="${qrImageUrl}" alt="QR Стол ${r.number}" />
      </div>
      <div class="action-text">Наведите камеру<br>для заказа меню</div>
    </div>`;
  })
  .join('\n');

const htmlContent = `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>QR-коды столов — Gusto Lounge</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #0f1115;
      color: #fff;
      padding: 30px;
    }
    .header-bar {
      max-width: 1000px;
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
      font-size: 20px;
      margin-bottom: 4px;
      color: #f3f4f6;
    }
    .header-title p {
      font-size: 13px;
      color: #9ca3af;
    }
    .print-btn {
      background: #e6a84e;
      color: #0f1115;
      font-weight: 700;
      padding: 10px 20px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
      transition: background 0.2s;
    }
    .print-btn:hover {
      background: #f5b966;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 20px;
      max-width: 1100px;
      margin: 0 auto;
    }
    .qr-card {
      background: #ffffff;
      color: #111827;
      border-radius: 16px;
      padding: 20px 16px;
      text-align: center;
      box-shadow: 0 4px 14px rgba(0,0,0,0.25);
      border: 2px solid #e5e7eb;
      display: flex;
      flex-direction: column;
      align-items: center;
      page-break-inside: avoid;
    }
    .brand {
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 2px;
      color: #b48332;
      text-transform: uppercase;
      margin-bottom: 6px;
    }
    .table-name {
      font-size: 20px;
      font-weight: 800;
      color: #111827;
      line-height: 1.2;
    }
    .section-name {
      font-size: 11px;
      color: #6b7280;
      margin-top: 2px;
      margin-bottom: 12px;
    }
    .qr-wrapper {
      background: #fff;
      padding: 6px;
      border-radius: 10px;
      border: 1px solid #e5e7eb;
      margin-bottom: 12px;
    }
    .qr-wrapper img {
      width: 170px;
      height: 170px;
      display: block;
    }
    .action-text {
      font-size: 12px;
      font-weight: 600;
      color: #374151;
      line-height: 1.35;
      margin-bottom: 2px;
    }

    @media print {
      body {
        background: #fff !important;
        padding: 0 !important;
      }
      .header-bar {
        display: none !important;
      }
      .grid {
        grid-template-columns: repeat(3, 1fr) !important;
        gap: 15px !important;
        max-width: 100% !important;
      }
      .qr-card {
        box-shadow: none !important;
        border: 1px solid #d1d5db !important;
        page-break-inside: avoid !important;
      }
    }
  </style>
</head>
<body>
  <div class="header-bar">
    <div class="header-title">
      <h1>Таблички с QR-кодами столов</h1>
      <p>Базовый URL: <strong>${baseUrl}</strong> • Всего столов: <strong>${results.length}</strong></p>
    </div>
    <button class="print-btn" onclick="window.print()">Распечатать все наклейки (Ctrl + P)</button>
  </div>

  <div class="grid">
    ${cardsHtml}
  </div>
</body>
</html>`;

const outPath = path.join(__dirname, 'print-qr-cards.html');
fs.writeFileSync(outPath, htmlContent, 'utf-8');

console.log(`\nГотово! Создан интерактивный лист для печати:`);
console.log(`-> ${outPath}`);
console.log(`Просто откройте этот HTML в браузере и нажмите Печать (Ctrl + P).\n`);

