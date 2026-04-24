// AppNavigator.js
// Componente raiz de navegação (Navegador Stack).
// Gerencia as rotas baseado no estado de autenticação:
// - Se não logado: Mostra Login, Cadastro, Recuperar Senha.
// - Se logado: Mostra as abas principais (MainTabs) e telas internas (Water, Energy, etc).
import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ActivityIndicator, View } from 'react-native';

import { AuthContext } from '../contexts/AuthContext';
import { ThemeContext } from '../contexts/ThemeContext';

// Screens
import LoginScreen from '../screens/Login';
import RegisterScreen from '../screens/Register';
import MainTabs from './MainTabs';
import AguaScreen from '../screens/Water';
import EnergiaScreen from '../screens/Energy';
import DicasScreen from '../screens/Tips';
import PrivacidadeScreen from '../screens/Privacy';
import AjudaScreen from '../screens/Help';
import AlterarSenhaScreen from '../screens/ChangePassword';
import EsqueciSenhaScreen from '../screens/ForgotPassword';

const Stack = createStackNavigator();

export default function AppNavigator() {
  const { user, isLoading } = useContext(AuthContext);
  const { colors } = useContext(ThemeContext);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.bg }}>
        <ActivityIndicator size="large" color={colors.blue} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          // Authenticated Stack
          <>
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen name="Water" component={AguaScreen} />
            <Stack.Screen name="Energy" component={EnergiaScreen} />
            <Stack.Screen name="Tips" component={DicasScreen} />
            <Stack.Screen name="Privacy" component={PrivacidadeScreen} />
            <Stack.Screen name="Help" component={AjudaScreen} />
            <Stack.Screen name="ChangePassword" component={AlterarSenhaScreen} />
          </>
        ) : (
          // Auth Stack
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="ForgotPassword" component={EsqueciSenhaScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
