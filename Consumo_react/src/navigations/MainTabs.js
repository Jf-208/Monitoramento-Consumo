// MainTabs.js
// Tela principal que contém as 3 abas: Início, Relatórios e Perfil.
//
// LAYOUT (de cima para baixo):
//   SafeAreaView (protege APENAS o topo — edges=['top'])
//     └── spacerHeader  ← ocupa o espaço visual do header SEM participar do layout de toque
//     └── Content (flex: 1) ← preenche todo o espaço do meio
//     └── BottomNav ← fica fixo na base naturalmente
//     └── fabContainer (absolute) ← FAB fora do fluxo para não interceptar toques
//
// POR QUE o FAB está fora do header?
// No Android, qualquer View com zIndex captura TODOS os toques na sua área,
// inclusive áreas transparentes que se estendem para baixo do componente.
// Colocando o FAB em position:absolute com pointerEvents="box-none",
// apenas o botão em si captura toque — a área ao redor não bloqueia o scroll.
//
// POR QUE sem overflow:'hidden' no content?
// overflow:'hidden' no Android impede o scroll de ser registrado nos filhos.
//
// FIX WEB:
// Na web, flex:1 dentro de SafeAreaView nem sempre calcula a altura corretamente.
// Usamos Dimensions.get('window').height - header - bottomNav para dar altura
// explícita ao content view, permitindo que o ScrollView filho role corretamente.

import React, { useState, useContext } from 'react';
import { View, Platform, StatusBar, Dimensions } from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';
import { SafeAreaView } from 'react-native-safe-area-context';

import HomeScreen from '../screens/Home';
import RelatoriosScreen from '../screens/Reports';
import PerfilScreen from '../screens/Profile';
import BottomNav from '../components/layout/BottomNav';
import FAB from '../components/layout/FAB';
import { ThemeContext } from '../contexts/ThemeContext';

// Labels fixos das abas — NUNCA mudam
const TAB_LABELS = {
  home: 'Início',
  relatorios: 'Relatórios',
  perfil: 'Perfil',
};

// Altura do header: usada tanto no spacer quanto no posicionamento do FAB
const HEADER_HEIGHT = 56;
const BOTTOM_NAV_HEIGHT = 60;



export default function MainTabs({ navigation }) {
  const [activeTab, setActiveTab] = useState('home');
  const { colors } = useContext(ThemeContext);

  const statusBarHeight = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 0) : 0;

  const renderScreen = () => {
    switch (activeTab) {
      case 'home':       return <HomeScreen navigation={navigation} />;
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
      // FIX WEB: na web, SafeAreaView não calcula 100% da viewport automaticamente.
      // Forçar 100vh + overflow:hidden garante que o layout não extrapole a tela.
      ...Platform.select({
        web: {
          height: '100vh',
          maxHeight: '100vh',
          overflow: 'hidden',
        },
        default: {},
      }),
    },

    // Espaçador visual — apenas reserva a altura do header no layout.
    // NÃO tem zIndex, NÃO tem conteúdo, NÃO intercepta toques.
    spacerHeader: {
      height: HEADER_HEIGHT,
      paddingTop: statusBarHeight,
    },

    // flex: 1 preenche o espaço entre o spacer e a BottomNav.
    // SEM overflow:'hidden' — esse valor mata o scroll no Android.
    // SEM zIndex — sem zIndex a View não intercepta toques ao redor.
    // pointerEvents="box-none" = a View em si não captura toque,
    //   mas os filhos (ScrollView, etc.) capturam normalmente.
    // FIX WEB: na web, flex:1 não dá altura real ao content.
    // Sem altura explícita, ScrollView filho com height:'100%' colapsa para zero.
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

    // FAB em position:absolute — centralizado acima da BottomNav.
    // pointerEvents="box-none" garante que apenas o botao do FAB
    // captura toque, e nao a area transparente ao redor dele.
    fabContainer: {
      position: 'absolute',
      bottom: BOTTOM_NAV_HEIGHT + 16,
      alignSelf: 'center',
      left: 0,
      right: 0,
      alignItems: 'center',
      zIndex: 999,
    },
  });

  return (
    // edges=['top'] APENAS: evita duplicação de safe area com a BottomNav
    <SafeAreaView style={styles.safeArea} edges={['top']}>

      {/* Espaçador visual do header — sem zIndex, sem conteúdo */}
      <View style={styles.spacerHeader} />

      {/* Content: pointerEvents="box-none" = View não bloqueia toques */}
      <View style={styles.content} pointerEvents="box-none">
        {renderScreen()}
      </View>

      {/* BottomNav é o ÚLTIMO filho no fluxo — fica no fundo naturalmente */}
      <BottomNav active={activeTab} onNav={setActiveTab} labels={TAB_LABELS} />

      {/* FAB absolutamente posicionado — fora do fluxo, não interfere com scroll */}
      <View style={styles.fabContainer} pointerEvents="box-none">
        <FAB navigation={navigation} />
      </View>

    </SafeAreaView>
  );
}
