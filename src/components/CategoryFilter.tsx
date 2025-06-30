import React from 'react';
import { Sparkles, Heart, Users, Brain } from 'lucide-react';
import { Category } from '../types';
import { useQuotes } from '../context/QuoteContext';

interface CategoryOption {
  id: Category;
  name: string;
  icon: React.ReactNode;
}

const CategoryFilter: React.FC = () => {
  const { selectedCategory, setCategory } = useQuotes();

  const categories: CategoryOption[] = [
    {
      id: 'all',
      name: 'All Quotes',
      icon: <Sparkles size={18} className="mr-2" />,
    },
    {
      id: 'success',
      name: 'Success',
      icon: <Sparkles size={18} className="mr-2" />,
    },
    {
      id: 'health',
      name: 'Health',
      icon: <Heart size={18} className="mr-2" />,
    },
    {
      id: 'relationships',
      name: 'Relationships',
      icon: <Users size={18} className="mr-2" />,
    },
    {
      id: 'personal-growth',
      name: 'Personal Growth',
      icon: <Brain size={18} className="mr-2" />,
    },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => setCategory(category.id)}
          className={`flex items-center px-4 py-2 rounded-lg transition-all ${
            selectedCategory === category.id
              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          {category.icon}
          {category.name}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;