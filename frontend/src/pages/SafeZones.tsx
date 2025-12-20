import React, { useState } from 'react';
import { MapPin, Phone, Clock, Shield, Filter, Navigation } from 'lucide-react';

const SafeZones = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');

  const safeZones = [
    {
      id: 1,
      name: 'Women\'s Crisis Center',
      type: 'Shelter',
      address: '123 Safe Street, New York, NY 10001',
      phone: '(555) 123-4567',
      hours: '24/7',
      services: ['Emergency Shelter', 'Counseling', 'Legal Aid'],
      distance: '0.5 miles',
      verified: true
    },
    {
      id: 2,
      name: 'Legal Aid Society - Manhattan',
      type: 'Legal Aid',
      address: '456 Justice Ave, New York, NY 10002',
      phone: '(555) 234-5678',
      hours: 'Mon-Fri 9AM-5PM',
      services: ['Free Legal Consultation', 'Court Representation', 'Document Help'],
      distance: '1.2 miles',
      verified: true
    },
    {
      id: 3,
      name: 'Safe Haven NGO',
      type: 'NGO',
      address: '789 Hope Boulevard, New York, NY 10003',
      phone: '(555) 345-6789',
      hours: '24/7 Hotline',
      services: ['Crisis Counseling', 'Safety Planning', 'Resource Referrals'],
      distance: '2.1 miles',
      verified: true
    },
    {
      id: 4,
      name: 'Community Support Center',
      type: 'Support Center',
      address: '321 Community Way, New York, NY 10004',
      phone: '(555) 456-7890',
      hours: 'Mon-Sat 8AM-8PM',
      services: ['Support Groups', 'Childcare', 'Job Training'],
      distance: '2.8 miles',
      verified: true
    },
    {
      id: 5,
      name: 'Emergency Family Shelter',
      type: 'Shelter',
      address: '654 Sanctuary Drive, New York, NY 10005',
      phone: '(555) 567-8901',
      hours: '24/7',
      services: ['Family Housing', 'Children Services', 'Meals'],
      distance: '3.2 miles',
      verified: true
    },
    {
      id: 6,
      name: 'Immigration Rights Center',
      type: 'Legal Aid',
      address: '987 Freedom Street, New York, NY 10006',
      phone: '(555) 678-9012',
      hours: 'Tue-Thu 10AM-4PM',
      services: ['Immigration Law', 'Translation Services', 'Advocacy'],
      distance: '4.1 miles',
      verified: true
    }
  ];

  const filters = [
    { id: 'all', label: 'All Locations', count: safeZones.length },
    { id: 'shelter', label: 'Shelters', count: safeZones.filter(z => z.type === 'Shelter').length },
    { id: 'legal', label: 'Legal Aid', count: safeZones.filter(z => z.type === 'Legal Aid').length },
    { id: 'ngo', label: 'NGOs', count: safeZones.filter(z => z.type === 'NGO').length },
    { id: 'support', label: 'Support Centers', count: safeZones.filter(z => z.type === 'Support Center').length }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Shelter': return 'bg-red-100 text-red-800';
      case 'Legal Aid': return 'bg-blue-100 text-blue-800';
      case 'NGO': return 'bg-purple-100 text-purple-800';
      case 'Support Center': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredZones = selectedFilter === 'all' 
    ? safeZones 
    : safeZones.filter(zone => {
        switch (selectedFilter) {
          case 'shelter': return zone.type === 'Shelter';
          case 'legal': return zone.type === 'Legal Aid';
          case 'ngo': return zone.type === 'NGO';
          case 'support': return zone.type === 'Support Center';
          default: return true;
        }
      });

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Safe Zones & Support Centers
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find nearby shelters, legal aid centers, and support organizations. 
            All locations are verified and provide safe, confidential assistance.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <button className="bg-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-700 transition-colors flex items-center space-x-2">
            <Phone className="w-5 h-5" />
            <span>Emergency Call</span>
          </button>
          <button className="bg-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-teal-700 transition-colors flex items-center space-x-2">
            <Navigation className="w-5 h-5" />
            <span>Get Directions to Nearest</span>
          </button>
        </div>

        {/* Map Placeholder */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <div className="bg-gradient-to-br from-teal-100 to-blue-100 rounded-xl h-96 flex items-center justify-center mb-6">
            <div className="text-center">
              <MapPin className="w-16 h-16 text-teal-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Interactive Map</h3>
              <p className="text-gray-600">Map showing safe zones and support centers near you</p>
              <div className="mt-6 grid grid-cols-2 gap-4 max-w-sm mx-auto">
                {safeZones.slice(0, 4).map((zone) => (
                  <div key={zone.id} className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-teal-600 rounded-full"></div>
                    <span className="text-sm text-gray-700">{zone.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <Filter className="w-5 h-5 text-gray-600" />
            <span className="font-medium text-gray-900">Filter by type:</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedFilter === filter.id
                    ? 'bg-teal-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-teal-50 border border-gray-200'
                }`}
              >
                {filter.label} ({filter.count})
              </button>
            ))}
          </div>
        </div>

        {/* Safe Zones List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredZones.map((zone) => (
            <div
              key={zone.id}
              className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{zone.name}</h3>
                    {zone.verified && (
                      <Shield className="w-5 h-5 text-green-600" title="Verified Safe Zone" />
                    )}
                  </div>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(zone.type)}`}>
                    {zone.type}
                  </span>
                </div>
                <div className="text-right text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{zone.distance}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-start space-x-2">
                  <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">{zone.address}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">{zone.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">{zone.hours}</span>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Services:</h4>
                <div className="flex flex-wrap gap-2">
                  {zone.services.map((service, index) => (
                    <span
                      key={index}
                      className="bg-teal-50 text-teal-700 px-2 py-1 rounded text-xs font-medium"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex space-x-3">
                <button className="flex-1 bg-teal-600 text-white py-2 rounded-lg font-medium hover:bg-teal-700 transition-colors">
                  Get Directions
                </button>
                <button className="flex-1 border border-teal-600 text-teal-600 py-2 rounded-lg font-medium hover:bg-teal-50 transition-colors">
                  Call Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Emergency Notice */}
        <div className="mt-12 bg-red-50 border border-red-200 rounded-2xl p-6">
          <div className="flex items-start space-x-3">
            <Shield className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-red-800 mb-2">Emergency Situations</h3>
              <p className="text-red-700">
                If you're in immediate danger, call 911 first. These safe zones are for ongoing support 
                and assistance. All locations listed provide confidential services and respect your privacy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafeZones;