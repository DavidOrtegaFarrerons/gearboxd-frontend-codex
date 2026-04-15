import { FormEvent, useState } from 'react';
import { getCar, updateCar } from '../api/cars';
import { getSessionToken } from '../state/sessionToken';

export default function EditCarPage() {
  const [carId, setCarId] = useState('');
  const [fields, setFields] = useState({ make: '', model: '', year: '', description: '', imageURL: '', gearbox: '', drivetrain: '', horsepower: '', fuel: '', price: '' });
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fillFromCar = async () => {
    if (!carId) return;
    try {
      const car = await getCar(carId);
      setFields({
        make: car.make,
        model: car.model,
        year: String(car.year),
        description: car.description || '',
        imageURL: car.image_url || '',
        gearbox: car.gearbox,
        drivetrain: car.drivetrain,
        horsepower: String(car.horsepower),
        fuel: car.fuel,
        price: String(car.price_new),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load car.');
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setMessage(null);
    setError(null);

    const token = getSessionToken();
    if (!token) return setError('Missing token. Log in first.');

    try {
      const updated = await updateCar(carId, {
        make: fields.make,
        model: fields.model,
        year: Number(fields.year),
        description: fields.description,
        image_url: fields.imageURL,
        gearbox: fields.gearbox,
        drivetrain: fields.drivetrain,
        horsepower: Number(fields.horsepower),
        fuel: fields.fuel,
        price_new: Number(fields.price),
      }, token);
      setMessage(`Updated car ${updated.id}.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update car.');
    }
  };

  return (
    <section className="form-page content-wrap section-space">
      <h1 className="page-title centered">Edit Car</h1>
      <form onSubmit={handleSubmit} className="panel narrow-form">
        <label>Car ID<input required value={carId} onChange={(e) => setCarId(e.target.value)} /></label>
        <button type="button" className="button secondary" onClick={fillFromCar}>Load existing values</button>
        <label>Make<input value={fields.make} onChange={(e) => setFields((p) => ({ ...p, make: e.target.value }))} /></label>
        <label>Model<input value={fields.model} onChange={(e) => setFields((p) => ({ ...p, model: e.target.value }))} /></label>
        <label>Year<input type="number" value={fields.year} onChange={(e) => setFields((p) => ({ ...p, year: e.target.value }))} /></label>
        <label>Description<textarea rows={4} value={fields.description} onChange={(e) => setFields((p) => ({ ...p, description: e.target.value }))} /></label>
        <label>Image URL<input value={fields.imageURL} onChange={(e) => setFields((p) => ({ ...p, imageURL: e.target.value }))} /></label>
        <button type="submit" className="button primary full">Save Changes</button>
        <a href="/cars/delete" className="button destructive" style={{ textAlign: 'center' }}>Delete this car</a>
        {message && <p className="success-text">{message}</p>}
        {error && <p className="error-text">{error}</p>}
      </form>
    </section>
  );
}
