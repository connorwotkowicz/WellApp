import React from 'react';

interface TimeSlot {
  start_time: string;
  end_time: string;
}

interface TimeSelectorProps {
  onSelect: (time: string) => void;
  selectedSlots: string[];
  date: string;
  existingSlots: TimeSlot[];
}

export const TimeSelector: React.FC<TimeSelectorProps> = ({ 
  onSelect, 
  selectedSlots,
  date,
  existingSlots
}) => {
  const times = [];
  for (let hour = 9; hour <= 17; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      times.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`);
    }
  }

  const isSlotTaken = (time: string) => {
    return existingSlots.some(slot => {
      const slotStart = new Date(`${date}T${slot.start_time}:00`);
      const slotEnd = new Date(`${date}T${slot.end_time}:00`);
      const current = new Date(`${date}T${time}:00`);
      
      return current >= slotStart && current < slotEnd;
    });
  };

  return (
    <div className="grid grid-cols-4 gap-2">
      {times.map(time => {
        const isSelected = selectedSlots.includes(time);
        const isTaken = isSlotTaken(time);
        
        return (
          <button
            key={time}
            onClick={() => !isTaken && onSelect(time)}
            className={`py-2 px-3 rounded-md text-center ${
              isTaken 
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                : isSelected
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
            disabled={isTaken}
            title={isTaken ? "This slot overlaps with existing availability" : ""}
          >
            {time}
          </button>
        );
      })}
    </div>
  );
};