// Compila los afiches de afiches/<id>.jpg (con su QR) a public/targets/targets.mind, el reconocimiento de MindAR.
// El reconocimiento está en la imagen del afiche; el QR solo abre la web.
// El orden sale de "targets" en src/datos/noticias.json.
// Uso: npm run compilar-targets
import { createRequire } from 'node:module';
import fs from 'node:fs';
const require = createRequire(import.meta.url);
const { loadImage, createCanvas } = require('canvas');
const { OfflineCompiler } = await import('mind-ar/src/image-target/offline-compiler.js');

const { noticias } = JSON.parse(fs.readFileSync('src/datos/noticias.json', 'utf8'));
const archivos = [];
for (const n of noticias) {
  archivos[n.targets[0]] = `afiches/${n.id}.jpg`;
}
// El título "ASI ENGAÑARON A TUS PADRES" es idéntico en dos afiches y la cámara los confundía.
// Para compilar, esa franja se difumina: el reconocimiento se apoya en la foto de cada afiche
// (el afiche impreso no cambia).
const FRANJA = [0.33, 0.51];
async function paraCompilar(archivo) {
  const img = await loadImage(archivo);
  const c = createCanvas(img.width, img.height);
  const g = c.getContext('2d');
  g.drawImage(img, 0, 0);
  const y0 = Math.round(img.height * FRANJA[0]), alto = Math.round(img.height * (FRANJA[1] - FRANJA[0]));
  const chica = createCanvas(Math.round(img.width / 40), Math.round(alto / 40));
  chica.getContext('2d').drawImage(c, 0, y0, img.width, alto, 0, 0, chica.width, chica.height);
  g.imageSmoothingEnabled = true;
  g.drawImage(chica, 0, 0, chica.width, chica.height, 0, y0, img.width, alto);
  return c;
}
const imagenes = [];
for (const f of archivos) {
  if (!f || !fs.existsSync(f)) throw new Error(`Falta el afiche ${f}`);
  imagenes.push(await paraCompilar(f));
  console.log(`target ${imagenes.length - 1}: ${f}`);
}
const compilador = new OfflineCompiler();
await compilador.compileImageTargets(imagenes, (p) => process.stdout.write(`\rCompilando ${p.toFixed(0)}%`));
fs.mkdirSync('public/targets', { recursive: true });
fs.writeFileSync('public/targets/targets.mind', Buffer.from(compilador.exportData()));
console.log('\nListo: public/targets/targets.mind');
