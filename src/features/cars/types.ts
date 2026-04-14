export type Gearbox = 'manual' | 'automatic' | 'cvt' | 'semi-automatic';
export type Drivetrain = 'fwd' | 'rwd' | 'awd' | '4wd';
export type FuelType = 'gasoline' | 'diesel' | 'hybrid' | 'electric' | 'plug-in-hybrid';

export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  gearbox: Gearbox;
  drivetrain: Drivetrain;
  fuel: FuelType;
  horsepower: number;
  price: number;
  mileage?: number;
  color?: string;
  doors?: number;
  description?: string;
  image_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CarFilters {
  make?: string;
  model?: string;
  year?: string;
  gearbox?: string;
  drivetrain?: string;
  fuel?: string;
  horsepower_min?: string;
  horsepower_max?: string;
  price_min?: string;
  price_max?: string;
  page?: number;
  page_size?: number;
  sort?: string;
}

export interface CarListResponse {
  items: Car[];
  total: number;
  page: number;
  page_size: number;
}

export type CarFormValues = Omit<Car, 'id' | 'created_at' | 'updated_at'>;

export type CarFormErrors = Partial<Record<keyof CarFormValues, string>>;
