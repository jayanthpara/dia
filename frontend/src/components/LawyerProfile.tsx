import React, { useState } from 'react';
import { MapPin, Star, Briefcase, Award, Mail, Phone } from 'lucide-react';
import BookingModal from './BookingModal';

interface Lawyer {
  id?: string;
  name: string;
  experience: string;
  qualifications: string[];
  imageUrl: string;
  vicinity?: string;
  rating?: number;
  isProBono?: boolean;
  email?: string; // For Google Meet invitation
  caseTypes?: string[];
  languages?: string[];
  gender?: string;
  yearsExperience?: number;
  contact?: { email?: string; phone?: string };
  previousCases?: { title: string; year: number; outcome?: string; description?: string }[];
}

interface LawyerProfileProps {
  lawyer: Lawyer;
}

import { useAuth } from '../context/AuthContext';

const LawyerProfile: React.FC<LawyerProfileProps> = ({ lawyer }) => {
  const { currentUser } = useAuth();
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [isExpanded, setIsExpanded] = useState(false);
  const [initialSlotId, setInitialSlotId] = useState<string | null>(null);
  const availableSlots = (lawyer as any).appointments || [];

  const handleBookSlot = async (date: string, time: string, clientName: string, clientEmail: string) => {
    try {
      setBookingStatus('loading');

      // Create booking on backend
      const payload = { lawyerId: (lawyer as any).id, clientName, clientEmail, date, time };
      const res = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Server error: ${text}`);
      }

      const booking = await res.json();

      // After successful booking creation, open Google Calendar event for the user to add meeting
      const meetingTitle = `Legal Consultation with ${lawyer.name}`;
      const meetingDate = new Date(`${date}T${time}`);
      const endDate = new Date(meetingDate.getTime() + 60 * 60 * 1000);
      const startDateTime = meetingDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      const endDateTime = endDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

      const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE`
        + `&text=${encodeURIComponent(meetingTitle)}`
        + `&dates=${startDateTime}/${endDateTime}`
        + `&details=${encodeURIComponent('Legal consultation session via Google Meet. The meeting link will be provided in the calendar event.')}`
        + `&add=${encodeURIComponent(clientEmail || '')}`
        + `&conferencedata=1`  // Enable Google Meet
        + `&crm=AVAILABLE`
        + `&add=meet.google.com`;

      window.open(googleCalendarUrl, '_blank');

      setBookingStatus('success');
    } catch (error) {
      console.error('Booking error:', error);
      setBookingStatus('error');
    }
  };

  // Quick booking triggered on button click (uses current time and current user if available)
  const createQuickBooking = async () => {
    setBookingStatus('loading');
    try {
      const now = new Date();
      const date = now.toISOString().split('T')[0];
      const time = now.toTimeString().slice(0,5); // HH:MM
      const clientName = currentUser?.name || 'Guest';
      const clientEmail = currentUser?.email || 'guest@unknown';
      const payload: any = { lawyerId: (lawyer as any).id, clientName, clientEmail, date, time };

      const res = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || 'Failed to create booking');
      }

      const data = await res.json();
      setBookingStatus('success');
      alert(`Booking created (ID: ${data.id}) for ${date} ${time}`);
    } catch (err: any) {
      console.error('Quick booking failed', err);
      setBookingStatus('error');
      alert('Quick booking failed: ' + (err.message || err));
    }
  };

  // Helper to toggle profile view and optionally create quick booking
  const handleViewProfile = async () => {
    // create booking at click time then toggle view
    await createQuickBooking();
    setIsExpanded(prev => !prev);
  };

  // Helper when clicking Book Consultation primary button
  const handlePrimaryBookClick = async () => {
    // quick-save the booking with current time, then open the modal for further detail if desired
    await createQuickBooking();
    setInitialSlotId(null);
    setIsBookingModalOpen(true);
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row">
        <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
          <img 
            src={lawyer.imageUrl} 
            alt={lawyer.name} 
            className="w-32 h-32 rounded-full object-cover border-4 border-indigo-100" 
          />
        </div>
        
        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{lawyer.name}</h2>
              
              {lawyer.rating && (
                <div className="flex items-center mt-1">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-5 h-5 ${i < Math.floor(lawyer.rating || 0) ? 'fill-current' : ''}`} 
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-gray-600 text-sm">
                    {lawyer.rating.toFixed(1)}
                  </span>
                </div>
              )}
              
              {lawyer.vicinity && (
                <div className="flex items-center mt-2 text-gray-600">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="text-sm">{lawyer.vicinity}</span>
                </div>
              )}
            </div>
            
            <div className="mt-3 md:mt-0">
              {lawyer.isProBono && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                  Pro Bono Available
                </span>
              )}
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex items-start">
              <Briefcase className="w-5 h-5 text-indigo-500 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-gray-900">Experience</h4>
                <p className="text-gray-600">{lawyer.experience}</p>
              </div>
            </div>
            
            {lawyer.qualifications.length > 0 && (
              <div className="mt-4">
                <div className="flex items-start">
                  <Award className="w-5 h-5 text-indigo-500 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-gray-900">Qualifications</h4>
                    <ul className="list-none space-y-1 mt-1">
                      {lawyer.qualifications.map((q, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-indigo-500 mr-2">•</span>
                          <span className="text-gray-600">{q}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-6 flex flex-wrap gap-3">
            <button 
              onClick={handlePrimaryBookClick}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
            >
              Book Consultation
            </button>
            <button
              onClick={handleViewProfile}
              aria-expanded={isExpanded}
              aria-controls={`profile-${lawyer.name.replace(/\s+/g, '-')}`}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              {isExpanded ? 'Close Profile' : 'View Profile'}
            </button>
            {lawyer.isProBono && (
              <button className="px-4 py-2 text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors text-sm font-medium">
                Request Pro Bono
              </button>
            )}
          </div>

          {/* Quick slots preview if available */}
          {availableSlots && availableSlots.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium text-gray-900 mb-2">Available slots</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {availableSlots.slice(0, 8).map((s: any) => (
                  <div key={s.id} className={`p-2 border rounded ${s.status !== 'available' ? 'opacity-60 bg-gray-50' : 'bg-white'}`}>
                    <div className="text-sm font-medium">{s.date}</div>
                    <div className="text-sm text-gray-600">{s.time}</div>
                    <div className="mt-2">
                      <button disabled={s.status !== 'available'} onClick={() => { setInitialSlotId(s.id); setIsBookingModalOpen(true); }} className={`px-2 py-1 text-sm rounded ${s.status === 'available' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'}`}>{s.status === 'available' ? 'Book' : 'Booked'}</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {isExpanded && (
        <div id={`profile-${lawyer.name.replace(/\s+/g, '-')}`} className="mt-4 bg-gray-50 border border-gray-100 p-4 rounded">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h4 className="font-medium text-gray-900">Details</h4>
              <dl className="mt-2 text-sm text-gray-700">
                <div className="flex justify-between">
                  <dt className="text-gray-600">Gender</dt>
                  <dd>{lawyer.gender || '—'}</dd>
                </div>
                <div className="flex justify-between mt-1">
                  <dt className="text-gray-600">Years experience</dt>
                  <dd>{lawyer.yearsExperience ?? '—'}</dd>
                </div>
                <div className="flex justify-between mt-1">
                  <dt className="text-gray-600">Languages</dt>
                  <dd>{(lawyer.languages || []).join(', ') || '—'}</dd>
                </div>
                <div className="flex justify-between mt-1">
                  <dt className="text-gray-600">Specialties</dt>
                  <dd>{(lawyer.caseTypes || []).join(', ') || '—'}</dd>
                </div>
              </dl>
            </div>

            <div>
              <h4 className="font-medium text-gray-900">Contact</h4>
              <div className="mt-2 text-sm text-gray-700 space-y-2">
                {lawyer.contact?.email && (
                  <div className="flex items-center text-sm"><Mail className="w-4 h-4 mr-2 text-gray-500" /> <a href={`mailto:${lawyer.contact.email}`} className="text-indigo-600">{lawyer.contact.email}</a></div>
                )}
                {lawyer.contact?.phone && (
                  <div className="flex items-center text-sm"><Phone className="w-4 h-4 mr-2 text-gray-500" /> <a href={`tel:${lawyer.contact.phone}`} className="text-indigo-600">{lawyer.contact.phone}</a></div>
                )}
                {lawyer.vicinity && <div className="text-sm text-gray-700">{lawyer.vicinity}</div>}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900">Previous cases</h4>
              <ul className="mt-2 space-y-2 text-sm text-gray-700">
                {lawyer.previousCases && lawyer.previousCases.length > 0 ? (
                  lawyer.previousCases.map((pc, i) => (
                    <li key={i} className="border-l-4 border-gray-200 pl-3">
                      <div className="font-medium">{pc.title} <span className="text-gray-500 text-xs">({pc.year})</span></div>
                      <div className="text-gray-600 text-sm mt-1">{pc.outcome ? `${pc.outcome} — ` : ''}{pc.description}</div>
                    </li>
                  ))
                ) : (
                  <li className="text-gray-500">No previous cases listed.</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}

      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        lawyerName={lawyer.name}
        availableSlots={availableSlots}
        initialSlotId={initialSlotId}
        onBookSlot={async (date, time, clientName, clientEmail, slotId) => {
          // include slotId to backend to mark as booked
          try {
            setBookingStatus('loading');
            const payload: any = { lawyerId: (lawyer as any).id, clientName, clientEmail, date, time };
            if (slotId) payload.slotId = slotId;
            const res = await fetch('http://localhost:5000/api/bookings', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload),
            });
            if (!res.ok) {
              const t = await res.text();
              throw new Error(t || 'Booking failed');
            }
            setBookingStatus('success');
          } catch (err) {
            console.error('Booking error:', err);
            setBookingStatus('error');
            throw err;
          }
        }}
      />
      
      {/* Status messages */}
      {bookingStatus === 'success' && (
        <div className="fixed bottom-4 right-4 bg-green-100 border-l-4 border-green-500 p-4 rounded shadow-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">
                Booking initiated! Please complete the process in Google Calendar.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {bookingStatus === 'error' && (
        <div className="fixed bottom-4 right-4 bg-red-100 border-l-4 border-red-500 p-4 rounded shadow-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                Unable to open booking calendar. Please ensure popups are enabled and try again.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LawyerProfile;
