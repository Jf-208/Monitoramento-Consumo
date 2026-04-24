// Este arquivo cria a Barra de Status (StatBar).
// Ele é "intermediário" (ou "molecule") porque junta elementos básicos (textos e Views) para formar algo mais complexo.
// Usamos useEffect e Animated para criar a animação da barra enchendo quando a tela carrega.

import React, { useContext, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { ThemeContext } from '../../contexts/ThemeContext';

export default function StatBar({ label, value, max, color, unit }) {
  const { colors } = useContext(ThemeContext);
  
  // Animated.Value guarda um valor que o React Native consegue animar suavemente a 60 frames por segundo
  const widthAnim = useRef(new Animated.Value(0)).current;

  // Calculamos a porcentagem de consumo em relação ao limite (max)
  const pct = Math.min((value / max) * 100, 100);

  // useEffect roda a animação toda vez que a porcentagem (pct) mudar ou na primeira vez que abrir
  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: pct, // Vai do 0 atual até a porcentagem calculada
      duration: 900, // Demora 900 milissegundos
      useNativeDriver: false, // Necessário deixar falso porque estamos animando 'width' (largura)
    }).start();
  }, [pct]);

  const styles = StyleSheet.create({
    container: {
      marginBottom: 16,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    label: {
      color: colors.textSub,
      fontSize: 12,
    },
    value: {
      color: color,
      fontWeight: 'bold',
      fontSize: 13,
    },
    track: {
      height: 6,
      backgroundColor: color + '22',
      borderRadius: 8,
      overflow: 'hidden',
    },
    bar: {
      height: '100%',
      backgroundColor: color,
      borderRadius: 8,
    }
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value} {unit}</Text>
      </View>
      <View style={styles.track}>
        {/* Animated.View é uma View especial que aceita valores animados */}
        <Animated.View 
          style={[
            styles.bar, 
            { 
              // Convertendo o número (ex: 50) para string de porcentagem (ex: "50%")
              width: widthAnim.interpolate({
                inputRange: [0, 100],
                outputRange: ['0%', '100%']
              })
            }
          ]} 
        />
      </View>
    </View>
  );
}
