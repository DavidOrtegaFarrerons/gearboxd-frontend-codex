const featuredCars = [
  { id: '1', title: '2022 Porsche 911 Carrera', badge: 'Featured', blurb: 'Precision-tuned, track-capable comfort.' },
  { id: '2', title: '2020 BMW M340i xDrive', badge: 'New Arrival', blurb: 'Balanced power and everyday luxury.' },
  { id: '3', title: '1969 Ford Mustang Boss 302', badge: 'Classic', blurb: 'American muscle heritage, restored.' }
];

export default function CarListPage() {
  return (
    <section>
      <div className="hero">
        <p className="eyebrow">Public Inventory</p>
        <h1>Find Your Next Driver&apos;s Car</h1>
        <p>Browse curated performance vehicles, classics, and daily machines—all in one garage.</p>
      </div>

      <div className="card-grid">
        {featuredCars.map((car) => (
          <article className="card" key={car.id}>
            <span className="badge">{car.badge}</span>
            <h3>{car.title}</h3>
            <p>{car.blurb}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
