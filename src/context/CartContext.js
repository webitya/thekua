'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import Toast from '../components/Toast';

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cart, setCart] = useState([]);
    const [toast, setToast] = useState({ show: false, message: '' });

    // Load cart from local storage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('areum-cart');
        if (savedCart) {
            setCart(JSON.parse(savedCart));
        }
    }, []);

    // Save cart to local storage whenever it changes
    useEffect(() => {
        localStorage.setItem('areum-cart', JSON.stringify(cart));
    }, [cart]);

    const showNotification = (message) => {
        setToast({ show: true, message });
    };

    const closeNotification = () => {
        setToast({ ...toast, show: false });
    };

    const addToCart = (product, variant) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find(
                (item) => item._id === product._id && item.variant.name === variant.name
            );

            if (existingItem) {
                return prevCart.map((item) =>
                    item._id === product._id && item.variant.name === variant.name
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                return [...prevCart, { ...product, variant, quantity: 1 }];
            }
        });
        showNotification(`Added ${product.name} - ${variant.name} to bag`);
    };

    const removeFromCart = (productId, variantName) => {
        setCart((prevCart) =>
            prevCart.filter(
                (item) => !(item._id === productId && item.variant.name === variantName)
            )
        );
    };

    const updateQuantity = (productId, variantName, newQuantity) => {
        if (newQuantity < 1) return;
        setCart((prevCart) =>
            prevCart.map((item) =>
                item._id === productId && item.variant.name === variantName
                    ? { ...item, quantity: newQuantity }
                    : item
            )
        );
    };

    const clearCart = () => setCart([]);

    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartCount }}>
            {children}
            <Toast
                message={toast.message}
                isVisible={toast.show}
                onClose={closeNotification}
            />
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}
