import type { MouseEvent } from 'react';
import { Gauge, Heart, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Car } from '../api/cars';

type CarCardProps = {
  car: Car;
};

export default function CarCard({ car }: CarCardProps) {
  const preventNavigation = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <article className="car-card">
      <Link className="car-card-link" to={`/cars/${car.id}`} aria-label={`${car.make} ${car.model}`}>
        {car.image_url ? (
          <img src={car.image_url} alt={`${car.make} ${car.model}`} className="car-card-image" loading="lazy" />
        ) : (
          <div className="car-card-placeholder" aria-hidden="true">
            <Gauge size={32} />
          </div>
        )}
        <div className="car-card-overlay">
          <div>
            <h3>{car.year} {car.make} {car.model}</h3>
            <p>{car.year} · {car.make}</p>
          </div>
          <div className="quick-actions" aria-hidden="true">
            <button type="button" className="icon-button icon-log" onClick={preventNavigation}><Gauge size={16} /></button>
            <button type="button" className="icon-button icon-like" onClick={preventNavigation}><Heart size={16} /></button>
            <button type="button" className="icon-button icon-garage" onClick={preventNavigation}><Plus size={16} /></button>
          </div>
        </div>
      </Link>
    </article>
  );
}
