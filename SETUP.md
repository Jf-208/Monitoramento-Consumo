# Setup — Wavunder

## Pré-requisitos

| Ferramenta | Versão | Instalação |
|-----------|--------|-----------|
| Node.js | 18+ | nodejs.org |
| Python | 3.11+ | python.org |
| Expo Go | latest | App Store / Play Store |
| EAS CLI (APK) | latest | `npm install -g eas-cli` |

## Backend

```bash
cd Backend_Api

# Ambiente virtual
python -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate

# Dependências
pip install -r requirements.txt

# Variáveis de ambiente
cp .env.example .env
# Preencher DATABASE_URL, EMAIL_REMETENTE, EMAIL_SENHA_APP

# Criar banco e aplicar todas as migrations
alembic upgrade head

# (Opcional) Dados de demonstração
python seed_demo.py

# Servidor local
uvicorn src.main:app --reload --port 8000
# Docs: http://localhost:8000/docs
```

## Frontend

```bash
cd Consumo_react
npm install

# Para usar backend local: em src/services/api.js → EM_PRODUCAO = false
# Para usar Railway: EM_PRODUCAO = true (padrão de produção)

npx expo start           # abre no browser ou Expo Go
npx expo start --tunnel  # usa ngrok — funciona em qualquer rede
```

## Gerar APK Android

```bash
cd Consumo_react
npm install -g eas-cli
eas login
eas build --platform android --profile preview
# APK disponível em ~10-15 min no link gerado
```

## Troubleshooting

| Problema | Causa | Solução |
|---------|-------|---------|
| Expo Go: navigation error | Falta import gesture-handler | 1ª linha do index.js: `import 'react-native-gesture-handler'` |
| Backend 500 ao registrar | Migration não aplicada | Rodar `alembic upgrade head` ou verificar Procfile |
| Home mostra 0L e 0kWh | EM_PRODUCAO errado ou Railway offline | Verificar api.js e status do Railway |
| Porta em uso | Processo anterior não encerrado | `npx kill-port 8000 8081 19000` |

## Variáveis de ambiente (.env)

```env
# Banco de dados
DATABASE_URL=sqlite:///banco.sqlite             # local
# DATABASE_URL=postgresql://user:pass@host/db   # Railway

# E-mail para reset de senha (Gmail com senha de app)
EMAIL_REMETENTE=seu@gmail.com
EMAIL_SENHA_APP=xxxx xxxx xxxx xxxx
```
