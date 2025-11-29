import React from 'react';
import { useApp } from '../context/useApp';
import fallbackImg from '../assets/Vase.avif';

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, addToCart } = useApp();

  const handleAddToCart = (item) => {
    addToCart(item, 1);
    removeFromWishlist(item.id);
  };

  return (
    <div className="page-content">
      <h2 className="page-title">
        ❤️ My Wishlist
      </h2>
      
      {wishlist.length === 0 ? (
        <div className="empty-state">
          <p className="empty-state-icon">💔</p>
          <h3 className="empty-state-title">Your wishlist is empty</h3>
          <p className="empty-state-text">
            Start adding items you love to your wishlist!
          </p>
        </div>
      ) : (
        <>
          <p className="page-subtitle">
            You have {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} in your wishlist
          </p>
          
          <div className="product-grid">
            {wishlist.map(item => {
              const available = typeof item.stock === 'number' ? item.stock : Infinity;
              const isOut = (typeof item.stock === 'number' && item.stock <= 0);
              
              return (
                <div key={item.id} className="product-card">
                  {isOut && (
                    <div className="out-of-stock-badge">Out of Stock</div>
                  )}
                  
                  <button
                    onClick={() => removeFromWishlist(item.id)}
                    className="remove-wishlist-btn"
                    title="Remove from wishlist"
                  >
                    ❌
                  </button>

                  <img 
                    src={item.image} 
                    alt={item.name}
                    onError={(e) => { console.warn('Wishlist image failed to load for', item.id, item.name); e.currentTarget.onerror = null; e.currentTarget.src = fallbackImg; }}
                    className="product-card-image"
                  />
                  
                  <div className="product-card-content">
                    <h3 className="product-card-title">
                      {item.name}
                    </h3>
                    
                    <p className="product-card-price">
                      ₹{item.price}
                    </p>
                    
                    <p className="product-card-stock">
                      In stock: {available === Infinity ? 'Unlimited' : available}
                    </p>
                    
                    <div className="product-card-actions">
                      <button
                        disabled={isOut}
                        onClick={() => handleAddToCart(item)}
                      >
                        {isOut ? 'Unavailable' : '🛒 Add to Cart'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
