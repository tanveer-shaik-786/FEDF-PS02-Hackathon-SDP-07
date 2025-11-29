import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/useApp';

export default function ProfilePage() {
  const { user, login, logout } = useApp();
  const nav = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    storeName: user?.storeName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    state: user?.state || '',
    zipCode: user?.zipCode || '',
    age: user?.age || '',
    role: user?.role || 'user'
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    login({ ...user, ...formData });
    setIsEditing(false);
    alert('Profile updated successfully!');
  }

  function handleCancel() {
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      storeName: user?.storeName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
      city: user?.city || '',
      state: user?.state || '',
      zipCode: user?.zipCode || '',
      age: user?.age || '',
      role: user?.role || 'user'
    });
    setIsEditing(false);
  }

  function handleDeleteAccount() {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      logout();
      alert('Your account has been deleted successfully.');
      nav('/login');
    }
  }

  return (
    <div className="page-content" style={{ maxWidth: '800px', margin: '2rem auto', padding: '2rem' }}>
      <div style={{ 
        background: 'var(--card-bg)', 
        borderRadius: '12px', 
        padding: '2rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 style={{ margin: 0 }}>My Profile</h2>
          {!isEditing ? (
            <button 
              onClick={() => setIsEditing(true)}
              style={{ 
                padding: '8px 16px', 
                borderRadius: '6px', 
                background: '#6366f1', 
                color: 'white', 
                border: 'none', 
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Edit Profile
            </button>
          ) : null}
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            {/* First Name */}
            <div>
              <label htmlFor="firstName" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                First Name
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="Enter first name"
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  borderRadius: '6px', 
                  border: '1px solid #ccc',
                  background: isEditing ? 'white' : '#f5f5f5',
                  cursor: isEditing ? 'text' : 'not-allowed'
                }}
              />
            </div>

            {/* Last Name */}
            <div>
              <label htmlFor="lastName" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Last Name
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="Enter last name"
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  borderRadius: '6px', 
                  border: '1px solid #ccc',
                  background: isEditing ? 'white' : '#f5f5f5',
                  cursor: isEditing ? 'text' : 'not-allowed'
                }}
              />
            </div>

            {/* Artists/Dealers */}
            {(formData.role === 'artist' || formData.role === 'admin') && (
              <div>
                <label htmlFor="storeName" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  Store Name
                </label>
                <input
                  id="storeName"
                  name="storeName"
                  type="text"
                  value={formData.storeName}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="Your store or business name"
                  style={{ 
                    width: '100%', 
                    padding: '10px', 
                    borderRadius: '6px', 
                    border: '1px solid #ccc',
                    background: isEditing ? 'white' : '#f5f5f5',
                    cursor: isEditing ? 'text' : 'not-allowed'
                  }}
                />
              </div>
            )}

            {/* Email */}
            <div>
              <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditing}
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  borderRadius: '6px', 
                  border: '1px solid #ccc',
                  background: isEditing ? 'white' : '#f5f5f5',
                  cursor: isEditing ? 'text' : 'not-allowed'
                }}
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="Your phone number"
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  borderRadius: '6px', 
                  border: '1px solid #ccc',
                  background: isEditing ? 'white' : '#f5f5f5',
                  cursor: isEditing ? 'text' : 'not-allowed'
                }}
              />
            </div>

            {/* Age */}
            <div>
              <label htmlFor="age" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Age
              </label>
              <input
                id="age"
                name="age"
                type="number"
                value={formData.age}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="Your age"
                min="1"
                max="120"
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  borderRadius: '6px', 
                  border: '1px solid #ccc',
                  background: isEditing ? 'white' : '#f5f5f5',
                  cursor: isEditing ? 'text' : 'not-allowed'
                }}
              />
            </div>

            {/* Role (Read-only) */}
            <div>
              <label htmlFor="role" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Role
              </label>
              <input
                id="role"
                name="role"
                type="text"
                value={formData.role.charAt(0).toUpperCase() + formData.role.slice(1)}
                disabled
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  borderRadius: '6px', 
                  border: '1px solid #ccc',
                  background: '#f5f5f5',
                  cursor: 'not-allowed',
                  color: '#666'
                }}
              />
            </div>
          </div>

          {/* Address Section */}
          <div style={{ marginTop: '1.5rem' }}>
            <h3>📍 Address</h3>
            
            {/* Street Address */}
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="address" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Street Address
              </label>
              <input
                id="address"
                name="address"
                type="text"
                value={formData.address}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="Street, building, apartment"
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  borderRadius: '6px', 
                  border: '1px solid #ccc',
                  background: isEditing ? 'white' : '#f5f5f5',
                  cursor: isEditing ? 'text' : 'not-allowed'
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem' }}>
              {/* City */}
              <div>
                <label htmlFor="city" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  City
                </label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  value={formData.city}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="City"
                  style={{ 
                    width: '100%', 
                    padding: '10px', 
                    borderRadius: '6px', 
                    border: '1px solid #ccc',
                    background: isEditing ? 'white' : '#f5f5f5',
                    cursor: isEditing ? 'text' : 'not-allowed'
                  }}
                />
              </div>

              {/* State */}
              <div>
                <label htmlFor="state" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  State
                </label>
                <input
                  id="state"
                  name="state"
                  type="text"
                  value={formData.state}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="State"
                  style={{ 
                    width: '100%', 
                    padding: '10px', 
                    borderRadius: '6px', 
                    border: '1px solid #ccc',
                    background: isEditing ? 'white' : '#f5f5f5',
                    cursor: isEditing ? 'text' : 'not-allowed'
                  }}
                />
              </div>

              {/* Zip Code */}
              <div>
                <label htmlFor="zipCode" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  Zip Code
                </label>
                <input
                  id="zipCode"
                  name="zipCode"
                  type="text"
                  value={formData.zipCode}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="Zip"
                  style={{ 
                    width: '100%', 
                    padding: '10px', 
                    borderRadius: '6px', 
                    border: '1px solid #ccc',
                    background: isEditing ? 'white' : '#f5f5f5',
                    cursor: isEditing ? 'text' : 'not-allowed'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button 
                type="submit"
                style={{ 
                  flex: 1,
                  padding: '12px', 
                  borderRadius: '6px', 
                  background: '#10b981', 
                  color: 'white', 
                  border: 'none', 
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '1rem'
                }}
              >
                Save Changes
              </button>
              <button 
                type="button"
                onClick={handleCancel}
                style={{ 
                  flex: 1,
                  padding: '12px', 
                  borderRadius: '6px', 
                  background: '#64748b', 
                  color: 'white', 
                  border: 'none', 
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '1rem'
                }}
              >
                Cancel
              </button>
            </div>
          )}

          {/* Delete Account Section */}
          {!isEditing && (
            <div style={{ 
              marginTop: '3rem', 
              paddingTop: '2rem', 
              borderTop: '2px solid var(--border)' 
            }}>
              <h3 style={{ color: 'var(--danger)', marginBottom: '1rem' }}>Danger Zone</h3>
              <p style={{ color: 'var(--muted)', marginBottom: '1rem', fontSize: '0.9rem' }}>
                Once you delete your account, there is no going back. Please be certain.
              </p>
              <button 
                type="button"
                onClick={handleDeleteAccount}
                style={{ 
                  padding: '12px 24px', 
                  borderRadius: '6px', 
                  background: '#ef4444', 
                  color: 'white', 
                  border: 'none', 
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '1rem'
                }}
              >
                Delete Account
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
