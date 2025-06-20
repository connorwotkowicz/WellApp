'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BookingsList from '../components/BookingsList'; 

const BookingsPage = () => {
  const [providers, setProviders] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const response = await fetch('${process.env.NEXT_PUBLIC_API_BASE_URL}/api/providers');
        const data = await response.json();
        setProviders(data);
      } catch (error) {
        console.error('Error fetching providers:', error);
      }
    };
    fetchProviders();
  }, []);

  const handleSelectProvider = (provider: any) => {
    localStorage.setItem('selectedProvider', JSON.stringify(provider));
    router.push(`/checkout`);
  };

  return (
    <div className="bookings-page">
      <h1>Book a Session</h1>
      <div className="provider-list">
  {providers.map((provider) => (
  <div key={provider.id} className="book-provider-card">
    <div className="provider-card-header">
  
      {provider.provider_image && (
        <img
          src={provider.provider_image}
          alt={provider.name}
          className="provider-image"
        />
      )}
      <div className="provider-info">
        <h3>{provider.name}</h3>
        <p className="specialty">{provider.specialty}</p>
     
        {provider.bio && <p className="bio">{provider.bio}</p>}
      
        {provider.price !== null && provider.price !== undefined ? (
          <p><strong>Price:</strong> ${provider.price}</p>
        ) : (
          <p><strong>Price:</strong> Not Available</p>
        )}
      </div>
    </div>
  
    <div className="provider-extra-info">
      <p><strong>Service Offered:</strong> {provider.service || 'Not specified'}</p>
   
      <p><strong>Location:</strong> {provider.location || 'Not specified'}</p>
      <p><strong>Rating:</strong> {provider.rating || 'No rating yet'}</p>
    </div>

    <button className="book-modal-button" onClick={() => handleSelectProvider(provider)}>
      Book Now
    </button>
  </div>
))}

      </div>
    </div>
  );
};

export default BookingsPage;
