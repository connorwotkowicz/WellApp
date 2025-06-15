
import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';


export async function fetchProviders() {
  const res = await axios.get(`${API_BASE}/api/providers`);
  return res.data;
}

export async function getProvider(id: string) {
  const res = await axios.get(`${API_BASE}/api/providers/${id}`);
  return res.data;
}


export async function fetchServices() {
  const res = await axios.get(`${API_BASE}/api/services`);
  return res.data;
}

export async function getService(id: string) {
  const res = await axios.get(`${API_BASE}/api/services/${id}`);
  return res.data;
}

export async function createService(serviceData: {
  name: string;
  description: string;
  price: number;
  duration_minutes: number;
  specialty: string;
  provider_id: number;
}) {
  const res = await axios.post(`${API_BASE}/api/services/create-service`, serviceData);
  return res.data;
}


export async function getAllBookings() {
  const res = await axios.get(`${API_BASE}/api/bookings`);
  return res.data;
}

export async function createBooking(bookingData: {
  providerId: number;
  serviceId: number;
  time: string;
  userId: number;
}) {
  const res = await axios.post(`${API_BASE}/api/bookings/create-booking`, bookingData);
  return res.data;
}

export async function updateBookingStatus(id: string, status: string) {
  const res = await axios.put(`${API_BASE}/api/bookings/${id}/status`, { status });
  return res.data;
}

export async function deleteBooking(id: string) {
  const res = await axios.delete(`${API_BASE}/api/bookings/${id}`);
  return res.data;
}


export async function createCheckoutSession(sessionData: {
  providerId: number;
  time: string;
  userId: number;
  billingInfo: any;
}) {
  const res = await axios.post(`${API_BASE}/api/payment/create-checkout-session`, sessionData);
  return res.data;
}


export async function getProviderAvailability(providerId: string) {
  const res = await axios.get(`${API_BASE}/api/availability/${providerId}`);
  return res.data;
}

export async function createAvailabilitySlot(availabilityData: {
  providerId: number;
  start_time: string;
  end_time: string;
}) {
  const res = await axios.post(`${API_BASE}/api/availability`, availabilityData);
  return res.data;
}

export async function bookAvailabilitySlot(slotId: string) {
  const res = await axios.patch(`${API_BASE}/api/availability/${slotId}/book`);
  return res.data;
}


export async function getAllUsers() {
  const res = await axios.get(`${API_BASE}/api/users`);
  return res.data;
}

export async function getUser(id: string) {
  const res = await axios.get(`${API_BASE}/api/users/${id}`);
  return res.data;
}

export async function createGuestUser(guestData: {
  email: string;
  name: string;
  address: string;
}) {
  const res = await axios.post(`${API_BASE}/api/users/guest`, guestData);
  return res.data;
}

export async function updateUser(id: string, userData: { name: string; email: string; role: string }) {
  const res = await axios.put(`${API_BASE}/api/users/${id}`, userData);
  return res.data;
}

export async function deleteUser(id: string) {
  const res = await axios.delete(`${API_BASE}/api/users/${id}`);
  return res.data;
}

