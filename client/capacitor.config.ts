import type { CapacitorConfig } from '@capacitor/cli';
import { Keyboard, KeyboardResize } from '@capacitor/keyboard';

const LIVE_RELOAD_SERVER_URL = 'http://192.168.2.5:4301';

const config: CapacitorConfig = {
  appId: 'net.tjalling.hiem',
  appName: 'Hiem',
  webDir: '../server/public',
  android: {
    allowMixedContent: true // Allow non-https connections
  },
  plugins: {
    Keyboard: {
      resizeOnFullScreen: true // Resize the app when the keyboard is shown
    }
  }
};

// Add live reload support
// @ts-ignore
if(process.env.NODE_ENV === 'development') {
  config.server = {
    url: LIVE_RELOAD_SERVER_URL,
    cleartext: true
  }
}

export default config;
