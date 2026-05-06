// index.js
// Entry point do aplicativo Wavunder.
// IMPORTANTE: react-native-gesture-handler DEVE ser o primeiro import.
// Sem isso, @react-navigation/stack lança erro de navigation no Expo Go.

import 'react-native-gesture-handler'; // PRIMEIRA LINHA — obrigatório para Stack Navigator
import 'react-native-reanimated';      // Segunda linha — inicializa o engine de animação

import { registerRootComponent } from 'expo';
import App from './App';

// registerRootComponent garante compatibilidade com Expo Go e builds nativos
registerRootComponent(App);
