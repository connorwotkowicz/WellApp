import React from 'react';
import { BillingInfo } from '../../checkout/types';

interface BillingStepProps {
  billing: BillingInfo;
  isGuest: boolean;
  isProcessing: boolean;
  onInputChange: (field: keyof BillingInfo, value: string) => void;
  onContinue: () => void;
}

const BillingStep: React.FC<BillingStepProps> = ({
  billing,
  isGuest,
  isProcessing,
  onInputChange,
  onContinue
}) => (
  <>
    <section className="billing-address">
      <h3>Enter your billing address:</h3>
      
      {([
        'billingName', 
        'addressLine1',
        'addressLine2',
        'city',
        'billingState',
        'zip',
        'phone'
      ] as const).map(field => (
        <div className="form-group" key={field}>
          <label>
            {field === 'billingName' ? 'Full Name*' : 
             field === 'addressLine1' ? 'Street Address*' : 
             field === 'addressLine2' ? 'Apt, Suite, Building (Optional)' : 
             field === 'city' ? 'City*' : 
             field === 'billingState' ? 'State*' : 
             field === 'zip' ? 'Zip Code*' : 
             'Phone Number*'}
          </label>
          <input
            type={field === 'zip' ? 'text' : 'text'}
            value={billing[field]}
            onChange={(e) => onInputChange(field, e.target.value)}
            maxLength={field === 'zip' ? 5 : undefined}
            required={field !== 'addressLine2'}
          />
        </div>
      ))}
      
      {isGuest && (
        <div className="form-group">
          <label>Email Address*</label>
          <input
            type="email"
            value={billing.guestEmail}
            onChange={(e) => onInputChange('guestEmail', e.target.value)}
            required
          />
        </div>
      )}
    </section>

    <button
      className="continue-btn"
      onClick={onContinue}
      disabled={isProcessing}
    >
      {isProcessing ? 'Processing...' : 'Continue to Payment'}
    </button>
  </>
);

export default BillingStep;