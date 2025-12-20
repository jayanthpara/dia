import React, { useState } from 'react';
import { BookOpen, Video, Users, MessageCircle, Calendar, Award, Download, ExternalLink } from 'lucide-react';

const Community = () => {
  const [activeTab, setActiveTab] = useState('knowledge');

  const knowledgeResources = [
    {
      title: 'Understanding Your Rights: Domestic Violence',
      type: 'Guide',
      description: 'Comprehensive guide covering legal protections, restraining orders, and available support services.',
      readTime: '15 min read',
      downloads: 1243,
      category: 'Legal Rights'
    },
    {
      title: 'Workplace Harassment: Know Your Options',
      type: 'Article',
      description: 'Step-by-step guide on documenting incidents and pursuing legal action against workplace harassment.',
      readTime: '10 min read',
      downloads: 987,
      category: 'Employment Law'
    },
    {
      title: 'Family Law Basics',
      type: 'Guide',
      description: 'Essential information about divorce, child custody, and property rights.',
      readTime: '20 min read',
      downloads: 2156,
      category: 'Family Law'
    },
    {
      title: 'Immigration Rights and Resources',
      type: 'Guide',
      description: 'Navigate immigration processes, understand your rights, and find support services.',
      readTime: '25 min read',
      downloads: 1876,
      category: 'Immigration'
    }
  ];

  const webinars = [
    {
      title: 'Legal Self-Advocacy: Building Confidence in Legal Settings',
      date: 'March 15, 2025',
      time: '2:00 PM EST',
      speaker: 'Dr. Maria Santos, Legal Advocate',
      attendees: 156,
      status: 'Upcoming'
    },
    {
      title: 'Understanding Your Financial Rights in Divorce',
      date: 'March 8, 2025',
      time: '7:00 PM EST',
      speaker: 'Jennifer Chen, Family Law Attorney',
      attendees: 203,
      status: 'Recording Available'
    },
    {
      title: 'Workplace Rights: What Every Woman Should Know',
      date: 'February 28, 2025',
      time: '12:00 PM EST',
      speaker: 'Sarah Johnson, Employment Lawyer',
      attendees: 289,
      status: 'Recording Available'
    }
  ];

  const supportGroups = [
    {
      name: 'Domestic Violence Survivors Support',
      members: 234,
      description: 'Safe space for survivors to share experiences and support each other.',
      meetingTime: 'Tuesdays 7PM EST',
      isPrivate: true
    },
    {
      name: 'Single Mothers Legal Support',
      members: 189,
      description: 'Support group focused on legal challenges facing single mothers.',
      meetingTime: 'Wednesdays 8PM EST',
      isPrivate: true
    },
    {
      name: 'Workplace Rights Discussion',
      members: 167,
      description: 'Share experiences and strategies for workplace legal issues.',
      meetingTime: 'Thursdays 6PM EST',
      isPrivate: false
    }
  ];

  const tabs = [
    { id: 'knowledge', label: 'Knowledge Hub', icon: BookOpen },
    { id: 'webinars', label: 'Webinars', icon: Video },
    { id: 'support', label: 'Support Groups', icon: Users }
  ];

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Community & Resources
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Access educational resources, join supportive communities, and learn from legal experts 
            through our comprehensive knowledge platform.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-sm p-2 mb-8 max-w-2xl mx-auto">
          <div className="flex space-x-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-teal-600 text-white'
                    : 'text-gray-600 hover:text-teal-600 hover:bg-teal-50'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Knowledge Hub */}
        {activeTab === 'knowledge' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {knowledgeResources.map((resource, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <span className="inline-block bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm font-medium mb-2">
                        {resource.category}
                      </span>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{resource.title}</h3>
                    </div>
                    <BookOpen className="w-6 h-6 text-gray-400" />
                  </div>
                  
                  <p className="text-gray-600 mb-4">{resource.description}</p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>{resource.readTime}</span>
                    <div className="flex items-center space-x-1">
                      <Download className="w-4 h-4" />
                      <span>{resource.downloads.toLocaleString()} downloads</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button className="flex-1 bg-teal-600 text-white py-2 rounded-lg font-medium hover:bg-teal-700 transition-colors flex items-center justify-center space-x-2">
                      <BookOpen className="w-4 h-4" />
                      <span>Read Now</span>
                    </button>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-teal-600 to-blue-600 rounded-2xl p-8 text-white text-center">
              <h2 className="text-3xl font-bold mb-4">Can't Find What You're Looking For?</h2>
              <p className="text-xl text-teal-100 mb-6">
                Request specific legal guides or topics you'd like us to cover
              </p>
              <button className="bg-white text-teal-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
                Request Resource
              </button>
            </div>
          </div>
        )}

        {/* Webinars */}
        {activeTab === 'webinars' && (
          <div className="space-y-6">
            {webinars.map((webinar, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow p-6"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-grow mb-4 lg:mb-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{webinar.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        webinar.status === 'Upcoming'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {webinar.status}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-3">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{webinar.date} at {webinar.time}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Award className="w-4 h-4" />
                        <span>{webinar.speaker}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{webinar.attendees} attendees</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    {webinar.status === 'Upcoming' ? (
                      <button className="bg-teal-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-teal-700 transition-colors">
                        Register Free
                      </button>
                    ) : (
                      <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2">
                        <Video className="w-4 h-4" />
                        <span>Watch Recording</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            <div className="text-center">
              <button className="bg-gray-100 text-gray-700 px-8 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors">
                View All Past Webinars
              </button>
            </div>
          </div>
        )}

        {/* Support Groups */}
        {activeTab === 'support' && (
          <div className="space-y-6">
            {supportGroups.map((group, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow p-6"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-grow mb-4 lg:mb-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{group.name}</h3>
                      {group.isPrivate && (
                        <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                          Private
                        </span>
                      )}
                    </div>
                    
                    <p className="text-gray-600 mb-3">{group.description}</p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{group.members} members</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{group.meetingTime}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button className="bg-teal-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-teal-700 transition-colors">
                      Join Group
                    </button>
                    <button className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <div className="bg-purple-50 rounded-2xl p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Start Your Own Support Group
              </h2>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Don't see a support group that fits your needs? We'll help you create one and connect 
                with others who share similar experiences.
              </p>
              <button className="bg-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-purple-700 transition-colors">
                Create Support Group
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Community;