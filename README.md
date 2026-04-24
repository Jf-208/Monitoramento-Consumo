# Wavunder - Monitoramento Sustentável (Consumo)

Bem-vindo à documentação oficial do projeto **Wavunder** (anteriormente "Onda Sob" / Consumo). Este projeto é uma aplicação full-stack voltada para o monitoramento e análise de consumo de energia elétrica e água, visando a conscientização e a sustentabilidade.

---

## Visão Geral da Arquitetura

O projeto foi dividido em duas partes principais, seguindo o padrão de **Clean Architecture** e desacoplamento:
1. **Frontend**: Aplicativo Mobile desenvolvido em React Native utilizando o Expo.
2. **Backend**: API RESTful desenvolvida em Python utilizando FastAPI.
3. **Banco de Dados**: PostgreSQL hospedado na nuvem (Supabase).

---

## Frontend (React Native / Expo)

O frontend foi estruturado com base no **Atomic Design**, garantindo a reutilização de código e uma interface escalável. A lógica e as telas da aplicação ficam concentradas na pasta `Consumo_react/src/`.

### Principais Pastas e Arquivos:

* **`src/components/` (Interface Visual)**
  * **`basic/`:** Componentes fundamentais que não podem ser divididos. Exemplos: `Chip.js` (rótulos visuais), botões padronizados e inputs. **Motivo:** Garantir que todos os botões e formulários do app tenham a mesma identidade visual, facilitando a manutenção em um único lugar.
  * **`intermediate/`:** Junção de componentes básicos. Exemplo: Cartões de consumo que juntam um ícone, um texto e um valor.
  * **`layout/`:** Estruturas maiores da interface. Exemplo: `FAB.js` (Botão Flutuante) e cabeçalhos.

* **`src/screens/` (Telas da Aplicação)**
  * **`Login` e `Register`:** Telas de autenticação inicial. Realizam a validação dos campos no celular antes de enviar qualquer requisição pesada para o servidor.
  * **`ForgotPassword`:** Tela de recuperação em duas etapas (envio de e-mail e validação de PIN), garantindo um fluxo seguro para troca de senha.
  * **`Water` e `Energy`:** Telas de painel de controle (Dashboard) que exibem o consumo do usuário em tempo real utilizando gráficos dinâmicos.
  * **`Tips` e `Privacy`:** Telas informativas para a educação do usuário sobre consumo sustentável e políticas do aplicativo.

* **`src/navigations/` (Controle de Rotas)**
  * **`AppNavigator.js`:** O cérebro da navegação. **Motivo:** Ele separa as rotas públicas (Login/Cadastro) das rotas privadas (Dashboard). Se o usuário não tem um token válido, ele nunca conseguirá acessar as telas de consumo.
  * **`MainTabs.js`:** Configuração do menu inferior (Bottom Tab Navigation). **Motivo:** Proporciona uma navegação fluida entre Água, Energia e Dicas sem recarregar a tela inteira.

* **`src/contexts/` (Gerenciamento de Estado Global)**
  * **`AuthContext.js`:** Gerencia as informações do usuário logado. **Motivo:** Evita a necessidade de buscar os dados do usuário no banco local toda vez que ele troca de tela, mantendo a sessão ativa na memória do app.
  * **`ThemeContext.js`:** Controla as cores do aplicativo (Tema Claro/Escuro). **Motivo:** Permite que todas as telas puxem as cores dinamicamente desse arquivo. Se o tema for alterado, o app inteiro muda as cores instantaneamente sem travamentos.

* **`src/services/api.js` (Comunicação com a Nuvem)**
  * Arquivo único para lidar com requisições HTTP utilizando o `fetch` nativo.
  * **Motivo:** Centraliza a configuração do servidor. Se precisarmos mudar o endereço da API do `localhost` para o Railway na nuvem, basta alterar a variável `BASE_URL` neste único arquivo. Além disso, padroniza a captura de erros para evitar fechamentos inesperados do app.

---

## Backend (Python / FastAPI)

