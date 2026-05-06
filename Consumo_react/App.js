import React from 'react';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { AuthProvider } from './src/contexts/AuthContext';
import { ConsumptionProvider } from './src/contexts/ConsumptionContext';
import { MetasProvider } from './src/contexts/MetasContext';
import AppNavigator from './src/navigations/AppNavigator';
import { StatusBar, Platform } from 'react-native';

// ─── FIX WEB SCROLL: CSS global para React Native Web ────────────────────────
// React Native Web renderiza tudo como <div> com overflow:hidden por padrão.
// Sem esse CSS, o html/body/#root não ocupam 100% da viewport e
// os ScrollViews não conseguem rolar porque a árvore de divs não tem altura.
if (Platform.OS === 'web') {
  const style = document.createElement('style');
  style.textContent = `
    * { box-sizing: border-box; }
    html, body, #root {
      height: 100%;
      margin: 0;
      padding: 0;
      overflow: hidden;
      background-color: #0A172E;
    }
    /* Apenas o wrapper direto do #root recebe fundo escuro.
       NÃO aplicar em TODAS as divs — isso sobrescreve cores dos componentes RN. */
    #root > div {
      display: flex;
      flex-direction: column;
      height: 100% !important;
      background-color: #0A172E;
    }
    div { -webkit-overflow-scrolling: touch; }
  `;
  document.head.appendChild(style);
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ConsumptionProvider>
          <MetasProvider>  {/* MetasProvider dentro de ConsumptionProvider para acessar registros */}
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
            <AppNavigator />
          </MetasProvider>
        </ConsumptionProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
