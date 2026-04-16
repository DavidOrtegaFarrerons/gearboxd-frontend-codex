import { FormEvent, useState } from 'react';
import { createCar } from '../api/cars';
import { getApiErrorMessage, getApiFieldErrors, getFieldError, type FieldErrors } from '../api/errors';
import { getSessionToken } from '../state/sessionToken';

const bodyOptions = ['Sedan', 'Coupé', 'Roadster', 'Hatchback', 'SUV', 'Wagon', 'Truck', 'Van'];
const drivetrainOptions = ['FWD', 'RWD', 'AWD', '4WD'];
const gearboxOptions = ['manual', 'automatic', 'DCT', 'CVT'];
const fuelOptions = ['diesel', 'gas', 'electric', 'hybrid', 'plug-in-hybrid', 'hydrogen', 'lpg', 'cng'];

export default function CreateCarPage() {
  const [form, setForm] = useState({
    make: '',
    model: '',
    year: '',
    horsepower: '',
    price: '',
    bodyType: 'Sedan',
    drivetrain: 'FWD',
    gearbox: 'manual',
    fuel: 'diesel',
    description: '',
    imageURL: '',
  });
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors | undefined>(undefined);

  const onChange = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setMessage(null);
    setError(null);
    setFieldErrors(undefined);

    const token = getSessionToken();
    if (!token) return setError('Missing token. Log in first.');

    try {
      const metadataPrefix = `[Body Type: ${form.bodyType}]`;
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
      setError(getApiErrorMessage(err, 'Failed to create car.'));
      setFieldErrors(getApiFieldErrors(err));
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
        <label>Gearbox<select value={form.gearbox} onChange={(e) => onChange('gearbox', e.target.value)}>{gearboxOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}</select></label>
        <label>Fuel<select value={form.fuel} onChange={(e) => onChange('fuel', e.target.value)}>{fuelOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}</select></label>
        <label>Description<textarea rows={4} required value={form.description} onChange={(e) => onChange('description', e.target.value)} />{getFieldError(fieldErrors, 'description') && <span className="error-text">{getFieldError(fieldErrors, 'description')}</span>}</label>
        <label>Image URL<input required value={form.imageURL} onChange={(e) => onChange('imageURL', e.target.value)} />{getFieldError(fieldErrors, 'image_url', 'imageURL') && <span className="error-text">{getFieldError(fieldErrors, 'image_url', 'imageURL')}</span>}</label>
        <button type="submit" className="button primary full">Add Car</button>
        {message && <p className="success-text">{message}</p>}
        {error && <p className="error-text">{error}</p>}
      </form>
    </section>
  );
}
