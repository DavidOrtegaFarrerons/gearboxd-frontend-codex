import { useEffect, useState } from 'react';
import { getCarById } from '../api';
import { Car } from '../types';

type CarDetailPageProps = {
  carId: string;
};

function DetailItem({ label, value }: { label: string; value: string | number | undefined }) {
  return (
    <div style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: '0.75rem' }}>
      <small style={{ display: 'block', color: '#64748b' }}>{label}</small>
      <strong>{value ?? 'N/A'}</strong>
    </div>
  );
}

export function CarDetailPage({ carId }: CarDetailPageProps) {
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await getCarById(carId);
        setCar(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch car details.');
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [carId]);

  if (loading) {
    return (
      <section style={{ padding: '1rem', display: 'grid', gap: '0.8rem' }}>
        <div style={{ height: 360, borderRadius: 18, background: 'linear-gradient(90deg, #f1f5f9, #e2e8f0, #f1f5f9)' }} />
        <div style={{ height: 100, borderRadius: 12, backgroundColor: '#f1f5f9' }} />
      </section>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '1rem', border: '1px solid #fecaca', borderRadius: 12, backgroundColor: '#fef2f2', color: '#991b1b' }}>
        {error}
      </div>
    );
  }

  if (!car) {
    return (
      <div style={{ padding: '1rem', border: '1px dashed #94a3b8', borderRadius: 12 }}>
        Car not found.
      </div>
    );
  }

  return (
    <section style={{ display: 'grid', gap: '1rem', padding: '1rem' }}>
      <header>
        <h1 style={{ marginBottom: '0.3rem' }}>{car.year} {car.make} {car.model}</h1>
        <p style={{ marginTop: 0, color: '#334155' }}>{car.description || 'No description available.'}</p>
      </header>

      <img
        src={car.image_url || 'https://placehold.co/1400x700?text=Car+Image'}
        alt={`${car.make} ${car.model}`}
        style={{ width: '100%', maxHeight: 470, objectFit: 'cover', borderRadius: 16 }}
      />

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <span style={{ backgroundColor: '#dcfce7', color: '#166534', borderRadius: 999, padding: '0.2rem 0.6rem' }}>{car.drivetrain.toUpperCase()}</span>
        <span style={{ backgroundColor: '#dbeafe', color: '#1e3a8a', borderRadius: 999, padding: '0.2rem 0.6rem' }}>{car.gearbox}</span>
        <span style={{ backgroundColor: '#fef3c7', color: '#92400e', borderRadius: 999, padding: '0.2rem 0.6rem' }}>{car.fuel}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(165px, 1fr))', gap: '0.7rem' }}>
        <DetailItem label="Price" value={`$${car.price.toLocaleString()}`} />
        <DetailItem label="Horsepower" value={`${car.horsepower} hp`} />
        <DetailItem label="Mileage" value={car.mileage ? `${car.mileage.toLocaleString()} mi` : undefined} />
        <DetailItem label="Doors" value={car.doors} />
        <DetailItem label="Color" value={car.color} />
        <DetailItem label="Fuel" value={car.fuel} />
      </div>
    </section>
  );
}
