// ConsumptionContext.js
// Contexto global para armazenar dados de consumo em tempo real.
// Salva valores de simulacao (como tempo de banho, potencia, etc) para que eles nao sejam perdidos
// quando o usuario navega entre as telas de Agua e Energia.
// Agora tambem integra com o backend (Railway) para registrar e buscar consumos reais.
// Dados sao prefixados com user.id para isolamento por conta.
// Suporta tipo "outros" com valor monetario e data personalizada.
// Inclui estados mensais (consumoMensalReal), e funcoes de edicao e exclusao (editarRegistro, deletarRegistro).

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
  // Resumo semanal vindo do servidor (zerado enquanto nao carrega)
  const [consumoSemanalReal, setConsumoSemanalReal] = useState({
    agua: 0,
    energia: 0,
    outros: 0,           // total R$ dos "outros" na semana
    metaAguaL: 700,
    metaEnergiaKwh: 15,
    percentualAgua: 0,
    percentualEnergia: 0,
  });

  // ─── ESTADO MENSAL (separado do semanal — nunca misture os dois) ──────────
  const [consumoMensalReal, setConsumoMensalReal] = useState({
    agua: 0,
    energia: 0,
    outros: 0,
    gastoAguaReais: 0,
    gastoEnergiaReais: 0,
    gastoOutrosReais: 0,
    gastoTotalReais: 0,
    metaAguaL: 3000,
    metaEnergiaKwh: 60,
    percentualAgua: 0,
    percentualEnergia: 0,
  });

  // Historico total de todos os registros do usuario
  const [historicoTotal, setHistoricoTotal] = useState({
    totalAguaL: 0,
    totalEnergiaKwh: 0,
    totalOutrosReais: 0,
    gastoAguaReais: 0,     // totalAguaL * 0.0065 (R$/L)
    gastoEnergiaReais: 0,  // totalEnergiaKwh * 0.87 (R$/kWh)
    gastoTotalReais: 0,    // soma dos tres acima
  });

  // Lista completa de registros (historico paginado)
  const [registros, setRegistros] = useState([]);

  // Indica se o app ainda esta buscando dados do backend
  const [isLoadingBackend, setIsLoadingBackend] = useState(false);

  // Indica se o AsyncStorage ainda esta sendo lido
  const [isLoading, setIsLoading] = useState(true);

  // Estado de diagnostico para ultimo erro de registro
  const [ultimoErroRegistro, setUltimoErroRegistro] = useState('');

  // Pega o usuario logado do AuthContext
  const { user } = useContext(AuthContext);

  // ─── CALCULOS DE ECONOMIA (baseados nos sliders) ──────────────────────────
  // Gamificacao: Se tomar banho < 15 min, economiza 7L por minuto a menos
  const aguaPoupada = Math.max(0, (15 - banhoTempo) * 7);
  // Energia: ideal < 30 min no chuveiro. Economia = (30 - tempo) * potencia / 60 / 1000
  const energiaPoupada = Math.max(0, ((30 - energiaTempo) * energiaPotencia) / 60 / 1000).toFixed(2);

  // ─── CARREGAR DADOS DO STORAGE (prefixado por user.id) ────────────────────
  useEffect(() => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }
    const loadData = async () => {
      try {
        const storedBanho    = await AsyncStorage.getItem(`@banhoTempo_${user.id}`);
        const storedPotencia = await AsyncStorage.getItem(`@energiaPotencia_${user.id}`);
        const storedTempo    = await AsyncStorage.getItem(`@energiaTempo_${user.id}`);

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
  }, [user?.id]);

  // ─── BUSCA RESUMO + HISTORICO DO BACKEND quando o usuario logar ───────────
  useEffect(() => {
    if (user?.id && !isLoading) {
      buscarResumoSemanal();
      buscarResumoMensal();
      buscarHistoricoTotal();
    }
  }, [user?.id, isLoading]);

  // ─── SALVAR NO STORAGE (prefixado por user.id) ────────────────────────────
  useEffect(() => {
    if (!isLoading && user?.id) {
      AsyncStorage.setItem(`@banhoTempo_${user.id}`,      banhoTempo.toString());
      AsyncStorage.setItem(`@energiaPotencia_${user.id}`, energiaPotencia.toString());
      AsyncStorage.setItem(`@energiaTempo_${user.id}`,    energiaTempo.toString());
    }
  }, [banhoTempo, energiaPotencia, energiaTempo, isLoading, user?.id]);

  // ─── FUNCAO: Salvar consumo no backend (com retry automatico) ─────────────
  /**
   * Registra um consumo real no servidor.
   * Faz 2 tentativas: a primeira imediata, a segunda apos 3s (Railway cold start).
   * Usa api.post() para garantir URL correta (BASE_URL + endpoint).
   * @param {string} tipo - "agua", "energia" ou "outros"
   * @param {number} valor - Quantidade consumida
   * @param {string} unidade - "L", "kWh" ou "" (vazio para outros)
   * @param {boolean} isSimulado - true se veio de simulacao do slider
   * @param {object} extra - campos extras: { nome_custom, valor_monetario, data_personalizada }
   * @returns {{ success: boolean, message: string }}
   */
  const salvarConsumoBackend = async (tipo, valor, unidade, isSimulado = false, extra = {}) => {
    if (!user?.id) {
      const msg = 'Usuario nao esta logado';
      setUltimoErroRegistro(msg);
      return { success: false, message: msg };
    }

    const payload = {
      id_usuario:         user.id,
      tipo_consumo:       tipo,
      valor:              valor,
      unidade_medida:     unidade,
      is_simulado:        isSimulado,
      nome_custom:        extra.nome_custom       || null,
      valor_monetario:    extra.valor_monetario   || null,
      data_personalizada: extra.data_personalizada || null,
    };

    const tentar = async () => {
      return await api.post('/consumo/registrar', payload);
    };

    try {
      setUltimoErroRegistro('');
      await tentar();
      return { success: true, message: 'Consumo registrado com sucesso!' };
    } catch (erro1) {
      console.log('Tentativa 1 falhou:', erro1?.response?.data || erro1?.message);
      // Retry apos 3 segundos (Railway pode estar acordando do cold start)
      await new Promise(r => setTimeout(r, 3000));
      try {
        await tentar();
        setUltimoErroRegistro('');
        return { success: true, message: 'Consumo registrado com sucesso!' };
      } catch (erro2) {
        let msg = erro2?.response?.data?.detail || erro2?.message || 'Erro desconhecido';
        if (typeof msg !== 'string') {
          msg = JSON.stringify(msg);
        }
        setUltimoErroRegistro(msg);
        return { success: false, message: msg };
      }
    }
  };

  // ─── FUNCAO: Buscar resumo semanal do backend ─────────────────────────────
  /**
   * Busca os totais da semana atual no servidor e atualiza o estado.
   * Chamado na inicializacao e apos cada registro novo.
   */
  const buscarResumoSemanal = async () => {
    if (!user?.id) return;

    setIsLoadingBackend(true);
    try {
      const response = await api.get(`/consumo/resumo/${user.id}`);
      const dados = response.data;

      setConsumoSemanalReal({
        agua:             dados.total_agua_L        ?? 0,
        energia:          dados.total_energia_kWh   ?? 0,
        outros:           dados.total_outros_reais  ?? 0,
        metaAguaL:        dados.meta_agua_L         ?? 700,
        metaEnergiaKwh:   dados.meta_energia_kWh    ?? 15,
        percentualAgua:   dados.percentual_agua     ?? 0,
        percentualEnergia: dados.percentual_energia ?? 0,
      });
    } catch (error) {
      // Se falhar, mantem os dados anteriores sem quebrar o app
      console.log('Erro ao buscar resumo semanal:', error);
    } finally {
      setIsLoadingBackend(false);
    }
  };

  // ─── FUNCAO: Buscar historico total de registros ──────────────────────────
  /**
   * Busca todos os registros do usuario e calcula totais acumulados.
   * Expoe a lista de registros para uso na tela de Registrar.
   * Calcula gastos em R$ com tarifas de referencia.
   */
  const buscarHistoricoTotal = async () => {
    if (!user?.id) return;
    try {
      const response = await api.get(`/consumo/historico/${user.id}`);
      const lista = response.data;
      setRegistros(lista); // expoe o array completo para o historico

      const totalAgua    = lista.filter(r => r.tipo_consumo === 'agua').reduce((a, r) => a + r.valor, 0);
      const totalEnergia = lista.filter(r => r.tipo_consumo === 'energia').reduce((a, r) => a + r.valor, 0);
      const totalOutros  = lista.filter(r => r.tipo_consumo === 'outros').reduce((a, r) => a + (r.valor_monetario || 0), 0);

      const gastoAgua    = parseFloat((totalAgua * 0.0065).toFixed(2));    // R$0,0065/L
      const gastoEnergia = parseFloat((totalEnergia * 0.87).toFixed(2));   // R$0,87/kWh
      const gastoTotal   = parseFloat((gastoAgua + gastoEnergia + totalOutros).toFixed(2));

      setHistoricoTotal({
        totalAguaL:       parseFloat(totalAgua.toFixed(2)),
        totalEnergiaKwh:  parseFloat(totalEnergia.toFixed(4)),
        totalOutrosReais: parseFloat(totalOutros.toFixed(2)),
        gastoAguaReais:   gastoAgua,
        gastoEnergiaReais: gastoEnergia,
        gastoTotalReais:  gastoTotal,
      });
    } catch (e) {
      console.log('Erro ao buscar historico total:', e);
    }
  };

  // ─── FUNCAO: Buscar resumo mensal do backend ──────────────────────────────
  /**
   * Busca os totais dos ultimos 30 dias no servidor.
   * Estado independente do semanal — nunca troque um pelo outro.
   */
  const buscarResumoMensal = async () => {
    if (!user?.id) return;
    try {
      const response = await api.get(`/consumo/resumo-mensal/${user.id}`);
      const dados = response.data;
      setConsumoMensalReal({
        agua:               dados.total_agua_L        ?? 0,
        energia:            dados.total_energia_kWh   ?? 0,
        outros:             dados.total_outros_reais  ?? 0,
        gastoAguaReais:     dados.gasto_agua_reais    ?? 0,
        gastoEnergiaReais:  dados.gasto_energia_reais ?? 0,
        gastoOutrosReais:   dados.gasto_outros_reais  ?? 0,
        gastoTotalReais:    dados.gasto_total_reais   ?? 0,
        metaAguaL:          dados.meta_agua_L         ?? 3000,
        metaEnergiaKwh:     dados.meta_energia_kWh    ?? 60,
        percentualAgua:     dados.percentual_agua     ?? 0,
        percentualEnergia:  dados.percentual_energia  ?? 0,
      });
    } catch (error) {
      console.log('Erro ao buscar resumo mensal:', error);
    }
  };

  // ─── FUNCAO: Editar registro individual ────────────────────────────────────
  const editarRegistro = async (idRegistro, dados) => {
    if (!user?.id) return { success: false, message: 'Usuário não logado' };
    try {
      await api.put(`/consumo/registro/${idRegistro}`, dados);
      await buscarResumoSemanal();
      await buscarResumoMensal();
      await buscarHistoricoTotal();
      return { success: true, message: 'Registro atualizado com sucesso!' };
    } catch (e) {
      const msg = e?.response?.data?.detail || e?.message || 'Erro ao editar';
      return { success: false, message: typeof msg === 'string' ? msg : JSON.stringify(msg) };
    }
  };

  // ─── FUNCAO: Deletar registro individual ───────────────────────────────────
  const deletarRegistro = async (idRegistro) => {
    if (!user?.id) return { success: false, message: 'Usuário não logado' };
    try {
      await api.delete(`/consumo/registro/${idRegistro}`);
      await buscarResumoSemanal();
      await buscarResumoMensal();
      await buscarHistoricoTotal();
      return { success: true, message: 'Registro apagado!' };
    } catch (e) {
      const msg = e?.response?.data?.detail || e?.message || 'Erro ao apagar';
      return { success: false, message: typeof msg === 'string' ? msg : JSON.stringify(msg) };
    }
  };

  return (
    <ConsumptionContext.Provider value={{
      // Dados de simulacao (sliders)
      banhoTempo,       setBanhoTempo,
      energiaPotencia,  setEnergiaPotencia,
      energiaTempo,     setEnergiaTempo,
      // Economias calculadas pelos sliders
      aguaPoupada, energiaPoupada,
      // Dados reais do backend
      consumoSemanalReal,
      consumoMensalReal,
      historicoTotal,
      isLoadingBackend,
      // Historico de registros (lista completa)
      registros,
      buscarRegistros: buscarHistoricoTotal,
      // Diagnostico de erros
      ultimoErroRegistro, setUltimoErroRegistro,
      // Funcoes de integracao com o servidor
      salvarConsumoBackend,
      buscarResumoSemanal,
      buscarResumoMensal,
      buscarHistoricoTotal,
      editarRegistro,
      deletarRegistro,
    }}>
      {children}
    </ConsumptionContext.Provider>
  );
};
