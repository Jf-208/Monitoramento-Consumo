import React from 'react';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { AuthProvider } from './src/contexts/AuthContext';
import { ConsumptionProvider } from './src/contexts/ConsumptionContext';
import AppNavigator from './src/navigations/AppNavigator';
import { StatusBar } from 'react-native';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ConsumptionProvider>
          <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
          <AppNavigator />
        </ConsumptionProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
