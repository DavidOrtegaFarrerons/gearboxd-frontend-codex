import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { activate } from '../api/users';

export default function ActivatePage() {
  const [searchParams] = useSearchParams();
  const token = useMemo(() => searchParams.get('token')?.trim() ?? '', [searchParams]);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleVerify = async () => {
    if (!token) {
      setMessage(null);
      setError('Verification token is missing from the link. Please use the latest email link.');
      return;
    }

    setIsSubmitting(true);
    setMessage(null);
    setError(null);

    try {
      await activate({ token });
      setMessage('Account verified successfully. You can now log in.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="card form-card">
      <h2>Verify Account</h2>
      <p>Open your verification email link, then click the button below to verify your account.</p>
      <button type="button" onClick={handleVerify} disabled={isSubmitting || !token}>
        {isSubmitting ? 'Verifying...' : 'Verify now'}
      </button>
      {!token && <p role="alert" style={{ color: '#b91c1c' }}>No token found in the URL.</p>}
      {message && <p>{message}</p>}
      {error && <p role="alert" style={{ color: '#b91c1c' }}>{error}</p>}
    </section>
  );
}
