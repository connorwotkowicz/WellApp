'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchProviders } from '@/utils/api';

interface Provider {
  id: string;
  name: string;
  specialty: string;
  bio?: string;
}

export default function ProviderListPage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProviders()
      .then((data: Provider[]) => setProviders(data))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading providers...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Wellness Providers</h1>
      <ul>
        {providers.map((provider) => (
          <li key={provider.id}>
            <Link href={`/providers/${provider.id}`}>
              <strong>{provider.name}</strong> – {provider.specialty}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
