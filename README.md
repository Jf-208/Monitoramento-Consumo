# 📊 Consumo - Monitoramento de Consumo de Energia e Água

Aplicação full-stack para monitoramento e análise de consumo de energia e água com frontend mobile (React/Expo) e backend API (FastAPI).

---

## 🎯 Estrutura do Projeto

```
Consumo/
├── Backend_Api/          # API FastAPI (Python)
│   ├── principal.py      # Servidor principal
│   ├── banco_de_dados.py # Configuração do banco
│   ├── requirements.txt   # Dependências Python
│   ├── esquemas/         # Schemas de validação
│   ├── modelos/          # Modelos de dados
│   ├── nucleo/           # Lógica central
│   └── rotas/            # Rotas da API
│
├── Consumo_react/        # App React/Expo (JavaScript)
│   ├── package.json      # Dependências Node.js
│   ├── principal.py      # Entrada principal
│   ├── src/              # Código-fonte
│   │   ├── components/   # Componentes reutilizáveis
│   │   ├── screens/      # Telas da aplicação
│   │   ├── services/     # Serviços (API, Auth)
│   │   ├── contexts/     # Context API
│   │   ├── navigations/  # Navegação
│   │   └── styles/       # Estilos globais
│   └── assets/           # Imagens e ícones
│
└── SETUP.md              # Guia de configuração
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
python principal.py

# Frontend (Terminal 2)
cd ../Consumo_react
npm install
npm start
```

---

## 🛠️ Stack Tecnológico

### Backend

- **FastAPI** - Framework web moderno
- **SQLAlchemy** - ORM para banco de dados
- **SQLite** - Banco de dados local
- **Pydantic** - Validação de dados

### Frontend

- **React** - Biblioteca UI
- **React Native** - Código multiplataforma
- **Expo** - Plataforma de desenvolvimento
- **React Navigation** - Navegação entre telas
- **Context API** - Gerenciamento de estado

---

## 📖 Documentação

| Tópico                          | Arquivo                               |
| ------------------------------- | ------------------------------------- |
| **Como configurar em outro PC** | [SETUP.md](./SETUP.md)                |
| **Segurança e Git**             | Consulte `.gitignore`                 |
| **API Documentation**           | http://localhost:8000/docs (ao rodar) |

---

## 📱 Funcionalidades

- ✅ Autenticação de usuários
- 📊 Gráficos de consumo (Energia e Água)
- 💡 Dicas de economia
- 📈 Relatórios de consumo
- 🔐 Segurança de dados

---

## ⚙️ Variáveis de Ambiente

Crie arquivo `.env` na pasta `Backend_Api/`:

```env
DATABASE_URL=sqlite:///./consumo.db
SECRET_KEY=sua_chave_secreta_aqui
DEBUG=False
```

⚠️ **Nunca commite `.env` no Git!** (já está em `.gitignore`)

---

## 🔗 Endpoints Principais

| Método | Endpoint                  | Descrição           |
| ------ | ------------------------- | ------------------- |
| POST   | `/api/v1/auth/login`      | Login de usuário    |
| POST   | `/api/v1/auth/register`   | Registro de usuário |
| GET    | `/api/v1/consumo/energia` | Dados de energia    |
| GET    | `/api/v1/consumo/agua`    | Dados de água       |

Veja documentação completa em: `http://localhost:8000/docs`

---

## 🤝 Contribuindo

1. Crie uma branch para sua feature: `git checkout -b feature/sua-feature`
2. Commit suas mudanças: `git commit -m 'Add sua-feature'`
3. Push para a branch: `git push origin feature/sua-feature`
4. Abra um Pull Request

---

## 📝 Licença

Este projeto é para fins educacionais e de demonstração.

---

## 📞 Dúvidas?

Consulte [SETUP.md](./SETUP.md) para troubleshooting detalhado.

---

**Desenvolvido com ❤️** para monitoramento inteligente de consumo.
