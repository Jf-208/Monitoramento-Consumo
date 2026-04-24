// api.js
// Este arquivo é responsável por centralizar todas as comunicações com o servidor (backend em Python/FastAPI).
// Em vez de usarmos o "axios", usamos a função nativa do JavaScript chamada "fetch" para simplificar e não exigir mais dependências.

// Se estiver rodando no Web ou no iOS Simulator, localhost funciona.
// Se estiver usando o emulador do Android, o localhost da máquina é acessado através de 10.0.2.2
const BASE_URL = 'https://monitoramento-consumo-production.up.railway.app';

const api = {
  // Função GET: Pega informações do backend (ex: buscar lista de consumos)
  get: async (endpoint) => {
    const response = await fetch(`${BASE_URL}${endpoint}`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw { response: { data: errorData } };
    }
    return { data: await response.json() };
  },
  
  post: async (endpoint, data, config = {}) => {
    let url = `${BASE_URL}${endpoint}`;
    if (config.params) {
      const params = new URLSearchParams(config.params);
      url += `?${params.toString()}`;
    }
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: data ? JSON.stringify(data) : null,
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw { response: { data: errorData } };
    }
    return { data: await response.json() };
  },

  put: async (endpoint, data) => {
    let url = `${BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
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
