export default function ActivatePage() {
  return (
    <section className="card form-card">
      <h2>Activate Account</h2>
      <p>Paste your activation token from email to unlock your account.</p>
      <form>
        <input type="text" placeholder="Activation token" />
        <button type="submit">Activate</button>
      </form>
    </section>
  );
}
