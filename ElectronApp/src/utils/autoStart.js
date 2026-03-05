import AutoLaunch from 'auto-launch';

export function enableAutostart() {
  const appName = 'WorkTrackLite';
  const autoLauncher = new AutoLaunch({ name: appName });

  autoLauncher
    .isEnabled()
    .then((isEnabled) => {
      if (!isEnabled) {
        autoLauncher.enable();
        console.log('✅ Autostart enabled');
      }
    })
    .catch((err) => console.error('Autostart error:', err));
}

export function disableAutostart() {
  const appName = 'WorkTrackLite';
  const autoLauncher = new AutoLaunch({ name: appName });

  autoLauncher.disable();
  console.log('❌ Autostart disabled');
}
