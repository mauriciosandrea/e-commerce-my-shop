// ⚙️ src/context/CartContext.jsx

import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Funciones placeholder
  const addToCart = (product) => {
    console.log(`Añadido al carrito: ${product.name}`);
    setCartItems(prev => [...prev, { ...product, id: Date.now() + Math.random() }]);
  };
  
  const clearCart = () => {
    setCartItems([]);
  };

  const value = {
    cartItems,
    loading,
    addToCart,
    clearCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};