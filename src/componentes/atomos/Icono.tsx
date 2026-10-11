import { Eye, Instagram, MapPin, ScanQrCode, Volume2 } from 'lucide-react';

export type NombreIcono = 'QR' | 'Volumen' | 'Ojo' | 'Ubicación' | 'Instagram' | 'TikTok';

// Íconos de Lucide (https://lucide.dev). TikTok no existe en Lucide: es el glifo de Bootstrap Icons.
function TikTok({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3z" />
    </svg>
  );
}

export function Icono({ nombre, tamano = 20 }: { nombre: NombreIcono; tamano?: number }) {
  const props = { size: tamano, strokeWidth: 2, 'aria-hidden': true } as const;
  return (
    <span className="c-icono" style={{ width: tamano, height: tamano }}>
      {nombre === 'QR' && <ScanQrCode {...props} />}
      {nombre === 'Volumen' && <Volume2 {...props} />}
      {nombre === 'Ojo' && <Eye {...props} />}
      {nombre === 'Ubicación' && <MapPin {...props} />}
      {nombre === 'Instagram' && <Instagram {...props} />}
      {nombre === 'TikTok' && <TikTok size={tamano} />}
    </span>
  );
}
