import { useState, useRef } from 'react';

const VACIO = { nombre: '', apellido: '', telefono: '' };

// Componente HIJO 2: formulario para agregar contactos
function AgregarContacto({ onAgregar }) {
  const [form, setForm] = useState(VACIO);
  const [guardando, setGuardando] = useState(false);
  const [estado, setEstado] = useState(null); // { texto, tipo }
  const inputNombre = useRef(null);

  // Un solo manejador para los tres campos (inputs controlados)
  const manejarCambio = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();

    const nuevo = {
      nombre: form.nombre.trim(),
      apellido: form.apellido.trim(),
      telefono: form.telefono.trim(),
    };

    if (!nuevo.nombre || !nuevo.apellido || !nuevo.telefono) {
      setEstado({
        texto: 'Completa nombre, apellido y teléfono.',
        tipo: 'error',
      });
      return;
    }

    setGuardando(true);
    try {
      await onAgregar(nuevo); // función recibida del padre
      setForm(VACIO);
      setEstado({ texto: 'Contacto guardado.', tipo: 'ok' });
      inputNombre.current.focus();
    } catch (err) {
      setEstado({
        texto: 'No se pudo guardar el contacto (' + err.message +
               '). Inténtalo de nuevo.',
        tipo: 'error',
      });
    } finally {
      setGuardando(false);
    }
  };

  return (
    <section className="panel" aria-labelledby="t-nuevo">
      <h2 id="t-nuevo">Nuevo contacto</h2>

      {estado && <div className={'msg ' + estado.tipo}>{estado.texto}</div>}

      <form onSubmit={manejarEnvio} noValidate>
        <label htmlFor="nombre">Nombre</label>
        <input
          id="nombre"
          name="nombre"
          autoComplete="given-name"
          ref={inputNombre}
          value={form.nombre}
          onChange={manejarCambio}
        />

        <label htmlFor="apellido">Apellido</label>
        <input
          id="apellido"
          name="apellido"
          autoComplete="family-name"
          value={form.apellido}
          onChange={manejarCambio}
        />

        <label htmlFor="telefono">Teléfono</label>
        <input
          id="telefono"
          name="telefono"
          type="tel"
          autoComplete="tel"
          value={form.telefono}
          onChange={manejarCambio}
        />

        <button className="form-btn" type="submit" disabled={guardando}>
          {guardando ? 'Guardando...' : 'Guardar contacto'}
        </button>
      </form>
    </section>
  );
}

export default AgregarContacto;
