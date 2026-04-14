import { Link, NavLink, Outlet } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Car List' },
  { to: '/healthcheck', label: 'Healthcheck' },
  { to: '/auth/register', label: 'Register' },
  { to: '/auth/activate', label: 'Activate' },
  { to: '/auth/login', label: 'Login' },
  { to: '/cars/create', label: 'Create' },
  { to: '/cars/edit', label: 'Edit' },
  { to: '/cars/delete', label: 'Delete' }
];

export default function Layout() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <Link to="/" className="logo">
          🏁 Gearboxd
        </Link>
        <nav>
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => (isActive ? 'active' : '')}>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="container">
        <Outlet />
      </main>
    </div>
  );
}
