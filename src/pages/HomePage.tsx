import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Trophy, Target, ArrowRight, Clock, Sparkles } from 'lucide-react';
import QuoteCard from '../components/QuoteCard';
import { useQuotes } from '../context/QuoteContext';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';

const HomePage: React.FC = () => {
  const { dailyQuote } = useQuotes();
  const { user, profile } = useAuth();
  const [selectedInterest, setSelectedInterest] = useState<string | null>(null);
  const [activeChallenge, setActiveChallenge] = useState<any>(null);
  const [isQuoteAnimated, setIsQuoteAnimated] = useState(false);

  useEffect(() => {
    if (user) {
      fetchActiveChallenge();
    }
  }, [user]);

  const fetchActiveChallenge = async () => {
    try {
      const { data } = await api.get('/user-challenges/active');
      setActiveChallenge(data);
    } catch (error) {
      console.error('Error fetching active challenge:', error);
    }
  };

  const interests = [
    {
      id: 'health',
      name: 'Health & Wellness',
      description: 'Improve your physical and mental well-being',
      image: 'https://images.pexels.com/photos/3759658/pexels-photo-3759658.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    },
    {
      id: 'fitness',
      name: 'Fitness',
      description: 'Achieve your fitness goals',
      image: 'https://images.pexels.com/photos/2294361/pexels-photo-2294361.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    },
    {
      id: 'coding',
      name: 'Coding Skills',
      description: 'Enhance your programming abilities',
      image: 'https://images.pexels.com/photos/2004161/pexels-photo-2004161.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    },
    {
      id: 'mindfulness',
      name: 'Mindfulness',
      description: 'Practice meditation and mindfulness',
      image: 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    },
    {
      id: 'productivity',
      name: 'Productivity',
      description: 'Boost your daily efficiency',
      image: 'https://images.pexels.com/photos/1485548/pexels-photo-1485548.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    },
    {
      id: 'relationships',
      name: 'Relationships',
      description: 'Build stronger connections',
      image: 'https://images.pexels.com/photos/2235071/pexels-photo-2235071.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    }
  ];

  return (
    <div className="container-custom py-8">
      {/* Welcome Section */}
      <div className="mb-12 text-center" style={{ paddingTop: '50px' }}>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Welcome Back, {profile?.username || 'Explorer'}!
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Ready to continue your journey of growth and inspiration?
        </p>
      </div>

      {/* Active Challenge Section */}
      {activeChallenge && (
        <section className="mb-12 transform hover:scale-[1.02] transition-all duration-300">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <Trophy className="w-6 h-6 text-yellow-500 mr-2" />
            Your Active Challenge
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-start justify-between">
              <div className="flex-grow">
                <h3 className="text-xl font-semibold mb-2">
                  {activeChallenge.challenge.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {activeChallenge.challenge.description}
                </p>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress</span>
                    <span>
                      Day {activeChallenge.current_day} of {activeChallenge.challenge.duration_days}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2.5 rounded-full transition-all duration-1000 ease-out"
                      style={{
                        width: `${(activeChallenge.current_day / activeChallenge.challenge.duration_days) * 100}%`
                      }}
                    ></div>
                  </div>
                </div>

                {/* Today's Task */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4">
                  <h4 className="font-medium mb-2 flex items-center">
                    <Sparkles className="w-5 h-5 text-blue-500 mr-2" />
                    Today's Task
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    {activeChallenge.challenge.daily_tasks[activeChallenge.current_day - 1]?.task}
                  </p>
                </div>
              </div>
              <Trophy className="w-16 h-16 text-yellow-500 ml-4 animate-bounce" />
            </div>
          </div>
        </section>
      )}

      {/* Challenge Selection */}
      {!activeChallenge && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <Target className="w-6 h-6 text-blue-500 mr-2" />
            Choose Your Interest
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {interests.map((interest) => (
              <button
                key={interest.id}
                onClick={() => setSelectedInterest(interest.id)}
                className={`relative overflow-hidden rounded-xl transition-all duration-300 transform hover:scale-105 ${selectedInterest === interest.id
                  ? 'ring-2 ring-blue-500 dark:ring-blue-400'
                  : ''
                  }`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-black/60 to-black/40 z-10"></div>
                <img
                  src={interest.image}
                  alt={interest.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 z-20 p-6 flex flex-col justify-end text-white">
                  <h3 className="text-xl font-semibold mb-2">{interest.name}</h3>
                  <p className="text-sm text-white/90">
                    {interest.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Challenge Duration Cards */}
      {selectedInterest && !activeChallenge && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <Clock className="w-6 h-6 text-purple-500 mr-2" />
            Select Challenge Duration
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ChallengeDurationCard
              days={30}
              title="30-Day Sprint"
              description="Perfect for building new habits with focused, short-term goals"
              interest={selectedInterest}
              gradient="from-blue-500 to-cyan-500"
              userId={user?.id}
            />
            <ChallengeDurationCard
              days={60}
              title="60-Day Journey"
              description="Intermediate challenge for deeper skill development"
              interest={selectedInterest}
              gradient="from-purple-500 to-pink-500"
              userId={user?.id}
            />
            <ChallengeDurationCard
              days={100}
              title="100-Day Mastery"
              description="Complete transformation through long-term dedication"
              interest={selectedInterest}
              gradient="from-orange-500 to-red-500"
              userId={user?.id}
            />
          </div>
        </section>
      )}

      {/* Daily Quote Section */}
      <section>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold flex items-center">
            <Sparkles className="w-6 h-6 text-blue-500 mr-2" />
            Daily Inspiration
          </h2>
          <span className="text-sm bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-800 dark:text-blue-300 px-4 py-2 rounded-full font-medium">
            {new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>
        <div
          className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 md:p-8 rounded-2xl shadow-lg transform hover:scale-[1.02] transition-all duration-300"
          onMouseEnter={() => setIsQuoteAnimated(true)}
          onMouseLeave={() => setIsQuoteAnimated(false)}
        >
          <QuoteCard
            quote={dailyQuote}
            size="large"
            variant={isQuoteAnimated ? 'gradient' : 'default'}
          />
        </div>
      </section>
    </div>
  );
};

interface ChallengeDurationCardProps {
  days: number;
  title: string;
  description: string;
  interest: string;
  gradient: string;
  userId?: string;
}

const ChallengeDurationCard: React.FC<ChallengeDurationCardProps> = ({
  days,
  title,
  description,
  interest,
  gradient,
  userId
}) => {
  const navigate = useNavigate();


  // Map interest and days to the corresponding HTML file path
  const challengeFileMap: Record<string, Record<number, string>> = {
    health: {
      30: '/all_challenges_cards/Health_and_Wealthness_Cards/health_and_wealthness_30days.html',
      60: '/all_challenges_cards/Health_and_Wealthness_Cards/health_and_wealthness_60days.html',
      100: '/all_challenges_cards/Health_and_Wealthness_Cards/health_and_wealthness_100days.html',
    },
    fitness: {
      30: '/all_challenges_cards/Fitness_Cards/fitness_30days.html',
      60: '/all_challenges_cards/Fitness_Cards/fitness_60days.html',
      100: '/all_challenges_cards/Fitness_Cards/fitness_100days.html',
    },
    coding: {
      30: '/all_challenges_cards/Coding_Skills_Cards/coding_skills_30days.html',
      60: '/all_challenges_cards/Coding_Skills_Cards/coding_skills_60days.html',
      100: '/all_challenges_cards/Coding_Skills_Cards/coding_skills_100days.html',
    },
    mindfulness: {
      30: '/all_challenges_cards/Mindfullness_Cards/mindfullness_30days.html',
      60: '/all_challenges_cards/Mindfullness_Cards/mindfullness_60days.html',
      100: '/all_challenges_cards/Mindfullness_Cards/mindfullness_100days.html',
    },
    productivity: {
      30: '/all_challenges_cards/Produdctivity_Cards/productivity_30days.html',
      60: '/all_challenges_cards/Produdctivity_Cards/productivity_60days.html',
      100: '/all_challenges_cards/Produdctivity_Cards/productivity_100days.html',
    },
    relationships: {
      30: '/all_challenges_cards/Relationship_Cards/relationship_30days.html',
      60: '/all_challenges_cards/Relationship_Cards/relationship_60days.html',
      100: '/all_challenges_cards/Relationship_Cards/relationship_100days.html',
    },
  };

  const basePath = challengeFileMap[interest]?.[days] || '#';
  const href = userId && basePath !== '#' ? `${basePath}?userId=${userId}` : basePath;

  return (
    <div
      onClick={() => window.location.href = href}
      className="group relative overflow-hidden bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full p-3">
            <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {days}
          </span>
        </div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{description}</p>
        <div className="flex items-center text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform">
          <span className="font-medium">Start Challenge</span>
          <ArrowRight size={16} className="ml-1" />
        </div>
      </div>
    </div >
  );
};

export default HomePage;