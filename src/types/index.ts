export interface Plant {
  id: string;
  name: string;
  scientificName: string;
  description: string;
  characteristics: string[];
  habitat: string;
  uses: string[];
  careInstructions: string[];
  image: string;
  seasonalInfo: {
    blooming: string;
    planting: string;
    harvesting: string;
  };
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  capacity: number;
  registered: number;
  category: 'workshop' | 'walk' | 'seminar' | 'planting';
  requirements: string[];
  image: string;
  instructor: string;
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface Notification {
  id: string;
  userId: string;
  eventId: string;
  title: string;
  message: string;
  type: 'reminder' | 'update' | 'cancellation';
  scheduledTime: string;
  sent: boolean;
  read: boolean;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  registeredEvents: string[];
  preferences: {
    notifications: boolean;
    reminderTime: number; // hours before event
  };
}