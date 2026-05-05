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

## Como rodar em outro computador

### Backend
1. Clone o repositório
2. Entre na pasta `Backend_Api/`
3. Crie o ambiente virtual: `python -m venv venv`
4. Ative: Windows: `venv\Scripts\activate` | Mac/Linux: `source venv/bin/activate`
5. Instale dependências: `pip install -r requirements.txt`
6. Configure o `.env` com base no `.env.example` (DATABASE_URL, SECRET_KEY, etc.)
7. Rode as migrations: `alembic upgrade head`
8. Suba o servidor: `uvicorn src.main:app --reload`

### Frontend
1. Entre na pasta `Consumo_react/`
2. Instale dependências: `npm install`
3. Em `src/services/api.js`, configure `EM_PRODUCAO = false` para desenvolvimento local
4. Rode: `npx expo start`
5. Para web: pressione `w` no terminal ou acesse `http://localhost:8081`

### Banco de dados (Supabase/Railway)
- A string de conexão vai em `DATABASE_URL` no `.env`
- Após subir o backend pela primeira vez, rode `alembic upgrade head` para criar as tabelas
- O modelo `Consumo` tem CASCADE configurado: apagar usuário apaga todos os seus registros
