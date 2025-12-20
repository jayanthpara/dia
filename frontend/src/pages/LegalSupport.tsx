import React from 'react';
import { MessageCircle, Clock, Brain, Shield, FileText, Video } from 'lucide-react';

const LegalSupport = () => {
  const services = [
    {
      icon: MessageCircle,
      title: 'Online Consultation',
      description: 'Connect with legal experts through secure video calls and messaging',
      features: ['Instant messaging', 'Video consultations', 'Document sharing', 'Case timeline tracking'],
      color: 'bg-blue-600',
    },
    {
      icon: Clock,
      title: '24/7 Support',
      description: 'Round-the-clock emergency legal assistance when you need it most',
      features: ['Emergency hotline', 'Crisis intervention', 'Immediate response', 'After-hours support'],
      color: 'bg-purple-600',
    },
    {
      icon: Brain,
      title: 'AI Case Assessment',
      description: 'Intelligent preliminary analysis to understand your legal situation',
      features: ['Case strength analysis', 'Legal pathway suggestions', 'Document review', 'Risk assessment'],
      color: 'bg-teal-600',
    },
  ];

  const additionalServices = [
    {
      icon: Shield,
      title: 'Privacy Protection',
      description: 'Your information is encrypted and protected at every step',
    },
    {
      icon: FileText,
      title: 'Document Preparation',
      description: 'Professional help with legal forms and documentation',
    },
    {
      icon: Video,
      title: 'Court Preparation',
      description: 'Practice sessions and guidance for court appearances',
    },
  ];

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Legal Support Services
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Access comprehensive legal assistance designed to meet your unique needs. 
            Our platform offers multiple ways to connect with expert legal professionals.
          </p>
        </div>

        {/* Main Services */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className={`${service.color} p-6`}>
                <service.icon className="w-12 h-12 text-white mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">{service.title}</h3>
                <p className="text-white opacity-90">{service.description}</p>
              </div>
              <div className="p-6">
                <ul className="space-y-3">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button className="w-full mt-6 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 rounded-xl transition-colors">
                  Get Started
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Services */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Additional Support Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {additionalServices.map((service, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <service.icon className="w-8 h-8 text-teal-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-gradient-to-r from-teal-600 to-blue-600 rounded-2xl p-8 text-white">
          <h2 className="text-3xl font-bold mb-8 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: '1', title: 'Describe Your Issue', description: 'Tell us about your legal situation in a secure form' },
              { step: '2', title: 'Get Matched', description: 'Our AI connects you with the right legal expert' },
              { step: '3', title: 'Start Consultation', description: 'Begin secure communication with your lawyer' },
              { step: '4', title: 'Resolve Your Case', description: 'Work together towards a successful resolution' },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-white text-teal-600 rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-teal-100 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalSupport;