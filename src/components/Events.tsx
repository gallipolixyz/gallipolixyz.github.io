import React, { useState, useMemo } from 'react';
import { Calendar, Filter, Search, Clock, TrendingUp } from 'lucide-react';
import { EventCard } from './EventCard';
import { Event } from '../types/event';
import { getUpcomingEvents, getPastEvents } from '../data/events';
import { motion } from 'framer-motion';

export function Events() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<Event['type'] | 'all'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Event['difficulty'] | 'all'>('all');

  const upcomingEvents = getUpcomingEvents();
  const pastEvents = getPastEvents();

  const currentEvents = activeTab === 'upcoming' ? upcomingEvents : pastEvents;

  const filteredEvents = useMemo(() => {
    return currentEvents.filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesType = selectedType === 'all' || event.type === selectedType;
      const matchesDifficulty = selectedDifficulty === 'all' || event.difficulty === selectedDifficulty;

      return matchesSearch && matchesType && matchesDifficulty;
    });
  }, [currentEvents, searchTerm, selectedType, selectedDifficulty]);

  const eventTypes: (Event['type'] | 'all')[] = ['all', 'workshop', 'webinar', 'ctf', 'meetup', 'conference'];
  const difficulties: (Event['difficulty'] | 'all')[] = ['all', 'beginner', 'intermediate', 'advanced'];

  return (
    <div className="min-h-screen bg-black text-custom-cyan py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <Calendar className="w-8 h-8 text-custom-cyan" />
            <h1 className="text-4xl md:text-5xl font-bold text-center">Events_</h1>
          </div>
          <p className="text-lg font-mono text-custom-cyan/90 text-center max-w-3xl mx-auto">
            Join our community events to learn, practice, and connect with fellow hackers.
            From hands-on workshops to competitive CTFs, there's always something happening in Gallipoli.
          </p>
        </motion.section>

        {/* Stats */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-custom-cyan/5 border border-custom-cyan/30 rounded-lg p-6 text-center">
              <TrendingUp className="w-8 h-8 text-custom-cyan mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{upcomingEvents.length}</div>
              <div className="text-sm font-mono text-custom-cyan/80">Upcoming Events</div>
            </div>
            <div className="bg-custom-cyan/5 border border-custom-cyan/30 rounded-lg p-6 text-center">
              <Clock className="w-8 h-8 text-custom-cyan mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{pastEvents.length}</div>
              <div className="text-sm font-mono text-custom-cyan/80">Past Events</div>
            </div>
            <div className="bg-custom-cyan/5 border border-custom-cyan/30 rounded-lg p-6 text-center">
              <Calendar className="w-8 h-8 text-custom-cyan mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{upcomingEvents.length + pastEvents.length}</div>
              <div className="text-sm font-mono text-custom-cyan/80">Total Events</div>
            </div>
          </div>
        </motion.section>

        {/* Tabs */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex items-center justify-center">
            <div className="bg-black/40 border border-custom-cyan/30 rounded-lg p-1 backdrop-blur-sm">
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`px-6 py-3 font-mono text-sm rounded transition-all ${activeTab === 'upcoming'
                    ? 'bg-custom-cyan/20 text-custom-cyan border border-custom-cyan/50'
                    : 'text-custom-cyan/70 hover:text-custom-cyan'
                  }`}
              >
                Upcoming ({upcomingEvents.length})
              </button>
              <button
                onClick={() => setActiveTab('past')}
                className={`px-6 py-3 font-mono text-sm rounded transition-all ${activeTab === 'past'
                    ? 'bg-custom-cyan/20 text-custom-cyan border border-custom-cyan/50'
                    : 'text-custom-cyan/70 hover:text-custom-cyan'
                  }`}
              >
                Past ({pastEvents.length})
              </button>
            </div>
          </div>
        </motion.section>

        {/* Filters */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-custom-cyan/50" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-black/40 border border-custom-cyan/30 rounded-lg font-mono text-sm text-white placeholder-custom-cyan/50 focus:border-custom-cyan/60 focus:ring-1 focus:ring-custom-cyan/60 focus:outline-none"
              />
            </div>

            {/* Type Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-custom-cyan/50" />
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as Event['type'] | 'all')}
                className="pl-10 pr-8 py-3 bg-black/40 border border-custom-cyan/30 rounded-lg font-mono text-sm text-white focus:border-custom-cyan/60 focus:ring-1 focus:ring-custom-cyan/60 focus:outline-none appearance-none cursor-pointer"
              >
                {eventTypes.map(type => (
                  <option key={type} value={type} className="bg-black text-white">
                    {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty Filter */}
            <div className="relative">
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value as Event['difficulty'] | 'all')}
                className="px-4 py-3 bg-black/40 border border-custom-cyan/30 rounded-lg font-mono text-sm text-white focus:border-custom-cyan/60 focus:ring-1 focus:ring-custom-cyan/60 focus:outline-none appearance-none cursor-pointer"
              >
                {difficulties.map(difficulty => (
                  <option key={difficulty} value={difficulty} className="bg-black text-white">
                    {difficulty === 'all' ? 'All Levels' : difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.section>

        {/* Events Grid */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {filteredEvents.map((event, index) => (
                <EventCard key={event.id} event={event} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <Calendar className="w-16 h-16 text-custom-cyan/30 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No Events Found</h3>
              <p className="font-mono text-custom-cyan/70">
                {searchTerm || selectedType !== 'all' || selectedDifficulty !== 'all'
                  ? 'Try adjusting your filters or search terms.'
                  : activeTab === 'upcoming'
                    ? 'No upcoming events scheduled yet. Check back soon!'
                    : 'No past events to display.'
                }
              </p>
            </div>
          )}
        </motion.section>

        {/* Call to Action */}
        {activeTab === 'upcoming' && upcomingEvents.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-16 text-center bg-custom-cyan/5 border border-custom-cyan/30 rounded-lg p-8"
          >
            <h2 className="text-2xl font-bold text-white mb-4">Don't Miss Out!</h2>
            <p className="font-mono text-custom-cyan/90 mb-6 max-w-2xl mx-auto">
              Join our Telegram community to get notified about new events, receive reminders,
              and connect with other participants before events start.
            </p>
            <a
              href="https://t.me/gallipolixyz"
              target="_blank"
              rel="noopener noreferrer"
              className="click-ripple interactive-hover inline-flex items-center px-6 py-3 bg-custom-cyan/10 border border-custom-cyan/50 rounded-lg font-mono text-custom-cyan hover:bg-custom-cyan/20 hover:border-white hover:text-white transition-all"
            >
              Join Community
            </a>
          </motion.section>
        )}
      </div>
    </div>
  );
} 