'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Leaf, Edit, Sun } from 'lucide-react'; 


interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  duration_minutes: number;
  provider_id: number;
  provider_name: string;
  provider_image?: string;
  specialty: string; 
}

const ServicesPage = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get<Service[]>('/api/services');
        console.log(response.data);  
        setServices(response.data);  
        setLoading(false);
      } catch (error) {
        console.error('Error fetching services:', error);
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  
  const groupedServices = services.reduce((acc, service) => {
    const { specialty } = service;
    if (!acc[specialty]) {
      acc[specialty] = [];
    }
    acc[specialty].push(service);
    return acc;
  }, {} as Record<string, Service[]>);

return (
  <div className="services-page">
    <h1>Our Services</h1>
    {Object.keys(groupedServices).map((specialty) => (
      <div key={specialty} className="category-section">
        <h2 className="category-title">{specialty}</h2>
        <div className="services-list">
          {groupedServices[specialty].map((service) => (
            <div key={service.id} className="service-card">
              <Link href={`/providers/${service.provider_id}`} passHref>
                <div className="service-image-container">
                  <div
                    className="icon-container"
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
                
                    {specialty === 'Meditation' && <Leaf size={60} color="#9DBB8C" />}
                    {specialty === 'Therapy' && <Edit size={60} color="#9DBB8C" />}
                    {specialty === 'Yoga' && <Sun size={60} color="#9DBB8C" />} 
                  </div>
                </div>
                <div className="service-details">
                  <h3>{service.name}</h3>
                  <p>Provider: {service.provider_name || 'No provider name available'}</p>
                  <p>{service.description || 'No description available'}</p>
                  <p>Duration: {service.duration_minutes} mins</p>
                  <p>Price: ${service.price}</p>
                  <p>More details about this provider</p>
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
