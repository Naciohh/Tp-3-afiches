// El tele de la ficha, flotando y girando solo. Usa su propio renderer (aparte del de AR) y lo libera al cerrar.
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { url, type Noticia } from '../datos/noticias';

const loader = new GLTFLoader();
const DIRECCION = new THREE.Vector3(0, 0.5, 3.6).normalize();

// La pantalla muestra un cuadro fijo del video: videos/<id>.jpg (al lado del .mp4).
async function cuadro(n: Noticia): Promise<THREE.Texture | null> {
  try {
    const tex = await new THREE.TextureLoader().loadAsync(url(n.video.replace(/\.mp4$/, '.jpg')));
    tex.flipY = false;
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.repeat.set(n.uvRepeat?.[0] ?? 1, n.uvRepeat?.[1] ?? 1);
    tex.offset.set(n.uvOffset?.[0] ?? 0, n.uvOffset?.[1] ?? 0);
    return tex;
  } catch { return null; }
}

// Aleja la cámara lo justo para que el tele entre entero en todo el giro (se prueba una vuelta completa).
function encuadrarGiro(camara: THREE.PerspectiveCamera, radio: number, esquinas: THREE.Vector3[], margen = 0.97) {
  const p = new THREE.Vector3();
  const eje = new THREE.Vector3(0, 1, 0);
  const entra = (d: number) => {
    camara.position.copy(DIRECCION).multiplyScalar(d);
    camara.lookAt(0, 0, 0);
    camara.updateMatrixWorld();
    for (let k = 0; k < 48; k++) {
      const giro = (k / 48) * Math.PI * 2;
      for (const e of esquinas) {
        p.copy(e).applyAxisAngle(eje, giro).project(camara);
        if (Math.abs(p.x) > margen || Math.abs(p.y) > margen || p.z > 1) return false;
      }
    }
    return true;
  };
  let cerca = radio * 1.2, lejos = radio * 10;
  for (let i = 0; i < 24; i++) { const medio = (cerca + lejos) / 2; if (entra(medio)) lejos = medio; else cerca = medio; }
  entra(lejos);
}

export async function abrirVisor(canvas: HTMLCanvasElement, noticia: Noticia) {
  const gltf = await loader.loadAsync(url(noticia.modelo));
  const modelo = gltf.scene;
  const pantalla = await cuadro(noticia);
  const apagada = new THREE.MeshBasicMaterial(pantalla ? { map: pantalla, toneMapped: false } : { color: 0x0d1117 });
  modelo.traverse((o) => {
    const m = o as THREE.Mesh;
    if (!m.isMesh) return;
    const cambiar = (x: THREE.Material) => (x.name === 'pantalla' ? apagada : x);
    m.material = Array.isArray(m.material) ? m.material.map(cambiar) : cambiar(m.material);
  });

  const escena = new THREE.Scene();
  escena.add(new THREE.HemisphereLight(0xffffff, 0x6a6a72, 2.4));
  const luz = new THREE.DirectionalLight(0xffffff, 2.2);
  luz.position.set(1, 2, 3);
  escena.add(luz);
  const relleno = new THREE.DirectionalLight(0xffffff, 0.8);
  relleno.position.set(-2, 0.5, 1);
  escena.add(relleno);

  const caja = new THREE.Box3().setFromObject(modelo);
  modelo.position.sub(caja.getCenter(new THREE.Vector3()));
  const tam = caja.getSize(new THREE.Vector3());
  const radio = tam.length() / 2;
  const pivote = new THREE.Group();
  pivote.add(modelo);
  escena.add(pivote);
  const esquinas: THREE.Vector3[] = [];
  for (const x of [-1, 1]) for (const y of [-1, 1]) for (const z of [-1, 1]) esquinas.push(new THREE.Vector3((x * tam.x) / 2, (y * tam.y) / 2, (z * tam.z) / 2));

  const r = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  r.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  const w = canvas.clientWidth || 342, h = canvas.clientHeight || 257;
  r.setSize(w, h, false);
  const camara = new THREE.PerspectiveCamera(30, w / h, 0.01, 100);
  encuadrarGiro(camara, radio, esquinas);

  let activo = true, raf = 0;
  const t0 = performance.now();
  const bucle = () => {
    if (!activo) return;
    pivote.rotation.y = -0.5 + (performance.now() - t0) / 3000;
    r.render(escena, camara);
    raf = requestAnimationFrame(bucle);
  };
  bucle();
  return () => { activo = false; cancelAnimationFrame(raf); r.dispose(); r.forceContextLoss(); pantalla?.dispose(); };
}
