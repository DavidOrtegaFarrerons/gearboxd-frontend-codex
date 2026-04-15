import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import CarListPage from './pages/CarListPage';
import CarDetailPage from './pages/CarDetailPage';
import HealthcheckPage from './pages/HealthcheckPage';
import RegisterPage from './pages/RegisterPage';
import ActivatePage from './pages/ActivatePage';
import LoginPage from './pages/LoginPage';
import CreateCarPage from './pages/CreateCarPage';
import EditCarPage from './pages/EditCarPage';
import DeleteCarPage from './pages/DeleteCarPage';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="cars" element={<CarListPage />} />
        <Route path="cars/:carId" element={<CarDetailPage />} />
        <Route path="healthcheck" element={<HealthcheckPage />} />

        <Route path="auth/register" element={<RegisterPage />} />
        <Route path="verifyAccount" element={<ActivatePage />} />
        <Route path="auth/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="cars/create" element={<CreateCarPage />} />
          <Route path="cars/edit" element={<EditCarPage />} />
          <Route path="cars/delete" element={<DeleteCarPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
