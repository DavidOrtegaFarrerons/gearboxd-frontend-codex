export default function LoginPage() {
  return (
    <section className="card form-card">
      <h2>Login / Token</h2>
      <p>Authenticate to create, edit, and remove cars from your garage.</p>
      <form>
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />
        <button type="submit">Get token</button>
      </form>
    </section>
  );
}
