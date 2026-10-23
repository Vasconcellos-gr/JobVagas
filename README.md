# 💼 JobVagas

> Plataforma centralizada para gestão de vagas e recrutamento, integrando candidatos e empresas em um único ecossistema web.

![NodeJS](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

---

## 📌 Visão Geral

O **JobVagas** é uma aplicação Full Stack com backend construído em **Node.js + Express** e persistência em **MongoDB**. O sistema disponibiliza painéis dedicados para candidatos e empresas gerenciarem todo o fluxo de oportunidades de trabalho, inscrições e triagem de perfis.

### 🎯 Principais Objetivos
- Facilitar a publicação, filtragem e busca de oportunidades de emprego.
- Oferecer uma área administrativa intuitiva para empresas gerenciarem inscrições.
- Disponibilizar espaço para candidatos cadastrarem currículo e monitorarem status de candidaturas.

---

## 🛠️ Tecnologias Utilizadas

- **Backend:** Node.js, Express.js
- **Banco de Dados:** MongoDB (com ODM Mongoose)
- **Frontend:** HTML5, CSS (Skeleton), JavaScript
- **Gerenciamento de Dependências:** npm
- **Testes:** Jest, Cypress

---

## 📁 Estrutura do Projeto

```text
JobVagas/
├── config/
│   └── DataBase.js              # Configuração e conexão com o MongoDB
├── cypress/                     # Ferramenta de Teste Cypress
├── frontend/                    # Interface web estática
│   ├── css/
|   |   ├── vendor/
|   |   |    ├── normalize.css   # Normalise css
|   |   |    └── skeleton.css    # Estilo Skeleton
|   |   ├── global.css           # Estilos globais
│   │   └── style.css            # Estilos paginação
│   ├── js/
│   │   ├── app.js               # Utilitários globais do cliente
│   │   ├── auth.js              # Lógica de login, cadastro e sessão
│   │   ├── candidato.js         # Interações do painel do candidato
│   │   ├── empresa.js           # Interações do painel da empresa
│   │   ├── perfil.js            # Visualização e edição de perfil
│   │   ├── tabs.js              # Controle de alternância de abas
│   │   └── vagas.js             # Renderização e filtros de vagas
│   ├── cadastro.html            # Cadastro inicial (candidato ou empresa)
│   ├── candidato.html           # Visualização de perfil
│   ├── candidaturas_empresa.html# Gestão de inscritos pela empresa
│   ├── curriculo.html           # Cadastro/edição de currículo
│   ├── empresa.html             # Perfil público da empresa
│   ├── home_candidato.html      # Dashboard do candidato
│   ├── home_empresa.html        # Dashboard da empresa
│   ├── index.html               # Landing page principal
│   ├── login.html               # Acesso ao sistema
│   ├── vaga_detalhes.html       # Visualização individual de vaga
│   └── vagas.html               # Catálogo público de vagas
├── servicos/                    # Camadas de domínio e regras de negócio
│   ├── candidatos/
│   │   ├── candidatosModel.js   # Model/Schema de candidatos
│   │   ├── candidatosSrc.js     # Regras de negócio e rotas de candidatos
│   │   └── server.js            # Rotas do Microserviço de candidatos
│   ├── candidaturas/
│   │   ├── candidaturasModel.js # Model/Schema de candidaturas
│   │   ├── candidaturasSrc.js   # Regras de negócio e validações
│   │   └── server.js            # Rotas do Microserviço de candidaturas
│   ├── empresas/
│   │   ├── empresasModel.js     # Model/Schema de empresas
│   │   ├── empresasSrs.js       # Regras de negócio e autenticação de empresas
│   │   └── server.js            # Rotas do Microserviço de empresas
│   └── vagas/
│       ├── vagasModel.js        # Model/Schema de vagas
│       ├── vagasSrc.js          # CRUD e filtros de vagas
│       └── server.js            # Rotas do Microserviço de vagas
├── testes/                      # Responsável pelos testes do Jest
├── .env                         # Variáveis de ambiente locais (não versionado)
├── .env_exemplo                 # Exemplo de configuração das variáveis
├── .gitignore                   # Arquivos ignorados pelo Git
├── package.json                 # Manifesto do projeto e dependências
├── package-lock.json            # Bloqueio de versões exatas
├── README.md                    # Documentação do projeto
└── server.js                    # Inicialização do servidor Express
```

---

### ⚡ Funcionalidades

### 🏢 Para Empresas
- Cadastro e autenticação via login.
- Painel para criação, edição e exclusão de vagas.
- Acompanhamento de candidatos inscritos por vaga.
- Atualização do status da candidatura (ex.: Em análise, Aprovado, Reprovado).

### 👤 Para Candidatos
- Cadastro individual e login na plataforma.
- Preenchimento e edição de dados curriculares.
- Busca e filtragem de vagas abertas.
- Envio de candidatura com proteção contra inscrições duplicadas na mesma vaga.
- Acompanhamento do status de cada processo seletivo inscrito.

---

### 🚀 Como Executar o Projeto

### Pré-requisitos
- [Node.js](https://nodejs.org/) (versão LTS recomendada)
- Instância local do [MongoDB](https://www.mongodb.com/) em execução ou conexão via MongoDB Atlas.
- Gerenciador de pacotes `npm`.

### Passo a Passo

1. **Clonar o repositório:**
   ```bash
   git clone https://github.com/Vasconcellos-gr/JobVagas.git
   cd JobVagas
   ```

2. **Instalar as dependências:**
   ```bash
   npm install
   ```

3. **Configurar as variáveis de ambiente:**
   Crie uma cópia do arquivo `.env_exemplo` nomeando-a como `.env`:
   ```bash
   cp .env_exemplo .env
   ```
   Abra o arquivo `.env` e preencha as configurações:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/jobvagas
   NODE_ENV=development
   ```

4. **Executar a aplicação:**
   ```bash
   npm start
   ```

5. **Acessar no navegador:**
   Abra [http://localhost:3000](http://localhost:3000) para visualizar a aplicação.

---

### 🔌 Endpoints da API

### 📋 Vagas (`/api/vagas`)
| Método | Endpoint | Descrição |
| :--- | :--- | :--- |
| `GET` | `/api/vagas` | Lista todas as vagas publicadas |
| `GET` | `/api/vagas/:id` | Retorna os detalhes de uma vaga específica |
| `POST` | `/api/vagas` | Cria uma nova oportunidade de vaga |
| `PUT` | `/api/vagas/:id` | Atualiza os dados de uma vaga |
| `DELETE` | `/api/vagas/:id` | Remove uma vaga |

### 🏢 Empresas (`/api/empresas`)
| Método | Endpoint | Descrição |
| :--- | :--- | :--- |
| `GET` | `/api/empresas` | Lista todas as empresas cadastradas |
| `GET` | `/api/empresas/:id` | Retorna o perfil de uma empresa |
| `POST` | `/api/empresas` | Cadastra uma nova empresa |
| `POST` | `/api/empresas/login` | Realiza autenticação da empresa |
| `PUT` | `/api/empresas/:id` | Atualiza os dados da empresa |
| `DELETE` | `/api/empresas/:id` | Remove uma conta de empresa |

### 👤 Candidatos (`/api/candidatos`)
| Método | Endpoint | Descrição |
| :--- | :--- | :--- |
| `GET` | `/api/candidatos` | Lista candidatos |
| `GET` | `/api/candidatos/:id` | Retorna o perfil de um candidato |
| `POST` | `/api/candidatos` | Registra um novo candidato |
| `POST` | `/api/candidatos/login` | Realiza autenticação do candidato |
| `PUT` | `/api/candidatos/:id` | Atualiza os dados/currículo do candidato |
| `DELETE` | `/api/candidatos/:id` | Remove a conta do candidato |

### 📑 Candidaturas (`/api/candidaturas`)
| Método | Endpoint | Descrição |
| :--- | :--- | :--- |
| `GET` | `/api/candidaturas` | Lista todas as candidaturas registradas |
| `GET` | `/api/candidaturas/:id` | Retorna detalhes de uma candidatura |
| `POST` | `/api/candidaturas` | Aplica o candidato a uma vaga |
| `PUT` | `/api/candidaturas/:id` | Atualiza dados gerais de uma candidatura |
| `PUT` | `/api/candidaturas/:id/status` | Altera o status do processo seletivo |
| `DELETE` | `/api/candidaturas/:id` | Cancela ou remove uma candidatura |

---

### 👥 Autores

Desenvolvido pelo time:

- **Gustavo** 
- **Davi**
- **João Vitor**

---
