import Link from 'next/link';
export const metadata = { title: 'Services' };

const services = [
  { icon: '📟', title: 'Smart Metering', desc: 'Real-time energy monitoring through our cloud-connected platform. Track kWh usage and cost per appliance from any device.', features: ['Live consumption tracking', 'Appliance-level breakdown', 'Monthly usage reports', 'Automated billing alerts'] },
  { icon: '💳', title: 'Mobile Money Billing', desc: 'Pay your energy bills instantly using MTN or Orange Mobile Money. No bank account required — just your phone.', features: ['MTN Mobile Money', 'Orange Money', 'Instant balance top-up', 'Printable receipts'] },
  { icon: '🔧', title: 'Fault & Maintenance', desc: 'Report grid faults through our platform and receive a prioritized response from our Buea-based field technicians.', features: ['Online fault submission', 'Real-time status tracking', 'Priority escalation', '< 4hr response target'] },
  { icon: '📊', title: 'Energy Analytics', desc: 'Understand your consumption patterns with detailed monthly summaries and projected bill forecasts.', features: ['Daily/monthly breakdowns', 'Cost projections', 'Budget tracking', 'Export statements'] },
  { icon: '🏢', title: 'Business Connections', desc: 'Dedicated microgrid solutions for shops, schools, and small businesses in Buea with higher capacity meters.', features: ['Commercial metering', 'Priority support', 'Bulk payment options', 'Dedicated account manager'] },
  { icon: '🌐', title: 'Self-Service Portal', desc: 'Manage everything online 24/7 — no office visit required. Register, pay, and report all from your dashboard.', features: ['24/7 online access', 'Mobile-optimized', 'Multi-device sync', 'Secure login'] },
];

export default function ServicesPage() {
  return (
    <>
      <section style={{ padding: '5rem 0', textAlign: 'center', borderBottom: '1px solid var(--border)', background: 'var(--bg-2)' }}>
        <div className="container">
          <div className="hero-badge" style={{ marginBottom: '1rem' }}>⚡ What We Offer</div>
          <h1 style={{ marginBottom: '1.25rem' }}>Complete Energy Services<br /><span className="gradient-text">Under One Platform</span></h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: '580px', margin: '0 auto', fontSize: '1.05rem', lineHeight: 1.8 }}>
            From smart metering to mobile payments and fault resolution — everything your household needs to manage electricity effectively.
          </p>
        </div>
      </section>

      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          <div className="grid-3">
            {services.map(({ icon, title, desc, features }) => (
              <div key={title} className="card">
                <div style={{ width: '52px', height: '52px', background: 'var(--primary-light)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginBottom: '1.25rem' }}>{icon}</div>
                <h3 style={{ marginBottom: '.625rem' }}>{title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '.9rem', lineHeight: 1.7, marginBottom: '1.25rem' }}>{desc}</p>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '.4rem' }}>
                  {features.map(f => (
                    <li key={f} style={{ fontSize: '.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '.5rem' }}>
                      <span style={{ color: 'var(--primary)', flexShrink: 0 }}>✓</span> {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '4rem 0', background: 'var(--bg-2)', borderTop: '1px solid var(--border)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ marginBottom: '1rem' }}>Start Using All Services Free</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>No setup fee. No hidden charges. Just pay for the energy you use.</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link href="/register" className="btn btn-primary btn-lg">Get Started →</Link>
            <Link href="/contact" className="btn btn-ghost btn-lg">Ask a Question</Link>
          </div>
        </div>
      </section>
    </>
  );
}
