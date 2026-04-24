// screensStyles.js
// Arquivo centralizado de estilos para todas as telas do Wavunder.
// Separar estilos do JSX é uma boa prática de Engenharia de Software
// que facilita manutenção e torna o código mais limpo para apresentação.

import { StyleSheet, Dimensions } from 'react-native';

// Dimensões da tela para cálculos responsivos
// Se react-native-responsive-screen estiver instalado, pode usar wp/hp
// Mas o Dimensions nativo já resolve 99% dos casos sem dependência extra
const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

// Função utilitária: converte % da largura para pixels
const wp = (pct) => (SCREEN_W * pct) / 100;
// Função utilitária: converte % da altura para pixels
const hp = (pct) => (SCREEN_H * pct) / 100;

// ─────────────────────────────────────────────
// TELA DE ÁGUA
// ─────────────────────────────────────────────
export const getAguaStyles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: wp(5), paddingTop: 20 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: colors.text, marginLeft: 16 },
  card: { backgroundColor: colors.card, borderRadius: 20, padding: wp(5), borderWidth: 1, borderColor: colors.border, marginBottom: 20 },
  label: { color: colors.textSub, fontSize: 12, textTransform: 'uppercase', marginBottom: 20, fontWeight: 'bold' },
  controls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  circleBtn: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
  btnText: { fontSize: 24, color: colors.textSub },
  timeText: { fontSize: 48, fontWeight: 'bold', color: colors.blue },
  unitText: { fontSize: 16, color: colors.textSub },
  resultTitle: { color: colors.textSub, fontSize: 14, marginBottom: 8 },
  resultValue: { fontSize: 36, fontWeight: 'bold', color: colors.blue },
  tipBox: { padding: 16, borderRadius: 16, borderWidth: 1, flexDirection: 'row', alignItems: 'center' },
  tipIcon: { fontSize: 24, marginRight: 12 },
});

// ─────────────────────────────────────────────
// TELA DE ENERGIA
// ─────────────────────────────────────────────
export const getEnergiaStyles = (colors) => StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: colors.bg, paddingHorizontal: wp(5), paddingTop: 20 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: colors.text, marginLeft: 16 },
  card: { backgroundColor: colors.card, borderRadius: 20, padding: wp(5), borderWidth: 1, borderColor: colors.border, marginBottom: 20 },
  label: { color: colors.textSub, fontSize: 12, textTransform: 'uppercase', marginBottom: 12, fontWeight: 'bold' },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20 },
  chip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1, marginRight: 8, marginBottom: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  valHighlight: { color: colors.gold, fontWeight: 'bold' },
  resultGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  resCard: { flex: 1, padding: 16, borderRadius: 16, borderWidth: 1, alignItems: 'center' },
  resLabel: { fontSize: 12, color: colors.textSub, marginBottom: 8 },
  resVal: { fontSize: 24, fontWeight: 'bold' },
  voceSabiaBox: { marginTop: 20, padding: 16, borderRadius: 16, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  voceSabiaTitle: { color: colors.violet, fontWeight: 'bold', marginBottom: 8, fontSize: 16 },
  voceSabiaText: { color: colors.textSub, fontSize: 14, lineHeight: 20 },
});

// ─────────────────────────────────────────────
// TELA DE PERFIL (COMPACTO)
// Layout otimizado para caber em telas pequenas sem cortar.
// flex: 1 no style limita a altura ao espaço entre Header e BottomNav.
// ─────────────────────────────────────────────
export const getPerfilStyles = (colors) => StyleSheet.create({
  container: { flex: 1, paddingHorizontal: wp(5) },
  profileHeader: { alignItems: 'center', marginBottom: 12, marginTop: 4 },
  avatar: {
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: colors.blueSoft,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 2, borderColor: colors.blue + '44',
  },
  avatarText: { fontSize: 30 },
  name: { fontSize: 18, fontWeight: 'bold', color: colors.text, marginBottom: 2 },
  email: { fontSize: 13, color: colors.textSub },
  economizadosLabel: {
    color: colors.textMuted, fontSize: 10,
    textTransform: 'uppercase', letterSpacing: 1,
    alignSelf: 'center', marginBottom: 6,
  },
  chipsRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 12 },
  levelCard: {
    backgroundColor: colors.teal + '12',
    borderWidth: 1, borderColor: colors.teal + '38',
    borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10,
    flexDirection: 'row', alignItems: 'center',
    marginBottom: 12,
  },
  levelIcon: { fontSize: 24, marginRight: 10 },
  levelTitle: { color: colors.teal, fontSize: 14, fontWeight: 'bold', marginBottom: 2 },
  levelSub: { color: colors.textSub, fontSize: 11 },
  menuCard: {
    backgroundColor: colors.card,
    borderWidth: 1, borderColor: colors.border,
    borderRadius: 12,
    marginBottom: 12,
  },
  menuItem: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 14, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: colors.border,
    minHeight: 44,
  },
  menuText: { color: colors.text, fontSize: 15, flexShrink: 1 },
  menuArrow: { color: colors.textMuted, fontSize: 18 },
  logoutBtn: {
    backgroundColor: colors.danger + '14',
    borderWidth: 1, borderColor: colors.danger + '40',
    paddingVertical: 12, paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  logoutText: { color: colors.danger, fontWeight: 'bold', fontSize: 15 },
});

// ─────────────────────────────────────────────
// TELA HOME
// ─────────────────────────────────────────────
export const getHomeStyles = (colors) => StyleSheet.create({
  // flex: 1 limita o ScrollView ao espaço do pai
  container: { flex: 1, paddingHorizontal: wp(5), paddingTop: 10 },
  greeting: { color: colors.textSub, fontSize: 14, marginBottom: 2 },
  title: { color: colors.text, fontSize: 26, fontWeight: '800', marginBottom: 20 },
  heroCard: {
    backgroundColor: '#152C58',
    borderRadius: 24, padding: wp(6),
    marginBottom: 24, overflow: 'hidden',
    borderColor: colors.border, borderWidth: 1,
  },
  heroSubtitle: { color: colors.textSub, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 6 },
  heroTitle: { color: colors.teal, fontSize: 28, fontWeight: '800', marginBottom: 20 },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap' },
  sectionTitle: { color: colors.textMuted, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 12 },
  statsCard: { backgroundColor: colors.card, borderRadius: 20, padding: wp(5), borderWidth: 1, borderColor: colors.border, marginBottom: 20 },
});
