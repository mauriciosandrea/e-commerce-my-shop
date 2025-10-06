// ⚙️ src/context/AuthContext.jsx

import React, { createContext, useContext, useState, useEffect } from 'react';

// 1. Crear el Contexto
const AuthContext = createContext();

/**
 * @description Hook personalizado para consumir el contexto de autenticación de forma sencilla.
 * @returns {object} El valor del contexto: { currentUser, login, logout }
 */
export const useAuth = () => {
  return useContext(AuthContext);
};

// 2. Crear el Proveedor del Contexto
export const AuthProvider = ({ children }) => {
  // Estado para el usuario autenticado. 
  const [currentUser, setCurrentUser] = useState(() => {
    const storedUser = localStorage.getItem('currentUser');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // --- Funciones de Autenticación Básica ---

  const login = (email, password) => {
    // Simulación: Asumimos que el login fue exitoso.
    const user = { 
      id: Date.now(), 
      email: email, 
      name: email.split('@')[0],
      role: 'customer' 
    };
    
    // Actualizar el estado y persistir en localStorage
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  };

  const logout = () => {
    // Limpiar el estado y localStorage
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  // ------------------------------------------

  // El valor provisto al contexto
  const value = {
    currentUser,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};