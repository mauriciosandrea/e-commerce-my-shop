// ⚙️ src/components/Navbar.jsx

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // 👈 Asegúrate de tener este hook
import { useCart } from '../context/CartContext'; // 👈 Asegúrate de tener este hook

const Navbar = () => {
  const { currentUser, logout } = useAuth(); // Usar logout
  const { cartItems } = useCart(); // Usar cartItems para el contador
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // 👈 Llama a la función logout del contexto
    navigate('/login'); // Redirige a login después de cerrar sesión
  };

  const cartCount = cartItems.length; // Calcula la cantidad de ítems

  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 20px', borderBottom: '1px solid #ccc' }}>
      <div>
        <Link to="/" style={{ marginRight: '15px' }}>🛒 My Shop</Link>
        <Link to="/cart">
          Carrito ({cartCount}) {/* 👈 Muestra el contador del carrito */}
        </Link>
      </div>
      <div>
        {currentUser ? (
          <>
            <span style={{ marginRight: '15px' }}>
              Hola, **{currentUser.name}**
            </span>
            <Link to="/dashboard" style={{ marginRight: '15px' }}>Dashboard</Link>
            <button onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'lightblue' }}>
              Cerrar Sesión {/* 👈 Este botón debe llamar a handleLogout */}
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ marginRight: '15px' }}>Iniciar Sesión</Link>
            <Link to="/register">Registro</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;