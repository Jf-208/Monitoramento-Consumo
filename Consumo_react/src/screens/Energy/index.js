// Energy/index.js
// Tela de Dashboard de Energia.
// Permite ao usuário simular o consumo de energia selecionando aparelhos (TV, Geladeira, etc)
// ou ajustando a potência e o tempo de uso para calcular kWh e o custo.
// Agora integra com o backend: o botão "Registrar" salva o consumo no servidor Railway.

import React, { useContext, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Slider from '@react-native-community/slider';
import { verticalScale } from 'react-native-size-matters';
import { ThemeContext } from '../../contexts/ThemeContext';
import { ConsumptionContext } from '../../contexts/ConsumptionContext';
import { getEnergiaStyles } from '../../styles/screensStyles';
import ScreenScrollView from '../../components/layout/ScreenScrollView';
import { Ionicons } from '@expo/vector-icons';

export default function EnergiaScreen({ navigation }) {
  const { colors } = useContext(ThemeContext);
  const {
    energiaPotencia, setEnergiaPotencia,
    energiaTempo,    setEnergiaTempo,
    salvarConsumoBackend,
    buscarResumoSemanal,
  } = useContext(ConsumptionContext);

  const styles = getEnergiaStyles(colors);

  // Controle de loading do botão "Registrar"
  const [salvando, setSalvando] = useState(false);

  const kWh   = ((energiaPotencia * energiaTempo) / 60 / 1000).toFixed(2);
  const custo = (parseFloat(kWh) * 0.87).toFixed(2);

  const aparelhos = [
    { nome: 'Chuveiro',  w: 5500 },
    { nome: 'Ar-cond.',  w: 1500 },
    { nome: 'Geladeira', w: 400  },
    { nome: 'TV 55"',    w: 150  },
    { nome: 'PC',        w: 300  },
  ];

  // ─── FUNÇÃO: Registrar consumo no backend ─────────────────────────────────
  const handleRegistrar = async () => {
    const valorKwh = parseFloat(kWh);

    if (valorKwh <= 0) {
      Alert.alert('Atenção', 'Ajuste a potência e o tempo antes de registrar.');
      return;
    }

    setSalvando(true);
    try {
      // Salva o consumo de energia calculado (kWh) como simulado
      const resultado = await salvarConsumoBackend('energia', valorKwh, 'kWh', true);

      if (resultado.success) {
        // Atualiza o resumo semanal da Home imediatamente após salvar
        await buscarResumoSemanal();

        Alert.alert(
          'Consumo Registrado!',
          `${kWh} kWh de energia registrados com sucesso.\nCusto estimado: R$ ${custo}\n\nSua Home foi atualizada.`,
          [{ text: 'OK', style: 'default' }]
        );
      } else {
        Alert.alert(
          'Erro ao Registrar',
          resultado.message || 'Não foi possível salvar o consumo. Verifique a conexão.',
          [{ text: 'Tentar novamente', style: 'default' }]
        );
      }
    } finally {
      setSalvando(false);
    }
  };

  // ─── RENDER ───────────────────────────────────────────────────────────────
  return (
    // SafeAreaView protege o topo no Android sem interferir na Stack Navigator
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top']}>
      <ScreenScrollView
        contentContainerStyle={styles.contentContainer}
      >
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={18} color={colors.textSub} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Energia</Text>
      </View>

      {/* ─── CARD: Seletor de aparelho + sliders ─── */}
      <View style={styles.card}>
        <Text style={styles.label}>Aparelho</Text>
        <View style={styles.chipsRow}>
          {aparelhos.map(a => {
            const active = energiaPotencia === a.w;
            return (
              <TouchableOpacity
                key={a.nome}
                style={[
                  styles.chip,
                  {
                    backgroundColor: active ? colors.gold + '28' : colors.surface,
                    borderColor:     active ? colors.gold : colors.border,
                  },
                ]}
                onPress={() => setEnergiaPotencia(a.w)}
              >
                <Text style={{ color: active ? colors.gold : colors.textSub, fontWeight: active ? 'bold' : 'normal' }}>
                  {a.nome}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.row}>
          <Text style={{ color: colors.textSub }}>Potência:</Text>
          <Text style={styles.valHighlight}>{energiaPotencia}W</Text>
        </View>
        <Slider
          minimumValue={50} maximumValue={10000} step={50}
          value={energiaPotencia} onValueChange={setEnergiaPotencia}
          minimumTrackTintColor={colors.gold}
          thumbTintColor={colors.gold}
          style={{ marginBottom: 20 }}
        />

        <View style={styles.row}>
          <Text style={{ color: colors.textSub }}>Tempo de uso:</Text>
          <Text style={styles.valHighlight}>{energiaTempo} min</Text>
        </View>
        <Slider
          minimumValue={1} maximumValue={480} step={1}
          value={energiaTempo} onValueChange={setEnergiaTempo}
          minimumTrackTintColor={colors.gold}
          thumbTintColor={colors.gold}
        />
      </View>

      {/* ─── GRID DE RESULTADOS ─── */}
      <View style={styles.resultGrid}>
        <View style={[styles.resCard, { backgroundColor: colors.gold + '12', borderColor: colors.gold + '38', marginRight: 10 }]}>
          <Text style={styles.resLabel}>Consumo</Text>
          <Text style={[styles.resVal, { color: colors.gold }]}>{kWh} kWh</Text>
        </View>
        <View style={[styles.resCard, { backgroundColor: colors.teal + '12', borderColor: colors.teal + '38' }]}>
          <Text style={styles.resLabel}>Custo</Text>
          <Text style={[styles.resVal, { color: colors.teal }]}>R$ {custo}</Text>
        </View>
      </View>


      {/* ─── BOTÃO: Registrar consumo no backend ─── */}
      <TouchableOpacity
        style={{
          backgroundColor: colors.gold,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: 14,
          paddingHorizontal: 24,
          borderRadius: 12,
          marginTop: 16,
          opacity: salvando ? 0.7 : 1,
        }}
        onPress={handleRegistrar}
        disabled={salvando}
        activeOpacity={0.8}
      >
        {salvando && (
          <ActivityIndicator size="small" color="#FFF" style={{ marginRight: 8 }} />
        )}
        <Text style={{ color: '#FFF', fontWeight: '600', fontSize: 15 }}>
          {salvando ? 'Registrando...' : 'Registrar consumo'}
        </Text>
      </TouchableOpacity>
      </ScreenScrollView>
    </SafeAreaView>
  );
}
