
'use client';

import { useRouter } from 'next/navigation';

const CancelPage = () => {
  const router = useRouter();

  return (
    <div>
      <h1>Payment Canceled</h1>
      <p>Your payment was not completed. Please try again.</p>
      <button onClick={() => router.push('/bookings')}>Go back to bookings</button>
    </div>
  );
};

export default CancelPage;
