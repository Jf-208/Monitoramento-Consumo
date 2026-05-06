// Login/index.js
// Tela inicial de Autenticacao.
// Permite que usuarios existentes entrem informando e-mail e senha.
// Usa PasswordInput com toggle de visibilidade (eye icon).
// Feedback de erro/validacao via InlineMessage (sem alert nativo).
import React, { useState, useContext } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ActivityIndicator, Platform, Image, KeyboardAvoidingView,
} from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';
import { AuthContext } from '../../contexts/AuthContext';
import { ThemeContext } from '../../contexts/ThemeContext';
import PasswordInput from '../../components/basic/PasswordInput';
import InlineMessage from '../../components/basic/InlineMessage';

export default function LoginScreen({ navigation }) {
  const [email,    setEmail]    = useState('');
  const [senha,    setSenha]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const [mensagem, setMensagem] = useState(null); // { tipo, texto }

  const { login }  = useContext(AuthContext);
  const { colors } = useContext(ThemeContext);

  const handleLogin = async () => {
    setMensagem(null);

    // Validacao in-app (sem alert)
    if (!email.trim()) {
      setMensagem({ tipo: 'aviso', texto: 'Informe seu e-mail para continuar.' });
      return;
    }
    if (!senha) {
      setMensagem({ tipo: 'aviso', texto: 'Informe sua senha para continuar.' });
      return;
    }

    setLoading(true);
    const res = await login(email.trim().toLowerCase(), senha);
    setLoading(false);

    if (!res.success) {
      // Mensagem generica — nao revela qual campo esta errado
      setMensagem({
        tipo:  'erro',
        texto: 'E-mail ou senha inválidos. Verifique os dados e tente novamente.',
      });
    }
    // Se success = true, o AuthContext ja redireciona via AppNavigator
  };

  const styles = ScaledSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bg,
      padding: '24@ms',
      justifyContent: 'center',
      ...Platform.select({
        web:     { height: '100vh', minHeight: '100vh' },
        default: {},
      }),
    },
    title: { fontSize: '32@ms', fontWeight: '800', color: colors.text, marginBottom: '8@vs' },
    subtitle: {
      fontSize: '15@ms',
      color:    colors.textSub,
      marginBottom: '28@vs',
      textAlign: 'center',
    },
    input: {
      backgroundColor: colors.surface,
      borderWidth:  1,
      borderColor:  colors.border,
      borderRadius: '16@s',
      padding:      '16@ms',
      color:        colors.text,
      marginBottom: '16@vs',
      fontSize:     '16@ms',
    },
    button: {
      backgroundColor: colors.blue,
      padding:      '16@ms',
      borderRadius: '16@s',
      alignItems:   'center',
      marginTop:    '8@vs',
      opacity: loading ? 0.75 : 1,
    },
    buttonText:      { color: '#FFF', fontSize: '16@ms', fontWeight: '700' },
    link:            { marginTop: '24@vs', alignItems: 'center' },
    linkText:        { color: colors.textSub, fontSize: '14@ms' },
    linkHighlight:   { color: colors.blue, fontWeight: '700' },
  });

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Logo */}
      <View style={{ alignItems: 'center', marginBottom: -20, marginTop: Platform.select({ web: -30, default: 0 }) }}>
        <Image
          source={require('../../../assets/Wave.png')}
          style={{ width: 600, height: 350 }}
          resizeMode="contain"
        />
      </View>
      <Text style={[styles.title, { textAlign: 'center', marginBottom: 10 }]}>Login</Text>
      <Text style={[styles.subtitle, { fontSize: 16, marginTop: 16, marginBottom: 16 }]}>Preencha seus dados para entrar</Text>

      {/* Feedback in-app */}
      {mensagem && (
        <InlineMessage tipo={mensagem.tipo} mensagem={mensagem.texto} />
      )}

      <TextInput
        style={styles.input}
        placeholder="E-mail"
        placeholderTextColor={colors.textMuted}
        value={email}
        onChangeText={(t) => { setEmail(t); setMensagem(null); }}
        autoCapitalize="none"
        keyboardType="email-address"
        onSubmitEditing={() => {}}
      />

      <PasswordInput
        value={senha}
        onChangeText={(t) => { setSenha(t); setMensagem(null); }}
        placeholder="Senha"
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
        activeOpacity={0.8}
      >
        {loading
          ? <ActivityIndicator color="#FFF" />
          : <Text style={styles.buttonText}>Entrar</Text>
        }
      </TouchableOpacity>

      <TouchableOpacity
        style={{ marginTop: 16, alignItems: 'center' }}
        onPress={() => navigation.navigate('ForgotPassword')}
      >
        <Text style={{ color: colors.blue, fontSize: 14, fontWeight: '600' }}>
          Esqueceu a senha?
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.link, { marginTop: 20 }]}
        onPress={() => navigation.navigate('Register')}
      >
        <Text style={[styles.linkText, { fontSize: 16 }]}>
          Não tem uma conta?{' '}
          <Text style={[styles.linkHighlight, { fontSize: 16 }]}>Cadastre-se</Text>
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}
