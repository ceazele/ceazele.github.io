import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import prefixSelector from 'postcss-prefix-selector';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    'process.env.NODE_ENV': '"production"',
  },
  css: {
    postcss: {
      plugins: [
        // Scope all Tailwind CSS to #degroot-root so it never leaks into
        // the surrounding Jekyll page (navbar, etc.)
        prefixSelector({
          prefix: '#degroot-root',
          transform(prefix, selector) {
            // :root / :host — keep as the container so CSS variables are
            // available to descendants via inheritance
            if (selector === ':root' || selector === ':host') return prefix;
            // html / body — map to the container
            if (selector === 'html' || selector === 'body') return prefix;
            // everything else — scope inside the container
            return `${prefix} ${selector}`;
          },
        }),
      ],
    },
  },
  build: {
    lib: {
      entry: 'src/degroot-main.jsx',
      name: 'DeGrootSim',
      formats: ['iife'],
      fileName: () => 'degroot-simulation.js',
      cssFileName: 'degroot-simulation',
    },
    outDir: 'assets/js',
    emptyOutDir: false,
  },
});
