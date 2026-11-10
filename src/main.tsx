import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// Tipografías de la identidad del evento: títulos, texto, datos y letras de collage.
import '@fontsource/anton/400.css';
import '@fontsource/special-elite/400.css';
import '@fontsource/space-mono/400.css';
import '@fontsource/space-mono/700.css';
import '@fontsource/unifrakturmaguntia/400.css';
import '@fontsource/old-standard-tt/700.css';
import '@fontsource/im-fell-english/400-italic.css';
import './estilos/tokens.css';
import './estilos/base.css';
import './estilos/atomos.css';
import './estilos/moleculas.css';
import './estilos/organismos.css';
import './estilos/pantallas.css';
import App from './App';
import { aplicarAjustes, leerAjustes } from './lib/accesibilidad';

// Se aplican antes de dibujar, para que no parpadee el diseño sin ajustes.
aplicarAjustes(leerAjustes());

createRoot(document.getElementById('raiz')!).render(<StrictMode><App /></StrictMode>);
