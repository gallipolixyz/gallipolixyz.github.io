import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About' },
  { path: '/programs', label: 'Programs' },
  { path: '/events', label: 'Events' },
  { path: '/blog', label: 'Blogs' },
  { path: '/teams', label: 'Teams' },
  { path: '/contact', label: 'Contact' },
];

const JOIN_URL = 'https://t.me/gallipolixyz';

const linkBase =
  'relative flex items-center whitespace-nowrap rounded-full px-[13px] py-2 font-mono text-[13px] tracking-[0.04em] transition-colors duration-200';

const linkState = (isActive: boolean) =>
  isActive
    ? 'bg-custom-cyan/[0.12] text-white'
    : 'text-custom-cyan/60 hover:bg-custom-cyan/[0.07] hover:text-white';

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navTone = isMenuOpen
    ? 'top-3 md:top-[18px] border-custom-cyan/30 bg-[rgba(4,10,12,0.95)] shadow-[0_14px_44px_-12px_rgba(0,0,0,0.9)]'
    : scrolled
      ? 'top-3 border-custom-cyan/30 bg-[rgba(4,10,12,0.82)] shadow-[0_14px_44px_-12px_rgba(0,0,0,0.9),0_0_24px_-10px_rgba(0,255,255,0.35)]'
      : 'top-3 md:top-[18px] border-custom-cyan/20 bg-[rgba(6,14,16,0.55)] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)]';

  return (
    <motion.nav
      initial={{ opacity: 0, x: '-50%', y: -12 }}
      animate={{ opacity: 1, x: '-50%', y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={[
        'fixed left-1/2 z-50 font-mono',
        'w-[calc(100vw-24px)] md:w-[min(1240px,calc(100vw-48px))]',
        'border backdrop-blur-xl backdrop-saturate-150',
        'transition-[top,background-color,border-color,box-shadow] duration-300',
        isMenuOpen ? 'rounded-[28px]' : 'rounded-[28px] md:rounded-full',
        navTone,
      ].join(' ')}
    >
      <div className="flex h-[54px] md:h-[60px] items-center justify-between gap-4 pl-4 pr-2 md:pl-[22px] md:pr-[10px]">
        <Link to="/" className="group flex shrink-0 items-center gap-2.5">
          <img src="/assets/GallipoliLogo.png" alt="Gallipoli Logo" className="h-[26px] md:h-7 w-auto" />
          <span className="text-[13px] md:text-sm font-bold tracking-[0.22em] text-custom-cyan transition-colors group-hover:text-white">
            GALLIPOLI
          </span>
        </Link>

        <div className="hidden md:flex flex-1 items-center justify-center gap-0.5">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) => `${linkBase} ${linkState(isActive)}`}
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <a
            href={JOIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 md:h-[38px] items-center rounded-full border border-custom-cyan/60 px-4 md:px-[22px] text-xs md:text-[13px] font-semibold tracking-[0.08em] text-custom-cyan shadow-[0_0_18px_-4px_rgba(0,255,255,0.45)] transition-colors hover:border-white hover:bg-custom-cyan/10 hover:text-white"
          >
            Join_
          </a>
          <button
            onClick={() => setIsMenuOpen((v) => !v)}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
            className="md:hidden flex h-[38px] w-[38px] items-center justify-center rounded-full border border-custom-cyan/25 text-custom-cyan transition-colors hover:border-custom-cyan/50 hover:text-white"
          >
            <motion.div animate={{ rotate: isMenuOpen ? 90 : 0 }} transition={{ duration: 0.2 }}>
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </motion.div>
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {isMenuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden"
          >
            <div className="mx-4 mb-3.5 max-h-[calc(100vh-110px)] overflow-y-auto border-t border-custom-cyan/10 pt-1">
              {navItems.map((item, i) => (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03, duration: 0.2 }}
                  className="mt-1"
                >
                  <NavLink
                    to={item.path}
                    end={item.path === '/'}
                    className={({ isActive }) =>
                      `block rounded-[14px] px-3.5 py-[11px] text-sm tracking-[0.06em] transition-colors ${
                        isActive ? 'bg-custom-cyan/[0.12] text-white' : 'text-custom-cyan/70 hover:text-white'
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
