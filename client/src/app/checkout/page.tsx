'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import PaymentForm from '../components/PaymentForm';
import { BillingInfo } from './types'; 
import { getUserIdFromToken } from '../../utils/getUserIdFromToken'; 

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

const CheckoutPage = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<string>('date');
  const [billingName, setBillingName] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [billingState, setBillingState] = useState('');
  const [zip, setZip] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isGuest, setIsGuest] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [userId, setUserId] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [provider, setProvider] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
const [availableSlots, setAvailableSlots] = useState<any[]>([]);
const [selectedSlot, setSelectedSlot] = useState<string>(''); 
const [providerId, setProviderId] = useState<string | null>(null);

  
  const [showSummary, setShowSummary] = useState(false);





  
  useEffect(() => {
    const user = getUserIdFromToken();
    setUserId(user ? parseInt(user, 10) : null);  
    setIsGuest(!user);

    const storedStep = localStorage.getItem('currentStep');
    if (storedStep) {
      setCurrentStep(storedStep);
    }

 const providerData = localStorage.getItem('selectedProvider');
  if (providerData) {
    setProvider(JSON.parse(providerData));  
  } else {
    router.push('/bookings');  
  }
}, [router]);



useEffect(() => {
  const queryParams = new URLSearchParams(window.location.search);
  const pid = queryParams.get('providerId');
  if (pid) {
    setProviderId(pid);
    fetch(`/api/availability/${pid}`)
      .then((res) => res.json())
      .then((slots) => setAvailableSlots(slots))
      .catch((err) => console.error('Error fetching slots:', err));
  }
}, []);



  useEffect(() => {
    localStorage.setItem('currentStep', currentStep);
  }, [currentStep]);

  const isDateAndTimeSelected = !!selectedDate && !!selectedTime;

  const isBillingComplete = () => {
    const basicFields = billingName.trim() && 
                       addressLine1.trim() && 
                       city.trim() && 
                       billingState.trim() && 
                       zip.trim();
    
    if (isGuest) {
      return basicFields && guestEmail.trim() && phone.trim();
    }
    return basicFields;
  };

  const handleDateAndTimeContinue = () => {
    if (!isDateAndTimeSelected) {
      setError('Please select both date and time');
      return;
    }
    setCurrentStep('billing');
    setError(null);
  };

  const handleBillingContinue = () => {
  
    if (!billingName.trim()) {
      setError('Please enter your full name');
      return;
    }
    if (!addressLine1.trim()) {
      setError('Please enter your street address');
      return;
    }
    if (!city.trim()) {
      setError('Please enter your city');
      return;
    }
    if (!billingState.trim()) {
      setError('Please enter your state');
      return;
    }
    if (!/^\d{5}$/.test(zip)) {
      setError('Zip Code must be a 5-digit number');
      return;
    }
    if (isGuest) {
      if (!guestEmail.trim()) {
        setError('Please enter your email address');
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestEmail)) {
        setError('Please enter a valid email address');
        return;
      }
      if (!phone.trim()) {
        setError('Please enter your phone number');
        return;
      }
      if (!/^\d{10,15}$/.test(phone)) {
        setError('Phone number must be 10-15 digits');
        return;
      }
    }

    setCurrentStep('payment');
    setError(null);
  };

