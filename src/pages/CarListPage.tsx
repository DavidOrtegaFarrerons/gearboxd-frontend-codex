import { FormEvent, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Car, ListCarsParams, listCars } from '../api/cars';

type FilterState = {
  make: string;
  model: string;
  year: string;
  gearbox: string;
  drivetrain: string;
  fuel: string;
  horsepower_min: string;
  horsepower_max: string;
  price_min: string;
  price_max: string;
  sort: string;
};

const DEFAULT_FILTERS: FilterState = {
  make: '',
  model: '',
  year: '',
  gearbox: '',
  drivetrain: '',
  fuel: '',
  horsepower_min: '',
  horsepower_max: '',
  price_min: '',
  price_max: '',
  sort: 'make',
};

function parseNumber(value: string): number | undefined {
  if (!value.trim()) {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function filtersToParams(filters: FilterState): ListCarsParams {
  return {
    page: 1,
    pageSize: 24,
    sort: filters.sort,
    make: filters.make.trim() || undefined,
    model: filters.model.trim() || undefined,
    year: parseNumber(filters.year),
    gearbox: filters.gearbox.trim() || undefined,
    drivetrain: filters.drivetrain.trim() || undefined,
    fuel: filters.fuel.trim() || undefined,
    horsepower_min: parseNumber(filters.horsepower_min),
    horsepower_max: parseNumber(filters.horsepower_max),
    price_min: parseNumber(filters.price_min),
    price_max: parseNumber(filters.price_max),
  };
}

function paramsFromSearch(searchParams: URLSearchParams): FilterState {
  return {
    make: searchParams.get('make') ?? '',
    model: searchParams.get('model') ?? '',
    year: searchParams.get('year') ?? '',
    gearbox: searchParams.get('gearbox') ?? '',
    drivetrain: searchParams.get('drivetrain') ?? '',
    fuel: searchParams.get('fuel') ?? '',
    horsepower_min: searchParams.get('horsepower_min') ?? '',
    horsepower_max: searchParams.get('horsepower_max') ?? '',
    price_min: searchParams.get('price_min') ?? '',
    price_max: searchParams.get('price_max') ?? '',
    sort: searchParams.get('sort') ?? 'make',
  };
}

export default function CarListPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<FilterState>(() => paramsFromSearch(searchParams));

  useEffect(() => {
    setFilters(paramsFromSearch(searchParams));

    const loadCars = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await listCars(filtersToParams(paramsFromSearch(searchParams)));
        setCars(response.items);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load cars.');
      } finally {
        setLoading(false);
      }
    };

    void loadCars();
  }, [searchParams]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextParams = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value.trim()) {
        nextParams.set(key, value.trim());
      }
    });

    setSearchParams(nextParams);
  };

  const handleReset = () => {
    setFilters(DEFAULT_FILTERS);
    setSearchParams(new URLSearchParams());
  };

  return (
    <section>
      <div className="hero">
        <p className="eyebrow">Public Inventory</p>
        <h1>Find Your Next Driver&apos;s Car</h1>
        <p>Inventory is loaded live from the Gearboxd API.</p>
      </div>

      <div className="inventory-layout">
        <aside className="card filters-panel">
          <h2>Filters</h2>
          <form onSubmit={handleSubmit} className="filters-form">
            <input
              placeholder="Make"
              value={filters.make}
              onChange={(event) => setFilters((prev) => ({ ...prev, make: event.target.value }))}
            />
            <input
              placeholder="Model"
              value={filters.model}
              onChange={(event) => setFilters((prev) => ({ ...prev, model: event.target.value }))}
            />
            <input
              type="number"
              placeholder="Year"
              value={filters.year}
              onChange={(event) => setFilters((prev) => ({ ...prev, year: event.target.value }))}
            />
            <input
              placeholder="Gearbox"
              value={filters.gearbox}
              onChange={(event) => setFilters((prev) => ({ ...prev, gearbox: event.target.value }))}
            />
            <input
              placeholder="Drivetrain"
              value={filters.drivetrain}
              onChange={(event) => setFilters((prev) => ({ ...prev, drivetrain: event.target.value }))}
            />
            <input
              placeholder="Fuel"
              value={filters.fuel}
              onChange={(event) => setFilters((prev) => ({ ...prev, fuel: event.target.value }))}
            />
            <input
              type="number"
              placeholder="Horsepower min"
              value={filters.horsepower_min}
              onChange={(event) => setFilters((prev) => ({ ...prev, horsepower_min: event.target.value }))}
            />
            <input
              type="number"
              placeholder="Horsepower max"
              value={filters.horsepower_max}
              onChange={(event) => setFilters((prev) => ({ ...prev, horsepower_max: event.target.value }))}
            />
            <input
              type="number"
              step="0.01"
              placeholder="Price min"
              value={filters.price_min}
              onChange={(event) => setFilters((prev) => ({ ...prev, price_min: event.target.value }))}
            />
            <input
              type="number"
              step="0.01"
              placeholder="Price max"
              value={filters.price_max}
              onChange={(event) => setFilters((prev) => ({ ...prev, price_max: event.target.value }))}
            />
            <select
              value={filters.sort}
              onChange={(event) => setFilters((prev) => ({ ...prev, sort: event.target.value }))}
            >
              <option value="make">Make (A-Z)</option>
              <option value="-make">Make (Z-A)</option>
              <option value="year">Year (old-new)</option>
              <option value="-year">Year (new-old)</option>
              <option value="horsepower">Horsepower (low-high)</option>
              <option value="-horsepower">Horsepower (high-low)</option>
              <option value="price">Price (low-high)</option>
              <option value="-price">Price (high-low)</option>
            </select>

            <button type="submit">Apply filters</button>
            <button type="button" className="button-secondary" onClick={handleReset}>Reset</button>
          </form>
        </aside>

        <div>
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
                  <p style={{ color: '#7af7c8' }}>${car.price_new.toLocaleString()}</p>
                  <Link to={`/cars/${car.id}`}>View details</Link>
                </article>
              ))}
              {cars.length === 0 && <p>No cars returned by the API.</p>}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
