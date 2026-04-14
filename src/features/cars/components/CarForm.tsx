import { FormEvent, useEffect, useMemo, useState } from 'react';
import { CarFormErrors, CarFormValues, Drivetrain, FuelType, Gearbox } from '../types';

const gearboxOptions: Gearbox[] = ['manual', 'automatic', 'cvt', 'semi-automatic'];
const drivetrainOptions: Drivetrain[] = ['fwd', 'rwd', 'awd', '4wd'];
const fuelOptions: FuelType[] = ['gasoline', 'diesel', 'hybrid', 'electric', 'plug-in-hybrid'];

type CarFormProps = {
  initialValues?: Partial<CarFormValues>;
  onSubmit: (values: CarFormValues) => Promise<void> | void;
  submitLabel?: string;
};

const defaults: CarFormValues = {
  make: '',
  model: '',
  year: new Date().getFullYear(),
  gearbox: 'automatic',
  drivetrain: 'fwd',
  fuel: 'gasoline',
  horsepower: 100,
  price: 0,
  mileage: 0,
  color: '',
  doors: 4,
  description: '',
  image_url: '',
};

function validate(values: CarFormValues): CarFormErrors {
  const errors: CarFormErrors = {};

  if (!values.make.trim()) errors.make = 'Make is required.';
  if (!values.model.trim()) errors.model = 'Model is required.';
  if (values.year < 1950 || values.year > new Date().getFullYear() + 1) errors.year = 'Year is out of range.';
  if (values.horsepower <= 0) errors.horsepower = 'Horsepower must be positive.';
  if (values.price < 0) errors.price = 'Price must be 0 or higher.';
  if (values.doors !== undefined && values.doors < 2) errors.doors = 'Doors must be at least 2.';

  return errors;
}

export function CarForm({ initialValues, onSubmit, submitLabel = 'Save Car' }: CarFormProps) {
  const [values, setValues] = useState<CarFormValues>({ ...defaults, ...initialValues });
  const [errors, setErrors] = useState<CarFormErrors>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setValues({ ...defaults, ...initialValues });
    setErrors({});
  }, [initialValues]);

  const hasErrors = useMemo(() => Object.keys(errors).length > 0, [errors]);

  const updateValue = <K extends keyof CarFormValues>(key: K, nextValue: CarFormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: nextValue }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsSaving(true);
    try {
      await onSubmit(values);
    } finally {
      setIsSaving(false);
    }
  };

  const renderError = (key: keyof CarFormValues) =>
    errors[key] ? <small style={{ color: '#dc2626' }}>{errors[key]}</small> : null;

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '0.9rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '0.75rem' }}>
        <label>
          Make
          <input value={values.make} onChange={(e) => updateValue('make', e.target.value)} />
          {renderError('make')}
        </label>
        <label>
          Model
          <input value={values.model} onChange={(e) => updateValue('model', e.target.value)} />
          {renderError('model')}
        </label>
        <label>
          Year
          <input type="number" value={values.year} onChange={(e) => updateValue('year', Number(e.target.value))} />
          {renderError('year')}
        </label>
        <label>
          Horsepower
          <input type="number" value={values.horsepower} onChange={(e) => updateValue('horsepower', Number(e.target.value))} />
          {renderError('horsepower')}
        </label>
        <label>
          Price (USD)
          <input type="number" value={values.price} onChange={(e) => updateValue('price', Number(e.target.value))} />
          {renderError('price')}
        </label>
        <label>
          Mileage
          <input type="number" value={values.mileage ?? 0} onChange={(e) => updateValue('mileage', Number(e.target.value))} />
        </label>
        <label>
          Doors
          <input type="number" value={values.doors ?? 4} onChange={(e) => updateValue('doors', Number(e.target.value))} />
          {renderError('doors')}
        </label>
        <label>
          Color
          <input value={values.color ?? ''} onChange={(e) => updateValue('color', e.target.value)} />
        </label>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '0.75rem' }}>
        <label>
          Gearbox
          <select value={values.gearbox} onChange={(e) => updateValue('gearbox', e.target.value as Gearbox)}>
            {gearboxOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </label>
        <label>
          Drivetrain
          <select value={values.drivetrain} onChange={(e) => updateValue('drivetrain', e.target.value as Drivetrain)}>
            {drivetrainOptions.map((option) => (
              <option key={option} value={option}>{option.toUpperCase()}</option>
            ))}
          </select>
        </label>
        <label>
          Fuel
          <select value={values.fuel} onChange={(e) => updateValue('fuel', e.target.value as FuelType)}>
            {fuelOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </label>
        <label>
          Image URL
          <input value={values.image_url ?? ''} onChange={(e) => updateValue('image_url', e.target.value)} />
        </label>
      </div>

      <label>
        Description
        <textarea rows={4} value={values.description ?? ''} onChange={(e) => updateValue('description', e.target.value)} />
      </label>

      {hasErrors && <p style={{ margin: 0, color: '#b91c1c' }}>Please fix the field errors above.</p>}

      <button type="submit" disabled={isSaving}>{isSaving ? 'Saving...' : submitLabel}</button>
    </form>
  );
}
