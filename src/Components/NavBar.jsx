import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const navigate = useNavigate();

  const cerrarSesion = () => {
    // Por ahora solo redirigimos al login simulando cerrar sesión
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <h2>UniReserva</h2>
      </div>
      <div className="navbar-links">
        <Link to="/dashboard" className="nav-item">Reservar Espacios</Link>
        <Link to="/mis-reservas" className="nav-item">Mis Reservas</Link>
        <Link to="/perfil" className="nav-item">Mi Perfil</Link>
        <button onClick={cerrarSesion} className="btn-salir">Cerrar Sesión</button>
      </div>
    </nav>
  );
}