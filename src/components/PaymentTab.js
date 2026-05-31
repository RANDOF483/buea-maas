'use client';
import { useState } from 'react';

const COMPANY = {
  MTN: { number: '671 176 436', name: 'BUEA MAAS ENERGY', ussd: '*126#', color: '#fbbf24', bg: 'rgba(251,191,36,0.08)', border: 'rgba(251,191,36,0.3)', icon: '📱' },
  ORANGE: { number: '699 123 456', name: 'BUEA MAAS ENERGY', ussd: '#150*1#', color: '#f97316', bg: 'rgba(249,115,22,0.08)', border: 'rgba(249,115,22,0.3)', icon: '🟠' },
};

const QUICK_AMOUNTS = [1000, 2000, 5000, 10000, 20000, 50000];

export default function PaymentTab({ balance, monthlyCost, payments, authH, setLastReceipt, lastReceipt, fetchAll }) {
  const [step, setStep] = useState(1); // 1=select, 2=instructions, 3=confirm, 4=success
  const [method, setMethod] = useState('MTN');
  const [amount, setAmount] = useState('');
  const [txRef, setTxRef] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const company = COMPANY[method];
  const dailyCost = monthlyCost / 30;
  const daysOfCredit = amount ? Math.floor(parseFloat(amount) / (dailyCost || 1)) : 0;

  const handleNext = () => {
    if (!amount || parseFloat(amount) < 500) { setError('Minimum payment is 500 FCFA.'); return; }
    setError('');
    setStep(2);
  };

  const handleConfirm = async () => {
    if (!txRef.trim()) { setError('Please enter your transaction reference number.'); return; }
    setLoading(true);
    setError('');
    const res = await fetch('/api/payments', {
      method: 'POST',
      headers: { ...authH(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ amountFCFA: parseFloat(amount), method, transactionRef: txRef.trim() }),
    });
    const d = await res.json();
    setLoading(false);
    if (res.ok) {
      setLastReceipt(d.payment);
      fetchAll();
      setStep(4);
    } else {
      setError(d.error || 'Payment failed. Please try again.');
    }
  };

  const reset = () => { setStep(1); setAmount(''); setTxRef(''); setError(''); setLastReceipt(null); };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'start' }}>

      {/* LEFT: Payment flow card */}
      <div className="card">

        {/* Step indicators */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0', marginBottom: '2rem' }}>
          {['Select Amount', 'Pay via MoMo', 'Confirm'].map((label, i) => {
            const s = i + 1;
            const active = step === s;
            const done = step > s;
            return (
              <div key={s} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '.8rem', fontWeight: 700,
                    background: done ? 'var(--primary)' : active ? 'var(--primary)' : 'var(--surface)',
                    color: (done || active) ? '#fff' : 'var(--text-muted)',
                    border: active ? '2px solid var(--primary)' : done ? 'none' : '2px solid var(--border)',
                    transition: 'all 0.3s',
                  }}>
                    {done ? '✓' : s}
                  </div>
                  <span style={{ fontSize: '.7rem', color: active ? 'var(--primary)' : 'var(--text-muted)', marginTop: '.35rem', textAlign: 'center' }}>{label}</span>
                </div>
                {i < 2 && <div style={{ height: '2px', width: '24px', background: step > s ? 'var(--primary)' : 'var(--border)', marginBottom: '18px', transition: 'background 0.3s' }} />}
              </div>
            );
          })}
        </div>

        {error && <div className="alert alert-error" style={{ marginBottom: '1rem' }}>{error}</div>}

        {/* STEP 1 */}
        {step === 1 && (
          <div>
            <h3 style={{ marginBottom: '.25rem' }}>💳 Pay Your Energy Bill</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '.88rem', marginBottom: '1.5rem' }}>
              Balance: <strong style={{ color: 'var(--primary)' }}>{balance.toLocaleString()} FCFA</strong>
              {dailyCost > 0 && <> · Daily cost: <strong>{dailyCost.toFixed(0)} FCFA</strong></>}
            </p>

            <div className="form-group">
              <label>Payment Method</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.75rem' }}>
                {Object.entries(COMPANY).map(([m, c]) => (
                  <button key={m} type="button" onClick={() => setMethod(m)} style={{
                    padding: '1rem', border: `2px solid ${method === m ? c.color : 'var(--border)'}`,
                    borderRadius: '10px', background: method === m ? c.bg : 'var(--surface)',
                    cursor: 'pointer', transition: 'all 0.2s', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '.4rem',
                  }}>
                    <span style={{ fontSize: '1.5rem' }}>{c.icon}</span>
                    <span style={{ fontWeight: 700, fontSize: '.85rem', color: method === m ? c.color : 'var(--text)' }}>{m} MoMo</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Quick Amounts (FCFA)</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '.5rem', marginBottom: '.75rem' }}>
                {QUICK_AMOUNTS.map(a => (
                  <button key={a} type="button" onClick={() => setAmount(String(a))} style={{
                    padding: '.6rem', border: `1.5px solid ${amount == a ? 'var(--primary)' : 'var(--border)'}`,
                    borderRadius: '8px', background: amount == a ? 'var(--primary-light)' : 'var(--surface)',
                    cursor: 'pointer', fontSize: '.82rem', fontWeight: 600, color: amount == a ? 'var(--primary)' : 'var(--text)',
                  }}>
                    {a.toLocaleString()}
                  </button>
                ))}
              </div>
              <input className="input" type="number" min="500" step="500" placeholder="Or enter custom amount…"
                value={amount} onChange={e => setAmount(e.target.value)} />
              {amount && parseFloat(amount) > 0 && dailyCost > 0 && (
                <p style={{ fontSize: '.8rem', color: 'var(--primary)', marginTop: '.5rem' }}>
                  ≈ <strong>{daysOfCredit} days</strong> of energy credit at your current usage
                </p>
              )}
            </div>

            <button onClick={handleNext} className="btn btn-primary" style={{ width: '100%', padding: '.875rem' }}>
              Continue to Payment →
            </button>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div>
            <h3 style={{ marginBottom: '.25rem' }}>📲 Send Payment via {method} MoMo</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '.88rem', marginBottom: '1.5rem' }}>
              Follow these steps on your phone to complete the payment:
            </p>

            <div style={{ background: company.bg, border: `1.5px solid ${company.border}`, borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontSize: '.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.05em' }}>Send To</span>
                <span style={{ fontSize: '.8rem', color: company.color, fontWeight: 700 }}>{method} Mobile Money</span>
              </div>
              <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: company.color, letterSpacing: '.1em', fontFamily: 'monospace' }}>{company.number}</div>
                <div style={{ fontSize: '.85rem', color: 'var(--text-muted)', marginTop: '.3rem' }}>{company.name}</div>
              </div>
              <div style={{ borderTop: `1px solid ${company.border}`, paddingTop: '1rem', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '.9rem', color: 'var(--text-muted)' }}>Amount to send</span>
                <span style={{ fontSize: '1.1rem', fontWeight: 800, color: company.color }}>{parseFloat(amount).toLocaleString()} FCFA</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem', marginBottom: '1.5rem' }}>
              {[
                { step: '1', text: `Dial ${company.ussd} on your ${method} SIM` },
                { step: '2', text: `Select "Transfer Money" or "Send Money"` },
                { step: '3', text: `Enter number: ${company.number}` },
                { step: '4', text: `Enter amount: ${parseFloat(amount).toLocaleString()} FCFA` },
                { step: '5', text: 'Enter your PIN and confirm the payment' },
                { step: '6', text: 'Save the SMS confirmation reference number' },
              ].map(({ step: s, text }) => (
                <div key={s} style={{ display: 'flex', gap: '.875rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: company.color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.78rem', fontWeight: 700, flexShrink: 0 }}>{s}</div>
                  <p style={{ fontSize: '.88rem', paddingTop: '4px' }}>{text}</p>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '.75rem' }}>
              <button onClick={() => setStep(1)} className="btn btn-ghost" style={{ flex: 1 }}>← Back</button>
              <button onClick={() => setStep(3)} className="btn btn-primary" style={{ flex: 2 }}>I've Sent the Money →</button>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div>
            <h3 style={{ marginBottom: '.25rem' }}>✅ Confirm Your Payment</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '.88rem', marginBottom: '1.5rem' }}>
              Enter the transaction reference from the SMS confirmation you received from {method}.
            </p>

            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '10px', padding: '1rem', marginBottom: '1.5rem', fontSize: '.88rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '.5rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Method</span>
                <span style={{ fontWeight: 600 }}>{method} Mobile Money</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '.5rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Sent To</span>
                <span style={{ fontWeight: 600, fontFamily: 'monospace' }}>{company.number}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '.5rem', marginTop: '.5rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Amount</span>
                <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1.05rem' }}>{parseFloat(amount).toLocaleString()} FCFA</span>
              </div>
            </div>

            <div className="form-group">
              <label>Transaction Reference / ID <span style={{ color: 'var(--danger)' }}>*</span></label>
              <input className="input" placeholder="e.g. MP251234567890" value={txRef} onChange={e => setTxRef(e.target.value)} style={{ fontFamily: 'monospace', letterSpacing: '.05em' }} />
              <p style={{ fontSize: '.78rem', color: 'var(--text-muted)', marginTop: '.4rem' }}>
                Found in the SMS sent by {method} after payment. Example: <em>MP25XXXXXXXXXX</em>
              </p>
            </div>

            <div style={{ display: 'flex', gap: '.75rem', marginTop: '1.25rem' }}>
              <button onClick={() => setStep(2)} className="btn btn-ghost" style={{ flex: 1 }} disabled={loading}>← Back</button>
              <button onClick={handleConfirm} className="btn btn-primary" style={{ flex: 2 }} disabled={loading}>
                {loading ? '⏳ Verifying...' : '✅ Confirm Payment'}
              </button>
            </div>
          </div>
        )}

        {/* STEP 4 — Success */}
        {step === 4 && lastReceipt && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '.75rem' }}>🎉</div>
            <h3 style={{ color: 'var(--primary)', marginBottom: '.5rem' }}>Payment Confirmed!</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '.9rem', marginBottom: '1.5rem' }}>
              Your account has been credited successfully.
            </p>

            <div style={{ background: 'rgba(16,185,129,.06)', border: '1.5px solid rgba(16,185,129,.25)', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.5rem', textAlign: 'left' }}>
              <h4 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>📄 Transaction Receipt</h4>
              {[
                ['Transaction ID', lastReceipt.transactionId],
                ['Reference', lastReceipt.transactionRef || txRef],
                ['Method', lastReceipt.method + ' Mobile Money'],
                ['Date', new Date(lastReceipt.createdAt).toLocaleString()],
                ['Status', '✅ Completed'],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '.5rem 0', borderBottom: '1px solid var(--border)', fontSize: '.85rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{k}</span><span style={{ fontWeight: 500 }}>{v}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '.75rem 0 0', fontWeight: 800, fontSize: '1.05rem' }}>
                <span>Amount Credited</span>
                <span style={{ color: 'var(--primary)' }}>{lastReceipt.amountFCFA?.toLocaleString()} FCFA</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '.75rem' }}>
              <button onClick={() => window.print()} className="btn btn-ghost" style={{ flex: 1 }}>🖨 Print</button>
              <button onClick={reset} className="btn btn-primary" style={{ flex: 2 }}>Make Another Payment</button>
            </div>
          </div>
        )}
      </div>

      {/* RIGHT: Payment History */}
      <div className="card">
        <div className="section-title">
          <h3>🧾 Payment History</h3>
          <span className="badge badge-blue">{payments.length} transactions</span>
        </div>
        {payments.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '.75rem' }}>💳</div>
            <p>No payments yet. Make your first payment to get started!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
            {payments.map(p => (
              <div key={p.id} style={{ padding: '1rem 1.125rem', background: 'var(--surface)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.3rem' }}>
                  <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '1.05rem' }}>{p.amountFCFA?.toLocaleString()} FCFA</span>
                  <span className={`badge ${p.method === 'MTN' ? 'badge-yellow' : 'badge-purple'}`}>{p.method}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.78rem', color: 'var(--text-muted)' }}>
                  <span>{new Date(p.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                  <span className="badge badge-green" style={{ fontSize: '.72rem' }}>✓ Paid</span>
                </div>
                {p.transactionRef && (
                  <div style={{ marginTop: '.4rem', fontSize: '.75rem', color: 'var(--text-faint)', fontFamily: 'monospace' }}>Ref: {p.transactionRef}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
