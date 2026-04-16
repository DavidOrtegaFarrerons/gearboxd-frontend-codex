import { FormEvent, useEffect, useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { deleteCar, getCar } from '../api/cars';
import { getSessionToken } from '../state/sessionToken';

export default function DeleteCarPage() {
  const [searchParams] = useSearchParams();
  const [carName, setCarName] = useState<string | null>(null);
  const carId = searchParams.get('id')?.trim() ?? '';
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCar = async () => {
      if (!carId) {
        setCarName(null);
        return;
      }

      try {
        const car = await getCar(carId);
        setCarName(`${car.year} ${car.make} ${car.model}`);
      } catch {
        setCarName(null);
      }
    };

    void loadCar();
  }, [carId]);

  const handleDelete = async (event: FormEvent) => {
    event.preventDefault();
    setMessage(null);
    setError(null);

    const token = getSessionToken();
    if (!token) return setError('Missing token. Log in first.');
    if (!carId) return setError('Missing car id in URL.');

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
        <AlertTriangle size={48} className="warning-icon" />
        <h1>Delete Car</h1>
        <p>Are you sure you want to delete <strong>{carName ?? carId ?? 'this car'}</strong>? This action cannot be undone.</p>
        {!carId && <p className="error-text">Open this page with an id query parameter, for example: /cars/delete?id=123</p>}
        <div className="delete-actions">
          <a href="/cars/edit" className="button secondary">Cancel</a>
          <button type="submit" className="button destructive solid" disabled={!carId}>Delete</button>
        </div>
        {message && <p className="success-text">{message}</p>}
        {error && <p className="error-text">{error}</p>}
      </form>
    </section>
  );
}
