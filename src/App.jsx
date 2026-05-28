import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Login from './Pages/Login.jsx';
import Dashboard from './Pages/Dashboard.jsx';
import MisReservas from './Pages/MisReservas.jsx';
import Navbar from './Components/NavBar.jsx';
import './index.css';

// Creamos un componente envoltorio para manejar cuándo mostrar el Navbar
function RutasConNavbar() {
  const location = useLocation();
  // El Navbar NO se mostrará en la ruta "/" (Login)
  const mostrarNavbar = location.pathname !== '/';

  return (
    <>
      {mostrarNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/mis-reservas" element={<MisReservas />} />
        {/* Aquí agregaremos la ruta del perfil más adelante */}
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