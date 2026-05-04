// Water/index.js
// Tela de Dashboard de Agua.
// Exibe o consumo de agua, permite simular o tempo de banho,
// e calcula litros gastos. Integra com o backend para registrar consumo.

import React, { useContext, useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Slider from '@react-native-community/slider';
import { ThemeContext } from '../../contexts/ThemeContext';
import { ConsumptionContext } from '../../contexts/ConsumptionContext';
import { getAguaStyles } from '../../styles/screensStyles';
import ScreenScrollView from '../../components/layout/ScreenScrollView';
import { Ionicons } from '@expo/vector-icons';

export default function AguaScreen({ navigation }) {
  const { colors } = useContext(ThemeContext);
  const {
    banhoTempo,
    setBanhoTempo,
    salvarConsumoBackend,
    buscarResumoSemanal,
    ultimoErroRegistro,
  } = useContext(ConsumptionContext);

  const styles = getAguaStyles(colors);

  // Controle de loading e erro
  const [salvando, setSalvando] = useState(false);

  const litros  = Math.round(banhoTempo * 7);
  const economia = banhoTempo > 10
    ? `Reduzir ${banhoTempo - 10} min economiza ${(banhoTempo - 10) * 7} L`
    : 'Otimo tempo de banho!';

  // ─── Registrar consumo no backend (com tratamento robusto de erro) ─────────
  const handleRegistrar = async () => {
    setSalvando(true);
    try {
      const resultado = await salvarConsumoBackend('agua', litros, 'L', true);

      if (resultado.success) {
        await buscarResumoSemanal();
        Alert.alert(
          'Registrado!',
          `${litros} L de agua foram salvos.\nSua Home foi atualizada!`,
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert(
          'Erro ao registrar',
          (resultado.message || 'Falha ao salvar.') + '\n\nVerifique sua conexao com a internet.',
          [
            { text: 'Tentar novamente', onPress: handleRegistrar },
            { text: 'Cancelar', style: 'cancel' },
          ]
        );
      }
    } catch (e) {
      Alert.alert(
        'Sem conexao',
        'Nao foi possivel alcancar o servidor. Verifique sua internet e tente novamente.',
        [{ text: 'OK' }]
      );
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
          <Ionicons name="arrow-back" size={18} color={colors.textSub} />
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
        <Text style={styles.resultTitle}>Voce gastou</Text>
        <Text style={styles.resultValue}>{litros} L</Text>
      </View>

      {/* ─── CAIXA DE DICA com Ionicons ─── */}
      <View style={[
        styles.tipBox,
        {
          backgroundColor: banhoTempo > 10 ? colors.gold + '14' : colors.teal + '14',
          borderColor:      banhoTempo > 10 ? colors.gold + '44' : colors.teal + '44',
          flexDirection: 'row',
          alignItems: 'center',
        },
      ]}>
        <Ionicons
          name={banhoTempo > 10 ? 'information-circle' : 'checkmark-circle'}
          size={20}
          color={banhoTempo > 10 ? colors.gold : colors.teal}
          style={{ marginRight: 8, marginTop: 1 }}
        />
        <Text style={{ flex: 1, fontSize: 14, color: banhoTempo > 10 ? colors.gold : colors.teal }}>
          {economia}
        </Text>
      </View>

      {/* ─── PAINEL DE DIAGNOSTICO (exibe erro do backend) ─── */}
      {ultimoErroRegistro ? (
        <View style={{ backgroundColor: '#FF000022', borderColor: '#FF0000', borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 8 }}>
          <Text style={{ color: '#FF5A72', fontSize: 12 }}>ERRO: {ultimoErroRegistro}</Text>
        </View>
      ) : null}

      {/* ─── BOTAO: Registrar consumo no backend ─── */}
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
