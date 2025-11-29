import React, { useState, useEffect } from 'react';
import { useApp } from '../context/useApp';

export default function FeedbackPage() {
  const { user } = useApp();
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(5);
  const [category, setCategory] = useState('general');
  const [allFeedback, setAllFeedback] = useState([]);
  const [replyText, setReplyText] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('feedbackList');
    if (stored) {
      setAllFeedback(JSON.parse(stored));
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!feedback.trim()) {
      alert('Please enter your feedback');
      return;
    }

    const newFeedback = {
      id: Date.now(),
      userId: user?.email || 'Anonymous',
      userName: user?.firstName || user?.email || 'Anonymous User',
      feedback: feedback.trim(),
      rating,
      category,
      date: new Date().toISOString(),
      verified: false,
      replies: []
    };

    const updated = [newFeedback, ...allFeedback];
    setAllFeedback(updated);
    localStorage.setItem('feedbackList', JSON.stringify(updated));

    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);

    setFeedback('');
    setRating(5);
    setCategory('general');
  };

  const handleVerify = (id) => {
    if (user?.role !== 'admin') return;
    
    const updated = allFeedback.map(fb => 
      fb.id === id ? { ...fb, verified: !fb.verified } : fb
    );
    setAllFeedback(updated);
    localStorage.setItem('feedbackList', JSON.stringify(updated));
  };

  const handleReply = (id) => {
    if (user?.role !== 'admin') return;
    
    const replyContent = replyText[id];
    if (!replyContent?.trim()) return;

    const updated = allFeedback.map(fb => {
      if (fb.id === id) {
        return {
          ...fb,
          replies: [
            ...fb.replies,
            {
              id: Date.now(),
              adminName: user.email,
              text: replyContent.trim(),
              date: new Date().toISOString()
            }
          ]
        };
      }
      return fb;
    });

    setAllFeedback(updated);
    localStorage.setItem('feedbackList', JSON.stringify(updated));
    setReplyText({ ...replyText, [id]: '' });
  };

  const handleDelete = (id) => {
    if (user?.role !== 'admin') return;
    
    if (confirm('Are you sure you want to delete this feedback?')) {
      const updated = allFeedback.filter(fb => fb.id !== id);
      setAllFeedback(updated);
      localStorage.setItem('feedbackList', JSON.stringify(updated));
    }
  };

  const renderStars = (rating) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  const getCategoryIcon = (cat) => {
    const icons = {
      general: '💬',
      product: '🛍️',
      service: '🤝',
      delivery: '🚚',
      bug: '🐛'
    };
    return icons[cat] || '💬';
  };

  return (
    <div className="page-content" style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem' }}>
      <h2 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        ✉️ Feedback & Support
      </h2>

      {showSuccess && (
        <div style={{
          padding: '1rem',
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          color: 'white',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          animation: 'slideUp 0.3s ease-out',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span style={{ fontSize: '1.5rem' }}>✓</span>
          <span>Thank you! Your feedback has been submitted successfully.</span>
        </div>
      )}

      <div style={{
        background: 'var(--card-bg)',
        borderRadius: '12px',
        padding: '2rem',
        marginBottom: '2rem',
        boxShadow: '0 2px 8px var(--shadow)'
      }}>
        <h3 style={{ marginBottom: '1.5rem', color: 'var(--primary)' }}>Share Your Feedback</h3>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text)' }}>
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                background: 'var(--bg)',
                color: 'var(--text)',
                fontSize: '1rem'
              }}
            >
              <option value="general">💬 General Feedback</option>
              <option value="product">🛍️ Product Related</option>
              <option value="service">🤝 Customer Service</option>
              <option value="delivery">🚚 Delivery Experience</option>
              <option value="bug">🐛 Report a Bug</option>
            </select>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text)' }}>
              Rating: {renderStars(rating)}
            </label>
            <input
              type="range"
              min="1"
              max="5"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              style={{
                width: '100%',
                accentColor: 'var(--primary)'
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
              <span>Poor</span>
              <span>Excellent</span>
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text)' }}>
              Your Feedback
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Tell us about your experience..."
              rows="6"
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                background: 'var(--bg)',
                color: 'var(--text)',
                fontSize: '1rem',
                resize: 'vertical',
                fontFamily: 'inherit'
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              padding: '0.75rem 2rem',
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '1rem',
              width: '100%'
            }}
          >
            Submit Feedback
          </button>
        </form>
      </div>

      <div>
        <h3 style={{ marginBottom: '1.5rem', color: 'var(--text)' }}>
          Community Feedback ({allFeedback.filter(fb => fb.verified).length} verified)
        </h3>

        {allFeedback.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '3rem',
            color: 'var(--muted)',
            background: 'var(--card-bg)',
            borderRadius: '12px'
          }}>
            <p style={{ fontSize: '3rem', margin: 0 }}>💬</p>
            <p>No feedback yet. Be the first to share your thoughts!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {allFeedback.map((fb) => (
              <div
                key={fb.id}
                style={{
                  background: 'var(--card-bg)',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  boxShadow: '0 2px 8px var(--shadow)',
                  border: fb.verified ? '2px solid var(--success)' : '1px solid var(--border)',
                  position: 'relative',
                  animation: 'fadeIn 0.4s ease-out'
                }}
              >
                {fb.verified && (
                  <div style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    background: 'var(--success)',
                    color: 'white',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}>
                    ✓ Verified
                  </div>
                )}

                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '1.5rem' }}>{getCategoryIcon(fb.category)}</span>
                    <strong style={{ color: 'var(--text)' }}>{fb.userName}</strong>
                    <span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>
                      • {new Date(fb.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div style={{ fontSize: '1.1rem' }}>
                    {renderStars(fb.rating)}
                  </div>
                </div>

                <p style={{
                  color: 'var(--text-light)',
                  lineHeight: '1.6',
                  marginBottom: '1rem',
                  whiteSpace: 'pre-wrap'
                }}>
                  {fb.feedback}
                </p>

                {fb.replies && fb.replies.length > 0 && (
                  <div style={{
                    marginTop: '1rem',
                    paddingTop: '1rem',
                    borderTop: '1px solid var(--border)'
                  }}>
                    {fb.replies.map((reply) => (
                      <div
                        key={reply.id}
                        style={{
                          background: 'var(--bg)',
                          padding: '1rem',
                          borderRadius: '8px',
                          marginBottom: '0.5rem',
                          borderLeft: '3px solid var(--primary)'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                          <span style={{ fontSize: '1rem' }}>⚙️</span>
                          <strong style={{ color: 'var(--primary)', fontSize: '0.9rem' }}>Admin</strong>
                          <span style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>
                            • {new Date(reply.date).toLocaleDateString()}
                          </span>
                        </div>
                        <p style={{ color: 'var(--text)', margin: 0, whiteSpace: 'pre-wrap' }}>
                          {reply.text}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {user?.role === 'admin' && (
                  <div style={{
                    marginTop: '1rem',
                    paddingTop: '1rem',
                    borderTop: '1px solid var(--border)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem'
                  }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => handleVerify(fb.id)}
                        style={{
                          padding: '0.5rem 1rem',
                          background: fb.verified ? 'var(--muted)' : 'var(--success)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '0.85rem',
                          fontWeight: 'bold'
                        }}
                      >
                        {fb.verified ? '✓ Verified' : 'Verify'}
                      </button>
                      <button
                        onClick={() => handleDelete(fb.id)}
                        style={{
                          padding: '0.5rem 1rem',
                          background: 'var(--danger)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '0.85rem',
                          fontWeight: 'bold'
                        }}
                      >
                        Delete
                      </button>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <input
                        type="text"
                        placeholder="Reply to this feedback..."
                        value={replyText[fb.id] || ''}
                        onChange={(e) => setReplyText({ ...replyText, [fb.id]: e.target.value })}
                        style={{
                          flex: 1,
                          padding: '0.5rem',
                          borderRadius: '6px',
                          border: '1px solid var(--border)',
                          background: 'var(--bg)',
                          color: 'var(--text)'
                        }}
                      />
                      <button
                        onClick={() => handleReply(fb.id)}
                        style={{
                          padding: '0.5rem 1rem',
                          background: 'var(--primary)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '0.85rem',
                          fontWeight: 'bold'
                        }}
                      >
                        Reply
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
