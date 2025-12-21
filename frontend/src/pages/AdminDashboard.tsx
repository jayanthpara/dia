import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Key } from 'lucide-react';
import { apiClient } from '../utils/apiClient';

interface Booking {
  id: string;
  lawyerId: string;
  lawyerName: string;
  clientName: string;
  clientEmail: string;
  date: string;
  time: string;
  amount: number;
  charged?: boolean;
  createdAt?: string;
  chargedAt?: string;
}

interface Notification {
  id: string;
  bookingId: string;
  message: string;
  read: boolean;
  createdAt: string;
}

interface Appointment {
  slotId: string;
  lawyerId: string;
  lawyerName: string;
  date: string;
  time: string;
  status: string;
  bookedBy?: { clientName?: string; clientEmail?: string } | null;
}

interface RegisteredLawyer {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  yearsExperience: number;
  caseTypes: string[];
  languages: string[];
  isProBono: boolean;
  registeredAt: string;
}

const AdminDashboard: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [registeredLawyers, setRegisteredLawyers] = useState<RegisteredLawyer[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    const pwd = sessionStorage.getItem('adminPassword');
    if (!pwd && pwd !== '') {
      navigate('/admin');
      return;
    }
    fetchData();
    
    // Set up auto-refresh every 5 seconds for real-time updates
    const interval = setInterval(() => {
      if (autoRefresh) {
        fetchData();
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [bkData, noteData, apptData, lawyersData] = await Promise.all([
        apiClient.get('/api/bookings').catch(() => []),
        apiClient.get('/api/notifications').catch(() => []),
        apiClient.get('/api/appointments').catch(() => []),
        apiClient.get('/api/admin/credentials').catch(() => ({})),
      ]);
      
      setBookings(Array.isArray(bkData) ? bkData : []);
      setNotifications(Array.isArray(noteData) ? noteData : []);
      setAppointments(Array.isArray(apptData) ? apptData : []);
      setRegisteredLawyers((lawyersData as any).credentials || []);
    } catch (err) {
      console.error('fetchData error', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminPassword');
    navigate('/admin');
  };

  const markCharged = async (bookingId: string) => {
    const pwd = sessionStorage.getItem('adminPassword') || '';
    try {
      const updated = await apiClient.patch(`/api/bookings/${bookingId}/charge`, {}, { 'x-admin-password': pwd });
      setBookings(prev => prev.map(b => b.id === (updated as any).id ? (updated as Booking) : b));
      await fetchData();
    } catch (err) {
      console.error('markCharged error', err);
    }
  };

  const markNotificationRead = async (id: string) => {
    const pwd = sessionStorage.getItem('adminPassword') || '';
    try {
      const updated = await apiClient.patch(`/api/notifications/${id}/read`, {}, { 'x-admin-password': pwd });
      setNotifications(prev => prev.map(n => n.id === (updated as any).id ? (updated as Notification) : n));
    } catch (err) {
      console.error('markNotificationRead error', err);
    }
  };

  const bookSlot = async (slotId: string) => {
    const pwd = sessionStorage.getItem('adminPassword') || '';
    const slot = appointments.find(a => a.slotId === slotId);
    if (!slot) return alert('Slot not found');

    const clientName = window.prompt('Client name') || '';
    const clientEmail = window.prompt('Client email') || '';
    if (!clientName || !clientEmail) return alert('Client name and email required');

    try {
      const payload = { lawyerId: slot.lawyerId, date: slot.date, time: slot.time, clientName, clientEmail, slotId };
      await apiClient.post('/api/bookings', payload, { 'x-admin-password': pwd });
      await fetchData();
      alert('Slot booked successfully');
    } catch (err: any) {
      alert('Booking failed: ' + (err.message || err));
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="flex gap-3">
          <label className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded hover:bg-gray-200 transition cursor-pointer">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm">Auto Refresh</span>
          </label>
          <Link
            to="/admin/credentials"
            className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
          >
            <Key className="w-4 h-4" />
            Credentials
          </Link>
          <button onClick={handleLogout} className="px-3 py-1 border rounded">Logout</button>
        </div>
      </div>

      {/* Registered Lawyers Section */}
      <div className="bg-white p-6 rounded border mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Registered Lawyers ({registeredLawyers.length})</h2>
          <button
            onClick={() => {
              fetchData();
            }}
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm"
          >
            Refresh
          </button>
        </div>
        {loading && registeredLawyers.length === 0 ? (
          <p className="text-gray-500">Loading registered lawyers...</p>
        ) : registeredLawyers.length === 0 ? (
          <p className="text-gray-500">No registered lawyers yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-3 font-semibold">Name</th>
                  <th className="text-left p-3 font-semibold">Email</th>
                  <th className="text-left p-3 font-semibold">Phone</th>
                  <th className="text-left p-3 font-semibold">Location</th>
                  <th className="text-left p-3 font-semibold">Experience</th>
                  <th className="text-left p-3 font-semibold">Specializations</th>
                  <th className="text-left p-3 font-semibold">Pro Bono</th>
                  <th className="text-left p-3 font-semibold">Registered</th>
                </tr>
              </thead>
              <tbody>
                {registeredLawyers.map((lawyer) => (
                  <tr key={lawyer.id} className="border-t hover:bg-gray-50">
                    <td className="p-3">{lawyer.name}</td>
                    <td className="p-3 text-blue-600">{lawyer.email}</td>
                    <td className="p-3">{lawyer.phone}</td>
                    <td className="p-3">{lawyer.location}</td>
                    <td className="p-3">{lawyer.yearsExperience} years</td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        {lawyer.caseTypes.map((type) => (
                          <span key={type} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                            {type}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-3">
                      {lawyer.isProBono ? (
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold">Yes</span>
                      ) : (
                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">No</span>
                      )}
                    </td>
                    <td className="p-3 text-xs text-gray-600">
                      {new Date(lawyer.registeredAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-4 rounded border">
          <h2 className="font-semibold mb-2">Notifications</h2>
          {notifications.length === 0 ? <p className="text-gray-500">No notifications</p> : (
            <ul className="space-y-2">
              {notifications.map(n => (
                <li key={n.id} className={`p-2 border rounded ${n.read ? 'bg-gray-50' : 'bg-white'}`}>
                  <div className="flex justify-between items-start">
                    <div>{n.message}</div>
                    <div className="text-xs text-gray-500">{new Date(n.createdAt).toLocaleString()}</div>
                  </div>
                  {!n.read && <button onClick={() => markNotificationRead(n.id)} className="mt-2 text-sm text-indigo-600">Mark as read</button>}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white p-4 rounded border md:col-span-2">
          <h2 className="font-semibold mb-2">Upcoming Appointments (slots)</h2>
          {loading ? <p>Loading...</p> : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr>
                    <th className="text-left p-2">Slot ID</th>
                    <th className="text-left p-2">Lawyer</th>
                    <th className="text-left p-2">Date</th>
                    <th className="text-left p-2">Time</th>
                    <th className="text-left p-2">Status</th>
                    <th className="text-left p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map(a => (
                    <tr key={a.slotId} className="border-t">
                      <td className="p-2">{a.slotId}</td>
                      <td className="p-2">{a.lawyerName}</td>
                      <td className="p-2">{a.date}</td>
                      <td className="p-2">{a.time}</td>
                      <td className="p-2">{a.status}</td>
                      <td className="p-2">
                        <button onClick={() => alert(JSON.stringify(a, null, 2))} className="px-3 py-1 border rounded mr-2">View</button>
                        {a.status === 'available' && <button onClick={() => bookSlot(a.slotId)} className="px-3 py-1 bg-indigo-600 text-white rounded">Book</button>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Bookings</h2>
        {bookings.length === 0 ? <p className="text-gray-500">No bookings yet</p> : (
          <div className="overflow-x-auto bg-white p-2 rounded border">
            <table className="min-w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left p-2">ID</th>
                  <th className="text-left p-2">Lawyer</th>
                  <th className="text-left p-2">Client</th>
                  <th className="text-left p-2">Date / Time</th>
                  <th className="text-left p-2">Amount</th>
                  <th className="text-left p-2">Charged</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(b => (
                  <tr key={b.id} className="border-t">
                    <td className="p-2">{b.id}</td>
                    <td className="p-2">{b.lawyerName}</td>
                    <td className="p-2">{b.clientName} <div className="text-xs text-gray-500">{b.clientEmail}</div></td>
                    <td className="p-2">{b.date} {b.time}</td>
                    <td className="p-2">{b.amount}</td>
                    <td className="p-2">{b.charged ? 'Yes' : 'No'}</td>
                    <td className="p-2">
                      {!b.charged && <button onClick={() => markCharged(b.id)} className="px-3 py-1 bg-green-600 text-white rounded">Mark Charged</button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;