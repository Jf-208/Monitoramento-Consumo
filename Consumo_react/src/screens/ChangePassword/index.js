// ChangePassword/index.js
// Tela para Alterar a Senha (com o usuario ja logado).
// Solicita a senha atual e a nova senha com PasswordInput (toggle de visibilidade).
import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';
import { AuthContext } from '../../contexts/AuthContext';
import { ThemeContext } from '../../contexts/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenScrollView from '../../components/layout/ScreenScrollView';
import PasswordInput from '../../components/basic/PasswordInput';

export default function AlterarSenhaScreen({ navigation }) {
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const { alterarSenha } = useContext(AuthContext);
  const { colors } = useContext(ThemeContext);

  const handleSalvar = async () => {
    if (!senhaAtual || !novaSenha) {
      alert('Preencha os dois campos!');
      return;
    }
    setLoading(true);
    const res = await alterarSenha(senhaAtual, novaSenha);
    setLoading(false);
    if (res.success) {
      alert('Sucesso: ' + res.message);
      navigation.goBack();
    } else {
      alert('Erro: ' + res.message);
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
        <PasswordInput
          value={senhaAtual}
          onChangeText={setSenhaAtual}
          placeholder="Senha Atual"
        />
        <PasswordInput
          value={novaSenha}
          onChangeText={setNovaSenha}
          placeholder="Nova Senha"
        />
        <TouchableOpacity style={styles.button} onPress={handleSalvar} disabled={loading}>
          {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Salvar Nova Senha</Text>}
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.border, marginTop: 16 }]} onPress={() => navigation.goBack()}>
          <Text style={{ color: colors.text, fontSize: 16, fontWeight: '600' }}>Cancelar</Text>
        </TouchableOpacity>
      </ScreenScrollView>
    </SafeAreaView>
  );
}
