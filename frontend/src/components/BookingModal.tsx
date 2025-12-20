import * as React from 'react';
import { useState } from 'react';
import { X, Calendar, Clock, Video } from 'lucide-react';

interface Slot {
  id: string;
  date: string;
  time: string;
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  lawyerName: string;
  availableSlots?: Slot[];
  initialSlotId?: string | null;
  onBookSlot: (date: string, time: string, clientName: string, clientEmail: string, slotId?: string | null) => Promise<void>;
}

const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  lawyerName,
  availableSlots,
  initialSlotId,
  onBookSlot,
}: BookingModalProps) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(initialSlotId || null);

  React.useEffect(() => {
    if (initialSlotId && availableSlots) {
      const s = availableSlots.find(sl => sl.id === initialSlotId);
      if (s) {
        setSelectedSlotId(s.id);
        setSelectedDate(s.date);
        setSelectedTime(s.time);
      }
    }
  }, [initialSlotId, availableSlots]);

  // If slots are provided by the lawyer, use them; otherwise fallback to generated dates/times
  const getAvailableDates = () => {
    if (availableSlots && availableSlots.length > 0) {
      return Array.from(new Set(availableSlots.map(s => s.date))).sort();
    }
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  const getTimeSlots = (forDate?: string) => {
    if (availableSlots && availableSlots.length > 0 && forDate) {
      return availableSlots.filter(s => s.date === forDate).map(s => ({ id: s.id, time: s.time }));
    }

    const slots = [];
    for (let hour = 9; hour <= 17; hour++) {
      slots.push({ id: `${hour}:00`, time: `${hour.toString().padStart(2, '0')}:00` });
    }
    return slots;
  };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedDate && selectedTime && clientName && clientEmail) {
      try {
        setIsSubmitting(true);
        await onBookSlot(selectedDate, selectedTime, clientName, clientEmail, selectedSlotId ?? null);
        onClose();
      } catch (error) {
        console.error('Error booking slot:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Book Consultation with {lawyerName}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600 flex items-center">
            <Video className="w-4 h-4 mr-2" />
            Session will be conducted via Google Meet
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Select Date
              </label>
                {availableSlots && availableSlots.length > 0 ? (
                  <select
                    value={selectedDate}
                    onChange={(e) => { setSelectedDate(e.target.value); setSelectedSlotId(null); setSelectedTime(''); }}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  >
                    <option value="">Choose a date</option>
                    {getAvailableDates().map((date) => (
                      <option key={date} value={date}>
                        {new Date(date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </option>
                    ))}
                  </select>
                ) : (
                  <select
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  >
                    <option value="">Choose a date</option>
                    {getAvailableDates().map((date) => (
                      <option key={date} value={date}>
                        {new Date(date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </option>
                    ))}
                  </select>
                )}
              </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4 inline mr-2" />
                Select Time
              </label>
              {availableSlots && availableSlots.length > 0 && selectedDate ? (
                <div className="space-y-2">
                  {getTimeSlots(selectedDate).map((slot) => (
                    <label key={slot.id} className={`flex items-center p-2 border rounded ${selectedSlotId === slot.id ? 'bg-indigo-50 border-indigo-200' : 'bg-white'}`}>
                      <input type="radio" name="slot" value={slot.id} checked={selectedSlotId === slot.id} onChange={() => { setSelectedSlotId(slot.id); setSelectedTime(slot.time); }} className="mr-3" />
                      <span>{slot.time}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  required
                >
                  <option value="">Choose a time</option>
                  {getTimeSlots().map((t) => (
                    <option key={t.id} value={t.time}>
                      {t.time}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Your name</label>
              <input
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Your email</label>
              <input
                type="email"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="you@example.com"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white rounded-lg py-2 px-4 hover:bg-indigo-700 transition-colors disabled:bg-gray-400 flex items-center justify-center"
              disabled={!selectedDate || !selectedTime || !clientName || !clientEmail || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Booking...
                </>
              ) : (
                'Book Consultation'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;