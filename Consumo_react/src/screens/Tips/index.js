// Tips/index.js
// Tela de Dicas de Sustentabilidade.
// Exibe uma lista de conselhos para economia de água e energia.
import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';
import { ThemeContext } from '../../contexts/ThemeContext';

export default function DicasScreen({ navigation }) {
  const { colors } = useContext(ThemeContext);

  const dicas = [
    { icon: "🚿", title: "Banhos curtos", desc: "Banhos de até 5 min economizam até 60% da água", cor: colors.blue },
    { icon: "🔌", title: "Tirar da tomada", desc: "Desligar aparelhos em stand-by reduz até 12% no consumo", cor: colors.gold },
    { icon: "💡", title: "Lâmpadas LED", desc: "Consomem até 80% menos energia que as incandescentes", cor: colors.teal },
    { icon: "🌡️", title: "Ar-condicionado", desc: "Manter a 23°C reduz em 10% o consumo elétrico", cor: colors.violet },
    { icon: "🫙", title: "Reúso de água", desc: "Água do enxágue pode ser reaproveitada para limpeza", cor: colors.blue },
  ];

  const styles = ScaledSheet.create({
    container: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: '20@s', paddingTop: '20@vs' },
    header: { flexDirection: 'row', alignItems: 'center', marginBottom: '24@vs' },
    backBtn: { width: '40@s', height: '40@s', borderRadius: '12@s', backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
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
    dicaTitle: { fontSize: '16@ms', fontWeight: 'bold', marginBottom: '4@vs' },
    dicaDesc: { fontSize: '13@ms', color: colors.textSub, flexShrink: 1 }
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={{color: colors.textSub, fontSize: 18}}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>🌿 Dicas</Text>
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {dicas.map((d, i) => (
          <View key={i} style={[styles.dicaCard, { backgroundColor: d.cor + '14', borderColor: d.cor + '35' }]}>
            <View style={[styles.iconBox, { backgroundColor: d.cor + '20', borderColor: d.cor + '35' }]}>
              <Text style={{fontSize: 24}}>{d.icon}</Text>
            </View>
            <View style={{flex: 1}}>
              <Text style={[styles.dicaTitle, { color: d.cor }]}>{d.title}</Text>
              <Text style={styles.dicaDesc}>{d.desc}</Text>
            </View>
          </View>
        ))}
        <View style={{height: 40}}/>
      </ScrollView>
    </View>
  );
}
