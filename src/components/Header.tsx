import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sun, Moon, Menu, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Handle scroll events to change header style
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Check if we are on a public page (Landing, Login, Signup)
  const isPublicPage = ['/', '/signin', '/signup'].includes(location.pathname);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-30 transition-all duration-300 ${isScrolled
        ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow-md py-3'
        : 'bg-transparent py-5'
        } ${!isPublicPage ? 'ml-20 md:ml-64' : ''}`}
    >
      <div className="container-custom flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <span className={`text-2xl font-display font-bold ${location.pathname === '/' && !isScrolled
            ? 'text-white'
            : 'bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'
            }`}>
            DailyMotive
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            to="/"
            className={`font-medium transition-colors ${location.pathname === '/'
              ? (isScrolled ? 'text-blue-600 dark:text-blue-400' : 'text-blue-100 hover:text-white')
              : (isScrolled ? 'hover:text-blue-600 dark:hover:text-blue-400' : 'text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400')
              } ${location.pathname === '/' && isScrolled ? 'text-blue-600 dark:text-blue-400' : ''
              }`}
          >
            Home
          </Link>
          <Link
            to="/explore"
            className={`font-medium transition-colors ${location.pathname === '/explore'
              ? 'text-blue-600 dark:text-blue-400'
              : (location.pathname === '/' && !isScrolled
                ? 'text-blue-100 hover:text-white'
                : 'hover:text-blue-600 dark:hover:text-blue-400')
              }`}
          >
            Explore
          </Link>
          <Link
            to="/favorites"
            className={`font-medium transition-colors ${location.pathname === '/favorites'
              ? 'text-blue-600 dark:text-blue-400'
              : (location.pathname === '/' && !isScrolled
                ? 'text-blue-100 hover:text-white'
                : 'hover:text-blue-600 dark:hover:text-blue-400')
              }`}
          >
            Favorites
          </Link>
          <Link
            to="/tracker"
            className={`font-medium transition-colors ${location.pathname === '/tracker'
              ? 'text-blue-600 dark:text-blue-400'
              : (location.pathname === '/' && !isScrolled
                ? 'text-blue-100 hover:text-white'
                : 'hover:text-blue-600 dark:hover:text-blue-400')
              }`}
          >
            Goal Tracker
          </Link>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? (
              <Moon size={20} className={`${location.pathname === '/' && !isScrolled ? 'text-white' : 'text-gray-800'}`} />
            ) : (
              <Sun size={20} className="text-gray-200" />
            )}
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X size={24} className={`${location.pathname === '/' && !isScrolled ? 'text-white' : 'text-gray-800 dark:text-gray-200'}`} />
          ) : (
            <Menu size={24} className={`${location.pathname === '/' && !isScrolled ? 'text-white' : 'text-gray-800 dark:text-gray-200'}`} />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white dark:bg-gray-900 shadow-lg animate-fade-in">
          <div className="container-custom py-4 flex flex-col space-y-4">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg font-medium ${location.pathname === '/'
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
            >
              Home
            </Link>
            <Link
              to="/explore"
              className={`px-4 py-2 rounded-lg font-medium ${location.pathname === '/explore'
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
            >
              Explore
            </Link>
            <Link
              to="/favorites"
              className={`px-4 py-2 rounded-lg font-medium ${location.pathname === '/favorites'
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
            >
              Favorites
            </Link>
            <Link
              to="/tracker"
              className={`px-4 py-2 rounded-lg font-medium ${location.pathname === '/tracker'
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
            >
              Goal Tracker
            </Link>

            <div className="flex items-center px-4 py-2">
              <span className="mr-2">
                {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
              </span>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                {theme === 'light' ? (
                  <Moon size={20} className="text-gray-800" />
                ) : (
                  <Sun size={20} className="text-gray-200" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;