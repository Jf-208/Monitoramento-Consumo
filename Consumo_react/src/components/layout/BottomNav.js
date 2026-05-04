// BottomNav.js
// Barra de navegacao inferior do app Wavunder.
// Usa Ionicons para icones em vez de caracteres Unicode.
// IMPORTANTE: NAO usa position: absolute! Ela e um elemento normal do Flexbox,
// posicionada no final do SafeAreaView. Os LABELS sao fixos do MainTabs.

import React, { useContext } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '../../contexts/ThemeContext';

// Labels fixos — fallback caso MainTabs nao passe
const DEFAULT_LABELS = {
  home: 'Inicio',
  relatorios: 'Relatorios',
  perfil: 'Perfil',
};

export default function BottomNav({ active, onNav, labels = DEFAULT_LABELS }) {
  const { colors } = useContext(ThemeContext);

  const items = [
    { id: 'home',       icon: 'home',          label: 'Início'     },
    { id: 'registrar',  icon: 'add-circle',    label: 'Registrar'  },
    { id: 'relatorios', icon: 'bar-chart',     label: 'Relatórios' },
    { id: 'perfil',     icon: 'person-circle', label: 'Perfil'     },
  ];

  const styles = ScaledSheet.create({
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
    label: {
      fontSize: '11@ms',
      marginTop: '2@ms',
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
            <Ionicons
              name={isActive ? item.icon : `${item.icon}-outline`}
              size={22}
              color={isActive ? colors.gold : colors.textMuted}
              style={{ opacity: isActive ? 1 : 0.5 }}
            />
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
