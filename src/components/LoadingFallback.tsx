import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, Code2, Cpu } from 'lucide-react';

export function LoadingFallback() {
  return (
    <div className="w-full h-full bg-black flex flex-col items-center justify-center gap-8">
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-custom-cyan font-mono"
      >
        Loading secure environment...
      </motion.div>
    </div>
  );
}