import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, ArrowLeft, BookOpen, Shield, Target, Coffee, Globe, ExternalLink, CheckCircle, AlertCircle, Play } from 'lucide-react';
import { Event } from '../types/event';
import { getEventById } from '../data/events';
import { motion } from 'framer-motion';
import { PageTransition } from './PageTransition';

const getEventTypeIcon = (type: Event['type']) => {
  switch (type) {
    case 'training':
      return BookOpen;
    case 'webinar':
      return Globe;
    case 'ctf':
      return Target;
    case 'meetup':
      return Coffee;
    case 'conference':
      return Shield;
    default:
      return Calendar;
  }
};

const getDifficultyColor = (difficulty: Event['difficulty']) => {
  switch (difficulty) {
    case 'beginner':
      return 'text-green-400 border-green-400/50 bg-green-400/10';
    case 'intermediate':
      return 'text-yellow-400 border-yellow-400/50 bg-yellow-400/10';
    case 'advanced':
      return 'text-red-400 border-red-400/50 bg-red-400/10';
    default:
      return 'text-custom-cyan border-custom-cyan/50 bg-custom-cyan/10';
  }
};

const getTypeColor = (type: Event['type']) => {
  switch (type) {
    case 'training':
      return 'text-blue-400 border-blue-400/50 bg-blue-400/10';
    case 'webinar':
      return 'text-purple-400 border-purple-400/50 bg-purple-400/10';
    case 'ctf':
      return 'text-red-400 border-red-400/50 bg-red-400/10';
    case 'meetup':
      return 'text-green-400 border-green-400/50 bg-green-400/10';
    case 'conference':
      return 'text-custom-cyan border-custom-cyan/50 bg-custom-cyan/10';
    default:
      return 'text-custom-cyan border-custom-cyan/50 bg-custom-cyan/10';
  }
};

