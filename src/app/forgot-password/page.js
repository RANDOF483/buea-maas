'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setStatus('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.error);
      } else {
        setStatus(data.message);
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'linear-gradient(135deg,#10b981,#6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', margin: '0 auto 1.25rem' }}>🔐</div>
          <h2 style={{ marginBottom: '.4rem' }}>Reset Password</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '.9rem' }}>Enter your phone number to request a reset</p>
        </div>

        <div className="card">
          {error && <div className="alert alert-error" style={{ marginBottom: '1.25rem' }}>{error}</div>}
          {status ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
              <h3 style={{ marginBottom: '1rem' }}>Request Sent</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '2rem' }}>{status}</p>
              <a href="https://wa.me/237671176436" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ display: 'block', width: '100%', padding: '.875rem' }}>
                Contact Admin on WhatsApp
              </a>
              <div style={{ marginTop: '1.5rem' }}>
                <Link href="/login" style={{ color: 'var(--text-faint)', fontSize: '.9rem' }}>← Back to Login</Link>
              </div>
            </div>
          ) : (
            <form onSubmit={submit}>
              <div className="form-group">
                <label>Phone Number</label>
                <input className="input" type="text" placeholder="+237 6XX XXX XXX" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '.875rem', marginTop: '.25rem' }} disabled={loading}>
                {loading ? 'Sending Request…' : 'Request Password Reset →'}
              </button>
            </form>
          )}
        </div>
        
        {!status && (
          <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-faint)', fontSize: '.88rem' }}>
            Remembered your password? <Link href="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign in</Link>
          </p>
        )}
      </div>
    </div>
  );
}
