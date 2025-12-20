import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Scale, Home, HeartPulse, Shield, Users, FileText, Phone, Info, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const lawyerInfo = sessionStorage.getItem('lawyerInfo');
  const isLawyerLoggedIn = !!lawyerInfo;

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const handleLawyerLogout = () => {
    sessionStorage.removeItem('lawyerInfo');
    navigate('/');
  };

  const navItems = [
    { name: 'Home', path: '/', icon: <Home className="w-4 h-4 mr-2" /> },
    { 
      name: 'Legal', 
      subItems: [
        { name: 'Legal Services', path: '/legal-services', icon: <FileText className="w-4 h-4 mr-2" /> },
        { name: 'Legal Support', path: '/legal-support', icon: <Shield className="w-4 h-4 mr-2" /> },
        { name: 'Lawyers', path: '/lawyers', icon: <Users className="w-4 h-4 mr-2" /> },
        { name: 'Forms', path: '/forms', icon: <FileText className="w-4 h-4 mr-2" /> },
      ]
    },
    { name: 'Mental Health', path: '/mental-health', icon: <HeartPulse className="w-4 h-4 mr-2" /> },
    { name: 'SOS', path: '/sos', icon: <Phone className="w-4 h-4 mr-2" /> },
    { name: 'Resources', path: '/community', icon: <FileText className="w-4 h-4 mr-2" /> },
    { name: 'About', path: '/about', icon: <Info className="w-4 h-4 mr-2" /> },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Scale className="w-8 h-8 text-teal-600" />
            <span className="text-xl font-bold text-gray-900">DIA</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => (
              <div key={item.name} className="relative group">
                {item.subItems ? (
                  <>
                    <button className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-teal-600 transition-colors">
                      {item.icon}
                      {item.name}
                      <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <div className="absolute left-0 mt-1 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <div className="py-1">
                        {item.subItems.map((subItem) => (
                          <Link
                            key={subItem.path}
                            to={subItem.path}
                            className={`flex items-center px-4 py-2 text-sm ${
                              isActive(subItem.path)
                                ? 'bg-teal-50 text-teal-700'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            {subItem.icon}
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <Link
                    to={item.path}
                    className={`flex items-center px-3 py-2 text-sm font-medium transition-colors ${
                      isActive(item.path)
                        ? 'text-teal-600 border-b-2 border-teal-600'
                        : 'text-gray-700 hover:text-teal-600'
                    }`}
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
            <Link
              to="/sos"
              className="ml-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
            >
              <Phone className="w-4 h-4 mr-1" />
              Emergency
            </Link>
            {isLawyerLoggedIn ? (
              <>
                <Link
                  to="/lawyer-dashboard"
                  className="ml-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  My Dashboard
                </Link>
                <button
                  onClick={handleLawyerLogout}
                  className="ml-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Lawyer Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/lawyer-register"
                  className="ml-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Register as Lawyer
                </Link>
                <Link
                  to="/lawyer-login"
                  className="ml-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Lawyer Login
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-teal-600"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <div className="md:hidden py-2 border-t border-gray-200">
              <div className="space-y-1">
                {navItems.map((item) => (
                  <div key={item.name}>
                    {item.subItems ? (
                      <div className="space-y-1">
                            {item.subItems.map((subItem) => (
                              <Link
                                key={subItem.path}
                                to={subItem.path}
                                onClick={() => setIsOpen(false)}
                                className={`flex items-center px-4 py-3 text-sm font-medium ${
                                  isActive(subItem.path)
                                    ? 'bg-teal-50 text-teal-700'
                                    : 'text-gray-700 hover:bg-gray-50'
                                }`}
                              >
                                {subItem.icon}
                                {subItem.name}
                              </Link>
                            ))}
                          </div>
                    ) : (
                      <Link
                        to={item.path}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center px-4 py-3 text-sm font-medium ${
                          isActive(item.path)
                            ? 'bg-teal-50 text-teal-700'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {item.icon}
                        {item.name}
                      </Link>
                    )}
                  </div>
                ))}
                {/* Auth buttons */}
                <div className="mx-3 mt-3 flex flex-col gap-2">
                  {currentUser ? (
                    <div>
                      <div className="text-gray-700 flex items-center mb-2">
                        <User className="w-5 h-5 mr-2" />
                        <span>{currentUser.role === 'advocate' ? 'Advocate' : 'User'}</span>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </button>
                    </div>
                  ) : null}
                  {isLawyerLoggedIn ? (
                    <>
                      <Link
                        to="/lawyer-dashboard"
                        onClick={() => setIsOpen(false)}
                        className="w-full text-center bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        My Dashboard
                      </Link>
                      <button
                        onClick={() => {
                          handleLawyerLogout();
                          setIsOpen(false);
                        }}
                        className="w-full text-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        Lawyer Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/lawyer-register"
                        onClick={() => setIsOpen(false)}
                        className="w-full text-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        Register as Lawyer
                      </Link>
                      <Link
                        to="/lawyer-login"
                        onClick={() => setIsOpen(false)}
                        className="w-full text-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        Lawyer Login
                      </Link>
                    </>
                  )}
                </div>
                <Link
                  to="/sos"
                  onClick={() => setIsOpen(false)}
                  className="mx-3 mt-3 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium text-center transition-colors flex items-center justify-center"
                >
                  <Phone className="w-4 h-4 mr-1" />
                  Emergency Help
                </Link>
              </div>
            </div>
          )}
      </div>
    </nav>
  );
};

export default Navbar;