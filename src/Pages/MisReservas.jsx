export default function MisReservas() {
  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h2>Mis Reservas Activas</h2>
      <p>Aquí aparecerán los espacios que has apartado.</p>

      {/* En el siguiente paso llenaremos esto con tarjetas de reserva */}
      <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', textAlign: 'center' }}>
        <p style={{ color: '#666' }}>Aún no tienes reservas activas.</p>
      </div>
    </div>
  );
}