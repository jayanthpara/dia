import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Users, Clock, Scale, Award, Globe } from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: Shield,
      title: 'Secure & Confidential',
      description: 'End-to-end encryption protects your sensitive information',
    },
    {
      icon: Users,
      title: 'Expert Legal Network',
      description: 'Connect with verified lawyers specializing in your case type',
    },
    {
      icon: Clock,
      title: '24/7 Support',
      description: 'Emergency legal assistance available around the clock',
    },
    {
      icon: Scale,
      title: 'Accessible Justice',
      description: 'Breaking down barriers to legal support for everyone',
    },
    {
      icon: Award,
      title: 'Proven Results',
      description: 'Thousands of successful cases and satisfied clients',
    },
    {
      icon: Globe,
      title: 'Inclusive Platform',
      description: 'Multi-language support and culturally sensitive approach',
    },
  ];

  const stats = [
    { number: '100', label: 'People Helped' },
    { number: '20+', label: 'Legal Experts' },
    { number: '24/7', label: 'Support Available' },
    { number: '85%', label: 'Success Rate' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-rose-50 via-teal-50 to-purple-50 py-20 relative overflow-hidden">
        {/* Hero Image */}
        <div className="absolute top-0 right-0 w-[45%] h-full -z-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-rose-50/90"></div>
          <img
            src="dist/images/woman-justice.png"
            alt="Lady Justice illustration"
            className="absolute top-1/2 right-0 -translate-y-1/2 h-[120%] w-auto max-w-none object-contain opacity-90"
          />
        </div>
        
        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 w-48 h-48 opacity-10 transform -translate-x-1/4">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="#4FD1C5" d="M47.7,-73.5C62.3,-67.2,75.1,-54.7,83.2,-39.4C91.4,-24.1,94.8,-6,90.9,10.2C87,26.4,75.8,40.7,63.1,52.7C50.4,64.7,36.3,74.4,20.3,79.1C4.3,83.8,-13.5,83.5,-28.4,77.1C-43.3,70.8,-55.2,58.4,-65.3,44.5C-75.4,30.6,-83.6,15.3,-84.5,-0.5C-85.3,-16.3,-78.8,-32.6,-68.2,-45.1C-57.6,-57.6,-43,-66.3,-28.5,-72.6C-14.1,-78.9,0.2,-82.8,13.8,-80.2C27.4,-77.6,41.1,-68.5,47.7,-73.5Z" transform="translate(100 100)" />
          </svg>
        </div>
        

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <div className="inline-block mb-6">
              <span className="inline-block px-4 py-2 rounded-full bg-pink-100 text-pink-800 text-sm font-medium">
                Empowering Women Through Legal Support
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Justice, <span className="text-teal-600 relative">
                Accessible
                <span className="absolute -bottom-2 left-0 w-full h-1 bg-pink-200 opacity-50"></span>
              </span> for Women
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Digital Inclusive Aid provides secure, affordable legal support tailored for women and vulnerable communities. 
              Get expert help when you need it most.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/legal-support"
                className="bg-teal-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-teal-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Get Legal Help Now
              </Link>
              <Link
                to="/sos"
                className="bg-red-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-red-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Emergency SOS
              </Link>
            </div>
            
            <div className="mt-12 flex justify-center md:justify-end relative">
              
              <div className="absolute inset-0 bg-gradient-to-t from-white/10 via-transparent to-white/5 rounded-full blur-3xl -z-10"></div>
            </div>
          </div>
        </div>
      </section>
      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-teal-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose DIA?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're committed to making legal support accessible, secure, and effective for everyone
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 border-l-4 border-pink-200"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-pink-100 to-teal-100 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className={`w-6 h-6 ${index % 2 === 0 ? 'text-teal-600' : 'text-pink-500'}`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 relative inline-block">
                  {feature.title}
                  <span className="absolute -bottom-1 left-0 w-1/2 h-0.5 bg-pink-200 opacity-50"></span>
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-teal-600 to-pink-500 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="#FFFFFF" d="M44.9,-77.7C56.4,-70.4,62.7,-54.5,68.8,-39.7C74.9,-24.9,80.8,-11.2,81.2,2.8C81.7,16.8,76.7,31.1,68.3,43.1C59.8,55.1,47.9,64.8,34.4,71.9C20.9,79,5.8,83.5,-8.8,81.5C-23.4,79.5,-37.5,71,-49.4,61.1C-61.3,51.2,-70.9,39.8,-77.3,26.2C-83.7,12.6,-86.9,-3.2,-83.6,-17.4C-80.3,-31.7,-70.6,-44.3,-58.3,-51.7C-46,-59,-31.2,-61.1,-17.8,-67.9C-4.3,-74.7,7.8,-86.2,22.8,-87.1C37.7,-88,55.5,-78.2,44.9,-77.7Z" transform="translate(100 100)" />
          </svg>
        </div>
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative">
          <span className="inline-block px-4 py-1 rounded-full bg-white bg-opacity-20 text-white text-sm font-medium mb-4">
            Take the First Step
          </span>
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-white text-opacity-90 mb-8">
            Join thousands who have found justice through our platform. Your case matters, and we're here to help.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/expert-matching"
              className="bg-white text-teal-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Find Your Legal Expert
            </Link>
            <Link
              to="/community"
              className="bg-pink-500 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg border-2 border-white border-opacity-20"
            >
              Join Our Community
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;