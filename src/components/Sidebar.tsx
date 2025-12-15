import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Settings, Award, Target, Bell, LogOut, Menu, ChevronRight, Info, LucideIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';

// Define types for the challenge data
interface Challenge {
  id: string;
  title: string;
  description: string;
  category: string;
  duration_days: number;
  difficulty: 'easy' | 'medium' | 'hard';
}


const Sidebar: React.FC = () => {
  const { profile, signOut, selectedInterests } = useAuth();
  const [isOpen, setIsOpen] = useState(true);
  const [challenges, setChallenges] = useState<Challenge[]>([]);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        if (selectedInterests.length === 0) {
          setChallenges([]);
          return;
        }

        // Use custom API to fetch challenges
        const { data } = await api.get('/challenges');

        // Filter by selected interests
        // Note: API returns all challenges. Optimal way is to filter on backend, 
        // but for now we filter on frontend to match previous logic.
        const filtered = data.filter((c: Challenge) => selectedInterests.includes(c.category));
        setChallenges(filtered || []);
      } catch (error) {
        console.error('Error fetching challenges:', error);
      }
    };

    fetchChallenges();
  }, [selectedInterests]);

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-20 left-4 z-50 md:hidden p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg"
      >
        <Menu size={24} />
      </button>

      <div className={`
        fixed top-0 left-0 h-screen bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 z-40
        ${isOpen ? 'w-64' : 'w-20'} pt-20
      `}>
        {/* Toggle button for desktop */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="hidden md:block absolute -right-3 top-24 bg-white dark:bg-gray-800 rounded-full p-1 shadow-lg"
        >
          <ChevronRight size={20} className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* User Profile Section */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.username || 'User'}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              )}
            </div>
            {isOpen && (
              <div className="overflow-hidden">
                <h3 className="font-medium truncate">{profile?.username || 'User'}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{profile?.email || ''}</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-4">
          <ul className="space-y-2">
            <NavItem to="/profile" icon={Settings} text="Profile Settings" isOpen={isOpen} />
            <NavItem to="/challenges" icon={Target} text="My Challenges" isOpen={isOpen} />
            <NavItem to="/badges" icon={Award} text="My Badges" isOpen={isOpen} />
            <NavItem to="/notifications" icon={Bell} text="Notifications" isOpen={isOpen} />
            <NavItem to="/details" icon={Info} text="Details" isOpen={isOpen} />
          </ul>

          {/* Display challenge cards filtered by selected interests */}
          {isOpen && challenges.length > 0 && (
            <div className="mt-6 px-4 overflow-y-auto max-h-[calc(100vh-300px)]">
              <h4 className="text-lg font-semibold mb-4">Challenges Based on Your Interests</h4>
              <div className="grid grid-cols-1 gap-4">
                {challenges.map((challenge) => (
                  <div
                    key={challenge.id}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => window.location.href = `/challenge-details?interest=${encodeURIComponent(challenge.category)}&duration=${challenge.duration_days}`}
                  >
                    <h5 className="text-md font-medium mb-1">{challenge.title}</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{challenge.description}</p>
                    <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                      <span>{challenge.duration_days} days</span>
                      <span className="capitalize">{challenge.difficulty}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => signOut()}
              className={`flex items-center w-full rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors p-2 ${isOpen ? 'justify-start space-x-3' : 'justify-center'}`}
            >
              <LogOut size={20} />
              {isOpen && <span>Sign Out</span>}
            </button>
          </div>
        </nav>
      </div>
    </>
  );
};

interface NavItemProps {
  to: string;
  icon: LucideIcon;
  text: string;
  isOpen: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon: Icon, text, isOpen }) => {
  return (
    <li>
      <Link
        to={to}
        className={`flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${isOpen ? 'justify-start space-x-3' : 'justify-center'}`}
      >
        <Icon size={20} className="text-gray-500 dark:text-gray-400" />
        {isOpen && <span>{text}</span>}
      </Link>
    </li>
  );
};

export default Sidebar;