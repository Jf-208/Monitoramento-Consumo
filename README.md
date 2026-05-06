# Wavunder — Monitoramento de Consumo Sustentável

> App mobile de monitoramento e conscientização sobre consumo de água e energia.
> Desenvolvido como projeto acadêmico com foco em sustentabilidade urbana.

---

## O Problema

O Brasil desperdiça **38,3% da água tratada** antes de chegar às torneiras (SNIS 2022).
O consumo residencial médio de energia cresceu **4,7% ao ano** na última década (ANEEL).

O **Wavunder** permite que cidadãos monitorem e reduzam seu consumo de forma simples, com dados reais e feedback visual imediato.

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
| Segurança | bcrypt (passlib) | — |

---

## Funcionalidades

- **Autenticação completa:** login, cadastro, recuperação de senha por e-mail (código 6 dígitos)
- **Registro de consumo:** água (banho, pia, louça, outro), energia (por aparelho), outros gastos em R$
- **Histórico:** edição e exclusão de registros individuais com suporte a data retroativa
- **Análise semanal:** gráfico de barras, totais da semana, nível sustentável (Ótimo / Bom / Atenção / Crítico)
- **Educação:** 18 dicas de sustentabilidade com fontes reais (ANEEL, ANA, SNIS, Procel, EMBRAPA)
- **Perfil:** foto de perfil editável, alteração de senha, logout
- **Multiplataforma:** Web, iOS, Android — mesmo código-fonte

---

## Estrutura de Pastas

```
Monitoramento-Consumo/
├── Backend_Api/
│   ├── src/
│   │   ├── core/
│   │   │   ├── email_service.py      ← Envio de e-mail SMTP Gmail (porta 587/465 fallback)
│   │   │   └── security.py           ← Hash bcrypt
│   │   ├── database/
│   │   │   └── connection.py         ← Engine SQLAlchemy, SessionLocal
│   │   ├── models/
│   │   │   ├── base.py               ← Base declarativa SQLAlchemy
│   │   │   └── models.py             ← Tabelas: Usuario, Consumo, Meta, Dica
│   │   ├── routes/v1/
│   │   │   ├── auth_routes.py        ← POST /login, /register, /esqueci-senha, /verificar-codigo
│   │   │   └── consumo_routes.py     ← GET/POST/PUT/DELETE /consumo, /resumo, /resumo-mensal
│   │   ├── schemas/
│   │   │   └── user_schema.py        ← Validação Pydantic
│   │   └── main.py                   ← App FastAPI, CORS, routers
│   ├── alembic/versions/             ← Migrations do banco de dados
│   ├── Procfile                      ← Railway: alembic upgrade head && uvicorn ...
│   ├── requirements.txt              ← Dependências Python com versões fixas
│   ├── .env.example                  ← Template de variáveis de ambiente
│   └── seed_demo.py                  ← Popula banco com 3 usuários demo (30 dias de histórico)
│
└── Consumo_react/
    ├── src/
    │   ├── components/
    │   │   ├── basic/
    │   │   │   ├── InlineMessage.js  ← Feedback visual (erro/sucesso) em vez de alert()
    │   │   │   └── PasswordInput.js  ← Input de senha com mostrar/ocultar
    │   │   ├── intermediate/
    │   │   │   └── StatBar.js        ← Barra de progresso animada
    │   │   └── layout/
    │   │       └── ScreenScrollView.js ← ScrollView padrão com safe area
    │   ├── constants/
    │   │   └── data.js               ← Array DICAS[18] com fonte e ícone de cada dica
    │   ├── contexts/
    │   │   ├── AuthContext.js        ← Estado global de autenticação
    │   │   ├── ConsumptionContext.js ← Estado global de consumo (salvar, editar, excluir)
    │   │   └── ThemeContext.js       ← Tema escuro/claro
    │   ├── navigations/
    │   │   ├── AppNavigator.js       ← Stack Navigator (rotas autenticadas e não-autenticadas)
    │   │   └── MainTabs.js           ← Bottom Tab Navigator (4 abas)
    │   ├── screens/
    │   │   ├── Home/                 ← Dashboard: nível sustentável, StatBars, dica do dia
    │   │   ├── RegisterConsumption/  ← 3 sub-abas: Água / Energia / Outros
    │   │   ├── Reports/              ← Gráfico semanal + listagem
    │   │   ├── Profile/              ← Foto de perfil, informações, logout
    │   │   ├── Login/ Register/      ← Autenticação
    │   │   ├── ForgotPassword/       ← Recuperação de senha em 2 etapas
    │   │   ├── ChangePassword/       ← Alterar senha (logado)
    │   │   ├── Tips/                 ← 18 dicas de sustentabilidade
    │   │   ├── Help/                 ← FAQ em acordeão por categoria
    │   │   └── Privacy/              ← Política de privacidade (LGPD)
    │   ├── services/
    │   │   └── api.js                ← Chamadas HTTP ao backend (flag EM_PRODUCAO)
    │   └── utils/
    │       └── sustainability.js     ← calcularNivel(), calcularEconomiaReais()
    ├── App.js                        ← Providers (Auth, Consumption, Theme) + AppNavigator
    ├── index.js                      ← Entry point: gesture-handler → reanimated → registerRootComponent
    ├── app.json                      ← Config Expo (nome, slug, android package)
    └── eas.json                      ← Config EAS Build (preview=APK, production=AAB)
```

---

## Como Rodar Localmente

Ver `SETUP.md` para instruções detalhadas.

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
| Railway (backend) | https://monitoramento-consumo-production.up.railway.app/ | Push na branch `main` |

A cada push na `main`, o Railway executa automaticamente:
```
alembic upgrade head && uvicorn src.main:app --host 0.0.0.0 --port $PORT
```

---

## Segurança

| Medida | Implementação |
|--------|--------------|
| Senhas | Hash bcrypt via passlib (salt único por senha) |
| Login | Retorna erro 401 genérico (não revela se é e-mail ou senha incorretos) |
| Recuperação | Retorna sucesso genérico (não revela se e-mail existe) |
| Dados | Isolados por `id_usuario` — nenhum usuário acessa dados de outro |
| E-mail | Envio via Gmail com Senha de App (não a senha normal da conta) |
| Requests | Timeout de 10s em todas as requisições do frontend |

---

## Usuários Demo (após rodar seed_demo.py)

| Nome | E-mail | Senha | Perfil |
|------|--------|-------|--------|
| Vitor | vitor@wavunder.app | demo123 | Moderado |
| Ana | ana@wavunder.app | demo123 | Sustentável (Ótimo) |
| Pedro | pedro@wavunder.app | demo123 | Alto (Crítico) |

---

## Gerar APK Android

```bash
cd Consumo_react
npm install -g eas-cli
eas login
eas build --platform android --profile preview
# APK disponível em ~15 min no link gerado
```
