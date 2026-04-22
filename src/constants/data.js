// =============================================================
// DADOS ESTÁTICOS DO WAVUNDER
// -------------------------------------------------------------
// Centraliza todos os dados fixos do app: listas, configurações
// e informações que não mudam em tempo real.
// Separar dados do visual facilita manutenção e futura
// integração com uma API real.
// =============================================================

import { C } from "./colors";

// Itens do menu FAB (botão flutuante)
// Cada item define: qual tela abrir, ícone, label e cor
export const FAB_ITEMS = [
  { id: "agua", icon: "💧", label: "Água", color: C.blue },
  { id: "energia", icon: "⚡", label: "Energia", color: C.gold },
  { id: "dicas", icon: "🌿", label: "Dicas", color: C.teal },
  { id: "relatorios", icon: "📊", label: "Relatórios", color: C.violet },
];

// Itens da barra de navegação inferior
export const NAV_ITEMS = [
  { id: "home", label: "Início", icon: "⊞" },
  { id: "relatorios", label: "Relatórios", icon: "◫" },
  { id: "perfil", label: "Perfil", icon: "◯" },
];

// Lista de aparelhos para a calculadora de energia (potência em Watts)
export const APARELHOS = [
  { nome: "Chuveiro", w: 5500 },
  { nome: "Ar-condicionado", w: 1500 },
  { nome: "Geladeira", w: 400 },
  { nome: 'TV 55"', w: 150 },
  { nome: "Computador", w: 300 },
];

// Dicas sustentáveis exibidas na DicasScreen
export const DICAS = [
  {
    icon: "🚿",
    title: "Banhos curtos",
    desc: "Banhos de até 5 min economizam até 60% da água",
    cor: C.blue,
  },
  {
    icon: "🔌",
    title: "Tirar da tomada",
    desc: "Desligar aparelhos em stand-by reduz até 12% no consumo",
    cor: C.gold,
  },
  {
    icon: "💡",
    title: "Lâmpadas LED",
    desc: "Consomem até 80% menos energia que as incandescentes",
    cor: C.teal,
  },
  {
    icon: "🌡️",
    title: "Ar-condicionado",
    desc: "Manter a 23°C reduz em 10% o consumo elétrico",
    cor: C.violet,
  },
  {
    icon: "🫙",
    title: "Reúso de água",
    desc: "Água do enxágue pode ser reaproveitada para limpeza",
    cor: C.blue,
  },
];

// Dados do gráfico semanal
// Futuramente virá de uma API; por enquanto são dados simulados
export const DADOS_SEMANA = {
  dias: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"],
  agua: [60, 75, 55, 80, 65, 40, 45], // litros por dia
  energia: [0.9, 1.1, 0.8, 1.3, 1.0, 0.7, 0.5], // kWh por dia
};

// Dados do usuário — mock (simulação de perfil logado)
// Em produção viria de autenticação / banco de dados
export const USUARIO = {
  nome: "Cristiano Silva",
  email: "cristiano@email.com",
  nivel: "Iniciante Sustentável",
  aguaPoupada: "69 L",
  energiaPoupada: "4.2 kWh",
};

// Constantes de cálculo usadas nas telas
export const LITROS_POR_MINUTO_BANHO = 7; // média de chuveiro padrão
export const TARIFA_KWH = 0.87; // R$/kWh — tarifa média nacional
