// ⚙️ src/components/ServiceCard.jsx (Crea este archivo)

import React from 'react';
import { useCart } from '../context/CartContext';

const ServiceCard = ({ service }) => {
  const { addToCart } = useCart();
  
  return (
    <div 
      style={{ 
        border: '1px solid #7D3C98', // Color místico
        padding: '18px', 
        width: '250px', // Un poco más ancho para la descripción
        backgroundColor: '#1c1c1c',
        borderRadius: '10px',
        boxShadow: '0 6px 12px rgba(0,0,0,0.4)',
        color: '#f0e6ff' // Texto claro
      }}
    >
      <h3 style={{ color: '#FFD700', marginBottom: '10px' }}>{service.name}</h3>
      <p style={{ fontSize: '0.9em', color: '#bbb' }}>{service.description}</p>
      <p style={{ color: '#00ccff', fontWeight: 'bold', marginTop: '15px', fontSize: '1.2em' }}>
        Inversión: ${service.price.toFixed(2)}
      </p>
      <button 
        onClick={() => addToCart(service)}
        style={{ 
          backgroundColor: '#4CAF50', 
          color: 'white', 
          padding: '10px 15px', 
          border: 'none', 
          borderRadius: '4px',
          cursor: 'pointer',
          width: '100%',
          marginTop: '15px',
          fontWeight: 'bold'
        }}
      >
        Reservar Consulta
      </button>
    </div>
  );
};

export default ServiceCard;