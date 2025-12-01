// ⚙️ src/pages/Register.jsx

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '', // Campo adicional
    address: '', // Campo adicional
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setIsLoading(true);

    try {
      // 🚨 CONEXIÓN AL BACKEND DE EXPRESS 🚨
      const response = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Enviamos todos los datos al backend
        body: JSON.stringify(formData), 
      });

      const data = await response.json();

      if (response.ok) {
        // Registro exitoso: El backend respondió que el email fue enviado
        setMessage(data.message);
        // Redirigir al login después de un momento para que el usuario revise su email
        setTimeout(() => {
          navigate('/login');
        }, 5000); 
      } else {
        // Error del backend (ej. email duplicado, contraseña corta, error de servidor)
        setError(data.message || 'Error en el registro. Intenta de nuevo.');
      }
    } catch (err) {
      console.error('Error de conexión:', err);
      setError('No se pudo conectar con el servidor. Verifica que el backend esté corriendo en http://localhost:3001');
    } finally {
      setIsLoading(false);
    }
  };

  // Estilos temáticos de verde manzana
  const accentColor = '#90ee90'; // Verde manzana brillante (títulos, enlaces)
  const secondaryColor = '#4CAF50'; // Verde más profundo (botones, bordes)
  const bgColor = '#1a331a'; // Fondo oscuro de contenedor
  const textColor = '#e6ffe6'; // Texto verde claro

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '30px', backgroundColor: bgColor, borderRadius: '10px', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.5)', color: textColor }}>
      <h1 style={{ color: accentColor, textAlign: 'center', marginBottom: '20px' }}>🔮 Regístrate en El Oráculo Verde</h1>

      {message && <p style={{ color: accentColor, fontWeight: 'bold', textAlign: 'center' }}>{message}</p>}
      {error && <p style={{ color: '#e57373', fontWeight: 'bold', textAlign: 'center' }}>{error}</p>}
      {isLoading && <p style={{ color: accentColor, textAlign: 'center' }}>Procesando solicitud...</p>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        {/* Campo Nombre */}
        <input 
          type="text" 
          name="name" 
          placeholder="Nombre Completo" 
          value={formData.name} 
          onChange={handleChange} 
          required 
          disabled={isLoading}
          style={{ padding: '10px', borderRadius: '5px', border: `1px solid ${secondaryColor}`, backgroundColor: '#0d1a0d', color: textColor }}
        />
        
        {/* Campo Email */}
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
        
        {/* Campo Contraseña */}
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
        
        {/* Campo Teléfono (Opcional) */}
        <input 
          type="tel" 
          name="phone" 
          placeholder="Teléfono (Opcional)" 
          value={formData.phone} 
          onChange={handleChange} 
          disabled={isLoading}
          style={{ padding: '10px', borderRadius: '5px', border: `1px solid ${secondaryColor}`, backgroundColor: '#0d1a0d', color: textColor }}
        />
        
        {/* Campo Dirección (Opcional) */}
        <input 
          type="text" 
          name="address" 
          placeholder="Dirección (Opcional)" 
          value={formData.address} 
          onChange={handleChange} 
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
          {isLoading ? 'Enviando Datos...' : 'Crear Cuenta y Enviar Verificación'}
        </button>
      </form>

      <p style={{ marginTop: '15px', textAlign: 'center' }}>
        ¿Ya tienes cuenta? <Link to="/login" style={{ color: accentColor, textDecoration: 'none' }}>Inicia Sesión</Link>
      </p>
    </div>
  );
};

export default Register;