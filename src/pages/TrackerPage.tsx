import React from 'react';
import GoalTracker from '../components/GoalTracker';

const TrackerPage: React.FC = () => {
  return (
    <div className="container-custom pt-28 pb-12">
      <h1 className="text-3xl md:text-4xl font-bold mb-4">Goal Tracker</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Set and track your personal growth goals to stay motivated and focused on your journey.
      </p>
      
      <GoalTracker />
    </div>
  );
};

export default TrackerPage;