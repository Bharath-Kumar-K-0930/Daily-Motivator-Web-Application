import React, { useState, useEffect } from 'react';
import { Check, Plus, Trash2 } from 'lucide-react';
import { UserGoal } from '../types';

const GoalTracker: React.FC = () => {
  const [goals, setGoals] = useState<UserGoal[]>(() => {
    const savedGoals = localStorage.getItem('userGoals');
    return savedGoals ? JSON.parse(savedGoals) : [];
  });
  
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalDescription, setNewGoalDescription] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Save goals to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('userGoals', JSON.stringify(goals));
  }, [goals]);

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newGoalTitle.trim() === '') return;
    
    const newGoal: UserGoal = {
      id: Date.now().toString(),
      title: newGoalTitle,
      description: newGoalDescription,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    
    setGoals([...goals, newGoal]);
    setNewGoalTitle('');
    setNewGoalDescription('');
    setIsFormOpen(false);
  };

  const toggleGoalCompletion = (id: string) => {
    setGoals(
      goals.map(goal => 
        goal.id === id ? { ...goal, completed: !goal.completed } : goal
      )
    );
  };

  const deleteGoal = (id: string) => {
    setGoals(goals.filter(goal => goal.id !== id));
  };

  // Calculate completion stats
  const completedGoals = goals.filter(goal => goal.completed).length;
  const totalGoals = goals.length;
  const completionPercentage = totalGoals > 0 
    ? Math.round((completedGoals / totalGoals) * 100) 
    : 0;

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Motivation Goals</h2>
        {!isFormOpen && (
          <button 
            onClick={() => setIsFormOpen(true)}
            className="btn-primary flex items-center"
          >
            <Plus size={18} className="mr-1" />
            Add Goal
          </button>
        )}
      </div>

      {/* Progress bar */}
      {totalGoals > 0 && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {completedGoals} of {totalGoals} goals completed
            </span>
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
              {completionPercentage}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Add goal form */}
      {isFormOpen && (
        <form onSubmit={handleAddGoal} className="mb-8 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
          <h3 className="font-semibold mb-4">Add New Goal</h3>
          <div className="mb-4">
            <label htmlFor="goalTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Goal Title
            </label>
            <input
              type="text"
              id="goalTitle"
              value={newGoalTitle}
              onChange={(e) => setNewGoalTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Enter your goal..."
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="goalDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description (optional)
            </label>
            <textarea
              id="goalDescription"
              value={newGoalDescription}
              onChange={(e) => setNewGoalDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Describe your goal..."
              rows={3}
            />
          </div>
          <div className="flex space-x-2">
            <button
              type="submit"
              className="btn-primary"
            >
              Add Goal
            </button>
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Goals list */}
      {goals.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">
            You haven't set any goals yet. Add your first goal to start tracking your progress!
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {goals.map((goal) => (
            <li 
              key={goal.id}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 transition-all duration-300 hover:shadow-md"
            >
              <div className="flex items-start">
                <button
                  onClick={() => toggleGoalCompletion(goal.id)}
                  className={`mt-1 flex-shrink-0 w-5 h-5 rounded-full border flex items-center justify-center ${
                    goal.completed 
                      ? 'bg-green-500 border-green-500' 
                      : 'border-gray-400 dark:border-gray-500'
                  }`}
                  aria-label={goal.completed ? "Mark as incomplete" : "Mark as complete"}
                >
                  {goal.completed && <Check size={12} className="text-white" />}
                </button>
                <div className="ml-3 flex-grow">
                  <h3 className={`font-medium ${goal.completed ? 'line-through text-gray-500 dark:text-gray-400' : ''}`}>
                    {goal.title}
                  </h3>
                  {goal.description && (
                    <p className={`mt-1 text-sm ${goal.completed ? 'text-gray-400 dark:text-gray-500' : 'text-gray-600 dark:text-gray-400'}`}>
                      {goal.description}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => deleteGoal(goal.id)}
                  className="flex-shrink-0 ml-2 p-1 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
                  aria-label="Delete goal"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GoalTracker;