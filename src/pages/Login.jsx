// ⚙️ src/pages/Login.jsx (ACTUALIZADO)

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Asumimos que useAuth tiene la función login(token, userData)
  const { login: loginContext } = useAuth(); 
  
  const navigate = useNavigate();
  const location = useLocation();

  // De dónde venía el usuario antes de ser redirigido a login (ej. /dashboard)
  const from = location.state?.from?.pathname || '/dashboard';

  // 1. Manejo de mensajes de verificación por URL (Redirección del Backend)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const verificationStatus = params.get('verification');
    
    if (verificationStatus === 'success') {
      setSuccessMessage('¡Verificación de email exitosa! Por favor, inicia sesión.');
    } else if (verificationStatus === 'expired') {
      setError('El enlace de verificación ha expirado. Por favor, regístrate de nuevo.');
    } else if (verificationStatus === 'error') {
      setError('Error en la verificación. Intenta el registro de nuevo.');
    }
  }, [location.search]);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Login exitoso.
        
        // 🔑 1. Guardar el token y los datos del usuario (incluyendo el ROL) en el Contexto
        loginContext(data.token, data.user); 
        
        // 🔑 2. Redirección basada en el ROL del usuario:
        const userRole = data.user.role; 

        if (userRole === 'developer') {
            // El rol más alto va a su propio panel (o a la gestión general)
            navigate('/panel/developer', { replace: true });
        } else if (userRole === 'admin') {
            // El administrador va a su panel de gestión
            navigate('/panel/admin', { replace: true });
        } else {
            // Usuario normal (incluye 'user' y cualquier otro rol por defecto)
            navigate(from, { replace: true });
        }
        
      } else {
        // Error de login (Credenciales inválidas O Email NO verificado)
        setError(data.message || 'Error al iniciar sesión. Verifica tus credenciales.');
      }
    } catch (err) {
      console.error('Error de conexión:', err);
      setError('No se pudo conectar con el servidor. Verifica que el backend esté corriendo en http://localhost:3001');
    } finally {
      setIsLoading(false);
    }
  };

  // Estilos temáticos de verde manzana
  const accentColor = '#90ee90'; // Verde manzana brillante
  const secondaryColor = '#4CAF50'; // Verde más profundo
  const bgColor = '#1a331a'; // Fondo oscuro de contenedor
  const textColor = '#e6ffe6'; // Texto verde claro
  
  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '30px', backgroundColor: bgColor, borderRadius: '10px', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.5)', color: textColor }}>
      <h1 style={{ color: accentColor, textAlign: 'center', marginBottom: '20px' }}>🗝️ Inicia Sesión</h1>

      {successMessage && <p style={{ color: accentColor, fontWeight: 'bold', textAlign: 'center' }}>{successMessage}</p>}
      {error && <p style={{ color: '#e57373', fontWeight: 'bold', textAlign: 'center' }}>{error}</p>}
      {isLoading && <p style={{ color: accentColor, textAlign: 'center' }}>Consultando al Oráculo...</p>}
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        <input 
          type="email" 
          name="email" 
          placeholder="Correo Electrónico" 
          value={formData.email} 
          onChange={handleChange} 
          required 
          disabled={isLoading}
          style={{ padding: '10px', borderRadius: '5px', border: `1px solid ${secondaryColor}`, backgroundColor: '#0d1a0d', color: textColor }}
        />
        
        <input 
          type="password" 
          name="password" 
          placeholder="Contraseña" 
          value={formData.password} 
          onChange={handleChange} 
          required 
          disabled={isLoading}
          style={{ padding: '10px', borderRadius: '5px', border: `1px solid ${secondaryColor}`, backgroundColor: '#0d1a0d', color: textColor }}
        />

        <button 
          type="submit" 
          disabled={isLoading}
          style={{ 
            padding: '12px', 
            backgroundColor: secondaryColor, 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px', 
            cursor: isLoading ? 'not-allowed' : 'pointer', 
            fontWeight: 'bold', 
            marginTop: '10px',
            opacity: isLoading ? 0.7 : 1
          }}
        >
          {isLoading ? 'Conectando...' : 'Iniciar Sesión'}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '20px' }}>
        ¿No tienes cuenta? <Link to="/register" style={{ color: accentColor, textDecoration: 'none', fontWeight: 'bold' }}>Regístrate aquí</Link>
      </p>
    </div>
  );
};

export default Login;