import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import { Trophy } from 'lucide-react';
import { toast } from 'react-hot-toast';

// Interfaces... (Keep them if they match or update if needed)
// Assuming interfaces are compatible since I returned JSON with same structure

const STATIC_CHALLENGES = {
  coding: { key: 'codingSkillsChallengeData', title: 'Coding Skills', folder: 'Coding_Skills_Cards', file: 'coding_skills', id: 'coding', category: 'Coding Skills' },
  fitness: { key: 'fitnessChallengeData', title: 'Fitness', folder: 'Fitness_Cards', file: 'fitness', id: 'fitness', category: 'Fitness' },
  health: { key: 'healthChallengeData', title: 'Health & Wellness', folder: 'Health_and_Wealthness_Cards', file: 'health_and_wealthness', id: 'health', category: 'Health & Wellness' },
  mindfulness: { key: 'mindfullnessChallengeData', title: 'Mindfulness', folder: 'Mindfullness_Cards', file: 'mindfullness', id: 'mindfulness', category: 'Mindfulness' },
  productivity: { key: 'productivityChallengeData', title: 'Productivity', folder: 'Produdctivity_Cards', file: 'productivity', id: 'productivity', category: 'Productivity' },
  relationship: { key: 'relationshipChallengeData', title: 'Relationship', folder: 'Relationship_Cards', file: 'relationship', id: 'relationship', category: 'Relationship' },
};

const ChallengesPage: React.FC = () => {
  const [availableChallenges, setAvailableChallenges] = useState<any[]>([]);
  const [userChallenges, setUserChallenges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const loadData = async () => {
        setLoading(true);
        await Promise.all([fetchChallenges(), fetchUserChallenges()]);
        setLoading(false);
      };
      loadData();
    }
  }, [user]);

  const fetchChallenges = async () => {
    try {
      const { data } = await api.get('/challenges');
      setAvailableChallenges(data || []);
    } catch (error) {
      console.error('Error fetching challenges:', error);
      toast.error('Failed to load challenges');
    }
  };

  const fetchUserChallenges = async () => {
    try {
      const { data } = await api.get('/user-challenges');
      let dbChallenges = data || [];

      // Sync with localStorage for static challenges
      const userId = user?.id;
      // If we don't have a user, we can't really isolate, but we can fallback or just wait.
      // Assuming we are logged in on this page.

      const staticUserChallenges: any[] = [];

      Object.values(STATIC_CHALLENGES).forEach((config) => {
        // Namespace the key with userId if available
        const storageKey = userId ? `${userId}_${config.key}` : config.key;

        const savedData = localStorage.getItem(storageKey);

        if (savedData) {
          try {
            const parsed = JSON.parse(savedData);
            const completedDays = parsed.completedDays || [];
            const count = completedDays.length; // Ensure this line matches the target context exactly or replace the block around it

            // Only show if user has actually started (completed at least 1 day) or if it exists in storage (implies started)
            // Actually, simply opening the page might not set storage unless they click something, 
            // but the static files call saveUserData() on init if legacy data exists? No, usually on interaction.
            // Let's assume if key exists, they engaged.

            if (count > 0 || parsed.currentStreak > 0) {
              // Determine current tier duration
              let currentDuration = 30;
              let fileSuffix = '30days.html';

              if (count > 60) {
                currentDuration = 100;
                fileSuffix = '100days.html';
              } else if (count > 30) {
                currentDuration = 60;
                fileSuffix = '60days.html';
              }

              // Construct the URL with userId param
              const staticUrl = `/all_challenges_cards/${config.folder}/${config.file}_${fileSuffix}${userId ? `?userId=${userId}` : ''}`;

              staticUserChallenges.push({
                _id: `static-${config.id}`,
                challenge_id: {
                  title: `${config.title} Challenge`,
                  description: `Your progress in the ${config.title} challenge. Track your daily achievements!`,
                  duration_days: currentDuration,
                  category: config.category
                },
                status: 'active',
                current_day: count,
                isStatic: true,
                staticUrl: staticUrl
              });
            }
          } catch (e) {
            console.error(`Error parsing static data for ${config.id}`, e);
          }
        }
      });

      // Merge: Static challenges first for visibility, or mix?
      // Let's put static ones first as they are "Recent"
      setUserChallenges([...staticUserChallenges, ...dbChallenges]);

    } catch (error) {
      console.error('Error fetching user challenges:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container-custom py-8" style={{ maxWidth: '100%', padding: '70px' }}>
      <h1 className="text-3xl font-bold mb-8">Challenges</h1>

      {/* My Challenges */}
      {userChallenges.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <Trophy className="w-6 h-6 text-yellow-500 mr-2" />
            My Challenges
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userChallenges.map((uc) => (
              <div
                key={uc._id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-100 dark:border-gray-700 cursor-pointer hover:shadow-xl transition-all"
                onClick={() => {
                  if (uc.isStatic) {
                    window.location.href = uc.staticUrl;
                  } else {
                    navigate(`/challenge-details?interest=${encodeURIComponent(uc.challenge_id.category)}&duration=${uc.challenge_id.duration_days}`);
                  }
                }}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold">{uc.challenge_id.title}</h3>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${uc.status === 'completed' ? 'bg-green-100 text-green-800' :
                    uc.status === 'abandoned' ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                    {uc.status.charAt(0).toUpperCase() + uc.status.slice(1)}
                  </span>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                  {uc.challenge_id.description}
                </p>

                {/* Progress */}
                <div className="mb-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Progress</span>
                    <span>{Math.round((uc.current_day / uc.challenge_id.duration_days) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full ${uc.status === 'completed' ? 'bg-green-500' : 'bg-blue-500'}`}
                      style={{
                        width: `${Math.min((uc.current_day / uc.challenge_id.duration_days) * 100, 100)}%`
                      }}
                    ></div>
                  </div>
                </div>
                <div className="text-xs text-gray-500 text-right">
                  Day {uc.current_day} of {uc.challenge_id.duration_days}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available Challenges */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Available Challenges</h2>
        <div className="flex flex-col space-y-6">
          {availableChallenges.map((challenge: any) => (
            <div
              key={challenge._id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden cursor-pointer p-6 mb-6 hover:bg-gray-50 transition-colors"
              onClick={() => navigate(`/challenge-details?interest=${encodeURIComponent(challenge.category)}&duration=${challenge.duration_days}`)}
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-sm font-medium px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                  {challenge.category.replace(/-/g, ' ')}
                </span>
                <span className="text-sm font-medium px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                  {challenge.duration_days} days
                </span>
              </div>
              <h3 className="text-lg font-medium mb-2">{challenge.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{challenge.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChallengesPage;