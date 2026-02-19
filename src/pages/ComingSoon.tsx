import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Zap, Users, Target, Shield, Code, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ComingSoon: React.FC = () => {
  const features = [
    {
      icon: <Target className="w-8 h-8" />,
      title: "Advanced CTF Challenges",
      description: "Interactive capture-the-flag challenges with real-world scenarios"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Security Labs",
      description: "Hands-on virtual environments for practical learning"
    },
    {
      icon: <Code className="w-8 h-8" />,
      title: "Code Repository",
      description: "Open-source security tools and scripts"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Global Community",
      description: "Connect with security professionals worldwide"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Mentorship Program",
      description: "One-on-one guidance from industry experts"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Live Workshops",
      description: "Real-time interactive security workshops"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-custom-cyan flex flex-col items-center justify-center relative overflow-hidden py-20">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,255,0.1),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(0,255,255,0.05),transparent_50%)]"></div>

      <div className="container mx-auto px-4 max-w-4xl relative z-10 text-center">
        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <div className="inline-flex items-center gap-3 mb-8">
            <Clock className="w-12 h-12 text-custom-cyan" />
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight font-mono drop-shadow-[0_2px_16px_rgba(0,255,255,0.3)]">
              Coming Soon_
            </h1>
          </div>

          <p className="text-xl md:text-2xl font-mono text-custom-cyan/90 mb-8 leading-relaxed">
            We're working hard to bring you something amazing
          </p>

          <div className="bg-gradient-to-r from-custom-cyan/20 to-custom-cyan/10 border border-custom-cyan/30 rounded-2xl p-8 mb-12 backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-white mb-4 font-mono">
              🚀 Something Big is Coming
            </h2>
            <p className="text-custom-cyan/80 font-mono text-lg leading-relaxed">
              Our team is currently developing exciting new features and content.
              This section will be available soon with cutting-edge cybersecurity tools,
              interactive challenges, and exclusive learning resources.
            </p>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-16"
        >
          <h3 className="text-2xl font-bold text-white mb-8 font-mono">
            What's Coming Next_
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                className="bg-gradient-to-br from-black/60 to-gray-900/60 border border-custom-cyan/30 rounded-xl p-6 hover:border-custom-cyan/50 hover:bg-gradient-to-br hover:from-black/80 hover:to-gray-900/80 transition-all duration-300 backdrop-blur-sm"
              >
                <div className="text-custom-cyan mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h4 className="text-lg font-bold text-white mb-2 font-mono">
                  {feature.title}
                </h4>
                <p className="text-custom-cyan/70 font-mono text-sm">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Progress Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-16"
        >
          <div className="bg-gradient-to-r from-custom-cyan/10 to-custom-cyan/5 border border-custom-cyan/20 rounded-2xl p-8 backdrop-blur-sm">
            <h3 className="text-xl font-bold text-white mb-6 font-mono">
              Development Progress
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-custom-cyan/80">Frontend Development</span>
                <span className="font-mono text-custom-cyan">75%</span>
              </div>
              <div className="w-full bg-custom-cyan/20 rounded-full h-2">
                <div className="bg-custom-cyan h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-mono text-custom-cyan/80">Backend Integration</span>
                <span className="font-mono text-custom-cyan">60%</span>
              </div>
              <div className="w-full bg-custom-cyan/20 rounded-full h-2">
                <div className="bg-custom-cyan h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-mono text-custom-cyan/80">Content Creation</span>
                <span className="font-mono text-custom-cyan">85%</span>
              </div>
              <div className="w-full bg-custom-cyan/20 rounded-full h-2">
                <div className="bg-custom-cyan h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="bg-gradient-to-r from-custom-cyan/20 to-custom-cyan/10 border border-custom-cyan/40 rounded-2xl p-8 backdrop-blur-sm">
            <h3 className="text-2xl font-bold text-white mb-4 font-mono">
              Stay Updated_
            </h3>
            <p className="text-custom-cyan/80 font-mono mb-6">
              Join our community to get notified when this feature launches and receive exclusive early access.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://t.me/gallipolixyz"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-custom-cyan/20 border border-custom-cyan/50 rounded-lg text-custom-cyan hover:bg-custom-cyan/30 hover:border-custom-cyan transition-all duration-300 font-mono"
              >
                <Users className="w-5 h-5" />
                Join Telegram Community
              </a>

              <a
                href="https://github.com/gallipolixyz"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-custom-cyan/10 border border-custom-cyan/30 rounded-lg text-custom-cyan hover:bg-custom-cyan/20 hover:border-custom-cyan transition-all duration-300 font-mono"
              >
                <Code className="w-5 h-5" />
                Follow on GitHub
              </a>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 right-20 w-2 h-2 bg-custom-cyan/50 rounded-full animate-pulse"></div>
      <div className="absolute bottom-40 left-20 w-1 h-1 bg-custom-cyan/30 rounded-full animate-ping"></div>
      <div className="absolute top-1/2 left-10 w-1 h-1 bg-custom-cyan/40 rounded-full animate-pulse"></div>
      <div className="absolute bottom-20 right-40 w-2 h-2 bg-custom-cyan/60 rounded-full animate-ping"></div>
    </div>
  );
};

export default ComingSoon; 