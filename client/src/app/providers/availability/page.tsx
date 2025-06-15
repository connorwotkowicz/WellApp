'use client';

import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AuthContext } from '../../context/AuthContext';
import { Calendar } from '../../components/ui/calendar';
import { TimeSelector } from '../../components/TimeSelector';

const API = process.env.NEXT_PUBLIC_API_BASE_URL;

interface AvailabilitySlot {
  id?: string;
  date: string;
  start_time: string;
  end_time: string;
}

export default function AvailabilityPage() {
  const { user, token, initialized } = useContext(AuthContext);
  const router = useRouter();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);

  useEffect(() => {
    if (initialized && (!user || user.user_role !== 'provider')) {
      router.push('/login');
    }
  }, [initialized, user, router]);

  useEffect(() => {
    if (token && user?.user_role === 'provider') {
      fetchAvailability();
    }
  }, [token, user]);

  const fetchAvailability = async () => {
    try {
      const res = await axios.get<AvailabilitySlot[]>(`${API}/api/providers/availability`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSlots(res.data);
      setLoading(false);
    } catch (error: any) {
      toast.error('Failed to load availability');
      console.error(error);
      setLoading(false);
    }
  };

  const handleAddSlot = (timeSlot: string) => {
    if (!date) return;
    
    const dateString = date.toISOString().split('T')[0];
    const newSlot = {
      date: dateString,
      start_time: `${dateString}T${timeSlot}:00`, 
      end_time: `${dateString}T${add30Minutes(timeSlot)}:00`
    };
    
    setSlots([...slots, newSlot]);
    setSelectedSlots([...selectedSlots, timeSlot]);
  };

  const add30Minutes = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    let newHours = hours;
    let newMinutes = minutes + 30;
    
    if (newMinutes >= 60) {
      newHours += 1;
      newMinutes -= 60;
    }
    
    return `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`;
  };

  const handleRemoveSlot = (index: number) => {
    const newSlots = [...slots];
    newSlots.splice(index, 1);
    setSlots(newSlots);
    
    // Also update selectedSlots state
    if (date) {
      const dateString = date.toISOString().split('T')[0];
      const slotToRemove = slots[index];
      if (slotToRemove.date === dateString) {
        const time = slotToRemove.start_time.split('T')[1].substring(0, 5);
        setSelectedSlots(selectedSlots.filter(slot => slot !== time));
      }
    }
  };

  const handleSave = async () => {
    try {
      const transformedSlots = slots.map(slot => ({
        start_time: slot.start_time,
        end_time: slot.end_time
      }));

      await axios.post(
        `${API}/api/providers/availability`,
        { slots: transformedSlots },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Availability saved successfully!');
    } catch (error: any) {
      toast.error('Failed to save availability');
      console.error(error);
    }
  };

  if (!initialized || loading) return <div>Loading...</div>;
  if (!user || user.user_role !== 'provider') return null;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Manage Your Availability</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
      <Calendar
  mode="single"
  selected={date}
  onSelect={(selectedDate) => {
  
    const dateValue = selectedDate as Date | undefined;
    setDate(dateValue);
    
   
    if (dateValue) {
      const dateString = dateValue.toISOString().split('T')[0];
      setSelectedSlots(
        slots
          .filter(slot => slot.date === dateString)
          .map(slot => slot.start_time.split('T')[1].substring(0, 5))
      );
    } else {
      setSelectedSlots([]);
    }
  }}
  className="rounded-md border shadow"
/>
        </div>
        
        <div className="md:col-span-2">
          {date ? (
            <>
              <h2 className="text-xl font-semibold mb-4">
                Availability for {date.toLocaleDateString()}
              </h2>
              
              <TimeSelector 
                onSelect={handleAddSlot}
                selectedSlots={selectedSlots}
                date={date.toISOString().split('T')[0]}
                existingSlots={slots.filter(s => 
                  s.date === date.toISOString().split('T')[0]
                )}
              />
              
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-3">Selected Time Slots</h3>
                {slots.filter(s => s.date === date.toISOString().split('T')[0]).length > 0 ? (
                  <div className="space-y-2">
                    {slots
                      .filter(s => s.date === date.toISOString().split('T')[0])
                      .map((slot, index) => (
                        <div 
                          key={index} 
                          className="flex justify-between items-center p-3 bg-gray-50 rounded border"
                        >
                          <span>
                            {slot.start_time.split('T')[1].substring(0, 5)} - {slot.end_time.split('T')[1].substring(0, 5)}
                          </span>
                          <button
                            onClick={() => handleRemoveSlot(
                              slots.findIndex(s => 
                                s.date === slot.date && 
                                s.start_time === slot.start_time
                              )
                            )}
                            className="text-red-500 hover:text-red-700"
                          >
                            Remove
                          </button>
                        </div>
                      ))
                    }
                  </div>
                ) : (
                  <p className="text-gray-500">No slots selected for this date</p>
                )}
              </div>
            </>
          ) : (
            <p className="text-gray-500">Please select a date</p>
          )}
        </div>
      </div>
      
      <div className="mt-8 flex justify-end">
        <button
          onClick={handleSave}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
        >
          Save Availability
        </button>
      </div>
    </div>
  );
}