import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ActivityIndicator, View } from 'react-native';

import { AuthContext } from '../contexts/AuthContext';
import { ThemeContext } from '../contexts/ThemeContext';

// Screens
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import MainTabs from './MainTabs';
import AguaScreen from '../screens/AguaScreen';
import EnergiaScreen from '../screens/EnergiaScreen';
import DicasScreen from '../screens/DicasScreen';
import PrivacidadeScreen from '../screens/PrivacidadeScreen';
import AjudaScreen from '../screens/AjudaScreen';
import AlterarSenhaScreen from '../screens/AlterarSenhaScreen';
import EsqueciSenhaScreen from '../screens/EsqueciSenhaScreen';

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
            <Stack.Screen name="Agua" component={AguaScreen} />
            <Stack.Screen name="Energia" component={EnergiaScreen} />
            <Stack.Screen name="Dicas" component={DicasScreen} />
            <Stack.Screen name="Privacidade" component={PrivacidadeScreen} />
            <Stack.Screen name="Ajuda" component={AjudaScreen} />
            <Stack.Screen name="AlterarSenha" component={AlterarSenhaScreen} />
          </>
        ) : (
          // Auth Stack
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="EsqueciSenha" component={EsqueciSenhaScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
