// Metas/index.js
// Tela de gerenciamento de metas de consumo.
// Permite criar, editar e deletar metas de água, energia e outros.
// Exibe progresso calculado localmente com os registros do ConsumptionContext.
//
// COMPONENTES REUTILIZADOS (sem criar novos):
//   ScreenScrollView, StatBar, Chip, InlineMessage, Ionicons
import React, { useContext, useState, useEffect, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, Modal, TextInput,
  ScrollView, ActivityIndicator, StyleSheet, Platform,
} from 'react-native';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '../../contexts/ThemeContext';
import { MetasContext } from '../../contexts/MetasContext';
import { ConsumptionContext } from '../../contexts/ConsumptionContext';
import ScreenScrollView from '../../components/layout/ScreenScrollView';
import StatBar from '../../components/intermediate/StatBar';
import InlineMessage from '../../components/basic/InlineMessage';

// ─── CONSTANTES ──────────────────────────────────────────────────────────────
const TIPOS = [
  { id: 'agua',    label: 'Água',    icon: 'water',          unidade: 'L' },
  { id: 'energia', label: 'Energia', icon: 'flash',          unidade: 'kWh' },
  { id: 'outros',  label: 'Outros',  icon: 'receipt-outline', unidade: 'R$' },
];

const PERIODOS = [
  { id: 'semanal', label: 'Semanal' },
  { id: 'mensal',  label: 'Mensal'  },
];

// Cor por status de progresso — espelha sustainability.js
const COR_STATUS = {
  otimo:   '#1D9E75',
  bom:     '#378ADD',
  atencao: '#EF9F27',
  critico: '#E24B4A',
};

