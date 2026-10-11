// Ajustes de accesibilidad: tamaño de texto, contraste alto y daltonismo.
// Se guardan en el celular (localStorage) y se aplican con atributos en <html> (ver tokens.css).
export type Texto = 'normal' | 'grande' | 'muy-grande';
export type Daltonismo = 'ninguno' | 'deuteranomalia' | 'protanopia' | 'tritanopia';
export type Ajustes = { texto: Texto; contraste: boolean; daltonismo: Daltonismo };

const CLAVE = 'asi-te-enganan.v2.accesibilidad';
export const porDefecto: Ajustes = { texto: 'normal', contraste: false, daltonismo: 'ninguno' };

const TEXTOS: Texto[] = ['normal', 'grande', 'muy-grande'];
const DALTONISMOS: Daltonismo[] = ['ninguno', 'deuteranomalia', 'protanopia', 'tritanopia'];

export function leerAjustes(): Ajustes {
  try {
    const v = JSON.parse(localStorage.getItem(CLAVE) ?? '{}');
    return {
      texto: TEXTOS.includes(v.texto) ? v.texto : porDefecto.texto,
      contraste: v.contraste === true,
      daltonismo: DALTONISMOS.includes(v.daltonismo) ? v.daltonismo : porDefecto.daltonismo,
    };
  } catch {
    return porDefecto;
  }
}

export function aplicarAjustes(a: Ajustes) {
  const r = document.documentElement;
  r.dataset.texto = a.texto;
  if (a.contraste) r.dataset.contraste = 'alto'; else delete r.dataset.contraste;
  if (a.daltonismo !== 'ninguno') r.dataset.daltonismo = a.daltonismo; else delete r.dataset.daltonismo;
  try { localStorage.setItem(CLAVE, JSON.stringify(a)); } catch { /* sin almacenamiento: vale solo esta visita */ }
}
