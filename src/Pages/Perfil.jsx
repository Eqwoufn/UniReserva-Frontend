import { useState, useEffect } from 'react';
import './Perfil.css';

export default function Perfil() {
  const [codigo, setCodigo] = useState('');
  const [reservasActivas, setReservasActivas] = useState(0);
  const [faltas, setFaltas] = useState(0);

  useEffect(() => {
    const cod = localStorage.getItem('codigoAlumno') || '20260000';
    setCodigo(cod);

    // Cargar faltas del estudiante
    const faltasGuardadas = localStorage.getItem('faltas_' + cod);
    if (faltasGuardadas !== null) {
      setFaltas(parseInt(faltasGuardadas));
    } else {
      // Por defecto iniciamos en 1 si es el alumno de prueba 20236694
      const defaultFaltas = cod === '20236694' ? 1 : 0;
      setFaltas(defaultFaltas);
      localStorage.setItem('faltas_' + cod, String(defaultFaltas));
    }

    // Obtener cantidad de reservas activas reales de localStorage
    const reservasGuardadas = localStorage.getItem('misReservas');
    if (reservasGuardadas) {
      setReservasActivas(JSON.parse(reservasGuardadas).length);
    } else {
      // Si no existe, al menos mostrar las 2 que vienen por defecto
      setReservasActivas(2);
    }
  }, []);

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
            <span className="info-valor">Estudiante Ulima</span>
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
