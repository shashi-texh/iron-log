import { Link } from 'react-router-dom';
import { Dumbbell, Instagram, Twitter, Youtube, Mail, Heart } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { label: 'Powerlifting Tracker', href: '/powerlifting' },
      { label: 'Supplement Shop', href: '/shop' },
      { label: 'To-Do List', href: '/todo' },
      { label: 'Progress Analytics', href: '/analytics' },
    ],
    company: [
      { label: 'About Us', href: '/about' },
      { label: 'Blog', href: '/blog' },
      { label: 'Careers', href: '/careers' },
      { label: 'Press', href: '/press' },
    ],
    support: [
      { label: 'Help Center', href: '/help' },
      { label: 'Contact Us', href: '/contact' },
      { label: 'Shipping Info', href: '/shipping' },
      { label: 'Returns', href: '/returns' },
    ],
    legal: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Cookie Policy', href: '/cookies' },
    ],
  };

  return (
    <footer className="footer" style={{ background: 'var(--color-primary)', color: 'var(--color-text-inverse)', padding: '4rem 0 2rem', marginTop: 'auto' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
          <div>
            <Link to="/" className="footer-logo" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>
              <Dumbbell size={28} style={{ color: 'var(--color-accent)' }} />
              <span>IronLog</span>
            </Link>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9375rem', lineHeight: 1.7, maxWidth: 300 }}>
              Your ultimate companion for powerlifting progress tracking, supplement shopping, and workout organization. Built by lifters, for lifters.
            </p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <a href="#" style={{ color: 'rgba(255,255,255,0.5)', transition: 'color var(--transition-fast)' }} aria-label="Instagram"><Instagram size={20} /></a>
              <a href="#" style={{ color: 'rgba(255,255,255,0.5)', transition: 'color var(--transition-fast)' }} aria-label="Twitter"><Twitter size={20} /></a>
              <a href="#" style={{ color: 'rgba(255,255,255,0.5)', transition: 'color var(--transition-fast)' }} aria-label="YouTube"><Youtube size={20} /></a>
              <a href="#" style={{ color: 'rgba(255,255,255,0.5)', transition: 'color var(--transition-fast)' }} aria-label="Email"><Mail size={20} /></a>
            </div>
          </div>

          <nav>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.25rem', color: 'var(--color-accent)' }}>Product</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {footerLinks.product.map(link => (
                <li key={link.href}>
                  <Link to={link.href} style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9375rem', transition: 'color var(--transition-fast)' }}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.25rem', color: 'var(--color-accent)' }}>Company</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {footerLinks.company.map(link => (
                <li key={link.href}>
                  <Link to={link.href} style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9375rem', transition: 'color var(--transition-fast)' }}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.25rem', color: 'var(--color-accent)' }}>Support</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {footerLinks.support.map(link => (
                <li key={link.href}>
                  <Link to={link.href} style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9375rem', transition: 'color var(--transition-fast)' }}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem' }}>
            &copy; {currentYear} IronLog. All rights reserved.
          </p>
          <nav style={{ display: 'flex', gap: '2rem' }}>
            {footerLinks.legal.map(link => (
              <Link key={link.href} to={link.href} style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', transition: 'color var(--transition-fast)' }}>{link.label}</Link>
            ))}
          </nav>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            Made with <Heart size={14} style={{ color: 'var(--color-accent)' }} /> for the lifting community
          </p>
        </div>
      </div>
    </footer>
  );
}