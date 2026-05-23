'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ phoneNumber: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const res = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) { setError(data.error); setLoading(false); return; }
      localStorage.setItem('maas_token', data.token);
      localStorage.setItem('maas_user', JSON.stringify(data.user));
      router.push(data.user.role === 'ADMIN' ? '/admin' : '/dashboard');
    } catch { setError('Network error. Please try again.'); setLoading(false); }
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'linear-gradient(135deg,#10b981,#6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', margin: '0 auto 1.25rem' }}>⚡</div>
          <h2 style={{ marginBottom: '.4rem' }}>Welcome Back</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '.9rem' }}>Sign in to your Buea MaaS account</p>
        </div>

        <div className="card">
          {error && <div className="alert alert-error" style={{ marginBottom: '1.25rem' }}>{error}</div>}
          <form onSubmit={submit}>
            <div className="form-group"><label>Phone Number</label><input className="input" type="text" name="phoneNumber" placeholder="+237 6XX XXX XXX" value={form.phoneNumber} onChange={handle} required /></div>
            <div className="form-group"><label>Password</label><input className="input" type="password" name="password" placeholder="••••••••" value={form.password} onChange={handle} required /></div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '.875rem', marginTop: '.25rem' }} disabled={loading}>
              {loading ? 'Signing in…' : 'Sign In →'}
            </button>
          </form>
          <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)', fontSize: '.88rem' }}>
            No account? <Link href="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>Register here</Link>
          </p>
        </div>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-faint)', fontSize: '.82rem' }}>
          Need help? <a href="tel:+237671176436" style={{ color: 'var(--text-muted)' }}>+237 671 176 436</a>
        </p>
      </div>
    </div>
  );
}