const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export function EventDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  if (!id) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-black text-custom-cyan flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Event Not Found</h1>
            <Link to="/events" className="text-custom-cyan hover:text-white">
              ← Back to Events
            </Link>
          </div>
        </div>
      </PageTransition>
    );
  }

  const event = getEventById(id);

  if (!event) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-black text-custom-cyan flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-custom-cyan/50 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-4">Event Not Found</h1>
            <p className="font-mono text-custom-cyan/70 mb-6">The event you're looking for doesn't exist or has been removed.</p>
            <Link
              to="/events"
              className="click-ripple interactive-hover inline-flex items-center px-4 py-2 bg-custom-cyan/10 border border-custom-cyan/50 rounded font-mono text-custom-cyan hover:bg-custom-cyan/20 hover:border-white hover:text-white transition-all"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Events
            </Link>
          </div>
        </div>
      </PageTransition>
    );
  }

  const TypeIcon = getEventTypeIcon(event.type);
  const isUpcoming = !event.isPast;

  return (
    <PageTransition>
      <div className="min-h-screen bg-black text-custom-cyan py-20 overflow-x-hidden">
        <div className="container mx-auto px-2 sm:px-4">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <button
              onClick={() => navigate('/events')}
              className="click-ripple interactive-hover inline-flex items-center px-4 py-2 bg-custom-cyan/10 border border-custom-cyan/50 rounded font-mono text-custom-cyan hover:bg-custom-cyan/20 hover:border-white hover:text-white transition-all"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Events
            </button>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8 min-w-0">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6 sm:space-y-8 min-w-0">
              {/* Header */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-black/40 border border-custom-cyan/30 rounded-lg p-4 sm:p-8 backdrop-blur-sm min-w-0 overflow-x-auto"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mb-6 min-w-0">
                  {/* Icon + Title + Badges aynı satırda hizalı */}
                  <div className="flex flex-row items-center gap-4 min-w-0 w-full">
                    <div className="p-4 bg-custom-cyan/10 border border-custom-cyan/30 rounded-lg flex-shrink-0 flex items-center justify-center">
                      <TypeIcon className="w-8 h-8 text-custom-cyan" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2 min-w-0">
                        <span className={`px-3 py-1 text-sm font-mono border rounded-full ${getTypeColor(event.type)}`}>
                          {event.type.toUpperCase()}
                        </span>
                        <span className={`px-3 py-1 text-sm font-mono border rounded-full ${getDifficultyColor(event.difficulty)}`}>
                          {event.difficulty.toUpperCase()}
                        </span>
                        {isUpcoming ? (
                          <div className="px-3 py-1 bg-custom-cyan/20 border border-custom-cyan/50 rounded-full">
                            <span className="text-sm font-mono text-custom-cyan">UPCOMING</span>
                          </div>
                        ) : (
                          <div className="px-3 py-1 bg-white/10 border border-white/30 rounded-full">
                            <span className="text-sm font-mono text-white/70">PAST</span>
                          </div>
                        )}
                      </div>
                      <h1 className="text-xl sm:text-2xl md:text-4xl font-bold text-white mb-1 sm:mb-2 break-words min-w-0">{event.title}</h1>
                    </div>
                  </div>
                </div>
                <p className="text-base sm:text-lg font-mono text-custom-cyan/90 break-words min-w-0 ml-0 sm:ml-20">{event.description}</p>
              </motion.section>

              {/* Event Details */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-black/40 border border-custom-cyan/30 rounded-lg p-8 backdrop-blur-sm"
              >
                <h2 className="text-2xl font-bold text-white mb-6">Event Details_</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-custom-cyan" />
                    <div>
                      <div className="text-sm font-mono text-custom-cyan/70">Date</div>
                      <div className="font-mono text-white">{formatDate(event.date)}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-custom-cyan" />
                    <div>
                      <div className="text-sm font-mono text-custom-cyan/70">Time & Duration</div>
                      <div className="font-mono text-white">{event.time} • {event.duration}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-custom-cyan" />
                    <div>
                      <div className="text-sm font-mono text-custom-cyan/70">Location</div>
                      <div className="font-mono text-white capitalize">{event.location}</div>
                    </div>
                  </div>
                  {event.maxParticipants && (
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-custom-cyan" />
                      <div>
                        <div className="text-sm font-mono text-custom-cyan/70">Participants</div>
                        <div className="font-mono text-white">
                          {event.currentParticipants || 0}/{event.maxParticipants}
                        </div>
                      </div>
                    </div>
                  )}
                  {event.instructor && (
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-custom-cyan" />
                      <div>
                        <div className="text-sm font-mono text-custom-cyan/70">Instructor</div>
                        <div className="font-mono text-white">{event.instructor}</div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.section>

              {/* Prerequisites */}
              {event.prerequisites && event.prerequisites.length > 0 && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-black/40 border border-custom-cyan/30 rounded-lg p-8 backdrop-blur-sm"
                >
                  <h2 className="text-2xl font-bold text-white mb-6">Prerequisites_</h2>
                  <div className="space-y-3">
                    {event.prerequisites.map((prerequisite, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="font-mono text-custom-cyan/90">{prerequisite}</span>
                      </div>
                    ))}
                  </div>
                </motion.section>
              )}

              {/* Agenda */}
              {event.agenda && event.agenda.length > 0 && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-black/40 border border-custom-cyan/30 rounded-lg p-8 backdrop-blur-sm"
                >
                  <h2 className="text-2xl font-bold text-white mb-6">Agenda_</h2>
                  <div className="space-y-3">
                    {event.agenda.map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-custom-cyan/20 border border-custom-cyan/50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-mono text-custom-cyan">{index + 1}</span>
                        </div>
                        <span className="font-mono text-custom-cyan/90">{item}</span>
                      </div>
                    ))}
                  </div>
                </motion.section>
              )}

              {/* Tags */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-black/40 border border-custom-cyan/30 rounded-lg p-8 backdrop-blur-sm"
              >
                <h2 className="text-2xl font-bold text-white mb-6">Tags_</h2>
                <div className="flex flex-wrap gap-3">
                  {event.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-2 bg-white/5 border border-white/20 rounded font-mono text-white/80"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </motion.section>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Registration Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-black/40 border border-custom-cyan/30 rounded-lg p-6 backdrop-blur-sm sticky top-24"
              >
                <h3 className="text-xl font-bold text-white mb-4">Join_</h3>

                {isUpcoming ? (
                  <div className="space-y-4">

                    {event.meetingLink && (
                      <a
                        href={event.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="click-ripple interactive-hover w-full inline-flex items-center justify-center px-6 py-3 bg-custom-cyan/10 border border-custom-cyan/50 rounded font-mono text-custom-cyan hover:bg-custom-cyan/20 hover:border-white hover:text-white transition-all"
                      >
                        Open Event
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </a>
                    )}

                    <a
                      href="https://t.me/gallipolixyz"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="click-ripple interactive-hover w-full inline-flex items-center justify-center px-6 py-3 bg-white/10 border border-white/30 rounded font-mono text-white hover:bg-white/20 hover:border-white transition-all"
                    >
                      Join Telegram Group
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  </div>
                ) : (
                  <div className="p-4 bg-white/10 border border-white/30 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-white/70" />
                      <span className="font-mono text-white/70">Event Completed</span>
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Quick Info */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-black/40 border border-custom-cyan/30 rounded-lg p-6 backdrop-blur-sm"
              >
                <h3 className="text-xl font-bold text-white mb-4">Quick Info_</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="font-mono text-custom-cyan/70">Type:</span>
                    <span className="font-mono text-white capitalize">{event.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-mono text-custom-cyan/70">Level:</span>
                    <span className="font-mono text-white capitalize">{event.difficulty}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-mono text-custom-cyan/70">Duration:</span>
                    <span className="font-mono text-white">{event.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-mono text-custom-cyan/70">Format:</span>
                    <span className="font-mono text-white capitalize">{event.location}</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
} 