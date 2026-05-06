// Home/index.js
// Tela principal (Dashboard) exibida apos o login.
// Exibe nivel sustentavel (com emoji) calculado com dados SEMANAIS,
// StatBars de consumo MENSAL do backend, card de Gasto Mensal,
// e uma "Dica do Dia" que muda a cada 24h.
import React, { useContext, useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, ActivityIndicator, Platform, TouchableOpacity } from 'react-native';
import { MotiView } from 'moti';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../../contexts/AuthContext';
import { ThemeContext } from '../../contexts/ThemeContext';
import { ConsumptionContext } from '../../contexts/ConsumptionContext';
import { MetasContext } from '../../contexts/MetasContext';
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
    consumoMensalReal,
    isLoadingBackend,
    registros,
  } = useContext(ConsumptionContext);
  const { metas, calcularProgresso, buscarMetas } = useContext(MetasContext);

  const styles = getHomeStyles(colors);

  // Carrega metas ao montar a home
  useEffect(() => { buscarMetas(); }, []);

  // Nivel sustentavel calculado com percentuais SEMANAIS (metrica de ritmo, nao de acumulo)
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
      <View style={{ alignItems: 'center', justifyContent: 'center', width: '100%', marginBottom: -90, marginTop: -70 }}>
        <Image
          source={require('../../../assets/Wave2.png')}
          style={{ width: 400, height: 400, transform: [{ scale: 1.7 }], marginRight: 70 }}
          resizeMode="contain"
        />
      </View>
      <Text style={[styles.greeting, { textAlign: 'center', marginTop: 10 }]}>Bem vindo, {user?.nome || 'Usuario'}</Text>
      <Text style={[styles.title, { textAlign: 'center' }]}>Seu painel</Text>

      {/* Card de Nivel Sustentavel — animado, com emoji */}
      <MotiView
        from={{ opacity: 0, translateY: 12 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 500, delay: 100 }}
      >
        <View style={[styles.heroCard, { borderLeftWidth: 4, borderLeftColor: nivel.cor, alignItems: 'center' }]}>
          <Text style={[styles.heroSubtitle, { textAlign: 'center' }]}>Nivel sustentável</Text>
          <Text style={[styles.heroTitle, { color: nivel.cor, textAlign: 'center' }]}>
            {nivel.emoji} {nivel.label}
          </Text>
          <Text style={{ color: colors.textSub, fontSize: 13, marginTop: 4, textAlign: 'center' }}>{nivel.descricao}</Text>
        </View>
      </MotiView>

      {/* Consumo MENSAL (dados de 30 dias do backend) */}
      <Text style={[styles.sectionTitle, { textAlign: 'center' }]}>Consumo Mensal</Text>
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
                value={consumoMensalReal.agua}
                max={consumoMensalReal.metaAguaL || 3000}
                color={colors.blue}
                unit="L"
              />
              <StatBar
                label="Consumo de Energia"
                value={consumoMensalReal.energia}
                max={consumoMensalReal.metaEnergiaKwh || 60}
                color={colors.gold}
                unit="kWh"
              />
            </>
          )}
        </View>
      </MotiView>

      {/* Card de Gasto Mensal — valores calculados no backend */}
      <MotiView
        from={{ opacity: 0, translateY: 8 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 400, delay: 400 }}
      >
        <View style={[styles.statsCard, { marginTop: 8, alignItems: 'center' }]}>
          <Text style={{ color: colors.textMuted, fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10, fontWeight: 'bold', textAlign: 'center' }}>
            Gasto Mensal
          </Text>
          <Text style={{ color: colors.danger || '#FF5A72', fontWeight: 'bold', fontSize: 26, marginBottom: 10, textAlign: 'center' }}>
            R$ {(consumoMensalReal.gastoTotalReais || 0).toFixed(2)}
          </Text>
          <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 16, width: '100%' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="water" size={14} color={colors.blue} style={{ marginRight: 5 }} />
              <Text style={{ color: colors.textSub, fontSize: 12 }}>
                R$ {(consumoMensalReal.gastoAguaReais || 0).toFixed(2)}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="flash" size={14} color={colors.gold} style={{ marginRight: 5 }} />
              <Text style={{ color: colors.textSub, fontSize: 12 }}>
                R$ {(consumoMensalReal.gastoEnergiaReais || 0).toFixed(2)}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="receipt-outline" size={14} color={colors.violet || '#A78BFA'} style={{ marginRight: 5 }} />
              <Text style={{ color: colors.textSub, fontSize: 12 }}>
                R$ {(consumoMensalReal.gastoOutrosReais || 0).toFixed(2)}
              </Text>
            </View>
          </View>
        </View>
      </MotiView>

      {/* ─── WIDGET DE METAS ─── */}
      <Text style={[styles.sectionTitle, { textAlign: 'center' }]}>Minhas Metas</Text>
      <MotiView
        from={{ opacity: 0, translateY: 8 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 400, delay: 450 }}
      >
        {metas.length === 0 ? (
          // CTA: sem metas definidas — navega para a aba Metas via prop de navigation
          <TouchableOpacity
            style={[styles.statsCard, { alignItems: 'center', flexDirection: 'row', gap: 10, justifyContent: 'center' }]}
            onPress={() => navigation.navigate('MainTabs', { tab: 'metas' })}
            activeOpacity={0.8}
          >
            <Ionicons name="flag-outline" size={18} color={colors.textMuted} />
            <Text style={{ color: colors.textSub, fontSize: 14 }}>Defina uma meta de consumo</Text>
            <Ionicons name="chevron-forward" size={14} color={colors.textMuted} />
          </TouchableOpacity>
        ) : (
          <View style={styles.statsCard}>
            {metas.slice(0, 3).map(meta => {
              const progresso = calcularProgresso(meta, registros);
              const corStatus = progresso.status === 'otimo' ? '#1D9E75'
                              : progresso.status === 'bom'   ? '#378ADD'
                              : progresso.status === 'atencao' ? '#EF9F27'
                              : '#E24B4A';
              const icone = meta.tipo === 'agua' ? 'water' : meta.tipo === 'energia' ? 'flash' : 'receipt-outline';
              return (
                <View key={meta.id} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 8 }}>
                  <Ionicons name={icone} size={14} color={corStatus} />
                  <Text style={{ color: colors.textSub, fontSize: 12, width: 90 }}>
                    {meta.tipo.charAt(0).toUpperCase() + meta.tipo.slice(1)} · {meta.periodo === 'semanal' ? 'Sem.' : 'Mês'}
                  </Text>
                  <View style={{ flex: 1 }}>
                    <StatBar label="" value={progresso.percentual} max={100} color={corStatus} unit="%" />
                  </View>
                  <Text style={{ color: corStatus, fontSize: 12, fontWeight: '700', width: 40, textAlign: 'right' }}>
                    {progresso.percentual.toFixed(0)}%
                  </Text>
                </View>
              );
            })}
          </View>
        )}
      </MotiView>

      {/* Dica do Dia */}
      {dicaDoDia && (
        <>
          <Text style={[styles.sectionTitle, { textAlign: 'center' }]}>Dica do dia</Text>
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

        {/* Botao de navegacao para a tela de Dicas completa */}
        <TouchableOpacity
          onPress={() => navigation.navigate('Tips')}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 10,
            paddingHorizontal: 20,
            marginTop: 8,
            marginBottom: 24,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: colors.border,
            backgroundColor: colors.surface,
            gap: 8,
          }}
          activeOpacity={0.75}
        >
          <Ionicons name="bulb-outline" size={16} color={colors.teal || '#1D9E75'} />
          <Text style={{ color: colors.teal || '#1D9E75', fontSize: 14, fontWeight: '600' }}>
            Clique aqui para mais dicas
          </Text>
          <Ionicons name="chevron-forward" size={14} color={colors.teal || '#1D9E75'} />
        </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
}
