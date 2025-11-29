import React, { useState, useMemo } from 'react';
import { useApp } from '../context/useApp';

export default function AdminPage() {
  const { orders, items, updateItemStock, suggestions, updateSuggestion, updateItem } = useApp();
  const [tab, setTab] = useState('content');
  const [localFeatured, setLocalFeatured] = useState(() => (items || []).reduce((acc, i) => ({ ...acc, [i.id]: false }), {}));

  const salesReport = useMemo(() => {
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((s, o) => s + (o.total || 0), 0);
    return { totalOrders, totalRevenue };
  }, [orders]);

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <p>Manage platform content, monitor transactions, and resolve issues reported by consultants or users.</p>
      <div className="admin-tabs">
        <button className={tab === 'content' ? 'active' : ''} onClick={() => setTab('content')}>Content</button>
        <button className={tab === 'transactions' ? 'active' : ''} onClick={() => setTab('transactions')}>Transactions</button>
        <button className={tab === 'reports' ? 'active' : ''} onClick={() => setTab('reports')}>Reports</button>
      </div>

      {tab === 'content' && (
        <div>
          <h3>Content Management</h3>
          <div className="admin-content-grid">
            {(items || []).map(it => (
              <div key={it.id} className="craft-card admin-item-card">
                <img src={it.image} alt={it.name} className="admin-item-image" />
                <h4>{it.name} {it.approved ? null : <span className="admin-item-status">(Pending)</span>}</h4>
                <div>₹{it.price}</div>
                <div className="text-muted mt-1">In stock: {typeof it.stock === 'number' ? it.stock : 'Unlimited'}</div>
                <div className="mt-2">
                  <button onClick={() => setLocalFeatured(prev => ({ ...prev, [it.id]: !prev[it.id] }))}>{localFeatured[it.id] ? 'Unfeature' : 'Feature'}</button>
                </div>
                <div className="mt-2">
                  <label className="admin-stock-label">Adjust stock</label>
                  <input type="number" value={typeof it.stock === 'number' ? it.stock : ''} onChange={e => updateItemStock(it.id, Number(e.target.value))} className="admin-stock-input" />
                </div>
                <div className="mt-2">
                  {!it.approved ? <button onClick={() => updateItem(it.id, { approved: true })}>Approve</button> : <span className="text-success">Approved</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="admin-suggestions">
        <h3>Consultant Suggestions</h3>
        <p>Consultants can submit cultural or accuracy suggestions; admins can review and mark them resolved.</p>
        {(suggestions && suggestions.length > 0) ? (
          <div className="admin-suggestion-grid">
            {suggestions.map(s => (
              <div key={s.id} className="admin-suggestion-card">
                <div className="admin-suggestion-meta">{new Date(s.date).toLocaleString()} — {s.author}</div>
                <div><strong>Item:</strong> {items.find(i => i.id === s.itemId)?.name || s.itemId}</div>
                <div className="mt-1">{s.note}</div>
                <div className="mt-2">
                  <button onClick={() => updateSuggestion(s.id, { resolved: true })}>Mark Resolved</button>
                  {s.resolved ? <span className="admin-suggestion-resolved">Resolved</span> : null}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No suggestions yet.</p>
        )}
      </div>

      {tab === 'transactions' && (
        <div>
          <h3>Transactions</h3>
          {orders.length === 0 ? <p>No transactions yet.</p> : (
            <div className="orders-list">
              {orders.map(o => (
                <div key={o.id} className="order-card">
                  <h4>Order #{o.id}</h4>
                  <div>Date: {new Date(o.date).toLocaleString()}</div>
                  <div>Total: ₹{o.total}</div>
                  <div>Items: {o.items.map(it => it.name).join(', ')}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'reports' && (
        <div>
          <h3>Reports</h3>
          <p>Simple sales summary:</p>
          <ul>
            <li><strong>Total orders:</strong> {salesReport.totalOrders}</li>
            <li><strong>Total revenue:</strong> ₹{salesReport.totalRevenue}</li>
          </ul>
        </div>
      )}
    </div>
  );
}