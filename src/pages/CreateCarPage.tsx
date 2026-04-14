import { FormEvent, useState } from 'react';
import { createCar } from '../api/cars';
import { getSessionToken } from '../state/sessionToken';

export default function CreateCarPage() {
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

    try {
      const created = await createCar({
        make,
        model,
        year: Number(year),
        description,
        image_url: imageURL,
        gearbox,
        drivetrain,
        horsepower: Number(horsepower),
        fuel,
        price_new: Number(priceNew),
      }, token);
      setMessage(`Created car ${created.id}.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create car.');
    }
  };

  return (
    <section className="card form-card">
      <h2>Create Car</h2>
      <p>All create fields are required by the API.</p>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Make" value={make} onChange={(e) => setMake(e.target.value)} required />
        <input type="text" placeholder="Model" value={model} onChange={(e) => setModel(e.target.value)} required />
        <input type="number" placeholder="Year" value={year} onChange={(e) => setYear(e.target.value)} required />
        <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
        <input type="url" placeholder="Image URL" value={imageURL} onChange={(e) => setImageURL(e.target.value)} required />
        <input type="text" placeholder="Gearbox" value={gearbox} onChange={(e) => setGearbox(e.target.value)} required />
        <input type="text" placeholder="Drivetrain" value={drivetrain} onChange={(e) => setDrivetrain(e.target.value)} required />
        <input type="number" placeholder="Horsepower" value={horsepower} onChange={(e) => setHorsepower(e.target.value)} required />
        <input type="text" placeholder="Fuel" value={fuel} onChange={(e) => setFuel(e.target.value)} required />
        <input type="number" step="0.01" placeholder="Price new" value={priceNew} onChange={(e) => setPriceNew(e.target.value)} required />
        <button type="submit">Create</button>
      </form>
      {message && <p>{message}</p>}
      {error && <p role="alert" style={{ color: '#b91c1c' }}>{error}</p>}
    </section>
  );
}
