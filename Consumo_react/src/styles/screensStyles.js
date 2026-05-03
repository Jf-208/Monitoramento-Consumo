// screensStyles.js
// Arquivo centralizado de estilos para todas as telas do Wavunder.
// Separar estilos do JSX é uma boa prática de Engenharia de Software
// que facilita manutenção e torna o código mais limpo para apresentação.
//
// REGRA CRÍTICA PARA ANDROID:
// ScrollView NÃO deve ter flex:1 no seu style.
// Com flex:1, o Android calcula altura zero para o scroll e ele não funciona.
// O padding/spacing deve ir no contentContainerStyle, não no style.
//
// FIX WEB (React Native Web):
// ScrollView renderiza como <div> com overflow:hidden por padrão na web.
// Platform.select injeta overflow:'scroll' e height:'100%' APENAS na web,
// sem afetar o comportamento no Android/iOS.

import { ScaledSheet, ms } from 'react-native-size-matters';
import { Platform } from 'react-native';

// ─── ESTILO WEB COMPARTILHADO ────────────────────────────────────────────────
// Reutilizado em todos os containers de ScrollView para habilitar scroll na web.
const webScrollContainer = Platform.select({
  web: {
    overflow: 'scroll',
    height: '100%',
    WebkitOverflowScrolling: 'touch',
  },
  default: {},
});

// Garante que o conteúdo do ScrollView tenha altura mínima de 100% na web,
// evitando que o conteúdo colapse quando há pouco conteúdo.
const webContentContainer = Platform.select({
  web: { minHeight: '100%' },
  default: {},
});

// ─────────────────────────────────────────────
// TELA DE ÁGUA
// ─────────────────────────────────────────────
// Água agora usa ScrollView — container NÃO tem flex:1.
// O overflow:'scroll' na web habilita scroll com mouse wheel.
export const getAguaStyles = (colors) => ScaledSheet.create({
  container: {
    backgroundColor: colors.bg,
    paddingHorizontal: '20@s',
    paddingTop: '20@vs',
    // FIX WEB: overflow:'scroll' habilita scroll com mouse wheel na web
    ...webScrollContainer,
  },
  // contentContainer para o ScrollView
  contentContainer: {
    flexGrow: 1,
    paddingBottom: '100@vs',
    ...webContentContainer,
  },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: '24@vs' },
  backBtn: { width: '40@s', height: '40@s', borderRadius: '12@s', backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
  headerTitle: { fontSize: '20@ms', fontWeight: 'bold', color: colors.text, marginLeft: '16@s' },
  card: { backgroundColor: colors.card, borderRadius: '20@s', padding: '20@s', borderWidth: 1, borderColor: colors.border, marginBottom: '16@vs' },
  label: { color: colors.textSub, fontSize: '12@ms', textTransform: 'uppercase', marginBottom: '16@vs', fontWeight: 'bold' },
  controls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16@vs' },
  circleBtn: { width: '48@s', height: '48@s', borderRadius: '24@s', backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
  btnText: { fontSize: '24@ms', color: colors.textSub },
  timeText: { fontSize: '48@ms', fontWeight: 'bold', color: colors.blue },
  unitText: { fontSize: '16@ms', color: colors.textSub },
  resultTitle: { color: colors.textSub, fontSize: '14@ms', marginBottom: '8@vs' },
  resultValue: { fontSize: '32@ms', fontWeight: 'bold', color: colors.blue },
  tipBox: { padding: '16@ms', borderRadius: '16@s', borderWidth: 1, flexDirection: 'row', alignItems: 'center', marginBottom: '16@vs' },
  tipIcon: { fontSize: '22@ms', marginRight: '12@s' },
});

// ─────────────────────────────────────────────
// TELA DE ENERGIA
// ─────────────────────────────────────────────
// Energia usa ScrollView — container NÃO tem flex:1.
// flexGrow:1 no contentContainerStyle garante que o conteúdo preencha a tela.
export const getEnergiaStyles = (colors) => ScaledSheet.create({
  // SEM flex:1 — ScrollView calcula sua própria altura
  container: {
    backgroundColor: colors.bg,
    // FIX WEB: overflow:'scroll' habilita scroll com mouse wheel na web
    ...webScrollContainer,
  },
  // contentContainer usado pelo ScrollView via contentContainerStyle
  contentContainer: {
    paddingHorizontal: '20@s',
    paddingTop: '20@vs',
    paddingBottom: '100@vs',
    ...webContentContainer,
  },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: '24@vs' },
  backBtn: { width: '40@s', height: '40@s', borderRadius: '12@s', backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
  headerTitle: { fontSize: '20@ms', fontWeight: 'bold', color: colors.text, marginLeft: '16@s' },
  card: { backgroundColor: colors.card, borderRadius: '20@s', padding: '20@s', borderWidth: 1, borderColor: colors.border, marginBottom: '16@vs' },
  label: { color: colors.textSub, fontSize: '12@ms', textTransform: 'uppercase', marginBottom: '12@vs', fontWeight: 'bold' },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: '16@vs' },
  chip: { paddingHorizontal: '12@s', paddingVertical: '8@vs', borderRadius: '20@s', borderWidth: 1, marginRight: '8@s', marginBottom: '8@vs' },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: '8@vs' },
  valHighlight: { color: colors.gold, fontWeight: 'bold' },
  resultGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: '16@vs' },
  resCard: { flex: 1, padding: '16@ms', borderRadius: '16@s', borderWidth: 1, alignItems: 'center' },
  resLabel: { fontSize: '12@ms', color: colors.textSub, marginBottom: '8@vs' },
  resVal: { fontSize: '22@ms', fontWeight: 'bold' },
  voceSabiaBox: { marginTop: '16@vs', padding: '16@ms', borderRadius: '16@s', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, marginBottom: '16@vs' },
  voceSabiaTitle: { color: colors.violet, fontWeight: 'bold', marginBottom: '8@vs', fontSize: '15@ms' },
  voceSabiaText: { color: colors.textSub, fontSize: '13@ms', lineHeight: '20@ms' },
});

