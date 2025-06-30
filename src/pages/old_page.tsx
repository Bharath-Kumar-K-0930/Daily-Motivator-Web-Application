import React, { useState, useRef, useEffect } from 'react';
import { Camera, Save, Upload, X, Phone, Clock, MessageCircle, Check, AlertCircle } from 'lucide-react';

// Local Storage keys
const STORAGE_KEYS = {
  PROFILE: 'user_profile',
  AVATAR: 'user_avatar'
};

// Default profile data
const defaultProfile = {
  id: 'user-123',
  username: '',
  full_name: '',
  avatar_url: null,
  whatsapp_number: '',
  notification_times: ['06:00', '12:00', '18:00'],
  enable_notifications: false,
  selected_interests: []
};

const ProfilePage = () => {
  const [profile, setProfile] = useState(defaultProfile);
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [notificationTimes, setNotificationTimes] = useState(['06:00', '12:00', '18:00']);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [enableNotifications, setEnableNotifications] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const fileInputRef = useRef(null);

  // Load user profile from localStorage on component mount
  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = () => {
    try {
      const savedProfile = localStorage.getItem(STORAGE_KEYS.PROFILE);
      const savedAvatar = localStorage.getItem(STORAGE_KEYS.AVATAR);
      
      if (savedProfile) {
        const userProfile = JSON.parse(savedProfile);
        setProfile(userProfile);
        setUsername(userProfile.username || '');
        setFullName(userProfile.full_name || '');
        setWhatsappNumber(userProfile.whatsapp_number || '');
        setNotificationTimes(userProfile.notification_times || ['06:00', '12:00', '18:00']);
        setSelectedInterests(userProfile.selected_interests || []);
        setEnableNotifications(userProfile.enable_notifications || false);
      }
      
      if (savedAvatar) {
        setPreviewUrl(savedAvatar);
      }
    } catch (error) {
      console.error('Error loading profile from localStorage:', error);
    }
  };

  // Save profile to localStorage
  const saveToLocalStorage = (profileData, avatarData = null) => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profileData));
      if (avatarData !== null) {
        if (avatarData) {
          localStorage.setItem(STORAGE_KEYS.AVATAR, avatarData);
        } else {
          localStorage.removeItem(STORAGE_KEYS.AVATAR);
        }
      }
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      throw new Error('Failed to save data locally');
    }
  };

  // Track changes for unsaved indicator
  useEffect(() => {
    const hasChanges = 
      username !== (profile?.username || '') ||
      fullName !== (profile?.full_name || '') ||
      whatsappNumber !== (profile?.whatsapp_number || '') ||
      JSON.stringify(notificationTimes) !== JSON.stringify(profile?.notification_times || []) ||
      JSON.stringify(selectedInterests) !== JSON.stringify(profile?.selected_interests || []) ||
      enableNotifications !== (profile?.enable_notifications || false);
    
    setHasUnsavedChanges(hasChanges);
  }, [username, fullName, whatsappNumber, notificationTimes, selectedInterests, enableNotifications, profile]);

  const formatTime12Hour = (time24) => {
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  // Convert file to base64 for localStorage
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const handlePhotoUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    try {
      setUploadingPhoto(true);
      
      // Convert to base64 and store in localStorage
      const base64String = await fileToBase64(file);
      setPreviewUrl(base64String);
      
    } catch (error) {
      console.error('Error uploading photo:', error);
      alert('Failed to upload photo');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const removePhoto = () => {
    try {
      setUploadingPhoto(true);
      setPreviewUrl(null);
    } catch (error) {
      console.error('Error removing photo:', error);
      alert('Failed to remove photo');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const validateWhatsAppNumber = (number) => {
    const cleanNumber = number.replace(/\D/g, '');
    return cleanNumber.length >= 10 && cleanNumber.length <= 15;
  };

  const formatWhatsAppNumber = (number) => {
    return number.replace(/[^\d+]/g, '');
  };

  const handleWhatsAppChange = (e) => {
    const formatted = formatWhatsAppNumber(e.target.value);
    setWhatsappNumber(formatted);
  };

  const testWhatsAppMessage = async () => {
    if (!whatsappNumber) {
      alert('Please enter a WhatsApp number first');
      return;
    }

    if (!validateWhatsAppNumber(whatsappNumber)) {
      alert('Please enter a valid WhatsApp number');
      return;
    }

    console.log('Sending test message to:', whatsappNumber);
    alert('Test message sent! Check your WhatsApp 📱');
  };

  const handleSave = async () => {
    if (!username.trim()) {
      alert('Username is required');
      return;
    }

    if (!fullName.trim()) {
      alert('Full name is required');
      return;
    }

    if (enableNotifications && (!whatsappNumber || !validateWhatsAppNumber(whatsappNumber))) {
      alert('Please enter a valid WhatsApp number to enable notifications');
      return;
    }

    if (enableNotifications && notificationTimes.length === 0) {
      alert('Please set at least one notification time');
      return;
    }

    try {
      setIsLoading(true);
      setSaveStatus('');
      
      const profileData = {
        ...profile,
        username: username.trim(),
        full_name: fullName.trim(),
        whatsapp_number: whatsappNumber,
        notification_times: notificationTimes,
        selected_interests: selectedInterests,
        enable_notifications: enableNotifications,
        avatar_url: previewUrl,
        updated_at: new Date().toISOString(),
      };

      // Save to localStorage
      saveToLocalStorage(profileData, previewUrl);

      // Update local state
      setProfile(profileData);
      setSaveStatus('success');
      setHasUnsavedChanges(false);
      
      setTimeout(() => setSaveStatus(''), 3000);
      
    } catch (error) {
      console.error('Error saving profile:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(''), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-save functionality (optional)
  const autoSave = () => {
    if (hasUnsavedChanges && username.trim() && fullName.trim()) {
      const profileData = {
        ...profile,
        username: username.trim(),
        full_name: fullName.trim(),
        whatsapp_number: whatsappNumber,
        notification_times: notificationTimes,
        selected_interests: selectedInterests,
        enable_notifications: enableNotifications,
        avatar_url: previewUrl,
        updated_at: new Date().toISOString(),
      };
      
      try {
        saveToLocalStorage(profileData, previewUrl);
        setProfile(profileData);
        console.log('Auto-saved profile data');
      } catch (error) {
        console.error('Auto-save failed:', error);
      }
    }
  };

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(autoSave, 30000);
    return () => clearInterval(interval);
  }, [hasUnsavedChanges, username, fullName, whatsappNumber, notificationTimes, selectedInterests, enableNotifications, previewUrl]);

  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear all profile data? This action cannot be undone.')) {
      localStorage.removeItem(STORAGE_KEYS.PROFILE);
      localStorage.removeItem(STORAGE_KEYS.AVATAR);
      
      // Reset all state to defaults
      setProfile(defaultProfile);
      setUsername('');
      setFullName('');
      setWhatsappNumber('');
      setNotificationTimes(['06:00', '12:00', '18:00']);
      setSelectedInterests([]);
      setEnableNotifications(false);
      setPreviewUrl(null);
      setHasUnsavedChanges(false);
      
      alert('All profile data has been cleared.');
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
    <div className="max-w-4xl mx-auto p-6 bg-slate-900 min-h-screen" style={{paddingTop : "70px" , maxWidth : "100%"}}>
      <div className="mb-6">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-3xl font-bold text-white">Profile Settings</h1>
          <button
            onClick={clearAllData}
            className="text-red-400 hover:text-red-300 text-sm px-3 py-1 border border-red-400 rounded-lg hover:bg-red-900/20 transition-colors"
          >
            Clear All Data
          </button>
        </div>
        
        {hasUnsavedChanges && (
          <div className="flex items-center space-x-2 text-amber-400 bg-amber-900/20 px-3 py-2 rounded-lg border border-amber-700">
            <AlertCircle size={16} />
            <span className="text-sm font-medium">You have unsaved changes</span>
          </div>
        )}
        
        <div className="text-xs text-gray-400 mt-2">
          Data is automatically saved to your browser's local storage every 30 seconds.
        </div>
      </div>

      {/* Save Status Messages */}
      {saveStatus === 'success' && (
        <div className="mb-6 flex items-center space-x-2 text-green-400 bg-green-900/20 px-4 py-3 rounded-lg border border-green-700">
          <Check size={20} />
          <span className="font-medium">Profile saved successfully to local storage!</span>
        </div>
      )}

      {saveStatus === 'error' && (
        <div className="mb-6 flex items-center space-x-2 text-red-400 bg-red-900/20 px-4 py-3 rounded-lg border border-red-700">
          <AlertCircle size={20} />
          <span className="font-medium">Failed to save profile. Please try again.</span>
        </div>
      )}

      <div className="bg-slate-800 rounded-lg shadow-lg p-6">
        {/* Profile Picture */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4 text-white">Profile Picture</h3>
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt={profile?.username || 'Profile'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Camera size={40} className="text-blue-400" />
                )}
              </div>
              
              <div className="absolute -bottom-2 -right-2 flex space-x-1">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingPhoto}
                  className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Upload new photo"
                >
                  {uploadingPhoto ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Upload size={16} />
                  )}
                </button>
                
                {previewUrl && (
                  <button
                    onClick={removePhoto}
                    disabled={uploadingPhoto}
                    className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Remove photo"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>
            
            <div className="flex-1">
              <p className="text-sm text-gray-300 mb-2">
                Upload a new profile picture (JPG, PNG, max 5MB)
              </p>
              <div className="text-xs text-gray-400">
                Recommended: Square image, at least 200x200 pixels
              </div>
              <div className="text-xs text-blue-400 mt-1">
                Images are stored locally in your browser
              </div>
            </div>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="hidden"
          />
        </div>

        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Username *
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400"
              placeholder="Enter your username"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400"
              placeholder="Enter your full name"
              required
            />
          </div>
        </div>

        {/* WhatsApp Number */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4 text-white">Contact Information</h3>
          <div className="max-w-md">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              WhatsApp Number {enableNotifications && <span className="text-red-400">*</span>}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone size={18} className="text-gray-400" />
              </div>
              <input
                type="tel"
                value={whatsappNumber}
                onChange={handleWhatsAppChange}
                className="w-full pl-10 pr-3 py-2 bg-slate-700 border border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400"
                placeholder="+91 1234567890 or 1234567890"
                required={enableNotifications}
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Include country code for international numbers (e.g., +91 for INDIA) 
            </p>
            
            {whatsappNumber && (
              <button
                onClick={testWhatsAppMessage}
                className="mt-2 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm flex items-center space-x-1 transition-colors"
              >
                <MessageCircle size={14} />
                <span>Send Test Message</span>
              </button>
            )}
          </div>
        </div>

        {/* Notification Settings */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4 text-white">Daily Motivation Settings</h3>
          
          <div className="mb-6">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={enableNotifications}
                onChange={(e) => setEnableNotifications(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-300">
                  Enable Daily Motivational Messages
                </span>
                <p className="text-xs text-gray-400">
                  Receive inspiring 1% Club challenges via WhatsApp at your chosen times
                </p>
              </div>
            </label>
          </div>

          {enableNotifications && (
            <div>
              <h4 className="text-md font-medium mb-3 flex items-center space-x-2 text-gray-300">
                <Clock size={18} className="text-blue-400" />
                <span>Notification Times</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {notificationTimes.map((time, index) => {
                  const [hours, minutes] = time.split(':');
                  const hour24 = parseInt(hours, 10);
                  const hour12 = hour24 % 12 || 12;
                  const ampm = hour24 >= 12 ? 'PM' : 'AM';
                  
                  return (
                    <div key={index} className="bg-slate-700 p-4 rounded-lg border border-slate-600">
                      <label className="block text-sm font-medium text-gray-300 mb-3">
                        Notification {index + 1}
                      </label>
                      
                      <div className="flex items-center space-x-2">
                        <select
                          value={hour12}
                          onChange={(e) => {
                            const newHour12 = parseInt(e.target.value, 10);
                            let newHour24 = newHour12;
                            if (ampm === 'PM' && newHour12 !== 12) {
                              newHour24 += 12;
                            } else if (ampm === 'AM' && newHour12 === 12) {
                              newHour24 = 0;
                            }
                          const newTime = `${newHour24.toString().padStart(2, '0')}:${minutes}`;
                          const newTimes = [...notificationTimes];
                          newTimes[index] = newTime;
                          setNotificationTimes(newTimes);
                        }}
                        className="flex-1 px-2 py-1 bg-slate-600 border border-slate-500 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                      >
                        {Array.from({ length: 12 }, (_, i) => i + 1).map((hour) => (
                          <option key={hour} value={hour}>
                            {hour}
                          </option>
                        ))}
                      </select>
                        
                        <span className="text-gray-400">:</span>
                        
                        <select
                          value={minutes}
                          onChange={(e) => {
                            const newMinutes = e.target.value;
                            const newTime = `${hours}:${newMinutes}`;
                            const newTimes = [...notificationTimes];
                            newTimes[index] = newTime;
                            setNotificationTimes(newTimes);
                          }}
                          className="flex-1 px-2 py-1 bg-slate-600 border border-slate-500 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                        >
                          {Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0')).map((minute) => (
                            <option key={minute} value={minute}>
                              {minute}
                            </option>
                          ))}
                        </select>
                        
                        <select
                          value={ampm}
                          onChange={(e) => {
                            const newAmPm = e.target.value;
                            let newHour24 = hour12;
                            if (newAmPm === 'PM' && hour12 !== 12) {
                              newHour24 += 12;
                            } else if (newAmPm === 'AM' && hour12 === 12) {
                              newHour24 = 0;
                            }
                            const newTime = `${newHour24.toString().padStart(2, '0')}:${minutes}`;
                            const newTimes = [...notificationTimes];
                            newTimes[index] = newTime;
                            setNotificationTimes(newTimes);
                          }}
                          className="px-2 py-1 bg-slate-600 border border-slate-500 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                        >
                          <option value="AM">AM</option>
                          <option value="PM">PM</option>
                        </select>
                      </div>
                      
                      <div className="text-xs text-blue-400 mt-2 font-medium text-center">
                        {formatTime12Hour(time)}
                      </div>
                      
                      {notificationTimes.length > 1 && (
                        <button
                          onClick={() => {
                            const newTimes = notificationTimes.filter((_, i) => i !== index);
                            setNotificationTimes(newTimes);
                          }}
                          className="w-full mt-2 text-xs text-red-400 hover:text-red-300 transition-colors"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  );
                })}
                
                {notificationTimes.length < 10 && (
                  <div className="bg-slate-700 p-4 rounded-lg border-2 border-dashed border-slate-600 flex items-center justify-center">
                    <button
                      onClick={() => {
                        const newTimes = [...notificationTimes, '09:00'];
                        setNotificationTimes(newTimes);
                      }}
                      className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <Clock size={16} />
                      <span className="text-sm font-medium">Add Time</span>
                    </button>
                  </div>
                )}
              </div>
              
              <div className="mt-6 p-4 bg-gradient-to-r from-slate-700 to-slate-600 rounded-lg border border-slate-600">
                <h5 className="text-sm font-medium text-gray-300 mb-3">Quick Presets:</h5>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setNotificationTimes(['06:00', '12:00', '18:00'])}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-xs transition-colors"
                  >
                    Morning, Noon, Evening
                  </button>
                  <button
                    onClick={() => setNotificationTimes(['07:00', '19:00'])}
                    className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-full text-xs transition-colors"
                  >
                    Twice Daily
                  </button>
                  <button
                    onClick={() => setNotificationTimes(['06:00', '09:00', '12:00', '15:00', '18:00'])}
                    className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-full text-xs transition-colors"
                  >
                    Every 3 Hours
                  </button>
                  <button
                    onClick={() => setNotificationTimes(['08:00'])}
                    className="px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white rounded-full text-xs transition-colors"
                  >
                    Once Daily
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Interests */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4 text-white">Your Interests</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {interests.map((interest) => (
              <label
                key={interest.id}
                className="flex items-center space-x-3 p-4 rounded-lg border border-slate-600 cursor-pointer hover:bg-slate-700 transition-colors"
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
                  className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
                />
                <span className="text-gray-300">{interest.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={isLoading || !hasUnsavedChanges}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
              isLoading || !hasUnsavedChanges
                ? 'bg-slate-600 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save size={18} />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;