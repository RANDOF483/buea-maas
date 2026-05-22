import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'Buea MaaS | Next-Gen Energy Platform',
  description: 'Professional Microgrid as a Service platform for the Buea case study.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <nav style={{ padding: '1.5rem 0', borderBottom: '1px solid var(--glass-border)', background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 100 }}>
          <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link href="/" style={{ fontSize: '1.5rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: 'var(--primary)' }}>⚡</span> Buea MaaS
            </Link>
            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
              <Link href="/">Home</Link>
              <Link href="/dashboard">Dashboard</Link>
              <Link href="/contact" style={{ color: 'var(--text-muted)' }}>Support</Link>
              <Link href="/login" className="btn btn-primary" style={{ padding: '0.5rem 1.25rem' }}>Login</Link>
            </div>
          </div>
        </nav>
        <main style={{ paddingBottom: '4rem' }}>
          {children}
        </main>
        <footer style={{ padding: '3rem 0', borderTop: '1px solid var(--glass-border)', textAlign: 'center', color: 'var(--text-muted)' }}>
          <div className="container">
            <p>© {new Date().getFullYear()} Buea Microgrid Services. All rights reserved.</p>
            <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>Contact: +237 671 176 436 | fanyu427@gmail.com</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
