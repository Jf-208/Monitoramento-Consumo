// Este arquivo cria o componente Chip, que é um pequeno bloco visual.
// Ele é considerado "básico" (ou "atom" no Atomic Design) porque não pode ser quebrado em partes menores.
// É usado para mostrar informações rápidas, como a água poupada ou o nível sustentável.

import React, { useContext } from 'react';
import { View, Text } from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';
import { ThemeContext } from '../../contexts/ThemeContext';

export default function Chip({ label, value, color, icon }) {
  // Pegamos as cores atuais do tema (Claro ou Escuro) do Contexto
  const { colors } = useContext(ThemeContext);

  const styles = ScaledSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: color + '16', // O '16' no final da cor adiciona transparência (hex alpha)
      borderColor: color + '38',
      borderWidth: 1,
      borderRadius: '12@s',
      paddingVertical: '8@vs',
      paddingHorizontal: '12@s',
      marginRight: '8@s',
      marginBottom: '8@vs',
    },
    iconText: {
      fontSize: '14@ms',
      marginRight: '6@s',
    },
    labelText: {
      color: colors.textSub,
      fontSize: '12@ms',
      marginRight: '4@s',
    },
    valueText: {
      color: color,
      fontWeight: 'bold',
      fontSize: '13@ms',
    }
  });

  return (
    <View style={styles.container}>
      {/* O operador !! converte a variável para booleano. Se existir ícone, ele renderiza */}
      {!!icon && <Text style={styles.iconText}>{icon}</Text>}
      <Text style={styles.labelText}>{label}</Text>
      <Text style={styles.valueText}>{value}</Text>
    </View>
  );
}
