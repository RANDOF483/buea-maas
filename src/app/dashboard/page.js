'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import PaymentTab from '@/components/PaymentTab';

const TARIFF = 100;

export default function Dashboard() {
  const router = useRouter();
  const [tab, setTab] = useState('overview');
  const [user, setUser] = useState(null);
  const [appliances, setAppliances] = useState([]);
  const [payments, setPayments] = useState([]);
  const [faults, setFaults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [appForm, setAppForm] = useState({ name: '', wattage: '', quantity: 1, hoursPerDay: '' });
  const [appMsg, setAppMsg] = useState(null);
  const [payMsg, setPayMsg] = useState(null);
  const [lastReceipt, setLastReceipt] = useState(null);
  const [faultDesc, setFaultDesc] = useState('');
  const [faultImage, setFaultImage] = useState(null);
  const [faultMsg, setFaultMsg] = useState(null);

  const getToken = () => typeof window !== 'undefined' ? localStorage.getItem('maas_token') : null;
  const authH = () => ({ Authorization: `Bearer ${getToken()}` });

  const fetchAll = useCallback(async () => {
    const token = getToken();
    if (!token) { router.push('/login'); return; }
    setLoading(true);
    const [meRes, aRes, pRes, fRes] = await Promise.all([
      fetch('/api/user/me', { headers: { Authorization: `Bearer ${token}` } }),
      fetch('/api/appliances', { headers: { Authorization: `Bearer ${token}` } }),
      fetch('/api/payments', { headers: { Authorization: `Bearer ${token}` } }),
      fetch('/api/faults', { headers: { Authorization: `Bearer ${token}` } }),
    ]);
    if (meRes.status === 401) { router.push('/login'); return; }
    const me = await meRes.json();
    const apps = await aRes.json();
    const pays = await pRes.json();
    const fts = await fRes.json();
    setUser(me);
    setAppliances(Array.isArray(apps) ? apps : []);
    setPayments(Array.isArray(pays) ? pays : []);
    setFaults(Array.isArray(fts) ? fts : []);
    setLoading(false);
  }, [router]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const addAppliance = async (e) => {
    e.preventDefault(); setAppMsg(null);
    const res = await fetch('/api/appliances', { method: 'POST', headers: { ...authH(), 'Content-Type': 'application/json' }, body: JSON.stringify(appForm) });
    const d = await res.json();
    setAppMsg({ ok: res.ok, text: res.ok ? '✅ Appliance added successfully!' : d.error });
    if (res.ok) { setAppForm({ name: '', wattage: '', quantity: 1, hoursPerDay: '' }); fetchAll(); }
  };

  const deleteAppliance = async (id) => {
    await fetch(`/api/appliances?id=${id}`, { method: 'DELETE', headers: authH() });
    fetchAll();
  };

  const makePayment = async (amountFCFA, method, txRef) => {
    const res = await fetch('/api/payments', { method: 'POST', headers: { ...authH(), 'Content-Type': 'application/json' }, body: JSON.stringify({ amountFCFA, method, transactionRef: txRef }) });
    const d = await res.json();
    if (res.ok) { setLastReceipt(d.payment); fetchAll(); }
    return { ok: res.ok, data: d };
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setFaultImage(reader.result);
    reader.readAsDataURL(file);
  };

  const reportFault = async (e) => {
    e.preventDefault(); setFaultMsg(null);
    const res = await fetch('/api/faults', { method: 'POST', headers: { ...authH(), 'Content-Type': 'application/json' }, body: JSON.stringify({ description: faultDesc, imageBase64: faultImage }) });
    const d = await res.json();
    setFaultMsg({ ok: res.ok, text: res.ok ? '✅ Fault reported! Redirecting to WhatsApp...' : d.error });
    if (res.ok) { 
      const waText = encodeURIComponent(`🚨 *New Fault Report*\n*Name:* ${user?.name}\n*Phone:* ${user?.phoneNumber}\n*Description:* ${faultDesc}`);
      window.open(`https://wa.me/237671176436?text=${waText}`, '_blank');
      setFaultDesc(''); setFaultImage(null); fetchAll(); 
    }
  };

  const statusBadge = (s) => {
    const map = { PENDING: 'badge-yellow', IN_PROGRESS: 'badge-blue', RESOLVED: 'badge-green' };
    return <span className={`badge ${map[s] || 'badge-yellow'}`}>{s?.replace('_', ' ')}</span>;
  };

  const Msg = ({ msg }) => msg ? <div className={`alert ${msg.ok ? 'alert-success' : 'alert-error'}`}>{msg.text}</div> : null;

  const navSections = [
    {
      label: 'My Account',
      items: [
        { id: 'overview', icon: '📊', label: 'Overview', active: tab === 'overview', onClick: () => setTab('overview') },
        { id: 'appliances', icon: '🔌', label: 'Appliances', active: tab === 'appliances', onClick: () => setTab('appliances') },
        { id: 'payments', icon: '💳', label: 'Payments & Billing', active: tab === 'payments', onClick: () => setTab('payments') },
        { id: 'faults', icon: '🔧', label: 'Report a Fault', active: tab === 'faults', onClick: () => setTab('faults'), badge: faults.filter(f => f.status === 'PENDING').length || undefined },
      ],
    },
    {
      label: 'Support',
      items: [
        { id: 'contact', icon: '📞', label: 'Contact Support', active: false, onClick: () => router.push('/contact') },
      ],
    },
  ];

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: '3px solid var(--border)', borderTopColor: 'var(--primary)', animation: 'spin 1s linear infinite' }} />
      <p style={{ color: 'var(--text-muted)' }}>Loading your dashboard…</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  const dailyKWh = user?.dailyKWh || 0;
  const monthlyKWh = user?.monthlyKWh || 0;
  const monthlyCost = user?.monthlyCostFCFA || 0;
  const balance = user?.balanceFCFA || 0;
  const daysLeft = monthlyCost > 0 ? Math.floor(balance / (monthlyCost / 30)) : 99;

  return (
    <DashboardLayout
      nav={navSections}
      user={user}
      title={tab === 'overview' ? `Welcome back, ${user?.name?.split(' ')[0]} 👋 ${user?.neighborhood ? `(${user.neighborhood})` : ''}` : { appliances: 'Appliance Manager', payments: 'Payments & Billing', faults: 'Fault Reporting' }[tab]}
      subtitle={{ overview: 'Here\'s your energy summary for today.', appliances: 'Register and manage your home appliances.', payments: 'Top up your balance and view billing history.', faults: 'Report issues to our Buea support team.' }[tab]}
    >
      {/* OVERVIEW */}
      {tab === 'overview' && (
        <div>
          <div className="grid-4" style={{ marginBottom: '2rem' }}>
            {[
              { icon: '💰', label: 'Account Balance', value: `${balance.toLocaleString()} FCFA`, color: 'var(--primary)' },
              { icon: '⚡', label: 'Daily Usage', value: `${dailyKWh.toFixed(3)} kWh`, color: 'var(--warning)' },
              { icon: '📅', label: 'Monthly Cost', value: `${monthlyCost.toFixed(0)} FCFA`, color: '#a78bfa' },
              { icon: '📆', label: 'Estimated Days Left', value: `${Math.min(daysLeft, 99)} days`, color: daysLeft < 5 ? 'var(--danger)' : '#34d399' },
            ].map(({ icon, label, value, color }) => (
              <div key={label} className="stat-card">
                <div style={{ fontSize: '1.75rem', marginBottom: '.75rem' }}>{icon}</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{value}</div>
                <div style={{ fontSize: '.8rem', color: 'var(--text-muted)', marginTop: '.25rem' }}>{label}</div>
              </div>
            ))}
          </div>

          {/* Balance progress */}
          <div className="card" style={{ marginBottom: '2rem' }}>
            <div className="section-title">
              <h3>💡 Energy Budget Status</h3>
              <span className={`badge ${daysLeft < 5 ? 'badge-red' : 'badge-green'}`}>{daysLeft < 5 ? '⚠️ Low Balance' : '✅ Healthy'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '.75rem', fontSize: '.85rem', color: 'var(--text-muted)' }}>
              <span>Balance: <strong style={{ color: 'var(--text)' }}>{balance.toLocaleString()} FCFA</strong></span>
              <span>Daily cost: <strong style={{ color: 'var(--text)' }}>{(monthlyCost / 30).toFixed(0)} FCFA</strong></span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${Math.min((daysLeft / 30) * 100, 100)}%` }} />
            </div>
            <p style={{ fontSize: '.82rem', color: 'var(--text-muted)', marginTop: '.75rem' }}>
              Estimated <strong style={{ color: daysLeft < 5 ? 'var(--danger)' : 'var(--primary)' }}>{Math.min(daysLeft, 99)} days</strong> of energy remaining at current usage rate.
            </p>
          </div>

          <div className="grid-2" style={{ gap: '1.5rem' }}>
            {/* Recent payments */}
            <div className="card">
              <div className="section-title">
                <h3>🧾 Recent Payments</h3>
                <button onClick={() => setTab('payments')} className="btn btn-ghost btn-sm">View All</button>
              </div>
              {payments.length === 0 ? <p style={{ color: 'var(--text-muted)', fontSize: '.9rem' }}>No payments yet.</p> : (
                <table className="table">
                  <thead><tr><th>Date</th><th>Method</th><th>Amount</th></tr></thead>
                  <tbody>
                    {payments.slice(0, 4).map(p => (
                      <tr key={p.id}>
                        <td style={{ fontSize: '.82rem', color: 'var(--text-muted)' }}>{new Date(p.createdAt).toLocaleDateString()}</td>
                        <td><span className={`badge ${p.method === 'MTN' ? 'badge-yellow' : 'badge-purple'}`}>{p.method}</span></td>
                        <td style={{ fontWeight: 600, color: 'var(--primary)' }}>{p.amountFCFA.toLocaleString()} FCFA</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            {/* Recent faults */}
            <div className="card">
              <div className="section-title">
                <h3>🔧 Recent Fault Reports</h3>
                <button onClick={() => setTab('faults')} className="btn btn-ghost btn-sm">Report New</button>
              </div>
              {faults.length === 0 ? <p style={{ color: 'var(--text-muted)', fontSize: '.9rem' }}>No fault reports yet.</p> : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
                  {faults.slice(0, 3).map(f => (
                    <div key={f.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '.875rem', background: 'var(--surface)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                      <div>
                        <p style={{ fontSize: '.88rem', marginBottom: '.25rem' }}>{f.description.slice(0, 60)}{f.description.length > 60 ? '…' : ''}</p>
                        <p style={{ fontSize: '.75rem', color: 'var(--text-muted)' }}>{new Date(f.createdAt).toLocaleDateString()}</p>
                      </div>
                      {statusBadge(f.status)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* APPLIANCES */}
      {tab === 'appliances' && (
        <div className="grid-2" style={{ alignItems: 'start' }}>
          <div className="card">
            <h3 style={{ marginBottom: '1.5rem' }}>➕ Add New Appliance</h3>
            <Msg msg={appMsg} />
            <form onSubmit={addAppliance}>
              <div className="form-group"><label>Appliance Name</label><input className="input" placeholder="e.g. LED Bulb, Fridge, TV" value={appForm.name} onChange={e => setAppForm({ ...appForm, name: e.target.value })} required /></div>
              <div className="form-group"><label>Power Rating (Watts)</label><input className="input" type="number" min="1" placeholder="e.g. 60" value={appForm.wattage} onChange={e => setAppForm({ ...appForm, wattage: e.target.value })} required /></div>
              <div className="form-group"><label>Quantity</label><input className="input" type="number" min="1" value={appForm.quantity} onChange={e => setAppForm({ ...appForm, quantity: e.target.value })} /></div>
              <div className="form-group"><label>Hours Used Per Day</label><input className="input" type="number" step="0.5" min="0.5" max="24" placeholder="e.g. 8" value={appForm.hoursPerDay} onChange={e => setAppForm({ ...appForm, hoursPerDay: e.target.value })} required /></div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Add Appliance</button>
            </form>
          </div>
          <div className="card">
            <div className="section-title">
              <h3>🔌 My Appliances</h3>
              <span className="badge badge-blue">{appliances.length} registered</span>
            </div>
            {appliances.length === 0 ? <p style={{ color: 'var(--text-muted)' }}>No appliances yet. Add one to start tracking.</p> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '.875rem' }}>
                {appliances.map(a => {
                  const daily = (a.wattage * a.quantity * a.hoursPerDay) / 1000;
                  const cost = daily * TARIFF;
                  return (
                    <div key={a.id} style={{ padding: '1rem 1.125rem', background: 'var(--surface)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <p style={{ fontWeight: 600, marginBottom: '.3rem' }}>{a.name} <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: '.83rem' }}>×{a.quantity}</span></p>
                        <div style={{ display: 'flex', gap: '1rem', fontSize: '.8rem', color: 'var(--text-muted)' }}>
                          <span>⚡ {a.wattage}W</span>
                          <span>⏱ {a.hoursPerDay}h/day</span>
                          <span style={{ color: 'var(--primary)' }}>≈ {cost.toFixed(0)} FCFA/day</span>
                        </div>
                      </div>
                      <button onClick={() => deleteAppliance(a.id)} className="btn btn-danger btn-sm">🗑</button>
                    </div>
                  );
                })}
                <div style={{ padding: '1rem', background: 'var(--primary-light)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(16,185,129,.2)' }}>
                  <p style={{ fontSize: '.85rem', color: 'var(--primary)', fontWeight: 600 }}>
                    Total Daily: {dailyKWh.toFixed(3)} kWh · {(dailyKWh * TARIFF).toFixed(0)} FCFA/day
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* PAYMENTS */}
      {tab === 'payments' && (
        <PaymentTab
          balance={balance}
          monthlyCost={monthlyCost}
          payments={payments}
          authH={authH}
          payMsg={payMsg}
          setPayMsg={setPayMsg}
          lastReceipt={lastReceipt}
          setLastReceipt={setLastReceipt}
          fetchAll={fetchAll}
        />
      )}

      {/* FAULTS */}
      {tab === 'faults' && (
        <div className="grid-2" style={{ alignItems: 'start' }}>
          <div className="card">
            <h3 style={{ marginBottom: '.5rem' }}>🔧 Report a Fault</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '.88rem', marginBottom: '1.5rem' }}>Describe your issue clearly. Our Buea team responds within 24 hours.</p>
            <Msg msg={faultMsg} />
            <form onSubmit={reportFault}>
              <div className="form-group">
                <label>Issue Description</label>
                <textarea className="input" rows={5} style={{ resize: 'vertical' }} placeholder="e.g. No power since 6am, meter reading seems wrong, connection sparking…" value={faultDesc} onChange={e => setFaultDesc(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Attach Picture (Optional)</label>
                <input type="file" accept="image/*" capture="environment" onChange={handleImageUpload} className="input" style={{ padding: '.5rem' }} />
                {faultImage && <img src={faultImage} alt="Preview" style={{ marginTop: '1rem', maxHeight: '150px', borderRadius: '8px' }} />}
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Submit & Send via WhatsApp</button>
            </form>
            <div style={{ marginTop: '1.25rem', padding: '1rem', background: 'var(--surface)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
              <p style={{ fontSize: '.85rem', color: 'var(--text-muted)' }}>📞 Urgent? Call us directly: <a href="tel:+237671176436" style={{ color: 'var(--primary)', fontWeight: 600 }}>+237 671 176 436</a></p>
            </div>
          </div>
          <div className="card">
            <div className="section-title">
              <h3>📋 My Fault Reports</h3>
              <span className="badge badge-yellow">{faults.filter(f => f.status === 'PENDING').length} pending</span>
            </div>
            {faults.length === 0 ? <p style={{ color: 'var(--text-muted)' }}>No reports submitted yet.</p> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '.875rem' }}>
                {faults.map(f => (
                  <div key={f.id} style={{ padding: '1rem 1.125rem', background: 'var(--surface)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '.5rem' }}>
                      <span style={{ fontSize: '.78rem', color: 'var(--text-muted)' }}>{new Date(f.createdAt).toLocaleDateString()}</span>
                      {statusBadge(f.status)}
                    </div>
                    <p style={{ fontSize: '.88rem' }}>{f.description}</p>
                    {f.imageUrl && <img src={f.imageUrl} alt="Fault Image" style={{ marginTop: '1rem', width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '8px' }} />}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
