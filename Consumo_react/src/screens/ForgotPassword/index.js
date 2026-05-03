// EsqueciSenhaScreen.js
// Tela de recuperação de senha em 2 etapas:
//   Etapa 1: Usuário digita o e-mail → recebe código de 6 dígitos
//   Etapa 2: Usuário digita o código + nova senha → senha redefinida

import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet, Platform } from 'react-native';
import { ThemeContext } from '../../contexts/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenScrollView from '../../components/layout/ScreenScrollView';
import PasswordInput from '../../components/basic/PasswordInput';
import api from '../../services/api';

export default function EsqueciSenhaScreen({ navigation }) {
  const { colors } = useContext(ThemeContext);

  // Controle de etapas
  const [etapa, setEtapa] = useState(1); // 1 = digitar email, 2 = digitar código + nova senha
  const [loading, setLoading] = useState(false);

  // Campos
  const [email, setEmail] = useState('');
  const [codigo, setCodigo] = useState('');
  const [novaSenha, setNovaSenha] = useState('');

  // ETAPA 1: Enviar código para o e-mail
  const handleEnviarCodigo = async () => {
    if (!email) {
      alert('Digite seu e-mail!');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/auth/esqueci-senha', { email });
      alert('Sucesso: ' + res.data.message);
      setEtapa(2); // Avança para a etapa 2
    } catch (error) {
      alert('Erro: ' + (error.response?.data?.detail || 'Erro ao enviar código'));
    }
    setLoading(false);
  };

  // ETAPA 2: Verificar código e redefinir senha
  const handleRedefinir = async () => {
    if (!codigo || !novaSenha) {
      alert('Preencha todos os campos!');
      return;
    }
    if (novaSenha.length < 4) {
      alert('A nova senha deve ter pelo menos 4 caracteres!');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/auth/verificar-codigo', {
        email,
        codigo,
        nova_senha: novaSenha,
      });
      alert('Sucesso: ' + res.data.message);
      navigation.navigate('Login'); // Volta para o login
    } catch (error) {
      alert('Erro: ' + (error.response?.data?.detail || 'Erro ao redefinir senha'));
    }
    setLoading(false);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bg,
      padding: 24,
      justifyContent: 'center',
      // FIX WEB: sem height explícito, o container não preenche a tela na web
      ...Platform.select({
        web: { height: '100vh', minHeight: '100vh' },
        default: {},
      }),
    },
    title: { fontSize: 28, fontWeight: '800', color: colors.text, marginBottom: 8 },
    subtitle: { fontSize: 15, color: colors.textSub, marginBottom: 32, lineHeight: 22 },
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
    backBtn: { marginTop: 24, alignItems: 'center' },
    backText: { color: colors.textSub, fontSize: 14 },
    backHighlight: { color: colors.blue, fontWeight: '700' },
    etapaIndicator: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: 24,
    },
    dot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      marginHorizontal: 4,
    },
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenScrollView
        contentContainerStyle={{ padding: 24, justifyContent: 'center', flexGrow: 1 }}
      >
        {/* Indicador de etapa */}
        <View style={styles.etapaIndicator}>
          <View style={[styles.dot, { backgroundColor: etapa >= 1 ? colors.blue : colors.border }]} />
          <View style={[styles.dot, { backgroundColor: etapa >= 2 ? colors.blue : colors.border }]} />
        </View>

        {etapa === 1 ? (
          <>
            <Text style={styles.title}>Recuperar senha</Text>
            <Text style={styles.subtitle}>
              Digite seu e-mail cadastrado. Enviaremos um código de 6 dígitos para você.
            </Text>

            <TextInput
              style={styles.input}
              placeholder="E-mail"
              placeholderTextColor={colors.textMuted}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <TouchableOpacity style={styles.button} onPress={handleEnviarCodigo} disabled={loading}>
              {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Enviar Código</Text>}
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.title}>Código enviado!</Text>
            <Text style={styles.subtitle}>
              Verifique seu e-mail ({email}) e digite o código de 6 dígitos abaixo.
            </Text>

            <TextInput
              style={[styles.input, { textAlign: 'center', fontSize: 24, letterSpacing: 8 }]}
              placeholder="000000"
              placeholderTextColor={colors.textMuted}
              value={codigo}
              onChangeText={setCodigo}
              keyboardType="number-pad"
              maxLength={6}
            />

            <PasswordInput
              value={novaSenha}
              onChangeText={setNovaSenha}
              placeholder="Nova Senha"
            />

            <TouchableOpacity style={styles.button} onPress={handleRedefinir} disabled={loading}>
              {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Redefinir Senha</Text>}
            </TouchableOpacity>

            <TouchableOpacity style={styles.backBtn} onPress={() => setEtapa(1)}>
              <Text style={styles.backText}>Não recebeu? <Text style={styles.backHighlight}>Reenviar</Text></Text>
            </TouchableOpacity>
          </>
        )}

        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>Voltar ao <Text style={styles.backHighlight}>Login</Text></Text>
        </TouchableOpacity>
      </ScreenScrollView>
    </SafeAreaView>
  );
}
