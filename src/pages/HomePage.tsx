import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listCars, type Car } from '../api/cars';
import CarCard from '../components/CarCard';
import { getSessionToken } from '../state/sessionToken';

export default function HomePage() {
  const [cars, setCars] = useState<Car[]>([]);

  useEffect(() => {
    const load = async () => {
      const response = await listCars({ page: 1, pageSize: 8, sort: '-year' });
      setCars(response.items);
    };

    void load();
  }, []);

  const isLoggedIn = Boolean(getSessionToken());

  return (
    <section>
      <div className="home-hero">
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1>Track every car you&apos;ve ever driven.</h1>
          <p>Keep a diary of every car in your life. Rate them, review them, build your dream garage.</p>
          <Link className="button primary" to="/auth/register">Get Started — It&apos;s Free</Link>
          <p className="hero-signin">Already have an account? <Link to="/auth/login">Sign In</Link></p>
        </div>
      </div>

      <div className="content-wrap section-space">
        <div className="section-head">
          <h2>{isLoggedIn ? 'Your Recent Activity' : 'Popular Cars'}</h2>
        </div>
        <div className="horizontal-cars">
          {cars.map((car) => (
            <div key={car.id} className="horizontal-item">
              <CarCard car={car} />
            </div>
          ))}
        </div>
        <Link to="/cars" className="text-link">Browse all cars →</Link>
      </div>
    </section>
  );
}
