import { useNavigate } from 'react-router-dom';
import './SeleccionRol.css';

export default function SeleccionRol() {
  const navigate = useNavigate();

  // Función para manejar la selección del rol de Estudiante
  const elegirEstudiante = () => {
    navigate('/login');
  };

  // Función para manejar la selección del rol de Administrador
  const elegirAdministrador = () => {
    navigate('/login-admin');
  };

  return (
    <div className="rol-contenedor">
      <div className="rol-card">
        <h2>¿Cómo deseas ingresar?</h2>
        <p>Selecciona tu rol para acceder al sistema UniReserva</p>
        
        <div className="rol-opciones">
          <button className="btn-rol estudiante" onClick={elegirEstudiante}>
            <div className="rol-icono">🎓</div>
            <h3>Estudiante</h3>
            <span className="rol-desc">Reservar espacios y gestionar mis reservas activas</span>
          </button>

          <button className="btn-rol administrador" onClick={elegirAdministrador}>
            <div className="rol-icono">⚙️</div>
            <h3>Administrador</h3>
            <span className="rol-desc">Gestionar espacios, horarios e incidencias del campus</span>
          </button>
        </div>
      </div>
    </div>
  );
}
