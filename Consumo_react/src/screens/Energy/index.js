// Energy/index.js
// Tela de Dashboard de Energia.
// Permite ao usuário simular o consumo de energia selecionando aparelhos (TV, Geladeira, etc)
// ou ajustando a potência e o tempo de uso para calcular kWh e o custo.
import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import Slider from '@react-native-community/slider';
import { verticalScale } from 'react-native-size-matters';
import { ThemeContext } from '../../contexts/ThemeContext';
import { ConsumptionContext } from '../../contexts/ConsumptionContext';
import { getEnergiaStyles } from '../../styles/screensStyles';

export default function EnergiaScreen({ navigation }) {
  const { colors } = useContext(ThemeContext);
  const { energiaPotencia, setEnergiaPotencia, energiaTempo, setEnergiaTempo } = useContext(ConsumptionContext);

  const styles = getEnergiaStyles(colors);

  const kWh = ((energiaPotencia * energiaTempo) / 60 / 1000).toFixed(2);
  const custo = (parseFloat(kWh) * 0.87).toFixed(2);

  const aparelhos = [
    { nome: "Chuveiro", w: 5500 },
    { nome: "Ar-cond.", w: 1500 },
    { nome: "Geladeira", w: 400 },
    { nome: 'TV 55"', w: 150 },
    { nome: "PC", w: 300 },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: verticalScale(80) }} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={{color: colors.textSub, fontSize: 18}}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>⚡ Energia</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Aparelho</Text>
        <View style={styles.chipsRow}>
          {aparelhos.map(a => {
            const active = energiaPotencia === a.w;
            return (
              <TouchableOpacity key={a.nome} 
                style={[styles.chip, { backgroundColor: active ? colors.gold + '28' : colors.surface, borderColor: active ? colors.gold : colors.border }]}
                onPress={() => { setEnergiaPotencia(a.w); }}
              >
                <Text style={{color: active ? colors.gold : colors.textSub, fontWeight: active ? 'bold' : 'normal'}}>{a.nome}</Text>
              </TouchableOpacity>
            )
          })}
        </View>

        <View style={styles.row}>
          <Text style={{color: colors.textSub}}>Potência:</Text>
          <Text style={styles.valHighlight}>{energiaPotencia}W</Text>
        </View>
        <Slider minimumValue={50} maximumValue={10000} step={50} value={energiaPotencia} onValueChange={setEnergiaPotencia} minimumTrackTintColor={colors.gold} thumbTintColor={colors.gold} style={{marginBottom: 20}} />

        <View style={styles.row}>
          <Text style={{color: colors.textSub}}>Tempo de uso:</Text>
          <Text style={styles.valHighlight}>{energiaTempo} min</Text>
        </View>
        <Slider minimumValue={1} maximumValue={480} step={1} value={energiaTempo} onValueChange={setEnergiaTempo} minimumTrackTintColor={colors.gold} thumbTintColor={colors.gold} />
      </View>

      <View style={styles.resultGrid}>
        <View style={[styles.resCard, { backgroundColor: colors.gold + '12', borderColor: colors.gold + '38', marginRight: 10 }]}>
          <Text style={styles.resLabel}>Consumo</Text>
          <Text style={[styles.resVal, {color: colors.gold}]}>{kWh} kWh</Text>
        </View>
        <View style={[styles.resCard, { backgroundColor: colors.teal + '12', borderColor: colors.teal + '38' }]}>
          <Text style={styles.resLabel}>Custo</Text>
          <Text style={[styles.resVal, {color: colors.teal}]}>R$ {custo}</Text>
        </View>
      </View>

      <View style={styles.voceSabiaBox}>
        <Text style={styles.voceSabiaTitle}>🧠 Você sabia?</Text>
        <Text style={styles.voceSabiaText}>Um carregador esquecido na tomada continua consumindo cerca de 0,26 Watts por hora, mesmo sem o celular conectado! É o famoso "Consumo Vampiro".</Text>
      </View>
    </ScrollView>
  );
}
