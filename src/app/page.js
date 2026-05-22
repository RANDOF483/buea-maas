import Link from 'next/link';

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section style={{ padding: '6rem 0', textAlign: 'center' }}>
        <div className="container animate-fade-in">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--primary)', borderRadius: '20px', marginBottom: '1.5rem', fontWeight: 600 }}>
            <span>⚡</span> Next-Gen Energy for Buea
          </div>
          <h1>
            Power Your Home With <br />
            <span className="gradient-text">Smart Grid</span> Technology.
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
            Reliable, transparent, and affordable electricity management for the Buea community. Control your consumption directly from your phone.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link href="/register" className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
              Get Started →
            </Link>
            <Link href="/contact" className="btn btn-glass" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container" style={{ padding: '4rem 0' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2>Why Choose Buea MaaS?</h2>
          <p style={{ color: 'var(--text-muted)' }}>We bring modern technology to rural and urban electrification.</p>
        </div>

        <div className="grid-3">
          <div className="glass-card" style={{ textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--primary)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '2rem' }}>
              📱
            </div>
            <h3>Smart Tracking</h3>
            <p style={{ color: 'var(--text-muted)' }}>Monitor your exact daily consumption in kWh and FCFA in real-time from your dashboard.</p>
          </div>
          <div className="glass-card" style={{ textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', background: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '2rem' }}>
              💳
            </div>
            <h3>Easy Payments</h3>
            <p style={{ color: 'var(--text-muted)' }}>Top up your balance instantly using MTN Mobile Money, Orange Money, or local transfers.</p>
          </div>
          <div className="glass-card" style={{ textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '2rem' }}>
              🛡️
            </div>
            <h3>24/7 Support</h3>
            <p style={{ color: 'var(--text-muted)' }}>Report faults instantly. Our Buea-based technicians are ready to resolve any grid issues.</p>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="container" style={{ padding: '4rem 0', marginTop: '2rem' }}>
        <div className="glass" style={{ padding: '3rem', display: 'flex', justifyContent: 'space-around', textAlign: 'center', flexWrap: 'wrap', gap: '2rem' }}>
          <div>
            <h2 className="gradient-text" style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>4.2k+</h2>
            <p style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Homes Connected</p>
          </div>
          <div>
            <h2 className="gradient-text" style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>99.9%</h2>
            <p style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Grid Uptime</p>
          </div>
          <div>
            <h2 className="gradient-text" style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>0 FCFA</h2>
            <p style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Hidden Fees</p>
          </div>
        </div>
      </section>
    </div>
  );
}
