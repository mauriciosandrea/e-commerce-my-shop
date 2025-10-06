// ⚙️ src/pages/Dashboard.jsx

import React from 'react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  // Solo se accede si el usuario está autenticado (gracias a ProtectedRoute)
  const { currentUser } = useAuth();

  return (
    <div style={{ padding: '20px', border: '1px solid #333' }}>
      <h1>Panel de Usuario (Dashboard)</h1>
      <p>Esta es una **ruta protegida**.</p>
      
      {currentUser && (
        <div style={{ marginTop: '20px', backgroundColor: '#f0f0f0', padding: '15px' }}>
          <h3>Detalles del Usuario:</h3>
          <p><strong>ID:</strong> {currentUser.id}</p>
          <p><strong>Nombre:</strong> {currentUser.name}</p>
          <p><strong>Email:</strong> {currentUser.email}</p>
          <p><strong>Rol:</strong> {currentUser.role}</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;