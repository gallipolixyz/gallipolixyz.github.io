import React from 'react';
import { Calendar, Clock, MapPin, Users, ArrowRight, BookOpen, Shield, Target, Coffee, Globe } from 'lucide-react';
import { Event } from '../types/event';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface EventCardProps {
  event: Event;
  index?: number;
}

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
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export function EventCard({ event, index = 0 }: EventCardProps) {
  const TypeIcon = getEventTypeIcon(event.type);
  const isUpcoming = !event.isPast;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link
        to={`/events/${event.id}`}
        className={`relative block bg-black/40 border rounded-lg p-6 pt-12 backdrop-blur-sm hover:bg-black/60 transition-all duration-300 group ${isUpcoming
          ? 'border-custom-cyan/30 hover:border-custom-cyan/60'
          : 'border-white/20 hover:border-white/40 opacity-75'
          }`}
        style={{ textDecoration: 'none' }}
      >
        <div className="absolute top-4 right-4 z-10">
          {isUpcoming ? (
            <div className="px-2 py-1 bg-custom-cyan/20 border border-custom-cyan/50 rounded-full">
              <span className="text-xs font-mono text-custom-cyan">UPCOMING</span>
            </div>
          ) : (
            <div className="px-2 py-1 bg-white/10 border border-white/30 rounded-full">
              <span className="text-xs font-mono text-white/70">PAST</span>
            </div>
          )}
        </div>

        <div className="flex items-start gap-4 mb-4">
          <div className="p-3 bg-custom-cyan/10 border border-custom-cyan/30 rounded-lg">
            <TypeIcon className="w-6 h-6 text-custom-cyan" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-custom-cyan transition-colors">
              {event.title}
            </h3>
            <div className="flex items-center gap-3 flex-wrap">
              <span className={`px-2 py-1 text-xs font-mono border rounded-full ${getTypeColor(event.type)}`}>
                {event.type.toUpperCase()}
              </span>
              <span className={`px-2 py-1 text-xs font-mono border rounded-full ${getDifficultyColor(event.difficulty)}`}>
                {event.difficulty.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        <p className="text-white/80 font-mono text-sm mb-4 line-clamp-3">
          {event.description}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-custom-cyan/90">
            <Calendar className="w-4 h-4" />
            <span className="font-mono text-sm">{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center gap-2 text-custom-cyan/90">
            <Clock className="w-4 h-4" />
            <span className="font-mono text-sm">{event.time} • {event.duration}</span>
          </div>
          <div className="flex items-center gap-2 text-custom-cyan/90">
            <MapPin className="w-4 h-4" />
            <span className="font-mono text-sm capitalize">{event.location}</span>
          </div>
          {event.maxParticipants && (
            <div className="flex items-center gap-2 text-custom-cyan/90">
              <Users className="w-4 h-4" />
              <span className="font-mono text-sm">
                {event.currentParticipants || 0}/{event.maxParticipants} participants
              </span>
            </div>
          )}
          {event.instructor && (
            <div className="flex items-center gap-2 text-custom-cyan/90">
              <Shield className="w-4 h-4" />
              <span className="font-mono text-sm">by {event.instructor}</span>
            </div>
          )}
        </div>

        {event.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {event.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-white/5 border border-white/20 rounded text-xs font-mono text-white/70"
              >
                #{tag}
              </span>
            ))}
            {event.tags.length > 3 && (
              <span className="px-2 py-1 bg-white/5 border border-white/20 rounded text-xs font-mono text-white/70">
                +{event.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <span
            className="click-ripple interactive-hover group inline-flex items-center justify-center px-4 py-2 bg-custom-cyan/10 border border-custom-cyan/50 rounded font-mono text-sm text-custom-cyan hover:bg-custom-cyan/20 hover:border-white hover:text-white transition-all w-full sm:w-auto pointer-events-none"
          >
            View Details
            <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}