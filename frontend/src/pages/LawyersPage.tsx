import React, { useEffect, useState } from 'react';
import { MapPin, Search } from 'lucide-react';
import LawyerProfile from '../components/LawyerProfile';
import { apiClient } from '../utils/apiClient';

interface Lawyer {
  id?: string;
  _id?: string;
  name: string;
  experience: string;
  qualifications: string[];
  imageUrl: string;
  vicinity?: string;
  rating?: number;
  isProBono?: boolean;
  caseTypes?: string[];
  languages?: string[];
  gender?: string;
  yearsExperience?: number;
  location?: string;
}

/* =======================
   LAWYERS PAGE
======================= */
const LawyersPage: React.FC = () => {
  const [type, setType] = useState<string[]>([]);
  const [language, setLanguage] = useState<string[]>([]);
  const [gender, setGender] = useState<string>('any');
  const [minExperience, setMinExperience] = useState<number | ''>('');

  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* =======================
     MAP BACKEND → UI
  ======================= */
  const mapBackendLawyer = (l: any): Lawyer => ({
    id: l._id || l.id,
    name: l.name,
    experience: `${l.yearsExperience || 0} years experience`,
    qualifications:
      l.caseTypes?.length > 0
        ? l.caseTypes.map((c: string) => `${c} law`)
        : ['Licensed Advocate'],
    imageUrl: `https://via.placeholder.com/150/4F46E5/FFFFFF?text=${encodeURIComponent(
      l.name?.charAt(0) || 'L'
    )}`,
    vicinity: l.location || '',
    isProBono: l.isProBono ?? false,
    caseTypes: l.caseTypes || [],
    languages: l.languages || [],
    gender: l.gender || '',
    yearsExperience: l.yearsExperience || 0,
    location: l.location || ''
  });

  const AVAILABLE_TYPES = ['criminal', 'civil', 'family', 'corporate', 'cyber'];
  const AVAILABLE_LANGUAGES = ['English', 'Urdu', 'Hindi', 'Telugu'];

  const toggleType = (t: string) =>
    setType(prev => (prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]));

  const toggleLanguage = (l: string) =>
    setLanguage(prev => (prev.includes(l) ? prev.filter(x => x !== l) : [...prev, l]));

  /* =======================
     FETCH LAWYERS (MONGO)
  ======================= */
  const fetchFilteredLawyers = async (filters: {
    type?: string[];
    language?: string[];
    gender?: string;
    minExperience?: number | '';
  } = {}) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (filters.type?.length) params.append('type', filters.type.join(','));
      if (filters.language?.length) params.append('language', filters.language.join(','));
      if (filters.gender && filters.gender !== 'any') params.append('gender', filters.gender);
      if (filters.minExperience !== '' && filters.minExperience !== undefined)
        params.append('minExperience', String(filters.minExperience));

      // ✅ CORRECT API
      const url = `/api/lawyers${params.toString() ? `?${params.toString()}` : ''}`;
      const data = await apiClient.get(url);

      const list = Array.isArray(data) ? data : data.lawyers || [];
      setLawyers(list.map(mapBackendLawyer));
    } catch (err) {
      console.error(err);
      setError('Failed to load lawyers. Please try again.');
      setLawyers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilteredLawyers();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchFilteredLawyers({ type, language, gender, minExperience });
  };

  const clearFilters = () => {
    setType([]);
    setLanguage([]);
    setGender('any');
    setMinExperience('');
    fetchFilteredLawyers();
  };

  const filtersApplied = () =>
    type.length > 0 || language.length > 0 || gender !== 'any' || minExperience !== '';

  /* =======================
     RENDER
  ======================= */
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-2">Find Lawyers</h1>
      <p className="text-gray-600 mb-6">
        Browse registered lawyers and book appointments as a guest.
      </p>

      {/* FILTERS */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div>
          <span className="text-sm font-medium">Case Type</span>
          <div className="mt-2 flex flex-wrap gap-2">
            {AVAILABLE_TYPES.map(t => (
              <button
                type="button"
                key={t}
                onClick={() => toggleType(t)}
                className={`px-3 py-1 rounded border ${type.includes(t)
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700'
                  }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div>
          <span className="text-sm font-medium">Language</span>
          <div className="mt-2 flex flex-wrap gap-2">
            {AVAILABLE_LANGUAGES.map(l => (
              <button
                type="button"
                key={l}
                onClick={() => toggleLanguage(l)}
                className={`px-3 py-1 rounded border ${language.includes(l)
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700'
                  }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Gender</label>
          <select
            value={gender}
            onChange={e => setGender(e.target.value)}
            className="mt-1 w-full border rounded p-2"
          >
            <option value="any">Any</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium">Min Experience</label>
          <input
            type="number"
            min={0}
            value={minExperience}
            onChange={e =>
              setMinExperience(e.target.value === '' ? '' : Number(e.target.value))
            }
            className="mt-1 w-full border rounded p-2"
            placeholder="e.g. 5"
          />
        </div>

        <div className="col-span-full flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 text-white rounded"
          >
            Search
          </button>
          <button
            type="button"
            onClick={clearFilters}
            className="px-4 py-2 border rounded"
          >
            Clear
          </button>
        </div>
      </form>

      {/* RESULTS */}
      {loading && <p>Loading lawyers...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && lawyers.length === 0 && !error && (
        <div className="text-center py-12 bg-gray-50 rounded">
          <Search className="mx-auto h-10 w-10 text-gray-400" />
          <p className="mt-2 text-gray-600">
            {filtersApplied() ? 'No lawyers match your filters.' : 'No lawyers found.'}
          </p>
        </div>
      )}

      <div className="space-y-6">
        {lawyers.map((lawyer, idx) => (
          <div key={idx} className="bg-white rounded shadow border">
            <LawyerProfile lawyer={lawyer} />
            {lawyer.isProBono && (
              <div className="bg-green-50 px-4 py-2 text-sm text-green-700">
                Pro Bono Available
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LawyersPage;
