import React from 'react';

export default function Footer() {
  return (
    <footer>
      <div className="footer-container">
        <div className="footer-brand">
          <h3> Craft Shop </h3>
          <p>
            Your trusted marketplace for authentic handcrafted items. 
            Connecting artisans with customers worldwide since 2025
          </p>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul className="footer-links">
            <li>
              <a href="/">🏪 Shop</a>
            </li>
            <li>
              <a href="/orders">📦 My Orders</a>
            </li>
            <li>
              <a href="/profile">👤 Profile</a>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Contact Us</h4>
          <div className="footer-contact">
            <div className="footer-contact-item">
              <span>📧</span>
              <a href="mailto:tanveerbasha1322@gmail.com">
                tanveerbasha1322@gmail.com
              </a>
            </div>
            <div className="footer-contact-item">
              <span>📱</span>
              <a href="tel:+917993802715">
                +91 7993802715
              </a>
            </div>
            <div className="footer-contact-item">
              <span>💬</span>
              <span className="text-muted">
                Available: 9 AM - 6 PM IST
              </span>
            </div>
          </div>
        </div>

        <div className="footer-section">
          <h4>Help & Support</h4>
          <ul className="footer-links">
            <li>
              <a href="/feedback">Send Feedback</a>
            </li>
            <li>
              <span className="text-muted">FAQ</span>
            </li>
            <li>
              <span className="text-muted">Terms & Conditions</span>
            </li>
            <li>
              <span className="text-muted">Privacy Policy</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} CraftShop. All rights reserved. Made with Team Craft.
        </p>
      </div>
    </footer>
  );
}
