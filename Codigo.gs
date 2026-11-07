/**
 * Estad_Basket — copia de los partidos en esta hoja de Google Sheets.
 *
 * Instalación (una sola vez):
 *  1. En la hoja: Extensiones > Apps Script. Borra lo que haya y pega este código.
 *  2. Cambia CLAVE por una frase larga que solo sepas tú.
 *  3. Implementar > Nueva implementación > tipo "Aplicación web".
 *       Ejecutar como: Yo        Quién tiene acceso: Cualquier usuario
 *     Autoriza los permisos y copia la URL que termina en /exec.
 *  4. En la app (sección "Copia en Google Sheets") pega esa URL y la misma CLAVE.
 *
 * Si cambias este código: Implementar > Gestionar implementaciones > editar (lápiz)
 * > Versión: "Nueva versión". Así la URL no cambia.
 */
const CLAVE = 'cambia-esta-clave-por-una-larga';

const HOJA_PARTIDOS = 'Partidos';
const HOJA_TIROS = 'Tiros';
const CAB_P = ['id', 'fecha', 'rival', 'lugar', 'jugador', 'dorsal', 'nuestro_equipo', 'rival_puntos', 'estado',
  'puntos', 't2_anotados', 't2_intentos', 't3_anotados', 't3_intentos', 'tl_anotados', 'tl_intentos',
  'reb_ataque', 'reb_defensa', 'rebotes', 'asistencias', 'robos', 'tapones', 'faltas_recibidas', 'perdidas', 'tapones_recibidos', 'faltas', 'valoracion',
  'actualizado', 'datos_app'];
const CAB_T = ['id_partido', 'fecha', 'rival', 'lugar', 'x_m', 'y_m', 'distancia_m', 'valor', 'anotado', 'zona'];

function doGet() {
  return salida({ ok: true, info: 'Estad_Basket activo' });
}

function doPost(e) {
  let body;
  try { body = JSON.parse(e.postData.contents); } catch (err) { return salida({ ok: false, error: 'json' }); }
  if (body.token !== CLAVE) return salida({ ok: false, error: 'token' });

  if (body.action === 'list') return salida({ ok: true, games: listar() });

  if (body.action === 'save') {
    const lock = LockService.getScriptLock();
    lock.waitLock(20000);
    try { (body.games || []).forEach(guardar); } finally { lock.releaseLock(); }
    return salida({ ok: true });
  }
  return salida({ ok: false, error: 'accion' });
}

