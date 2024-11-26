export interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  description: string;
  images: CarImage[];
  createdAt: string;
  updatedAt: string;
}

export interface CarImage {
  id: string;
  link: string;
  carId: string;
}

export interface CreateCarDto {
  brand: string;
  model: string;
  year: number;
  price: number;
  description: string;
}
    
export interface UpdateCarDto extends Partial<CreateCarDto> {} 