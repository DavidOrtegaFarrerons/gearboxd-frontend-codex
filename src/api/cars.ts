import { apiClient } from './client';
import type { Car, CarFormInput } from '../types/car';

export const carsApi = {
  list: () => apiClient.get<Car[]>('/cars'),
  detail: (id: string) => apiClient.get<Car>(`/cars/${id}`),
  create: (payload: CarFormInput, token: string) => apiClient.post<Car>('/cars', payload, token),
  update: (id: string, payload: CarFormInput, token: string) =>
    apiClient.put<Car>(`/cars/${id}`, payload, token),
  remove: (id: string, token: string) => apiClient.delete<void>(`/cars/${id}`, token)
};
