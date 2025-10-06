// ⚙️ src/pages/Login.jsx

import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // De dónde venía el usuario antes de ser redirigido a login (ej. /dashboard)
  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    // Simulación de validación (¡Mala práctica! Solo para frontend simple)
    if (!email || !password) {
      setError('Por favor, ingresa email y contraseña.');
      return;
    }
    
    try {
      // Usar la función de login del contexto
      login(email, password); 
      
      // Navegar a la página a la que quería ir o al dashboard por defecto
      navigate(from, { replace: true });
    } catch (err) {
      // Esto solo se ejecutaría si la función 'login' en AuthContext lanzara un error
      setError('Fallo al iniciar sesión. Verifica tus credenciales.');
      console.error(err);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ddd' }}>
      <h2>Iniciar Sesión</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <button type="submit" style={{ padding: '10px 15px', backgroundColor: 'green', color: 'white', border: 'none', cursor: 'pointer' }}>
          Entrar
        </button>
      </form>
      <p style={{ marginTop: '15px' }}>
        ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
      </p>
    </div>
  );
};

export default Login;