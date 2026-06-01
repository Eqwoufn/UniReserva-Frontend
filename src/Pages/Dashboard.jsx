import { useState, useEffect } from 'react';
import { espaciosUniversitarios as datosIniciales } from '../Datos.js';
import TarjetaEspacio from '../Components/TarjetaEspacio';
import './Dashboard.css';

export default function Dashboard() {
  const [espacios, setEspacios] = useState([]);

  useEffect(() => {
    const guardados = localStorage.getItem('espaciosUniversitarios');
    if (guardados) {
      const lista = JSON.parse(guardados);
      // Migración de nombres de imágenes antiguas a las nuevas
      let huboCambios = false;
      const mapaImagenes = {
        'tachy1.png': 'piscina_ulima.png',
        'tachy2.png': 'futbol_ulima.png',
        'tachy3.png': 'basket_ulima.png',
        'tachy4.png': 'salaetudio_ulima_1.png',
        'tachy5.png': 'salaetudio_ulima_2.png',
        'tachy6.png': 'laboratorioia_ulima.png',
        'tachy7.png': 'laboratoriocivil_ulima.png'
      };

      const listaMigrada = lista.map(e => {
        if (mapaImagenes[e.imagen]) {
          huboCambios = true;
          return { ...e, imagen: mapaImagenes[e.imagen] };
        }
        return e;
      });

      if (huboCambios) {
        localStorage.setItem('espaciosUniversitarios', JSON.stringify(listaMigrada));
        setEspacios(listaMigrada);
      } else {
        setEspacios(lista);
      }
    } else {
      localStorage.setItem('espaciosUniversitarios', JSON.stringify(datosIniciales));
      setEspacios(datosIniciales);
    }
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