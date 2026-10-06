import { useState, useMemo } from 'react';

const texto = (c, campo) => (c[campo] || '').toString().trim();

// Componente HIJO 1: listado con búsqueda, agrupado por inicial del nombre
function ListaContactos({ contactos, cargando, error, onRecargar }) {
  const [busqueda, setBusqueda] = useState('');

  // Filtra, ordena y agrupa (solo se recalcula si cambian los datos)
  const { filtrados, grupos } = useMemo(() => {
    const q = busqueda.trim().toLowerCase();

    const filtrados = contactos
      .filter((c) => {
        const todo = texto(c, 'nombre') + ' ' + texto(c, 'apellido') +
                     ' ' + texto(c, 'telefono');
        return todo.toLowerCase().includes(q);
      })
      .sort((a, b) =>
        (texto(a, 'nombre') + texto(a, 'apellido')).localeCompare(
          texto(b, 'nombre') + texto(b, 'apellido'), 'es')
      );

    const grupos = [];
    filtrados.forEach((c) => {
      const letra = (texto(c, 'nombre').charAt(0) || '#').toUpperCase();
      let grupo = grupos[grupos.length - 1];
      if (!grupo || grupo.letra !== letra) {
        grupo = { letra, items: [] };
        grupos.push(grupo);
      }
      grupo.items.push(c);
    });

    return { filtrados, grupos };
  }, [contactos, busqueda]);

  const total = filtrados.length;
  const contador = cargando
    ? 'Cargando contactos...'
    : total + (total === 1 ? ' contacto' : ' contactos');

  return (
    <section className="panel" aria-labelledby="t-lista">
      <h2 id="t-lista">Contactos</h2>

      <div className="toolbar">
        <input
          type="search"
          placeholder="Buscar por nombre, apellido o teléfono"
          aria-label="Buscar contactos"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <button
          className="ghost"
          type="button"
          onClick={onRecargar}
          disabled={cargando}
        >
          Recargar
        </button>
      </div>

      {error && <div className="msg error">{error}</div>}
      <p className="count" aria-live="polite">{error ? '' : contador}</p>

      {!error && !cargando && total === 0 && (
        <p className="empty">
          {contactos.length
            ? 'Ningún contacto coincide con la búsqueda.'
            : 'Todavía no hay contactos. Agrega uno en el formulario.'}
        </p>
      )}

      {!error && grupos.map((g) => (
        <div key={g.letra}>
          <div className="letter">{g.letra}</div>
          <ul>
            {g.items.map((c, i) => (
              <li key={g.letra + '-' + i}>
                <span className="name">
                  {texto(c, 'nombre')} {texto(c, 'apellido')}
                </span>
                <span className="tel">{texto(c, 'telefono')}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}

export default ListaContactos;