const handlePaymentSuccess = async () => {
  try {
    const storedProvider = localStorage.getItem('selectedProvider');
    if (!storedProvider) return;

    const provider = JSON.parse(storedProvider);

    const bookingResponse = await fetch('/api/bookings/create-booking', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        providerId: provider.id,
        serviceId: provider.service_id || 1, 
        time: selectedTime,
        userId: userId, 
      }),
    });

    const bookingData = await bookingResponse.json();
    console.log('Booking created:', bookingData);
  } catch (err) {
    console.error('Failed to create booking after payment:', err);
  }

  router.push('/checkout/success');
};


  const handlePaymentCancel = () => {
    router.push('/checkout/cancel');
  };

  
  const handleBack = () => {
    if (currentStep === 'payment') {
      setCurrentStep('billing');
    } else if (currentStep === 'billing') {
      setCurrentStep('date');
    }
  };

  const handleProceedToPayment = async () => {
    if (!isBillingComplete()) {
      setError('Please complete all billing information');
      return;
    }

    setIsProcessing(true);
    try {
      localStorage.setItem('selectedProvider', JSON.stringify(provider));

      const response = await fetch('/api/payment/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          providerId: provider.id,  
          time: selectedTime,  
          userId: userId,  
          billingInfo: {
            name: billingName,
            address: addressLine1,
            address2: addressLine2,
            city,
            state: billingState,
            zip,
            email: guestEmail,
            phone,
          },
        }),
      });

      const { id } = await response.json();
      if (!id) {
        throw new Error('Session ID not received');
      }

      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Stripe has not loaded yet');
      }

      const result = await stripe.redirectToCheckout({ sessionId: id });

      if (result.error) {
        throw result.error;
      }

      router.push('/checkout/success');
    } catch (error: any) {
      setError(error.message || 'Error processing payment');
      console.error('Payment error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const billingInfo: BillingInfo = {
    name: billingName,           
    billingName,               
    addressLine1,
    addressLine2: addressLine2 || undefined, 
    city,
    state: billingState,
    zip,
    email: isGuest ? guestEmail : '',
    phone,
    billingState,               
    guestEmail: isGuest ? guestEmail : '', 
  };

  return (
    <div className="checkout-page">
      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}

      {provider && (
        <div className="checkout-container">
          
          <div className='checkout-header'>

            
            <h1 className='checkout-title'>Checkout</h1>

        

            <button className='order-summary-toggle' onClick={() => setShowSummary(!showSummary)}>
              {showSummary ? 'Hide Order Summary' : `Show Order Summary: $${provider.price}`}
            </button>
          </div>
              <div>
             <span><strong>Instructor: </strong></span>
                    <span>{provider.name}</span>
                  </div>
                  <div className='summary-line'>
                
                    <span>{provider.service || 'Not available'}</span>
                  </div>

               {currentStep !== 'date' && (
            <button className="back-modal-button" onClick={handleBack}>
              Back
            </button>
          )}
          {showSummary && (
            <div className='summary-overlay' onClick={() => setShowSummary(false)}>
              <div className='order-summary-panel' onClick={(e) => e.stopPropagation()}>
                <div className='summary-box'>
                  <div className='summary-header'>
                    <h4 className='summary-title'>Your Order Total</h4>
                    <div className='summary-items-row'>
                      <span className='summary-items'></span>
            
                    </div>
                  </div>

                  <div className='summary-divider' />
                  <div className='summary-line'>
                    <span><strong>Provider</strong></span>
                    <span>{provider.name}</span>
                  </div>
                  <div className='summary-line'>
                    <span><strong>Session</strong></span>
                    <span>{provider.service || 'Not available'}</span>
                  </div>
                  <div className='summary-line'>
                    <span><strong>Specialty</strong></span>
                    <span>{provider.specialty || 'Not available'}</span>
                  </div>
                <div className='summary-line'>
          <span><strong>Info</strong></span>
          <span>{provider.description || 'No description available'}</span>
        </div>
        <div className='summary-line'>
          
          <span><strong>Date & Time</strong></span>
          <span>{selectedDate} at {selectedTime}</span>
        </div>
        <div className='summary-line'>
          <span><strong>Duration</strong></span>
          <span>{provider.duration} minutes</span>  
        </div>

        {availableSlots.length > 0 && (
  <div className="slot-picker">
    <label>Select a time slot:</label>
    <select value={selectedSlot} onChange={(e) => setSelectedSlot(e.target.value)}>
      <option value="">-- Select --</option>
      {availableSlots.map((slot) => (
        <option key={slot.id} value={slot.start_time}>
          {new Date(slot.start_time).toLocaleString()}
        </option>
      ))}
    </select>
  </div>
)}

                  <div className='summary-line'>
                    <span>Subtotal</span>
                    <span>${provider.price}</span>
                  </div>
             
                  <div className='summary-line muted'>
                    <span>Tax</span>
                    <span>TBD</span>
                  </div>
                  <div className='summary-total'>
                    <span><strong>Order total</strong></span>
                    <strong>${provider.price}</strong>
                  </div>
                </div>
                <button className='close-summary' onClick={() => setShowSummary(false)}>
                  ✕
                </button>
              </div>
            </div>
          )}

          {currentStep === 'date' && (
            <section className="date-time-selection">
              <h3>Select your session date and time:</h3>
              <div className="form-group">
                <label>Session Date*</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Session Time*</label>
                <input
                  type="time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  required
                />
              </div>

              <button
                className="continue-btn"
                onClick={handleDateAndTimeContinue}
                disabled={!isDateAndTimeSelected}
              >
                Continue to Billing
              </button>
            </section>
          )}

          {currentStep === 'billing' && (
            <>
              <section className="billing-address">
                <h3>Enter your billing address:</h3>

                <div className="form-group">
                  <label>Full Name*</label>
                  <input
                    type="text"
                    value={billingName}
                    onChange={(e) => setBillingName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Street Address*</label>
                  <input
                    type="text"
                    value={addressLine1}
                    onChange={(e) => setAddressLine1(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Apt, Suite, Building (Optional)</label>
                  <input
                    type="text"
                    value={addressLine2}
                    onChange={(e) => setAddressLine2(e.target.value)}
                  />
                </div>

                <div className="form-inline">
                  <div className="form-group">
                    <label>Zip Code*</label>
                    <input
                      type="text"
                      value={zip}
                      maxLength={5}
                      onChange={(e) => setZip(e.target.value.replace(/\D/g, ''))}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>City*</label>
                    <input 
                      type="text" 
                      value={city} 
                      onChange={(e) => setCity(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>State*</label>
                    <input
                      type="text"
                      value={billingState}
                      onChange={(e) => setBillingState(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Phone Number*</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    required
                  />
                </div>

                {isGuest && (
                  <div className="form-group">
                    <label>Email Address*</label>
                    <input
                      type="email"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      required
                    />
                  </div>
                )}
              </section>

              <div className="full-width-divider-2" />

              <button
                className="continue-btn"
                onClick={handleBillingContinue}
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : 'Continue to Payment'}
              </button>
            </>
          )}


{currentStep === 'payment' && (
  <section className="bottom-checkout-container">
    <div className="billing-summary">
      <div className="summary-box">
        <h3 className="summary-title">Your Info</h3>
        <div className="summary-divider" />
        <h4>Billing Information</h4>
        <div className="summary-line">
          <p><strong>Name:</strong> {billingName}</p>
        </div>
        <p><strong>Address:</strong> {addressLine1}{addressLine2 && `, ${addressLine2}`}</p>
        <p><strong>City/State/Zip:</strong> {city}, {billingState} {zip}</p>
        {isGuest && <p><strong>Email:</strong> {guestEmail}</p>}
        <p><strong>Phone:</strong> {phone}</p>
      </div>
    </div>


  
    <div className="payment-container">
      <div className="payment-options">
     
        
       
     


    
        <Elements stripe={stripePromise}>
          <PaymentForm
            billingInfo={billingInfo}
            onSuccess={handlePaymentSuccess}
            onCancel={handlePaymentCancel}
            onProceedToPayment={handleProceedToPayment}
            isProcessing={isProcessing}
          />
        </Elements>
        
      </div>
         <div className="details">
            Secure checkout powered by Stripe.
          </div>
    </div>
  
  </section>
)}


        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
