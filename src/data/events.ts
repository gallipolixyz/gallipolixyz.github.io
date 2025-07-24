import { tr } from 'framer-motion/client';
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
    isPast: true,
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
    isPast: true,
    prerequisites: ['Basic interest in web application security and reconnaissance'],
    agenda: [
      'Understanding the importance of target scoping',
      'Identifying web assets and infrastructure',
      'Subdomain enumeration techniques',
      'IP range analysis and directory scanning',
      'Categorizing and prioritizing findings'
    ]
  },
  {
    id: '4',
    title: 'Linux Kernel 101',
    description: 'Explore the structure and importance of the Linux Kernel—the heart of operating systems. This session will cover how the kernel bridges the system and hardware, focusing on its internal components and security mechanisms.',
    date: new Date('2025-07-13'),
    time: '21:00',
    duration: '1-2 hour',
    type: 'training',
    difficulty: 'beginner',
    instructor: 'Ümmühan Atmaca – Cyber Security Researcher',
    location: 'online',
    meetingLink: 'https://kick.com/gallipolixyz',
    tags: [
      'linux',
      'kernel',
      'system-security',
      'lsm',
      'syscall',
      'device-drivers',
      'kick-stream'
    ],
    isPast: true,
    prerequisites: ['Basic interest in operating systems and system-level security'],
    agenda: [
      'What is the Kernel and why is it so critical?',
      'Differences between User Space and Kernel Space',
      'What is a System Call and how does it work?',
      'Core components of the Kernel: Scheduler, Memory Manager, Device Drivers',
      'Fundamentals of kernel security',
      'Introduction to Linux Security Modules (LSM)'
    ]
  },
  {
    id: '5',
    title: 'Security Perspectives on Modern Web Applications',
    description: `We interact with web applications daily—but how do they work and how are they secured? 
This training will illuminate these questions with a comprehensive approach.

We'll start by examining how HTTP requests are handled and the fundamentals of client-server interactions. Then, we’ll delve into Modern Web Architecture shaped by concepts like microservices, containerization, and service mesh.

Understanding the structure isn’t enough—we must identify weaknesses too. We'll explore how data leaks can occur through cache vulnerabilities and analyze security risks posed by GraphQL’s flexibility with real-world examples.`,
    date: new Date('2025-07-20'),
    time: '21:00',
    duration: '1-2 hour',
    type: 'training',
    difficulty: 'intermediate',
    instructor: 'Sarp Dora Yönden – Security Researcher',
    location: 'online',
    meetingLink: 'https://kick.com/gallipolixyz',
    tags: [
      'web-security',
      'modern-web',
      'http',
      'microservices',
      'containers',
      'graphql',
      'kick-stream'
    ],
    isPast: true,
    prerequisites: ['Basic understanding of web development or interest in application security'],
    agenda: [
      'Step-by-step breakdown of Web Application Architecture',
      'Understanding HTTP request handling and client-server interaction',
      'Deep dive into microservices, container architecture, and service mesh',
      'Cache vulnerabilities and data leakage scenarios',
      'Security challenges and risks of GraphQL APIs'
    ]
  },
  {
    id: '6',
    title: 'GRC and Cybersecurity',
    description: `What makes an attacker's job harder?
A controlled, well-organized, and awareness-driven cybersecurity environment!

But do you know what kind of structure organizations need to identify their information security risks, comply with legal regulations (KVKK, ISO 27001, etc.), and manage their security policies in a sustainable way?

The answer to all these questions lies in GRC.

If you're curious about GRC (Governance, Risk, Compliance) and want to ask questions, you can find all the answers in this training session!`,
    date: new Date('2025-07-27'),
    time: '21:00',
    duration: '1-2 hours',
    type: 'training',
    difficulty: 'beginner',
    instructor: 'Tansu Uzun',
    location: 'online',
    meetingLink: 'https://kick.com/gallipolixyz',
    tags: [
      'grc',
      'cybersecurity',
      'risk-management',
      'compliance',
      'governance',
      'iso27001',
      'kick-stream'
    ],
    isPast: false,
    prerequisites: ['General interest in cybersecurity and risk management'],
    agenda: [
      'Introduction to GRC (Governance, Risk, Compliance)',
      'The role of GRC in strengthening cybersecurity posture',
      'Understanding the importance of compliance (KVKK, ISO 27001, etc.)',
      'Sustainable security policy management',
      'Interactive Q&A session with the instructor'
    ]
  },
  {
  id: '7',
  title: 'DevSecOps Webinar',
  description: `In this session of our Gallipoli Cybersecurity Community webinar series, we’ll explore how security can be integrated earlier and more effectively into the software development lifecycle.

Join us as we dive into the world of DevSecOps and discover how to make secure development a reality from the start.`,
  date: new Date('2025-07-28'),
  time: '21:00',
  duration: '1-2 hours',
  type: 'webinar',
  difficulty: 'beginner',
  instructor: 'Ziyahan Albeniz – DevSecOps Engineering Consultant',
  location: 'online',
  meetingLink: 'https://kick.com/gallipolixyz',
  tags: [
    'devsecops',
    'secure-development',
    'software-security',
    'kick-stream',
    'gallipoli'
  ],
  isPast: false,
  prerequisites: ['Basic understanding of software development lifecycle'],
  agenda: [
    'Introduction to DevSecOps',
    'Why shifting security left matters',
    'Practical ways to integrate security early in development',
    'Real-world examples and best practices',
    'Q&A session with Ziyahan Albeniz'
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
