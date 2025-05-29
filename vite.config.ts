import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { imagetools } from 'vite-imagetools';
import viteCompression from 'vite-plugin-compression';

export default defineConfig({
  base: '/',
  plugins: [
    react(),
    imagetools(),
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
    }),
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
    })
  ],
  build: {
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          animations: ['framer-motion'],
          spline: ['@splinetool/runtime', '@splinetool/react-spline'],
          icons: ['lucide-react'],
          virtualization: ['react-virtualized']
        }
      }
    },
    cssCodeSplit: true,
    chunkSizeWarningLimit: 500,
    assetsInlineLimit: 4096,
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  server: {
    host: true
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'framer-motion',
      '@splinetool/runtime',
      'lucide-react',
      'react-virtualized'
    ]
  }
});
