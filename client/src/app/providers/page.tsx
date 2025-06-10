'use client'

import { Sun, Edit, Moon, Leaf, User } from 'lucide-react'; 
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Provider {
  id: string;
  name: string;
  specialty: string;
  bio?: string;
  price?: string;
}

export default function ProviderListPage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetching provider data from API
    const fetchProviders = async () => {
      try {
        const response = await fetch('/api/providers');
        if (!response.ok) {
          throw new Error('Failed to fetch providers');
        }
        const data = await response.json();
        setProviders(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
  }, []);

  if (loading) return <p>Loading providers...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="providers-page">
      <h1>Wellness Providers</h1>
      <ul className="provider-list">
        {providers.map((provider) => (
          <li key={provider.id} className="provider-card">
            <Link href={`/providers/${provider.id}`} className="provider-link">
              <div className="provider-image">
                <div
                  style={{
                    width: '120px',
                    height: '120px',
                    backgroundColor: '#f0f0f0',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: '10px',
                    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  {/* Conditional rendering for different specialty icons */}
                  {provider.specialty === 'Yoga' && <Sun size={60} color="#9DBB8C" />}
                  {provider.specialty === 'Meditation' && <Moon size={60} color="#9DBB8C" />}
                  {provider.specialty === 'Therapy' && <Edit size={60} color="#9DBB8C" />}
                  {provider.specialty === 'Breathwork' && <Leaf size={60} color="#9DBB8C" />}
                  {!provider.specialty && <User size={60} color="#9DBB8C" />}
                </div>
              </div>
              <div className="provider-details">
                <strong className="provider-name">{provider.name}</strong>
                <span className="provider-specialty">{provider.specialty}</span>
                <p className="provider-bio">{provider.bio || 'No bio available'}</p>
                <p className="provider-price">Price: ${provider.price || 'N/A'}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
