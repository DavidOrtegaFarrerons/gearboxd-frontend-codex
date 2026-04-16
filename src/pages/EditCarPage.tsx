import { FormEvent, useState } from 'react';
import { getCar, updateCar } from '../api/cars';
import { getApiErrorMessage, getApiFieldErrors, getFieldError, type FieldErrors } from '../api/errors';
import { getSessionToken } from '../state/sessionToken';

const bodyOptions = ['Sedan', 'Coupé', 'Roadster', 'Hatchback', 'SUV', 'Wagon', 'Truck', 'Van'];
const gearboxOptions = ['manual', 'automatic', 'DCT', 'CVT'];
const fuelOptions = ['diesel', 'gas', 'electric', 'hybrid', 'plug-in-hybrid', 'hydrogen', 'lpg', 'cng'];
const drivetrainOptions = ['FWD', 'RWD', 'AWD', '4WD'];

const extractMetadata = (description: string | undefined) => {
  const text = description ?? '';
  const bodyType = text.match(/\[Body Type: ([^\]]+)\]/)?.[1] ?? 'Sedan';
  const plainDescription = text
    .replace(/\[Body Type: ([^\]]+)\]\s*/g, '')
    .trim();

  return { bodyType, plainDescription };
};

export default function EditCarPage() {
  const [carId, setCarId] = useState('');
  const [fields, setFields] = useState({
    make: '',
    model: '',
    year: '',
    description: '',
    imageURL: '',
    gearbox: 'manual',
    drivetrain: 'FWD',
    horsepower: '',
    fuel: 'diesel',
    bodyType: 'Sedan',
    price: '',
  });
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors | undefined>(undefined);

  const fillFromCar = async () => {
    if (!carId) return;
    setMessage(null);
    setError(null);
    setFieldErrors(undefined);
    try {
      const car = await getCar(carId);
      const metadata = extractMetadata(car.description);
      setFields({
        make: car.make,
        model: car.model,
        year: String(car.year),
        description: metadata.plainDescription,
        imageURL: car.image_url || '',
        gearbox: car.gearbox,
        drivetrain: car.drivetrain,
        horsepower: String(car.horsepower),
        fuel: car.fuel,
        bodyType: metadata.bodyType,
        price: String(car.price_new),
      });
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to load car.'));
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setMessage(null);
    setError(null);

    const token = getSessionToken();
    if (!token) return setError('Missing token. Log in first.');

    try {
      const metadataPrefix = `[Body Type: ${fields.bodyType}]`;
      const updated = await updateCar(carId, {
        make: fields.make,
        model: fields.model,
        year: Number(fields.year),
        description: `${metadataPrefix} ${fields.description}`.trim(),
        image_url: fields.imageURL,
        gearbox: fields.gearbox,
        drivetrain: fields.drivetrain,
        horsepower: Number(fields.horsepower),
        fuel: fields.fuel,
        price_new: Number(fields.price),
      }, token);
      setMessage(`Updated car ${updated.id}.`);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to update car.'));
      setFieldErrors(getApiFieldErrors(err));
    }
  };

  return (
    <section className="form-page content-wrap section-space">
      <h1 className="page-title centered">Edit Car</h1>
      <form onSubmit={handleSubmit} className="panel narrow-form">
        <label>Car ID<input required value={carId} onChange={(e) => setCarId(e.target.value)} /></label>
        <button type="button" className="button secondary" onClick={fillFromCar}>Load existing values</button>
        <label>Make<input value={fields.make} onChange={(e) => setFields((p) => ({ ...p, make: e.target.value }))} />{getFieldError(fieldErrors, 'make') && <span className="error-text">{getFieldError(fieldErrors, 'make')}</span>}</label>
        <label>Model<input value={fields.model} onChange={(e) => setFields((p) => ({ ...p, model: e.target.value }))} />{getFieldError(fieldErrors, 'model') && <span className="error-text">{getFieldError(fieldErrors, 'model')}</span>}</label>
        <label>Year<input type="number" value={fields.year} onChange={(e) => setFields((p) => ({ ...p, year: e.target.value }))} />{getFieldError(fieldErrors, 'year') && <span className="error-text">{getFieldError(fieldErrors, 'year')}</span>}</label>
        <label>Body Type<select value={fields.bodyType} onChange={(e) => setFields((p) => ({ ...p, bodyType: e.target.value }))}>{bodyOptions.map((opt) => <option key={opt}>{opt}</option>)}</select></label>
        <label>Gearbox<select value={fields.gearbox} onChange={(e) => setFields((p) => ({ ...p, gearbox: e.target.value }))}>{gearboxOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}</select></label>
        <label>Fuel<select value={fields.fuel} onChange={(e) => setFields((p) => ({ ...p, fuel: e.target.value }))}>{fuelOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}</select></label>
        <label>Drivetrain<select value={fields.drivetrain} onChange={(e) => setFields((p) => ({ ...p, drivetrain: e.target.value }))}>{drivetrainOptions.map((opt) => <option key={opt}>{opt}</option>)}</select></label>
        <label>Horsepower<input type="number" value={fields.horsepower} onChange={(e) => setFields((p) => ({ ...p, horsepower: e.target.value }))} />{getFieldError(fieldErrors, 'horsepower') && <span className="error-text">{getFieldError(fieldErrors, 'horsepower')}</span>}</label>
        <label>Price<input type="number" value={fields.price} onChange={(e) => setFields((p) => ({ ...p, price: e.target.value }))} />{getFieldError(fieldErrors, 'price_new', 'price') && <span className="error-text">{getFieldError(fieldErrors, 'price_new', 'price')}</span>}</label>
        <label>Description<textarea rows={4} value={fields.description} onChange={(e) => setFields((p) => ({ ...p, description: e.target.value }))} />{getFieldError(fieldErrors, 'description') && <span className="error-text">{getFieldError(fieldErrors, 'description')}</span>}</label>
        <label>Image URL<input required value={fields.imageURL} onChange={(e) => setFields((p) => ({ ...p, imageURL: e.target.value }))} />{getFieldError(fieldErrors, 'image_url', 'imageURL') && <span className="error-text">{getFieldError(fieldErrors, 'image_url', 'imageURL')}</span>}</label>
        <button type="submit" className="button primary full">Save Changes</button>
        <a href={`/cars/delete?id=${encodeURIComponent(carId)}`} className="button destructive" style={{ textAlign: 'center' }}>Delete this car</a>
        {message && <p className="success-text">{message}</p>}
        {error && <p className="error-text">{error}</p>}
      </form>
    </section>
  );
}
