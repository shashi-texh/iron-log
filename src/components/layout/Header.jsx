import { useState, useEffect } from 'react';
import { Link, useLocation, NavLink } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Menu, X, Dumbbell, ShoppingCart, Trophy, CheckSquare, User, LogOut, ChevronDown
} from 'lucide-react';

export function Header() {
  const location = useLocation();
  const { getCartCount, profile, updateProfile, isLoaded } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    setCartCount(getCartCount());
  }, [getCartCount]);

  const navItems = [
    { path: '/', label: 'Dashboard', icon: Trophy },
    { path: '/powerlifting', label: 'Powerlifting', icon: Dumbbell },
    { path: '/shop', label: 'Shop', icon: ShoppingCart },
    { path: '/todo', label: 'To-Do List', icon: CheckSquare },
  ];

  return (
    <header className="header" style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)', borderBottom: '1px solid var(--color-border)' }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 'var(--header-height)' }}>
        <Link to="/" className="logo" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-primary)' }}>
          <Dumbbell size={28} style={{ color: 'var(--color-accent)' }} />
          <span>IronLog</span>
        </Link>

        <nav className="nav-desktop" style={{ display: 'none', gap: '0.5rem' }}>
          {navItems.map(({ path, label, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.625rem 1rem',
                borderRadius: 'var(--radius-md)',
                fontWeight: 500,
                fontSize: '0.875rem',
                color: isActive ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                background: isActive ? 'rgba(233, 69, 96, 0.1)' : 'transparent',
                transition: 'all var(--transition-fast)',
              })}
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Link
            to="/shop"
            className="cart-link"
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              borderRadius: 'var(--radius-full)',
              color: 'var(--color-text-secondary)',
              transition: 'all var(--transition-fast)',
            }}
          >
            <ShoppingCart size={22} />
            {cartCount > 0 && (
              <span style={{
                position: 'absolute',
                top: -4,
                right: -4,
                minWidth: 18,
                height: 18,
                padding: '0 4px',
                fontSize: '0.625rem',
                fontWeight: 700,
                color: 'white',
                background: 'var(--color-accent)',
                borderRadius: 'var(--radius-full)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </Link>

          {isLoaded && profile.name && (
            <div className="profile-menu" style={{ position: 'relative' }}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="btn btn-ghost"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem' }}
              >
                <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-full)', background: 'var(--color-accent)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: '0.875rem' }}>
                  {profile.name.charAt(0).toUpperCase()}
                </div>
                <span style={{ fontWeight: 500, fontSize: '0.875rem' }}>{profile.name}</span>
                <ChevronDown size={16} />
              </button>

              {isProfileOpen && (
                <div className="profile-dropdown" style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '0.5rem',
                  background: 'var(--color-bg-elevated)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-lg)',
                  minWidth: 200,
                  padding: '0.5rem',
                  zIndex: 100,
                }}>
                  <Link
                    to="/profile"
                    onClick={() => setIsProfileOpen(false)}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: 'var(--radius-sm)', color: 'var(--color-text)', fontSize: '0.875rem' }}
                  >
                    <User size={18} />
                    Profile
                  </Link>
                  <Link
                    to="/settings"
                    onClick={() => setIsProfileOpen(false)}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: 'var(--radius-sm)', color: 'var(--color-text)', fontSize: '0.875rem' }}
                  >
                    <User size={18} />
                    Settings
                  </Link>
                  <hr style={{ borderColor: 'var(--color-border)', margin: '0.5rem 0' }} />
                  <button
                    onClick={() => { updateProfile({ name: '' }); setIsProfileOpen(false); }}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: 'var(--radius-sm)', color: 'var(--color-error)', fontSize: '0.875rem', width: '100%', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
                  >
                    <LogOut size={18} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          )}

          <button
            className="mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, borderRadius: 'var(--radius-full)', color: 'var(--color-text-secondary)' }}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="mobile-menu" style={{ padding: '1rem 0', borderTop: '1px solid var(--color-border)', background: 'var(--color-bg-elevated)' }}>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {navItems.map(({ path, label, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
                onClick={() => setIsMobileMenuOpen(false)}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.875rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 500,
                  color: isActive ? 'var(--color-accent)' : 'var(--color-text)',
                  background: isActive ? 'rgba(233, 69, 96, 0.1)' : 'transparent',
                })}
              >
                <Icon size={20} />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}