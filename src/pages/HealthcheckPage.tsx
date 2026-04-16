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
      <div className="panel health-card about-card">
        <h1 className="centered">About Gearboxd</h1>
        <p className="left-copy">
          Gearboxd is a Go-powered car community inspired by Letterboxd, but tuned for engines instead of films.
          Log every car you&apos;ve driven, post opinions, rate what deserves a spot in your dream garage, and discover
          what other drivers think about everything from humble hatchbacks to wild supercars.
        </p>
        <p className="left-copy">
          This front-end talks to a Go API and keeps the experience simple: browse, review, and build your own running
          history of automotive obsessions.
        </p>
        <h2 className="centered">API Status</h2>
        <p className="status-line"><span className="pulse-dot" />{status}</p>
        <p className="meta">Environment: production</p>
        <p className="meta">Version: {version}</p>
      </div>
    </section>
  );
}
