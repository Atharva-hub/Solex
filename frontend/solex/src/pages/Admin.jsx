import React, { useState } from 'react';

const Admin = () => {
  // 1. State for form inputs
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null); // This will hold the file object
  
  // State for feedback messages
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // 2. Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    // Verify the user is logged in and gets their token
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo || !userInfo.token) {
      setError('You must be logged in as an admin to do this.');
      return;
    }

    // 3. Create FormData object (Required for Multer image uploads)
    const formData = new FormData();
    formData.append('name', name);
    formData.append('brand', brand);
    formData.append('price', price);
    formData.append('description', description);
    formData.append('image', image); // Append the actual file

    try {
      // 4. Send the POST request to the protected backend route
      const response = await fetch('/api/shoes', {
        method: 'POST',
        headers: {
          // Attach the VIP wristband. 
          // IMPORTANT: Do NOT set 'Content-Type' here. The browser sets it automatically for FormData!
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Shoe created successfully!');
        // Clear the form fields after success
        setName('');
        setBrand('');
        setPrice('');
        setDescription('');
        setImage(null);
        document.getElementById('image').value = ''; // Clears the file input UI
      } else {
        setError(data.message || 'Failed to create shoe');
      }
    } catch (err) {
      setError('Server error. Could not create shoe.');
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="card shadow border-0">
            <div className="card-body p-4">
              <h2 className="fw-bold mb-1">Create Shoe</h2>
              <p className="text-muted mb-4">Add a new shoe to your store</p>

              {/* Feedback Messages */}
              {message && <div className="alert alert-success">{message}</div>}
              {error && <div className="alert alert-danger">{error}</div>}

              {/* Connect form to handleSubmit */}
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
                      onChange={(e) => setImage(e.target.files[0])} // e.target.files is an array, we grab the first file
                      required
                    />
                  </div>

                  <div className="col-12 mt-4">
                    <button type="submit" className="btn btn-primary w-100">
                      Create Shoe
                    </button>
                  </div>
                </div>
              </form>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;