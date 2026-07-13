import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const navigate = useNavigate();
  const codigo = localStorage.getItem('codigoAlumno') || '';

  const cerrarSesion = () => {
    localStorage.removeItem('codigoAlumno');
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
        {codigo && <span className="nav-saludo">Hola, {codigo}</span>}
        <button onClick={cerrarSesion} className="btn-salir">Cerrar Sesión</button>
      </div>
    </nav>
  );
}