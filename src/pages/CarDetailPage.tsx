import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Car, getCar } from '../api/cars';

export default function CarDetailPage() {
  const { carId } = useParams();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!carId) {
      setError('Missing car id.');
      setLoading(false);
      return;
    }

    const loadCar = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await getCar(carId);
        setCar(response);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load car details.');
      } finally {
        setLoading(false);
      }
    };

    void loadCar();
  }, [carId]);

  if (loading) {
    return <section className="card">Loading car from API…</section>;
  }

  if (error) {
    return <section className="card" role="alert">{error}</section>;
  }

  if (!car) {
    return <section className="card">Car not found.</section>;
  }

  return (
    <section className="card">
      <p className="eyebrow">Car Detail</p>
      <h2>{car.year} {car.make} {car.model}</h2>
      <img
        src={car.image_url || 'https://placehold.co/1280x720?text=No+Image'}
        alt={`${car.make} ${car.model}`}
        style={{ width: '100%', borderRadius: '0.7rem', marginBottom: '1rem', aspectRatio: '16 / 9', objectFit: 'cover' }}
      />
      <p style={{ color: '#f2f5ff' }}>{car.description ?? 'No description available.'}</p>
      <p>Gearbox: {car.gearbox}</p>
      <p>Drivetrain: {car.drivetrain}</p>
      <p>Horsepower: {car.horsepower} hp</p>
      <p>Fuel: {car.fuel}</p>
      <p>Price New: ${car.price_new.toLocaleString()}</p>
    </section>
  );
}
