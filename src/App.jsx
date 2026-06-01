import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Login from './Pages/Login.jsx';
import Dashboard from './Pages/Dashboard.jsx';
import MisReservas from './Pages/MisReservas.jsx';
import Navbar from './Components/Navbar.jsx';
import DetalleEspacio from './Pages/DetalleEspacio.jsx';
import Perfil from './Pages/Perfil.jsx';
import SeleccionRol from './Pages/SeleccionRol.jsx';
import LoginAdmin from './Pages/LoginAdmin.jsx';
import AdminDashboard from './Pages/AdminDashboard.jsx';
import ReservarHorario from './Pages/ReservarHorario.jsx';
import './index.css';

// Creamos un componente envoltorio para manejar cuándo mostrar el Navbar del estudiante
function RutasConNavbar() {
  const location = useLocation();
  
  // El Navbar del estudiante SOLO se mostrará en sus páginas asociadas
  const mostrarNavbar = 
    location.pathname === '/dashboard' || 
    location.pathname === '/mis-reservas' || 
    location.pathname === '/perfil' || 
    location.pathname.startsWith('/detalle/') ||
    location.pathname.startsWith('/reservar-horario/');

  return (
    <>
      {mostrarNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<SeleccionRol />} />
        <Route path="/login" element={<Login />} />
        <Route path="/login-admin" element={<LoginAdmin />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/mis-reservas" element={<MisReservas />} />
        <Route path="/detalle/:id" element={<DetalleEspacio />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/reservar-horario/:id" element={<ReservarHorario />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <RutasConNavbar />
    </BrowserRouter>
  );
}

export default App;