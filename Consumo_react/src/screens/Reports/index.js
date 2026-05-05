// Reports/index.js
// Tela de relatorios com:
//   1. Grafico de barras SEMANAL empilhado (Agua + Energia + Outros) — dados REAIS do backend
//   2. Grafico de pizza com as 3 categorias normalizadas em R$ (soma = 100%)
//   3. Card de "Totais da semana" com valores reais
//   4. Modal informativo sobre as categorias
//
// Os dados sao buscados do backend em /consumo/semanal/{id_usuario}.
// Se a requisicao falhar, mantem zeros como fallback.
//
// FIX WEB:
// - ScrollView recebe overflow:'scroll' via Platform.select para habilitar mouse wheel
// - PieChart do react-native-chart-kit NAO funciona na web (usa ART que nao existe)
// - Na web, renderizamos um grafico de pizza manual usando react-native-svg

import React, { useState, useEffect, useContext } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  Modal, Dimensions, StyleSheet, ActivityIndicator, Platform,
} from 'react-native';
import { Svg, Circle, G, Text as SvgText } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '../../contexts/ThemeContext';
import { AuthContext } from '../../contexts/AuthContext';
import api from '../../services/api';

const SCREEN_W = Dimensions.get('window').width;

// ─── FIX WEB: estilo do ScrollView para habilitar scroll com mouse na web ────
const webScrollStyle = Platform.select({
  web: { overflow: 'scroll', height: '100%', WebkitOverflowScrolling: 'touch' },
  default: {},
});

