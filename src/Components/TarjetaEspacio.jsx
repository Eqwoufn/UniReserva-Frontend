import './TarjetaEspacio.css';
import { useNavigate } from 'react-router-dom';

export default function TarjetaEspacio({ espacio }) {
  const navigate = useNavigate();
  return (
    <div className={`tarjeta-espacio-card ${espacio.disponible ? 'card-disponible' : 'card-ocupado'}`}>
      
      {/* Contenedor de Imagen de Cabecera con Tag Flotante */}
      <div className="tarjeta-imagen-wrapper">
        <img 
          src={`/${espacio.imagen}`} 
          alt={espacio.nombre} 
          className="tarjeta-imagen" 
        />
        <span className={`estado-tag-flotante ${espacio.disponible ? 'tag-disponibilidad-ok' : 'tag-disponibilidad-no'}`}>
          {espacio.disponible ? 'Disponible' : 'Ocupado'}
        </span>
      </div>

      {/* Cuerpo Informativo */}
      <div className="tarjeta-cuerpo">
        <span className="tarjeta-badge-categoria">{espacio.categoria}</span>
        <h3>{espacio.nombre}</h3>
        <p className="tarjeta-capacidad">
          <span className="capacidad-icono">👥</span> Capacidad: <strong>{espacio.capacidad} alumno(s)</strong>
        </p>
      </div>

      {/* Pie de Tarjeta con Acción */}
      <div className="tarjeta-pie">
        <button 
          className="btn-reservar-tarjeta" 
          disabled={!espacio.disponible}
          onClick={() => navigate(`/detalle/${espacio.id}`)}
        >
          {espacio.disponible ? 'Reservar' : 'No disponible'}
        </button>
      </div>

    </div>
  );
}