import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function OrderSuccessPage() {
  const nav = useNavigate();
  const location = useLocation();
  const orderData = location.state?.order;
  
  // Calculate expected delivery date (7 days from now)
  const [deliveryDate, setDeliveryDate] = useState('');

  useEffect(() => {
    const today = new Date();
    const expectedDate = new Date(today.setDate(today.getDate() + 7));
    const formattedDate = expectedDate.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    setDeliveryDate(formattedDate);
  }, []);

  return (
    <div className="page-content" style={{ 
      maxWidth: '600px', 
      margin: '3rem auto', 
      padding: '2rem', 
      textAlign: 'center',
      background: 'var(--card-bg)',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    }}>
      {/* Success Icon/Image */}
      <div className="success-icon" style={{ fontSize: '5rem', marginBottom: '1rem', color: 'var(--success)' }}>
        ✓
      </div>
      
      {/* Congratulations Message */}
      <h1 style={{ color: 'var(--success)', marginBottom: '0.5rem' }}>
        Order Placed Successfully!
      </h1>
      
      <h2 style={{ color: 'var(--text)', fontWeight: 'normal', marginBottom: '2rem' }}>
        Thank You for Your Purchase!
      </h2>

      {/* Order Details */}
      {orderData && (
        <div style={{ 
          background: 'var(--bg)', 
          padding: '1.5rem', 
          borderRadius: '8px', 
          marginBottom: '2rem',
          textAlign: 'left'
        }}>
          <h3 style={{ marginTop: 0 }}>Order Details</h3>
          <p><strong>Order ID:</strong> #{orderData.id}</p>
          <p><strong>Date:</strong> {orderData.date ? new Date(orderData.date).toLocaleString() : '—'}</p>
          <p><strong>Total Amount:</strong> ₹{orderData.total?.toFixed(2)}</p>
          <p><strong>Payment Method:</strong> {orderData.paymentMethod?.toUpperCase()}</p>
          <p><strong>Customer:</strong> {orderData.customer?.name}</p>
        </div>
      )}

      {/* Expected Delivery */}
      <div style={{ 
        background: '#e8f5e9', 
        padding: '1.5rem', 
        borderRadius: '8px', 
        marginBottom: '2rem',
        border: '2px solid var(--success)'
      }}>
        <h3 style={{ color: '#2e7d32', marginTop: 0 }}>Expected Delivery</h3>
        <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#1b5e20', margin: 0 }}>
          {deliveryDate}
        </p>
        <p style={{ color: '#558b2f', fontSize: '0.9rem', marginTop: '0.5rem' }}>
          Your order will be delivered within 7 business days
        </p>
      </div>

      {/* Success Image/Icon */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ 
          fontSize: '4rem', 
          background: 'linear-gradient(135deg, #4caf50 0%, #81c784 100%)',
          borderRadius: '50%',
          width: '120px',
          height: '120px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto',
          boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)'
        }}>
          ✓
        </div>
      </div>

      {/* Additional Message */}
      <p style={{ color: 'var(--muted)', marginBottom: '2rem', lineHeight: '1.6' }}>
        We've sent a confirmation email to your registered email address. 
        You can track your order status from the "My Orders" page.
      </p>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button 
          onClick={() => nav('/')}
          style={{ 
            padding: '12px 24px', 
            fontSize: '1rem', 
            borderRadius: '8px', 
            background: 'var(--success)', 
            color: 'white', 
            border: 'none', 
            cursor: 'pointer',
            fontWeight: 'bold',
            flex: '1',
            minWidth: '200px'
          }}
        >
          Continue Shopping
        </button>
        
        <button 
          onClick={() => nav('/orders')}
          style={{ 
            padding: '12px 24px', 
            fontSize: '1rem', 
            borderRadius: '8px', 
            background: 'var(--primary)', 
            color: 'white', 
            border: 'none', 
            cursor: 'pointer',
            fontWeight: 'bold',
            flex: '1',
            minWidth: '200px'
          }}
        >
          View My Orders
        </button>
      </div>
    </div>
  );
}
