'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';

export default function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState('overview');
  const [adminUser, setAdminUser] = useState(null);
  const [overview, setOverview] = useState(null);
  const [users, setUsers] = useState([]);
  const [faults, setFaults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editBalance, setEditBalance] = useState({});
  const [balMsg, setBalMsg] = useState(null);
  const [faultLoading, setFaultLoading] = useState('');
  const [resettingUser, setResettingUser] = useState(null);
  const [tempPasswordModal, setTempPasswordModal] = useState(null);

  const getToken = () => typeof window !== 'undefined' ? localStorage.getItem('maas_token') : null;
  const authH = () => ({ Authorization: `Bearer ${getToken()}` });

  const fetchData = useCallback(async () => {
    const token = getToken();
    if (!token) { router.push('/login'); return; }
    setLoading(true);
    const [ovRes, uRes, fRes] = await Promise.all([
      fetch('/api/admin', { headers: { Authorization: `Bearer ${token}` } }),
      fetch('/api/admin/users', { headers: { Authorization: `Bearer ${token}` } }),
      fetch('/api/admin/faults', { headers: { Authorization: `Bearer ${token}` } }),
    ]);
    if (ovRes.status === 403 || ovRes.status === 401) { router.push('/login'); return; }
    const ov = await ovRes.json();
    const us = await uRes.json();
    const fs = await fRes.json();
    setOverview(ov);
    setUsers(Array.isArray(us) ? us : []);
    setFaults(Array.isArray(fs) ? fs : []);
    const stored = localStorage.getItem('maas_user');
    if (stored) setAdminUser(JSON.parse(stored));
    setLoading(false);
  }, [router]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const updateBalance = async (userId) => {
    const newBal = editBalance[userId];
    if (newBal === undefined || newBal === '') return;
    const res = await fetch('/api/admin/users', { method: 'PATCH', headers: { ...authH(), 'Content-Type': 'application/json' }, body: JSON.stringify({ userId, balanceFCFA: parseFloat(newBal) }) });
    const d = await res.json();
    setBalMsg(res.ok ? { ok: true, text: `✅ Balance updated for ${d.name}` } : { ok: false, text: d.error });
    if (res.ok) { setEditBalance({}); fetchData(); }
  };

  const updateFaultStatus = async (faultId, status) => {
    setFaultLoading(faultId);
    await fetch('/api/admin/faults', { method: 'PATCH', headers: { ...authH(), 'Content-Type': 'application/json' }, body: JSON.stringify({ faultId, status }) });
    setFaultLoading('');
    fetchData();
  };

  const statusBadge = (s) => {
    const map = { PENDING: 'badge-yellow', IN_PROGRESS: 'badge-blue', RESOLVED: 'badge-green' };
    return <span className={`badge ${map[s] || 'badge-yellow'}`}>{s?.replace('_', ' ')}</span>;
  };

  const handlePasswordReset = async (userId) => {
    setResettingUser(userId);
    try {
      const res = await fetch('/api/admin/reset-password', {
        method: 'POST',
        headers: { ...authH(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      const data = await res.json();
      if (res.ok) {
        setTempPasswordModal({ phone: data.userPhone, tempPassword: data.tempPassword });
        fetchData();
      } else {
        alert(data.error || 'Failed to reset password');
      }
    } catch {
      alert('Network error while resetting password.');
    }
    setResettingUser(null);
  };

  const navSections = [
    {
      label: 'Administration',
      items: [
        { id: 'overview', icon: '📊', label: 'Overview', active: tab === 'overview', onClick: () => setTab('overview') },
        { id: 'users', icon: '👥', label: 'User Management', active: tab === 'users', onClick: () => setTab('users'), badge: users.length || undefined },
        { id: 'faults', icon: '🔧', label: 'Fault Management', active: tab === 'faults', onClick: () => setTab('faults'), badge: faults.filter(f => f.status === 'PENDING').length || undefined },
        { id: 'resets', icon: '🔐', label: 'Password Resets', active: tab === 'resets', onClick: () => setTab('resets'), badge: users.filter(u => u.resetRequested).length || undefined },
      ],
    },
    {
      label: 'System',
      items: [
        { id: 'public', icon: '🌐', label: 'View Public Site', active: false, onClick: () => window.open('/', '_blank') },
      ],
    },
  ];

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: '3px solid var(--border)', borderTopColor: 'var(--primary)', animation: 'spin 1s linear infinite' }} />
      <p style={{ color: 'var(--text-muted)' }}>Loading admin panel…</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <DashboardLayout
      nav={navSections}
      user={adminUser}
      title={{ overview: '⚙️ Admin Overview', users: '👥 User Management', faults: '🔧 Fault Management', resets: '🔐 Password Resets' }[tab]}
      subtitle={{ overview: 'Buea Microgrid Control Center', users: 'Manage all registered clients and their balances.', faults: 'Track, update and resolve all reported grid faults.', resets: 'Manage users who forgot their passwords.' }[tab]}
    >
      {/* OVERVIEW */}
      {tab === 'overview' && (
        <div>
          <div className="grid-4" style={{ marginBottom: '2rem' }}>
            {[
              { icon: '👥', label: 'Total Clients', value: overview?.totalUsers || 0, color: 'var(--primary)' },
              { icon: '💰', label: 'Total Revenue', value: `${(overview?.totalRevenueFCFA || 0).toLocaleString()} FCFA`, color: '#34d399' },
              { icon: '🔧', label: 'Total Faults', value: overview?.totalFaults || 0, color: 'var(--warning)' },
              { icon: '⚠️', label: 'Pending Faults', value: overview?.pendingFaults || 0, color: 'var(--danger)' },
            ].map(({ icon, label, value, color }) => (
              <div key={label} className="stat-card">
                <div style={{ fontSize: '1.75rem', marginBottom: '.75rem' }}>{icon}</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{value}</div>
                <div style={{ fontSize: '.8rem', color: 'var(--text-muted)', marginTop: '.25rem' }}>{label}</div>
              </div>
            ))}
          </div>

          <div className="grid-2" style={{ gap: '1.5rem' }}>
            <div className="card">
              <div className="section-title">
                <h3>👥 Recent Clients</h3>
                <button onClick={() => setTab('users')} className="btn btn-ghost btn-sm">View All</button>
              </div>
              <table className="table">
                <thead><tr><th>Name</th><th>Phone</th><th>Balance</th></tr></thead>
                <tbody>
                  {(overview?.recentUsers || []).map(u => (
                    <tr key={u.id}>
                      <td style={{ fontWeight: 500 }}>{u.name}</td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '.85rem' }}>{u.phoneNumber}</td>
                      <td style={{ color: 'var(--primary)', fontWeight: 600 }}>{u.balanceFCFA.toLocaleString()} FCFA</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="card">
              <div className="section-title">
                <h3>🔧 Recent Faults</h3>
                <button onClick={() => setTab('faults')} className="btn btn-ghost btn-sm">Manage</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
                {(overview?.recentFaults || []).slice(0, 4).map(f => (
                  <div key={f.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '.875rem', background: 'var(--surface)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                    <div>
                      <p style={{ fontWeight: 500, fontSize: '.88rem' }}>{f.user?.name}</p>
                      <p style={{ color: 'var(--text-muted)', fontSize: '.8rem' }}>{f.description?.slice(0, 45)}…</p>
                    </div>
                    {statusBadge(f.status)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* USER MANAGEMENT */}
      {tab === 'users' && (
        <div className="card">
          <div className="section-title">
            <h3>All Registered Clients</h3>
            <span className="badge badge-blue">{users.length} total</span>
          </div>
          {balMsg && <div className={`alert ${balMsg.ok ? 'alert-success' : 'alert-error'}`}>{balMsg.text}</div>}
          <table className="table">
            <thead>
              <tr>
                <th>Client Name</th>
                <th>Phone</th>
                <th>Appliances</th>
                <th>Payments</th>
                <th>Balance (FCFA)</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
                      <div className="avatar" style={{ width: '32px', height: '32px', fontSize: '.8rem' }}>
                        {u.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p style={{ fontWeight: 600, fontSize: '.9rem' }}>{u.name}</p>
                        {u.email && <p style={{ color: 'var(--text-muted)', fontSize: '.78rem' }}>{u.email}</p>}
                      </div>
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '.85rem' }}>{u.phoneNumber}</td>
                  <td><span className="badge badge-blue">{u._count?.appliances || 0}</span></td>
                  <td><span className="badge badge-green">{u._count?.payments || 0}</span></td>
                  <td style={{ fontWeight: 600, color: 'var(--primary)' }}>{u.balanceFCFA.toLocaleString()}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '.5rem', alignItems: 'center' }}>
                      <input
                        type="number"
                        placeholder="New balance"
                        className="input"
                        style={{ width: '120px', padding: '.35rem .6rem', fontSize: '.82rem' }}
                        value={editBalance[u.id] ?? ''}
                        onChange={e => setEditBalance({ ...editBalance, [u.id]: e.target.value })}
                      />
                      <button onClick={() => updateBalance(u.id)} className="btn btn-primary btn-sm">Set</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* FAULT MANAGEMENT */}
      {tab === 'faults' && (
        <div className="card">
          <div className="section-title">
            <h3>All Fault Reports</h3>
            <div style={{ display: 'flex', gap: '.5rem' }}>
              <span className="badge badge-yellow">{faults.filter(f => f.status === 'PENDING').length} Pending</span>
              <span className="badge badge-blue">{faults.filter(f => f.status === 'IN_PROGRESS').length} In Progress</span>
              <span className="badge badge-green">{faults.filter(f => f.status === 'RESOLVED').length} Resolved</span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {faults.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No fault reports submitted yet.</p>}
            {faults.map(f => (
              <div key={f.id} style={{ padding: '1.25rem', background: 'var(--surface)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: '.75rem', alignItems: 'center', marginBottom: '.5rem', flexWrap: 'wrap' }}>
                      <p style={{ fontWeight: 600, fontSize: '.9rem' }}>{f.user?.name}</p>
                      <span style={{ color: 'var(--text-muted)', fontSize: '.82rem' }}>{f.user?.phoneNumber}</span>
                      <span style={{ color: 'var(--text-faint)', fontSize: '.78rem' }}>{new Date(f.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p style={{ fontSize: '.9rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{f.description}</p>
                    {f.imageUrl && <img src={f.imageUrl} alt="Attached fault picture" style={{ marginTop: '.75rem', width: '100%', maxWidth: '300px', borderRadius: '8px', border: '1px solid var(--border)' }} />}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem', alignItems: 'flex-end', minWidth: '140px' }}>
                    {statusBadge(f.status)}
                    {f.status !== 'RESOLVED' && (
                      <div style={{ display: 'flex', gap: '.4rem', flexWrap: 'wrap' }}>
                        {f.status === 'PENDING' && (
                          <button onClick={() => updateFaultStatus(f.id, 'IN_PROGRESS')} className="btn btn-accent btn-sm" disabled={faultLoading === f.id}>
                            {faultLoading === f.id ? '…' : '▶ Start'}
                          </button>
                        )}
                        {f.status !== 'RESOLVED' && (
                          <button onClick={() => updateFaultStatus(f.id, 'RESOLVED')} className="btn btn-primary btn-sm" disabled={faultLoading === f.id}>
                            {faultLoading === f.id ? '…' : '✅ Resolve'}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PASSWORD RESETS */}
      {tab === 'resets' && (
        <div className="card">
          <div className="section-title">
            <h3>Password Reset Requests</h3>
            <span className="badge badge-yellow">{users.filter(u => u.resetRequested).length} Pending</span>
          </div>

          {tempPasswordModal && (
            <div className="alert alert-success" style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <strong>✅ Password Reset Successfully!</strong><br/>
                Temporary password for {tempPasswordModal.phone}: 
                <span style={{ fontSize: '1.25rem', fontWeight: 'bold', letterSpacing: '2px', background: '#fff', padding: '4px 12px', borderRadius: '4px', margin: '0 10px', color: '#000' }}>
                  {tempPasswordModal.tempPassword}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <a href={`https://wa.me/${tempPasswordModal.phone.replace('+', '')}?text=${encodeURIComponent(`Hello! Your new temporary password for Buea MaaS is: ${tempPasswordModal.tempPassword}. Please log in and remember to change it later.`)}`} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">
                  Send via WhatsApp
                </a>
                <button onClick={() => setTempPasswordModal(null)} className="btn btn-ghost btn-sm">Dismiss</button>
              </div>
            </div>
          )}

          {users.filter(u => u.resetRequested).length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>No pending password reset requests.</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Client Name</th>
                  <th>Phone Number</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.filter(u => u.resetRequested).map(u => (
                  <tr key={u.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
                        <div className="avatar" style={{ width: '32px', height: '32px', fontSize: '.8rem' }}>
                          {u.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                        </div>
                        <p style={{ fontWeight: 600, fontSize: '.9rem' }}>{u.name}</p>
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-muted)' }}>{u.phoneNumber}</td>
                    <td>
                      <button 
                        className="btn btn-primary btn-sm" 
                        onClick={() => handlePasswordReset(u.id)}
                        disabled={resettingUser === u.id}
                      >
                        {resettingUser === u.id ? 'Resetting...' : '🔑 Generate Temp Password'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </DashboardLayout>
  );
}
