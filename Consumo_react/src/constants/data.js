// =============================================================
// DADOS ESTÁTICOS DO WAVUNDER
// =============================================================

import { C } from "./colors";

// Itens de navegacao inferior
// NAV_ITEMS: Relatorios saiu, Dicas entrou
export const NAV_ITEMS = [
  { id: "home", label: "Inicio", icon: "home" },
  { id: "dicas", label: "Dicas", icon: "bulb" },
  { id: "perfil", label: "Perfil", icon: "person-circle" },
];

// FAB_ITEMS: itens do botao flutuante
export const FAB_ITEMS = [
  { id: "agua", icon: "water", label: "Agua", color: "#5BBFFF" },
  { id: "energia", icon: "flash", label: "Energia", color: "#F0A500" },
  { id: "dicas", icon: "bulb", label: "Dicas", color: "#2EDCB0" },
  { id: "relatorios", icon: "bar-chart", label: "Relatorios", color: "#A78BFA" },
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

// Dicas sustentaveis — 18 dicas com fontes reais (ANEEL, SNIS, ANA, Procel)
// O campo 'icon' usa nomes Ionicons para @expo/vector-icons
export const DICAS = [
  { id: 1, icon: 'water', categoria: 'agua', cor: '#378ADD', title: 'Banho de 5 minutos economiza 45 litros', desc: 'Um banho de 5 min com chuveiro eletrico usa 45L. Reduzir de 15 para 5 min poupa 90L por dia. Fonte: SNIS 2022.', fonte: 'SNIS' },
  { id: 2, icon: 'flash', categoria: 'energia', cor: '#EF9F27', title: 'Chuveiro eletrico = 25% da conta de luz', desc: 'Responsavel por ate 25% do consumo residencial de energia. Prefira banhos curtos ou aquecedor solar. Fonte: ANEEL.', fonte: 'ANEEL' },
  { id: 3, icon: 'leaf', categoria: 'agua', cor: '#1D9E75', title: 'Torneira aberta: 12 litros por minuto', desc: 'Fechar durante a escovacao economiza 24L por vez — 720L por mes. Fonte: ANA.', fonte: 'ANA' },
  { id: 4, icon: 'bulb', categoria: 'energia', cor: '#EF9F27', title: 'LED gasta 80% menos que incandescente', desc: 'LED de 9W substitui incandescente de 60W. Economia de ~1,6 kWh por lampada/mes. Fonte: Procel.', fonte: 'Procel' },
  { id: 5, icon: 'water', categoria: 'agua', cor: '#378ADD', title: 'Descarga dupla economiza 50%', desc: 'Acionamento duplo usa 3L ou 6L contra 9L do convencional. Retorno em menos de 2 anos. Fonte: ANA.', fonte: 'ANA' },
  { id: 6, icon: 'flash', categoria: 'vampiro', cor: '#A32D2D', title: 'Consumo fantasma: ate 12% da conta', desc: 'Aparelhos em standby consomem entre 5% e 12% da energia residencial. Desligue da tomada. Fonte: ANEEL.', fonte: 'ANEEL' },
  { id: 7, icon: 'thermometer', categoria: 'energia', cor: '#EF9F27', title: 'Geladeira ideal: 3 a 5 graus', desc: 'Cada grau abaixo do necessario aumenta consumo em ~5%. Nao coloque alimentos quentes. Fonte: Procel.', fonte: 'Procel' },
  { id: 8, icon: 'water', categoria: 'agua', cor: '#378ADD', title: 'Maquina de lavar: capacidade maxima', desc: 'Meia carga usa quase a mesma agua que carga completa (~120L). Junte roupas. Fonte: SNIS.', fonte: 'SNIS' },
  { id: 9, icon: 'sunny', categoria: 'energia', cor: '#EF9F27', title: 'Energia solar: payback de 4 a 6 anos', desc: 'Sistemas solares residenciais tem retorno entre 4 e 6 anos, com vida util de 25+ anos. Fonte: ANEEL.', fonte: 'ANEEL' },
  { id: 10, icon: 'leaf', categoria: 'agua', cor: '#1D9E75', title: 'Reaproveitamento de agua da chuva', desc: 'Captacao pluvial para irrigacao e descarga reduz consumo de agua tratada em ate 40%. Fonte: ANA.', fonte: 'ANA' },
  { id: 11, icon: 'flash', categoria: 'energia', cor: '#EF9F27', title: 'Ar-condicionado: 22C usa 30% mais que 24C', desc: 'Cada grau abaixo de 24C consome ~8-10% mais energia. Preferir 24C no verao. Fonte: Procel.', fonte: 'Procel' },
  { id: 12, icon: 'water', categoria: 'agua', cor: '#378ADD', title: 'Vazamentos: 1 gota/seg = 46L/dia', desc: 'Torneira pingando desperdica ~46L por dia. Trocar vedacoes e simples e barato. Fonte: ANA.', fonte: 'ANA' },
  { id: 13, icon: 'flash', categoria: 'vampiro', cor: '#A32D2D', title: 'Videogame em standby consome sem parar', desc: 'Console moderno em standby pode consumir ate 8W constantemente. Em um mes, ~5,8 kWh desperdicados.', fonte: 'Procel' },
  { id: 14, icon: 'leaf', categoria: 'agua', cor: '#1D9E75', title: 'Irrigacao: regar no horario certo', desc: 'Regar entre 6h-8h ou apos 17h reduz evaporacao em ate 60% comparado ao pico. Fonte: EMBRAPA.', fonte: 'EMBRAPA' },
  { id: 15, icon: 'flash', categoria: 'energia', cor: '#EF9F27', title: 'Ferro de passar: use a potencia certa', desc: 'Passar roupas delicadas com menor temperatura e pesadas no fim economiza ate 20%. Fonte: Procel.', fonte: 'Procel' },
  { id: 16, icon: 'water', categoria: 'agua', cor: '#378ADD', title: 'Lavar calcadas com vassoura', desc: 'Mangueira usa ate 280L de agua em 50m2 de calcada. Vassoura usa zero. Fonte: ANA.', fonte: 'ANA' },
  { id: 17, icon: 'bulb', categoria: 'energia', cor: '#EF9F27', title: 'Sensores de presenca reduzem 30%', desc: 'Em areas de circulacao, sensores evitam luz ligada sem necessidade. Payback em menos de 1 ano. Fonte: Procel.', fonte: 'Procel' },
  { id: 18, icon: 'water', categoria: 'alerta', cor: '#E24B4A', title: 'Brasil desperdica 38% da agua tratada', desc: 'O pais perde 38,3% da agua tratada antes de chegar as torneiras — por vazamentos em redes antigas. Fonte: SNIS 2022.', fonte: 'SNIS 2022' },
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
