import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import CarCard from '../components/CarCard';
import { listCars, type Car } from '../api/cars';

const originByMake: Record<string, string> = {
  mazda: 'Japan', toyota: 'Japan', honda: 'Japan', nissan: 'Japan', subaru: 'Japan',
  bmw: 'Germany', mercedes: 'Germany', porsche: 'Germany', audi: 'Germany', volkswagen: 'Germany',
  ferrari: 'Italy', lamborghini: 'Italy', alfa: 'Italy', fiat: 'Italy',
  jaguar: 'UK', mini: 'UK', aston: 'UK',
  ford: 'USA', chevrolet: 'USA', dodge: 'USA', tesla: 'USA',
  renault: 'France', peugeot: 'France',
  volvo: 'Sweden', saab: 'Sweden',
};

const eraLabel = (year: number) => `'${String(year).slice(2, 3)}0s`;

export default function CarListPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [era, setEra] = useState('All');
  const [origin, setOrigin] = useState('All');
  const [sortBy, setSortBy] = useState('Name A–Z');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [apiPageSize, setApiPageSize] = useState(20);
  const pageSize = 20;

  useEffect(() => {
    const loadCars = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await listCars({ page, pageSize, sort: 'make' });
        setCars(response.items);
        setTotal(response.total);
        setApiPageSize(response.pageSize || pageSize);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load cars.');
      } finally {
        setLoading(false);
      }
    };

    void loadCars();
  }, [page]);

  const processedCars = useMemo(() => {
    const next = [...cars].filter((car) => {
      const q = search.trim().toLowerCase();
      const searchMatch = !q || `${car.make} ${car.model} ${car.year}`.toLowerCase().includes(q);
      const carEra = eraLabel(car.year);
      const mappedOrigin = originByMake[car.make.toLowerCase()] ?? 'Other';
      return searchMatch && (era === 'All' || carEra === era) && (origin === 'All' || mappedOrigin === origin);
    });

    switch (sortBy) {
      case 'Year ↑': next.sort((a, b) => a.year - b.year); break;
      case 'Year ↓': next.sort((a, b) => b.year - a.year); break;
      case 'Horsepower ↑': next.sort((a, b) => a.horsepower - b.horsepower); break;
      case 'Horsepower ↓': next.sort((a, b) => b.horsepower - a.horsepower); break;
      case 'Price ↑': next.sort((a, b) => a.price_new - b.price_new); break;
      case 'Price ↓': next.sort((a, b) => b.price_new - a.price_new); break;
      default: next.sort((a, b) => `${a.make} ${a.model}`.localeCompare(`${b.make} ${b.model}`));
    }

    return next;
  }, [cars, era, origin, search, sortBy]);

  const hasActiveFilters = Boolean(search.trim()) || era !== 'All' || origin !== 'All' || sortBy !== 'Name A–Z';
  const totalPages = Math.max(1, Math.ceil(total / Math.max(1, apiPageSize)));

  return (
    <section className="content-wrap section-space">
      <h1 className="page-title">Cars</h1>

      <label className="search-wrap" htmlFor="catalog-search">
        <Search size={18} />
        <input
          id="catalog-search"
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search cars by make, model, or keyword…"
          className="search-input"
        />
      </label>

      <div className="filter-row">
        <label className="filter-pill">
          <span>Era</span>
          <select value={era} onChange={(e) => setEra(e.target.value)}>
            <option>All</option><option>'60s</option><option>'70s</option><option>'80s</option><option>'90s</option><option>'00s</option><option>'10s</option><option>'20s</option>
          </select>
        </label>
        <label className="filter-pill">
          <span>Origin</span>
          <select value={origin} onChange={(e) => setOrigin(e.target.value)}>
            <option>All</option><option>Japan</option><option>Germany</option><option>Italy</option><option>UK</option><option>USA</option><option>France</option><option>Sweden</option>
          </select>
        </label>
        <label className="filter-pill">
          <span>Sort</span>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option>Name A–Z</option><option>Year ↑</option><option>Year ↓</option><option>Horsepower ↑</option><option>Horsepower ↓</option><option>Price ↑</option><option>Price ↓</option>
          </select>
        </label>
        {hasActiveFilters && <button type="button" className="text-link-button" onClick={() => { setSearch(''); setEra('All'); setOrigin('All'); setSortBy('Name A–Z'); }}>Clear filters</button>}
      </div>

      {loading && <p className="muted">Loading cars from API…</p>}
      {error && <p role="alert" className="error-text">{error}</p>}

      {!loading && !error && (
        <>
          <div className="cars-grid">
            {processedCars.map((car) => <CarCard car={car} key={car.id} />)}
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
    </section>
  );
}
