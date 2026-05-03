// FAB.js
// Floating Action Button (FAB) — botão redondo "+" que expande um menu de navegação rápida.
// Usa Modal para o overlay e menu expandido, garantindo que quando fechado
// NENHUMA área do FAB intercepte toques no conteúdo abaixo (scroll, botões, etc.).
//
// ARQUITETURA ANDROID:
// - Quando fechado: só o TouchableOpacity do botão "+" existe — sem Views extras.
// - Quando aberto: Modal assume a tela inteira, itens renderizados dentro do Modal.
// - pointerEvents="box-none" no wrapper: só o botão em si captura toque.

import React, { useState, useContext } from 'react';
import {
  View, Text, TouchableOpacity, Modal,
  TouchableWithoutFeedback, Platform, StatusBar,
} from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';
import { ThemeContext } from '../../contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';

export default function FAB({ navigation }) {
  const [open, setOpen] = useState(false); // Controla se o menu está expandido
  const { colors } = useContext(ThemeContext);

  // Itens do menu — cada um navega para uma tela via Stack Navigator
  const items = [
    { id: 'Water',  icon: 'water', label: 'Agua',    color: colors.blue },
    { id: 'Energy', icon: 'flash', label: 'Energia', color: colors.gold },
    { id: 'Tips',   icon: 'bulb',  label: 'Dicas',   color: colors.teal },
  ];

  const handleSelect = (screenId) => {
    setOpen(false); // Fecha o menu antes de navegar
    navigation.navigate(screenId);
  };

  const menuBottom = 60;

  const styles = ScaledSheet.create({
    // Wrapper do botão principal — pointerEvents="box-none" é CRÍTICO:
    // faz com que apenas o TouchableOpacity filho capture toque,
    // e não a área transparente ao redor do botão.
    fabWrapper: {
      alignItems: 'center',
      justifyContent: 'center',
    },

    // Botão "+" principal
    fabButton: {
      width: '44@s',
      height: '44@s',
      borderRadius: '22@s',
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 6,
    },
    fabText: {
      color: '#FFF',
      fontSize: '24@ms',
      lineHeight: '26@ms',
    },

    // Overlay escuro do Modal — cobre tela inteira, fecha o menu ao tocar
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.75)',
    },

    // Container dos itens do menu dentro do Modal
    // Posicionado absolute no canto superior direito da tela,
    // alinhado com o botão do FAB
    menuContainer: {
      position: 'absolute',
      bottom: menuBottom,
      alignSelf: 'center',
      alignItems: 'center',
    },

    // Botão de fechar (×) dentro do Modal — substitui visualmente o "+"
    closeButton: {
      width: '44@s',
      height: '44@s',
      borderRadius: '22@s',
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 6,
      marginBottom: '20@vs',
    },

    // Cada item do menu: label de texto + botão redondo com ícone
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
      marginRight: '12@s',
      elevation: 2,
    },
    menuLabelText: {
      fontSize: '14@ms',
      fontWeight: 'bold',
    },
    menuIconBtn: {
      width: '44@s',
      height: '44@s',
      borderRadius: '22@s',
      borderWidth: 2,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surface,
      elevation: 4,
    },
  });

  return (
    // pointerEvents="box-none" = APENAS o TouchableOpacity filho captura toque.
    // A área transparente ao redor do botão NÃO bloqueia o scroll abaixo.
    <View style={styles.fabWrapper} pointerEvents="box-none">

      {/* Botão "+" principal — sempre visível */}
      <TouchableOpacity
        style={[styles.fabButton, { backgroundColor: colors.gold }]}
        onPress={() => setOpen(true)}
        activeOpacity={0.85}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {/* Modal do menu — só existe quando open=true, zero impacto no scroll quando fechado */}
      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
        statusBarTranslucent  // Garante que o Modal cubra a StatusBar no Android
      >
        {/* Overlay: fecha o menu ao tocar fora dos itens */}
        <TouchableWithoutFeedback onPress={() => setOpen(false)}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>

        {/* Itens do menu posicionados no canto superior direito */}
        <View style={styles.menuContainer} pointerEvents="box-none">

          {/* Botão "×" para fechar — no mesmo lugar visual do "+" */}
          <TouchableOpacity
            style={[styles.closeButton, { backgroundColor: colors.danger }]}
            onPress={() => setOpen(false)}
            activeOpacity={0.85}
          >
            <Text style={[styles.fabText, { transform: [{ rotate: '45deg' }] }]}>+</Text>
          </TouchableOpacity>

          {items.map((item, index) => (
            <MotiView
              key={item.id}
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 250, delay: index * 80 }}
            >
              <View style={styles.menuItem}>
                <View style={styles.menuLabel}>
                  <Text style={[styles.menuLabelText, { color: item.color }]}>
                    {item.label}
                  </Text>
                </View>
                <TouchableOpacity
                  style={[styles.menuIconBtn, { borderColor: item.color + '55' }]}
                  onPress={() => handleSelect(item.id)}
                  activeOpacity={0.8}
                >
                  <Ionicons name={item.icon} size={20} color={item.color} />
                </TouchableOpacity>
              </View>
            </MotiView>
          ))}

        </View>
      </Modal>

    </View>
  );
}
