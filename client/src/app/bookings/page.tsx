'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BookingsPage = () => {
  const [providers, setProviders] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/providers`
        );
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        setProviders(data);
      } catch (error) {
        console.error('Error fetching providers:', error);
      }
    };

    fetchProviders();
  }, []);

  const handleSelectProvider = (providerId: string) => {
    router.push(`/providers/${providerId}`);
  };
  
  return (
    <div className="bookings-page p-6">
      <h1 className="text-3xl font-bold mb-8">Book a Session</h1>
      <div className="provider-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {providers.map((provider) => (
          <div key={provider.id} className="book-provider-card bg-white rounded-lg shadow-md overflow-hidden">
            <div className="provider-card-header p-4">
              {provider.provider_image && (
                <img
                  src={provider.provider_image}
                  alt={provider.name}
                  className="provider-image w-full h-48 object-cover rounded-md mb-4"
                />
              )}
              <div className="provider-info">
                <h3 className="text-xl font-semibold">{provider.name}</h3>
                <p className="specialty text-gray-600">{provider.specialty}</p>
                {provider.bio && <p className="bio mt-2">{provider.bio}</p>}
                <div className="mt-3">
                  {provider.price !== null && provider.price !== undefined ? (
                    <p><strong>Price:</strong> ${provider.price}</p>
                  ) : (
                    <p><strong>Price:</strong> Not Available</p>
                  )}
                </div>
              </div>
            </div>
          
            <div className="provider-extra-info p-4 bg-gray-50">
              <p><strong>Service Offered:</strong> {provider.service || 'Not specified'}</p>
              <p><strong>Rating:</strong> {provider.rating || 'No rating yet'}</p>
            </div>

            <div className="p-4">
              <button 
                className="book-modal-button w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
                onClick={() => handleSelectProvider(provider.id)}
              >
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingsPage;