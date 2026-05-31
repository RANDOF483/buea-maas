'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterAppliancesPage() {
  const router = useRouter();
  const [appliances, setAppliances] = useState([
    { name: 'Lights (Bulbs)', wattage: 15, quantity: 0, hoursPerDay: 6 },
    { name: 'Ceiling Fan', wattage: 75, quantity: 0, hoursPerDay: 8 },
    { name: 'Standing Fan', wattage: 50, quantity: 0, hoursPerDay: 8 },
    { name: 'Television (LED/LCD)', wattage: 100, quantity: 0, hoursPerDay: 5 },
    { name: 'Refrigerator', wattage: 150, quantity: 0, hoursPerDay: 24 },
    { name: 'Deep Freezer', wattage: 300, quantity: 0, hoursPerDay: 24 },
    { name: 'Electric Iron', wattage: 1000, quantity: 0, hoursPerDay: 0.5 },
    { name: 'Washing Machine', wattage: 500, quantity: 0, hoursPerDay: 1 },
    { name: 'Microwave', wattage: 800, quantity: 0, hoursPerDay: 0.5 },
    { name: 'Water Heater', wattage: 2000, quantity: 0, hoursPerDay: 1 },
    { name: 'Air Conditioner', wattage: 1500, quantity: 0, hoursPerDay: 6 },
    { name: 'Computer/Laptop', wattage: 65, quantity: 0, hoursPerDay: 4 },
  ]);

  const [customAppliance, setCustomAppliance] = useState({ name: '', wattage: '', quantity: 1, hoursPerDay: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Protect route
  useEffect(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem('maas_token')) {
      router.push('/login');
    }
  }, [router]);

  const handleApplianceChange = (index, field, value) => {
    const newAppliances = [...appliances];
    newAppliances[index][field] = field === 'name' ? value : Math.max(0, parseFloat(value) || 0);
    setAppliances(newAppliances);
  };

  const addCustomAppliance = () => {
    if (!customAppliance.name || !customAppliance.wattage || !customAppliance.hoursPerDay) {
      setError('Please fill in all details for the custom appliance.');
      return;
    }
    setAppliances([...appliances, { 
      name: customAppliance.name, 
      wattage: parseFloat(customAppliance.wattage), 
      quantity: parseInt(customAppliance.quantity) || 1, 
      hoursPerDay: parseFloat(customAppliance.hoursPerDay) 
    }]);
    setCustomAppliance({ name: '', wattage: '', quantity: 1, hoursPerDay: '' });
    setError('');
  };

  const submit = async () => {
    const selected = appliances.filter(a => a.quantity > 0);
    if (selected.length === 0) {
      router.push('/dashboard');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('maas_token');
      const res = await fetch('/api/appliances/bulk', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ appliances: selected })
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to save appliances.');
        setLoading(false);
        return;
      }

      router.push('/dashboard');
    } catch (err) {
      setError('Network error. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: '700px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'linear-gradient(135deg,#f59e0b,#ea580c)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', margin: '0 auto 1.25rem' }}>🔌</div>
          <h2 style={{ marginBottom: '.4rem' }}>Register Your Appliances</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '.9rem' }}>Step 2 of 2: Let&apos;s build your energy profile</p>
        </div>

        <div className="card">
          {error && <div className="alert alert-error">{error}</div>}
          
          <p style={{ marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
            Please specify the quantity and average daily usage for the appliances in your home. This helps us accurately estimate your energy consumption and costs.
          </p>

          <div style={{ background: 'var(--bg-secondary)', borderRadius: '8px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '400px', overflowY: 'auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.8rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border)' }}>
              <span>Appliance</span>
              <span style={{ textAlign: 'center' }}>Quantity</span>
              <span style={{ textAlign: 'center' }}>Hours/Day</span>
            </div>
            
            {appliances.map((app, idx) => (
              <div key={idx} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{app.name}</span>
                  <span style={{ color: 'var(--text-faint)', fontSize: '0.75rem' }}>{app.wattage}W</span>
                </div>
                <input type="number" min="0" className="input" style={{ padding: '0.5rem', textAlign: 'center' }} value={app.quantity} onChange={(e) => handleApplianceChange(idx, 'quantity', e.target.value)} />
                <input type="number" min="0" max="24" step="0.5" className="input" style={{ padding: '0.5rem', textAlign: 'center' }} value={app.hoursPerDay} onChange={(e) => handleApplianceChange(idx, 'hoursPerDay', e.target.value)} />
              </div>
            ))}
          </div>

          <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
            <h4 style={{ marginBottom: '1rem' }}>Don&apos;t see your appliance? Add a custom one:</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: '0.5rem', alignItems: 'start' }}>
              <input type="text" className="input" placeholder="Name" value={customAppliance.name} onChange={e => setCustomAppliance({...customAppliance, name: e.target.value})} />
              <input type="number" className="input" placeholder="Watts" value={customAppliance.wattage} onChange={e => setCustomAppliance({...customAppliance, wattage: e.target.value})} />
              <input type="number" className="input" placeholder="Qty" value={customAppliance.quantity} onChange={e => setCustomAppliance({...customAppliance, quantity: e.target.value})} />
              <input type="number" className="input" placeholder="Hrs/Day" value={customAppliance.hoursPerDay} onChange={e => setCustomAppliance({...customAppliance, hoursPerDay: e.target.value})} />
              <button type="button" onClick={addCustomAppliance} className="btn btn-primary" style={{ padding: '0.65rem 1rem' }}>Add</button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem' }}>
            <button onClick={() => router.push('/dashboard')} className="btn btn-ghost" style={{ flex: 1 }}>
              Skip for now
            </button>
            <button onClick={submit} className="btn btn-primary" style={{ flex: 2 }} disabled={loading}>
              {loading ? 'Saving Profile...' : 'Complete Setup →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
