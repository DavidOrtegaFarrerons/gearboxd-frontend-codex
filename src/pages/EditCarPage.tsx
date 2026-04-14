import { FormEvent, useState } from 'react';
import { updateCar } from '../api/cars';

const TOKEN_STORAGE_KEY = 'gearboxd-token';

export default function EditCarPage() {
  const [carId, setCarId] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
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
      const updated = await updateCar(carId, { make, model }, token);
      setMessage(`Updated car ${updated.id}.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update car.');
    }
  };

  return (
    <section className="card form-card">
      <h2>Edit Car</h2>
      <p>Protected route for updating existing listings.</p>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Car ID" value={carId} onChange={(e) => setCarId(e.target.value)} required />
        <input type="text" placeholder="Updated make" value={make} onChange={(e) => setMake(e.target.value)} required />
        <input type="text" placeholder="Updated model" value={model} onChange={(e) => setModel(e.target.value)} required />
        <button type="submit">Save changes</button>
      </form>
      {message && <p>{message}</p>}
      {error && <p role="alert" style={{ color: '#b91c1c' }}>{error}</p>}
    </section>
  );
}
