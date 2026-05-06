# Wavunder — Monitoramento de Consumo Sustentável

App mobile de monitoramento e conscientização sobre consumo de água e energia.
Desenvolvido como projeto acadêmico com foco em sustentabilidade urbana.

## O problema

O Brasil desperdiça 38,3% da água tratada antes de chegar às torneiras (SNIS 2022).
O consumo residencial médio de energia cresceu 4,7% ao ano na última década (ANEEL).
O Wavunder permite que cidadãos monitorem e reduzam seu consumo de forma simples.

## Stack

| Camada | Tecnologia | Versão |
|--------|-----------|--------|
| Frontend | React Native + Expo | SDK 54 |
| Backend | FastAPI (Python) | 0.115+ |
| ORM | SQLAlchemy + Alembic | — |
| Banco (local) | SQLite | — |
| Banco (produção) | PostgreSQL via Railway | — |
| Animações | moti + react-native-reanimated | — |
| Ícones | @expo/vector-icons (Ionicons) | — |

## Funcionalidades

- **Autenticação:** login, cadastro, recuperação de senha por e-mail (código 6 dígitos)
- **Registro:** água (banho, pia, louça, outro), energia (por aparelho), outros consumos em R$
- **Histórico:** edição e exclusão de registros individuais com data retroativa
- **Análise:** gráfico semanal, totais da semana, nível sustentável (Ótimo/Bom/Atenção/Crítico)
- **Educação:** 18 dicas com fontes reais (ANEEL, ANA, SNIS, Procel, EMBRAPA)
- **Multiplataforma:** Web, iOS, Android — mesmo código

## Como rodar localmente

Ver `SETUP.md` para instruções detalhadas.

```bash
# Backend
cd Backend_Api && pip install -r requirements.txt
alembic upgrade head && uvicorn src.main:app --reload

# Frontend
cd Consumo_react && npm install && npx expo start
```

## Deploy

Backend hospedado no Railway, conectado ao GitHub (branch main).
A cada push na main, Railway faz redeploy automático.
URL: https://monitoramento-consumo-production.up.railway.app/

## Segurança

- Senhas hasheadas com bcrypt
- Login retorna erro genérico (não revela se é email ou senha incorretos)
- Dados de consumo isolados por id_usuario no banco
- Timeout de 10s em todas as requisições

## Estrutura de pastas

```
Backend_Api/src/
├── core/        segurança e envio de e-mail
├── database/    conexão e sessão SQLAlchemy
├── models/      Usuario, Consumo, Meta, Dica
├── routes/v1/   auth_routes.py, consumo_routes.py
└── schemas/     validação de entrada (Pydantic)

Consumo_react/src/
├── components/  básicos (InlineMessage, PasswordInput), intermediários (StatBar), layout
├── constants/   dados estáticos (DICAS array com 18 itens)
├── contexts/    AuthContext, ConsumptionContext, ThemeContext
├── navigations/ AppNavigator (Stack), MainTabs (4 abas)
├── screens/     Login, Register, Home, RegisterConsumption, Reports, Profile, Tips...
├── services/    api.js — comunicação com o backend
└── utils/       sustainability.js — calcularNivel, calcularEconomiaReais
```
