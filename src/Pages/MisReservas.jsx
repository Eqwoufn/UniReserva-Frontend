import { useState } from 'react';
import './MisReservas.css'; // Importamos los estilos que crearemos en el paso 2

export default function MisReservas() {
  // Simulamos que el alumno ya hizo 2 reservas usando useState
  const [misReservas, setMisReservas] = useState([
    { id: 101, espacio: "Sala de Estudio A", fecha: "28 de Mayo", hora: "14:00 - 16:00", estado: "Confirmada" },
    { id: 102, espacio: "Cancha de Fútbol", fecha: "29 de Mayo", hora: "18:00 - 19:30", estado: "Confirmada" }
  ]);

  // Función para simular la anulación de una reserva
  const anularReserva = (idParaEliminar) => {
    // Filtramos la lista: nos quedamos con todas las reservas EXCEPTO la que queremos anular
    const nuevasReservas = misReservas.filter(reserva => reserva.id !== idParaEliminar);
    setMisReservas(nuevasReservas);
    
    // Opcional: Una pequeña alerta nativa para darle feedback al usuario
    alert("Reserva anulada correctamente.");
  };

  return (
    <div className="contenedor-reservas">
      <h2>Mis Reservas Activas</h2>
      <p>Aquí puedes gestionar los espacios que has apartado a tu nombre.</p>
      
      {/* Si ya no hay reservas, mostramos un mensaje vacío */}
      {misReservas.length === 0 ? (
        <div className="mensaje-vacio">
          <p>Aún no tienes reservas activas. ¡Ve al Panel de Reservas para apartar un espacio!</p>
        </div>
      ) : (
        /* Si hay reservas, dibujamos una tarjeta por cada una */
        <div className="lista-reservas">
          {misReservas.map((reserva) => (
            <div key={reserva.id} className="tarjeta-reserva-activa">
              <div className="info-reserva">
                <h3>{reserva.espacio}</h3>
                <p><strong>Fecha:</strong> {reserva.fecha}</p>
                <p><strong>Hora:</strong> {reserva.hora}</p>
                <span className="badge-estado">{reserva.estado}</span>
              </div>
              
              <button 
                className="btn-anular" 
                onClick={() => anularReserva(reserva.id)}
              >
                Anular Reserva
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}