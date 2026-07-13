import { useState, useEffect } from 'react';
import './Perfil.css';

export default function Perfil() {
  const [codigo] = useState(() => localStorage.getItem('codigoAlumno') || '20236694');
  const [reservasActivas, setReservasActivas] = useState(0);
  const [faltas, setFaltas] = useState(0);

  useEffect(() => {
    const cod = codigo;

    // Cargar faltas del estudiante desde la API
    fetch(`http://localhost:5000/api/faltas/${cod}`)
      .then(res => res.json())
      .then(data => {
        setFaltas(data.faltas);
      })
      .catch(err => console.error('Error fetching faltas:', err));

    // Cargar cantidad de reservas del estudiante desde la API
    fetch('http://localhost:5000/api/reservas')
      .then(res => res.json())
      .then(data => {
        const count = data.filter(r => r.codigoAlumno === cod).length;
        setReservasActivas(count);
      })
      .catch(err => console.error('Error fetching reservas count:', err));
  }, [codigo]);

  return (
    <div className="perfil-contenedor">
      <div className="perfil-tarjeta">
        <div className="perfil-cabecera">
          <div className="perfil-avatar">
            {codigo ? codigo.substring(0, 4) : 'U'}
          </div>
          <h2>Mi Perfil Académico</h2>
          <p className="perfil-subtitulo">Universidad de Lima</p>
        </div>

        <div className="perfil-info">
          <div className="info-item">
            <span className="info-label">Código de Alumno:</span>
            <span className="info-valor">{codigo}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Nombre Completo:</span>
            <span className="info-valor">
              {codigo === '20236694' ? 'Christian Ricse' : 'Estudiante Ulima'}
            </span>
          </div>
          <div className="info-item">
            <span className="info-label">Carrera:</span>
            <span className="info-valor">Ingeniería de Sistemas</span>
          </div>
          <div className="info-item">
            <span className="info-label">Reservas Activas:</span>
            <span className="info-valor badge-activas">{reservasActivas} espacio(s)</span>
          </div>
          <div className="info-item">
            <span className="info-label">Faltas Cometidas:</span>
            <span className={faltas > 0 ? 'badge-faltas' : 'badge-sin-faltas'}>
              {faltas} {faltas === 1 ? 'falta cometida' : 'faltas cometidas'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
