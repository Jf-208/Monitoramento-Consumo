module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // OBRIGATÓRIO: react-native-reanimated/plugin deve ser o ÚLTIMO plugin listado.
    // Sem isso, reanimated v4 e moti lançam erro em runtime no Expo Go e no APK.
    plugins: ['react-native-reanimated/plugin'],
  };
};