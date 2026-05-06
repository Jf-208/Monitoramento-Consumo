# Wavunder — Monitoramento de Consumo Sustentável

> App mobile de monitoramento e conscientização sobre consumo de água e energia.
> Desenvolvido como projeto acadêmico para a disciplina de Desenvolvimento de Sistemas.

---

## O Problema

O Brasil desperdiça **38,3% da água tratada** antes de chegar às torneiras (SNIS 2022).
O consumo residencial médio de energia cresceu **4,7% ao ano** na última década (ANEEL).

O **Wavunder** permite que cidadãos monitorem e reduzam seu consumo de forma simples,
com dados reais, feedback visual imediato e dicas de sustentabilidade com fontes confiáveis.

---

## Stack

| Camada | Tecnologia | Versão |
|--------|-----------|--------|
| Frontend | React Native + Expo | SDK 54 |
| Backend | FastAPI (Python) | 0.115+ |
| ORM | SQLAlchemy + Alembic | 2.0 / 1.14 |
| Banco (local) | SQLite | — |
| Banco (produção) | PostgreSQL via Railway | — |
| Animações | moti + react-native-reanimated | — |
| Ícones | @expo/vector-icons (Ionicons) | — |
| Segurança de senha | bcrypt | — |
| Deploy | Railway (CI/CD automático via GitHub) | — |
| Build APK | EAS Build (Expo Application Services) | — |

---

## Funcionalidades

- **Autenticação completa:** login, cadastro, recuperação de senha por e-mail (código de 6 dígitos com expiração de 15 min)
- **Registro de consumo:** água (banho, pia, louça, outro), energia (por aparelho com potência em Watts), outros gastos em R$
- **Histórico:** edição e exclusão de registros individuais com suporte a data retroativa
- **Análise semanal:** gráfico de barras empilhado, gráfico de pizza por categoria (em R$), totais da semana
- **Dashboard:** nível sustentável (Ótimo / Bom / Atenção / Crítico), barras de progresso mensais, gasto estimado
- **Educação:** 10 dicas de sustentabilidade com fontes reais (ANEEL, ANA, SNIS, Procel)
- **Perfil:** foto de perfil editável, alteração de senha, apagar conta, alternância de tema escuro/claro
- **Multiplataforma:** Web, iOS e Android — mesmo código-fonte

---

## Estrutura de Pastas

```
Monitoramento-Consumo/
├── README.md                         ← Documentação principal do projeto
├── SETUP.md                          ← Guia de instalação e execução local
├── .gitignore                        ← Arquivos ignorados pelo Git (raiz)
│
├── Backend_Api/
│   ├── Procfile                      ← Railway: alembic upgrade head && uvicorn ...
│   ├── runtime.txt                   ← Versão Python para Railway (3.11)
│   ├── requirements.txt              ← Dependências Python com versões fixas
│   ├── .env.example                  ← Template de variáveis de ambiente
│   ├── seed_demo.py                  ← Popula banco com 3 usuários demo (30 dias de histórico)
│   ├── alembic.ini                   ← Configuração do Alembic (migrations)
│   ├── alembic/versions/             ← Histórico de migrations do banco de dados
│   └── src/
│       ├── main.py                   ← Entry point FastAPI: CORS, lifespan, routers
│       ├── core/
│       │   ├── email_service.py      ← Envio de e-mail SMTP Gmail (porta 587/465 fallback)
│       │   └── security.py           ← Hash e verificação de senha com bcrypt
│       ├── database/
│       │   └── connection.py         ← Engine SQLAlchemy, SessionLocal, get_db
│       ├── models/
│       │   ├── base.py               ← Base declarativa do SQLAlchemy
│       │   └── models.py             ← Tabelas: Usuario, Consumo, Meta, Dica
│       ├── routes/v1/
│       │   ├── auth_routes.py        ← /register /login /esqueci-senha /verificar-codigo /alterar-senha
│       │   └── consumo_routes.py     ← CRUD consumo + resumo semanal + resumo mensal + histórico
│       └── schemas/
│           └── user_schema.py        ← Schemas Pydantic de entrada e saída
│
└── Consumo_react/
    ├── App.js                        ← Providers: ThemeContext → AuthContext → ConsumptionContext
    ├── index.js                      ← Entry point: gesture-handler → reanimated → registerRootComponent
    ├── app.json                      ← Config Expo (nome, slug, android.package, versionCode)
    ├── eas.json                      ← Perfis EAS Build (preview=APK, production=AAB)
    ├── babel.config.js               ← Preset Expo + reanimated/plugin (deve ser o último)
    └── src/
        ├── components/
        │   ├── basic/
        │   │   ├── InlineMessage.js  ← Feedback visual (erro/sucesso) — substitui alert()
        │   │   ├── PasswordInput.js  ← Input de senha com toggle mostrar/ocultar
        │   │   └── Chip.js           ← Tag de seleção reutilizável
        │   ├── intermediate/
        │   │   └── StatBar.js        ← Barra de progresso animada (consumo mensal)
        │   └── layout/
        │       ├── BottomNav.js      ← Navegação inferior (nestedScrollEnabled)
        │       ├── FAB.js            ← Botão flutuante de ação
        │       └── ScreenScrollView.js ← ScrollView padrão com safe area
        ├── constants/
        │   ├── colors.js             ← Paleta de cores centralizada
        │   └── data.js               ← DICAS[10] com fonte e ícone de cada dica
        ├── contexts/
        │   ├── AuthContext.js        ← Estado global de autenticação + AsyncStorage
        │   ├── ConsumptionContext.js ← Estado global de consumo (salvar, editar, excluir, buscar)
        │   └── ThemeContext.js       ← Tema escuro/claro com toggle
        ├── navigations/
        │   ├── AppNavigator.js       ← Stack Navigator (telas autenticadas e públicas)
        │   └── MainTabs.js           ← Bottom Tab Navigator (Home, Registrar, Relatórios, Perfil)
        ├── screens/
        │   ├── Home/                 ← Dashboard: nível sustentável, StatBars, dica do dia
        │   ├── RegisterConsumption/  ← 3 sub-abas: Água / Energia / Outros Consumos
        │   ├── Reports/              ← Gráfico semanal (barras + pizza), totais
        │   ├── Profile/              ← Foto, informações, configurações, logout, apagar conta
        │   ├── Login/                ← Autenticação com e-mail e senha
        │   ├── Register/             ← Cadastro de novo usuário
        │   ├── ForgotPassword/       ← Recuperação de senha em 2 etapas (e-mail → código → nova senha)
        │   ├── ChangePassword/       ← Alterar senha (usuário logado)
        │   ├── Tips/                 ← 10 dicas de sustentabilidade com fontes reais
        │   ├── Help/                 ← FAQ com 4 perguntas frequentes
        │   └── Privacy/              ← Política de privacidade (conformidade LGPD)
        ├── services/
        │   └── api.js                ← Fetch centralizado com timeout 10s (flag EM_PRODUCAO)
        ├── styles/
        │   └── screensStyles.js      ← Estilos compartilhados entre telas
        ├── theme/
        │   └── colors.js             ← Alias de cores do tema
        └── utils/
            └── sustainability.js     ← calcularNivel(), calcularEconomiaReais()
```

