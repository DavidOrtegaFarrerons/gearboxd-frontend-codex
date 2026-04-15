import { FormEvent, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { register } from '../api/users';
import { getSessionToken } from '../state/sessionToken';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (getSessionToken()) return <Navigate to="/" replace />;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setMessage(null);
    setError(null);
    try {
      await register({ email, username, password });
      setMessage('Registration submitted. Check your email for activation instructions.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed.');
    }
  };

  return (
    <section className="content-wrap section-space auth-wrap">
      <div className="panel auth-card">
        <div className="auth-logo">Gearboxd</div>
        <h1 className="centered">Create your account</h1>
        <p className="centered muted">Track every car. Build your dream garage.</p>
        <form onSubmit={handleSubmit} className="narrow-form">
          <label>Username<input type="text" required value={username} onChange={(e) => setUsername(e.target.value)} /></label>
          <label>Email<input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></label>
          <label>Password<input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} /></label>
          <button className="button primary full" type="submit">Create Account</button>
          {message && <p className="success-text">{message}</p>}
          {error && <p className="error-text">{error}</p>}
        </form>
        <p className="centered small">Already have an account? <Link to="/auth/login">Sign In</Link></p>
      </div>
    </section>
  );
}
