import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { AuthContext } from '../contexts/AuthContext';
import { ThemeContext } from '../contexts/ThemeContext';

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
      // Usando alert nativo que funciona 100% dos navegadores web
      alert('Erro: ' + res.message);
    }
  };

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.bg, padding: 24, justifyContent: 'center' },
    title: { fontSize: 32, fontWeight: '800', color: colors.text, marginBottom: 8, fontFamily: 'Sora-Bold' },
    subtitle: { fontSize: 16, color: colors.textSub, marginBottom: 40 },
    input: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 16,
      padding: 16,
      color: colors.text,
      marginBottom: 16,
      fontSize: 16,
    },
    button: {
      backgroundColor: colors.blue,
      padding: 16,
      borderRadius: 16,
      alignItems: 'center',
      marginTop: 8,
    },
    buttonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
    link: { marginTop: 24, alignItems: 'center' },
    linkText: { color: colors.textSub, fontSize: 14 },
    linkHighlight: { color: colors.blue, fontWeight: '700' }
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo</Text>
      <Text style={styles.subtitle}>Faça login para continuar</Text>

      <TextInput
        style={styles.input}
        placeholder="E-mail"
        placeholderTextColor={colors.textMuted}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Senha"
        placeholderTextColor={colors.textMuted}
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Entrar</Text>}
      </TouchableOpacity>

      <TouchableOpacity style={{ marginTop: 16, alignItems: 'center' }} onPress={() => Alert.alert('Aviso', 'A recuperação de senha será implementada nas próximas atualizações!')}>
        <Text style={{ color: colors.blue, fontSize: 14, fontWeight: '600' }}>Esqueceu a senha?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.link} onPress={() => navigation.navigate('Register')}>
        <Text style={styles.linkText}>
          Não tem uma conta? <Text style={styles.linkHighlight}>Cadastre-se</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}
