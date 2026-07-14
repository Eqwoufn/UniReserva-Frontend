import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_URL } from '../config';
import './ReservarHorario.css';

export default function ReservarHorario() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [espacio, setEspacio] = useState(null);
  const [cargando, setCargando] = useState(true);

  // Estado para almacenar las celdas de horarios seleccionadas
  const [seleccionados, setSeleccionados] = useState([]); // [{ dia, hora }, ...]

  // Configuración de la grilla horaria
  const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const horasManana = [
    '07:30 - 08:30',
    '08:30 - 09:30',
    '09:30 - 10:30',
    '10:30 - 11:30',
    '11:30 - 12:30'
  ];
  const receso = '12:30 - 13:30';
  const horasTarde = [
    '13:30 - 14:30',
    '14:30 - 15:30',
    '15:30 - 16:30',
    '16:30 - 17:30',
    '17:30 - 18:30',
    '18:30 - 19:30',
    '19:30 - 20:30'
  ];
  const todasLasHoras = [...horasManana, receso, ...horasTarde];

  useEffect(() => {
    fetch(`${API_URL}/api/espacios`)
      .then(res => res.json())
      .then(data => {
        const found = data.find(e => e.id === parseInt(id));
        setEspacio(found);
        setCargando(false);
      })
      .catch(err => {
        console.error('Error fetching espacio:', err);
        setCargando(false);
      });
  }, [id]);

  if (cargando) {
    return <h2 style={{textAlign: 'center', marginTop: '50px'}}>Cargando horarios...</h2>;
  }

  // Si el usuario pone un ID que no existe en la URL
  if (!espacio) {
    return <h2 style={{textAlign: 'center', marginTop: '50px'}}>Espacio no encontrado</h2>;
  }

  // Controlador de eventos para el clic en cada celda/casillero de horario
  const manejarClickSlot = (dia, hora) => {
    if (hora === receso) return; // Bloquear interacción en el receso

    const existe = seleccionados.find(s => s.dia === dia && s.hora === hora);
    
    if (existe) {
      // Si la celda exacta ya está seleccionada, la removemos (toggle)
      setSeleccionados(seleccionados.filter(s => !(s.dia === dia && s.hora === hora)));
    } else {
      // 1. Validar que no se reserve más de una hora para el mismo día
      const mismoDia = seleccionados.find(s => s.dia === dia);
      if (mismoDia) {
        // Reemplazar la hora previa por la nueva hora seleccionada en ese día
        const otros = seleccionados.filter(s => s.dia !== dia);
        setSeleccionados([...otros, { dia, hora }]);
      } else {
        // 2. Validar el límite máximo de 3 horarios seleccionados en total
        if (seleccionados.length >= 3) {
          alert('Solo puedes seleccionar un máximo de 3 horarios (uno por cada día).');
          return;
        }
        // Añadir el nuevo bloque
        setSeleccionados([...seleccionados, { dia, hora }]);
      }
    }
  };

  // Función para calcular la fecha del próximo día calendario según su nombre en español
  const obtenerProximoDiaFecha = (nombreDia) => {
    const diasSemana = {
      'Lunes': 1, 'Martes': 2, 'Miércoles': 3,
      'Jueves': 4, 'Viernes': 5, 'Sábado': 6
    };
    const hoy = new Date();
    const hoyDiaSemana = hoy.getDay(); // 0 = Domingo, 1 = Lunes, etc.
    const targetDiaSemana = diasSemana[nombreDia];
    
    let diferencia = targetDiaSemana - hoyDiaSemana;
    if (diferencia <= 0) {
      diferencia += 7; // Reservar para la siguiente semana
    }
    
    const fechaFutura = new Date(hoy);
    fechaFutura.setDate(hoy.getDate() + diferencia);
    
    const opciones = { day: 'numeric', month: 'long' };
    return fechaFutura.toLocaleDateString('es-ES', opciones);
  };

  const confirmarReserva = () => {
    if (seleccionados.length === 0) {
      return; // Prevenir confirmación vacía
    }

    const codigoAlumno = localStorage.getItem('codigoAlumno') || '20236694';

    const promesas = seleccionados.map((slot) => {
      const fechaCalendario = obtenerProximoDiaFecha(slot.dia);
      return fetch(`${API_URL}/api/reservas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          espacio: espacio.nombre,
          fecha: `${slot.dia}, ${fechaCalendario}`,
          hora: slot.hora,
          codigoAlumno: codigoAlumno
        })
      });
    });

    Promise.all(promesas)
      .then(() => {
        alert(`¡Reserva confirmada con éxito para ${seleccionados.length} bloque(s) en ${espacio.nombre}!`);
        navigate('/mis-reservas');
      })
      .catch(err => {
        console.error('Error al guardar la reserva:', err);
        alert('Hubo un error al guardar la reserva. Intenta nuevamente.');
      });
  };

  return (
    <div className="reserva-horario-contenedor">
      <div className="reserva-horario-tarjeta">
        
        <h2>Elegir Horarios - {espacio.nombre}</h2>
        <span className="reserva-tag">{espacio.categoria}</span>
        
        {/* Grilla Semanal Interactiva */}
        <div className="grilla-formulario-box">
          <p className="grilla-instruccion">
            Selecciona un máximo de 3 horarios en casilleros disponibles (máximo uno por cada día de la semana).
          </p>

          <div className="grilla-contenedor">
            <table className="grilla-tabla">
              <thead>
                <tr>
                  <th>Hora</th>
                  {dias.map(d => <th key={d}>{d}</th>)}
                </tr>
              </thead>
              <tbody>
                {todasLasHoras.map(hora => {
                  const esReceso = hora === receso;
                  return (
                    <tr key={hora} className={esReceso ? 'fila-receso' : ''}>
                      <td className="hora-col">{hora}</td>
                      {esReceso ? (
                        <td colSpan={6} className="celda-receso">
                          Tiempo Muerto / Receso de Almuerzo
                        </td>
                      ) : (
                        dias.map(dia => {
                          const estaSeleccionado = seleccionados.some(
                            s => s.dia === dia && s.hora === hora
                          );
                          return (
                            <td key={dia}>
                              <button
                                type="button"
                                onClick={() => manejarClickSlot(dia, hora)}
                                className={`slot-btn ${estaSeleccionado ? 'seleccionado' : ''}`}
                              >
                                {estaSeleccionado ? 'Seleccionado' : 'Disponible'}
                              </button>
                            </td>
                          );
                        })
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Resumen de la Selección */}
          <div className="reserva-resumen">
            <h4>Horarios Seleccionados ({seleccionados.length} de 3):</h4>
            {seleccionados.length === 0 ? (
              <p className="no-selecciones">No has marcado ningún bloque de horario aún.</p>
            ) : (
              <div className="chips-contenedor">
                {seleccionados.map((s, index) => (
                  <div key={index} className="resumen-chip">
                    <span>{s.dia} ({s.hora})</span>
                    <button
                      type="button"
                      onClick={() => manejarClickSlot(s.dia, s.hora)}
                      className="btn-remover-chip"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="reserva-horario-botones">
          <button 
            className="btn-confirmar" 
            onClick={confirmarReserva}
            disabled={seleccionados.length === 0}
          >
            Confirmar Reserva
          </button>
          <button className="btn-cancelar" onClick={() => navigate(-1)}>
            Volver
          </button>
        </div>

      </div>
    </div>
  );
}
