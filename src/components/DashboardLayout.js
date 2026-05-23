'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({ children, nav, user, title, subtitle }) {
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem('maas_token');
    localStorage.removeItem('maas_user');
    router.push('/');
  };

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        {/* Logo */}
        <div className="sidebar-logo">
          <span style={{ background: 'linear-gradient(135deg,#10b981,#6366f1)', borderRadius: '8px', padding: '5px 9px', fontSize: '1rem' }}>⚡</span>
          <div>
            <div style={{ fontSize: '.95rem', fontWeight: 700 }}>Buea MaaS</div>
            <div style={{ fontSize: '.7rem', color: 'var(--text-muted)', fontWeight: 400 }}>Energy Platform</div>
          </div>
        </div>

        {/* Role Badge */}
        <div style={{ padding: '.875rem 1.25rem', borderBottom: '1px solid var(--border)' }}>
          <span className={`badge ${user?.role === 'ADMIN' ? 'badge-purple' : 'badge-green'}`} style={{ fontSize: '.7rem' }}>
            {user?.role === 'ADMIN' ? '⚙️ Administrator' : '👤 Client'}
          </span>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '.5rem 0' }}>
          {nav.map((section, si) => (
            <div key={si}>
              {section.label && <div className="sidebar-section">{section.label}</div>}
              {section.items.map((item) => (
                <button
                  key={item.id}
                  onClick={item.onClick}
                  className={`sidebar-item ${item.active ? 'active' : ''}`}
                >
                  <span className="icon">{item.icon}</span>
                  <span>{item.label}</span>
                  {item.badge && (
                    <span style={{ marginLeft: 'auto', background: 'var(--danger)', color: '#fff', fontSize: '.7rem', fontWeight: 700, padding: '1px 6px', borderRadius: '10px' }}>
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          ))}
        </nav>

        {/* Footer user */}
        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="avatar">{initials}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '.85rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name || 'Loading…'}</div>
              <div style={{ fontSize: '.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.phoneNumber}</div>
            </div>
            <button onClick={logout} title="Logout" style={{ background: 'none', border: 'none', color: 'var(--text-faint)', cursor: 'pointer', fontSize: '1rem', padding: '4px', borderRadius: '6px', transition: 'color .2s' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--danger)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-faint)'}
            >
              🚪
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{title}</h3>
            {subtitle && <p style={{ color: 'var(--text-muted)', fontSize: '.85rem', margin: 0 }}>{subtitle}</p>}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {user?.role !== 'ADMIN' && (
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '.75rem', color: 'var(--text-muted)' }}>Balance</div>
                <div style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '1rem' }}>
                  {(user?.balanceFCFA || 0).toLocaleString()} FCFA
                </div>
              </div>
            )}
            <div className="avatar" style={{ width: '38px', height: '38px' }}>{initials}</div>
          </div>
        </header>
        <div className="dashboard-content">{children}</div>
      </div>
    </div>
  );
}
