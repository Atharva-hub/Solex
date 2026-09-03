import React, { useEffect, useState } from 'react';
import WishlistContext from './WishlistContext';

// Same idea as the cart: a guest-friendly wishlist backed by localStorage
// (key: "wishlist").
const getStoredWishlist = () => {
  try {
    const raw = localStorage.getItem('wishlist');
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    return [];
  }
};

export const WishlistProvider = ({ children }) => {
  const [items, setItems] = useState(getStoredWishlist);

  useEffect(() => {
    try {
      localStorage.setItem('wishlist', JSON.stringify(items));
    } catch (err) {
      // ignore storage errors
    }
  }, [items]);

  const isInWishlist = (shoeId) => items.some((item) => item._id === shoeId);

  const toggleWishlist = (shoe) => {
    setItems((prev) => {
      const exists = prev.some((item) => item._id === shoe._id);
      if (exists) {
        return prev.filter((item) => item._id !== shoe._id);
      }
      return [
        ...prev,
        {
          _id: shoe._id,
          name: shoe.name,
          brand: shoe.brand,
          price: Number(shoe.price) || 0,
          imageUrl: shoe.imageUrl,
        },
      ];
    });
  };

  const removeFromWishlist = (shoeId) => {
    setItems((prev) => prev.filter((item) => item._id !== shoeId));
  };

  return (
    <WishlistContext.Provider
      value={{ items, isInWishlist, toggleWishlist, removeFromWishlist, count: items.length }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export default WishlistProvider;
