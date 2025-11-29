import React from 'react';
import { useApp } from '../context/useApp';
import { useNavigate } from 'react-router-dom';

export default function CartPage() {
  const { cart, removeFromCart } = useApp();
  const nav = useNavigate();
  const total = cart.reduce((s, it) => s + it.price * it.qty, 0);

  function handleCheckout() {
    nav('/checkout');
  }

  return (
    <div className="page-content">
      <h2>Your Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul className="cart-list">
            {cart.map(it => (
              <li key={it.id}>
                <div>{it.name} (₹{it.price}) x {it.qty}</div>
                <div>
                  <button onClick={() => removeFromCart(it.id)}>Remove</button>
                </div>
              </li>
            ))}
          </ul>
          <div className="cart-total">Total: ₹{total}</div>
          <button className="cart-buy-btn" onClick={handleCheckout}>
            Proceed to Checkout
          </button>
        </>
      )}
    </div>
  );
}