// ─────────────────────────────────────────────
// TELA DE PERFIL
// ─────────────────────────────────────────────
// Perfil usa ScrollView — container NÃO tem flex:1.
export const getPerfilStyles = (colors) => ScaledSheet.create({
  // SEM flex:1 — ScrollView dentro de MainTabs (content com flex:1) funciona sem isso
  container: {
    paddingHorizontal: '20@s',
    // FIX WEB: overflow:'scroll' habilita scroll com mouse wheel na web
    ...webScrollContainer,
  },
  profileHeader: { alignItems: 'center', marginBottom: '12@vs', marginTop: '4@vs' },
  avatar: {
    width: '60@s', height: '60@s', borderRadius: '30@s',
    backgroundColor: colors.blueSoft,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: '8@vs',
    borderWidth: 2, borderColor: colors.blue + '44',
  },
  avatarText: { fontSize: '30@ms' },
  name: { fontSize: '18@ms', fontWeight: 'bold', color: colors.text, marginBottom: '2@vs' },
  email: { fontSize: '13@ms', color: colors.textSub },
  economizadosLabel: {
    color: colors.textMuted, fontSize: '10@ms',
    textTransform: 'uppercase', letterSpacing: 1,
    alignSelf: 'center', marginBottom: '6@vs',
  },
  chipsRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: '12@vs' },
  levelCard: {
    backgroundColor: colors.teal + '12',
    borderWidth: 1, borderColor: colors.teal + '38',
    borderRadius: '12@s', paddingHorizontal: '12@s', paddingVertical: '10@vs',
    flexDirection: 'row', alignItems: 'center',
    marginBottom: '12@vs',
  },
  levelIcon: { fontSize: '24@ms', marginRight: '10@s' },
  levelTitle: { color: colors.teal, fontSize: '14@ms', fontWeight: 'bold', marginBottom: '2@vs' },
  levelSub: { color: colors.textSub, fontSize: '11@ms' },
  menuCard: {
    backgroundColor: colors.card,
    borderWidth: 1, borderColor: colors.border,
    borderRadius: '12@s',
    marginBottom: '12@vs',
  },
  menuItem: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: '14@s', paddingVertical: '12@vs',
    borderBottomWidth: 1, borderBottomColor: colors.border,
    minHeight: '44@vs',
  },
  menuText: { color: colors.text, fontSize: '15@ms', flexShrink: 1 },
  menuArrow: { color: colors.textMuted, fontSize: '18@ms' },
  logoutBtn: {
    backgroundColor: colors.danger + '14',
    borderWidth: 1, borderColor: colors.danger + '40',
    paddingVertical: '12@vs', paddingHorizontal: '16@s',
    borderRadius: '12@s',
    alignItems: 'center',
    marginBottom: '24@vs',
  },
  logoutText: { color: colors.danger, fontWeight: 'bold', fontSize: '15@ms' },
});

// ─────────────────────────────────────────────
// TELA HOME
// ─────────────────────────────────────────────
// Home usa ScrollView — container NÃO tem flex:1.
export const getHomeStyles = (colors) => ScaledSheet.create({
  // SEM flex:1 — ScrollView calcula sua própria altura
  container: {
    backgroundColor: colors.bg,
    // FIX WEB: overflow:'scroll' habilita scroll com mouse wheel na web
    ...webScrollContainer,
  },
  // contentContainer: padding vai aqui, não no style
  contentContainer: {
    paddingHorizontal: '20@s',
    paddingTop: '10@vs',
    paddingBottom: '100@vs', // garante que o conteúdo não some atrás da BottomNav
    ...webContentContainer,
  },
  greeting: { color: colors.textSub, fontSize: '14@ms', marginBottom: '2@vs' },
  // ms() em fontes grandes garante responsividade em telas pequenas
  title: { color: colors.text, fontSize: '24@ms', fontWeight: '800', marginBottom: '16@vs' },
  heroCard: {
    backgroundColor: '#152C58',
    borderRadius: '20@s', padding: '20@ms',
    marginBottom: '20@vs', overflow: 'hidden',
    borderColor: colors.border, borderWidth: 1,
  },
  heroSubtitle: { color: colors.textSub, fontSize: '11@ms', textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: '6@vs' },
  // Fonte do título hero reduzida para caber em telas pequenas
  heroTitle: { color: colors.teal, fontSize: '24@ms', fontWeight: '800', marginBottom: '16@vs' },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap' },
  sectionTitle: { color: colors.textMuted, fontSize: '11@ms', textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: '10@vs' },
  statsCard: { backgroundColor: colors.card, borderRadius: '20@s', padding: '16@ms', borderWidth: 1, borderColor: colors.border, marginBottom: '16@vs' },
});