// ─── COMPONENTE: Grafico de Pizza compativel com Web e Nativo ────────────────
// Na web, react-native-chart-kit PieChart falha porque depende de ART.
// Este componente usa react-native-svg para desenhar arcos (funciona em ambos).
function PieChartSVG({ data, size = 160, strokeWidth = 32 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  // Calcular offsets acumulados para posicionar cada fatia
  let accumulatedOffset = 0;

  return (
    <View style={{ alignItems: 'center' }}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <G rotation="-90" origin={`${center}, ${center}`}>
          {data.map((item, index) => {
            const percentage = item.population / 100;
            const strokeDash = circumference * percentage;
            const strokeGap = circumference - strokeDash;
            const offset = -accumulatedOffset;

            accumulatedOffset += strokeDash;

            return (
              <Circle
                key={index}
                cx={center}
                cy={center}
                r={radius}
                fill="transparent"
                stroke={item.color}
                strokeWidth={strokeWidth}
                strokeDasharray={`${strokeDash} ${strokeGap}`}
                strokeDashoffset={offset}
                strokeLinecap="butt"
              />
            );
          })}
        </G>
      </Svg>

      {/* Legenda abaixo do grafico */}
      <View style={{ flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', marginTop: 16, width: '100%' }}>
        {data.map((item, index) => (
          <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 8, marginBottom: 8 }}>
            <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: item.color, marginRight: 6 }} />
            <Text style={{ color: item.legendFontColor, fontSize: 12 }}>
              {item.name} {item.population}%
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

// ─── COMPONENTE NATIVO: usa PieChart do chart-kit (so no Android/iOS) ─────────
// Importacao condicional: so carrega chart-kit no nativo para evitar crash na web
let PieChartNative = null;
if (Platform.OS !== 'web') {
  try {
    PieChartNative = require('react-native-chart-kit').PieChart;
  } catch (e) {
    // Fallback: se chart-kit nao estiver disponivel, usaremos o SVG
    PieChartNative = null;
  }
}

// ─── TARIFAS PARA NORMALIZACAO EM R$ ─────────────────────────────────────────
const TARIFA_AGUA_LITRO = 0.0065;   // R$ 6,50/m3
const TARIFA_ENERGIA_KWH = 0.87;    // R$/kWh

export default function RelatoriosScreen() {
  const { colors } = useContext(ThemeContext);
  const { user }   = useContext(AuthContext);
  const [modalVisible, setModalVisible] = useState(false);

  // ─── ESTADOS DOS DADOS SEMANAIS ───────────────────────────────────────────
  // Arrays de 7 posicoes para cada categoria
  const [dadosSemanais, setDadosSemanais] = useState({
    dias:    ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"],
    agua:    [0, 0, 0, 0, 0, 0, 0],
    energia: [0, 0, 0, 0, 0, 0, 0],
    outros:  [0, 0, 0, 0, 0, 0, 0],
  });

  // Totais da semana para o card de resumo
  const [totaisSemana, setTotaisSemana] = useState({
    agua: 0, energia: 0, outros: 0,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [usandoMock, setUsandoMock] = useState(false);

  // ─── BUSCA DADOS DO BACKEND ───────────────────────────────────────────────
  useEffect(() => {
    const buscarDadosSemanais = async () => {
      if (!user?.id) {
        setDadosSemanais({
          dias: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'],
          agua:    [0, 0, 0, 0, 0, 0, 0],
          energia: [0, 0, 0, 0, 0, 0, 0],
          outros:  [0, 0, 0, 0, 0, 0, 0],
        });
        setTotaisSemana({ agua: 0, energia: 0, outros: 0 });
        setUsandoMock(false);
        setIsLoading(false);
        return;
      }

      try {
        const response = await api.get(`/consumo/semanal/${user.id}`);
        const dados = response.data;

        // Verifica se ha dados reais (pelo menos um valor nao-zero)
        const temDados =
          dados.agua.some(v => v > 0) ||
          dados.energia.some(v => v > 0) ||
          dados.outros.some(v => v > 0);

        if (temDados) {
          setDadosSemanais({
            dias:    dados.dias,
            agua:    dados.agua,
            energia: dados.energia,
            outros:  dados.outros,
          });
          setTotaisSemana({
            agua:    dados.agua.reduce((a, b) => a + b, 0),
            energia: dados.energia.reduce((a, b) => a + b, 0),
            outros:  dados.outros.reduce((a, b) => a + b, 0),
          });
          setUsandoMock(false);
        } else {
          setDadosSemanais({
            dias:    dados.dias,
            agua:    [0, 0, 0, 0, 0, 0, 0],
            energia: [0, 0, 0, 0, 0, 0, 0],
            outros:  [0, 0, 0, 0, 0, 0, 0],
          });
          setTotaisSemana({ agua: 0, energia: 0, outros: 0 });
          setUsandoMock(false);
        }
      } catch (error) {
        // Fallback: mantem zeros se o backend nao responder
        console.log('Erro ao buscar dados semanais:', error);
        setDadosSemanais({
          dias: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'],
          agua:    [0, 0, 0, 0, 0, 0, 0],
          energia: [0, 0, 0, 0, 0, 0, 0],
          outros:  [0, 0, 0, 0, 0, 0, 0],
        });
        setTotaisSemana({ agua: 0, energia: 0, outros: 0 });
        setUsandoMock(false);
      } finally {
        setIsLoading(false);
      }
    };

    buscarDadosSemanais();
  }, [user]);

  // ─── CALCULOS DERIVADOS ───────────────────────────────────────────────────
  const { dias, agua, energia, outros } = dadosSemanais;

  // Para o grafico de barras: normalizar agua/energia/outros em mesma escala
  // Agua e energia sao em unidades fisicas, outros em R$.
  // Para o grafico de barras empilhado, usamos valores brutos de cada tipo.
  const totais    = dias.map((_, i) => agua[i] + energia[i] + outros[i]);
  const maxTotal  = Math.max(...totais, 1); // evita divisao por zero

  // ─── PIZZA: Normalizar tudo para R$ para comparacao justa ─────────────────
  const gastoAguaReais    = totaisSemana.agua * TARIFA_AGUA_LITRO;
  const gastoEnergiaReais = totaisSemana.energia * TARIFA_ENERGIA_KWH;
  const gastoOutrosReais  = totaisSemana.outros; // ja esta em R$
  const gastoTotalReais   = gastoAguaReais + gastoEnergiaReais + gastoOutrosReais || 1;

  // Percentuais normalizados em R$ para o pizza
  const pctAgua    = Math.round((gastoAguaReais    / gastoTotalReais) * 100);
  const pctEnergia = Math.round((gastoEnergiaReais / gastoTotalReais) * 100);
  const pctOutros  = Math.round((gastoOutrosReais  / gastoTotalReais) * 100);

  // ─── DADOS DO GRAFICO DE PIZZA ────────────────────────────────────────────
  const outrosColor = colors.violet || '#8B5CF6';
  const pieData = [
    { name: 'Água',    population: pctAgua    || 0, color: colors.blue,  legendFontColor: colors.textSub, legendFontSize: 12 },
    { name: 'Energia', population: pctEnergia || 0, color: colors.gold,  legendFontColor: colors.textSub, legendFontSize: 12 },
    { name: 'Outros Consumos',  population: pctOutros  || 0, color: outrosColor,  legendFontColor: colors.textSub, legendFontSize: 12 },
  ];

  const chartConfig = {
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  };

  // ─── ESTILOS ──────────────────────────────────────────────────────────────
  const styles = StyleSheet.create({
    // SEM flex:1 — ScrollView calcula sua propria altura no Android
    scrollContainer: { backgroundColor: colors.bg },
    inner: { paddingHorizontal: 20, paddingTop: 20 },
    card: {
      backgroundColor: colors.card,
      borderWidth: 1, borderColor: colors.border,
      borderRadius: 20, padding: 16, marginBottom: 20,
    },
    title: {
      color: colors.textSub, fontSize: 12,
      textTransform: 'uppercase', marginBottom: 16, fontWeight: 'bold',
      textAlign: 'center', width: '100%'
    },
    loadingContainer: { alignItems: 'center', paddingVertical: 40 },
    loadingText: { color: colors.textMuted, marginTop: 8, fontSize: 12 },
    mockBadge: {
      backgroundColor: colors.gold + '22', borderColor: colors.gold + '44',
      borderWidth: 1, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2,
      alignSelf: 'flex-start', marginBottom: 12,
    },
    mockBadgeText: { color: colors.gold, fontSize: 10, fontWeight: 'bold' },

    // ─── GRAFICO DE BARRAS EMPILHADO ───
    chartContainer: { flexDirection: 'row', alignItems: 'flex-end', height: 130, justifyContent: 'space-between' },
    barCol: { alignItems: 'center', flex: 1 },
    barWrapper: { width: 18, height: 110, justifyContent: 'flex-end', alignItems: 'center' },
    dayLabel: { color: colors.textMuted, fontSize: 9, marginTop: 6 },
    legendRow: { flexDirection: 'row', marginTop: 16, justifyContent: 'center', flexWrap: 'wrap' },
    legendItem: { flexDirection: 'row', alignItems: 'center', marginRight: 12, marginBottom: 4 },
    legendDot: { width: 8, height: 8, borderRadius: 4, marginRight: 4 },
    legendText: { color: colors.textSub, fontSize: 11 },

    // ─── GRAFICO DE PIZZA ───
    pieWrapper: { alignItems: 'center', marginVertical: 8 },
    pieNote: { color: colors.textMuted, fontSize: 11, textAlign: 'center', marginTop: 12, width: '100%' },

    // ─── CARD DE TOTAIS ───
    totaisRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
    totalItem: { alignItems: 'center', flex: 1 },
    totalVal: { fontSize: 18, fontWeight: 'bold', marginBottom: 2 },
    totalLabel: { fontSize: 10, color: colors.textMuted, textTransform: 'uppercase' },

    // ─── MODAL ───
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalContent: {
      backgroundColor: colors.bg,
      borderTopLeftRadius: 24, borderTopRightRadius: 24,
      padding: 24, paddingBottom: 40,
    },
    modalDragIndicator: { width: 40, height: 5, backgroundColor: colors.border, borderRadius: 3, alignSelf: 'center', marginBottom: 16 },
    modalTitle: { fontSize: 20, fontWeight: 'bold', color: colors.text, marginBottom: 12, textAlign: 'center' },
    modalText: { fontSize: 16, color: colors.textSub, lineHeight: 24, marginBottom: 16, textAlign: 'center' },
    modalCloseBtn: { backgroundColor: colors.blue, padding: 16, borderRadius: 16, alignItems: 'center' },
    modalCloseText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  });

  // ─── RENDER ───────────────────────────────────────────────────────────────
  return (
    <>
      <ScrollView
        // SEM flex:1 no style — resolve o scroll no Android
        // FIX WEB: webScrollStyle adiciona overflow:'scroll' para mouse wheel
        style={[styles.scrollContainer, webScrollStyle]}
        contentContainerStyle={{ paddingBottom: 100, ...Platform.select({ web: { minHeight: '100%' }, default: {} }) }}
        showsVerticalScrollIndicator={Platform.OS !== 'web'}
        nestedScrollEnabled={true}
        scrollEventThrottle={16}
        overScrollMode="never"
        bounces={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.inner}>

          {/* ─── CARD 1: GRAFICO DE BARRAS SEMANAL EMPILHADO ─── */}
          <View style={styles.card}>
            <Text style={styles.title}>Consumo semanal</Text>

            {/* Badge indicando se sao dados reais ou mock */}
            {usandoMock && (
              <View style={styles.mockBadge}>
                <Text style={styles.mockBadgeText}>Dados de demonstracao</Text>
              </View>
            )}

            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={colors.blue} />
                <Text style={styles.loadingText}>Carregando dados...</Text>
              </View>
            ) : (
              <>
                <View style={styles.chartContainer}>
                  {dias.map((d, i) => {
                    const aguaPct   = (agua[i]    / maxTotal) * 100;
                    const energPct  = (energia[i] / maxTotal) * 100;
                    const outrosPct = (outros[i]  / maxTotal) * 100;
                    return (
                      <View key={d} style={styles.barCol}>
                        <View style={styles.barWrapper}>
                          {/* Barra empilhada: Agua (topo azul) + Energia (meio dourado) + Outros (base roxa) */}
                          <View style={{ width: '100%', height: `${aguaPct}%`,   backgroundColor: colors.blue,  borderTopLeftRadius: 3, borderTopRightRadius: 3 }} />
                          <View style={{ width: '100%', height: `${energPct}%`,  backgroundColor: colors.gold }} />
                          <View style={{ width: '100%', height: `${outrosPct}%`, backgroundColor: outrosColor, borderBottomLeftRadius: 3, borderBottomRightRadius: 3 }} />
                        </View>
                        <Text style={styles.dayLabel}>{d}</Text>
                      </View>
                    );
                  })}
                </View>

                {/* Legenda com 3 cores */}
                <View style={styles.legendRow}>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: colors.blue }]} />
                    <Text style={styles.legendText}>Água</Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: colors.gold }]} />
                    <Text style={styles.legendText}>Energia</Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: outrosColor }]} />
                    <Text style={styles.legendText}>Outros Consumos</Text>
                  </View>
                </View>
              </>
            )}
          </View>



          {/* ─── CARD 2: GRAFICO DE PIZZA ─── */}
          <View style={styles.card}>
            <Text style={styles.title}>Distribuição do consumo (R$)</Text>
            <TouchableOpacity
              style={styles.pieWrapper}
              activeOpacity={0.8}
              onPress={() => setModalVisible(true)}
            >
              {/* FIX WEB: Na web usa PieChartSVG (react-native-svg), no nativo usa chart-kit */}
              {Platform.OS === 'web' || !PieChartNative ? (
                <PieChartSVG data={pieData} size={180} strokeWidth={36} />
              ) : (
                <PieChartNative
                  data={pieData}
                  width={SCREEN_W - 80}
                  height={180}
                  chartConfig={chartConfig}
                  accessor="population"
                  backgroundColor="transparent"
                  paddingLeft="0"
                  absolute={false}
                />
              )}
              <Text style={styles.pieNote}>
                <Ionicons name="information-circle-outline" size={12} color={colors.textMuted} />
                {' '}Toque para saber mais sobre as categorias
              </Text>
            </TouchableOpacity>
          </View>

          {/* ─── CARD 3: TOTAIS DA SEMANA ─── */}
          <View style={[styles.card, { borderColor: colors.teal + '44', borderWidth: 1 }]}>
            <Text style={styles.title}>Totais da semana</Text>

            <View style={{ flexDirection: 'row', gap: 10, marginBottom: 12 }}>
              <View style={{
                flex: 1, backgroundColor: colors.blue + '15',
                borderRadius: 12, padding: 14, alignItems: 'center', justifyContent: 'center'
              }}>
                <Ionicons name="water" size={20} color={colors.blue} />
                <Text style={{ color: colors.textMuted, fontSize: 11, marginTop: 4, textAlign: 'center' }}>Água</Text>
                <Text style={{ color: colors.blue, fontWeight: 'bold', fontSize: 16, marginTop: 2, textAlign: 'center' }}>
                  {totaisSemana.agua.toFixed(1)} L
                </Text>
              </View>

              <View style={{
                flex: 1, backgroundColor: colors.gold + '15',
                borderRadius: 12, padding: 14, alignItems: 'center', justifyContent: 'center'
              }}>
                <Ionicons name="flash" size={20} color={colors.gold} />
                <Text style={{ color: colors.textMuted, fontSize: 11, marginTop: 4, textAlign: 'center' }}>Energia</Text>
                <Text style={{ color: colors.gold, fontWeight: 'bold', fontSize: 16, marginTop: 2, textAlign: 'center' }}>
                  {totaisSemana.energia.toFixed(2)} kWh
                </Text>
              </View>
            </View>

            <View style={{
              backgroundColor: (outrosColor) + '15',
              borderRadius: 12, padding: 14,
              flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
            }}>
              <Ionicons name="receipt-outline" size={20} color={outrosColor} style={{ marginBottom: 4 }} />
              <View style={{ alignItems: 'center' }}>
                <Text style={{ color: colors.textMuted, fontSize: 11, textAlign: 'center' }}>Outros consumos</Text>
                <Text style={{ color: outrosColor, fontWeight: 'bold', fontSize: 16, marginTop: 2, textAlign: 'center' }}>
                  R$ {totaisSemana.outros.toFixed(2)}
                </Text>
              </View>
            </View>
          </View>

        </View>
      </ScrollView>

      {/* ─── MODAL: INFO SOBRE CATEGORIAS ─── */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalDragIndicator} />
            <Text style={styles.modalTitle}>Sobre as categorias</Text>
            <Text style={styles.modalText}>
              <Text style={{ fontWeight: 'bold' }}>Água</Text> → total de litros usados esta semana.
            </Text>
            <Text style={styles.modalText}>
              <Text style={{ fontWeight: 'bold' }}>Energia</Text> → total de kWh consumidos esta semana.
            </Text>
            <Text style={styles.modalText}>
              <Text style={{ fontWeight: 'bold' }}>Outros Consumos</Text> → total em R$ de outros consumos registrados.
            </Text>
            <Text style={[styles.modalText, { fontSize: 13, fontStyle: 'italic' }]}>
              O grafico de pizza normaliza todos os valores para R$ para comparacao proporcional justa.
            </Text>
            <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalCloseText}>Entendi</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}
