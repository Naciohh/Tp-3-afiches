import kennedyColor from '../assets/teles/kennedy-color.png';
import kennedySilueta from '../assets/teles/kennedy-silueta.png';
import chernobilColor from '../assets/teles/chernobil-color.png';
import chernobilSilueta from '../assets/teles/chernobil-silueta.png';
import amiaColor from '../assets/teles/amia-color.png';
import amiaSilueta from '../assets/teles/amia-silueta.png';
import c911 from '../assets/teles/911-color.png';
import s911 from '../assets/teles/911-silueta.png';

// Miniaturas de los teles (exportadas de Figma, componente "Miniatura de tele").
export const teleColor: Record<string, string> = { kennedy: kennedyColor, chernobil: chernobilColor, amia: amiaColor, '911': c911 };
export const teleSilueta: Record<string, string> = { kennedy: kennedySilueta, chernobil: chernobilSilueta, amia: amiaSilueta, '911': s911 };
