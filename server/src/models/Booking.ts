export interface Booking {
  id: string;
  userId: string;
  providerId: string;
  serviceId: string;
  datetime: string; 
  status: 'booked' | 'cancelled';
}
