import { useEffect, useState } from 'react';
import { Gauge, Heart, Plus } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { addCarLog, deleteCarLog, getCar, type Car, type CarLogStatus } from '../api/cars';
import { getApiErrorMessage } from '../api/errors';
import { useAuth } from '../state/auth';
const eraLabel = (year: number) => `'${String(year).slice(2, 3)}0s`;

export default function CarDetailPage() {
  const { carId } = useParams();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [logOpen, setLogOpen] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [status, setStatus] = useState<CarLogStatus>('owned');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [deletingLog, setDeletingLog] = useState(false);
  const { token, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!carId) {
      setError('Missing car id.');
      setLoading(false);
      return;
    }

    const loadCar = async () => {
      setLoading(true);
      setError(null);
      try {
        setCar(await getCar(carId));
      } catch (err) {
        setError(getApiErrorMessage(err, 'Failed to load car details.'));
      } finally {
        setLoading(false);
      }
    };

    void loadCar();
  }, [carId]);

  const activeRating = hoverRating || rating;
  const sortedRatings = (car?.car_logs ?? []).map((log) => log.rating).sort((a, b) => a - b);
  const medianRating = sortedRatings.length === 0
    ? 0
    : sortedRatings.length % 2 === 1
      ? sortedRatings[(sortedRatings.length - 1) / 2]
      : (sortedRatings[sortedRatings.length / 2 - 1] + sortedRatings[sortedRatings.length / 2]) / 2;

  const refreshCar = async () => {
    if (!carId) return;
    setCar(await getCar(carId));
  };

  const currentUserId = (() => {
    if (!token) return null;

    try {
      const payload = token.split('.')[1];
      if (!payload) return null;

      const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/'))) as {
        user_id?: number | string;
        sub?: number | string;
      };

      return decoded.user_id ? String(decoded.user_id) : decoded.sub ? String(decoded.sub) : null;
    } catch {
      return null;
    }
  })();

  const orderedLogs = [...(car?.car_logs ?? [])].sort((a, b) => {
    if (!currentUserId) return 0;

    const aIsUser = a.user_id === currentUserId;
    const bIsUser = b.user_id === currentUserId;
    if (aIsUser && !bIsUser) return -1;
    if (!aIsUser && bIsUser) return 1;
    return 0;
  });

  const handleDeleteMyLog = async () => {
    if (!car || !token) return;
    setDeletingLog(true);
    setSubmitError(null);
    try {
      await deleteCarLog(Number(car.id), token);
      await refreshCar();
    } catch (err) {
      setSubmitError(getApiErrorMessage(err, 'Failed to delete your log.'));
    } finally {
      setDeletingLog(false);
    }
  };

  const submitLog = async () => {
    if (!car || !token) {
      setSubmitError('Please log in to rate this car.');
      return;
    }

    setSubmitting(true);
    setSubmitError(null);
    try {
      await addCarLog({
        car_id: Number(car.id),
        rating: selectedRating,
        status,
        comment: comment.trim() || undefined,
      }, token);
      setLogOpen(false);
      setSelectedRating(0);
      setStatus('owned');
      setComment('');
      await refreshCar();
    } catch (err) {
      setSubmitError(getApiErrorMessage(err, 'Failed to add your log.'));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <section className="content-wrap"><div className="panel">Loading car from API…</div></section>;
  if (error) return <section className="content-wrap"><div className="panel" role="alert">{error}</div></section>;
  if (!car) return <section className="content-wrap"><div className="panel">Car not found.</div></section>;

  return (
    <section>
      <div className="detail-hero">
        <img src={car.image_url || 'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=1600&q=80'} alt={`${car.make} ${car.model}`} />
        <div className="detail-overlay" />
        <div className="detail-title content-wrap">
          <h1>{car.year} {car.make} {car.model}</h1>
          <p>{car.make} · {eraLabel(car.year)}</p>
        </div>
      </div>

      <div className="content-wrap section-space detail-main">
        <div className="action-row">
          <button type="button" className="button primary" onClick={() => setLogOpen((open) => !open)}><Gauge size={16} /> Rate this car</button>
          <button type="button" className="button secondary"><Heart size={16} /> Like</button>
          <button type="button" className="button secondary"><Plus size={16} /> Add to Garage</button>
          <div className="stars large" onMouseLeave={() => setHoverRating(0)}>
            {[1, 2, 3, 4, 5].map((value) => (
              <button key={value} type="button" onMouseEnter={() => setHoverRating(value)} onFocus={() => setHoverRating(value)} onClick={() => setRating(value)}>
                <span className={value <= activeRating ? 'filled' : ''}>★</span>
              </button>
            ))}
          </div>
        </div>

        {logOpen && (
          <div className="panel">
            <h3>Add your log</h3>
            {!isAuthenticated && <p className="error-text">Please log in first to submit a rating.</p>}
            <div className="log-form">
              <div>
                <p className="small muted">Rating ({selectedRating.toFixed(1)} ★)</p>
                <div className="stars large" onMouseLeave={() => setHoverRating(0)}>
                  {Array.from({ length: 11 }, (_, index) => index * 0.5).map((value) => (
                    <button key={value} type="button" onMouseEnter={() => setHoverRating(value)} onFocus={() => setHoverRating(value)} onClick={() => setSelectedRating(value)}>
                      <span className={value <= (hoverRating || selectedRating) ? 'filled' : ''}>★</span>
                    </button>
                  ))}
                </div>
              </div>
              <label>
                Status
                <select value={status} onChange={(event) => setStatus(event.target.value as CarLogStatus)}>
                  <option value="want_to_drive">Want to drive</option>
                  <option value="driven">Driven</option>
                  <option value="owned">Owned</option>
                </select>
              </label>
              <label>
                Comment (optional)
                <textarea rows={3} value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Tell others what makes this car special..." />
              </label>
              {submitError && <p className="error-text">{submitError}</p>}
              <button type="button" className="button primary" disabled={submitting || !isAuthenticated} onClick={submitLog}>Submit log</button>
            </div>
          </div>
        )}

        <div className="detail-grid">
          <div>
            <h2>About</h2>
            <p className="left-copy">{car.description || 'No description available.'}</p>
            <h2>Specifications</h2>
            <dl className="spec-list">
              <div><dt>Year</dt><dd>{car.year}</dd></div>
              <div><dt>Make</dt><dd>{car.make}</dd></div>
              <div><dt>Model</dt><dd>{car.model}</dd></div>
              <div><dt>Horsepower</dt><dd>{car.horsepower} hp</dd></div>
              <div><dt>Price</dt><dd>${car.price_new.toLocaleString()}</dd></div>
              <div><dt>Fuel</dt><dd>{car.fuel}</dd></div>
              <div><dt>Drivetrain</dt><dd>{car.drivetrain}</dd></div>
              <div><dt>Era</dt><dd>{eraLabel(car.year)}</dd></div>
            </dl>
          </div>

          <aside>
            <div className="panel stats-card">
              <h3>Quick Stats</h3>
              <p className="avg-rating"><span>★</span> {medianRating.toFixed(1)}</p>
              <p><strong>{car.car_logs.length}</strong> logs posted</p>
              <p><strong>0</strong> garages <span className="meta">(API metric pending)</span></p>
            </div>
          </aside>
        </div>

        <div className="panel comment-panel">
          <h2>Driver comments</h2>
          {car.car_logs.length === 0 ? (
            <p>Be the first to rate this car.</p>
          ) : (
            <ul className="log-list">
              {orderedLogs.map((log) => {
                const isMyLog = currentUserId && log.user_id === currentUserId;

                return (
                <li key={log.id} className={isMyLog ? 'is-user-comment' : undefined}>
                  {isMyLog && <p className="user-comment-badge">Your log</p>}
                  <p><strong>User #{log.user_id}</strong> · {log.status.replace(/_/g, ' ')} · <span className="comment-rating">★ {log.rating.toFixed(1)}</span></p>
                  <p>{log.comment || 'No comment provided.'}</p>
                  {isMyLog && <button type="button" className="button destructive" onClick={handleDeleteMyLog} disabled={deletingLog}>{deletingLog ? 'Deleting...' : 'Delete my log'}</button>}
                </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
