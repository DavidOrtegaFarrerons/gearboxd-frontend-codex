import { Navigate, Outlet } from 'react-router-dom';

function hasToken() {
  return Boolean(localStorage.getItem('gearboxd-token'));
}

export default function ProtectedRoute() {
  return hasToken() ? <Outlet /> : <Navigate to="/auth/login" replace />;
}
