import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginAdmin.css'; 

export default function LoginAdmin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const manejarEnvio = (e) => {
    e.preventDefault(); 
    
    if (email === 'christian@gmail.com' && password === '12345678') {
      console.log("Intentando ingresar como administrador con el correo:", email);
      localStorage.setItem('emailAdmin', email);
      setError('');
      navigate('/admin-dashboard');
    } else {
      setError('Correo o contraseña de administrador incorrectos.');
    }
  };

  return (
    <div className="login-admin-container">
      <div className="login-admin-card">
        <h2>UniReserva</h2>
        <p className="admin-subtitle">Ingreso de Administrador</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={manejarEnvio}>
          <div className="input-group">
            <label htmlFor="email-admin">Correo de Administrador (Gmail)</label>
            <input 
              type="email" 
              id="email-admin"
              placeholder="usuario@gmail.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError('');
              }}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password-admin">Contraseña</label>
            <input 
              type="password" 
              id="password-admin"
              placeholder="Contraseña de administrador"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError('');
              }}
              required
            />
          </div>

          <button type="submit" className="btn-ingresar-admin">
            Ingresar como Administrador
          </button>
        </form>

        <div className="login-note">
          <p><strong>Nota para pruebas:</strong></p>
          <p>Correo: <code>christian@gmail.com</code></p>
          <p>Contraseña: <code>12345678</code></p>
        </div>

        <button className="btn-volver-rol" onClick={() => navigate('/')}>
          Volver a Selección de Rol
        </button>
      </div>
    </div>
  );
}
