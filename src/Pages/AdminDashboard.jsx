import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { espaciosUniversitarios as datosIniciales } from '../Datos.js';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [espacios, setEspacios] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevaCapacidad, setNuevaCapacidad] = useState('');
  const [faltas, setFaltas] = useState(0);

  // Cargar datos desde localStorage al montar el componente
  useEffect(() => {
    // Cargar espacios con migración de imágenes antiguas
    const espaciosGuardados = localStorage.getItem('espaciosUniversitarios');
    if (espaciosGuardados) {
      const lista = JSON.parse(espaciosGuardados);
      let huboCambios = false;
      const mapaImagenes = {
        'tachy1.png': 'piscina_ulima.png',
        'tachy2.png': 'futbol_ulima.png',
        'tachy3.png': 'basket_ulima.png',
        'tachy4.png': 'salaetudio_ulima_1.png',
        'tachy5.png': 'salaetudio_ulima_2.png',
        'tachy6.png': 'laboratorioia_ulima.png',
        'tachy7.png': 'laboratoriocivil_ulima.png'
      };

      const listaMigrada = lista.map(e => {
        if (mapaImagenes[e.imagen]) {
          huboCambios = true;
          return { ...e, imagen: mapaImagenes[e.imagen] };
        }
        return e;
      });

      if (huboCambios) {
        localStorage.setItem('espaciosUniversitarios', JSON.stringify(listaMigrada));
        setEspacios(listaMigrada);
      } else {
        setEspacios(lista);
      }
    } else {
      localStorage.setItem('espaciosUniversitarios', JSON.stringify(datosIniciales));
      setEspacios(datosIniciales);
    }

    // Cargar reservas globales
    const reservasGuardadas = localStorage.getItem('misReservas');
    if (reservasGuardadas) {
      setReservas(JSON.parse(reservasGuardadas));
    } else {
      const mockReservas = [
        { id: 101, espacio: "Sala de Estudio A", fecha: "28 de Mayo", hora: "14:00 - 16:00", estado: "Confirmada" },
        { id: 102, espacio: "Cancha de Fútbol", fecha: "29 de Mayo", hora: "18:00 - 19:30", estado: "Confirmada" }
      ];
      localStorage.setItem('misReservas', JSON.stringify(mockReservas));
      setReservas(mockReservas);
    }

    // Cargar faltas del estudiante de prueba
    const faltasGuardadas = localStorage.getItem('faltas_20236694');
    if (faltasGuardadas !== null) {
      setFaltas(parseInt(faltasGuardadas));
    } else {
      localStorage.setItem('faltas_20236694', '1');
      setFaltas(1);
    }
  }, []);

  const cerrarSesion = () => {
    localStorage.removeItem('emailAdmin');
    navigate('/');
  };

  const agregarFalta = () => {
    const nuevasFaltas = faltas + 1;
    setFaltas(nuevasFaltas);
    localStorage.setItem('faltas_20236694', String(nuevasFaltas));
  };

  const quitarFalta = () => {
    if (faltas > 0) {
      const nuevasFaltas = faltas - 1;
      setFaltas(nuevasFaltas);
      localStorage.setItem('faltas_20236694', String(nuevasFaltas));
    }
  };

  // Función 1: Cambiar el estado de disponibilidad del ambiente (Abierto / Cerrado)
  const toggleDisponibilidad = (id) => {
    const listaActualizada = espacios.map(e => {
      if (e.id === id) {
        return { ...e, disponible: !e.disponible };
      }
      return e;
    });
    setEspacios(listaActualizada);
    localStorage.setItem('espaciosUniversitarios', JSON.stringify(listaActualizada));
  };

  // Función 2: Crear ambiente de estudio extra (máximo 3 extras)
  const crearAmbienteExtra = (e) => {
    e.preventDefault();

    const extrasActuales = espacios.filter(e => e.esExtra === true);
    if (extrasActuales.length >= 3) {
      alert("Límite alcanzado: No puedes crear más de 3 ambientes de estudio extras simultáneamente.");
      return;
    }

    const nuevoAmbiente = {
      id: Date.now(),
      nombre: nuevoNombre,
      categoria: "Áreas de Estudio", // Forzado como espacio de estudio
      capacidad: parseInt(nuevaCapacidad),
      disponible: true,
      imagen: "tachy4.png", // Imagen genérica de sala de estudio
      descripcion: "Sala de estudio extra añadida por la administración para el trabajo grupal y académico.",
      esExtra: true
    };

    const listaActualizada = [...espacios, nuevoAmbiente];
    setEspacios(listaActualizada);
    localStorage.setItem('espaciosUniversitarios', JSON.stringify(listaActualizada));

    // Resetear formulario
    setNuevoNombre('');
    setNuevaCapacidad('');
    alert(`Ambiente de estudio "${nuevoNombre}" creado exitosamente.`);
  };

  // Eliminar un ambiente extra creado
  const eliminarAmbienteExtra = (id) => {
    const listaActualizada = espacios.filter(e => e.id !== id);
    setEspacios(listaActualizada);
    localStorage.setItem('espaciosUniversitarios', JSON.stringify(listaActualizada));
    alert("Ambiente extra eliminado correctamente.");
  };

  // Función 3: Anular reserva de alumno de manera global
  const anularReservaAdmin = (id) => {
    const listaActualizada = reservas.filter(r => r.id !== id);
    setReservas(listaActualizada);
    localStorage.setItem('misReservas', JSON.stringify(listaActualizada));
    alert("Reserva de alumno anulada desde administración.");
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
