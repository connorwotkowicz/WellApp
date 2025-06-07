'use client';

import { useEffect, useState } from 'react';

interface Booking {
  id: string;
  providerName: string;
  time: string;
}

export default function AccountPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('http://localhost:3000/api/bookings?userId=demo-user')
      .then(res => res.json())
      .then(setBookings)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading bookings...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Your Bookings</h1>
      <ul>
        {bookings.map(b => (
          <li key={b.id}>
            Session with <strong>{b.providerName}</strong> at {new Date(b.time).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}
