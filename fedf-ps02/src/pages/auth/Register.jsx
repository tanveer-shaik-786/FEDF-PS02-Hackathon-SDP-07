import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/useApp';
import { usersAPI } from '../../services/api';

export default function Register() {
  const [role, setRole] = useState('user');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useApp();
  const nav = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setError('');
    
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    
    if (password.length < 6) {
      setError('Password should be at least 6 characters');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      // Register user in database
      const userData = await usersAPI.register(email, password, role, firstName, lastName);
      
      // Log the user in with returned data
      login({ 
        ...userData, 
        name: `${firstName} ${lastName}`,
        firstName,
        lastName
      });
      
      // Redirect to dashboard
      nav('/dashboard');
    } catch (error) {
      console.error('Registration failed:', error);
      setError(error.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Register</h2>
        <form onSubmit={submit} className="auth-form">
          <div className="auth-form-group">
            <label htmlFor="role">Select Your Role</label>
            <select id="role" value={role} onChange={e => setRole(e.target.value)}>
              <option value="user">Customer / User</option>
              <option value="artist">Artist / Dealer</option>
              <option value="admin">Admin (manage platform)</option>
              <option value="consultant">Cultural Consultant</option>
            </select>
            <small className="text-muted text-sm">Choose the role that best describes you</small>
          </div>

          <div className="auth-form-row">
            <div className="auth-form-group">
              <label htmlFor="firstName">First Name</label>
              <input 
                id="firstName"
                type="text" 
                placeholder="Enter your first name" 
                value={firstName} 
                onChange={e => setFirstName(e.target.value)}
                required
              />
            </div>
            
            <div className="auth-form-group">
              <label htmlFor="lastName">Last Name</label>
              <input 
                id="lastName"
                type="text" 
                placeholder="Enter your last name" 
                value={lastName} 
                onChange={e => setLastName(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="auth-form-group">
            <label htmlFor="email">Email</label>
            <input 
              id="email"
              type="email" 
              placeholder="Enter your email" 
              value={email} 
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="auth-form-group">
            <label htmlFor="password">Password</label>
            <input 
              id="password"
              type="password" 
              placeholder="Create a password (min 6 characters)" 
              value={password} 
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          
          <div className="auth-form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input 
              id="confirmPassword"
              type="password" 
              placeholder="Re-enter your password" 
              value={confirmPassword} 
              onChange={e => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          
          {error && <div className="auth-error auth-error-box">{error}</div>}
          
          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
          
          <p className="auth-link-text">
            Already have an account? <a href="/login">Login here</a>
          </p>
        </form>
      </div>
    </div>
  );
}