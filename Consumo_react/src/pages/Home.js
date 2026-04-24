// =============================================================
// PÁGINA: Home
// -------------------------------------------------------------
// Ponto de entrada do sistema de páginas do Expo.
// Esta pasta "pages" é reconhecida automaticamente pelo Expo Router.
//
// Aqui apenas re-exportamos o AppNavigator, que contém
// toda a lógica de navegação e layout do app.
//
// Em projetos maiores: este arquivo configuraria rotas com
// Stack.Navigator ou Tab.Navigator (React Navigation).
// =============================================================

import AppNavigator from "../navigations/AppNavigator";

export default function Home() {
  return <AppNavigator />;
}
