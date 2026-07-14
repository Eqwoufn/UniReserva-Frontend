import { useState, useEffect } from 'react';
import TarjetaEspacio from '../Components/TarjetaEspacio';
import { API_URL } from '../config';
import './Dashboard.css';

export default function Dashboard() {
  const [espacios, setEspacios] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/api/espacios`)
      .then(res => res.json())
      .then(data => {
        setEspacios(data);
      })
      .catch(err => {
        console.error('Error al cargar los espacios:', err);
      });
  }, []);

  // Filtrar los datos por categorías
  const areasDeportivas = espacios.filter(espacio => espacio.categoria === "Áreas Deportivas");
  const areasEstudio = espacios.filter(espacio => espacio.categoria === "Áreas de Estudio");
  const laboratorios = espacios.filter(espacio => espacio.categoria === "Laboratorios");

  return (
    <div className="dashboard-contenedor">
      
      {/* Cabecera del Dashboard */}
      <div className="dashboard-cabecera">
        <h2>Panel de Reservas</h2>
        <p>Selecciona un espacio para tu próxima sesión académica o deportiva en el campus.</p>
      </div>
         
      {/* Sección: Áreas Deportivas */}
      <div className="dashboard-seccion">
        <div className="seccion-titulo-wrapper">
          <h3 className="seccion-titulo">Áreas Deportivas</h3>
          <span className="categoria-badge-cantidad">{areasDeportivas.length} disponibles</span>
        </div>
        <div className="dashboard-grid">
          {areasDeportivas.map((espacio) => (
            <TarjetaEspacio key={espacio.id} espacio={espacio} />
          ))}
        </div>
      </div>

      {/* Sección: Áreas de Estudio */}
      <div className="dashboard-seccion">
        <div className="seccion-titulo-wrapper">
          <h3 className="seccion-titulo">Áreas de Estudio</h3>
          <span className="categoria-badge-cantidad">{areasEstudio.length} disponibles</span>
        </div>
        <div className="dashboard-grid">
          {areasEstudio.map((espacio) => (
            <TarjetaEspacio key={espacio.id} espacio={espacio} />
          ))}
        </div>
      </div>

      {/* Sección: Laboratorios */}
      <div className="dashboard-seccion">
        <div className="seccion-titulo-wrapper">
          <h3 className="seccion-titulo">Laboratorios</h3>
          <span className="categoria-badge-cantidad">{laboratorios.length} disponibles</span>
        </div>
        <div className="dashboard-grid">
          {laboratorios.map((espacio) => (
            <TarjetaEspacio key={espacio.id} espacio={espacio} />
          ))}
        </div>
      </div>
    </div>
  );
}