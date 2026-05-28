import { espaciosUniversitarios } from '../datos';
import TarjetaEspacio from '../Components/TarjetaEspacio';

export default function Dashboard() {
  // Aquí filtramos los datos para separarlos en 3 grupos distintos
  const areasDeportivas = espaciosUniversitarios.filter(espacio => espacio.categoria === "Áreas Deportivas");
  const areasEstudio = espaciosUniversitarios.filter(espacio => espacio.categoria === "Áreas de Estudio");
  const laboratorios = espaciosUniversitarios.filter(espacio => espacio.categoria === "Laboratorios");

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h2>Panel de Reservas</h2>
      <p>Selecciona un espacio para tu próxima sesión (Recuerda: la reserva se hará a tu nombre).</p>
         
      <div style={{ marginTop: '30px' }}>
        <h3 style={{ borderBottom: '2px solid #ff6600', paddingBottom: '10px' }}>Áreas Deportivas</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {areasDeportivas.map((espacio) => (
            <TarjetaEspacio key={espacio.id} espacio={espacio} />
          ))}
        </div>
      </div>

      <div style={{ marginTop: '30px' }}>
        <h3 style={{ borderBottom: '2px solid #ff6600', paddingBottom: '10px' }}>Áreas de Estudio</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {areasEstudio.map((espacio) => (
            <TarjetaEspacio key={espacio.id} espacio={espacio} />
          ))}
        </div>
      </div>
      <div style={{ marginTop: '30px' }}>
        <h3 style={{ borderBottom: '2px solid #ff6600', paddingBottom: '10px' }}>Laboratorios</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {laboratorios.map((espacio) => (
            <TarjetaEspacio key={espacio.id} espacio={espacio} />
          ))}
        </div>
      </div>

    </div>
  );
}