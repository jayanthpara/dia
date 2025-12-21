import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../utils/apiClient';

const AdminPanel: React.FC = () => {
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    // If no password entered, allow open admin access locally
    if (!password) {
      sessionStorage.setItem('adminPassword', '');
      // Redirect to admin dashboard
      navigate('/admin/dashboard');
      return;
    }

    try {
      await apiClient.post('/api/admin/login', { password });
      sessionStorage.setItem('adminPassword', password);
      navigate('/admin/dashboard');
    } catch (err) {
      setAuthError('Failed to login');
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Admin Login</h1>

      <form onSubmit={handleLogin} className="max-w-md">
        <label className="block text-sm font-medium text-gray-700">Admin password</label>
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="mt-2 p-2 border rounded w-full" />
        {authError && <p className="text-red-600 mt-2">{authError}</p>}
        <div className="mt-4">
          <button className="px-4 py-2 bg-indigo-600 text-white rounded">Login</button>
          <button onClick={() => { sessionStorage.setItem('adminPassword', ''); navigate('/admin/dashboard'); }} type="button" className="ml-3 px-4 py-2 border rounded">Open (no password)</button>
        </div>
      </form>
    </div>
  );
};

export default AdminPanel;
