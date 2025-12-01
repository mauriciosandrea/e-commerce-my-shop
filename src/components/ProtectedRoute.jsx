// ⚙️ src/components/ProtectedRoute.jsx

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Usa el contexto actualizado

/**
 * @description Componente de orden superior (Higher-Order Component) para proteger rutas.
 * Si el usuario no está autenticado, lo redirige a /login.
 * @param {object} props - Contiene los componentes hijos a renderizar si está logueado.
 */
const ProtectedRoute = ({ children }) => {
  // Obtenemos el usuario actual y el token del contexto
  const { currentUser, userToken } = useAuth(); 
  
  // Obtenemos la ubicación actual para redirigir al usuario de vuelta después del login
  const location = useLocation();

  // 1. Verificar Autenticación
  // Chequeamos si currentUser existe Y si userToken existe.
  // Ambos deben existir ya que los guardamos en el AuthContext.
  const isAuthenticated = currentUser && userToken; 

  if (!isAuthenticated) {
    // Si el usuario NO está autenticado:
    
    // Lo redirigimos a /login, pero pasamos el estado 'from' (desde dónde venía)
    // Esto permite que el componente Login lo devuelva a esta ruta después de iniciar sesión.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Renderizar Contenido
  // Si el usuario SÍ está autenticado, renderizamos la ruta solicitada (los children)
  return children;
};

export default ProtectedRoute;