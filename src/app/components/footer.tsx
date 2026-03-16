import { Link } from 'react-router';
import { Facebook, Instagram, Youtube } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Club Info */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <img
                src="/rvibs_logo.jpeg"
                alt="RVIBS FC"
                className="w-12 h-12 rounded-full object-cover shadow-lg"
              />
              <div>
                <div className="text-gray-900 font-black text-lg">RVIBS FC</div>
                <div className="text-gray-600 text-xs font-medium">FOOTBALL CLUB</div>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Rift Valley Institute of Business Studies Football Club. Nakuru, Kenya.
            </p>
            <div className="flex space-x-3">
              <a
                href="https://www.facebook.com/p/RVIBS-FC-61558837341794/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-blue-100 hover:bg-blue-800 hover:text-white text-blue-800 flex items-center justify-center transition-colors duration-200"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://www.instagram.com/rvib_seals/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-blue-100 hover:bg-blue-800 hover:text-white text-blue-800 flex items-center justify-center transition-colors duration-200"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://www.youtube.com/@riftvalleyinstituteofbusin4338"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-blue-100 hover:bg-blue-800 hover:text-white text-blue-800 flex items-center justify-center transition-colors duration-200"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-gray-900 font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-600 hover:text-blue-800 text-sm transition-colors duration-200">Home</Link></li>
              <li><Link to="/fixtures" className="text-gray-600 hover:text-blue-800 text-sm transition-colors duration-200">Fixtures</Link></li>
              <li><Link to="/results" className="text-gray-600 hover:text-blue-800 text-sm transition-colors duration-200">Results</Link></li>
              <li><Link to="/standings" className="text-gray-600 hover:text-blue-800 text-sm transition-colors duration-200">Standings</Link></li>
            </ul>
          </div>

          {/* Club */}
          <div>
            <h3 className="text-gray-900 font-bold mb-4">Club</h3>
            <ul className="space-y-2">
              <li><Link to="/news" className="text-gray-600 hover:text-blue-800 text-sm transition-colors duration-200">News</Link></li>
              <li><Link to="/gallery" className="text-gray-600 hover:text-blue-800 text-sm transition-colors duration-200">Gallery</Link></li>
              <li><Link to="/contact" className="text-gray-600 hover:text-blue-800 text-sm transition-colors duration-200">Contact</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-gray-900 font-bold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="text-gray-600 text-sm">Seals Arena</li>
              <li className="text-gray-600 text-sm">Nakuru, Kenya</li>
              <li className="text-gray-600 text-sm">Rvibseals@gmail.com</li>
              <li className="text-gray-600 text-sm">0715 111 101</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-600 text-sm">
              &copy; 2026 RVIBS Football Club. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-600 hover:text-blue-800 text-sm transition-colors duration-200">Privacy Policy</a>
              <a href="#" className="text-gray-600 hover:text-blue-800 text-sm transition-colors duration-200">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
