import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MindARThree } from 'mind-ar/dist/mindar-image-three.prod.js';
import { cargarSubtitulos, type Cue } from '../lib/subtitulos';
import { noticias, opcionesAR, url, type Noticia } from '../datos/noticias';

type Datos = {
  tamY: number; minZ: number; extraZ: number;
  centroX: number; centroY: number; escalaFinal: number;
  base: { centroX: number; centroY: number; escala: number };
};
type Actual = {
  noticia: Noticia; tele: THREE.Group; textura: THREE.VideoTexture; uniforms: { uTiempo: { value: number }; uGlitch: { value: number } };
  cues: Cue[]; entrada?: number | null; glitch?: number | null; datos: Datos;
};

export type Cuadro = { texto: string | null; x: number; y: number };

export type Eventos = {
  onFound?: (n: Noticia) => void;
  onLost?: (n: Noticia) => void;
  onEnded?: (n: Noticia) => void;
  onNecesitaSonido?: (necesita: boolean) => void;
  onAjuste?: (hay: boolean) => void;
  onCuadro?: (c: Cuadro) => void;
  onError?: (e: unknown) => void;
};

// Material de la pantalla: el video con un efecto CRT leve (líneas de barrido, viñeta, ruido)
// y un glitch que se dispara al aparecer el tele.
function materialPantalla(textura: THREE.Texture, crt: boolean) {
  const mat = new THREE.MeshBasicMaterial({ map: textura, toneMapped: false });
  const uniforms = { uTiempo: { value: 0 }, uGlitch: { value: 0 } };
  if (crt) {
    mat.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, uniforms);
      shader.fragmentShader = shader.fragmentShader
        .replace('#include <common>', '#include <common>\nuniform float uTiempo;\nuniform float uGlitch;')
        .replace('#include <map_fragment>', `
          vec2 uvp = vMapUv;
          float fila = floor(uvp.y * 48.0);
          float azar = fract(sin(fila * 12.9898 + floor(uTiempo * 24.0) * 78.233) * 43758.5453);
          uvp.x += uGlitch * (azar - 0.5) * 0.18 * step(0.55, azar);
          vec4 sampledDiffuseColor = texture2D(map, uvp);
          sampledDiffuseColor.rgb *= 0.9 + 0.1 * sin(vMapUv.y * 1100.0);
          float d = distance(vMapUv, vec2(0.5));
          sampledDiffuseColor.rgb *= 1.0 - smoothstep(0.42, 0.78, d) * 0.5;
          float ruido = fract(sin(dot(vMapUv * (uTiempo + 1.0), vec2(12.9898, 78.233))) * 43758.5453);
          sampledDiffuseColor.rgb += (ruido - 0.5) * (0.025 + uGlitch * 0.5);
          diffuseColor *= sampledDiffuseColor;
        `);
    };
  }
  return { mat, uniforms };
}

// Ubica el tele: centrado en (centroX, centroY) sobre el afiche y con la parte de atrás apoyada en él.
function colocar(tele: THREE.Group, d: Datos, escala = d.escalaFinal) {
  tele.scale.setScalar(escala);
  tele.position.set(d.centroX, d.centroY - (d.tamY * escala) / 2, d.extraZ - d.minZ * escala);
}

