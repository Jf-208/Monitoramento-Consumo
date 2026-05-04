// Profile/index.js
// Tela de Perfil do usuario com card unico de resumo: consumo total historico,
// valor total gasto (agua + energia + outros em R$), e nivel sustentavel.
// Inclui botao de apagar conta no menu de configuracoes.
// Foto de perfil salva no AsyncStorage por usuario.
import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Switch, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../../contexts/AuthContext';
import { ThemeContext } from '../../contexts/ThemeContext';
import { ConsumptionContext } from '../../contexts/ConsumptionContext';
import { getPerfilStyles } from '../../styles/screensStyles';
import ScreenScrollView from '../../components/layout/ScreenScrollView';
import { calcularNivel } from '../../utils/sustainability';
import api from '../../services/api';

export default function PerfilScreen({ navigation }) {
  const { user, logout } = useContext(AuthContext);
  const { colors, isDark, toggleTheme } = useContext(ThemeContext);
  const { consumoSemanalReal, historicoTotal } = useContext(ConsumptionContext);

  const styles = getPerfilStyles(colors);

  // Nivel sustentavel — calculado com dados reais do backend
  const nivel = calcularNivel(
    consumoSemanalReal.percentualAgua ?? 0,
    consumoSemanalReal.percentualEnergia ?? 0
  );

  // Foto de perfil
  const [photoUri, setPhotoUri] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem(`@profilePhoto_${user?.id}`).then(uri => {
      if (uri) setPhotoUri(uri);
    });
  }, [user?.id]);

  const handleAlterarFoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissao negada', 'Permita o acesso a galeria nas configuracoes do dispositivo.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets[0]) {
      const uri = result.assets[0].uri;
      await AsyncStorage.setItem(`@profilePhoto_${user?.id}`, uri);
      setPhotoUri(uri);
    }
  };

  // ─── APAGAR CONTA ─────────────────────────────────────────────────────────
  const handleApagarConta = () => {
    Alert.alert(
      'Apagar Conta',
      'Esta ação é permanente e irá deletar todos os seus dados. Tem certeza?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Apagar Definitivamente',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/consumo/usuario/${user.id}`);
              await logout(); // limpa AsyncStorage e redireciona para login
            } catch (e) {
              Alert.alert('Erro', 'Não foi possível apagar a conta. Tente novamente.');
            }
          },
        },
      ]
    );
  };

  return (
    <ScreenScrollView
      contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 4 }}
    >
      {/* ─── SECAO 1: Avatar + nome + email ─── */}
      <TouchableOpacity onPress={handleAlterarFoto} style={{ position: 'relative', alignSelf: 'center', marginBottom: 16, marginTop: 12 }}>
        {photoUri
          ? <Image source={{ uri: photoUri }} style={{ width: 90, height: 90, borderRadius: 45 }} />
          : <View style={{ width: 90, height: 90, borderRadius: 45, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.border }}>
              <Text style={{ fontSize: 32, color: colors.blue, fontWeight: '700' }}>
                {user?.nome?.[0]?.toUpperCase() || 'U'}
              </Text>
            </View>
        }
        <View style={{ position: 'absolute', bottom: 0, right: 0, backgroundColor: colors.blue, borderRadius: 12, padding: 4 }}>
          <Ionicons name="camera" size={14} color="#fff" />
        </View>
      </TouchableOpacity>

      <Text style={[styles.name, { textAlign: 'center' }]}>{user?.nome || 'Usuario'}</Text>
      <Text style={[styles.email, { textAlign: 'center', marginBottom: 16 }]}>{user?.email || 'email@exemplo.com'}</Text>

      {/* ─── CARD UNICO: RESUMO COMPLETO ─── */}
      <View style={{
        backgroundColor: colors.card,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
      }}>

        {/* SECAO 1: VALOR TOTAL GASTO */}
        <Text style={{
          color: colors.textMuted, fontSize: 10,
          textTransform: 'uppercase', letterSpacing: 1,
          marginBottom: 8,
        }}>Valor Total Gasto</Text>

        {/* Total em destaque */}
        <Text style={{
          color: colors.danger || '#E24B4A',
          fontWeight: 'bold',
          fontSize: 28,
          marginBottom: 10,
        }}>
          R$ {(historicoTotal?.gastoTotalReais || 0).toFixed(2)}
        </Text>

        {/* Breakdown por categoria */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
          <Ionicons name="water" size={16} color={colors.blue} style={{ marginRight: 8 }} />
          <Text style={{ color: colors.textSub, fontSize: 13, flex: 1 }}>
            Água: R$ {(historicoTotal?.gastoAguaReais || 0).toFixed(2)}
          </Text>
          <Text style={{ color: colors.textMuted, fontSize: 12 }}>
            {(historicoTotal?.totalAguaL || 0).toFixed(0)} L
          </Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
          <Ionicons name="flash" size={16} color={colors.gold} style={{ marginRight: 8 }} />
          <Text style={{ color: colors.textSub, fontSize: 13, flex: 1 }}>
            Energia: R$ {(historicoTotal?.gastoEnergiaReais || 0).toFixed(2)}
          </Text>
          <Text style={{ color: colors.textMuted, fontSize: 12 }}>
            {(historicoTotal?.totalEnergiaKwh || 0).toFixed(2)} kWh
          </Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
          <Ionicons name="receipt-outline" size={16} color={colors.violet || '#8B5CF6'} style={{ marginRight: 8 }} />
          <Text style={{ color: colors.textSub, fontSize: 13 }}>
            Outros: R$ {(historicoTotal?.totalOutrosReais || 0).toFixed(2)}
          </Text>
        </View>

        {/* SEPARADOR */}
        <View style={{ height: 1, backgroundColor: colors.border, marginTop: 14, marginBottom: 14 }} />

        {/* SECAO 2: NIVEL SUSTENTAVEL */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{
            width: 36, height: 36, borderRadius: 18,
            backgroundColor: nivel.cor + '22',
            alignItems: 'center', justifyContent: 'center',
            marginRight: 10,
          }}>
            <Ionicons name="leaf" size={18} color={nivel.cor} />
          </View>
          <View style={{ flexShrink: 1 }}>
            <Text style={{ color: nivel.cor, fontSize: 14, fontWeight: 'bold' }}>
              Nivel: {nivel.label}
            </Text>
            <Text style={{ color: colors.textSub, fontSize: 11, marginTop: 2 }}>
              {nivel.descricao}
            </Text>
          </View>
        </View>

      </View>

      {/* ─── SECAO 5: Menu de configuracoes ─── */}
      <View style={styles.menuCard}>
        <View style={styles.menuItem}>
          <Text style={styles.menuText}>{isDark ? 'Modo Escuro' : 'Modo Claro'}</Text>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: colors.border, true: colors.blue }}
          />
        </View>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('ChangePassword')}>
          <Text style={styles.menuText}>Alterar Senha</Text>
          <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Privacy')}>
          <Text style={styles.menuText}>Privacidade</Text>
          <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuItem, { borderBottomWidth: 0 }]}
          onPress={() => navigation.navigate('Help')}
        >
          <Text style={styles.menuText}>Ajuda</Text>
          <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
        </TouchableOpacity>

        {/* Botao Apagar Conta */}
        <TouchableOpacity
          style={[styles.menuItem, { marginTop: 4, borderBottomWidth: 0 }]}
          onPress={handleApagarConta}
        >
          <Text style={[styles.menuText, { color: colors.danger || '#E24B4A' }]}>
            Apagar Conta
          </Text>
          <Ionicons name="trash-outline" size={18} color={colors.danger || '#E24B4A'} />
        </TouchableOpacity>
      </View>

      {/* ─── SECAO 6: Botao logout ─── */}
      <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
        <Text style={styles.logoutText}>Sair da conta</Text>
      </TouchableOpacity>
    </ScreenScrollView>
  );
}
