// Tarea 5: Servicio Web con Express (Node.js)
//
// Hace las dos operaciones básicas sobre la agenda:
//   GET  /agenda  -> listar contactos
//   POST /agenda  -> almacenar un contacto { nombre, apellido, telefono }
//
// Ambas operaciones se realizan contra el servicio http://www.raydelto.org/agenda.php
// (el mismo de las tareas 3 y 4). Además, este servidor entrega la agenda React
// compilada (carpeta dist), así que la app y el servicio viven en el mismo origen
// (sin problemas de CORS ni de contenido mixto http/https).

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3000;
const URL_REMOTA =
  process.env.URL_AGENDA_REMOTA || 'http://www.raydelto.org/agenda.php';

const app = express();
app.use(express.json());

const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

// Pide la lista completa al servicio remoto (sin usar caché)
async function obtenerContactos() {
  const r = await fetch(URL_REMOTA, { cache: 'no-store' });
  if (!r.ok) throw new Error('El servicio de agenda respondió con el código ' + r.status);
  const datos = await r.json();
  return Array.isArray(datos) ? datos : [];
}

// Comprueba que el contacto realmente quedó guardado en el servicio remoto
async function existeContacto(c) {
  const igual = (a, b) => String(a || '').trim() === b;
  for (let intento = 0; intento < 3; intento++) {
    const lista = await obtenerContactos();
    // Se busca de atrás hacia adelante: los nuevos quedan al final
    for (let i = lista.length - 1; i >= 0; i--) {
      const x = lista[i];
      if (igual(x.nombre, c.nombre) && igual(x.apellido, c.apellido) && igual(x.telefono, c.telefono)) {
        return true;
      }
    }
    await esperar(700); // por si el servicio tarda en reflejar el cambio
  }
  return false;
}

// ---------- Listar contactos ----------
app.get('/agenda', async (req, res) => {
  res.set('Cache-Control', 'no-store');
  try {
    res.json(await obtenerContactos());
  } catch (err) {
    console.error('[GET] Error:', err.message);
    res.status(502).json({ error: err.message || 'No se pudo contactar el servicio de agenda.' });
  }
});

// ---------- Almacenar un contacto ----------
app.post('/agenda', async (req, res) => {
  const { nombre, apellido, telefono } = req.body || {};

  if (!nombre || !apellido || !telefono) {
    return res.status(400).json({
      error: 'Los campos nombre, apellido y telefono son obligatorios.',
    });
  }

  const contacto = {
    nombre: String(nombre).trim(),
    apellido: String(apellido).trim(),
    telefono: String(telefono).trim(),
  };

  try {
    const r = await fetch(URL_REMOTA, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contacto),
    });
    const cuerpo = await r.text();
    console.log('[POST remoto]', r.status, cuerpo.slice(0, 300));

    if (!r.ok) {
      return res
        .status(502)
        .json({ error: 'El servicio de agenda respondió con el código ' + r.status });
    }

    if (!(await existeContacto(contacto))) {
      console.error('[POST] El servicio aceptó el contacto pero no aparece en la lista.');
      return res.status(502).json({
        error: 'El servicio de agenda aceptó la petición, pero el contacto no aparece en la lista.',
      });
    }

    res.status(201).json(contacto);
  } catch (err) {
    console.error('[POST] Error:', err.message);
    res.status(502).json({ error: 'No se pudo contactar el servicio de agenda.' });
  }
});

// ---------- Agenda React compilada ----------
app.use(express.static(path.join(__dirname, 'dist')));

app.listen(PORT, () => {
  console.log('Agenda disponible en http://localhost:' + PORT);
  console.log('Servicio web en     http://localhost:' + PORT + '/agenda');
});
