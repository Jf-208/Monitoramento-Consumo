// Reports/index.js
// Tela de relatórios com:
//   1. Gráfico de barras SEMANAL empilhado (Água + Energia + Vampiro) — dados REAIS do backend
//   2. Gráfico de pizza com as 3 categorias (soma = 100%)
//   3. Card de "Totais da semana" com valores reais
//   4. Modal educativo sobre Consumo Vampiro
//
// Os dados são buscados do backend em /consumo/semanal/{id_usuario}.
// Se a requisição falhar, mantém os dados mock como fallback.
//
// FIX WEB:
// - ScrollView recebe overflow:'scroll' via Platform.select para habilitar mouse wheel
// - PieChart do react-native-chart-kit NÃO funciona na web (usa ART que não existe)
// - Na web, renderizamos um gráfico de pizza manual usando react-native-svg (Conic gradient via arcos)

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

// ─── DADOS INICIAIS ZERADOS (sem mock) ───────────────────────────────────────
const MOCK_AGUA    = [0, 0, 0, 0, 0, 0, 0];
const MOCK_ENERGIA = [0, 0, 0, 0, 0, 0, 0];
const MOCK_VAMPIRO = [0, 0, 0, 0, 0, 0, 0];

// ─── FIX WEB: estilo do ScrollView para habilitar scroll com mouse na web ────
const webScrollStyle = Platform.select({
  web: { overflow: 'scroll', height: '100%', WebkitOverflowScrolling: 'touch' },
  default: {},
});

