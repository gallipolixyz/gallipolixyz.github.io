import { useParams, useNavigate, Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, ArrowLeft, BookOpen, Shield, Target, Coffee, Globe, ExternalLink, CheckCircle, AlertCircle, Play, Linkedin } from 'lucide-react';
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

const getYouTubeEmbedUrl = (url?: string): string | null => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
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
  const embedVideoUrl = getYouTubeEmbedUrl(event.youtubeUrl);
  const instructorName = event.speaker?.name || event.instructor;

  return (
    <PageTransition>
      <div className="min-h-screen bg-black text-custom-cyan py-20 overflow-x-hidden">
        <div className="container mx-auto px-2 sm:px-4">
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
            <div className="lg:col-span-2 space-y-6 sm:space-y-8 min-w-0">
              
              {!isUpcoming && embedVideoUrl && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-black/40 border border-custom-cyan/30 rounded-lg p-2 sm:p-4 backdrop-blur-sm"
                >
                  <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-custom-cyan/20 bg-black">
                    <iframe
                      src={embedVideoUrl}
                      title={event.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute top-0 left-0 w-full h-full border-0"
                    ></iframe>
                  </div>
                </motion.section>
              )}

              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-black/40 border border-custom-cyan/30 rounded-lg p-4 sm:p-8 backdrop-blur-sm min-w-0 overflow-x-auto"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mb-6 min-w-0">
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

              {instructorName && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                  className="bg-black/40 border border-custom-cyan/30 rounded-lg p-6 sm:p-8 backdrop-blur-sm"
                >
                  <h2 className="text-2xl font-bold text-white mb-6">Speaker Profile_</h2>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                    {event.speaker?.image ? (
                      <img 
                        src={event.speaker.image} 
                        alt={instructorName} 
                        className="w-20 h-20 rounded-full object-cover border-2 border-custom-cyan/40 bg-custom-cyan/5 flex-shrink-0"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full border-2 border-custom-cyan/30 bg-custom-cyan/10 flex items-center justify-center flex-shrink-0">
                        <Shield className="w-8 h-8 text-custom-cyan/70" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-4 mb-2">
                        <div>
                          <h3 className="text-xl font-bold text-white">{instructorName}</h3>
                          <p className="text-sm font-mono text-custom-cyan/80">{event.speaker?.role || 'Guest Instructor'}</p>
                        </div>
                        {event.speaker?.linkedin && (
                          <a 
                            href={event.speaker.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-custom-cyan/10 hover:bg-custom-cyan/20 border border-custom-cyan/30 hover:border-custom-cyan text-custom-cyan hover:text-white rounded transition-all"
                            title="LinkedIn Profile"
                          >
                            <Linkedin className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                      <p className="text-sm font-mono text-custom-cyan/70 break-words leading-relaxed">
                        {event.speaker?.bio || 'Experienced professional contributing cyber security knowledge to the Gallipoli ecosystem.'}
                      </p>
                    </div>
                  </div>
                </motion.section>
              )}

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
                </div>
              </motion.section>

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

            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-black/40 border border-custom-cyan/30 rounded-lg p-6 backdrop-blur-sm sticky top-24"
              >
                <h3 className="text-xl font-bold text-white mb-4">Action_</h3>

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
                  <div className="space-y-4">
                    <div className="p-4 bg-white/5 border border-white/20 rounded-lg text-center">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <Calendar className="w-5 h-5 text-white/50" />
                        <span className="font-mono text-white/70 text-sm">Event Completed</span>
                      </div>
                    </div>
                    {event.youtubeUrl && (
                      <a
                        href={event.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="click-ripple interactive-hover w-full inline-flex items-center justify-center px-6 py-3 bg-red-500/10 border border-red-500/40 rounded font-mono text-red-400 hover:bg-red-500/20 hover:border-red-500 hover:text-white transition-all"
                      >
                        Watch on YouTube
                        <Play className="w-4 h-4 ml-2 fill-current" />
                      </a>
                    )}
                  </div>
                )}
              </motion.div>

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