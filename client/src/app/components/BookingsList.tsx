'use client';

import { useEffect, useState } from 'react';

interface Booking {
  id: number;
  time: string;
  status: string;
  provider: {
    id: number;
    name: string;
    specialty: string;
    image_url: string;
  };
  service: {
    id: number;
    name: string;
    description: string;
  };
}

const BookingsList = ({ userId }: { userId: number }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch('/api/bookings', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch bookings');
        }

        const data: Booking[] = await response.json();
        setBookings(data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    fetchBookings();
  }, [userId]);

  return (
    <div className="bookings-list">
      <h2>Your Bookings</h2>
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <ul>
          {bookings.map((booking) => (
            <li key={booking.id} className="booking-card">
              <strong>{booking.service.name}</strong> with <strong>{booking.provider.name}</strong>
              <br />
              <span>{new Date(booking.time).toLocaleString()}</span>
              <br />
              <small>Status: {booking.status}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BookingsList;
