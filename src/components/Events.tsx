import { useState, useMemo } from 'react';
import { Calendar, Filter, Search, Clock, TrendingUp } from 'lucide-react';
import { EventCard } from '../components/EventCard';
import { Event } from '../types/event';
import { getUpcomingEvents, getPastEvents, getAllEvents } from '../data/events';
import { motion } from 'framer-motion';

type TabType = 'all' | 'upcoming' | 'past';

export function Events() {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<Event['type'] | 'all'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Event['difficulty'] | 'all'>('all');

  const upcomingEvents = getUpcomingEvents();
  const pastEvents = getPastEvents();
  const allEvents = getAllEvents();

  const currentEvents = useMemo(() => {
    if (activeTab === 'upcoming') return upcomingEvents;
    if (activeTab === 'past') return pastEvents;
    return allEvents;
  }, [activeTab, upcomingEvents, pastEvents, allEvents]);

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

  return (
    <div className="min-h-screen bg-black text-custom-cyan py-12">
      <div className="container mx-auto px-4">
        
        {/* İstatistik Paneli */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <div className="bg-black/40 border border-custom-cyan/30 rounded-lg p-6 text-center backdrop-blur-sm">
            <TrendingUp className="w-8 h-8 mx-auto mb-2 text-custom-cyan" />
            <div className="text-3xl font-bold text-white">{upcomingEvents.length}</div>
            <div className="text-sm font-mono text-custom-cyan/70 mt-1">Upcoming Events</div>
          </div>
          <div className="bg-black/40 border border-custom-cyan/30 rounded-lg p-6 text-center backdrop-blur-sm">
            <Clock className="w-8 h-8 mx-auto mb-2 text-custom-cyan" />
            <div className="text-3xl font-bold text-white">{pastEvents.length}</div>
            <div className="text-sm font-mono text-custom-cyan/70 mt-1">Past Events</div>
          </div>
          <div className="bg-black/40 border border-custom-cyan/30 rounded-lg p-6 text-center backdrop-blur-sm">
            <Calendar className="w-8 h-8 mx-auto mb-2 text-custom-cyan" />
            <div className="text-3xl font-bold text-white">{allEvents.length}</div>
            <div className="text-sm font-mono text-custom-cyan/70 mt-1">Total Events</div>
          </div>
        </motion.div>

        {/* Sekme Yapısı */}
        <div className="flex justify-center mb-8">
          <div className="bg-black/60 border border-custom-cyan/30 p-1 rounded-lg flex gap-2 backdrop-blur-sm">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-6 py-2 rounded font-mono text-sm transition-all ${
                activeTab === 'all'
                  ? 'bg-custom-cyan/20 border border-custom-cyan/50 text-white'
                  : 'text-custom-cyan/60 hover:text-white'
              }`}
            >
              All ({allEvents.length})
            </button>
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-6 py-2 rounded font-mono text-sm transition-all ${
                activeTab === 'upcoming'
                  ? 'bg-custom-cyan/20 border border-custom-cyan/50 text-white'
                  : 'text-custom-cyan/60 hover:text-white'
              }`}
            >
              Upcoming ({upcomingEvents.length})
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`px-6 py-2 rounded font-mono text-sm transition-all ${
                activeTab === 'past'
                  ? 'bg-custom-cyan/20 border border-custom-cyan/50 text-white'
                  : 'text-custom-cyan/60 hover:text-white'
              }`}
            >
              Past ({pastEvents.length})
            </button>
          </div>
        </div>

        {/* Filtreler */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-3.5 w-4 h-4 text-custom-cyan/50" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-custom-cyan/30 rounded font-mono text-sm text-white placeholder-custom-cyan/40 focus:outline-none focus:border-custom-cyan transition-colors"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-3.5 w-4 h-4 text-custom-cyan/50" />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as Event['type'] | 'all')}
              className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-custom-cyan/30 rounded font-mono text-sm text-white focus:outline-none focus:border-custom-cyan transition-colors appearance-none cursor-pointer"
            >
              <option value="all">All Types</option>
              <option value="training">Training</option>
              <option value="webinar">Webinar</option>
              <option value="ctf">CTF</option>
              <option value="meetup">Meetup</option>
              <option value="conference">Conference</option>
            </select>
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-3.5 w-4 h-4 text-custom-cyan/50" />
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value as Event['difficulty'] | 'all')}
              className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-custom-cyan/30 rounded font-mono text-sm text-white focus:outline-none focus:border-custom-cyan transition-colors appearance-none cursor-pointer"
            >
              <option value="all">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>

        {/* Liste */}
        <motion.section layout className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event, index) => (
              <EventCard key={event.id} event={event} index={index} />
            ))
          ) : (
            <div className="col-span-1 md:col-span-2 text-center py-20 bg-black/20 border border-custom-cyan/10 rounded-lg">
              <Calendar className="w-16 h-16 mx-auto mb-4 text-custom-cyan/30" />
              <h3 className="text-xl font-bold text-white mb-2">No Events Found</h3>
              <p className="font-mono text-custom-cyan/60">
                No events match your current filter criteria.
              </p>
            </div>
          )}
        </motion.section>
      </div>
    </div>
  );
}