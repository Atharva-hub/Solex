import React, { useState } from 'react';

// Create Shoe form. Kept separate from the list/edit/delete logic in
// ShoeManager so each piece stays easy to follow.
const ShoeForm = ({ onCreated }) => {
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo || !userInfo.token) {
      setError('You must be logged in as an admin to do this.');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('brand', brand);
    formData.append('price', price);
    formData.append('description', description);
    formData.append('image', image);

    try {
      setSaving(true);
      const response = await fetch('/api/shoes', {
        method: 'POST',
        headers: {
          // Do NOT set 'Content-Type' here. The browser sets it automatically for FormData!
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Shoe created successfully!');
        setName('');
        setBrand('');
        setPrice('');
        setDescription('');
        setImage(null);
        const fileInput = document.getElementById('image');
        if (fileInput) fileInput.value = '';

        if (onCreated) onCreated(data);
      } else {
        setError(data.message || 'Failed to create shoe');
      }
    } catch (err) {
      setError('Server error. Could not create shoe.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-md-8 col-lg-6">
        <div className="card shadow border-0">
          <div className="card-body p-4">
            <h2 className="fw-bold mb-1">Create Shoe</h2>
            <p className="text-muted mb-4">Add a new shoe to your store</p>

            {message && <div className="alert alert-success">{message}</div>}
            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-12">
                  <label htmlFor="name" className="form-label fw-semibold">Shoe Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    placeholder="e.g. Puma Samba"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label htmlFor="brand" className="form-label fw-semibold">Brand</label>
                  <input
                    type="text"
                    className="form-control"
                    id="brand"
                    placeholder="e.g. Puma"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label htmlFor="price" className="form-label fw-semibold">Price</label>
                  <div className="input-group">
                    <span className="input-group-text">₹</span>
                    <input
                      type="number"
                      className="form-control"
                      id="price"
                      placeholder="5000"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="col-12">
                  <label htmlFor="description" className="form-label fw-semibold">Description</label>
                  <textarea
                    className="form-control"
                    id="description"
                    rows="4"
                    placeholder="Walking Shoes"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  ></textarea>
                </div>

                <div className="col-12">
                  <label htmlFor="image" className="form-label fw-semibold">Shoe Image</label>
                  <input
                    type="file"
                    className="form-control"
                    id="image"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                    required
                  />
                </div>

                <div className="col-12 mt-4">
                  <button type="submit" className="btn btn-primary w-100" disabled={saving}>
                    {saving ? 'Creating...' : 'Create Shoe'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoeForm;
