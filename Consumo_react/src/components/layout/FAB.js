// FAB.js
// Floating Action Button — botao "+" no canto superior direito.
// Fechado: botao circular dourado com icone "+".
// Aberto: "+" vira "X" (vermelho), opcoes aparecem abaixo alinhadas a direita.
// Usa MotiView para animacoes staggered nos itens do menu.

import React, { useState, useContext } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';
import { ThemeContext } from '../../contexts/ThemeContext';

const OPCOES = [
  { label: 'Agua',    icon: 'water', cor: '#378ADD', rota: 'Water'  },
  { label: 'Energia', icon: 'flash', cor: '#EF9F27', rota: 'Energy' },
  { label: 'Dicas',   icon: 'bulb',  cor: '#1D9E75', rota: 'Tips'   },
];

export default function FAB({ navigation }) {
  const [aberto, setAberto] = useState(false);
  const { colors } = useContext(ThemeContext);

  const navegar = (rota) => {
    setAberto(false);
    navigation.navigate(rota);
  };

  return (
    <View style={styles.container} pointerEvents="box-none">
      {/* Botao principal */}
      <TouchableOpacity
        style={[styles.fabPrincipal, { backgroundColor: aberto ? '#E24B4A' : '#EF9F27' }]}
        onPress={() => setAberto(a => !a)}
        activeOpacity={0.85}
      >
        <MotiView
          animate={{ rotate: aberto ? '45deg' : '0deg' }}
          transition={{ type: 'timing', duration: 200 }}
        >
          <Ionicons name="add" size={28} color="#fff" />
        </MotiView>
      </TouchableOpacity>

      {/* Opcoes — aparecem abaixo do botao principal */}
      {OPCOES.map((op, i) => (
        <MotiView
          key={op.rota}
          from={{ opacity: 0, translateY: -8, scale: 0.8 }}
          animate={{
            opacity: aberto ? 1 : 0,
            translateY: aberto ? 0 : -8,
            scale: aberto ? 1 : 0.8,
          }}
          transition={{
            type: 'timing',
            duration: 200,
            delay: aberto ? i * 60 : (OPCOES.length - 1 - i) * 40,
          }}
          style={[styles.opcaoRow, { pointerEvents: aberto ? 'auto' : 'none' }]}
        >
          <Text style={styles.opcaoLabel}>{op.label}</Text>
          <TouchableOpacity
            style={[styles.opcaoBtn, { backgroundColor: op.cor }]}
            onPress={() => navegar(op.rota)}
            activeOpacity={0.85}
          >
            <Ionicons name={op.icon} size={20} color="#fff" />
          </TouchableOpacity>
        </MotiView>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-end',
    gap: 10,
  },
  fabPrincipal: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  opcaoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  opcaoLabel: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    overflow: 'hidden',
  },
  opcaoBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});
