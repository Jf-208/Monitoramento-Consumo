// PasswordInput.js
// Componente reutilizavel de input de senha com toggle de visibilidade.
// Usa Ionicons para o icone de olho (eye/eye-off).
// Aplica cores do ThemeContext automaticamente.

import React, { useState, useContext } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '../../contexts/ThemeContext';

export default function PasswordInput({ value, onChangeText, placeholder, style }) {
  const { colors } = useContext(ThemeContext);
  const [visible, setVisible] = useState(false);

  return (
    <View style={[styles.container, { borderColor: colors.border, backgroundColor: colors.surface }, style]}>
      <TextInput
        style={[styles.input, { color: colors.text }]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder || 'Senha'}
        placeholderTextColor={colors.textMuted}
        secureTextEntry={!visible}
        autoCapitalize="none"
      />
      <TouchableOpacity onPress={() => setVisible(v => !v)} style={styles.icon} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
        <Ionicons name={visible ? 'eye' : 'eye-off'} size={20} color={colors.textSub} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 16, paddingHorizontal: 16, marginBottom: 16, height: 56 },
  input: { flex: 1, fontSize: 16 },
  icon: { padding: 4 },
});
