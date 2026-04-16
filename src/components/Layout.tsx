import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LogOut, Menu, Settings, User, X } from 'lucide-react';
import { useAuth } from '../state/auth';

const loggedOutNav = [
  { to: '/cars', label: 'Cars' },
  { to: '/healthcheck', label: 'About' },
];

const loggedInNav = [
  { to: '/cars', label: 'Cars' },
  { to: '/cars/create', label: 'Add Car' },
  { to: '/', label: 'Activity' },
];

function LogoMark() {
  return (
    <svg className="logo-mark" viewBox="0 0 28 28" aria-hidden="true">
      <defs>
        <linearGradient id="gearboxd-logo-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FF8000" />
          <stop offset="50%" stopColor="#00E054" />
          <stop offset="100%" stopColor="#40BCF4" />
        </linearGradient>
      </defs>
      <path d="M4 20a10 10 0 0 1 20 0" fill="none" stroke="url(#gearboxd-logo-gradient)" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
      <path d="M6.5 20a7.5 7.5 0 0 1 15 0" fill="none" stroke="url(#gearboxd-logo-gradient)" strokeWidth="3" strokeLinecap="round" opacity="0.9" />
      <path d="M9 20a5 5 0 0 1 10 0" fill="none" stroke="url(#gearboxd-logo-gradient)" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export default function Layout() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = isAuthenticated ? loggedInNav : loggedOutNav;

  const handleSignOut = () => {
    logout();
    setMenuOpen(false);
    setMobileOpen(false);
    navigate('/');
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-content">
          <Link to="/" className="logo" aria-label="Gearboxd home">
            <LogoMark />
            <span>Gearboxd</span>
          </Link>

          <nav className="desktop-nav" aria-label="Primary navigation">
            {navItems.map((item) => (
              <NavLink key={`${item.to}-${item.label}`} to={item.to}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="auth-area desktop-auth">
            {!isAuthenticated ? (
              <>
                <Link to="/auth/login" className="button secondary">Sign In</Link>
                <Link to="/auth/register" className="button primary">Create Account</Link>
              </>
            ) : (
              <div className="user-menu-wrap">
                <button type="button" className="user-chip" onClick={() => setMenuOpen((v) => !v)}>
                  <span className="avatar"><User size={18} /></span>
                  <span>Driver</span>
                </button>
                {menuOpen && (
                  <div className="dropdown-menu">
                    <Link to="/cars" onClick={() => setMenuOpen(false)}><User size={14} /> Profile</Link>
                    <Link to="/cars" onClick={() => setMenuOpen(false)}><Settings size={14} /> Settings</Link>
                    <button type="button" onClick={handleSignOut}><LogOut size={14} /> Sign Out</button>
                  </div>
                )}
              </div>
            )}
          </div>

          <button type="button" className="mobile-menu-button" onClick={() => setMobileOpen(true)}>
            <Menu size={20} />
          </button>
        </div>
      </header>

      {mobileOpen && (
        <div className="mobile-overlay">
          <button type="button" className="mobile-close" onClick={() => setMobileOpen(false)}>
            <X size={20} />
          </button>
          <nav>
            {navItems.map((item) => (
              <NavLink key={`${item.to}-${item.label}`} to={item.to} onClick={() => setMobileOpen(false)}>
                {item.label}
              </NavLink>
            ))}
            {!isAuthenticated ? (
              <>
                <NavLink to="/auth/login" onClick={() => setMobileOpen(false)}>Sign In</NavLink>
                <NavLink to="/auth/register" onClick={() => setMobileOpen(false)}>Create Account</NavLink>
              </>
            ) : (
              <button type="button" className="mobile-signout" onClick={handleSignOut}>Sign Out</button>
            )}
          </nav>
        </div>
      )}

      <main className="main-content page-enter">
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="content-wrap footer-inner">
          <p>© 2025 Gearboxd</p>
          <div>
            <a href="#">About</a>
            <a href="#">API</a>
            <a href="#">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