A API do backend foi estruturada de forma modular, permitindo que a regra de negócios fique completamente separada do banco de dados e das rotas da web. Fica na pasta `Backend_Api/src/`.

### Principais Arquivos e Motivos:
* **`src/main.py`**: Ponto de entrada da aplicação. **Motivo:** É aqui que o servidor FastAPI é iniciado, onde configuramos o CORS (para o React conseguir fazer chamadas) e incluímos as rotas (routers).
* **`src/database/connection.py`**: **Motivo:** Cria a "ponte" (Engine e Session) entre o código Python e o banco de dados. Ele lê o `DATABASE_URL` do `.env` e decide se vai conectar no Supabase ou no SQLite local.
* **`src/models/models.py`**: **Motivo:** Utiliza o SQLAlchemy para mapear as classes Python (ex: `Usuario`) em tabelas reais do banco de dados relacional.
* **`src/schemas/`**: Arquivos Pydantic. **Motivo:** Validar os dados de entrada e saída. Eles garantem que se o Frontend não enviar um "email" válido, a API barra a requisição antes mesmo de tentar salvar no banco.
* **`src/core/security.py`**: **Motivo:** Proteger as senhas. Usa o `bcrypt` para criptografar as senhas no momento do cadastro e verificar o hash no momento do login.
* **`src/core/email_service.py`**: **Motivo:** Função dedicada a disparar e-mails de recuperação de senha usando o SMTP nativo do Python integrado ao Gmail. Ele gera um e-mail HTML estilizado com uma versão texto embutida (para evitar cair no Spam).
* **`src/routes/v1/auth_routes.py`**: Controladores de Autenticação. **Motivo:** Onde a mágica acontece. Recebe a requisição web (ex: POST `/auth/login`), pede para o banco de dados checar o usuário, pede para o `security.py` validar a senha e devolve a resposta final (JSON) para o React Native.

---

## Banco de Dados

* **Desenvolvimento Local:** SQLite (`banco.sqlite`). Utilizado quando não há conexão com a internet ou as variáveis `.env` não estão configuradas.
* **Produção:** **Supabase (PostgreSQL)**. Um banco de dados relacional poderoso hospedado na nuvem.
* **Migrações:** **Alembic** (`Backend_Api/alembic/`). **Motivo:** Ferramenta que rastreia alterações feitas em `models.py` e atualiza a estrutura do Supabase de forma segura, sem perder os dados dos usuários já cadastrados.

---

## Deploy e Nuvem

O projeto foi configurado para ser totalmente hospedado na nuvem (Production-Ready).

* **Backend (FastAPI) -> Railway:** A API foi enviada para o serviço de hospedagem Railway. O arquivo `Procfile` na raiz diz ao servidor Linux do Railway exatamente qual comando executar para iniciar o projeto (`web: uvicorn src.main:app --host 0.0.0.0 --port $PORT`).
* **Banco de Dados -> Supabase:** Hospeda o PostgreSQL.
* **Como tudo se conecta na nuvem:** 
   1. O aplicativo React Native (Frontend) no celular do usuário envia a solicitação para o link público da API no Railway.
   2. O Railway processa a requisição, se conecta de forma segura ao Supabase no endereço `DATABASE_URL` para checar os dados, e pode até usar as credenciais do Gmail (`EMAIL_SENHA_APP`) para disparar e-mails.

---

## Segurança e Boas Práticas

* **`.env` (Variáveis de Ambiente):** Senhas do banco de dados e do Gmail NUNCA são colocadas diretamente no código. Elas ficam no arquivo oculto `.env`, que não é enviado para o GitHub (está no `.gitignore`).
* **Senhas em Hash:** Se alguém invadir o banco de dados do Supabase, não verá as senhas dos usuários, apenas um código embaralhado pelo `bcrypt`.
* **Separação de Responsabilidades:** O React não conversa com o Banco de Dados diretamente. Ele precisa passar pelas rotas do FastAPI, que aplicam regras de segurança antes de prosseguir.

---

**Wavunder App — Monitoramento Sustentável**  
*Desenvolvido para apresentações acadêmicas e portfólio profissional.*
