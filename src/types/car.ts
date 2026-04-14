export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  color?: string;
  price?: number;
  description?: string;
}

export interface CarFormInput {
  make: string;
  model: string;
  year: number;
  mileage: number;
  color?: string;
  price?: number;
  description?: string;
}
