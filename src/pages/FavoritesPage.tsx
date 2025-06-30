import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import QuoteCard from '../components/QuoteCard';
import { useQuotes } from '../context/QuoteContext';

const FavoritesPage: React.FC = () => {
  const { favorites } = useQuotes();

  return (
    <div className="container-custom pt-28 pb-12">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">My Favorite Quotes</h1>
      
      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map(quote => (
            <QuoteCard key={quote.id} quote={quote} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
          <h2 className="text-2xl font-bold mb-4">No favorites yet</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
            You haven't added any quotes to your favorites. Explore our collection and save the ones that inspire you the most.
          </p>
          <Link to="/explore" className="btn-primary inline-flex items-center">
            <ArrowLeft size={18} className="mr-2" />
            Explore Quotes
          </Link>
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;