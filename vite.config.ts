import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import basicSsl from '@vitejs/plugin-basic-ssl';

// El certificado local solo sirve para probar en el celular por la red (la cámara exige HTTPS).
// En el build de producción (Vercel) no hace falta: el hosting ya da HTTPS.
export default defineConfig(({ command }) => ({
  plugins: [react(), ...(command === 'serve' ? [basicSsl()] : [])],
  server: { host: true },
  build: { chunkSizeWarningLimit: 1500 },
}));
