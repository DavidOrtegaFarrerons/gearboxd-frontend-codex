export default function EditCarPage() {
  return (
    <section className="card form-card">
      <h2>Edit Car</h2>
      <p>Protected route for updating existing listings.</p>
      <form>
        <input type="text" placeholder="Car ID" />
        <input type="text" placeholder="Updated fields" />
        <button type="submit">Save changes</button>
      </form>
    </section>
  );
}
