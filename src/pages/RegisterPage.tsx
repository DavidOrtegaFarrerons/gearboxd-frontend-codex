import { FormEvent, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Navigate, Link } from 'react-router-dom';
import { register } from '../api/users';
import { getFieldError, type FieldErrors } from '../api/errors';
import { useAuth } from '../state/auth';

export default function RegisterPage() {
  const { isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
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
      await register({ email, username, password });
      setMessage('Registration submitted. Check your email for activation instructions.');
    } catch (err) {
      if (err && typeof err === 'object' && 'message' in err) {
        const typedError = err as { message?: string; fieldErrors?: FieldErrors };
        setError(typedError.message ?? 'Registration failed.');
        setFieldErrors(typedError.fieldErrors);
      } else {
        setError('Registration failed.');
      }
    }
  };

  return (
    <section className="content-wrap section-space auth-wrap">
      <div className="panel auth-card">
        <div className="auth-logo">Gearboxd</div>
        <h1 className="centered">Create your account</h1>
        <p className="centered muted">Track every car. Build your dream garage.</p>
        <form onSubmit={handleSubmit} className="narrow-form">
          <label>
            Username
            <input type="text" required value={username} onChange={(e) => setUsername(e.target.value)} />
            {getFieldError(fieldErrors, 'username') && <span className="error-text">{getFieldError(fieldErrors, 'username')}</span>}
          </label>
          <label>
            Email
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            {getFieldError(fieldErrors, 'email') && <span className="error-text">{getFieldError(fieldErrors, 'email')}</span>}
          </label>
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
            {getFieldError(fieldErrors, 'password') && <span className="error-text">{getFieldError(fieldErrors, 'password')}</span>}
          </label>
          <button className="button primary full auth-submit-button" type="submit">Create Account</button>
          {message && <p className="success-text">{message}</p>}
          {error && <p className="error-text">{error}</p>}
        </form>
        <p className="centered small auth-bottom-text">Already have an account? <Link to="/auth/login">Sign In</Link></p>
      </div>
    </section>
  );
}
