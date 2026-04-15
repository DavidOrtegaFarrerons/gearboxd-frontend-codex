import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../state/auth';

const primaryNavItems = [
  { to: '/', label: 'Car List' },
  { to: '/healthcheck', label: 'Healthcheck' },
  { to: '/cars/create', label: 'Create' },
  { to: '/cars/edit', label: 'Edit' },
  { to: '/cars/delete', label: 'Delete' }
];

const authNavItems = [
  { to: '/auth/register', label: 'Register' },
  { to: '/auth/login', label: 'Login' }
];

export default function Layout() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="app-shell">
      <header className="topbar">
        <Link to="/" className="logo">
          🏁 Gearboxd
        </Link>

        <div className="topbar-nav">
          <nav className="nav-group" aria-label="Primary navigation">
            {primaryNavItems.map((item) => (
              <NavLink key={item.to} to={item.to} className={({ isActive }) => (isActive ? 'active' : '')}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          {!isAuthenticated && (
            <nav className="nav-group nav-group-auth" aria-label="Authentication navigation">
              {authNavItems.map((item) => (
                <NavLink key={item.to} to={item.to} className={({ isActive }) => (isActive ? 'active' : '')}>
                  {item.label}
                </NavLink>
              ))}
            </nav>
          )}
        </div>
      </header>
      <main className="container">
        <Outlet />
      </main>
    </div>
  );
}
