import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('smartretailx_cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem('smartretailx_cart', JSON.stringify(cart));
    } catch (e) {
      console.warn('Failed to save cart to localStorage', e);
    }
  }, [cart]);

  const showToast = (message, type = 'info') => {
    setToastMessage({ message, type, id: Date.now() });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  /**
   * Add a product to the cart with specified quantity.
   */
  const addToCart = (product, quantity = 1) => {
    if (!product || !product.id) return;

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex] = { ...updated[existingIndex], quantity: newQty };
        showToast(`Updated "${product.name}" quantity to ${newQty}`, 'success');
        return updated;
      } else {
        showToast(`Added "${product.name}" to your cart`, 'success');
        return [...prevCart, { product, quantity }];
      }
    });
  };

  /**
   * Remove item completely from cart.
   */
  const removeFromCart = (productId) => {
    setCart((prevCart) => {
      const itemToRemove = prevCart.find((item) => item.product.id === productId);
      if (itemToRemove) {
        showToast(`Removed "${itemToRemove.product.name}" from cart`, 'info');
      }
      return prevCart.filter((item) => item.product.id !== productId);
    });
  };

  /**
   * Update quantity of a product in the cart.
   */
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  /**
   * Empty the entire cart.
   */
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('smartretailx_cart');
  };

  // Calculations
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => acc + (Number(item.product.price) || 0) * item.quantity, 0);
  const tax = subtotal * 0.08; // 8% estimated tax
  const shipping = subtotal > 150 || subtotal === 0 ? 0 : 15; // Free shipping over $150
  const grandTotal = subtotal + tax + shipping;

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    subtotal,
    tax,
    shipping,
    grandTotal,
    toastMessage,
    showToast
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;
