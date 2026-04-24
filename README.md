# 📊 Consumo - Monitoramento de Consumo de Energia e Água

Aplicação full-stack para monitoramento e análise de consumo de energia e água com frontend mobile (React/Expo) e backend API (FastAPI).

---

## 🎯 Estrutura do Projeto (Clean Architecture)

```
Consumo/
├── Backend_Api/          # API FastAPI (Python)
│   ├── src/              # Código-fonte do Backend
│   │   ├── database/     # Conexão com banco e configurações
│   │   ├── models/       # Modelos SQLAlchemy (Tabelas)
│   │   ├── schemas/      # Schemas Pydantic (Validação)
│   │   ├── routes/       # Rotas da API (v1)
│   │   ├── core/         # Lógica central (Segurança, Email, Config)
│   │   └── main.py       # Entrypoint (Servidor principal)
│   ├── alembic/          # Migrações do banco de dados
│   ├── .env.example      # Exemplo de variáveis de ambiente
│   └── requirements.txt  # Dependências Python
│
├── Consumo_react/        # App React/Expo (JavaScript)
│   ├── src/              # Código-fonte do Frontend
│   │   ├── components/   # Componentes reutilizáveis (basic, intermediate, layout)
│   │   ├── screens/      # Telas da aplicação (em inglês e modularizadas)
│   │   ├── services/     # Serviços (API, Auth)
│   │   ├── contexts/     # Context API
│   │   ├── navigations/  # Navegação (Stack e Tabs)
│   │   └── styles/       # Estilos globais
│   ├── jsconfig.json     # Configuração de Aliases
│   └── package.json      # Dependências Node.js
│
└── SETUP.md              # Guia de configuração para novos desenvolvedores
```

---

## 🚀 Quick Start

**Para iniciar em outro computador**, veja o guia completo:
→ [SETUP.md](./SETUP.md)

Resumo rápido:

```bash
# Clonar e entrar na pasta
git clone https://github.com/seu-usuario/Consumo.git
cd Consumo

# Backend (Terminal 1)
cd Backend_Api
python -m venv venv
.\venv\Scripts\activate  # Windows
pip install -r requirements.txt
alembic upgrade head    # Atualizar o banco de dados
uvicorn src.main:app --reload

# Frontend (Terminal 2)
cd ../Consumo_react
npm install
npx expo start
```

---

## 🛠️ Stack Tecnológico

### Backend
- **FastAPI** - Framework web moderno e de alta performance
- **SQLAlchemy & Alembic** - ORM e Versionamento de banco de dados
- **PostgreSQL / SQLite** - Banco de dados escalável
- **Pydantic** - Validação de dados

### Frontend
- **React Native & Expo** - Framework Mobile multiplataforma
- **React Navigation** - Navegação entre telas
- **Context API** - Gerenciamento de estado global

---

## 📖 Documentação

| Tópico                          | Arquivo                               |
| ------------------------------- | ------------------------------------- |
| **Como configurar em outro PC** | [SETUP.md](./SETUP.md)                |
| **Segurança e Git**             | Consulte `.gitignore`                 |
| **API Documentation**           | http://localhost:8000/docs (ao rodar) |

---

## 📱 Funcionalidades

- ✅ Autenticação de usuários (Login/Registro/Esqueci Senha)
- 📊 Gráficos de consumo (Energia e Água)
- 💡 Dicas de economia sustentável
- 📈 Relatórios e histórico de consumo
- 🔐 Segurança de dados com JWT e hashing (Bcrypt)

---

## ⚙️ Variáveis de Ambiente

Crie um arquivo `.env` na pasta `Backend_Api/` baseado no `.env.example`:

```env
DATABASE_URL=postgresql://user:password@host:port/db_name
SECRET_KEY=sua_chave_secreta_aqui
```

⚠️ **Nunca commite o `.env` original no Git!**

---

## 🔗 Endpoints Principais

| Método | Endpoint                  | Descrição           |
| ------ | ------------------------- | ------------------- |
| POST   | `/auth/login`             | Login de usuário    |
| POST   | `/auth/register`          | Registro de usuário |
| GET    | `/auth/reset-password`    | Resetar senha       |

Veja a documentação completa e interativa em: `http://localhost:8000/docs`

---

## 🤝 Contribuindo

1. Crie uma branch para sua feature: `git checkout -b feature/sua-feature`
2. Commit suas mudanças: `git commit -m 'feat: Add sua-feature'`
3. Push para a branch: `git push origin feature/sua-feature`
4. Abra um Pull Request

---

**Desenvolvido com ❤️** para monitoramento inteligente e sustentável de consumo.
