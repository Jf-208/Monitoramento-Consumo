// ThemeContext.js
// Contexto global de Tema.
// Permite alternar entre os esquemas de cores 'Claro' e 'Escuro'.
// Utiliza o AsyncStorage para salvar a preferência do usuário e recarregar na próxima vez que o app abrir.
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightColors, darkColors } from '../theme/colors';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(true); // Default dark theme
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const storedTheme = await AsyncStorage.getItem('@theme');
      if (storedTheme !== null) {
        setIsDark(storedTheme === 'dark');
      }
    } catch (e) {
      console.log('Error loading theme:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTheme = async () => {
    try {
      const newTheme = !isDark;
      setIsDark(newTheme);
      await AsyncStorage.setItem('@theme', newTheme ? 'dark' : 'light');
    } catch (e) {
      console.log('Error saving theme:', e);
    }
  };

  const colors = isDark ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, colors, isLoading }}>
      {children}
    </ThemeContext.Provider>
  );
};
