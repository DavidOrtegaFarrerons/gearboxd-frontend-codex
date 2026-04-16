import { FormEvent, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../state/auth';

export default function LoginPage() {
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (isAuthenticated) return <Navigate to="/" replace />;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setMessage(null);
    setError(null);
    try {
      await login({ email, password });
      setMessage('Signed in successfully.');
      navigate('/');
    } catch (err) {
      const defaultMessage = 'Login failed.';

      if (err && typeof err === 'object' && 'message' in err && typeof err.message === 'string') {
        setError(err.message);
      } else {
        setError(defaultMessage);
      }
    }
  };

  return (
    <section className="content-wrap section-space auth-wrap">
      <div className="panel auth-card">
        <div className="auth-logo">Gearboxd</div>
        <h1 className="centered">Welcome back</h1>
        <p className="centered muted">Sign in to your Gearboxd account</p>
        <form onSubmit={handleSubmit} className="narrow-form">
          <label>Email<input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></label>
          <label>
            Password
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
          </label>
          <button className="button primary full" type="submit">Sign In</button>
          {message && <p className="success-text">{message}</p>}
          {error && <p className="error-text">{error}</p>}
        </form>
        <p className="centered small">Don&apos;t have an account? <Link to="/auth/register">Create one</Link></p>
      </div>
    </section>
  );
}
