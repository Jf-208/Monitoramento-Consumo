// RegisterConsumption/index.js
// Tela de registro de consumo com 3 sub-abas internas: Agua | Energia | Outros.
// Cada sub-aba tem formulario especifico com calculos automaticos.
// Apos registrar, chama buscarResumoSemanal() + buscarHistoricoTotal() para reatividade.
// Usa InlineMessage para feedback (nunca Alert.alert).

import React, { useState, useContext, useMemo } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  Platform, StyleSheet,
} from 'react-native';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ThemeContext } from '../../contexts/ThemeContext';
import { ConsumptionContext } from '../../contexts/ConsumptionContext';
import InlineMessage from '../../components/basic/InlineMessage';

// ─── CONSTANTES DE CALCULO ──────────────────────────────────────────────────

// Fatores de consumo de agua (litros/min)
const TIPOS_AGUA = [
  { id: 'banho', label: 'Banho',  fator: 7,  icon: 'water' },
  { id: 'pia',   label: 'Pia',    fator: 6,  icon: 'water-outline' },
  { id: 'louca', label: 'Louça',  fator: 10, icon: 'restaurant-outline' },
  { id: 'outro', label: 'Outro',  fator: 5,  icon: 'ellipsis-horizontal' },
];

// Aparelhos eletricos com potencia em Watts
const APARELHOS = [
  { id: 'chuveiro', label: 'Chuveiro',          watts: 5500, icon: 'water' },
  { id: 'ar',       label: 'Ar-condicionado',   watts: 1500, icon: 'snow-outline' },
  { id: 'geladeira',label: 'Geladeira',         watts: 150,  icon: 'cube-outline' },
  { id: 'tv',       label: 'TV',                watts: 120,  icon: 'tv-outline' },
  { id: 'pc',       label: 'PC',                watts: 300,  icon: 'desktop-outline' },
  { id: 'custom',   label: 'Outro',             watts: 0,    icon: 'ellipsis-horizontal' },
];

// Tarifas de referencia
const TARIFA_AGUA_LITRO = 0.0065;  // R$ 6,50/m3
const TARIFA_ENERGIA_KWH = 0.87;   // R$/kWh


// ─── COMPONENTE: DateField (DatePicker reutilizavel) ────────────────────────
function DateField({ date, onChange, colors }) {
  const [show, setShow] = useState(false);

  const handleChange = (event, selectedDate) => {
    setShow(Platform.OS === 'ios'); // iOS mantem aberto
    if (selectedDate) onChange(selectedDate);
  };

  return (
    <View>
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 12,
          paddingHorizontal: 14,
          paddingVertical: 12,
          marginBottom: 12,
        }}
        onPress={() => setShow(true)}
      >
        <Ionicons name="calendar-outline" size={18} color={colors.textMuted} style={{ marginRight: 8 }} />
        <Text style={{ color: colors.text, fontSize: 14 }}>
          {date.toLocaleDateString('pt-BR')}
        </Text>
      </TouchableOpacity>

      {show && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          maximumDate={new Date()}
          onChange={handleChange}
        />
      )}
    </View>
  );
}


