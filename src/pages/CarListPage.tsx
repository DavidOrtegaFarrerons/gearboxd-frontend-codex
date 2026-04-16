import { FormEvent, useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import CarCard from '../components/CarCard';
import { listCars, type Car, type ListCarsParams } from '../api/cars';
import { getApiErrorMessage } from '../api/errors';
import { useAuth } from '../state/auth';

type CarFilterValues = {
  make: string;
  model: string;
  year: string;
  gearbox: string;
  drivetrain: string;
  fuel: string;
  horsepowerMin: string;
  horsepowerMax: string;
  priceMin: string;
  priceMax: string;
  sort: string;
};

const defaultFilters: CarFilterValues = {
  make: '',
  model: '',
  year: '',
  gearbox: '',
  drivetrain: '',
  fuel: '',
  horsepowerMin: '',
  horsepowerMax: '',
  priceMin: '',
  priceMax: '',
  sort: 'make',
};

const sortOptions = [
  { value: 'make', label: 'Make (A–Z)' },
  { value: '-make', label: 'Make (Z–A)' },
  { value: 'year', label: 'Year (Oldest first)' },
  { value: '-year', label: 'Year (Newest first)' },
  { value: 'horsepower', label: 'Horsepower (Low to high)' },
  { value: '-horsepower', label: 'Horsepower (High to low)' },
  { value: 'price', label: 'Price (Low to high)' },
  { value: '-price', label: 'Price (High to low)' },
];

const gearboxOptions = ['', 'Manual', 'Automatic', 'CVT', 'DCT'];
const drivetrainOptions = ['', 'FWD', 'RWD', 'AWD', '4WD'];
const fuelOptions = ['', 'Petrol', 'Diesel', 'Hybrid', 'Electric', 'LPG'];

function toInt(value: string): number | undefined {
  if (!value.trim()) {
    return undefined;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function toDecimal(value: string): number | undefined {
  if (!value.trim()) {
    return undefined;
  }

  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function toParams(filters: CarFilterValues, page: number, pageSize: number): ListCarsParams {
  return {
    make: filters.make.trim() || undefined,
    model: filters.model.trim() || undefined,
    year: toInt(filters.year),
    gearbox: filters.gearbox || undefined,
    drivetrain: filters.drivetrain || undefined,
    fuel: filters.fuel || undefined,
    horsepower_min: toInt(filters.horsepowerMin),
    horsepower_max: toInt(filters.horsepowerMax),
    price_min: toDecimal(filters.priceMin),
    price_max: toDecimal(filters.priceMax),
    page,
    pageSize,
    sort: filters.sort,
  };
}

export default function CarListPage() {
  const { isAuthenticated } = useAuth();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<CarFilterValues>(defaultFilters);
  const [appliedFilters, setAppliedFilters] = useState<CarFilterValues>(defaultFilters);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [apiPageSize, setApiPageSize] = useState(20);
  const pageSize = 20;

  useEffect(() => {
    const loadCars = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await listCars(toParams(appliedFilters, page, pageSize));
        setCars(response.items);
        setTotal(response.total);
        setApiPageSize(response.pageSize || pageSize);
      } catch (err) {
        setError(getApiErrorMessage(err, 'Failed to load cars.'));
      } finally {
        setLoading(false);
      }
    };

    void loadCars();
  }, [appliedFilters, page]);

  const handleFilterSubmit = (event: FormEvent) => {
    event.preventDefault();
    setPage(1);
    setAppliedFilters(filters);
  };

  const clearFilters = () => {
    setFilters(defaultFilters);
    setAppliedFilters(defaultFilters);
    setPage(1);
  };

  const hasActiveFilters = useMemo(
    () => Object.entries(appliedFilters).some(([key, value]) => key !== 'sort' && Boolean(value.trim())),
    [appliedFilters],
  );

  const totalPages = Math.max(1, Math.ceil(total / Math.max(1, apiPageSize)));

  return (
    <section className="content-wrap section-space">
      <div className="page-head">
        <h1 className="page-title">Cars</h1>
        {isAuthenticated && <Link className="button primary" to="/cars/create">+ Add New Car</Link>}
      </div>

      <div className="catalog-layout">
        <aside className="filters-sidebar panel" aria-label="Car filters">
          <h2>Filters</h2>

          <form onSubmit={handleFilterSubmit} className="filters-form">
            <label>
              Make
              <input
                type="text"
                value={filters.make}
                onChange={(event) => setFilters((previous) => ({ ...previous, make: event.target.value }))}
                placeholder="e.g. Mazda"
              />
            </label>

            <label>
              Model
              <input
                type="text"
                value={filters.model}
                onChange={(event) => setFilters((previous) => ({ ...previous, model: event.target.value }))}
                placeholder="e.g. MX-5"
              />
            </label>

            <label>
              Year
              <input
                type="number"
                min={1900}
                max={2100}
                value={filters.year}
                onChange={(event) => setFilters((previous) => ({ ...previous, year: event.target.value }))}
                placeholder="e.g. 2020"
              />
            </label>

            <label>
              Gearbox
              <select
                value={filters.gearbox}
                onChange={(event) => setFilters((previous) => ({ ...previous, gearbox: event.target.value }))}
              >
                {gearboxOptions.map((option) => (
                  <option key={option || 'all'} value={option}>{option || 'All'}</option>
                ))}
              </select>
            </label>

            <label>
              Drivetrain
              <select
                value={filters.drivetrain}
                onChange={(event) => setFilters((previous) => ({ ...previous, drivetrain: event.target.value }))}
              >
                {drivetrainOptions.map((option) => (
                  <option key={option || 'all'} value={option}>{option || 'All'}</option>
                ))}
              </select>
            </label>

            <label>
              Fuel
              <select
                value={filters.fuel}
                onChange={(event) => setFilters((previous) => ({ ...previous, fuel: event.target.value }))}
              >
                {fuelOptions.map((option) => (
                  <option key={option || 'all'} value={option}>{option || 'All'}</option>
                ))}
              </select>
            </label>

            <div className="range-row">
              <label>
                Horsepower min
                <input
                  type="number"
                  min={0}
                  value={filters.horsepowerMin}
                  onChange={(event) => setFilters((previous) => ({ ...previous, horsepowerMin: event.target.value }))}
                  placeholder="0"
                />
              </label>
              <label>
                Horsepower max
                <input
                  type="number"
                  min={0}
                  value={filters.horsepowerMax}
                  onChange={(event) => setFilters((previous) => ({ ...previous, horsepowerMax: event.target.value }))}
                  placeholder="0"
                />
              </label>
            </div>

            <div className="range-row">
              <label>
                Price min
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  value={filters.priceMin}
                  onChange={(event) => setFilters((previous) => ({ ...previous, priceMin: event.target.value }))}
                  placeholder="0"
                />
              </label>
              <label>
                Price max
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  value={filters.priceMax}
                  onChange={(event) => setFilters((previous) => ({ ...previous, priceMax: event.target.value }))}
                  placeholder="0"
                />
              </label>
            </div>

            <label>
              Sort
              <select
                value={filters.sort}
                onChange={(event) => setFilters((previous) => ({ ...previous, sort: event.target.value }))}
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </label>

            <div className="filter-actions">
              <button type="submit" className="button primary">Apply filters</button>
              <button type="button" className="button secondary" onClick={clearFilters}>Reset</button>
            </div>
          </form>
        </aside>

        <div className="catalog-results">
          {hasActiveFilters && <p className="muted">Showing filtered results</p>}
          {loading && <p className="muted">Loading cars from API…</p>}
          {error && <p role="alert" className="error-text">{error}</p>}

          {!loading && !error && (
            <>
              <div className="cars-grid">
                {cars.map((car) => <CarCard car={car} key={car.id} />)}
              </div>

              <div className="pagination-row">
                <button type="button" className="button secondary" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
                  <ChevronLeft size={16} /> Previous
                </button>
                <span>Page {page} of {totalPages}</span>
                <button type="button" className="button secondary" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages}>
                  Next <ChevronRight size={16} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
