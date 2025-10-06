// ⚙️ src/pages/Dashboard.jsx

import React from 'react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  // Solo se accede si el usuario está autenticado (gracias a ProtectedRoute)
  const { currentUser } = useAuth();
  
  // Colores temáticos
  const accentColor = '#90ee90'; // Verde manzana brillante
  const secondaryColor = '#4CAF50'; // Verde más profundo
  const bgColor = '#1a331a'; // Fondo oscuro de contenedor
  const textColor = '#e6ffe6'; // Texto verde claro

  return (
    <div style={{ 
      padding: '30px', 
      border: `1px solid ${secondaryColor}`, 
      borderRadius: '10px',
      backgroundColor: bgColor,
      color: textColor,
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.5)'
    }}>
      <h1 style={{ color: accentColor, marginBottom: '20px' }}>
        🌌 Portal Personal: Mi Espacio Místico
      </h1>
      <p style={{ color: secondaryColor }}>
        Esta es tu zona segura de consultas y perfil.
      </p>
      
      {currentUser && (
        <div style={{ 
          marginTop: '30px', 
          backgroundColor: '#0d1a0d', // Fondo más oscuro para destacar
          padding: '20px',
          borderRadius: '8px',
          border: `1px solid ${secondaryColor}`
        }}>
          <h3 style={{ color: accentColor, borderBottom: `1px solid ${secondaryColor}`, paddingBottom: '10px', marginBottom: '15px' }}>
            Detalles del Viajero Astral:
          </h3>
          <p><strong>ID:</strong> <span style={{ color: accentColor }}>{currentUser.id}</span></p>
          <p><strong>Nombre:</strong> <span style={{ color: textColor }}>{currentUser.name}</span></p>
          <p><strong>Email:</strong> <span style={{ color: textColor }}>{currentUser.email}</span></p>
          <p><strong>Rol:</strong> <span style={{ color: accentColor, fontWeight: 'bold' }}>{currentUser.role}</span></p>
          
          <div style={{ marginTop: '20px', paddingTop: '15px', borderTop: `1px dashed ${secondaryColor}` }}>
            <p style={{ fontStyle: 'italic', color: '#b3e0b3' }}>
              Aquí podrás ver el historial de tus lecturas y los detalles de tus reservas futuras.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;