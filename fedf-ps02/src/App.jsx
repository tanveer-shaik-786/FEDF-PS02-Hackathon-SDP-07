import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import './App.css';
import { AppProvider } from './context/AppContext';
import { useApp } from './context/useApp';
import HomePage from './pages/HomePage';
import CartPage from './pages/CartPage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ErrorBoundary from './components/ErrorBoundary';
import ArtistPage from './pages/ArtistPage';
import OrdersPage from './pages/OrdersPage';
import AdminPage from './pages/AdminPage';
import ConsultantPage from './pages/ConsultantPage';
import CheckoutPage from './pages/CheckOutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import ProfilePage from './pages/ProfilePage';
import FeedbackPage from './pages/FeedbackPage';
import WishlistPage from './pages/WishlistPage';
import DashboardPage from './pages/DashboardPage';
import Footer from './components/Footer';

function VerticalNavBar() {
  const { user, logout, theme, setTheme } = useApp();
  
  return (
    <nav className="vertical-nav">
      {/* Logo/Brand */}
      <div className="nav-brand">
        <h2>Craft Store App</h2>
        <p>HandiCrafted Excellence</p>
      </div>

      <div className="nav-links-container">
        {user ? (
          <>
            <Link to="/dashboard" className="nav-link">
              <span className="nav-link-icon">🏠</span>
              <span>Dashboard</span>
            </Link>
            <Link to="/" className="nav-link">
              <span className="nav-link-icon">🏪</span>
              <span>Shop</span>
            </Link>
            {user.role !== 'artist' && (
              <Link to="/orders" className="nav-link">
                <span className="nav-link-icon">📦</span>
                <span>My Orders</span>
              </Link>
            )}
            <Link to="/profile" className="nav-link">
              <span className="nav-link-icon">👤</span>
              <span>Profile</span>
            </Link>
            <Link to="/feedback" className="nav-link">
              <span className="nav-link-icon">💬</span>
              <span>Feedback</span>
            </Link>
            
            {user.role === 'artist' && (
              <Link to="/artist" className="nav-link">
                <span className="nav-link-icon">🎨</span>
                <span>Artist Dashboard</span>
              </Link>
            )}
            {user.role === 'admin' && (
              <Link to="/admin" className="nav-link">
                <span className="nav-link-icon">⚙️</span>
                <span>Admin Panel</span>
              </Link>
            )}
            {user.role === 'consultant' && (
              <Link to="/consultant" className="nav-link">
                <span className="nav-link-icon">💼</span>
                <span>Consultant</span>
              </Link>
            )}
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">
              <span className="nav-link-icon">🔐</span>
              <span>Login</span>
            </Link>
            <Link to="/register" className="nav-link">
              <span className="nav-link-icon">📝</span>
              <span>Register</span>
            </Link>
          </>
        )}
      </div>

      {/* Settings Section */}
      <div className="nav-settings">
        <div className="nav-settings-theme">
          <label>Theme</label>
          <select value={theme} onChange={e => setTheme(e.target.value)}>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="warm">Warm</option>
          </select>
        </div>

        {/* User Info & Logout */}
        {user && (
          <div className="nav-user-info">
            <div className="nav-user-card">
              <div className="nav-user-email">{user.email}</div>
              <div className="nav-user-role">
                Role: {user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}
              </div>
            </div>
            <button onClick={logout} className="nav-logout-btn">
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

function ProtectedRoute({ children }) {
  const { user } = useApp();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function ArtistRoute({ children }) {
  const { user } = useApp();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'artist') return <Navigate to="/" replace />;
  return children;
}

function AdminRoute({ children }) {
  const { user } = useApp();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
}

function ConsultantRoute({ children }) {
  const { user } = useApp();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'consultant') return <Navigate to="/" replace />;
  return children;
}

function MainContent() {
  const location = useLocation();
  const { cart, wishlist, user } = useApp();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="main-content">
      {/* Top Bar with Cart and Wishlist */}
      {!isAuthPage && user && (
        <div className="top-bar">
          <Link to="/cart" className="top-bar-link">
            <span className="top-bar-icon">🛒</span>
            <span>Cart</span>
            {cart.length > 0 && (
              <span className="top-bar-badge">
                {cart.length}
              </span>
            )}
          </Link>

          <Link to="/wishlist" className="top-bar-link wishlist-link">
            <span className="top-bar-icon">❤️</span>
            <span>Wishlist</span>
            {wishlist.length > 0 && (
              <span className="top-bar-badge wishlist-badge">
                {wishlist.length}
              </span>
            )}
          </Link>
        </div>
      )}

      <div className={`main-content-inner ${!isAuthPage && user ? 'with-top-bar' : ''}`}>
        <div className="content-wrapper">
          <Routes>
            {/* Allow public access to home so sampleCraft fallback shows even before login */}
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
            <Route path="/wishlist" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />
            <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
            <Route path="/order-success" element={<ProtectedRoute><OrderSuccessPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/feedback" element={<ProtectedRoute><FeedbackPage /></ProtectedRoute>} />
            <Route path="/artist" element={<ArtistRoute><ArtistPage /></ArtistRoute>} />
            <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
            <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
            <Route path="/consultant" element={<ConsultantRoute><ConsultantPage /></ConsultantRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>
      </div>
      {!isAuthPage && <Footer />}
    </div>
  );
}

function AppContent() {
  return (
    <ErrorBoundary>
      <Router>
        <div className="app-layout">
          <div className="app-layout-main">
            <VerticalNavBar />
            <MainContent />
          </div>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default function App() {
  return (
    <AppProvider>
      <div id="root">
        <AppContent />
      </div>
    </AppProvider>
  );
}