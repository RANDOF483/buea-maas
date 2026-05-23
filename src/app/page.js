import Link from 'next/link';

export const metadata = {
  title: 'Buea MaaS | Smart Energy for Buea',
  description: 'Reliable, transparent, and affordable microgrid electricity for the Buea community. Monitor consumption, pay with Mobile Money, and get 24/7 support.',
};

const features = [
  { icon: '📱', title: 'Real-Time Monitoring', desc: 'Track your exact kWh consumption and FCFA cost live from any device — phone, tablet, or computer.' },
  { icon: '💳', title: 'Mobile Money Payments', desc: 'Top up instantly using MTN Mobile Money or Orange Money. No bank account needed.' },
  { icon: '🔌', title: 'Smart Appliance Tracking', desc: 'Register your appliances and see exactly which ones consume the most energy.' },
  { icon: '🛡️', title: '24/7 Fault Support', desc: 'Submit fault reports directly from the platform. Our Buea team responds within hours.' },
  { icon: '🧾', title: 'Digital Receipts', desc: 'Every payment generates a printable receipt with a unique transaction ID for your records.' },
  { icon: '📊', title: 'Usage Analytics', desc: 'Get monthly summaries, cost breakdowns, and projected bills before they arrive.' },
];

const steps = [
  { n: '01', title: 'Create Your Account', desc: 'Register online with your phone number in under 2 minutes. No paperwork required.' },
  { n: '02', title: 'Register Appliances', desc: 'Add your home appliances and let the system calculate your expected daily consumption.' },
  { n: '03', title: 'Top Up & Monitor', desc: 'Pay via Mobile Money and watch your real-time energy balance from your personal dashboard.' },
  { n: '04', title: 'Get Support Instantly', desc: 'Report any faults or billing issues and receive a response from our Buea-based technicians.' },
];

const stats = [
  { value: '4,200+', label: 'Homes Connected', icon: '🏠' },
  { value: '99.9%', label: 'Grid Uptime', icon: '⚡' },
  { value: '< 4h', label: 'Avg Fault Response', icon: '🔧' },
  { value: '0 FCFA', label: 'Hidden Fees', icon: '💚' },
];

export default function Home() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-badge animate">
            <span>⚡</span> Proudly serving Buea, Cameroon
          </div>
          <h1 className="animate-2" style={{ marginBottom: '1.5rem', maxWidth: '780px', margin: '0 auto 1.5rem' }}>
            Smart Energy Management<br />
            <span className="gradient-text">Built for Buea</span>
          </h1>
          <p className="animate-3" style={{ fontSize: '1.15rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 2.5rem', lineHeight: 1.8 }}>
            Reliable, transparent, and affordable electricity management for homes and businesses in the Buea community. Monitor consumption, pay bills, and report faults — all from your phone.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '4rem' }}>
            <Link href="/register" className="btn btn-primary btn-lg">
              Get Connected Free →
            </Link>
            <Link href="/about" className="btn btn-ghost btn-lg">
              Learn More
            </Link>
          </div>

          {/* Stats bar */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px', background: 'var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden', maxWidth: '800px', margin: '0 auto' }}>
            {stats.map(({ value, label, icon }) => (
              <div key={label} style={{ background: 'var(--bg-2)', padding: '1.25rem', textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '.25rem' }}>{icon}</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{value}</div>
                <div style={{ fontSize: '.78rem', color: 'var(--text-muted)', marginTop: '.2rem' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section style={{ padding: '5rem 0', background: 'var(--bg-2)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div className="hero-badge" style={{ marginBottom: '1rem' }}>⚙️ Platform Features</div>
            <h2>Everything You Need to Manage Your Energy</h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '550px', margin: '.75rem auto 0', lineHeight: 1.8 }}>
              One platform. Complete visibility over your energy usage, payments, and support history.
            </p>
          </div>
          <div className="grid-3">
            {features.map(({ icon, title, desc }) => (
              <div key={title} className="card feature-card">
                <div style={{ width: '48px', height: '48px', background: 'var(--primary-light)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginBottom: '1.25rem' }}>
                  {icon}
                </div>
                <h3 style={{ marginBottom: '.5rem', fontSize: '1rem' }}>{title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '.9rem', lineHeight: 1.7 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div className="hero-badge" style={{ marginBottom: '1rem' }}>🚀 How It Works</div>
            <h2>Up and Running in 4 Simple Steps</h2>
          </div>
          <div className="grid-4">
            {steps.map(({ n, title, desc }) => (
              <div key={n} style={{ textAlign: 'center', padding: '1.5rem' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg, rgba(16,185,129,.2), rgba(99,102,241,.2))', border: '1px solid rgba(16,185,129,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 800, fontSize: '1.1rem', color: 'var(--primary)' }}>
                  {n}
                </div>
                <h3 style={{ fontSize: '1rem', marginBottom: '.5rem' }}>{title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '.875rem', lineHeight: 1.7 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '5rem 0', background: 'var(--bg-2)', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '620px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '1rem' }}>Ready to Take Control of Your Energy?</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', fontSize: '1.05rem', lineHeight: 1.8 }}>
              Join over 4,200 Buea households already using our platform. Registration is free and takes less than 2 minutes.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/register" className="btn btn-primary btn-lg">Create Free Account →</Link>
              <Link href="/contact" className="btn btn-ghost btn-lg">Talk to Support</Link>
            </div>
            <p style={{ marginTop: '1.5rem', color: 'var(--text-faint)', fontSize: '.85rem' }}>
              Questions? Call us: <a href="tel:+237671176436" style={{ color: 'var(--primary)' }}>+237 671 176 436</a>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
