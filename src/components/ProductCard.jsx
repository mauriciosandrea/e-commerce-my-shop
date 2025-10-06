// ⚙️ src/components/ProductCard.jsx

import React from 'react';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  
  // Opcional: Para la optimización de UX, podrías deshabilitar el botón
  // si ya está en el carrito, pero lo mantendremos simple por ahora.

  return (
    <div 
      style={{ 
        border: '1px solid #444', 
        padding: '15px', 
        width: '200px', 
        backgroundColor: '#333',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
      }}
    >
      <h3>{product.name}</h3>
      <p style={{ color: '#00ccff', fontWeight: 'bold' }}>
        Precio: ${product.price.toFixed(2)}
      </p>
      <button 
        onClick={() => addToCart(product)}
        style={{ 
          backgroundColor: '#4CAF50', 
          color: 'white', 
          padding: '10px 15px', 
          border: 'none', 
          borderRadius: '4px',
          cursor: 'pointer',
          width: '100%',
          marginTop: '10px'
        }}
      >
        Añadir al Carrito
      </button>
    </div>
  );
};

export default ProductCard;