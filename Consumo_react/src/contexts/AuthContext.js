// AuthContext.js
// Aqui utilizamos a "Context API" do React. O Contexto é como uma variável global.
// Ele permite que dados como "Usuário Logado" sejam acessados por qualquer tela do aplicativo
// sem precisar ficar passando esses dados de tela em tela manualmente.

import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Usado para salvar dados na memória do celular
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Variável que guarda quem está logado
  const [isLoading, setIsLoading] = useState(true);

  // O useEffect roda automaticamente quando o aplicativo é aberto
  // Não restaura sessão anterior — sempre começa na tela de Login
  useEffect(() => {
    setIsLoading(false);
  }, []);

  const login = async (email, senha) => {
    try {
      // Envia os dados no corpo da requisição (body) em vez da URL
      const response = await api.post('/auth/login', { email, senha });
      const userData = response.data.usuario;
      await AsyncStorage.setItem('@user', JSON.stringify(userData));
      setUser(userData);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.detail || 'Erro ao realizar login' 
      };
    }
  };

  const register = async (nome, email, senha) => {
    try {
      const response = await api.post('/auth/register', { nome, email, senha });
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.detail || 'Erro ao registrar' 
      };
    }
  };

  const logout = async () => {
    // Como o colega explicou, o logout de verdade no app moderno é feito
    // apagando os dados locais (AsyncStorage). O token morre aqui.
    await AsyncStorage.removeItem('@user');
    setUser(null);
  };

  // ─── FUNCAO: alterarSenha ──────────────────────────────────────────────────
  /**
   * Altera a senha do usuario autenticado no backend.
   * Chamada pela tela ChangePassword apos validar campos localmente.
   * Envia email + senha atual + nova senha para o endpoint PUT /auth/alterar-senha.
   * @param {string} senhaAtual - Senha atual do usuario (verificada no servidor)
   * @param {string} novaSenha  - Nova senha desejada
   * @returns {{ success: boolean, message: string }}
   */
  const alterarSenha = async (senhaAtual, novaSenha) => {
    try {
      const response = await api.put('/auth/alterar-senha', { 
        email: user.email, 
        senha_atual: senhaAtual, 
        nova_senha: novaSenha 
      });
      return { success: true, message: response.data.message };
    } catch (error) {
      return { success: false, message: error.response?.data?.detail || 'Erro ao alterar senha' };
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, alterarSenha, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
