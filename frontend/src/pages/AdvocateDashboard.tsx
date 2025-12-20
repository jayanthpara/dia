import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import '../styles/advocate-dashboard.css';
import { 
  FileText, 
  Search, 
  Briefcase, 
  Users, 
  MessageCircle, 
  Brain 
} from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <div className="p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50 hover:to-pink-50 cursor-pointer transform hover:-translate-y-1">
      <div className="flex items-start space-x-4">
        <div className="text-indigo-600">
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600">{description}</p>
        </div>
      </div>
    </div>
  );
};

const AdvocateDashboard: React.FC = () => {
  const { currentUser } = useAuth();

  if (!currentUser || currentUser.role !== 'advocate') {
    return <Navigate to="/" replace />;
  }

  const features = [
    {
      icon: <FileText className="w-6 h-6" />,
      title: "AI Drafting Assistant",
      description: "Prepares first drafts of legal documents for your review and finalization."
    },
    {
      icon: <Search className="w-6 h-6" />,
      title: "Case Law Finder",
      description: "Finds relevant precedents and judgments based on uploaded case documents."
    },
    {
      icon: <Briefcase className="w-6 h-6" />,
      title: "Private Workspace",
      description: "Securely manage your clients, cases, and confidential files."
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Co-counsel Collaboration",
      description: "Collaborate with other verified advocates in shared case chambers."
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: "Client Access Portal",
      description: "Let clients upload evidence, check case status, and communicate securely."
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: "Legal Insights Dashboard",
      description: "Analytics of judgments, case progress, and research summaries."
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12 animate-fade-in">
        <h1 className="text-4xl font-cursive mb-2">
          Welcome, {currentUser.name}
        </h1>
        <div className="w-32 h-1 bg-pink-200 mx-auto rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {features.map((feature, index) => (
          <div
            key={index}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <FeatureCard {...feature} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdvocateDashboard;