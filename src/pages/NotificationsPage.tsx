import React, { useState } from 'react';
import { Bell, Clock, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { toast } from 'react-hot-toast';

function formatTime12Hour(time24: string): string {
  const [hoursStr, minutes] = time24.split(':');
  let hours = parseInt(hoursStr, 10);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  if (hours === 0) hours = 12;
  return `${hours}:${minutes} ${ampm}`;
}

const NotificationsPage: React.FC = () => {
  const { profile } = useAuth();
  const [notificationTimes, setNotificationTimes] = useState<string[]>(
    profile?.notification_times || ['04:00', '05:00', '06:00', '07:00', '10:00']
  );
  const [enableNotifications, setEnableNotifications] = useState<boolean>(
    profile?.enable_notifications || false
  );
  const [notificationTypes, setNotificationTypes] = useState<{ [key: string]: boolean }>({
    dailyMotivation: profile?.notification_types?.dailyMotivation ?? true,
    reminders: profile?.notification_types?.reminders ?? false,
    alerts: profile?.notification_types?.alerts ?? false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState<string>(profile?.whatsapp_number || '');

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('profiles')
        .update({
          notification_times: notificationTimes,
          enable_notifications: enableNotifications,
          notification_types: notificationTypes,
          whatsapp_number: phoneNumber,
        })
        .eq('id', profile?.id);

      if (error) throw error;
      toast.success('Notification preferences updated');
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      toast.error('Failed to update preferences');
    } finally {
      setIsLoading(false);
    }
  };

  const validatePhoneNumber = (number: string) => {
    const cleanNumber = number.replace(/\D/g, '');
    return cleanNumber.length >= 10 && cleanNumber.length <= 15;
  };

  return (
    <div className="container-custom py-8" style={{ paddingTop: '70px', maxWidth: '100%' }}>
      <h1 className="text-3xl font-bold mb-8">Notification Settings</h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        {/* Daily Motivation Settings */}
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
              <div className="mb-4">
                <h4 className="text-md font-medium mb-2 text-gray-300">Notification Types</h4>
                <label className="flex items-center space-x-3 cursor-pointer mb-2">
                  <input
                    type="checkbox"
                    checked={notificationTypes.dailyMotivation}
                    onChange={(e) =>
                      setNotificationTypes({
                        ...notificationTypes,
                        dailyMotivation: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-300">Daily Motivational Messages</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer mb-2">
                  <input
                    type="checkbox"
                    checked={notificationTypes.reminders}
                    onChange={(e) =>
                      setNotificationTypes({
                        ...notificationTypes,
                        reminders: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-300">Reminders</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer mb-2">
                  <input
                    type="checkbox"
                    checked={notificationTypes.alerts}
                    onChange={(e) =>
                      setNotificationTypes({
                        ...notificationTypes,
                        alerts: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-300">Alerts</span>
                </label>
              </div>

              <label className="block text-sm font-medium text-gray-300 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+91 1234567890 or 1234567890"
                className="w-full px-3 py-2 mb-4 bg-slate-700 border border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400"
              />
              {!validatePhoneNumber(phoneNumber) && phoneNumber.length > 0 && (
                <p className="text-red-400 text-xs mb-4">Please enter a valid phone number.</p>
              )}

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

            </div>
          )}
        </div>

        {/* Preview */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">Preview</h3>
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
            <div className="flex items-start space-x-4">
              <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full p-3">
                <Bell className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h4 className="font-medium mb-1">Daily Motivation</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  "Success is not final, failure is not fatal: it is the courage to continue that counts."
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-2">
                  You'll receive notifications like this at your chosen times.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="btn-primary flex items-center space-x-2"
          >
            <Check size={18} />
            <span>{isLoading ? 'Saving...' : 'Save Preferences'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;