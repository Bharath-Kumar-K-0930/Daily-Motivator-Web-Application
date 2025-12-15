import React, { useState, useEffect } from 'react';
import { Award } from 'lucide-react';
import api from '../lib/api';

interface Badge {
  id: string;
  name: string;
  description: string;
  image_url: string;
  category: string;
  earned_at?: string;
}

const BadgesPage: React.FC = () => {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBadges();
  }, []);

  // Add professional background gradient styles
  const professionalBgStyle = `
    .professional-bg-gradient {
      background: linear-gradient(135deg, #4b6cb7 0%, #182848 100%);
      box-shadow: 0 4px 15px rgba(27, 38, 59, 0.3);
    }
  `;

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = professionalBgStyle;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const fetchBadges = async () => {
    try {
      const { data } = await api.get('/badges');
      setBadges(data || []);
    } catch (error) {
      console.error('Error fetching badges:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const earnedBadges = badges.filter(badge => badge.earned_at);
  const availableBadges = badges.filter(badge => !badge.earned_at);

  return (
    <div className="container-custom py-8" style={{ paddingTop: "70px", maxWidth: "100%" }}>
      <h1 className="text-3xl font-bold mb-8">My Badges</h1>

      {/* Earned Badges */}
      {earnedBadges.length > 0 && (
        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Earned Badges</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {earnedBadges.map((badge) => (
              <div
                key={badge.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center"
              >
                <div className="mb-4 relative">
                  <div className="w-24 h-24 mx-auto relative bg-professional-bg bg-center bg-cover rounded-full flex items-center justify-center">
                    <img
                      src={badge.image_url}
                      alt={badge.name}
                      className="w-20 h-20 object-contain"
                    />
                  </div>
                  <Award className="absolute top-0 right-0 w-6 h-6 text-yellow-500" />
                  <button
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = badge.image_url;
                      link.download = `${badge.name}.png`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                    className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white text-xs px-2 py-1 rounded shadow"
                    title="Download Badge"
                  >
                    Download
                  </button>
                </div>
                <h3 className="font-medium mb-2">{badge.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {badge.description}
                </p>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Earned on {new Date(badge.earned_at!).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available Badges */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Available Badges</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {availableBadges.map((badge) => (
            <div
              key={badge.id}
              className="bg-gray-100 dark:bg-gray-800/50 rounded-lg p-6 text-center filter grayscale"
            >
              <div className="mb-4 relative bg-professional-bg bg-center bg-cover rounded-full flex items-center justify-center professional-bg-gradient">
                <img
                  src={badge.image_url}
                  alt={badge.name}
                  className="w-20 h-20 object-contain opacity-50"
                />
                <button
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = badge.image_url;
                    link.download = `${badge.name}.png`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white text-xs px-2 py-1 rounded shadow"
                  title="Download Badge"
                >
                  Download
                </button>
              </div>
              <h3 className="font-medium mb-2">{badge.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {badge.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BadgesPage;