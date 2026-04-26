// vite.config.js  (project root)
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react   from '@vitejs/plugin-react';
import path    from 'path';

export default defineConfig({
  plugins: [
    laravel({
      input: [
        'resources/css/app.css',
        'resources/js/App.jsx',
      ],
      refresh: true,
    }),
    react(),
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'resources/js'),
    },
  },

  build: {
    rollupOptions: {
      output: {
        // Isolate heavy deps into separate chunks for better caching
        manualChunks: {
          'vendor-three': ['three'],
          'vendor-gsap':  ['gsap'],
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-store': ['zustand'],
        },
      },
    },
    // Raise the warning threshold — Three.js is large by design
    chunkSizeWarningLimit: 1400,
  },

  optimizeDeps: {
    include: ['three', 'gsap', 'zustand'],
  },
});