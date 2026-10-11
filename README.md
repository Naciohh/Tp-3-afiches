# Así te engañan (versión 2)

Web de realidad aumentada sobre desinformación. Se mira desde el celular: se apunta la cámara a un afiche y aparece sobre él un tele 3D de la época, con el video de la noticia (con audio y subtítulos). Cuando el video termina, el tele se desbloquea en una colección con su ficha.

Esta versión se hizo de cero a partir de los dos archivos de Figma:

- **Design system - Afiches** (variables, estilos y componentes atómicos, moléculas y organismos).
- **Web afiches** (las pantallas, armadas solo con componentes del design system).

## Stack

- Vite + React 18 + TypeScript.
- MindAR (reconocimiento de imagen) + Three.js (el tele 3D).
- Íconos de Lucide (TikTok es de Bootstrap Icons, porque Lucide no lo tiene).
- Tipografías con @fontsource: Archivo Black, Inter, IBM Plex Mono.
- Sin backend, sin cuentas, sin analytics. El progreso se guarda en `localStorage`.

## Cómo está organizado el código (igual que Figma)

```
src/
  estilos/        tokens.css (variables y estilos de texto de Figma), atomos.css, moleculas.css, organismos.css, pantallas.css
  componentes/
    atomos/       Boton, Pastilla, BotonFlotante, Icono, Miniatura, Punto, Tramo, Subtitulo, Spinner, CampoTexto, ChipRed, Check, Rayado
    moleculas/    Aviso, Medidor, TituloEpoca, TarjetaColeccion, BloqueFicha, ConsejoNumerado, DatoEvento, DescripcionEvento, Newsletter, Sintonizando
    organismos/   CabeceraColeccion, RecorridoColeccion, PanelEvento, CierreColeccion, GuiaChequeo, NoticiaOriginal
  pantallas/      Bienvenida, Camara, Coleccion, Ficha, Chequear
  ar/             motor.ts (MindAR + Three), visorTele.ts (el tele que gira en la ficha), audio.ts
  datos/          noticias.json (todo el contenido), noticias.ts, teles.ts
```

Si cambia algo del diseño en Figma (un color, un espacio, un texto), se cambia en `src/estilos/tokens.css` o en el componente que corresponda.

## Correrlo

```powershell
npm install
npm run dev
```

La cámara exige HTTPS. En desarrollo Vite levanta un certificado local (`vite --host`): abrí la dirección `https://` que muestra desde el celular, en la misma red wifi. En producción lo da Vercel.

## Afiches y reconocimiento

Hay dos tipos de afiche por noticia, y los dos activan el mismo tele:

| Carpeta | Qué es |
|---|---|
| `afiches/con-qr/` | El afiche con su QR (`?n=kennedy`, `?n=chernobil`, `?n=911`). |
| `afiches/sin-qr/` | El afiche con el reconocimiento "metido" en la foto, sin QR (los cuatro). |

`public/targets/targets.mind` se genera con estos afiches. El orden está en `targets` dentro de `src/datos/noticias.json` (el primer número de cada noticia es el afiche sin QR y el segundo el afiche con QR):

| targetIndex | Noticia | Afiche |
|---|---|---|
| 0 | kennedy | sin QR |
| 1 | chernobil | sin QR |
| 2 | amia | sin QR |
| 3 | 911 | sin QR |
| 4 | kennedy | con QR |
| 5 | chernobil | con QR |
| 6 | 911 | con QR |

Para recompilarlo después de cambiar un afiche (tarda unos minutos):

```powershell
npm run compilar-targets
```

## Cómo agregar una noticia

1. Exportar el GLB del tele (con un material llamado `pantalla`) a `public/models/<id>.glb`.
2. Poner el video en `public/videos/<id>.mp4` (H.264 + AAC) y un cuadro del video en `public/videos/<id>.jpg`.
3. Sumar los subtítulos `public/subs/<id>.vtt` y, si hay, el original en `public/videos/originales/` y `public/subs/originales/`.
4. Sumar la entrada en `src/datos/noticias.json` con sus `targets`.
5. Sumar las miniaturas del tele (color y silueta) en `src/assets/teles/` y en `src/datos/teles.ts`, tal como están en Figma.
6. Sumar el afiche en `afiches/` y correr `npm run compilar-targets`.

## Datos del evento

Los datos del evento (fecha, hora, lugar, redes y newsletter) están en `evento` dentro de `src/datos/noticias.json`. Hoy son provisorios, y el newsletter es una simulación (`"simulado": true`): valida el mail, muestra la carga y la confirmación, pero no guarda nada. Para conectarlo de verdad, poné un link de formulario en `newsletter.url` y `simulado` en `false`. Las redes y `eventUrl` con "TODO" quedan sin link hasta que haya uno.

## Reinicio oculto

En la colección, mantener apretado el título "Colección" 3 segundos pregunta si querés borrar el progreso (sirve para las demos).

## Publicar

Se publica en Vercel (`vercel.json` ya indica Vite, `npm run build` y la carpeta `dist`).

```powershell
npm install
npx vercel --prod
```

## Créditos

- **Diseño:** la identidad visual, el design system (colores, tipografías, íconos y componentes) y el diseño de las interfaces fueron diseñados a mano en Figma por el equipo del proyecto.
- **Código:** el paso de esos diseños de Figma a código, el reconocimiento de afiches (AR y QR) y el funcionamiento de la web se desarrollaron con asistencia de IA (Claude, de Anthropic).
