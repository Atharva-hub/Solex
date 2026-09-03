import React, { useEffect, useState } from 'react';

// Lists every shoe in the store and lets an admin edit or delete it.
// The create form lives separately in ShoeForm.jsx.
const ShoeManager = () => {
  const [shoes, setShoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [editingShoe, setEditingShoe] = useState(null); // the shoe currently open in the edit modal
  const [editForm, setEditForm] = useState({ name: '', brand: '', price: '', description: '', inStock: true });
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState('');

  const [deletingId, setDeletingId] = useState(null);
  const [actionError, setActionError] = useState('');

  const getToken = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    return userInfo?.token;
  };

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

  useEffect(() => {
    let ignore = false;

    (async () => {
      try {
        const response = await fetch('/api/shoes');
        const data = await response.json();
        if (ignore) return;

        if (response.ok) {
          setShoes(Array.isArray(data.shoes) ? data.shoes : []);
        } else {
          setError(data.message || 'Failed to fetch shoes.');
        }
      } catch (err) {
        if (!ignore) setError('Failed to fetch shoes from the server.');
      } finally {
        if (!ignore) setLoading(false);
      }
    })();

    return () => {
      ignore = true;
    };
  }, []);

  const openEditModal = (shoe) => {
    setActionError('');
    setEditError('');
    setEditingShoe(shoe);
    setEditForm({
      name: shoe.name || '',
      brand: shoe.brand || '',
      price: shoe.price ?? '',
      description: shoe.description || '',
      inStock: shoe.inStock ?? true,
    });
  };

  const closeEditModal = () => {
    setEditingShoe(null);
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setEditError('');

    const token = getToken();
    if (!token) {
      setEditError('You must be logged in as an admin to do this.');
      return;
    }

    try {
      setSaving(true);
      const response = await fetch(`/api/shoes/${editingShoe._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editForm.name,
          brand: editForm.brand,
          price: Number(editForm.price),
          description: editForm.description,
          inStock: editForm.inStock,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const updated = data.updatedShoe || data;
        setShoes((prev) => prev.map((s) => (s._id === updated._id ? updated : s)));
        setEditingShoe(null);
      } else {
        setEditError(data.message || 'Failed to update shoe');
      }
    } catch (err) {
      setEditError('Server error. Could not update shoe.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (shoe) => {
    setActionError('');

    const token = getToken();
    if (!token) {
      setActionError('You must be logged in as an admin to do this.');
      return;
    }

    const confirmed = window.confirm(`Delete "${shoe.name}"? This cannot be undone.`);
    if (!confirmed) return;

    try {
      setDeletingId(shoe._id);
      const response = await fetch(`/api/shoes/${shoe._id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setShoes((prev) => prev.filter((s) => s._id !== shoe._id));
      } else {
        setActionError(data.message || 'Failed to delete shoe');
      }
    } catch (err) {
      setActionError('Server error. Could not delete shoe.');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <div className="text-center py-5">Loading shoes...</div>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="fw-bold mb-0">Manage Shoes</h2>
        <button className="btn btn-outline-secondary btn-sm" onClick={fetchShoes}>Refresh</button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {actionError && <div className="alert alert-danger">{actionError}</div>}

      {shoes.length === 0 ? (
        <p className="text-muted">No shoes in the store yet.</p>
      ) : (
        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Brand</th>
                <th>Price</th>
                <th>In Stock</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {shoes.map((shoe) => (
                <tr key={shoe._id}>
                  <td>
                    <img
                      src={shoe.imageUrl}
                      alt={shoe.name}
                      style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: '6px' }}
                    />
                  </td>
                  <td>{shoe.name}</td>
                  <td>{shoe.brand}</td>
                  <td>₹{Number(shoe.price || 0).toFixed(2)}</td>
                  <td>
                    <span className={`badge ${shoe.inStock ? 'text-bg-success' : 'text-bg-secondary'}`}>
                      {shoe.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="text-end">
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => openEditModal(shoe)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(shoe)}
                      disabled={deletingId === shoe._id}
                    >
                      {deletingId === shoe._id ? 'Deleting...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit modal - plain conditional rendering, no Bootstrap JS wiring needed */}
      {editingShoe && (
        <div
          className="modal d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={closeEditModal}
        >
          <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Shoe</h5>
                <button type="button" className="btn-close" onClick={closeEditModal}></button>
              </div>
              <form onSubmit={handleUpdate}>
                <div className="modal-body">
                  {editError && <div className="alert alert-danger">{editError}</div>}

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Shoe Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={editForm.name}
                      onChange={handleEditChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Brand</label>
                    <input
                      type="text"
                      className="form-control"
                      name="brand"
                      value={editForm.brand}
                      onChange={handleEditChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Price</label>
                    <div className="input-group">
                      <span className="input-group-text">₹</span>
                      <input
                        type="number"
                        className="form-control"
                        name="price"
                        value={editForm.price}
                        onChange={handleEditChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Description</label>
                    <textarea
                      className="form-control"
                      name="description"
                      rows="3"
                      value={editForm.description}
                      onChange={handleEditChange}
                      required
                    ></textarea>
                  </div>

                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="inStock"
                      name="inStock"
                      checked={editForm.inStock}
                      onChange={handleEditChange}
                    />
                    <label className="form-check-label" htmlFor="inStock">In Stock</label>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-outline-secondary" onClick={closeEditModal}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoeManager;
