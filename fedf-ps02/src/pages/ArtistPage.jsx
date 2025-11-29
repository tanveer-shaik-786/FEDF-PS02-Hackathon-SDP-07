import React, { useState, useMemo } from 'react';
import { useApp } from '../context/useApp';

export default function ArtistPage() {
  const { user, addItem, items, orders } = useApp();
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState(1);
  const [desc, setDesc] = useState(''); // Added description field
  const [imageData, setImageData] = useState('');

  // Calculate Stats for the logged-in artist
  const stats = useMemo(() => {
    const myItems = items.filter(i => i.artistId === user?.email) || []; // Assuming items track artistId, or just showing all for demo
    // For this demo, we'll pretend all items are the artist's if we can't filter, or filter if we can.
    // Let's use total items count for the demo since we don't strictly save artistId in the mock add.
    
    const totalSales = orders.reduce((sum, order) => sum + (order.total || 0), 0);
    const pendingOrders = orders.filter(o => !o.delivered).length; // Mock status check

    return [
      { label: 'Total Sales', value: `₹${totalSales.toFixed(0)}`, icon: '💰' },
      { label: 'Items Listed', value: myItems.length, icon: '🎨' }, // Show artist's items count
      { label: 'Pending Orders', value: pendingOrders, icon: '📦' },
      { label: 'Rating', value: '4.8', icon: '⭐' },
    ];
  }, [items, orders, user]);

  function handleFile(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImageData(reader.result);
    reader.readAsDataURL(file);
  }

  function submit(e) {
    e.preventDefault();
    const newItem = {
      id: 'a-' + Math.random().toString(36).slice(2, 9),
      name: name || 'Untitled',
      price: Number(price) || 0,
      image: imageData || '',
      description: desc || 'Handcrafted with love.',
      stock: Number(stock) || 0,
      artistId: user?.email, // Tag item with artist email
      isNew: true
    };
    addItem(newItem);
    alert('Item added successfully!');
    setName(''); setPrice(''); setStock(1); setDesc(''); setImageData('');
  }

  return (
    <div className="artist-dashboard-container">
      {/* 1. Artist Hero Section */}
      <div className="artist-hero">
        <div>
          <h1>Artist Studio</h1>
          <p>Welcome back, <strong>{user?.name || user?.firstName || 'Artist'}</strong>!</p>
        </div>
        <div className="artist-badge">Verified Creator ✓</div>
      </div>

      {/* 2. Stats Grid */}
      <div className="artist-stats-grid">
        {stats.map((stat, idx) => (
          <div key={idx} className="artist-stat-card">
            <div className="artist-stat-icon">{stat.icon}</div>
            <div className="artist-stat-info">
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Main Content: Add Item Form */}
      <div className="artist-content-wrapper">
        <div className="artist-form-card">
          <div className="card-header">
            <h3>✨ List New Artwork</h3>
            <p>Share your latest creation with the world</p>
          </div>
          
          <form onSubmit={submit} className="artist-form">
            <div className="form-row">
              <div className="form-group">
                <label>Item Name</label>
                <input 
                  placeholder="e.g. Abstract Oil Painting" 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  required
                />
              </div>
              <div className="form-group">
                <label>Price (₹)</label>
                <input 
                  type="number" 
                  placeholder="0.00" 
                  value={price} 
                  onChange={e => setPrice(e.target.value)} 
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Stock Quantity</label>
                <input 
                  type="number" 
                  min="1" 
                  value={stock} 
                  onChange={e => setStock(Number(e.target.value))} 
                />
              </div>
              <div className="form-group">
                <label>Upload Image</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFile} 
                  className="file-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea 
                placeholder="Tell the story behind this piece..." 
                value={desc} 
                onChange={e => setDesc(e.target.value)}
                rows={4}
              />
            </div>

            {imageData && (
              <div className="image-preview">
                <p>Preview:</p>
                <img src={imageData} alt="Preview" />
              </div>
            )}

            <button type="submit" className="artist-submit-btn">
              Publish Listing
            </button>
          </form>
        </div>

        {/* Optional: Right side info or tips */}
        <div className="artist-tips-card">
          <h3>💡 Seller Tips</h3>
          <ul>
            <li>Use high-quality photos in good lighting.</li>
            <li>Write detailed descriptions including materials used.</li>
            <li>Keep your stock updated to avoid cancellations.</li>
            <li>Respond to customer inquiries promptly.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}