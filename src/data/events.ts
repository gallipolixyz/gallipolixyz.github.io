import { Event } from '../types/event';

export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'The New Era of Cybersecurity Shaped by Artificial Intelligence',
    description: 'Explore how artificial intelligence is transforming cybersecurity. From AI-powered attacks to defense mechanisms, discover the future threats and evolving protection strategies in this expert-led session.',
    date: new Date('2025-06-09'),
    time: '21:00',
    duration: '1 hour',
    type: 'webinar',
    difficulty: 'beginner',
    instructor: 'Utku Sen – Senior Application Security Engineer',
    location: 'online',
    meetingLink: 'https://kick.com/gallipolixyz',
    tags: [
      'ai-in-cybersecurity',
      'future-of-security',
      'ai-attacks',
      'defensive-ai',
      'cybersecurity-trends',
      'live-event',
      'security-architecture',
      'kick-stream'
    ],
    isPast: true,
    prerequisites: ['Interest in cybersecurity and emerging technologies'],
    agenda: [
      'Introduction: The Rise of AI in Security',
      'AI-Powered Attack Techniques',
      'Defensive AI: Opportunities for Security Teams',
      'Future Security Architectures',
      'Interactive Q&A with Utku Sen'
    ]
  },
  {
    id: '2',
    title: 'Splunk Training 101',
    description: 'Master the fundamentals of cybersecurity with real-time data analysis, SPL (Search Processing Language) queries, log correlation techniques, and alert generation. This training is ideal for aspiring SOC analysts, security professionals, and anyone looking to detect threats through effective log analysis.',
    date: new Date('2025-07-05'),
    time: '21:00',
    duration: '1-2 hour',
    type: 'training',
    difficulty: 'beginner',
    instructor: 'Nur Sena Avcı',
    location: 'online',
    meetingLink: 'https://kick.com/gallipolixyz',
    tags: [
      'splunk',
      'log-analysis',
      'soc-training',
      'cybersecurity-foundations',
      'incident-detection',
      'kick-stream',
      'security-analytics'
    ],
    isPast: false,
    prerequisites: ['Basic interest in cybersecurity and log analysis'],
    agenda: [
      'What is Splunk and How Does It Work?',
      'How to Ingest Log Data into Splunk',
      'Writing Effective Searches with SPL (Search Processing Language)',
      'Correlating Related Events Across Different Log Sources',
      'Hands-on Attack Analysis Using a Real-World Example'
    ]
  },
  {
    id: '3',
    title: 'Bug Bounty Recon',
    description: 'Learn how to accurately define the scope and analyze targets before starting a web application vulnerability hunt. This training covers system scoping, asset identification, subdomain discovery, IP range analysis, directory enumeration, categorization, and prioritization techniques.',
    date: new Date('2025-06-28'),
    time: '21:00',
    duration: '1-2 hour',
    type: 'training',
    difficulty: 'beginner',
    instructor: 'Ali Gündoğar',
    location: 'online',
    meetingLink: 'https://kick.com/gallipolixyz',
    tags: [
      'bug-bounty',
      'recon',
      'subdomain-enumeration',
      'ip-analysis',
      'directory-enumeration',
      'web-security',
      'kick-stream'
    ],
    isPast: false,
    prerequisites: ['Basic interest in web application security and reconnaissance'],
    agenda: [
      'Understanding the importance of target scoping',
      'Identifying web assets and infrastructure',
      'Subdomain enumeration techniques',
      'IP range analysis and directory scanning',
      'Categorizing and prioritizing findings'
    ]
  },
];

// Helper functions
export const getUpcomingEvents = (): Event[] => {
  return mockEvents.filter(event => !event.isPast).sort((a, b) => a.date.getTime() - b.date.getTime());
};

export const getPastEvents = (): Event[] => {
  return mockEvents.filter(event => event.isPast).sort((b, a) => a.date.getTime() - b.date.getTime());
};

export const getEventsByType = (type: Event['type']): Event[] => {
  return mockEvents.filter(event => event.type === type);
};

export const getEventById = (id: string): Event | undefined => {
  return mockEvents.find(event => event.id === id);
}; 