export async function iniciarAR(contenedor: HTMLElement, video: HTMLVideoElement, ev: Eventos) {
  const { anchoTele, filterMinCF, filterBeta, missTolerance, warmupTolerance } = opcionesAR;
  const mindar = new MindARThree({
    container: contenedor,
    imageTargetSrc: url('targets/targets.mind'),
    maxTrack: 1,
    filterMinCF, filterBeta, missTolerance, warmupTolerance,
    uiLoading: 'no', uiScanning: 'no', uiError: 'no',
  });
  const { renderer, scene, camera } = mindar;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  scene.add(new THREE.HemisphereLight(0xffffff, 0x4a4a52, 1.4));
  const sol = new THREE.DirectionalLight(0xffffff, 1.1);
  sol.position.set(0.5, 1, 1.5);
  scene.add(sol);

  const loader = new GLTFLoader();
  let actual: Actual | null = null;
  let encontrado: string | null = null;
  let pausadoPorUsuario = false;
  let pedido = 0;
  let cueMostrado: string | null | undefined;

  function liberar(a: Actual, conVideo = true) {
    a.tele.parent?.remove(a.tele);
    a.tele.traverse((o) => {
      const m = o as THREE.Mesh;
      m.geometry?.dispose();
      for (const mat of ([] as THREE.Material[]).concat(m.material ?? [])) mat.dispose();
    });
    a.textura.dispose();
    if (!conVideo) return; // una carga vieja descartada no debe tocar el video de la nueva
    video.pause();
    video.removeAttribute('src');
    video.load();
  }

  async function cargar(noticia: Noticia, ancla: { group: THREE.Group }): Promise<Actual> {
    const gltf = await loader.loadAsync(url(noticia.modelo));
    const modelo = gltf.scene;
    video.src = url(noticia.video);
    video.loop = false;
    video.preload = 'auto';
    const textura = new THREE.VideoTexture(video);
    textura.flipY = false;
    textura.colorSpace = THREE.SRGBColorSpace;
    textura.repeat.set(noticia.uvRepeat?.[0] ?? 1, noticia.uvRepeat?.[1] ?? 1);
    textura.offset.set(noticia.uvOffset?.[0] ?? 0, noticia.uvOffset?.[1] ?? 0);
    const { mat, uniforms } = materialPantalla(textura, opcionesAR.crt !== false);
    let hayPantalla = false;
    modelo.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!m.isMesh) return;
      const cambiar = (x: THREE.Material) => (x.name === 'pantalla' ? (hayPantalla = true, mat) : x);
      m.material = Array.isArray(m.material) ? m.material.map(cambiar) : cambiar(m.material);
    });
    if (!hayPantalla) console.warn(`El GLB de "${noticia.id}" no tiene un material llamado "pantalla".`);

    const caja = new THREE.Box3().setFromObject(modelo);
    const tam = caja.getSize(new THREE.Vector3());
    const t = noticia.transform;
    const escala = (anchoTele / tam.x) * (t?.scale ?? 1); // anchoTele: fracción del ancho del afiche (el target mide 1)
    const tele = new THREE.Group();
    tele.add(modelo);
    tele.rotation.set(t?.rotation?.[0] ?? 0, t?.rotation?.[1] ?? 0, t?.rotation?.[2] ?? 0);
    const px = t?.position?.[0] ?? 0, py = t?.position?.[1] ?? 0, pz = t?.position?.[2] ?? 0;
    const datos: Datos = { tamY: tam.y, minZ: caja.min.z, extraZ: pz, centroX: px, centroY: py, escalaFinal: escala, base: { centroX: px, centroY: py, escala } };
    colocar(tele, datos);
    ancla.group.add(tele);
    const cues = noticia.subtitulos ? await cargarSubtitulos(url(noticia.subtitulos)) : [];
    return { noticia, tele, textura, uniforms, cues, datos };
  }

  async function reproducir() {
    video.muted = false;
    try {
      await video.play();
    } catch {
      // Sin permiso para reproducir con sonido: se ve la imagen en silencio y se pide un toque.
      video.muted = true;
      try { await video.play(); } catch { /* nada más que hacer */ }
      ev.onNecesitaSonido?.(true);
      return;
    }
    ev.onNecesitaSonido?.(video.muted);
  }

  async function alEncontrar(noticia: Noticia, ancla: { group: THREE.Group }) {
    encontrado = noticia.id;
    const miPedido = ++pedido;
    ev.onFound?.(noticia);
    if (actual && actual.noticia.id !== noticia.id) { liberar(actual); actual = null; ev.onAjuste?.(false); }
    if (!actual) pausadoPorUsuario = false;
    if (!actual) {
      let nuevo: Actual;
      try { nuevo = await cargar(noticia, ancla); } catch (e) { ev.onError?.(e); return; }
      if (miPedido !== pedido || encontrado !== noticia.id) { liberar(nuevo, miPedido === pedido); return; }
      actual = nuevo;
      colocar(nuevo.tele, nuevo.datos, 0.001); // entrada: crece desde cero
      nuevo.entrada = performance.now();
    }
    actual.glitch = performance.now();
    if (!pausadoPorUsuario) await reproducir();
  }

  function alPerder(noticia: Noticia) {
    if (encontrado !== noticia.id) return;
    encontrado = null;
    video.pause(); // si no, el audio seguiría sonando sin tele
    ev.onLost?.(noticia);
  }

  // Cada noticia puede tener varios afiches (con y sin QR): todos llevan al mismo tele.
  for (const n of noticias) {
    for (const idx of n.targets) {
      const ancla = mindar.addAnchor(idx);
      ancla.onTargetFound = () => { void alEncontrar(n, ancla); };
      ancla.onTargetLost = () => alPerder(n);
    }
  }
  video.addEventListener('ended', () => { if (actual) ev.onEnded?.(actual.noticia); });

  // Gestos sobre el tele: tocar = pausar/reanudar, arrastrar con un dedo = mover, pellizcar = cambiar tamaño.
  const dom = renderer.domElement as HTMLCanvasElement;
  const raycaster = new THREE.Raycaster();
  const plano = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  const punteros = new Map<number, { x: number; y: number }>();
  type Gesto = { tipo: 'mover'; offX: number; offY: number; x0: number; y0: number; t0: number; movio: boolean } | { tipo: 'escalar'; d0: number; escala0: number };
  let gesto: Gesto | null = null;
  const LIMITE = Math.max(1.5, anchoTele * 2.5);
  const visible = () => !!actual && encontrado === actual.noticia.id;

  function rayo(cx: number, cy: number) {
    const r = dom.getBoundingClientRect();
    raycaster.setFromCamera(new THREE.Vector2(((cx - r.left) / r.width) * 2 - 1, -((cy - r.top) / r.height) * 2 + 1), camera);
  }
  // Se prueba contra la caja del tele y no contra sus triángulos: con escala negativa el rayo los atraviesa.
  const sobreTele = (x: number, y: number) => { rayo(x, y); return raycaster.ray.intersectsBox(new THREE.Box3().setFromObject(actual!.tele)); };
  function puntoEnAfiche(x: number, y: number) {
    rayo(x, y);
    const inv = new THREE.Matrix4().copy(actual!.tele.parent!.matrixWorld).invert();
    return raycaster.ray.clone().applyMatrix4(inv).intersectPlane(plano, new THREE.Vector3());
  }
  const limitar = (v: number, a: number, b: number) => Math.min(Math.max(v, a), b);
  const hayAjuste = () => { const d = actual!.datos; return d.centroX !== d.base.centroX || d.centroY !== d.base.centroY || d.escalaFinal !== d.base.escala; };

  contenedor.addEventListener('pointerdown', (e) => {
    if (!visible()) return;
    punteros.set(e.pointerId, { x: e.clientX, y: e.clientY });
    try { contenedor.setPointerCapture(e.pointerId); } catch { /* el gesto igual funciona */ }
    const d = actual!.datos;
    if (punteros.size === 1) {
      gesto = null;
      if (!sobreTele(e.clientX, e.clientY)) return;
      const p = puntoEnAfiche(e.clientX, e.clientY);
      gesto = { tipo: 'mover', offX: p ? p.x - d.centroX : 0, offY: p ? p.y - d.centroY : 0, x0: e.clientX, y0: e.clientY, t0: performance.now(), movio: false };
    } else if (punteros.size === 2) {
      const [a, b] = [...punteros.values()];
      actual!.entrada = null;
      gesto = { tipo: 'escalar', d0: Math.hypot(a.x - b.x, a.y - b.y) || 1, escala0: d.escalaFinal };
    }
  });
  contenedor.addEventListener('pointermove', (e) => {
    if (!punteros.has(e.pointerId)) return;
    punteros.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (!gesto || !visible()) return;
    const d = actual!.datos;
    if (gesto.tipo === 'mover' && punteros.size === 1) {
      if (!gesto.movio && Math.hypot(e.clientX - gesto.x0, e.clientY - gesto.y0) < 8) return;
      gesto.movio = true;
      actual!.entrada = null;
      const p = puntoEnAfiche(e.clientX, e.clientY);
      if (!p) return;
      d.centroX = limitar(p.x - gesto.offX, -LIMITE, LIMITE);
      d.centroY = limitar(p.y - gesto.offY, -LIMITE, LIMITE);
      colocar(actual!.tele, d);
      ev.onAjuste?.(hayAjuste());
    } else if (gesto.tipo === 'escalar' && punteros.size === 2) {
      const [a, b] = [...punteros.values()];
      const k = (Math.hypot(a.x - b.x, a.y - b.y) || 1) / gesto.d0;
      d.escalaFinal = limitar(gesto.escala0 * k, d.base.escala * 0.25, d.base.escala * 4);
      colocar(actual!.tele, d);
      ev.onAjuste?.(hayAjuste());
    }
  });
  const soltar = (e: PointerEvent) => {
    if (!punteros.delete(e.pointerId)) return;
    if (gesto?.tipo === 'mover' && !gesto.movio && performance.now() - gesto.t0 < 500 && visible()) {
      if (video.paused) { pausadoPorUsuario = false; void reproducir(); } else { pausadoPorUsuario = true; video.pause(); }
    }
    gesto = null;
  };
  contenedor.addEventListener('pointerup', soltar);
  contenedor.addEventListener('pointercancel', soltar);

  await mindar.start();

  const caja = new THREE.Box3(), v3 = new THREE.Vector3();
  renderer.setAnimationLoop(() => {
    if (actual?.entrada) {
      const k = Math.min((performance.now() - actual.entrada) / 450, 1);
      const rebote = 1 + 0.15 * Math.sin(k * Math.PI) * (1 - k);
      colocar(actual.tele, actual.datos, actual.datos.escalaFinal * Math.max(k * rebote, 0.001));
      if (k >= 1) actual.entrada = null;
    }
    if (actual) {
      const ahora = performance.now();
      actual.uniforms.uTiempo.value = ahora / 1000;
      const g = actual.glitch ? 1 - (ahora - actual.glitch) / 700 : 0;
      actual.uniforms.uGlitch.value = Math.max(g, 0);
      if (g <= 0) actual.glitch = null;
      // Subtítulo del momento, debajo del tele (en pantalla).
      const cue = visible() ? actual.cues.find((c) => video.currentTime >= c.ini && video.currentTime < c.fin) : null;
      caja.setFromObject(actual.tele);
      const r = dom.getBoundingClientRect();
      v3.set((caja.min.x + caja.max.x) / 2, caja.min.y, (caja.min.z + caja.max.z) / 2).project(camera);
      const x = r.left + ((v3.x + 1) / 2) * r.width, y = r.top + ((1 - v3.y) / 2) * r.height;
      const texto = cue?.texto ?? null;
      if (texto !== cueMostrado || texto) { cueMostrado = texto; ev.onCuadro?.({ texto, x, y }); }
    } else if (cueMostrado) { cueMostrado = null; ev.onCuadro?.({ texto: null, x: 0, y: 0 }); }
    renderer.render(scene, camera);
  });

  return {
    activarSonido: () => { video.muted = false; return video.play().then(() => ev.onNecesitaSonido?.(false)).catch(() => undefined); },
    pausar: () => video.pause(),
    reanudar: () => { if (encontrado && !video.ended && !pausadoPorUsuario) void reproducir(); },
    centrarTele: () => {
      if (!actual) return;
      const d = actual.datos;
      Object.assign(d, { centroX: d.base.centroX, centroY: d.base.centroY, escalaFinal: d.base.escala });
      colocar(actual.tele, d);
      ev.onAjuste?.(false);
    },
    detener: () => { renderer.setAnimationLoop(null); mindar.stop(); },
  };
}

export type MotorAR = Awaited<ReturnType<typeof iniciarAR>>;
