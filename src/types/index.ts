export interface Quote {
  id: string;
  text: string;
  author: string;
  category: Category;
  date?: string;
  isFavorite?: boolean;
}

export type Category = 'success' | 'health' | 'relationships' | 'personal-growth' | 'all';

export interface UserGoal {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: ChallengeCategory;
  duration: number; // in days
  tasks: ChallengeTask[];
}

export type ChallengeCategory = 
  | 'health'
  | 'mental-wellness'
  | 'fitness'
  | 'relationships'
  | 'coding'
  | 'productivity';

export interface ChallengeTask {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  dayNumber: number;
}

export interface UserProfile {
  id: string;
  username: string;
  fullName: string;
  notification_times?: string[];
  enable_notifications?: boolean;
  notification_types?: {
    dailyMotivation?: boolean;
    reminders?: boolean;
    alerts?: boolean;
  };
  selected_interests?: string[];
  whatsapp_number?: string;
  avatar_url?: string;
  preferences?: {
    notificationTimes?: string[];
    categories?: string[];
  };

  badges: Badge[];
  activeChallenge?: Challenge;
  challengeProgress: {
    challengeId: string;
    completedTasks: string[];
    startDate: string;
    lastCompletedDay: number;
  };
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  category: ChallengeCategory;
  dateEarned: string;
}