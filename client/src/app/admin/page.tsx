'use client';

import { useEffect, useState } from 'react';
import {
  getAllProviders,
  getAllBookings,
  updateProviderStatus,
} from '@/utils/api';


interface Provider {
  id: string;
  name: string;
  specialty: string;
  status: string; 
}

interface Booking {
  id: string;
  time: string;
  providerName: string;
  userId: string;
}

export default function AdminDashboardPage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const [providerData, bookingData] = await Promise.all([
          getAllProviders(),
          getAllBookings(),
        ]);
        setProviders(providerData);
        setBookings(bookingData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <p>Loading admin data...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Admin Dashboard</h1>

      <section>
        <h2>All Providers</h2>
        <ul>
          {providers.map((p) => (
            <li key={p.id}>
              {p.name} – {p.specialty} ({p.status}){' '}
              <button
                onClick={async () => {
                  const newStatus = p.status === 'active' ? 'inactive' : 'active';
                  await updateProviderStatus(p.id, newStatus);
                  setProviders((prev) =>
                    prev.map((prov) =>
                      prov.id === p.id ? { ...prov, status: newStatus } : prov
                    )
                  );
                }}
              >
                Toggle Status
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>All Bookings</h2>
        <ul>
          {bookings.map((b) => (
            <li key={b.id}>
              User: {b.userId}, Provider: {b.providerName}, Time:{' '}
              {new Date(b.time).toLocaleString()}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
