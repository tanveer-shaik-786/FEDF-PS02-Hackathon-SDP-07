import React, { useState, useMemo } from 'react';
import { useApp } from '../context/useApp';

export default function OrdersPage() {
  const { orders } = useApp();
  const [tab, setTab] = useState('my'); // 'my' or 'history'

  const recentThresholdDays = 30;
  const recentOrders = useMemo(() => {
    if (!orders || !Array.isArray(orders)) return [];
    const now = Date.now();
    return orders.filter(o => {
      const d = new Date(o.date).getTime();
      return now - d <= recentThresholdDays * 24 * 60 * 60 * 1000;
    });
  }, [orders]);

  function renderList(list) {
    if (!list || !Array.isArray(list) || list.length === 0) {
      return (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted)' }}>
          <p style={{ fontSize: '1.2rem' }}>No orders found.</p>
          <p>Start shopping to see your orders here!</p>
        </div>
      );
    }

    return (
      <div className="orders-list">
        {list.map((order, index) => (
          <div key={order.id || index} className="order-card">
            <h3>Order #{order.id}</h3>
            <p><strong>Date:</strong> {new Date(order.date).toLocaleString()}</p>
            <p><strong>Payment Method:</strong> {order.paymentMethod?.toUpperCase() || 'N/A'}</p>
            <p><strong>Total:</strong> ₹{order.total?.toFixed(2) || '0.00'}</p>
            {order.items && Array.isArray(order.items) && order.items.length > 0 && (
              <ul className="order-items">
                {order.items.map((item, idx) => (
                  <li key={item.id || idx}>
                    {item.name} x {item.qty} (₹{item.price})
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="page-content">
      <h2>My Orders</h2>

      <div className="orders-tabs">
        <button className={tab === 'my' ? 'active' : ''} onClick={() => setTab('my')}>All Orders</button>
        <button className={tab === 'history' ? 'active' : ''} onClick={() => setTab('history')}>Recent (last {recentThresholdDays} days)</button>
      </div>

      <div className="orders-panel">
        {tab === 'my' ? renderList(orders) : renderList(recentOrders)}
      </div>
    </div>
  );
}