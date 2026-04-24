import React, { useContext } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';
import { ThemeContext } from '../contexts/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AjudaScreen({ navigation }) {
  const { colors } = useContext(ThemeContext);

  const styles = ScaledSheet.create({
    container: { flexGrow: 1, backgroundColor: colors.bg, padding: '24@ms' },
    title: { fontSize: '24@ms', fontWeight: 'bold', color: colors.text, marginBottom: '24@vs', fontFamily: 'Sora-Bold' },
    faqBox: { backgroundColor: colors.surface, padding: '16@ms', borderRadius: '16@s', marginBottom: '16@vs', borderWidth: 1, borderColor: colors.border },
    question: { fontSize: '16@ms', fontWeight: 'bold', color: colors.text, marginBottom: '8@vs' },
    answer: { fontSize: '14@ms', color: colors.textSub, lineHeight: '20@ms' },
    backButton: { marginTop: '24@vs', alignSelf: 'center' },
    backText: { color: colors.blue, fontSize: '16@ms', fontWeight: 'bold' }
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Ajuda e FAQ</Text>
        
        <View style={styles.faqBox}>
          <Text style={styles.question}>Como os dados são calculados?</Text>
          <Text style={styles.answer}>O Wavunder utiliza um algoritmo que cruza a potência nominal dos seus aparelhos com o tempo estimado de uso para gerar o consumo em kWh.</Text>
        </View>

        <View style={styles.faqBox}>
          <Text style={styles.question}>Como mudar para modo escuro?</Text>
          <Text style={styles.answer}>Vá até a tela de Perfil (ícone de engrenagem) e ative a chave "Modo Escuro".</Text>
        </View>

        <View style={styles.faqBox}>
          <Text style={styles.question}>Como exportar relatórios?</Text>
          <Text style={styles.answer}>Na tela de Relatórios, utilize a aba superior para alternar as visões e em breve teremos o botão de exportar para PDF.</Text>
        </View>

        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>Voltar</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
