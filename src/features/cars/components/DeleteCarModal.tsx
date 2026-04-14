import { Car } from '../types';

type DeleteCarModalProps = {
  car: Car | null;
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function DeleteCarModal({ car, isDeleting, onCancel, onConfirm }: DeleteCarModalProps) {
  if (!car) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.45)',
        display: 'grid',
        placeItems: 'center',
        padding: '1rem',
        zIndex: 40,
      }}
    >
      <div style={{ backgroundColor: '#fff', borderRadius: 14, padding: '1rem', width: 'min(480px, 100%)' }}>
        <h3 style={{ marginTop: 0 }}>Delete car listing</h3>
        <p>
          Are you sure you want to remove <strong>{car.year} {car.make} {car.model}</strong>? This action cannot be undone.
        </p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
          <button type="button" onClick={onCancel}>Cancel</button>
          <button type="button" onClick={onConfirm} disabled={isDeleting}>
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
