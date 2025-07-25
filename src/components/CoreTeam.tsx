import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CardAnimation } from '../components/CardAnimation';
import { ScrollAnimation } from '../components/ScrollAnimation';

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image: string;
  linkedin?: string;
}

const team: TeamMember[] = [
  {
    name: 'MG',
    role: 'Founder ',
    bio: '',
    image: '/img/mg.jpg',
    linkedin: 'https://www.linkedin.com/in/mgogebakan/',
  },
  {
    name: 'k4yra',
    role: 'Community Leader',
    bio: '',
    image: '/img/pp2.jpeg',
    linkedin: 'https://www.linkedin.com/in/kayra-öksüz-ab061a1ba',
  },
  {
    name: 'Revivalist',
    role: 'Co-Leader',
    bio: 'Focused on Web Application Security and Red Teaming.',
    image: '/img/revivalist.jpg',
    linkedin: 'https://www.linkedin.com/in/nadirsensoy/',
  },
  {
    name: 'RØØNIN',
    role: 'Management Member',
    bio: 'Experienced in real-world attack simulations and penetration testing.',
    image: '/img/roonin.jpeg',
    linkedin: 'https://www.linkedin.com/in/hüseyin-aydin-697035295/',
  },
  {
    name: 'Miela',
    role: 'Management Member',
    bio: 'Cybersecurity Researcher',
    image: '/img/miela.jpg',
    linkedin: 'https://www.linkedin.com/in/melisa-sudenaz-ar%C4%B1k-3727a32b8?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
  },
  {
    name: '0xH4mS1',
    role: 'CTF Team Leader',
    bio: 'Cybersecurity researcher focused on Threat Intelligence and Security Operations. Passionate about threat detection, incident response, and proactive defense. Actively contributes to open-source projects, engages in software development, and regularly participates in Capture the Flag (CTF) challenges to enhance both offensive and defensive skills.',
    image: '/img/hamsi.jpeg',
    linkedin: 'https://www.linkedin.com/in/aysebyrktr',
  },
  {
    name: 'Toygun',
    role: 'CTI Team Leader',
    bio: 'At (XTI) Company, our team investigated ransomware and APT groups. As a Cyber Threat Intelligence Analyst, I provided specialized CTI support and conducted malware analysis. My knowledge of Web Applications and Secure Shell, combined with a background in Computer Engineering, enhanced our threat mitigation efforts.',
    image: '/img/Rakun.jpg',
    linkedin: 'https://www.linkedin.com/in/ibrahimsaidkavas'
  },
  {
    name: 'Hilal',
    role: 'Management Member',
    bio: 'I am a cyber security researcher focused on threat analysis, malware investigation, and defense technologies. I work on identifying emerging threats, analyzing them, and developing proactive security solutions.',
    image: '/img/sadece_birisi.jpg',
    linkedin: 'https://www.linkedin.com/in/hilalavsar/'
  },
  {
    name: 'Nörs',
    role: 'Management Member',
    bio: 'An independent SOC researcher with a strong interest in cybersecurity. Focused on deepening knowledge in threat detection, analysis, and incident response. Actively explores SIEM technologies to enhance detection capabilities and continuously works on improving both technical expertise and analytical thinking through hands-on projects and research.',
    image: '/img/nors1.jpg',
    linkedin: 'https://www.linkedin.com/in/nur-sena-avci'
  },
  {
    name: 'Ümmühan',
    role: 'Management Member',
    bio: 'Enthusiast in cyber threat intelligence and security operations, focused on tracking malicious activity and enhancing incident response skills',
    image: '/img/ummuhan.jpg',
    linkedin: 'https://www.linkedin.com/in/%C3%BCmm%C3%BChan-atmaca?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app ',
  },
];

