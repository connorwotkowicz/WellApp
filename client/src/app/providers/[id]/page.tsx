'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';

interface Provider {
  id: string;
  name: string;
  specialty: string;
  bio?: string;
  price: number | null;
  service_id?: string;
}

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration_minutes: number;
  specialty: string;
}

interface AvailabilitySlot {
  id: string;
  start_time: string;
  end_time: string;
  booked: boolean;
}

export default function ProviderDetailPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const [provider, setProvider] = useState<Provider | null>(null);
  const [service, setService] = useState<Service | null>(null);
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const router = useRouter();

  const queryServiceId = searchParams.get('serviceId');

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');

        const providerRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/providers/${id}`
        );

        if (!providerRes.ok) {
          throw new Error(`Failed to fetch provider: ${providerRes.statusText}`);
        }

        const providerData: Provider = await providerRes.json();
        setProvider(providerData);





        const serviceIdToUse = queryServiceId || providerData.service_id;

        if (!serviceIdToUse) {
          throw new Error('No service ID available');
        }

      const serviceRes = await fetch(
  `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/services/${serviceIdToUse}`
);

if (!serviceRes.ok) {
  throw new Error(`Failed to fetch service: ${serviceRes.statusText}`);
}

const serviceData = await serviceRes.json();


const normalizedService = {
  ...serviceData,
  price: parseFloat(serviceData.price) || 0
};

setService(normalizedService);



    const availabilityRes = await fetch(
  `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/providers/${id}/availability`
);

if (!availabilityRes.ok) {
  const errorText = await availabilityRes.text();
  throw new Error(`Failed to fetch availability: ${availabilityRes.status} - ${errorText}`);
}

const availabilityResponse = await availabilityRes.json();


let availabilityData: AvailabilitySlot[] = [];


if (availabilityResponse && availabilityResponse.availability) {
  availabilityData = availabilityResponse.availability;
}

else if (Array.isArray(availabilityResponse)) {
  availabilityData = availabilityResponse;
}

else if (availabilityResponse && typeof availabilityResponse === 'object' && availabilityResponse !== null && !Array.isArray(availabilityResponse)) {
  // Handle the case where the response is a single AvailabilitySlot object
  availabilityData = [availabilityResponse];
}


const now = new Date();
const filteredAvailability = availabilityData
  .filter(slot => new Date(slot.end_time) > now)
  .sort((a, b) =>
    new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
  );

setAvailability(filteredAvailability);



    } catch (err: any) {
      console.error('Error loading data:', err);
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [id, queryServiceId]);




  const handleBooking = () => {
    if (provider && service && selectedSlot) {
      const slot = availability.find(s => s.id === selectedSlot);

      if (!slot) {
        setError('Selected time slot is no longer available');
        return;
      }

      localStorage.setItem('selectedProvider', JSON.stringify(provider));
      localStorage.setItem('selectedService', JSON.stringify(service));
      localStorage.setItem('selectedSlot', JSON.stringify(slot));

      router.push(`/checkout?providerId=${provider.id}&serviceId=${service.id}&slotId=${slot.id}`);
    } else {
      if (!selectedSlot) {
        setError('Please select a time slot');
      } else {
        setError('Service information is missing. Please try again.');
      }
    }
  };

  const formatTimeRange = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);

    const dateFormatter = new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });

    const timeFormatter = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    });

    return `${dateFormatter.format(startDate)} • ${timeFormatter.format(startDate)} - ${timeFormatter.format(endDate)}`;
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="spinner-border animate-spin inline-block w-12 h-12 border-4 rounded-full" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-4 text-lg">Loading provider details...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md mx-auto text-center p-6 bg-red-50 rounded-lg shadow">
        <h2 className="text-2xl font-bold text-red-700 mb-2">Error</h2>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => router.push('/bookings')}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          Back to Bookings
        </button>
      </div>
    </div>
  );

  if (!provider) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md mx-auto text-center p-6 bg-yellow-50 rounded-lg shadow">
        <h2 className="text-2xl font-bold text-yellow-700 mb-2">Provider Not Found</h2>
        <p className="text-yellow-600 mb-4">The provider you're looking for doesn't exist or may have been removed.</p>
        <button
          onClick={() => router.push('/bookings')}
          className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition"
        >
          Browse Providers
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Provider Header */}
          <div className="p-6 md:p-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
            <div className="flex flex-col md:flex-row items-start md:items-center">
              <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 md:w-24 md:h-24" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{provider.name}</h1>
                <p className="text-indigo-600 font-medium mt-1">{provider.specialty}</p>
                {service && (
                  <div className="mt-2 flex items-center">
                    <span className="text-gray-600 mr-2">Service:</span>
                    <span className="font-medium">{service.name}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Provider Info */}
              <div className="lg:col-span-2">
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">About {provider.name}</h2>
                  <div className="prose max-w-none">
                    {provider.bio ? (
                      <p className="text-gray-700">{provider.bio}</p>
                    ) : (
                      <p className="text-gray-500 italic">No description available.</p>
                    )}
                  </div>
                </div>

                {/* Service Details */}
                {service && (
                  <div className="mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Service Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-medium text-gray-900">Service</h3>
                        <p className="text-gray-700">{service.name}</p>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">Duration</h3>
                        <p className="text-gray-700">{service.duration_minutes} minutes</p>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">Price</h3>
                        <p className="text-gray-700">${service.price.toFixed(2)}</p>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">Specialty</h3>
                        <p className="text-gray-700">{service.specialty}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <h3 className="font-medium text-gray-900">Description</h3>
                      <p className="text-gray-700">{service.description}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column - Availability */}
              <div className="lg:col-span-1">
                <div className="bg-gray-50 rounded-lg p-6 sticky top-4">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Select a Time</h2>

                  {availability.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500 mb-4">No available time slots at the moment.</p>
                      <button
                          onClick={() => window.location.reload()}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
                      >
                          Refresh Availability
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                      {availability.map(slot => (
                        <button
                          key={slot.id}
                          className={`w-full text-left p-3 rounded-lg border transition ${
                            selectedSlot === slot.id
                              ? 'bg-indigo-50 border-indigo-500 ring-2 ring-indigo-500'
                              : 'bg-white border-gray-300 hover:border-indigo-300 hover:bg-indigo-50'
                          } ${slot.booked ? 'opacity-50 cursor-not-allowed' : ''}`}
                          onClick={() => !slot.booked && setSelectedSlot(slot.id)}
                          disabled={slot.booked}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="font-medium text-gray-900">
                                {formatTimeRange(slot.start_time, slot.end_time)}
                              </div>
                              {slot.booked && (
                                <span className="text-xs text-red-500">Booked</span>
                              )}
                            </div>
                            {selectedSlot === slot.id && (
                              <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                              </svg>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="mt-6">
                    <button
                      className={`w-full py-3 px-4 rounded-lg font-medium transition ${
                        selectedSlot
                          ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                          : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      }`}
                      onClick={handleBooking}
                      disabled={!selectedSlot}
                    >
                      {selectedSlot ? 'Continue to Booking' : 'Select a Time'}
                    </button>

                    {error && (
                      <div className="mt-4 text-center text-red-500 text-sm">
                        {error}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}