---

## Como Rodar Localmente

Ver [`SETUP.md`](./SETUP.md) para instruções detalhadas.

```bash
# 1. Backend
cd Backend_Api
python -m venv venv
venv\Scripts\activate          # Windows
pip install -r requirements.txt
cp .env.example .env           # preencher DATABASE_URL, EMAIL_REMETENTE, EMAIL_SENHA_APP
alembic upgrade head           # cria o banco com todas as migrations
python seed_demo.py            # popula com dados demo (opcional)
uvicorn src.main:app --reload --port 8000

# 2. Frontend (em outro terminal)
cd Consumo_react
npm install
npx expo start                 # ou: npx expo start --tunnel (qualquer rede)
```

---

## Deploy

| Serviço | URL | Trigger |
|---------|-----|---------|
| Railway (backend) | https://monitoramento-consumo-production.up.railway.app | Push na branch `main` |

A cada push na `main`, o Railway executa automaticamente:
```
alembic upgrade head && uvicorn src.main:app --host 0.0.0.0 --port $PORT
```

Documentação interativa da API disponível em:
`https://monitoramento-consumo-production.up.railway.app/docs`

---

## Segurança

| Medida | Implementação |
|--------|--------------|
| Senhas | Hash bcrypt (salt único por senha) — nunca armazenadas em texto puro |
| Login | Erro 401 genérico — não revela se foi e-mail ou senha incorretos |
| Recuperação | Sempre retorna mensagem genérica — não revela se e-mail existe |
| Dados | Isolados por `id_usuario` — nenhum usuário acessa dados de outro |
| E-mail | Gmail com Senha de App (não a senha normal da conta Google) |
| Requests | Timeout de 10 s em todas as requisições do frontend |
| Variáveis | `DATABASE_URL`, `EMAIL_SENHA_APP` apenas via variáveis de ambiente |

---

## Usuários Demo (após rodar seed_demo.py)

| Nome | E-mail | Senha | Perfil |
|------|--------|-------|--------|
| Vitor | vitor@wavunder.app | demo123 | Consumo moderado |
| Ana | ana@wavunder.app | demo123 | Sustentável (nível Ótimo) |
| Pedro | pedro@wavunder.app | demo123 | Consumo alto (nível Crítico) |

---

## Gerar APK Android

```bash
cd Consumo_react
npm install -g eas-cli
eas login
eas build --platform android --profile preview
# APK disponível em ~10-15 min no link gerado pelo EAS
```

---

## Licença

Projeto acadêmico — Wavunder v3 · 2026
