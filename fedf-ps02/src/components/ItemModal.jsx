import React from 'react';
import fallbackImg from '../assets/Vase.avif';

export default function ItemModal({ item, onClose, onAdd }) {
  const [qty, setQty] = React.useState(1);
  if (!item) return null;
  const imgSrc = item.image || '/missing.png';
  const available = typeof item.stock === 'number' ? item.stock : Infinity;
  const isOut = (typeof item.stock === 'number' && item.stock <= 0);
  return (
    <div className="item-modal-overlay" onClick={onClose}>
      <div className="item-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <div className="modal-body">
          <div className="modal-image">
            <img src={imgSrc} alt={item.name} onError={(e) => { console.warn('Modal image failed to load for', item.id, item.name); e.currentTarget.onerror = null; e.currentTarget.src = fallbackImg; }} />
          </div>
          <div className="modal-info">
            <h2>{item.name}</h2>
            <p className="modal-price">₹{item.price}</p>
            <p className="modal-desc">{item.description || 'No description available.'}</p>
            <div style={{ marginTop: 16 }}>
              {isOut ? (
                <div style={{ color: 'crimson', fontWeight: 700 }}>Out of stock</div>
              ) : (
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input className="qty-input" type="number" min={1} max={available === Infinity ? 99 : available} value={qty} onChange={e => setQty(Math.max(1, Math.min(available === Infinity ? 99 : available, Number(e.target.value) || 1)))} style={{ width: 80 }} />
                  <button onClick={() => onAdd && onAdd(item, qty)} className="modal-add">Add to Cart</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
