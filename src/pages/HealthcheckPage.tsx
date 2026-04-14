import { useEffect, useState } from 'react';
import { http } from '../api/http';

type HealthcheckResponse = {
  status?: string;
  message?: string;
};

export default function HealthcheckPage() {
  const [status, setStatus] = useState<string>('Checking…');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const runHealthcheck = async () => {
      try {
        const payload = await http<HealthcheckResponse>('/v1/healtcheck', { method: 'GET' });
        setStatus(payload.status ?? payload.message ?? 'Operational');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Healthcheck failed.');
      }
    };

    void runHealthcheck();
  }, []);

  return (
    <section className="card">
      <p className="eyebrow">System</p>
      <h2>Healthcheck Status</h2>
      {error ? (
        <p role="alert" style={{ color: '#b91c1c' }}>{error}</p>
      ) : (
        <p>
          API heartbeat: <strong>{status}</strong>
        </p>
      )}
      <p>Data is requested from the API endpoint <code>/v1/healtcheck</code>.</p>
    </section>
  );
}