// ─── TELA PRINCIPAL ─────────────────────────────────────────────────────────
export default function RegisterScreen() {
  const { colors } = useContext(ThemeContext);
  const {
    salvarConsumoBackend,
    buscarResumoSemanal,
    buscarHistoricoTotal,
    registros,
  } = useContext(ConsumptionContext);

  // Sub-aba ativa
  const [abaAtiva, setAbaAtiva] = useState('agua');

  // Feedback inline
  const [feedback, setFeedback] = useState({ tipo: '', mensagem: '' });

  // Estado do loading ao registrar
  const [salvando, setSalvando] = useState(false);

  // ─── ESTADO: ABA AGUA ──────────────────────────────────────────────────
  const [tipoAgua, setTipoAgua] = useState('banho');
  const [tempoAgua, setTempoAgua] = useState('');
  const [dataAgua, setDataAgua] = useState(new Date());

  // ─── ESTADO: ABA ENERGIA ───────────────────────────────────────────────
  const [aparelhoId, setAparelhoId] = useState('chuveiro');
  const [wattsCustom, setWattsCustom] = useState('');
  const [tempoEnergia, setTempoEnergia] = useState('');
  const [dataEnergia, setDataEnergia] = useState(new Date());

  // ─── ESTADO: ABA OUTROS ───────────────────────────────────────────────
  const [nomeOutros, setNomeOutros] = useState('');
  const [unidadeOutros, setUnidadeOutros] = useState('');
  const [valorOutros, setValorOutros] = useState('');
  const [dataOutros, setDataOutros] = useState(new Date());

  // ─── CALCULOS ─────────────────────────────────────────────────────────
  const fatorAgua = TIPOS_AGUA.find(t => t.id === tipoAgua)?.fator || 5;
  const litros = parseFloat(tempoAgua || '0') * fatorAgua;
  const custoAgua = litros * TARIFA_AGUA_LITRO;

  const aparelhoSelecionado = APARELHOS.find(a => a.id === aparelhoId);
  const potenciaW = aparelhoId === 'custom'
    ? parseFloat(wattsCustom || '0')
    : (aparelhoSelecionado?.watts || 0);
  const kWh = (potenciaW * parseFloat(tempoEnergia || '0')) / 60 / 1000;
  const custoEnergia = kWh * TARIFA_ENERGIA_KWH;

  // ─── FUNCAO: Limpar feedback apos 4s ──────────────────────────────────
  const mostrarFeedback = (tipo, mensagem) => {
    setFeedback({ tipo, mensagem });
    setTimeout(() => setFeedback({ tipo: '', mensagem: '' }), 4000);
  };

  // ─── FUNCAO: Formatar data para ISO 8601 ──────────────────────────────
  const formatarDataISO = (date) => {
    return date.toISOString();
  };

  // ─── REGISTRAR AGUA ───────────────────────────────────────────────────
  const registrarAgua = async () => {
    if (!tempoAgua || parseFloat(tempoAgua) <= 0) {
      mostrarFeedback('aviso', 'Informe o tempo de uso em minutos.');
      return;
    }
    setSalvando(true);
    const resultado = await salvarConsumoBackend('agua', litros, 'L', false, {
      data_personalizada: formatarDataISO(dataAgua),
    });
    if (resultado.success) {
      mostrarFeedback('sucesso', `Registrado: ${litros.toFixed(1)} L de agua`);
      setTempoAgua('');
      setDataAgua(new Date());
      await buscarResumoSemanal();
      await buscarHistoricoTotal();
    } else {
      mostrarFeedback('erro', resultado.message);
    }
    setSalvando(false);
  };

  // ─── REGISTRAR ENERGIA ────────────────────────────────────────────────
  const registrarEnergia = async () => {
    if (!tempoEnergia || parseFloat(tempoEnergia) <= 0) {
      mostrarFeedback('aviso', 'Informe o tempo de uso em minutos.');
      return;
    }
    if (aparelhoId === 'custom' && (!wattsCustom || parseFloat(wattsCustom) <= 0)) {
      mostrarFeedback('aviso', 'Informe a potencia em Watts.');
      return;
    }
    setSalvando(true);
    const resultado = await salvarConsumoBackend('energia', kWh, 'kWh', false, {
      data_personalizada: formatarDataISO(dataEnergia),
    });
    if (resultado.success) {
      mostrarFeedback('sucesso', `Registrado: ${kWh.toFixed(4)} kWh`);
      setTempoEnergia('');
      setWattsCustom('');
      setDataEnergia(new Date());
      await buscarResumoSemanal();
      await buscarHistoricoTotal();
    } else {
      mostrarFeedback('erro', resultado.message);
    }
    setSalvando(false);
  };

  // ─── REGISTRAR OUTROS ─────────────────────────────────────────────────
  const registrarOutros = async () => {
    if (!nomeOutros.trim()) {
      mostrarFeedback('aviso', 'Informe o nome do consumo.');
      return;
    }
    if (!valorOutros || parseFloat(valorOutros) <= 0) {
      mostrarFeedback('aviso', 'Informe o valor em R$.');
      return;
    }
    setSalvando(true);
    const resultado = await salvarConsumoBackend('outros', 0, unidadeOutros.trim() || '', false, {
      nome_custom: nomeOutros.trim(),
      valor_monetario: parseFloat(valorOutros),
      data_personalizada: formatarDataISO(dataOutros),
    });
    if (resultado.success) {
      mostrarFeedback('sucesso', `Registrado: ${nomeOutros} - R$ ${parseFloat(valorOutros).toFixed(2)}`);
      setNomeOutros('');
      setUnidadeOutros('');
      setValorOutros('');
      setDataOutros(new Date());
      await buscarResumoSemanal();
      await buscarHistoricoTotal();
    } else {
      mostrarFeedback('erro', resultado.message);
    }
    setSalvando(false);
  };

  // ─── ESTILOS ──────────────────────────────────────────────────────────
  const styles = useMemo(() => StyleSheet.create({
    scrollContainer: { backgroundColor: colors.bg },
    inner: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 100 },

    // Sub-abas no topo
    tabsRow: {
      flexDirection: 'row',
      backgroundColor: colors.surface,
      borderRadius: 14,
      padding: 4,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: colors.border,
    },
    tab: {
      flex: 1,
      paddingVertical: 10,
      borderRadius: 10,
      alignItems: 'center',
    },
    tabActive: {
      backgroundColor: colors.blue,
    },
    tabText: {
      fontSize: 13,
      fontWeight: '600',
      color: colors.textMuted,
    },
    tabTextActive: {
      color: '#fff',
    },

    // Card de formulario
    card: {
      backgroundColor: colors.card,
      borderRadius: 20,
      padding: 20,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 16,
    },
    label: {
      color: colors.textSub,
      fontSize: 12,
      textTransform: 'uppercase',
      fontWeight: 'bold',
      marginBottom: 10,
      letterSpacing: 0.5,
    },

    // Chips seletores
    chipsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: 14,
    },
    chip: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 20,
      borderWidth: 1,
      marginRight: 8,
      marginBottom: 8,
    },
    chipText: {
      fontSize: 12,
      marginLeft: 4,
      fontWeight: '500',
    },

    // Inputs
    input: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      paddingHorizontal: 14,
      paddingVertical: 12,
      color: colors.text,
      fontSize: 15,
      marginBottom: 12,
    },

    // Resultado do calculo
    resultBox: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 14,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.border,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    resultText: {
      fontSize: 14,
      fontWeight: '600',
    },

    // Botao registrar
    registerBtn: {
      backgroundColor: colors.blue,
      borderRadius: 14,
      paddingVertical: 14,
      alignItems: 'center',
      marginBottom: 8,
    },
    registerBtnDisabled: {
      opacity: 0.6,
    },
    registerBtnText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },

    // Historico
    sectionTitle: {
      color: colors.textMuted,
      fontSize: 11,
      textTransform: 'uppercase',
      letterSpacing: 1.2,
      marginBottom: 10,
      marginTop: 8,
    },
    historicoItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 14,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 8,
    },
    historicoTipo: {
      fontSize: 13,
      fontWeight: '600',
      color: colors.text,
      textTransform: 'capitalize',
    },
    historicoValor: {
      fontSize: 13,
      color: colors.textSub,
      fontWeight: '500',
    },
    historicoData: {
      fontSize: 11,
      color: colors.textMuted,
    },
  }), [colors]);

  // ─── RENDER: SUB-ABA AGUA ────────────────────────────────────────────
  const renderAgua = () => (
    <MotiView
      from={{ opacity: 0, translateY: 8 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 300 }}
    >
      <View style={styles.card}>
        <Text style={styles.label}>Tipo de uso</Text>
        <View style={styles.chipsRow}>
          {TIPOS_AGUA.map(tipo => {
            const ativo = tipoAgua === tipo.id;
            return (
              <TouchableOpacity
                key={tipo.id}
                style={[
                  styles.chip,
                  {
                    backgroundColor: ativo ? colors.blue + '22' : 'transparent',
                    borderColor: ativo ? colors.blue : colors.border,
                  },
                ]}
                onPress={() => setTipoAgua(tipo.id)}
              >
                <Ionicons name={tipo.icon} size={14} color={ativo ? colors.blue : colors.textMuted} />
                <Text style={[styles.chipText, { color: ativo ? colors.blue : colors.textSub }]}>
                  {tipo.label} ({tipo.fator} L/min)
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.label}>Tempo de uso (min)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="Ex: 10"
          placeholderTextColor={colors.textMuted}
          value={tempoAgua}
          onChangeText={setTempoAgua}
        />

        {tempoAgua ? (
          <View style={styles.resultBox}>
            <Text style={[styles.resultText, { color: colors.blue }]}>
              ≈ {litros.toFixed(1)} litros
            </Text>
            <Text style={[styles.resultText, { color: colors.textSub }]}>
              Custo: R$ {custoAgua.toFixed(2)}
            </Text>
          </View>
        ) : null}

        <Text style={styles.label}>Data</Text>
        <DateField date={dataAgua} onChange={setDataAgua} colors={colors} />

        <TouchableOpacity
          style={[styles.registerBtn, salvando && styles.registerBtnDisabled]}
          onPress={registrarAgua}
          disabled={salvando}
        >
          <Text style={styles.registerBtnText}>
            {salvando ? 'Registrando...' : 'Registrar'}
          </Text>
        </TouchableOpacity>
      </View>
    </MotiView>
  );

  // ─── RENDER: SUB-ABA ENERGIA ─────────────────────────────────────────
  const renderEnergia = () => (
    <MotiView
      from={{ opacity: 0, translateY: 8 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 300 }}
    >
      <View style={styles.card}>
        <Text style={styles.label}>Aparelho</Text>
        <View style={styles.chipsRow}>
          {APARELHOS.map(ap => {
            const ativo = aparelhoId === ap.id;
            return (
              <TouchableOpacity
                key={ap.id}
                style={[
                  styles.chip,
                  {
                    backgroundColor: ativo ? colors.gold + '22' : 'transparent',
                    borderColor: ativo ? colors.gold : colors.border,
                  },
                ]}
                onPress={() => setAparelhoId(ap.id)}
              >
                <Ionicons name={ap.icon} size={14} color={ativo ? colors.gold : colors.textMuted} />
                <Text style={[styles.chipText, { color: ativo ? colors.gold : colors.textSub }]}>
                  {ap.label} {ap.watts > 0 ? `(${ap.watts}W)` : ''}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {aparelhoId === 'custom' && (
          <>
            <Text style={styles.label}>Potencia (Watts)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="Ex: 200"
              placeholderTextColor={colors.textMuted}
              value={wattsCustom}
              onChangeText={setWattsCustom}
            />
          </>
        )}

        <Text style={styles.label}>Tempo de uso (min)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="Ex: 30"
          placeholderTextColor={colors.textMuted}
          value={tempoEnergia}
          onChangeText={setTempoEnergia}
        />

        {tempoEnergia ? (
          <View style={styles.resultBox}>
            <Text style={[styles.resultText, { color: colors.gold }]}>
              ≈ {kWh.toFixed(4)} kWh
            </Text>
            <Text style={[styles.resultText, { color: colors.textSub }]}>
              Custo: R$ {custoEnergia.toFixed(2)}
            </Text>
          </View>
        ) : null}

        <Text style={styles.label}>Data</Text>
        <DateField date={dataEnergia} onChange={setDataEnergia} colors={colors} />

        <TouchableOpacity
          style={[styles.registerBtn, { backgroundColor: colors.gold }, salvando && styles.registerBtnDisabled]}
          onPress={registrarEnergia}
          disabled={salvando}
        >
          <Text style={styles.registerBtnText}>
            {salvando ? 'Registrando...' : 'Registrar'}
          </Text>
        </TouchableOpacity>
      </View>
    </MotiView>
  );

  // ─── RENDER: SUB-ABA OUTROS ──────────────────────────────────────────
  const renderOutros = () => (
    <MotiView
      from={{ opacity: 0, translateY: 8 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 300 }}
    >
      <View style={styles.card}>
        <Text style={styles.label}>Nome do consumo</Text>
        <TextInput
          style={styles.input}
          placeholder='Ex: "Compras", "Gasolina"'
          placeholderTextColor={colors.textMuted}
          value={nomeOutros}
          onChangeText={setNomeOutros}
        />

        <Text style={styles.label}>Unidade (opcional)</Text>
        <TextInput
          style={styles.input}
          placeholder='Ex: "kg", "km" (pode ficar vazio)'
          placeholderTextColor={colors.textMuted}
          value={unidadeOutros}
          onChangeText={setUnidadeOutros}
        />

        <Text style={styles.label}>Valor (R$)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="Ex: 50.00"
          placeholderTextColor={colors.textMuted}
          value={valorOutros}
          onChangeText={setValorOutros}
        />

        <Text style={styles.label}>Data</Text>
        <DateField date={dataOutros} onChange={setDataOutros} colors={colors} />

        <TouchableOpacity
          style={[styles.registerBtn, { backgroundColor: colors.violet || '#8B5CF6' }, salvando && styles.registerBtnDisabled]}
          onPress={registrarOutros}
          disabled={salvando}
        >
          <Text style={styles.registerBtnText}>
            {salvando ? 'Registrando...' : 'Registrar'}
          </Text>
        </TouchableOpacity>
      </View>
    </MotiView>
  );

  // ─── RENDER: HISTORICO ────────────────────────────────────────────────
  const renderHistorico = () => (
    <View>
      <Text style={styles.sectionTitle}>Ultimos registros</Text>
      {registros.length === 0 ? (
        <Text style={{ color: colors.textMuted, fontSize: 13, textAlign: 'center', paddingVertical: 20 }}>
          Nenhum registro encontrado.
        </Text>
      ) : (
        registros.map(r => {
          // Determinar cor do icone por tipo
          const tipoConfig = {
            agua:    { icon: 'water',           color: colors.blue },
            energia: { icon: 'flash',           color: colors.gold },
            outros:  { icon: 'receipt-outline',  color: colors.violet || '#8B5CF6' },
          };
          const cfg = tipoConfig[r.tipo_consumo] || tipoConfig.outros;

          return (
            <View key={r.id} style={styles.historicoItem}>
              <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                <View style={{
                  width: 32, height: 32, borderRadius: 16,
                  backgroundColor: cfg.color + '22',
                  alignItems: 'center', justifyContent: 'center',
                  marginRight: 10,
                }}>
                  <Ionicons name={cfg.icon} size={16} color={cfg.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.historicoTipo}>
                    {r.tipo_consumo === 'outros' ? (r.nome_custom || 'Outros') : r.tipo_consumo}
                  </Text>
                  <Text style={styles.historicoData}>
                    {r.data_registro ? new Date(r.data_registro).toLocaleDateString('pt-BR') : '—'}
                  </Text>
                </View>
              </View>
              <Text style={[styles.historicoValor, { color: cfg.color }]}>
                {r.tipo_consumo === 'outros'
                  ? `R$ ${(r.valor_monetario || 0).toFixed(2)}`
                  : `${r.valor} ${r.unidade_medida}`}
              </Text>
            </View>
          );
        })
      )}
    </View>
  );

  // ─── ABAS ─────────────────────────────────────────────────────────────
  const abas = [
    { id: 'agua',    label: 'Água',    icon: 'water' },
    { id: 'energia', label: 'Energia', icon: 'flash' },
    { id: 'outros',  label: 'Outros',  icon: 'receipt-outline' },
  ];

  // FIX WEB: overflow:'auto' habilita scroll com mouse wheel
  const webScrollStyle = Platform.select({
    web: { overflow: 'auto', height: '100%' },
    default: {},
  });

  return (
    <ScrollView
      style={[styles.scrollContainer, webScrollStyle]}
      contentContainerStyle={styles.inner}
      showsVerticalScrollIndicator={Platform.OS !== 'web'}
      nestedScrollEnabled={true}
      scrollEventThrottle={16}
      overScrollMode="never"
      bounces={false}
      keyboardShouldPersistTaps="handled"
    >
      {/* Sub-abas no topo */}
      <View style={styles.tabsRow}>
        {abas.map(aba => (
          <TouchableOpacity
            key={aba.id}
            style={[
              styles.tab,
              abaAtiva === aba.id && styles.tabActive,
            ]}
            onPress={() => {
              setAbaAtiva(aba.id);
              setFeedback({ tipo: '', mensagem: '' });
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons
                name={aba.icon}
                size={14}
                color={abaAtiva === aba.id ? '#fff' : colors.textMuted}
                style={{ marginRight: 4 }}
              />
              <Text style={[
                styles.tabText,
                abaAtiva === aba.id && styles.tabTextActive,
              ]}>
                {aba.label}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Feedback inline */}
      <InlineMessage tipo={feedback.tipo} mensagem={feedback.mensagem} />

      {/* Formulario da sub-aba ativa */}
      {abaAtiva === 'agua' && renderAgua()}
      {abaAtiva === 'energia' && renderEnergia()}
      {abaAtiva === 'outros' && renderOutros()}

      {/* Lista de historico abaixo do formulario */}
      {renderHistorico()}
    </ScrollView>
  );
}
