// Profile/index.js
// Tela de Perfil do usuario com card unico de resumo: consumo total historico,
// dinheiro economizado, e nivel sustentavel.
// Usa calcularNivel() e calcularEconomiaReais() do sustainability.js.
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
import { calcularNivel, calcularEconomiaReais } from '../../utils/sustainability';

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

        {/* SECAO 1: CONSUMO TOTAL HISTORICO */}
        <Text style={{
          color: colors.textMuted, fontSize: 10,
          textTransform: 'uppercase', letterSpacing: 1,
          marginBottom: 10,
        }}>Consumo Total</Text>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 }}>
          <View style={{ alignItems: 'center', flex: 1 }}>
            <Ionicons name="water" size={18} color={colors.blue} />
            <Text style={{ color: colors.blue, fontWeight: 'bold', fontSize: 15, marginTop: 4 }}>
              {(historicoTotal?.totalAguaL || 0).toFixed(0)} L
            </Text>
            <Text style={{ color: colors.textMuted, fontSize: 10, marginTop: 2 }}>Agua</Text>
          </View>
          <View style={{ alignItems: 'center', flex: 1 }}>
            <Ionicons name="flash" size={18} color={colors.gold} />
            <Text style={{ color: colors.gold, fontWeight: 'bold', fontSize: 15, marginTop: 4 }}>
              {(historicoTotal?.totalEnergiaKwh || 0).toFixed(2)} kWh
            </Text>
            <Text style={{ color: colors.textMuted, fontSize: 10, marginTop: 2 }}>Energia</Text>
          </View>
          <View style={{ alignItems: 'center', flex: 1 }}>
            <Ionicons name="moon" size={18} color={colors.violet || '#A78BFA'} />
            <Text style={{ color: colors.violet || '#A78BFA', fontWeight: 'bold', fontSize: 15, marginTop: 4 }}>
              {(historicoTotal?.totalVampiroKwh || 0).toFixed(2)} kWh
            </Text>
            <Text style={{ color: colors.textMuted, fontSize: 10, marginTop: 2 }}>Stand-by</Text>
          </View>
        </View>

        {/* SEPARADOR */}
        <View style={{ height: 1, backgroundColor: colors.border, marginBottom: 14 }} />

        {/* SECAO 2: DINHEIRO ECONOMIZADO */}
        <Text style={{
          color: colors.textMuted, fontSize: 10,
          textTransform: 'uppercase', letterSpacing: 1,
          marginBottom: 8,
        }}>Dinheiro Economizado</Text>

        {(() => {
          const economia = calcularEconomiaReais(
            consumoSemanalReal.aguaPoupadaReal || 0,
            consumoSemanalReal.energiaPoupadaReal || 0,
          );
          return (
            <>
              <Text style={{
                color: colors.teal, fontWeight: 'bold', fontSize: 28,
                marginBottom: 4,
              }}>
                R$ {economia.total.toFixed(2)}
              </Text>
              <Text style={{ color: colors.textMuted, fontSize: 12, marginBottom: 10 }}>
                Agua: R$ {economia.agua.toFixed(2)} {'  |  '} Energia: R$ {economia.energia.toFixed(2)}
              </Text>
              <View style={{
                flexDirection: 'row', alignItems: 'center',
                backgroundColor: (colors.violet || '#A78BFA') + '15',
                borderRadius: 8, padding: 8, marginBottom: 2,
              }}>
                <Ionicons name="moon" size={14} color={colors.violet || '#A78BFA'} style={{ marginRight: 6 }} />
                <Text style={{ color: colors.textMuted, fontSize: 12 }}>
                  Stand-by total: {(historicoTotal?.totalVampiroKwh || 0).toFixed(2)} kWh registrados
                </Text>
              </View>
            </>
          );
        })()}

        {/* SEPARADOR */}
        <View style={{ height: 1, backgroundColor: colors.border, marginTop: 14, marginBottom: 14 }} />

        {/* SECAO 3: NIVEL SUSTENTAVEL */}
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
      </View>

      {/* ─── SECAO 6: Botao logout ─── */}
      <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
        <Text style={styles.logoutText}>Sair da conta</Text>
      </TouchableOpacity>
    </ScreenScrollView>
  );
}
