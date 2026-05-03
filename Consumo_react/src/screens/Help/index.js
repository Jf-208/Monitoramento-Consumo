// Help/index.js
// Tela de Ajuda e Suporte com FAQ.
// Aberta via Stack Navigator — usa SafeAreaView com edges=['top']
// e ScrollView sem flex:1 para garantir scroll funcional no Android.
import React, { useContext } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScaledSheet } from 'react-native-size-matters';
import { ThemeContext } from '../../contexts/ThemeContext';
import { FAQ_AJUDA } from '../../constants/data';
import ScreenScrollView from '../../components/layout/ScreenScrollView';
import { Ionicons } from '@expo/vector-icons';

export default function AjudaScreen({ navigation }) {
  const { colors } = useContext(ThemeContext);

  const styles = ScaledSheet.create({
    // SafeAreaView com flex:1 é o container raiz da tela
    safeArea:    { flex: 1, backgroundColor: colors.bg },
    // ScrollView SEM flex:1 — resolve o scroll no Android
    scroll:      { backgroundColor: colors.bg },
    // padding vai aqui no contentContainerStyle, não no style
    inner:       { paddingHorizontal: '24@s', paddingTop: '20@vs', paddingBottom: '40@vs' },
    header:      { flexDirection: 'row', alignItems: 'center', marginBottom: '24@vs' },
    backBtn:     { width: '40@s', height: '40@s', borderRadius: '12@s', backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
    headerTitle: { fontSize: '20@ms', fontWeight: 'bold', color: colors.text, marginLeft: '16@s' },
    faqBox:      { backgroundColor: colors.surface, padding: '16@ms', borderRadius: '16@s', marginBottom: '16@vs', borderWidth: 1, borderColor: colors.border },
    question:    { fontSize: '15@ms', fontWeight: 'bold', color: colors.text, marginBottom: '8@vs' },
    answer:      { fontSize: '14@ms', color: colors.textSub, lineHeight: '22@ms' },
  });

  return (
    // edges=['top'] — protege o topo na Stack Navigator sem duplicar safe area
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScreenScrollView
        contentContainerStyle={styles.inner}
      >
        {/* Header com botão voltar */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={18} color={colors.textSub} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Ajuda e FAQ</Text>
        </View>

        {/* Usa FAQ_AJUDA do data.js — fonte única de verdade */}
        {FAQ_AJUDA.map((item, index) => (
          <View key={index} style={styles.faqBox}>
            <Text style={styles.question}>{item.pergunta}</Text>
            <Text style={styles.answer}>{item.resposta}</Text>
          </View>
        ))}
      </ScreenScrollView>
    </SafeAreaView>
  );
}
