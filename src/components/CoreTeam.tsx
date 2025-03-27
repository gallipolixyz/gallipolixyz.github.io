import React from 'react';
import { Github, Linkedin, Terminal, Heart, Users, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { CardAnimation } from './CardAnimation';
import { ScrollAnimation } from './ScrollAnimation';
import { ImageWithFallback } from './ImageWithFallback';

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image: string;
  linkedin: string;
}

export function CoreTeam() {
  const teamMembers: TeamMember[] = [
    {
      name: "MG",
      role: "Founder & Leader",
      bio: "Hacker at heart, leader by necessity. With years of hands-on experience breaking, building, and learning, MG is focused on empowering the next generation of ethical hackers. He's committed to creating inclusive spaces where knowledge flows freely and hacker culture thrives.",
      image: "https://www.gallipoli.xyz/images/avatar.jpg",
      linkedin: "https://linkedin.com/in/mg-gallipoli"
    },
    {
      name: "k4yra",
      role: "Community Leader",
      bio: "Security engineer by day, community builder by night. Specializes in web application security and threat modeling. Dedicated to fostering collaboration and knowledge sharing in the security community.",
      image: "https://images.unsplash.com/photo-1555952517-2e8e729e0b44?auto=format&fit=crop&q=80&w=300&h=300",
      linkedin: "https://linkedin.com/in/k4yra"
    },
    {
      name: "RØØNIN",
      role: "Core Team Member",
      bio: "Red team operator with expertise in adversary emulation and infrastructure security. Passionate about creating realistic training scenarios and developing the next generation of security tools.",
      image: "https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?auto=format&fit=crop&q=80&w=300&h=300",
      linkedin: "https://linkedin.com/in/roonin"
    },
    {
      name: "caner",
      role: "Core Team Member",
      bio: "Full-stack developer turned security researcher. Specializes in API security and secure development practices. Committed to bridging the gap between development and security communities.",
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=300&h=300",
      linkedin: "https://linkedin.com/in/caner-gallipoli"
    },
    {
      name: "Revivalist",
      role: "Core Team Member",
      bio: "Malware analyst and reverse engineer with a background in digital forensics. Focuses on threat intelligence and building automated analysis tools for the community.",
      image: "https://images.unsplash.com/photo-1624705002806-5d72df19c3ad?auto=format&fit=crop&q=80&w=300&h=300",
      linkedin: "https://linkedin.com/in/revivalist"
    },
    {
      name: "F0xy",
      role: "Core Team Member",
      bio: "Bug bounty hunter and penetration tester. Specializes in finding critical vulnerabilities in web applications. Advocates for responsible disclosure and hacker education.",
      image: "https://images.unsplash.com/photo-1629904853716-f0bc54eea481?auto=format&fit=crop&q=80&w=300&h=300",
      linkedin: "https://linkedin.com/in/f0xy-gallipoli"
    },
    {
      name: "miela",
      role: "Social Media & Communications Coordinator",
      bio: "Community manager and content creator focused on making cybersecurity accessible to everyone. Builds bridges between technical experts and newcomers to the field.",
      image: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?auto=format&fit=crop&q=80&w=300&h=300",
      linkedin: "https://linkedin.com/in/miela-gallipoli"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-custom-cyan py-20">
      <div className="container mx-auto px-4">
        <ScrollAnimation>
          <section className="mb-20">
            <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">Core Team_</h1>
            <div className="max-w-3xl mx-auto text-lg font-mono">
              <p className="mb-6">
                Meet the passionate individuals who drive Gallipoli forward. Our core team brings together diverse expertise in cybersecurity, united by a common mission to empower and educate the next generation of ethical hackers.
              </p>
            </div>
          </section>
        </ScrollAnimation>

        <motion.section 
          className="mb-20"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <CardAnimation key={member.name} index={index}>
                <div className="bg-custom-cyan/5 border border-custom-cyan/30 rounded-lg overflow-hidden hover:bg-custom-cyan/10 hover:border-custom-cyan/50 transition-all duration-300">
                  <div className="p-6 flex flex-col items-center">
                    <motion.div 
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <ImageWithFallback 
                        src={member.image}
                        fallbackSrc="https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&q=80&w=300&h=300"
                        alt={member.name}
                        width={192}
                        height={192}
                        className="w-48 h-48 rounded-full object-cover object-center mb-6 border-2 border-custom-cyan/30 hover:border-custom-cyan transition-colors"
                      />
                    </motion.div>
                    <div className="text-center">
                      <motion.div 
                        className="flex items-center justify-center gap-3 mb-4"
                        whileHover={{ scale: 1.05 }}
                      >
                        <h3 className="text-xl font-bold">{member.name}</h3>
                        <a 
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-custom-cyan hover:text-white transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Linkedin className="w-5 h-5" />
                        </a>
                      </motion.div>
                      <p className="text-custom-cyan/70 font-mono text-sm mb-4">{member.role}</p>
                      <p className="text-custom-cyan/90 font-mono text-sm">{member.bio}</p>
                    </div>
                  </div>
                </div>
              </CardAnimation>
            ))}
          </div>
        </motion.section>

        <ScrollAnimation direction="up" delay={0.3}>
          <section className="mb-20 bg-custom-cyan/5 rounded-xl p-8 backdrop-blur-sm">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Our Philosophy_</h2>
            <div className="max-w-3xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    icon: Terminal,
                    title: "Open Knowledge",
                    description: "We believe in freely sharing knowledge and experience, breaking down barriers to entry in cybersecurity."
                  },
                  {
                    icon: Heart,
                    title: "Community First",
                    description: "Our strength lies in our community. We grow together, learn together, and hack together."
                  },
                  {
                    icon: Users,
                    title: "Inclusive Growth",
                    description: "Everyone has something to teach and something to learn. We embrace diversity in thoughts and approaches."
                  }
                ].map((principle, index) => (
                  <CardAnimation key={principle.title} index={index}>
                    <div className="flex flex-col items-center text-center p-6">
                      <principle.icon className="w-12 h-12 text-custom-cyan mb-4" />
                      <h3 className="text-xl font-bold mb-3">{principle.title}</h3>
                      <p className="font-mono text-custom-cyan/80">{principle.description}</p>
                    </div>
                  </CardAnimation>
                ))}
              </div>
            </div>
          </section>
        </ScrollAnimation>

        <ScrollAnimation direction="up" delay={0.4}>
          <section className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">Join Our Mission_</h2>
            <p className="font-mono text-custom-cyan/90 mb-8 max-w-2xl mx-auto">
              Passionate about cybersecurity and community building? We're always looking for dedicated individuals to join our core team. Start by becoming an active community member, share your knowledge, and help others grow.
            </p>
            <motion.button 
              className="click-ripple interactive-hover group px-8 py-4 bg-custom-cyan/10 border-2 border-custom-cyan/50 rounded-lg font-mono text-lg text-custom-cyan hover:bg-custom-cyan/20 hover:border-white hover:text-white transition-all duration-300 flex items-center justify-center mx-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Involved
              <ArrowRight className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </section>
        </ScrollAnimation>
      </div>
    </div>
  );
}