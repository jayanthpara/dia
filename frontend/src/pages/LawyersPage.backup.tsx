import React, { useState } from 'react';
import { MapPin, Search } from 'lucide-react';
import LawyerProfile from '../components/LawyerProfile';

interface Lawyer {
  name: string;
  experience: string;
  qualifications: string[];
  imageUrl: string;
  vicinity?: string;
  rating?: number;
  isProBono?: boolean;
}

// Fallback data in case API is not available
const fallbackLawyers: Lawyer[] = [
  {
    name: 'Adv. Gauri Verma',
    experience: '15 years in corporate law',
    qualifications: ['Juris Doctor (J.D.)', 'Member of the Bar Association', 'Certified Mediator'],
    imageUrl: 'https://via.placeholder.com/150/0000FF/FFFFFF?text=Gauri',
    vicinity: 'Banjara Hills, Hyderabad',
    rating: 4.8,
    isProBono: true
  },
  {
    name: 'Adv. Sameera Kasulanati',
    experience: '10 years in family law',
    qualifications: ['Master of Laws (LL.M.)', 'Certified Family Law Specialist'],
    imageUrl: 'https://via.placeholder.com/150/FF0000/FFFFFF?text=Sameera',
    vicinity: 'Jubilee Hills, Hyderabad',
    rating: 4.5,
    isProBono: false
  },
  {
    name: 'Adv. Varshini Ram',
    experience: '20 years in criminal defense',
    qualifications: ['Juris Doctor (J.D.)', 'Board Certified in Criminal Law'],
    imageUrl: 'https://via.placeholder.com/150/00FF00/FFFFFF?text=Varshini',
    vicinity: 'Gachibowli, Hyderabad',
    rating: 4.9,
    isProBono: true
  },
];

const LawyersPage: React.FC = () => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useFallback, setUseFallback] = useState(false);

  const getLocation = () => {
    setLoading(true);
    setError(null);
    
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lng: longitude });
        
        try {
          // Try to fetch real data first
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=lawyer+near+${latitude},${longitude}&limit=5`
          );
          
          if (!response.ok) throw new Error('Failed to fetch lawyers');
          
          const data = await response.json();
          
          if (data.length === 0) {
            setUseFallback(true);
            setLawyers(fallbackLawyers);
          } else {
            // Transform OSM data to match our lawyer interface
            const lawyersData = data.map((place: any) => ({
              name: place.display_name.split(',')[0] || 'Lawyer',
              experience: 'Experience varies',
              qualifications: ['Practicing Attorney'],
              imageUrl: `https://via.placeholder.com/150/4F46E5/FFFFFF?text=${encodeURIComponent(place.display_name[0] || 'L')}`,
              vicinity: place.display_name,
              isProBono: Math.random() > 0.5 // Randomly assign pro bono status for demo
            }));
            setLawyers(lawyersData);
          }
        } catch (err) {
          console.error('Error fetching lawyers:', err);
          setUseFallback(true);
          setLawyers(fallbackLawyers);
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error('Error getting location:', error);
        setError('Unable to retrieve your location. Please enable location services and try again.');
        setLoading(false);
        setUseFallback(true);
        setLawyers(fallbackLawyers);
      }
    );
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Find Lawyers Near You</h1>
          <p className="text-gray-600 mt-2">
            {location 
              ? `Searching near your location (${location.lat.toFixed(4)}, ${location.lng.toFixed(4)})`
              : 'Enable location to find lawyers in your area'}
          </p>
        </div>
        
        <button
          onClick={getLocation}
          disabled={loading}
          className={`mt-4 md:mt-0 flex items-center px-6 py-3 rounded-lg text-white font-medium ${loading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'} transition-colors`}
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Searching...
            </>
          ) : (
            <>
              <MapPin className="w-5 h-5 mr-2" />
              {location ? 'Refresh Location' : 'Find Lawyers Near Me'}
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                {error} {useFallback && 'Showing sample data instead.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {useFallback && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Using sample data. For real results, please enable location services.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {lawyers.length > 0 ? (
          lawyers.map((lawyer, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <LawyerProfile lawyer={lawyer} />
              {lawyer.isProBono && (
                <div className="bg-green-50 px-4 py-2 border-t border-gray-100">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Pro Bono Available
                  </span>
                </div>
              )}
            </div>
          ))
        ) : !loading && !error ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Search className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">Find lawyers near you</h3>
            <p className="mt-1 text-gray-500">Click the button above to search for lawyers in your area.</p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default LawyersPage;
