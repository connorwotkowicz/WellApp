'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Leaf, Edit, Sun } from 'lucide-react'; 

interface Service {
  service_id: number;
  service_name: string;
  description: string;
  price: number;
  duration: number;
  specialty: string;
  provider_id: number;
  provider_name: string;
  provider_image?: string;
}

const ServicesPage = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        // 1. Check if we have a special API URL for local testing
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        
        // 2. Build the final API URL
        const apiUrl = apiBaseUrl 
          ? `${apiBaseUrl}/api/services`  // Local with ngrok
          : '/api/services';              // Production on Vercel
        
        console.log("Fetching from:", apiUrl); // For debugging
        
        // 3. Fetch data
        const response = await axios.get<Service[]>(apiUrl);
        setServices(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching services:', error);
        setError('Services are currently unavailable. Please try again later.');
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading services...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md mx-auto mt-8">
        {error}
      </div>
    );
  }

  // Empty state
  if (services.length === 0) {
    return (
      <div className="text-center py-10">
        <p>No services found</p>
        <button 
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  // Group services by specialty
  const groupedServices = services.reduce((acc, service) => {
    const { specialty } = service;
    if (!acc[specialty]) {
      acc[specialty] = [];
    }
    acc[specialty].push(service);
    return acc;
  }, {} as Record<string, Service[]>);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Our Services</h1>
      
      {Object.keys(groupedServices).map((specialty) => (
        <div key={specialty} className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 border-b pb-2">{specialty}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groupedServices[specialty].map((service) => (
              <div 
                key={service.service_id} 
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <Link href={`/providers/${service.provider_id}`}>
                  <div className="flex flex-col items-center">
                    <div className="bg-gray-100 rounded-lg w-32 h-32 flex items-center justify-center mb-4">
                      {specialty === 'Meditation' && <Leaf size={60} color="#9DBB8C" />}
                      {specialty === 'Therapy' && <Edit size={60} color="#9DBB8C" />}
                      {specialty === 'Yoga' && <Sun size={60} color="#9DBB8C" />}
                    </div>
                    
                    <div className="text-center">
                      <h3 className="text-xl font-bold mb-2">{service.service_name}</h3>
                      <p className="text-gray-600 mb-2">
                        Provider: {service.provider_name || 'Unknown'}
                      </p>
                      <p className="mb-3">{service.description || 'No description'}</p>
                      
                      <div className="flex justify-between text-sm mb-4">
                        <span>⏱️ {service.duration} mins</span>
                        <span>💲 ${service.price}</span>
                      </div>
                      
                      <button className="text-blue-600 hover:text-blue-800 font-medium">
                        View Details →
                      </button>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default ServicesPage;