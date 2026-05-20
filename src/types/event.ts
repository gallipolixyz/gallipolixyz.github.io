export interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  time: string;
  duration: string;
  type: 'training' | 'webinar' | 'ctf' | 'meetup' | 'conference';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  instructor: string; // Etkinliği sunan kişinin ismi
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
  
  // Yeni eklenen alanlar (Gallipoli platformu genişletmesi)
  youtubeUrl?: string; // Geçmiş etkinliklerin YouTube video/embed linki
  speaker?: {
    name: string;
    role: string;
    bio: string;
    image: string;     // Profil fotoğrafı yolu veya URL'i
    linkedin?: string; // Opsiyonel LinkedIn profil linki
  };
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