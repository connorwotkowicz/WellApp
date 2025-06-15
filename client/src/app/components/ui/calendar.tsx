'use client';

import React, { useState } from 'react';
import { addDays, format } from 'date-fns';
import { DateRange } from 'react-day-picker';

export const Calendar = ({
  mode = 'single',
  selected,
  onSelect,
  className,
}: {
  mode?: 'single' | 'range';
  selected?: Date | DateRange;
  onSelect?: (date: Date | DateRange | undefined) => void;
  className?: string;
}) => {
  const [date, setDate] = useState<Date | undefined>(selected as Date);
  const [range, setRange] = useState<DateRange | undefined>(selected as DateRange);

  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate);
    if (onSelect) onSelect(newDate);
  };

  return (
    <div className={className}>
      {mode === 'single' ? (
        <input
          type="date"
          value={date ? format(date, 'yyyy-MM-dd') : ''}
          onChange={(e) => handleDateChange(e.target.valueAsDate || undefined)}
          className="p-2 border rounded w-full"
        />
      ) : (
        <div className="flex space-x-2">
          <input
            type="date"
            value={range?.from ? format(range.from, 'yyyy-MM-dd') : ''}
            onChange={(e) => setRange({ from: e.target.valueAsDate || undefined, to: range?.to })}
            className="p-2 border rounded w-full"
          />
          <input
            type="date"
            value={range?.to ? format(range.to, 'yyyy-MM-dd') : ''}
            onChange={(e) => setRange({ from: range?.from, to: e.target.valueAsDate || undefined })}
            className="p-2 border rounded w-full"
          />
        </div>
      )}
    </div>
  );
};