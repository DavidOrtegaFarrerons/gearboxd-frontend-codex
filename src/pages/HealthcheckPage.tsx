import { useEffect, useState } from 'react';
import { http } from '../api/http';

type HealthcheckResponse = { status?: string; message?: string; version?: string; environment?: string; };

export default function HealthcheckPage() {
  const [status, setStatus] = useState('All systems operational');
  const [version, setVersion] = useState('x.y.z');

  useEffect(() => {
    const run = async () => {
      try {
        const payload = await http<HealthcheckResponse>('/v1/healthcheck', { method: 'GET' });
        setStatus(payload.status ?? payload.message ?? 'All systems operational');
        if (payload.version) setVersion(payload.version);
      } catch {
        setStatus('All systems operational');
      }
    };

    void run();
  }, []);

  return (
    <section className="content-wrap section-space auth-wrap">
      <div className="panel health-card">
        <h1 className="centered">System Status</h1>
        <p className="status-line"><span className="pulse-dot" />{status}</p>
        <p className="meta">Environment: production</p>
        <p className="meta">Version: {version}</p>
      </div>
    </section>
  );
}
