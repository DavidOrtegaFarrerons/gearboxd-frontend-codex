import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { activate } from '../api/users';

export default function ActivatePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = useMemo(() => searchParams.get('token')?.trim() ?? '', [searchParams]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleVerify = async () => {
    if (!token) {
      setError('Verification token is missing from the link. Please use the latest email link.');
      return;
    }

    setIsSubmitting(true);
    setToastMessage(null);
    setError(null);

    try {
      await activate({ token });
      setToastMessage('Account verified successfully. Redirecting to inventory...');
      window.setTimeout(() => {
        navigate('/');
      }, 1200);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="card form-card">
      <h2>Verify Account</h2>
      <button type="button" onClick={handleVerify} disabled={isSubmitting || !token}>
        {isSubmitting ? 'Verifying...' : 'Verify now'}
      </button>
      {!token && <p role="alert" style={{ color: '#b91c1c' }}>No token found in the URL.</p>}
      {error && <p role="alert" style={{ color: '#b91c1c' }}>{error}</p>}
      {toastMessage && (
        <div className="toast toast-success" role="status" aria-live="polite">
          {toastMessage}
        </div>
      )}
    </section>
  );
}
