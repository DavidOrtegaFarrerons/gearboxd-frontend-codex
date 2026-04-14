import { FormEvent, useState } from 'react';
import { register } from '../api/users';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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
    <section className="card form-card">
      <h2>Register</h2>
      <p>Create your Gearboxd account to list and manage vehicles.</p>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Create account</button>
      </form>
      {message && <p>{message}</p>}
      {error && <p role="alert" style={{ color: '#b91c1c' }}>{error}</p>}
    </section>
  );
}
