import React, { useState } from 'react';
import { Quote } from '../types';
import { useQuotes } from '../context/QuoteContext';
import { Heart, Share2, Copy, Check } from 'lucide-react';

interface QuoteCardProps {
  quote: Quote;
  variant?: 'default' | 'gradient';
  size?: 'small' | 'medium' | 'large';
}

const QuoteCard: React.FC<QuoteCardProps> = ({ 
  quote, 
  variant = 'default', 
  size = 'medium' 
}) => {
  const { addToFavorites, removeFromFavorites } = useQuotes();
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  const handleFavoriteToggle = () => {
    if (quote.isFavorite) {
      removeFromFavorites(quote.id);
    } else {
      addToFavorites(quote.id);
    }
  };

  const copyToClipboard = () => {
    const textToCopy = `"${quote.text}" - ${quote.author}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareQuote = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Inspirational Quote',
        text: `"${quote.text}" - ${quote.author}`,
        url: window.location.href,
      })
      .then(() => setShared(true))
      .catch(console.error);
      
      setTimeout(() => setShared(false), 2000);
    } else {
      copyToClipboard();
    }
  };

  // Set classes based on size
  const sizeClasses = {
    small: 'p-4 text-sm',
    medium: 'p-6 text-base',
    large: 'p-8 text-lg md:text-xl',
  };

  // Set classes based on variant
  const cardClasses = variant === 'gradient' 
    ? 'quote-card quote-card-gradient' 
    : 'quote-card';

  return (
    <div className={`${cardClasses} ${sizeClasses[size]}`}>
      <div className="flex flex-col h-full">
        <div className="mb-4">
          <blockquote>
            <p className={`font-display font-bold leading-relaxed ${size === 'large' ? 'text-2xl md:text-3xl' : ''}`}>
              "{quote.text}"
            </p>
          </blockquote>
        </div>
        
        <div className="mt-auto">
          <p className={`font-medium ${variant === 'gradient' ? 'text-white/80' : 'text-gray-600 dark:text-gray-400'}`}>
            — {quote.author}
          </p>
          
          <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200 dark:border-gray-700/30">
            <span className={`text-xs uppercase tracking-wide ${variant === 'gradient' ? 'text-white/70' : 'text-gray-500 dark:text-gray-500'}`}>
              {quote.category.replace('-', ' ')}
            </span>
            
            <div className="flex space-x-2">
              <button
                onClick={copyToClipboard}
                className={`p-2 rounded-full transition-colors ${
                  variant === 'gradient' 
                    ? 'hover:bg-white/20' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                aria-label={copied ? 'Copied' : 'Copy quote'}
              >
                {copied ? (
                  <Check size={18} className={variant === 'gradient' ? 'text-white' : 'text-green-500'} />
                ) : (
                  <Copy size={18} className={variant === 'gradient' ? 'text-white' : 'text-gray-600 dark:text-gray-400'} />
                )}
              </button>
              
              <button
                onClick={shareQuote}
                className={`p-2 rounded-full transition-colors ${
                  variant === 'gradient' 
                    ? 'hover:bg-white/20' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                aria-label={shared ? 'Shared' : 'Share quote'}
              >
                <Share2 size={18} className={variant === 'gradient' ? 'text-white' : 'text-gray-600 dark:text-gray-400'} />
              </button>
              
              <button
                onClick={handleFavoriteToggle}
                className={`p-2 rounded-full transition-colors ${
                  variant === 'gradient'
                    ? 'hover:bg-white/20'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                aria-label={quote.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Heart 
                  size={18} 
                  fill={quote.isFavorite ? (variant === 'gradient' ? 'white' : '#ef4444') : 'none'} 
                  className={
                    quote.isFavorite 
                      ? (variant === 'gradient' ? 'text-white' : 'text-red-500') 
                      : (variant === 'gradient' ? 'text-white' : 'text-gray-600 dark:text-gray-400')
                  } 
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteCard;