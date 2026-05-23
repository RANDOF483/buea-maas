import Link from 'next/link';
export const metadata = { title: 'About Us' };

const values = [
  { icon: '🎯', title: 'Our Mission', desc: 'To eradicate energy poverty in Buea and the South West Region by deploying smart, scalable microgrid technology that puts power back into the hands of local communities.' },
  { icon: '👁️', title: 'Our Vision', desc: 'A Buea where every home, school, and business has reliable, affordable electricity — managed transparently and paid for conveniently via mobile money.' },
  { icon: '🌱', title: 'Sustainability', desc: 'We invest in renewable energy sources and energy-efficient infrastructure to protect Cameroon\'s environment while keeping your lights on.' },
];

const team = [
  { initials: 'FM', name: 'Fanyu M.', role: 'Founder & CEO', color: '#10b981' },
  { initials: 'TK', name: 'Technical Lead', role: 'Grid Engineer', color: '#6366f1' },
  { initials: 'SN', name: 'Support Lead', role: 'Customer Success', color: '#f59e0b' },
];

export default function AboutPage() {
  return (
    <>
      <section style={{ padding: '5rem 0', textAlign: 'center', borderBottom: '1px solid var(--border)', background: 'var(--bg-2)' }}>
        <div className="container">
          <div className="hero-badge" style={{ marginBottom: '1rem' }}>🏢 Who We Are</div>
          <h1 style={{ marginBottom: '1.25rem' }}>Built for Buea.<br /><span className="gradient-text">Powered by Purpose.</span></h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: '650px', margin: '0 auto 2.5rem', fontSize: '1.05rem', lineHeight: 1.8 }}>
            Buea MaaS (Microgrid as a Service) is a Cameroonian-owned energy technology company dedicated to solving the electricity challenges facing urban and peri-urban communities in the South West Region.
          </p>
          <Link href="/register" className="btn btn-primary btn-lg">Join Our Platform →</Link>
        </div>
      </section>

      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          <div className="grid-3">
            {values.map(({ icon, title, desc }) => (
              <div key={title} className="card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{icon}</div>
                <h3 style={{ marginBottom: '.75rem' }}>{title}</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: '.92rem' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '5rem 0', background: 'var(--bg-2)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2>Why Buea Trusts Us</h2>
          </div>
          <div className="grid-4">
            {[['4,200+', 'Homes connected'], ['99.9%', 'Grid uptime SLA'], ['< 4 hrs', 'Fault response time'], ['100%', 'Mobile-first billing']].map(([v, l]) => (
              <div key={l} className="stat-card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'Plus Jakarta Sans', marginBottom: '.4rem' }}>{v}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '.85rem' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}><h2>Our Team</h2></div>
          <div className="grid-3" style={{ maxWidth: '700px', margin: '0 auto' }}>
            {team.map(({ initials, name, role, color }) => (
              <div key={name} className="card" style={{ textAlign: 'center' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: `linear-gradient(135deg, ${color}33, ${color}22)`, border: `2px solid ${color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontWeight: 800, fontSize: '1.1rem', color }}>{initials}</div>
                <h3 style={{ fontSize: '1rem', marginBottom: '.25rem' }}>{name}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '.85rem' }}>{role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '4rem 0', background: 'var(--bg-2)', borderTop: '1px solid var(--border)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ marginBottom: '1rem' }}>Ready to Get Connected?</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Join the Buea MaaS family and take control of your energy today.</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link href="/register" className="btn btn-primary btn-lg">Create Free Account</Link>
            <Link href="/contact" className="btn btn-ghost btn-lg">Contact Us</Link>
          </div>
        </div>
      </section>
    </>
  );
}
