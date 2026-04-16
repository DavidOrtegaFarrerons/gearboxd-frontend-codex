import { FormEvent, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { getApiErrorMessage, getApiFieldErrors, getFieldError, type FieldErrors } from '../api/errors';
import { useAuth } from '../state/auth';

export default function LoginPage() {
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors | undefined>(undefined);

  if (isAuthenticated) return <Navigate to="/" replace />;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setMessage(null);
    setError(null);
    setFieldErrors(undefined);
    try {
      await login({ email, password });
      setMessage('Signed in successfully.');
      navigate('/');
    } catch (err) {
      setError(getApiErrorMessage(err, 'Login failed.'));
      setFieldErrors(getApiFieldErrors(err));
    }
  };

  return (
    <section className="content-wrap section-space auth-wrap">
      <div className="panel auth-card">
        <div className="auth-logo">Gearboxd</div>
        <h1 className="centered">Welcome back</h1>
        <p className="centered muted">Sign in to your Gearboxd account</p>
        <form onSubmit={handleSubmit} className="narrow-form auth-form">
          <label>
            <span className="field-label">Email</span>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            {getFieldError(fieldErrors, 'email', 'username') && <span className="error-text">{getFieldError(fieldErrors, 'email', 'username')}</span>}
          </label>
          <label className="auth-label-spaced">
            <span className="field-label">Password</span>
            <span className="password-field-wrap">
              <input type={showPassword ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)} />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </span>
            {getFieldError(fieldErrors, 'password') && <span className="error-text">{getFieldError(fieldErrors, 'password')}</span>}
          </label>
          <button className="button primary full auth-submit-button" type="submit">Sign In</button>
          {message && <p className="success-text">{message}</p>}
          {error && <p className="error-text">{error}</p>}
        </form>
        <p className="centered small auth-bottom-text">Don&apos;t have an account? <Link to="/auth/register">Create one</Link></p>
      </div>
    </section>
  );
}
