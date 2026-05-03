// ScreenScrollView.js
// Componente wrapper que substitui ScrollView em todas as telas.
// Resolve scroll no Android (nestedScrollEnabled) e na Web (overflow+height).
//
// POR QUE EXISTE:
// React Native Web renderiza ScrollView como <div style="overflow:hidden">.
// No Android, ScrollView precisa de nestedScrollEnabled + sem flex:1.
// Este componente centraliza ambos os fixes em um único lugar.
// Se um bug de scroll surgir, corrigimos AQUI e todas as telas herdam.
//
// POR QUE height: '100vh' E NÃO height: '100%':
// Na web, height:'100%' só funciona se TODOS os ancestrais têm height definido.
// O Stack Navigator do @react-navigation gera divs intermediárias sem height.
// Usando '100vh' (viewport height), o ScrollView ignora a cadeia de pais
// e ocupa 100% da viewport diretamente — funciona em qualquer contexto.

import React, { useContext } from 'react';
import { ScrollView, Platform } from 'react-native';
import { ThemeContext } from '../../contexts/ThemeContext';

// ─── ESTILOS WEB: calculados uma vez fora do render ──────────────────────────
// CRÍTICO: usa '100vh' em vez de '100%' para não depender de ancestrais com height.
const webStyle = Platform.select({
  web: {
    overflow: 'auto',
    height: '100vh',
    WebkitOverflowScrolling: 'touch',
  },
  default: {},
});

const defaultContentContainer = Platform.select({
  web:     { paddingBottom: 40 },
  default: { paddingBottom: 100, flexGrow: 1 },
});

export default function ScreenScrollView({
  children,
  style,
  contentContainerStyle,
  ...props
}) {
  const { colors } = useContext(ThemeContext);

  return (
    <ScrollView
      style={[{ backgroundColor: colors.bg }, webStyle, style]}
      contentContainerStyle={[defaultContentContainer, contentContainerStyle]}
      showsVerticalScrollIndicator={Platform.OS !== 'web'}
      nestedScrollEnabled={true}
      scrollEventThrottle={16}
      overScrollMode="never"
      bounces={false}
      keyboardShouldPersistTaps="handled"
      {...props}
    >
      {children}
    </ScrollView>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COMO USAR EM TELAS NOVAS:
// 1. import ScreenScrollView from '../components/layout/ScreenScrollView';
//    (ajuste o caminho relativo conforme a pasta da tela)
// 2. Envolva o conteúdo da tela com <ScreenScrollView>
// 3. Use contentContainerStyle para padding/spacing
// 4. NÃO use flex:1 no style do ScreenScrollView
//
// Exemplo:
//   <SafeAreaView style={{ flex: 1 }} edges={['top']}>
//     <ScreenScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20 }}>
//       {/* conteúdo da tela */}
//     </ScreenScrollView>
//   </SafeAreaView>
// ─────────────────────────────────────────────────────────────────────────────
