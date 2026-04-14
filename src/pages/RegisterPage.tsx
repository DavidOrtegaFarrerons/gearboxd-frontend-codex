export default function RegisterPage() {
  return (
    <section className="card form-card">
      <h2>Register</h2>
      <p>Create your Gearboxd account to list and manage vehicles.</p>
      <form>
        <input type="email" placeholder="Email" />
        <input type="text" placeholder="Username" />
        <input type="password" placeholder="Password" />
        <button type="submit">Create account</button>
      </form>
    </section>
  );
}
