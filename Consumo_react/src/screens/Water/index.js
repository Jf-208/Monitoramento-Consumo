// Water/index.js
// Tela de Dashboard de Água.
// Exibe o consumo de água em tempo real, permite simular o tempo de banho e a vazão do chuveiro,
// e calcula o custo estimado e litros gastos.
// Agora integra com o backend: o botão "Registrar" salva o consumo no servidor Railway.

import React, { useContext, useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Slider from '@react-native-community/slider';
import { ThemeContext } from '../../contexts/ThemeContext';
import { ConsumptionContext } from '../../contexts/ConsumptionContext';
import { getAguaStyles } from '../../styles/screensStyles';
import ScreenScrollView from '../../components/layout/ScreenScrollView';

export default function AguaScreen({ navigation }) {
  const { colors } = useContext(ThemeContext);
  const {
    banhoTempo,
    setBanhoTempo,
    salvarConsumoBackend,
    buscarResumoSemanal,
  } = useContext(ConsumptionContext);

  const styles = getAguaStyles(colors);

  // Controle de loading do botão "Registrar"
  const [salvando, setSalvando] = useState(false);

  const litros  = Math.round(banhoTempo * 7);
  const economia = banhoTempo > 10
    ? `Reduzir ${banhoTempo - 10} min economiza ${(banhoTempo - 10) * 7} L`
    : 'Otimo tempo de banho!';

  // ─── FUNÇÃO: Registrar consumo no backend ─────────────────────────────────
  const handleRegistrar = async () => {
    setSalvando(true);
    try {
      // Salva o consumo calculado (litros = tempo * 7L/min) como simulado
      const resultado = await salvarConsumoBackend('agua', litros, 'L', true);

      if (resultado.success) {
        // Atualiza o resumo semanal da Home imediatamente após salvar
        await buscarResumoSemanal();

        Alert.alert(
          'Consumo Registrado!',
          `${litros} L de água registrados com sucesso.\n\nSua Home foi atualizada.`,
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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top']}>
      <ScreenScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20 }}
      >
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={{ color: colors.textSub, fontSize: 18 }}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Agua</Text>
      </View>

      {/* ─── CARD: Slider de tempo de banho ─── */}
      <View style={styles.card}>
        <Text style={styles.label}>Tempo de banho</Text>
        <View style={styles.controls}>
          <TouchableOpacity
            style={styles.circleBtn}
            onPress={() => setBanhoTempo(Math.max(1, banhoTempo - 1))}
          >
            <Text style={styles.btnText}>-</Text>
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
            <Text style={styles.timeText}>{banhoTempo}</Text>
            <Text style={styles.unitText}> min</Text>
          </View>
          <TouchableOpacity
            style={[styles.circleBtn, { borderColor: colors.blue }]}
            onPress={() => setBanhoTempo(Math.min(60, banhoTempo + 1))}
          >
            <Text style={[styles.btnText, { color: colors.blue }]}>+</Text>
          </TouchableOpacity>
        </View>
        <Slider
          minimumValue={1} maximumValue={60} step={1}
          value={banhoTempo} onValueChange={setBanhoTempo}
          minimumTrackTintColor={colors.blue}
          thumbTintColor={colors.blue}
        />
      </View>

      {/* ─── CARD: Resultado calculado ─── */}
      <View style={styles.card}>
        <Text style={styles.resultTitle}>Você gastou</Text>
        <Text style={styles.resultValue}>{litros} L</Text>
      </View>

      {/* ─── CAIXA DE DICA ─── */}
      <View style={[
        styles.tipBox,
        {
          backgroundColor: banhoTempo > 10 ? colors.gold + '14' : colors.teal + '14',
          borderColor:      banhoTempo > 10 ? colors.gold + '44' : colors.teal + '44',
        },
      ]}>
        <Text style={styles.tipIcon}>{banhoTempo > 10 ? 'i' : '+'}</Text>
        <Text style={{ flex: 1, fontSize: 14, color: banhoTempo > 10 ? colors.gold : colors.teal }}>
          {economia}
        </Text>
      </View>

      {/* ─── BOTÃO: Registrar consumo no backend ─── */}
      <TouchableOpacity
        style={{
          backgroundColor: colors.blue,
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
