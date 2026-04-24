// PerfilScreen.js
// Tela de Perfil do usuário com dados de economia, gamificação e configurações.
//
// FLUXO DE DADOS (para explicar ao professor):
//   1. O ConsumptionContext carrega dados do AsyncStorage ao iniciar o app
//   2. Quando o usuário navega para o Perfil, os valores já estão prontos
//   3. A gamificação (nível) é calculada em tempo real a partir desses dados
//   4. O switch "Modo Escuro/Claro" altera o ThemeContext globalmente

import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { AuthContext } from '../contexts/AuthContext';
import { ThemeContext } from '../contexts/ThemeContext';
import { ConsumptionContext } from '../contexts/ConsumptionContext';
import { getPerfilStyles } from '../styles/screensStyles';
import Chip from '../components/basicos/Chip';

export default function PerfilScreen({ navigation }) {
  const { user, logout } = useContext(AuthContext);
  const { colors, isDark, toggleTheme } = useContext(ThemeContext);
  // Dados persistidos: vêm do AsyncStorage via ConsumptionContext
  const { aguaPoupada, energiaPoupada } = useContext(ConsumptionContext);

  const styles = getPerfilStyles(colors);

  // ─── LÓGICA DE GAMIFICAÇÃO ─────────────────────
  // O nível muda automaticamente conforme o usuário economiza recursos.
  // Os thresholds podem ser ajustados conforme necessário.
  let nivel = "Iniciante Sustentável";
  let nivelSub = "Continue assim para alcançar Pro!";
  let nivelIcon = "🌱";

  if (aguaPoupada > 500 || energiaPoupada > 50) {
    nivel = "Mestre Wavunder";
    nivelSub = "Você é um herói do meio ambiente!";
    nivelIcon = "🌍";
  } else if (aguaPoupada > 100 || energiaPoupada > 10) {
    nivel = "Entusiasta Eco";
    nivelSub = "Ótimo trabalho, rumo ao topo!";
    nivelIcon = "🌳";
  }

  return (
    <ScrollView
      // flex: 1 no style = limita a altura ao espaço disponível
      // SEM flexGrow no contentContainerStyle — na web ele impede o scroll!
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 16 }}
      showsVerticalScrollIndicator={false}
    >
      {/* HEADER DO PERFIL — sem botão voltar (a BottomNav já navega) */}
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>👤</Text>
        </View>
        <Text style={styles.name}>{user?.nome || 'Usuário'}</Text>
        <Text style={styles.email}>{user?.email || 'email@exemplo.com'}</Text>
      </View>

      {/* CARDS DE ECONOMIA — dados do AsyncStorage via Context */}
      <Text style={styles.economizadosLabel}>Economizados</Text>
      <View style={styles.chipsRow}>
        <Chip icon="💧" label="Água" value={`${aguaPoupada} L`} color={colors.blue} />
        <Chip icon="⚡" label="Energia" value={`${energiaPoupada} kWh`} color={colors.gold} />
      </View>

      {/* CARD DE NÍVEL — gamificação dinâmica */}
      <View style={styles.levelCard}>
        <Text style={styles.levelIcon}>{nivelIcon}</Text>
        <View style={{ flexShrink: 1 }}>
          <Text style={styles.levelTitle}>Nível: {nivel}</Text>
          <Text style={styles.levelSub}>{nivelSub}</Text>
        </View>
      </View>

      {/* MENU DE CONFIGURAÇÕES */}
      <View style={styles.menuCard}>
        {/* Toggle de tema: texto muda dinamicamente */}
        <View style={styles.menuItem}>
          <Text style={styles.menuText}>{isDark ? 'Modo Escuro' : 'Modo Claro'}</Text>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: colors.border, true: colors.blue }}
          />
        </View>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('AlterarSenha')}>
          <Text style={styles.menuText}>Alterar Senha</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Privacidade')}>
          <Text style={styles.menuText}>Privacidade</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuItem, { borderBottomWidth: 0 }]}
          onPress={() => navigation.navigate('Ajuda')}
        >
          <Text style={styles.menuText}>Ajuda</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
      </View>

      {/* BOTÃO LOGOUT */}
      <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
        <Text style={styles.logoutText}>Sair da conta</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
