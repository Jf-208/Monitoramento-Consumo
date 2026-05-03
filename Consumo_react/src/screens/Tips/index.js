// Tips/index.js
// Tela de Dicas de Sustentabilidade.
// Exibe uma lista de conselhos para economia de água e energia.
// Aberta via Stack Navigator — tem SafeAreaView e ScrollView sem flex:1.
import React, { useContext } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScaledSheet } from 'react-native-size-matters';
import { ThemeContext } from '../../contexts/ThemeContext';
import ScreenScrollView from '../../components/layout/ScreenScrollView';

export default function DicasScreen({ navigation }) {
  const { colors } = useContext(ThemeContext);

  const dicas = [
    { icon: '', title: 'Banhos curtos',    desc: 'Banhos de ate 5 min economizam ate 60% da agua',           cor: colors.blue },
    { icon: '', title: 'Tirar da tomada',  desc: 'Desligar aparelhos em stand-by reduz ate 12% no consumo',  cor: colors.gold },
    { icon: '', title: 'Lampadas LED',     desc: 'Consomem ate 80% menos energia que as incandescentes',     cor: colors.teal },
    { icon: '', title: 'Ar-condicionado', desc: 'Manter a 23C reduz em 10% o consumo eletrico',              cor: colors.violet },
    { icon: '', title: 'Reuso de agua',    desc: 'Agua do enxague pode ser reaproveitada para limpeza',      cor: colors.blue },
    { icon: '', title: 'Vazamentos',       desc: 'Uma torneira gotejando desperdica 46L por dia!',           cor: colors.blue },
    { icon: '', title: 'Maquina cheia',    desc: 'Maquina de lavar cheia economiza agua e energia',          cor: colors.teal },
    { icon: '', title: 'Modo noturno',     desc: 'Usar modo noturno em dispositivos economiza ate 15%',      cor: colors.gold },
  ];

  const styles = ScaledSheet.create({
    // SafeAreaView tem flex:1 — é o container raiz da tela Stack
    safeArea:   { flex: 1, backgroundColor: colors.bg },
    // ScrollView SEM flex:1 — resolve o scroll no Android
    scroll:     { backgroundColor: colors.bg },
    // padding vai no contentContainerStyle, não no style
    inner:      { paddingHorizontal: '20@s', paddingTop: '20@vs', paddingBottom: '40@vs' },
    header:     { flexDirection: 'row', alignItems: 'center', marginBottom: '24@vs' },
    backBtn:    { width: '40@s', height: '40@s', borderRadius: '12@s', backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
    headerTitle: { fontSize: '20@ms', fontWeight: 'bold', color: colors.text, marginLeft: '16@s' },
    dicaCard: {
      flexDirection: 'row', alignItems: 'center',
      padding: '16@ms', borderRadius: '18@s', borderWidth: 1,
      marginBottom: '12@vs',
    },
    iconBox: {
      width: '48@s', height: '48@s', borderRadius: '14@s',
      alignItems: 'center', justifyContent: 'center',
      marginRight: '16@s', borderWidth: 1,
    },
    dicaTitle: { fontSize: '15@ms', fontWeight: 'bold', marginBottom: '4@vs' },
    dicaDesc:  { fontSize: '13@ms', color: colors.textSub, flexShrink: 1 },
  });

  return (
    // SafeAreaView com edges=['top'] — protege o topo na Stack Navigator
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScreenScrollView
        contentContainerStyle={styles.inner}
      >
        {/* Header com botão voltar */}
        <TouchableOpacity style={styles.header} onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={{ color: colors.textSub, fontSize: 18 }}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Dicas</Text>
        </TouchableOpacity>

        {dicas.map((d, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.dicaCard, { backgroundColor: d.cor + '14', borderColor: d.cor + '35' }]}
            activeOpacity={0.85}
          >
            <TouchableOpacity style={[styles.iconBox, { backgroundColor: d.cor + '20', borderColor: d.cor + '35' }]} activeOpacity={1}>
              <Text style={{ fontSize: 24 }}>{d.icon}</Text>
            </TouchableOpacity>
            <Text style={[styles.dicaTitle, { color: d.cor, flex: 0, flexShrink: 0 }]} />
            <Text style={{ flex: 1 }}>
              <Text style={[styles.dicaTitle, { color: d.cor }]}>{d.title}{'\n'}</Text>
              <Text style={styles.dicaDesc}>{d.desc}</Text>
            </Text>
          </TouchableOpacity>
        ))}
      </ScreenScrollView>
    </SafeAreaView>
  );
}
