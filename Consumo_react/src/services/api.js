// api.js
// Este arquivo é responsável por centralizar todas as comunicações com o servidor (backend em Python/FastAPI).
// Em vez de usarmos o "axios", usamos a função nativa do JavaScript chamada "fetch" para simplificar
// e não exigir mais dependências.

import AsyncStorage from '@react-native-async-storage/async-storage';

// URL de produção no Railway (usada quando o app está rodando no celular ou em produção)
const PRODUCAO_URL = 'https://monitoramento-consumo-production.up.railway.app';

// URL de desenvolvimento (funciona apenas no simulador iOS ou Web — não no celular físico via Android)
// No Android físico, use o IP local da sua máquina: http://192.168.X.X:8000
const DESENVOLVIMENTO_URL = 'http://localhost:8000';

// Define qual URL usar: em desenvolvimento (simulador) ou produção (Railway)
// Mude para false se quiser testar com o backend local
const EM_PRODUCAO = true;
const BASE_URL = EM_PRODUCAO ? PRODUCAO_URL : DESENVOLVIMENTO_URL;

// Função auxiliar: busca o token do usuário salvo no AsyncStorage
// O usuário é salvo como JSON com { id, nome, email, ... } no login
const getAuthHeaders = async () => {
  try {
    const userJson = await AsyncStorage.getItem('@user');
    if (userJson) {
      const user = JSON.parse(userJson);
      // Adiciona o ID do usuário no header para identificar a requisição
      return {
        'Content-Type': 'application/json',
        'X-User-Id': String(user.id || ''),
      };
    }
  } catch (e) {
    // Se falhar ao ler o storage, retorna só o Content-Type
  }
  return { 'Content-Type': 'application/json' };
};

const api = {
  // Função GET: Pega informações do backend (ex: buscar lista de consumos)
  get: async (endpoint) => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${BASE_URL}${endpoint}`, { headers });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw { response: { data: errorData } };
    }
    return { data: await response.json() };
  },

  // Função POST: Envia dados novos para o backend (ex: registrar consumo)
  post: async (endpoint, data, config = {}) => {
    let url = `${BASE_URL}${endpoint}`;
    if (config.params) {
      const params = new URLSearchParams(config.params);
      url += `?${params.toString()}`;
    }
    const headers = await getAuthHeaders();
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: data ? JSON.stringify(data) : null,
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw { response: { data: errorData } };
    }
    return { data: await response.json() };
  },

  // Função PUT: Atualiza um dado existente no backend (ex: alterar senha)
  put: async (endpoint, data) => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers,
      body: data ? JSON.stringify(data) : null,
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw { response: { data: errorData } };
    }
    return { data: await response.json() };
  },

  // Função PATCH: Atualiza parcialmente um dado (ex: atualizar apenas um campo)
  patch: async (endpoint, data) => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers,
      body: data ? JSON.stringify(data) : null,
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw { response: { data: errorData } };
    }
    return { data: await response.json() };
  },
};

export default api;
