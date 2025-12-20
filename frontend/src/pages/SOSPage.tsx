import { useState } from 'react';
import { AlertTriangle, Phone, Users, Shield, MapPin, Clock } from 'lucide-react';

const SOSPage = () => {
  const [activeAlert, setActiveAlert] = useState<string | null>(null);

  const emergencyOptions = [
    {
      id: 'police',
      icon: Phone,
      title: 'Contact Police',
      subtitle: 'Immediate law enforcement assistance',
      number: '911',
      description: 'For immediate danger or ongoing crimes',
      color: 'bg-red-600 hover:bg-red-700',
      textColor: 'text-red-600'
    },
    {
      id: 'trusted',
      icon: Users,
      title: 'Alert Trusted Contact',
      subtitle: 'Notify your emergency contact',
      number: 'Your Emergency Contact',
      description: 'Send automatic alert with your location',
      color: 'bg-blue-600 hover:bg-blue-700',
      textColor: 'text-blue-600'
    },
    {
      id: 'ngo',
      icon: Shield,
      title: 'Contact NGO',
      subtitle: 'Reach specialized support organizations',
      number: '1-800-HELP-NOW',
      description: 'Connect with trained crisis counselors',
      color: 'bg-purple-600 hover:bg-purple-700',
      textColor: 'text-purple-600'
    }
  ];

  const quickResources = [
    {
      title: 'National Domestic Violence Hotline',
      number: '1-800-799-7233',
      available: '24/7',
      description: 'Confidential support for domestic violence survivors'
    },
    {
      title: 'Sexual Assault Hotline',
      number: '1-800-656-4673',
      available: '24/7',
      description: 'Support for sexual violence survivors'
    },
    {
      title: 'Crisis Text Line',
      number: 'Text HOME to 741741',
      available: '24/7',
      description: 'Text-based crisis counseling'
    },
    {
      title: 'Suicide Prevention Lifeline',
      number: '988',
      available: '24/7',
      description: 'Mental health crisis support'
    }
  ];

  const handleEmergencyAction = (optionId: string) => {
    setActiveAlert(optionId);
    // Simulate emergency action
    setTimeout(() => {
      setActiveAlert(null);
      alert('Emergency services have been notified!');
    }, 3000);
  };

  return (
    <div className="min-h-screen py-12 bg-gradient-to-br from-red-50 to-orange-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <AlertTriangle className="w-10 h-10 text-red-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Emergency SOS
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            If you're in immediate danger, use the options below to get help quickly. 
            Your safety is our top priority.
          </p>
        </div>

        {/* Emergency Alert */}
        {activeAlert && (
          <div className="bg-red-600 text-white p-6 rounded-2xl mb-8 animate-pulse">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-6 h-6" />
              <div>
                <h3 className="font-bold">Emergency Alert Sent</h3>
                <p>Help is on the way. Stay safe and remain calm.</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Emergency Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {emergencyOptions.map((option) => (
            <div
              key={option.id}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="text-center">
                <div className={`w-16 h-16 ${option.color.split(' ')[0].replace('bg-', 'bg-').replace('-600', '-100')} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <option.icon className={`w-8 h-8 ${option.textColor}`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{option.title}</h3>
                <p className="text-gray-600 mb-4">{option.subtitle}</p>
                <div className="text-lg font-semibold text-gray-900 mb-2">{option.number}</div>
                <p className="text-sm text-gray-500 mb-6">{option.description}</p>
                <button
                  onClick={() => handleEmergencyAction(option.id)}
                  disabled={activeAlert === option.id}
                  className={`w-full ${option.color} text-white py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg ${
                    activeAlert === option.id ? 'animate-pulse' : ''
                  }`}
                >
                  {activeAlert === option.id ? 'Sending Alert...' : 'Send Alert'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Resources */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            24/7 Crisis Resources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quickResources.map((resource, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{resource.title}</h3>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-600 font-medium">{resource.available}</span>
                  </div>
                </div>
                <div className="text-2xl font-bold text-teal-600 mb-2">{resource.number}</div>
                <p className="text-gray-600 text-sm">{resource.description}</p>
                <button className="mt-3 text-teal-600 hover:text-teal-700 text-sm font-medium">
                  Call Now →
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Safety Tips */}
        <div className="bg-gradient-to-r from-teal-600 to-blue-600 rounded-2xl p-8 text-white">
          <h2 className="text-3xl font-bold mb-6 text-center">
            Emergency Safety Tips
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-3">Before an Emergency</h3>
              <ul className="space-y-2 text-teal-100">
                <li>• Set up trusted emergency contacts</li>
                <li>• Keep important documents accessible</li>
                <li>• Know your nearest safe locations</li>
                <li>• Practice your safety plan</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">During an Emergency</h3>
              <ul className="space-y-2 text-teal-100">
                <li>• Stay as calm as possible</li>
                <li>• Get to a safe location if you can</li>
                <li>• Use our SOS button for quick help</li>
                <li>• Preserve evidence if safe to do so</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Location Sharing Notice */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <MapPin className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-yellow-800">Location Sharing</h4>
              <p className="text-yellow-700 text-sm">
                When you use our SOS features, your location may be shared with emergency services 
                and trusted contacts to help them find you quickly. This data is only used for emergency purposes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SOSPage;