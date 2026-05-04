// Energy/index.js
// Tela de Dashboard de Energia.
// Permite simular consumo selecionando aparelhos ou ajustando potencia/tempo.
// Integra com o backend para registrar consumo.
// Feedback via InlineMessage (sem alert nativo).

import React, { useContext, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Slider from '@react-native-community/slider';
import { verticalScale } from 'react-native-size-matters';
import { ThemeContext } from '../../contexts/ThemeContext';
import { ConsumptionContext } from '../../contexts/ConsumptionContext';
import { getEnergiaStyles } from '../../styles/screensStyles';
import ScreenScrollView from '../../components/layout/ScreenScrollView';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import InlineMessage from '../../components/basic/InlineMessage';
import { useFocusEffect } from '@react-navigation/native';

export default function EnergiaScreen({ navigation }) {
  const { colors } = useContext(ThemeContext);
  const {
    energiaPotencia, setEnergiaPotencia,
    energiaTempo,    setEnergiaTempo,
    salvarConsumoBackend,
    buscarResumoSemanal,
  } = useContext(ConsumptionContext);

  const styles = getEnergiaStyles(colors);

  // Controle de loading e feedback
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState(null); // { tipo, texto }

  // Limpa mensagem ao voltar para a tela
  useFocusEffect(
    useCallback(() => {
      setMensagem(null);
      setSalvando(false);
    }, [])
  );

  const kWh   = ((energiaPotencia * energiaTempo) / 60 / 1000).toFixed(2);
  const custo = (parseFloat(kWh) * 0.87).toFixed(2);

  // Aparelhos com icones MaterialCommunityIcons
  const aparelhos = [
    { nome: 'Chuveiro',  w: 5500, icon: 'shower' },
    { nome: 'Ar-cond.',  w: 1500, icon: 'air-conditioner' },
    { nome: 'Geladeira', w: 150,  icon: 'fridge-outline' },
    { nome: 'TV 55"',    w: 120,  icon: 'television' },
    { nome: 'PC',        w: 300,  icon: 'desktop-tower' },
  ];

  // ─── Registrar consumo no backend (com InlineMessage) ─────────
  const handleRegistrar = async () => {
    setMensagem(null);
    const valorKwh = parseFloat(kWh);

    if (valorKwh <= 0) {
      setMensagem({ tipo: 'aviso', texto: 'Ajuste a potência e o tempo antes de registrar.' });
      return;
    }

    setSalvando(true);
    try {
      const resultado = await salvarConsumoBackend('energia', valorKwh, 'kWh', true);

      if (resultado.success) {
        await buscarResumoSemanal();
        setMensagem({
          tipo:  'sucesso',
          texto: `${kWh} kWh registrados! Custo estimado: R$ ${custo}. Painel atualizado.`,
        });
      } else {
        setMensagem({
          tipo:  'erro',
          texto: 'Não foi possível registrar. Verifique sua conexão e tente novamente.',
        });
      }
    } catch (e) {
      setMensagem({
        tipo:  'erro',
        texto: 'Sem conexão com o servidor. Verifique sua internet.',
      });
    } finally {
      setSalvando(false);
    }
  };

  // ─── RENDER ────────────────────────────────────────────────────────────────
  return (
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
                    flexDirection: 'row',
                    alignItems: 'center',
                  },
                ]}
                onPress={() => setEnergiaPotencia(a.w)}
              >
                <MaterialCommunityIcons
                  name={a.icon}
                  size={16}
                  color={active ? colors.gold : colors.textSub}
                  style={{ marginRight: 4 }}
                />
                <Text style={{ color: active ? colors.gold : colors.textSub, fontWeight: active ? 'bold' : 'normal' }}>
                  {a.nome}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.row}>
          <Text style={{ color: colors.textSub }}>Potencia:</Text>
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
          <Ionicons name="flash" size={20} color={colors.gold} style={{ marginBottom: 4 }} />
          <Text style={styles.resLabel}>Consumo</Text>
          <Text style={[styles.resVal, { color: colors.gold }]}>{kWh} kWh</Text>
        </View>
        <View style={[styles.resCard, { backgroundColor: colors.teal + '12', borderColor: colors.teal + '38' }]}>
          <Ionicons name="cash-outline" size={20} color={colors.teal} style={{ marginBottom: 4 }} />
          <Text style={styles.resLabel}>Custo</Text>
          <Text style={[styles.resVal, { color: colors.teal }]}>R$ {custo}</Text>
        </View>
      </View>

      {/* ─── FEEDBACK IN-APP (substitui Alert.alert e painel de diagnostico) ─── */}
      {mensagem && (
        <InlineMessage tipo={mensagem.tipo} mensagem={mensagem.texto} style={{ marginTop: 8 }} />
      )}

      {/* ─── BOTAO: Registrar consumo no backend ─── */}
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
