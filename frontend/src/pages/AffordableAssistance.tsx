import React from 'react';
import { DollarSign, Heart, Users, Calculator, CreditCard, Gift } from 'lucide-react';

const AffordableAssistance = () => {
  const assistanceOptions = [
    {
      icon: Calculator,
      title: 'Sliding-Scale Fees',
      description: 'Legal fees adjusted based on your income and financial situation',
      features: [
        'Income-based pricing',
        'Flexible payment plans',
        'No hidden costs',
        'Transparent billing'
      ],
      color: 'bg-blue-600',
      badge: 'Most Popular'
    },
    {
      icon: Heart,
      title: 'Pro Bono Services',
      description: 'Free legal assistance for qualifying cases and individuals',
      features: [
        'Completely free service',
        'Experienced attorneys',
        'Case merit evaluation',
        'Priority for urgent matters'
      ],
      color: 'bg-green-600',
      badge: 'Free'
    },
    {
      icon: Users,
      title: 'Community Crowdfunding',
      description: 'Crowdsourced funding to support your legal case',
      features: [
        'Community support',
        'Transparent fundraising',
        'Goal-based campaigns',
        'Social sharing tools'
      ],
      color: 'bg-purple-600',
      badge: 'Community Driven'
    }
  ];

  const eligibilityFactors = [
    { icon: DollarSign, title: 'Income Level', description: 'Based on federal poverty guidelines' },
    { icon: Users, title: 'Family Size', description: 'Household members considered' },
    { icon: CreditCard, title: 'Assets', description: 'Available resources evaluation' },
    { icon: Gift, title: 'Case Type', description: 'Priority for vulnerable populations' }
  ];

  const successStories = [
    {
      name: 'Maria S.',
      case: 'Domestic Violence',
      outcome: 'Restraining order obtained through pro bono service',
      savings: 'Saved $3,000 in legal fees'
    },
    {
      name: 'Jennifer L.',
      case: 'Workplace Harassment',
      outcome: 'Settlement reached with sliding-scale representation',
      savings: 'Paid only 30% of standard fees'
    },
    {
      name: 'Sarah M.',
      case: 'Child Custody',
      outcome: 'Community raised $2,500 for legal representation',
      savings: 'Full legal support funded'
    }
  ];

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Affordable Legal Assistance
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Quality legal support shouldn't be a luxury. We offer multiple pathways to make 
            professional legal assistance accessible regardless of your financial situation.
          </p>
        </div>

        {/* Assistance Options */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {assistanceOptions.map((option, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 relative"
            >
              {option.badge && (
                <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-semibold">
                  {option.badge}
                </div>
              )}
              <div className={`${option.color} p-6`}>
                <option.icon className="w-12 h-12 text-white mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">{option.title}</h3>
                <p className="text-white opacity-90">{option.description}</p>
              </div>
              <div className="p-6">
                <ul className="space-y-3 mb-6">
                  {option.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 rounded-xl transition-colors">
                  Apply Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Eligibility Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Eligibility Factors
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {eligibilityFactors.map((factor, index) => (
              <div key={index} className="text-center p-4">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <factor.icon className="w-8 h-8 text-teal-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{factor.title}</h3>
                <p className="text-gray-600 text-sm">{factor.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Success Stories */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Success Stories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {successStories.map((story, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition-shadow"
              >
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{story.name}</h3>
                  <p className="text-teal-600 font-medium">{story.case}</p>
                </div>
                <p className="text-gray-700 mb-4">{story.outcome}</p>
                <div className="bg-green-50 text-green-800 px-3 py-2 rounded-lg text-sm font-medium">
                  {story.savings}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Assessment */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">
            Quick Financial Assessment
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Take our 2-minute assessment to see which assistance programs you qualify for
          </p>
          <button className="bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-lg">
            Start Assessment
          </button>
        </div>
      </div>
    </div>
  );
};

export default AffordableAssistance;