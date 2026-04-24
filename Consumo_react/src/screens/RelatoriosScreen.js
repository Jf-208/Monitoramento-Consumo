// RelatoriosScreen.js
// Tela de relatórios com:
//   1. Gráfico de barras SEMANAL empilhado (Água + Energia + Outros/Vampiro)
//   2. Gráfico de pizza com as 3 categorias (soma = 100%)
//   3. Modal educativo sobre Consumo Vampiro
//
// O gráfico semanal agora mostra 3 cores em cada dia:
//   - Azul (Água), Dourado (Energia), Roxo (Outros/Vampiro)

import React, { useState, useContext } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, Dimensions, StyleSheet } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { ThemeContext } from '../contexts/ThemeContext';

const SCREEN_W = Dimensions.get('window').width;

export default function RelatoriosScreen() {
  const { colors } = useContext(ThemeContext);
  const [modalVisible, setModalVisible] = useState(false);

  // ─── DADOS SEMANAIS (3 categorias por dia) ───
  const dias = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
  const agua =    [60, 75, 55, 80, 65, 40, 45];
  const energia = [35, 42, 30, 50, 38, 25, 20];
  const vampiro = [15, 18, 12, 20, 16, 10, 8]; // Consumo stand-by/vampiro
  // O total de cada dia = agua + energia + vampiro
  const totais = dias.map((_, i) => agua[i] + energia[i] + vampiro[i]);
  const maxTotal = Math.max(...totais);

  // ─── DADOS DO GRÁFICO DE PIZZA (soma = 100%) ───
  const pieData = [
    { name: 'Água',              population: 45, color: colors.blue,            legendFontColor: colors.textSub, legendFontSize: 12 },
    { name: 'Energia',           population: 35, color: colors.gold,            legendFontColor: colors.textSub, legendFontSize: 12 },
    { name: 'Vampiro',  population: 20, color: colors.violet || '#A78BFA', legendFontColor: colors.textSub, legendFontSize: 12 },
  ];

  const chartConfig = {
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  };

  const styles = StyleSheet.create({
    scrollContainer: { flex: 1 },
    inner: { paddingHorizontal: 20, paddingTop: 20 },
    card: {
      backgroundColor: colors.card,
      borderWidth: 1, borderColor: colors.border,
      borderRadius: 20, padding: 16, marginBottom: 20,
    },
    title: { color: colors.textSub, fontSize: 12, textTransform: 'uppercase', marginBottom: 16, fontWeight: 'bold' },

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

  // Cor do vampiro (roxo)
  const vampiroColor = colors.violet || '#A78BFA';

  return (
    <>
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={{ paddingBottom: 16 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.inner}>
          {/* ─── CARD 1: GRÁFICO DE BARRAS SEMANAL EMPILHADO ─── */}
          <View style={styles.card}>
            <Text style={styles.title}>Consumo semanal</Text>
            <View style={styles.chartContainer}>
              {dias.map((d, i) => {
                // Calcula a altura de cada segmento proporcional ao total máximo
                const total = totais[i];
                const aguaPct   = (agua[i] / maxTotal) * 100;
                const energPct  = (energia[i] / maxTotal) * 100;
                const vampPct   = (vampiro[i] / maxTotal) * 100;
                return (
                  <View key={d} style={styles.barCol}>
                    <View style={styles.barWrapper}>
                      {/* Barra empilhada: Água (topo azul) + Energia (meio dourado) + Vampiro (base roxa) */}
                      <View style={{ width: '100%', height: `${aguaPct}%`, backgroundColor: colors.blue, borderTopLeftRadius: 3, borderTopRightRadius: 3 }} />
                      <View style={{ width: '100%', height: `${energPct}%`, backgroundColor: colors.gold }} />
                      <View style={{ width: '100%', height: `${vampPct}%`, backgroundColor: vampiroColor, borderBottomLeftRadius: 3, borderBottomRightRadius: 3 }} />
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
          </View>

          {/* ─── CARD 2: GRÁFICO DE PIZZA ─── */}
          <View style={styles.card}>
            <Text style={styles.title}>Distribuição do consumo</Text>
            <TouchableOpacity
              style={styles.pieWrapper}
              activeOpacity={0.8}
              onPress={() => setModalVisible(true)}
            >
              <PieChart
                data={pieData}
                width={SCREEN_W - 80}
                height={180}
                chartConfig={chartConfig}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="0"
                absolute={false}
              />
              <Text style={styles.pieNote}>Toque para saber sobre o Consumo Vampiro</Text>
            </TouchableOpacity>
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
            <Text style={styles.modalTitle}>🧛 O que é Consumo Vampiro?</Text>
            <Text style={styles.modalText}>
              Energia consumida por aparelhos em stand-by, como TVs, micro-ondas e
              carregadores na tomada, que continuam gastando energia mesmo desligados.
              Podem representar até 12% da sua conta de luz!
            </Text>
            <View style={styles.modalTipBox}>
              <Text style={styles.modalTipText}>💡 Dicas de Economia:</Text>
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
