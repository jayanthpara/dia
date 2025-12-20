import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import LegalSupport from './pages/LegalSupport';
import AffordableAssistance from './pages/AffordableAssistance';
import ExpertMatching from './pages/ExpertMatching';
import SecureAssistance from './pages/SecureAssistance';
import SOSPage from './pages/SOSPage';
import SafeZones from './pages/SafeZones';
import Community from './pages/Community';
import SOSButton from './components/SOSButton';
import AboutPage from './pages/AboutPage';
import LawyersPage from './pages/LawyersPage';
import LawyerRegisterPage from './pages/LawyerRegisterPage';
import LawyerLoginPage from './pages/LawyerLoginPage';
import LawyerDashboard from './pages/LawyerDashboard';
import EditLawyerProfile from './pages/EditLawyerProfile';
import AdminPanel from './pages/AdminPanel';
import AdminDashboard from './pages/AdminDashboard';
import AdminCredentials from './pages/AdminCredentials';
import LegalServicesPage from './pages/LegalServicesPage';
import FormsPage from './pages/FormsPage';
import MentalHealthPage from './pages/MentalHealthPage';
import AdvocateDashboard from './pages/AdvocateDashboard';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <div className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/legal-support" element={
                <ProtectedRoute>
                  <LegalSupport />
                </ProtectedRoute>
              } />
              <Route path="/affordable-assistance" element={
                <ProtectedRoute>
                  <AffordableAssistance />
                </ProtectedRoute>
              } />
              <Route path="/expert-matching" element={
                <ProtectedRoute>
                  <ExpertMatching />
                </ProtectedRoute>
              } />
              <Route path="/secure-assistance" element={
                <ProtectedRoute>
                  <SecureAssistance />
                </ProtectedRoute>
              } />
              <Route path="/sos" element={<SOSPage />} />
              <Route path="/safe-zones" element={<SafeZones />} />
              <Route path="/community" element={
                <ProtectedRoute>
                  <Community />
                </ProtectedRoute>
              } />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/lawyers" element={<LawyersPage />} />
              <Route path="/lawyer-register" element={<LawyerRegisterPage />} />
              <Route path="/lawyer-login" element={<LawyerLoginPage />} />
              <Route path="/lawyer-dashboard" element={<LawyerDashboard />} />
              <Route path="/lawyer-profile-edit" element={<EditLawyerProfile />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/credentials" element={<AdminCredentials />} />
              <Route path="/legal-services" element={<LegalServicesPage />} />
              <Route path="/forms" element={
                <ProtectedRoute>
                  <FormsPage />
                </ProtectedRoute>
              } />
              <Route path="/mental-health" element={
                <ProtectedRoute>
                  <MentalHealthPage />
                </ProtectedRoute>
              } />
              <Route path="/advocate-dashboard" element={
                <ProtectedRoute requiredRole="advocate">
                  <AdvocateDashboard />
                </ProtectedRoute>
              } />
            </Routes>
          </div>
          <SOSButton />
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;