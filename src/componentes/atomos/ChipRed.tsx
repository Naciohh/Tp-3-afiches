import { Icono } from './Icono';

export function ChipRed({ red, url }: { red: 'Instagram' | 'TikTok'; url: string }) {
  const pendiente = !/^https?:\/\//.test(url);
  return (
    <a
      className="c-chip-red t-cuerpo-bold-14"
      href={pendiente ? '#' : url}
      target={pendiente ? undefined : '_blank'}
      rel="noopener"
      onClick={pendiente ? (e) => e.preventDefault() : undefined}
    >
      <Icono nombre={red} />
      {red}
    </a>
  );
}
