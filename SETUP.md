# SETUP - Como Iniciar o Projeto em Outro Computador

Guia completo para configurar e rodar o projeto **Consumo** em qualquer computador.

---

## 📋 Pré-requisitos

Certifique-se de que você tem instalado:

- **Python 3.10+** → [Download](https://www.python.org/downloads/)
- **Node.js 18+** → [Download](https://nodejs.org/)
- **Git** → [Download](https://git-scm.com/downloads)

### Verificar instalações:

```bash
python --version
node --version
npm --version
git --version
```

---

## 🔽 Passo 1: Clonar o Repositório

```bash
git clone https://github.com/seu-usuario/Consumo.git
cd Consumo
```

Substitua `seu-usuario` pela URL real do seu repositório no GitHub.

---

## 🔧 Passo 2: Configurar o Backend (FastAPI)

### 2.1 Navegar para a pasta do Backend

```bash
cd Backend_Api
```

### 2.2 Criar ambiente virtual

```bash
# Windows:
python -m venv venv

# Mac/Linux:
python3 -m venv venv
```

### 2.3 Ativar ambiente virtual

```bash
# Windows (PowerShell):
.\venv\Scripts\Activate.ps1

# Windows (CMD):
venv\Scripts\activate

# Mac/Linux:
source venv/bin/activate
```

Você saberá que está ativado quando ver `(venv)` no início da linha do terminal.

### 2.4 Instalar dependências

```bash
pip install -r requirements.txt
```

---

## 📱 Passo 3: Configurar o Frontend (React/Expo)

### 3.1 Navegar para a pasta do Frontend

```bash
cd ../Consumo_react
```

### 3.2 Instalar dependências

```bash
npm install
```

Se houver erro, tente:

```bash
npm cache clean --force
npm install
```

---

## ▶️ Passo 4: Rodar o Projeto

### **Terminal 1 - Backend (FastAPI)**

```bash
cd Backend_Api

# Certifique-se que venv está ativado
# Windows: .\venv\Scripts\activate
# Mac/Linux: source venv/bin/activate

# Rodar o servidor
python principal.py
```

Você verá algo como:

```
INFO:     Uvicorn running on http://127.0.0.1:8000
```

### **Terminal 2 - Frontend (Expo)**

```bash
cd Consumo_react
npm start
```

Isso abrirá o Expo Metro bundler. Você pode:

- Pressionar `w` para rodar no navegador
- Escanear o QR code com o app Expo no seu celular
- Pressionar `i` ou `a` para iOS/Android

---

## 🌐 Acessar a Aplicação

- **Backend**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs (Swagger)
- **Frontend**: http://localhost:8081 ou similar (informado no terminal)

---

## 📝 Notas Importantes

### Variáveis de Ambiente

Se houver arquivo `.env`, crie na raiz da pasta do Backend:

```
DATABASE_URL=sqlite:///./consumo.db
SECRET_KEY=sua_chave_secreta
```

### Porta do Backend

Se a porta 8000 estiver ocupada, altere em `Backend_Api/principal.py`:

```bash
python principal.py --port 8001
```

### Porta do Frontend

O Expo usa automaticamente a próxima porta disponível (8081, 8082, etc).

---

## 🆘 Troubleshooting

### Erro: "venv não encontrado"

Repita o Passo 2.2 e 2.3 corretamente.

### Erro: "ModuleNotFoundError" no Backend

Verifique se:

1. Seu venv está ativado (veja `(venv)` no terminal)
2. Rodou `pip install -r requirements.txt`

### Erro: "npm not found"

Reinstale Node.js: https://nodejs.org/

### Erro: Porta já em uso

```bash
# Encontrar o processo usando a porta 8000
# Windows: netstat -ano | findstr :8000
# Mac/Linux: lsof -i :8000

# Matar o processo e tentar novamente
```

---

## 📦 Atualizar Dependências

Se alguém adicionou novas dependências:

### Backend:

```bash
cd Backend_Api
pip install -r requirements.txt  # Reinstala com novas versões
```

### Frontend:

```bash
cd Consumo_react
npm install  # Reinstala com novas versões
```

---

## 🔄 Fluxo Completo (Resumido)

```bash
# 1. Clonar
git clone https://github.com/seu-usuario/Consumo.git
cd Consumo

# 2. Backend - Terminal 1
cd Backend_Api
python -m venv venv
.\venv\Scripts\activate  # Windows
pip install -r requirements.txt
python principal.py

# 3. Frontend - Terminal 2
cd ../Consumo_react
npm install
npm start
```

---

## 📞 Suporte

Se encontrar problemas:

1. Verifique se Python e Node.js estão instalados
2. Leia os erros com atenção no terminal
3. Garanta que ambas as dependências foram instaladas
4. Tente em um novo terminal limpo

---

**Pronto! Seu projeto está rodando!** 🎉
