# SETUP — Wavunder

> Guia completo para rodar o projeto localmente e gerar o APK Android.

---

## Pré-requisitos

| Ferramenta                | Versão mínima | Download                             |
| ------------------------- | ------------- | ------------------------------------ |
| Python                    | 3.11+         | [python.org](https://www.python.org) |
| Node.js                   | 18+           | [nodejs.org](https://nodejs.org)     |
| Git                       | qualquer      | [git-scm.com](https://git-scm.com)   |
| Expo Go (celular)         | latest        | App Store / Play Store               |
| EAS CLI (apenas para APK) | latest        | `npm install -g eas-cli`             |

---

## 1. Clonar o Repositório

```bash
git clone https://github.com/Jf-208/Monitoramento-Consumo.git
cd Monitoramento-Consumo
```

---

## 2. Backend (FastAPI + SQLAlchemy)

```bash
cd Backend_Api

# Criar e ativar ambiente virtual Python
python -m venv venv
venv\Scripts\activate           # Windows
# source venv/bin/activate      # macOS / Linux

# Instalar dependências
pip install -r requirements.txt

# Configurar variáveis de ambiente
# Windows:
copy .env.example .env
# macOS / Linux:
# cp .env.example .env

# Abra o .env e preencha:
#   DATABASE_URL=sqlite:///banco.sqlite   (para desenvolvimento local)
#   EMAIL_REMETENTE=seu@gmail.com
#   EMAIL_SENHA_APP=xxxx xxxx xxxx xxxx   (Senha de App do Google — veja nota abaixo)

# Criar o banco e aplicar todas as migrations
alembic upgrade head

# (Opcional) Popular o banco com dados de demonstração
# Cria 3 usuários com 30 dias de histórico para testar gráficos e nível sustentável
python seed_demo.py

# Iniciar o servidor
uvicorn src.main:app --reload --port 8000
```

Servidor rodando em: **http://localhost:8000**
Documentação interativa (Swagger): **http://localhost:8000/docs**

> **Nota — Senha de App do Gmail:**
> Não use sua senha normal do Google. Gere uma Senha de App em:
> `myaccount.google.com → Segurança → Verificação em 2 etapas → Senhas de app`
> O campo `EMAIL_SENHA_APP` deve conter os 16 caracteres gerados (com ou sem espaços).

---

## 3. Frontend (React Native + Expo)

Abra um **novo terminal** (deixe o backend rodando no anterior):

```bash
cd Consumo_react

# Instalar dependências
npm install

# Configurar qual backend usar
# Em src/services/api.js:
#   EM_PRODUCAO = false   → backend local (http://localhost:8000)
#   EM_PRODUCAO = true    → Railway em produção (padrão para apresentação)

# Iniciar o Expo
npx expo start
# ou, para qualquer rede (Wi-Fi diferente do PC):
npx expo start --tunnel
```

Ao iniciar, aparece um **QR Code** no terminal:

- **Android:** abra o app Expo Go e escaneie o QR Code
- **iOS:** use a câmera do iPhone para escanear
- **Navegador:** pressione `w` no terminal para abrir no Chrome/Firefox

---

## 4. Conectar celular ao backend local

Se usar `EM_PRODUCAO = false`, o celular precisa estar na **mesma rede Wi-Fi** que o PC.

Troque `localhost` pelo IP local do seu computador:

```javascript
// api.js
const DESENVOLVIMENTO_URL = "http://192.168.X.X:8000"; // seu IP local
```

Para descobrir seu IP: `ipconfig` (Windows) ou `ifconfig` (Linux/Mac).

> Alternativa mais simples: use `EM_PRODUCAO = true` e o Railway já está disponível em qualquer rede.

---

## 5. Gerar APK Android

```bash
cd Consumo_react

# Instalar EAS CLI (caso ainda não tenha)
npm install -g eas-cli

# Fazer login na conta Expo
eas login

# Gerar APK (perfil "preview" — arquivo .apk para instalar diretamente)
eas build --platform android --profile preview
```

O build é executado na nuvem. Em ~10-15 minutos, um link de download do APK é gerado.

Para gerar o AAB (Google Play Store), use:

```bash
eas build --platform android --profile production
```

---

## 6. Deploy no Railway (backend em produção)

O Railway está configurado para fazer **redeploy automático** a cada push na branch `main`.

O `Procfile` garante que as migrations são aplicadas antes do servidor iniciar:

```
web: alembic upgrade head && uvicorn src.main:app --host 0.0.0.0 --port $PORT
```

**Variáveis de ambiente no Railway:**

- Acesse: Railway Dashboard → seu serviço → aba **Variables**
- Adicione: `DATABASE_URL` (URL PostgreSQL do Railway), `EMAIL_REMETENTE`, `EMAIL_SENHA_APP`

---

## 7. Troubleshooting

| Problema                         | Causa provável                                     | Solução                                      |
| -------------------------------- | -------------------------------------------------- | -------------------------------------------- |
| `navigation error` no Expo Go    | Falta `react-native-gesture-handler` como 1ª linha | Verificar `index.js`                         |
| Backend retorna 500 ao registrar | Migration não aplicada                             | Rodar `alembic upgrade head`                 |
| Home mostra 0 L e 0 kWh          | `EM_PRODUCAO` errado ou Railway offline            | Verificar `api.js` e status do Railway       |
| E-mail de recuperação não chega  | `EMAIL_SENHA_APP` não configurado                  | Adicionar variável no Railway Dashboard      |
| Porta em uso                     | Processo anterior não encerrado                    | `npx kill-port 8000` ou reiniciar o terminal |
| `bcrypt version` warning         | Versão do bcrypt incompatível                      | Normal — não afeta funcionamento             |

---

## 8. Usuários Demo (seed_demo.py)

Após rodar `python seed_demo.py`:

| E-mail             | Senha   | Perfil                       |
| ------------------ | ------- | ---------------------------- |
| vitor@wavunder.app | demo123 | Consumo moderado             |
| ana@wavunder.app   | demo123 | Sustentável — nível Ótimo    |
| pedro@wavunder.app | demo123 | Consumo alto — nível Crítico |

Para resetar e repopular: `python seed_demo.py --reset`

---

## 9. Variáveis de Ambiente (.env)

```env
# ── Banco de dados ──────────────────────────────────────────────
# Local (SQLite — para desenvolvimento):
DATABASE_URL=sqlite:///banco.sqlite

# Produção (PostgreSQL Railway — copiar do painel do Railway):
# DATABASE_URL=postgresql://usuario:senha@host:porta/banco

# ── E-mail para recuperação de senha ────────────────────────────
# IMPORTANTE: Use Senha de App do Google, NÃO a senha normal!
# Como gerar: myaccount.google.com → Segurança → Senhas de app
EMAIL_REMETENTE=seu@gmail.com
EMAIL_SENHA_APP=xxxx xxxx xxxx xxxx
```

> O arquivo `.env` **nunca deve ser commitado** no Git. Use `.env.example` como referência.
