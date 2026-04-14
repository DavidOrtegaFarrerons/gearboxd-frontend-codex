import { useEffect, useMemo, useState } from 'react';
import { createCar, deleteCar, listCars, updateCar } from '../api';
import { Car, CarFilters, CarFormValues } from '../types';
import { CarCard } from '../components/CarCard';
import { CarForm } from '../components/CarForm';
import { DeleteCarModal } from '../components/DeleteCarModal';

const defaultFilters: CarFilters = {
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
  page: 1,
  page_size: 12,
  sort: 'price_desc',
};

const skeletonCard = (
  <div style={{ border: '1px solid #e2e8f0', borderRadius: 16, overflow: 'hidden', background: '#fff' }}>
    <div style={{ height: 190, background: 'linear-gradient(90deg, #f1f5f9, #e2e8f0, #f1f5f9)' }} />
    <div style={{ padding: '1rem', display: 'grid', gap: '0.55rem' }}>
      <div style={{ width: '65%', height: 12, backgroundColor: '#e2e8f0' }} />
      <div style={{ width: '45%', height: 10, backgroundColor: '#e2e8f0' }} />
      <div style={{ width: '90%', height: 10, backgroundColor: '#e2e8f0' }} />
    </div>
  </div>
);

export function CarListPage() {
  const [filters, setFilters] = useState(defaultFilters);
  const [cars, setCars] = useState<Car[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCar, setActiveCar] = useState<Car | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Car | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const pageCount = useMemo(() => Math.max(1, Math.ceil(total / (filters.page_size || 12))), [total, filters.page_size]);

  const loadCars = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await listCars(filters);
      setCars(result.items);
      setTotal(result.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong while loading cars.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadCars();
  }, [filters]);

  const updateFilter = (key: keyof CarFilters, value: string | number) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: key === 'page' ? Number(value) : 1 }));
  };

  const handleSaveCar = async (values: CarFormValues) => {
    setIsSaving(true);
    try {
      if (activeCar) {
        await updateCar(activeCar.id, values);
      } else {
        await createCar(values);
      }
      setActiveCar(null);
      await loadCars();
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!pendingDelete) return;
    const deletedId = pendingDelete.id;
    setIsDeleting(true);

    const snapshot = cars;
    setCars((prev) => prev.filter((car) => car.id !== deletedId));
    setPendingDelete(null);

    try {
      await deleteCar(deletedId);
      await loadCars();
    } catch {
      setCars(snapshot);
      setError('Delete failed and your view was restored.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <section style={{ padding: '1.2rem', display: 'grid', gap: '1rem' }}>
      <header
        style={{
          borderRadius: 20,
          padding: '1.2rem',
          background: 'linear-gradient(135deg, #0f172a 0%, #1d4ed8 56%, #38bdf8 100%)',
          color: '#fff',
        }}
      >
        <h1 style={{ margin: 0, fontSize: '1.7rem' }}>Find your next gearbox-perfect ride</h1>
        <p style={{ margin: '0.6rem 0 0', opacity: 0.95 }}>
          Filter by drivetrain, transmission, fuel, and budget to discover your ideal car.
        </p>
      </header>

      <section style={{ border: '1px solid #e2e8f0', borderRadius: 16, padding: '0.9rem', backgroundColor: '#fff' }}>
        <h2 style={{ marginTop: 0 }}>Query Controls</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '0.6rem' }}>
          <input placeholder="Make" value={filters.make} onChange={(e) => updateFilter('make', e.target.value)} />
          <input placeholder="Model" value={filters.model} onChange={(e) => updateFilter('model', e.target.value)} />
          <input placeholder="Year" value={filters.year} onChange={(e) => updateFilter('year', e.target.value)} />
          <input placeholder="Gearbox" value={filters.gearbox} onChange={(e) => updateFilter('gearbox', e.target.value)} />
          <input placeholder="Drivetrain" value={filters.drivetrain} onChange={(e) => updateFilter('drivetrain', e.target.value)} />
          <input placeholder="Fuel" value={filters.fuel} onChange={(e) => updateFilter('fuel', e.target.value)} />
          <input placeholder="HP min" value={filters.horsepower_min} onChange={(e) => updateFilter('horsepower_min', e.target.value)} />
          <input placeholder="HP max" value={filters.horsepower_max} onChange={(e) => updateFilter('horsepower_max', e.target.value)} />
          <input placeholder="Price min" value={filters.price_min} onChange={(e) => updateFilter('price_min', e.target.value)} />
          <input placeholder="Price max" value={filters.price_max} onChange={(e) => updateFilter('price_max', e.target.value)} />
          <select value={filters.page_size} onChange={(e) => updateFilter('page_size', Number(e.target.value))}>
            <option value={6}>6/page</option>
            <option value={12}>12/page</option>
            <option value={24}>24/page</option>
          </select>
          <select value={filters.sort} onChange={(e) => updateFilter('sort', e.target.value)}>
            <option value="price_desc">Price high-low</option>
            <option value="price_asc">Price low-high</option>
            <option value="year_desc">Year newest</option>
            <option value="horsepower_desc">Horsepower high-low</option>
          </select>
        </div>
      </section>

      <section style={{ border: '1px solid #e2e8f0', borderRadius: 16, padding: '0.9rem', backgroundColor: '#fff' }}>
        <h2 style={{ marginTop: 0 }}>{activeCar ? 'Update Car' : 'Create Car'}</h2>
        <CarForm initialValues={activeCar ?? undefined} onSubmit={handleSaveCar} submitLabel={activeCar ? 'Update Car' : 'Create Car'} />
        {isSaving && <small>Saving changes...</small>}
      </section>

      {error && (
        <div style={{ border: '1px solid #fecaca', backgroundColor: '#fef2f2', color: '#991b1b', borderRadius: 12, padding: '0.8rem' }}>
          {error}
        </div>
      )}

      {!loading && cars.length === 0 && !error && (
        <div style={{ border: '1px dashed #94a3b8', borderRadius: 16, padding: '1.1rem', textAlign: 'center', color: '#334155' }}>
          No cars match your filters. Try broadening your criteria.
        </div>
      )}

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '0.85rem' }}>
        {loading
          ? Array.from({ length: Number(filters.page_size) || 8 }, (_, index) => <div key={index}>{skeletonCard}</div>)
          : cars.map((car) => (
              <CarCard
                key={car.id}
                car={car}
                onOpen={(carId) => {
                  window.location.assign(`/cars/${carId}`);
                }}
                onEdit={(selectedCar) => setActiveCar(selectedCar)}
                onDelete={(selectedCar) => setPendingDelete(selectedCar)}
              />
            ))}
      </section>

      <footer style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <p style={{ margin: 0, color: '#475569' }}>Showing {cars.length} of {total} results.</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <button type="button" disabled={(filters.page || 1) <= 1} onClick={() => updateFilter('page', (filters.page || 1) - 1)}>Prev</button>
          <span>{filters.page} / {pageCount}</span>
          <button type="button" disabled={(filters.page || 1) >= pageCount} onClick={() => updateFilter('page', (filters.page || 1) + 1)}>Next</button>
        </div>
      </footer>

      <DeleteCarModal
        car={pendingDelete}
        isDeleting={isDeleting}
        onCancel={() => setPendingDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </section>
  );
}
