const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3001/api';

export async function fetchProviders() {
  const res = await fetch(`${API_BASE}/providers`);
  if (!res.ok) throw new Error('Failed to fetch providers');
  return res.json();
}

export async function fetchServices() {
  const res = await fetch(`${API_BASE}/services`);
  if (!res.ok) throw new Error('Failed to fetch services');
  return res.json();
}

export async function getProvider(id: string) {
  const res = await fetch(`${API_BASE}/providers/${id}`);
  if (!res.ok) throw new Error('Failed to fetch provider');
  return res.json();
}
