import React, { useState, useEffect } from 'react';
import { Download, Search, FileText, Info, MapPin, Filter } from 'lucide-react';

// Form categories
const FORM_CATEGORIES = [
  { id: 'identity', name: 'Identity & Personal Documents' },
  { id: 'pension', name: 'Pension & Government Benefits' },
  { id: 'property', name: 'Property & Housing / Deeds' },
  { id: 'finance', name: 'Finance & Loans' },
  { id: 'corporate', name: 'Corporate & Business' },
  { id: 'legal', name: 'Legal / Cyber Reporting' },
];

const INDIAN_STATES = [
  'All', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chandigarh', 'Chhattisgarh',
  'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

// Forms data
const SAMPLE_FORMS = [
  // Identity & Personal Documents
  {
    id: 'aadhaar-enrollment',
    title: 'Aadhaar Enrollment/Update Form',
    category: 'identity',
    states: ['All'],
    description: 'Form for new Aadhaar enrollment and updates (Form 1,3,4)',
    fileUrl: '/forms/aadhaar-enrollment.pdf',
    instructions: [
      'Download and fill the appropriate form (Form 1 for new enrollment)',
      'Attach required documents (ID proof, address proof, DOB proof)',
      'Visit nearest Aadhaar Enrollment Center',
      'Complete biometric verification',
      'Collect acknowledgment slip with enrollment ID'
    ]
  },
  {
    id: 'pan-card',
    title: 'PAN Card Application (Form 49A)',
    category: 'identity',
    states: ['All'],
    description: 'Application form for new PAN card or corrections',
    fileUrl: '/forms/pan-49a.pdf',
    instructions: [
      'Fill Form 49A for Indian citizens',
      'Attach ID proof, address proof, and DOB proof',
      'Submit at PAN application center or apply online',
      'Pay applicable fees',
      'Track application status online'
    ]
  },
  {
    id: 'passport',
    title: 'Passport Application Form',
    category: 'identity',
    states: ['All'],
    description: 'Application for new/renewal of Indian passport',
    fileUrl: '/forms/passport-application.pdf',
    instructions: [
      'Fill the application form online or offline',
      'Book appointment at Passport Seva Kendra',
      'Carry original documents for verification',
      'Complete biometric verification',
      'Pay applicable fees and collect receipt'
    ]
  },

  // Pension & Government Benefits
  {
    id: 'form-10d',
    title: 'Form 10D - Pension Payment Order',
    category: 'pension',
    states: ['All'],
    description: 'Application for pension under Employees Pension Scheme',
    fileUrl: '/forms/form-10d.pdf',
    instructions: [
      'Fill personal and employment details',
      'Attach required documents (ID proof, service certificate, etc.)',
      'Submit to nearest EPFO office',
      'Keep acknowledgment for tracking'
    ]
  },
  {
    id: 'delhi-old-age-pension',
    title: 'Delhi Old Age Pension Form',
    category: 'pension',
    states: ['Delhi'],
    description: 'Application for old age pension in Delhi',
    fileUrl: '/forms/delhi-old-age-pension.pdf',
    instructions: [
      'Fill applicant details and family information',
      'Attach age proof, residence proof, and income certificate',
      'Submit at local SDM office or online portal',
      'Application will be verified by authorities'
    ]
  },
  {
    id: 'kerala-pension',
    title: 'Kerala Social Security Pension',
    category: 'pension',
    states: ['Kerala'],
    description: 'Application for various social security pensions',
    fileUrl: '/forms/kerala-pension.pdf',
    instructions: [
      'Fill the application with personal details',
      'Attach required documents (Aadhaar, bank details, etc.)',
      'Submit at local village/ward office',
      'Track application status online'
    ]
  },

  // Property & Housing / Deeds
  {
    id: 'rental-agreement',
    title: 'Rental/Lease Agreement',
    category: 'property',
    states: ['All'],
    description: 'Standard rental agreement for residential/commercial property',
    fileUrl: '/forms/rental-agreement.pdf',
    instructions: [
      'Fill in property details and parties information',
      'Mention rent amount, security deposit, and duration',
      'Both parties must sign with witnesses',
      'Register at sub-registrar office (if required)'
    ]
  },
  {
    id: 'sale-deed',
    title: 'Sale Deed/Conveyance Form',
    category: 'property',
    states: ['All'],
    description: 'Legal document for transfer of property ownership',
    fileUrl: '/forms/sale-deed.pdf',
    instructions: [
      'Fill property details and parties information',
      'Attach property documents and NOCs',
      'Both parties must sign with witnesses',
      'Register at sub-registrar office',
      'Pay applicable stamp duty and registration charges'
    ]
  },
  {
    id: 'power-of-attorney',
    title: 'Power of Attorney (Property)',
    category: 'property',
    states: ['All'],
    description: 'Authorize someone to handle property matters',
    fileUrl: '/forms/poa-property.pdf',
    instructions: [
      'Fill principal and agent details',
      'Specify powers being granted',
      'Sign in presence of notary public',
      'Register at sub-registrar office (if required)'
    ]
  },

  // Finance & Loans
  {
    id: 'loan-application',
    title: 'Loan Application Form',
    category: 'finance',
    states: ['All'],
    description: 'Standard loan application form for personal/business loans',
    fileUrl: '/forms/loan-application.pdf',
    instructions: [
      'Fill personal and employment details',
      'Provide income and liability information',
      'Attach KYC documents and income proofs',
      'Submit to bank or financial institution'
    ]
  },
  {
    id: 'common-loan-form',
    title: 'Common Loan Form (CLF)',
    category: 'finance',
    states: ['All'],
    description: 'Standardized form for loan applications across banks',
    fileUrl: '/forms/common-loan-form.pdf',
    instructions: [
      'Fill personal, financial, and loan details',
      'Attach required documents (ID proof, address proof, income proof)',
      'Submit to any bank branch',
      'Track application status'
    ]
  },

  // Corporate & Business
  {
    id: 'nda',
    title: 'Non-Disclosure Agreement (NDA)',
    category: 'corporate',
    states: ['All'],
    description: 'Standard NDA for protecting confidential information',
    fileUrl: '/forms/nda.pdf',
    instructions: [
      'Fill in party details and effective date',
      'Specify confidential information covered',
      'Define non-disclosure period',
      'Both parties must sign the agreement'
    ]
  },
  {
    id: 'employment-contract',
    title: 'Employment Contract',
    category: 'corporate',
    states: ['All'],
    description: 'Standard employment agreement between employer and employee',
    fileUrl: '/forms/employment-contract.pdf',
    instructions: [
      'Fill in employee and company details',
      'Specify job role, salary, and benefits',
      'Include terms of employment and notice period',
      'Both parties must sign the agreement'
    ]
  },

  // Legal / Cyber Reporting
  {
    id: 'affidavit',
    title: 'Affidavit/Declaration Form',
    category: 'legal',
    states: ['All'],
    description: 'General purpose affidavit for various legal declarations',
    fileUrl: '/forms/affidavit.pdf',
    instructions: [
      'Fill declarant details and declaration statement',
      'Sign in presence of notary public',
      'Attach supporting documents if required',
      'Get notary stamp and signature'
    ]
  },
  {
    id: 'cybercrime-complaint',
    title: 'NCRP Cybercrime Complaint',
    category: 'legal',
    states: ['All'],
    description: 'Form to report cybercrime incidents in India',
    fileUrl: '/forms/cybercrime-complaint.pdf',
    instructions: [
      'Fill complainant and incident details',
      'Provide complete information about the cybercrime',
      'Attach supporting evidence (screenshots, emails, etc.)',
      'Submit at local cybercrime cell or online portal',
      'Note the complaint number for tracking'
    ]
  },
  {
    id: 'legal-aid-application',
    title: 'Legal Aid Application',
    category: 'legal',
    states: ['All'],
    description: 'Application for free legal aid services',
    fileUrl: '/forms/legal-aid-application.pdf',
    instructions: [
      'Fill personal and case details',
      'Attach income certificate and case documents',
      'Submit at District Legal Services Authority (DLSA)',
      'Application will be reviewed for eligibility'
    ]
  }
];

const FormsLibrary = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedState, setSelectedState] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedForm, setSelectedForm] = useState<any>(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [filteredForms, setFilteredForms] = useState(SAMPLE_FORMS);

  // Filter forms based on category, state, and search query
  useEffect(() => {
    let result = [...SAMPLE_FORMS];
    
    if (selectedCategory !== 'all') {
      result = result.filter(form => form.category === selectedCategory);
    }
    
    if (selectedState !== 'All') {
      result = result.filter(form => 
        form.states.includes('All') || form.states.includes(selectedState)
      );
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(form => 
        form.title.toLowerCase().includes(query) || 
        form.description.toLowerCase().includes(query)
      );
    }
    
    setFilteredForms(result);
  }, [selectedCategory, selectedState, searchQuery]);

  const handleFormClick = (form: any) => {
    setSelectedForm(form);
    setShowInstructions(false);
  };

  const handleDownload = (url: string, filename: string) => {
    // In a real app, this would trigger a file download
    console.log(`Downloading ${filename} from ${url}`);
    // window.open(url, '_blank');
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-indigo-700 mb-2">Government & Legal Forms</h1>
          <p className="text-gray-600">Find and download official forms for various government services</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Search forms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter className="h-4 w-4 text-gray-400" />
                </div>
                <select
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  {FORM_CATEGORIES.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-4 w-4 text-gray-400" />
                </div>
                <select
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                >
                  <option value="All">All States</option>
                  {INDIAN_STATES.map(state => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                selectedCategory === 'all'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              All Forms
            </button>
            {FORM_CATEGORIES.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  selectedCategory === category.id
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Forms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredForms.map((form) => (
            <div 
              key={form.id} 
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow border border-gray-100"
              onClick={() => handleFormClick(form)}
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{form.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{form.description}</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        {FORM_CATEGORIES.find(c => c.id === form.category)?.name || form.category}
                      </span>
                      {form.states[0] !== 'All' && form.states.map(state => (
                        <span key={state} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                          {state}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <FileText className="h-8 w-8 text-indigo-500" />
                  </div>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <button 
                    className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(form.fileUrl, form.title);
                    }}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </button>
                  <button 
                    className="text-sm text-gray-600 hover:text-gray-800 flex items-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedForm(form);
                      setShowInstructions(true);
                    }}
                  >
                    <Info className="h-4 w-4 mr-1" />
                    Instructions
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {filteredForms.length === 0 && (
            <div className="col-span-full text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">No forms found</h3>
              <p className="mt-1 text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>

      {/* Form Preview/Instructions Modal */}
      {selectedForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">
                {showInstructions ? 'Submission Instructions' : selectedForm.title}
              </h2>
              <button 
                onClick={() => setSelectedForm(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="flex-1 overflow-auto">
              {showInstructions ? (
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">How to submit this form:</h3>
                  <ol className="space-y-3">
                    {selectedForm.instructions.map((step: string, index: number) => (
                      <li key={index} className="flex">
                        <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-indigo-100 text-indigo-800 font-medium text-sm mr-3">
                          {index + 1}
                        </span>
                        <span className="text-gray-700">{step}</span>
                      </li>
                    ))}
                  </ol>
                  <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-blue-800 mb-2">Need help?</h4>
                    <p className="text-sm text-blue-700">
                      Contact our support team at support@dia-legal.in or call 1800-XXX-XXXX for assistance with this form.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-6">
                  <div className="aspect-w-16 aspect-h-11 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center p-8">
                      <FileText className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">Form Preview</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {selectedForm.title} - {FORM_CATEGORIES.find(c => c.id === selectedForm.category)?.name}
                      </p>
                      <div className="mt-6">
                        <button
                          type="button"
                          onClick={() => handleDownload(selectedForm.fileUrl, selectedForm.title)}
                          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          <Download className="-ml-1 mr-2 h-5 w-5" />
                          Download Form
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between items-center">
              <button
                type="button"
                onClick={() => setShowInstructions(!showInstructions)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {showInstructions ? 'View Form' : 'View Instructions'}
              </button>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setSelectedForm(null)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => handleDownload(selectedForm.fileUrl, selectedForm.title)}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Download className="-ml-1 mr-2 h-5 w-5" />
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormsLibrary;
