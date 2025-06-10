export interface BillingInfo {
  name: string;
  billingName: string;
  addressLine1: string;
  addressLine2?: string; 
  city: string;
  state: string;
  zip: string;
  email: string;
  phone: string;
  billingState: string;
  guestEmail: string;
}



export interface User {
  id: number;
  email: string;
  name: string;
  
}
