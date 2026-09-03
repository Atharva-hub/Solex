import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';

const Cart = () => {
  const { items, removeFromCart, updateQuantity, clearCart, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="container py-5 text-center">
        <h2 className="fw-bold mb-3">Your cart is empty</h2>
        <p className="text-muted mb-4">Looks like you haven't added any shoes yet.</p>
        <Link to="/shoes" className="btn btn-primary">Shop Shoes</Link>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="fw-bold mb-0">Your Cart</h1>
        <button className="btn btn-outline-danger btn-sm" onClick={clearCart}>
          Clear Cart
        </button>
      </div>

      <div className="row g-4">
        <div className="col-12 col-lg-8">
          {items.map((item) => (
            <div className="card mb-3" key={item._id}>
              <div className="row g-0 align-items-center">
                <div className="col-3 col-md-2">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="img-fluid rounded-start"
                    style={{ height: '90px', width: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div className="col-9 col-md-4">
                  <div className="card-body py-2">
                    <h6 className="card-title mb-1">{item.name}</h6>
                    <p className="card-text text-muted small mb-0">{item.brand}</p>
                  </div>
                </div>
                <div className="col-7 col-md-3 mt-2 mt-md-0">
                  <div className="d-flex align-items-center gap-2 px-3">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span style={{ minWidth: '1.5rem', textAlign: 'center' }}>{item.quantity}</span>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="col-3 col-md-2 text-end px-3 mt-2 mt-md-0">
                  <span className="fw-semibold">₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
                <div className="col-2 col-md-1 text-end px-3 mt-2 mt-md-0">
                  <button
                    type="button"
                    className="btn btn-sm btn-link text-danger"
                    onClick={() => removeFromCart(item._id)}
                    aria-label={`Remove ${item.name} from cart`}
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="col-12 col-lg-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title fw-bold mb-3">Order Summary</h5>
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-3 text-muted small">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between fw-bold mb-3">
                <span>Total</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <button className="btn btn-primary w-100" >
                Checkout 
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
