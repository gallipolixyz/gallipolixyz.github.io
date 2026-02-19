import { Event } from '../types/event';

const isEventPast = (eventDate: Date): boolean => {
  const today = new Date();
  const oneDayAfterEvent = new Date(eventDate);
  oneDayAfterEvent.setDate(oneDayAfterEvent.getDate() + 1);

  return today >= oneDayAfterEvent;
};

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
    isPast: isEventPast(new Date('2025-06-09')),
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
    isPast: isEventPast(new Date('2025-07-05')),
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
    isPast: isEventPast(new Date('2025-06-28')),
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
    isPast: isEventPast(new Date('2025-07-13')),
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
    isPast: isEventPast(new Date('2025-07-20')),
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
    isPast: isEventPast(new Date('2025-07-27')),
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
    isPast: isEventPast(new Date('2025-07-28')),
    prerequisites: ['Basic understanding of software development lifecycle'],
    agenda: [
      'Introduction to DevSecOps',
      'Why shifting security left matters',
      'Practical ways to integrate security early in development',
      'Real-world examples and best practices',
      'Q&A session with Ziyahan Albeniz'
    ]
  },
  {
    id: '8',
    title: 'Wi-Fi Hacking!',
    description: `How secure are our wireless networks, really?

In this hands-on session, we’ll explore the architecture of Wi-Fi networks, common attack techniques, and potential vulnerabilities — all from an ethical hacking perspective.

Our goal is to understand how wireless networks work, identify weaknesses, and learn how to build effective defenses based on this knowledge.

You’ll dive deep into Wi-Fi protocols, WEP/WPA/WPA2 analysis, and much more through practical demonstrations.`,
    date: new Date('2025-08-09'),
    time: '21:00',
    duration: '1-2 hours',
    type: 'training',
    difficulty: 'intermediate',
    instructor: 'İsa Ergişi – Security Researcher',
    location: 'online',
    meetingLink: 'https://kick.com/gallipolixyz',
    tags: [
      'wifi-security',
      'ethical-hacking',
      'network-security',
      'kick-stream',
      'gallipoli'
    ],
    isPast: isEventPast(new Date('2025-08-09')),
    prerequisites: ['Basic understanding of network protocols'],
    agenda: [
      'Introduction to Wi-Fi architecture',
      'Overview of wireless protocols: WEP, WPA, WPA2',
      'Attack techniques on wireless networks',
      'Real-world vulnerabilities and case studies',
      'Defensive measures and security best practices',
      'Q&A session with İsa Ergişi'
    ]
  },
  {
    id: '9',
    title: 'Kişisel Gizlilik ve Güvenlik - Trackerlar',
    description: `In our daily lives, the websites we visit, mobile applications we use, and devices we interact with constantly leave behind digital traces.

Often without realizing it, these traces reveal our identity and habits. Trackers (tracking technologies) collect and process this data — but how exactly do they work, what kind of data do they gather, and what can be done with this information?

In this training, we will explore how we are tracked, what privacy tools exist, and how we can protect ourselves.`,
    date: new Date('2025-08-16'),
    time: '21:00',
    duration: '1-2 hours',
    type: 'training',
    difficulty: 'beginner',
    instructor: 'Ulaş Fırat Özdemir',
    location: 'online',
    meetingLink: 'https://kick.com/gallipolixyz',
    tags: [
      'privacy',
      'security',
      'trackers',
      'kick-stream',
      'gallipoli'
    ],
    isPast: isEventPast(new Date('2025-08-16')),
    prerequisites: ['Interest in online privacy and security'],
    agenda: [
      'Introduction to trackers and digital footprints',
      'How trackers work and what data they collect',
      'Risks of data collection and potential misuse',
      'Privacy tools and techniques to reduce tracking',
      'Real-life examples and case studies',
      'Q&A session with Ulaş Fırat Özdemir'
    ]
  },
  {
    id: '10',
    title: 'Cyber Intelligence with N8N',
    description: `We will discuss the logic of n8n as an automation tool, its use cases, and why it can also be preferred in cyber intelligence.

Let’s take a closer look at the most popular open-source tool that works by connecting to applications via APIs.`,
    date: new Date('2025-09-06'),
    time: '21:00',
    duration: '1-2 hours',
    type: 'training',
    difficulty: 'beginner',
    instructor: 'Ali Gündoğar',
    location: 'online',
    meetingLink: 'https://kick.com/gallipolixyz',
    tags: [
      'automation',
      'cyber-intelligence',
      'n8n',
      'api',
      'kick-stream',
      'gallipoli'
    ],
    isPast: isEventPast(new Date('2025-09-06')),
    prerequisites: ['Interest in cyber intelligence and automation tools'],
    agenda: [
      'Introduction to n8n as an automation tool',
      'Use cases of n8n in cybersecurity',
      'Why n8n can be preferred in cyber intelligence',
      'Working with APIs and integrations',
      'Demo and practical insights',
      'Q&A session with Ali Gündoğar'
    ]
  },
  {
    id: '11',
    title: 'From PoC to PR: Roadmap for Open Source Security Contributions',
    description: `Join us for a training that explores how to contribute to open source projects in the context of security.

Topics include:
- The philosophy of open source
- Open source and cybersecurity
- Example projects and how to contribute to them

Note: We will also have a surprise guest from the Project Discovery team and a special gift during the session.`,
    date: new Date('2025-09-13'),
    time: '21:00',
    duration: '1-2 hours',
    type: 'training',
    difficulty: 'beginner',
    instructor: 'Halil Kirazkaya – Cyber Security Researcher',
    location: 'online',
    meetingLink: 'https://www.youtube.com/@gallipolixyz',
    tags: [
      'open-source',
      'cybersecurity',
      'contribution',
      'project-discovery',
      'youtube-stream',
      'gallipoli'
    ],
    isPast: isEventPast(new Date('2025-09-13')),
    prerequisites: ['Interest in open source projects and cybersecurity'],
    agenda: [
      'Introduction to the philosophy of open source',
      'Exploring the intersection of open source and cybersecurity',
      'Example projects and how to contribute effectively',
      'Surprise guest from Project Discovery and special gift',
      'Q&A session with Halil Kirazkaya'
    ]
  }, 
  {
    id: '12',
    title: 'Linux Kernel Architecture and Security 102',
    description: `In this training, we will dive deeper into the Linux kernel architecture and its security mechanisms.

Topics include:
- A deeper look into kernel architecture (monolithic design, system calls, kernel modules)
- Linux Security Modules (LSM) framework and popular solutions (SELinux, AppArmor)
- Breaking down root privileges with Capabilities
- Kernel hardening techniques (Stack Canaries, ASLR, Secure Boot, Signed Modules)
- Real-world vulnerability examples (Dirty COW, Spectre, Meltdown)

A packed session awaits you – don’t miss it!`,
    date: new Date('2025-09-21'),
    time: '21:00',
    duration: '1-2 hours',
    type: 'training',
    difficulty: 'intermediate',
    instructor: 'Ümmühan Atmaca – Cyber Security Researcher',
    location: 'online',
    meetingLink: 'https://www.youtube.com/@gallipolixyz',
    tags: [
      'linux',
      'kernel',
      'security',
      'lsm',
      'hardening',
      'youtube-stream',
      'gallipoli'
    ],
    isPast: isEventPast(new Date('2025-09-21')),
    prerequisites: ['Basic knowledge of Linux and system security'],
    agenda: [
      'Deeper look into Linux kernel architecture',
      'Linux Security Modules (SELinux, AppArmor)',
      'Capabilities and privilege separation',
      'Kernel hardening techniques',
      'Case studies of real-world vulnerabilities (Dirty COW, Spectre, Meltdown)',
      'Q&A session with Ümmühan Atmaca'
    ]
  },
  {
  id: '13',
  title: 'Man In The Middle & Bettercap Workshop',
  description: `In this live session, we will explore what a Man-In-The-Middle (MITM) attack is and observe how the Bettercap tool can be used in real-world scenarios.

If you’re curious about offensive security techniques and network manipulation tactics, don’t miss this interactive training session!`,
  date: new Date('2025-10-26'),
  time: '21:00',
  duration: '1-2 hours',
  type: 'training',
  difficulty: 'beginner',
  instructor: 'İsa Ergişi – Cyber Security Researcher',
  location: 'online',
  meetingLink: 'https://lnkd.in/egHnDrqC',
  tags: [
    'mitm',
    'bettercap',
    'network-security',
    'cybersecurity',
    'youtube-stream',
    'gallipoli'
  ],
  isPast: isEventPast(new Date('2025-10-26')),
  prerequisites: ['Basic understanding of networking concepts'],
  agenda: [
    'Introduction to Man-In-The-Middle attacks',
    'Overview of Bettercap and its core modules',
    'Demonstration: intercepting and analyzing traffic',
    'Real-world scenarios and defense mechanisms',
    'Q&A session with İsa Ergişi'
  ]
  },
  {
  id: '14',
  title: 'Cyber Security & Artificial Intelligence',
  description: `Artificial intelligence is no longer just a productivity tool; it is a game-changer for cyber security. But is AI keeping us safer, or is it opening the door to new risks?

Systems that detect attacks within seconds and algorithms that uncover threats beyond human recognition have become a part of our lives. In this webinar, we explore how security is being redefined in the age of artificial intelligence.`,
  date: new Date('2025-12-20'),
  time: '21:00',
  duration: '1-2 hours',
  type: 'webinar',
  difficulty: 'beginner',
  instructor: 'Cemal Taner – Network & Security Solutions Architect',
  location: 'online',
  meetingLink: 'https://lnkd.in/egHnDrqC',
  tags: [
    'artificial-intelligence',
    'ai-security',
    'cybersecurity',  
    'youtube-stream',
    'gallipoli'
  ],
  isPast: isEventPast(new Date('2025-12-20')),
  prerequisites: ['Interest in AI and basic cybersecurity awareness'],
  agenda: [
    'The evolution of AI in the cyber landscape',
    'AI-powered threat detection and response',
    'New risks: Adversarial AI and automated attacks',
    'The future of security architecture with AI',
    'Q&A session with Cemal Taner'
  ]
},
{
    id: '15',
    title: 'Blockchain & Blockchain Security',
    description: `"Is Blockchain just about cryptocurrency, or is it the secure internet of the future?"

In an era where digital assets and decentralization are on the rise, understanding system security has become a necessity.

In this webinar, we will discuss blockchain security layers, smart contract vulnerabilities, and evolving cybersecurity standards.`,
    date: new Date('2026-01-09'),
    time: '21:00',
    duration: '1-2 hours',
    type: 'webinar',
    difficulty: 'beginner',
    instructor: 'Samet Dökmeci – Chainlink Labs | Türkiye Community Manager',
    location: 'online',
    meetingLink: 'https://youtube.com/@gallipolixyz',
    tags: [
      'blockchain',
      'web3',
      'smart-contracts',
      'decentralization',
      'security',
      'youtube-stream',
      'gallipoli'
    ],
    isPast: isEventPast(new Date('2026-01-09')),
    prerequisites: ['Interest in blockchain technology and web3 security'],
    agenda: [
      'Security Layers of Blockchain Technology',
      'Smart Contract Vulnerabilities',
      'Decentralization and System Security',
      'Evolving Cybersecurity Standards',
      'Q&A Session with Samet Dökmeci'
    ]
  },
  {
    id: '16',
    title: 'AI Security',
    description: `"Is Artificial Intelligence merely a technological revolution, or does it represent a new security risk?"

In an era where algorithms govern decision-making processes, understanding the security of AI systems has become a necessity rather than an option.

In this webinar, we will explore model vulnerabilities, data privacy risks, and the next-generation cybersecurity standards evolving alongside artificial intelligence.`,
    date: new Date('2026-01-17'),
    time: '21:00',
    duration: '1-2 hours',
    type: 'webinar',
    difficulty: 'beginner',
    instructor: 'Kadir Arslan - Senior Security Engineer',
    location: 'online',
    meetingLink: 'https://youtube.com/@gallipolixyz',
    tags: [
      'ai-security',
      'artificial-intelligence',
      'machine-learning',
      'model-security',
      'cybersecurity',
      'youtube-stream',
      'gallipoli'
    ],
    isPast: isEventPast(new Date('2026-01-17')),
    prerequisites: ['Interest in artificial intelligence and cybersecurity'],
    agenda: [
      'Security Layers of AI Systems',
      'Machine Learning Model Vulnerabilities',
      'AI and Emerging Cybersecurity Standards',
      'Q&A Session with Kadir Arslan'
    ]
  },
  {
    id: '17',
    title: 'AI in Pentesting: The Future of Security Testing',
    description: `In this session, we will talk about how artificial intelligence is being used in penetration testing and how it is transforming modern security approaches.
  
  We will explore AI-powered tools for vulnerability discovery, automation, and attack simulations, along with their advantages, risks, and real-world use cases.`,
    date: new Date('2026-02-14'),
    time: '21:00',
    duration: '1 hour',
    type: 'webinar',
    difficulty: 'beginner',
    instructor: 'SQUR',
    location: 'online',
    meetingLink: 'https://www.youtube.com/@gallipolixyz',
    tags: [
      'ai',
      'pentesting',
      'ai-in-security',
      'security-testing',
      'offensive-security',
      'automation',
      'youtube-stream',
      'gallipoli'
    ],
    isPast: isEventPast(new Date('2026-02-14')),
    prerequisites: ['Basic interest in cybersecurity and penetration testing'],
    agenda: [
      'Introduction to AI in Pentesting',
      'How AI is used in vulnerability discovery',
      'Automation and attack simulations',
      'Advantages and risks of AI-powered tools',
      'Real-world pentesting use cases',
      'Q&A session'
    ]
  }
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
