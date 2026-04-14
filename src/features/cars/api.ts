import { Car, CarFilters, CarFormValues, CarListResponse } from './types';

const API_BASE = '/api/cars';

function normalizeListResponse(payload: unknown): CarListResponse {
  if (payload && typeof payload === 'object' && 'items' in payload) {
    const typed = payload as CarListResponse;
    return {
      items: typed.items ?? [],
      total: typed.total ?? typed.items?.length ?? 0,
      page: typed.page ?? 1,
      page_size: typed.page_size ?? 12,
    };
  }

  const asArray = Array.isArray(payload) ? (payload as Car[]) : [];
  return {
    items: asArray,
    total: asArray.length,
    page: 1,
    page_size: 12,
  };
}

export async function listCars(filters: CarFilters): Promise<CarListResponse> {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.set(key, String(value));
    }
  });

  const response = await fetch(`${API_BASE}?${params.toString()}`);
  if (!response.ok) {
    throw new Error('Failed to load car inventory.');
  }

  return normalizeListResponse(await response.json());
}

export async function getCarById(id: string): Promise<Car> {
  const response = await fetch(`${API_BASE}/${id}`);
  if (!response.ok) {
    throw new Error('Failed to load car details.');
  }

  return response.json();
}

export async function createCar(payload: CarFormValues): Promise<Car> {
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Failed to create car.');
  }

  return response.json();
}

export async function updateCar(id: string, payload: CarFormValues): Promise<Car> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Failed to update car.');
  }

  return response.json();
}

export async function deleteCar(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
  if (!response.ok) {
    throw new Error('Failed to delete car.');
  }
}
