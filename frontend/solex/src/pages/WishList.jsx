import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../hooks/useWishlist';
import { useCart } from '../hooks/useCart';

const Wishlist = () => {
  const { items, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="container py-5 text-center">
        <h2 className="fw-bold mb-3">Your wishlist is empty</h2>
        <p className="text-muted mb-4">Tap the heart on any shoe to save it here.</p>
        <Link to="/shoes" className="btn btn-primary">Browse Shoes</Link>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h1 className="fw-bold mb-4">Your Wishlist</h1>

      <div className="row g-4">
        {items.map((shoe) => (
          <div className="col-12 col-md-6 col-lg-4" key={shoe._id}>
            <div className="card h-100 shadow-sm border-0">
              <img
                src={shoe.imageUrl}
                alt={shoe.name}
                className="card-img-top"
                style={{ height: '220px', objectFit: 'cover' }}
              />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{shoe.name}</h5>
                <p className="text-muted mb-2">{shoe.brand}</p>
                <div className="mt-auto d-flex justify-content-between align-items-center gap-2">
                  <span className="fw-bold">₹{Number(shoe.price || 0).toFixed(2)}</span>
                  <div className="d-flex gap-2">
                    <button className="btn btn-dark btn-sm" onClick={() => addToCart(shoe)}>
                      Add to cart
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => removeFromWishlist(shoe._id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
