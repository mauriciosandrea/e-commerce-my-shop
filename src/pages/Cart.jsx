// ⚙️ src/pages/Cart.jsx

import React, { useState } from 'react'; 
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cartItems, clearCart } = useCart();
  
  // Estado para el método de pago (Mercado Pago por defecto)
  const [paymentMethod, setPaymentMethod] = useState('mercadopago'); 
  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  // Colores temáticos
  const accentColor = '#90ee90'; // Verde manzana brillante (títulos)
  const secondaryColor = '#4CAF50'; // Verde más profundo (bordes)
  const bgColor = '#1a331a'; // Fondo oscuro de contenedor de pagos
  const textColor = '#e6ffe6'; // Texto verde claro

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert("¡Tu cesta está vacía! Añade servicios para continuar.");
      return;
    }
    
    let message = `¡Simulación de Pago Exitosa!
    \nTotal: $${total.toFixed(2)}
    \nMétodo Seleccionado: `;

    // Lógica de Mensajes por Método de Pago
    switch (paymentMethod) {
      case 'mercadopago':
        message += "Mercado Pago (Redirección simulada a la pasarela)";
        break;
      case 'visa':
        message += "Tarjeta de Crédito VISA";
        break;
      case 'mastercard':
        message += "Tarjeta de Crédito MASTERCARD";
        break;
      default:
        message += "Método de pago no reconocido.";
    }

    alert(message);
    // Nota: El clearCart() está comentado en la simulación, pero puedes descomentarlo si lo deseas.
    // clearCart(); 
  };

  return (
    <div>
      <h1 style={{ color: accentColor }}>Tu Cesta de Consultas</h1>
      
      {cartItems.length === 0 ? (
        <p style={{ marginTop: '20px', color: '#b3e0b3' }}>Tu cesta de servicios está vacía. ¡Consulta al Oráculo Verde!</p>
      ) : (
        <>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {cartItems.map((item, index) => (
              <li key={index} style={{ 
                borderBottom: `1px solid ${secondaryColor}`, // Borde verde
                padding: '10px 0', 
                color: textColor, // Texto verde claro
                display: 'flex',
                justifyContent: 'space-between'
              }}>
                <span>{item.name}</span>
                <span>**${item.price.toFixed(2)}**</span>
              </li>
            ))}
          </ul>
          
          <h2 style={{ marginTop: '30px', color: accentColor }}>Total Final: **${total.toFixed(2)}**</h2>
          
          {/* Sección de Medios de Pago */}
          <div style={{ margin: '30px 0', padding: '20px', border: `1px solid ${secondaryColor}`, borderRadius: '10px', backgroundColor: bgColor }}>
            <h3 style={{ color: accentColor }}>Elige tu Medio de Pago</h3>
            
            {/* Opciones de Pago actualizadas con tonos de verde */}
            {[
              { id: 'mercadopago', name: 'Mercado Pago', color: '#66bb6a', logo: 'MP' }, // Verde de MP
              { id: 'visa', name: 'Tarjeta VISA', color: '#33691e', logo: 'V' },       // Verde oscuro
              { id: 'mastercard', name: 'Tarjeta MASTERCARD', color: '#7cb342', logo: 'M' } // Verde oliva
            ].map((method) => (
              <label key={method.id} style={{ display: 'block', margin: '10px 0', color: textColor }}>
                <input 
                  type="radio" 
                  value={method.id} 
                  checked={paymentMethod === method.id} 
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  style={{ marginRight: '8px' }}
                /> 
                <span style={{ fontWeight: 'bold', color: method.color }}>{method.name}</span> 
              </label>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={handleCheckout} 
              style={{ 
                padding: '12px 20px', 
                backgroundColor: secondaryColor, // Verde botón de acción
                color: 'white', 
                border: 'none', 
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Confirmar Reserva con {paymentMethod === 'mercadopago' ? 'Mercado Pago' : 'Tarjeta'}
            </button>
            <button 
              onClick={clearCart}
              style={{ padding: '12px 20px', backgroundColor: '#e57373', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }} // Rojo suave para vaciar
            >
              Vaciar carrito
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;