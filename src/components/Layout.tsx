import { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { IconMenu, IconUser, IconX } from './Icons';
import { useAuth } from '../state/auth';
import { clearSessionToken } from '../state/sessionToken';

const loggedOutNav = [
  { to: '/cars', label: 'Cars' },
  { to: '/healthcheck', label: 'About' },
];

const loggedInNav = [
  { to: '/cars', label: 'Cars' },
  { to: '/cars/edit', label: 'My Garage' },
  { to: '/cars/create', label: 'Activity' },
];

export default function Layout() {
  const { isAuthenticated, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = isAuthenticated ? loggedInNav : loggedOutNav;

  const handleSignOut = () => {
    clearSessionToken();
    logout();
    setMenuOpen(false);
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-content">
          <Link to="/" className="logo" aria-label="Gearboxd home">
            <span className="logo-mark" aria-hidden="true" />
            <span>Gearboxd</span>
          </Link>

          <nav className="desktop-nav" aria-label="Primary navigation">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to}>
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
                  <span className="avatar"><IconUser size={18} /></span>
                  <span>Driver</span>
                </button>
                {menuOpen && (
                  <div className="dropdown-menu">
                    <Link to="/cars/edit" onClick={() => setMenuOpen(false)}>Profile</Link>
                    <Link to="/cars/create" onClick={() => setMenuOpen(false)}>Settings</Link>
                    <button type="button" onClick={handleSignOut}>Sign Out</button>
                  </div>
                )}
              </div>
            )}
          </div>

          <button type="button" className="mobile-menu-button" onClick={() => setMobileOpen(true)}>
            <IconMenu size={20} />
          </button>
        </div>
      </header>

      {mobileOpen && (
        <div className="mobile-overlay">
          <button type="button" className="mobile-close" onClick={() => setMobileOpen(false)}>
            <IconX size={20} />
          </button>
          <nav>
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} onClick={() => setMobileOpen(false)}>
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
