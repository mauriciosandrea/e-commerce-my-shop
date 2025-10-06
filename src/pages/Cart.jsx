// ⚙️ src/pages/Cart.jsx

import React from 'react';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cartItems, clearCart } = useCart();

  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <div>
      <h1>Tu Carrito de Compras</h1>
      
      {cartItems.length === 0 ? (
        <p>El carrito está vacío.</p>
      ) : (
        <>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {cartItems.map((item, index) => (
              <li key={index} style={{ borderBottom: '1px solid #eee', padding: '10px 0' }}>
                {item.name} - **${item.price}**
              </li>
            ))}
          </ul>
          
          <h2 style={{ marginTop: '20px' }}>Total: **${total.toFixed(2)}**</h2>
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={() => alert('¡Proceso de pago simulado!')}
              style={{ padding: '10px 15px', backgroundColor: 'purple', color: 'white', border: 'none', cursor: 'pointer' }}
            >
              Proceder al Pago
            </button>
            <button 
              onClick={clearCart}
              style={{ padding: '10px 15px', backgroundColor: 'red', color: 'white', border: 'none', cursor: 'pointer' }}
            >
              Vaciar Carrito
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;