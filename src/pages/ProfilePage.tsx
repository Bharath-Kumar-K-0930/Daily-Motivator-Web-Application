import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { Camera, Save } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

const ProfilePage: React.FC = () => {
  const { profile } = useAuth();
  const [username, setUsername] = useState(profile?.username || '');
  const [fullName, setFullName] = useState(profile?.fullName || '');
  const [notificationTimes, setNotificationTimes] = useState<string[]>(
    profile?.notification_times || ['04:00', '05:00', '06:00', '07:00', '10:00']
  );
  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    profile?.selected_interests || []
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('profiles')
        .update({
          username,
          full_name: fullName,
          notification_times: notificationTimes,
          selected_interests: selectedInterests,
        })
        .eq('id', profile?.id);

      if (error) throw error;
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
      console.error('Error updating profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const interests = [
    { id: 'health', name: 'Health & Wellness' },
    { id: 'fitness', name: 'Fitness' },
    { id: 'mental-health', name: 'Mental Health' },
    { id: 'relationships', name: 'Relationships' },
    { id: 'coding', name: 'Coding Skills' },
    { id: 'productivity', name: 'Productivity' },
  ];

  return (
    <div className="container-custom py-8" style={{paddingTop : "70px" , maxWidth : "100%"}}>
      <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        {/* Profile Picture */}
        <div className="mb-8">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.username || 'Profile'}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <Camera size={32} className="text-blue-600 dark:text-blue-400" />
                )}
              </div>
              <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
                <Camera size={16} />
              </button>
            </div>
            <div>
              <h3 className="font-medium">Profile Picture</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Upload a new profile picture
              </p>
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        {/* Notification Times */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">Notification Preferences</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {notificationTimes.map((time, index) => (
              <div key={index}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Notification {index + 1}
                </label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => {
                    const newTimes = [...notificationTimes];
                    newTimes[index] = e.target.value;
                    setNotificationTimes(newTimes);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Interests */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">Your Interests</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {interests.map((interest) => (
              <label
                key={interest.id}
                className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedInterests.includes(interest.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedInterests([...selectedInterests, interest.id]);
                    } else {
                      setSelectedInterests(
                        selectedInterests.filter((id) => id !== interest.id)
                      );
                    }
                  }}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span>{interest.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="btn-primary flex items-center space-x-2"
          >
            <Save size={18} />
            <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;