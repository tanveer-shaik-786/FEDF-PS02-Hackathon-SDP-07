import React, { useState, useEffect } from 'react';
import { useApp } from '../context/useApp';
import { useNavigate } from 'react-router-dom';
import qrCodeImage from '../assets/QR.jpg';

function FormGroup({ label, id, ...props }) {
  return (
    <div className="form-group">
      <label htmlFor={id}>{label}</label>
      <input id={id} {...props} />
    </div>
  );
}

function PaymentOption({ id, value, label, icon, checked, onChange }) {
  return (
    <label htmlFor={id} className={`payment-option ${checked ? 'selected' : ''}`}>
      <input
        type="radio"
        name="paymentMethod"
        id={id}
        value={value}
        checked={checked}
        onChange={onChange}
      />
      <span className="payment-icon">{icon}</span>
      <span className="payment-label">{label}</span>
    </label>
  );
}

const SHIPPING_CHARGE = 40.00;
const GST_RATE = 0.18; // 18%
const COD_FEE = 10.00;

export default function CheckoutPage() {
  const { cart, addOrder, clearCart } = useApp();
  const nav = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('card');
  
  // CAPTCHA STATE
  const [captcha, setCaptcha] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');

  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    cardName: '',
    cardNum: '',
    cardExp: '',
    cardCVC: '',
    upiId: '',
    bank: 'sbi',
  });

  // Generate CAPTCHA on mount
  useEffect(() => {
    generateCaptcha();
  }, []);

  function generateCaptcha() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptcha(result);
  }

  if (!cart) {
    return (
      <div>
        <h2>Checkout</h2>
        <p>Loading...</p>
      </div>
    );
  }

  const subtotal = cart.reduce((s, it) => s + it.price * it.qty, 0);
  const gst = subtotal * GST_RATE;
  const codFee = paymentMethod === 'cod' ? COD_FEE : 0;
  const grandTotal = subtotal + SHIPPING_CHARGE + gst + codFee;

  function handleChange(e) {
    const { id, value } = e.target;
    setFormState(prev => ({ ...prev, [id]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    // CAPTCHA VALIDATION
    if (captchaInput !== captcha) {
      alert('Incorrect CAPTCHA code. Please try again.');
      generateCaptcha();
      setCaptchaInput('');
      return; // Stop the function here
    }

    console.log("Processing payment via:", paymentMethod);

    const newOrder = {
      id: Date.now(),
      date: new Date(),
      items: cart, 
      subtotal: subtotal,
      shipping: SHIPPING_CHARGE,
      gst: gst,
      codFee: codFee,
      total: grandTotal,
      paymentMethod: paymentMethod,
      customer: {
        name: formState.name,
        email: formState.email,
        phone: formState.phone,
        address: `${formState.address}, ${formState.city}, ${formState.state} ${formState.zip}`,
      },
    };

    addOrder(newOrder);
    clearCart();
    nav('/order-success', { state: { order: newOrder } });
  }

  function renderPaymentDetails() {
    switch (paymentMethod) {
      case 'card':
        return (
          <>
            <FormGroup label="Name on Card" id="cardName" type="text" value={formState.cardName} onChange={handleChange} required />
            <FormGroup label="Card Number" id="cardNum" type="text" placeholder="XXXX XXXX XXXX XXXX" value={formState.cardNum} onChange={handleChange} required />
            <div style={{ display: 'flex', gap: '1rem' }}>
              <FormGroup label="Expiry (MM/YY)" id="cardExp" type="text" placeholder="MM/YY" value={formState.cardExp} onChange={handleChange} required style={{ flex: 1 }} />
              <FormGroup label="CVC" id="cardCVC" type="text" placeholder="123" value={formState.cardCVC} onChange={handleChange} required style={{ flex: 1 }} />
            </div>
          </>
        );
      case 'upi':
        return (
          <>
            <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.9rem' }}>Enter your UPI ID (e.g., name@okbank). You will receive a payment request on your GPay, PhonePe, or Paytm app.</p>
            <FormGroup label="UPI ID" id="upiId" type="text" placeholder="yourname@upi" value={formState.upiId} onChange={handleChange} required />
          </>
        );
      case 'netbanking':
        return (
          <div className="form-group">
            <label htmlFor="bank">Select Your Bank</label>
            <select id="bank" value={formState.bank} onChange={handleChange} style={{ padding: '12px', fontSize: '1rem' }}>
              <option value="sbi">State Bank of India</option>
              <option value="hdfc">HDFC Bank</option>
              <option value="icici">ICICI Bank</option>
              <option value="axis">Axis Bank</option>
              <option value="other">Other Bank</option>
            </select>
          </div>
        );
      case 'qr':
        return (
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.9rem' }}>Scan the QR code below using any UPI app like GPay, PhonePe, or Paytm.</p>
            
            <div className="qr-code-display">
              <img src={qrCodeImage} alt="QR Code" style={{ maxWidth: '200px', width: '100%' }} />
              <p className="upi-id-text" style={{ fontSize: '1.1rem', fontWeight: '600', margin: '0.5rem 0' }}>tanveershaik@ptyes</p>
            </div>
          </div>
        );
      case 'cod':
        return (
          <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.9rem' }}>You will pay in cash upon delivery of your order. Please keep the exact amount ready.</p>
        );
      default:
        return null;
    }
  }

  if (cart.length === 0) {
    return (
      <div>
        <h2>Checkout</h2>
        <p>Your cart is empty. Please add items to your cart before checking out.</p>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <h2>Checkout</h2>
      <div className="checkout-grid">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <section>
            <h3>1. Contact Details</h3>
            <FormGroup label="Full Name" id="name" type="text" value={formState.name} onChange={handleChange} required />
            <FormGroup label="Email" id="email" type="email" value={formState.email} onChange={handleChange} required />
            <FormGroup label="Phone" id="phone" type="tel" value={formState.phone} onChange={handleChange} required />
          </section>

          <section>
            <h3>2. Shipping Address</h3>
            <FormGroup label="Street Address" id="address" type="text" value={formState.address} onChange={handleChange} required />
            <div style={{ display: 'flex', gap: '1rem' }}>
              <FormGroup label="City" id="city" type="text" value={formState.city} onChange={handleChange} required style={{ flex: 2 }} />
              <FormGroup label="State" id="state" type="text" value={formState.state} onChange={handleChange} required style={{ flex: 1 }} />
              <FormGroup label="Postal Code" id="zip" type="text" value={formState.zip} onChange={handleChange} required style={{ flex: 1 }} />
            </div>
          </section>

          <section>
            <h3>3. Payment Method</h3>
            <div className="payment-method-selector">
              <PaymentOption id="pay-card" value="card" label="Card" icon="💳" checked={paymentMethod === 'card'} onChange={(e) => setPaymentMethod(e.target.value)} />
              <PaymentOption id="pay-upi" value="upi" label="UPI" icon="📱" checked={paymentMethod === 'upi'} onChange={(e) => setPaymentMethod(e.target.value)} />
              <PaymentOption id="pay-netbanking" value="netbanking" label="Net Banking" icon="🏦" checked={paymentMethod === 'netbanking'} onChange={(e) => setPaymentMethod(e.target.value)} />
              <PaymentOption id="pay-qr" value="qr" label="Scan QR" icon="🤳" checked={paymentMethod === 'qr'} onChange={(e) => setPaymentMethod(e.target.value)} />
              <PaymentOption id="pay-cod" value="cod" label="COD" icon="💵" checked={paymentMethod === 'cod'} onChange={(e) => setPaymentMethod(e.target.value)} />
            </div>
            
            <div className="payment-details">
              {renderPaymentDetails()}
            </div>
          </section>

          {/* CAPTCHA SECTION */}
          <section className="captcha-section">
            <h3>4. Verification</h3>
            <div className="captcha-container">
              <div className="captcha-box">
                {captcha}
              </div>
              <button type="button" onClick={generateCaptcha} className="captcha-refresh-btn" title="Refresh Code">
                ↻
              </button>
            </div>
            <div className="form-group">
              <label htmlFor="captchaInput">Enter the code above</label>
              <input 
                id="captchaInput" 
                type="text" 
                value={captchaInput} 
                onChange={(e) => setCaptchaInput(e.target.value.toUpperCase())}
                placeholder="CAPTCHA CODE"
                required 
                style={{ letterSpacing: '2px', textTransform: 'uppercase' }}
              />
            </div>
          </section>

          <button type="submit" className="cart-buy-btn" style={{ width: '100%', marginTop: '1rem' }}>
            {paymentMethod === 'cod' ? 'Place Order' : `Pay ₹${grandTotal.toFixed(2)}`}
          </button>
        </form>

        <div className="checkout-summary">
          <h3>Order Summary</h3>
          <ul className="summary-list">
            {cart.map(it => (
              <li key={it.id}>
                <span>{it.name} (x{it.qty})</span>
                <span>₹{it.price * it.qty}</span>
              </li>
            ))}
          </ul>

          <div className="summary-breakdown">
            <div className="summary-line">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-line">
              <span>Shipping Charge</span>
              <span>₹{SHIPPING_CHARGE.toFixed(2)}</span>
            </div>
            <div className="summary-line">
              <span>GST (18%)</span>
              <span>₹{gst.toFixed(2)}</span>
            </div>
            {codFee > 0 && (
              <div className="summary-line cod-fee">
                <span>Cash on Delivery Fee</span>
                <span>₹{codFee.toFixed(2)}</span>
              </div>
            )}
          </div>

          <div className="summary-total">
            <strong>Grand Total</strong>
            <strong>₹{grandTotal.toFixed(2)}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}