import './globals.css';
import PublicNav from '@/components/PublicNav';

export const metadata = {
  title: { default: 'Buea MaaS | Microgrid as a Service', template: '%s | Buea MaaS' },
  description: 'Professional Microgrid as a Service platform for the Buea community — smart energy management, mobile payments, and 24/7 support.',
};

const footerLinks = [
  { label: 'About Us', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Contact', href: '/contact' },
];

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <PublicNav />
        <main>{children}</main>
        <footer style={{
          padding: '3rem 0',
          borderTop: '1px solid var(--border)',
          background: 'var(--bg-2)',
        }}>
          <div className="container">
            <div className="grid-3" style={{ gap: '3rem', marginBottom: '2.5rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '1.5rem' }}>⚡</span>
                  <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>Buea MaaS</span>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '.9rem', lineHeight: 1.7 }}>
                  Bringing smart, reliable, and affordable electricity management to the Buea community.
                </p>
              </div>
              <div>
                <h4 style={{ marginBottom: '1rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '.85rem', textTransform: 'uppercase', letterSpacing: '.05em' }}>Company</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '.6rem' }}>
                  {footerLinks.map(({ label, href }) => (
                    <a key={href} href={href} style={{ color: 'var(--text-muted)', fontSize: '.9rem' }}>{label}</a>
                  ))}
                </div>
              </div>
              <div>
                <h4 style={{ marginBottom: '1rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '.85rem', textTransform: 'uppercase', letterSpacing: '.05em' }}>Contact</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '.6rem', fontSize: '.9rem', color: 'var(--text-muted)' }}>
                  <a href="tel:+237671176436" style={{ color: 'var(--text-muted)' }}>📞 +237 671 176 436</a>
                  <a href="https://wa.me/237671176436" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-muted)' }}>💬 WhatsApp Support</a>
                  <a href="mailto:fanyu427@gmail.com" style={{ color: 'var(--text-muted)' }}>✉️ fanyu427@gmail.com</a>
                  <span>📍 Buea Town, South West, CMR</span>
                </div>
              </div>
            </div>
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <p style={{ color: 'var(--text-faint)', fontSize: '.85rem' }}>© {new Date().getFullYear()} Buea Microgrid Services Ltd. All rights reserved.</p>
              <p style={{ color: 'var(--text-faint)', fontSize: '.85rem' }}>Powering Buea, one home at a time. ⚡</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
