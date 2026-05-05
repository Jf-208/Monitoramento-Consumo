# Wavunder - Monitoramento Sustentável (Consumo)

Bem-vindo à documentação oficial do projeto **Wavunder** (anteriormente "Onda Sob" / Consumo). Este projeto é uma aplicação full-stack voltada para o monitoramento e análise de consumo de energia elétrica e água, visando a conscientização e a sustentabilidade.

---

## Funcionalidades

- **Dashboard (Home):** Consumo Mensal (últimos 30 dias) de água e energia com gasto em R$ por categoria
- **Registrar Consumo:** 3 abas — Água (com cálculo automático L/min), Energia (por aparelho ou customizado com nome), Outros Consumos (nome + valor em R$ + unidade opcional)
- **Relatórios:** Gráfico de barras semanal (Seg→Dom fixo) + gráfico de pizza normalizado em R$
- **Perfil:** Nível sustentável com emoji/ícone, card de gasto histórico colapsável, apagar conta
- **Edição de registros:** Cada registro do histórico pode ser editado (nome, valor, data) ou apagado individualmente
- **Suporte web:** DatePicker com fallback para `<input type="date">` nativo na web

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
  * **`basic/`:** Componentes fundamentais que nao podem ser divididos. Exemplos: `Chip.js` (rotulos visuais com indicadores coloridos).
  * **`intermediate/`:** Juncao de componentes basicos. Exemplo: `StatBar.js` (barra de progresso de consumo com label e valor).
  * **`layout/`:** Estruturas maiores da interface. `FAB.js` (Botao Flutuante de navegacao rapida), `BottomNav.js` (barra inferior), `ScreenScrollView.js` (wrapper de scroll cross-platform que resolve scroll no Android via `nestedScrollEnabled` e na Web via `overflow:auto` + `height:100vh`).

* **`src/screens/` (Telas da Aplicação)**
  * **`Login` e `Register`:** Telas de autenticação inicial. Realizam a validação dos campos no celular antes de enviar qualquer requisição pesada para o servidor.
  * **`ForgotPassword`:** Tela de recuperação em duas etapas (envio de e-mail e validação de PIN), garantindo um fluxo seguro para troca de senha.
  * **`Water` e `Energy`:** Telas de painel de controle (Dashboard) que exibem o consumo do usuário em tempo real utilizando gráficos dinâmicos.
  * **`Tips` e `Privacy`:** Telas informativas para a educação do usuário sobre consumo sustentável e políticas do aplicativo.

* **`src/navigations/` (Controle de Rotas)**
  * **`AppNavigator.js`:** O cérebro da navegação. **Motivo:** Ele separa as rotas públicas (Login/Cadastro) das rotas privadas (Dashboard). Se o usuário não tem um token válido, ele nunca conseguirá acessar as telas de consumo.
  * **`MainTabs.js`:** Configuração do menu inferior (Bottom Tab Navigation). **Motivo:** Proporciona uma navegação fluida entre Água, Energia e Dicas sem recarregar a tela inteira.

* **`src/contexts/` (Gerenciamento de Estado Global)**
  * **`AuthContext.js`:** Gerencia as informacoes do usuario logado. Mantem a sessao ativa na memoria do app sem buscar dados do banco toda vez que troca de tela.
  * **`ThemeContext.js`:** Controla as cores do aplicativo (Tema Claro/Escuro). Todas as telas puxam cores dinamicamente desse contexto.
  * **`ConsumptionContext.js`:** Gerencia dados de consumo (sliders de agua/energia), persiste valores no AsyncStorage e integra com o backend Railway para registro e busca de consumos reais.

* **`src/services/api.js` (Comunicacao com a Nuvem)**
  * Arquivo unico para lidar com requisicoes HTTP utilizando o `fetch` nativo.
  * Centraliza a configuracao do servidor. A variavel `BASE_URL` controla se a API aponta para localhost (desenvolvimento) ou Railway (producao).

* **`src/styles/screensStyles.js` (Estilos centralizados)**
  * Funcoes geradoras de estilo por tela (getHomeStyles, getAguaStyles, etc). Recebem o objeto `colors` do tema e retornam StyleSheet compativel.

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

## Compatibilidade Web (React Native Web)

O app funciona no navegador para apresentacao academica. Solucoes aplicadas:
* **`App.js`**: Injeta CSS global que forca `height:100%` e `background-color` nas divs do React Navigation.
* **`ScreenScrollView.js`**: Wrapper que aplica `overflow:auto` e `height:100vh` na web, resolvendo o scroll com mouse.
* **Telas de auth (Login/Register)**: Usam `Platform.select` com `height:100vh` para preencher a viewport.

---

**Wavunder App — Monitoramento Sustentavel**  
*Desenvolvido para apresentacoes academicas e portfolio profissional.*
