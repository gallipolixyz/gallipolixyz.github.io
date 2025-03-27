import React, { useState, useCallback, Suspense, lazy, useEffect } from 'react';
import { Terminal, Code2, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Lazy load Spline component
const Spline = lazy(() => import('@splinetool/react-spline'));

function LoadingText() {
  const [dots, setDots] = useState('');
  
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 300);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="font-mono text-custom-cyan/90">
      <span className="text-custom-cyan">&gt;</span> Initializing secure connection{dots}
    </div>
  );
}

function SplineScene({ onLoad, onError }: { onLoad: () => void; onError: (error: Error) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onLoad();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onLoad]);

  return (
    <Spline 
      scene="https://prod.spline.design/kNddJEUmGGKQkXMu/scene.splinecode"
      onLoad={() => {}}
      onError={onError}
      className="w-full h-full"
    />
  );
}

export function Hero() {
  const [splineError, setSplineError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showTerminalText, setShowTerminalText] = useState(false);
  const [showTitleGlow, setShowTitleGlow] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isLoading) {
        setShowTerminalText(true);
      }
    }, 3000);
    return () => clearTimeout(timeout);
  }, [isLoading]);

  const handleSplineError = useCallback((error: Error) => {
    console.error('Spline scene failed to load:', error);
    setSplineError(true);
    setIsLoading(false);
    setShowTerminalText(true);
  }, []);

  const handleSplineLoad = useCallback(() => {
    setIsLoading(false);
    setSplineError(false);
    setShowTitleGlow(true);
    setTimeout(() => setShowTitleGlow(false), 2000);
    setTimeout(() => setShowTerminalText(true), 500);
  }, []);

  const handleRetry = useCallback(() => {
    setIsLoading(true);
    setSplineError(false);
    setRetryCount(count => count + 1);
    setShowTerminalText(false);
    setShowTitleGlow(false);
  }, []);

  const createRipple = (event: React.MouseEvent<HTMLElement>) => {
    const button = event.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.className = 'ripple';
    
    button.appendChild(ripple);
    
    ripple.addEventListener('animationend', () => {
      ripple.remove();
    });
  };

  return (
    <section id="hero" className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0 w-full h-full">
        <AnimatePresence mode="wait">
          <Suspense fallback={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full bg-black flex flex-col items-center justify-center gap-8"
            >
              <motion.div 
                className="grid grid-cols-3 gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {[Terminal, Code2, Cpu].map((Icon, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 20,
                      delay: index * 0.1
                    }}
                    className="w-16 h-16 bg-custom-cyan/10 rounded-lg flex items-center justify-center"
                  >
                    <Icon className="w-8 h-8 text-custom-cyan animate-pulse" />
                  </motion.div>
                ))}
              </motion.div>
              <LoadingText />
            </motion.div>
          }>
            {!splineError ? (
              <motion.div
                key="spline-scene"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <SplineScene 
                  onLoad={handleSplineLoad}
                  onError={handleSplineError}
                />
              </motion.div>
            ) : (
              <motion.div
                key="error-fallback"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full bg-black/50 flex flex-col items-center justify-center gap-4"
              >
                <p className="text-red-400 font-mono">Failed to load 3D scene</p>
                <button 
                  onClick={handleRetry}
                  className="click-ripple interactive-hover px-4 py-2 bg-custom-cyan/10 border border-custom-cyan/50 rounded font-mono text-custom-cyan hover:bg-custom-cyan/20 hover:border-white hover:text-white transition-all"
                >
                  Retry Loading Scene_
                </button>
              </motion.div>
            )}
          </Suspense>
        </AnimatePresence>
      </div>

      <motion.div 
        className="relative z-10 h-full flex items-center justify-center bg-black/40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="glitch-container text-center">
          <motion.h1 
            className={`text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-custom-cyan via-white to-custom-cyan ${showTitleGlow ? 'title-glow' : ''}`}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            GALLIPOLI
          </motion.h1>
          <div className="mt-6 text-xl md:text-2xl text-custom-cyan/90 font-mono max-w-2xl mx-auto">
            {isLoading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-8 flex items-center justify-center"
              >
                <LoadingText />
              </motion.div>
            ) : (
              <motion.p 
                className={`terminal-text ${showTerminalText ? 'animate-terminal' : 'opacity-0'}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: showTerminalText ? 1 : 0 }}
                transition={{ delay: 0.5 }}
              >
                {"<"} A hacker saved my life {"/>"}
              </motion.p>
            )}
          </div>
          <motion.a 
            href="https://t.me/+IHIHLmSbufxlNjdk"
            target="_blank"
            rel="noopener noreferrer"
            onClick={createRipple}
            className={`click-ripple interactive-hover mt-12 inline-block px-8 py-4 bg-custom-cyan/10 border-2 border-custom-cyan/50 rounded-lg font-mono text-lg text-custom-cyan hover:bg-custom-cyan/20 hover:border-white hover:text-white hover:scale-105 transition-all duration-300 shadow-[0_0_15px_rgba(0,255,255,0.1)] hover:shadow-[0_0_25px_rgba(0,255,255,0.2)] ${
              showTerminalText ? 'animate-fade-in' : 'opacity-0'
            }`}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: showTerminalText ? 1 : 0 }}
            transition={{ delay: 0.7 }}
          >
            Join Gallipoli_
          </motion.a>
        </div>
      </motion.div>
    </section>
  );
}