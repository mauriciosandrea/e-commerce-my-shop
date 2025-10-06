// ⚙️ src/pages/Shop.jsx

import React from 'react';
import { useCart } from '../context/CartContext';

// Datos de productos simulados
const products = [
  { id: 1, name: "Laptop Gamer", price: 1200 },
  { id: 2, name: "Monitor Curvo", price: 350 },
  { id: 3, name: "Mouse RGB", price: 50 },
];

const Shop = () => {
  const { addToCart } = useCart();

  return (
    <div>
      <h1>Tienda de Productos</h1>
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {products.map((product) => (
          <div key={product.id} style={{ border: '1px solid #ccc', padding: '15px', width: '200px' }}>
            <h3>{product.name}</h3>
            <p>Precio: ${product.price}</p>
            <button 
              onClick={() => addToCart(product)}
              style={{ backgroundColor: '#4CAF50', color: 'white', padding: '10px', border: 'none', cursor: 'pointer' }}
            >
              Añadir al Carrito
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shop;