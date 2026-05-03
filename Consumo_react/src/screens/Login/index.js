// Login/index.js
// Tela inicial de Autenticacao.
// Permite que usuarios existentes entrem informando e-mail e senha.
// Usa PasswordInput com toggle de visibilidade (eye icon).
import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Platform, Image } from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';
import { AuthContext } from '../../contexts/AuthContext';
import { ThemeContext } from '../../contexts/ThemeContext';
import PasswordInput from '../../components/basic/PasswordInput';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const { colors } = useContext(ThemeContext);

  const handleLogin = async () => {
    if (!email || !senha) return;
    setLoading(true);
    const res = await login(email, senha);
    setLoading(false);
    if (!res.success) {
      alert('Erro: ' + res.message);
    }
  };

  const styles = ScaledSheet.create({
    container: { 
      flex: 1, 
      backgroundColor: colors.bg, 
      padding: '24@ms', 
      justifyContent: 'center',
      ...Platform.select({
        web: { height: '100vh', minHeight: '100vh' },
        default: {},
      }),
    },
    title: { fontSize: '32@ms', fontWeight: '800', color: colors.text, marginBottom: '8@vs', textAlign: 'center' },
    subtitle: { fontSize: '16@ms', color: colors.textSub, marginBottom: '40@vs', textAlign: 'center' },
    input: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: '16@s',
      padding: '16@ms',
      color: colors.text,
      marginBottom: '16@vs',
      fontSize: '16@ms',
    },
    button: {
      backgroundColor: colors.blue,
      padding: '16@ms',
      borderRadius: '16@s',
      alignItems: 'center',
      marginTop: '8@vs',
    },
    buttonText: { color: '#FFF', fontSize: '16@ms', fontWeight: '700' },
    link: { marginTop: '24@vs', alignItems: 'center' },
    linkText: { color: colors.textSub, fontSize: '14@ms' },
    linkHighlight: { color: colors.blue, fontWeight: '700' }
  });

  return (
    <View style={styles.container}>
      {/* Logo centralizada */}
      <View style={{ alignItems: 'center', marginBottom: 32, marginTop: Platform.select({ web: 40, default: 20 }) }}>
        <Image
          source={require('../../../assets/icon.png')}
          style={{ width: 100, height: 100, borderRadius: 24 }}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.title}>Bem-vindo</Text>
      <Text style={styles.subtitle}>Faca login para continuar</Text>

      <TextInput
        style={styles.input}
        placeholder="E-mail"
        placeholderTextColor={colors.textMuted}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      
      <PasswordInput
        value={senha}
        onChangeText={setSenha}
        placeholder="Senha"
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Entrar</Text>}
      </TouchableOpacity>

      <TouchableOpacity style={{ marginTop: 16, alignItems: 'center' }} onPress={() => navigation.navigate('ForgotPassword')}>
        <Text style={{ color: colors.blue, fontSize: 14, fontWeight: '600' }}>Esqueceu a senha?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.link} onPress={() => navigation.navigate('Register')}>
        <Text style={styles.linkText}>
          Nao tem uma conta? <Text style={styles.linkHighlight}>Cadastre-se</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}
