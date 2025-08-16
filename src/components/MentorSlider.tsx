import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import '../index.css';

interface Mentor {
    name: string;
    role: string;
    bio: string;
    image: string;
    link: string;
}

interface Props {
    mentors: Mentor[];
}

export const MentorSlider: React.FC<Props> = ({ mentors }) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollAmount = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
            scrollRef.current.scrollTo({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <div className="w-full py-12 md:py-24 relative bg-gradient-to-b from-black via-[#020202] to-black">
            <h2 className="text-2xl md:text-4xl font-mono font-extrabold text-center mb-8 md:mb-12 text-fuchsia-300 drop-shadow">Mentors_</h2>

            <p className="text-center max-w-3xl mx-auto mb-12 md:mb-16 text-sm md:text-lg font-mono text-fuchsia-200 leading-relaxed px-4">
                Learn from the best — our mentors are industry leaders, seasoned cybersecurity experts, and dedicated educators committed to guiding you toward mastery.
            </p>

            {/* Slider Container with Navigation */}
            <div className="relative max-w-6xl mx-auto px-4 md:px-0">
                {/* Navigation Arrows - Hidden on mobile, visible on desktop */}
                <div className="hidden md:block absolute -left-16 top-1/2 transform -translate-y-1/2 z-10">
                    <button
                        onClick={() => scroll('left')}
                        className="bg-black/80 hover:bg-fuchsia-700/80 transition-all duration-300 p-3 rounded-full border border-fuchsia-400/50 hover:border-fuchsia-400 shadow-lg hover:shadow-fuchsia-500/25"
                    >
                        <ChevronLeft className="text-fuchsia-200 w-6 h-6" />
                    </button>
                </div>

                <div className="hidden md:block absolute -right-16 top-1/2 transform -translate-y-1/2 z-10">
                    <button
                        onClick={() => scroll('right')}
                        className="bg-black/80 hover:bg-fuchsia-700/80 transition-all duration-300 p-3 rounded-full border border-fuchsia-400/50 hover:border-fuchsia-400 shadow-lg hover:shadow-fuchsia-500/25"
                    >
                        <ChevronRight className="text-fuchsia-200 w-6 h-6" />
                    </button>
                </div>

                {/* Slider */}
                <div
                    ref={scrollRef}
                    className="flex gap-4 md:gap-8 overflow-x-scroll overflow-y-hidden scrollbar-none scroll-smooth"
                    style={{ scrollBehavior: 'smooth' }}
                >
                    {mentors.map((mentor, idx) => (
                        <motion.div
                            key={idx}
                            className="min-w-[240px] md:min-w-[280px] max-w-[240px] md:max-w-[280px] bg-black border border-fuchsia-500/30 rounded-xl shadow-xl p-4 md:p-6 flex flex-col items-center justify-between hover:shadow-fuchsia-700 transition-all duration-300"
                            whileHover={{ scale: 1.02 }}
                        >
                            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-4 border-fuchsia-400 mb-3 md:mb-4">
                                <img src={mentor.image} alt={mentor.name} className="w-full h-full object-cover" />
                            </div>
                            <h3 className="text-base md:text-lg font-bold text-white text-center mb-1">{mentor.name}</h3>
                            <p className="text-sm md:text-md font-mono text-fuchsia-200 text-center mb-2">{mentor.role}</p>
                            <p className="text-xs md:text-sm font-mono text-fuchsia-200 text-center mb-3 md:mb-4 line-clamp-3 md:line-clamp-4">{mentor.bio}</p>
                            <a
                                href={mentor.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-fuchsia-400 hover:text-white transition font-mono text-sm md:text-md"
                            >
                                Go to Program
                                <span className="text-sm md:text-base">↗</span>
                            </a>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};
