import { useParams, useNavigate } from 'react-router-dom';
import { espaciosUniversitarios } from '../Datos.js';
import './DetalleEspacio.css';

export default function DetalleEspacio() {
  // useParams extrae el ID de la URL (ej: /detalle/1)
  const { id } = useParams();
  const navigate = useNavigate();

  // Buscamos el espacio que coincida con el ID
  const espacio = espaciosUniversitarios.find(e => e.id === parseInt(id));

  // Si el usuario pone un ID que no existe en la URL
  if (!espacio) {
    return <h2 style={{textAlign: 'center', marginTop: '50px'}}>Espacio no encontrado</h2>;
  }

  const elegirHorarios = () => {
    navigate(`/reservar-horario/${espacio.id}`);
  };

  return (
    <div className="detalle-contenedor">
      <div className="detalle-tarjeta">
        
        {/* Lado izquierdo: Información */}
        <div className="detalle-info">
          <h2>{espacio.nombre}</h2>
          <span className="detalle-tag">{espacio.categoria}</span>
          <p className="detalle-capacidad"><strong>Capacidad:</strong> {espacio.capacidad} alumno(s)</p>
          <p className="detalle-texto">{espacio.descripcion}</p>
          
          <div className="detalle-botones">
            <button className="btn-confirmar" onClick={elegirHorarios}>
              Elegir Horarios
            </button>
            <button className="btn-cancelar" onClick={() => navigate(-1)}>
              Volver
            </button>
          </div>
        </div>

        {/* Lado derecho: Imagen circular */}
        <div className="detalle-imagen-box">
          <img 
            src={`/${espacio.imagen}`} 
            alt={espacio.nombre} 
            className="imagen-circular" 
          />
        </div>

      </div>
    </div>
  );
}