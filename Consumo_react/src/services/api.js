// api.js
// Centraliza todas as comunicacoes com o servidor (backend FastAPI).
// Usa fetch nativo com timeout de 10s para evitar travamento.

import AsyncStorage from '@react-native-async-storage/async-storage';

// URL de producao no Railway
const PRODUCAO_URL = 'https://monitoramento-consumo-production.up.railway.app';
// URL de desenvolvimento (simulador iOS ou Web)
const DESENVOLVIMENTO_URL = 'http://localhost:8000';

// Define qual URL usar
const EM_PRODUCAO = false; // Desenvolvimento — aponta para localhost
const BASE_URL = EM_PRODUCAO ? PRODUCAO_URL : DESENVOLVIMENTO_URL;

// Busca o token do usuario salvo no AsyncStorage
const getAuthHeaders = async () => {
  try {
    const userJson = await AsyncStorage.getItem('@user');
    if (userJson) {
      const user = JSON.parse(userJson);
      return {
        'Content-Type': 'application/json',
        'X-User-Id': String(user.id || ''),
      };
    }
  } catch (e) {
    // Se falhar ao ler o storage, retorna so o Content-Type
  }
  return { 'Content-Type': 'application/json' };
};

// Helper: fetch com timeout de 10 segundos
const fetchWithTimeout = async (url, options = {}, timeoutMs = 10000) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timeout);
    return response;
  } catch (error) {
    clearTimeout(timeout);
    if (error.name === 'AbortError') {
      throw new Error('Tempo de conexao esgotado. Verifique sua internet.');
    }
    throw error;
  }
};

const api = {
  // Funcao GET: Pega informacoes do backend
  get: async (endpoint) => {
    const headers = await getAuthHeaders();
    const response = await fetchWithTimeout(`${BASE_URL}${endpoint}`, { headers });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw { response: { data: errorData } };
    }
    return { data: await response.json() };
  },

  // Funcao POST: Envia dados novos para o backend
  post: async (endpoint, data, config = {}) => {
    let url = `${BASE_URL}${endpoint}`;
    if (config.params) {
      const params = new URLSearchParams(config.params);
      url += `?${params.toString()}`;
    }
    const headers = await getAuthHeaders();
    const response = await fetchWithTimeout(url, {
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

  // Funcao PUT: Atualiza um dado existente no backend
  put: async (endpoint, data) => {
    const headers = await getAuthHeaders();
    const response = await fetchWithTimeout(`${BASE_URL}${endpoint}`, {
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

  // Funcao PATCH: Atualiza parcialmente um dado
  patch: async (endpoint, data) => {
    const headers = await getAuthHeaders();
    const response = await fetchWithTimeout(`${BASE_URL}${endpoint}`, {
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
