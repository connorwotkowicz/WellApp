import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

export async function fetchProviders() {
  const res = await axios.get(`${API_BASE}/api/providers`);
  return res.data;
}

export async function fetchServices() {
  const res = await axios.get(`${API_BASE}/api/services`);
  return res.data;
}

export async function getProvider(id: string) {
  const res = await axios.get(`${API_BASE}/api/providers/${id}`);
  return res.data;
}

export async function getAllProviders() {
  const res = await axios.get(`${API_BASE}/api/providers`);
  return res.data;
}

export async function getAllBookings() {
  const res = await axios.get(`${API_BASE}/api/bookings`);
  return res.data;
}

export async function updateProviderStatus(id: string, status: string) {
  const res = await axios.put(`${API_BASE}/api/providers/${id}/status`, { status });
  return res.data;
}
