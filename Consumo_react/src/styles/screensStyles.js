// screensStyles.js
// Arquivo centralizado de estilos para todas as telas do Wavunder.
// Separar estilos do JSX é uma boa prática de Engenharia de Software
// que facilita manutenção e torna o código mais limpo para apresentação.

import { ScaledSheet } from 'react-native-size-matters';

// ─────────────────────────────────────────────
// TELA DE ÁGUA
// ─────────────────────────────────────────────
export const getAguaStyles = (colors) => ScaledSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: '20@s', paddingTop: '20@ms' },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: '24@ms' },
  backBtn: { width: '40@s', height: '40@s', borderRadius: '12@s', backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
  headerTitle: { fontSize: '20@ms', fontWeight: 'bold', color: colors.text, marginLeft: '16@s' },
  card: { backgroundColor: colors.card, borderRadius: '20@s', padding: '20@s', borderWidth: 1, borderColor: colors.border, marginBottom: '20@ms' },
  label: { color: colors.textSub, fontSize: '12@ms', textTransform: 'uppercase', marginBottom: '20@ms', fontWeight: 'bold' },
  controls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20@ms' },
  circleBtn: { width: '48@s', height: '48@s', borderRadius: '24@s', backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
  btnText: { fontSize: '24@ms', color: colors.textSub },
  timeText: { fontSize: '48@ms', fontWeight: 'bold', color: colors.blue },
  unitText: { fontSize: '16@ms', color: colors.textSub },
  resultTitle: { color: colors.textSub, fontSize: '14@ms', marginBottom: '8@ms' },
  resultValue: { fontSize: '36@ms', fontWeight: 'bold', color: colors.blue },
  tipBox: { padding: '16@ms', borderRadius: '16@s', borderWidth: 1, flexDirection: 'row', alignItems: 'center' },
  tipIcon: { fontSize: '24@ms', marginRight: '12@s' },
});

// ─────────────────────────────────────────────
// TELA DE ENERGIA
// ─────────────────────────────────────────────
export const getEnergiaStyles = (colors) => ScaledSheet.create({
  container: { flexGrow: 1, backgroundColor: colors.bg, paddingHorizontal: '20@s', paddingTop: '20@ms' },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: '24@ms' },
  backBtn: { width: '40@s', height: '40@s', borderRadius: '12@s', backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
  headerTitle: { fontSize: '20@ms', fontWeight: 'bold', color: colors.text, marginLeft: '16@s' },
  card: { backgroundColor: colors.card, borderRadius: '20@s', padding: '20@s', borderWidth: 1, borderColor: colors.border, marginBottom: '20@ms' },
  label: { color: colors.textSub, fontSize: '12@ms', textTransform: 'uppercase', marginBottom: '12@ms', fontWeight: 'bold' },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: '20@ms' },
  chip: { paddingHorizontal: '12@s', paddingVertical: '8@ms', borderRadius: '20@s', borderWidth: 1, marginRight: '8@s', marginBottom: '8@ms' },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: '8@ms' },
  valHighlight: { color: colors.gold, fontWeight: 'bold' },
  resultGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  resCard: { flex: 1, padding: '16@ms', borderRadius: '16@s', borderWidth: 1, alignItems: 'center' },
  resLabel: { fontSize: '12@ms', color: colors.textSub, marginBottom: '8@ms' },
  resVal: { fontSize: '24@ms', fontWeight: 'bold' },
  voceSabiaBox: { marginTop: '20@ms', padding: '16@ms', borderRadius: '16@s', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  voceSabiaTitle: { color: colors.violet, fontWeight: 'bold', marginBottom: '8@ms', fontSize: '16@ms' },
  voceSabiaText: { color: colors.textSub, fontSize: '14@ms', lineHeight: '20@ms' },
});

// ─────────────────────────────────────────────
// TELA DE PERFIL (COMPACTO)
// Layout otimizado para caber em telas pequenas sem cortar.
// flex: 1 no style limita a altura ao espaço entre Header e BottomNav.
// ─────────────────────────────────────────────
export const getPerfilStyles = (colors) => ScaledSheet.create({
  container: { flex: 1, paddingHorizontal: '20@s' },
  profileHeader: { alignItems: 'center', marginBottom: '12@ms', marginTop: '4@ms' },
  avatar: {
    width: '60@s', height: '60@s', borderRadius: '30@s',
    backgroundColor: colors.blueSoft,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: '8@ms',
    borderWidth: 2, borderColor: colors.blue + '44',
  },
  avatarText: { fontSize: '30@ms' },
  name: { fontSize: '18@ms', fontWeight: 'bold', color: colors.text, marginBottom: '2@ms' },
  email: { fontSize: '13@ms', color: colors.textSub },
  economizadosLabel: {
    color: colors.textMuted, fontSize: '10@ms',
    textTransform: 'uppercase', letterSpacing: 1,
    alignSelf: 'center', marginBottom: '6@ms',
  },
  chipsRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: '12@ms' },
  levelCard: {
    backgroundColor: colors.teal + '12',
    borderWidth: 1, borderColor: colors.teal + '38',
    borderRadius: '12@s', paddingHorizontal: '12@s', paddingVertical: '10@ms',
    flexDirection: 'row', alignItems: 'center',
    marginBottom: '12@ms',
  },
  levelIcon: { fontSize: '24@ms', marginRight: '10@s' },
  levelTitle: { color: colors.teal, fontSize: '14@ms', fontWeight: 'bold', marginBottom: '2@ms' },
  levelSub: { color: colors.textSub, fontSize: '11@ms' },
  menuCard: {
    backgroundColor: colors.card,
    borderWidth: 1, borderColor: colors.border,
    borderRadius: '12@s',
    marginBottom: '12@ms',
  },
  menuItem: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: '14@s', paddingVertical: '12@ms',
    borderBottomWidth: 1, borderBottomColor: colors.border,
    minHeight: '44@ms',
  },
  menuText: { color: colors.text, fontSize: '15@ms', flexShrink: 1 },
  menuArrow: { color: colors.textMuted, fontSize: '18@ms' },
  logoutBtn: {
    backgroundColor: colors.danger + '14',
    borderWidth: 1, borderColor: colors.danger + '40',
    paddingVertical: '12@ms', paddingHorizontal: '16@s',
    borderRadius: '12@s',
    alignItems: 'center',
  },
  logoutText: { color: colors.danger, fontWeight: 'bold', fontSize: '15@ms' },
});

// ─────────────────────────────────────────────
// TELA HOME
// ─────────────────────────────────────────────
export const getHomeStyles = (colors) => ScaledSheet.create({
  container: { flex: 1, paddingHorizontal: '20@s', paddingTop: '10@ms' },
  greeting: { color: colors.textSub, fontSize: '14@ms', marginBottom: '2@ms' },
  title: { color: colors.text, fontSize: '26@ms', fontWeight: '800', marginBottom: '20@ms' },
  heroCard: {
    backgroundColor: '#152C58',
    borderRadius: '24@s', padding: '24@ms',
    marginBottom: '24@ms', overflow: 'hidden',
    borderColor: colors.border, borderWidth: 1,
  },
  heroSubtitle: { color: colors.textSub, fontSize: '12@ms', textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: '6@ms' },
  heroTitle: { color: colors.teal, fontSize: '28@ms', fontWeight: '800', marginBottom: '20@ms' },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap' },
  sectionTitle: { color: colors.textMuted, fontSize: '12@ms', textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: '12@ms' },
  statsCard: { backgroundColor: colors.card, borderRadius: '20@s', padding: '20@ms', borderWidth: 1, borderColor: colors.border, marginBottom: '20@ms' },
});
