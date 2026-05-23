import Link from 'next/link';
export const metadata = { title: 'Contact & Support' };

export default function ContactPage() {
  return (
    <>
      <section style={{ padding: '5rem 0', textAlign: 'center', borderBottom: '1px solid var(--border)', background: 'var(--bg-2)' }}>
        <div className="container">
          <div className="hero-badge" style={{ marginBottom: '1rem' }}>📞 Get In Touch</div>
          <h1 style={{ marginBottom: '1.25rem' }}>We&apos;re Here to <span className="gradient-text">Help You</span></h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: '540px', margin: '0 auto', fontSize: '1.05rem', lineHeight: 1.8 }}>
            Our Buea-based team handles billing questions, technical faults, and account issues 7 days a week.
          </p>
        </div>
      </section>

      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          <div className="grid-2" style={{ gap: '2rem', marginBottom: '3rem' }}>
            <div className="card">
              <div style={{ fontSize: '2.5rem', marginBottom: '1.25rem' }}>📱</div>
              <h3 style={{ marginBottom: '.5rem' }}>WhatsApp & Phone</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '.9rem', marginBottom: '1.5rem' }}>Available Monday – Saturday, 7am – 8pm. Emergency line active 24/7.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
                <a href="https://wa.me/237671176436" target="_blank" rel="noopener noreferrer" className="btn btn-primary">💬 Chat on WhatsApp: +237 671 176 436</a>
                <a href="tel:+237671176436" className="btn btn-ghost">📞 Call: +237 671 176 436</a>
              </div>
            </div>

            <div className="card">
              <div style={{ fontSize: '2.5rem', marginBottom: '1.25rem' }}>✉️</div>
              <h3 style={{ marginBottom: '.5rem' }}>Email Support</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '.9rem', marginBottom: '1.5rem' }}>Send us a detailed message and we&apos;ll respond within 24 hours on business days.</p>
              <a href="mailto:fanyu427@gmail.com" className="btn btn-primary" style={{ width: '100%' }}>📧 fanyu427@gmail.com</a>
            </div>
          </div>

          <div className="grid-3" style={{ marginBottom: '4rem' }}>
            {[
              { icon: '📍', title: 'Office Location', lines: ['Buea Town', 'South West Region', 'Cameroon'] },
              { icon: '⏰', title: 'Working Hours', lines: ['Mon – Fri: 8am – 6pm', 'Saturday: 9am – 3pm', 'Emergency: 24/7'] },
              { icon: '🔧', title: 'Report a Fault Fast', lines: ['Log in to your dashboard', 'Click "Report a Fault"', 'Track status in real time'] },
            ].map(({ icon, title, lines }) => (
              <div key={title} className="card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{icon}</div>
                <h3 style={{ marginBottom: '.875rem' }}>{title}</h3>
                {lines.map(l => <p key={l} style={{ color: 'var(--text-muted)', fontSize: '.9rem', marginBottom: '.3rem' }}>{l}</p>)}
              </div>
            ))}
          </div>

          <div className="card" style={{ textAlign: 'center', padding: '3rem', background: 'linear-gradient(135deg, rgba(16,185,129,.06), rgba(99,102,241,.06))', borderColor: 'rgba(16,185,129,.2)' }}>
            <h2 style={{ marginBottom: '1rem' }}>Ready to Join the Grid?</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '1.05rem' }}>Create a free account and start managing your energy in minutes.</p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/register" className="btn btn-primary btn-lg">Get Started Free →</Link>
              <Link href="/services" className="btn btn-ghost btn-lg">View Services</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
