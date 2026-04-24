// BottomNav.js
// Barra de navegação inferior do app Wavunder.
// IMPORTANTE: NÃO usa position: absolute! Ela é um elemento normal do Flexbox,
// posicionada no final do SafeAreaView. Isso garante que ela NUNCA fique
// atrás da barra de navegação do celular (gestos/botões do Android).
// Os LABELS são fixos e passados pelo MainTabs para nunca mudarem.

import React, { useContext } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';
import { ThemeContext } from '../../contexts/ThemeContext';

// Labels fixos — fallback caso MainTabs não passe
const DEFAULT_LABELS = {
  home: 'Início',
  relatorios: 'Relatórios',
  perfil: 'Profile',
};

export default function BottomNav({ active, onNav, labels = DEFAULT_LABELS }) {
  const { colors } = useContext(ThemeContext);

  const items = [
    { id: 'home',       icon: '⊞' },
    { id: 'relatorios', icon: '◫' },
    { id: 'perfil',     icon: '◯' },
  ];

  const styles = ScaledSheet.create({
    // SEM position: absolute! A barra é parte do layout normal.
    // O SafeAreaView do MainTabs garante que ela fique acima da
    // barra de navegação do sistema (gestos/botões).
    container: {
      height: '64@ms',
      backgroundColor: colors.surface,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      width: '100%',
    },
    btn: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: '24@s',
      paddingVertical: '8@ms',
    },
    icon: {
      fontSize: '22@ms',
      marginBottom: '4@ms',
    },
    label: {
      fontSize: '11@ms',
    },
    indicator: {
      position: 'absolute',
      bottom: '2@ms',
      width: '16@s',
      height: '3@ms',
      borderRadius: '2@s',
      backgroundColor: colors.gold,
    },
  });

  return (
    <View style={styles.container}>
      {items.map((item) => {
        const isActive = active === item.id;
        const label = labels[item.id] || item.id;
        return (
          <TouchableOpacity key={item.id} style={styles.btn} onPress={() => onNav(item.id)}>
            <Text style={[styles.icon, { color: isActive ? colors.gold : colors.textMuted, opacity: isActive ? 1 : 0.5 }]}>
              {item.icon}
            </Text>
            <Text style={[styles.label, { color: isActive ? colors.gold : colors.textMuted, fontWeight: isActive ? '700' : '400' }]}>
              {label}
            </Text>
            {isActive && <View style={styles.indicator} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
