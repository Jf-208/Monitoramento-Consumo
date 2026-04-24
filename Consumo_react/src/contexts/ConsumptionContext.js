import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ConsumptionContext = createContext();

export const ConsumptionProvider = ({ children }) => {
  // Estados para inputs e consumos
  const [banhoTempo, setBanhoTempo] = useState(13); // min
  const [energiaPotencia, setEnergiaPotencia] = useState(5500); // W
  const [energiaTempo, setEnergiaTempo] = useState(15); // min
  
  // O app será inicializado carregando do storage
  const [isLoading, setIsLoading] = useState(true);

  // Calcula valores economizados com base no tempo "ideal"
  // Exemplo de Gamificação: Se tomar banho < 15 min, economiza.
  const aguaPoupada = Math.max(0, (15 - banhoTempo) * 7); // 7L por minuto
  // Energia: ideal < 30 min no chuveiro. Economia = (30 - tempo) * potencia / 60 / 1000
  const energiaPoupada = Math.max(0, ((30 - energiaTempo) * energiaPotencia) / 60 / 1000).toFixed(2);

  // FLUXO DE PERSISTÊNCIA: Storage -> UI (Carregar os dados)
  useEffect(() => {
    const loadData = async () => {
      try {
        const storedBanho = await AsyncStorage.getItem('@banhoTempo');
        const storedPotencia = await AsyncStorage.getItem('@energiaPotencia');
        const storedTempo = await AsyncStorage.getItem('@energiaTempo');

        if (storedBanho !== null) setBanhoTempo(parseInt(storedBanho, 10));
        if (storedPotencia !== null) setEnergiaPotencia(parseInt(storedPotencia, 10));
        if (storedTempo !== null) setEnergiaTempo(parseInt(storedTempo, 10));
      } catch (error) {
        console.log('Erro ao carregar do Storage:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // FLUXO DE PERSISTÊNCIA: Input -> UI -> Storage (Salvar sempre que mudar)
  useEffect(() => {
    if (!isLoading) {
      AsyncStorage.setItem('@banhoTempo', banhoTempo.toString());
      AsyncStorage.setItem('@energiaPotencia', energiaPotencia.toString());
      AsyncStorage.setItem('@energiaTempo', energiaTempo.toString());
    }
  }, [banhoTempo, energiaPotencia, energiaTempo, isLoading]);

  return (
    <ConsumptionContext.Provider value={{
      banhoTempo, setBanhoTempo,
      energiaPotencia, setEnergiaPotencia,
      energiaTempo, setEnergiaTempo,
      aguaPoupada, energiaPoupada
    }}>
      {children}
    </ConsumptionContext.Provider>
  );
};
