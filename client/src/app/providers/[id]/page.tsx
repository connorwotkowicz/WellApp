'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation'; 
import { getProvider } from '../../../utils/api'; 

interface Provider {
  id: string;
  name: string;
  specialty: string;
  bio?: string;
  price: number | null; 
}

export default function ProviderDetailPage() {
  const { id } = useParams();
  const [provider, setProvider] = useState<Provider | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (!id) return;

    getProvider(id as string)
      .then((data) => {
        console.log('Fetched provider data:', data);  
        setProvider(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleBooking = () => {
    if (provider) {
      localStorage.setItem('selectedProvider', JSON.stringify(provider));

      const queryParams = new URLSearchParams({
        providerId: provider.id,
        providerName: provider.name,
        specialty: provider.specialty,
        price: provider.price != null ? provider.price.toString() : '0', 
      }).toString();

      router.push(`/checkout?${queryParams}`);
    } else {
      console.error('Provider data not available.');
    }
  };

  if (loading) return <p>Loading provider...</p>;
  if (error) return <p className="error-message">Error: {error}</p>;
  if (!provider) return <p className="error-message">Provider not found.</p>;

  return (
    <div className="provider-detail-page">
      <div className="provider-container">
        <div className="provider-header">
          <h1 className="provider-title">{provider.name}</h1>
          <p className="provider-specialty">{provider.specialty}</p>
        </div>

        <div className="provider-description">
          <h3>About {provider.name}</h3>
          {provider.bio ? <p>{provider.bio}</p> : <p>No description available.</p>}
        </div>

        <div className="provider-price">
          {provider.price !== null && provider.price !== undefined ? (
            <p><strong>Price:</strong> ${provider.price}</p>
          ) : (
            <p><strong>Price:</strong> Not Available</p>
          )}
        </div>

        <button 
          className="modal-button" 
          onClick={handleBooking}>
            Book a Session
        </button>
      </div>
    </div>
  );
}
