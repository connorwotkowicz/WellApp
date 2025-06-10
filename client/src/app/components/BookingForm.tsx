'use client';

import { useState, useEffect } from 'react';

const BookingForm = ({ providerId, showPopup, setShowPopup }: { providerId: number; showPopup: boolean; setShowPopup: (show: boolean) => void }) => {
  const [serviceId, setServiceId] = useState<number | null>(null);
  const [time, setTime] = useState<string>('');
  const [error, setError] = useState<string>('');

  
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (e.target instanceof HTMLElement && !e.target.closest('.popup-content')) {
        setShowPopup(false); 
      }
    };

    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowPopup(false); 
      }
    };

    
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleEscapeKey);

    
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [setShowPopup]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!serviceId || !time) {
      setError('Please select a service and time.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setError('User is not authenticated.');
      return;
    }

    let userId: string | null = null;
    try {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      userId = decodedToken.userId;
      if (!userId) {
        setError('Invalid token: User ID not found.');
        return;
      }
    } catch (error) {
      setError('Error decoding token.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId,
          providerId,
          serviceId,
          time,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        alert('Booking confirmed!');
        setShowPopup(false); 
      } else {
        setError(result.error || 'Failed to create booking.');
      }
    } catch (err) {
      setError('An error occurred while creating the booking.');
      console.error(err);
    }
  };

  return (
    <div className={`booking-popup ${showPopup ? 'show' : ''}`}>
      <div className="popup-content">
        <button onClick={() => setShowPopup(false)} className="close-btn">
          ×
        </button>
        <h2>Book a Session with Provider {providerId}</h2>

        <form onSubmit={handleSubmit}>
          <div>
            <label>Service</label>
            <select onChange={(e) => setServiceId(Number(e.target.value))} value={serviceId || ''}>
              <option value="">Select Service</option>
              <option value={4}>Hatha Yoga Session</option>
              <option value={5}>Guided Meditation</option>
              <option value={6}>Breathwork Therapy</option>
            </select>
          </div>

          <div>
            <label>Time</label>
            <input type="datetime-local" value={time} onChange={(e) => setTime(e.target.value)} />
          </div>

          <button type="submit">Book Now</button>

          {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default BookingForm;
