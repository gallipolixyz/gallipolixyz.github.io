import { Event } from '../types/event';

export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Web Application Security Workshop',
    description: 'Deep dive into OWASP Top 10 vulnerabilities with hands-on labs. Learn to identify and exploit common web application security flaws while understanding proper remediation techniques.',
    date: new Date('2025-06-25'),
    time: '19:00',
    duration: '2 hours',
    type: 'workshop',
    difficulty: 'intermediate',
    instructor: 'Gallipoli Security Team',
    maxParticipants: 50,
    currentParticipants: 23,
    location: 'online',
    meetingLink: 'https://t.me/+IHIHLmSbufxlNjdk',
    tags: ['web-security', 'owasp', 'hands-on', 'vulnerability-assessment'],
    isPast: false,
    prerequisites: ['Basic web development knowledge', 'Understanding of HTTP protocol'],
    agenda: [
      'Introduction to Web Application Security',
      'OWASP Top 10 Overview',
      'Hands-on Lab: SQL Injection',
      'Hands-on Lab: XSS Vulnerabilities', 
      'Secure Coding Best Practices',
      'Q&A Session'
    ]
  },
  {
    id: '2',
    title: 'Weekly CTF Challenge: Network Forensics',
    description: 'Analyze network traffic captures to uncover hidden threats and solve forensics challenges. This week focuses on malware communication patterns and data exfiltration techniques.',
    date: new Date('2025-06-25'),
    time: '14:00',
    duration: '4 hours',
    type: 'ctf',
    difficulty: 'advanced',
    instructor: 'CTF Team',
    location: 'online',
    meetingLink: 'https://t.me/+IHIHLmSbufxlNjdk',
    tags: ['ctf', 'network-forensics', 'wireshark', 'malware-analysis'],
    isPast: false,
    prerequisites: ['Wireshark experience', 'Basic networking knowledge', 'Linux command line'],
    agenda: [
      'Challenge Brief & Rules',
      'Network Capture Analysis',
      'Malware Communication Patterns',
      'Data Exfiltration Detection',
      'Flag Submission & Wrap-up'
    ]
  },
  {
    id: '3',
    title: 'Introduction to Bug Bounty Hunting',
    description: 'Learn the fundamentals of ethical hacking through bug bounty programs. From reconnaissance to report writing, discover how to start your journey in responsible disclosure.',
    date: new Date('2025-06-25'),
    time: '20:00',
    duration: '1.5 hours',
    type: 'webinar',
    difficulty: 'beginner',
    instructor: 'Bug Bounty Hunters',
    maxParticipants: 100,
    currentParticipants: 67,
    location: 'online',
    meetingLink: 'https://t.me/+IHIHLmSbufxlNjdk',
    tags: ['bug-bounty', 'ethical-hacking', 'reconnaissance', 'responsible-disclosure'],
    isPast: false,
    prerequisites: ['Basic cybersecurity concepts'],
    agenda: [
      'What is Bug Bounty Hunting?',
      'Choosing the Right Programs',
      'Reconnaissance Techniques',
      'Common Vulnerability Types',
      'Writing Effective Reports',
      'Getting Started: First Steps'
    ]
  },
  {
    id: '4',
    title: 'Monthly Community Meetup',
    description: 'Join our monthly community gathering where members share knowledge, discuss recent security trends, and network with fellow hackers. This month\'s focus: AI Security.',
    date: new Date('2025-06-25'),
    time: '18:30',
    duration: '2 hours',
    type: 'meetup',
    difficulty: 'beginner',
    location: 'online',
    meetingLink: 'https://t.me/+IHIHLmSbufxlNjdk',
    tags: ['community', 'networking', 'ai-security', 'knowledge-sharing'],
    isPast: false,
    agenda: [
      'Community Updates',
      'Member Presentations',
      'AI Security Discussion',
      'Upcoming Events Preview',
      'Open Networking Session'
    ]
  },
  {
    id: '5',
    title: 'Advanced Penetration Testing Techniques',
    description: 'Master advanced penetration testing methodologies and tools. This workshop covers post-exploitation techniques, lateral movement, and privilege escalation in modern environments.',
    date: new Date('2025-06-25'),
    time: '19:00',
    duration: '3 hours',
    type: 'workshop',
    difficulty: 'advanced',
    instructor: 'Senior Penetration Testers',
    maxParticipants: 30,
    currentParticipants: 30,
    location: 'online',
    tags: ['penetration-testing', 'post-exploitation', 'privilege-escalation', 'advanced'],
    isPast: true,
    prerequisites: ['OSCP or equivalent experience', 'Advanced Linux/Windows knowledge'],
    agenda: [
      'Advanced Enumeration Techniques',
      'Post-Exploitation Framework Usage',
      'Lateral Movement Strategies',
      'Privilege Escalation Labs',
      'Persistence Mechanisms',
      'Clean-up and Reporting'
    ]
  },
  {
    id: '6',
    title: 'Cybersecurity Career Panel',
    description: 'Industry professionals share their experiences and insights about building a successful cybersecurity career. Learn about different paths, required skills, and current market trends.',
    date: new Date('2025-06-25'),
    time: '17:00',
    duration: '1.5 hours',
    type: 'webinar',
    difficulty: 'beginner',
    location: 'online',
    tags: ['career', 'industry-insights', 'professional-development'],
    isPast: true,
    agenda: [
      'Panel Introductions',
      'Career Path Discussions',
      'Skills and Certifications',
      'Industry Trends',
      'Q&A with Audience'
    ]
  },
  {
    id: '7',
    title: 'Cladious Blockchain Security Workshop',
    description: 'Learn about the security of blockchain and how to secure your data.',
    date: new Date('2025-06-25'),
    time: '17:00',
    duration: '1.5 hours',
    type: 'webinar',
    difficulty: 'beginner',
    location: 'online',
    tags: ['blockchain', 'security', 'workshop'],
    isPast: false,
    agenda: [
      'Introduction to Blockchain',
      'Blockchain Security',
      'Use Blockchain to secure your data',
      'Q&A with Audience',
      'Career Path Discussion'
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