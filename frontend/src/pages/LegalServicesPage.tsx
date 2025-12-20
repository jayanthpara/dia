import { useState } from 'react';
import { FileText, Scale, Heart, Shield, User, Home, FileCheck } from 'lucide-react';

const services = {
  legal: [
    {
      id: 1,
      name: 'Marriage Certificate',
      icon: <Heart className="w-8 h-8 text-blue-600" />,
      rating: 4.7,
      reviews: 128,
      delivered: 1200,
      price: 0,
      description: 'Legal documentation for marriage registration'
    },
    {
      id: 2,
      name: 'Court Marriage',
      icon: <Scale className="w-8 h-8 text-green-600" />,
      rating: 4.5,
      reviews: 95,
      delivered: 850,
      price: 0,
      description: 'Complete court marriage registration'
    },
    {
      id: 3,
      name: 'Name Change',
      icon: <User className="w-8 h-8 text-purple-600" />,
      rating: 4.3,
      reviews: 87,
      delivered: 720,
      price: 0,
      description: 'Legal name change process'
    },
    {
      id: 4,
      name: 'Divorce',
      icon: <FileText className="w-8 h-8 text-red-600" />,
      rating: 4.2,
      reviews: 64,
      delivered: 580,
      price: 0,
      description: 'Legal divorce proceedings'
    },
    {
      id: 5,
      name: 'Domestic Violence',
      icon: <Shield className="w-8 h-8 text-yellow-600" />,
      rating: 4.8,
      reviews: 142,
      delivered: 950,
      price: 0,
      description: 'Legal protection and support'
    },
    {
      id: 6,
      name: 'Property Registration',
      icon: <Home className="w-8 h-8 text-indigo-600" />,
      rating: 4.4,
      reviews: 76,
      delivered: 1100,
      price: 0,
      description: 'Property documentation and registration'
    }
  ],
  government: [
    {
      id: 7,
      name: 'Aadhaar Update',
      icon: <FileCheck className="w-8 h-8 text-blue-600" />,
      rating: 4.6,
      reviews: 210,
      delivered: 3200,
      price: 0,
      description: 'Update your Aadhaar details'
    },
    {
      id: 8,
      name: 'PAN Card',
      icon: <FileText className="w-8 h-8 text-green-600" />,
      rating: 4.5,
      reviews: 198,
      delivered: 2800,
      price: 0,
      description: 'New PAN card application'
    },
    {
      id: 9,
      name: 'Voter ID',
      icon: <FileText className="w-8 h-8 text-purple-600" />,
      rating: 4.4,
      reviews: 176,
      delivered: 2500,
      price: 0,
      description: 'Voter ID registration and updates'
    }
  ]
};

const LegalServicesPage = () => {
  const [activeTab, setActiveTab] = useState<'legal' | 'government'>('legal');
  const [activeServices, setActiveServices] = useState(services.legal);

  const handleTabChange = (tab: 'legal' | 'government') => {
    setActiveTab(tab);
    setActiveServices(tab === 'legal' ? services.legal : services.government);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Legal & Government Services</h1>
      
      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-200 mb-8">
        <button
          onClick={() => handleTabChange('legal')}
          className={`py-3 px-6 font-medium text-sm ${activeTab === 'legal' 
            ? 'border-b-2 border-blue-600 text-blue-600' 
            : 'text-gray-500 hover:text-gray-700'}`}
        >
          Legal Services
        </button>
        <button
          onClick={() => handleTabChange('government')}
          className={`py-3 px-6 font-medium text-sm ${activeTab === 'government' 
            ? 'border-b-2 border-blue-600 text-blue-600' 
            : 'text-gray-500 hover:text-gray-700'}`}
        >
          Government Registrations
        </button>
      </div>

      {/* Service Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeServices.map((service) => (
          <div 
            key={service.id}
            className="border rounded-lg p-6 hover:shadow-lg transition-shadow duration-300 bg-white"
          >
            <div className="flex items-center mb-4">
              <div className="p-2 bg-gray-100 rounded-lg mr-4">
                {service.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-800">{service.name}</h3>
            </div>
            
            <p className="text-gray-600 text-sm mb-4">{service.description}</p>
            
            <div className="flex items-center mb-2">
              <div className="flex text-yellow-400 mr-2">
                {'★'.repeat(Math.floor(service.rating))}
                {'☆'.repeat(5 - Math.floor(service.rating))}
              </div>
              <span className="text-sm text-gray-600">{service.rating}/5</span>
              <span className="mx-2 text-gray-300">•</span>
              <span className="text-sm text-gray-500">{service.reviews} reviews</span>
            </div>
            
            <div className="text-sm text-gray-500 mb-4">
              {service.delivered.toLocaleString()}+ {activeTab === 'legal' ? 'Cases Handled' : 'Registrations Processed'}
            </div>
            
            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
              <span className="font-medium">Starting from ₹{service.price}</span>
              <button 
                className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors duration-200 text-sm font-medium"
              >
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LegalServicesPage;
