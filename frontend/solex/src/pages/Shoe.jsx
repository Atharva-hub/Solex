import React, { useState, useEffect } from 'react';

const ShoeCard = ({ shoe }) => (
  <div className="card h-100 shadow-sm border-0">
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
        <button className="btn btn-dark btn-sm">Add to cart</button>
      </div>
    </div>
  </div>
);

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