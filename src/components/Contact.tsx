import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Mail,
  Briefcase,
  Mic,
  Send,
  Copy,
  Check,
  Sparkles,
  MessageSquare,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Video,
  Radio
} from 'lucide-react';

type TabType = 'contact' | 'career' | 'guest';

export function Contact() {
  const [activeTab, setActiveTab] = useState<TabType>('contact');
  const [copied, setCopied] = useState(false);

  const emailAddress = 'contact@gallipoli.xyz';
  const careerGoogleFormUrl =
    'https://docs.google.com/forms/d/1XJPbnDmhhoLHa19oPkcCG4J9TFbk77PB5F-KFV0axFc/viewform?ts=69873a71&edit_requested=true';
  const guestGoogleFormUrl =
    'https://docs.google.com/forms/d/e/1FAIpQLScobBPi-s6uG5f2KZGH_9dLlxrKCESxYqzy4G4gr1xXlvq58w/viewform';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(emailAddress);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const openEmailSmart = (subjectText = '', bodyText = '') => {
    const isMobile =
      typeof navigator !== 'undefined' &&
      /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (isMobile) {
      const params: string[] = [];
      if (subjectText) params.push(`subject=${encodeURIComponent(subjectText)}`);
      if (bodyText) params.push(`body=${encodeURIComponent(bodyText)}`);
      const queryString = params.length > 0 ? `?${params.join('&')}` : '';
      window.location.href = `mailto:${emailAddress}${queryString}`;
    } else {
      let url = `https://mail.google.com/mail/?view=cm&fs=1&to=${emailAddress}`;
      if (subjectText) url += `&su=${encodeURIComponent(subjectText)}`;
      if (bodyText) url += `&body=${encodeURIComponent(bodyText)}`;
      window.open(url, '_blank');
    }
  };

  const handleSpeakerPitchEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    openEmailSmart(
      '[Speaker Proposal] Guest Session Submission',
      `Hi Gallipoli Team,\n\nI would like to propose a guest session / workshop for the Gallipoli community:\n\n- Topic / Title: \n- Target Audience (Beginner / Intermediate / Advanced): \n- Format (Workshop / Live CTF / Presentation): \n- Speaker Bio / Prior Work: \n\nLooking forward to hearing from you!`
    );
  };

  const handleGeneralEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    openEmailSmart();
  };

  const tabs = [
    { id: 'contact' as TabType, label: 'Contact', icon: Mail },
    { id: 'career' as TabType, label: 'Career', icon: Briefcase },
    { id: 'guest' as TabType, label: 'Be a Guest', icon: Mic },
  ];

  return (
    <div className="min-h-screen bg-black text-custom-cyan pt-24 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-10">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold font-mono tracking-tight text-custom-cyan mb-4"
          >
            Contact Us_
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-custom-cyan/80 font-mono text-sm md:text-base max-w-2xl mx-auto leading-relaxed"
          >
            Whether you want to reach out, apply for our career program, or join our
            broadcasts as a guest speaker — we'd love to hear from you.
          </motion.p>
        </div>

        {/* Tab Buttons */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-2xl mx-auto mb-10">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center justify-center py-4 px-3 sm:px-6 rounded-xl font-mono text-sm sm:text-base transition-all duration-300 relative group border ${
                  isActive
                    ? 'border-custom-cyan bg-custom-cyan/15 text-white shadow-[0_0_25px_rgba(0,255,255,0.3)] ring-1 ring-custom-cyan/50'
                    : 'border-custom-cyan/35 bg-[#03141b]/80 text-custom-cyan/85 hover:text-white hover:border-custom-cyan/60 hover:bg-custom-cyan/10 hover:shadow-[0_0_15px_rgba(0,255,255,0.15)]'
                }`}
              >
                <Icon
                  size={20}
                  className={`mb-2 transition-transform duration-300 group-hover:scale-110 ${
                    isActive ? 'text-custom-cyan drop-shadow-[0_0_8px_rgba(0,255,255,0.8)]' : 'text-custom-cyan/75 group-hover:text-custom-cyan'
                  }`}
                />
                <span className="font-semibold tracking-wide">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Main Content Card */}
        <div className="rounded-2xl border border-custom-cyan/35 bg-[radial-gradient(ellipse_at_top,rgba(0,255,255,0.1),rgba(2,16,22,0.95)_55%,rgba(0,0,0,0.98)_100%)] backdrop-blur-md p-6 sm:p-10 shadow-[0_0_40px_rgba(0,255,255,0.12)] relative overflow-hidden">
          {/* Subtle Ambient Background Glow */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-48 bg-custom-cyan/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-custom-cyan/5 rounded-full blur-3xl pointer-events-none" />

          <AnimatePresence mode="wait">
            {/* TAB 1: CONTACT */}
            {activeTab === 'contact' && (
              <motion.div
                key="contact-tab"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold font-mono text-white mb-2 drop-shadow-[0_0_10px_rgba(0,255,255,0.3)]">
                    Email Us Directly<span className="text-custom-cyan">_</span>
                  </h2>
                  <p className="text-white/80 font-mono text-sm sm:text-base leading-relaxed">
                    Have a question, sponsorship inquiry, partnership proposal, or feedback? Reach out
                    directly and we'll get back to you promptly.
                  </p>
                </div>

                {/* Email Box Card */}
                <div className="rounded-2xl border border-custom-cyan/40 bg-[radial-gradient(circle_at_top,rgba(0,255,255,0.14),rgba(2,20,27,0.85)_50%,rgba(1,10,14,0.95)_100%)] p-8 sm:p-10 text-center relative overflow-hidden group hover:border-custom-cyan/60 hover:shadow-[0_0_30px_rgba(0,255,255,0.18)] transition-all duration-300">
                  <div className="w-14 h-14 rounded-full border border-custom-cyan/60 bg-custom-cyan/15 flex items-center justify-center mx-auto mb-4 text-custom-cyan shadow-[0_0_20px_rgba(0,255,255,0.4)] group-hover:scale-110 group-hover:shadow-[0_0_25px_rgba(0,255,255,0.6)] transition-all duration-300">
                    <Mail size={24} className="text-custom-cyan drop-shadow-[0_0_6px_rgba(0,255,255,0.6)]" />
                  </div>

                  <span className="block text-xs font-mono tracking-widest text-custom-cyan font-bold uppercase mb-2 drop-shadow-[0_0_8px_rgba(0,255,255,0.4)]">
                    EMAIL ADDRESS
                  </span>

                  <div className="text-xl sm:text-2xl md:text-3xl font-mono font-bold text-white tracking-wider mb-6 drop-shadow-[0_0_12px_rgba(0,255,255,0.35)] selection:bg-custom-cyan selection:text-black">
                    {emailAddress}
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-4">
                    <a
                      href={`mailto:${emailAddress}`}
                      onClick={handleGeneralEmail}
                      className="px-7 py-3.5 rounded-lg border border-custom-cyan bg-custom-cyan/25 text-white hover:border-white hover:bg-custom-cyan/35 hover:shadow-[0_0_25px_rgba(0,255,255,0.5)] font-mono text-sm sm:text-base font-semibold flex items-center gap-2.5 transition-all duration-300 shadow-[0_0_18px_rgba(0,255,255,0.25)]"
                    >
                      <Send size={18} />
                      <span>Send Email</span>
                    </a>

                    <button
                      onClick={handleCopyEmail}
                      className="px-7 py-3.5 rounded-lg border border-custom-cyan/40 bg-[#03141b]/90 text-custom-cyan hover:border-custom-cyan hover:bg-custom-cyan/15 hover:text-white font-mono text-sm sm:text-base font-medium flex items-center gap-2.5 transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,255,255,0.25)]"
                    >
                      {copied ? (
                        <>
                          <Check size={18} className="text-custom-cyan animate-pulse" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={18} />
                          <span>Copy Address</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Sub Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="rounded-xl border border-custom-cyan/30 bg-[#021820]/65 p-5 hover:border-custom-cyan/50 hover:bg-custom-cyan/10 transition-all shadow-[0_0_15px_rgba(0,255,255,0.05)]">
                    <div className="flex items-center gap-2 mb-2 text-white font-mono font-bold text-base">
                      <Sparkles size={18} className="text-custom-cyan drop-shadow-[0_0_6px_rgba(0,255,255,0.5)]" />
                      <span>Partnerships & Events</span>
                    </div>
                    <p className="text-white/75 font-mono text-sm leading-relaxed">
                      For community sponsorships, hackathon collaborations, or joint workshops.
                    </p>
                  </div>

                  <div className="rounded-xl border border-custom-cyan/30 bg-[#021820]/65 p-5 hover:border-custom-cyan/50 hover:bg-custom-cyan/10 transition-all shadow-[0_0_15px_rgba(0,255,255,0.05)]">
                    <div className="flex items-center gap-2 mb-2 text-white font-mono font-bold text-base">
                      <MessageSquare size={18} className="text-custom-cyan drop-shadow-[0_0_6px_rgba(0,255,255,0.5)]" />
                      <span>General Questions</span>
                    </div>
                    <p className="text-white/75 font-mono text-sm leading-relaxed">
                      Feedback, community participation, or questions regarding our open resources.
                    </p>
                  </div>
                </div>

                {/* Response Time Alert */}
                <div className="rounded-xl border border-custom-cyan/25 bg-[#021820]/45 p-4 text-center">
                  <p className="text-white/80 font-mono text-xs sm:text-sm">
                    We typically respond within{' '}
                    <span className="text-custom-cyan font-bold drop-shadow-[0_0_6px_rgba(0,255,255,0.4)]">24–48 hours</span>. For urgent
                    matters, please indicate it in your subject line.
                  </p>
                </div>
              </motion.div>
            )}

            {/* TAB 2: CAREER */}
            {activeTab === 'career' && (
              <motion.div
                key="career-tab"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold font-mono text-white mb-2 drop-shadow-[0_0_10px_rgba(0,255,255,0.3)]">
                    Career Matching Program<span className="text-custom-cyan">_</span>
                  </h2>
                  <p className="text-white/80 font-mono text-sm sm:text-base leading-relaxed">
                    Join the Gallipoli Career Matching Program to connect with top cybersecurity
                    companies looking for talent like you.
                  </p>
                </div>

                {/* Candidate & Companies Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-xl border border-custom-cyan/30 bg-[#021820]/65 p-5 hover:border-custom-cyan/50 hover:bg-custom-cyan/10 transition-all shadow-[0_0_15px_rgba(0,255,255,0.05)]">
                    <h3 className="text-white font-mono font-bold text-base mb-2">
                      For Candidates
                    </h3>
                    <p className="text-white/75 font-mono text-sm leading-relaxed">
                      Submit your profile and get matched with vetted cybersecurity companies
                      seeking your specific skill set.
                    </p>
                  </div>

                  <div className="rounded-xl border border-custom-cyan/30 bg-[#021820]/65 p-5 hover:border-custom-cyan/50 hover:bg-custom-cyan/10 transition-all shadow-[0_0_15px_rgba(0,255,255,0.05)]">
                    <h3 className="text-white font-mono font-bold text-base mb-2">
                      For Companies
                    </h3>
                    <p className="text-white/75 font-mono text-sm leading-relaxed">
                      Access a curated pool of passionate cybersecurity professionals and students
                      ready for their next role.
                    </p>
                  </div>
                </div>

                {/* How It Works Container */}
                <div className="rounded-xl border border-custom-cyan/35 bg-[radial-gradient(ellipse_at_top_left,rgba(0,255,255,0.08),rgba(2,20,26,0.75)_60%)] p-6 sm:p-7 shadow-[0_0_20px_rgba(0,255,255,0.05)]">
                  <span className="block text-xs font-mono tracking-widest text-custom-cyan font-bold uppercase mb-4 drop-shadow-[0_0_8px_rgba(0,255,255,0.3)]">
                    HOW IT WORKS
                  </span>

                  <div className="space-y-3 font-mono text-sm text-white/90">
                    <div className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full border border-custom-cyan bg-custom-cyan/15 text-custom-cyan font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-[0_0_8px_rgba(0,255,255,0.3)]">
                        1
                      </span>
                      <span>Fill out the official Career application form</span>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full border border-custom-cyan bg-custom-cyan/15 text-custom-cyan font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-[0_0_8px_rgba(0,255,255,0.3)]">
                        2
                      </span>
                      <span>Our team reviews your profile, technical focus, and interests</span>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full border border-custom-cyan bg-custom-cyan/15 text-custom-cyan font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-[0_0_8px_rgba(0,255,255,0.3)]">
                        3
                      </span>
                      <span>Profiles are aligned with partner company opportunities</span>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full border border-custom-cyan bg-custom-cyan/15 text-custom-cyan font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-[0_0_8px_rgba(0,255,255,0.3)]">
                        4
                      </span>
                      <span>You get directly contacted when a suitable match is identified</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <a
                    href={careerGoogleFormUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-7 py-3.5 rounded-lg border border-custom-cyan bg-custom-cyan/25 text-white hover:border-white hover:bg-custom-cyan/35 hover:shadow-[0_0_25px_rgba(0,255,255,0.5)] font-mono text-sm sm:text-base font-semibold flex items-center gap-2.5 transition-all duration-300 shadow-[0_0_18px_rgba(0,255,255,0.25)]"
                  >
                    <ExternalLink size={18} />
                    <span>Apply via Google Form</span>
                  </a>

                  <Link
                    to="/career"
                    className="px-7 py-3.5 rounded-lg border border-custom-cyan/40 bg-[#03141b]/90 text-custom-cyan hover:border-custom-cyan hover:bg-custom-cyan/15 hover:text-white font-mono text-sm sm:text-base font-medium flex items-center gap-1.5 transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,255,255,0.25)]"
                  >
                    <span>Learn More</span>
                    <ChevronRight size={18} />
                  </Link>
                </div>
              </motion.div>
            )}

            {/* TAB 3: BE A GUEST */}
            {activeTab === 'guest' && (
              <motion.div
                key="guest-tab"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold font-mono text-white mb-2 drop-shadow-[0_0_10px_rgba(0,255,255,0.3)]">
                    Be a Guest Speaker<span className="text-custom-cyan">_</span>
                  </h2>
                  <p className="text-white/80 font-mono text-sm sm:text-base leading-relaxed">
                    Want to share your knowledge with our cybersecurity community? Apply to be a guest on
                    our broadcasts, workshops, or live CTF walkthroughs.
                  </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-xl border border-custom-cyan/30 bg-[#021820]/65 p-5 hover:border-custom-cyan/50 hover:bg-custom-cyan/10 transition-all shadow-[0_0_15px_rgba(0,255,255,0.05)]">
                    <div className="flex items-center gap-2 mb-2 text-white font-mono font-bold text-base">
                      <Radio size={18} className="text-custom-cyan drop-shadow-[0_0_6px_rgba(0,255,255,0.5)]" />
                      <span>Share Your Expertise</span>
                    </div>
                    <p className="text-white/75 font-mono text-sm leading-relaxed">
                      Present on penetration testing, cloud security, OSINT, reverse engineering,
                      or your personal research.
                    </p>
                  </div>

                  <div className="rounded-xl border border-custom-cyan/30 bg-[#021820]/65 p-5 hover:border-custom-cyan/50 hover:bg-custom-cyan/10 transition-all shadow-[0_0_15px_rgba(0,255,255,0.05)]">
                    <div className="flex items-center gap-2 mb-2 text-white font-mono font-bold text-base">
                      <Mic size={18} className="text-custom-cyan drop-shadow-[0_0_6px_rgba(0,255,255,0.5)]" />
                      <span>Reach the Community</span>
                    </div>
                    <p className="text-white/75 font-mono text-sm leading-relaxed">
                      Engage directly with hundreds of active cybersecurity researchers, students, and
                      industry professionals.
                    </p>
                  </div>
                </div>

                {/* How It Works Container */}
                <div className="rounded-xl border border-custom-cyan/35 bg-[radial-gradient(ellipse_at_top_left,rgba(0,255,255,0.08),rgba(2,20,26,0.75)_60%)] p-6 sm:p-7 shadow-[0_0_20px_rgba(0,255,255,0.05)]">
                  <span className="block text-xs font-mono tracking-widest text-custom-cyan font-bold uppercase mb-4 drop-shadow-[0_0_8px_rgba(0,255,255,0.3)]">
                    HOW IT WORKS
                  </span>

                  <div className="space-y-3 font-mono text-sm text-white/90">
                    <div className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full border border-custom-cyan bg-custom-cyan/15 text-custom-cyan font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-[0_0_8px_rgba(0,255,255,0.3)]">
                        1
                      </span>
                      <span>Fill out the Speaker application form with your topic and background</span>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full border border-custom-cyan bg-custom-cyan/15 text-custom-cyan font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-[0_0_8px_rgba(0,255,255,0.3)]">
                        2
                      </span>
                      <span>Our content team reviews your proposal and checks topic relevance</span>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full border border-custom-cyan bg-custom-cyan/15 text-custom-cyan font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-[0_0_8px_rgba(0,255,255,0.3)]">
                        3
                      </span>
                      <span>We coordinate date, broadcast platform, and a brief tech check</span>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full border border-custom-cyan bg-custom-cyan/15 text-custom-cyan font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-[0_0_8px_rgba(0,255,255,0.3)]">
                        4
                      </span>
                      <span>Go live and deliver your session to the Gallipoli audience</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <a
                    href={guestGoogleFormUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-7 py-3.5 rounded-lg border border-custom-cyan bg-custom-cyan/25 text-white hover:border-white hover:bg-custom-cyan/35 hover:shadow-[0_0_25px_rgba(0,255,255,0.5)] font-mono text-sm sm:text-base font-semibold flex items-center gap-2.5 transition-all duration-300 shadow-[0_0_18px_rgba(0,255,255,0.25)]"
                  >
                    <ExternalLink size={18} />
                    <span>Apply via Google Form</span>
                  </a>

                  <a
                    href={`mailto:${emailAddress}?subject=${encodeURIComponent('[Speaker Proposal] Guest Session Submission')}`}
                    onClick={handleSpeakerPitchEmail}
                    className="px-7 py-3.5 rounded-lg border border-custom-cyan/40 bg-[#03141b]/90 text-custom-cyan hover:border-custom-cyan hover:bg-custom-cyan/15 hover:text-white font-mono text-sm sm:text-base font-medium flex items-center gap-2.5 transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,255,255,0.25)]"
                  >
                    <Mail size={18} />
                    <span>Pitch via Email</span>
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
