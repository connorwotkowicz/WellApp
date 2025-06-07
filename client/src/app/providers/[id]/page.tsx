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
  const params = useParams();
  const id = params?.id as string;

  const [provider, setProvider] = useState<Provider | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;

    getProvider(id)
      .then((data) => setProvider(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Loading provider...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!provider) return <p>No provider found.</p>;

  return (
    <div>
      <h1>{provider.name}</h1>
      <p><strong>Specialty:</strong> {provider.specialty}</p>
      {provider.bio && <p>{provider.bio}</p>}
    </div>
  );
}