// Ícone e cor por tipo de meta
const CONFIG_TIPO = {
  agua:    { icon: 'water',           cor: '#378ADD' },
  energia: { icon: 'flash',           cor: '#EF9F27' },
  outros:  { icon: 'receipt-outline', cor: '#8B5CF6' },
};

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────
export default function MetasScreen({ navigation }) {
  const { colors } = useContext(ThemeContext);
  const { metas, carregando, criarMeta, atualizarMeta, deletarMeta, calcularProgresso, buscarMetas } = useContext(MetasContext);
  const { registros } = useContext(ConsumptionContext);

  // ── Estado do modal de criar / editar ─────────────────────────────────────
  const [modalVisivel,  setModalVisivel]  = useState(false);
  const [editandoMeta,  setEditandoMeta]  = useState(null); // null = criar, object = editar
  const [tipoSel,       setTipoSel]       = useState('agua');
  const [periodoSel,    setPeriodoSel]    = useState('semanal');
  const [valorInput,    setValorInput]    = useState('');
  const [mensagem,      setMensagem]      = useState({ tipo: '', texto: '' });
  const [salvando,      setSalvando]      = useState(false);

  // Carrega metas ao montar — uma única chamada, não por item renderizado
  useEffect(() => { buscarMetas(); }, []);

  // ── Abre modal no modo correto ─────────────────────────────────────────────
  const abrirModalCriar = () => {
    // Regra de UX: impedir duplicata do mesmo tipo+período
    // Verificação feita antes de abrir o modal
    setEditandoMeta(null);
    setTipoSel('agua');
    setPeriodoSel('semanal');
    setValorInput('');
    setMensagem({ tipo: '', texto: '' });
    setModalVisivel(true);
  };

  const abrirModalEditar = (meta) => {
    setEditandoMeta(meta);
    setTipoSel(meta.tipo);
    setPeriodoSel(meta.periodo);
    setValorInput(String(meta.valor_meta));
    setMensagem({ tipo: '', texto: '' });
    setModalVisivel(true);
  };

  // ── Salvar (criar ou editar) ───────────────────────────────────────────────
  const handleSalvar = async () => {
    setMensagem({ tipo: '', texto: '' });

    const valor = parseFloat(valorInput);
    if (!valorInput || isNaN(valor) || valor <= 0) {
      setMensagem({ tipo: 'aviso', texto: 'Informe um valor maior que zero.' });
      return;
    }

    // Verificar duplicata ao criar (não ao editar)
    if (!editandoMeta) {
      const duplicata = metas.find(m => m.tipo === tipoSel && m.periodo === periodoSel && m.ativa);
      if (duplicata) {
        setMensagem({
          tipo: 'aviso',
          texto: `Já existe uma meta de ${tipoSel} ${periodoSel} ativa. Edite-a em vez de criar outra.`,
        });
        return;
      }
    }

    setSalvando(true);
    let resultado;

    if (editandoMeta) {
      resultado = await atualizarMeta(editandoMeta.id, { valor_meta: valor });
    } else {
      resultado = await criarMeta({ tipo: tipoSel, periodo: periodoSel, valor_meta: valor });
    }

    setSalvando(false);

    if (resultado.sucesso) {
      setModalVisivel(false);
    } else {
      setMensagem({ tipo: 'erro', texto: resultado.erro || 'Erro ao salvar meta.' });
    }
  };

  // ── Deletar ───────────────────────────────────────────────────────────────
  const handleDeletar = async (id) => {
    await deletarMeta(id);
  };

  // ── Unidade dinâmica com base no tipo selecionado ─────────────────────────
  const unidadeAtual = TIPOS.find(t => t.id === tipoSel)?.unidade || '';

  // ── Estilos ───────────────────────────────────────────────────────────────
  const styles = StyleSheet.create({
    webScrollStyle: Platform.select({ web: { overflow: 'auto', height: '100%' }, default: {} }),
    inner:          { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 100 },
    pageTitle:      { color: colors.text, fontSize: 20, fontWeight: '800', marginBottom: 4, textAlign: 'center' },
    pageSubtitle:   { color: colors.textSub, fontSize: 13, marginBottom: 20, textAlign: 'center' },
    metaCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 12,
    },
    metaHeaderRow:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
    metaTipoLabel:  { color: colors.text, fontSize: 14, fontWeight: '700', marginLeft: 8, flex: 1 },
    badge: {
      paddingHorizontal: 8, paddingVertical: 3,
      borderRadius: 8, marginLeft: 8,
    },
    badgeText:      { fontSize: 10, fontWeight: '700' },
    metaValorText:  { color: colors.textSub, fontSize: 12, marginBottom: 8 },
    actionRow:      { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 8, gap: 8 },
    ctaCard: {
      backgroundColor: colors.surface,
      borderRadius: 16, borderWidth: 1, borderColor: colors.border,
      padding: 20, alignItems: 'center', marginTop: 8,
    },
    fab: {
      position: 'absolute', bottom: 24, right: 24,
      width: 56, height: 56, borderRadius: 28,
      backgroundColor: colors.blue,
      alignItems: 'center', justifyContent: 'center',
      elevation: 6, shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 8,
    },
    // Modal
    modalOverlay:  { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
    modalContent: {
      backgroundColor: colors.card,
      borderTopLeftRadius: 24, borderTopRightRadius: 24,
      padding: 24, paddingBottom: 40,
    },
    modalTitle:    { color: colors.text, fontSize: 18, fontWeight: '700', marginBottom: 20 },
    sectionLabel:  { color: colors.textSub, fontSize: 11, textTransform: 'uppercase', fontWeight: '700', letterSpacing: 0.5, marginBottom: 8, marginTop: 16 },
    chipsRow:      { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 4 },
    chip: {
      paddingHorizontal: 14, paddingVertical: 8,
      borderRadius: 20, borderWidth: 1, flexDirection: 'row', alignItems: 'center', gap: 6,
    },
    chipText:      { fontSize: 13, fontWeight: '600' },
    input: {
      backgroundColor: colors.surface,
      borderWidth: 1, borderColor: colors.border,
      borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12,
      color: colors.text, fontSize: 16,
    },
    unidadeHint:   { color: colors.textMuted, fontSize: 12, marginTop: 4, marginBottom: 4 },
    saveBtn: {
      backgroundColor: colors.blue,
      borderRadius: 14, paddingVertical: 14, alignItems: 'center', marginTop: 20,
    },
    saveBtnText:   { color: '#fff', fontSize: 16, fontWeight: '700' },
  });

  // ─── RENDER ───────────────────────────────────────────────────────────────
  return (
    <>
      <ScreenScrollView contentContainerStyle={styles.inner}>
        <Text style={styles.pageTitle}>Minhas Metas</Text>
        <Text style={styles.pageSubtitle}>Defina limites de consumo e acompanhe seu progresso.</Text>

        {carregando && (
          <View style={{ alignItems: 'center', paddingVertical: 40 }}>
            <ActivityIndicator size="small" color={colors.blue} />
            <Text style={{ color: colors.textMuted, marginTop: 8, fontSize: 12 }}>Carregando metas...</Text>
          </View>
        )}

        {/* Lista de metas ativas */}
        {!carregando && metas.map((meta, idx) => {
          const progresso  = calcularProgresso(meta, registros);
          const cfg        = CONFIG_TIPO[meta.tipo] || CONFIG_TIPO.outros;
          const corStatus  = COR_STATUS[progresso.status];
          const periodoLabel = meta.periodo === 'semanal' ? 'Esta semana' : 'Este mês';

          return (
            <MotiView
              key={meta.id}
              from={{ opacity: 0, translateY: 10 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 350, delay: idx * 60 }}
            >
              <View style={styles.metaCard}>
                <View style={styles.metaHeaderRow}>
                  <Ionicons name={cfg.icon} size={20} color={cfg.cor} />
                  <Text style={styles.metaTipoLabel}>
                    {TIPOS.find(t => t.id === meta.tipo)?.label} · {periodoLabel}
                  </Text>
                  {/* Badge de status */}
                  <View style={[styles.badge, { backgroundColor: corStatus + '22' }]}>
                    <Text style={[styles.badgeText, { color: corStatus }]}>
                      {progresso.status.toUpperCase()}
                    </Text>
                  </View>
                </View>

                {/* Valor consumido vs meta */}
                <Text style={styles.metaValorText}>
                  {progresso.totalConsumido.toFixed(1)} {meta.unidade_medida} de {Number(meta.valor_meta).toFixed(1)} {meta.unidade_medida}
                </Text>

                {/* Barra de progresso — reutiliza StatBar existente */}
                <StatBar
                  label=""
                  value={progresso.percentual}
                  max={100}
                  color={corStatus}
                  unit="%"
                />

                {/* Botões editar / deletar */}
                <View style={styles.actionRow}>
                  <TouchableOpacity onPress={() => abrirModalEditar(meta)} style={{ padding: 8 }}>
                    <Ionicons name="pencil-outline" size={18} color={colors.textMuted} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDeletar(meta.id)} style={{ padding: 8 }}>
                    <Ionicons name="trash-outline" size={18} color={colors.danger || '#E24B4A'} />
                  </TouchableOpacity>
                </View>
              </View>
            </MotiView>
          );
        })}

        {/* Estado vazio: nenhuma meta criada */}
        {!carregando && metas.length === 0 && (
          <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ type: 'timing', duration: 400 }}>
            <View style={styles.ctaCard}>
              <Ionicons name="flag-outline" size={40} color={colors.textMuted} style={{ marginBottom: 12 }} />
              <Text style={{ color: colors.text, fontSize: 15, fontWeight: '700', marginBottom: 6 }}>
                Nenhuma meta definida
              </Text>
              <Text style={{ color: colors.textSub, fontSize: 13, textAlign: 'center', lineHeight: 19, marginBottom: 16 }}>
                Defina um limite de consumo e o app calculará seu progresso automaticamente.
              </Text>
              <TouchableOpacity
                onPress={abrirModalCriar}
                style={{ backgroundColor: colors.blue, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 }}
              >
                <Text style={{ color: '#fff', fontWeight: '700', fontSize: 14 }}>Criar primeira meta</Text>
              </TouchableOpacity>
            </View>
          </MotiView>
        )}
      </ScreenScrollView>

      {/* FAB — botão flutuante de ação */}
      {metas.length > 0 && (
        <TouchableOpacity style={styles.fab} onPress={abrirModalCriar} activeOpacity={0.85}>
          <Ionicons name="add" size={28} color="#fff" />
        </TouchableOpacity>
      )}

      {/* ─── MODAL: Criar / Editar meta ─────────────────────────────────── */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisivel}
        onRequestClose={() => setModalVisivel(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Indicador de arrasto */}
            <View style={{ width: 40, height: 5, backgroundColor: colors.border, borderRadius: 3, alignSelf: 'center', marginBottom: 16 }} />

            <Text style={styles.modalTitle}>
              {editandoMeta ? 'Editar Meta' : 'Nova Meta'}
            </Text>

            <InlineMessage tipo={mensagem.tipo} mensagem={mensagem.texto} />

            {/* Seleção de tipo — apenas na criação (não permite trocar tipo ao editar) */}
            {!editandoMeta && (
              <>
                <Text style={styles.sectionLabel}>Tipo de consumo</Text>
                <View style={styles.chipsRow}>
                  {TIPOS.map(t => {
                    const ativo = tipoSel === t.id;
                    return (
                      <TouchableOpacity
                        key={t.id}
                        style={[styles.chip, {
                          backgroundColor: ativo ? colors.blue + '22' : 'transparent',
                          borderColor: ativo ? colors.blue : colors.border,
                        }]}
                        onPress={() => setTipoSel(t.id)}
                      >
                        <Ionicons name={t.icon} size={14} color={ativo ? colors.blue : colors.textMuted} />
                        <Text style={[styles.chipText, { color: ativo ? colors.blue : colors.textSub }]}>{t.label}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <Text style={styles.sectionLabel}>Período</Text>
                <View style={styles.chipsRow}>
                  {PERIODOS.map(p => {
                    const ativo = periodoSel === p.id;
                    return (
                      <TouchableOpacity
                        key={p.id}
                        style={[styles.chip, {
                          backgroundColor: ativo ? colors.teal + '22' : 'transparent',
                          borderColor: ativo ? colors.teal : colors.border,
                        }]}
                        onPress={() => setPeriodoSel(p.id)}
                      >
                        <Text style={[styles.chipText, { color: ativo ? colors.teal : colors.textSub }]}>{p.label}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </>
            )}

            {/* Valor limite */}
            <Text style={styles.sectionLabel}>
              Limite de consumo {editandoMeta ? `(${editandoMeta.unidade_medida})` : `(${unidadeAtual})`}
            </Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder={`Ex: ${tipoSel === 'agua' ? '100' : tipoSel === 'energia' ? '30' : '50'}`}
              placeholderTextColor={colors.textMuted}
              value={valorInput}
              onChangeText={t => { setValorInput(t); setMensagem({ tipo: '', texto: '' }); }}
            />
            <Text style={styles.unidadeHint}>
              Unidade: {editandoMeta ? editandoMeta.unidade_medida : unidadeAtual}
            </Text>

            {/* Botão salvar */}
            <TouchableOpacity
              style={[styles.saveBtn, salvando && { opacity: 0.65 }]}
              onPress={handleSalvar}
              disabled={salvando}
            >
              {salvando
                ? <ActivityIndicator color="#fff" />
                : <Text style={styles.saveBtnText}>{editandoMeta ? 'Salvar Alterações' : 'Criar Meta'}</Text>
              }
            </TouchableOpacity>

            {/* Botão cancelar */}
            <TouchableOpacity
              onPress={() => setModalVisivel(false)}
              style={{ alignItems: 'center', marginTop: 14 }}
            >
              <Text style={{ color: colors.textMuted, fontSize: 14 }}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}
