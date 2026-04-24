// Floating Action Button (FAB)
// É aquele botão redondo "+" que fica flutuando na tela.
// Usamos Modal para fazer a tela escurecer atrás dos botões quando ele é aberto.

import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, Modal, TouchableWithoutFeedback, Platform, StatusBar } from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';
import { ThemeContext } from '../../contexts/ThemeContext';

export default function FAB({ navigation }) {
  const [open, setOpen] = useState(false); // Estado para controlar se os botões estão expandidos
  const { colors } = useContext(ThemeContext);

  const items = [
    { id: 'Agua', icon: '💧', label: 'Água', color: colors.blue },
    { id: 'Energia', icon: '⚡', label: 'Energia', color: colors.gold },
    { id: 'Dicas', icon: '🌿', label: 'Dicas', color: colors.teal },
  ];

  const handleSelect = (screenId) => {
    setOpen(false); // Fecha o menu
    // Navega empurrando uma nova tela por cima das abas
    navigation.navigate(screenId);
  };

  const styles = ScaledSheet.create({
    fabButton: {
      width: '44@s',
      height: '44@s',
      borderRadius: '22@s',
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 5,
    },
    fabText: {
      color: '#FFF',
      fontSize: '24@ms',
      lineHeight: '26@ms',
    },
    menuContainer: {
      position: 'absolute',
      top: Platform.OS === 'android' ? StatusBar.currentHeight + 8 : 8,
      right: '20@s',
      alignItems: 'flex-end',
      zIndex: 100,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: '16@vs',
    },
    menuLabel: {
      backgroundColor: colors.surface,
      paddingHorizontal: '12@s',
      paddingVertical: '6@vs',
      borderRadius: '12@s',
      borderWidth: 1,
      borderColor: colors.border,
      overflow: 'hidden',
      marginRight: '12@s',
      fontSize: '14@ms',
      fontWeight: 'bold',
      elevation: 2,
    },
    menuIconBtn: {
      width: '44@s',
      height: '44@s',
      borderRadius: '22@s',
      borderWidth: 2,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surface,
    },
    overlay: {
      position: 'absolute',
      top: 0, bottom: 0, left: 0, right: 0,
      backgroundColor: 'rgba(0,0,0,0.8)', // Blur/Escurecido forte
    }
  });

  return (
    <>
      <TouchableOpacity 
        style={[styles.fabButton, { backgroundColor: open ? colors.danger : colors.gold, opacity: open ? 0 : 1 }]}
        onPress={() => setOpen(!open)}
      >
        <Text style={[styles.fabText, { transform: [{ rotate: open ? '45deg' : '0deg' }] }]}>+</Text>
      </TouchableOpacity>

      {/* O Modal sobrepõe toda a tela quando o open for verdadeiro */}
      <Modal visible={open} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={() => setOpen(false)}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
        
        <View style={styles.menuContainer}>
          <TouchableOpacity 
            style={[styles.fabButton, { backgroundColor: colors.danger, marginBottom: 20 }]}
            onPress={() => setOpen(false)}
          >
            <Text style={[styles.fabText, { transform: [{ rotate: '45deg' }] }]}>+</Text>
          </TouchableOpacity>

          {items.map((item) => (
            <View key={item.id} style={styles.menuItem}>
              <Text style={[styles.menuLabel, { color: item.color }]}>{item.label}</Text>
              <TouchableOpacity 
                style={[styles.menuIconBtn, { borderColor: item.color + '55' }]}
                onPress={() => handleSelect(item.id)}
              >
                <Text style={{ fontSize: 20 }}>{item.icon}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </Modal>
    </>
  );
}
