export default function DeleteCarPage() {
  return (
    <section className="card form-card">
      <h2>Delete Car</h2>
      <p>Protected route for removing inventory records.</p>
      <form>
        <input type="text" placeholder="Car ID" />
        <button type="submit" className="danger">
          Delete car
        </button>
      </form>
    </section>
  );
}
