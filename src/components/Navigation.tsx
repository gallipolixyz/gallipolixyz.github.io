import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home_' },
    { path: '/about', label: 'About_' },
    { path: '/programs', label: 'Programs_' },
    { path: '/events', label: 'Events_' },
    { path: '/blog', label: 'Blogs_' },
    { path: '/teams', label: 'Teams_' },
    { path: '/social', label: 'Social_' },
  ];

  const logoVariants = {
    initial: {
      opacity: 0,
      x: -20,
    },
    animate: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: [0.6, -0.05, 0.01, 0.99]
      }
    },
    hover: {
      scale: 1.05,
      textShadow: [
        "0 0 4px rgba(0,255,255,0.3)",
        "0 0 8px rgba(0,255,255,0.3)",
        "0 0 12px rgba(0,255,255,0.3)",
        "0 0 16px rgba(0,255,255,0.3)",
        "0 0 22px rgba(0,255,255,0.3)",
        "0 0 16px rgba(0,255,255,0.3)",
        "0 0 12px rgba(0,255,255,0.3)",
        "0 0 8px rgba(0,255,255,0.3)",
        "0 0 4px rgba(0,255,255,0.3)"
      ],
      transition: {
        textShadow: {
          duration: 2,
          repeat: Infinity,
          ease: "linear"
        },
        scale: {
          duration: 0.2,
          ease: "easeOut"
        }
      }
    }
  };

  const underlineVariants = {
    initial: { width: "0%" },
    hover: {
      width: "100%",
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  const glowVariants = {
    initial: { opacity: 0 },
    hover: {
      opacity: [0.4, 0.8, 0.4],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  const navItemVariants = {
    initial: {
      opacity: 0,
      y: -10
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    }
  };

  const activeIndicatorVariants = {
    initial: {
      scaleX: 0,
      opacity: 0
    },
    animate: {
      scaleX: 1,
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-custom-cyan/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          <motion.div
            initial="initial"
            animate="animate"
            whileHover="hover"
            variants={logoVariants}
            className="relative flex items-center"
          >
            <motion.div
              className="absolute inset-0 bg-custom-cyan/5 blur-xl rounded-full"
              variants={glowVariants}
            />
            <img
              src="/assets/GallipoliLogo.png"
              alt="Gallipoli Logo"
              className="w-16 h-auto"
              loading="lazy"
            />
            <Link
              to="/"
              className="ml-[-4px] flex items-center text-custom-cyan font-mono text-xl hover:text-white transition-colors relative group"
            >

              _GALLIPOLI
              <motion.span
                className="absolute bottom-0 left-0 h-0.5 bg-custom-cyan"
                variants={underlineVariants}
              />
            </Link>
          </motion.div>


          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-custom-cyan hover:text-white transition-colors"
          >
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: isMenuOpen ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.div>
          </button>

          <div className="hidden md:flex space-x-8">
            {navItems.map((item, index) => (
              <motion.div
                key={item.path}
                initial="initial"
                animate="animate"
                whileHover="hover"
                variants={navItemVariants}
                className="relative"
                custom={index}
              >
                <Link
                  to={item.path}
                  className={`text-custom-cyan font-mono hover:text-white transition-colors relative ${location.pathname === item.path ? 'text-white' : ''
                    }`}
                >
                  {item.label}
                  {location.pathname === item.path && (
                    <motion.div
                      className="absolute bottom-0 left-0 w-full h-0.5 bg-custom-cyan"
                      initial="initial"
                      animate="animate"
                      variants={activeIndicatorVariants}
                      layoutId="activeNavIndicator"
                    />
                  )}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

  <motion.div
  className={`md:hidden ${isMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
          initial={{ height: 0, opacity: 0 }}
          animate={{
            height: isMenuOpen ? "auto" : 0,
            opacity: isMenuOpen ? 1 : 0
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <div className="py-4 space-y-4">
            {navItems.map((item, index) => (
              <motion.div
                key={item.path}
                initial="initial"
                animate="animate"
                variants={navItemVariants}
                custom={index}
                whileHover="hover"
              >
                <Link
                  to={item.path}
                  className={`block text-custom-cyan font-mono hover:text-white transition-colors relative ${location.pathname === item.path ? 'text-white' : ''
                    }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                  {location.pathname === item.path && (
                    <motion.div
                      className="absolute bottom-0 left-0 w-full h-0.5 bg-custom-cyan"
                      initial="initial"
                      animate="animate"
                      variants={activeIndicatorVariants}
                    />
                  )}
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </nav>
  );
}