export interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  time: string;
  duration: string;
  type: 'training' | 'webinar' | 'ctf' | 'meetup' | 'conference';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  instructor?: string;
  maxParticipants?: number;
  currentParticipants?: number;
  location: 'online' | 'physical' | 'hybrid';
  meetingLink?: string;
  address?: string;
  tags: string[];
  image?: string;
  isPast: boolean;
  prerequisites?: string[];
  agenda?: string[];
}

export interface EventFilters {
  type?: Event['type'];
  difficulty?: Event['difficulty'];
  location?: Event['location'];
  dateRange?: {
    start: Date;
    end: Date;
  };
  tags?: string[];
} 