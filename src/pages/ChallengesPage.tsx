import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Target, ChevronRight, Trophy } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface DailyTask {
  id: string;
  task: string;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  duration_days: number;
  difficulty: string;
  category: string;
  daily_tasks: DailyTask[];
}

interface UserChallenge {
  id: string;
  challenge_id: string;
  current_day: number;
  status: string;
  challenge: Challenge;
}

const ChallengesPage: React.FC = () => {
  const [availableChallenges, setAvailableChallenges] = useState<Challenge[]>([]);
  const [activeChallenge, setActiveChallenge] = useState<UserChallenge | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChallenges();
    fetchActiveChallenge();
  }, []);

  const fetchChallenges = async () => {
    try {
      const { data, error } = await supabase
        .from('challenges')
        .select('*');
      
      if (error) throw error;
      setAvailableChallenges(data || []);
    } catch (error) {
      console.error('Error fetching challenges:', error);
      toast.error('Failed to load challenges');
    }
  };

  const fetchActiveChallenge = async () => {
    try {
      const { data, error } = await supabase
        .from('user_challenges')
        .select(`
          *,
          challenge:challenges(*)
        `)
        .eq('status', 'in_progress')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setActiveChallenge(data);
    } catch (error) {
      console.error('Error fetching active challenge:', error);
    } finally {
      setLoading(false);
    }
  };

  const startChallenge = async (challengeId: string) => {
    try {
      const { error } = await supabase
        .from('user_challenges')
        .insert({
          challenge_id: challengeId,
          status: 'in_progress',
        });

      if (error) throw error;
      
      toast.success('Challenge started!');
      fetchActiveChallenge();
    } catch (error) {
      console.error('Error starting challenge:', error);
      toast.error('Failed to start challenge');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container-custom py-8" style={{ maxWidth: '100%', padding: '70px'}}>
      <h1 className="text-3xl font-bold mb-8">Challenges</h1>

      {/* Active Challenge */}
      {activeChallenge && (
        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Current Challenge</h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-medium mb-2">
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
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${(activeChallenge.current_day / activeChallenge.challenge.duration_days) * 100}%`
                      }}
                    ></div>
                  </div>
                </div>

                {/* Today's Task */}
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <h4 className="font-medium mb-2">Today's Task</h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    {activeChallenge.challenge.daily_tasks[activeChallenge.current_day - 1]?.task}
                  </p>
                </div>
              </div>
              
              <Trophy className="w-12 h-12 text-yellow-500" />
            </div>
          </div>
        </div>
      )}

      {/* Available Challenges */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Available Challenges</h2>
        <div className="flex flex-col space-y-6">
{[
  {id: '1', title: 'Coding Skills 30-Day Challenge', description: 'Improve your coding skills in 30 days.', duration_days: 30, category: 'coding-skills'},
  {id: '2', title: 'Coding Skills 60-Day Challenge', description: 'Improve your coding skills in 60 days.', duration_days: 60, category: 'coding-skills'},
  {id: '3', title: 'Coding Skills 100-Day Challenge', description: 'Improve your coding skills in 100 days.', duration_days: 100, category: 'coding-skills'},
  {id: '4', title: 'Fitness 30-Day Challenge', description: 'Boost your fitness in 30 days.', duration_days: 30, category: 'fitness'},
  {id: '5', title: 'Fitness 60-Day Challenge', description: 'Boost your fitness in 60 days.', duration_days: 60, category: 'fitness'},
  {id: '6', title: 'Fitness 100-Day Challenge', description: 'Boost your fitness in 100 days.', duration_days: 100, category: 'fitness'},
  {id: '7', title: 'Health and Wellness 30-Day Challenge', description: 'Enhance your health and wellness in 30 days.', duration_days: 30, category: 'health-and-wellness'},
  {id: '8', title: 'Health and Wellness 60-Day Challenge', description: 'Enhance your health and wellness in 60 days.', duration_days: 60, category: 'health-and-wellness'},
  {id: '9', title: 'Health and Wellness 100-Day Challenge', description: 'Enhance your health and wellness in 100 days.', duration_days: 100, category: 'health-and-wellness'},
  {id: '10', title: 'Mindfulness 30-Day Challenge', description: 'Practice mindfulness in 30 days.', duration_days: 30, category: 'mindfulness'},
  {id: '11', title: 'Mindfulness 60-Day Challenge', description: 'Practice mindfulness in 60 days.', duration_days: 60, category: 'mindfulness'},
  {id: '12', title: 'Mindfulness 100-Day Challenge', description: 'Practice mindfulness in 100 days.', duration_days: 100, category: 'mindfulness'},
  {id: '13', title: 'Productivity 30-Day Challenge', description: 'Increase productivity in 30 days.', duration_days: 30, category: 'productivity'},
  {id: '14', title: 'Productivity 60-Day Challenge', description: 'Increase productivity in 60 days.', duration_days: 60, category: 'productivity'},
  {id: '15', title: 'Productivity 100-Day Challenge', description: 'Increase productivity in 100 days.', duration_days: 100, category: 'productivity'},
  {id: '16', title: 'Relationships 30-Day Challenge', description: 'Improve relationships in 30 days.', duration_days: 30, category: 'relationships'},
  {id: '17', title: 'Relationships 60-Day Challenge', description: 'Improve relationships in 60 days.', duration_days: 60, category: 'relationships'},
  {id: '18', title: 'Relationships 100-Day Challenge', description: 'Improve relationships in 100 days.', duration_days: 100, category: 'relationships'},
].map(challenge => (
  <div
    key={challenge.id}
    className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden cursor-pointer p-6 mb-6"
    onClick={() => window.location.href = `/challenge-details?interest=${encodeURIComponent(challenge.category)}&duration=${challenge.duration_days}`}
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