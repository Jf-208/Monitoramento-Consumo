// MainTabs.js
// Tela principal que contém as 3 abas: Início, Relatórios e Perfil.
//
// LAYOUT (de cima para baixo):
//   SafeAreaView (protege topo E base do celular)
//     └── Header (FAB +)
//     └── Content (flex: 1 — preenche todo o espaço do meio)
//     └── BottomNav (NÃO é absolute — fica fixo na base)
//
// Como a BottomNav NÃO é absolute, ela é parte do layout normal.
// Isso significa que NÃO precisamos de paddingBottom no content!
// O flex: 1 do content faz ele ocupar EXATAMENTE o espaço entre
// o header e a BottomNav, e o scroll das telas filhas funciona
// porque elas usam ScrollView sem flex:1 no style.

import React, { useState, useContext } from 'react';
import { View, Platform, StatusBar } from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';
import { SafeAreaView } from 'react-native-safe-area-context';

import HomeScreen from '../screens/Home';
import RelatoriosScreen from '../screens/Reports';
import PerfilScreen from '../screens/Profile';
import BottomNav from '../components/layout/BottomNav';
import FAB from '../components/layout/FAB';
import { ThemeContext } from '../contexts/ThemeContext';

// Labels fixos — NUNCA mudam
const TAB_LABELS = {
  home: 'Início',
  relatorios: 'Relatórios',
  perfil: 'Profile',
};

export default function MainTabs({ navigation }) {
  const [activeTab, setActiveTab] = useState('home');
  const { colors } = useContext(ThemeContext);

  const renderScreen = () => {
    switch (activeTab) {
      case 'home':       return <HomeScreen navigation={navigation} />;
      case 'relatorios': return <RelatoriosScreen navigation={navigation} />;
      case 'perfil':     return <PerfilScreen navigation={navigation} />;
      default:           return <HomeScreen navigation={navigation} />;
    }
  };

  const styles = ScaledSheet.create({
    // SafeAreaView protege TOPO e BASE — a BottomNav nunca some
    safeArea: {
      flex: 1,
      width: '100%',
      backgroundColor: colors.bg,
    },
    header: {
      height: '56@ms',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      paddingHorizontal: '20@s',
      paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
      zIndex: 10,
    },
    // flex: 1 aqui faz o content ocupar TODO o espaço entre header e BottomNav.
    // SEM paddingBottom! A BottomNav não é mais absolute.
    content: {
      flex: 1,
      width: '100%',
    },
  });

  return (
    // edges inclui 'bottom' para que a BottomNav fique ACIMA da barra do sistema
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <FAB navigation={navigation} />
      </View>
      <View style={styles.content}>
        {renderScreen()}
      </View>
      {/* BottomNav é o ÚLTIMO filho — fica no fundo naturalmente */}
      <BottomNav active={activeTab} onNav={setActiveTab} labels={TAB_LABELS} />
    </SafeAreaView>
  );
}
