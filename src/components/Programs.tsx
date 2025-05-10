import React from 'react';
import { Bug, Globe, Brain, Terminal, Target, Play, Users, BookOpen, ArrowRight } from 'lucide-react';
import { ScrollAnimation } from './ScrollAnimation';

const learningTracks = [
  {
    icon: Bug,
    title: "Bug Bounty Basics",
    description: "Master the art of bug hunting, from reconnaissance to responsible disclosure. Learn to think like both attacker and defender while contributing to real-world security.",
    topics: ["Recon techniques", "Vulnerability assessment", "Report writing", "Program interactions"]
  },
  {
    icon: Globe,
    title: "Web Application Security",
    description: "Deep dive into web security with hands-on OWASP Top 10 exploration. Build and break applications to understand both exploitation and defense mechanisms.",
    topics: ["OWASP methodology", "Common vulnerabilities", "Defense strategies", "Secure coding"]
  },
  {
    icon: Brain,
    title: "Threat Intelligence",
    description: "Develop your threat hunting instincts. Learn to gather, analyze, and act on security intelligence while understanding adversary tactics and techniques.",
    topics: ["Threat hunting", "IOC analysis", "APT tracking", "Intelligence sharing"]
  },
  {
    icon: Terminal,
    title: "Security Tools & Automation",
    description: "Craft your own security tools and automate your workflow. From Python scripts to full-featured applications, build your personal hacker toolkit.",
    topics: ["Script development", "Tool creation", "Workflow automation", "Custom exploits"]
  },
  {
    icon: Target,
    title: "CTF & Practical Labs",
    description: "Learn by doing in our capture-the-flag challenges and real-world labs. Build confidence and skills in a safe, supportive environment.",
    topics: ["Weekly challenges", "Team competitions", "Real-world scenarios", "Skill building"]
  }
];

const TrackCard = ({ track, index }: { track: typeof learningTracks[0], index: number }) => (
  <ScrollAnimation 
    direction={index % 2 === 0 ? 'left' : 'right'} 
    delay={0.10 * (index + 1)}
  >
    <div 
      className="bg-custom-cyan/5 border border-custom-cyan/30 rounded-lg p-6 backdrop-blur-sm hover:bg-custom-cyan/10 hover:border-custom-cyan/50 transition-all duration-300 click-ripple interactive-hover"
      onClick={(e) => {
        const element = e.currentTarget;
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        ripple.className = 'ripple';
        
        element.appendChild(ripple);
        ripple.addEventListener('animationend', () => ripple.remove());
      }}
    >
      <div className="flex items-center mb-4">
        <track.icon className="w-8 h-8 text-custom-cyan mr-3" />
        <h3 className="text-xl font-bold">{track.title}</h3>
      </div>
      <p className="font-mono text-custom-cyan/80 mb-4">{track.description}</p>
      <div className="grid grid-cols-2 gap-2">
        {track.topics.map((topic, topicIndex) => (
          <div key={topicIndex} className="flex items-center text-sm">
            <Play className="w-3 h-3 text-custom-cyan mr-2" />
            <span className="font-mono text-custom-cyan/70">{topic}</span>
          </div>
        ))}
      </div>
    </div>
  </ScrollAnimation>
);

export function Programs() {
  return (
    <div className="min-h-screen bg-black text-custom-cyan py-20">
      <div className="container mx-auto px-4">
        <ScrollAnimation>
          <section className="mb-20">
            <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">Programs_</h1>
            <div className="max-w-3xl mx-auto text-lg font-mono">
              <p className="mb-6 text-custom-cyan/90">
                Welcome to Gallipoli's learning ecosystem. Our programs are designed by hackers, for hackers, focusing on practical skills and real-world application. Whether you're taking your first steps in cybersecurity or advancing your expertise, you'll find your path here.
              </p>
            </div>
          </section>
        </ScrollAnimation>

        <section className="mb-20">
          <ScrollAnimation delay={0.1}>
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Learning Tracks_</h2>
          </ScrollAnimation>
          <div className="grid gap-8">
            {learningTracks.map((track, index) => (
              <TrackCard key={index} track={track} index={index} />
            ))}
          </div>
        </section>

        <ScrollAnimation direction="up" delay={0.2}>
          <section className="mb-20 bg-custom-cyan/5 rounded-xl p-8 backdrop-blur-sm">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">How It Works_</h2>
            <div className="max-w-3xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col items-center text-center p-6">
                  <Users className="w-12 h-12 text-custom-cyan mb-4" />
                  <h3 className="text-xl font-bold mb-3">Community-Led Learning</h3>
                  <p className="font-mono text-custom-cyan/80">
                    Join live sessions, watch recordings, and learn from experienced community members. Share your knowledge and grow together.
                  </p>
                </div>
                <div className="flex flex-col items-center text-center p-6">
                  <BookOpen className="w-12 h-12 text-custom-cyan mb-4" />
                  <h3 className="text-xl font-bold mb-3">Flexible Format</h3>
                  <p className="font-mono text-custom-cyan/80">
                    Learn at your own pace with async content, recorded workshops, and hands-on labs. Access resources 24/7.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </ScrollAnimation>

        <ScrollAnimation direction="up" delay={0.2}>
          <section className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">Ready to Start?_</h2>
            <p className="font-mono text-custom-cyan/90 mb-8 max-w-2xl mx-auto">
              Join our community of ethical hackers and start your journey in cybersecurity. No prior experience required—just bring your curiosity and determination.
            </p>
            <a 
              href="https://t.me/+IHIHLmSbufxlNjdk"
              target="_blank"
              rel="noopener noreferrer"
              className="click-ripple interactive-hover group inline-flex items-center px-8 py-4 bg-custom-cyan/10 border-2 border-custom-cyan/50 rounded-lg font-mono text-lg text-custom-cyan hover:bg-custom-cyan/20 hover:border-white hover:text-white transition-all duration-300"
            >
              Start Your Journey
              <ArrowRight className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" />
            </a>
          </section>
        </ScrollAnimation>
      </div>
    </div>
  );
}
