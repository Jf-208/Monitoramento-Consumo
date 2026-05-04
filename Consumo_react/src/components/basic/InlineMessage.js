// InlineMessage.js
// Componente de feedback visual in-app.
// Substitui alert() e Alert.alert() em todas as telas.
// Aparece como uma caixa colorida dentro do layout, nao como popup do sistema.

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// tipo: 'sucesso' | 'erro' | 'aviso' | 'info'
export default function InlineMessage({ tipo = 'info', mensagem, style }) {
  if (!mensagem) return null;

  const config = {
    sucesso: {
      bg:    '#1D9E7518',
      border:'#1D9E7566',
      icon:  'checkmark-circle',
      cor:   '#1D9E75',
    },
    erro: {
      bg:    '#E24B4A18',
      border:'#E24B4A66',
      icon:  'close-circle',
      cor:   '#E24B4A',
    },
    aviso: {
      bg:    '#EF9F2718',
      border:'#EF9F2766',
      icon:  'warning',
      cor:   '#EF9F27',
    },
    info: {
      bg:    '#378ADD18',
      border:'#378ADD66',
      icon:  'information-circle',
      cor:   '#378ADD',
    },
  };

  const c = config[tipo] || config.info;

  return (
    <View style={[
      styles.container,
      { backgroundColor: c.bg, borderColor: c.border },
      style,
    ]}>
      <Ionicons name={c.icon} size={18} color={c.cor} style={styles.icon} />
      <Text style={[styles.texto, { color: c.cor }]}>{mensagem}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  icon: {
    marginRight: 10,
    flexShrink: 0,
  },
  texto: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
});
