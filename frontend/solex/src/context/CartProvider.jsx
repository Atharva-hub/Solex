import React, { useEffect, useState } from 'react';
import CartContext from './CartContext';

// A guest-friendly cart backed by localStorage (key: "cart"). There's no
// backend order/cart model yet, so this lives entirely in the browser -
// good enough for browsing/adjusting a cart, not for a real checkout.
const getStoredCart = () => {
  try {
    const raw = localStorage.getItem('cart');
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    return [];
  }
};

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(getStoredCart);

  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(items));
    } catch (err) {
      // ignore storage errors
    }
  }, [items]);

  const addToCart = (shoe, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item._id === shoe._id);
      if (existing) {
        return prev.map((item) =>
          item._id === shoe._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          _id: shoe._id,
          name: shoe.name,
          brand: shoe.brand,
          price: Number(shoe.price) || 0,
          imageUrl: shoe.imageUrl,
          quantity,
        },
      ];
    });
  };

  const removeFromCart = (shoeId) => {
    setItems((prev) => prev.filter((item) => item._id !== shoeId));
  };

  const updateQuantity = (shoeId, quantity) => {
    if (quantity < 1) {
      removeFromCart(shoeId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item._id === shoeId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => setItems([]);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        itemCount,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
