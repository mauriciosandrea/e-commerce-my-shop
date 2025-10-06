// ⚙️ src/components/ServiceCard.jsx

import React from 'react';
import { useCart } from '../context/CartContext';

const ServiceCard = ({ service }) => {
  const { addToCart } = useCart();
  
  // Colores temáticos de Verde Manzana
  const accentColor = '#90ee90';    // Verde manzana brillante (Título)
  const secondaryColor = '#4CAF50'; // Verde más profundo (Botón/Borde)
  const bgColor = '#1a331a';       // Fondo verde oscuro de tarjeta
  const textColor = '#e6ffe6';     // Texto verde claro
  const descriptionColor = '#b3e0b3'; // Verde suave para descripción

  return (
    <div 
      style={{ 
        border: `1px solid ${secondaryColor}`, // Borde verde esmeralda
        padding: '18px', 
        width: '250px', 
        backgroundColor: bgColor, // Fondo verde oscuro
        borderRadius: '10px',
        boxShadow: '0 6px 12px rgba(0,0,0,0.4)',
        color: textColor // Texto verde claro
      }}
    >
      <h3 style={{ color: accentColor, marginBottom: '10px' }}>{service.name}</h3> {/* Título verde manzana */}
      <p style={{ fontSize: '0.9em', color: descriptionColor }}>{service.description}</p> {/* Descripción verde suave */}
      <p style={{ color: accentColor, fontWeight: 'bold', marginTop: '15px', fontSize: '1.2em' }}> {/* Precio verde manzana */}
        Inversión: ${service.price.toFixed(2)}
      </p>
      <button 
        onClick={() => addToCart(service)}
        style={{ 
          backgroundColor: secondaryColor, // Verde de botón
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