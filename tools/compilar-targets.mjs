// Compila los afiches de afiches/ a public/targets/targets.mind (el reconocimiento de MindAR).
// El orden sale de "targets" en src/datos/noticias.json: el primero de cada noticia es el afiche sin QR
// (afiches/sin-qr/<id>.jpg) y el segundo el afiche con QR (afiches/con-qr/<id>.jpg).
// Uso: npm run compilar-targets
import { createRequire } from 'node:module';
import fs from 'node:fs';
const require = createRequire(import.meta.url);
const { loadImage } = require('canvas');
const { OfflineCompiler } = await import('mind-ar/src/image-target/offline-compiler.js');

const { noticias } = JSON.parse(fs.readFileSync('src/datos/noticias.json', 'utf8'));
const archivos = [];
for (const n of noticias) {
  n.targets.forEach((idx, i) => { archivos[idx] = `afiches/${i === 0 ? 'sin-qr' : 'con-qr'}/${n.id}.jpg`; });
}
const imagenes = [];
for (const f of archivos) {
  if (!f || !fs.existsSync(f)) throw new Error(`Falta el afiche ${f}`);
  imagenes.push(await loadImage(f));
  console.log(`target ${imagenes.length - 1}: ${f}`);
}
const compilador = new OfflineCompiler();
await compilador.compileImageTargets(imagenes, (p) => process.stdout.write(`\rCompilando ${p.toFixed(0)}%`));
fs.mkdirSync('public/targets', { recursive: true });
fs.writeFileSync('public/targets/targets.mind', Buffer.from(compilador.exportData()));
console.log('\nListo: public/targets/targets.mind');
