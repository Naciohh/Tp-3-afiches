import { CLIP_SILENCIO } from './silencio';

// Se llama DENTRO del toque de "Empezar": destraba el audio del <video> compartido.
// En iPhone el permiso queda en ese elemento, aunque después se le cambie el src.
export function destrabarAudio(video: HTMLVideoElement) {
  video.setAttribute('playsinline', '');
  video.setAttribute('webkit-playsinline', '');
  video.muted = false;
  video.src = CLIP_SILENCIO;
  const p = video.play();
  if (p) p.then(() => video.pause()).catch(() => { /* si falla, aparece el botón de sonido */ });
}
