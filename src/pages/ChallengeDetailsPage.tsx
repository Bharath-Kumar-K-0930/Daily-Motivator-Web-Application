import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Target, ArrowLeft, Check, Trophy, Download } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

function ChallengeDetailsPage() {
  const [searchParams] = useSearchParams();
  const interest = searchParams.get('interest');
  const duration = searchParams.get('duration');
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [challenge, setChallenge] = useState<Record<string, any> | null>(null);
  const [currentDay, setCurrentDay] = useState(1);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [showBadge, setShowBadge] = useState(false);
  const [allChallenges, setAllChallenges] = useState<Array<Record<string, any>>>([]);

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

  useEffect(() => {
    if (interest !== null && duration !== null) {
      fetchChallengeDetails();
      fetchAllChallenges();
    }
  }, [interest, duration]);

  const fetchAllChallenges = async () => {
    try {
      const { data, error } = await supabase
        .from('challenges')
        .select('*');

      if (error) throw error;
      setAllChallenges(data || []);
    } catch (error) {
      console.error('Error fetching all challenges:', error);
    }
  };

  const fetchChallengeDetails = async () => {
    try {
      const { data: challengeData, error: challengeError } = await supabase
        .from('challenges')
        .select('*')
        .eq('category', interest)
        .eq('duration_days', duration)
        .single();

      if (challengeError) throw challengeError;
      setChallenge(challengeData);

      // Fetch user's progress if they have an active challenge
      if (user) {
        const { data: progressData, error: progressError } = await supabase
          .from('user_challenges')
          .select('*')
          .eq('user_id', user.id)
          .eq('challenge_id', challengeData.id)
          .single();

        if (!progressError && progressData) {
          setCurrentDay(progressData.current_day);
          setCompletedTasks(progressData.completed_tasks || []);
        }
      }
    } catch (error) {
      console.error('Error fetching challenge details:', error);
      toast.error('Failed to load challenge details');
    }
  };

  const completeTask = async (taskId: string) => {
    try {
      if (!challenge) return;
      const newCompletedTasks = [...completedTasks, taskId];
      const newCurrentDay = currentDay + 1;

      const { error } = await supabase
        .from('user_challenges')
        .update({
          completed_tasks: newCompletedTasks,
          current_day: newCurrentDay,
          status: newCurrentDay > challenge.duration_days ? 'completed' : 'in_progress',
          completed_at: newCurrentDay > challenge.duration_days ? new Date().toISOString() : null
        })
        .eq('user_id', user?.id)
        .eq('challenge_id', challenge.id);

      if (error) throw error;

      setCompletedTasks(newCompletedTasks);
      setCurrentDay(newCurrentDay);

      // Check if challenge is completed
      if (newCurrentDay > challenge.duration_days) {
        await awardBadge();
        setShowBadge(true);
        toast.success('Congratulations! You have completed the challenge and earned a badge!');
      }

      toast.success('Task completed!');
    } catch (error) {
      console.error('Error updating progress:', error);
      toast.error('Failed to update progress');
    }
  };

  const awardBadge = async () => {
    try {
      if (!challenge) return;
      // Find the appropriate badge for this challenge
      const { data: badge, error: badgeError } = await supabase
        .from('badges')
        .select('*')
        .eq('category', interest)
        .eq('requirements->days_completed', duration)
        .single();

      if (badgeError) throw badgeError;

      // Award the badge to the user
      const { error: awardError } = await supabase
        .from('user_badges')
        .insert({
          user_id: user?.id,
          badge_id: badge.id
        });

      if (awardError) throw awardError;
    } catch (error) {
      console.error('Error awarding badge:', error);
    }
  };

  const downloadBadge = async () => {
    try {
      if (!challenge) return;
      const { data: badge } = await supabase
        .from('badges')
        .select('*')
        .eq('category', interest)
        .eq('requirements->days_completed', duration)
        .single();

      // Create a temporary link to download the badge image
      const link = document.createElement('a');
      link.href = badge.image_url;
      link.download = `${badge.name}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('Badge downloaded successfully!');
    } catch (error) {
      console.error('Error downloading badge:', error);
      toast.error('Failed to download badge');
    }
  };

  const startChallenge = async () => {
    try {
      if (!challenge) return;
      setLoading(true);
      const { error } = await supabase
        .from('user_challenges')
        .insert({
          user_id: user?.id,
          challenge_id: challenge.id,
          status: 'in_progress',
          current_day: 1,
          completed_tasks: []
        });

      if (error) throw error;

      toast.success('Challenge started successfully!');
      setCurrentDay(1);
      setCompletedTasks([]);
    } catch (error) {
      console.error('Error starting challenge:', error);
      toast.error('Failed to start challenge');
    } finally {
      setLoading(false);
    }
  };

  if (!challenge) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container-custom py-8">
      <button
        onClick={() => navigate('/home')}
        className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 mb-8"
      >
        <ArrowLeft size={20} className="mr-2" />
        Back to Home
      </button>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-4">{challenge?.title || 'Select a Challenge'}</h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
              {challenge?.description || 'Please select a challenge from the list below.'}
            </p>
            <div className="flex items-center space-x-4">
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm">
                {duration ? `${duration} Days` : ''}
              </span>
              <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-full text-sm">
                {challenge?.difficulty || ''}
              </span>
            </div>
          </div>
          <Target className="w-16 h-16 text-blue-600 dark:text-blue-400" />
        </div>

        {/* Challenges List */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 max-h-[600px] overflow-y-auto">
          {allChallenges.map((ch) => {
            const isSelected = ch.category === interest && ch.duration_days.toString() === duration;
            const href = challengeFileMap[ch.category]?.[ch.duration_days] || '#';
            return (
              <div
                key={ch.id}
                className={`cursor-pointer rounded-lg p-4 border ${isSelected ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'border-transparent'}`}
                onClick={() => window.location.href = href}
              >
                <h3 className="font-semibold mb-2">{ch.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{ch.description}</p>
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>{ch.duration_days} days</span>
                  <span>{ch.category.replace(/-/g, ' ')}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Challenge Details */}
        {challenge && (
          <>
            {/* Progress Section */}
            {currentDay > 1 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-4">Your Progress</h2>
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Day {currentDay - 1} of {challenge.duration_days}</span>
                    <span>{Math.round(((currentDay - 1) / challenge.duration_days) * 100)}% Complete</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${((currentDay - 1) / challenge.duration_days) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            {/* Today's Task */}
            {currentDay <= challenge.duration_days && (
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-4">Today's Task</h2>
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
                  <h3 className="font-medium text-lg mb-2">Day {currentDay}</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    {challenge.daily_tasks[currentDay - 1]?.task}
                  </p>
                  <button
                    onClick={() => completeTask(challenge.daily_tasks[currentDay - 1]?.id)}
                    className="btn-primary flex items-center"
                  >
                    <Check size={20} className="mr-2" />
                    Complete Task
                  </button>
                </div>
              </div>
            )}

            {/* Completed Challenge Badge */}
            {showBadge && (
              <div className="text-center py-8 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg mb-8">
                <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Congratulations!</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  You've completed the {challenge.title}! Download your badge of achievement.
                </p>
                <button
                  onClick={downloadBadge}
                  className="btn-primary flex items-center mx-auto"
                >
                  <Download size={20} className="mr-2" />
                  Download Badge
                </button>
              </div>
            )}

            {/* Start Challenge Button */}
            {!currentDay && (
              <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
                <button
                  onClick={startChallenge}
                  disabled={loading}
                  className="btn-primary w-full flex items-center justify-center"
                >
                  {loading ? (
                    'Starting Challenge...'
                  ) : (
                    <>
                      <Check size={20} className="mr-2" />
                      Start {duration}-Day Challenge
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ChallengeDetailsPage;