import { FormEvent, useState } from 'react';
import { IconAlertTriangle } from '../components/Icons';
import { deleteCar } from '../api/cars';
import { getSessionToken } from '../state/sessionToken';

export default function DeleteCarPage() {
  const [carId, setCarId] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async (event: FormEvent) => {
    event.preventDefault();
    setMessage(null);
    setError(null);

    const token = getSessionToken();
    if (!token) return setError('Missing token. Log in first.');

    try {
      await deleteCar(carId, token);
      setMessage(`Deleted car ${carId}.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete car.');
    }
  };

  return (
    <section className="content-wrap section-space">
      <form onSubmit={handleDelete} className="panel delete-card">
        <IconAlertTriangle size={48} className="warning-icon" />
        <h1>Delete Car</h1>
        <p>Are you sure you want to delete <strong>{carId || 'this car'}</strong>? This action cannot be undone.</p>
        <label>Car ID<input required value={carId} onChange={(e) => setCarId(e.target.value)} /></label>
        <div className="delete-actions">
          <a href="/cars/edit" className="button secondary">Cancel</a>
          <button type="submit" className="button destructive solid">Delete</button>
        </div>
        {message && <p className="success-text">{message}</p>}
        {error && <p className="error-text">{error}</p>}
      </form>
    </section>
  );
}
