import React, { useState } from 'react';
import { useApp } from '../context/useApp';

export default function ConsultantPage() {
  const { suggestions, addSuggestion, items, user } = useApp();
  const [selectedItem, setSelectedItem] = useState((items && items[0]) ? items[0].id : null);
  const [note, setNote] = useState('');

  function submit(e) {
    e.preventDefault();
    if (!note.trim()) return;
  addSuggestion({ id: Date.now(), itemId: selectedItem, note, author: user?.email || 'consultant', date: new Date(), resolved: false });
    setNote('');
  }

  return (
    <div>
      <h2>Cultural Consultant</h2>
      <p>Review items and submit cultural guidance or corrections. Suggestions persist in localStorage for demo purposes.</p>

      <form onSubmit={submit} style={{ marginBottom: 16 }}>
        <label>Item</label>
        <select value={selectedItem} onChange={e => setSelectedItem(Number(e.target.value))}>
          {(items || []).map(it => <option key={it.id} value={it.id}>{it.name}</option>)}
        </select>
        <textarea placeholder="Cultural note, corrections, provenance info..." value={note} onChange={e => setNote(e.target.value)} style={{ width: '100%', minHeight: 100 }} />
        <div>
          <button type="submit">Submit Suggestion</button>
        </div>
      </form>

      <h3>Existing Suggestions</h3>
      {(!suggestions || suggestions.length === 0) ? <p>No suggestions yet.</p> : (
        <div>
          {suggestions.map(s => (
            <div key={s.id} style={{ border: '1px solid rgba(0,0,0,0.06)', padding: 12, borderRadius: 8, marginBottom: 8 }}>
              <div style={{ color: 'var(--muted)', fontSize: 12 }}>{new Date(s.date).toLocaleString()} — {s.author}</div>
              <div><strong>Item:</strong> {items.find(i => i.id === s.itemId)?.name || s.itemId}</div>
              <div style={{ marginTop: 6 }}>{s.note}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}