import { FormEvent, useState } from 'react';
import { updateCar } from '../api/cars';
import { getSessionToken } from '../state/sessionToken';

export default function EditCarPage() {
  const [carId, setCarId] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [description, setDescription] = useState('');
  const [imageURL, setImageURL] = useState('');
  const [gearbox, setGearbox] = useState('');
  const [drivetrain, setDrivetrain] = useState('');
  const [horsepower, setHorsepower] = useState('');
  const [fuel, setFuel] = useState('');
  const [priceNew, setPriceNew] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setMessage(null);
    setError(null);

    const token = getSessionToken();
    if (!token) {
      setError('Missing token. Log in first.');
      return;
    }

    const payload = {
      ...(make ? { make } : {}),
      ...(model ? { model } : {}),
      ...(year ? { year: Number(year) } : {}),
      ...(description ? { description } : {}),
      ...(imageURL ? { image_url: imageURL } : {}),
      ...(gearbox ? { gearbox } : {}),
      ...(drivetrain ? { drivetrain } : {}),
      ...(horsepower ? { horsepower: Number(horsepower) } : {}),
      ...(fuel ? { fuel } : {}),
      ...(priceNew ? { price_new: Number(priceNew) } : {}),
    };

    if (Object.keys(payload).length === 0) {
      setError('Provide at least one field to update.');
      return;
    }

    try {
      const updated = await updateCar(carId, payload, token);
      setMessage(`Updated car ${updated.id}.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update car.');
    }
  };

  return (
    <section className="card form-card">
      <h2>Edit Car</h2>
      <p>All PUT fields are optional. Fill only what you want to update.</p>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Car ID" value={carId} onChange={(e) => setCarId(e.target.value)} required />
        <input type="text" placeholder="Make (optional)" value={make} onChange={(e) => setMake(e.target.value)} />
        <input type="text" placeholder="Model (optional)" value={model} onChange={(e) => setModel(e.target.value)} />
        <input type="number" placeholder="Year (optional)" value={year} onChange={(e) => setYear(e.target.value)} />
        <textarea placeholder="Description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} />
        <input type="url" placeholder="Image URL (optional)" value={imageURL} onChange={(e) => setImageURL(e.target.value)} />
        <input type="text" placeholder="Gearbox (optional)" value={gearbox} onChange={(e) => setGearbox(e.target.value)} />
        <input type="text" placeholder="Drivetrain (optional)" value={drivetrain} onChange={(e) => setDrivetrain(e.target.value)} />
        <input type="number" placeholder="Horsepower (optional)" value={horsepower} onChange={(e) => setHorsepower(e.target.value)} />
        <input type="text" placeholder="Fuel (optional)" value={fuel} onChange={(e) => setFuel(e.target.value)} />
        <input type="number" step="0.01" placeholder="Price new (optional)" value={priceNew} onChange={(e) => setPriceNew(e.target.value)} />
        <button type="submit">Save changes</button>
      </form>
      {message && <p>{message}</p>}
      {error && <p role="alert" style={{ color: '#b91c1c' }}>{error}</p>}
    </section>
  );
}
