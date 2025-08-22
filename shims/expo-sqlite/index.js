// shim qui choisit l'implémentation selon la plateforme
const { Platform } = require('react-native');

let impl;
if (Platform.OS === 'web') {
  // implémentation pour le web
  impl = require('expo-web-sqlite');
} else {
  // implémentation native pour iOS/Android
  impl = require('expo-sqlite');
}

// debug minimal (tu peux commenter après)
if (typeof __DEV__ !== 'undefined' && __DEV__) {
  try {
    // eslint-disable-next-line no-console
    console.log('[shim/expo-sqlite] using', Platform.OS, impl ? 'implementation loaded' : 'no impl');
  } catch {}
}

module.exports = impl;
