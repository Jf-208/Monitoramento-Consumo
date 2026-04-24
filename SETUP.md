# SETUP - Como Iniciar o Projeto em Outro Computador

Guia completo para configurar e rodar o projeto **Consumo** em qualquer computador.

---

## Pré-requisitos

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

## Passo 1: Clonar o Repositório

```bash
git clone https://github.com/seu-usuario/Consumo.git
cd Consumo
```

---

## 🔧 Passo 2: Configurar o Backend (FastAPI)

### 2.1 Navegar para a pasta do Backend e criar ambiente virtual

```bash
cd Backend_Api
python -m venv venv
```

### 2.2 Ativar ambiente virtual

```bash
# Windows (PowerShell):
.\venv\Scripts\Activate.ps1

# Mac/Linux:
source venv/bin/activate
```

Você saberá que está ativado quando ver `(venv)` no início da linha do terminal.

### 2.3 Instalar dependências e Configurar o Banco

```bash
# Instala as bibliotecas
pip install -r requirements.txt

# Crie o arquivo .env (copie do .env.example)
# Defina o seu DATABASE_URL

# Crie as tabelas no banco de dados usando o Alembic
alembic upgrade head
```

---

## Passo 3: Configurar o Frontend (React/Expo)

### 3.1 Navegar para a pasta do Frontend e instalar

```bash
cd ../Consumo_react
npm install
```

---

## Passo 4: Rodar o Projeto

### **Terminal 1 - Backend (FastAPI)**

```bash
cd Backend_Api

# Certifique-se que venv está ativado
# Windows: .\venv\Scripts\activate

# Rodar o servidor usando a nova estrutura
uvicorn src.main:app --reload
```

Você verá algo como:
`Uvicorn running on http://127.0.0.1:8000`

### **Terminal 2 - Frontend (Expo)**

```bash
cd Consumo_react
npx expo start
```

Isso abrirá o Expo Metro bundler. Você pode:
- Pressionar `w` para rodar no navegador
- Escanear o QR code com o app Expo no seu celular
- Pressionar `a` para rodar no emulador Android

---

## Acessar a Aplicação

- **Backend**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs (Swagger)

---

## Troubleshooting

### Erro: "ModuleNotFoundError: No module named 'src'"
Certifique-se de estar rodando o comando `uvicorn` de dentro da pasta raiz `Backend_Api` (e não dentro de `src`). O comando exato é `uvicorn src.main:app --reload`.

### Erro no Frontend: "Unable to resolve module"
Se trocou as pastas de lugar, limpe o cache do Expo:
```bash
npx expo start -c
```
