// =============================================================
// DADOS ESTÁTICOS DO WAVUNDER
// =============================================================

import { C } from "./colors";

// Itens do menu FAB (botão flutuante)
// NAV_ITEMS: Relatórios saiu, Dicas entrou
export const NAV_ITEMS = [
  { id: "home", label: "Início", icon: "⊞" },
  { id: "dicas", label: "Dicas", icon: "🌿" },
  { id: "perfil", label: "Perfil", icon: "◯" },
];

// FAB_ITEMS: continua igual (Relatórios fica aqui)
export const FAB_ITEMS = [
  { id: "agua", icon: "💧", label: "Água", color: "#5BBFFF" },
  { id: "energia", icon: "⚡", label: "Energia", color: "#F0A500" },
  { id: "dicas", icon: "🌿", label: "Dicas", color: "#2EDCB0" },
  { id: "relatorios", icon: "📊", label: "Relatórios", color: "#A78BFA" },
];

// Lista de aparelhos para a calculadora de energia
export const APARELHOS = [
  { nome: "Chuveiro", w: 5500 },
  { nome: "Ar-condicionado", w: 1500 },
  { nome: "Geladeira", w: 400 },
  { nome: 'TV 55"', w: 150 },
  { nome: "Computador", w: 300 },
];

// Categorias de "Outros" consumos
export const OUTROS_CONSUMOS = [
  { icon: "Zap", label: "Gás", value: "2.1 kWh", percent: 8 },
  { icon: "Power", label: "Stand-by", value: "1.8 kWh", percent: 7 },
  { icon: "Lightbulb", label: "Iluminação", value: "1.2 kWh", percent: 5 },
];

// Dicas sustentáveis expandidas (15 dicas completas)
export const DICAS = [
  // ALERTA (mostrado primeiro se consumo alto)
  {
    icon: "🚀",
    title: "⚠️ ALERTA: Consumo Alto!",
    desc: "Seu consumo está acima da média. Reduza banhos para 5min e desligue aparelhos desnecessários.",
    cor: C.danger,
    categoria: "alerta",
    prioridade: "maxima",
  },
  // DICAS ÁGUA
  {
    icon: "🚿",
    title: "Banhos curtos",
    desc: "Banhos de até 5 min economizam até 60% da água",
    cor: C.blue,
    categoria: "agua",
    prioridade: "alta",
  },
  {
    icon: "🚰",
    title: "Vazamentos",
    desc: "Uma torneira gotejando desperdiça 46L por dia! Verifique regularmente",
    cor: C.blue,
    categoria: "agua",
    prioridade: "alta",
  },
  {
    icon: "🧴",
    title: "Lavar louça",
    desc: "Encher a pia economiza mais água que lavar com torneira aberta",
    cor: C.blue,
    categoria: "agua",
    prioridade: "media",
  },
  {
    icon: "🪴",
    title: "Rega inteligente",
    desc: "Regar no início da manhã reduz evaporação em 30%",
    cor: C.teal,
    categoria: "agua",
    prioridade: "baja",
  },
  {
    icon: "🧊",
    title: "Água da chuva",
    desc: "Coletar água da chuva economiza até 50% da conta mensal",
    cor: C.blue,
    categoria: "agua",
    prioridade: "media",
  },
  // DICAS ENERGIA
  {
    icon: "🔌",
    title: "Tirar da tomada",
    desc: "Desligar aparelhos em stand-by reduz até 12% no consumo",
    cor: C.gold,
    categoria: "energia",
    prioridade: "alta",
  },
  {
    icon: "💡",
    title: "Lâmpadas LED",
    desc: "Consomem até 80% menos energia que as incandescentes",
    cor: C.teal,
    categoria: "energia",
    prioridade: "media",
  },
  {
    icon: "🌡️",
    title: "Ar-condicionado",
    desc: "Manter a 23°C reduz em 10% o consumo elétrico",
    cor: C.violet,
    categoria: "energia",
    prioridade: "media",
  },
  {
    icon: "❄️",
    title: "Geladeira limpa",
    desc: "Limpar serpentinas reduz em 25% o consumo de energia",
    cor: C.gold,
    categoria: "energia",
    prioridade: "baja",
  },
  {
    icon: "🌙",
    title: "Modo noturno",
    desc: "Usar modo noturno em dispositivos economiza até 15% de bateria",
    cor: C.gold,
    categoria: "energia",
    prioridade: "baja",
  },
  {
    icon: "📺",
    title: "TV e eletrônicos",
    desc: "Desligar completamente (não stand-by) economiza até 8% mensalmente",
    cor: C.gold,
    categoria: "energia",
    prioridade: "media",
  },
  // DICAS GERAIS
  {
    icon: "🫙",
    title: "Reúso de água",
    desc: "Água do enxágue pode ser reaproveitada para limpeza",
    cor: C.teal,
    categoria: "geral",
    prioridade: "media",
  },
  {
    icon: "🧺",
    title: "Máquina cheia",
    desc: "Usar máquina de lavar com carga completa economiza água e energia",
    cor: C.teal,
    categoria: "geral",
    prioridade: "media",
  },
  {
    icon: "🚿",
    title: "Chuveiro econômico",
    desc: "Instalar redutor de vazão economiza 30% com conforto mantido",
    cor: C.blue,
    categoria: "agua",
    prioridade: "alta",
  },
];

