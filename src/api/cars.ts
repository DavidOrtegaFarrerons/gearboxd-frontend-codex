import { http } from './http';

export type Car = {
  id: string;
  make: string;
  model: string;
  year: number;
  description?: string;
  image_url?: string;
  gearbox: string;
  drivetrain: string;
  horsepower: number;
  fuel: string;
  price_new: number;
};

export type CarCreatePayload = {
  make: string;
  model: string;
  year: number;
  description: string;
  image_url: string;
  gearbox: string;
  drivetrain: string;
  horsepower: number;
  fuel: string;
  price_new: number;
};

export type CarUpdatePayload = Partial<CarCreatePayload>;

export type ListCarsParams = {
  page?: number;
  pageSize?: number;
  make?: string;
  model?: string;
  year?: number;
  search?: string;
};

export type ListCarsResponse = {
  items: Car[];
  total: number;
  page: number;
  pageSize: number;
};

type ApiCar = {
  id: number | string;
  make: string;
  model: string;
  year: number | string;
  description?: string;
  image_url?: string;
  gearbox: string;
  drivetrain: string;
  horsepower: number | string;
  fuel: string;
  price_new: number | string;
};

type ApiListResponse = {
  cars?: ApiCar[];
  items?: ApiCar[];
  metadata?: {
    current_page?: number;
    page_size?: number;
    total_records?: number;
  };
  total?: number;
  page?: number;
  pageSize?: number;
};

function toQueryString(params?: ListCarsParams): string {
  if (!params) {
    return '';
  }

  const query = new URLSearchParams();

  if (params.page !== undefined) {
    query.set('page', String(params.page));
  }

  if (params.pageSize !== undefined) {
    query.set('pageSize', String(params.pageSize));
    query.set('page_size', String(params.pageSize));
  }

  Object.entries(params).forEach(([key, value]) => {
    if (key === 'page' || key === 'pageSize') {
      return;
    }

    if (value !== undefined && value !== null && value !== '') {
      query.set(key, String(value));
    }
  });

  const result = query.toString();
  return result ? `?${result}` : '';
}

function toNumber(value: number | string | undefined, fallback = 0): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function normalizeCar(payload: ApiCar): Car {
  return {
    id: String(payload.id),
    make: payload.make,
    model: payload.model,
    year: toNumber(payload.year),
    description: payload.description,
    image_url: payload.image_url,
    gearbox: payload.gearbox,
    drivetrain: payload.drivetrain,
    horsepower: toNumber(payload.horsepower),
    fuel: payload.fuel,
    price_new: toNumber(payload.price_new),
  };
}

function normalizeListCarsResponse(payload: unknown): ListCarsResponse {
  if (Array.isArray(payload)) {
    const items = payload.map((car) => normalizeCar(car as ApiCar));
    return {
      items,
      total: items.length,
      page: 1,
      pageSize: items.length,
    };
  }

  const response = (payload ?? null) as ApiListResponse | null;
  const sourceCars = response?.cars ?? response?.items ?? [];
  const items = sourceCars.map(normalizeCar);

  return {
    items,
    total: response?.metadata?.total_records ?? response?.total ?? items.length,
    page: response?.metadata?.current_page ?? response?.page ?? 1,
    pageSize: response?.metadata?.page_size ?? response?.pageSize ?? items.length,
  };
}

function normalizeCarResponse(payload: unknown): Car {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Invalid car response from API.');
  }

  const response = payload as { car?: ApiCar } & ApiCar;
  const car = response.car ?? response;

  return normalizeCar(car);
}

export async function listCars(params?: ListCarsParams): Promise<ListCarsResponse> {
  const payload = await http<unknown>(`/v1/cars${toQueryString(params)}`, {
    method: 'GET',
  });

  return normalizeListCarsResponse(payload);
}

export async function getCar(id: string): Promise<Car> {
  const payload = await http<unknown>(`/v1/cars/${id}`, { method: 'GET' });
  return normalizeCarResponse(payload);
}

export async function createCar(payload: CarCreatePayload, token: string): Promise<Car> {
  const response = await http<unknown>('/v1/cars', {
    method: 'POST',
    body: payload,
    token,
  });

  return normalizeCarResponse(response);
}

export async function updateCar(id: string, payload: CarUpdatePayload, token: string): Promise<Car> {
  const response = await http<unknown>(`/v1/cars/${id}`, {
    method: 'PUT',
    body: payload,
    token,
  });

  return normalizeCarResponse(response);
}

export function deleteCar(id: string, token: string): Promise<void> {
  return http<void>(`/v1/cars/${id}`, {
    method: 'DELETE',
    token,
  });
}
