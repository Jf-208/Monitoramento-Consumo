import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { ThemeContext } from '../contexts/ThemeContext';

export default function DicasScreen({ navigation }) {
  const { colors } = useContext(ThemeContext);

  const dicas = [
    { icon: "🚿", title: "Banhos curtos", desc: "Banhos de até 5 min economizam até 60% da água", cor: colors.blue },
    { icon: "🔌", title: "Tirar da tomada", desc: "Desligar aparelhos em stand-by reduz até 12% no consumo", cor: colors.gold },
    { icon: "💡", title: "Lâmpadas LED", desc: "Consomem até 80% menos energia que as incandescentes", cor: colors.teal },
    { icon: "🌡️", title: "Ar-condicionado", desc: "Manter a 23°C reduz em 10% o consumo elétrico", cor: colors.violet },
    { icon: "🫙", title: "Reúso de água", desc: "Água do enxágue pode ser reaproveitada para limpeza", cor: colors.blue },
  ];

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: 20, paddingTop: 20 },
    header: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
    backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: colors.text, marginLeft: 16 },
    dicaCard: {
      flexDirection: 'row', alignItems: 'center',
      padding: 16, borderRadius: 18, borderWidth: 1,
      marginBottom: 12,
    },
    iconBox: {
      width: 48, height: 48, borderRadius: 14,
      alignItems: 'center', justifyContent: 'center',
      marginRight: 16, borderWidth: 1,
    },
    dicaTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
    dicaDesc: { fontSize: 13, color: colors.textSub, flexShrink: 1 }
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
