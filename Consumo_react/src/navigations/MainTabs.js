// MainTabs.js
// Tela principal que contem as 4 abas: Inicio, Registrar, Relatorios e Perfil.
//
// LAYOUT (de cima para baixo):
//   SafeAreaView (protege APENAS o topo — edges=['top'])
//     └── spacerHeader  ← ocupa o espaco visual do header SEM participar do layout de toque
//     └── Content (flex: 1) ← preenche todo o espaco do meio
//     └── BottomNav ← fica fixo na base naturalmente
//
// O FAB foi removido — agora existe uma aba dedicada "Registrar" no BottomNav.

import React, { useState, useContext, useEffect } from 'react';
import { View, Platform, StatusBar, Dimensions } from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';
import { SafeAreaView } from 'react-native-safe-area-context';

import HomeScreen from '../screens/Home';
import RegisterScreen from '../screens/RegisterConsumption';
import MetasScreen from '../screens/Metas';
import RelatoriosScreen from '../screens/Reports';
import PerfilScreen from '../screens/Profile';
import BottomNav from '../components/layout/BottomNav';
import { ThemeContext } from '../contexts/ThemeContext';

// Labels fixos das abas — NUNCA mudam
const TAB_LABELS = {
  home:      'Início',
  registrar: 'Registrar',
  metas:     'Metas',
  relatorios: 'Relatórios',
  perfil:    'Perfil',
};

// Altura do header: usada tanto no spacer quanto no posicionamento
const HEADER_HEIGHT = 56;
const BOTTOM_NAV_HEIGHT = 60;



export default function MainTabs({ navigation, route }) {
  // Permite que telas internas naveguem para uma aba específica:
  //   navigation.navigate('MainTabs', { tab: 'metas' })
  const tabInicial = route?.params?.tab || 'home';
  const [activeTab, setActiveTab] = useState(tabInicial);
  const { colors } = useContext(ThemeContext);

  // Reage a navegações externas que passam { tab: 'metas' } como parâmetro.
  // useState não reage a mudanças de route.params — useEffect resolve.
  useEffect(() => {
    if (route?.params?.tab && route.params.tab !== activeTab) {
      setActiveTab(route.params.tab);
    }
  }, [route?.params?.tab]);

  const statusBarHeight = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 0) : 0;

  const renderScreen = () => {
    switch (activeTab) {
      case 'home':       return <HomeScreen navigation={navigation} />;
      case 'registrar':  return <RegisterScreen navigation={navigation} />;
      case 'metas':      return <MetasScreen navigation={navigation} />;
      case 'relatorios': return <RelatoriosScreen navigation={navigation} />;
      case 'perfil':     return <PerfilScreen navigation={navigation} />;
      default:           return <HomeScreen navigation={navigation} />;
    }
  };

  const styles = ScaledSheet.create({
    safeArea: {
      flex: 1,
      width: '100%',
      backgroundColor: colors.bg,
      // FIX WEB: na web, SafeAreaView nao calcula 100% da viewport automaticamente.
      // Forcar 100vh + overflow:hidden garante que o layout nao extrapole a tela.
      ...Platform.select({
        web: {
          height: '100vh',
          maxHeight: '100vh',
          overflow: 'hidden',
        },
        default: {},
      }),
    },

    // Espacador visual — apenas reserva a altura do header no layout.
    // NAO tem zIndex, NAO tem conteudo, NAO intercepta toques.
    spacerHeader: {
      height: HEADER_HEIGHT,
      paddingTop: statusBarHeight,
    },

    // flex: 1 preenche o espaco entre o spacer e a BottomNav.
    // SEM overflow:'hidden' — esse valor mata o scroll no Android.
    // SEM zIndex — sem zIndex a View nao intercepta toques ao redor.
    // pointerEvents="box-none" = a View em si nao captura toque,
    //   mas os filhos (ScrollView, etc.) capturam normalmente.
    // FIX WEB: na web, flex:1 nao da altura real ao content.
    // Sem altura explicita, ScrollView filho com height:'100%' colapsa para zero.
    // Dimensions.get('window').height - 116 (56 header + 60 BottomNav) = altura exata.
    content: {
      flex: 1,
      width: '100%',
      ...Platform.select({
        web: {
          height: Dimensions.get('window').height - 116,
          // 56 = header, 60 = BottomNav
          overflow: 'hidden',
        },
        default: {},
      }),
    },
  });

  return (
    // edges=['top'] APENAS: evita duplicacao de safe area com a BottomNav
    <SafeAreaView style={styles.safeArea} edges={['top']}>

      {/* Espacador visual do header — sem zIndex, sem conteudo */}
      <View style={styles.spacerHeader} />

      {/* Content: pointerEvents="box-none" = View nao bloqueia toques */}
      <View style={[styles.content, { pointerEvents: 'box-none' }]}>
        {renderScreen()}
      </View>

      {/* BottomNav e o ULTIMO filho no fluxo — fica no fundo naturalmente */}
      <BottomNav active={activeTab} onNav={setActiveTab} labels={TAB_LABELS} />

    </SafeAreaView>
  );
}
