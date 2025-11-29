import React, { useState } from 'react';
import { useApp } from '../context/useApp';
import ItemModal from '../components/ItemModal';
import fallbackImg from '../assets/Vase.avif';

export default function HomePage() {
  const { addToCart, addToWishlist, removeFromWishlist, wishlist, items } = useApp();
  const [active, setActive] = useState(null);
  const [qtyMap, setQtyMap] = useState({});

  function open(item) { setActive(item); }
  function close() { setActive(null); }

  const isInWishlist = (itemId) => {
    return wishlist.some(item => item.id === itemId);
  };

  const toggleWishlist = (item) => {
    if (isInWishlist(item.id)) {
      removeFromWishlist(item.id);
    } else {
      addToWishlist(item);
    }
  };

  return (
    <div className="page-content">
      <h2>Craft Items</h2>
      <div className="craft-list">
        {(items || []).map(item => {
          const available = typeof item.stock === 'number' ? item.stock : Infinity;
          const qty = qtyMap[item.id] || 1;
          const isOut = (typeof item.stock === 'number' && item.stock <= 0);
          const inWishlist = isInWishlist(item.id);
          
          return (
          <div className="craft-card home-card-clickable" key={item.id}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleWishlist(item);
              }}
              className={`wishlist-toggle-btn ${inWishlist ? 'active' : ''}`}
              title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              {inWishlist ? '❤️' : '🤍'}
            </button>
            
            {/* 1. Image Wrapper: Only this part zooms/crops */}
            <div className="product-img-wrap" onClick={() => open(item)}>
              <img 
                src={item.image} 
                alt={item.name} 
                onError={(e) => { 
                  console.warn('Image failed to load', item.name); 
                  e.currentTarget.onerror = null; 
                  e.currentTarget.src = fallbackImg; 
                }} 
              />
              {isOut ? <div className="out-of-stock-badge">Out of stock</div> : null}
            </div>

            {/* 2. Text Info: This is now OUTSIDE the image wrapper so it shows up */}
            <div className="product-info-wrap" onClick={() => open(item)} style={{ cursor: 'pointer' }}>
              <h3>{item.name}</h3>
              <p>₹{item.price}</p>
              <div className="home-stock-info">
                {available === Infinity ? 'In stock' : `${available} left`}
              </div>
            </div>
            
            <div className="home-qty-controls">
              <div className="qty-stepper" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  className="step-btn"
                  disabled={isOut || qty <= 1}
                  onClick={() => setQtyMap(prev => ({ ...prev, [item.id]: Math.max(1, qty - 1) }))}
                >−</button>
                <input
                  className="qty-input"
                  disabled={isOut}
                  type="number"
                  min={1}
                  max={available === Infinity ? 99 : available}
                  value={qty}
                  onChange={e => setQtyMap(prev => ({ ...prev, [item.id]: Math.max(1, Math.min(available === Infinity ? 99 : available, Number(e.target.value) || 1)) }))}
                />
                <button
                  type="button"
                  className="step-btn"
                  disabled={isOut || qty >= (available === Infinity ? 99 : available)}
                  onClick={() => setQtyMap(prev => ({ ...prev, [item.id]: Math.min((available === Infinity ? 99 : available), qty + 1) }))}
                >+</button>
              </div>
              <button
                disabled={isOut}
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(item, qty);
                  alert(`${item.name} added to cart (x${qty})`);
                }}
              >{isOut ? 'Unavailable' : 'Add to Cart'}</button>
            </div>
          </div>
        )})}
      </div>
      <ItemModal item={active} onClose={close} onAdd={(it) => { addToCart(it); close(); }} />
    </div>
  );
}