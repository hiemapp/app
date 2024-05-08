import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { dependencies } from './package.json';

const vendorDeps = ['react', 'react-router-dom', 'react-dom', 'react-router'];

const excludeDeps = [
  ...vendorDeps,
  'sass', 'terser', '@trpc/server', 'lodash'
];

function renderChunks(deps: Record<string, string>) {
  let chunks: Record<string, string[]> = {};
  
  Object.keys(deps).forEach((key) => {
    if (excludeDeps.includes(key)) return;
    chunks[key] = [key];
  });

  return chunks;
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths()
  ],
  build: {
    outDir: '../server/public',
    assetsDir: './',
    emptyOutDir: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: vendorDeps,
          ...renderChunks(dependencies),
        },
      },
    },
  },
  css: {
      preprocessorOptions: {
          scss: {
              additionalData: '@import "./src/styles/mixins.scss";',
          },
      },
  },
  server: {
    port: 4301,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://localhost:4300'
      },
      '/trpc': {
        target: 'http://localhost:4300'
      },
      '/socket.io': {
        target: 'http://localhost:4300'
      },
    },
  }
});
