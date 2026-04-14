export default function CreateCarPage() {
  return (
    <section className="card form-card">
      <h2>Create Car</h2>
      <p>Protected route for adding new inventory.</p>
      <form>
        <input type="text" placeholder="Make" />
        <input type="text" placeholder="Model" />
        <input type="number" placeholder="Year" />
        <button type="submit">Create</button>
      </form>
    </section>
  );
}
