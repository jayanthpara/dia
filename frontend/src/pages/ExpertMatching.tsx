import React, { useState } from 'react';
import { Search, Star, MapPin, Award, Clock, Users } from 'lucide-react';

const ExpertMatching = () => {
  const [selectedIssue, setSelectedIssue] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [showResults, setShowResults] = useState(false);

  const issueTypes = [
    'Domestic Violence',
    'Workplace Harassment',
    'Property Dispute',
    'Family Law',
    'Immigration',
    'Personal Injury',
    'Employment Law',
    'Criminal Defense'
  ];

  const languages = [
    'English',
    'Spanish',
    'French',
    'Arabic',
    'Mandarin',
    'Hindi',
    'Portuguese',
    'Russian'
  ];

  const lawyers = [
    {
      id: 1,
      name: 'Dr. Sarah Chen',
      specialization: 'Domestic Violence & Family Law',
      rating: 4.9,
      reviews: 127,
      experience: '12 years',
      location: 'New York, NY',
      languages: ['English', 'Mandarin'],
      hourlyRate: '$200-300',
      availability: 'Available Today',
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
      verified: true,
      proBonoAvailable: true
    },
    {
      id: 2,
      name: 'Maria Rodriguez',
      specialization: 'Immigration & Employment Law',
      rating: 4.8,
      reviews: 203,
      experience: '8 years',
      location: 'Los Angeles, CA',
      languages: ['English', 'Spanish'],
      hourlyRate: '$150-250',
      availability: 'Available Tomorrow',
      image: 'https://images.pexels.com/photos/3777943/pexels-photo-3777943.jpeg?auto=compress&cs=tinysrgb&w=400',
      verified: true,
      proBonoAvailable: false
    },
    {
      id: 3,
      name: 'James Thompson',
      specialization: 'Personal Injury & Criminal Defense',
      rating: 4.7,
      reviews: 89,
      experience: '15 years',
      location: 'Chicago, IL',
      languages: ['English', 'French'],
      hourlyRate: '$250-400',
      availability: 'Available Next Week',
      image: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=400',
      verified: true,
      proBonoAvailable: true
    }
  ];

  const handleSearch = () => {
    if (selectedIssue && selectedLanguage) {
      setShowResults(true);
    }
  };

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Expert Case Matching
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find the perfect legal expert for your specific case. Our intelligent matching system 
            connects you with verified lawyers who specialize in your area of need.
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Find Your Legal Expert</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What type of legal issue do you have?
              </label>
              <select
                value={selectedIssue}
                onChange={(e) => setSelectedIssue(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
              >
                <option value="">Select an issue type</option>
                {issueTypes.map((issue) => (
                  <option key={issue} value={issue}>{issue}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred language
              </label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
              >
                <option value="">Select a language</option>
                {languages.map((language) => (
                  <option key={language} value={language}>{language}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleSearch}
            disabled={!selectedIssue || !selectedLanguage}
            className="w-full md:w-auto bg-teal-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
          >
            <Search className="w-5 h-5" />
            <span>Find Matching Lawyers</span>
          </button>
        </div>

        {/* Results */}
        {showResults && (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Recommended Lawyers ({lawyers.length} matches)
              </h2>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>Sort by:</span>
                <select className="border border-gray-300 rounded-lg px-3 py-1">
                  <option>Best Match</option>
                  <option>Highest Rated</option>
                  <option>Lowest Price</option>
                  <option>Availability</option>
                </select>
              </div>
            </div>

            <div className="space-y-6">
              {lawyers.map((lawyer) => (
                <div
                  key={lawyer.id}
                  className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-6">
                    {/* Lawyer Info */}
                    <div className="flex items-start space-x-4 flex-grow">
                      <img
                        src={lawyer.image}
                        alt={lawyer.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div className="flex-grow">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-xl font-bold text-gray-900">{lawyer.name}</h3>
                          {lawyer.verified && (
                            <Award className="w-5 h-5 text-blue-600" title="Verified Lawyer" />
                          )}
                          {lawyer.proBonoAvailable && (
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                              Pro Bono Available
                            </span>
                          )}
                        </div>
                        
                        <p className="text-teal-600 font-medium mb-2">{lawyer.specialization}</p>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-400" />
                            <span>{lawyer.rating} ({lawyer.reviews} reviews)</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Award className="w-4 h-4" />
                            <span>{lawyer.experience} experience</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>{lawyer.location}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{lawyer.availability}</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4 text-sm">
                          <span className="text-gray-600">Languages: {lawyer.languages.join(', ')}</span>
                          <span className="text-gray-600">Rate: {lawyer.hourlyRate}/hr</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col space-y-2 mt-4 lg:mt-0 lg:flex-shrink-0">
                      <button className="bg-teal-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-teal-700 transition-colors">
                        Schedule Consultation
                      </button>
                      <button className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                        View Profile
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Why Our Matching Works */}
        {!showResults && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Why Our Matching Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Users,
                  title: 'Verified Experts',
                  description: 'All lawyers are thoroughly vetted and verified for credentials and experience'
                },
                {
                  icon: Award,
                  title: 'Specialized Matching',
                  description: 'Our AI considers your specific case type, location, and preferences'
                },
                {
                  icon: Star,
                  title: 'Quality Assured',
                  description: 'Client reviews and success rates ensure you get the best representation'
                }
              ].map((feature, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-8 h-8 text-teal-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpertMatching;