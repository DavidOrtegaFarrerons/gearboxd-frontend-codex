import { useParams } from 'react-router-dom';

export default function CarDetailPage() {
  const { carId } = useParams();

  return (
    <section className="card">
      <p className="eyebrow">Car Detail</p>
      <h2>Vehicle #{carId}</h2>
      <p>Specs, history, service records, and pricing details will be loaded from the API.</p>
    </section>
  );
}
