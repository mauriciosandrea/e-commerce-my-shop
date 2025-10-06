// ⚙️ src/App.jsx

import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Shop from './pages/Shop';
import Cart from './pages/Cart';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import { useAuth } from './context/AuthContext'; 

// Componente para proteger rutas (Private Route)
const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  const location = useLocation();

  if (!currentUser) {
    // Si no está logueado, redirige a Login, guardando la ubicación actual
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
};

const App = () => {
  return (
    <>
      {/* 🔮 1. CAPA DE FONDO: Agregamos el contenedor de estrellas fijo */}
      <div className="star-background">
        {/* 🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟 12 elementos 'star' para mayor densidad 🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟 */}
        <div className="star"></div>
        <div className="star"></div>
        <div className="star"></div>
        <div className="star"></div>
        <div className="star"></div>
        <div className="star"></div>
        <div className="star"></div>
        <div className="star"></div>
        <div className="star"></div>
        <div className="star"></div>
        <div className="star"></div>
        <div className="star"></div>
        {/* ¡Las animaciones CSS se encargan del movimiento de cada uno! */}
      </div>
      {/* ----------------------------------------------------------- */}

      {/* 2. CONTENIDO PRINCIPAL: Navbar y Rutas (Ahora flotan sobre el fondo) */}
      <Navbar />
      <main style={{ padding: '20px' }}>
        <Routes>
          <Route path="/" element={<Shop />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Ruta protegida: Solo accesible si hay un currentUser */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Opcional: Ruta 404 */}
          <Route path="*" element={<h1>404 | Página no encontrada</h1>} />
        </Routes>
      </main>
    </>
  );
};

export default App;