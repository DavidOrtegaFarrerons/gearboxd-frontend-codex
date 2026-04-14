import { FormEvent, useState } from 'react';
import { activate } from '../api/users';

export default function ActivatePage() {
  const [token, setToken] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setMessage(null);
    setError(null);

    try {
      await activate({ token });
      setMessage('Account activated successfully.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Activation failed.');
    }
  };

  return (
    <section className="card form-card">
      <h2>Activate Account</h2>
      <p>Paste your activation token from email to unlock your account.</p>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Activation token" value={token} onChange={(e) => setToken(e.target.value)} required />
        <button type="submit">Activate</button>
      </form>
      {message && <p>{message}</p>}
      {error && <p role="alert" style={{ color: '#b91c1c' }}>{error}</p>}
    </section>
  );
}
