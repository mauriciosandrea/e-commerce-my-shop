// ⚙️ src/components/Navbar.jsx

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 
import { useCart } from '../context/CartContext'; 

const Navbar = () => {
  const { currentUser, logout } = useAuth(); 
  const { cartItems } = useCart(); 
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); 
    navigate('/login'); 
  };

  // Calcula la cantidad total de ítems en el carrito (por si agregas la propiedad 'quantity')
  // Usaremos .length si solo contamos la cantidad de tipos de productos.
  const totalItems = cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0);
  
  // Color de fondo: Verde oscuro para la barra
  const bgColor = '#1a331a'; 
  // Color principal de acento: Verde manzana brillante
  const accentColor = '#90ee90'; 
  // Color de texto claro
  const textColor = '#e6ffe6';

  return (
    <nav style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '15px 30px', 
      backgroundColor: bgColor, 
      color: textColor,
      boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
    }}>
      <Link 
        to="/" 
        style={{ color: accentColor, textDecoration: 'none', fontSize: '1.8em', fontWeight: 'bold' }}
      >
        🌿 Armonia Esoterica
      </Link>
      
      <div style={{ display: 'flex', gap: '25px', alignItems: 'center' }}>
        
        {/* Enlace al Carrito/Cesta */}
        <Link 
          to="/cart" 
          style={{ 
            color: accentColor, 
            textDecoration: 'none', 
            fontSize: '1.1em', 
            position: 'relative' 
          }}
        >
          🛒 Cesta ({totalItems}) 
        </Link>
        
        {currentUser ? (
          /* --- ESTADO LOGUEADO --- */
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <span style={{ color: textColor }}>
              Hola, **{currentUser.name}**
            </span>
            
            <Link 
              to="/dashboard" 
              style={{ color: textColor, textDecoration: 'none', fontSize: '1.1em' }}
            >
              Mi Cuenta
            </Link>
            
            <button 
              onClick={handleLogout} 
              style={{ 
                background: '#4CAF50', // Verde de botón
                color: 'white', 
                padding: '8px 15px', 
                border: 'none', 
                borderRadius: '5px', 
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Cerrar Sesión
            </button>
          </div>
        ) : (
          /* --- ESTADO NO LOGUEADO --- */
          <div style={{ display: 'flex', gap: '15px' }}>
            <Link 
              to="/login" 
              style={{ color: textColor, textDecoration: 'none' }}
            >
              Iniciar Sesión
            </Link>
            <Link 
              to="/register"
              style={{ 
                background: accentColor, // Verde manzana para el botón de registro
                color: bgColor, // Texto oscuro sobre el botón
                padding: '8px 15px', 
                border: 'none', 
                borderRadius: '5px', 
                textDecoration: 'none',
                fontWeight: 'bold'
              }}
            >
              Registro
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;