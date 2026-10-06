import { useState, useEffect, useCallback } from 'react';
import ListaContactos from './ListaContactos.jsx';
import AgregarContacto from './AgregarContacto.jsx';

const URL_AGENDA = '/agenda'; // servicio Express (Tarea 5)

// Componente PADRE: guarda el estado y habla con el servicio web
function App() {
  const [contactos, setContactos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  // GET: obtiene todos los contactos en JSON
  const cargarContactos = useCallback(async () => {
    setCargando(true);
    setError('');
    try {
      const r = await fetch(URL_AGENDA);
      if (!r.ok) {
        throw new Error('El servidor respondió con el código ' + r.status);
      }
      const datos = await r.json();
      setContactos(Array.isArray(datos) ? datos : []);
    } catch (e) {
      setError(
        'No se pudo cargar la lista (' + e.message + '). ' +
        'Revisa tu conexión y pulsa Recargar.'
      );
    } finally {
      setCargando(false);
    }
  }, []);

  // Se ejecuta al montar el componente: carga inicial
  useEffect(() => {
    cargarContactos();
  }, [cargarContactos]);

  // POST: envía un cuerpo JSON con nombre, apellido y telefono
  const agregarContacto = async (nuevo) => {
    const r = await fetch(URL_AGENDA, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevo),
    });
    if (!r.ok) {
      throw new Error('El servidor respondió con el código ' + r.status);
    }
    await cargarContactos(); // refresca el listado
  };

  return (
    <main className="wrap">
      <h1>Agenda</h1>
      <p className="sub">Tus contactos, guardados en el servidor.</p>

      <div className="grid">
        <ListaContactos
          contactos={contactos}
          cargando={cargando}
          error={error}
          onRecargar={cargarContactos}
        />
        <AgregarContacto onAgregar={agregarContacto} />
      </div>
    </main>
  );
}

export default App;