export const CoreTeam: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  return (
    <div className="min-h-screen bg-black text-custom-cyan py-20 flex flex-col items-center justify-center relative">
      <div className="container mx-auto px-4 max-w-6xl">
        <ScrollAnimation>
          <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-6 tracking-tight font-mono drop-shadow-[0_2px_16px_rgba(0,255,255,0.2)]">
            Our Team_
          </h1>
          <p className="text-center max-w-3xl mx-auto mb-16 text-lg font-mono text-custom-cyan/90 leading-relaxed">
            Meet the core team behind Gallipoli — a group of passionate, creative, and experienced professionals dedicated to cybersecurity excellence.
          </p>
        </ScrollAnimation>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {team.map((member, index) => (
            <CardAnimation key={member.name} index={index}>
              <motion.div
                className="bg-black border-2 border-custom-cyan/40 rounded-2xl shadow-[0_0_16px_2px_rgba(0,255,255,0.10)] overflow-hidden transition-all duration-300 hover:border-custom-cyan hover:shadow-[0_0_32px_8px_rgba(0,255,255,0.25)] flex flex-col items-center p-8 h-[360px] cursor-pointer"
                whileHover={{ scale: 1.04, boxShadow: '0 0 32px 4px rgba(0,255,255,0.25)' }}
                onClick={() => setOpenIndex(index)}
              >
                <div className="w-24 h-24 aspect-square rounded-full overflow-hidden border-4 border-custom-cyan/30 mb-6 shadow-md bg-black shrink-0">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <h2 className="text-xl font-bold mb-1 text-center font-mono text-white drop-shadow">{member.name}</h2>
                <p className="text-custom-cyan/70 font-mono text-sm mb-3 text-center">{member.role}</p>
                <p
                  className="text-custom-cyan/80 text-center font-mono text-base mb-4"
                  style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {member.bio}
                </p>
                <div className="flex gap-3 mt-auto">
                  {member.linkedin && (
                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-fuchsia-400 transition text-xl">
                      <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.27c-.966 0-1.75-.79-1.75-1.76s.784-1.76 1.75-1.76 1.75.79 1.75 1.76-.784 1.76-1.75 1.76zm13.5 11.27h-3v-5.6c0-1.34-.03-3.07-1.87-3.07-1.87 0-2.16 1.46-2.16 2.97v5.7h-3v-10h2.89v1.36h.04c.4-.76 1.38-1.56 2.84-1.56 3.04 0 3.6 2 3.6 4.59v5.61z" /></svg>
                    </a>
                  )}
                </div>
              </motion.div>
            </CardAnimation>
          ))}
        </motion.div>
      </div>

      {/* Modal for expanded card */}
      <AnimatePresence>
        {openIndex !== null && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpenIndex(null)}
            />
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center px-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <div className="relative bg-black border-2 border-custom-cyan rounded-2xl shadow-2xl p-10 max-w-md w-full flex flex-col items-center">
                <button
                  className="absolute top-3 right-3 text-custom-cyan text-2xl hover:text-white transition"
                  onClick={() => setOpenIndex(null)}
                  aria-label="Kapat"
                >
                  &times;
                </button>
                <div className="w-28 h-28 aspect-square rounded-full overflow-hidden border-4 border-custom-cyan/50 mb-6 shadow-md bg-black shrink-0">
                  <img
                    src={team[openIndex].image}
                    alt={team[openIndex].name}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <h2 className="text-2xl font-bold mb-1 text-center font-mono text-white drop-shadow">{team[openIndex].name}</h2>
                <p className="text-custom-cyan/70 font-mono text-sm mb-3 text-center">{team[openIndex].role}</p>
                <p className="text-custom-cyan/80 text-center font-mono text-base mb-4">{team[openIndex].bio}</p>
                <div className="flex gap-3 mt-auto">
                  {team[openIndex].linkedin && (
                    <a href={team[openIndex].linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-fuchsia-400 transition text-xl">
                      <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.27c-.966 0-1.75-.79-1.75-1.76s.784-1.76 1.75-1.76 1.75.79 1.75 1.76-.784 1.76-1.75 1.76zm13.5 11.27h-3v-5.6c0-1.34-.03-3.07-1.87-3.07-1.87 0-2.16 1.46-2.16 2.97v5.7h-3v-10h2.89v1.36h.04c.4-.76 1.38-1.56 2.84-1.56 3.04 0 3.6 2 3.6 4.59v5.61z" /></svg>
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CoreTeam;
