import { request, type QueryValue } from './http';

export interface Car {
  id: string;
  make: string;
  model: string;
  year?: number;
  [key: string]: unknown;
}

export interface CarListResponse {
  data: Car[];
  total?: number;
  page?: number;
  pageSize?: number;
}

export interface CreateCarPayload {
  make: string;
  model: string;
  year?: number;
  [key: string]: unknown;
}

export type UpdateCarPayload = Partial<CreateCarPayload>;

export type ListCarsParams = Record<string, QueryValue>;

export async function listCars(params: ListCarsParams = {}): Promise<CarListResponse> {
  return request<CarListResponse>('/v1/cars', {
    method: 'GET',
    query: params,
  });
}

export async function getCar(id: string): Promise<Car> {
  return request<Car>(`/v1/cars/${encodeURIComponent(id)}`, {
    method: 'GET',
  });
}

export async function createCar(payload: CreateCarPayload): Promise<Car> {
  return request<Car>('/v1/cars', {
    method: 'POST',
    body: payload,
    requiresAuth: true,
  });
}

export async function updateCar(id: string, payload: UpdateCarPayload): Promise<Car> {
  return request<Car>(`/v1/cars/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: payload,
    requiresAuth: true,
  });
}

export async function deleteCar(id: string): Promise<void> {
  await request<null>(`/v1/cars/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    requiresAuth: true,
  });
}
