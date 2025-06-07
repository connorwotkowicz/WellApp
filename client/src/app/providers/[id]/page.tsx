'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getProvider } from '@/utils/api';

interface Provider {
  id: string;
  name: string;
  specialty: string;
  bio?: string;
}

export default function ProviderDetailPage() {
  const { id } = useParams();
  const [provider, setProvider] = useState<Provider | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingMessage, setBookingMessage] = useState('');

  useEffect(() => {
    if (!id) return;

    getProvider(id as string)
      .then((data) => setProvider(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleBooking = () => {
    setBookingMessage(`Session booked with ${provider?.name}!`);
  };

  if (loading) return <p>Loading provider...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!provider) return <p>Provider not found.</p>;

  return (
    <div>
      <h1>{provider.name}</h1>
      <p><strong>Specialty:</strong> {provider.specialty}</p>
      {provider.bio && <p>{provider.bio}</p>}
      <button onClick={handleBooking}>Book a Session</button>
      {bookingMessage && <p>{bookingMessage}</p>}
    </div>
  );
}
