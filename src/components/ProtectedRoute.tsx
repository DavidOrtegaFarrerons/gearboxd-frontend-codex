import { Navigate, Outlet } from 'react-router-dom';
import { getSessionToken } from '../state/sessionToken';

function hasToken() {
  return Boolean(getSessionToken());
}

export default function ProtectedRoute() {
  return hasToken() ? <Outlet /> : <Navigate to="/auth/login" replace />;
}
