import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { AuthContext } from '../contexts/AuthContext';
import { ThemeContext } from '../contexts/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';

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

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.bg, padding: 24 },
    title: { fontSize: 24, fontWeight: 'bold', color: colors.text, marginBottom: 24, fontFamily: 'Sora-Bold' },
    input: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 16, padding: 16, color: colors.text, marginBottom: 16 },
    button: { backgroundColor: colors.blue, padding: 16, borderRadius: 16, alignItems: 'center', marginTop: 8 },
    buttonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' }
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={styles.container}>
        <Text style={styles.title}>Alterar Senha</Text>
        <TextInput
          style={styles.input}
          placeholder="Senha Atual"
          placeholderTextColor={colors.textMuted}
          secureTextEntry
          value={senhaAtual}
          onChangeText={setSenhaAtual}
        />
        <TextInput
          style={styles.input}
          placeholder="Nova Senha"
          placeholderTextColor={colors.textMuted}
          secureTextEntry
          value={novaSenha}
          onChangeText={setNovaSenha}
        />
        <TouchableOpacity style={styles.button} onPress={handleSalvar} disabled={loading}>
          {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Salvar Nova Senha</Text>}
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.border, marginTop: 16 }]} onPress={() => navigation.goBack()}>
          <Text style={{ color: colors.text, fontSize: 16, fontWeight: '600' }}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
