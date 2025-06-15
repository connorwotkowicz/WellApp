import { Stripe } from '@stripe/stripe-js'; 

export interface BillingInfo {
  billingName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  billingState: string;
  zip: string;
  guestEmail: string;
  phone: string; 
}

export interface User {
  id: number;
  email: string;
  name: string;
  phone: string; 
  billing_address_line1?: string;
  billing_address_line2?: string;
  billing_city?: string;
  billing_state?: string;
  billing_zip?: string;
}


export interface PaymentFormProps {
  amount: number;
  billingInfo: BillingInfo;
  onSuccess: () => Promise<void>;
  onCancel: () => void;
  onProceedToPayment: () => Promise<void>;
  isProcessing: boolean;
  currency?: string;
  provider: any;
  selectedTime: string;
  userId: number | null;
  stripePromise: Promise<Stripe | null>; 
}