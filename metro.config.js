const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

// extra les ext existantes
const { resolver: { sourceExts = [], assetExts = [] } = {} } = defaultConfig;

module.exports = {
  ...defaultConfig,
  transformer: {
    ...defaultConfig.transformer,
    assetPlugins: ['expo-asset/tools/hashAssetFiles'],
  },
  resolver: {
    ...defaultConfig.resolver,
    // conserve les ext par défaut + cjs
    sourceExts: [...sourceExts, 'cjs'],
    // ajoute wasm comme asset pour que Metro le serve / copie
    assetExts: [...assetExts, 'wasm'],
    // redirige "expo-sqlite" vers notre shim local
    extraNodeModules: {
      'expo-sqlite': path.resolve(__dirname, 'shims/expo-sqlite'),
    },
  },
  // watch le dossier shim pour rechargement
  watchFolders: [path.resolve(__dirname, 'shims')],
};
