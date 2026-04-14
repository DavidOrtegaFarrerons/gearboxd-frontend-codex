import { FormEvent, useState } from 'react';
import { deleteCar } from '../api/cars';

const TOKEN_STORAGE_KEY = 'gearboxd-token';

export default function DeleteCarPage() {
  const [carId, setCarId] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setMessage(null);
    setError(null);

    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!token) {
      setError('Missing token. Log in first.');
      return;
    }

    try {
      await deleteCar(carId, token);
      setMessage(`Deleted car ${carId}.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete car.');
    }
  };

  return (
    <section className="card form-card">
      <h2>Delete Car</h2>
      <p>Protected route for removing inventory records.</p>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Car ID" value={carId} onChange={(e) => setCarId(e.target.value)} required />
        <button type="submit" className="danger">
          Delete car
        </button>
      </form>
      {message && <p>{message}</p>}
      {error && <p role="alert" style={{ color: '#b91c1c' }}>{error}</p>}
    </section>
  );
}
