// PaymentStep.tsx
import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentForm from '../../components/PaymentForm';
import { BillingInfo, User } from '../../checkout/types'; 

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

interface PaymentStepProps {
  billing: BillingInfo;
  user?: User | null; 
  amount: number; 
  onSuccess: () => void;
  onProcessing: () => void;
  isProcessing: boolean;
  onCancel: () => void;
  currency?: string;
}

const PaymentStep: React.FC<PaymentStepProps> = ({
  billing,
  user,
  amount,
  onSuccess,
  onProcessing,
  isProcessing,
  onCancel,
  currency = 'usd'
}) => (
  <section className="bottom-checkout-container">
    <div className="payment-container">
      <Elements stripe={stripePromise}>
        <PaymentForm
          billingInfo={billing}
          amount={amount}
          currency={currency}
          onSuccess={onSuccess}
          onProcessing={onProcessing}
          isProcessing={isProcessing}
          onCancel={onCancel}
          onProceedToPayment={onProcessing}
          userInfo={user ? { 
            name: user.name, 
            email: user.email 
          } : undefined}
        />
      </Elements>
    </div>
  </section>
);

export default PaymentStep;