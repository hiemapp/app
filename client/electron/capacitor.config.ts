import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'net.tjalling.hiem',
  appName: 'Hiem',
  webDir: '../server/public',
  server: {
    cleartext: true
  }
};

export default config;
