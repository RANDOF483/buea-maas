'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const links = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/contact', label: 'Contact' },
];

export default function PublicNav() {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith('/dashboard') || pathname?.startsWith('/admin');
  if (isDashboard) return null;

  return (
    <nav className="public-nav">
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '.5rem', fontWeight: 800, fontSize: '1.2rem', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
          <span style={{ background: 'linear-gradient(135deg,#10b981,#6366f1)', borderRadius: '8px', padding: '4px 8px', fontSize: '1rem' }}>⚡</span>
          Buea MaaS
        </Link>

        <div style={{ display: 'flex', gap: '.25rem', alignItems: 'center' }}>
          {links.map(({ href, label }) => (
            <Link key={href} href={href} style={{
              padding: '.5rem .875rem',
              borderRadius: '8px',
              fontSize: '.9rem',
              fontWeight: 500,
              color: pathname === href ? 'var(--primary)' : 'var(--text-muted)',
              background: pathname === href ? 'var(--primary-light)' : 'transparent',
              transition: 'all .15s',
            }}>
              {label}
            </Link>
          ))}
          <div style={{ width: '1px', height: '20px', background: 'var(--border)', margin: '0 .5rem' }} />
          <Link href="/login" className="btn btn-ghost btn-sm">Sign In</Link>
          <Link href="/register" className="btn btn-primary btn-sm">Get Started</Link>
        </div>
      </div>
    </nav>
  );
}
