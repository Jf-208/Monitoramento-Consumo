import React, { useContext } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import { ThemeContext } from '../contexts/ThemeContext';
import { ConsumptionContext } from '../contexts/ConsumptionContext';
import { getAguaStyles } from '../styles/screensStyles';

export default function AguaScreen({ navigation }) {
  const { colors } = useContext(ThemeContext);
  const { banhoTempo, setBanhoTempo } = useContext(ConsumptionContext);

  const styles = getAguaStyles(colors);

  const litros = Math.round(banhoTempo * 7);
  const economia = banhoTempo > 10
    ? `Reduzir ${banhoTempo - 10} min economiza ${(banhoTempo - 10) * 7} L`
    : "Ótimo tempo de banho! 🌟";

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={{color: colors.textSub, fontSize: 18}}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>💧 Água</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Tempo de banho</Text>
        <View style={styles.controls}>
          <TouchableOpacity style={styles.circleBtn} onPress={() => setBanhoTempo(Math.max(1, banhoTempo - 1))}>
            <Text style={styles.btnText}>-</Text>
          </TouchableOpacity>
          <View style={{flexDirection: 'row', alignItems: 'baseline'}}>
            <Text style={styles.timeText}>{banhoTempo}</Text>
            <Text style={styles.unitText}> min</Text>
          </View>
          <TouchableOpacity style={[styles.circleBtn, {borderColor: colors.blue}]} onPress={() => setBanhoTempo(Math.min(60, banhoTempo + 1))}>
            <Text style={[styles.btnText, {color: colors.blue}]}>+</Text>
          </TouchableOpacity>
        </View>
        <Slider
          minimumValue={1} maximumValue={60} step={1}
          value={banhoTempo} onValueChange={setBanhoTempo}
          minimumTrackTintColor={colors.blue}
          thumbTintColor={colors.blue}
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.resultTitle}>Você gastou</Text>
        <Text style={styles.resultValue}>💧 {litros} L</Text>
      </View>

      <View style={[styles.tipBox, { backgroundColor: banhoTempo > 10 ? colors.gold + '14' : colors.teal + '14', borderColor: banhoTempo > 10 ? colors.gold + '44' : colors.teal + '44' }]}>
        <Text style={styles.tipIcon}>{banhoTempo > 10 ? '💡' : '✅'}</Text>
        <Text style={{ flex: 1, fontSize: 14, color: banhoTempo > 10 ? colors.gold : colors.teal }}>{economia}</Text>
      </View>
    </View>
  );
}
