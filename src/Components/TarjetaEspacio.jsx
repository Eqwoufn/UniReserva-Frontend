import './TarjetaEspacio.css';

export default function TarjetaEspacio({ espacio }) {
  return (
    <div className={`tarjeta ${espacio.disponible ? 'disponible' : 'ocupado'}`}>
      <h3>{espacio.nombre}</h3>
      <p><strong>Tipo:</strong> {espacio.tipo}</p>
      <p><strong>Capacidad:</strong> {espacio.capacidad} personas</p>

      <button 
        className="btn-reservar" 
        disabled={!espacio.disponible}
      >
        {espacio.disponible ? 'Reservar' : 'No disponible'}
      </button>
    </div>
  );
}