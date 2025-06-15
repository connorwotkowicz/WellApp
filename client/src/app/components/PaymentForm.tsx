'use client';

import React, { useEffect } from 'react';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { StripeCardElementChangeEvent } from '@stripe/stripe-js';
import { BillingInfo, PaymentFormProps } from '../checkout/types'
import { createCheckoutSession } from '../../utils/api';

const PaymentForm: React.FC<PaymentFormProps> = ({
  billingInfo,
  amount,
  onSuccess,
  onCancel,
  onProceedToPayment,
  isProcessing,
  currency = 'usd',
   provider,
  selectedTime,
  userId,
  stripePromise: stripePromiseProp 
}: PaymentFormProps) => {


  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isCardComplete, setIsCardComplete] = React.useState(false);

  useEffect(() => {
    setErrorMessage(null);
  }, [billingInfo]);


  const handleCardChange = (event: StripeCardElementChangeEvent) => {
    setErrorMessage(event.error?.message || null);
    setIsCardComplete(event.complete);
  };





const handleSubmit = async (event: React.FormEvent) => {
  event.preventDefault();
  setErrorMessage(null);

  const stripeInstance = await stripePromiseProp;
  if (!stripeInstance) {
    setErrorMessage("Payment system is not available. Please try again later.");
    return;
  }

  setIsSubmitting(true);
  onProceedToPayment();
  
  try {
 
      const response = await createCheckoutSession({
      providerId: provider.id,
      time: selectedTime,
      userId: userId || 0,
      billingInfo: {
        name: billingInfo.billingName,
        addressLine1: billingInfo.addressLine1,
        addressLine2: billingInfo.addressLine2 || undefined,
        city: billingInfo.city,
        state: billingInfo.billingState,
        zip: billingInfo.zip,
        email: billingInfo.guestEmail,
        phone: billingInfo.phone
      }
    });

const sessionId = (response as { id: string }).id;

     const result = await stripeInstance.redirectToCheckout({
      sessionId: sessionId
    });

    if (result.error) {
      throw result.error;
    }
  } catch (error: any) {
    console.error("Payment processing error:", error);
    setErrorMessage(error.message || "An unexpected error occurred. Please try again.");
  } finally {
    setIsSubmitting(false);
  }
};



  const isLoading = isSubmitting || isProcessing;
  const isDisabled = isLoading || !stripe || !elements;

  return (
    <form onSubmit={handleSubmit} className="payment-form-wrapper space-y-4">
      {errorMessage && (
        <div className="error-message p-3 mb-4 bg-red-50 text-red-700 rounded-md">
          {errorMessage}
        </div>
      )}

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Credit or Debit Card
        </label>
        <div className="border rounded-md p-3 bg-white">
          <CardElement 
            onChange={handleCardChange}
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#32325d',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#fa755a',
                },
              },
            }}
          />
        </div>
      </div>

      <div className="flex space-x-3 pt-2">
        <button
          className="modal-button flex-1 bg-gray-500 hover:bg-gray-600 disabled:opacity-50 text-white py-2 px-4 rounded transition"
          type="button"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </button>
        
        <button
          className="modal-button flex-1 bg-primary hover:bg-primary-dark disabled:opacity-50 text-white py-2 px-4 rounded transition"
          type="submit"
          disabled={isDisabled || !isCardComplete}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : 'Pay Now'}
        </button>
      </div>
    </form>
  );
};

export default PaymentForm;