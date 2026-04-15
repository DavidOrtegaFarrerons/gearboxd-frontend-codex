import { FormEvent, useMemo, useState } from 'react';
import { createCar } from '../api/cars';
import { getSessionToken } from '../state/sessionToken';

const bodyOptions = ['Sedan', 'Coupé', 'Roadster', 'Hatchback', 'SUV', 'Wagon', 'Truck', 'Van'];
const drivetrainOptions = ['FWD', 'RWD', 'AWD', '4WD'];
const originOptions = ['Japan', 'Germany', 'Italy', 'UK', 'USA', 'France', 'Sweden', 'South Korea', 'Other'];

export default function CreateCarPage() {
  const [form, setForm] = useState({ make: '', model: '', year: '', horsepower: '', price: '', bodyType: 'Sedan', drivetrain: 'FWD', origin: 'Japan', description: '', imageURL: '' });
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const era = useMemo(() => {
    const year = Number(form.year);
    return Number.isFinite(year) && year > 1900 ? `'${String(year).slice(2, 3)}0s` : '—';
  }, [form.year]);

  const onChange = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setMessage(null);
    setError(null);

    const token = getSessionToken();
    if (!token) return setError('Missing token. Log in first.');

    try {
      const created = await createCar({
        make: form.make,
        model: form.model,
        year: Number(form.year),
        description: form.description,
        image_url: form.imageURL,
        gearbox: form.bodyType,
        drivetrain: form.drivetrain,
        horsepower: Number(form.horsepower),
        fuel: form.origin,
        price_new: Number(form.price),
      }, token);
      setMessage(`Created car ${created.id}.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create car.');
    }
  };

  return (
    <section className="form-page content-wrap section-space">
      <h1 className="page-title centered">Add a New Car</h1>
      <form onSubmit={handleSubmit} className="panel narrow-form">
        <label>Make<input required value={form.make} onChange={(e) => onChange('make', e.target.value)} /></label>
        <label>Model<input required value={form.model} onChange={(e) => onChange('model', e.target.value)} /></label>
        <label>Year<input type="number" required value={form.year} onChange={(e) => onChange('year', e.target.value)} /></label>
        <label>Horsepower<input type="number" required value={form.horsepower} onChange={(e) => onChange('horsepower', e.target.value)} /></label>
        <label>Price<input type="number" required value={form.price} onChange={(e) => onChange('price', e.target.value)} /></label>
        <label>Body Type<select value={form.bodyType} onChange={(e) => onChange('bodyType', e.target.value)}>{bodyOptions.map((opt) => <option key={opt}>{opt}</option>)}</select></label>
        <label>Drivetrain<select value={form.drivetrain} onChange={(e) => onChange('drivetrain', e.target.value)}>{drivetrainOptions.map((opt) => <option key={opt}>{opt}</option>)}</select></label>
        <label>Origin<select value={form.origin} onChange={(e) => onChange('origin', e.target.value)}>{originOptions.map((opt) => <option key={opt}>{opt}</option>)}</select></label>
        <label>Era<span className="badge badge-era readonly">{era}</span></label>
        <label>Description<textarea rows={4} required value={form.description} onChange={(e) => onChange('description', e.target.value)} /></label>
        <label>Image URL (optional)<input value={form.imageURL} onChange={(e) => onChange('imageURL', e.target.value)} /></label>
        <button type="submit" className="button primary full">Add Car</button>
        {message && <p className="success-text">{message}</p>}
        {error && <p className="error-text">{error}</p>}
      </form>
    </section>
  );
}
