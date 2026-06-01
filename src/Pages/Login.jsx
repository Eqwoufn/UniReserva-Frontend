import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; 

export default function Login() {
  const [codigo, setCodigo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const manejarEnvio = (e) => {
    e.preventDefault(); 
    
    if (codigo === '20236694' && password === '12345678') {
      console.log("Intentando ingresar con el código:", codigo);
      localStorage.setItem('codigoAlumno', codigo);
      setError('');
      navigate('/dashboard');
    } else {
      setError('Código de alumno o contraseña incorrectos.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>UniReserva</h2>
        <p>Ingresa con tu cuenta universitaria</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={manejarEnvio}>
          <div className="input-group">
            <label htmlFor="codigo">Código de Alumno</label>
            <input 
              type="text" 
              id="codigo"
              placeholder="Tu codigo ulima"
              value={codigo}
              onChange={(e) => {
                setCodigo(e.target.value);
                if (error) setError('');
              }}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Contraseña</label>
            <input 
              type="password" 
              id="password"
              placeholder="Tu contraseña"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError('');
              }}
              required
            />
          </div>

          <button type="submit" className="btn-ingresar">
            Ingresar
          </button>
        </form>

        <div className="login-note">
          <p><strong>Nota para pruebas:</strong></p>
          <p>Código: <code>20236694</code></p>
          <p>Contraseña: <code>12345678</code></p>
        </div>

        <button className="btn-volver-rol" onClick={() => navigate('/')}>
          Volver a Selección de Rol
        </button>
      </div>
    </div>
  );
}