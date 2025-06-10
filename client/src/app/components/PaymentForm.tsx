'use client';

import React from 'react';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';

type BillingInfo = {
  name: string; 
  billingName: string;
  addressLine1: string;
  addressLine2?: string;  
  city: string;
  billingState: string;
  zip: string;
  guestEmail: string;
  phone: string;
};

type SuccessCallback = () => void;
type CancelCallback = () => void;

interface PaymentFormProps {
  billingInfo: BillingInfo;
  onSuccess: SuccessCallback;
  onCancel: CancelCallback;
  onProceedToPayment: () => void;
  isProcessing: boolean;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  billingInfo,
  onSuccess,
  onCancel,
  onProceedToPayment,
  isProcessing,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [localIsProcessing, setLocalIsProcessing] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      console.error("Stripe has not loaded yet");
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      console.error("Card element not found");
      return;
    }

    setLocalIsProcessing(true);
    setErrorMessage('');

    try {
      
      const response = await fetch('/api/payment/payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: 1000 }), 
      });

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      const { clientSecret } = await response.json();

      
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: billingInfo.billingName,
            email: billingInfo.guestEmail || '', 
            phone: billingInfo.phone || '',
            address: {
              line1: billingInfo.addressLine1,
              line2: billingInfo.addressLine2 || '', 
              city: billingInfo.city,
              state: billingInfo.billingState,
              postal_code: billingInfo.zip,
            },
          },
        },
      });

      
      if (error) {
        setErrorMessage(error.message || "Payment failed");
        setLocalIsProcessing(false);
        return;
      }

      
      if (paymentIntent.status === 'succeeded') {
        onSuccess();
      }
    } catch (error) {
      console.error("Payment processing error:", error);
      setErrorMessage("An error occurred. Please try again.");
      setLocalIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form-wrapper">
    
      {errorMessage && <div className="error-message">{errorMessage}</div>}

     
      <div>
        <label>Credit or Debit Card</label>
        <CardElement />
      </div>

      <button className="modal-button" type="submit" disabled={localIsProcessing || isProcessing}>
        {localIsProcessing || isProcessing ? 'Processing...' : 'Pay Now'}
      </button>

    
      <button className="modal-button" type="button" onClick={onCancel} disabled={localIsProcessing || isProcessing}>
        Cancel
      </button>
    </form>
  );
};

export default PaymentForm;
