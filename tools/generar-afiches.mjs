// Arma los afiches finales: el arte de afiches/arte/<id>.jpg (sin QR) más un QR sin fondo abajo a la derecha que lleva a la web.
// El reconocimiento de AR está en la imagen misma; el QR solo abre la página (?n=<id>).
// Uso: npm run generar-afiches [-- https://tu-dominio.com]
import { createRequire } from 'node:module';
import fs from 'node:fs';
const require = createRequire(import.meta.url);
const { createCanvas, loadImage } = require('canvas');
const QRCode = require('qrcode');

const base = (process.argv[2] ?? 'https://tp-3-afiches.vercel.app').replace(/\/$/, '');
const { noticias } = JSON.parse(fs.readFileSync('src/datos/noticias.json', 'utf8'));

for (const n of noticias) {
  const arte = await loadImage(`afiches/arte/${n.id}.jpg`);
  const W = arte.width, H = arte.height;
  const lienzo = createCanvas(W, H);
  const g = lienzo.getContext('2d');
  g.drawImage(arte, 0, 0);

  // QR negro directo sobre el arte (sin fondo), abajo a la derecha.
  const caja = Math.round(W * 0.233), margen = Math.round(caja * 0.07);
  const x0 = W - caja, y0 = H - caja;
  const url = `${base}/?n=${n.id}`;
  const qr = QRCode.create(url, { errorCorrectionLevel: 'M' });
  const modulos = qr.modules.size, lado = caja - margen * 2;
  const m = Math.floor(lado / modulos), usado = m * modulos, ox = x0 + Math.floor((caja - usado) / 2), oy = y0 + Math.floor((caja - usado) / 2);
  g.fillStyle = '#000000';
  for (let r = 0; r < modulos; r++) for (let c = 0; c < modulos; c++) if (qr.modules.get(r, c)) g.fillRect(ox + c * m, oy + r * m, m, m);

  fs.writeFileSync(`afiches/${n.id}.jpg`, lienzo.toBuffer('image/jpeg', { quality: 0.93 }));
  console.log(`afiches/${n.id}.jpg  ${W}x${H}  QR -> ${url}  (${modulos}x${modulos} módulos de ${m}px)`);
}
