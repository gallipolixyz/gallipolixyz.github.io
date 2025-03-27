import React from 'react';
import { Twitter, Github, Linkedin, Youtube, Instagram } from 'lucide-react';
import { PageTransition } from '../components/PageTransition';

export function Social() {
  const socialLinks = [
    { icon: Twitter, href: 'https://twitter.com/gallipolixyz', label: 'Follow us on X' },
    { icon: Linkedin, href: 'https://linkedin.com/company/gallipolixyz', label: 'Connect on LinkedIn' },
    { icon: Youtube, href: 'https://youtube.com/@gallipolixyz', label: 'Watch on YouTube' },
    { icon: Github, href: 'https://github.com/gallipolixyz', label: 'Fork on GitHub' },
    { icon: Instagram, href: 'https://instagram.com/gallipolixyz', label: 'Follow on Instagram' },
  ];

  return (
    <PageTransition>
      <main className="pt-16">
        <section className="min-h-screen bg-black flex flex-col items-center justify-center text-center py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-custom-cyan">Connect_</h2>
            <p className="text-xl md:text-2xl mb-12 max-w-2xl mx-auto text-custom-cyan/90 font-mono">
              Join our community across platforms
            </p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 max-w-4xl mx-auto">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center p-6 border border-custom-cyan/30 rounded-lg backdrop-blur-sm bg-custom-cyan/5 hover:bg-custom-cyan/10 hover:border-custom-cyan/50 transition-all duration-300 group"
                  aria-label={social.label}
                >
                  <social.icon className="w-8 h-8 mb-3 text-custom-cyan group-hover:text-white transition-colors" />
                  <span className="font-mono text-sm text-custom-cyan group-hover:text-white transition-colors">
                    {social.label.split(' ').pop()}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>
    </PageTransition>
  );
}