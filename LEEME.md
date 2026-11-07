# El español de Katia — app para el móvil

Contenido de la carpeta:

- `index.html`: pantalla de inicio (Verbos / Vocabulario)
- `verbos.html` y `vocabulario.html`: las dos partes
- `manifest.webmanifest`, `sw.js` e `icons/`: lo que hace que se instale como app y funcione sin conexión

No necesita servidor propio ni hoja de Google: todo el progreso se guarda en el móvil de Katia.

## 1. Publicarla (elige una opción)

**Opción A: GitHub Pages (como Estad_Basket)**
1. En github.com, con tu cuenta personal: *New repository* → nombre, por ejemplo, `espanol-katia` → *Public* → *Create*.
2. *Add file → Upload files* → arrastra **el contenido** de esta carpeta (los archivos y la carpeta `icons`, no la carpeta entera) → *Commit changes*.
3. *Settings → Pages* → *Source: Deploy from a branch* → *Branch: main* y carpeta `/ (root)` → *Save*.
4. En uno o dos minutos tendrás la dirección: `https://TU-USUARIO.github.io/espanol-katia/`

**Opción B: Netlify Drop**
1. Entra en `app.netlify.com/drop` con tu cuenta personal.
2. Arrastra la carpeta descomprimida. Te da una dirección `https://algo.netlify.app`.

## 2. Instalarla en el móvil de Katia

- **Android (Chrome):** abre la dirección → menú ⋮ → *Instalar aplicación* (o *Añadir a pantalla de inicio*).
- **iPhone (Safari):** abre la dirección → botón *Compartir* → *Añadir a pantalla de inicio*.

Aparece un icono con su cara sobre la bandera. Después de abrirla una vez con conexión, funciona sin internet.

## 3. Actualizarla más adelante

1. Sube los archivos nuevos (reemplazando los antiguos).
2. En `sw.js`, cambia `const VERSION='v1';` por `'v2'` (y así sucesivamente) y súbelo también.
3. La próxima vez que Katia abra la app con conexión se descarga la versión nueva; la siguiente vez que la abra ya la verá.

Los puntos y el progreso de Katia no se pierden al actualizar.

## Avisos

- El progreso se guarda en el móvil. Si Katia borra los datos del navegador o desinstala la app, se pierde.
- Los puntos que hubiera conseguido en las páginas anteriores (el enlace de Claude o los archivos HTML sueltos) no pasan a la app: empieza de cero.
