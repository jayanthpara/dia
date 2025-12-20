import React from 'react';
import { Shield, Lock, FileText, MessageSquare, Eye, Server, Smartphone, Zap } from 'lucide-react';

const SecureAssistance = () => {
  const securityFeatures = [
    {
      icon: Lock,
      title: 'End-to-End Encryption',
      description: 'All communications and documents are encrypted using military-grade AES-256 encryption',
      details: ['Messages encrypted in transit and at rest', 'Zero-knowledge architecture', 'Keys never stored on servers']
    },
    {
      icon: FileText,
      title: 'Secure Document Vault',
      description: 'Your sensitive legal documents are stored in a highly secure, encrypted digital vault',
      details: ['Bank-level security standards', 'Automatic backups', 'Version control and audit trails']
    },
    {
      icon: MessageSquare,
      title: 'Encrypted Messaging',
      description: 'Private communication channels that ensure your conversations remain confidential',
      details: ['Self-destructing messages option', 'Screenshot protection', 'IP masking for anonymity']
    }
  ];

  const privacyProtections = [
    {
      icon: Eye,
      title: 'Anonymous Consultations',
      description: 'Option to consult with lawyers without revealing your identity initially'
    },
    {
      icon: Server,
      title: 'Data Sovereignty',
      description: 'Your data is stored in secure servers within your jurisdiction'
    },
    {
      icon: Smartphone,
      title: 'Secure Mobile Access',
      description: 'Mobile apps with biometric authentication and secure data transmission'
    },
    {
      icon: Zap,
      title: 'Emergency Data Wipe',
      description: 'Instant data deletion feature for emergency situations'
    }
  ];

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Confidential & Secure Legal Assistance
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your privacy and security are our top priorities. Our platform uses state-of-the-art 
            technology to ensure your sensitive legal information remains completely confidential.
          </p>
        </div>

        {/* Security Features */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {securityFeatures.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <feature.icon className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
              <p className="text-gray-600 mb-6">{feature.description}</p>
              <ul className="space-y-2">
                {feature.details.map((detail, detailIndex) => (
                  <li key={detailIndex} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700 text-sm">{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Document Vault Demo */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Secure Document Vault
          </h2>
          
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Your Documents</h3>
              <button className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-teal-700 transition-colors">
                Upload New Document
              </button>
            </div>
            
            <div className="space-y-3">
              {[
                { name: 'Legal_Contract_v2.pdf', size: '2.3 MB', encrypted: true, uploaded: '2 hours ago' },
                { name: 'Evidence_Photos.zip', size: '15.7 MB', encrypted: true, uploaded: '1 day ago' },
                { name: 'Court_Filing_Draft.docx', size: '456 KB', encrypted: true, uploaded: '3 days ago' }
              ].map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-gray-500" />
                    <div>
                      <span className="font-medium text-gray-900">{doc.name}</span>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <span>{doc.size}</span>
                        <span>•</span>
                        <span>Uploaded {doc.uploaded}</span>
                        {doc.encrypted && (
                          <>
                            <span>•</span>
                            <div className="flex items-center space-x-1">
                              <Lock className="w-3 h-3 text-green-600" />
                              <span className="text-green-600">Encrypted</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <button className="text-teal-600 hover:text-teal-700 text-sm">
                    View
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Encrypted Chat Demo */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Encrypted Chat Interface
          </h2>
          
          <div className="bg-gray-900 rounded-xl p-4 max-w-2xl mx-auto">
            <div className="flex items-center space-x-2 mb-4 text-green-400">
              <Lock className="w-4 h-4" />
              <span className="text-xs font-mono">End-to-end encrypted • Connected securely</span>
            </div>
            
            <div className="space-y-4 max-h-64 overflow-y-auto">
              <div className="flex justify-start">
                <div className="bg-gray-700 text-white rounded-lg px-4 py-2 max-w-xs">
                  <p className="text-sm">I need help with my employment contract. Can we discuss the terms?</p>
                  <span className="text-xs text-gray-400">You • 10:30 AM</span>
                </div>
              </div>
              
              <div className="flex justify-end">
                <div className="bg-teal-600 text-white rounded-lg px-4 py-2 max-w-xs">
                  <p className="text-sm">Absolutely. I've reviewed your case details. Let's go through the key clauses together.</p>
                  <span className="text-xs text-teal-200">Sarah Chen • 10:32 AM</span>
                </div>
              </div>
              
              <div className="flex justify-start">
                <div className="bg-gray-700 text-white rounded-lg px-4 py-2 max-w-xs">
                  <p className="text-sm">Great! I'm particularly concerned about the non-compete clause.</p>
                  <span className="text-xs text-gray-400">You • 10:33 AM</span>
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex items-center space-x-2">
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-grow bg-gray-800 text-white rounded-lg px-4 py-2 text-sm placeholder-gray-400"
                disabled
              />
              <button className="bg-teal-600 text-white p-2 rounded-lg hover:bg-teal-700">
                <MessageSquare className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Additional Privacy Protections */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Additional Privacy Protections
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {privacyProtections.map((protection, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <protection.icon className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{protection.title}</h3>
                <p className="text-blue-100 text-sm">{protection.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Security Certifications */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Trusted by Leading Security Standards
          </h2>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="bg-gray-200 px-6 py-3 rounded-lg text-gray-700 font-semibold">SOC 2 Type II</div>
            <div className="bg-gray-200 px-6 py-3 rounded-lg text-gray-700 font-semibold">ISO 27001</div>
            <div className="bg-gray-200 px-6 py-3 rounded-lg text-gray-700 font-semibold">HIPAA Compliant</div>
            <div className="bg-gray-200 px-6 py-3 rounded-lg text-gray-700 font-semibold">GDPR Ready</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecureAssistance;