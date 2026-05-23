'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', phoneNumber: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault(); setError('');
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: form.name, email: form.email || undefined, phoneNumber: form.phoneNumber, password: form.password }) });
      const data = await res.json();
      if (!res.ok) { setError(data.error); setLoading(false); return; }
      localStorage.setItem('maas_token', data.token);
      localStorage.setItem('maas_user', JSON.stringify(data.user));
      router.push('/dashboard');
    } catch { setError('Network error. Please try again.'); setLoading(false); }
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: '460px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'linear-gradient(135deg,#10b981,#6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', margin: '0 auto 1.25rem' }}>🏡</div>
          <h2 style={{ marginBottom: '.4rem' }}>Create Your Account</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '.9rem' }}>Join the Buea MaaS community today — it&apos;s free</p>
        </div>

        <div className="card">
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={submit}>
            <div className="form-group"><label>Full Name</label><input className="input" type="text" name="name" placeholder="John Doe" value={form.name} onChange={handle} required /></div>
            <div className="form-group"><label>Phone Number <span style={{ color: 'var(--primary)' }}>*</span></label><input className="input" type="text" name="phoneNumber" placeholder="+237 6XX XXX XXX" value={form.phoneNumber} onChange={handle} required /></div>
            <div className="form-group"><label>Email <span style={{ color: 'var(--text-faint)', fontWeight: 400 }}>(optional)</span></label><input className="input" type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handle} /></div>
            <div className="form-group"><label>Password</label><input className="input" type="password" name="password" placeholder="Min. 6 characters" value={form.password} onChange={handle} required /></div>
            <div className="form-group"><label>Confirm Password</label><input className="input" type="password" name="confirm" placeholder="Repeat password" value={form.confirm} onChange={handle} required /></div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '.875rem', marginTop: '.25rem' }} disabled={loading}>
              {loading ? 'Creating account…' : 'Create Account →'}
            </button>
          </form>
          <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)', fontSize: '.88rem' }}>
            Already registered? <Link href="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