// Dados do gráfico semanal
export const DADOS_SEMANA = {
  dias: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"],
  agua: [60, 75, 55, 80, 65, 40, 45],
  energia: [0.9, 1.1, 0.8, 1.3, 1.0, 0.7, 0.5],
  outros: [0.3, 0.25, 0.4, 0.35, 0.28, 0.22, 0.18],
};

// Dados do usuário
export const USUARIO = {
  nome: "Cristiano Silva",
  email: "cristiano@email.com",
  nivel: "Iniciante Sustentável",
  aguaPoupada: "69 L",
  energiaPoupada: "4.2 kWh",
};

// Constantes de cálculo
export const LITROS_POR_MINUTO_BANHO = 7;
export const TARIFA_KWH = 0.87;

// Perguntas FAQ
export const FAQ_AJUDA = [
  {
    pergunta: "Como funciona o app?",
    resposta:
      "O Wavunder ajuda a monitorar seu consumo de água e energia, oferecendo dicas personalizadas de economia.",
  },
  {
    pergunta: "Como fazer login?",
    resposta:
      "Use seu e-mail e senha cadastrados. Se não tem conta, clique em 'Cadastrar'.",
  },
  {
    pergunta: "Posso recuperar minha senha?",
    resposta:
      "Sim, clique em 'Esqueci minha senha' na tela de login e siga as instruções.",
  },
  {
    pergunta: "Como funciona o cálculo de consumo?",
    resposta:
      "Calculamos baseado no tempo de uso. Para banho: 7L por minuto. Para energia: W × minutos ÷ 60.",
  },
  {
    pergunta: "Os dados são salvos?",
    resposta:
      "Sim, seus dados são salvos localmente no seu dispositivo e sincronizados na nuvem.",
  },
];

// Políticas de privacidade
export const PRIVACIDADE_SECOES = [
  {
    titulo: "Coleta de Dados",
    conteudo:
      "Coletamos apenas dados de consumo necessários para calcular economia e oferecer dicas personalizadas.",
  },
  {
    titulo: "Compartilhamento",
    conteudo:
      "Seus dados não são compartilhados com terceiros. Você tem controle total sobre suas informações.",
  },
  {
    titulo: "Segurança",
    conteudo:
      "Usamos criptografia SHA-256 para proteger suas senhas e dados sensíveis.",
  },
  {
    titulo: "Retenção",
    conteudo:
      "Os dados são mantidos enquanto sua conta estiver ativa. Pode solicitar exclusão a qualquer momento.",
  },
];

// Tipos de notificações
export const TIPOS_NOTIFICACOES = [
  {
    id: "consumo_alto",
    label: "Consumo Alto",
    descricao: "Alerta quando consumo ultrapassa limite",
  },
  {
    id: "dica_diaria",
    label: "Dica do Dia",
    descricao: "Receba dica de economia a cada dia",
  },
  {
    id: "economia_meta",
    label: "Meta Atingida",
    descricao: "Notifique ao atingir meta de economia",
  },
  {
    id: "atualizacoes",
    label: "Atualizações",
    descricao: "Novos recursos e melhorias do app",
  },
];
