"use client";

import { shopClasses } from './shop-colors';

export default function ShopFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`${shopClasses.bg.dark} ${shopClasses.text.inverse} mt-16`}>
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Shop Owner Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Shop Owner</h3>
            <div className="mb-4">
              <h4 className="font-semibold text-lg mb-2">Ammoo Games</h4>
              <p className="text-gray-300 mb-4">
                Passionate gamer and collector with over 10 years of experience in the gaming industry. 
                Dedicated to bringing you the best gaming merchandise and collectibles.
              </p>
            </div>
            <div className="flex space-x-4">
              <a 
                href="https://facebook.com/ammoogames" 
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Facebook"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
      
              <a 
                href="https://instagram.com/ammoogames" 
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C23.971 5.367 18.637.029 12.017.029zM15.99 7.007h-3.993c-.95 0-1.717.767-1.717 1.717v3.993c0 .95.767 1.717 1.717 1.717H15.99c.95 0 1.717-.767 1.717-1.717V8.724c0-.95-.767-1.717-1.717-1.717zm.81 5.71c0 .447-.363.81-.81.81h-3.993c-.447 0-.81-.363-.81-.81V8.724c0-.447.363-.81.81-.81H15.99c.447 0 .81.363.81.81v3.993z"/>
                </svg>
              </a>
            </div>
          </div>


          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <a href="/contact" className="text-gray-300 hover:text-white transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="/shipping" className="text-gray-300 hover:text-white transition-colors">
                  Shipping Info
                </a>
              </li>
              <li>
                <a href="/returns" className="text-gray-300 hover:text-white transition-colors">
                  Returns & Exchanges
                </a>
              </li>
              <li>
                <a href="/faq" className="text-gray-300 hover:text-white transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="/size-guide" className="text-gray-300 hover:text-white transition-colors">
                  Size Guide
                </a>
              </li>
            </ul>
          </div>

          {/* Shop Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Shop Information</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 mt-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <p className="text-gray-300">123 Gaming Street</p>
                  <p className="text-gray-300">Arcade City, AC 12345</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <p className="text-gray-300">shop@ammooarcade.com</p>
              </div>
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <p className="text-gray-300">(555) 123-4567</p>
              </div>
            </div>
          </div>
        </div>

        

        {/* Bottom Footer */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © {currentYear} Ammoo Arcade. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="/terms" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="/cookies" className="text-gray-400 hover:text-white transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}