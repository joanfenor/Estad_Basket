# Estadillo del Jugador

App web para llevar las estadísticas de un jugador de baloncesto partido a partido.
Guarda cada acción en el propio móvil, funciona sin cobertura y no necesita ninguna cuenta.

## 1. Publicarla (gratis, sin instalar nada)
1. Entra en https://app.netlify.com/drop y crea una cuenta gratuita (con tu correo personal).
2. Arrastra esta carpeta entera a la página.
3. Te da una dirección del tipo `https://algo.netlify.app`. Puedes cambiarle el nombre en
   Site configuration > Change site name (por ejemplo `estadillo-tunombre`).
4. Para actualizar la app más adelante: Deploys > arrastra otra vez la carpeta.

Los archivos `Codigo.gs` y `LEEME.md` no hace falta subirlos (si se suben, no pasa nada).

## 2. Instalarla en el móvil
1. Abre la dirección en Safari (iPhone) o Chrome (Android).
2. Añádela a la pantalla de inicio:
   - iPhone: botón Compartir > «Añadir a pantalla de inicio».
   - Android: menú ⋮ > «Añadir a pantalla de inicio» / «Instalar aplicación».
3. Úsala siempre desde ese icono. En iPhone, el icono y Safari guardan los datos por separado.

## 3. Copias de seguridad y cambio de móvil
- Al terminar cada partido, la app propone «Guardar copia». Se abre el menú de compartir:
  envía el archivo `estadillo-copia-AAAA-MM-DD.txt` a WhatsApp (a ti mismo), al correo o a Archivos.
- En la pantalla de inicio verás cuándo fue la última copia y si hay partidos sin copiar.
- Móvil nuevo: instala la app (paso 2), pulsa «Restaurar desde archivo» y elige la última copia.
- «Exportar a Excel (CSV)» genera una tabla con una fila por partido.

## Opcional: Google Sheets
Quien quiera copia automática en una hoja de Google puede usar `Codigo.gs`
(instrucciones dentro del archivo) y pulsar «Conectar con Google Sheets (opcional)» en la app.

## Si cambias el código
Cambia en `sw.js` la línea `estadillo-v1` por `estadillo-v2` (y así sucesivamente)
para que los móviles descarguen la versión nueva.
