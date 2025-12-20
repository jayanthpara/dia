import React, { useState, useEffect } from 'react';
import { Search, Eye, Copy, Download, X } from 'lucide-react';
import { apiClient } from '../utils/apiClient';

interface Credential {
  id: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  caseTypes: string[];
  yearsExperience: number;
  location: string;
  registeredAt: string;
  isProBono: boolean;
}

const AdminCredentials: React.FC = () => {
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [filteredCredentials, setFilteredCredentials] = useState<Credential[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedCred, setSelectedCred] = useState<Credential | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  useEffect(() => {
    fetchCredentials();
  }, []);

  useEffect(() => {
    filterCredentials();
  }, [searchTerm, credentials]);

  const fetchCredentials = async () => {
    try {
      setLoading(true);
      const data = await apiClient.get('/api/admin/credentials');
      setCredentials(data.credentials || []);
    } catch (error) {
      console.error('Error fetching credentials:', error);
      alert('Failed to load credentials');
    } finally {
      setLoading(false);
    }
  };

  const filterCredentials = () => {
    if (!searchTerm.trim()) {
      setFilteredCredentials(credentials);
      return;
    }

    const filtered = credentials.filter(cred =>
      cred.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cred.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCredentials(filtered);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopyFeedback(`${label} copied!`);
    setTimeout(() => setCopyFeedback(null), 2000);
  };

  const downloadAsCSV = () => {
    if (credentials.length === 0) {
      alert('No credentials to download');
      return;
    }

    const headers = ['Name', 'Email', 'Password', 'Phone', 'Location', 'Years Experience', 'Registered At'];
    const rows = credentials.map(c => [
      c.name,
      c.email,
      c.password,
      c.phone,
      c.location,
      c.yearsExperience,
      new Date(c.registeredAt).toLocaleDateString()
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lawyer-credentials-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Lawyer Credentials</h1>
        <button
          onClick={downloadAsCSV}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Copy Feedback */}
      {copyFeedback && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {copyFeedback}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Loading credentials...</p>
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-gray-600">Total Lawyers</p>
              <p className="text-2xl font-bold text-blue-600">{credentials.length}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <p className="text-sm text-gray-600">Pro Bono Lawyers</p>
              <p className="text-2xl font-bold text-green-600">{credentials.filter(c => c.isProBono).length}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <p className="text-sm text-gray-600">Showing</p>
              <p className="text-2xl font-bold text-purple-600">{filteredCredentials.length}</p>
            </div>
          </div>

          {/* Credentials Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Password</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Phone</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Registered</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredCredentials.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      No credentials found
                    </td>
                  </tr>
                ) : (
                  filteredCredentials.map((cred) => (
                    <tr key={cred.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{cred.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{cred.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                            {'*'.repeat(Math.max(3, cred.password.length - 3))}
                          </span>
                          <button
                            onClick={() => copyToClipboard(cred.password, 'Password')}
                            className="text-blue-600 hover:text-blue-800 transition"
                            title="Copy password"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <button
                          onClick={() => copyToClipboard(cred.phone, 'Phone')}
                          className="text-blue-600 hover:text-blue-800 flex items-center gap-2 transition"
                          title="Copy phone"
                        >
                          {cred.phone}
                          <Copy className="w-3 h-3" />
                        </button>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(cred.registeredAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => {
                            setSelectedCred(cred);
                            setShowDetails(true);
                          }}
                          className="text-blue-600 hover:text-blue-800 transition"
                          title="View details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Details Modal */}
      {showDetails && selectedCred && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white">
              <h2 className="text-xl font-bold">{selectedCred.name} - Full Credentials</h2>
              <button
                onClick={() => setShowDetails(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-700">Full Name</label>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="text"
                    readOnly
                    value={selectedCred.name}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded bg-gray-50"
                  />
                  <button
                    onClick={() => copyToClipboard(selectedCred.name, 'Name')}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700">Email (Login)</label>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="text"
                    readOnly
                    value={selectedCred.email}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded bg-gray-50"
                  />
                  <button
                    onClick={() => copyToClipboard(selectedCred.email, 'Email')}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700">Password</label>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="text"
                    readOnly
                    value={selectedCred.password}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded bg-gray-50 font-mono"
                  />
                  <button
                    onClick={() => copyToClipboard(selectedCred.password, 'Password')}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700">Phone</label>
                  <input
                    type="text"
                    readOnly
                    value={selectedCred.phone}
                    className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50 text-sm mt-1"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700">Experience</label>
                  <input
                    type="text"
                    readOnly
                    value={`${selectedCred.yearsExperience} years`}
                    className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50 text-sm mt-1"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700">Location</label>
                <input
                  type="text"
                  readOnly
                  value={selectedCred.location}
                  className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50 text-sm mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700">Registered Date</label>
                <input
                  type="text"
                  readOnly
                  value={new Date(selectedCred.registeredAt).toLocaleString()}
                  className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50 text-sm mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700">Case Types</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedCred.caseTypes.map(type => (
                    <span key={type} className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t bg-gray-50 sticky bottom-0">
              <button
                onClick={() => setShowDetails(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCredentials;
