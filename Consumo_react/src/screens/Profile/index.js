// Profile/index.js
// Tela de Perfil do usuario com dados de economia, gamificacao, foto e configuracoes.
// Usa calcularNivel() compartilhado com a Home para nivel sustentavel.
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
import Chip from '../../components/basic/Chip';
import ScreenScrollView from '../../components/layout/ScreenScrollView';
import { calcularNivel } from '../../utils/sustainability';

export default function PerfilScreen({ navigation }) {
  const { user, logout } = useContext(AuthContext);
  const { colors, isDark, toggleTheme } = useContext(ThemeContext);
  const { aguaPoupada, energiaPoupada, consumoSemanalReal } = useContext(ConsumptionContext);

  const styles = getPerfilStyles(colors);

  // Nivel sustentavel — mesma logica da Home
  const nivel = calcularNivel(
    consumoSemanalReal.percentualAgua || 0,
    consumoSemanalReal.percentualEnergia || 0
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
      {/* Avatar com foto alteravel */}
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

      {/* Cards de economia */}
      <Text style={styles.economizadosLabel}>Economizados</Text>
      <View style={styles.chipsRow}>
        <Chip icon="" label="Agua" value={`${aguaPoupada} L`} color={colors.blue} />
        <Chip icon="" label="Energia" value={`${energiaPoupada} kWh`} color={colors.gold} />
      </View>

      {/* Consumo real da semana */}
      <View style={styles.levelCard}>
        <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: nivel.cor + '22', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
          <Ionicons name="leaf" size={20} color={nivel.cor} />
        </View>
        <View style={{ flexShrink: 1 }}>
          <Text style={styles.levelTitle}>Nivel: {nivel.label}</Text>
          <Text style={styles.levelSub}>{nivel.descricao}</Text>
        </View>
      </View>

      {/* Menu de configuracoes */}
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

      {/* Botao logout */}
      <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
        <Text style={styles.logoutText}>Sair da conta</Text>
      </TouchableOpacity>
    </ScreenScrollView>
  );
}
