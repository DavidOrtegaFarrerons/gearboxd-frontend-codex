import { IconGauge, IconHeart, IconPlus } from './Icons';
import { Link } from 'react-router-dom';
import type { Car } from '../api/cars';

type CarCardProps = {
  car: Car;
};

export default function CarCard({ car }: CarCardProps) {
  return (
    <article className="car-card">
      <Link className="car-card-link" to={`/cars/${car.id}`} aria-label={`${car.make} ${car.model}`}>
        {car.image_url ? (
          <img src={car.image_url} alt={`${car.make} ${car.model}`} className="car-card-image" loading="lazy" />
        ) : (
          <div className="car-card-placeholder" aria-hidden="true">
            ⚙
          </div>
        )}
        <div className="car-card-overlay">
          <div>
            <h3>{car.year} {car.make} {car.model}</h3>
            <p>{car.make} · {car.year}</p>
          </div>
          <div className="quick-actions" aria-hidden="true">
            <button type="button" className="icon-button icon-log"><IconGauge size={16} /></button>
            <button type="button" className="icon-button icon-like"><IconHeart size={16} /></button>
            <button type="button" className="icon-button icon-garage"><IconPlus size={16} /></button>
          </div>
        </div>
      </Link>
    </article>
  );
}
