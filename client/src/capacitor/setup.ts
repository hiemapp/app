import { Capacitor } from '@capacitor/core';
import { SafeAreaController } from '@aashu-dubey/capacitor-statusbar-safe-area';
import { StatusBar } from '@capacitor/status-bar';

export function setup() {
  // Set body data-platform attribute
  const platform = Capacitor.getPlatform();
  document.body.setAttribute('data-platform', platform);

  // Inject safe area CSS variables
  SafeAreaController.injectCSSVariables();

  switch (platform) {
    case 'android':
        StatusBar.setOverlaysWebView({ overlay: true }).catch(()=>{});
        break;
  }
}