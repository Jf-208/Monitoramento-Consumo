// MetasContext.js
// Gerencia estado global das metas de consumo do usuário.
// Padrão: igual ao ConsumptionContext.js — provider + hook useContext.
//
// REGRA: nunca chama a API de consumo aqui.
// O progresso é calculado com os registros do ConsumptionContext,
// passados como parâmetro para calcularProgresso(meta, registros).
// Isso evita chamadas duplicadas à API.

import React, { createContext, useContext, useState, useCallback } from 'react';
import { AuthContext } from './AuthContext';
import api from '../services/api';

export const MetasContext = createContext({});

export function MetasProvider({ children }) {
  const { user } = useContext(AuthContext);

  const [metas,      setMetas]      = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro,       setErro]       = useState(null);

  // ─── buscarMetas ─────────────────────────────────────────────────────────
  // Busca metas ativas do usuário logado e atualiza o estado.
  const buscarMetas = useCallback(async () => {
    if (!user?.id) return;
    setCarregando(true);
    setErro(null);
    const resultado = await api.buscarMetasAtivas(user.id);
    if (resultado.sucesso) {
      setMetas(resultado.dados);
    } else {
      setErro(resultado.erro);
    }
    setCarregando(false);
  }, [user?.id]);

  // ─── criarMeta ───────────────────────────────────────────────────────────
  // Cria meta e recarrega a lista automaticamente.
  // data_inicio construída de forma local para evitar bug de UTC:
  //   new Date().toISOString() retorna UTC e pode mudar o dia em UTC-3.
  const criarMeta = async ({ tipo, periodo, valor_meta }) => {
    if (!user?.id) return { sucesso: false, erro: 'Usuário não autenticado.' };

    // Constrói data_inicio no fuso local do dispositivo
    const hoje = new Date();
    const data_inicio = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-${String(hoje.getDate()).padStart(2, '0')}`;

    const resultado = await api.criarMeta(user.id, { tipo, periodo, valor_meta, data_inicio });
    if (resultado.sucesso) {
      await buscarMetas(); // atualiza lista sem refresh manual
    }
    return resultado;
  };

  // ─── atualizarMeta ───────────────────────────────────────────────────────
  const atualizarMeta = async (id, payload) => {
    if (!user?.id) return { sucesso: false, erro: 'Usuário não autenticado.' };
    const resultado = await api.atualizarMeta(user.id, id, payload);
    if (resultado.sucesso) {
      await buscarMetas();
    }
    return resultado;
  };

  // ─── deletarMeta ─────────────────────────────────────────────────────────
  const deletarMeta = async (id) => {
    if (!user?.id) return { sucesso: false, erro: 'Usuário não autenticado.' };
    const resultado = await api.deletarMeta(user.id, id);
    if (resultado.sucesso) {
      // Remove da lista localmente para atualização imediata sem aguardar API
      setMetas(prev => prev.filter(m => m.id !== id));
    }
    return resultado;
  };

  // ─── calcularProgresso ────────────────────────────────────────────────────
  // Função pura — sem chamada API. Usa os registros do ConsumptionContext.
  //
  // Regra: registros com is_simulado=true nunca contam no progresso real.
  // Motivo: dados de demonstração (seed_demo.py) não devem influenciar metas reais.
  //
  // Regra: data_personalizada tem precedência sobre created_at (registro retroativo).
  const calcularProgresso = (meta, registros) => {
    // Garante parse correto sem conversão UTC
    const inicio = new Date(meta.data_inicio + 'T00:00:00');
    const fim    = new Date(meta.data_fim    + 'T23:59:59');

    const registrosDoPeriodo = registros.filter(r => {
      const dataStr = r.data_personalizada ?? r.data_registro;
      if (!dataStr) return false;
      const dataRegistro = new Date(dataStr);
      return (
        r.tipo_consumo === meta.tipo &&
        dataRegistro >= inicio &&
        dataRegistro <= fim &&
        !r.is_simulado // exclui simulações — ver comentário acima
      );
    });

    const totalConsumido = registrosDoPeriodo.reduce((acc, r) => acc + (parseFloat(r.valor) ?? 0), 0);
    const percentual = meta.valor_meta > 0
      ? (totalConsumido / meta.valor_meta) * 100
      : 0; // evita divisão por zero — retorna 0% se valor_meta=0

    return {
      totalConsumido: parseFloat(totalConsumido.toFixed(2)),
      percentual:     parseFloat(percentual.toFixed(1)),
      ultrapassou:    percentual > 100,
      // Espelha os níveis de sustainability.js para consistência visual
      status: percentual < 60  ? 'otimo'
            : percentual < 85  ? 'bom'
            : percentual < 100 ? 'atencao'
            : 'critico',
    };
  };

  return (
    <MetasContext.Provider value={{
      metas,
      carregando,
      erro,
      buscarMetas,
      criarMeta,
      atualizarMeta,
      deletarMeta,
      calcularProgresso,
    }}>
      {children}
    </MetasContext.Provider>
  );
}
