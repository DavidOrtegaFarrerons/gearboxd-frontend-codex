export default function HealthcheckPage() {
  return (
    <section className="card">
      <p className="eyebrow">System</p>
      <h2>Healthcheck Status</h2>
      <p>
        API heartbeat: <strong>Operational</strong>
      </p>
      <p>Uptime, database reachability, and queue depth can be surfaced here.</p>
    </section>
  );
}
