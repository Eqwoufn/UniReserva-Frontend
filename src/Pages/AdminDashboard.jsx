import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [espacios, setEspacios] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevaCapacidad, setNuevaCapacidad] = useState('');
  const [faltas, setFaltas] = useState(0);

  // Cargar datos desde la API al montar el componente
  useEffect(() => {
    // Cargar espacios
    fetch(`${API_URL}/api/espacios`)
      .then(res => res.json())
      .then(data => setEspacios(data))
      .catch(err => console.error('Error al cargar espacios:', err));

    // Cargar reservas globales
    fetch(`${API_URL}/api/reservas`)
      .then(res => res.json())
      .then(data => setReservas(data))
      .catch(err => console.error('Error al cargar reservas:', err));

    // Cargar faltas del estudiante de prueba
    fetch(`${API_URL}/api/faltas/20236694`)
      .then(res => res.json())
      .then(data => setFaltas(data.faltas))
      .catch(err => console.error('Error al cargar faltas:', err));
  }, []);

  const cerrarSesion = () => {
    localStorage.removeItem('emailAdmin');
    navigate('/');
  };

  const agregarFalta = () => {
    fetch(`${API_URL}/api/faltas/20236694`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accion: 'incrementar' })
    })
      .then(res => res.json())
      .then(data => setFaltas(data.faltas))
      .catch(err => console.error('Error al agregar falta:', err));
  };

  const quitarFalta = () => {
    if (faltas > 0) {
      fetch(`${API_URL}/api/faltas/20236694`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accion: 'decrementar' })
      })
        .then(res => res.json())
        .then(data => setFaltas(data.faltas))
        .catch(err => console.error('Error al quitar falta:', err));
    }
  };

  // Función 1: Cambiar el estado de disponibilidad del ambiente (Abierto / Cerrado)
  const toggleDisponibilidad = (id) => {
    const espacio = espacios.find(e => e.id === id);
    if (!espacio) return;

    fetch(`${API_URL}/api/espacios/${id}/disponibilidad`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ disponible: !espacio.disponible })
    })
      .then(res => {
        if (!res.ok) throw new Error('Error al cambiar disponibilidad');
        return res.json();
      })
      .then(updated => {
        const listaActualizada = espacios.map(e => (e.id === id ? updated : e));
        setEspacios(listaActualizada);
      })
      .catch(err => console.error('Error al cambiar disponibilidad:', err));
  };

  // Función 2: Crear ambiente de estudio extra (máximo 3 extras)
  const crearAmbienteExtra = (e) => {
    e.preventDefault();

    const extrasActuales = espacios.filter(e => e.esExtra === true);
    if (extrasActuales.length >= 3) {
      alert("Límite alcanzado: No puedes crear más de 3 ambientes de estudio extras simultáneamente.");
      return;
    }

    fetch(`${API_URL}/api/espacios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: nuevoNombre, capacidad: nuevaCapacidad })
    })
      .then(res => {
        if (!res.ok) throw new Error('Error al crear el ambiente');
        return res.json();
      })
      .then(nuevoAmbiente => {
        setEspacios([...espacios, nuevoAmbiente]);
        setNuevoNombre('');
        setNuevaCapacidad('');
        alert(`Ambiente de estudio "${nuevoAmbiente.nombre}" creado exitosamente.`);
      })
      .catch(err => {
        console.error('Error al crear ambiente extra:', err);
        alert('Hubo un error al crear el ambiente.');
      });
  };

  // Eliminar un ambiente extra creado
  const eliminarAmbienteExtra = (id) => {
    fetch(`${API_URL}/api/espacios/${id}`, {
      method: 'DELETE'
    })
      .then(res => {
        if (!res.ok) throw new Error('Error al eliminar el ambiente');
        return res.json();
      })
      .then(() => {
        const listaActualizada = espacios.filter(e => e.id !== id);
        setEspacios(listaActualizada);
        alert("Ambiente extra eliminado correctamente.");
      })
      .catch(err => {
        console.error('Error al eliminar ambiente extra:', err);
        alert('Hubo un error al eliminar el ambiente.');
      });
  };

  // Función 3: Anular reserva de alumno de manera global
  const anularReservaAdmin = (id) => {
    fetch(`${API_URL}/api/reservas/${id}`, {
      method: 'DELETE'
    })
      .then(res => {
        if (!res.ok) throw new Error('Error al anular la reserva');
        return res.json();
      })
      .then(() => {
        const listaActualizada = reservas.filter(r => r.id !== id);
        setReservas(listaActualizada);
        alert("Reserva de alumno anulada desde administración.");
      })
      .catch(err => {
        console.error('Error al anular reserva admin:', err);
        alert('Hubo un error al anular la reserva.');
      });
  };

  const extrasCreados = espacios.filter(e => e.esExtra === true);

  return (
    <div className="admin-contenedor">
      {/* Cabecera Administrativa */}
      <header className="admin-header">
        <div className="admin-header-title">
          <h2>Panel de Gerencia - UniReserva</h2>
          <span className="admin-badge-rol">Administrador</span>
        </div>
        <button onClick={cerrarSesion} className="btn-salir-admin">
          Cerrar Sesión
        </button>
      </header>

      <main className="admin-body">
        {/* Fila superior: Gestión de Espacios y Creación de Extras */}
        <div className="admin-layout-grid">
          
          {/* Bloque 1: Lista y Estado de Espacios */}
          <div className="admin-seccion-card">
            <h3>Gestión de Ambientes</h3>
            <p className="card-subtitulo">Habilita (Abre) o deshabilita (Cierra) los ambientes del campus para reservas estudiantiles.</p>
            
            <div className="tabla-wrapper">
              <table className="admin-tabla">
                <thead>
                  <tr>
                    <th>Ambiente</th>
                    <th>Categoría</th>
                    <th>Estado</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {espacios.map(e => (
                    <tr key={e.id}>
                      <td className="tabla-nombre-celda">
                        <strong>{e.nombre}</strong>
                        {e.esExtra && <span className="badge-extra-label">Extra</span>}
                      </td>
                      <td>{e.categoria}</td>
                      <td>
                        <span className={`badge-estado-admin ${e.disponible ? 'estado-abierto' : 'estado-cerrado'}`}>
                          {e.disponible ? 'Abierto' : 'Cerrado'}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => toggleDisponibilidad(e.id)}
                          className={`btn-toggle-estado ${e.disponible ? 'btn-cerrar' : 'btn-abrir'}`}
                        >
                          {e.disponible ? 'Cerrar' : 'Abrir'}
                        </button>
                        {e.esExtra && (
                          <button
                            onClick={() => eliminarAmbienteExtra(e.id)}
                            className="btn-eliminar-extra"
                            title="Eliminar ambiente permanentemente"
                          >
                            Eliminar
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bloque 2: Formulario de Creación de Extras */}
          <div className="admin-seccion-card">
            <h3>Añadir Ambiente de Estudio</h3>
            <p className="card-subtitulo">Añade ambientes de estudio extras para alta demanda académica. Máximo 3 extras permitidos.</p>
            
            <div className="extras-contador-box">
              <span>Ambientes Extras Creados:</span>
              <strong className={extrasCreados.length >= 3 ? 'limite-alcanzado' : ''}>
                {extrasCreados.length} de 3
              </strong>
            </div>

            <form onSubmit={crearAmbienteExtra} className="form-extra">
              <div className="form-group-admin">
                <label htmlFor="nombre-extra">Nombre del Ambiente</label>
                <input 
                  type="text" 
                  id="nombre-extra"
                  placeholder="Ej: Sala de Estudio C"
                  value={nuevoNombre}
                  onChange={(e) => setNuevoNombre(e.target.value)}
                  required
                  disabled={extrasCreados.length >= 3}
                />
              </div>

              <div className="form-group-admin">
                <label htmlFor="capacidad-extra">Capacidad (alumnos)</label>
                <input 
                  type="number" 
                  id="capacidad-extra"
                  placeholder="Ej: 4"
                  min="1"
                  max="20"
                  value={nuevaCapacidad}
                  onChange={(e) => setNuevaCapacidad(e.target.value)}
                  required
                  disabled={extrasCreados.length >= 3}
                />
              </div>

              <button 
                type="submit" 
                className="btn-crear-ambiente"
                disabled={extrasCreados.length >= 3}
              >
                Crear Ambiente de Estudio
              </button>
            </form>
          </div>

        </div>

        {/* Bloque: Mirar Faltas Cometidas */}
        <div className="admin-seccion-card faltas-card" style={{ marginBottom: '30px' }}>
          <h3>Mirar Faltas Cometidas</h3>
          <p className="card-subtitulo">Visualiza, añade o quita faltas académicas aplicadas a los alumnos registrados.</p>
          
          <div className="tabla-wrapper">
            <table className="admin-tabla">
              <thead>
                <tr>
                  <th>Código de Alumno</th>
                  <th>Nombre Completo</th>
                  <th>Carrera</th>
                  <th>Faltas Cometidas</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="codigo-reserva-celda">20236694</td>
                  <td><strong>Estudiante Ulima</strong></td>
                  <td>Ingeniería de Sistemas</td>
                  <td>
                    <span className={`badge-faltas-admin ${faltas > 0 ? 'con-faltas' : 'sin-faltas'}`}>
                      {faltas} {faltas === 1 ? 'falta' : 'faltas'}
                    </span>
                  </td>
                  <td>
                    <div className="acciones-faltas-buttons">
                      <button onClick={agregarFalta} className="btn-agregar-falta" title="Agregar Falta">
                        + Agregar Falta
                      </button>
                      <button 
                        onClick={quitarFalta} 
                        className="btn-quitar-falta" 
                        title="Quitar Falta" 
                        disabled={faltas <= 0}
                      >
                        - Quitar Falta
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Fila Inferior: Reservas de Alumnos en el Sistema */}
        <div className="admin-seccion-card reservas-globales-card">
          <h3>Listado de Reservas Activas</h3>
          <p className="card-subtitulo">Monitorea las reservas hechas por todos los alumnos y realiza cancelaciones directas si es necesario.</p>

          <div className="tabla-wrapper">
            {reservas.length === 0 ? (
              <p className="no-reservas-admin">No hay reservas activas registradas en el sistema en este momento.</p>
            ) : (
              <table className="admin-tabla">
                <thead>
                  <tr>
                    <th>Código / Reserva ID</th>
                    <th>Espacio Reservado</th>
                    <th>Fecha</th>
                    <th>Horario</th>
                    <th>Estado</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {reservas.map(r => (
                    <tr key={r.id}>
                      <td className="codigo-reserva-celda">#{String(r.id).substring(0, 7)}</td>
                      <td><strong>{r.espacio}</strong></td>
                      <td>{r.fecha}</td>
                      <td>{r.hora}</td>
                      <td>
                        <span className="badge-estado-reserva">{r.estado}</span>
                      </td>
                      <td>
                        <button
                          onClick={() => anularReservaAdmin(r.id)}
                          className="btn-anular-reserva-admin"
                        >
                          Cancelar Reserva
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
