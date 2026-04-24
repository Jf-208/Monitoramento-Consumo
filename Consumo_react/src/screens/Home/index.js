// Home/index.js
// Tela principal (Dashboard geral) exibida após o login.
// Ela pode conter atalhos para os painéis de Água e Energia, além de resumos gerais de consumo.
import React, { useContext } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { AuthContext } from '../../contexts/AuthContext';
import { ThemeContext } from '../../contexts/ThemeContext';
import { ConsumptionContext } from '../../contexts/ConsumptionContext';
import { getHomeStyles } from '../../styles/screensStyles';
import Chip from '../../components/basic/Chip';
import StatBar from '../../components/intermediate/StatBar';

export default function HomeScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const { colors } = useContext(ThemeContext);
  const { aguaPoupada, energiaPoupada } = useContext(ConsumptionContext);

  const styles = getHomeStyles(colors);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 16 }} showsVerticalScrollIndicator={false}>
      <Text style={styles.greeting}>Olá, {user?.nome || 'Usuário'} 👋</Text>
      <Text style={styles.title}>Seu painel</Text>

      <View style={styles.heroCard}>
        <Text style={styles.heroSubtitle}>Nível sustentável</Text>
        <Text style={styles.heroTitle}>Bom! 🌱</Text>
        <View style={styles.chipsRow}>
          <Chip icon="💧" label="Água poupada" value={`${aguaPoupada} L`} color={colors.blue} />
          <Chip icon="⚡" label="Energia poupada" value={`${energiaPoupada} kWh`} color={colors.gold} />
        </View>
      </View>

      <Text style={styles.sectionTitle}>Esta semana</Text>
      <View style={styles.statsCard}>
        <StatBar label="Consumo de Água" value={420} max={700} color={colors.blue} unit="L" />
        <StatBar label="Consumo de Energia" value={6.3} max={15} color={colors.gold} unit="kWh" />
      </View>
    </ScrollView>
  );
}
