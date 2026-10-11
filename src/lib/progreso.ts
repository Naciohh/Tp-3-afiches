// El progreso vive en localStorage del navegador: sin cuentas ni servidor.
const CLAVE = 'asi-te-enganan.v2.progreso';

export function leerProgreso(): string[] {
  try {
    const v = JSON.parse(localStorage.getItem(CLAVE) ?? '[]');
    return Array.isArray(v) ? v.filter((x) => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

export function guardarProgreso(ids: string[]) {
  try { localStorage.setItem(CLAVE, JSON.stringify(ids)); } catch { /* sin almacenamiento: sigue en memoria */ }
}
