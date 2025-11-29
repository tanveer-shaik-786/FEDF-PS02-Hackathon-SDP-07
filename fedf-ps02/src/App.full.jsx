import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import { AppProvider } from './context/AppContext';
import { useApp } from './context/useApp';
import HomePage from './pages/HomePage';
import CartPage from './pages/CartPage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ErrorBoundary from './components/ErrorBoundary';

function NavBar() {
  const { cart, user, logout } = useApp();
  return (
    <nav>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Link to="/">Home</Link>
        <Link to="/cart">Cart ({cart.length})</Link>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
      </div>
      <div style={{ marginLeft: 'auto' }}>
        {user ? (
          <>
            <span style={{ color: '#fff' }}>{user.email}</span>
            <button onClick={logout} style={{ marginLeft: 10 }}>Logout</button>
          </>
        ) : null}
      </div>
    </nav>
  );
}

function AppContent() {
  return (
    <ErrorBoundary>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default function AppFull() {
  return (
    <AppProvider>
      <div id="root">
        <AppContent />
      </div>
    </AppProvider>
  );
}
