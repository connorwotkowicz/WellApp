import React from 'react';

interface DateSelectionStepProps {
  availableSlots: any[];
  selectedSlot: string;
  onSlotChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onContinue: () => void;
}

const DateSelectionStep: React.FC<DateSelectionStepProps> = ({
  availableSlots,
  selectedSlot,
  onSlotChange,
  onContinue
}) => (
  <section className="date-time-selection">
    <h3>Select your session date and time:</h3>
    <div className="slot-picker">
      <label>Available Time Slots:</label>
      <select
        value={selectedSlot}
        onChange={onSlotChange}
      >
        <option value="">Select a time slot</option>
        {availableSlots
          .filter(slot => !slot.is_booked)
          .map(slot => (
            <option key={slot.id} value={slot.start_time}>
              {new Date(slot.start_time).toLocaleString([], {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </option>
          ))}
      </select>
    </div>

    <button
      className="continue-btn"
      onClick={onContinue}
    >
      Continue to Billing
    </button>
  </section>
);

export default DateSelectionStep;