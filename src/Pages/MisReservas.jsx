import { useState, useEffect } from 'react';
import { API_URL } from '../config';
import './MisReservas.css';

export default function MisReservas() {
  const [misReservas, setMisReservas] = useState([]);

  useEffect(() => {
    const cod = localStorage.getItem('codigoAlumno') || '20236694';
    fetch(`${API_URL}/api/reservas`)
      .then(res => res.json())
      .then(data => {
        const filtradas = data.filter(reserva => reserva.codigoAlumno === cod);
        setMisReservas(filtradas);
      })
      .catch(err => {
        console.error('Error fetching reservas:', err);
      });
  }, []);

  const anularReserva = (idParaEliminar) => {
    fetch(`${API_URL}/api/reservas/${idParaEliminar}`, {
      method: 'DELETE'
    })
      .then(res => {
        if (!res.ok) throw new Error('Error al anular la reserva');
        return res.json();
      })
      .then(() => {
        const nuevasReservas = misReservas.filter(reserva => reserva.id !== idParaEliminar);
        setMisReservas(nuevasReservas);
        alert("Reserva anulada correctamente.");
      })
      .catch(err => {
        console.error('Error al anular la reserva:', err);
        alert('Hubo un error al anular la reserva. Intenta nuevamente.');
      });
  };

  return (
    <div className="contenedor-reservas">
      <h2>Mis Reservas Activas</h2>
      <p>Aquí puedes gestionar los espacios que has apartado a tu nombre.</p>

      {misReservas.length === 0 ? (
        <div className="mensaje-vacio">
          <p>Aún no tienes reservas activas. ¡Ve al Panel de Reservas para apartar un espacio!</p>
        </div>
      ) : (

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