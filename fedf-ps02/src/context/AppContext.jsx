import React, { useState, useEffect } from 'react';
import { sampleCraftItems } from '../data/sampleCraft';
import fallbackImg from '../assets/Vase.avif';
import { AppContext } from './core';
import { itemsAPI, ordersAPI } from '../services/api';

// Flag to force using local sample craft items instead of backend data
const FORCE_SAMPLE = import.meta.env.VITE_FORCE_SAMPLE === 'true';

export function AppProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [wishlist, setWishlist] = useState(() => {
    try {
      const raw = localStorage.getItem('app.wishlist');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [orders, setOrders] = useState([]);
  const [suggestions, setSuggestions] = useState(() => {
    try {
      const raw = localStorage.getItem('app.suggestions');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [items, setItems] = useState(() => {
    if (FORCE_SAMPLE) {
      return sampleCraftItems.map(it => ({ ...it, id: String(it.id) }));
    }
    return [];
  });

  // Note: localImageMap is built inside the items-loading effect to avoid hook dependency issues

  // Load items (skip backend if FORCE_SAMPLE)
  useEffect(() => {
    if (FORCE_SAMPLE) return; // already initialized with sample items
    async function loadItems() {
      try {
        const data = await itemsAPI.getAll();
        const localImageMap = sampleCraftItems.reduce((m, it) => {
          if (it && it.name && it.image) m[it.name.toLowerCase()] = it.image;
          return m;
        }, {});
        const normalizeItem = it => {
          const normalized = { ...it };
          normalized.id = normalized.id || (normalized._id ? String(normalized._id) : undefined);
          const nameKey = (normalized.name || '').toLowerCase();
            normalized.image = normalized.image || localImageMap[nameKey] || fallbackImg;
          return normalized;
        };
        if (data && data.length > 0) {
          setItems(data.map(normalizeItem));
        } else {
          setItems(sampleCraftItems.map(normalizeItem));
        }
      } catch (error) {
        console.error('Failed to load items from database:', error);
        setItems(sampleCraftItems.map(it => ({ ...it, id: String(it.id) })));
      }
    }
    loadItems();
  }, []);

  // Load orders from MongoDB on mount
  useEffect(() => {
    async function loadOrders() {
      try {
        const data = await ordersAPI.getAll();
        if (data && data.length > 0) {
          setOrders(data);
        }
      } catch (error) {
        console.error('Failed to load orders from database:', error);
        // Try to load from localStorage as fallback
        try {
          const raw = localStorage.getItem('app.orders');
          if (raw) setOrders(JSON.parse(raw));
        } catch (err) {
          void err;
        }
      }
    }
    loadOrders();
  }, []);

  // quantity defaults to 1; enforce cart quantity + qty <= stock when stock is numeric
  function addToCart(item, qty = 1) {
    // check stock
    const storeItem = items.find(i => i.id === item.id);
    if (!storeItem || (typeof storeItem.stock === 'number' && storeItem.stock <= 0)) {
      alert('Sorry — this item is out of stock.');
      return;
    }
    setCart(prev => {
      const found = prev.find(i => i.id === item.id);
      const available = typeof storeItem.stock === 'number' ? storeItem.stock : Infinity;
      const currentQty = found ? found.qty : 0;
      if (currentQty + qty > available) {
        alert(`Cannot add ${qty} items — only ${available - currentQty} left in stock.`);
        return prev;
      }
      if (found) return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + qty } : i);
      return [...prev, { ...item, qty }];
    });
  }

  function removeFromCart(id) {
    setCart(prev => prev.filter(i => i.id !== id));
  }

  function clearCart() {
    setCart([]);
  }

  // Wishlist functions
  function addToWishlist(item) {
    const id = item.id || (item._id ? String(item._id) : undefined);
    setWishlist(prev => {
      const found = prev.find(i => (i.id || i._id) === id);
      if (found) return prev;
      const toStore = { ...item, id };
      const next = [...prev, toStore];
      try { localStorage.setItem('app.wishlist', JSON.stringify(next)); } catch (err) { void err; }
      return next;
    });
  }

  function removeFromWishlist(id) {
    const idStr = id || (id === 0 ? '0' : undefined);
    setWishlist(prev => {
      const next = prev.filter(i => (i.id || String(i._id)) !== String(idStr));
      try { localStorage.setItem('app.wishlist', JSON.stringify(next)); } catch (err) { void err; }
      return next;
    });
  }
  
  function addOrder(order) {
    // Ensure order has a date and an id when stored locally
    const orderToSave = { ...order };
    if (orderToSave.date instanceof Date) {
      orderToSave.date = orderToSave.date.toISOString();
    } else if (typeof orderToSave.date === 'number') {
      orderToSave.date = new Date(orderToSave.date).toISOString();
    } else if (!orderToSave.date) {
      orderToSave.date = new Date().toISOString();
    }
    if (!orderToSave.id) orderToSave.id = `local-${Date.now()}`;

    // Save order to MongoDB
    async function saveOrder() {
      try {
        const savedOrder = await ordersAPI.create(orderToSave);
        // prefer DB savedOrder (may include server id/date), but ensure date/id present
        const final = { ...orderToSave, ...savedOrder };
        if (!final.date) final.date = orderToSave.date;
        if (!final.id) final.id = orderToSave.id;
        setOrders(prev => [final, ...prev]);
      } catch (error) {
        console.error('Failed to save order to database:', error);
        // Fallback to localStorage
        setOrders(prev => {
          const next = [orderToSave, ...prev];
          try { localStorage.setItem('app.orders', JSON.stringify(next)); } catch (err) { void err; }
          return next;
        });
      }
    }
    saveOrder();

    // decrement stock for each ordered item
    setItems(prevItems => {
      const nextItems = prevItems.map(it => {
        const ordered = order.items.find(oi => oi.id === it.id);
        if (!ordered) return it;
        const newStock = (typeof it.stock === 'number' ? it.stock : Infinity) - ordered.qty;
        return { ...it, stock: newStock < 0 ? 0 : newStock };
      });
      return nextItems;
    });
  }

  function updateItemStock(id, stock) {
    if (FORCE_SAMPLE) {
      setItems(prev => prev.map(i => i.id === id ? { ...i, stock } : i));
      return;
    }
    async function saveStockUpdate() {
      try {
        await itemsAPI.update(id, { stock });
        setItems(prev => prev.map(i => i.id === id ? { ...i, stock } : i));
      } catch (error) {
        console.error('Failed to update stock in database:', error);
        setItems(prev => {
          const next = prev.map(i => i.id === id ? { ...i, stock } : i);
          try { localStorage.setItem('app.items', JSON.stringify(next)); } catch (err) { void err; }
          return next;
        });
      }
    }
    saveStockUpdate();
  }

  function addItem(item) {
    if (FORCE_SAMPLE) {
      const normalized = { approved: false, ...item, id: item.id || `local-${Date.now()}` };
      setItems(prev => [normalized, ...prev]);
      return;
    }
    async function saveItem() {
      try {
        const savedItem = await itemsAPI.create({ approved: false, ...item });
        setItems(prev => [savedItem, ...prev]);
      } catch (error) {
        console.error('Failed to save item to database:', error);
        setItems(prev => {
          const normalized = { approved: false, ...item };
          const next = [{ ...normalized }, ...prev];
          try { localStorage.setItem('app.items', JSON.stringify(next)); } catch (err) { void err; }
          return next;
        });
      }
    }
    saveItem();
  }

  function updateItem(id, patch) {
    if (FORCE_SAMPLE) {
      setItems(prev => prev.map(it => it.id === id ? { ...it, ...patch } : it));
      return;
    }
    async function saveUpdate() {
      try {
        await itemsAPI.update(id, patch);
        setItems(prev => prev.map(it => it.id === id ? { ...it, ...patch } : it));
      } catch (error) {
        console.error('Failed to update item in database:', error);
        setItems(prev => {
          const next = prev.map(it => it.id === id ? { ...it, ...patch } : it);
          try { localStorage.setItem('app.items', JSON.stringify(next)); } catch (err) { void err; }
          return next;
        });
      }
    }
    saveUpdate();
  }

  function addSuggestion(s) {
    setSuggestions(prev => {
      const next = [s, ...prev];
  try { localStorage.setItem('app.suggestions', JSON.stringify(next)); } catch (err) { void err; }
      return next;
    });
  }

  function updateSuggestion(id, patch) {
    setSuggestions(prev => {
      const next = prev.map(s => s.id === id ? { ...s, ...patch } : s);
      try { localStorage.setItem('app.suggestions', JSON.stringify(next)); } catch (err) { void err; }
      return next;
    });
  }

  function login(u) { setUser(u); }
  function logout() { setUser(null); }

  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem('app.theme') || 'light'; } catch { return 'light'; }
  });

  useEffect(() => {
    try { localStorage.setItem('app.theme', theme); } catch (err) { void err; }
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
      // Always use system font
      document.documentElement.setAttribute('data-font', 'system');
    }
  }, [theme]);

  return (
    <AppContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, wishlist, addToWishlist, removeFromWishlist, user, login, logout, theme, setTheme, orders, addOrder, suggestions, addSuggestion, updateSuggestion, items, updateItemStock, addItem, updateItem }}>
      {children}
    </AppContext.Provider>
  );
}