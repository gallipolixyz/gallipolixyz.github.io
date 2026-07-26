import React from 'react';
import { motion } from 'framer-motion';

interface TimelineEvent {
  date: string;
  title: string;
  description: string;
  metric?: string;
}

const timelineData: TimelineEvent[] = [
  {
    date: "June 2024",
    title: "Foundation & Concept",
    description: "The Gallipoli community was initially established as a private community focused on bug bounty programs.",
    metric: "The Beginning of Our Journey"
  },
  {
    date: "July 2024",
    title: "Social Media Platforms",
    description: "The community became publicly accessible, and our Telegram, Instagram, and YouTube channels were launched.",
    metric: "Going Public"
  },
  {
    date: "September 2024",
    title: "Knowledge Sharing & Industry Talks",
    description: "We started producing industry-focused content on our YouTube channel, including live sessions and interviews with cybersecurity professionals.",
    metric: "Connecting With Cybersecurity Experts",
  },
  {
    date: "May 2025",
    title: "Community Growth",
    description: "Our YouTube channel surpassed 2,800 subscribers, our Telegram community grew to more than 900 members, and our LinkedIn page reached 2,000+ followers.",
    metric: "5,700+ Community Members & Followers"
  },
  {
    date: "January 2026",
    title: "Career Program",
    description: "We launched our official Career Program to help our community members enter the cybersecurity industry, connect talented cybersecurity students with the right career opportunities, and expand our professional network.",
    metric: "Supporting Cybersecurity Careers"
  },
];

export const StoryTimeline: React.FC = () => {
  return (
    <section className="py-20 bg-black text-white relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 relative">
        
        {/* Başlık */}
        <div className="text-center mb-20">
          <h2 className="text-4xl font-bold text-custom-cyan mb-4 uppercase tracking-wider">
            Our Journey_
          </h2>
        </div>

        {/* Dikey Çizgi (Hem Mobilde Hem PC'de Tam Ortada) */}
        <div className="absolute left-1/2 transform -translate-x-1/2 top-44 bottom-16 w-0.5 bg-gradient-to-b from-custom-cyan via-purple-600 to-zinc-900 opacity-40" />

        <div className="space-y-16 relative">
          {timelineData.map((item, index) => {
            const isEven = index % 2 === 0;
            
            return (
              <motion.div
                key={index}
                className={`flex flex-col md:flex-row items-center justify-between relative w-full ${
                  isEven ? 'md:flex-row-reverse' : ''
                }`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                {/* Bağlantı Noktaları (Hem mobilde hem PC'de çizgi üzerinde parlayacak) */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-black border-2 border-custom-cyan shadow-[0_0_12px_#00ffff] z-10" />

                {/* İçerik Kutusu */}
                <div className="w-full md:w-[45%] mt-8 md:mt-0 text-center md:text-left">
                  <motion.div 
                    whileHover={{ scale: 1.02, borderColor: 'rgba(0, 255, 255, 0.4)' }}
                    className="p-6 bg-zinc-900/70 border border-zinc-800 rounded-lg shadow-2xl backdrop-blur-md transition-all duration-300 relative overflow-hidden group border-t-2 border-t-custom-cyan"
                  >
                    {/* Hover Parlama Efekti */}
                    <div className="absolute inset-0 bg-gradient-to-b from-custom-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <span className="text-xs font-semibold text-custom-cyan tracking-wider uppercase block mb-2 font-mono">
                      {item.date}
                    </span>
                    <h3 className="text-xl font-bold mb-3 text-white group-hover:text-custom-cyan transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed mb-4 text-justify md:text-left">
                      {item.description}
                    </p>
                    
                    {/* Metrik Göstergesi */}
                    {item.metric && (
                      <span className="inline-block bg-custom-cyan/5 text-custom-cyan text-xs px-3 py-1 rounded font-mono border border-custom-cyan/20 shadow-[0_0_8px_rgba(0,255,255,0.05)]">
                        {item.metric}
                      </span>
                    )}
                  </motion.div>
                </div>

                {/* Masaüstü Düzeni Koruma Boşluğu */}
                <div className="hidden md:block w-[45%]" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StoryTimeline;