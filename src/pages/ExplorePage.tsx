import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import QuoteCard from '../components/QuoteCard';
import CategoryFilter from '../components/CategoryFilter';
import { useQuotes } from '../context/QuoteContext';
import { Category } from '../types';

const ExplorePage: React.FC = () => {
  const location = useLocation();
  const { filteredQuotes, setCategory, selectedCategory } = useQuotes();
  
  // Handle category selection from URL parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get('category');
    
    if (categoryParam && ['success', 'health', 'relationships', 'personal-growth'].includes(categoryParam)) {
      setCategory(categoryParam as Category);
    }
  }, [location, setCategory]);

  return (
    <div className="container-custom pt-28 pb-12">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">Explore Motivational Quotes</h1>
      
      {/* Category filters */}
      <div className="mb-8">
        <h2 className="text-lg font-medium mb-4">Filter by Category</h2>
        <CategoryFilter />
      </div>
      
      {/* Number of quotes found */}
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        {filteredQuotes.length} quotes found {selectedCategory !== 'all' && `in "${selectedCategory.replace('-', ' ')}"`}
      </p>
      
      {/* Quotes grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredQuotes.map(quote => (
          <QuoteCard key={quote.id} quote={quote} />
        ))}
      </div>
      
      {/* No quotes found message */}
      {filteredQuotes.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            No quotes found in this category. Try selecting a different category.
          </p>
        </div>
      )}
    </div>
  );
};

export default ExplorePage;