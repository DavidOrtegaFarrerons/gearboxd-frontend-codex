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
      <p>{car.description ?? 'No description available.'}</p>
      <p>Mileage: {car.mileage.toLocaleString()} mi</p>
      <p>Price: {car.price ? `$${car.price.toLocaleString()}` : 'N/A'}</p>
      <p>Color: {car.color ?? 'N/A'}</p>
    </section>
  );
}
