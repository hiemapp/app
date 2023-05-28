import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths'

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
  },
  server: {
    port: 4301,
    strictPort: true,
    proxy: {
      '/trpc': {
        target: 'http://localhost:4300',
        changeOrigin: true,
      },
      '/socket.io': {
        target: 'http://localhost:4300',
        changeOrigin: true,
      },
    },
  }
});
