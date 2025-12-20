import React, { createContext, useContext, useState } from 'react';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'advocate';
}

interface AuthContextType {
  currentUser: UserData | null;
  loading: boolean;
  login: (email: string, role: 'user' | 'advocate') => void;
  loginWithPhone: (phone: string) => void;
  verifyOTP: (otp: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Dummy user data for testing
const dummyUsers: UserData[] = [
  {
    id: '1',
    name: 'Test User',
    email: 'user@example.com',
    role: 'user'
  },
  {
    id: '2',
    name: 'Test Advocate',
    email: 'advocate@example.com',
    role: 'advocate'
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(false);

  const login = (email: string, role: 'user' | 'advocate') => {
    setLoading(true);
    try {
      // Simulate API call
      setTimeout(() => {
        const user = dummyUsers.find(u => u.email === email) || {
          id: Math.random().toString(36).substr(2, 9),
          name: email.split('@')[0],
          email,
          role
        };
        setCurrentUser(user);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Login error:', error);
      setLoading(false);
    }
  };

  const loginWithPhone = (phone: string) => {
    setLoading(true);
    // Simulate OTP send
    setTimeout(() => {
      console.log(`OTP sent to ${phone}`);
      setLoading(false);
    }, 1000);
  };

  const verifyOTP = (otp: string) => {
    setLoading(true);
    // Simulate OTP verification
    setTimeout(() => {
      if (otp === '123456') {
        const user: UserData = {
          id: Math.random().toString(36).substr(2, 9),
          name: 'Phone User',
          email: 'phone@example.com',
          role: 'user'
        };
        setCurrentUser(user);
      }
      setLoading(false);
    }, 1000);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const value: AuthContextType = {
    currentUser,
    loading,
    login,
    loginWithPhone,
    verifyOTP,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};