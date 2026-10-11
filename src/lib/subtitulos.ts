// Subtítulos en AR: se leen del .vtt (WebVTT) y se muestran en el componente Subtítulo.
export type Cue = { ini: number; fin: number; texto: string };

function segundos(t: string) {
  const p = t.trim().split(':').map(Number);
  return p.length === 3 ? p[0] * 3600 + p[1] * 60 + p[2] : p[0] * 60 + p[1];
}

export async function cargarSubtitulos(url: string): Promise<Cue[]> {
  try {
    const r = await fetch(url);
    if (!r.ok) return [];
    const texto = (await r.text()).replace(/\r/g, '');
    const cues: Cue[] = [];
    for (const bloque of texto.split(/\n\n+/)) {
      const lineas = bloque.split('\n');
      const i = lineas.findIndex((l) => l.includes('-->'));
      if (i < 0) continue;
      const [ini, fin] = lineas[i].split('-->').map((s) => segundos(s.trim().split(' ')[0]));
      cues.push({ ini, fin, texto: lineas.slice(i + 1).join(' ').trim() });
    }
    return cues;
  } catch {
    return [];
  }
}
