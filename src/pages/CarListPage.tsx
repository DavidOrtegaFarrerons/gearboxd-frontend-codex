import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Car, listCars } from '../api/cars';

export default function CarListPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCars = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await listCars({ page: 1, pageSize: 24 });
        setCars(response.items);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load cars.');
      } finally {
        setLoading(false);
      }
    };

    void loadCars();
  }, []);

  return (
    <section>
      <div className="hero">
        <p className="eyebrow">Public Inventory</p>
        <h1>Find Your Next Driver&apos;s Car</h1>
        <p>Inventory is loaded live from the Gearboxd API.</p>
      </div>

      {loading && <p>Loading cars from API…</p>}

      {error && (
        <p role="alert" style={{ color: '#b91c1c' }}>
          {error}
        </p>
      )}

      {!loading && !error && (
        <div className="card-grid">
          {cars.map((car) => (
            <article className="card" key={car.id}>
              <img
                src={car.image_url || 'https://placehold.co/640x360?text=No+Image'}
                alt={`${car.make} ${car.model}`}
                style={{ width: '100%', aspectRatio: '16 / 9', objectFit: 'cover', borderRadius: '0.6rem', marginBottom: '0.7rem' }}
              />
              <span className="badge">{car.year}</span>
              <h3>{car.make} {car.model}</h3>
              <p style={{ color: '#dbeafe' }}>{car.gearbox} · {car.drivetrain} · {car.horsepower} hp</p>
              <Link to={`/cars/${car.id}`}>View details</Link>
            </article>
          ))}
          {cars.length === 0 && <p>No cars returned by the API.</p>}
        </div>
      )}
    </section>
  );
}
