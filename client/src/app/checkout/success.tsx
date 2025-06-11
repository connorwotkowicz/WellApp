'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const SuccessPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const createBooking = async () => {
     
      const urlParams = new URLSearchParams(window.location.search);
      const sessionId = urlParams.get('session_id');

      if (!sessionId) {
        console.error('No session ID found');
        return;
      }

      try {
      
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/bookings/create-booking`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sessionId,
          
            userId: localStorage.getItem('userId'),
            providerId: localStorage.getItem('providerId'),
            serviceId: localStorage.getItem('serviceId'),
            time: localStorage.getItem('selectedTime'),
          }),
        });

        const data = await response.json();
        if (data.booking) {
          console.log('Booking created:', data.booking);
          setLoading(false);
          router.push('/bookings'); 
          
          console.error('Error creating booking:', data.error);
        }
      } catch (error) {
        console.error('Error during booking creation:', error);
        setLoading(false);
      }
    };

    createBooking();
  }, [router]);

  return (
    <div>
      {loading ? (
        <h1>Processing your booking...</h1>
      ) : (
        <div>
          <h1>Payment Successful!</h1>
          <p>Your booking has been confirmed. You will be redirected shortly.</p>
        </div>
      )}
    </div>
  );
};

export default SuccessPage;