// ─── COMPONENTE: Gráfico de Pizza compatível com Web e Nativo ────────────────
// Na web, react-native-chart-kit PieChart falha porque depende de ART.
// Este componente usa react-native-svg para desenhar arcos (funciona em ambos).
//
// Técnica: usar <Circle> com strokeDasharray para simular arcos de pizza.
// Cada "fatia" é um círculo com traço = proporção da circunferência total.
// strokeDashoffset rotaciona o início de cada fatia para encaixar após a anterior.
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

      {/* Legenda abaixo do gráfico */}
      <View style={{ flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', marginTop: 12 }}>
        {data.map((item, index) => (
          <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginRight: 16, marginBottom: 4 }}>
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

// ─── COMPONENTE NATIVO: usa PieChart do chart-kit (só no Android/iOS) ─────────
// Importação condicional: só carrega chart-kit no nativo para evitar crash na web
let PieChartNative = null;
if (Platform.OS !== 'web') {
  try {
    PieChartNative = require('react-native-chart-kit').PieChart;
  } catch (e) {
    // Fallback: se chart-kit não estiver disponível, usaremos o SVG
    PieChartNative = null;
  }
}

export default function RelatoriosScreen() {
  const { colors } = useContext(ThemeContext);
  const { user }   = useContext(AuthContext);
  const [modalVisible, setModalVisible] = useState(false);

  // ─── ESTADOS DOS DADOS SEMANAIS ───────────────────────────────────────────
  // Arrays de 7 posições (Seg a Dom) para cada categoria
  const [dadosSemanais, setDadosSemanais] = useState({
    dias:    ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"],
    agua:    [0, 0, 0, 0, 0, 0, 0],
    energia: [0, 0, 0, 0, 0, 0, 0],
    vampiro: [0, 0, 0, 0, 0, 0, 0],
  });

  // Totais da semana para o card de resumo
  const [totaisSemana, setTotaisSemana] = useState({
    agua: 0, energia: 0, vampiro: 0,
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
          vampiro: [0, 0, 0, 0, 0, 0, 0],
        });
        setTotaisSemana({ agua: 0, energia: 0, vampiro: 0 });
        setUsandoMock(false);
        setIsLoading(false);
        return;
      }

      try {
        const response = await api.get(`/consumo/semanal/${user.id}`);
        const dados = response.data;

        // Verifica se há dados reais (pelo menos um valor não-zero)
        const temDados =
          dados.agua.some(v => v > 0) ||
          dados.energia.some(v => v > 0) ||
          dados.vampiro.some(v => v > 0);

        if (temDados) {
          setDadosSemanais({
            dias:    dados.dias,
            agua:    dados.agua,
            energia: dados.energia,
            vampiro: dados.vampiro,
          });
          setTotaisSemana({
            agua:    dados.agua.reduce((a, b) => a + b, 0),
            energia: dados.energia.reduce((a, b) => a + b, 0),
            vampiro: dados.vampiro.reduce((a, b) => a + b, 0),
          });
          setUsandoMock(false);
        } else {
          setDadosSemanais({
            dias:    dados.dias,
            agua:    [0, 0, 0, 0, 0, 0, 0],
            energia: [0, 0, 0, 0, 0, 0, 0],
            vampiro: [0, 0, 0, 0, 0, 0, 0],
          });
          setTotaisSemana({ agua: 0, energia: 0, vampiro: 0 });
          setUsandoMock(false);
        }
      } catch (error) {
        // Fallback: mantém zeros se o backend não responder
        console.log('Erro ao buscar dados semanais:', error);
        setDadosSemanais({
          dias: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'],
          agua:    [0, 0, 0, 0, 0, 0, 0],
          energia: [0, 0, 0, 0, 0, 0, 0],
          vampiro: [0, 0, 0, 0, 0, 0, 0],
        });
        setTotaisSemana({ agua: 0, energia: 0, vampiro: 0 });
        setUsandoMock(false);
      } finally {
        setIsLoading(false);
      }
    };

    buscarDadosSemanais();
  }, [user]);

  // ─── CÁLCULOS DERIVADOS ───────────────────────────────────────────────────
  const { dias, agua, energia, vampiro } = dadosSemanais;
  const totais    = dias.map((_, i) => agua[i] + energia[i] + vampiro[i]);
  const maxTotal  = Math.max(...totais, 1); // evita divisão por zero

  // Somas para o gráfico de pizza
  const somaAgua    = totaisSemana.agua    || agua.reduce((a, b) => a + b, 0);
  const somaEnergia = totaisSemana.energia || energia.reduce((a, b) => a + b, 0);
  const somaVampiro = totaisSemana.vampiro || vampiro.reduce((a, b) => a + b, 0);
  const somaTotal   = somaAgua + somaEnergia + somaVampiro || 1;

  // Percentuais para o gráfico de pizza
  const pctAgua    = Math.round((somaAgua    / somaTotal) * 100);
  const pctEnergia = Math.round((somaEnergia / somaTotal) * 100);
  const pctVampiro = Math.round((somaVampiro / somaTotal) * 100);

  // ─── DADOS DO GRÁFICO DE PIZZA ────────────────────────────────────────────
  const vampiroColor = colors.violet || '#A78BFA';
  const pieData = [
    { name: 'Água',    population: pctAgua    || 45, color: colors.blue,  legendFontColor: colors.textSub, legendFontSize: 12 },
    { name: 'Energia', population: pctEnergia || 35, color: colors.gold,  legendFontColor: colors.textSub, legendFontSize: 12 },
    { name: 'Vampiro', population: pctVampiro || 20, color: vampiroColor, legendFontColor: colors.textSub, legendFontSize: 12 },
  ];

  const chartConfig = {
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  };

  // ─── ESTILOS ──────────────────────────────────────────────────────────────
  const styles = StyleSheet.create({
    // SEM flex:1 — ScrollView calcula sua própria altura no Android
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
    },
    loadingContainer: { alignItems: 'center', paddingVertical: 40 },
    loadingText: { color: colors.textMuted, marginTop: 8, fontSize: 12 },
    mockBadge: {
      backgroundColor: colors.gold + '22', borderColor: colors.gold + '44',
      borderWidth: 1, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2,
      alignSelf: 'flex-start', marginBottom: 12,
    },
    mockBadgeText: { color: colors.gold, fontSize: 10, fontWeight: 'bold' },

    // ─── GRÁFICO DE BARRAS EMPILHADO ───
    chartContainer: { flexDirection: 'row', alignItems: 'flex-end', height: 130, justifyContent: 'space-between' },
    barCol: { alignItems: 'center', flex: 1 },
    barWrapper: { width: 18, height: 110, justifyContent: 'flex-end', alignItems: 'center' },
    dayLabel: { color: colors.textMuted, fontSize: 9, marginTop: 6 },
    legendRow: { flexDirection: 'row', marginTop: 16, justifyContent: 'center', flexWrap: 'wrap' },
    legendItem: { flexDirection: 'row', alignItems: 'center', marginRight: 12, marginBottom: 4 },
    legendDot: { width: 8, height: 8, borderRadius: 4, marginRight: 4 },
    legendText: { color: colors.textSub, fontSize: 11 },

    // ─── GRÁFICO DE PIZZA ───
    pieWrapper: { alignItems: 'center', marginVertical: 8 },
    pieNote: { color: colors.textMuted, fontSize: 11, textAlign: 'center', marginTop: 6 },

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
    modalTitle: { fontSize: 20, fontWeight: 'bold', color: colors.text, marginBottom: 12 },
    modalText: { fontSize: 16, color: colors.textSub, lineHeight: 24, marginBottom: 16 },
    modalTipBox: { backgroundColor: colors.surface, borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: colors.border },
    modalTipText: { fontSize: 14, color: colors.text, marginBottom: 8, fontWeight: '500' },
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

          {/* ─── CARD 1: GRÁFICO DE BARRAS SEMANAL EMPILHADO ─── */}
          <View style={styles.card}>
            <Text style={styles.title}>Consumo semanal</Text>

            {/* Badge indicando se são dados reais ou mock */}
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
                    const aguaPct  = (agua[i]    / maxTotal) * 100;
                    const energPct = (energia[i] / maxTotal) * 100;
                    const vampPct  = (vampiro[i] / maxTotal) * 100;
                    return (
                      <View key={d} style={styles.barCol}>
                        <View style={styles.barWrapper}>
                          {/* Barra empilhada: Água (topo azul) + Energia (meio dourado) + Vampiro (base roxa) */}
                          <View style={{ width: '100%', height: `${aguaPct}%`,  backgroundColor: colors.blue,  borderTopLeftRadius: 3, borderTopRightRadius: 3 }} />
                          <View style={{ width: '100%', height: `${energPct}%`, backgroundColor: colors.gold }} />
                          <View style={{ width: '100%', height: `${vampPct}%`,  backgroundColor: vampiroColor, borderBottomLeftRadius: 3, borderBottomRightRadius: 3 }} />
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
                    <View style={[styles.legendDot, { backgroundColor: vampiroColor }]} />
                    <Text style={styles.legendText}>Vampiro</Text>
                  </View>
                </View>
              </>
            )}
          </View>



          {/* ─── CARD 3: GRÁFICO DE PIZZA ─── */}
          <View style={styles.card}>
            <Text style={styles.title}>Distribuição do consumo</Text>
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
              <Text style={styles.pieNote}>Toque para saber sobre o Consumo Vampiro</Text>
            </TouchableOpacity>
          </View>

          {/* ─── CARD: ECONOMIA ESTIMADA DA SEMANA ─── */}
          <View style={[styles.card, { borderColor: colors.teal + '44', borderWidth: 1 }]}>
            <Text style={styles.title}>Economia estimada esta semana</Text>

            <View style={{ flexDirection: 'row', gap: 10, marginBottom: 12 }}>
              <View style={{
                flex: 1, backgroundColor: colors.blue + '15',
                borderRadius: 12, padding: 14, alignItems: 'center',
              }}>
                <Ionicons name="water" size={20} color={colors.blue} />
                <Text style={{ color: colors.textMuted, fontSize: 11, marginTop: 4 }}>Agua</Text>
                <Text style={{ color: colors.blue, fontWeight: 'bold', fontSize: 16, marginTop: 2 }}>
                  R$ {(Math.max(0, (700 - somaAgua) * 0.0065)).toFixed(2)}
                </Text>
              </View>

              <View style={{
                flex: 1, backgroundColor: colors.gold + '15',
                borderRadius: 12, padding: 14, alignItems: 'center',
              }}>
                <Ionicons name="flash" size={20} color={colors.gold} />
                <Text style={{ color: colors.textMuted, fontSize: 11, marginTop: 4 }}>Energia</Text>
                <Text style={{ color: colors.gold, fontWeight: 'bold', fontSize: 16, marginTop: 2 }}>
                  R$ {(Math.max(0, (15 - somaEnergia) * 0.85)).toFixed(2)}
                </Text>
              </View>
            </View>

            <View style={{
              backgroundColor: (colors.violet || '#A78BFA') + '15',
              borderRadius: 12, padding: 12,
              flexDirection: 'row', alignItems: 'center',
              marginBottom: 12,
            }}>
              <Ionicons name="moon" size={18} color={colors.violet || '#A78BFA'} style={{ marginRight: 10 }} />
              <View>
                <Text style={{ color: colors.textMuted, fontSize: 11 }}>Consumo Stand-by (Vampiro)</Text>
                <Text style={{ color: colors.violet || '#A78BFA', fontWeight: 'bold', fontSize: 15, marginTop: 2 }}>
                  {somaVampiro.toFixed(2)} kWh consumidos
                </Text>
              </View>
            </View>

            <View style={{
              backgroundColor: colors.teal + '15',
              borderRadius: 12, padding: 14, alignItems: 'center',
            }}>
              <Text style={{ color: colors.textMuted, fontSize: 11 }}>Total economizado</Text>
              <Text style={{ color: colors.teal, fontWeight: 'bold', fontSize: 26, marginTop: 4 }}>
                R$ {(
                  Math.max(0, (700 - somaAgua) * 0.0065) +
                  Math.max(0, (15 - somaEnergia) * 0.85)
                ).toFixed(2)}
              </Text>
              <Text style={{ color: colors.textMuted, fontSize: 10, marginTop: 4 }}>
                vs. media brasileira de consumo semanal
              </Text>
            </View>
          </View>

        </View>
      </ScrollView>

      {/* ─── MODAL: CONSUMO VAMPIRO ─── */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalDragIndicator} />
            <Text style={styles.modalTitle}>O que e Consumo Vampiro?</Text>
            <Text style={styles.modalText}>
              Energia consumida por aparelhos em stand-by, como TVs, micro-ondas e
              carregadores na tomada, que continuam gastando energia mesmo desligados.
              Podem representar até 12% da sua conta de luz!
            </Text>
            <View style={styles.modalTipBox}>
              <Text style={styles.modalTipText}>Dicas de Economia:</Text>
              <Text style={{ color: colors.textSub, marginBottom: 4 }}>• Tire carregadores da tomada após o uso.</Text>
              <Text style={{ color: colors.textSub }}>• Desligue aparelhos no botão principal ou tire da tomada.</Text>
            </View>
            <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalCloseText}>Entendi</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}
