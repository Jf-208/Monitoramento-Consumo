// Tips/index.js
// Tela de Dicas de Sustentabilidade.
// Exibe a lista de 18 dicas com fontes reais, usando Ionicons para icones.
// Aberta via Stack Navigator — tem SafeAreaView e ScreenScrollView.
import React, { useContext } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScaledSheet } from 'react-native-size-matters';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '../../contexts/ThemeContext';
import { DICAS } from '../../constants/data';
import ScreenScrollView from '../../components/layout/ScreenScrollView';

export default function DicasScreen({ navigation }) {
  const { colors } = useContext(ThemeContext);

  const styles = ScaledSheet.create({
    safeArea:   { flex: 1, backgroundColor: colors.bg },
    inner:      { paddingHorizontal: '20@s', paddingTop: '20@vs', paddingBottom: '40@vs' },
    header:     { flexDirection: 'row', alignItems: 'center', marginBottom: '24@vs' },
    backBtn:    { width: '40@s', height: '40@s', borderRadius: '12@s', backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
    headerTitle: { fontSize: '20@ms', fontWeight: 'bold', color: colors.text, marginLeft: '16@s' },
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
      <ScreenScrollView
        contentContainerStyle={styles.inner}
      >
        {/* Header com botao voltar */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={18} color={colors.textSub} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Dicas</Text>
        </View>

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
