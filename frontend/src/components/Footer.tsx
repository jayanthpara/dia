import React from 'react';
import { Scale, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Scale className="w-8 h-8 text-teal-600" />
              <span className="text-xl font-bold text-gray-900">DIA</span>
            </div>
            <p className="text-gray-600 mb-4 max-w-md">
              Digital Inclusive Aid provides accessible, affordable, and secure legal support 
              for all, with a strong focus on women and vulnerable groups.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Phone className="w-4 h-4" />
                <span>24/7 Helpline: 1-800-HELP-DIA</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Mail className="w-4 h-4" />
                <span>support@dia-legal.org</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/legal-support" className="text-gray-600 hover:text-teal-600 text-sm">Legal Support</a></li>
              <li><a href="/expert-matching" className="text-gray-600 hover:text-teal-600 text-sm">Find a Lawyer</a></li>
              <li><a href="/safe-zones" className="text-gray-600 hover:text-teal-600 text-sm">Safe Zones</a></li>
              <li><a href="/community" className="text-gray-600 hover:text-teal-600 text-sm">Resources</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><a href="/terms" className="text-gray-600 hover:text-teal-600 text-sm">Terms of Service</a></li>
              <li><a href="/privacy" className="text-gray-600 hover:text-teal-600 text-sm">Privacy Policy</a></li>
              <li><a href="/contact" className="text-gray-600 hover:text-teal-600 text-sm">Contact Us</a></li>
              <li><a href="/sources" className="text-gray-600 hover:text-teal-600 text-sm">Sources</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-600">
              © 2025 Digital Inclusive Aid. All rights reserved.
            </p>
            <p className="text-sm text-gray-600 mt-2 md:mt-0">
              Building bridges to justice for everyone.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;