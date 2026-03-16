import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { Menu, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const navLinks = [
  { name: 'Home', path: '/' },
  { 
    name: 'Fixtures', 
    path: '/fixtures',
    subLinks: [
      { name: 'Results', path: '/results' },
      { name: 'Standings', path: '/standings' }
    ]
  },
  { name: 'Squad', path: '/team' },
  { name: 'News', path: '/news' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'The Seal Den', path: '/fans' },
  { name: 'Contact', path: '/contact' },
];

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100'
            : 'bg-white/90 backdrop-blur-sm'
        }`}
      >
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <img 
                src="/src/images/rvibs_logo.jpeg" 
                alt="RVIBS FC Logo" 
                className="w-12 h-12 rounded-full object-cover transform group-hover:scale-110 transition-transform duration-300 shadow-lg"
              />
              <div className="hidden sm:block">
                <div className="text-gray-900 font-black text-xl tracking-tight">RVIBS FC</div>
                <div className="text-gray-600 text-xs tracking-wider font-medium">FOOTBALL CLUB</div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => (
                <div key={link.path} className="relative group">
                  <Link
                    to={link.path}
                    className={`px-4 py-2 text-sm font-medium tracking-wide transition-all duration-200 relative flex items-center gap-1 ${
                      location.pathname === link.path || (link.subLinks && link.subLinks.some(sub => location.pathname === sub.path))
                        ? 'text-blue-900'
                        : 'text-gray-700 hover:text-blue-900'
                    }`}
                  >
                    {link.name}
                    {link.subLinks && <ChevronDown className="w-4 h-4" />}
                    <span
                      className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-900 to-yellow-500 transform origin-left transition-transform duration-300 ${
                        location.pathname === link.path || (link.subLinks && link.subLinks.some(sub => location.pathname === sub.path))
                          ? 'scale-x-100'
                          : 'scale-x-0 group-hover:scale-x-100'
                      }`}
                      style={{ background: 'linear-gradient(90deg, #00529F 0%, #FEBE10 100%)' }}
                    />
                  </Link>
                  {link.subLinks && (
                    <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      {link.subLinks.map((subLink) => (
                        <Link
                          key={subLink.path}
                          to={subLink.path}
                          className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-900 first:rounded-t-lg last:rounded-b-lg transition-colors duration-200"
                        >
                          {subLink.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-4">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6 text-gray-700" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-700" />
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 lg:hidden"
            style={{ top: '80px' }}
          >
            <div className="absolute inset-0 bg-white/95 backdrop-blur-lg">
              <div className="max-w-lg mx-auto px-4 py-8">
                <div className="space-y-2">
                  {navLinks.map((link, index) => (
                    <motion.div
                      key={link.path}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        to={link.path}
                        className={`block px-6 py-4 text-lg font-medium rounded-xl transition-all duration-200 ${
                          location.pathname === link.path || (link.subLinks && link.subLinks.some(sub => location.pathname === sub.path))
                            ? 'bg-gradient-to-r from-blue-800 to-blue-900 text-white'
                            : 'text-gray-700 hover:bg-gray-100 hover:text-blue-800'
                        }`}
                      >
                        {link.name}
                      </Link>
                      {link.subLinks && (
                        <div className="ml-4 mt-2 space-y-2">
                          {link.subLinks.map((subLink) => (
                            <Link
                              key={subLink.path}
                              to={subLink.path}
                              className={`block px-6 py-3 text-base font-medium rounded-xl transition-all duration-200 ${
                                location.pathname === subLink.path
                                  ? 'bg-blue-100 text-blue-900'
                                  : 'text-gray-600 hover:bg-gray-50 hover:text-blue-800'
                              }`}
                            >
                              {subLink.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
