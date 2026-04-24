// Register/index.js
// Tela de Cadastro de novos usuários.
// Contém o formulário (nome, e-mail, senha) e faz a validação antes de chamar a rota /auth/register da API.
import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';
import { AuthContext } from '../../contexts/AuthContext';
import { ThemeContext } from '../../contexts/ThemeContext';

export default function RegisterScreen({ navigation }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useContext(AuthContext);
  const { colors } = useContext(ThemeContext);

  const handleRegister = async () => {
    if (!nome || !email || !senha) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }
    setLoading(true);
    const res = await register(nome, email, senha);
    setLoading(false);
    if (res.success) {
      alert('Sucesso! Conta criada. Faça login.');
      navigation.navigate('Login');
    } else {
      alert('Erro: ' + res.message);
    }
  };

  const styles = ScaledSheet.create({
    container: { flex: 1, backgroundColor: colors.bg, padding: '24@ms', justifyContent: 'center' },
    title: { fontSize: '32@ms', fontWeight: '800', color: colors.text, marginBottom: '8@vs' },
    subtitle: { fontSize: '16@ms', color: colors.textSub, marginBottom: '40@vs' },
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
      <Text style={styles.title}>Criar Conta</Text>
      <Text style={styles.subtitle}>Junte-se ao Wavunder</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome"
        placeholderTextColor={colors.textMuted}
        value={nome}
        onChangeText={setNome}
      />

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

      <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
        {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Cadastrar</Text>}
      </TouchableOpacity>

      <TouchableOpacity style={styles.link} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.linkText}>
          Já tem uma conta? <Text style={styles.linkHighlight}>Faça login</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}
