# 📊 Wavunder - Monitoramento Sustentável (Consumo)

Bem-vindo à documentação oficial do projeto **Wavunder** (anteriormente "Onda Sob" / Consumo). Este projeto é uma aplicação full-stack voltada para o monitoramento e análise de consumo de energia elétrica e água, visando a conscientização e a sustentabilidade.

---

## 📝 Visão Geral da Arquitetura

O projeto foi dividido em duas partes principais, seguindo o padrão de **Clean Architecture** e desacoplamento:
1. **Frontend**: Aplicativo Mobile desenvolvido em React Native utilizando o Expo.
2. **Backend**: API RESTful desenvolvida em Python utilizando FastAPI.
3. **Banco de Dados**: PostgreSQL hospedado na nuvem (Supabase).

---

## 📱 Frontend (React Native / Expo)

O frontend foi estruturado com base no **Atomic Design**, garantindo a reutilização de código e uma interface escalável. A pasta principal é a `Consumo_react/src/`.

### 📂 Principais Arquivos e Motivos:
* **`src/components/`**: Dividido em `basic` (ex: botões, inputs, chips), `intermediate` (ex: cartões de resumo que juntam básicos) e `layout` (ex: cabeçalhos e menus). **Motivo:** Evitar duplicação de código visual e padronizar o design do app.
* **`src/screens/`**: Telas completas da aplicação, como `Login`, `Register`, `Dashboard` e `ForgotPassword`. **Motivo:** Separar a lógica de navegação da lógica de componentes visuais.
* **`src/services/api.js`**: Arquivo responsável pela comunicação com o backend. **Motivo:** Centralizar todas as requisições HTTP (GET, POST, PUT) usando o `fetch` nativo do JavaScript. Isso facilita a troca entre o servidor local (`localhost:8000`) e o servidor de produção no Railway, alterando apenas a variável `BASE_URL`.
* **`src/contexts/ThemeContext.js`**: Gerenciador de estado global para o tema Claro/Escuro. **Motivo:** Permitir que o aplicativo inteiro saiba instantaneamente qual paleta de cores aplicar sem precisar repassar essa informação de tela em tela (prop drilling).
* **`src/navigations/`**: Configuração das rotas do app usando React Navigation (Telas de Stack e Abas/Tabs).

---

## ⚙️ Backend (Python / FastAPI)

A API do backend foi estruturada de forma modular, permitindo que a regra de negócios fique completamente separada do banco de dados e das rotas da web. Fica na pasta `Backend_Api/src/`.

### 📂 Principais Arquivos e Motivos:
* **`src/main.py`**: Ponto de entrada da aplicação. **Motivo:** É aqui que o servidor FastAPI é iniciado, onde configuramos o CORS (para o React conseguir fazer chamadas) e incluímos as rotas (routers).
* **`src/database/connection.py`**: **Motivo:** Cria a "ponte" (Engine e Session) entre o código Python e o banco de dados. Ele lê o `DATABASE_URL` do `.env` e decide se vai conectar no Supabase ou no SQLite local.
* **`src/models/models.py`**: **Motivo:** Utiliza o SQLAlchemy para mapear as classes Python (ex: `Usuario`) em tabelas reais do banco de dados relacional.
* **`src/schemas/`**: Arquivos Pydantic. **Motivo:** Validar os dados de entrada e saída. Eles garantem que se o Frontend não enviar um "email" válido, a API barra a requisição antes mesmo de tentar salvar no banco.
* **`src/core/security.py`**: **Motivo:** Proteger as senhas. Usa o `bcrypt` para criptografar as senhas no momento do cadastro e verificar o hash no momento do login.
* **`src/core/email_service.py`**: **Motivo:** Função dedicada a disparar e-mails de recuperação de senha usando o SMTP nativo do Python integrado ao Gmail. Ele gera um e-mail HTML estilizado com uma versão texto embutida (para evitar cair no Spam).
* **`src/routes/v1/auth_routes.py`**: Controladores de Autenticação. **Motivo:** Onde a mágica acontece. Recebe a requisição web (ex: POST `/auth/login`), pede para o banco de dados checar o usuário, pede para o `security.py` validar a senha e devolve a resposta final (JSON) para o React Native.

---

## 🗄️ Banco de Dados

* **Desenvolvimento Local:** SQLite (`banco.sqlite`). Utilizado quando não há conexão com a internet ou as variáveis `.env` não estão configuradas.
* **Produção:** **Supabase (PostgreSQL)**. Um banco de dados relacional poderoso hospedado na nuvem.
* **Migrações:** **Alembic** (`Backend_Api/alembic/`). **Motivo:** Ferramenta que rastreia alterações feitas em `models.py` e atualiza a estrutura do Supabase de forma segura, sem perder os dados dos usuários já cadastrados.

---

## 🚀 Deploy e Nuvem

O projeto foi configurado para ser totalmente hospedado na nuvem (Production-Ready).

* **Backend (FastAPI) -> Railway:** A API foi enviada para o serviço de hospedagem Railway. O arquivo `Procfile` na raiz diz ao servidor Linux do Railway exatamente qual comando executar para iniciar o projeto (`web: uvicorn src.main:app --host 0.0.0.0 --port $PORT`).
* **Banco de Dados -> Supabase:** Hospeda o PostgreSQL.
* **Como tudo se conecta na nuvem:** 
   1. O aplicativo React Native (Frontend) no celular do usuário envia a solicitação para o link público da API no Railway.
   2. O Railway processa a requisição, se conecta de forma segura ao Supabase no endereço `DATABASE_URL` para checar os dados, e pode até usar as credenciais do Gmail (`EMAIL_SENHA_APP`) para disparar e-mails.

---

## 🔑 Segurança e Boas Práticas

* **`.env` (Variáveis de Ambiente):** Senhas do banco de dados e do Gmail NUNCA são colocadas diretamente no código. Elas ficam no arquivo oculto `.env`, que não é enviado para o GitHub (está no `.gitignore`).
* **Senhas em Hash:** Se alguém invadir o banco de dados do Supabase, não verá as senhas dos usuários, apenas um código embaralhado pelo `bcrypt`.
* **Separação de Responsabilidades:** O React não conversa com o Banco de Dados diretamente. Ele precisa passar pelas rotas do FastAPI, que aplicam regras de segurança antes de prosseguir.

---

**Wavunder App — Monitoramento Sustentável**  
*Desenvolvido para apresentações acadêmicas e portfólio profissional.*
