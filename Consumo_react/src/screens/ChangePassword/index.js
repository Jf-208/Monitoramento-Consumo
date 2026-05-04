// ChangePassword/index.js
// Tela para Alterar a Senha (com o usuario ja logado).
// Solicita a senha atual e a nova senha com PasswordInput (toggle de visibilidade).
// Feedback de erro/validacao via InlineMessage (sem alert nativo).
import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';
import { AuthContext } from '../../contexts/AuthContext';
import { ThemeContext } from '../../contexts/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenScrollView from '../../components/layout/ScreenScrollView';
import PasswordInput from '../../components/basic/PasswordInput';
import InlineMessage from '../../components/basic/InlineMessage';

export default function AlterarSenhaScreen({ navigation }) {
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState(null); // { tipo, texto }
  const { alterarSenha } = useContext(AuthContext);
  const { colors } = useContext(ThemeContext);

  const handleSalvar = async () => {
    setMensagem(null);

    if (!senhaAtual) {
      setMensagem({ tipo: 'aviso', texto: 'Informe sua senha atual.' });
      return;
    }
    if (!novaSenha || novaSenha.length < 4) {
      setMensagem({ tipo: 'aviso', texto: 'A nova senha deve ter pelo menos 4 caracteres.' });
      return;
    }
    if (senhaAtual === novaSenha) {
      setMensagem({ tipo: 'aviso', texto: 'A nova senha deve ser diferente da senha atual.' });
      return;
    }

    setLoading(true);
    const res = await alterarSenha(senhaAtual, novaSenha);
    setLoading(false);

    if (res.success) {
      setMensagem({ tipo: 'sucesso', texto: 'Senha alterada com sucesso!' });
      setTimeout(() => navigation.goBack(), 1800);
    } else {
      const msgErro = res.message?.toLowerCase().includes('incorreta')
        ? 'Senha atual incorreta. Verifique e tente novamente.'
        : (res.message || 'Erro ao alterar senha.');
      setMensagem({ tipo: 'erro', texto: msgErro });
    }
  };

  const styles = ScaledSheet.create({
    container: { flex: 1, backgroundColor: colors.bg, padding: '24@ms' },
    title: { fontSize: '24@ms', fontWeight: 'bold', color: colors.text, marginBottom: '24@vs' },
    button: { backgroundColor: colors.blue, padding: '16@ms', borderRadius: '16@s', alignItems: 'center', marginTop: '8@vs' },
    buttonText: { color: '#FFF', fontSize: '16@ms', fontWeight: 'bold' }
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenScrollView
        contentContainerStyle={{ padding: 24 }}
      >
        <Text style={styles.title}>Alterar Senha</Text>

        {/* Feedback in-app */}
        {mensagem && (
          <InlineMessage tipo={mensagem.tipo} mensagem={mensagem.texto} style={{ marginBottom: 20 }} />
        )}

        <PasswordInput
          value={senhaAtual}
          onChangeText={(t) => { setSenhaAtual(t); setMensagem(null); }}
          placeholder="Senha Atual"
        />
        <PasswordInput
          value={novaSenha}
          onChangeText={(t) => { setNovaSenha(t); setMensagem(null); }}
          placeholder="Nova Senha"
        />
        <TouchableOpacity
          style={styles.button}
          onPress={handleSalvar}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading
            ? <ActivityIndicator color="#FFF" />
            : <Text style={styles.buttonText}>Salvar Nova Senha</Text>
          }
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.border, marginTop: 16 }]} onPress={() => navigation.goBack()}>
          <Text style={{ color: colors.text, fontSize: 16, fontWeight: '600' }}>Cancelar</Text>
        </TouchableOpacity>
      </ScreenScrollView>
    </SafeAreaView>
  );
}
