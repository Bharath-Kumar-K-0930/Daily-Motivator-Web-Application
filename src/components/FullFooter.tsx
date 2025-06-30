import React from 'react';
import { Heart, Github, Twitter, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

const FullFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 dark:bg-gray-800 py-12 mt-16">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand section */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-display font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                DailyMotive
              </span>
            </Link>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Empowering your daily journey with inspiration and motivation.
            </p>
            <div className="mt-6 flex space-x-4">
              <a
                href="#"
                className="text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                aria-label="GitHub"
              >
                <Github size={20} />
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Links section */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/explore" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Explore
                </Link>
              </li>
              <li>
                <Link to="/favorites" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Favorites
                </Link>
              </li>
              <li>
                <Link to="/tracker" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Goal Tracker
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories section */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/explore?category=success" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Success
                </Link>
              </li>
              <li>
                <Link to="/explore?category=health" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Health
                </Link>
              </li>
              <li>
                <Link to="/explore?category=relationships" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Relationships
                </Link>
              </li>
              <li>
                <Link to="/explore?category=personal-growth" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Personal Growth
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal section */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-center text-gray-600 dark:text-gray-400">
            © {currentYear} DailyMotive. Made with <Heart size={16} className="inline text-accent-500" /> for a better day.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FullFooter;
