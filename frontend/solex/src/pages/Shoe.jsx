import React, { useState, useEffect } from 'react';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';

const ShoeCard = ({ shoe }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [justAdded, setJustAdded] = useState(false);

  const inWishlist = isInWishlist(shoe._id);

  const handleAddToCart = () => {
    addToCart(shoe);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <div className="card h-100 shadow-sm border-0 position-relative">
      <button
        type="button"
        className="btn btn-sm position-absolute top-0 end-0 m-2 rounded-circle d-flex align-items-center justify-content-center"
        style={{
          zIndex: 1,
          width: '36px',
          height: '36px',
          backgroundColor: 'rgba(255,255,255,0.9)',
          color: inWishlist ? '#dc3545' : '#6c757d',
        }}
        onClick={() => toggleWishlist(shoe)}
        title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        {inWishlist ? '♥' : '♡'}
      </button>

      <img
        src={shoe.imageUrl || 'https://via.placeholder.com/400x300'}
        className="card-img-top"
        alt={shoe.name}
        style={{ height: '260px', objectFit: 'cover' }}
      />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{shoe.name}</h5>
        <p className="text-muted mb-2">{shoe.brand}</p>
        <p className="card-text">{shoe.description}</p>
        <div className="mt-auto d-flex justify-content-between align-items-center">
          <span className="fw-bold">₹{Number(shoe.price || 0).toFixed(2)}</span>
          <button className="btn btn-dark btn-sm" onClick={handleAddToCart}>
            {justAdded ? 'Added ✓' : 'Add to cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

const Shoe = () => {
  const [shoes, setShoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchShoes = async () => {
      try {
        const response = await fetch('/api/shoes');
        const data = await response.json();

        if (response.ok) {
          setShoes(Array.isArray(data.shoes) ? data.shoes : []);
        } else {
          setError(data.message || 'Failed to fetch shoes.');
        }
      } catch (err) {
        setError('Failed to fetch shoes from the server.');
      } finally {
        setLoading(false);
      }
    };

    fetchShoes();
  }, []);

  if (loading) return <div className="text-center mt-5"><h2>Loading shoes...</h2></div>;
  if (error) return <div className="alert alert-danger text-center mt-5">{error}</div>;

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4 text-center">Latest Arrivals</h2>

      <div className="row g-4">
        {shoes.length === 0 ? (
          <h4 className="text-center w-100 text-muted">No shoes available in the store.</h4>
        ) : (
          shoes.map((shoe) => (
            <div className="col-12 col-md-6 col-lg-4" key={shoe._id || shoe.name}>
              <ShoeCard shoe={shoe} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Shoe;
