import React from 'react';
import { useApp } from '../context/useApp';
import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
  const { user, items, cart, wishlist, orders } = useApp();
  const nav = useNavigate();

  const totalOrders = orders.length;
  const wishlistCount = wishlist.length;
  const newCollectionsCount = items.filter(item => item.isNew).length || 12;
  const cartTotal = cart.reduce((sum, c) => sum + (c.quantity || 1) * c.price, 0);

  const recentOrders = orders.slice(-3).reverse();

  // Get recommended items (first 4 available items)
  const recommendedItems = items.filter(item => item.stock > 0).slice(0, 4);

  // Role-specific stats
  const getRoleStats = () => {
    switch(user?.role) {
      case 'artist':
        return {
          title: 'Artist Dashboard',
          stats: [
            { label: 'Items Listed', value: items.filter(item => item.artistId === user.email).length || 8, icon: '🎨' },
            { label: 'Total Sales', value: orders.length * 2 || 24, icon: '💰' },
            { label: 'Pending Orders', value: orders.filter(o => o.status === 'pending').length || 3, icon: '📦' },
          ]
        };
      case 'admin':
        return {
          title: 'Admin Dashboard',
          stats: [
            { label: 'Total Users', value: 156, icon: '👥' },
            { label: 'Total Products', value: items.length, icon: '📦' },
            { label: 'Platform Orders', value: orders.length * 5 || 89, icon: '🛒' },
          ]
        };
      case 'consultant':
        return {
          title: 'Consultant Dashboard',
          stats: [
            { label: 'Pending Reviews', value: 7, icon: '📝' },
            { label: 'Verified Items', value: 34, icon: '✓' },
            { label: 'Consultations', value: 12, icon: '💬' },
          ]
        };
      default:
        return {
          title: 'Customer Dashboard',
          stats: [
            { label: 'Total Orders', value: totalOrders, icon: '🛍️' },
            { label: 'Wishlist Items', value: wishlistCount, icon: '❤️' },
            { label: 'New Collections', value: newCollectionsCount, icon: '✨' },
          ]
        };
    }
  };

  const { stats } = getRoleStats();

  return (
    <div className="dashboard-container">
      {/* Welcome Hero Section */}
      <div className="dashboard-hero">
        <div className="dashboard-welcome">
          <h1>Welcome back, {user?.name || `${user?.firstName} ${user?.lastName}` || 'User'}!</h1>
          <p className="dashboard-subtitle">Here's what's happening with your account today</p>
        </div>
        {user?.role === 'user' && cartTotal > 0 && (
          <div className="dashboard-cart-summary">
            <p className="cart-summary-label">Cart Total</p>
            <p className="cart-summary-amount">₹{cartTotal.toFixed(2)}</p>
            <button className="btn-checkout-quick" onClick={() => nav('/cart')}>
              View Cart
            </button>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="dashboard-stats">
        {stats.map((stat, idx) => (
          <div key={idx} className="stat-card">
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-content">
              <p className="stat-value">{stat.value}</p>
              <p className="stat-label">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="dashboard-section">
        <h2 className="section-title">Quick Actions</h2>
        <div className="quick-actions-grid">
          {user?.role === 'user' && (
            <>
              <button className="action-card" onClick={() => nav('/')}>
                <span className="action-icon">🛒</span>
                <span className="action-title">Shop Now</span>
                <span className="action-desc">Browse our collections</span>
              </button>
              <button className="action-card" onClick={() => nav('/orders')}>
                <span className="action-icon">📦</span>
                <span className="action-title">Track Orders</span>
                <span className="action-desc">Check order status</span>
              </button>
              <button className="action-card" onClick={() => nav('/wishlist')}>
                <span className="action-icon">❤️</span>
                <span className="action-title">View Wishlist</span>
                <span className="action-desc">{wishlistCount} items saved</span>
              </button>
              <button className="action-card" onClick={() => nav('/profile')}>
                <span className="action-icon">👤</span>
                <span className="action-title">My Profile</span>
                <span className="action-desc">Update account info</span>
              </button>
            </>
          )}
          {user?.role === 'artist' && (
            <>
              <button className="action-card" onClick={() => nav('/artist')}>
                <span className="action-icon">🎨</span>
                <span className="action-title">Manage Items</span>
                <span className="action-desc">Add or edit products</span>
              </button>
              <button className="action-card" onClick={() => nav('/orders')}>
                <span className="action-icon">📊</span>
                <span className="action-title">View Sales</span>
                <span className="action-desc">Track your earnings</span>
              </button>
              <button className="action-card" onClick={() => nav('/profile')}>
                <span className="action-icon">⚙️</span>
                <span className="action-title">Settings</span>
                <span className="action-desc">Manage your shop</span>
              </button>
              <button className="action-card" onClick={() => nav('/feedback')}>
                <span className="action-icon">💬</span>
                <span className="action-title">Feedback</span>
                <span className="action-desc">Customer reviews</span>
              </button>
            </>
          )}
          {user?.role === 'admin' && (
            <>
              <button className="action-card" onClick={() => nav('/admin')}>
                <span className="action-icon">🛠️</span>
                <span className="action-title">Manage Platform</span>
                <span className="action-desc">Admin controls</span>
              </button>
              <button className="action-card" onClick={() => nav('/')}>
                <span className="action-icon">📦</span>
                <span className="action-title">Products</span>
                <span className="action-desc">Manage inventory</span>
              </button>
              <button className="action-card" onClick={() => nav('/orders')}>
                <span className="action-icon">📈</span>
                <span className="action-title">Analytics</span>
                <span className="action-desc">View reports</span>
              </button>
              <button className="action-card" onClick={() => nav('/feedback')}>
                <span className="action-icon">📝</span>
                <span className="action-title">Feedback</span>
                <span className="action-desc">User reviews</span>
              </button>
            </>
          )}
          {user?.role === 'consultant' && (
            <>
              <button className="action-card" onClick={() => nav('/consultant')}>
                <span className="action-icon">📋</span>
                <span className="action-title">Review Queue</span>
                <span className="action-desc">Pending verifications</span>
              </button>
              <button className="action-card" onClick={() => nav('/')}>
                <span className="action-icon">🔍</span>
                <span className="action-title">Browse Items</span>
                <span className="action-desc">Verify authenticity</span>
              </button>
              <button className="action-card" onClick={() => nav('/feedback')}>
                <span className="action-icon">💡</span>
                <span className="action-title">Suggestions</span>
                <span className="action-desc">Provide insights</span>
              </button>
              <button className="action-card" onClick={() => nav('/profile')}>
                <span className="action-icon">👤</span>
                <span className="action-title">Profile</span>
                <span className="action-desc">Your credentials</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Recent Orders (for customers) */}
      {user?.role === 'user' && recentOrders.length > 0 && (
        <div className="dashboard-section">
          <h2 className="section-title">Recent Orders</h2>
          <div className="recent-orders">
            {recentOrders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <span className="order-id">Order #{order.id}</span>
                  <span className={`order-status status-${order.status}`}>
                    {order.status}
                  </span>
                </div>
                <div className="order-details">
                  <p className="order-date">{new Date(order.date).toLocaleDateString()}</p>
                  <p className="order-total">₹{order.total.toFixed(2)}</p>
                </div>
                <button className="btn-view-order" onClick={() => nav('/orders')}>
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommended Products (for customers) */}
      {user?.role === 'user' && recommendedItems.length > 0 && (
        <div className="dashboard-section">
          <h2 className="section-title">Recommended For You</h2>
          <div className="recommended-products">
            {recommendedItems.map((item) => (
              <div key={item.id} className="product-card-mini" onClick={() => nav('/')}>
                <div className="product-img-mini">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="product-info-mini">
                  <h3 className="product-name-mini">{item.name}</h3>
                  <p className="product-price-mini">₹{item.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
