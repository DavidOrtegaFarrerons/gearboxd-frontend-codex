import { FormEvent, useMemo, useState } from 'react';
import { createCar } from '../api/cars';
import { getFieldError, type FieldErrors } from '../api/errors';
import { getSessionToken } from '../state/sessionToken';

const bodyOptions = ['Sedan', 'Coupé', 'Roadster', 'Hatchback', 'SUV', 'Wagon', 'Truck', 'Van'];
const drivetrainOptions = ['FWD', 'RWD', 'AWD', '4WD'];
const originOptions = ['Japan', 'Germany', 'Italy', 'UK', 'USA', 'France', 'Sweden', 'South Korea', 'Other'];
const gearboxOptions = ['Manual', 'Automatic', 'Semi-auto'];
const fuelOptions = ['Petrol', 'Diesel', 'Electric', 'Hybrid'];

export default function CreateCarPage() {
  const [form, setForm] = useState({
    make: '',
    model: '',
    year: '',
    horsepower: '',
    price: '',
    bodyType: 'Sedan',
    drivetrain: 'FWD',
    origin: 'Japan',
    gearbox: 'Manual',
    fuel: 'Petrol',
    description: '',
    imageURL: '',
  });
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors | undefined>(undefined);

  const era = useMemo(() => {
    const year = Number(form.year);
    return Number.isFinite(year) && year > 1900 ? `'${String(year).slice(2, 3)}0s` : '—';
  }, [form.year]);

  const onChange = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setMessage(null);
    setError(null);
    setFieldErrors(undefined);

    const token = getSessionToken();
    if (!token) return setError('Missing token. Log in first.');

    try {
      const metadataPrefix = `[Body Type: ${form.bodyType}] [Origin: ${form.origin}]`;
      const created = await createCar({
        make: form.make,
        model: form.model,
        year: Number(form.year),
        description: `${metadataPrefix} ${form.description}`.trim(),
        image_url: form.imageURL,
        gearbox: form.gearbox,
        drivetrain: form.drivetrain,
        horsepower: Number(form.horsepower),
        fuel: form.fuel,
        price_new: Number(form.price),
      }, token);
      setMessage(`Created car ${created.id}.`);
    } catch (err) {
      if (err && typeof err === 'object' && 'message' in err) {
        const typedError = err as { message?: string; fieldErrors?: FieldErrors };
        setError(typedError.message ?? 'Failed to create car.');
        setFieldErrors(typedError.fieldErrors);
      } else {
        setError('Failed to create car.');
      }
    }
  };

  return (
    <section className="form-page content-wrap section-space">
      <h1 className="page-title centered">Add a New Car</h1>
      <form onSubmit={handleSubmit} className="panel narrow-form">
        <label>Make<input required value={form.make} onChange={(e) => onChange('make', e.target.value)} />{getFieldError(fieldErrors, 'make') && <span className="error-text">{getFieldError(fieldErrors, 'make')}</span>}</label>
        <label>Model<input required value={form.model} onChange={(e) => onChange('model', e.target.value)} />{getFieldError(fieldErrors, 'model') && <span className="error-text">{getFieldError(fieldErrors, 'model')}</span>}</label>
        <label>Year<input type="number" required value={form.year} onChange={(e) => onChange('year', e.target.value)} />{getFieldError(fieldErrors, 'year') && <span className="error-text">{getFieldError(fieldErrors, 'year')}</span>}</label>
        <label>Horsepower<input type="number" required value={form.horsepower} onChange={(e) => onChange('horsepower', e.target.value)} />{getFieldError(fieldErrors, 'horsepower') && <span className="error-text">{getFieldError(fieldErrors, 'horsepower')}</span>}</label>
        <label>Price<input type="number" required value={form.price} onChange={(e) => onChange('price', e.target.value)} />{getFieldError(fieldErrors, 'price_new', 'price') && <span className="error-text">{getFieldError(fieldErrors, 'price_new', 'price')}</span>}</label>
        <label>Body Type<select value={form.bodyType} onChange={(e) => onChange('bodyType', e.target.value)}>{bodyOptions.map((opt) => <option key={opt}>{opt}</option>)}</select></label>
        <label>Drivetrain<select value={form.drivetrain} onChange={(e) => onChange('drivetrain', e.target.value)}>{drivetrainOptions.map((opt) => <option key={opt}>{opt}</option>)}</select></label>
        <label>Origin<select value={form.origin} onChange={(e) => onChange('origin', e.target.value)}>{originOptions.map((opt) => <option key={opt}>{opt}</option>)}</select></label>
        <label>Gearbox<select value={form.gearbox} onChange={(e) => onChange('gearbox', e.target.value)}>{gearboxOptions.map((opt) => <option key={opt}>{opt}</option>)}</select></label>
        <label>Fuel<select value={form.fuel} onChange={(e) => onChange('fuel', e.target.value)}>{fuelOptions.map((opt) => <option key={opt}>{opt}</option>)}</select></label>
        <label>Era<span className="badge badge-era readonly">{era}</span></label>
        <label>Description<textarea rows={4} required value={form.description} onChange={(e) => onChange('description', e.target.value)} />{getFieldError(fieldErrors, 'description') && <span className="error-text">{getFieldError(fieldErrors, 'description')}</span>}</label>
        <label>Image URL (optional)<input value={form.imageURL} onChange={(e) => onChange('imageURL', e.target.value)} />{getFieldError(fieldErrors, 'image_url', 'imageURL') && <span className="error-text">{getFieldError(fieldErrors, 'image_url', 'imageURL')}</span>}</label>
        <button type="submit" className="button primary full">Add Car</button>
        {message && <p className="success-text">{message}</p>}
        {error && <p className="error-text">{error}</p>}
      </form>
    </section>
  );
}
