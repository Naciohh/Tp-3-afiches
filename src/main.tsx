import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/archivo-black/400.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import './estilos/tokens.css';
import './estilos/base.css';
import './estilos/atomos.css';
import './estilos/moleculas.css';
import './estilos/organismos.css';
import './estilos/pantallas.css';
import App from './App';

createRoot(document.getElementById('raiz')!).render(<StrictMode><App /></StrictMode>);
