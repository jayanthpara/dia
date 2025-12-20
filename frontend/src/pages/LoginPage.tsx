import React from 'react';
import { Navigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  // Login page removed — redirect to home
  return <Navigate to="/" replace />;
};

export default LoginPage;