// Tips/index.js
// Tela de Dicas de Sustentabilidade.
// Exibe a lista de 18 dicas com fontes reais, usando Ionicons para icones.
// Aberta via Stack Navigator — tem SafeAreaView e ScreenScrollView.
import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScaledSheet } from 'react-native-size-matters';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '../../contexts/ThemeContext';
import { DICAS } from '../../constants/data';
import ScreenScrollView from '../../components/layout/ScreenScrollView';

export default function DicasScreen({ navigation }) {
  const { colors } = useContext(ThemeContext);

  const styles = ScaledSheet.create({
    safeArea:    { flex: 1, backgroundColor: colors.bg },
    inner:       { paddingHorizontal: '20@s', paddingTop: '20@vs', paddingBottom: '40@vs' },
    // Cabeçalho — mesmo estilo da tela de Privacidade
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerTitle:  { fontSize: 18, fontWeight: '700', color: colors.text },
    dicaCard: {
      flexDirection: 'row', alignItems: 'center',
      padding: '16@ms', borderRadius: '18@s', borderWidth: 1,
      marginBottom: '12@vs',
    },
    iconBox: {
      width: '48@s', height: '48@s', borderRadius: '14@s',
      alignItems: 'center', justifyContent: 'center',
      marginRight: '16@s', borderWidth: 1,
    },
    dicaTitle: { fontSize: '15@ms', fontWeight: 'bold', marginBottom: '4@vs' },
    dicaDesc:  { fontSize: '13@ms', color: colors.textSub, flexShrink: 1 },
    fonte: { fontSize: '10@ms', color: colors.textMuted, marginTop: '4@vs', fontStyle: 'italic' },
  });

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Cabeçalho — mesmo estilo de Privacidade e Ajuda */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 12 }}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dicas de Sustentabilidade</Text>
      </View>
      <ScreenScrollView contentContainerStyle={styles.inner}>

        {DICAS.map((d) => (
          <TouchableOpacity
            key={d.id}
            style={[styles.dicaCard, { backgroundColor: d.cor + '14', borderColor: d.cor + '35' }]}
            activeOpacity={0.85}
          >
            <View style={[styles.iconBox, { backgroundColor: d.cor + '20', borderColor: d.cor + '35' }]}>
              <Ionicons name={d.icon} size={22} color={d.cor} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.dicaTitle, { color: d.cor }]}>{d.title}</Text>
              <Text style={styles.dicaDesc}>{d.desc}</Text>
              {d.fonte && <Text style={styles.fonte}>Fonte: {d.fonte}</Text>}
            </View>
          </TouchableOpacity>
        ))}
      </ScreenScrollView>
    </SafeAreaView>
  );
}
