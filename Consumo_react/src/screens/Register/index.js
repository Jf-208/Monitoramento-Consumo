// Register/index.js
// Tela de Cadastro de novos usuarios.
// Contem formulario (nome, e-mail, senha) com PasswordInput e toggle de visibilidade.
// Feedback de erro/validacao via InlineMessage (sem alert nativo).
import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';
import { AuthContext } from '../../contexts/AuthContext';
import { ThemeContext } from '../../contexts/ThemeContext';
import PasswordInput from '../../components/basic/PasswordInput';
import InlineMessage from '../../components/basic/InlineMessage';

export default function RegisterScreen({ navigation }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState(null); // { tipo, texto }
  
  const { register } = useContext(AuthContext);
  const { colors } = useContext(ThemeContext);

  const handleRegister = async () => {
    setMensagem(null);

    if (!nome.trim()) {
      setMensagem({ tipo: 'aviso', texto: 'Informe seu nome completo.' });
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setMensagem({ tipo: 'aviso', texto: 'Informe um e-mail válido.' });
      return;
    }
    if (!senha || senha.length < 4) {
      setMensagem({ tipo: 'aviso', texto: 'A senha deve ter pelo menos 4 caracteres.' });
      return;
    }

    setLoading(true);
    const res = await register(nome.trim(), email.trim().toLowerCase(), senha);
    setLoading(false);

    if (res.success) {
      setMensagem({ tipo: 'sucesso', texto: 'Conta criada com sucesso! Redirecionando...' });
      setTimeout(() => navigation.navigate('Login'), 1800);
    } else {
      const msgErro = res.message?.includes('já cadastrado')
        ? 'Este e-mail já possui uma conta. Tente fazer login.'
        : (res.message || 'Erro ao criar conta. Tente novamente.');
      setMensagem({ tipo: 'erro', texto: msgErro });
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
      opacity: loading ? 0.75 : 1,
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

      {/* Feedback in-app */}
      {mensagem && (
        <InlineMessage tipo={mensagem.tipo} mensagem={mensagem.texto} />
      )}

      <TextInput
        style={styles.input}
        placeholder="Nome"
        placeholderTextColor={colors.textMuted}
        value={nome}
        onChangeText={(t) => { setNome(t); setMensagem(null); }}
      />

      <TextInput
        style={styles.input}
        placeholder="E-mail"
        placeholderTextColor={colors.textMuted}
        value={email}
        onChangeText={(t) => { setEmail(t); setMensagem(null); }}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      
      <PasswordInput
        value={senha}
        onChangeText={(t) => { setSenha(t); setMensagem(null); }}
        placeholder="Senha"
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleRegister}
        disabled={loading}
        activeOpacity={0.8}
      >
        {loading
          ? <ActivityIndicator color="#FFF" />
          : <Text style={styles.buttonText}>Cadastrar</Text>
        }
      </TouchableOpacity>

      <TouchableOpacity style={styles.link} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.linkText}>
          Ja tem uma conta? <Text style={styles.linkHighlight}>Faca login</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}
