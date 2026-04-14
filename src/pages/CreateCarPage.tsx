import { FormEvent, useState } from 'react';
import { createCar } from '../api/cars';

const TOKEN_STORAGE_KEY = 'gearboxd-token';

export default function CreateCarPage() {
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [mileage, setMileage] = useState('');
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
      const created = await createCar({
        make,
        model,
        year: Number(year),
        mileage: Number(mileage),
      }, token);
      setMessage(`Created car ${created.id}.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create car.');
    }
  };

  return (
    <section className="card form-card">
      <h2>Create Car</h2>
      <p>Protected route for adding new inventory.</p>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Make" value={make} onChange={(e) => setMake(e.target.value)} required />
        <input type="text" placeholder="Model" value={model} onChange={(e) => setModel(e.target.value)} required />
        <input type="number" placeholder="Year" value={year} onChange={(e) => setYear(e.target.value)} required />
        <input type="number" placeholder="Mileage" value={mileage} onChange={(e) => setMileage(e.target.value)} required />
        <button type="submit">Create</button>
      </form>
      {message && <p>{message}</p>}
      {error && <p role="alert" style={{ color: '#b91c1c' }}>{error}</p>}
    </section>
  );
}
