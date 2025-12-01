import React, { createContext, useContext, useState, useMemo } from 'react';

const CartContext = createContext();

// Exportación nombrada para el hook
export const useCart = () => useContext(CartContext);

// Exportación nombrada para el Provider
export const CartProvider = ({ children }) => {
    // Renombrado para coincidir con tu estructura, contiene {product, quantity}
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false); // Manteniendo tu estado de loading

    // Función auxiliar para verificar si un producto ya está en el carrito
    const isInCart = (id) => {
        return cartItems.some(item => item.id === id);
    };

    // Función para agregar un producto al carrito (Maneja incremento de cantidad)
    const addToCart = (product, quantity = 1) => {
        setLoading(true); // Opcional: indicar que se está procesando la adición
        
        if (isInCart(product.id)) {
            // Si el producto ya existe, actualiza la cantidad
            setCartItems(prevCart =>
                prevCart.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                )
            );
        } else {
            // Si el producto es nuevo, agrégalo
            setCartItems(prevCart => [...prevCart, { ...product, quantity }]);
        }
        
        setLoading(false);
        console.log(`Añadido/Actualizado en carrito: ${product.name}`);
    };
    
    // Función para eliminar una unidad o todo el producto
    const removeItem = (id, removeAll = false) => {
        setLoading(true);
        setCartItems(prevCart => {
            if (removeAll) {
                // Elimina el producto completo del carrito
                return prevCart.filter(item => item.id !== id);
            }

            // Reduce la cantidad en 1
            const updatedCart = prevCart.map(item => {
                if (item.id === id) {
                    return { ...item, quantity: item.quantity - 1 };
                }
                return item;
            }).filter(item => item.quantity > 0); // Filtra si la cantidad llega a cero

            return updatedCart;
        });
        setLoading(false);
    };

    // Función para vaciar completamente el carrito
    const clearCart = () => {
        setLoading(true);
        setCartItems([]);
        setLoading(false);
    };

    // Cálculo del total de productos (useMemo para evitar recálculos innecesarios)
    const totalItems = useMemo(() => 
        cartItems.reduce((acc, item) => acc + item.quantity, 0), [cartItems]
    );

    // Cálculo del costo total
    const totalCost = useMemo(() => 
        cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0), [cartItems]
    );

    const value = {
        cartItems,
        loading,
        totalItems, // Total de unidades en el carrito
        totalCost,  // Costo total de la compra
        isInCart,
        addToCart, // Usamos tu nombre de función original
        removeItem,
        clearCart,
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};