function salida(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function hoja(nombre, cab) {
  const ss = SpreadsheetApp.getActive();
  let sh = ss.getSheetByName(nombre);
  if (!sh) {
    sh = ss.insertSheet(nombre);
    sh.getRange(1, 1, 1, cab.length).setValues([cab]).setFontWeight('bold');
    sh.setFrozenRows(1);
  }
  return sh;
}

/** Devuelve todos los partidos (incluidos los borrados, para que el borrado llegue a otros móviles). */
function listar() {
  const sh = hoja(HOJA_PARTIDOS, CAB_P);
  const n = sh.getLastRow() - 1;
  if (n < 1) return [];
  const iJ = CAB_P.indexOf('datos_app');
  return sh.getRange(2, 1, n, CAB_P.length).getValues()
    .map(function (r) { try { return JSON.parse(r[iJ]); } catch (err) { return null; } })
    .filter(Boolean);
}

function guardar(g) {
  if (!g || !g.id || g.example) return;
  const sh = hoja(HOJA_PARTIDOS, CAB_P);
  const iJ = CAB_P.indexOf('datos_app') + 1;
  const n = sh.getLastRow() - 1;
  const ids = n > 0 ? sh.getRange(2, 1, n, 1).getValues().map(function (r) { return String(r[0]); }) : [];
  const idx = ids.indexOf(String(g.id));
  const fila = idx >= 0 ? idx + 2 : sh.getLastRow() + 1;

  // Si la hoja ya tiene una versión más reciente (de otro móvil), no se pisa.
  if (idx >= 0) {
    try {
      const prev = JSON.parse(sh.getRange(fila, iJ).getValue());
      if ((prev.updatedAt || 0) > (g.updatedAt || 0)) return;
    } catch (err) { /* fila sin datos válidos: se sobrescribe */ }
  }

  const actualizado = new Date(g.updatedAt || Date.now());
  let fila_valores;
  if (g.deleted) {
    fila_valores = CAB_P.map(function () { return ''; });
    fila_valores[0] = g.id;
    fila_valores[CAB_P.indexOf('estado')] = 'borrado';
    fila_valores[CAB_P.indexOf('actualizado')] = actualizado;
    fila_valores[iJ - 1] = JSON.stringify(g);
  } else {
    const c = calcular(g);
    fila_valores = [
      g.id, g.date || '', g.rival || '', lugar(g), g.player || '', g.dorsal || '',
      g.final ? g.final.us : '', g.final ? g.final.them : '', g.status === 'live' ? 'en juego' : 'terminado',
      c.pts, c.m2, c.a2, c.m3, c.a3, c.mft, c.aft,
      c.oreb, c.dreb, c.oreb + c.dreb, c.ast, c.stl, c.blk, c.fd, c.tov, c.blka, c.pf, valoracion(c),
      actualizado, JSON.stringify(g)
    ];
  }
  sh.getRange(fila, 1, 1, CAB_P.length).setValues([fila_valores]);
  sh.getRange(fila, 1).setNumberFormat('@'); // el id siempre como texto
  reescribirTiros(g);
}

function reescribirTiros(g) {
  const sh = hoja(HOJA_TIROS, CAB_T);
  const n = sh.getLastRow() - 1;
  let filas = n > 0 ? sh.getRange(2, 1, n, CAB_T.length).getValues() : [];
  filas = filas.filter(function (r) { return String(r[0]) !== String(g.id); });
  if (!g.deleted) {
    (g.events || []).forEach(function (e) {
      if (e.t !== 'shot') return;
      const dist = Math.hypot(e.x - 75, e.y - 15.75) / 10;
      filas.push([g.id, g.date || '', g.rival || '', lugar(g), e.x / 10, e.y / 10, Math.round(dist * 10) / 10,
        e.v, e.made ? 'Sí' : 'No', zona(e)]);
    });
  }
  if (n > 0) sh.getRange(2, 1, n, CAB_T.length).clearContent();
  if (filas.length) sh.getRange(2, 1, filas.length, CAB_T.length).setValues(filas);
}

/** Valoración ACB/FEB. */
function valoracion(c) {
  return c.pts + c.oreb + c.dreb + c.ast + c.stl + c.blk + c.fd
    - (c.a2 - c.m2) - (c.a3 - c.m3) - (c.aft - c.mft) - c.tov - c.blka - c.pf;
}

function lugar(g) { return g.venue === 'fuera' ? 'Fuera' : g.venue === 'casa' ? 'En casa' : ''; }

function zona(e) {
  if (e.v === 3) return 'Triple';
  if (e.x >= 50.5 && e.x <= 99.5 && e.y <= 58) return 'Zona';
  return 'Media distancia';
}

function calcular(g) {
  const c = { pts: 0, m2: 0, a2: 0, m3: 0, a3: 0, mft: 0, aft: 0, oreb: 0, dreb: 0, ast: 0, stl: 0, blk: 0, fd: 0, tov: 0, blka: 0, pf: 0 };
  (g.events || []).forEach(function (e) {
    if (e.t === 'shot') {
      if (e.v === 3) { c.a3++; if (e.made) { c.m3++; c.pts += 3; } }
      else { c.a2++; if (e.made) { c.m2++; c.pts += 2; } }
    } else if (e.t === 'ft') {
      c.aft++; if (e.made) { c.mft++; c.pts++; }
    } else if (e.t === 'stat' && e.k in c) {
      c[e.k]++;
    }
  });
  return c;
}
