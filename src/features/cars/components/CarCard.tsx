import type { CSSProperties } from 'react';
import { Car } from '../types';

type CarCardProps = {
  car: Car;
  onOpen: (carId: string) => void;
  onEdit: (car: Car) => void;
  onDelete: (car: Car) => void;
};

const badgeStyle: CSSProperties = {
  display: 'inline-flex',
  padding: '0.15rem 0.6rem',
  borderRadius: '999px',
  fontSize: '0.75rem',
  fontWeight: 600,
  backgroundColor: '#eff6ff',
  color: '#1d4ed8',
};

export function CarCard({ car, onOpen, onEdit, onDelete }: CarCardProps) {
  return (
    <article style={{ border: '1px solid #e2e8f0', borderRadius: 16, overflow: 'hidden', backgroundColor: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
      <button
        type="button"
        onClick={() => onOpen(car.id)}
        style={{
          all: 'unset',
          cursor: 'pointer',
          display: 'block',
          width: '100%',
        }}
      >
        <img
          src={car.image_url || 'https://placehold.co/800x480?text=No+Image'}
          alt={`${car.make} ${car.model}`}
          style={{ width: '100%', height: 190, objectFit: 'cover' }}
        />
      </button>

      <div style={{ padding: '0.9rem 1rem' }}>
        <h3 style={{ margin: 0, fontSize: '1.1rem' }}>
          {car.year} {car.make} {car.model}
        </h3>

        <p style={{ margin: '0.4rem 0 0.75rem', color: '#334155', fontWeight: 600 }}>
          ${car.price.toLocaleString()} · {car.horsepower} hp
        </p>

        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.9rem' }}>
          <span style={badgeStyle}>{car.drivetrain.toUpperCase()}</span>
          <span style={badgeStyle}>{car.gearbox}</span>
          <span style={badgeStyle}>{car.fuel}</span>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button type="button" onClick={() => onEdit(car)} style={{ flex: 1 }}>Edit</button>
          <button type="button" onClick={() => onDelete(car)} style={{ flex: 1 }}>Delete</button>
        </div>
      </div>
    </article>
  );
}
