// ⚙️ src/context/AuthContext.jsx (Estructura validada y comentarios actualizados)

import React, { createContext, useContext, useState, useEffect } from 'react';

// 1. Crear el Contexto
const AuthContext = createContext();

/**
 * @description Hook personalizado para consumir el contexto de autenticación de forma sencilla.
 * @returns {object} El valor del contexto: { currentUser, userToken, login, logout }
 */
export const useAuth = () => {
    return useContext(AuthContext);
};

// 2. Crear el Proveedor del Contexto
export const AuthProvider = ({ children }) => {
    // Estado para el usuario autenticado. 
    const [currentUser, setCurrentUser] = useState(() => {
        // Intentar recuperar el usuario del localStorage
        const storedUser = localStorage.getItem('currentUser');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    // Estado para el token JWT (importante para las peticiones posteriores)
    const [userToken, setUserToken] = useState(() => {
        return localStorage.getItem('userToken') || null;
    });

    // --- Funciones de Autenticación Real ---

    /**
     * @description Función que se llama desde Login.jsx con los datos obtenidos del backend.
     * @param {string} token El JWT recibido del servidor.
     * @param {object} userData Los detalles del usuario (id, name, email, phone, address, ROLE).
     * ***NOTA: userData DEBE incluir la propiedad 'role'.***
     */
    const login = (token, userData) => {
        // 1. Guardar el Token JWT para peticiones futuras
        setUserToken(token);
        localStorage.setItem('userToken', token);

        // 2. Guardar los datos del usuario (incluyendo el ROLE)
        // El objeto userData debe ser el objeto 'user' que envía tu backend, que contiene el 'role'.
        setCurrentUser(userData);
        localStorage.setItem('currentUser', JSON.stringify(userData));
    };

    const logout = () => {
        // Limpiar todos los estados y localStorage
        setCurrentUser(null);
        setUserToken(null);
        localStorage.removeItem('currentUser');
        localStorage.removeItem('userToken');
        
        // Opcional: Podrías forzar una redirección aquí si fuera necesario
    };

    // ------------------------------------------

    // El valor provisto al contexto (incluimos userToken)
    const value = {
        currentUser,
        userToken, // Necesario para enviar en los headers de peticiones protegidas
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};