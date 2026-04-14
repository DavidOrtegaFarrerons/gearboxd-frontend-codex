import { FormEvent, useState } from 'react';
import { getAuthenticationToken } from '../api/auth';

const TOKEN_STORAGE_KEY = 'gearboxd-token';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setMessage(null);
    setError(null);

    try {
      const response = await getAuthenticationToken({ email, password });
      localStorage.setItem(TOKEN_STORAGE_KEY, response.token);
      setMessage('Token received and saved.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed.');
    }
  };

  return (
    <section className="card form-card">
      <h2>Login / Token</h2>
      <p>Authenticate to create, edit, and remove cars from your garage.</p>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Get token</button>
      </form>
      {message && <p>{message}</p>}
      {error && <p role="alert" style={{ color: '#b91c1c' }}>{error}</p>}
    </section>
  );
}
