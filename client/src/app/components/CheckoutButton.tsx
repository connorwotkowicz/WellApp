// import React from 'react';
// import { loadStripe } from '@stripe/stripe-js';

// interface BookingDetails {
//   serviceName: string;
//   providerName: string;
//   amount: number;
// }

// // interface CheckoutButtonProps {
// //   bookingDetails: BookingDetails;
// // }

// // const CheckoutButton: React.FC<CheckoutButtonProps> = ({ bookingDetails }) => {
// //   const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

//   const handleCheckout = async () => {
//     const stripe = await stripePromise;

//     if (!stripe) {
//       console.error('Stripe failed to load');
//       return;
//     }


//     console.log("Booking details:", bookingDetails);

//     const response = await fetch('/api/checkout/create-checkout-session', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ bookingDetails }),
//     });

//     const session = await response.json();
//     console.log("Checkout session:", session); // Log the session details

//     if (session && session.id) {
//       const result = await stripe.redirectToCheckout({
//          sessionId: id,  
//       });

//       if (result.error) {
//         console.error(result.error.message);
//       }
//     } else {
//       console.error("No session ID returned from backend");
//     }
//   };

//   return (
//     <button role="link" onClick={handleCheckout}>
//       Book Now
//     </button>
//   );
// };

// export default CheckoutButton;
