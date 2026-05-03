// ConsumptionContext.js
// Contexto global para armazenar dados de consumo em tempo real.
// Salva valores de simulação (como tempo de banho, potência, etc) para que eles não sejam perdidos
// quando o usuário navega entre as telas de Água e Energia.
// Agora também integra com o backend (Railway) para registrar e buscar consumos reais.

import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';
import { AuthContext } from './AuthContext';

export const ConsumptionContext = createContext();

export const ConsumptionProvider = ({ children }) => {
  // ─── ESTADOS DE SIMULAÇÃO (inputs dos sliders) ────────────────────────────
  const [banhoTempo, setBanhoTempo] = useState(13);        // min
  const [energiaPotencia, setEnergiaPotencia] = useState(5500); // W
  const [energiaTempo, setEnergiaTempo] = useState(15);    // min

  // ─── ESTADOS DO BACKEND (dados reais da semana) ───────────────────────────
  // Resumo semanal vindo do servidor (zerado enquanto não carrega)
  const [consumoSemanalReal, setConsumoSemanalReal] = useState({
    agua: 0,
    energia: 0,
    vampiro: 0,
    aguaPoupadaReal: 0,
    energiaPoupadaReal: 0,
    metaAguaL: 700,
    metaEnergiaKwh: 15,
  });

  // Indica se o app ainda está buscando dados do backend
  const [isLoadingBackend, setIsLoadingBackend] = useState(false);

  // Indica se o AsyncStorage ainda está sendo lido
  const [isLoading, setIsLoading] = useState(true);

  // Pega o usuário logado do AuthContext
  const { user } = useContext(AuthContext);

  // ─── CÁLCULOS DE ECONOMIA (baseados nos sliders) ──────────────────────────
  // Gamificação: Se tomar banho < 15 min, economiza 7L por minuto a menos
  const aguaPoupada = Math.max(0, (15 - banhoTempo) * 7);
  // Energia: ideal < 30 min no chuveiro. Economia = (30 - tempo) * potencia / 60 / 1000
  const energiaPoupada = Math.max(0, ((30 - energiaTempo) * energiaPotencia) / 60 / 1000).toFixed(2);

  // ─── FLUXO DE PERSISTÊNCIA: Storage -> UI (Carregar os dados) ────────────
  useEffect(() => {
    const loadData = async () => {
      try {
        const storedBanho    = await AsyncStorage.getItem('@banhoTempo');
        const storedPotencia = await AsyncStorage.getItem('@energiaPotencia');
        const storedTempo    = await AsyncStorage.getItem('@energiaTempo');

        if (storedBanho !== null)    setBanhoTempo(parseInt(storedBanho, 10));
        if (storedPotencia !== null) setEnergiaPotencia(parseInt(storedPotencia, 10));
        if (storedTempo !== null)    setEnergiaTempo(parseInt(storedTempo, 10));
      } catch (error) {
        console.log('Erro ao carregar do Storage:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // ─── BUSCA RESUMO DO BACKEND quando o usuário logar ──────────────────────
  useEffect(() => {
    if (user?.id && !isLoading) {
      buscarResumoSemanal();
    }
  }, [user, isLoading]);

  // ─── FLUXO DE PERSISTÊNCIA: Input -> UI -> Storage (Salvar sempre que mudar)
  useEffect(() => {
    if (!isLoading) {
      AsyncStorage.setItem('@banhoTempo',       banhoTempo.toString());
      AsyncStorage.setItem('@energiaPotencia',  energiaPotencia.toString());
      AsyncStorage.setItem('@energiaTempo',     energiaTempo.toString());
    }
  }, [banhoTempo, energiaPotencia, energiaTempo, isLoading]);

  // ─── FUNÇÃO: Salvar consumo no backend ────────────────────────────────────
  /**
   * Registra um consumo real no servidor.
   * @param {string} tipo - "agua", "energia" ou "vampiro"
   * @param {number} valor - Quantidade consumida
   * @param {string} unidade - "L" ou "kWh"
   * @param {boolean} isSimulado - true se veio de simulação do slider
   * @returns {{ success: boolean, message: string }}
   */
  const salvarConsumoBackend = async (tipo, valor, unidade, isSimulado = true) => {
    if (!user?.id) {
      return { success: false, message: 'Usuário não está logado' };
    }
    try {
      await api.post('/consumo/registrar', {
        id_usuario:    user.id,
        tipo_consumo:  tipo,
        valor:         valor,
        unidade_medida: unidade,
        is_simulado:   isSimulado,
      });
      return { success: true, message: 'Consumo registrado com sucesso!' };
    } catch (error) {
      console.log('Erro ao salvar consumo no backend:', error);
      return {
        success: false,
        message: error.response?.data?.detail || 'Erro ao salvar consumo. Verifique a conexão.',
      };
    }
  };

  // ─── FUNÇÃO: Buscar resumo semanal do backend ─────────────────────────────
  /**
   * Busca os totais da semana atual no servidor e atualiza o estado.
   * Chamado na inicialização e após cada registro novo.
   */
  const buscarResumoSemanal = async () => {
    if (!user?.id) return;

    setIsLoadingBackend(true);
    try {
      const response = await api.get(`/consumo/resumo/${user.id}`);
      const dados = response.data;

      setConsumoSemanalReal({
        agua:               dados.total_agua_L        || 0,
        energia:            dados.total_energia_kWh   || 0,
        vampiro:            dados.total_vampiro_kWh   || 0,
        aguaPoupadaReal:    dados.agua_poupada_L      || 0,
        energiaPoupadaReal: dados.energia_poupada_kWh || 0,
        metaAguaL:          dados.meta_agua_L         || 700,
        metaEnergiaKwh:     dados.meta_energia_kWh    || 15,
        percentualAgua:     dados.percentual_agua     || 0,
        percentualEnergia:  dados.percentual_energia  || 0,
        percentualVampiro:  dados.percentual_outros   || 0,
      });
    } catch (error) {
      // Se falhar, mantém os dados anteriores sem quebrar o app
      console.log('Erro ao buscar resumo semanal:', error);
    } finally {
      setIsLoadingBackend(false);
    }
  };

  return (
    <ConsumptionContext.Provider value={{
      // Dados de simulação (sliders)
      banhoTempo,       setBanhoTempo,
      energiaPotencia,  setEnergiaPotencia,
      energiaTempo,     setEnergiaTempo,
      // Economias calculadas pelos sliders
      aguaPoupada, energiaPoupada,
      // Dados reais do backend
      consumoSemanalReal,
      isLoadingBackend,
      // Funções de integração com o servidor
      salvarConsumoBackend,
      buscarResumoSemanal,
    }}>
      {children}
    </ConsumptionContext.Provider>
  );
};
