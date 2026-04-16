import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Check, X } from 'lucide-react';
import { activate } from '../api/users';

type VerificationState = 'loading' | 'success' | 'error';

export default function ActivatePage() {
  const [searchParams] = useSearchParams();
  const token = useMemo(() => searchParams.get('token')?.trim() ?? '', [searchParams]);
  const [state, setState] = useState<VerificationState>('loading');

  useEffect(() => {
    const run = async () => {
      if (!token) {
        setState('error');
        return;
      }

      try {
        await activate({ token });
        setState('success');
      } catch {
        setState('error');
      }
    };

    void run();
  }, [token]);

  return (
    <section className="content-wrap section-space auth-wrap">
      <div className="panel verify-card">
        {state === 'loading' && <><div className="spinner" /><p className="muted left-copy">Verifying your account…</p></>}
        {state === 'success' && <><Check className="success-icon" size={64} /><h1 className="centered">You&apos;re in!</h1><p className="left-copy">Your account has been activated. Start exploring the catalogue and logging your first car.</p><Link to="/cars" className="button primary">Browse Cars</Link></>}
        {state === 'error' && <><X className="error-icon" size={64} /><h1 className="centered">Verification failed</h1><p className="left-copy">This link is invalid or has expired. Please request a new activation email.</p><Link to="/auth/register" className="button primary">Resend Activation Email</Link></>}
      </div>
    </section>
  );
}
