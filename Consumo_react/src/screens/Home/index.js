// Home/index.js
// Tela principal (Dashboard) exibida apos o login.
// Exibe nivel sustentavel calculado dinamicamente, estatisticas reais
// de consumo semanal do backend, e uma "Dica do Dia" que muda a cada 24h.
import React, { useContext, useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, ActivityIndicator, Platform } from 'react-native';
import { MotiView } from 'moti';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../../contexts/AuthContext';
import { ThemeContext } from '../../contexts/ThemeContext';
import { ConsumptionContext } from '../../contexts/ConsumptionContext';
import { getHomeStyles } from '../../styles/screensStyles';
import StatBar from '../../components/intermediate/StatBar';
import { DICAS } from '../../constants/data';
import { calcularNivel } from '../../utils/sustainability';

// Intervalo da dica diaria
const UM_DIA_MS = 24 * 60 * 60 * 1000;

export default function HomeScreen({ navigation }) {
  const { user }    = useContext(AuthContext);
  const { colors }  = useContext(ThemeContext);
  const {
    consumoSemanalReal,
    isLoadingBackend,
  } = useContext(ConsumptionContext);

  const styles = getHomeStyles(colors);

  // Nivel sustentavel calculado em tempo real
  const nivel = calcularNivel(
    consumoSemanalReal.percentualAgua || 0,
    consumoSemanalReal.percentualEnergia || 0
  );

  // Dica do Dia — filtra alertas (queremos dicas positivas na Home)
  const dicasValidas = DICAS.filter(d => d.categoria !== 'alerta');
  const [dicaDoDia, setDicaDoDia] = useState(null);

  // Chaves isoladas por usuario (PASSO 8)
  const DICA_KEY           = `@dicaDoDia_${user?.id ?? 'guest'}`;
  const DICA_TIMESTAMP_KEY = `@dicaDoDiaTimestamp_${user?.id ?? 'guest'}`;

  useEffect(() => {
    const carregarDicaDoDia = async () => {
      try {
        const agora           = Date.now();
        const ultimoTimestamp = await AsyncStorage.getItem(DICA_TIMESTAMP_KEY);
        const dicaSalva       = await AsyncStorage.getItem(DICA_KEY);

        if (ultimoTimestamp && dicaSalva) {
          const passado = agora - parseInt(ultimoTimestamp, 10);
          if (passado < UM_DIA_MS) {
            setDicaDoDia(JSON.parse(dicaSalva));
            return;
          }
        }

        const novaDica = dicasValidas[Math.floor(Math.random() * dicasValidas.length)];
        setDicaDoDia(novaDica);
        await AsyncStorage.setItem(DICA_KEY, JSON.stringify(novaDica));
        await AsyncStorage.setItem(DICA_TIMESTAMP_KEY, String(agora));
      } catch (error) {
        setDicaDoDia(dicasValidas[0] || null);
      }
    };

    carregarDicaDoDia();
  }, [user?.id]);

  // FIX WEB: overflow:'auto' habilita scroll com mouse wheel
  const webScrollStyle = Platform.select({
    web: { overflow: 'auto', height: '100%' },
    default: {},
  });

  return (
    <ScrollView
      style={[styles.container, webScrollStyle]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={Platform.OS !== 'web'}
      nestedScrollEnabled={true}
      scrollEventThrottle={16}
      overScrollMode="never"
      bounces={false}
      keyboardShouldPersistTaps="handled"
    >
      <View style={{ alignItems: 'center', marginBottom: 16, marginTop: 8, marginLeft: -15 }}>
        <Image
          source={require('../../../assets/Wave2.png')}
          style={{ width: 220, height: 100 }}
          resizeMode="contain"
        />
      </View>
      <Text style={styles.greeting}>Ola, {user?.nome || 'Usuario'}</Text>
      <Text style={styles.title}>Seu painel</Text>

      {/* Card de Nivel Sustentavel — animado */}
      <MotiView
        from={{ opacity: 0, translateY: 12 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 500, delay: 100 }}
      >
        <View style={[styles.heroCard, { borderLeftWidth: 4, borderLeftColor: nivel.cor }]}>
          <Text style={styles.heroSubtitle}>Nivel sustentavel</Text>
          <Text style={[styles.heroTitle, { color: nivel.cor }]}>{nivel.label}</Text>
          <Text style={{ color: colors.textSub, fontSize: 13, marginTop: 4 }}>{nivel.descricao}</Text>
        </View>
      </MotiView>

      {/* Consumo real da semana (do backend) */}
      <Text style={styles.sectionTitle}>Esta semana</Text>
      <MotiView
        from={{ opacity: 0, translateY: 8 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 400, delay: 300 }}
      >
        <View style={styles.statsCard}>
          {isLoadingBackend ? (
            <View style={{ alignItems: 'center', paddingVertical: 20 }}>
              <ActivityIndicator size="small" color={colors.blue} />
              <Text style={{ color: colors.textMuted, marginTop: 8, fontSize: 12 }}>
                Carregando dados...
              </Text>
            </View>
          ) : (
            <>
              <StatBar
                label="Consumo de Agua"
                value={consumoSemanalReal.agua}
                max={consumoSemanalReal.metaAguaL || 700}
                color={colors.blue}
                unit="L"
              />
              <StatBar
                label="Consumo de Energia"
                value={consumoSemanalReal.energia}
                max={consumoSemanalReal.metaEnergiaKwh || 15}
                color={colors.gold}
                unit="kWh"
              />
            </>
          )}
        </View>
      </MotiView>

      {/* Dica do Dia */}
      {dicaDoDia && (
        <>
          <Text style={styles.sectionTitle}>Dica do dia</Text>
        <MotiView
          from={{ opacity: 0, translateY: 8 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 400, delay: 500 }}
        >
          <View style={[
            styles.statsCard,
            {
              borderLeftWidth: 4,
              borderLeftColor: dicaDoDia.cor || colors.teal,
              paddingVertical: 14,
            },
          ]}>
            {dicaDoDia.icon ? (
              <Ionicons name={dicaDoDia.icon} size={24} color={dicaDoDia.cor || colors.teal} style={{ marginBottom: 6 }} />
            ) : null}
            <Text style={{ fontWeight: 'bold', color: colors.text, fontSize: 15, marginBottom: 4 }}>
              {dicaDoDia.title}
            </Text>
            <Text style={{ color: colors.textSub, fontSize: 13, lineHeight: 20 }}>
              {dicaDoDia.desc}
            </Text>
          </View>
        </MotiView>
        </>
      )}
    </ScrollView>
  );
}
