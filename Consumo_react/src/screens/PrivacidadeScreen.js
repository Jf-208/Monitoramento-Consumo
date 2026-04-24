import React, { useContext } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemeContext } from '../contexts/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PrivacidadeScreen({ navigation }) {
  const { colors } = useContext(ThemeContext);

  const styles = StyleSheet.create({
    container: { flexGrow: 1, backgroundColor: colors.bg, padding: 24 },
    title: { fontSize: 24, fontWeight: 'bold', color: colors.text, marginBottom: 24, fontFamily: 'Sora-Bold' },
    text: { fontSize: 16, color: colors.textSub, lineHeight: 24, marginBottom: 16 },
    backButton: { marginTop: 24, alignSelf: 'center' },
    backText: { color: colors.blue, fontSize: 16, fontWeight: 'bold' }
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Política de Privacidade</Text>
        
        <Text style={styles.text}>
          No Wavunder, a sua privacidade é uma prioridade. Os dados de consumo e hábitos inseridos no aplicativo 
          são armazenados no banco de dados com segurança através da nossa API e do armazenamento local.
        </Text>
        
        <Text style={styles.text}>
          Toda a monitorização e cálculo de gastos de energia são utilizados unicamente para gerar insights 
          sustentáveis para você, sem compartilhamento com terceiros.
        </Text>

        <Text style={styles.text}>
          As senhas são criptografadas (usando bcrypt) antes de serem salvas, garantindo que ninguém 
          além de você tenha acesso à sua conta.
        </Text>

        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>Voltar</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
