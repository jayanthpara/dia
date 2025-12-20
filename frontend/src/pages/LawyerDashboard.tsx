import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Bell, User, Edit, LogOut, AlertCircle } from 'lucide-react';

interface LawyerInfo {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  yearsExperience: number;
  caseTypes: string[];
  languages: string[];
  isProBono: boolean;
  bio: string;
  registeredAt: string;
}

interface Appointment {
  id: string;
  lawyerId: string;
  clientName: string;
  clientEmail: string;
  date: string;
  time: string;
  caseType: string;
  status: string;
  notes?: string;
  bookedAt: string;
}

interface Notification {
  id: string;
  type: string;
  message: string;
  read: boolean;
  createdAt: string;
  relatedId?: string;
}

const LawyerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [lawyer, setLawyer] = useState<LawyerInfo | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'appointments' | 'notifications' | 'profile'>('appointments');
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    const lawyerInfo = sessionStorage.getItem('lawyerInfo');
    if (!lawyerInfo) {
      navigate('/lawyer-login');
      return;
    }
    
    const parsedLawyer = JSON.parse(lawyerInfo);
    setLawyer(parsedLawyer);
    
    fetchDashboardData(parsedLawyer.email);
    
    // Set up auto-refresh every 5 seconds
    const interval = setInterval(() => {
      if (autoRefresh) {
        fetchDashboardData(parsedLawyer.email);
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [autoRefresh, navigate]);

  const fetchDashboardData = async (lawyerEmail: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch appointments for this lawyer
      const appointmentsRes = await fetch(`http://localhost:5000/api/appointments?lawyerEmail=${lawyerEmail}`);
      const appointmentsData = appointmentsRes.ok ? await appointmentsRes.json() : [];
      setAppointments(appointmentsData.appointments || appointmentsData || []);
      
      // Fetch notifications for this lawyer
      const notificationsRes = await fetch(`http://localhost:5000/api/notifications?lawyerEmail=${lawyerEmail}`);
      const notificationsData = notificationsRes.ok ? await notificationsRes.json() : [];
      setNotifications(Array.isArray(notificationsData) ? notificationsData : notificationsData.notifications || []);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('lawyerInfo');
    navigate('/lawyer-login');
  };

  const markNotificationAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/notifications/${notificationId}/read`, {
        method: 'PATCH'
      });
      
      if (response.ok) {
        setNotifications(prev => 
          prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
        );
      }
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const updateAppointmentStatus = async (appointmentId: string, newStatus: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/appointments/${appointmentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (response.ok) {
        setAppointments(prev =>
          prev.map(a => a.id === appointmentId ? { ...a, status: newStatus } : a)
        );
      }
    } catch (err) {
      console.error('Error updating appointment:', err);
    }
  };

  if (!lawyer) {
    return null;
  }

  const unreadNotifications = notifications.filter(n => !n.read).length;
  const upcomingAppointments = appointments.filter(a => a.status === 'confirmed' || a.status === 'pending');
  const completedAppointments = appointments.filter(a => a.status === 'completed');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Lawyer Dashboard</h1>
            <p className="text-gray-600 text-sm mt-1">Welcome, {lawyer.name}</p>
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded hover:bg-gray-200 transition cursor-pointer">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm">Auto Refresh</span>
            </label>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Upcoming Appointments</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{upcomingAppointments.length}</p>
              </div>
              <Calendar className="w-12 h-12 text-blue-200" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Unread Notifications</p>
                <p className="text-3xl font-bold text-orange-600 mt-2">{unreadNotifications}</p>
              </div>
              <Bell className="w-12 h-12 text-orange-200" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Completed Cases</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{completedAppointments.length}</p>
              </div>
              <User className="w-12 h-12 text-green-200" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-0 mb-6 border-b border-gray-200">
          {(['appointments', 'notifications', 'profile'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-medium capitalize transition border-b-2 ${
                activeTab === tab
                  ? 'text-blue-600 border-blue-600'
                  : 'text-gray-600 border-transparent hover:text-gray-900'
              }`}
            >
              {tab === 'appointments' && '📅 Appointments'}
              {tab === 'notifications' && '🔔 Notifications'}
              {tab === 'profile' && '👤 Profile'}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'appointments' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">My Appointments</h2>
            {loading ? (
              <p className="text-gray-600 text-center py-8">Loading appointments...</p>
            ) : appointments.length === 0 ? (
              <p className="text-gray-600 text-center py-8">No appointments yet</p>
            ) : (
              <div className="space-y-4">
                {appointments.map(appointment => (
                  <div
                    key={appointment.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900">{appointment.clientName}</h3>
                        <p className="text-sm text-gray-600">{appointment.clientEmail}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        appointment.status === 'confirmed'
                          ? 'bg-green-100 text-green-700'
                          : appointment.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : appointment.status === 'completed'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {appointment.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-gray-500">Date & Time</p>
                        <p className="font-medium text-gray-900">
                          {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Case Type</p>
                        <p className="font-medium text-gray-900 capitalize">{appointment.caseType}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Booked On</p>
                        <p className="font-medium text-gray-900">
                          {new Date(appointment.bookedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {appointment.notes && (
                      <div className="mb-3 p-3 bg-blue-50 rounded">
                        <p className="text-xs text-gray-600 font-medium">Notes:</p>
                        <p className="text-sm text-gray-700">{appointment.notes}</p>
                      </div>
                    )}

                    <div className="flex gap-2 pt-3 border-t border-gray-200">
                      {appointment.status === 'pending' && (
                        <>
                          <button
                            onClick={() => updateAppointmentStatus(appointment.id, 'confirmed')}
                            className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition text-sm font-medium"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                            className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition text-sm font-medium"
                          >
                            Decline
                          </button>
                        </>
                      )}
                      {appointment.status === 'confirmed' && (
                        <button
                          onClick={() => updateAppointmentStatus(appointment.id, 'completed')}
                          className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition text-sm font-medium"
                        >
                          Mark as Completed
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Notifications</h2>
            {loading ? (
              <p className="text-gray-600 text-center py-8">Loading notifications...</p>
            ) : notifications.length === 0 ? (
              <p className="text-gray-600 text-center py-8">No notifications</p>
            ) : (
              <div className="space-y-3">
                {notifications.map(notification => (
                  <div
                    key={notification.id}
                    onClick={() => {
                      if (!notification.read) {
                        markNotificationAsRead(notification.id);
                      }
                    }}
                    className={`p-4 rounded-lg border transition cursor-pointer ${
                      notification.read
                        ? 'bg-gray-50 border-gray-200'
                        : 'bg-blue-50 border-blue-300 hover:shadow-md'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            notification.type === 'appointment'
                              ? 'bg-blue-100 text-blue-700'
                              : notification.type === 'booking'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-purple-100 text-purple-700'
                          }`}>
                            {notification.type.toUpperCase()}
                          </span>
                          {!notification.read && (
                            <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                          )}
                        </div>
                        <p className="text-gray-900 font-medium">{notification.message}</p>
                        <p className="text-xs text-gray-600 mt-1">
                          {new Date(notification.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">My Profile</h2>
              <button
                onClick={() => navigate('/lawyer-profile-edit')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
              >
                <Edit className="w-4 h-4" />
                Edit Profile
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Info */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Basic Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Full Name</p>
                    <p className="font-medium text-gray-900">{lawyer.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium text-gray-900">{lawyer.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium text-gray-900">{lawyer.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-medium text-gray-900">{lawyer.location}</p>
                  </div>
                </div>
              </div>

              {/* Professional Info */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Professional Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Years of Experience</p>
                    <p className="font-medium text-gray-900">{lawyer.yearsExperience} years</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Pro Bono Services</p>
                    <p className={`font-medium ${lawyer.isProBono ? 'text-green-600' : 'text-gray-900'}`}>
                      {lawyer.isProBono ? 'Yes' : 'No'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Registered On</p>
                    <p className="font-medium text-gray-900">
                      {new Date(lawyer.registeredAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Case Types */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Case Types</h3>
                <div className="flex flex-wrap gap-2">
                  {lawyer.caseTypes.length > 0 ? (
                    lawyer.caseTypes.map(type => (
                      <span
                        key={type}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium capitalize"
                      >
                        {type}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-600">No case types specified</p>
                  )}
                </div>
              </div>

              {/* Languages */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Languages</h3>
                <div className="flex flex-wrap gap-2">
                  {lawyer.languages.length > 0 ? (
                    lawyer.languages.map(lang => (
                      <span
                        key={lang}
                        className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium"
                      >
                        {lang}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-600">No languages specified</p>
                  )}
                </div>
              </div>

              {/* Bio */}
              {lawyer.bio && (
                <div className="md:col-span-2">
                  <h3 className="font-semibold text-gray-900 mb-2">Bio</h3>
                  <p className="text-gray-700 leading-relaxed">{lawyer.bio}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default LawyerDashboard;