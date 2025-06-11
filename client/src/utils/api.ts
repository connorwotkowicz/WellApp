const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

export async function fetchProviders() {
  const res = await fetch(`${API_BASE}/api/providers`);
  if (!res.ok) throw new Error('Failed to fetch providers');
  return res.json();
}

export async function fetchServices() {
  const res = await fetch(`${API_BASE}/api/services`);
  if (!res.ok) throw new Error('Failed to fetch services');
  return res.json();
}

export async function getProvider(id: string) {
  const res = await fetch(`${API_BASE}/api/providers/${id}`);
  if (!res.ok) throw new Error('Failed to fetch provider');
  return res.json();
}

export async function getAllProviders() {
  const res = await fetch(`${API_BASE}/api/providers`);
  if (!res.ok) throw new Error('Failed to fetch providers');
  return res.json();
}

export async function getAllBookings() {
  const res = await fetch(`${API_BASE}/api/bookings`);
  if (!res.ok) throw new Error('Failed to fetch bookings');
  return res.json();
}

export async function updateProviderStatus(id: string, status: string) {
  const res = await fetch(`${API_BASE}/api/providers/${id}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  });

  if (!res.ok) {
    throw new Error('Failed to update provider status');
  }

  return res.json();
}
