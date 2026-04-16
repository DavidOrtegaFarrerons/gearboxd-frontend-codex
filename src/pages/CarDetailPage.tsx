import { useEffect, useMemo, useState } from 'react';
import { Gauge, Heart, Plus } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { getCar, type Car } from '../api/cars';

const originByMake: Record<string, string> = { mazda: 'Japan', bmw: 'Germany', porsche: 'Germany', ford: 'USA', ferrari: 'Italy' };
const eraLabel = (year: number) => `'${String(year).slice(2, 3)}0s`;

export default function CarDetailPage() {
  const { carId } = useParams();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

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
        setCar(await getCar(carId));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load car details.');
      } finally {
        setLoading(false);
      }
    };

    void loadCar();
  }, [carId]);

  const origin = useMemo(() => (car ? originByMake[car.make.toLowerCase()] ?? 'Other' : 'Other'), [car]);
  const activeRating = hoverRating || rating;

  if (loading) return <section className="content-wrap"><div className="panel">Loading car from API…</div></section>;
  if (error) return <section className="content-wrap"><div className="panel" role="alert">{error}</div></section>;
  if (!car) return <section className="content-wrap"><div className="panel">Car not found.</div></section>;

  return (
    <section>
      <div className="detail-hero">
        <img src={car.image_url || 'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=1600&q=80'} alt={`${car.make} ${car.model}`} />
        <div className="detail-overlay" />
        <div className="detail-title content-wrap">
          <h1>{car.year} {car.make} {car.model}</h1>
          <p>{car.make} · {origin} · {eraLabel(car.year)}</p>
        </div>
      </div>

      <div className="content-wrap section-space detail-main">
        <div className="action-row">
          <button type="button" className="button primary"><Gauge size={16} /> Log</button>
          <button type="button" className="button secondary"><Heart size={16} /> Like</button>
          <button type="button" className="button secondary"><Plus size={16} /> Add to Garage</button>
          <div className="stars large" onMouseLeave={() => setHoverRating(0)}>
            {[1, 2, 3, 4, 5].map((value) => (
              <button key={value} type="button" onMouseEnter={() => setHoverRating(value)} onFocus={() => setHoverRating(value)} onClick={() => setRating(value)}>
                <span className={value <= activeRating ? 'filled' : ''}>★</span>
              </button>
            ))}
          </div>
        </div>

        <div className="detail-grid">
          <div>
            <h2>About</h2>
            <p className="left-copy">{car.description || 'No description available.'}</p>
            <h2>Specifications</h2>
            <dl className="spec-list">
              <div><dt>Year</dt><dd>{car.year}</dd></div>
              <div><dt>Make</dt><dd>{car.make}</dd></div>
              <div><dt>Model</dt><dd>{car.model}</dd></div>
              <div><dt>Horsepower</dt><dd>{car.horsepower} hp</dd></div>
              <div><dt>Price</dt><dd>${car.price_new.toLocaleString()}</dd></div>
              <div><dt>Fuel</dt><dd>{car.fuel}</dd></div>
              <div><dt>Drivetrain</dt><dd>{car.drivetrain}</dd></div>
              <div><dt>Origin</dt><dd>{origin}</dd></div>
              <div><dt>Era</dt><dd>{eraLabel(car.year)}</dd></div>
            </dl>
          </div>

          <aside>
            <div className="panel stats-card">
              <h3>Quick Stats</h3>
              <p className="avg-rating"><span>★</span> {activeRating ? activeRating.toFixed(1) : '0.0'}</p>
              <p><strong>0</strong> drivers <span className="meta">(API metric pending)</span></p>
              <p><strong>0</strong> garages <span className="meta">(API metric pending)</span></p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
