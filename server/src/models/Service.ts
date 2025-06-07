export interface Service {
  id: string;
  name: string;
  specialty: string;
  description?: string;
  providerId: string;
  duration: number;
  price: number; 
}
