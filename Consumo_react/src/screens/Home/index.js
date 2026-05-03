// Home/index.js
// Tela principal (Dashboard geral) exibida após o login.
// Exibe estatísticas reais de consumo semanal vindas do backend,
// além de uma "Dica do Dia" que muda a cada 24 horas.
//
// FIX DE SCROLL ANDROID:
// O ScrollView NÃO tem flex:1 no style — isso causava altura zero no Android.
// Todo o padding/spacing vai no contentContainerStyle.
import React, { useContext, useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../../contexts/AuthContext';
import { ThemeContext } from '../../contexts/ThemeContext';
import { ConsumptionContext } from '../../contexts/ConsumptionContext';
import { getHomeStyles } from '../../styles/screensStyles';
import Chip from '../../components/basic/Chip';
import StatBar from '../../components/intermediate/StatBar';
import { DICAS } from '../../constants/data';

// ─── CONSTANTE: chave e intervalo da dica diária ─────────────────────────────
const DICA_KEY           = '@dicaDoDia';
const DICA_TIMESTAMP_KEY = '@dicaDoDiaTimestamp';
const UM_DIA_MS          = 24 * 60 * 60 * 1000; // 24 horas em milissegundos

export default function HomeScreen({ navigation }) {
  const { user }    = useContext(AuthContext);
  const { colors }  = useContext(ThemeContext);
  const {
    aguaPoupada,
    energiaPoupada,
    consumoSemanalReal,
    isLoadingBackend,
  } = useContext(ConsumptionContext);

  const styles = getHomeStyles(colors);

  // ─── DICA DO DIA ───────────────────────────────────────────────────────────
  // Filtra dicas que não são alertas (queremos dicas positivas na Home)
  const dicasValidas = DICAS.filter(d => d.categoria !== 'alerta');
  const [dicaDoDia, setDicaDoDia] = useState(null);

  useEffect(() => {
    const carregarDicaDoDia = async () => {
      try {
        const agora           = Date.now();
        const ultimoTimestamp = await AsyncStorage.getItem(DICA_TIMESTAMP_KEY);
        const dicaSalva       = await AsyncStorage.getItem(DICA_KEY);

        // Se ainda não passou 24h desde a última dica, usa a mesma
        if (ultimoTimestamp && dicaSalva) {
          const passado = agora - parseInt(ultimoTimestamp, 10);
          if (passado < UM_DIA_MS) {
            setDicaDoDia(JSON.parse(dicaSalva));
            return;
          }
        }

        // Sorteia uma nova dica aleatória e salva com timestamp
        const novaDica = dicasValidas[Math.floor(Math.random() * dicasValidas.length)];
        setDicaDoDia(novaDica);
        await AsyncStorage.setItem(DICA_KEY, JSON.stringify(novaDica));
        await AsyncStorage.setItem(DICA_TIMESTAMP_KEY, String(agora));
      } catch (error) {
        // Se falhar, usa uma dica padrão sem quebrar o app
        setDicaDoDia(dicasValidas[0] || null);
      }
    };

    carregarDicaDoDia();
  }, []);

  // ─── RENDER ────────────────────────────────────────────────────────────────
  // FIX WEB: overflow:'scroll' habilita scroll com mouse wheel na web
  const webScrollStyle = Platform.select({
    web: { overflow: 'auto', height: '100%' },
    default: {},
  });

  return (
    <ScrollView
      // SEM flex:1 no style — resolve o scroll no Android
      // FIX WEB: webScrollStyle adiciona overflow:'scroll' para mouse wheel
      style={[styles.container, webScrollStyle]}
      // Padding e espaçamento vão aqui, não no style
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={Platform.OS !== 'web'}
      // OBRIGATÓRIO no Android: habilita scroll dentro de containers com gesture handlers
      nestedScrollEnabled={true}
      // Performance: limita eventos de scroll a 60fps
      scrollEventThrottle={16}
      // Android: remove o glow de overscroll e comportamento bounce
      overScrollMode="never"
      bounces={false}
      // Garante que toques no teclado não bloqueiem o scroll
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.greeting}>Ola, {user?.nome || 'Usuario'}</Text>
      <Text style={styles.title}>Seu painel</Text>

      {/* ─── CARD HERO: economia calculada pelos sliders ─── */}
      <View style={styles.heroCard}>
        <Text style={styles.heroSubtitle}>Nível sustentável</Text>
        <Text style={styles.heroTitle}>Bom!</Text>
        <View style={styles.chipsRow}>
          <Chip icon="" label="Agua poupada"    value={`${aguaPoupada} L`}      color={colors.blue} />
          <Chip icon="" label="Energia poupada"  value={`${energiaPoupada} kWh`} color={colors.gold} />
        </View>
      </View>

      {/* ─── SEÇÃO: Consumo real da semana (do backend) ─── */}
      <Text style={styles.sectionTitle}>Esta semana</Text>
      <View style={styles.statsCard}>
        {isLoadingBackend ? (
          // Mostra spinner enquanto busca os dados do servidor
          <View style={{ alignItems: 'center', paddingVertical: 20 }}>
            <ActivityIndicator size="small" color={colors.blue} />
            <Text style={{ color: colors.textMuted, marginTop: 8, fontSize: 12 }}>
              Carregando dados...
            </Text>
          </View>
        ) : (
          <>
            <StatBar
              label="Consumo de Água"
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

      {/* ─── SEÇÃO: Dica do Dia ─── */}
      {dicaDoDia && (
        <>
          <Text style={styles.sectionTitle}>Dica do dia</Text>
          <View style={[
            styles.statsCard,
            {
              borderLeftWidth: 4,
              borderLeftColor: dicaDoDia.cor || colors.teal,
              paddingVertical: 14,
            },
          ]}>
            <Text style={{ fontSize: 24, marginBottom: 6 }}>{dicaDoDia.icon}</Text>
            <Text style={{ fontWeight: 'bold', color: colors.text, fontSize: 15, marginBottom: 4 }}>
              {dicaDoDia.title}
            </Text>
            <Text style={{ color: colors.textSub, fontSize: 13, lineHeight: 20 }}>
              {dicaDoDia.desc}
            </Text>
          </View>
        </>
      )}
    </ScrollView>
  );
}
