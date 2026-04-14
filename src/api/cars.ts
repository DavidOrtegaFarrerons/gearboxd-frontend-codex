import { http } from './http';

export type Car = {
  id: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  color?: string;
  price?: number;
  description?: string;
};

export type CarWritePayload = {
  make: string;
  model: string;
  year: number;
  mileage: number;
  color?: string;
  price?: number;
  description?: string;
};

export type ListCarsParams = {
  page?: number;
  pageSize?: number;
  make?: string;
  model?: string;
  year?: number;
  minPrice?: number;
  maxPrice?: number;
  minMileage?: number;
  maxMileage?: number;
  search?: string;
};

export type ListCarsResponse = {
  items: Car[];
  total: number;
  page: number;
  pageSize: number;
};

function toQueryString(params?: ListCarsParams): string {
  if (!params) {
    return '';
  }

  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.set(key, String(value));
    }
  });

  const result = query.toString();
  return result ? `?${result}` : '';
}

function normalizeListCarsResponse(payload: unknown): ListCarsResponse {
  if (Array.isArray(payload)) {
    return {
      items: payload as Car[],
      total: payload.length,
      page: 1,
      pageSize: payload.length,
    };
  }

  const response = payload as Partial<ListCarsResponse> | null;

  return {
    items: response?.items ?? [],
    total: response?.total ?? response?.items?.length ?? 0,
    page: response?.page ?? 1,
    pageSize: response?.pageSize ?? response?.items?.length ?? 0,
  };
}

export async function listCars(params?: ListCarsParams): Promise<ListCarsResponse> {
  const payload = await http<unknown>(`/v1/cars${toQueryString(params)}`, {
    method: 'GET',
  });

  return normalizeListCarsResponse(payload);
}

export function getCar(id: string): Promise<Car> {
  return http<Car>(`/v1/cars/${id}`, { method: 'GET' });
}

export function createCar(payload: CarWritePayload, token: string): Promise<Car> {
  return http<Car>('/v1/cars', {
    method: 'POST',
    body: payload,
    token,
  });
}

export function updateCar(id: string, payload: Partial<CarWritePayload>, token: string): Promise<Car> {
  return http<Car>(`/v1/cars/${id}`, {
    method: 'PATCH',
    body: payload,
    token,
  });
}

export function deleteCar(id: string, token: string): Promise<void> {
  return http<void>(`/v1/cars/${id}`, {
    method: 'DELETE',
    token,
  });
}
